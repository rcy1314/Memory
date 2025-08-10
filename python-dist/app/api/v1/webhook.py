from typing import List, Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.dependency import DependApiTokenAuth
from app.controllers.webhook_controller import WebhookController
from app.schemas.base import SuccessExtra, Fail
from app.utils.logger import logger

webhook_router = APIRouter()
webhook_controller = WebhookController()


class WebhookConfigModel(BaseModel):
    """Webhook配置模型"""
    url: str = Field(..., description="Webhook URL")
    events: List[str] = Field(default=["blog.created"], description="订阅的事件类型")
    secret: Optional[str] = Field(None, description="用于签名验证的密钥")
    active: bool = Field(True, description="是否激活")
    description: Optional[str] = Field(None, description="描述")


class TriggerEventRequest(BaseModel):
    """触发事件请求模型"""
    event_type: str = Field(..., description="事件类型")
    data: Dict[str, Any] = Field(..., description="事件数据")


@webhook_router.post("/register", summary="注册Webhook")
async def register_webhook(
    config: WebhookConfigModel,
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """注册新的Webhook"""
    try:
        result = await webhook_controller.register_webhook(config.model_dump())
        return SuccessExtra(data=result)
        
    except Exception as e:
        logger.error(f"注册Webhook失败: {str(e)}")
        return Fail(msg=f"注册Webhook失败: {str(e)}")


@webhook_router.delete("/unregister/{webhook_id}", summary="注销Webhook")
async def unregister_webhook(
    webhook_id: str,
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """注销指定的Webhook"""
    try:
        result = await webhook_controller.unregister_webhook(webhook_id)
        return SuccessExtra(data=result)
        
    except Exception as e:
        logger.error(f"注销Webhook失败: {str(e)}")
        return Fail(msg=f"注销Webhook失败: {str(e)}")


@webhook_router.get("/list", summary="获取Webhook列表")
async def list_webhooks(
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """获取所有已注册的Webhook列表"""
    try:
        result = await webhook_controller.list_webhooks()
        return SuccessExtra(data=result)
        
    except Exception as e:
        logger.error(f"获取Webhook列表失败: {str(e)}")
        return Fail(msg=f"获取Webhook列表失败: {str(e)}")


@webhook_router.post("/trigger", summary="手动触发事件")
async def trigger_event(
    request: TriggerEventRequest,
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """手动触发Webhook事件"""
    try:
        result = await webhook_controller.trigger_event(request.event_type, request.data)
        return SuccessExtra(data=result)
        
    except Exception as e:
        logger.error(f"触发事件失败: {str(e)}")
        return Fail(msg=f"触发事件失败: {str(e)}")


@webhook_router.post("/test/{webhook_id}", summary="测试Webhook")
async def test_webhook(
    webhook_id: str,
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """测试指定的Webhook"""
    try:
        result = await webhook_controller.test_webhook(webhook_id)
        return SuccessExtra(data=result)
        
    except Exception as e:
        logger.error(f"测试Webhook失败: {str(e)}")
        return Fail(msg=f"测试Webhook失败: {str(e)}")


@webhook_router.get("/deliveries", summary="获取投递记录")
async def get_delivery_records(
    webhook_id: Optional[str] = None,
    limit: int = 50,
    _: None = DependApiTokenAuth
) -> SuccessExtra:
    """获取Webhook投递记录"""
    try:
        result = await webhook_controller.get_delivery_records(webhook_id, limit)
        return SuccessExtra(data=result)
        
    except Exception as e:
        logger.error(f"获取投递记录失败: {str(e)}")
        return Fail(msg=f"获取投递记录失败: {str(e)}")


# 辅助函数：触发Webhook事件（供其他模块调用）
async def trigger_webhook_event(event_type: str, data: Dict[str, Any]):
    """触发Webhook事件的辅助函数"""
    try:
        await webhook_controller.trigger_event(event_type, data)
    except Exception as e:
        logger.error(f"触发Webhook事件失败: {str(e)}")