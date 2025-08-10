import asyncio
import os
import sys

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tortoise import Tortoise
from app.models import Setting
from app.utils import DB_CONNECTION


async def migrate():
    """初始化存储设置的默认值"""
    print("开始初始化存储设置默认值...")

    try:
        # 连接到数据库
        await Tortoise.init(**DB_CONNECTION)
        
        # 获取或创建设置记录
        setting = await Setting.get_or_none(id=1)
        
        if not setting:
            print("设置记录不存在，创建新的设置记录...")
            # 创建完整的默认设置
            await Setting.create(
                general={},
                content={},
                meta={},
                storage=get_default_storage_settings(),
                database=get_default_database_settings()
            )
            print("设置记录创建完成")
        else:
            # 更新现有设置的存储配置
            storage = setting.storage or {}
            database = setting.database or {}
            
            # 获取默认存储设置
            default_storage = get_default_storage_settings()
            default_database = get_default_database_settings()
            
            # 补充缺失的存储设置字段
            updated = False
            for key, default_value in default_storage.items():
                if key not in storage:
                    storage[key] = default_value
                    updated = True
                    print(f"添加缺失的存储设置字段: {key} = {default_value}")
            
            # 补充缺失的数据库设置字段
            for key, default_value in default_database.items():
                if key not in database:
                    database[key] = default_value
                    updated = True
                    print(f"添加缺失的数据库设置字段: {key} = {default_value}")
            
            # 如果有更新，保存到数据库
            if updated:
                setting.storage = storage
                setting.database = database
                await setting.save()
                print("存储设置更新完成")
            else:
                print("存储设置已完整，无需更新")

        print("存储设置默认值初始化完成")

    except Exception as e:
        print(f"迁移过程中发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        raise e
    finally:
        await Tortoise.close_connections()


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
        "db_path": "/app/data/db.sqlite3",  # SQLite数据库路径
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
    asyncio.run(migrate())