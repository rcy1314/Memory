from fastapi import APIRouter
from app.schemas.base import SuccessExtra

router = APIRouter()

@router.get("/health")
def health_check():
    """健康检查端点"""
    return SuccessExtra(data={"status": "ok", "message": "Service is healthy"})

@router.get("/")
def root():
    """根路径检查"""
    return SuccessExtra(data={"message": "Memory App API is running", "version": "1.0.0"})