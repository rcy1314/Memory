# Memory 应用部署指南

本指南将帮助您将 Memory 应用部署到各种容器化平台。我们已经发布了多架构 Docker 镜像 `noise233/memory:latest`，支持 `linux/amd64` 和 `linux/arm64` 架构。

## 🚀 一键部署平台

### 1. Zeabur 部署

**步骤：**
1. 访问 [Zeabur.com](https://zeabur.com)
2. 创建新项目
3. 选择 "Deploy from Image"
4. 使用镜像：`noise233/memory:latest`
5. 或者上传项目中的 `zeabur.json` 配置文件

**配置要点：**
- 端口：9999
- 环境变量：参考 `zeabur.json`
- 持久化存储：挂载 `/app/data` 目录

### 2. Fly.io 部署

**步骤：**
1. 安装 Fly CLI：`curl -L https://fly.io/install.sh | sh`
2. 登录：`flyctl auth login`
3. 在项目根目录运行：`flyctl launch`
4. 使用项目中的 `fly.toml` 配置文件
5. 创建存储卷：`flyctl volumes create memory_data --size 1`
6. 部署：`flyctl deploy`

**配置要点：**
- 使用 `fly.toml` 配置文件
- 自动 HTTPS 支持
- 支持自动休眠和唤醒

### 3. Railway 部署

**步骤：**
1. 访问 [Railway.app](https://railway.app)
2. 连接 GitHub 仓库或选择 "Deploy from Image"
3. 使用镜像：`noise233/memory:latest`
4. 上传 `railway.json` 配置文件
5. 配置环境变量

**配置要点：**
- 自动 HTTPS 和域名
- 内置监控和日志
- 支持多种数据库

### 4. Render 部署

**步骤：**
1. 访问 [Render.com](https://render.com)
2. 创建新的 Web Service
3. 选择 "Deploy an existing image"
4. 使用镜像：`noise233/memory:latest`
5. 或者连接 GitHub 仓库并使用 `render.yaml`

**配置要点：**
- 免费套餐可用
- 自动 SSL 证书
- 支持持久化磁盘

## 🐳 Docker 部署

### 直接运行

```bash
# 拉取镜像
docker pull noise233/memory:latest

# 运行容器
docker run -d \
  --name memory-app \
  -p 9999:9999 \
  -v memory_data:/app/data \
  -e PORT=9999 \
  -e HOST=0.0.0.0 \
  -e DATABASE_URL=sqlite:///app/data/db.sqlite3 \
  -e CORS_ORIGINS=* \
  noise233/memory:latest
```

### 使用现有的 Docker Compose

项目中已包含 `docker-compose.yml` 文件，可以直接使用：

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## ⚙️ 环境变量配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | 9999 | 应用监听端口 |
| `HOST` | 0.0.0.0 | 应用监听地址 |
| `DATABASE_URL` | sqlite:///app/data/db.sqlite3 | 数据库连接字符串 |
| `CORS_ORIGINS` | * | CORS 允许的源 |
| `SECRET_KEY` | 自动生成 | JWT 密钥（生产环境建议设置） |

## 📁 数据持久化

**重要：** 确保挂载 `/app/data` 目录以保持数据持久化：

- SQLite 数据库文件：`/app/data/db.sqlite3`
- 上传的图片文件：`/app/data/uploads/`
- 应用日志：`/app/data/logs/`

## 🔧 健康检查

应用提供健康检查端点：
- URL：`/api/v1/health`
- 方法：GET
- 返回：JSON 格式的健康状态

## 🌐 访问应用

部署成功后，您可以通过以下方式访问：

- **本地部署：** http://localhost:9999
- **云平台：** 使用平台提供的域名

## 📝 注意事项

1. **首次访问：** 应用会显示首次访问弹窗，包含缓存加载提示
2. **数据备份：** 定期备份 `/app/data` 目录
3. **安全性：** 生产环境建议设置强密码和 HTTPS
4. **性能：** 根据访问量调整容器资源配置

## 🆘 故障排除

### 常见问题

1. **端口冲突：** 确保端口 9999 未被占用
2. **权限问题：** 确保容器有写入 `/app/data` 的权限
3. **内存不足：** 建议至少分配 512MB 内存

### 查看日志

```bash
# Docker 容器日志
docker logs memory-app

# Docker Compose 日志
docker-compose logs memory-app
```

## 📞 支持

如果遇到问题，请：
1. 检查容器日志
2. 确认环境变量配置
3. 验证网络和端口设置
4. 提交 GitHub Issue

---

**祝您部署顺利！** 🎉