from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
from tortoise.transactions import in_transaction
from tortoise.expressions import Q

from app.models.content import Blog, Category
from app.controllers.blog import blog_controller
from app.controllers.blog_image import BlogImageController
from app.controllers.blog_video import BlogVideoController
from app.utils.logger import logger


class BatchController:
    """批量操作控制器"""
    
    def __init__(self):
        self.blog_image_controller = BlogImageController()
        self.blog_video_controller = BlogVideoController()
    
    async def batch_create_blogs(self, blogs_data: List[Dict[str, Any]], user_id: int) -> Dict[str, Any]:
        """批量创建博客"""
        created_blogs = []
        failed_blogs = []
        
        try:
            async with in_transaction():
                for i, blog_data in enumerate(blogs_data):
                    try:
                        # 验证必需字段
                        if not blog_data.get('title'):
                            failed_blogs.append({
                                'index': i,
                                'error': '标题不能为空',
                                'data': blog_data
                            })
                            continue
                        
                        # 设置默认值
                        blog_data.setdefault('content', '')
                        blog_data.setdefault('summary', '')
                        blog_data.setdefault('is_draft', False)
                        blog_data.setdefault('user_id', user_id)
                        
                        # 处理分类
                        if 'category_name' in blog_data:
                            category_name = blog_data.pop('category_name')
                            category = await Category.filter(name=category_name).first()
                            if category:
                                blog_data['category_id'] = category.id
                        
                        # 创建博客
                        blog = await Blog.create(**blog_data)
                        
                        # 处理图片
                        if 'images' in blog_data:
                            images_data = blog_data['images']
                            if images_data:
                                await self.blog_image_controller.batch_create_images(
                                    blog.id, images_data
                                )
                        
                        # 处理视频
                        if 'videos' in blog_data:
                            videos_data = blog_data['videos']
                            if videos_data:
                                await self.blog_video_controller.batch_create_videos(
                                    blog.id, videos_data
                                )
                        
                        created_blogs.append({
                            'index': i,
                            'blog_id': blog.id,
                            'title': blog.title
                        })
                        
                        logger.info(f"批量创建博客成功: {blog.title} (ID: {blog.id})")
                        
                    except Exception as e:
                        logger.error(f"批量创建博客失败 (索引 {i}): {str(e)}")
                        failed_blogs.append({
                            'index': i,
                            'error': str(e),
                            'data': blog_data
                        })
            
            return {
                'success_count': len(created_blogs),
                'failed_count': len(failed_blogs),
                'created_blogs': created_blogs,
                'failed_blogs': failed_blogs
            }
            
        except Exception as e:
            logger.error(f"批量创建博客事务失败: {str(e)}")
            raise
    
    async def batch_update_blogs(self, updates_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """批量更新博客"""
        updated_blogs = []
        failed_blogs = []
        
        try:
            async with in_transaction():
                for i, update_data in enumerate(updates_data):
                    try:
                        blog_id = update_data.get('id')
                        if not blog_id:
                            failed_blogs.append({
                                'index': i,
                                'error': '博客ID不能为空',
                                'data': update_data
                            })
                            continue
                        
                        blog = await Blog.filter(id=blog_id).first()
                        if not blog:
                            failed_blogs.append({
                                'index': i,
                                'error': f'博客不存在: {blog_id}',
                                'data': update_data
                            })
                            continue
                        
                        # 处理分类更新
                        if 'category_name' in update_data:
                            category_name = update_data.pop('category_name')
                            category = await Category.filter(name=category_name).first()
                            if category:
                                update_data['category_id'] = category.id
                        
                        # 移除不能更新的字段
                        update_fields = {k: v for k, v in update_data.items() 
                                       if k not in ['id', 'created_at', 'images', 'videos']}
                        
                        if update_fields:
                            await Blog.filter(id=blog_id).update(**update_fields)
                        
                        # 处理图片更新
                        if 'images' in update_data:
                            images_data = update_data['images']
                            await self.blog_image_controller.update_blog_images(
                                blog_id, images_data
                            )
                        
                        # 处理视频更新
                        if 'videos' in update_data:
                            videos_data = update_data['videos']
                            await self.blog_video_controller.update_blog_videos(
                                blog_id, videos_data
                            )
                        
                        updated_blogs.append({
                            'index': i,
                            'blog_id': blog_id,
                            'title': blog.title
                        })
                        
                        logger.info(f"批量更新博客成功: {blog.title} (ID: {blog_id})")
                        
                    except Exception as e:
                        logger.error(f"批量更新博客失败 (索引 {i}): {str(e)}")
                        failed_blogs.append({
                            'index': i,
                            'error': str(e),
                            'data': update_data
                        })
            
            return {
                'success_count': len(updated_blogs),
                'failed_count': len(failed_blogs),
                'updated_blogs': updated_blogs,
                'failed_blogs': failed_blogs
            }
            
        except Exception as e:
            logger.error(f"批量更新博客事务失败: {str(e)}")
            raise
    
    async def batch_delete_blogs(self, blog_ids: List[int]) -> Dict[str, Any]:
        """批量删除博客"""
        deleted_blogs = []
        failed_blogs = []
        
        try:
            async with in_transaction():
                for i, blog_id in enumerate(blog_ids):
                    try:
                        blog = await Blog.filter(id=blog_id).first()
                        if not blog:
                            failed_blogs.append({
                                'index': i,
                                'blog_id': blog_id,
                                'error': f'博客不存在: {blog_id}'
                            })
                            continue
                        
                        # 删除关联的图片和视频
                        await self.blog_image_controller.delete_blog_images(blog_id)
                        await self.blog_video_controller.delete_blog_videos(blog_id)
                        
                        # 删除博客
                        await Blog.filter(id=blog_id).delete()
                        
                        deleted_blogs.append({
                            'index': i,
                            'blog_id': blog_id,
                            'title': blog.title
                        })
                        
                        logger.info(f"批量删除博客成功: {blog.title} (ID: {blog_id})")
                        
                    except Exception as e:
                        logger.error(f"批量删除博客失败 (ID {blog_id}): {str(e)}")
                        failed_blogs.append({
                            'index': i,
                            'blog_id': blog_id,
                            'error': str(e)
                        })
            
            return {
                'success_count': len(deleted_blogs),
                'failed_count': len(failed_blogs),
                'deleted_blogs': deleted_blogs,
                'failed_blogs': failed_blogs
            }
            
        except Exception as e:
            logger.error(f"批量删除博客事务失败: {str(e)}")
            raise
    
    async def batch_upload_images(self, blog_id: int, images_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """批量上传图片"""
        try:
            # 验证博客是否存在
            blog = await Blog.filter(id=blog_id).first()
            if not blog:
                raise ValueError(f"博客不存在: {blog_id}")
            
            result = await self.blog_image_controller.batch_create_images(
                blog_id, images_data
            )
            
            logger.info(f"批量上传图片完成: 博客ID {blog_id}, 成功 {result.get('success_count', 0)} 张")
            return result
            
        except Exception as e:
            logger.error(f"批量上传图片失败: {str(e)}")
            raise
    
    async def batch_upload_videos(self, blog_id: int, videos_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """批量上传视频"""
        try:
            # 验证博客是否存在
            blog = await Blog.filter(id=blog_id).first()
            if not blog:
                raise ValueError(f"博客不存在: {blog_id}")
            
            result = await self.blog_video_controller.batch_create_videos(
                blog_id, videos_data
            )
            
            logger.info(f"批量上传视频完成: 博客ID {blog_id}, 成功 {result.get('success_count', 0)} 个")
            return result
            
        except Exception as e:
            logger.error(f"批量上传视频失败: {str(e)}")
            raise
    
    async def batch_search_blogs(
        self, 
        query: str, 
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """批量搜索博客"""
        try:
            # 构建查询条件
            queryset = Blog.all()
            
            # 文本搜索
            if query:
                queryset = queryset.filter(
                    Q(title__icontains=query) | 
                    Q(content__icontains=query) | 
                    Q(summary__icontains=query)
                )
            
            # 应用过滤器
            if filters:
                if 'category_id' in filters:
                    queryset = queryset.filter(category_id=filters['category_id'])
                
                if 'is_draft' in filters:
                    queryset = queryset.filter(is_draft=filters['is_draft'])
                
                if 'user_id' in filters:
                    queryset = queryset.filter(user_id=filters['user_id'])
                
                if 'date_from' in filters:
                    queryset = queryset.filter(created_at__gte=filters['date_from'])
                
                if 'date_to' in filters:
                    queryset = queryset.filter(created_at__lte=filters['date_to'])
            
            # 获取总数
            total = await queryset.count()
            
            # 分页查询
            blogs = await queryset.offset(offset).limit(limit).prefetch_related(
                'category', 'user', 'images', 'videos'
            )
            
            # 格式化结果
            results = []
            for blog in blogs:
                blog_data = {
                    'id': blog.id,
                    'title': blog.title,
                    'summary': blog.summary,
                    'content': blog.content[:200] + '...' if len(blog.content) > 200 else blog.content,
                    'is_draft': blog.is_draft,
                    'created_at': blog.created_at.isoformat(),
                    'updated_at': blog.updated_at.isoformat(),
                    'category': blog.category.name if blog.category else None,
                    'user_id': blog.user_id,
                    'images_count': len(blog.images) if blog.images else 0,
                    'videos_count': len(blog.videos) if blog.videos else 0
                }
                results.append(blog_data)
            
            return {
                'total': total,
                'count': len(results),
                'results': results,
                'query': query,
                'filters': filters,
                'pagination': {
                    'limit': limit,
                    'offset': offset,
                    'has_next': offset + limit < total,
                    'has_prev': offset > 0
                }
            }
            
        except Exception as e:
            logger.error(f"批量搜索博客失败: {str(e)}")
            raise
    
    async def get_batch_operation_status(self, operation_id: str) -> Dict[str, Any]:
        """获取批量操作状态（预留接口）"""
        # 这里可以实现异步批量操作的状态跟踪
        # 目前返回基本信息
        return {
            'operation_id': operation_id,
            'status': 'completed',
            'message': '批量操作已完成'
        }


# 全局批量控制器实例
batch_controller = BatchController()