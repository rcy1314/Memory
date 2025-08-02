# Memory-不负时光摄影相册

![1754074172331](https://s2.loli.net/2025/08/02/EjIZ1X6MSHqUlTD.png)

![1754089150106](https://s2.loli.net/2025/08/02/o51PLHecODG9fZQ.png)

## 简介

一个全屏瀑布流摄影图库程序，它是基于[Moment](https://github.com/Robert-Stackflow/Moment)二次开发的，基于[vue-fastapi-admin](https://github.com/mizhexiaoxiao/vue-fastapi-admin)使用 Vue+FastAPI 开发

- 支持 linux/amd64 和 linux/arm64 两个平台
- 支持S3/R2两种oss存储上传方式
- 支持多种数据库的选择连接，支持一键迁移
- 自适应瀑布流布局，参考pinterest
- 支持首页多张封面大图的自定义设置

![1754074193119](https://s2.loli.net/2025/08/02/NnOJshlFMT3iEoC.png)

## 前后端运行

前端：web目录下`npm run dev`

后端：`python run.py` 

## docker运行

```
docker run -d \
  --name Memory-Noise \
  --platform linux/amd64 \
  -p 9573:9999 \
  noise233/memory:latest
```

如果你想挂载本地数据库文件，比如：

```
docker run -d \
  --name Memory-Noise \
  --platform linux/amd64 \
  -p 4314:9999 \
  -v /www/wwwroot/memory.noisework.cn/data:/app/data \
  noise233/memory:latest
```

## docker-compose

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

------

## 其它

[Docker 环境下外部数据库连接配置指南](https://github.com/rcy1314/Memory/blob/main/DOCKER_DATABASE_SETUP.md)

二次开发时请注意该项目使用v-model:value语法编写

## To do

- [ ] 完善api-token机制
- [ ] 增加组件效果
