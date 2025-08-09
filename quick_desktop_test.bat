@echo off
setlocal enabledelayedexpansion

REM 快速桌面版测试脚本 (Windows版本)
REM 用于快速构建和测试桌面版的独立运行功能

echo 🚀 开始桌面版独立运行测试...

REM 检查Python环境
echo 📋 检查Python环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 未安装，请先安装Python
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python版本: !PYTHON_VERSION!

REM 检查Node.js环境
echo 📋 检查Node.js环境...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安装，请先安装Node.js
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ Node.js版本: !NODE_VERSION!
echo ✅ npm版本: !NPM_VERSION!

REM 检查Rust环境
echo 📋 检查Rust环境...
cargo --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Rust 未安装，请先安装Rust
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('rustc --version') do set RUST_VERSION=%%i
echo ✅ Rust版本: !RUST_VERSION!

REM 安装Python依赖
echo 📦 安装Python依赖...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Python依赖安装失败
    pause
    exit /b 1
)

REM 准备Python分发包
echo 🐍 准备Python分发包...
python prepare_python_dist.py
if errorlevel 1 (
    echo ❌ Python分发包准备失败
    pause
    exit /b 1
)

REM 测试Python分发包
echo 🧪 测试Python分发包...
python test_python_dist.py
if errorlevel 1 (
    echo ❌ Python分发包测试失败
    pause
    exit /b 1
)

REM 进入web目录
cd web

REM 安装前端依赖
echo 📦 安装前端依赖...
npm install
if errorlevel 1 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)

REM 构建前端
echo 🏗️  构建前端...
npm run build
if errorlevel 1 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)

REM 构建桌面应用
echo 🖥️  构建桌面应用...
npm run tauri:build:no-python
if errorlevel 1 (
    echo ❌ 桌面应用构建失败
    pause
    exit /b 1
)

echo 🎉 桌面版构建完成！
echo.
echo 📁 构建产物位置:
echo    Windows: src-tauri\target\release\bundle\nsis\
echo.
echo 🚀 可以直接运行构建的应用，无需额外安装任何依赖！
echo.
pause