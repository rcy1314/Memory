#!/bin/bash
set -e

# 确保数据目录存在并有正确权限
if [ ! -d "/app/data" ]; then
    mkdir -p /app/data
fi

# 设置数据目录权限
chmod 777 /app/data

# 如果数据库文件不存在，创建一个空文件以确保应用可以正常初始化
if [ ! -f "/app/data/db.sqlite3" ]; then
    touch /app/data/db.sqlite3
    chmod 666 /app/data/db.sqlite3
fi

echo "数据目录初始化完成"
echo "启动应用..."

# 启动应用
exec "$@"