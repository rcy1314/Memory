# Memory 相册系统 API 使用说明

## 概述

Memory 是一个功能强大的相册管理系统，提供完整的 RESTful API 接口，支持图片上传、分类管理、用户认证、批量操作等功能。

## 基础信息

- **API 基础地址**: `http://localhost:9999/api/v1`
- **API 版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证方式

### 1. JWT Token 认证
用于管理员登录后的操作，需要在请求头中添加：
```
Authorization: Bearer <jwt_token>
```

### 2. API Token 认证
用于程序化访问，需要在请求头中添加：
```
X-API-Token: <api_token>
```

### 3. 无需认证
部分公共接口（如访客查看）无需认证。

## API 端点分类

### 健康检查

#### GET /health
检查服务状态

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/health"
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "status": "ok",
    "message": "Service is healthy"
  }
}
```

### 用户认证

#### POST /admin/base/access_token
用户登录获取 JWT Token

**请求参数**:
```json
{
  "username": "admin",
  "password": "password"
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/admin/base/access_token" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer"
  }
}
```

#### GET /admin/base/user/info
获取当前用户信息（需要 JWT 认证）

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/admin/base/user/info" \
  -H "Authorization: Bearer <jwt_token>"
```

### API Token 管理

#### GET /admin/api-token/list
获取 API Token 列表（需要管理员权限）

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/admin/api-token/list" \
  -H "Authorization: Bearer <jwt_token>"
