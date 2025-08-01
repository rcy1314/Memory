from typing import Optional
from pydantic import BaseModel, Field


class DatabaseTestConnection(BaseModel):
    """数据库连接测试请求模型"""
    db_type: str = Field(..., description="数据库类型: sqlite, postgresql, mysql")
    db_path: Optional[str] = Field(None, description="SQLite数据库文件路径")
    host: Optional[str] = Field(None, description="数据库主机地址")
    port: Optional[int] = Field(None, description="数据库端口")
    database: Optional[str] = Field(None, description="数据库名称")
    username: Optional[str] = Field(None, description="用户名")
    password: Optional[str] = Field(None, description="密码")
    ssl: Optional[bool] = Field(True, description="是否使用SSL连接")


class DatabaseMigration(BaseModel):
    """数据库迁移请求模型"""
    target_db_type: str = Field(..., description="目标数据库类型: sqlite, postgresql, mysql")
    target_db_path: Optional[str] = Field(None, description="目标SQLite数据库文件路径")
    target_host: Optional[str] = Field(None, description="目标数据库主机地址")
    target_port: Optional[int] = Field(None, description="目标数据库端口")
    target_database: Optional[str] = Field(None, description="目标数据库名称")
    target_username: Optional[str] = Field(None, description="目标数据库用户名")
    target_password: Optional[str] = Field(None, description="目标数据库密码")
    target_ssl: Optional[bool] = Field(True, description="目标数据库是否使用SSL连接")