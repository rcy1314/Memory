from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import Response
from contextlib import asynccontextmanager

from tortoise import Tortoise
from tortoise.contrib.fastapi import register_tortoise

from app.core.database import init_db
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
from app.utils.logger import logger
from app.utils.config import settings
from app.api import api_router
from app.controllers.user import UserCreate, user_controller
from app.controllers.setting import SettingCreate, setting_controller


class CachedStaticFiles(StaticFiles):
    def file_response(
        self,
        full_path,
        stat_result,
        scope,
        status_code: int = 200,
    ) -> Response:
        response = super().file_response(full_path, stat_result, scope, status_code)
        # 为静态资源添加缓存头
        response.headers["Cache-Control"] = "public, max-age=86400"  # 1天缓存
        return response


def register_db(app: FastAPI, db_url=None):
    register_tortoise(
        app,
        config=settings.TORTOISE_ORM,
        generate_schemas=True,
    )


def register_exceptions(app: FastAPI):
    app.add_exception_handler(DoesNotExist, DoesNotExistHandle)
    app.add_exception_handler(HTTPException, HttpExcHandle)
    app.add_exception_handler(IntegrityError, IntegrityHandle)
    app.add_exception_handler(RequestValidationError, RequestValidationHandle)
    app.add_exception_handler(ResponseValidationError, ResponseValidationHandle)


def register_routers(app: FastAPI, prefix: str = "/api"):
    app.include_router(api_router, prefix=prefix)


async def init_superuser():
    user = await user_controller.model.exists()
    if not user:
        await user_controller.create(
            UserCreate(
                username="admin",
                email="admin@admin.com",
                password="123456",
                avatar="https://avatars.githubusercontent.com/u/72618337?v=4",
            )
        )


async def init_setting():
    """初始化设置，确保所有字段都有默认值"""
    from migrations.init_default_settings import init_all_default_settings
    
    # 使用完整的默认设置初始化
    try:
        await init_all_default_settings(standalone=False)
        logger.info("设置初始化完成")
    except Exception as e:
        logger.error(f"设置初始化失败: {str(e)}")
        # 如果新的初始化失败，使用原有的简单初始化作为备用
        setting = await setting_controller.model.exists()
        if not setting:
            await setting_controller.create(
                SettingCreate(general={}, content={}, meta={}, storage={}, database={})
            )
            logger.info("使用简单设置初始化完成")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("正在初始化应用...")
    
    # 首先初始化数据库
    try:
        await init_db()
        logger.info("数据库初始化完成")
    except Exception as e:
        logger.error(f"数据库初始化失败，应用无法启动: {str(e)}")
        raise
    
    # 然后初始化用户和设置
    try:
        await init_superuser()
        await init_setting()
        logger.info("用户和设置初始化完成")
    except Exception as e:
        logger.error(f"用户和设置初始化失败: {str(e)}")
        # 这里不抛出异常，允许应用继续启动

    app.mount(
        "/assets",
        CachedStaticFiles(directory=f"./dist/assets"),
        name="assets",
    )
    
    # 挂载本地存储的图片目录
    import os
    from pathlib import Path
    
    # 获取存储设置中的本地路径
    try:
        setting = await setting_controller.get(id=1)
        local_path = setting.storage.get("local_path", "images")
    except:
        local_path = "images"
    
    # 确保图片目录存在
    images_dir = Path(local_path)
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # 挂载图片静态文件服务
    app.mount(
        f"/{local_path}",
        CachedStaticFiles(directory=str(images_dir)),
        name="images",
    )

    logger.info("应用初始化完成")

    try:
        yield
    finally:
        logger.info("正在关闭应用...")
        await Tortoise.close_connections()
        logger.info("应用已关闭")


app = FastAPI(
    lifespan=lifespan,
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

register_db(app)
register_exceptions(app)
register_routers(app, prefix="/api")


@app.get("/")
async def index():
    return HTMLResponse(
        content=open(f"./dist/index.html", "r", encoding="utf-8").read(),
        media_type="text/html",
        headers={"Cache-Control": "public, max-age=300"},
    )

@app.exception_handler(404)
async def not_found_handler(request, exc):
    # 只对非API路径返回前端页面
    if request.url.path.startswith("/api/"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="API endpoint not found")
    return HTMLResponse(
        content=open(f"./dist/index.html", "r", encoding="utf-8").read(),
        media_type="text/html",
        headers={"Cache-Control": "public, max-age=300"},
    )
