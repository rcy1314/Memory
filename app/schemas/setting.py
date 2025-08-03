from typing import Optional

from pydantic import BaseModel, Field

class BaseSetting(BaseModel):
    general: Optional[dict]
    content:Optional[dict]
    meta:Optional[dict]
    storage:Optional[dict]
    database:Optional[dict]

class SettingCreate(BaseModel):
    general: Optional[dict]= Field(example={})
    content: Optional[dict]= Field(example={})
    meta: Optional[dict]= Field(example={})
    storage: Optional[dict]= Field(example={})
    database: Optional[dict]= Field(example={})
    def create_dict(self):
        return self.model_dump(exclude_unset=True)

class SettingUpdate(BaseModel):
    general: Optional[dict]= Field(example={})
    content: Optional[dict]= Field(example={})
    meta: Optional[dict]= Field(example={})
    storage: Optional[dict]= Field(example={})
    database: Optional[dict]= Field(example={})

    def update_dict(self):
        return self.model_dump(exclude_unset=True, exclude={"id"})

class SettingUpdateGeneral(BaseModel):
    general: Optional[dict]= Field(example={})

    def update_dict(self):
        return self.model_dump(exclude_unset=True, exclude={"id"})

class SettingUpdateMeta(BaseModel):
    meta: Optional[dict]= Field(example={
        "hero_images": [
            {
                "url": "https://example.com/image1.jpg",
                "title": "封面标题1",
                "description": "封面描述1"
            }
        ],
        "site_name": "网站名称",
        "site_title": "网站标题",
        "site_desc": "网站描述",
        "site_url": "https://example.com",
        "site_keywords": "关键词1,关键词2",
        "primary_color": "#1890ff",
        "site_splitter": " - ",
        "site_icon": "https://example.com/icon.ico",
        "site_apple_icon": "https://example.com/apple-icon.png",
        "bottom_icon": "https://example.com/logo.png",
        "bottom_desc": "底部描述",
        "icp": "ICP备案号",
        "hero_autoplay": True,
        "hero_interval": 5000,
        "hero_show_indicators": True,
        "hero_show_controls": True,
        "entries": [
            {
                "name": "联系我们",
                "icon": "mdi-email",
                "url": "mailto:contact@example.com"
            }
        ]
    })

    def update_dict(self):
        return self.model_dump(exclude_unset=True, exclude={"id"})
    
class SettingUpdateContent(BaseModel):
    content: Optional[dict]= Field(example={})

    def update_dict(self):
        return self.model_dump(exclude_unset=True, exclude={"id"})
    
class SettingUpdateStorage(BaseModel):
    storage_type: Optional[str] = "local"  # 'local' 或 'cloud'
    local_path: Optional[str] = "images"  # 本地存储路径
    local_prefix: Optional[str] = None  # 本地存储URL前缀
    enable_storage: Optional[bool] = None
    max_size: Optional[float] = None
    timeout_time: Optional[int] = None
    endpoint: Optional[str] = None
    region: Optional[str] = None
    access_id: Optional[str] = None
    secret_key: Optional[str] = None
    bucket: Optional[str] = None
    path: Optional[str] = None
    prefix: Optional[str] = None
    suffix: Optional[str] = None

    def update_dict(self):
        return self.model_dump(exclude_unset=True, exclude={"id"})

class SettingUpdateDatabase(BaseModel):
    database: Optional[dict]= Field(example={
        "db_type": "sqlite",
        "db_path": "/Library/Github/Memory/data/db.sqlite3",
        "host": "",
        "port": 5432,
        "database": "",
        "username": "",
        "password": "",
        "ssl": True,
        "pool_size": 10,
        "timeout": 30
    })

    def update_dict(self):
        return self.model_dump(exclude_unset=True, exclude={"id"})