```

#### POST /admin/api-token/create
创建 API Token（需要管理员权限）

**请求参数**:
```json
{
  "name": "批量导入Token",
  "is_permanent": true,
  "remark": "用于批量导入图片的API Token"
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/admin/api-token/create" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"批量导入Token","is_permanent":true,"remark":"用于批量导入图片"}'
```

### 访客 API（无需认证）

#### GET /visitor/category/list
获取分类列表

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/visitor/category/list"
```

#### GET /visitor/blog/list
获取图片列表

**查询参数**:
- `page`: 页码（默认：1）
- `page_size`: 每页数量（默认：10）
- `category`: 分类别名
- `location`: 位置筛选

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/visitor/blog/list?page=1&page_size=20&category=travel"
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "title": "美丽风景",
      "desc": "拍摄于某个美丽的地方",
      "location": "北京",
      "time": "2024-01-01T12:00:00",
      "images": [
        {
          "id": 1,
          "url": "https://example.com/image1.jpg",
          "thumbnail_url": "https://example.com/thumb1.jpg"
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

### 图片管理

#### POST /admin/base/upload
上传图片（需要认证）

**请求参数**:
- `file`: 图片文件
- `compress_option`: 压缩选项（"80", "60", "lossless", "none"）
- `output_format`: 输出格式（"webp", "original"）

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/admin/base/upload" \
  -H "Authorization: Bearer <jwt_token>" \
  -F "file=@/path/to/image.jpg" \
  -F "compress_option=80" \
  -F "output_format=webp"
```

#### POST /admin/blog/create
创建图片博客（需要管理员权限）

**请求参数**:
```json
{
  "title": "图片标题",
  "desc": "图片描述",
  "location": "拍摄地点",
  "time": "2024-01-01T12:00:00",
  "categories": [1, 2],
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "thumbnail_url": "https://example.com/thumb.jpg",
      "alt": "图片描述",
      "location": "图片位置",
      "time": "2024-01-01T12:00:00"
    }
  ]
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/admin/blog/create" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"美丽风景","desc":"拍摄描述","categories":[1]}'
```

#### POST /admin/blog/list
查询图片列表（需要认证）

**请求参数**:
```json
{
  "page": 1,
  "page_size": 10,
  "title": "搜索标题",
  "desc": "搜索描述",
  "location": "搜索位置",
  "categories": [1, 2]
}
```

#### GET /admin/blog/get
获取单个图片详情

**查询参数**:
- `blog_id`: 图片ID

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/admin/blog/get?blog_id=1" \
  -H "Authorization: Bearer <jwt_token>"
```

#### POST /admin/blog/update
更新图片信息（需要管理员权限）

**请求参数**:
```json
{
  "id": 1,
  "title": "更新后的标题",
  "desc": "更新后的描述",
  "location": "更新后的位置"
}
```

#### DELETE /admin/blog/delete
删除图片（需要管理员权限）

**查询参数**:
- `id`: 图片ID

**请求示例**:
```bash
curl -X DELETE "http://localhost:9999/api/v1/admin/blog/delete?id=1" \
  -H "Authorization: Bearer <jwt_token>"
```

### 分类管理

#### GET /admin/category/list
获取分类列表（需要管理员权限）

**查询参数**:
- `page`: 页码
- `page_size`: 每页数量

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/admin/category/list?page=1&page_size=10" \
  -H "Authorization: Bearer <jwt_token>"
```

#### GET /admin/category/get/id
根据ID获取分类

**查询参数**:
- `category_id`: 分类ID

#### GET /admin/category/get/alias
根据别名获取分类

**查询参数**:
- `alias`: 分类别名

### 批量操作

#### POST /batch/blogs/create
批量创建图片博客（需要 API Token 认证）

**请求参数**:
```json
{
  "blogs": [
    {
      "title": "图片1",
      "desc": "描述1",
      "location": "北京",
      "time": "2024-01-01T12:00:00",
      "categories": [1],
      "images": [
        {
          "url": "https://example.com/image1.jpg",
          "thumbnail_url": "https://example.com/thumb1.jpg",
          "alt": "图片描述1",
          "location": "图片位置1",
          "time": "2024-01-01T12:00:00"
        }
      ]
    },
    {
      "title": "图片2",
      "desc": "描述2",
      "categories": [2]
    }
  ]
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/batch/blogs/create" \
  -H "X-API-Token: <api_token>" \
  -H "Content-Type: application/json" \
  -d '{"blogs":[{"title":"批量图片1","desc":"美丽风景","categories":[1],"images":[{"url":"https://example.com/photo.jpg","thumbnail_url":"https://example.com/thumb.jpg"}]}]}'
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "success_count": 2,
    "failed_count": 0,
    "created_blogs": [
      {
        "index": 0,
        "blog_id": 123,
        "title": "图片1"
      },
      {
        "index": 1,
        "blog_id": 124,
        "title": "图片2"
      }
    ],
    "failed_blogs": []
  },
  "total": 2
}
```

#### POST /batch/blogs/update
批量更新图片博客（需要 API Token 认证）

**请求参数**:
```json
{
  "blogs": [
    {
      "id": 123,
      "title": "更新后的标题",
      "desc": "更新后的描述",
      "location": "更新后的位置",
      "categories": [1, 2]
    },
    {
      "id": 124,
      "desc": "仅更新描述"
    }
  ]
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/batch/blogs/update" \
  -H "X-API-Token: <api_token>" \
  -H "Content-Type: application/json" \
  -d '{"blogs":[{"id":123,"title":"更新后的标题","desc":"更新后的描述"}]}'
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "success_count": 2,
    "failed_count": 0,
    "updated_blogs": [
      {
        "index": 0,
        "blog_id": 123,
        "title": "更新后的标题"
      },
      {
        "index": 1,
        "blog_id": 124,
        "title": "原标题"
      }
    ],
    "failed_blogs": []
  },
  "total": 2
}
```

#### POST /batch/blogs/delete
批量删除图片博客（需要管理员权限）

**请求参数**:
```json
{
  "blog_ids": [123, 124, 125]
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/batch/blogs/delete" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"blog_ids":[123,124,125]}'
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "success_count": 2,
    "failed_count": 1,
    "deleted_blogs": [
      {
        "index": 0,
        "blog_id": 123,
        "title": "已删除的图片1"
      },
      {
        "index": 1,
        "blog_id": 124,
        "title": "已删除的图片2"
      }
    ],
    "failed_blogs": [
      {
        "index": 2,
        "blog_id": 125,
        "error": "图片不存在: 125"
      }
    ]
  },
  "total": 2
}
```

#### POST /batch/images/upload
批量上传图片到指定博客（需要 API Token 认证）

**请求参数**:
- `blog_id`: 目标博客ID
- `images`: 图片文件数组
- `compress_option`: 压缩选项（"80", "60", "lossless", "none"）
- `output_format`: 输出格式（"webp", "original"）

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/batch/images/upload" \
  -H "X-API-Token: <api_token>" \
  -F "blog_id=123" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "compress_option=80" \
  -F "output_format=webp"
```

#### 批量操作注意事项

