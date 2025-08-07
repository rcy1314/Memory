import logging
from typing import List, Optional

from fastapi import APIRouter, Query, HTTPException
from tortoise.expressions import Q
from app.controllers.blog_video import blog_video_controller
from app.controllers.category import category_controller
from app.utils.video_parser import video_parser
from app.core.dependency import DependPermisson
from app.schemas.base import Fail, Success, SuccessExtra
from app.schemas.blog import *
from app.models.content import BlogVideo

from app.utils.logger import logger

video_router = APIRouter()


@video_router.get("/list", summary="获取视频列表")
async def list_videos(
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页数量"),
    title: Optional[str] = Query(None, description="标题搜索"),
    video_type: Optional[str] = Query(None, description="视频类型")
):
    """获取视频列表"""
    try:
        q = Q()
        if title:
            q &= Q(title__contains=title)
        if video_type:
            q &= Q(video_type=video_type)
        
        # 计算偏移量
        offset = (page - 1) * page_size
        
        # 查询视频列表，预加载blog和分类关系
        videos = await BlogVideo.filter(q).prefetch_related('blog', 'blog__categories').offset(offset).limit(page_size).order_by('-created_at')
        total = await BlogVideo.filter(q).count()
        
        # 转换为字典格式
        video_list = []
        for video in videos:
            # 获取分类信息
            category_ids = []
            if video.blog and hasattr(video.blog, 'categories'):
                category_ids = [cat.id for cat in video.blog.categories]
            
            video_dict = {
                "id": video.id,
                "video_url": video.video_url,
                "video_type": video.video_type,
                "cover_url": video.cover_url,
                "title": video.title,
                "desc": video.desc,
                "location": video.location,
                "time": video.time.isoformat() if video.time else None,
                "is_hidden": video.is_hidden,
                "order": video.order,
                "video_id": video.video_id,
                "duration": video.duration,
                "created_at": video.created_at.isoformat() if video.created_at else None,
                "updated_at": video.updated_at.isoformat() if video.updated_at else None,
                "blog_id": video.blog_id,
                "category_ids": category_ids
            }
            video_list.append(video_dict)
        
        return Success(data={
            "list": video_list,
            "total": total,
            "page": page,
            "page_size": page_size
        })
    except Exception as e:
        logger.error(f"获取视频列表失败: {str(e)}")
        return Fail(msg=f"获取视频列表失败: {str(e)}")


@video_router.get("/get", summary="获取单个视频")
async def get_video(
    video_id: int = Query(..., description="视频ID")
):
    """获取单个视频详情"""
    try:
        video = await BlogVideo.get_or_none(id=video_id).prefetch_related('blog')
        if not video:
            return Fail(msg="视频不存在")
        
        video_dict = {
            "id": video.id,
            "video_url": video.video_url,
            "video_type": video.video_type,
            "cover_url": video.cover_url,
            "title": video.title,
            "desc": video.desc,
            "location": video.location,
            "time": video.time.isoformat() if video.time else None,
            "is_hidden": video.is_hidden,
            "order": video.order,
            "video_id": video.video_id,
            "duration": video.duration,
            "created_at": video.created_at.isoformat() if video.created_at else None,
            "updated_at": video.updated_at.isoformat() if video.updated_at else None,
            "blog_id": video.blog_id
        }
        
        return Success(data=video_dict)
    except Exception as e:
        logger.error(f"获取视频失败: {str(e)}")
        return Fail(msg=f"获取视频失败: {str(e)}")


@video_router.post("/create", summary="创建视频", dependencies=[DependPermisson])
async def create_video(
    video_in: BlogVideoCreate
):
    """创建新视频"""
    try:
        from app.models.content import Blog
        from app.controllers.blog import blog_controller
        
        # 创建一个默认的博客来关联视频
        default_blog_data = {
            "title": video_in.title or "视频博客",
            "desc": video_in.desc or "视频内容",
            "location": video_in.location or "",
            "time": video_in.time,
            "is_hidden": video_in.is_hidden
        }
        
        # 创建博客
        blog = await blog_controller.create(obj_in=default_blog_data)
        
        # 如果有分类，添加分类关联
        if video_in.category_ids:
            from app.models.content import Category
            categories = await Category.filter(id__in=video_in.category_ids)
            await blog.categories.add(*categories)
        
        # 创建视频记录，关联到新创建的博客
        video_data = video_in.model_dump()
        video_data["blog_id"] = blog.id
        
        video = await blog_video_controller.create(obj_in=video_data)
        
        video_dict = {
            "id": video.id,
            "video_url": video.video_url,
            "video_type": video.video_type,
            "cover_url": video.cover_url,
            "title": video.title,
            "desc": video.desc,
            "location": video.location,
            "time": video.time.isoformat() if video.time else None,
            "is_hidden": video.is_hidden,
            "order": video.order,
            "video_id": video.video_id,
            "duration": video.duration,
            "created_at": video.created_at.isoformat() if video.created_at else None,
            "updated_at": video.updated_at.isoformat() if video.updated_at else None,
            "blog_id": video.blog_id,
            "category_ids": video_in.category_ids or []
        }
        
        return Success(data=video_dict, msg="视频创建成功")
    except Exception as e:
        logger.error(f"创建视频失败: {str(e)}")
        return Fail(msg=f"创建视频失败: {str(e)}")


