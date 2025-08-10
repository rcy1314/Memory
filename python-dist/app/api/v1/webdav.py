from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from fastapi.responses import StreamingResponse, Response
from pathlib import Path
import os
import mimetypes
import json
from datetime import datetime
import hashlib
import asyncio
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from app.core.dependency import DependPermisson, DependApiTokenAuth
from app.schemas.base import Success, SuccessExtra, Fail
from app.controllers.webdav_controller import WebDAVController
from app.controllers.setting import setting_controller
from app.utils.logger import logger
from pydantic import BaseModel

webdav_router = APIRouter()

# 全局WebDAV控制器实例
webdav_controller = WebDAVController()

# 全局文件监控变量
file_observers: Dict[str, Observer] = {}
file_change_callbacks: List[callable] = []


class FileInfo(BaseModel):
    """文件信息"""
    name: str
    path: str
    size: int
    is_directory: bool
    modified_time: datetime
    created_time: datetime
    mime_type: Optional[str] = None
    checksum: Optional[str] = None


class DirectoryListing(BaseModel):
    """目录列表"""
    path: str
    files: List[FileInfo]
    total_files: int
    total_directories: int


class FileWatchEvent(BaseModel):
    """文件监控事件"""
    event_type: str  # created, modified, deleted, moved
    file_path: str
    is_directory: bool
    timestamp: datetime
    old_path: Optional[str] = None  # for moved events


class FileSystemWatcher(FileSystemEventHandler):
    """文件系统监控器"""
    
    def __init__(self, watch_path: str):
        super().__init__()
        self.watch_path = watch_path
        self.events = []
        
    def on_created(self, event):
        self._add_event('created', event.src_path, event.is_directory)
        
    def on_modified(self, event):
        if not event.is_directory:  # 只监控文件修改
            self._add_event('modified', event.src_path, event.is_directory)
            
    def on_deleted(self, event):
        self._add_event('deleted', event.src_path, event.is_directory)
        
    def on_moved(self, event):
        self._add_event('moved', event.dest_path, event.is_directory, event.src_path)
        
    def _add_event(self, event_type: str, file_path: str, is_directory: bool, old_path: str = None):
        event_data = FileWatchEvent(
            event_type=event_type,
            file_path=file_path,
            is_directory=is_directory,
            timestamp=datetime.now(),
            old_path=old_path
        )
        self.events.append(event_data)
        
        # 执行回调函数
        for callback in file_change_callbacks:
            try:
                callback(event_data)
            except Exception as e:
                logger.error(f"文件监控回调执行失败: {str(e)}")


def get_file_info(file_path: Path) -> FileInfo:
    """获取文件信息"""
    stat = file_path.stat()
    
    # 计算文件校验和（仅对文件）
    checksum = None
    if file_path.is_file() and stat.st_size < 100 * 1024 * 1024:  # 小于100MB的文件才计算校验和
        try:
            with open(file_path, 'rb') as f:
                checksum = hashlib.md5(f.read()).hexdigest()
        except Exception:
            pass
    
    return FileInfo(
        name=file_path.name,
        path=str(file_path),
        size=stat.st_size,
        is_directory=file_path.is_dir(),
        modified_time=datetime.fromtimestamp(stat.st_mtime),
        created_time=datetime.fromtimestamp(stat.st_ctime),
        mime_type=mimetypes.guess_type(str(file_path))[0] if file_path.is_file() else None,
        checksum=checksum
    )