1. **事务处理**: 所有批量操作都在数据库事务中执行，确保数据一致性
2. **错误处理**: 单个项目失败不会影响其他项目的处理
3. **性能优化**: 批量操作比单个操作更高效，建议用于大量数据处理
4. **权限控制**: 不同操作需要不同的权限级别
5. **数据验证**: 每个项目都会进行独立的数据验证
6. **限制**: 单次批量操作建议不超过100个项目，避免超时
7. **日志记录**: 所有批量操作都会记录详细的操作日志

### WebDAV 文件管理

#### GET /webdav/list
列出目录内容（需要 API Token 认证）

**查询参数**:
- `path`: 目录路径（默认："."）
- `include_hidden`: 是否包含隐藏文件（默认：false）

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/webdav/list?path=images&include_hidden=false" \
  -H "X-API-Token: <api_token>"
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "path": "images",
    "files": [
      {
        "name": "photo1.jpg",
        "path": "/images/photo1.jpg",
        "size": 1024000,
        "is_directory": false,
        "modified_time": "2024-01-01T12:00:00",
        "created_time": "2024-01-01T10:00:00",
        "mime_type": "image/jpeg",
        "checksum": "d41d8cd98f00b204e9800998ecf8427e"
      }
    ],
    "total_files": 10,
    "total_directories": 2
  }
}
```

#### GET /webdav/download
下载文件

**查询参数**:
- `path`: 文件路径

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/webdav/download?path=images/photo.jpg" \
  -H "X-API-Token: <api_token>" \
  -o downloaded_photo.jpg
```

#### POST /webdav/upload
上传文件到指定路径

**查询参数**:
- `path`: 上传路径
- `overwrite`: 是否覆盖已存在的文件（默认：false）

**请求参数**:
- `file`: 要上传的文件

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/webdav/upload?path=images/new_photo.jpg&overwrite=true" \
  -H "X-API-Token: <api_token>" \
  -F "file=@/path/to/local/photo.jpg"
```

#### POST /webdav/mkdir
创建目录

**查询参数**:
- `path`: 要创建的目录路径
- `parents`: 是否创建父目录（默认：true）

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/webdav/mkdir?path=images/new_folder&parents=true" \
  -H "X-API-Token: <api_token>"
```

#### DELETE /webdav/delete
删除文件或目录

**查询参数**:
- `path`: 要删除的文件或目录路径
- `recursive`: 是否递归删除目录（默认：false）

**请求示例**:
```bash
curl -X DELETE "http://localhost:9999/api/v1/webdav/delete?path=images/old_folder&recursive=true" \
  -H "X-API-Token: <api_token>"
```

#### GET /webdav/info
获取文件或目录信息

**查询参数**:
- `path`: 文件或目录路径

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/webdav/info?path=images/photo.jpg" \
  -H "X-API-Token: <api_token>"
```

#### POST /webdav/monitor/start
开始监控目录文件变化（需要管理员权限）

**查询参数**:
- `path`: 监控目录路径
- `recursive`: 是否递归监控（默认：true）

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/webdav/monitor/start?path=images&recursive=true" \
  -H "Authorization: Bearer <jwt_token>"
```

#### POST /webdav/monitor/stop
停止监控目录

**查询参数**:
- `monitor_id`: 监控ID

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/webdav/monitor/stop?monitor_id=monitor_123" \
  -H "Authorization: Bearer <jwt_token>"
```

#### GET /webdav/watch/events
获取文件变化事件

**查询参数**:
- `path`: 监控目录路径（默认："."）
- `limit`: 返回事件数量限制（默认：100）

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/webdav/watch/events?path=images&limit=50" \
  -H "X-API-Token: <api_token>"
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "event_type": "created",
      "file_path": "/images/new_photo.jpg",
      "is_directory": false,
      "timestamp": "2024-01-01T12:00:00",
      "old_path": null
    }
  ],
  "total": 1
}
```

#### GET /webdav/monitor/status
获取监控状态信息

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/webdav/monitor/status" \
  -H "X-API-Token: <api_token>"
