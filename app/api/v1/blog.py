import logging
import os
from pathlib import Path
from urllib.parse import urlparse
import requests

from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import Response
from tortoise.expressions import Q
from app.controllers.blog import blog_controller
from app.controllers.blog_image import blog_image_controller
from app.controllers.blog_video import blog_video_controller
from app.controllers.category import category_controller
from app.controllers.setting import setting_controller
from app.utils.video_parser import video_parser
from app.core.dependency import DependPermisson
from app.models.content import Category
from app.schemas.base import Fail, Success, SuccessExtra
from app.schemas.blog import *

from app.utils.logger import logger

blog_router = APIRouter()
blog_public_router = APIRouter()  # 不需要权限的公共路由

order_options = [
    {"label": "图片时间-降序", "value": "meta_time_desc", "order": "-time"},
    {"label": "图片时间-升序", "value": "meta_time_asc", "order": "time"},
    {"label": "图片创建时间-降序", "value": "created_at_desc", "order": "-created_at"},
    {"label": "图片创建时间-升序", "value": "created_at_asc", "order": "created_at"},
    {"label": "图片更新时间-降序", "value": "updated_at_desc", "order": "-updated_at"},
    {"label": "图片更新时间-升序", "value": "updated_at_asc", "order": "updated_at"},
]


@blog_router.post("/list", summary="查看图片列表")
async def list_blog(query: BlogQuery):
    q = Q()
    if query.title:
        q &= Q(title__contains=query.title)
    if query.desc:
        q &= Q(desc__contains=query.desc)
    if query.location:
        q &= Q(location__contains=query.location)
    if len(query.categories) > 0:
        q &= Q(categories__in=query.categories)
    
    # 只查询有图片的博客记录
    q &= Q(images__isnull=False)
    
    order = []
    for t in order_options:
        if t["value"] == query.order_option:
            order = [t["order"]]
            break
    total, blog_objs = await blog_controller.list(
        page=query.page,
        page_size=query.page_size,
        search=q,
        order=order,
        prefetch_fields=["images"],
    )
    data = [await obj.to_dict_with_images(m2m=True) for obj in blog_objs]
    for blog in data:
        blog["category_ids"] = [item["id"] for item in blog["categories"]]
    return SuccessExtra(
        data=data, total=total, page=query.page, page_size=query.page_size
    )


@blog_router.get("/get", summary="查看图片")
async def get_blog(
    blog_id: int = Query(..., description="图片id"),
):
    result = await blog_controller.get(
        id=blog_id,
        prefetch_fields=["images"],
    )
    result = await result.to_dict_with_images(m2m=True)
    result["category_ids"] = [item["id"] for item in result["categories"]]
    return Success(data=result)


@blog_router.get("/count", summary="图片和分类数")
async def get_count():
    blog_count = len(await blog_controller.model.all())
    blogs = await blog_controller.model.all().prefetch_related("images")
    image_count = sum(len(blog.images) for blog in blogs)
    category_count = len(await category_controller.model.all())
    return Success(
        data={"blog": blog_count, "image": image_count, "category": category_count}
    )


@blog_router.get("/locations", summary="查看地点列表")
async def get_locations():
    results = await blog_controller.model.all().prefetch_related("images")
    locations = {}
    for blog in results:
        blog_locations = []
        if blog.location:
            blog_locations.append(blog.location)
        for image in blog.images:
            if image.location:
                blog_locations.append(image.location)
        for location in blog_locations:
            if locations.get(location, None) == None:
                locations[location] = 1
            else:
                locations[location] = locations[location] + 1
    locations = sorted(locations.items(), key=lambda d: d[1], reverse=True)
    return Success(data=locations)


@blog_router.post("/create", summary="创建图片", dependencies=[DependPermisson])
async def create_blog(
    blog_in: BlogCreate,
):
    # 补全父分类ID，避免遍历时修改原列表导致问题
    category_ids = set(blog_in.category_ids or [])
    for category_id in list(category_ids):
        category = await category_controller.model.filter(id=category_id).first()
        if (
            category
            and category.parent_id != 0
            and category.parent_id not in category_ids
        ):
            category_ids.add(category.parent_id)
    blog_in.category_ids = list(category_ids)

    new_blog = await blog_controller.create(obj_in=blog_in.create_dict())
    if not new_blog:
        return Fail(msg="博客创建失败")

    if blog_in.category_ids:
        categories = await Category.filter(id__in=blog_in.category_ids).all()
        await new_blog.categories.add(*categories)

    # 验证至少有图片或视频
    has_images = blog_in.images and len(blog_in.images) > 0
    has_videos = blog_in.videos and len(blog_in.videos) > 0
    
    if not has_images and not has_videos:
        return Fail(msg="至少需要添加一张图片或一个视频")
    
    # 创建图片
    if has_images:
        await blog_image_controller.create_for_blog(
            blog_id=new_blog.id, images=blog_in.images
        )
    
    # 创建视频
    if has_videos:
        await blog_video_controller.create_for_blog(
            blog_id=new_blog.id, videos=blog_in.videos
        )
    return Success(msg="Created Success")


