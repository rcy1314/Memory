import json
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from app import app
from mangum import Mangum

# 创建Mangum处理器
handler = Mangum(app, lifespan="off")

def lambda_handler(event, context):
    """Netlify Functions处理器"""
    return handler(event, context)