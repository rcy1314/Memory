from typing import List, Dict, Any, Optional
import asyncio
import json
import hashlib
import hmac
from datetime import datetime, timedelta
from urllib.parse import urlparse

import aiohttp
from tortoise.transactions import in_transaction

from app.utils.logger import logger
from app.schemas.base import SuccessExtra, Fail


class WebhookController:
    """Webhook控制器"""
    
    def __init__(self):
        self.webhooks: Dict[str, Dict[str, Any]] = {}  # webhook_id -> webhook_config
        self.event_queue = asyncio.Queue()
        self.delivery_records: List[Dict[str, Any]] = []
        self.max_records = 1000  # 最大记录数
        self._processing_task = None
        
    async def start_processing(self):
        """启动事件处理任务"""
        if self._processing_task is None or self._processing_task.done():
            self._processing_task = asyncio.create_task(self._process_events())
            
    async def stop_processing(self):
        """停止事件处理任务"""
        if self._processing_task and not self._processing_task.done():
            self._processing_task.cancel()
            try:
                await self._processing_task
            except asyncio.CancelledError:
                pass
                
    async def register_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """注册Webhook"""
        try:
            webhook_id = f"webhook_{len(self.webhooks) + 1}_{int(datetime.now().timestamp())}"
            
            # 验证URL格式
            parsed_url = urlparse(webhook_data["url"])
            if not parsed_url.scheme or not parsed_url.netloc:
                raise ValueError("无效的URL格式")
                
            webhook_config = {
                "id": webhook_id,
                "url": webhook_data["url"],
                "events": webhook_data.get("events", ["blog.created"]),
                "secret": webhook_data.get("secret", ""),
                "active": webhook_data.get("active", True),
                "description": webhook_data.get("description", ""),
                "created_at": datetime.now().isoformat(),
                "last_delivery": None,
                "delivery_count": 0,
                "failure_count": 0
            }
            
            self.webhooks[webhook_id] = webhook_config
            
            # 启动事件处理
            await self.start_processing()
            
            return {
                "webhook_id": webhook_id,
                "config": webhook_config,
                "message": "Webhook注册成功"
            }
            
        except Exception as e:
            logger.error(f"注册Webhook失败: {str(e)}")
            raise Exception(f"注册Webhook失败: {str(e)}")
            
    async def unregister_webhook(self, webhook_id: str) -> Dict[str, Any]:
        """注销Webhook"""
        try:
            if webhook_id not in self.webhooks:
                raise ValueError(f"Webhook {webhook_id} 不存在")
                
            webhook_config = self.webhooks.pop(webhook_id)
            
            return {
                "webhook_id": webhook_id,
                "config": webhook_config,
                "message": "Webhook注销成功"
            }
            
        except Exception as e:
            logger.error(f"注销Webhook失败: {str(e)}")
            raise Exception(f"注销Webhook失败: {str(e)}")
            
    async def list_webhooks(self) -> Dict[str, Any]:
        """获取Webhook列表"""
        try:
            webhooks_list = list(self.webhooks.values())
            
            return {
                "webhooks": webhooks_list,
                "total": len(webhooks_list),
                "active_count": sum(1 for w in webhooks_list if w["active"]),
                "message": "获取Webhook列表成功"
            }
            
        except Exception as e:
            logger.error(f"获取Webhook列表失败: {str(e)}")
            raise Exception(f"获取Webhook列表失败: {str(e)}")
            
    async def trigger_event(self, event_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """触发事件"""
        try:
            event = {
                "id": f"event_{int(datetime.now().timestamp() * 1000)}",
                "type": event_type,
                "data": data,
                "timestamp": datetime.now().isoformat(),
                "delivery_attempts": 0
            }
            
            # 添加到事件队列
            await self.event_queue.put(event)
            
            # 统计匹配的Webhook数量
            matching_webhooks = [
                w for w in self.webhooks.values() 
                if w["active"] and event_type in w["events"]
            ]
            
            return {
                "event_id": event["id"],
                "event_type": event_type,
                "matching_webhooks": len(matching_webhooks),
                "message": f"事件已触发，将通知 {len(matching_webhooks)} 个Webhook"
            }
            
        except Exception as e:
            logger.error(f"触发事件失败: {str(e)}")
            raise Exception(f"触发事件失败: {str(e)}")
            
    async def test_webhook(self, webhook_id: str) -> Dict[str, Any]:
        """测试Webhook"""
        try:
            if webhook_id not in self.webhooks:
                raise ValueError(f"Webhook {webhook_id} 不存在")
                
            webhook = self.webhooks[webhook_id]
            
            # 创建测试事件
            test_event = {
                "id": f"test_{int(datetime.now().timestamp() * 1000)}",
                "type": "webhook.test",
                "data": {
                    "message": "这是一个测试事件",
                    "webhook_id": webhook_id,
                    "timestamp": datetime.now().isoformat()
                },
                "timestamp": datetime.now().isoformat()
            }
            
            # 发送测试请求
            success, response_data = await self._deliver_webhook(webhook, test_event)
            
            return {
                "webhook_id": webhook_id,
                "test_successful": success,
                "response": response_data,
                "message": "测试完成" if success else "测试失败"
            }
            
        except Exception as e:
            logger.error(f"测试Webhook失败: {str(e)}")
            raise Exception(f"测试Webhook失败: {str(e)}")
            
    async def get_delivery_records(self, webhook_id: Optional[str] = None, limit: int = 50) -> Dict[str, Any]:
        """获取投递记录"""
        try:
            records = self.delivery_records
            
            # 按webhook_id过滤
            if webhook_id:
                records = [r for r in records if r.get("webhook_id") == webhook_id]
                
            # 按时间倒序排列并限制数量
            records = sorted(records, key=lambda x: x["timestamp"], reverse=True)[:limit]
            
            return {
                "records": records,
                "total": len(records),
                "webhook_id": webhook_id,
                "message": "获取投递记录成功"
            }
            
        except Exception as e:
            logger.error(f"获取投递记录失败: {str(e)}")
            raise Exception(f"获取投递记录失败: {str(e)}")
            
    async def _process_events(self):
        """处理事件队列"""
        while True:
            try:
                # 等待事件
                event = await self.event_queue.get()
                
                # 找到匹配的Webhook
                matching_webhooks = [
                    w for w in self.webhooks.values() 
                    if w["active"] and event["type"] in w["events"]
                ]
                
                # 并发发送到所有匹配的Webhook
                if matching_webhooks:
                    tasks = [
                        self._deliver_webhook_with_retry(webhook, event)
                        for webhook in matching_webhooks
                    ]
                    await asyncio.gather(*tasks, return_exceptions=True)
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"处理事件失败: {str(e)}")
                
    async def _deliver_webhook_with_retry(self, webhook: Dict[str, Any], event: Dict[str, Any]):
        """带重试的Webhook投递"""
        max_retries = 3
        retry_delays = [1, 5, 15]  # 秒
        
        for attempt in range(max_retries):
            try:
                success, response_data = await self._deliver_webhook(webhook, event)
                
                if success:
                    webhook["last_delivery"] = datetime.now().isoformat()
                    webhook["delivery_count"] += 1
                    break
                else:
                    webhook["failure_count"] += 1
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delays[attempt])
                        
            except Exception as e:
                logger.error(f"Webhook投递失败 (尝试 {attempt + 1}): {str(e)}")
                webhook["failure_count"] += 1
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delays[attempt])
                    
    async def _deliver_webhook(self, webhook: Dict[str, Any], event: Dict[str, Any]) -> tuple[bool, Dict[str, Any]]:
        """投递Webhook"""
        try:
            # 准备请求数据
            payload = {
                "event": event,
                "webhook": {
                    "id": webhook["id"],
                    "url": webhook["url"]
                },
                "timestamp": datetime.now().isoformat()
            }
            
            payload_json = json.dumps(payload, ensure_ascii=False)
            
            # 生成签名
            headers = {
                "Content-Type": "application/json",
                "User-Agent": "Memory-Webhook/1.0"
            }
            
            if webhook["secret"]:
                signature = hmac.new(
                    webhook["secret"].encode(),
                    payload_json.encode(),
                    hashlib.sha256
                ).hexdigest()
                headers["X-Memory-Signature"] = f"sha256={signature}"
                
            # 发送HTTP请求
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
                async with session.post(
                    webhook["url"],
                    data=payload_json,
                    headers=headers
                ) as response:
                    response_text = await response.text()
                    
                    # 记录投递结果
                    delivery_record = {
                        "id": f"delivery_{int(datetime.now().timestamp() * 1000)}",
                        "webhook_id": webhook["id"],
                        "event_id": event["id"],
                        "event_type": event["type"],
                        "url": webhook["url"],
                        "status_code": response.status,
                        "response_body": response_text[:1000],  # 限制响应长度
                        "success": 200 <= response.status < 300,
                        "timestamp": datetime.now().isoformat(),
                        "duration_ms": 0  # 简化处理
                    }
                    
                    # 添加到记录列表
                    self.delivery_records.append(delivery_record)
                    
                    # 保持记录数量限制
                    if len(self.delivery_records) > self.max_records:
                        self.delivery_records = self.delivery_records[-self.max_records:]
                        
                    return delivery_record["success"], {
                        "status_code": response.status,
                        "response_body": response_text[:200]
                    }
                    
        except Exception as e:
            # 记录失败的投递
            delivery_record = {
                "id": f"delivery_{int(datetime.now().timestamp() * 1000)}",
                "webhook_id": webhook["id"],
                "event_id": event["id"],
                "event_type": event["type"],
                "url": webhook["url"],
                "status_code": 0,
                "response_body": str(e),
                "success": False,
                "timestamp": datetime.now().isoformat(),
                "duration_ms": 0
            }
            
            self.delivery_records.append(delivery_record)
            
            if len(self.delivery_records) > self.max_records:
                self.delivery_records = self.delivery_records[-self.max_records:]
                
            return False, {"error": str(e)}