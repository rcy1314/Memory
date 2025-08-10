from typing import List, Optional, Dict, Any, Union
import os
from pathlib import Path
from urllib.parse import urlparse

from app.core.crud import CRUDBase
from app.models.content import BlogImage
from app.schemas.blog import BlogImageCreate, BlogImageUpdate
from app.controllers.setting import setting_controller
from app.utils.logger import logger


class BlogImageController(CRUDBase[BlogImage, BlogImageCreate, BlogImageUpdate]):
    def __init__(self):
        super().__init__(model=BlogImage)

    async def create_for_blog(
        self, blog_id: int, images: List[Union[BlogImageCreate, Dict[str, Any]]]
    ):
        """为博客创建多张图片"""
        result = []
        for image in images:
            if isinstance(image, dict):
                image_data = image
            else:
                image_data = image.model_dump()

            image_data["blog_id"] = blog_id
            new_image = await self.create(obj_in=image_data)
            result.append(new_image)
        return result

    async def update_for_blog(
        self, blog_id: int, images: List[Union[BlogImageUpdate, Dict[str, Any]]]
    ):
        """更新博客的图片"""
        current_images = await self.model.filter(blog_id=blog_id)
        current_ids = {img.id: img for img in current_images}

        update_ids = []
        result = []

        for image in images:
            if isinstance(image, dict):
                image_data = image
                image_id = image_data.get("id")
            else:
                image_data = image.model_dump()
                image_id = image_data.get("id")

            if image_id and image_id in current_ids:
                # 更新现有图片
                update_ids.append(image_id)
                await self.update(
                    id=image_id,
                    obj_in={k: v for k, v in image_data.items() if k != "id"},
                )
                result.append(await self.get(id=image_id))
            else:
                # 创建新图片
                image_data["blog_id"] = blog_id
                if "id" in image_data:
                    del image_data["id"]
                new_image = await self.create(obj_in=image_data)
                result.append(new_image)

        # 删除不再需要的图片
        delete_ids = [
            img_id for img_id in current_ids.keys() if img_id not in update_ids
        ]
        if delete_ids:
            # 获取要删除的图片信息，用于删除本地文件
            images_to_delete = [current_ids[img_id] for img_id in delete_ids]
            
            # 获取存储设置
            try:
                storage_setting = (await setting_controller.get(id=1)).storage
                storage_type = storage_setting.get("storage_type", "local")
                
                # 如果是本地存储，删除本地文件
                if storage_type == "local":
                    local_path = storage_setting.get("local_path", "images")
                    local_prefix = storage_setting.get("local_prefix", "")
                    
                    for image in images_to_delete:
                        try:
                            # 删除主图片文件
                            if image.image_url:
                                await self._delete_local_file(image.image_url, local_path, local_prefix)
                            
                            # 删除缩略图文件
                            if image.thumbnail:
                                await self._delete_local_file(image.thumbnail, local_path, local_prefix)
                                
                        except Exception as e:
                            logger.error(f"删除本地文件时出错: {str(e)}")
                            # 继续执行，不因为文件删除失败而中断整个删除过程
                            
            except Exception as e:
                logger.error(f"获取存储设置时出错: {str(e)}")
            
            # 删除数据库记录
            await self.model.filter(id__in=delete_ids).delete()

        return result

    async def _delete_local_file(self, file_url: str, local_path: str, local_prefix: str):
        """删除本地文件的辅助方法"""
        try:
            # 解析图片URL获取文件路径
            parsed_url = urlparse(file_url)
            url_path = parsed_url.path
            
            # 如果URL包含本地路径前缀，提取相对路径
            if local_prefix and url_path.startswith(f"/{local_path}/"):
                relative_path = url_path[1:]  # 去掉开头的 /
            elif url_path.startswith(f"/{local_path}/"):
                relative_path = url_path[1:]  # 去掉开头的 /
            else:
                # 尝试从URL路径中提取文件路径
                path_parts = url_path.strip('/').split('/')
                if local_path in path_parts:
                    local_path_index = path_parts.index(local_path)
                    relative_path = '/'.join(path_parts[local_path_index:])
                else:
                    return  # 跳过无法解析的URL
            
            # 构建完整的本地文件路径
            file_path = Path(relative_path)
            
            # 删除文件
            if file_path.exists():
                file_path.unlink()
                logger.info(f"已删除本地文件: {file_path}")
            else:
                logger.warning(f"本地文件不存在: {file_path}")
                
        except Exception as e:
            logger.error(f"删除本地文件时出错: {str(e)}")
            raise e


blog_image_controller = BlogImageController()