@video_router.post("/update", summary="更新视频", dependencies=[DependPermisson])
async def update_video(
    video_in: BlogVideoUpdate
):
    """更新视频信息"""
    try:
        video_id = video_in.id
        if not video_id:
            return Fail(msg="视频ID不能为空")
        
        # 检查视频是否存在
        existing_video = await BlogVideo.get_or_none(id=video_id)
        if not existing_video:
            return Fail(msg="视频不存在")
        
        # 更新视频
        update_data = video_in.model_dump(exclude={"id"})
        video = await blog_video_controller.update(id=video_id, obj_in=update_data)
        
        # 更新分类关联
        if hasattr(video_in, 'category_ids') and video_in.category_ids is not None:
            from app.models.content import Category
            # 获取关联的blog
            blog = await video.blog
            if blog:
                # 清除现有分类关联
                await blog.categories.clear()
                # 添加新的分类关联
                if video_in.category_ids:
                    categories = await Category.filter(id__in=video_in.category_ids)
                    await blog.categories.add(*categories)
        
        # 重新获取视频信息，包含分类
        updated_video = await BlogVideo.filter(id=video_id).prefetch_related('blog', 'blog__categories').first()
        
        # 获取分类信息
        category_ids = []
        if updated_video.blog and hasattr(updated_video.blog, 'categories'):
            category_ids = [cat.id for cat in updated_video.blog.categories]
        
        video_dict = {
            "id": updated_video.id,
            "video_url": updated_video.video_url,
            "video_type": updated_video.video_type,
            "cover_url": updated_video.cover_url,
            "title": updated_video.title,
            "desc": updated_video.desc,
            "location": updated_video.location,
            "time": updated_video.time.isoformat() if updated_video.time else None,
            "is_hidden": updated_video.is_hidden,
            "order": updated_video.order,
            "video_id": updated_video.video_id,
            "duration": updated_video.duration,
            "created_at": updated_video.created_at.isoformat() if updated_video.created_at else None,
            "updated_at": updated_video.updated_at.isoformat() if updated_video.updated_at else None,
            "blog_id": updated_video.blog_id,
            "category_ids": category_ids
        }
        
        return Success(data=video_dict, msg="视频更新成功")
    except Exception as e:
        logger.error(f"更新视频失败: {str(e)}")
        return Fail(msg=f"更新视频失败: {str(e)}")


@video_router.delete("/delete", summary="删除视频", dependencies=[DependPermisson])
async def delete_video(
    video_id: int = Query(..., description="视频ID")
):
    """删除视频"""
    try:
        # 检查视频是否存在
        video = await BlogVideo.get_or_none(id=video_id)
        if not video:
            return Fail(msg="视频不存在")
        
        # 删除视频
        await blog_video_controller.remove(id=video_id)
        
        return Success(msg="视频删除成功")
    except Exception as e:
        logger.error(f"删除视频失败: {str(e)}")
        return Fail(msg=f"删除视频失败: {str(e)}")


@video_router.post("/parse-video", summary="解析视频链接", dependencies=[DependPermisson])
async def parse_video_url(
    video_url: str = Query(..., description="视频链接")
):
    """解析视频链接，获取视频信息"""
    logger.info(f"=== 收到视频解析请求 ===")
    logger.info(f"请求的视频链接: {video_url}")
    logger.info(f"视频链接类型: {type(video_url)}")
    logger.info(f"视频链接长度: {len(video_url) if video_url else 0}")
    
    try:
        logger.info(f"开始调用video_parser.parse_video_url...")
        video_info = video_parser.parse_video_url(video_url)
        logger.info(f"视频解析成功，返回数据: {video_info}")
        return Success(data=video_info)
    except Exception as e:
        logger.error(f"解析视频链接失败: {str(e)}")
        logger.error(f"异常类型: {type(e)}")
        import traceback
        logger.error(f"异常堆栈: {traceback.format_exc()}")
        return Fail(msg=f"解析视频链接失败: {str(e)}")