```

### 设置管理

#### GET /admin/setting/get/general
获取通用设置

#### GET /admin/setting/get/meta
获取网站设置

#### GET /admin/setting/get/storage
获取存储设置

#### POST /admin/setting/update/meta
更新网站设置（需要管理员权限）

**请求参数**:
```json
{
  "meta": {
    "site_name": "我的相册",
    "site_title": "Memory 相册系统",
    "site_desc": "个人相册管理系统",
    "site_url": "https://memory.example.com",
    "primary_color": "#1890ff"
  }
}
```

### Webhook 事件

#### POST /webhook/register
注册 Webhook（需要 API Token 认证）

**请求参数**:
```json
{
  "url": "https://your-webhook-endpoint.com/webhook",
  "events": ["blog.created", "blog.updated", "blog.deleted", "image.uploaded"],
  "secret": "your-webhook-secret",
  "active": true,
  "description": "博客事件通知Webhook"
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/webhook/register" \
  -H "X-API-Token: <api_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-webhook-endpoint.com/webhook",
    "events": ["blog.created", "blog.updated"],
    "secret": "your-webhook-secret",
    "active": true,
    "description": "博客事件通知"
  }'
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "webhook_id": "webhook_123456",
    "url": "https://your-webhook-endpoint.com/webhook",
    "events": ["blog.created", "blog.updated"],
    "active": true,
    "created_at": "2024-01-01T12:00:00"
  }
}
```

#### DELETE /webhook/unregister/{webhook_id}
注销指定的 Webhook

**路径参数**:
- `webhook_id`: Webhook ID

**请求示例**:
```bash
curl -X DELETE "http://localhost:9999/api/v1/webhook/unregister/webhook_123456" \
  -H "X-API-Token: <api_token>"
```

#### GET /webhook/list
获取所有已注册的 Webhook 列表

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/webhook/list" \
  -H "X-API-Token: <api_token>"
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "webhook_id": "webhook_123456",
      "url": "https://your-webhook-endpoint.com/webhook",
      "events": ["blog.created", "blog.updated"],
      "active": true,
      "description": "博客事件通知",
      "created_at": "2024-01-01T12:00:00",
      "last_triggered": "2024-01-01T15:30:00"
    }
  ]
}
```

#### POST /webhook/trigger
手动触发 Webhook 事件

**请求参数**:
```json
{
  "event_type": "blog.created",
  "data": {
    "blog_id": 123,
    "title": "新博客标题",
    "action": "created",
    "timestamp": "2024-01-01T12:00:00"
  }
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/webhook/trigger" \
  -H "X-API-Token: <api_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "blog.created",
    "data": {
      "blog_id": 123,
      "title": "测试博客",
      "action": "created"
    }
  }'
```

#### POST /webhook/test/{webhook_id}
测试指定的 Webhook

**路径参数**:
- `webhook_id`: Webhook ID

**请求示例**:
```bash
curl -X POST "http://localhost:9999/api/v1/webhook/test/webhook_123456" \
  -H "X-API-Token: <api_token>"
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "webhook_id": "webhook_123456",
    "test_result": "success",
    "response_code": 200,
    "response_time": 150,
    "message": "Webhook测试成功"
  }
}
```

#### GET /webhook/deliveries
获取 Webhook 投递记录

**查询参数**:
- `webhook_id`: Webhook ID（可选）
- `limit`: 返回记录数量限制（默认：50）

**请求示例**:
```bash
curl -X GET "http://localhost:9999/api/v1/webhook/deliveries?webhook_id=webhook_123456&limit=20" \
  -H "X-API-Token: <api_token>"
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "delivery_id": "delivery_789",
      "webhook_id": "webhook_123456",
      "event_type": "blog.created",
      "status": "success",
      "response_code": 200,
      "response_time": 120,
      "timestamp": "2024-01-01T12:00:00",
      "retry_count": 0
    }
  ],
  "total": 1
}
```

#### 支持的事件类型
- `blog.created`: 博客创建
- `blog.updated`: 博客更新
- `blog.deleted`: 博客删除
- `image.uploaded`: 图片上传
- `video.uploaded`: 视频上传
- `category.created`: 分类创建
- `category.updated`: 分类更新
- `user.login`: 用户登录

#### Webhook 负载格式
所有 Webhook 事件都会发送以下格式的 JSON 负载：

```json
{
  "event_type": "blog.created",
  "timestamp": "2024-01-01T12:00:00Z",
  "webhook_id": "webhook_123456",
  "data": {
    "blog_id": 123,
    "title": "博客标题",
    "user_id": 1,
    "action": "created"
  },
  "signature": "sha256=abc123..."
}
```

#### 签名验证
如果设置了 `secret`，每个 Webhook 请求都会包含 `X-Webhook-Signature` 头，使用 HMAC-SHA256 算法生成：

