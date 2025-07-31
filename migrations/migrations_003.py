import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tortoise import Tortoise, connections
from tortoise.exceptions import OperationalError
from app.models import *
from app.utils import DB_CONNECTION
import json


async def migrate():
    print("开始修复内容设置字段不一致问题...")

    try:
        # 1. 连接到数据库
        await Tortoise.init(**DB_CONNECTION)
        conn = connections.get("default")

        # 2. 获取当前设置
        setting = await Setting.get(id=1)
        content = setting.content or {}
        
        # 3. 定义完整的content字段结构
        default_content = {
            "page_size": 80,
            "thumbnail_suffix": "",
            "detail_suffix": "",
            "thumbnail_show_location": False,
            "detail_show_location": False,
            "thumbnail_show_time": True,
            "thumbnail_time_format": "YYYY-MM-DD",
            "detail_show_time": False,
            "detail_time_format": ""
        }
        
        # 4. 检查并补充缺失的字段
        updated = False
        for key, default_value in default_content.items():
            if key not in content:
                content[key] = default_value
                updated = True
                print(f"添加缺失字段: {key} = {default_value}")
        
        # 5. 如果有更新，保存到数据库
        if updated:
            setting.content = content
            await setting.save()
            print("内容设置字段已更新")
            print(f"当前content字段: {json.dumps(content, ensure_ascii=False, indent=2)}")
        else:
            print("内容设置字段已完整，无需更新")

        print("内容设置字段修复完成")

    except Exception as e:
        print(f"迁移过程中发生错误: {str(e)}")
        raise e
    finally:
        await Tortoise.close_connections()


if __name__ == "__main__":
    import asyncio
    asyncio.run(migrate())