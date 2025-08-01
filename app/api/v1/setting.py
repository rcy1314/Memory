import logging

from fastapi import APIRouter, Query

from app.controllers.setting import setting_controller
from app.schemas.base import Fail, Success, SuccessExtra
from app.schemas.setting import *
from app.core.dependency import DependPermisson

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
