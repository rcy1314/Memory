from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.dependency import DependApiTokenAuth, DependPermisson
from app.controllers.batch_controller import BatchController
from app.schemas.base import Fail, SuccessExtra
from app.schemas.blog import BlogCreate, BlogUpdate, BlogImageCreate, BlogVideoCreate
from app.utils.logger import logger
from app.core.ctx import CTX_USER_ID

batch_router = APIRouter()
batch_controller = BatchController()


class BatchCreateRequest(BaseModel):
    """批量创建请求"""
    blogs: List[BlogCreate]
    

class BatchUpdateRequest(BaseModel):
    """批量更新请求"""
    blog_ids: List[int]
    update_data: BlogUpdate
    

class BatchDeleteRequest(BaseModel):
    """批量删除请求"""
    blog_ids: List[int]
    

class BatchImageUploadRequest(BaseModel):
    """批量图片上传请求"""
    images: List[BlogImageCreate]
    blog_id: Optional[int] = None  # 如果指定blog_id，则添加到现有博客；否则创建新博客
    blog_data: Optional[BlogCreate] = None  # 创建新博客时的数据
    

class BatchVideoUploadRequest(BaseModel):
    """批量视频上传请求"""
    videos: List[BlogVideoCreate]
    blog_id: Optional[int] = None
    blog_data: Optional[BlogCreate] = None


@batch_router.post("/blogs/create", summary="批量创建博客")
async def batch_create_blogs(
    blogs_data: List[Dict[str, Any]],
    _: None = DependPermisson
) -> SuccessExtra:
    """批量创建博客"""
    try:
        user_id = CTX_USER_ID.get()
        result = await batch_controller.batch_create_blogs(blogs_data, user_id)
        return SuccessExtra(data=result, total=result["success_count"])
        
    except Exception as e:
        logger.error(f"批量创建博客失败: {str(e)}")
        return Fail(msg=f"批量创建博客失败: {str(e)}")


@batch_router.put("/blogs/update", summary="批量更新博客")
async def batch_update_blogs(
    updates_data: List[Dict[str, Any]],
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """批量更新博客"""
    try:
        result = await batch_controller.batch_update_blogs(updates_data)
        return SuccessExtra(data=result, total=result["success_count"])
        
    except Exception as e:
        logger.error(f"批量更新博客失败: {str(e)}")
        return Fail(msg=f"批量更新博客失败: {str(e)}")


@batch_router.delete("/blogs/delete", summary="批量删除博客")
async def batch_delete_blogs(
    blog_ids: List[int],
    _: None = DependPermisson
) -> SuccessExtra:
    """批量删除博客"""
    try:
        result = await batch_controller.batch_delete_blogs(blog_ids)
        return SuccessExtra(data=result, total=result["success_count"])
        
    except Exception as e:
        logger.error(f"批量删除博客失败: {str(e)}")
        return Fail(msg=f"批量删除博客失败: {str(e)}")


@batch_router.post("/images/upload", summary="批量上传图片")
async def batch_upload_images(
    blog_id: int,
    images_data: List[Dict[str, Any]],
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """批量上传图片到指定博客"""
    try:
        result = await batch_controller.batch_upload_images(blog_id, images_data)
        return SuccessExtra(data=result, total=result["success_count"])
        
    except Exception as e:
        logger.error(f"批量上传图片失败: {str(e)}")
        return Fail(msg=f"批量上传图片失败: {str(e)}")


@batch_router.post("/videos/upload", summary="批量上传视频")
async def batch_upload_videos(
    blog_id: int,
    videos_data: List[Dict[str, Any]],
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """批量上传视频到指定博客"""
    try:
        result = await batch_controller.batch_upload_videos(blog_id, videos_data)
        return SuccessExtra(data=result, total=result["success_count"])
        
    except Exception as e:
        logger.error(f"批量上传视频失败: {str(e)}")
        return Fail(msg=f"批量上传视频失败: {str(e)}")


@batch_router.post("/blogs/search", summary="批量搜索博客")
async def batch_search_blogs(
    queries: List[str],
    limit_per_query: int = 10,
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """批量搜索博客"""
    try:
        result = await batch_controller.batch_search_blogs(queries, limit_per_query)
        return SuccessExtra(data=result, total=result["total_results"])
        
    except Exception as e:
        logger.error(f"批量搜索博客失败: {str(e)}")
        return Fail(msg=f"批量搜索博客失败: {str(e)}")