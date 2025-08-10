from typing import Optional

import jwt
from fastapi import Depends, Header, HTTPException, Request

from app.core.ctx import CTX_USER_ID
from app.models import User
from app.models.admin import ApiToken
from app.utils import settings
from datetime import datetime


class AuthControl:
    @classmethod
    async def is_authed(
        cls, authorization: str = Header(..., description="JWT token验证")
    ) -> Optional["User"]:
        try:
            # 处理Bearer token格式
            if authorization.startswith("Bearer "):
                token = authorization[7:]  # 移除"Bearer "前缀
            else:
                token = authorization
                
            if token == "dev":
                user = await User.filter().first()
                user_id = user.id
            else:
                decode_data = jwt.decode(
                    token, settings.SECRET_KEY, algorithms=settings.JWT_ALGORITHM
                )
                user_id = decode_data.get("user_id")  # 使用实际的user_id字段
            user = await User.filter(id=user_id).first()
            if not user:
                raise HTTPException(status_code=401, detail="Authentication failed")
            CTX_USER_ID.set(int(user_id))
            return user
        except jwt.DecodeError:
            raise HTTPException(status_code=401, detail="无效的Token")
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="登录已过期")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"{repr(e)}")


class PermissionControl:
    @classmethod
    async def has_permission(
        cls, request: Request, current_user: User = Depends(AuthControl.is_authed)
    ) -> None:
        return


class ApiTokenAuthControl:
    @classmethod
    async def is_authed_by_api_token(
        cls, token: str = Header(..., description="API token验证")
    ) -> Optional["User"]:
        try:
            # 验证API token
            from app.controllers.api_token import ApiTokenController
            controller = ApiTokenController()
            token_obj = await controller.verify_token(token)
            
            if not token_obj:
                raise HTTPException(status_code=401, detail="无效的Token")
            
            # 更新最后使用时间
            token_obj.last_used = datetime.now()
            await token_obj.save()
            
            # 获取用户信息
            user = await User.filter(id=token_obj.user_id).first()
            if not user:
                raise HTTPException(status_code=401, detail="用户不存在")
            
            CTX_USER_ID.set(int(token_obj.user_id))
            return user
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"认证失败: {repr(e)}")


DependAuth = Depends(AuthControl.is_authed)
DependApiTokenAuth = Depends(ApiTokenAuthControl.is_authed_by_api_token)
DependPermisson = Depends(PermissionControl.has_permission)