@webdav_router.get("/list", summary="列出目录内容")
async def list_directory(
    path: str = Query(default=".", description="目录路径"),
    include_hidden: bool = Query(default=False, description="是否包含隐藏文件"),
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """列出指定目录的内容"""
    try:
        result = webdav_controller.list_directory(path, include_hidden)
        return SuccessExtra(data=result)
    except Exception as e:
        logger.error(f"列出目录内容失败: {str(e)}")
        return Fail(msg=f"列出目录失败: {str(e)}")


@webdav_router.get("/download", summary="下载文件")
async def download_file(
    path: str = Query(..., description="文件路径"),
    _: None = DependApiTokenAuth
):
    """下载指定文件"""
    try:
        return webdav_controller.download_file(path)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"下载文件失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"下载失败: {str(e)}")


@webdav_router.post("/upload", summary="上传文件")
async def upload_file(
    path: str = Query(..., description="上传路径"),
    file: UploadFile = File(...),
    overwrite: bool = Query(default=False, description="是否覆盖已存在的文件"),
    _: None = DependApiTokenAuth
) -> Success:
    """上传文件到指定路径"""
    try:
        result = webdav_controller.upload_file(path, file, overwrite)
        return Success(msg=result)
    except Exception as e:
        logger.error(f"上传文件失败: {str(e)}")
        return Fail(msg=f"上传失败: {str(e)}")


@webdav_router.delete("/delete", summary="删除文件或目录")
async def delete_file(
    path: str = Query(..., description="要删除的文件或目录路径"),
    recursive: bool = Query(default=False, description="是否递归删除目录"),
    _: None = DependApiTokenAuth
) -> Success:
    """删除指定的文件或目录"""
    try:
        result = webdav_controller.delete_file(path, recursive)
        return Success(msg=result)
    except Exception as e:
        logger.error(f"删除文件失败: {str(e)}")
        return Fail(msg=f"删除失败: {str(e)}")


@webdav_router.post("/mkdir", summary="创建目录")
async def create_directory(
    path: str = Query(..., description="要创建的目录路径"),
    parents: bool = Query(default=True, description="是否创建父目录"),
    _: None = DependApiTokenAuth
) -> Success:
    """创建目录"""
    try:
        result = webdav_controller.create_directory(path, parents)
        return Success(msg=result)
    except Exception as e:
        logger.error(f"创建目录失败: {str(e)}")
        return Fail(msg=f"创建目录失败: {str(e)}")


@webdav_router.post("/monitor/start", summary="开始监控目录")
async def start_monitoring(
    path: str,
    recursive: bool = True,
    _: None = DependPermisson
) -> Success:
    """开始监控指定目录的文件变化"""
    try:
        monitor_id = webdav_controller.start_monitoring(path, recursive)
        return Success(msg=f"开始监控目录: {path} (ID: {monitor_id})")
    except Exception as e:
        logger.error(f"开始监控失败: {str(e)}")
        return Fail(msg=f"开始监控失败: {str(e)}")


@webdav_router.post("/monitor/stop", summary="停止监控目录")
async def stop_monitoring(
    monitor_id: str,
    _: None = DependPermisson
) -> Success:
    """停止监控指定目录"""
    try:
        success = webdav_controller.stop_monitoring(monitor_id)
        if success:
            return Success(msg=f"停止监控成功: {monitor_id}")
        else:
            return Fail(msg=f"停止监控失败: {monitor_id}")
    except Exception as e:
        logger.error(f"停止监控失败: {str(e)}")
        return Fail(msg=f"停止监控失败: {str(e)}")


@webdav_router.get("/watch/events", summary="获取文件变化事件")
async def get_watch_events(
    path: str = Query(default=".", description="监控目录路径"),
    limit: int = Query(default=100, description="返回事件数量限制"),
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """获取指定目录的文件变化事件"""
    try:
        # 获取存储设置
        storage_setting = (await setting_controller.get(id=1)).storage
        base_path = Path(storage_setting.get("local_path", "images"))
        
        # 构建完整路径
        if path == ".":
            watch_path = base_path
        else:
            watch_path = base_path / path.lstrip('/')
        
        watch_key = str(watch_path.resolve())
        
        events = []
        if watch_key in file_observers:
            # 获取监控器的事件处理器
            for handler in file_observers[watch_key]._handlers.values():
                if isinstance(handler, FileSystemWatcher):
                    events.extend(handler.events[-limit:])
                    break
        
        # 按时间排序
        events.sort(key=lambda x: x.timestamp, reverse=True)
        
        return SuccessExtra(
            data=[event.model_dump() for event in events[:limit]],
            total=len(events)
        )
        
    except Exception as e:
        logger.error(f"获取监控事件失败: {str(e)}")
        return Fail(msg=f"获取监控事件失败: {str(e)}")


@webdav_router.get("/info", summary="获取文件或目录信息")
async def get_file_info_api(
    path: str = Query(..., description="文件或目录路径"),
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """获取指定文件或目录的详细信息"""
    try:
        file_info = webdav_controller.get_file_info(path)
        return SuccessExtra(data=file_info)
    except Exception as e:
        logger.error(f"获取文件信息失败: {str(e)}")
        return Fail(msg=f"获取文件信息失败: {str(e)}")


@webdav_router.get("/changes", summary="获取文件变化")
async def get_file_changes(
    monitor_id: str,
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """获取指定监控的文件变化事件"""
    try:
        changes = webdav_controller.get_file_changes(monitor_id)
        return SuccessExtra(data=changes, total=len(changes))
    except Exception as e:
        logger.error(f"获取文件变化失败: {str(e)}")
        return Fail(msg=f"获取文件变化失败: {str(e)}")


@webdav_router.get("/monitor/status", summary="获取监控状态")
async def get_monitoring_status(
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """获取所有监控的状态信息"""
    try:
        status = webdav_controller.get_monitoring_status()
        return SuccessExtra(data=status)
    except Exception as e:
        logger.error(f"获取监控状态失败: {str(e)}")
        return Fail(msg=f"获取监控状态失败: {str(e)}")