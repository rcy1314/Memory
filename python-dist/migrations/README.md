# 数据库迁移脚本说明

本目录包含了Memory项目的数据库迁移脚本，用于初始化和更新数据库结构及默认数据。

## 迁移脚本列表

### 1. migrations_001.py
- **功能**: 完整的数据库迁移和初始化
- **包含**: 表结构创建、API Token表创建、默认设置初始化、默认Token创建
- **使用场景**: 首次部署或完整重建数据库

### 2. migrations_002.py
- **功能**: 特定的数据库更新
- **使用场景**: 特定版本的数据库结构更新

### 3. migrations_003_storage_defaults.py
- **功能**: 初始化存储设置的默认值
- **包含**: 存储设置和数据库设置的完整默认配置
- **使用场景**: 确保存储设置字段完整性

### 4. init_default_settings.py
- **功能**: 初始化所有设置的默认值
- **包含**: 通用设置、内容设置、网站设置、存储设置、数据库设置的完整默认配置
- **使用场景**: 确保所有设置字段与前端表单保持一致
- **特点**: 支持独立运行和应用内调用两种模式

## 存储设置默认值

### 基础设置
- `enable_storage`: `true` - 启用存储功能
- `storage_type`: `"local"` - 存储类型（local/cloud）
- `max_size`: `32.0` - 最大文件大小（MB）

### 本地存储设置
- `local_path`: `"images"` - 本地存储路径
- `local_prefix`: `""` - URL前缀（空则使用程序运行地址）

### 云端存储设置
- `timeout_time`: `30` - 超时时间（秒）
- `endpoint`: `""` - 端点URL
- `region`: `""` - 区域
- `access_id`: `""` - 访问密钥ID
- `secret_key`: `""` - 访问密钥
- `bucket`: `""` - 存储桶名称
- `path`: `""` - 存储路径
- `prefix`: `""` - 文件名前缀
- `suffix`: `""` - 文件名后缀

## 数据库设置默认值

- `db_type`: `"sqlite"` - 数据库类型
- `db_path`: `"/Library/Github/Memory/data/db.sqlite3"` - SQLite数据库路径
- `host`: `""` - 数据库主机
- `port`: `5432` - 数据库端口
- `database`: `""` - 数据库名称
- `username`: `""` - 用户名
- `password`: `""` - 密码
- `ssl`: `true` - 是否使用SSL
- `pool_size`: `10` - 连接池大小
- `timeout`: `30` - 连接超时时间（秒）

## 使用方法

### 独立运行迁移脚本
```bash
# 运行完整迁移
python migrations/migrations_001.py

# 运行存储设置初始化
python migrations/migrations_003_storage_defaults.py

# 运行所有设置初始化
python migrations/init_default_settings.py
```

### 应用内自动调用
应用启动时会自动调用 `init_default_settings.py` 来确保所有设置字段的完整性。

## 注意事项

1. **字段完整性**: 迁移脚本会检查现有设置，只添加缺失的字段，不会覆盖已有配置
2. **向后兼容**: 新增字段不会影响现有功能
3. **错误处理**: 应用启动时如果新的初始化失败，会回退到简单初始化模式
4. **数据库连接**: `init_default_settings.py` 支持两种模式：
   - `standalone=True`: 独立运行，自行管理数据库连接
   - `standalone=False`: 应用内调用，使用现有数据库连接

## 开发指南

### 添加新的设置字段
1. 在前端表单中添加新字段
2. 在 `init_default_settings.py` 的相应函数中添加默认值
3. 重启应用，新字段会自动添加到数据库

### 创建新的迁移脚本
1. 参考现有脚本的结构
2. 确保包含适当的错误处理
3. 添加详细的日志输出
4. 更新本README文档

## 故障排除

- **迁移失败**: 检查数据库连接和权限
- **字段缺失**: 运行 `init_default_settings.py` 补充缺失字段
- **设置不生效**: 检查前端表单字段名是否与默认设置一致