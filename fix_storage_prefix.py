#!/usr/bin/env python3
"""
修复存储设置中的URL前缀问题
将local_prefix设置为正确的端口9999
"""

import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from tortoise import Tortoise
from app.models import Setting
from app.utils.config import settings

async def fix_storage_prefix():
    """修复存储设置中的URL前缀"""
    print("开始修复存储设置中的URL前缀...")
    
    try:
        # 连接到数据库
        await Tortoise.init(
            db_url=f"sqlite:///{settings.DATA_DIR}/db.sqlite3",
            modules={"models": ["app.models"]}
        )
        
        # 获取设置记录
        setting = await Setting.get_or_none(id=1)
        
        if not setting:
            print("错误：找不到设置记录")
            return
        
        # 获取当前存储设置
        storage = setting.storage or {}
        print(f"当前存储设置: {storage}")
        
        # 更新local_prefix为正确的URL
        storage["local_prefix"] = "http://127.0.0.1:9999"
        
        # 保存更新
        setting.storage = storage
        await setting.save()
        
        print(f"存储设置已更新: local_prefix = {storage['local_prefix']}")
        print("修复完成！")
        
    except Exception as e:
        print(f"修复失败: {str(e)}")
    finally:
        await Tortoise.close_connections()

if __name__ == "__main__":
    asyncio.run(fix_storage_prefix())