@blog_router.post("/update", summary="更新图片", dependencies=[DependPermisson])
async def update_blog(
    blog_in: BlogUpdate,
):
    # 先补全父分类id，避免遍历时修改原列表导致问题
    category_ids = set(blog_in.category_ids or [])
    for category_id in list(category_ids):
        category = await category_controller.model.filter(id=category_id).first()
        if (
            category
            and category.parent_id != 0
            and category.parent_id not in category_ids
        ):
            category_ids.add(category.parent_id)
    blog_in.category_ids = list(category_ids)

    blog = await blog_controller.update(id=blog_in.id, obj_in=blog_in.update_dict())
    if not blog:
        return Fail(msg="博客不存在或更新失败")

    if blog_in.category_ids is not None:
        await blog.categories.clear()
        if len(blog_in.category_ids) > 0:
            categories = await Category.filter(id__in=blog_in.category_ids).all()
            await blog.categories.add(*categories)

    # 验证至少有图片或视频
    has_images = blog_in.images is not None and len(blog_in.images) > 0
    has_videos = blog_in.videos is not None and len(blog_in.videos) > 0
    
    if not has_images and not has_videos:
        return Fail(msg="至少需要保留一张图片或一个视频")
    
    # 更新图片
    if blog_in.images is not None:
        if not isinstance(blog_in.images, list):
            return Fail(msg="图片列表必须是一个列表")
        await blog_image_controller.update_for_blog(
            blog_id=blog.id, images=blog_in.images
        )
    
    # 更新视频
    if blog_in.videos is not None:
        if not isinstance(blog_in.videos, list):
            return Fail(msg="视频列表必须是一个列表")
        await blog_video_controller.update_for_blog(
            blog_id=blog.id, videos=blog_in.videos
        )
    
    return Success(msg="Updated Success")


@blog_router.delete("/delete", summary="删除图片", dependencies=[DependPermisson])
async def delete_blog(
    id: int = Query(..., description="图片id"),
):
    # 获取博客及其图片信息
    blog = await blog_controller.get(id=id, prefetch_fields=["images"])
    if not blog:
        return Fail(msg="博客不存在")
    
    # 获取存储设置
    storage_setting = (await setting_controller.get(id=1)).storage
    storage_type = storage_setting.get("storage_type", "local")
    
    # 如果是本地存储，删除本地文件
    if storage_type == "local":
        local_path = storage_setting.get("local_path", "images")
        local_prefix = storage_setting.get("local_prefix", "")
        
        for image in blog.images:
            try:
                # 解析图片URL获取文件路径
                image_url = image.image_url
                if image_url:
                    # 从URL中提取相对路径
                    parsed_url = urlparse(image_url)
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
                            continue  # 跳过无法解析的URL
                    
                    # 构建完整的本地文件路径
                    file_path = Path(relative_path)
                    
                    # 删除文件
                    if file_path.exists():
                        file_path.unlink()
                        logger.info(f"已删除本地文件: {file_path}")
                    else:
                        logger.warning(f"本地文件不存在: {file_path}")
                        
                # 同样处理缩略图
                thumbnail_url = image.thumbnail
                if thumbnail_url:
                    parsed_url = urlparse(thumbnail_url)
                    url_path = parsed_url.path
                    
                    if local_prefix and url_path.startswith(f"/{local_path}/"):
                        relative_path = url_path[1:]
                    elif url_path.startswith(f"/{local_path}/"):
                        relative_path = url_path[1:]
                    else:
                        path_parts = url_path.strip('/').split('/')
                        if local_path in path_parts:
                            local_path_index = path_parts.index(local_path)
                            relative_path = '/'.join(path_parts[local_path_index:])
                        else:
                            continue
                    
                    file_path = Path(relative_path)
                    if file_path.exists():
                        file_path.unlink()
                        logger.info(f"已删除本地缩略图: {file_path}")
                    else:
                        logger.warning(f"本地缩略图不存在: {file_path}")
                        
            except Exception as e:
                logger.error(f"删除本地文件时出错: {str(e)}")
                # 继续执行，不因为文件删除失败而中断整个删除过程
    
    # 删除数据库记录
    await blog_image_controller.update_for_blog(blog_id=id, images=[])
    await blog_video_controller.update_for_blog(blog_id=id, videos=[])
    await blog_controller.remove(id=id)
    return Success(msg="Deleted Success")


@blog_public_router.post("/parse-video", summary="解析视频链接")
async def parse_video_url(
    video_url: str = Query(..., description="视频链接")
):
    """解析视频链接，获取视频信息"""
    try:
        video_info = video_parser.parse_video_url(video_url)
        return Success(data=video_info)
    except Exception as e:
        logger.error(f"解析视频链接失败: {str(e)}")
        return Fail(msg=f"解析视频链接失败: {str(e)}")


@blog_public_router.get("/proxy-image", summary="代理获取图片")
async def proxy_image(
    url: str = Query(..., description="图片链接")
):
    """代理获取图片，解决跨域问题"""
    try:
        # 验证URL是否为允许的域名
        allowed_domains = ['i0.hdslb.com', 'i1.hdslb.com', 'i2.hdslb.com', 'img.youtube.com']
        parsed_url = urlparse(url)
        if parsed_url.netloc not in allowed_domains:
            raise HTTPException(status_code=400, detail="不允许的图片域名")
        
        # 设置请求头，模拟浏览器访问
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://www.bilibili.com/'
        }
        
        # 获取图片
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 返回图片内容
        return Response(
            content=response.content,
            media_type=response.headers.get('content-type', 'image/jpeg'),
            headers={
                'Cache-Control': 'public, max-age=86400',  # 缓存1天
                'Access-Control-Allow-Origin': '*'
            }
        )
    except requests.RequestException as e:
        logger.error(f"获取图片失败: {str(e)}")
        raise HTTPException(status_code=404, detail="图片获取失败")
    except Exception as e:
        logger.error(f"代理图片失败: {str(e)}")
        raise HTTPException(status_code=500, detail="服务器错误")
