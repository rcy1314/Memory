import secrets
import string
from typing import List, Optional
from datetime import datetime, timedelta
from tortoise.exceptions import DoesNotExist

from app.core.crud import CRUDBase
from app.models.admin import ApiToken, User
from app.schemas.api_token import ApiTokenCreate, ApiTokenUpdate


class ApiTokenController(CRUDBase[ApiToken, ApiTokenCreate, ApiTokenUpdate]):
    def __init__(self):
        super().__init__(model=ApiToken)

    def generate_token(self, length: int = 64) -> str:
        """生成随机token"""
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    async def create_token(self, user_id: int, token_data: ApiTokenCreate) -> ApiToken:
        """创建新的API token"""
        # 生成唯一token
        while True:
            token = self.generate_token()
            existing = await ApiToken.filter(token=token).first()
            if not existing:
                break

        # 如果不是永久token，设置过期时间（默认30天）
        expires_at = None
        if not token_data.is_permanent:
            expires_at = datetime.now() + timedelta(days=30)

        token_obj = await ApiToken.create(
            name=token_data.name,
            token=token,
            is_permanent=token_data.is_permanent,
            expires_at=expires_at,
            user_id=user_id,
            remark=token_data.remark
        )
        return token_obj

    async def regenerate_token(self, token_id: int, user_id: int) -> ApiToken:
        """重新生成token"""
        token_obj = await ApiToken.filter(id=token_id, user_id=user_id).first()
        if not token_obj:
            raise DoesNotExist("Token not found")

        # 生成新的token
        while True:
            new_token = self.generate_token()
            existing = await ApiToken.filter(token=new_token).first()
            if not existing:
                break

        token_obj.token = new_token
        token_obj.last_used = None
        await token_obj.save()
        return token_obj

    async def get_user_tokens(self, user_id: int) -> List[ApiToken]:
        """获取用户的所有token"""
        return await ApiToken.filter(user_id=user_id).order_by('-created_at')

    async def verify_token(self, token: str) -> Optional[ApiToken]:
        """验证token是否有效"""
        token_obj = await ApiToken.filter(
            token=token,
            is_active=True
        ).select_related('user').first()
        
        if not token_obj:
            return None

        # 检查是否过期
        if not token_obj.is_permanent and token_obj.expires_at:
            if datetime.now() > token_obj.expires_at:
                return None

        # 更新最后使用时间
        token_obj.last_used = datetime.now()
        await token_obj.save()
        
        return token_obj

    async def delete_token(self, token_id: int, user_id: int) -> bool:
        """删除token"""
        token_obj = await ApiToken.filter(id=token_id, user_id=user_id).first()
        if not token_obj:
            return False
        
        await token_obj.delete()
        return True

    async def toggle_token_status(self, token_id: int, user_id: int) -> Optional[ApiToken]:
        """切换token启用状态"""
        token_obj = await ApiToken.filter(id=token_id, user_id=user_id).first()
        if not token_obj:
            return None
        
        token_obj.is_active = not token_obj.is_active
        await token_obj.save()
        return token_obj

    async def create_default_token(self, user_id: int) -> ApiToken:
        """为用户创建默认的永久token"""
        # 检查是否已有默认token
        existing_default = await ApiToken.filter(
            user_id=user_id,
            name="默认Token",
            is_permanent=True
        ).first()
        
        if existing_default:
            return existing_default

        # 创建默认token
        token_data = ApiTokenCreate(
            name="默认Token",
            is_permanent=True,
            remark="系统自动生成的默认API Token"
        )
        return await self.create_token(user_id, token_data)


api_token_controller = ApiTokenController()