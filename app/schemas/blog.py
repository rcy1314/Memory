from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class BlogImageBase(BaseModel):
    image_url: str
    title: Optional[str] = None
    desc: Optional[str] = None
    location: Optional[str] = None
    is_hidden: bool = False
    metadata: Optional[str] = None
    order: int = 0
    time: Optional[datetime] = None


class BlogImageCreate(BaseModel):
    image_url: str
    title: Optional[str] = None
    desc: Optional[str] = None
    location: Optional[str] = None
    is_hidden: bool = False
    metadata: Optional[str] = None
    order: int = 0
    time: Optional[datetime] = None


class BlogImageUpdate(BlogImageBase):
    id: int


class BlogImageOut(BlogImageBase):
    id: int


class BlogVideoBase(BaseModel):
    video_url: str
    video_type: str = "direct"
    cover_url: Optional[str] = None
    title: Optional[str] = None
    desc: Optional[str] = None
    location: Optional[str] = None
    is_hidden: bool = False
    metadata: Optional[dict] = None
    order: int = 0
    time: Optional[datetime] = None
    video_id: Optional[str] = None
    duration: Optional[int] = None


class BlogVideoCreate(BaseModel):
    video_url: str
    video_type: str = "direct"
    cover_url: Optional[str] = None
    title: Optional[str] = None
    desc: Optional[str] = None
    location: Optional[str] = None
    is_hidden: bool = False
    metadata: Optional[dict] = None
    order: int = 0
    time: Optional[datetime] = None
    video_id: Optional[str] = None
    duration: Optional[int] = None
    category_ids: Optional[List[int]] = []


class BlogVideoUpdate(BlogVideoBase):
    id: int


class BlogVideoOut(BlogVideoBase):
    id: int


class BaseBlog(BaseModel):
    id: int
    title: str
    desc: Optional[str]
    location: Optional[str]
    is_hidden: Optional[bool] = False
    time: Optional[datetime]
    remark: Optional[dict]
    categories: Optional[list] = []


class BlogQuery(BaseModel):
    page: int
    page_size: int
    title: Optional[str] = None
    desc: Optional[str] = None
    location: Optional[str] = None
    categories: Optional[List[int]] = []
    order_option: Optional[str] = None


class BlogOut(BaseBlog):
    categories: Optional[list] = []
    images: Optional[List[BlogImageOut]] = []
    videos: Optional[List[BlogVideoOut]] = []


class BlogCreate(BaseModel):
    title: str = Field(example="随手拍了一张照片")
    time: datetime
    desc: Optional[str] = Field(example="五天四晚的黄山之旅", default="")
    location: Optional[str] = Field(example="黄山", default="")
    remark: Optional[str] = {}
    is_hidden: Optional[bool] = False
    images: List[BlogImageCreate] = []
    videos: List[BlogVideoCreate] = []
    category_ids: Optional[List[int]] = []

    def create_dict(self):
        return self.model_dump(
            exclude_unset=True, exclude={"category_ids", "images", "videos", "id"}
        )


class BlogUpdate(BaseModel):
    id: int
    title: str = Field(example="随手拍了一张照片")
    time: datetime
    desc: Optional[str] = Field(example="五天四晚的黄山之旅")
    location: Optional[str] = Field(example="黄山")
    is_hidden: Optional[bool] = False
    remark: Optional[Dict[str, Any]] = {}
    images: List[BlogImageUpdate | BlogImageCreate] = []
    videos: List[BlogVideoUpdate | BlogVideoCreate] = []
    category_ids: Optional[List[int]] = []

    def update_dict(self):
        return self.model_dump(
            exclude_unset=True, exclude={"category_ids", "id", "images", "videos"}
        )
