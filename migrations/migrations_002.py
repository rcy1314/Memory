import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tortoise import Tortoise, connections
from tortoise.exceptions import OperationalError
from app.models import *
from app.utils import DB_CONNECTION


async def migrate():
    print("开始初始化封面设置数据...")

    try:
        # 1. 连接到数据库
        await Tortoise.init(**DB_CONNECTION)
        conn = connections.get("default")

        # 2. 检查设置表是否存在数据
        setting_count = await Setting.all().count()
        
        if setting_count == 0:
            print("设置表为空，创建默认设置...")
            # 创建默认设置
            default_setting = await Setting.create(
                general={},
                content={},
                storage={},
                meta={
                    "hero_images": [
                        {
                            "url": "/assets/20200212-38ce26bb0bd0d.gif",
                            "title": "欢迎来到时光工作室",
                            "description": "记录生活中的美好瞬间"
                        },
                        {
                            "url": "/assets/20200212-6dafa53ecf4e3.gif",
                            "title": "摄影作品集",
                            "description": "用镜头捕捉世界的精彩"
                        },
                        {
                            "url": "/assets/20200212-e056a5f2914d6.gif",
                            "title": "创意无限",
                            "description": "探索视觉艺术的无限可能"
                        }
                    ],
                    "site_name": "时光工作室",
                    "site_desc": "记录生活中的美好瞬间"
                }
            )
            print("默认设置创建完成")
        else:
            # 检查现有设置是否包含封面图配置
            setting = await Setting.get(id=1)
            meta = setting.meta or {}
            
            if "hero_images" not in meta:
                print("添加默认封面图配置...")
                meta["hero_images"] = [
                    {
                        "url": "/assets/20200212-38ce26bb0bd0d.gif",
                        "title": "欢迎来到时光工作室",
                        "description": "记录生活中的美好瞬间"
                    },
                    {
                        "url": "/assets/20200212-6dafa53ecf4e3.gif",
                        "title": "摄影作品集",
                        "description": "用镜头捕捉世界的精彩"
                    },
                    {
                        "url": "/assets/20200212-e056a5f2914d6.gif",
                        "title": "创意无限",
                        "description": "探索视觉艺术的无限可能"
                    }
                ]
                
                if "site_title" not in meta:
                    meta["site_title"] = "时光工作室"
                if "site_desc" not in meta:
                    meta["site_desc"] = "记录生活中的美好瞬间"
                
                setting.meta = meta
                await setting.save()
                print("封面图配置添加完成")
            else:
                print("封面图配置已存在，无需更新")

        print("封面设置数据初始化完成")

    except Exception as e:
        print(f"迁移过程中发生错误: {str(e)}")
        raise e
    finally:
        await Tortoise.close_connections()


if __name__ == "__main__":
    import asyncio
    asyncio.run(migrate())