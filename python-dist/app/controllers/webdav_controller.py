import os
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import asyncio
import threading

from app.utils.logger import logger


class FileChangeHandler(FileSystemEventHandler):
    """文件变化处理器"""
    
    def __init__(self, callback=None):
        super().__init__()
        self.callback = callback
        self.changes = []
    
    def on_any_event(self, event):
        """处理任何文件系统事件"""
        if event.is_directory:
            return
        
        change_info = {
            "event_type": event.event_type,
            "src_path": event.src_path,
            "is_directory": event.is_directory,
            "timestamp": datetime.now().isoformat()
        }
        
        if hasattr(event, 'dest_path'):
            change_info["dest_path"] = event.dest_path
        
        self.changes.append(change_info)
        logger.info(f"文件变化: {event.event_type} - {event.src_path}")
        
        if self.callback:
            try:
                self.callback(change_info)
            except Exception as e:
                logger.error(f"文件变化回调执行失败: {str(e)}")
    
    def get_changes(self) -> List[Dict[str, Any]]:
        """获取所有变化记录"""
        changes = self.changes.copy()
        self.changes.clear()
        return changes


class WebDAVController:
    """WebDAV文件管理控制器"""
    
    def __init__(self, base_path: str = "/tmp/webdav"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.observers = {}
        self.handlers = {}
        self.monitoring_paths = set()
    
    def _get_safe_path(self, path: str) -> Path:
        """获取安全的文件路径，防止路径遍历攻击"""
        # 移除开头的斜杠
        if path.startswith('/'):
            path = path[1:]
        
        # 构建完整路径
        full_path = self.base_path / path
        
        # 确保路径在base_path内
        try:
            full_path = full_path.resolve()
            self.base_path.resolve()
            if not str(full_path).startswith(str(self.base_path.resolve())):
                raise ValueError("路径不在允许的范围内")
        except Exception:
            raise ValueError("无效的路径")
        
        return full_path
    
    def _get_mime_type(self, extension: str) -> str:
        """根据文件扩展名获取MIME类型"""
        mime_types = {
            '.txt': 'text/plain',
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.pdf': 'application/pdf',
            '.zip': 'application/zip',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
        return mime_types.get(extension.lower(), 'application/octet-stream')
    
    def list_directory(self, path: str = "/", include_hidden: bool = False) -> List[Dict[str, Any]]:
        """列出目录内容"""
        try:
            dir_path = self._get_safe_path(path)
            
            if not dir_path.exists():
                raise FileNotFoundError(f"目录不存在: {path}")
            
            if not dir_path.is_dir():
                raise ValueError(f"路径不是目录: {path}")
            
            items = []
            for item in dir_path.iterdir():
                try:
                    # 跳过隐藏文件（除非明确要求包含）
                    if not include_hidden and item.name.startswith('.'):
                        continue
                        
                    stat = item.stat()
                    item_info = {
                        "name": item.name,
                        "path": str(item.relative_to(self.base_path)),
                        "is_directory": item.is_dir(),
                        "size": stat.st_size if not item.is_dir() else 0,
                        "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        "created_time": datetime.fromtimestamp(stat.st_ctime).isoformat()
                    }
                    
                    if item.is_file():
                        item_info["extension"] = item.suffix.lower()
                        item_info["mime_type"] = self._get_mime_type(item.suffix)
                    
                    items.append(item_info)
                except Exception as e:
                    logger.warning(f"获取文件信息失败 {item}: {str(e)}")
                    continue
            
            # 按名称排序，目录在前
            items.sort(key=lambda x: (not x["is_directory"], x["name"].lower()))
            return items
            
        except Exception as e:
            logger.error(f"列出目录失败 {path}: {str(e)}")
            raise
    
    def _get_mime_type(self, extension: str) -> str:
        """根据文件扩展名获取MIME类型"""
        mime_types = {
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.pdf': 'application/pdf',
            '.zip': 'application/zip',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.avi': 'video/x-msvideo',
            '.mov': 'video/quicktime',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav'
        }
        return mime_types.get(extension.lower(), 'application/octet-stream')
    
    def read_file(self, path: str) -> bytes:
        """读取文件内容"""
        try:
            file_path = self._get_safe_path(path)
            
            if not file_path.exists():
                raise FileNotFoundError(f"文件不存在: {path}")
            
            if not file_path.is_file():
                raise ValueError(f"路径不是文件: {path}")
            
            with open(file_path, 'rb') as f:
                return f.read()
                
        except Exception as e:
            logger.error(f"读取文件失败 {path}: {str(e)}")
            raise
    
    def download_file(self, path: str):
        """下载文件"""
        from fastapi.responses import FileResponse
        try:
            file_path = self._get_safe_path(path)
            
            if not file_path.exists():
                raise FileNotFoundError(f"文件不存在: {path}")
            
            if not file_path.is_file():
                raise ValueError(f"路径不是文件: {path}")
            
            return FileResponse(
                path=str(file_path),
                filename=file_path.name,
                media_type=self._get_mime_type(file_path.suffix)
            )
                
        except Exception as e:
            logger.error(f"下载文件失败 {path}: {str(e)}")
            raise
    
    def upload_file(self, path: str, file, overwrite: bool = False) -> str:
        """上传文件"""
        try:
            file_path = self._get_safe_path(path)
            
            # 如果文件已存在且不允许覆盖
            if file_path.exists() and not overwrite:
                raise ValueError(f"文件已存在且不允许覆盖: {path}")
            
            # 确保目录存在
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # 写入文件内容
            with open(file_path, 'wb') as f:
                content = file.file.read()
                f.write(content)
            
            logger.info(f"文件上传成功: {path}")
            return f"文件上传成功: {file.filename}"
                
        except Exception as e:
            logger.error(f"上传文件失败 {path}: {str(e)}")
            raise
    
    def write_file(self, path: str, content: bytes, create_dirs: bool = True) -> bool:
        """写入文件"""
        try:
            file_path = self._get_safe_path(path)
            
            if create_dirs:
                file_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(file_path, 'wb') as f:
                f.write(content)
            
            logger.info(f"文件写入成功: {path}")
            return True
            
        except Exception as e:
            logger.error(f"写入文件失败 {path}: {str(e)}")
            raise
    
    def delete_file(self, path: str) -> bool:
        """删除文件"""
        try:
            file_path = self._get_safe_path(path)
            
            if not file_path.exists():
                raise FileNotFoundError(f"文件不存在: {path}")
            
            if file_path.is_file():
                file_path.unlink()
            elif file_path.is_dir():
                shutil.rmtree(file_path)
            
            logger.info(f"删除成功: {path}")
            return True
            
        except Exception as e:
            logger.error(f"删除失败 {path}: {str(e)}")
            raise
    
    def create_directory(self, path: str) -> bool:
        """创建目录"""
        try:
            dir_path = self._get_safe_path(path)
            dir_path.mkdir(parents=True, exist_ok=True)
            
            logger.info(f"目录创建成功: {path}")
            return True
            
        except Exception as e:
            logger.error(f"创建目录失败 {path}: {str(e)}")
            raise
    
    def move_file(self, src_path: str, dest_path: str) -> bool:
        """移动/重命名文件"""
        try:
            src = self._get_safe_path(src_path)
            dest = self._get_safe_path(dest_path)
            
            if not src.exists():
                raise FileNotFoundError(f"源文件不存在: {src_path}")
            
            # 确保目标目录存在
            dest.parent.mkdir(parents=True, exist_ok=True)
            
            shutil.move(str(src), str(dest))
            
            logger.info(f"移动成功: {src_path} -> {dest_path}")
            return True
            
        except Exception as e:
            logger.error(f"移动失败 {src_path} -> {dest_path}: {str(e)}")
            raise
    
    def copy_file(self, src_path: str, dest_path: str) -> bool:
        """复制文件"""
        try:
            src = self._get_safe_path(src_path)
            dest = self._get_safe_path(dest_path)
            
            if not src.exists():
                raise FileNotFoundError(f"源文件不存在: {src_path}")
            
            # 确保目标目录存在
            dest.parent.mkdir(parents=True, exist_ok=True)
            
            if src.is_file():
                shutil.copy2(str(src), str(dest))
            elif src.is_dir():
                shutil.copytree(str(src), str(dest), dirs_exist_ok=True)
            
            logger.info(f"复制成功: {src_path} -> {dest_path}")
            return True
            
        except Exception as e:
            logger.error(f"复制失败 {src_path} -> {dest_path}: {str(e)}")
            raise
    
    def get_file_info(self, path: str) -> Dict[str, Any]:
        """获取文件信息"""
        try:
            file_path = self._get_safe_path(path)
            
            if not file_path.exists():
                raise FileNotFoundError(f"文件不存在: {path}")
            
            stat = file_path.stat()
            
            info = {
                "name": file_path.name,
                "path": str(file_path.relative_to(self.base_path)),
                "absolute_path": str(file_path),
                "is_directory": file_path.is_dir(),
                "size": stat.st_size,
                "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "created_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "permissions": oct(stat.st_mode)[-3:]
            }
            
            if file_path.is_file():
                info["extension"] = file_path.suffix.lower()
                info["mime_type"] = self._get_mime_type(file_path.suffix)
            
            return info
            
        except Exception as e:
            logger.error(f"获取文件信息失败 {path}: {str(e)}")
            raise
    
    def start_monitoring(self, path: str = "/", recursive: bool = True) -> str:
        """开始监控目录变化"""
        try:
            monitor_path = self._get_safe_path(path)
            
            if not monitor_path.exists():
                raise FileNotFoundError(f"监控路径不存在: {path}")
            
            if not monitor_path.is_dir():
                raise ValueError(f"监控路径不是目录: {path}")
            
            monitor_id = f"monitor_{path.replace('/', '_')}_{datetime.now().timestamp()}"
            
            # 创建事件处理器
            handler = FileChangeHandler()
            self.handlers[monitor_id] = handler
            
            # 创建观察者
            observer = Observer()
            observer.schedule(handler, str(monitor_path), recursive=recursive)
            observer.start()
            
            self.observers[monitor_id] = observer
            self.monitoring_paths.add(str(monitor_path))
            
            logger.info(f"开始监控目录: {path} (ID: {monitor_id})")
            return monitor_id
            
        except Exception as e:
            logger.error(f"开始监控失败 {path}: {str(e)}")
            raise
    
    def stop_monitoring(self, monitor_id: str) -> bool:
        """停止监控"""
        try:
            if monitor_id not in self.observers:
                raise ValueError(f"监控ID不存在: {monitor_id}")
            
            observer = self.observers[monitor_id]
            observer.stop()
            observer.join(timeout=5)
            
            del self.observers[monitor_id]
            if monitor_id in self.handlers:
                del self.handlers[monitor_id]
            
            logger.info(f"停止监控成功: {monitor_id}")
            return True
            
        except Exception as e:
            logger.error(f"停止监控失败 {monitor_id}: {str(e)}")
            raise
    
    def get_file_changes(self, monitor_id: str) -> List[Dict[str, Any]]:
        """获取文件变化记录"""
        try:
            if monitor_id not in self.handlers:
                raise ValueError(f"监控ID不存在: {monitor_id}")
            
            handler = self.handlers[monitor_id]
            return handler.get_changes()
            
        except Exception as e:
            logger.error(f"获取文件变化失败 {monitor_id}: {str(e)}")
            raise
    
    def get_monitoring_status(self) -> Dict[str, Any]:
        """获取监控状态"""
        status = {
            "active_monitors": len(self.observers),
            "monitoring_paths": list(self.monitoring_paths),
            "monitors": []
        }
        
        for monitor_id, observer in self.observers.items():
            monitor_info = {
                "id": monitor_id,
                "is_alive": observer.is_alive(),
                "event_count": len(self.handlers[monitor_id].changes) if monitor_id in self.handlers else 0
            }
            status["monitors"].append(monitor_info)
        
        return status
    
    def cleanup(self):
        """清理所有监控"""
        for monitor_id in list(self.observers.keys()):
            try:
                self.stop_monitoring(monitor_id)
            except Exception as e:
                logger.error(f"清理监控失败 {monitor_id}: {str(e)}")
        
        self.monitoring_paths.clear()
        logger.info("WebDAV控制器清理完成")