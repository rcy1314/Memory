#!/bin/bash

# Memory 应用一键部署脚本
# 支持本地 Docker 部署

set -e

echo "🚀 Memory 应用一键部署脚本"
echo "================================"

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    echo "访问：https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 未运行，请启动 Docker"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 停止并删除现有容器（如果存在）
echo "🔄 清理现有容器..."
docker stop memory-app 2>/dev/null || true
docker rm memory-app 2>/dev/null || true

# 拉取最新镜像
echo "📥 拉取最新镜像..."
docker pull noise233/memory:latest

# 创建数据卷（如果不存在）
echo "💾 创建数据卷..."
docker volume create memory_data 2>/dev/null || true

# 启动容器
echo "🚀 启动 Memory 应用..."
docker run -d \
  --name memory-app \
  --restart unless-stopped \
  -p 9999:9999 \
  -v memory_data:/app/data \
  -e PORT=9999 \
  -e HOST=0.0.0.0 \
  -e DATABASE_URL=sqlite:///app/data/db.sqlite3 \
  -e CORS_ORIGINS=* \
  noise233/memory:latest

# 等待应用启动
echo "⏳ 等待应用启动..."
sleep 10

# 检查容器状态
if docker ps | grep -q memory-app; then
    echo "✅ Memory 应用启动成功！"
    echo ""
    echo "📱 访问地址：http://localhost:9999"
    echo "🔍 健康检查：http://localhost:9999/api/v1/health"
    echo ""
    echo "📋 管理命令："
    echo "  查看日志：docker logs -f memory-app"
    echo "  停止应用：docker stop memory-app"
    echo "  重启应用：docker restart memory-app"
    echo "  删除应用：docker rm -f memory-app"
    echo ""
    echo "💾 数据备份："
    echo "  备份数据：docker run --rm -v memory_data:/data -v \$(pwd):/backup alpine tar czf /backup/memory-backup-\$(date +%Y%m%d-%H%M%S).tar.gz -C /data ."
    echo ""
else
    echo "❌ 应用启动失败，请查看日志："
    docker logs memory-app
    exit 1
fi

echo "🎉 部署完成！享受使用 Memory 应用吧！"