```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

## 错误处理

### 标准错误响应格式
```json
{
  "code": 400,
  "msg": "错误描述",
  "data": null
}
```

### 常见错误码
- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权（需要登录）
- `403`: 禁止访问（权限不足）
- `404`: 资源不存在
- `500`: 服务器内部错误

## 使用示例

### Python 示例

```python
import requests
import json

# API 配置
API_BASE_URL = "http://localhost:9999/api/v1"

# 1. 管理员登录
def login():
    login_data = {
        "username": "admin",
        "password": "password"
    }
    response = requests.post(f"{API_BASE_URL}/admin/base/access_token", json=login_data)
    if response.status_code == 200:
        result = response.json()
        return result['data']['access_token']
    return None

# 2. 创建 API Token
def create_api_token(jwt_token):
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json"
    }
    token_data = {
        "name": "Python脚本Token",
        "is_permanent": True,
        "remark": "用于Python脚本访问"
    }
    response = requests.post(f"{API_BASE_URL}/admin/api-token/create", 
                           json=token_data, headers=headers)
    if response.status_code == 200:
        result = response.json()
        return result['data']['token']
    return None

# 3. 使用 API Token 获取图片列表
def get_blog_list(api_token):
    headers = {"X-API-Token": api_token}
    response = requests.get(f"{API_BASE_URL}/visitor/blog/list?page=1&page_size=10", 
                          headers=headers)
    if response.status_code == 200:
        return response.json()['data']
    return []

# 4. 批量创建图片博客
def batch_create_blogs(api_token, blogs):
    headers = {
        "X-API-Token": api_token,
        "Content-Type": "application/json"
    }
    data = {"blogs": blogs}
    response = requests.post(f"{API_BASE_URL}/batch/blogs/create", 
                           json=data, headers=headers)
    return response.status_code == 200

# 使用示例
if __name__ == "__main__":
    # 登录获取 JWT Token
    jwt_token = login()
    if not jwt_token:
        print("登录失败")
        exit(1)
    
    # 创建 API Token
    api_token = create_api_token(jwt_token)
    if not api_token:
        print("创建 API Token 失败")
        exit(1)
    
    print(f"API Token: {api_token}")
    
    # 获取图片列表
    blogs = get_blog_list(api_token)
    print(f"获取到 {len(blogs)} 张图片")
    
    # 批量创建图片
    new_blogs = [
        {"title": "批量图片1", "desc": "描述1", "categories": [1]},
        {"title": "批量图片2", "desc": "描述2", "categories": [1]}
    ]
    if batch_create_blogs(api_token, new_blogs):
        print("批量创建成功")
    else:
        print("批量创建失败")
```

### JavaScript 示例

```javascript
const API_BASE_URL = 'http://localhost:9999/api/v1';

// 1. 管理员登录
async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/admin/base/access_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
        const result = await response.json();
        return result.data.access_token;
    }
    return null;
}

// 2. 获取图片列表
async function getBlogList(page = 1, pageSize = 10, category = '') {
    const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
    });
    
    if (category) {
        params.append('category', category);
    }
    
    const response = await fetch(`${API_BASE_URL}/visitor/blog/list?${params}`);
    
    if (response.ok) {
        const result = await response.json();
        return result.data;
    }
    return [];
}

