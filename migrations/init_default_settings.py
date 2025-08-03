import asyncio
import os
import sys

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tortoise import Tortoise
from app.models import Setting
from app.utils import DB_CONNECTION


async def init_all_default_settings(standalone=True):
    """初始化所有设置的默认值，确保数据库设置与前端表单字段一致
    
    Args:
        standalone: 是否为独立运行模式，如果为False则不初始化数据库连接
    """
    print("开始检查和初始化所有设置默认值...")

    try:
        # 只在独立运行时连接到数据库
        if standalone:
            await Tortoise.init(**DB_CONNECTION)
        
        # 获取或创建设置记录
        setting = await Setting.get_or_none(id=1)
        
        if not setting:
            print("设置记录不存在，创建新的设置记录...")
            # 创建完整的默认设置
            await Setting.create(
                general=get_default_general_settings(),
                content=get_default_content_settings(),
                meta=get_default_meta_settings(),
                storage=get_default_storage_settings(),
                database=get_default_database_settings()
            )
            print("完整设置记录创建完成")
        else:
            # 更新现有设置，补充缺失字段
            updated = False
            
            # 更新通用设置
            general = setting.general or {}
            default_general = get_default_general_settings()
            for key, default_value in default_general.items():
                if key not in general:
                    general[key] = default_value
                    updated = True
                    print(f"添加缺失的通用设置字段: {key} = {default_value}")
            
            # 更新内容设置
            content = setting.content or {}
            default_content = get_default_content_settings()
            for key, default_value in default_content.items():
                if key not in content:
                    content[key] = default_value
                    updated = True
                    print(f"添加缺失的内容设置字段: {key} = {default_value}")
            
            # 更新网站设置
            meta = setting.meta or {}
            default_meta = get_default_meta_settings()
            for key, default_value in default_meta.items():
                if key not in meta:
                    meta[key] = default_value
                    updated = True
                    print(f"添加缺失的网站设置字段: {key} = {default_value}")
            
            # 更新存储设置
            storage = setting.storage or {}
            default_storage = get_default_storage_settings()
            for key, default_value in default_storage.items():
                if key not in storage:
                    storage[key] = default_value
                    updated = True
                    print(f"添加缺失的存储设置字段: {key} = {default_value}")
            
            # 更新数据库设置
            database = setting.database or {}
            default_database = get_default_database_settings()
            for key, default_value in default_database.items():
                if key not in database:
                    database[key] = default_value
                    updated = True
                    print(f"添加缺失的数据库设置字段: {key} = {default_value}")
            
            # 如果有更新，保存到数据库
            if updated:
                setting.general = general
                setting.content = content
                setting.meta = meta
                setting.storage = storage
                setting.database = database
                await setting.save()
                print("设置更新完成")
            else:
                print("所有设置已完整，无需更新")

        print("所有设置默认值检查和初始化完成")

    except Exception as e:
        print(f"初始化过程中发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        raise e
    finally:
        # 只在独立运行时关闭数据库连接
        if standalone:
            await Tortoise.close_connections()


def get_default_general_settings():
    """获取默认通用设置"""
    return {
        # 可以根据需要添加通用设置字段
    }


def get_default_content_settings():
    """获取默认内容设置"""
    return {
        "page_size": 24,  # 每页显示数量
        "thumbnail_suffix": "",  # 缩略图后缀
        "detail_suffix": "",  # 详情图后缀
        "thumbnail_show_location": False,  # 缩略图显示位置
        "detail_show_location": False,  # 详情显示位置
        "thumbnail_show_time": True,  # 缩略图显示时间
        "thumbnail_time_format": "YYYY-MM-DD",  # 缩略图时间格式
        "detail_show_time": False,  # 详情显示时间
        "detail_time_format": ""  # 详情时间格式
    }


def get_default_meta_settings():
    """获取默认网站设置"""
    return {
        "hero_images": [
            {
                "url": "/assets/Cover/1.jpg",
                "title": "欢迎来到时光工作室",
                "description": "记录生活中的美好瞬间"
            },
            {
                "url": "/assets/Cover/2.jpg",
                "title": "摄影作品集",
                "description": "用镜头捕捉世界的精彩"
            },
            {
                "url": "/assets/Cover/3.jpg",
                "title": "创意无限",
                "description": "探索视觉艺术的无限可能"
            },
            {
                "url": "/assets/Cover/4.jpg",
                "title": "精彩瞬间",
                "description": "捕捉生活中的每一个精彩时刻"
            },
            {
                "url": "/assets/Cover/5.jpg",
                "title": "美好回忆",
                "description": "珍藏那些值得纪念的美好时光"
            }
        ],
        "site_name": "时光工作室",  # 网站名称
        "site_title": "时光工作室",  # 网站标题
        "site_desc": "记录生活中的美好瞬间",  # 网站描述
        "site_url": "",  # 网站URL
        "site_keywords": "",  # 网站关键词
        "primary_color": "#1890ff",  # 主色调
        "site_splitter": " - ",  # 标题分隔符
        "site_icon": "",  # 网站图标
        "site_apple_icon": "",  # Apple图标
        "bottom_icon": "",  # 底部图标
        "bottom_desc": "",  # 底部描述
        "icp": "",  # ICP备案号
        "hero_autoplay": True,  # 轮播自动播放
        "hero_interval": 5000,  # 轮播间隔时间
        "hero_show_indicators": True,  # 显示指示器
        "hero_show_controls": True,  # 显示控制按钮
        "entries": []  # 入口链接
    }


def get_default_storage_settings():
    """获取默认存储设置"""
    return {
        # 基础设置
        "enable_storage": True,  # 启用存储
        "storage_type": "local",  # 存储类型：local 或 cloud
        "max_size": 32.0,  # 最大文件大小（MB）
        
        # 本地存储设置
        "local_path": "images",  # 本地存储路径
        "local_prefix": "",  # 本地存储URL前缀（空则使用程序运行地址）
        
        # 云端存储设置
        "timeout_time": 30,  # 超时时间（秒）
        "endpoint": "",  # 端点URL
        "region": "",  # 区域
        "access_id": "",  # 访问密钥ID
        "secret_key": "",  # 访问密钥
        "bucket": "",  # 存储桶名称
        "path": "",  # 存储路径
        "prefix": "",  # 文件名前缀
        "suffix": "",  # 文件名后缀
    }


def get_default_database_settings():
    """获取默认数据库设置"""
    return {
        "db_type": "sqlite",  # 数据库类型
        "db_path": "/Library/Github/Memory/data/db.sqlite3",  # SQLite数据库路径
        "host": "",  # 数据库主机
        "port": 5432,  # 数据库端口
        "database": "",  # 数据库名称
        "username": "",  # 用户名
        "password": "",  # 密码
        "ssl": True,  # 是否使用SSL
        "pool_size": 10,  # 连接池大小
        "timeout": 30  # 连接超时时间（秒）
    }


if __name__ == "__main__":
    asyncio.run(init_all_default_settings(standalone=True))