# Memory-不负时光摄影相册

![1754074172331](https://s2.loli.net/2025/08/02/EjIZ1X6MSHqUlTD.png)

![1754089150106](https://s2.loli.net/2025/08/02/o51PLHecODG9fZQ.png)

## 简介

一个全屏瀑布流摄影图库程序，它是基于[Moment](https://github.com/Robert-Stackflow/Moment)二次开发的，基于[vue-fastapi-admin](https://github.com/mizhexiaoxiao/vue-fastapi-admin)使用 Vue+FastAPI 开发

演示：https://memory.noisework.cn

## 特征

- 支持 linux/amd64 和 linux/arm64 两个平台
- 支持本地、S3/R2三种oss存储上传方式
- 支持多种数据库的选择连接，支持一键迁移，一键备份本地数据库
- 自适应瀑布流布局，参考pinterest
- 支持首页多张封面大图的自定义设置

## 加载特性

## 缩略图后缀优化
- 系统支持配置 thumbnail_suffix 参数，会自动在原图URL后添加缩略图后缀
- 如果配置了缩略图后缀，封面会使用 image.image_url + thumbnail_suffix 的优化版本
- 如果没有配置后缀，则直接使用原图URL
## 响应式尺寸优化
封面图片会根据设备类型和网络状况动态调整参数：

移动端优化：

- 尺寸：180×250像素
- 质量：慢网络30%，正常网络40%
- URL参数： w=180&h=250&fit=crop&auto=compress,format&q=30-40
平板端优化：

- 尺寸：250×350像素
- 质量：慢网络35%，正常网络45%
- URL参数： w=250&h=350&fit=crop&auto=compress,format&q=35-45
桌面端优化：

- 尺寸：200×280像素
- 质量：慢网络35%，正常网络45%
- URL参数： w=200&h=280&fit=crop&auto=compress,format&q=35-45
## 智能加载策略
- 懒加载 ：使用 IntersectionObserver 实现视口内才加载
- 并发控制 ：限制同时加载的图片数量，避免网络拥塞
- 预加载 ：优先加载前4-6张封面图片
- 错误处理 ：加载失败时自动回退到原图
- 格式优化 ：自动转换为WebP等现代格式
## 性能优化特性
- 硬件加速 ：使用 transform: translateZ(0) 启用GPU加速
- 渐进式加载 ：显示加载动画和进度提示
- 缓存机制 ：避免重复加载相同图片
- 网络检测 ：根据3G/4G/WiFi调整加载策略

![1754074193119](https://s2.loli.net/2025/08/02/NnOJshlFMT3iEoC.png)

## 前后端运行

前端：web目录下`npm run dev`

后端：`python run.py`

## docker运行

```
docker run -d \
  --name memory \
  --platform linux/amd64 \
  -p 4314:9999 \
  --add-host host.docker.internal:host-gateway \
  -e DB_HOST=host.docker.internal \
  -e EXTERNAL_DB_HOST=host.docker.internal \
  -e TZ=Asia/Shanghai \
  noise233/memory:latest
```

如果你想挂载本地数据库文件，比如：

```
docker run -d \
  --name memory \
  --platform linux/amd64 \
  -p 4314:9999 \
  -v /www/wwwroot/memory.noisework.cn/data:/app/data \
  --add-host host.docker.internal:host-gateway \
  -e DB_HOST=host.docker.internal \
  -e EXTERNAL_DB_HOST=host.docker.internal \
  -e TZ=Asia/Shanghai \
  noise233/memory:latest
```

连接 Neon 数据库的 Docker 运行命令

```
docker run -d \
  --name memory \
  --platform linux/amd64 \
  -p 4314:9999 \
  -e DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require" \
  -e TZ=Asia/Shanghai \
  noise233/memory:latest
```

## docker-compose

由于桌面版和docker后端api有冲突，docker请使用/api/v1，如果你想自己构建docker：

`web/.env.productuon`请修改为

```
# 资源公共路径,需要以 /开头和结尾
VITE_PUBLIC_PATH = '/'

# 是否启用代理
VITE_USE_PROXY = true

# base api
VITE_BASE_API = '/api/v1'
```

`web/.env.development`请修改为

```
# Docker环境下的前端配置
# 资源公共路径,需要以 /开头和结尾
VITE_PUBLIC_PATH = '/'

# 是否启用代理 - Docker环境下不需要代理
VITE_USE_PROXY = false

# base api - Docker环境下使用相对路径
VITE_BASE_API = '/api/v1'
```

然后运行

```
docker-compose up -d
```

## 🚀 一键部署

### 本地快速部署

```bash
# 使用一键部署脚本
./deploy.sh
```

### 云平台部署

我们支持多种云平台的一键部署，详细说明请查看：

📖 **[完整部署指南](./DEPLOYMENT.md)**

支持的平台：
- [Zeabur](https://zeabur.com) - 使用 `zeabur.json`
- [Fly.io](https://fly.io) - 使用 `fly.toml`
- [Railway](https://railway.app) - 使用 `railway.json`
- [Render](https://render.com) - 使用 `render.yaml`
- Docker / Docker Compose - 本地部署

发布

```
docker buildx build --platform linux/amd64,linux/arm64 -t noise233/memory:latest --push --no-cache .
```

Podman（替代Docker）

```
podman manifest create noise233/memory:latest
podman build --platform linux/amd64 --manifest noise233/memory:latest .
podman build --platform linux/arm64 --manifest noise233/memory:latest .
podman manifest push noise233/memory:latest
```

```
podman manifest create noise233/memory:dev
podman build --platform linux/amd64 --manifest noise233/memory:dev .
podman build --platform linux/arm64 --manifest noise233/memory:dev .
podman manifest push noise233/memory:dev
```



## 使用

- 使用`<服务器IP地址>:9999`或`域名`访问相册
- 后台管理：`<服务器IP地址>:9999/admin/`或`<域名>/admin`
- 默认管理员账号：`admin`，密码：`123456`，请登录后及时修改用户名和密码

![1754122928815](https://s2.loli.net/2025/08/02/md7fpJsbanRZGP1.png)

## 更新

- 增加多平台数据库连接及一键迁移

![1754070550620](https://s2.loli.net/2025/08/02/U3nYiH7h8aGS6bE.png)

- 增加用户token设置，目前认证方式：JWT token+API token

![1754073880268](https://s2.loli.net/2025/08/02/5V7cSFgkRMzyBfv.png)

- 增加批量上传案例脚本
- 优化手机端渲染速度及布局
- 优化首页缓存逻辑，浏览器默认24小时内缓存
- 添加载入动画及提示弹窗
- 增加本地上传和备份功能

------

## 后台预览

![1754126989821](https://s2.loli.net/2025/08/02/9Zz4ekyiqlYJFRD.png)

![1754127006714](https://s2.loli.net/2025/08/02/sWHKwyJu7kVqI5A.png)

## 🔨 构建说明

### 桌面应用构建

本项目支持构建为桌面应用程序，基于 Tauri 框架开发。

#### 环境要求

**通用要求：**

- Node.js 16+ 
- npm 或 yarn
- Rust 1.70+

**Windows 构建要求：**

- Windows 10/11
- Microsoft C++ Build Tools 或 Visual Studio 2019/2022
- Windows SDK

**macOS 构建要求：**

- macOS 10.15+
- Xcode Command Line Tools

**Linux 构建要求：**

- Ubuntu 18.04+ / Debian 10+ / Fedora 32+ 等
- 系统开发工具包

#### 构建步骤

1. **安装依赖**

   ```bash
   # 进入前端目录
   cd web
   
   # 安装 Node.js 依赖
   npm install
   
   # 安装 Tauri CLI
   npm install -g @tauri-apps/cli
   ```

2. **开发模式运行**

   ```bash
   # 启动开发服务器
   npm run tauri dev
   ```

3. **生产构建**

   ```bash
   # 构建桌面应用
   npm run tauri build
   ```

#### Windows 平台构建

**环境配置：**

1. **安装 Rust**

   ```powershell
   # 下载并安装 Rust
   # 访问 https://rustup.rs/ 下载安装程序
   # 或使用 winget
   winget install Rustlang.Rustup
   ```

2. **安装 Microsoft C++ Build Tools**

   ```powershell
   # 使用 winget 安装
   winget install Microsoft.VisualStudio.2022.BuildTools
   
   # 或下载 Visual Studio Installer
   # 选择 "C++ build tools" 工作负载
   ```

3. **安装 Windows SDK**

   ```powershell
   # 通过 Visual Studio Installer 安装
   # 或使用 winget
   winget install Microsoft.WindowsSDK
   ```

**构建命令：**

```powershell
# 进入项目目录
cd web

# 安装依赖
npm install

# 构建 Windows 应用
npm run tauri build

# 构建特定目标（可选）
npm run tauri build -- --target x86_64-pc-windows-msvc
```

**输出文件位置：**

- 可执行文件：`web/src-tauri/target/release/memory-app.exe`
- 安装包：`web/src-tauri/target/release/bundle/msi/Memory-不负时光相册程序_1.0.0_x64_en-US.msi`
- 便携版：`web/src-tauri/target/release/bundle/nsis/Memory-不负时光相册程序_1.0.0_x64-setup.exe`

#### macOS 平台构建

```bash
# 进入项目目录
cd web

# 安装依赖
npm install

# 构建 macOS 应用
npm run tauri build

# 构建特定架构（可选）
npm run tauri build -- --target aarch64-apple-darwin  # Apple Silicon
npm run tauri build -- --target x86_64-apple-darwin   # Intel Mac
```

**输出文件位置：**

- 应用包：`web/src-tauri/target/release/bundle/macos/Memory-不负时光相册程序.app`
- DMG 安装包：`web/src-tauri/target/release/bundle/dmg/Memory-不负时光相册程序_1.0.0_aarch64.dmg`

#### Linux 平台构建

```bash
# 安装系统依赖（Ubuntu/Debian）
sudo apt update
sudo apt install -y libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev

# 安装系统依赖（Fedora）
sudo dnf install webkit2gtk3-devel openssl-devel curl wget libappindicator-gtk3-devel librsvg2-devel

# 进入项目目录
cd web

# 安装依赖
npm install

# 构建 Linux 应用
npm run tauri build
```

**输出文件位置：**

- 可执行文件：`web/src-tauri/target/release/memory-app`
- AppImage：`web/src-tauri/target/release/bundle/appimage/memory-app_1.0.0_amd64.AppImage`
- DEB 包：`web/src-tauri/target/release/bundle/deb/memory-app_1.0.0_amd64.deb`

#### 跨平台构建

如需在一个平台上构建多个平台的应用，可以使用 GitHub Actions 或其他 CI/CD 服务。

#### 🚀 GitHub Actions 自动构建

本项目已配置 GitHub Actions 工作流，支持自动构建多平台桌面应用：

**工作流文件：**
- `.github/workflows/build-windows.yml` - 专门构建 Windows 平台
- `.github/workflows/build-multiplatform.yml` - 构建所有平台（Windows、macOS、Linux）

**触发方式：**
```bash
# 1. 推送代码自动构建
git push origin main

# 2. 创建标签自动发布
git tag v1.0.0
git push origin v1.0.0

# 3. 手动触发（在 GitHub Actions 页面）
```

**构建产物：**
- **Windows**: MSI 安装包、NSIS 便携版、可执行文件
- **macOS**: DMG 安装包、.app 应用包（Universal Binary）
- **Linux**: AppImage、DEB 包、可执行文件

**配置要求：**

在 GitHub 仓库设置中添加以下 Secrets（可选）：
- `TAURI_PRIVATE_KEY`: Tauri 应用签名私钥
- `TAURI_KEY_PASSWORD`: 私钥密码

**使用方法：**
1. Fork 本仓库到你的 GitHub 账户
2. 推送代码或创建标签
3. 在 Actions 页面查看构建进度
4. 从 Artifacts 或 Releases 下载构建产物

详细说明请查看：[GitHub Actions 构建指南](.github/workflows/README.md)

**手动构建示例：**
```yaml
# .github/workflows/build.yml 示例
name: Build Desktop App

on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-20.04, windows-latest]
    
    runs-on: ${{ matrix.platform }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        
      - name: Install dependencies (Ubuntu)
        if: matrix.platform == 'ubuntu-20.04'
        run: |
          sudo apt update
          sudo apt install -y libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
          
      - name: Install frontend dependencies
        run: |
          cd web
          npm install
          
      - name: Build Tauri app
        run: |
          cd web
          npm run tauri build
```

#### 构建配置

构建配置文件位于 `web/src-tauri/tauri.conf.json`，可以自定义：

- 应用名称和版本
- 图标和资源
- 窗口设置
- 构建目标
- 安装包类型

#### 故障排除

**常见问题：**

1. **Rust 编译错误**

   ```bash
   # 更新 Rust 工具链
   rustup update
   
   # 清理构建缓存
   cd web/src-tauri
   cargo clean
   ```

2. **Windows 构建失败**

   - 确保安装了正确版本的 Visual Studio Build Tools
   - 检查 Windows SDK 是否正确安装
   - 尝试以管理员身份运行命令

3. **依赖安装失败**

   ```bash
   # 清理 npm 缓存
   npm cache clean --force
   
   # 删除 node_modules 重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

## 其它

[Docker 环境下外部数据库连接配置指南](https://github.com/rcy1314/Memory/blob/main/DOCKER_DATABASE_SETUP.md)

二次开发时请注意该项目使用v-model:value语法编写

运行docker时web目录下的env.production端口必须和docker-compose.yml下的端口一致

## To do

- [ ] 完善api-token机制
- [ ] 增加组件效果
