from tortoise import fields

from .base import BaseModel, TimestampMixin


class User(BaseModel, TimestampMixin):
    username = fields.CharField(max_length=20, unique=True, description="用户名")
    alias = fields.CharField(max_length=30, null=True, description="昵称")
    email = fields.CharField(max_length=255, unique=True, description="邮箱")
    avatar = fields.CharField(max_length=255, unique=True, description="头像地址")
    password = fields.CharField(max_length=128, null=True, description="密码")
    last_login = fields.DatetimeField(null=True, description="最后登录时间")
    remark = fields.JSONField(null=True, description="保留字段")

    class Meta:
        table = "user"

    class PydanticMeta: ...


class Setting(BaseModel, TimestampMixin):
    general = fields.JSONField(description="通用设置")
    meta = fields.JSONField(description="网站设置")
    content = fields.JSONField(description="内容设置")
    storage = fields.JSONField(description="存储设置")

    class Meta:
        table = "setting"


class ApiToken(BaseModel, TimestampMixin):
    name = fields.CharField(max_length=100, description="Token名称")
    token = fields.CharField(max_length=255, unique=True, description="Token值")
    is_permanent = fields.BooleanField(default=False, description="是否永久有效")
    expires_at = fields.DatetimeField(null=True, description="过期时间")
    is_active = fields.BooleanField(default=True, description="是否启用")
    last_used = fields.DatetimeField(null=True, description="最后使用时间")
    user = fields.ForeignKeyField("models.User", related_name="api_tokens", description="所属用户")
    remark = fields.TextField(null=True, description="备注")

    class Meta:
        table = "api_token"
