from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ApiTokenBase(BaseModel):
    name: str = Field(..., description="Token名称")
    is_permanent: bool = Field(default=False, description="是否永久有效")
    expires_at: Optional[datetime] = Field(None, description="过期时间")
    remark: Optional[str] = Field(None, description="备注")


class ApiTokenCreate(ApiTokenBase):
    pass


class ApiTokenUpdate(BaseModel):
    name: Optional[str] = Field(None, description="Token名称")
    is_permanent: Optional[bool] = Field(None, description="是否永久有效")
    expires_at: Optional[datetime] = Field(None, description="过期时间")
    is_active: Optional[bool] = Field(None, description="是否启用")
    remark: Optional[str] = Field(None, description="备注")


class ApiTokenResponse(ApiTokenBase):
    id: int
    token: str
    is_active: bool
    last_used: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        from_attributes = True


class ApiTokenListResponse(BaseModel):
    id: int
    name: str
    token: str
    is_permanent: bool
    expires_at: Optional[datetime]
    is_active: bool
    last_used: Optional[datetime]
    created_at: datetime
    remark: Optional[str]

    class Config:
        from_attributes = True


class ApiTokenRegenerateResponse(BaseModel):
    id: int
    token: str
    name: str
    
    class Config:
        from_attributes = True