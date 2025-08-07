import asyncio
from tortoise import Tortoise
from app.utils import DB_CONNECTION
from app.models import *

async def check_data():
    await Tortoise.init(**DB_CONNECTION)
    
    blogs = await Blog.all().limit(5)
    videos = await BlogVideo.all().limit(5)
    
    print(f'博客数量: {len(blogs)}')
    print(f'视频数量: {len(videos)}')
    
    if blogs:
        print('博客示例:', blogs[0].title if blogs[0].title else '无标题')
    if videos:
        print('视频示例:', videos[0].title if videos[0].title else '无标题')
    
    await Tortoise.close_connections()

if __name__ == '__main__':
    asyncio.run(check_data())