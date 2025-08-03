import logging
import os
import zipfile
import shutil
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse

from app.controllers.setting import setting_controller
from app.schemas.base import Fail, Success, SuccessExtra
from app.schemas.setting import *
from app.core.dependency import DependPermisson
from app.utils.config import settings

from app.utils.logger import logger

setting_router = APIRouter()


@setting_router.get("/get/general", summary="查看通用设置")
async def get_general():
    result = await setting_controller.get(id=1)
    return Success(data=result.general)


@setting_router.get("/get/meta", summary="查看网站设置")
async def get_meta():
    result = await setting_controller.get(id=1)
    return Success(data=result.meta)


@setting_router.get("/get/content", summary="查看内容设置")
async def get_content():
    result = await setting_controller.get(id=1)
    return Success(data=result.content)


@setting_router.get("/get/storage", summary="查看存储设置")
async def get_storage():
    result = await setting_controller.get(id=1)
    return Success(data=result.storage)


@setting_router.get("/get/database", summary="查看数据库设置")
async def get_database():
    result = await setting_controller.get(id=1)
    return Success(data=result.database)


@setting_router.post("/update", summary="更新设置", dependencies=[DependPermisson])
async def update(
    setting_in: SettingUpdate,
):
    await setting_controller.update(id=1, obj_in=setting_in)
    return Success(msg="Updated Success")


@setting_router.post("/update/content", summary="更新内容设置", dependencies=[DependPermisson])
async def update_content(
    setting_in: SettingUpdateContent,
):
    await setting_controller.update(id=1, obj_in=setting_in)
    return Success(msg="Content Settings Updated Successfully")


@setting_router.post("/update/general", summary="更新通用设置", dependencies=[DependPermisson])
async def update_general(
    setting_in: SettingUpdateGeneral,
):
    await setting_controller.update(id=1, obj_in=setting_in)
    return Success(msg="General Settings Updated Successfully")


@setting_router.post("/update/meta", summary="更新网站设置", dependencies=[DependPermisson])
async def update_meta(
    setting_in: SettingUpdateMeta,
):
    await setting_controller.update(id=1, obj_in=setting_in)
    return Success(msg="Meta Settings Updated Successfully")


@setting_router.post("/update/storage", summary="更新存储设置", dependencies=[DependPermisson])
async def update_storage(
    setting_in: SettingUpdateStorage,
):
    await setting_controller.update(id=1, obj_in=setting_in)
    return Success(msg="Storage Settings Updated Successfully")


@setting_router.post("/update/database", summary="更新数据库设置", dependencies=[DependPermisson])
async def update_database(
    setting_in: SettingUpdateDatabase,
):
    await setting_controller.update(id=1, obj_in=setting_in)
    return Success(msg="Database Settings Updated Successfully")


@setting_router.get("/backup/photos")
async def backup_photos():
    """备份相册"""
    import io
    from fastapi.responses import StreamingResponse
    
    try:
        # 获取存储设置
        setting = await setting_controller.get(1)
        storage_config = setting.storage
        
        # 检查是否为本地存储
        if storage_config.get('storage_type') != 'local':
            raise HTTPException(status_code=400, detail="只有本地存储模式才支持备份功能")
        
        # 获取本地存储路径
        local_path = storage_config.get('local_path', 'images')
        images_dir = Path(local_path)
        
        if not images_dir.exists() or not any(images_dir.iterdir()):
            raise HTTPException(status_code=404, detail="未找到需要备份的图片文件")
        
        # 创建内存中的zip文件
        zip_buffer = io.BytesIO()
        zip_filename = f"photos_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in images_dir.rglob('*'):
                if file_path.is_file():
                    # 保持目录结构
                    arcname = file_path.relative_to(images_dir)
                    zipf.write(file_path, arcname)
        
        # 检查zip文件是否创建成功
        zip_size = zip_buffer.tell()
        if zip_size == 0:
            raise Exception("ZIP文件创建失败或为空")
        
        zip_buffer.seek(0)
        
        return StreamingResponse(
            iter([zip_buffer.getvalue()]),
            media_type='application/zip',
            headers={"Content-Disposition": f"attachment; filename={zip_filename}"}
        )
        
    except Exception as e:
        logger.error(f"备份相册失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"备份失败: {str(e)}")


@setting_router.get("/backup/database")
async def backup_database():
    """备份数据库"""
    try:
        # 检查数据库文件路径
        db_paths = [
            "data/db.sqlite3",  # 开发环境
            ".moment/db.sqlite3"  # 生产环境
        ]
        
        db_file = None
        for path in db_paths:
            if os.path.exists(path):
                db_file = Path(path)
                break
        
        if not db_file or not db_file.exists():
            raise HTTPException(status_code=404, detail="未找到数据库文件")
        
        # 创建备份文件名
        backup_filename = f"database_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
        
        return FileResponse(
            path=str(db_file),
            filename=backup_filename,
            media_type='application/octet-stream'
        )
        
    except Exception as e:
        logger.error(f"备份数据库失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"备份失败: {str(e)}")
