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
# 在 Netlify 中使用内存数据库或临时文件
import tempfile

# 创建临时数据库文件
temp_db = tempfile.NamedTemporaryFile(suffix='.db', delete=False)
temp_db_path = temp_db.name
temp_db.close()

# Netlify 专用数据库配置
netlify_db_config = {
    "connections": {"default": f"sqlite://{temp_db_path}"},
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

# 创建Mangum处理器
handler = Mangum(netlify_app, lifespan="off")

def main(event, context):
    """Netlify Functions处理器"""
    return handler(event, context)