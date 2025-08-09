# 桌面版独立运行说明

## 概述

本项目的桌面版现已支持完全独立运行，内置了完整的前后端环境，无需用户单独安装Python或其他依赖。

## 技术实现

### 1. Python运行时打包

- 使用 `prepare_python_dist.py` 脚本创建独立的Python运行时环境
- 将Python解释器、pip和所有依赖库打包到 `python-dist` 目录
- 支持Windows、macOS和Linux多平台

### 2. Tauri配置优化

在 `web/src-tauri/tauri.conf.json` 中：
- 添加了 `python-dist/**/*` 资源打包
- 配置了外部二进制文件引用
- 确保所有必要文件都被包含在最终应用中

### 3. 后端自动启动

在 `web/src-tauri/src/main.rs` 中实现：
- 应用启动时自动检测并启动Python后端
- 智能路径检测，支持开发和生产环境
- 自动设置PYTHONPATH环境变量
- 后台进程管理，确保后端服务稳定运行

### 4. 构建流程优化

在 `.github/workflows/build-multiplatform.yml` 中：
- 构建前自动准备Python分发包
- 确保所有依赖都被正确打包
- 支持多平台并行构建

## 目录结构

```
Memory/
├── python-dist/                 # Python运行时分发包
│   ├── bin/
│   │   ├── python3             # Python解释器
│   │   ├── pip3                # pip包管理器
│   │   └── python_launcher.py  # Python启动脚本
│   ├── lib/
│   │   └── site-packages/      # Python依赖库
│   └── venv/                   # 虚拟环境（构建时使用）
├── app/                        # FastAPI后端代码
├── web/                        # Vue.js前端代码
│   └── src-tauri/             # Tauri桌面应用配置
└── data/                      # 数据库和用户数据
```

## 使用方法

### 开发环境

1. 准备Python分发包：
   ```bash
   python3 prepare_python_dist.py
   ```

2. 构建前端：
   ```bash
   cd web
   npm install
   npm run build
   ```

3. 运行桌面应用：
   ```bash
   npm run tauri:dev
   ```

### 生产构建

1. 使用GitHub Actions自动构建：
   - 推送代码到main分支
   - Actions会自动构建多平台版本
   - 下载构建产物即可使用

2. 本地构建：
   ```bash
   python3 prepare_python_dist.py
   cd web
   npm install
   npm run tauri:build
   ```

## 特性

### ✅ 完全独立运行
- 无需用户安装Python
- 无需用户安装任何依赖
- 一键启动，自动运行前后端

### ✅ 跨平台支持
- Windows (x64)
- macOS (Universal)
- Linux (x64)

### ✅ 自动化构建
- GitHub Actions自动构建
- 多平台并行构建
- 自动发布Release

### ✅ 智能路径检测
- 开发环境和生产环境自适应
- 支持不同的应用包结构
- 自动创建必要目录

## 故障排除

### 后端启动失败

1. 检查Python分发包是否存在：
   ```
   python-dist/bin/python3
   python-dist/lib/site-packages/
   ```

2. 查看应用日志，确认路径检测是否正确

3. 手动测试Python环境：
   ```bash
   ./python-dist/bin/python3 run.py
   ```

### 依赖缺失

1. 重新生成Python分发包：
   ```bash
   rm -rf python-dist
   python3 prepare_python_dist.py
   ```

2. 检查requirements.txt是否包含所有必要依赖

### 构建失败

1. 确保所有依赖都已安装
2. 检查Tauri配置文件语法
3. 查看GitHub Actions构建日志

## 更新说明

- v2.0.0: 实现完全独立运行
- 支持Python运行时打包
- 优化启动流程和错误处理
- 改进跨平台兼容性

## 技术细节

### Python环境隔离

使用虚拟环境技术确保：
- 依赖版本一致性
- 避免系统Python冲突
- 便于版本管理和更新

### 进程管理

- 后端进程在独立线程中启动
- 应用退出时自动清理后端进程
- 异常处理和重启机制

### 资源优化

- 只打包必要的Python库
- 压缩和优化应用体积
- 智能缓存机制