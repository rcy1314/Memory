# 🚀 Memory 

## docker运行

```
docker run -d \
  --name Memory-Noise \
  --platform linux/amd64 \
  -p 9573:9999 \
  -v /opt/data:/app/data \
  noise233/memory:latest
```



```
docker run -d \
  --name Memory-Noise \
  --platform linux/amd64 \
  -p 1314:9999 \
  -v /Library/Github/Memory/data:/app/data \
  noise233/memory:latest
```

发布

```
docker buildx build --platform linux/amd64,linux/arm64 -t noise233/memory:latest --push --no-cache .
```





#  一键部署指南

## 快速开始

```bash
# 选择你的部署平台，一键部署
./deploy.sh vercel     # 推荐：Vercel (支持Python + 静态文件)
./deploy.sh netlify    # Netlify (Serverless Functions)
./deploy.sh cloudflare # Cloudflare Pages (需要单独部署后端)
./deploy.sh fly        # Fly.io (Docker全栈部署)
```

## 平台对比

| 平台 | 前端 | 后端 | 数据库 | 免费额度 | 推荐度 |
|------|------|------|--------|----------|--------|
| **Vercel** | ✅ | ✅ Python | 外部 | 慷慨 | ⭐⭐⭐⭐⭐ |
| **Netlify** | ✅ | ✅ Functions | 外部 | 良好 | ⭐⭐⭐⭐ |
| **Cloudflare** | ✅ | 需单独部署 | 外部 | 优秀 | ⭐⭐⭐ |
| **Fly.io** | ✅ | ✅ Docker | ✅ 内置 | 有限 | ⭐⭐⭐⭐⭐ |

## 部署前准备

1. **安装依赖**
   ```bash
   # 前端依赖
   cd web && npm install
   
   # 后端依赖
   pip install -r requirements.txt
   ```

2. **环境变量** (可选)
   ```bash
   # 创建 .env 文件
   JWT_SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///./data/db.sqlite3
   ```

3. **安装平台CLI** (按需)
   ```bash
   npm i -g vercel          # Vercel
   npm i -g netlify-cli     # Netlify
   npm i -g wrangler        # Cloudflare
   # Fly.io: https://fly.io/docs/hands-on/install-flyctl/
   ```

## 自动化部署 (GitHub Actions)

推送代码到GitHub后，可以使用GitHub Actions自动部署：

1. 在仓库设置中添加必要的Secrets
2. 手动触发工作流选择部署平台
3. 或推送到main分支自动部署到Vercel

## 故障排除

- **构建失败**: 清理缓存 `rm -rf web/node_modules && cd web && npm install`
- **API不通**: 检查路由配置和CORS设置
- **部署超时**: 尝试手动部署或检查平台状态

## 详细文档

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的部署说明和配置详情。

---

**一键部署，立即上线！** 🎉