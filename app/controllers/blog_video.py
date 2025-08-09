from typing import List, Optional, Dict, Any, Tuple, Union

from app.core.crud import CRUDBase
from app.models.content import BlogVideo
from app.schemas.blog import BlogVideoCreate, BlogVideoUpdate
from app.utils.logger import logger


class BlogVideoController(CRUDBase[BlogVideo, BlogVideoCreate, BlogVideoUpdate]):
    def __init__(self):
        super().__init__(model=BlogVideo)

    async def create_for_blog(
        self, blog_id: int, videos: List[Union[BlogVideoCreate, Dict[str, Any]]]
    ):
        """为博客创建多个视频"""
        result = []
        for video in videos:
            if isinstance(video, dict):
                video_data = video
            else:
                video_data = video.model_dump()

            video_data["blog_id"] = blog_id
            new_video = await self.create(obj_in=video_data)
            result.append(new_video)
        return result

    async def update_for_blog(
        self, blog_id: int, videos: List[Union[BlogVideoUpdate, Dict[str, Any]]]
    ):
        """更新博客的视频"""
        current_videos = await self.model.filter(blog_id=blog_id)
        current_ids = {video.id: video for video in current_videos}

        update_ids = []
        result = []

        for video in videos:
            if isinstance(video, dict):
                video_data = video
                video_id = video_data.get("id")
            else:
                video_data = video.model_dump()
                video_id = video_data.get("id")

            if video_id and video_id in current_ids:
                # 更新现有视频
                update_ids.append(video_id)
                await self.update(
                    id=video_id,
                    obj_in={k: v for k, v in video_data.items() if k != "id"},
                )
                result.append(await self.get(id=video_id))
            else:
                # 创建新视频
                video_data["blog_id"] = blog_id
                if "id" in video_data:
                    del video_data["id"]
                new_video = await self.create(obj_in=video_data)
                result.append(new_video)

        # 删除不再需要的视频
        delete_ids = [
            video_id for video_id in current_ids.keys() if video_id not in update_ids
        ]
        if delete_ids:
            # 删除数据库记录
            await self.model.filter(id__in=delete_ids).delete()
            logger.info(f"已删除视频记录: {delete_ids}")

        return result

    async def batch_create_videos(self, blog_id: int, videos_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """批量创建视频"""
        created_videos = []
        failed_videos = []
        
        try:
            for i, video_data in enumerate(videos_data):
                try:
                    # 设置博客ID
                    video_data["blog_id"] = blog_id
                    
                    # 创建视频
                    new_video = await self.create(obj_in=video_data)
                    created_videos.append({
                        'index': i,
                        'video_id': new_video.id,
                        'title': new_video.title or '无标题'
                    })
                    
                    logger.info(f"批量创建视频成功: {new_video.title or '无标题'} (ID: {new_video.id})")
                    
                except Exception as e:
                    logger.error(f"批量创建视频失败 (索引 {i}): {str(e)}")
                    failed_videos.append({
                        'index': i,
                        'error': str(e),
                        'data': video_data
                    })
            
            return {
                'success_count': len(created_videos),
                'failed_count': len(failed_videos),
                'created_videos': created_videos,
                'failed_videos': failed_videos
            }
            
        except Exception as e:
            logger.error(f"批量创建视频失败: {str(e)}")
            raise

    async def update_blog_videos(self, blog_id: int, videos_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """更新博客的视频"""
        try:
            # 使用现有的update_for_blog方法
            result = await self.update_for_blog(blog_id, videos_data)
            return {
                'success_count': len(result),
                'failed_count': 0,
                'updated_videos': result,
                'failed_videos': []
            }
        except Exception as e:
            logger.error(f"更新博客视频失败: {str(e)}")
            raise

    async def delete_blog_videos(self, blog_id: int) -> Dict[str, Any]:
        """删除博客的所有视频"""
        try:
            # 获取要删除的视频
            videos = await self.model.filter(blog_id=blog_id).all()
            video_count = len(videos)
            
            # 删除视频
            await self.model.filter(blog_id=blog_id).delete()
            
            logger.info(f"删除博客视频成功: 博客ID {blog_id}, 删除 {video_count} 个视频")
            return {
                'success_count': video_count,
                'failed_count': 0
            }
        except Exception as e:
            logger.error(f"删除博客视频失败: {str(e)}")
            raise

blog_video_controller = BlogVideoController()