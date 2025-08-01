# Docker 环境下外部数据库连接配置指南

## 概述

本指南说明如何在 Docker 环境中配置 Memory 项目连接外部数据库，包括本地开发和生产环境的配置方法。

## 网络配置说明

### 1. Docker Compose 配置

项目已配置了以下网络设置：

```yaml
services:
  memory:
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - memory-network
    environment:
      - DB_HOST=host.docker.internal
      - EXTERNAL_DB_HOST=${EXTERNAL_DB_HOST:-host.docker.internal}

networks:
  memory-network:
    driver: bridge
```

### 2. 主机地址配置

- **本地开发环境**: 使用 `host.docker.internal`
- **Linux 环境**: 使用 `172.17.0.1` 或宿主机实际 IP
- **生产环境**: 使用数据库服务器的实际地址

## 数据库连接配置

### 方法一：通过 Web 界面配置

1. 启动应用后访问管理界面
2. 进入 "系统设置" -> "数据库设置"
3. 选择数据库类型（PostgreSQL/MySQL）
4. 配置连接参数：
   - **主机地址**: `host.docker.internal`（本地）或实际服务器地址
   - **端口**: 数据库端口（PostgreSQL: 5432, MySQL: 3306）
   - **数据库名**: 目标数据库名称
   - **用户名/密码**: 数据库凭据
   - **SSL**: 根据需要启用

### 方法二：通过环境变量配置

1. 复制 `.env.docker` 文件并重命名为 `.env`
2. 修改配置参数
3. 在 `docker-compose.yml` 中引用环境文件：

```yaml
services:
  memory:
    env_file:
      - .env
```

## 外部数据库服务器配置

### PostgreSQL 配置

1. **修改 postgresql.conf**:
   ```
   listen_addresses = '*'
   port = 5432
   ```

2. **修改 pg_hba.conf**:
   ```
   # 允许 Docker 容器连接
   host    all             all             172.17.0.0/16           md5
   # 如果使用特定网络，替换为实际网段
   host    all             all             192.168.0.0/16          md5
   ```

### MySQL 配置

1. **修改 my.cnf**:
   ```
   [mysqld]
   bind-address = 0.0.0.0
   port = 3306
   ```

2. **创建用户并授权**:
   ```sql
   CREATE USER 'memory_user'@'%' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON memory_db.* TO 'memory_user'@'%';
   FLUSH PRIVILEGES;
   ```

## 域名反代配置

### Nginx 反代示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:9573;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 域名反代时的数据库连接

当使用域名反代时，确保：

1. **数据库服务器防火墙配置**:
   - 允许反代服务器 IP 访问数据库端口
   - 允许 Docker 容器网段访问

2. **云服务安全组配置**:
   - 入站规则：允许应用服务器访问数据库端口
   - 出站规则：允许数据库响应

3. **环境变量配置**:
   ```bash
   export EXTERNAL_DB_HOST=your-database-server.com
   docker-compose up -d
   ```

## 故障排除

### 常见问题

1. **连接被拒绝**:
   - 检查数据库服务器是否启动
   - 验证端口是否开放
   - 确认防火墙配置

2. **认证失败**:
   - 验证用户名密码
   - 检查数据库用户权限
   - 确认主机访问权限

3. **网络不可达**:
   - 测试网络连通性：`docker exec memory ping host.docker.internal`
   - 检查 Docker 网络配置
   - 验证 DNS 解析

### 调试命令

```bash
# 进入容器调试
docker exec -it memory /bin/bash

# 测试数据库连接
telnet host.docker.internal 5432  # PostgreSQL
telnet host.docker.internal 3306  # MySQL

# 查看容器网络配置
docker inspect memory

# 查看容器日志
docker logs memory
```

## 安全建议

1. **使用强密码**：数据库用户密码应足够复杂
2. **限制访问**：仅允许必要的 IP 地址访问数据库
3. **启用 SSL**：生产环境建议启用数据库 SSL 连接
4. **定期备份**：配置数据库自动备份策略
5. **监控日志**：监控数据库连接和访问日志

## 生产环境部署

### 推荐架构

```
[用户] -> [负载均衡/CDN] -> [反代服务器] -> [Docker容器] -> [外部数据库]
```

### 环境变量管理

生产环境建议使用：
- Docker Secrets
- Kubernetes ConfigMap/Secret
- 云服务的密钥管理服务

### 监控配置

- 数据库连接池监控
- 响应时间监控
- 错误率监控
- 资源使用监控