// 3. 上传图片
async function uploadImage(file, jwtToken, compressOption = 'none', outputFormat = 'original') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('compress_option', compressOption);
    formData.append('output_format', outputFormat);
    
    const response = await fetch(`${API_BASE_URL}/admin/base/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        },
        body: formData
    });
    
    if (response.ok) {
        const result = await response.json();
        return result.data;
    }
    return null;
}

// 使用示例
async function main() {
    try {
        // 登录
        const jwtToken = await login('admin', 'password');
        if (!jwtToken) {
            console.error('登录失败');
            return;
        }
        
        console.log('登录成功');
        
        // 获取图片列表
        const blogs = await getBlogList(1, 20, 'travel');
        console.log(`获取到 ${blogs.length} 张图片`);
        
        // 如果有文件输入，可以上传图片
        // const fileInput = document.getElementById('fileInput');
        // if (fileInput.files.length > 0) {
        //     const uploadResult = await uploadImage(fileInput.files[0], jwtToken, '80', 'webp');
        //     console.log('上传结果:', uploadResult);
        // }
        
    } catch (error) {
        console.error('操作失败:', error);
    }
}

// 调用主函数
main();
```

### cURL 脚本示例

```bash
#!/bin/bash

# API 配置
API_BASE_URL="http://localhost:9999/api/v1"
USERNAME="admin"
PASSWORD="password"

# 1. 登录获取 JWT Token
echo "正在登录..."
JWT_RESPONSE=$(curl -s -X POST "$API_BASE_URL/admin/base/access_token" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

JWT_TOKEN=$(echo $JWT_RESPONSE | jq -r '.data.access_token')

if [ "$JWT_TOKEN" = "null" ]; then
    echo "登录失败"
    exit 1
fi

echo "登录成功，JWT Token: $JWT_TOKEN"

# 2. 创建 API Token
echo "正在创建 API Token..."
API_TOKEN_RESPONSE=$(curl -s -X POST "$API_BASE_URL/admin/api-token/create" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"脚本Token","is_permanent":true,"remark":"用于脚本访问"}')

API_TOKEN=$(echo $API_TOKEN_RESPONSE | jq -r '.data.token')

if [ "$API_TOKEN" = "null" ]; then
    echo "创建 API Token 失败"
    exit 1
fi

echo "API Token 创建成功: $API_TOKEN"

# 3. 获取图片列表
echo "正在获取图片列表..."
BLOG_LIST=$(curl -s -X GET "$API_BASE_URL/visitor/blog/list?page=1&page_size=5")
echo "图片列表:"
echo $BLOG_LIST | jq '.data[] | {id: .id, title: .title, location: .location}'

# 4. 获取分类列表
echo "正在获取分类列表..."
CATEGORY_LIST=$(curl -s -X GET "$API_BASE_URL/visitor/category/list")
echo "分类列表:"
echo $CATEGORY_LIST | jq '.data[] | {id: .id, name: .name, alias: .alias}'

# 5. 检查服务健康状态
echo "正在检查服务状态..."
HEALTH_CHECK=$(curl -s -X GET "$API_BASE_URL/health")
echo "服务状态:"
echo $HEALTH_CHECK | jq '.data'

echo "脚本执行完成"
```

## 最佳实践

### 1. 认证管理
- 使用 JWT Token 进行管理员操作
- 使用 API Token 进行程序化访问
- 定期轮换 API Token
- 为不同用途创建不同的 API Token

### 2. 错误处理
- 始终检查响应状态码
- 处理网络超时和连接错误
- 记录错误日志便于调试

### 3. 性能优化
- 使用分页避免一次性获取大量数据
- 合理设置图片压缩选项
- 使用批量操作提高效率

### 4. 安全考虑
- 不要在客户端代码中暴露 API Token
- 使用 HTTPS 传输敏感数据
- 定期检查和清理无用的 API Token

## 常见问题

### Q: 如何获取 API Token？
A: 首先使用管理员账号登录获取 JWT Token，然后调用 `/admin/api-token/create` 接口创建 API Token。

### Q: 上传的图片支持哪些格式？
A: 支持常见的图片格式如 JPEG、PNG、WebP 等，可以选择压缩选项和输出格式。

### Q: 如何实现图片的批量上传？
A: 可以使用批量操作接口 `/batch/blogs/create`，或者编写脚本循环调用上传接口。

### Q: WebDAV 功能如何使用？
A: WebDAV 接口提供文件管理功能，可以列出目录、上传下载文件等，需要 API Token 认证。

### Q: 如何设置 Webhook？
A: 使用 `/webhook/register` 接口注册 Webhook，可以监听图片的创建、更新、删除等事件。

## 更新日志

- **v1.0.0**: 初始版本，包含基础的图片管理、分类管理、用户认证功能
- **v1.1.0**: 新增批量操作、WebDAV 文件管理功能
- **v1.2.0**: 新增 Webhook 事件通知、图片压缩优化功能

## 测试工具和脚本

### test_api.py - 基础API测试脚本

项目提供了完整的API测试脚本 `test_api.py`，用于验证API的基本功能：

#### 主要功能
1. **访客API测试**: 测试无需认证的公开接口
2. **管理员登录测试**: 验证JWT Token获取流程
3. **API Token创建**: 测试API Token的创建和使用
4. **权限验证**: 测试不同认证方式的权限控制

#### 使用方法
```bash
# 运行基础API测试
python test_api.py
```

#### 测试流程
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试API连接和认证
"""

import requests
import json

# API配置
API_BASE_URL = "http://localhost:9999/api/v1"

def test_visitor_api():
    """测试访客API（不需要认证）"""
    print("=== 测试访客API ===")
    
    # 测试获取分类列表
    try:
        response = requests.get(f"{API_BASE_URL}/visitor/category/list")
        print(f"分类列表API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"分类数量: {len(result.get('data', []))}")
            for category in result.get('data', [])[:3]:
                print(f"  - {category['name']} ({category['alias']})")
    except Exception as e:
        print(f"访客API测试失败: {e}")

def test_admin_login():
    """测试管理员登录"""
    print("\n=== 测试管理员登录 ===")
    
    login_data = {
        "username": "admin",
        "password": "123456"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/admin/base/access_token",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"登录API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            if result.get('code') == 200:
                access_token = result['data']['access_token']
                print(f"登录成功，获取到Token: {access_token[:20]}...")
                return access_token
    except Exception as e:
        print(f"登录测试失败: {e}")
    
    return None

def create_api_token(jwt_token):
    """创建API Token"""
    print("\n=== 创建API Token ===")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {jwt_token}"
    }
    
    token_data = {
        "name": "测试Token",
        "is_permanent": True,
        "remark": "用于API测试"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/admin/api_token/create",
            json=token_data,
            headers=headers
        )
        if response.status_code == 200:
            result = response.json()
            if result.get('code') == 200:
                api_token = result['data']['token']
                print(f"API Token创建成功: {api_token[:20]}...")
                return api_token
    except Exception as e:
        print(f"API Token创建失败: {e}")
    
    return None

def test_api_token_auth(api_token):
    """测试API Token认证"""
    print("\n=== 测试API Token认证 ===")
    
    headers = {
        "X-API-Token": api_token
    }
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/admin/blog/list?page=1&page_size=5",
            headers=headers
        )
        print(f"API Token认证测试状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"API Token认证成功，获取到 {len(result.get('data', []))} 条数据")
            return True
    except Exception as e:
        print(f"API Token认证测试失败: {e}")
    
    return False

def main():
    """主测试流程"""
    print("开始API测试...")
    
    # 1. 测试访客API
    test_visitor_api()
    
    # 2. 测试管理员登录
    jwt_token = test_admin_login()
    if not jwt_token:
        print("登录失败，无法继续测试")
        return
    
    # 3. 创建API Token
    api_token = create_api_token(jwt_token)
    if not api_token:
        print("API Token创建失败，无法继续测试")
        return
    
    # 4. 测试API Token认证
    if test_api_token_auth(api_token):
        print("\n=== 所有测试通过 ===")
    else:
        print("\n=== 部分测试失败 ===")

if __name__ == "__main__":
    main()
```

### Memory_api.py - 完整功能测试工具

`Memory_api.py` 是一个更全面的API测试和管理工具，包含了所有API功能的测试用例：

#### 主要功能
1. **完整的认证流程测试**
2. **批量操作测试**
3. **WebDAV功能测试**
4. **Webhook功能测试**
5. **文件上传和管理测试**
6. **高级API功能演示**

#### 核心功能示例

```python
def test_batch_operations(api_token):
    """测试批量操作"""
    print("\n=== 测试批量操作 ===")
    
    headers = {
        "X-API-Token": api_token,
        "Content-Type": "application/json"
    }
    
    # 批量创建博客
    batch_blogs = [
        {
            "title": "批量测试博客1",
            "content": "这是批量创建的博客内容1",
            "summary": "批量测试摘要1",
            "category_id": 1,
            "is_draft": False,
            "tags": ["测试", "批量操作"]
        },
        {
            "title": "批量测试博客2",
            "content": "这是批量创建的博客内容2",
            "summary": "批量测试摘要2",
            "category_id": 2,
            "is_draft": True,
            "tags": ["测试", "草稿"]
        }
    ]
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/batch/blogs/create",
            json=batch_blogs,
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"批量创建成功: {result['data']['success_count']} 个博客")
            print(f"失败数量: {result['data']['failed_count']}")
            return True
        else:
            print(f"批量创建失败: {response.text}")
    except Exception as e:
        print(f"批量操作测试失败: {e}")
    
    return False

def test_webdav_operations(api_token):
    """测试WebDAV操作"""
    print("\n=== 测试WebDAV操作 ===")
    
    headers = {
        "X-API-Token": api_token
    }
    
    try:
        # 列出根目录文件
        response = requests.get(
            f"{API_BASE_URL}/webdav/list",
            params={"path": "/"},
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            files = result.get('data', [])
            print(f"WebDAV根目录包含 {len(files)} 个文件/文件夹")
            
            for file_info in files[:5]:  # 显示前5个
                file_type = "文件夹" if file_info.get('is_directory') else "文件"
                print(f"  - {file_info['name']} ({file_type})")
            
            return True
        else:
            print(f"WebDAV操作失败: {response.text}")
    except Exception as e:
        print(f"WebDAV测试失败: {e}")
    
    return False

def test_webhook_operations(api_token):
    """测试Webhook操作"""
    print("\n=== 测试Webhook操作 ===")
    
    headers = {
        "X-API-Token": api_token,
        "Content-Type": "application/json"
    }
    
    # 注册Webhook
    webhook_data = {
        "url": "https://webhook.site/test-endpoint",
        "events": ["blog.created", "blog.updated", "blog.deleted"],
        "secret": "test-webhook-secret",
        "active": True,
        "description": "测试Webhook"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/webhook/register",
            json=webhook_data,
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            webhook_id = result['data']['webhook_id']
            print(f"Webhook注册成功: {webhook_id}")
            
            # 测试Webhook
            test_response = requests.post(
                f"{API_BASE_URL}/webhook/test/{webhook_id}",
                headers=headers
            )
            
            if test_response.status_code == 200:
                test_result = test_response.json()
                print(f"Webhook测试结果: {test_result['data']['test_result']}")
                return webhook_id
        else:
            print(f"Webhook注册失败: {response.text}")
    except Exception as e:
        print(f"Webhook测试失败: {e}")
    
    return None

def test_enhanced_api_features(api_token):
    """测试增强API功能"""
    print("\n=== 测试增强API功能 ===")
    
    headers = {
        "X-API-Token": api_token
    }
    
    # 测试健康检查
    try:
        health_response = requests.get(f"{API_BASE_URL}/health")
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"服务状态: {health_data['data']['status']}")
            print(f"版本信息: {health_data['data']['version']}")
    except Exception as e:
        print(f"健康检查失败: {e}")
    
    # 测试设置获取
    try:
        settings_response = requests.get(
            f"{API_BASE_URL}/admin/setting/general",
            headers=headers
        )
        if settings_response.status_code == 200:
            print("设置获取成功")
    except Exception as e:
        print(f"设置获取失败: {e}")

def main():
    """主测试流程"""
    print("开始完整API功能测试...")
    
    # 基础认证测试
    jwt_token = test_admin_login()
    if not jwt_token:
        return
    
    api_token = create_api_token(jwt_token)
    if not api_token:
        return
    
    # 功能测试
    test_results = {
        "访客API": test_visitor_api(),
        "批量操作": test_batch_operations(api_token),
        "WebDAV操作": test_webdav_operations(api_token),
        "Webhook操作": test_webhook_operations(api_token) is not None,
        "增强功能": test_enhanced_api_features(api_token)
    }
    
    # 输出测试结果
    print("\n=== 测试结果汇总 ===")
    for test_name, result in test_results.items():
        status = "✅ 通过" if result else "❌ 失败"
        print(f"{test_name}: {status}")
    
    success_count = sum(1 for result in test_results.values() if result)
    total_count = len(test_results)
    print(f"\n总体结果: {success_count}/{total_count} 项测试通过")

if __name__ == "__main__":
    main()
```

#### 运行完整测试
```bash
# 运行完整功能测试
python Memory_api.py
```

### 测试环境配置

#### 1. 环境要求
- Python 3.7+
- requests 库
- Memory 服务运行在 localhost:9999

#### 2. 安装依赖
```bash
pip install requests
```

#### 3. 配置说明
- 默认管理员账号: `admin`
- 默认密码: `123456`
- API 基础URL: `http://localhost:9999/api/v1`

#### 4. 测试数据准备
- 确保至少有一个分类存在
- 确保服务正常运行
- 检查数据库连接正常

### 自动化测试集成

#### GitHub Actions 示例
```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install requests pytest
    
    - name: Start Memory service
      run: |
        python main.py &
        sleep 10
    
    - name: Run API tests
      run: |
        python test_api.py
        python Memory_api.py
```

## 技术支持

如有问题或建议，请通过以下方式联系：
- GitHub Issues: [项目地址](https://github.com/your-repo/memory)
- 邮箱: support@example.com

---

*本文档最后更新时间: 2024-01-01*