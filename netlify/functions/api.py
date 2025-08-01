import json
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from app.core.exceptions import (
    DoesNotExist,
    DoesNotExistHandle,
    HTTPException,
    HttpExcHandle,
    IntegrityError,
    IntegrityHandle,
    RequestValidationError,
    RequestValidationHandle,
    ResponseValidationError,
    ResponseValidationHandle,
)
from app.core.middlewares import BackGroundTaskMiddleware
from app.utils.config import settings
from app.api import api_router
from tortoise.contrib.fastapi import register_tortoise
from mangum import Mangum

# 创建专门用于 Netlify 的 FastAPI 应用实例（不使用 lifespan）
netlify_app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.VERSION,
    openapi_url="/openapi.json",
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ORIGINS,
            allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
            allow_methods=settings.CORS_ALLOW_METHODS,
            allow_headers=settings.CORS_ALLOW_HEADERS,
        ),
        Middleware(BackGroundTaskMiddleware),
    ],
)

# 为 Netlify 环境配置数据库
# 使用构建时复制的数据库文件
import os

# 获取数据库文件路径（优先使用环境变量）
db_path = os.environ.get('DATABASE_URL', '').replace('sqlite:///', '')
if not db_path or not os.path.exists(db_path):
    # 尝试多个可能的路径
    possible_paths = [
        '/opt/build/repo/dist/data/db.sqlite3',
        os.path.join(os.path.dirname(__file__), '../../data/db.sqlite3'),
        './data/db.sqlite3',
        '/tmp/data/db.sqlite3'
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            db_path = path
            break
    else:
        # 如果都找不到，使用默认路径并记录错误
        db_path = '/opt/build/repo/dist/data/db.sqlite3'
        print(f"Warning: Database file not found. Using default path: {db_path}")
        print(f"Current working directory: {os.getcwd()}")
        print(f"Files in current directory: {os.listdir('.')}")

print(f"Using database path: {db_path}")
print(f"Database exists: {os.path.exists(db_path)}")

# Netlify 数据库配置
netlify_db_config = {
    "connections": {"default": f"sqlite://{db_path}"},
    "apps": {
        "models": {
            "models": ["app.models"],
            "default_connection": "default",
        },
    },
    "use_tz": False,
    "timezone": "Asia/Shanghai",
}

# 注册数据库
register_tortoise(
    netlify_app,
    config=netlify_db_config,
    generate_schemas=True,
)

# 注册异常处理器
netlify_app.add_exception_handler(DoesNotExist, DoesNotExistHandle)
netlify_app.add_exception_handler(HTTPException, HttpExcHandle)
netlify_app.add_exception_handler(IntegrityError, IntegrityHandle)
netlify_app.add_exception_handler(RequestValidationError, RequestValidationHandle)
netlify_app.add_exception_handler(ResponseValidationError, ResponseValidationHandle)

# 注册路由
netlify_app.include_router(api_router, prefix="/api")

# 添加健康检查端点
@netlify_app.get("/")
@netlify_app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Netlify Functions is running", "version": settings.VERSION}

# 创建Mangum处理器 - Netlify Functions 入口点
mangum_handler = Mangum(netlify_app, lifespan="off")

# Netlify Functions 处理函数
def handler(event, context):
    try:
        print(f"Event: {event}")
        print(f"Context: {context}")
        print(f"HTTP Method: {event.get('httpMethod', 'Unknown')}")
        print(f"Path: {event.get('path', 'Unknown')}")
        
        result = mangum_handler(event, context)
        print(f"Response status: {result.get('statusCode', 'Unknown')}")
        return result
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'body': f'Internal server error: {str(e)}',
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }