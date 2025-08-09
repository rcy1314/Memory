#!/bin/bash

# 快速桌面版测试脚本
# 用于快速构建和测试桌面版的独立运行功能

set -e

echo "🚀 开始桌面版独立运行测试..."

# 检查Python环境
echo "📋 检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装Python3"
    exit 1
fi

echo "✅ Python版本: $(python3 --version)"

# 检查Node.js环境
echo "📋 检查Node.js环境..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装Node.js"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 检查Rust环境
echo "📋 检查Rust环境..."
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust 未安装，请先安装Rust"
    exit 1
fi

echo "✅ Rust版本: $(rustc --version)"

# 安装Python依赖
echo "📦 安装Python依赖..."
pip3 install -r requirements.txt

# 准备Python分发包
echo "🐍 准备Python分发包..."
python3 prepare_python_dist.py

# 测试Python分发包
echo "🧪 测试Python分发包..."
python3 test_python_dist.py

# 进入web目录
cd web

# 安装前端依赖
echo "📦 安装前端依赖..."
npm install

# 构建前端
echo "🏗️  构建前端..."
npm run build

# 构建桌面应用
echo "🖥️  构建桌面应用..."
npm run tauri:build:no-python

echo "🎉 桌面版构建完成！"
echo ""
echo "📁 构建产物位置:"
echo "   macOS: src-tauri/target/release/bundle/dmg/"
echo "   Windows: src-tauri/target/release/bundle/nsis/"
echo "   Linux: src-tauri/target/release/bundle/deb/"
echo ""
echo "🚀 可以直接运行构建的应用，无需额外安装任何依赖！"