from fastapi import APIRouter
from app.core.dependency import DependApiTokenAuth
from app.models.admin import User
from app.schemas.base import Success

test_api_token_router = APIRouter()


@test_api_token_router.get("/test", summary="测试API Token认证")
async def test_api_token(
    current_user: User = DependApiTokenAuth,
) -> Success:
    """测试API Token认证功能"""
    return Success(
        msg=f"API Token认证成功，当前用户: {current_user.username}",
        data={
            "user_id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        }
    )


@test_api_token_router.get("/profile", summary="获取用户信息")
async def get_user_profile(
    current_user: User = DependApiTokenAuth,
) -> Success:
    """通过API Token获取用户信息"""
    return Success(
        msg="获取用户信息成功",
        data={
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
            "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
        }
    )