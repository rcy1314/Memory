#!/bin/bash
set -e

echo "开始初始化数据目录..."

# 确保数据目录存在并有正确权限
if [ ! -d "/app/data" ]; then
    echo "创建数据目录: /app/data"
    mkdir -p /app/data
else
    echo "数据目录已存在: /app/data"
fi

# 设置数据目录权限
chmod 755 /app/data
echo "设置数据目录权限: 755"

# 检查数据库文件
if [ ! -f "/app/data/db.sqlite3" ]; then
    echo "数据库文件不存在，创建空文件: /app/data/db.sqlite3"
    touch /app/data/db.sqlite3
    chmod 644 /app/data/db.sqlite3
    echo "设置数据库文件权限: 644"
else
    echo "数据库文件已存在: /app/data/db.sqlite3"
    # 确保现有文件有正确权限
    chmod 644 /app/data/db.sqlite3
fi

# 显示目录状态
echo "数据目录状态:"
ls -la /app/data/

echo "数据目录初始化完成"

# 运行数据库迁移
echo "运行数据库迁移..."
python -m migrations.migrations_001
echo "数据库迁移完成"

echo "启动应用..."

# 启动应用
exec "$@"