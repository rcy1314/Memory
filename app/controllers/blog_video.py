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

blog_video_controller = BlogVideoController()