from typing import List

from fastapi import APIRouter, HTTPException
from tortoise.exceptions import DoesNotExist

from app.controllers.api_token import api_token_controller
from app.schemas.api_token import (
    ApiTokenCreate,
    ApiTokenUpdate,
    ApiTokenResponse,
    ApiTokenListResponse,
    ApiTokenRegenerateResponse,
)
from app.schemas.base import Success, SuccessExtra
from app.core.dependency import DependPermisson, DependAuth
from app.models.admin import User

api_token_router = APIRouter()


@api_token_router.get("/list", summary="获取API Token列表")
async def get_token_list(
    current_user: User = DependAuth,
    _: None = DependPermisson,
) -> SuccessExtra:
    """获取当前用户的所有API Token"""
    tokens = await api_token_controller.get_user_tokens(current_user.id)
    token_list = []
    for token in tokens:
        token_data = ApiTokenListResponse(
            id=token.id,
            name=token.name,
            token=token.token,
            is_permanent=token.is_permanent,
            expires_at=token.expires_at,
            is_active=token.is_active,
            last_used=token.last_used,
            created_at=token.created_at,
            remark=token.remark
        )
        token_list.append(token_data.model_dump(mode='json'))
    
    return SuccessExtra(data=token_list)


@api_token_router.post("/create", summary="创建API Token")
async def create_token(
    token_data: ApiTokenCreate,
    current_user: User = DependAuth,
    _: None = DependPermisson,
) -> SuccessExtra:
    """创建新的API Token"""
    try:
        token = await api_token_controller.create_token(current_user.id, token_data)
        response_data = ApiTokenResponse(
            id=token.id,
            name=token.name,
            token=token.token,
            is_permanent=token.is_permanent,
            expires_at=token.expires_at,
            is_active=token.is_active,
            last_used=token.last_used,
            created_at=token.created_at,
            updated_at=token.updated_at,
            user_id=token.user_id,
            remark=token.remark
        )
        return SuccessExtra(data=response_data, msg="Token创建成功")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_token_router.post("/regenerate/{token_id}", summary="重新生成Token")
async def regenerate_token(
    token_id: int,
    current_user: User = DependAuth,
    _: None = DependPermisson,
) -> SuccessExtra:
    """重新生成指定的API Token"""
    try:
        token = await api_token_controller.regenerate_token(token_id, current_user.id)
        response_data = ApiTokenRegenerateResponse(
            id=token.id,
            token=token.token,
            name=token.name
        )
        return SuccessExtra(data=response_data, msg="Token重新生成成功")
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Token不存在")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_token_router.put("/update/{token_id}", summary="更新Token信息")
async def update_token(
    token_id: int,
    token_data: ApiTokenUpdate,
    current_user: User = DependAuth,
    _: None = DependPermisson,
) -> Success:
    """更新Token信息"""
    try:
        token = await api_token_controller.get_by_id(token_id)
        if not token or token.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Token不存在")
        
        await api_token_controller.update(token_id, token_data)
        return Success(msg="Token更新成功")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_token_router.post("/toggle/{token_id}", summary="切换Token状态")
async def toggle_token_status(
    token_id: int,
    current_user: User = DependAuth,
    _: None = DependPermisson,
) -> Success:
    """启用或禁用Token"""
    try:
        token = await api_token_controller.toggle_token_status(token_id, current_user.id)
        if not token:
            raise HTTPException(status_code=404, detail="Token不存在")
        
        status = "启用" if token.is_active else "禁用"
        return Success(msg=f"Token已{status}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_token_router.delete("/delete/{token_id}", summary="删除Token")
async def delete_token(
    token_id: int,
    current_user: User = DependAuth,
    _: None = DependPermisson,
) -> Success:
    """删除指定的API Token"""
    try:
        success = await api_token_controller.delete_token(token_id, current_user.id)
        if not success:
            raise HTTPException(status_code=404, detail="Token不存在")
        
        return Success(msg="Token删除成功")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_token_router.post("/create-default", summary="创建默认Token")
async def create_default_token(
    current_user: User = DependAuth,
    _: None = DependPermisson,
) -> SuccessExtra:
    """为当前用户创建默认的永久Token"""
    try:
        token = await api_token_controller.create_default_token(current_user.id)
        response_data = ApiTokenResponse(
            id=token.id,
            name=token.name,
            token=token.token,
            is_permanent=token.is_permanent,
            expires_at=token.expires_at,
            is_active=token.is_active,
            last_used=token.last_used,
            created_at=token.created_at,
            updated_at=token.updated_at,
            user_id=token.user_id,
            remark=token.remark
        )
        return SuccessExtra(data=response_data, msg="默认Token创建成功")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))