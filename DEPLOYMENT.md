# 🚀 Memory App 部署指南

本项目支持一键部署到多个主流云平台，包括前后端的完整部署。

## 📋 项目架构

- **后端**: FastAPI + Python 3.11
- **前端**: Vue 3 + Vite
- **数据库**: SQLite (可配置其他数据库)
- **部署方式**: 前后端分离 + 静态文件服务

## 🎯 支持的部署平台

### 1. Vercel (推荐)

**特点**: 支持Python后端 + 静态前端，自动HTTPS，全球CDN

```bash
# 一键部署
./deploy.sh vercel

# 或手动部署
npm i -g vercel
cd web && npm install && npm run build && cd ..
vercel --prod
```

**配置文件**: `vercel.json`
- 自动构建前端并输出到 `/dist`
- 后端API路由: `/api/*`
- 前端路由: `/*`

### 2. Netlify

**特点**: 静态站点 + Serverless Functions，免费额度丰富

```bash
# 一键部署
./deploy.sh netlify

# 或手动部署
npm i -g netlify-cli
pip install mangum  # ASGI适配器
cd web && npm install && npm run build && cd ..
netlify deploy --prod --dir=dist --functions=netlify/functions
```

**配置文件**: `netlify.toml`, `netlify/functions/api.py`
- 前端构建输出到 `/dist`
- 后端通过Netlify Functions运行
- 需要安装 `mangum` 适配器

### 3. Cloudflare Pages

**特点**: 全球边缘网络，超快访问速度

```bash
# 一键部署
./deploy.sh cloudflare

# 或手动部署
npm i -g wrangler
cd web && npm install && npm run build && cd ..
wrangler pages publish dist --project-name=memory-app
```

**配置文件**: `wrangler.toml`, `functions/api.js`
- 前端部署到Cloudflare Pages
- 后端需要单独部署到Cloudflare Workers或其他服务
- 提供了API代理函数

### 4. Fly.io (全栈推荐)

**特点**: 支持Docker，真正的全栈部署，包含数据库

```bash
# 一键部署
./deploy.sh fly

# 或手动部署
# 安装flyctl: https://fly.io/docs/hands-on/install-flyctl/
flyctl apps create memory-app
flyctl deploy --dockerfile Dockerfile.fly
```

**配置文件**: `fly.toml`, `Dockerfile.fly`
- 多阶段Docker构建
- 自动构建前端并集成到后端
- 支持数据库迁移
- 包含健康检查

## 🔧 部署前准备

### 1. 环境要求

- Node.js 18+
- Python 3.11+
- npm 或 yarn
- 对应平台的CLI工具

### 2. 环境变量配置

根据部署平台，可能需要配置以下环境变量：

```bash
# 数据库配置
DATABASE_URL=sqlite:///./data/db.sqlite3

# JWT密钥
JWT_SECRET_KEY=your-secret-key

# API基础URL (前端用)
VITE_BASE_API=/api/v1

# 后端服务地址 (Cloudflare用)
BACKEND_URL=https://your-backend-service.com
```

### 3. 数据库初始化

```bash
# 运行数据库迁移
python migrations/migrations_001.py
```

## 📁 部署文件说明

| 文件 | 用途 | 平台 |
|------|------|------|
| `vercel.json` | Vercel部署配置 | Vercel |
| `netlify.toml` | Netlify部署配置 | Netlify |
| `netlify/functions/api.py` | Netlify Functions后端 | Netlify |
| `wrangler.toml` | Cloudflare配置 | Cloudflare |
| `functions/api.js` | Cloudflare Functions | Cloudflare |
| `fly.toml` | Fly.io配置 | Fly.io |
| `Dockerfile.fly` | Fly.io Docker文件 | Fly.io |
| `deploy.sh` | 一键部署脚本 | 所有平台 |

## 🚨 注意事项

### Vercel
- Python函数有执行时间限制
- 免费版有带宽限制
- 数据库建议使用外部服务

### Netlify
- Functions有执行时间和内存限制
- 需要安装 `mangum` 适配器
- 大文件上传可能有限制

### Cloudflare Pages
- 后端需要单独部署
- Workers有CPU时间限制
- 适合静态内容较多的应用

### Fly.io
- 需要信用卡验证
- 资源使用按量计费
- 支持持久化存储

## 🔍 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存重新构建
   cd web
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **API请求失败**
   - 检查API路由配置
   - 确认CORS设置
   - 验证环境变量

3. **数据库连接问题**
   - 确认数据库文件路径
   - 检查权限设置
   - 运行数据库迁移

### 调试命令

```bash
# 本地测试
cd web && npm run dev  # 前端开发服务器
python run.py          # 后端服务器

# 检查构建产物
ls -la dist/

# 查看日志
# Vercel: vercel logs
# Netlify: netlify logs
# Fly.io: flyctl logs
```

## 📞 技术支持

如果遇到部署问题，请：

1. 检查对应平台的官方文档
2. 确认所有依赖已正确安装
3. 验证配置文件语法
4. 查看部署日志获取详细错误信息

---

**快速开始**: 运行 `./deploy.sh <platform>` 即可一键部署！