import asyncio
import os
import sys
import secrets
import sqlite3
from datetime import datetime, timezone

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tortoise import Tortoise, connections
from tortoise.exceptions import OperationalError
from tortoise.transactions import in_transaction
from app.models import *
from app.utils import DB_CONNECTION


async def migrate():
    """执行完整的数据库迁移和初始化"""
    print("开始数据库迁移和初始化...")

    try:
        # 1. 连接到数据库
        await Tortoise.init(**DB_CONNECTION)
        conn = connections.get("default")

        # 2. 创建所有表结构
        print("创建表结构...")
        await Tortoise.generate_schemas(safe=True)
        print("表结构创建完成")

        # 3. 创建API Token表（如果不存在）
        await _create_api_token_table(conn)

        # 4. 确保blog_video表存在
        await _create_blog_video_table(conn)

        # 5. 初始化默认设置
        await _init_default_settings()

        # 6. 为现有用户创建默认API Token
        await _create_default_tokens()

        print("数据库迁移和初始化完成")

    except Exception as e:
        print(f"迁移过程中发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        raise e
    finally:
        await Tortoise.close_connections()


async def _create_api_token_table(conn):
    """创建API Token表"""
    try:
        # 检查表是否已存在
        result = await conn.execute_query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='api_token'"
        )
        
        if len(result[1]) > 0:
            print("api_token 表已存在，跳过创建")
            return

        print("创建 api_token 表...")
        
        # 创建表
        await conn.execute_query("""
            CREATE TABLE IF NOT EXISTS "api_token" (
                "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "name" VARCHAR(100) NOT NULL,
                "token" VARCHAR(255) NOT NULL UNIQUE,
                "is_permanent" INT NOT NULL DEFAULT 0,
                "expires_at" TIMESTAMP,
                "is_active" INT NOT NULL DEFAULT 1,
                "last_used" TIMESTAMP,
                "user_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
                "remark" TEXT
            )
        """)
        
        # 创建索引
        index_sqls = [
            "CREATE INDEX IF NOT EXISTS idx_api_token_token ON api_token (token)",
            "CREATE INDEX IF NOT EXISTS idx_api_token_user_id ON api_token (user_id)",
            "CREATE INDEX IF NOT EXISTS idx_api_token_is_active ON api_token (is_active)",
            "CREATE INDEX IF NOT EXISTS idx_api_token_expires_at ON api_token (expires_at)"
        ]
        
        for sql in index_sqls:
            await conn.execute_query(sql)
        
        print("api_token 表创建成功")
        
    except Exception as e:
        print(f"创建 api_token 表失败: {str(e)}")
        raise


async def _create_blog_video_table(conn):
    """创建blog_video表"""
    try:
        # 检查表是否已存在
        result = await conn.execute_query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='blog_video'"
        )
        
        if len(result[1]) > 0:
            print("blog_video 表已存在，跳过创建")
            return

        print("创建 blog_video 表...")
        
        # 创建表
        await conn.execute_query("""
            CREATE TABLE IF NOT EXISTS "blog_video" (
                "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "video_url" TEXT NOT NULL,
                "video_type" VARCHAR(20) NOT NULL DEFAULT 'direct',
                "cover_url" TEXT,
                "title" VARCHAR(100),
                "desc" TEXT,
                "location" TEXT,
                "time" TIMESTAMP,
                "is_hidden" INT NOT NULL DEFAULT 0,
                "metadata" JSON,
                "order" INT NOT NULL DEFAULT 0,
                "video_id" VARCHAR(50),
                "duration" INT,
                "blog_id" INT NOT NULL REFERENCES "blog" ("id") ON DELETE CASCADE
            )
        """)
        
        # 创建索引
        index_sqls = [
            "CREATE INDEX IF NOT EXISTS idx_blog_video_blog_id ON blog_video (blog_id)",
            "CREATE INDEX IF NOT EXISTS idx_blog_video_is_hidden ON blog_video (is_hidden)",
            "CREATE INDEX IF NOT EXISTS idx_blog_video_order ON blog_video (\"order\")"
        ]
        
        for sql in index_sqls:
            await conn.execute_query(sql)
        
        print("blog_video 表创建成功")
        
    except Exception as e:
        print(f"创建 blog_video 表失败: {str(e)}")
        raise


async def _init_default_settings():
    """初始化默认设置"""
    try:
        # 检查设置表是否存在数据
        setting_count = await Setting.all().count()
        
        if setting_count == 0:
            print("设置表为空，创建默认设置...")
            # 创建默认设置
            await Setting.create(
                general={},
                content={
                    "page_size": 24,
                    "thumbnail_suffix": "",
                    "detail_suffix": "",
                    "thumbnail_show_location": False,
                    "detail_show_location": False,
                    "thumbnail_show_time": True,
                    "thumbnail_time_format": "YYYY-MM-DD",
                    "detail_show_time": False,
                    "detail_time_format": ""
                },
                storage={},
                meta={
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
                    "site_title": "时光工作室",
                    "site_desc": "记录生活中的美好瞬间"
                }
            )
            print("默认设置创建完成")
        else:
            # 检查现有设置是否完整
            setting = await Setting.get(id=1)
            updated = False
            
            # 检查并补充content字段
            content = setting.content or {}
            default_content = {
                "page_size": 24,
                "thumbnail_suffix": "",
                "detail_suffix": "",
                "thumbnail_show_location": False,
                "detail_show_location": False,
                "thumbnail_show_time": True,
                "thumbnail_time_format": "YYYY-MM-DD",
                "detail_show_time": False,
                "detail_time_format": ""
            }
            
            for key, default_value in default_content.items():
                if key not in content:
                    content[key] = default_value
                    updated = True
                    print(f"添加缺失的content字段: {key} = {default_value}")
            
            # 检查并补充meta字段
            meta = setting.meta or {}
            if "hero_images" not in meta:
                meta["hero_images"] = [
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
                ]
                updated = True
                print("添加默认封面图配置")
            
            if "site_title" not in meta:
                meta["site_title"] = "时光工作室"
                updated = True
            if "site_desc" not in meta:
                meta["site_desc"] = "记录生活中的美好瞬间"
                updated = True
            
            if updated:
                setting.content = content
                setting.meta = meta
                await setting.save()
                print("设置配置已更新")
            else:
                print("设置配置已完整，无需更新")
                
    except Exception as e:
        print(f"初始化默认设置失败: {str(e)}")
        raise


async def _create_default_tokens():
    """为现有用户创建默认API Token"""
    try:
        print("为现有用户创建默认API Token...")
        
        # 获取所有用户
        users = await User.all()
        
        for user in users:
            # 检查用户是否已有默认token
            existing_token = await ApiToken.filter(user=user, name="默认Token").first()
            
            if not existing_token:
                # 生成随机token
                token_value = secrets.token_urlsafe(32)
                
                # 创建默认token
                await ApiToken.create(
                    name="默认Token",
                    token=token_value,
                    user=user,
                    is_permanent=True,
                    is_active=True,
                    remark="系统自动生成的默认API Token"
                )
                print(f"为用户 {user.username} 创建默认token")
            else:
                print(f"用户 {user.username} 已有默认token，跳过")
                
    except Exception as e:
        print(f"创建默认API Token失败: {str(e)}")
        raise


if __name__ == "__main__":
    asyncio.run(migrate())
