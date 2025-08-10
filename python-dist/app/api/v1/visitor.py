import json
import logging

from fastapi import APIRouter, Query
from tortoise.expressions import Q
from app.controllers.blog import blog_controller
from app.controllers.blog_video import blog_video_controller
from app.controllers.category import category_controller
from app.controllers.setting import setting_controller
from app.schemas.base import Fail, Success, SuccessExtra
from app.schemas.blog import *
from app.models.content import BlogVideo

from app.utils.logger import logger
from .blog import order_options

visitor_router = APIRouter()


@visitor_router.get("/order/list", summary="查看排序选项")
async def list_order():
    orders = [json.dumps(order) for order in order_options]
    return Success(data=orders)


@visitor_router.get("/blog/list", summary="查看内容列表")
async def list_blog(
    page: int = Query(1, description="页码"),
    page_size: int = Query(10, description="每页数量"),
    category: str = Query("", description="分类alias，用于获取某一分类的内容"),
    location: str = Query("", description="位置，用于获取某一位置的内容"),
):
    got_category_id = -1
    other_category_ids = []
    logger.info(f"Category: {category}")
    if category:
        got_category = await category_controller.model.filter(alias=category)
        other_category = await category_controller.model.filter(alias__not=category)
        if len(got_category) == 0:
            return Fail(msg="分类不存在")
        else:
            got_category_id = got_category[0].id
            other_category_ids = [category.id for category in other_category]

    # 获取图片博客
    base_q = Q()
    if got_category_id != -1:
        base_q &= Q(categories__id__in=[got_category_id])
    base_q &= Q(is_hidden=False)

    if location:
        # 方案1: 博客或其关联图片包含该location
        base_q &= Q(location__contains=location) | Q(
            images__location__contains=location
        )

    settings = await setting_controller.get(id=1)
    custom_option = settings.content.get("order_option", "meta_time_desc")
    order = []
    for t in order_options:
        if t["value"] == custom_option:
            order = [t["order"]]
            break

    # 获取图片博客数据
    total_blogs, blog_objs = await blog_controller.list(
        page=1,  # 先获取所有数据，后面统一分页
        page_size=1000,  # 设置一个较大的值
        search=base_q,
        order=order,
        prefetch_fields=["images"],
    )

    # 获取视频数据
    video_q = Q(is_hidden=False)
    if got_category_id != -1:
        video_q &= Q(blog__categories__id__in=[got_category_id])
    if location:
        video_q &= Q(location__contains=location)
    
    # 根据时间排序视频
    video_order = "-created_at"  # 默认按创建时间降序
    if order and order[0] == "time":
        video_order = "time"
    elif order and order[0] == "-time":
        video_order = "-time"
    elif order and order[0] == "created_at":
        video_order = "created_at"
    elif order and order[0] == "-created_at":
        video_order = "-created_at"
    elif order and order[0] == "updated_at":
        video_order = "updated_at"
    elif order and order[0] == "-updated_at":
        video_order = "-updated_at"
    
    videos = await BlogVideo.filter(video_q).prefetch_related('blog', 'blog__categories').order_by(video_order)

    # 处理图片博客数据
    valid_blogs = []
    for obj in blog_objs:
        blog_dict = await obj.to_dict(m2m=True)
        blog_dict["category_ids"] = [category["id"] for category in blog_dict["categories"]]
        blog_dict["content_type"] = "image"  # 标记为图片类型
        
        # 处理图片，过滤隐藏的图片
        visible_images = [img for img in obj.images if not img.is_hidden]
        if visible_images:
            blog_dict["images"] = [await img.to_dict() for img in visible_images]
            blog_dict["images"].sort(key=lambda x: x["order"])
            valid_blogs.append(blog_dict)

    # 处理视频数据，转换为类似博客的格式
    for video in videos:
        # 获取分类信息
        category_ids = []
        if video.blog and hasattr(video.blog, 'categories'):
            category_ids = [cat.id for cat in video.blog.categories]
        
        video_dict = {
            "id": f"video_{video.id}",  # 添加前缀避免与图片博客ID冲突
            "title": video.title,
            "desc": video.desc,
            "location": video.location,
            "time": video.time.isoformat() if video.time else video.created_at.isoformat(),
            "created_at": video.created_at.isoformat(),
            "updated_at": video.updated_at.isoformat(),
            "is_hidden": video.is_hidden,
            "category_ids": category_ids,
            "content_type": "video",  # 标记为视频类型
            "video_url": video.video_url,
            "video_type": video.video_type,
            "cover_url": video.cover_url,
            "duration": video.duration,
            "video_id": video.video_id,
            "images": [],  # 视频没有images数组，但为了兼容前端保留空数组
            "videos": [{
                "id": video.id,
                "video_url": video.video_url,
                "video_type": video.video_type,
                "cover_url": video.cover_url,
                "title": video.title,
                "desc": video.desc,
                "duration": video.duration,
                "video_id": video.video_id,
                "order": video.order,
                "time": video.time.isoformat() if video.time else None,
                "location": video.location,
                "is_hidden": video.is_hidden,
                "created_at": video.created_at.isoformat(),
                "updated_at": video.updated_at.isoformat()
            }]
        }
        valid_blogs.append(video_dict)

    # 统一排序所有内容（图片和视频）
    if order and len(order) > 0:
        if order[0] == "-time":
            valid_blogs.sort(key=lambda x: x.get("time", ""), reverse=True)
        elif order[0] == "time":
            valid_blogs.sort(key=lambda x: x.get("time", ""))
        elif order[0] == "-created_at":
            valid_blogs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        elif order[0] == "created_at":
            valid_blogs.sort(key=lambda x: x.get("created_at", ""))
        elif order[0] == "-updated_at":
            valid_blogs.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
        elif order[0] == "updated_at":
            valid_blogs.sort(key=lambda x: x.get("updated_at", ""))

    # 分页处理
    total = len(valid_blogs)
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_data = valid_blogs[start_index:end_index]

    return SuccessExtra(data=paginated_data, total=total, page=page, page_size=page_size)


@visitor_router.get("/category/get/alias", summary="查看分类")
async def get_category(
    alias: str = Query("", description="分类别名"),
):
    result = await category_controller.model.filter(alias=alias)
    if len(result) > 0:
        result = await result[0].to_dict()
        return Success(data=result)
    else:
        return Fail(msg=f"找不到别名为{alias}的分类")


@visitor_router.get("/category/list", summary="查看分类列表")
async def list_category(
    page: int = Query(1, description="页码"),
    page_size: int = Query(10, description="每页数量"),
):
    parent_categories = await category_controller.model.filter(parent_id=0).order_by(
        "order"
    )
    res_category = []
    for category in parent_categories:
        child_category = await category_controller.model.filter(
            parent_id=category.id
        ).order_by("order")
        category_dict = await category.to_dict()
        category_dict["children"] = [await obj.to_dict() for obj in child_category]
        res_category.append(category_dict)
    return SuccessExtra(
        data=res_category, total=len(res_category), page=page, page_size=page_size
    )
