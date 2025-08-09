# 数据库恢复和修复功能

本文档描述了Memory项目中新增的数据库恢复和修复功能，特别是针对挂载外部数据库时可能出现的字段不完整或表结构损坏问题。

## 功能概述

### 1. 自动数据库完整性检查

在Docker容器启动时，系统会自动执行全面的数据库完整性检查：

- **表结构检查**：验证所有必需的表是否存在
- **字段完整性检查**：检查每个表是否包含所有必需的字段
- **数据完整性检查**：验证关键表是否包含基础数据
- **访问性检查**：确保所有表都可以正常查询

### 2. 自动备份机制

- **启动时备份**：每次容器启动时自动创建数据库备份
- **迁移前备份**：在执行任何数据库修复操作前创建备份
- **定期清理**：自动保留最近5个备份文件，删除过期备份
- **紧急备份**：在检测到问题时立即创建紧急备份

### 3. 智能数据恢复

当检测到数据库问题时，系统会按以下顺序尝试恢复：

1. **备份恢复**：从最新的备份文件恢复数据库
2. **完整性验证**：验证恢复后的数据库是否正常
3. **迁移修复**：如果备份恢复失败，执行完整的数据库迁移
4. **重新备份**：修复完成后创建新的备份

### 4. 健康检查脚本

系统提供独立的健康检查脚本，可用于：

- **定期检查**：定时验证数据库状态
- **自动修复**：检测到问题时自动尝试修复
- **监控集成**：可集成到监控系统中

## 使用方法

### Docker 启动

正常启动Docker容器，系统会自动执行所有检查和修复操作：

```bash
docker run -v /path/to/your/database:/app/data memory:latest
```

### 手动健康检查

可以手动执行数据库健康检查：

```bash
# 在容器内执行
/app/db_health_check.sh health-check

# 或从容器外执行
docker exec <container_id> /app/db_health_check.sh health-check
```

### 查看备份文件

备份文件存储在数据目录中：

```bash
# 列出所有备份文件
ls -la /app/data/db_backup_*.sqlite3

# 查看紧急备份
ls -la /app/data/db_emergency_backup_*.sqlite3

# 查看损坏数据库备份
ls -la /app/data/db_corrupted_*.sqlite3
```

## 支持的修复场景

### 1. 缺失表结构

- **问题**：挂载的数据库缺少必需的表
- **解决**：自动创建缺失的表结构
- **数据**：保留现有数据，补充默认数据

### 2. 字段不完整

- **问题**：表存在但缺少必需的字段
- **解决**：执行数据库迁移，添加缺失字段
- **数据**：保留现有数据，新字段使用默认值

### 3. 表结构损坏

- **问题**：表无法正常访问或查询
- **解决**：从备份恢复或重建表结构
- **数据**：尽可能保留数据，必要时从备份恢复

### 4. 数据不完整

- **问题**：表结构正常但缺少关键数据
- **解决**：执行数据初始化，补充默认数据
- **数据**：保留现有数据，补充缺失的默认配置

## 日志和监控

### 启动日志

系统会在启动时输出详细的检查和修复日志：

```
开始初始化数据目录...
数据库文件已存在: /app/data/db.sqlite3
检查数据库完整性...
数据库文件大小: 12345 bytes
表 user 记录数: 1
表 setting 记录数: 1
表 blog 记录数: 5
表 category 记录数: 3
表 api_token 记录数: 1
数据库完整性检查通过
创建数据库备份: /app/data/db_backup_20231201_120000.sqlite3
数据库备份完成
```

### 问题检测日志

当检测到问题时，会输出详细的问题报告：

```
数据库问题汇总:
  缺失表: ['api_token']
  损坏表: ['blog']
  数据问题: ['用户表为空']
需要运行数据库修复和迁移
```

### 恢复过程日志

```
检测到数据库问题，开始修复流程...
创建数据库备份: /app/data/db_backup_20231201_120001.sqlite3
尝试数据恢复...
发现备份文件: /app/data/db_backup_20231201_115959.sqlite3
数据恢复完成，重新检查数据库完整性...
数据恢复成功，数据库完整性验证通过
```

## 最佳实践

### 1. 定期备份

虽然系统会自动创建备份，但建议定期手动备份重要数据：

```bash
# 创建手动备份
cp /app/data/db.sqlite3 /app/data/manual_backup_$(date +%Y%m%d).sqlite3
```

### 2. 监控集成

将健康检查脚本集成到监控系统中：

```bash
# 在crontab中添加定期检查
*/30 * * * * /app/db_health_check.sh health-check >> /var/log/db_health.log 2>&1
```

### 3. 数据迁移前测试

在生产环境中挂载外部数据库前，建议先在测试环境中验证：

```bash
# 测试数据库兼容性
docker run --rm -v /path/to/test/database:/app/data memory:latest python -c "import sqlite3; print('Database accessible')"
```

### 4. 备份管理

定期清理过期的备份文件，避免占用过多磁盘空间：

```bash
# 清理30天前的备份文件
find /app/data -name "db_backup_*.sqlite3" -mtime +30 -delete
find /app/data -name "db_emergency_backup_*.sqlite3" -mtime +7 -delete
find /app/data -name "db_corrupted_*.sqlite3" -mtime +7 -delete
```

## 故障排除

### 常见问题

1. **备份恢复失败**
   - 检查备份文件是否存在且可读
   - 验证备份文件的完整性
   - 查看详细的错误日志

2. **迁移脚本执行失败**
   - 检查Python环境和依赖
   - 验证迁移脚本文件是否存在
   - 查看迁移过程的详细日志

3. **权限问题**
   - 确保数据目录有正确的读写权限
   - 检查数据库文件的权限设置
   - 验证容器用户的权限配置

### 紧急恢复

如果自动恢复失败，可以手动执行以下步骤：

1. **停止容器**
2. **备份当前数据**
3. **从已知良好的备份恢复**
4. **重新启动容器**
5. **验证数据完整性**

```bash
# 紧急恢复步骤
docker stop <container_id>
cp /path/to/data/db.sqlite3 /path/to/data/db_emergency_$(date +%Y%m%d_%H%M%S).sqlite3
cp /path/to/data/db_backup_YYYYMMDD_HHMMSS.sqlite3 /path/to/data/db.sqlite3
docker start <container_id>
```

## 技术细节

### 检查的表结构

系统会检查以下表的完整性：

- **user**: 用户表，包含用户账户信息
- **setting**: 设置表，包含系统配置
- **blog**: 博客表，包含文章内容
- **category**: 分类表，包含文章分类
- **api_token**: API令牌表，包含访问令牌

### 备份文件命名规则

- **常规备份**: `db_backup_YYYYMMDD_HHMMSS.sqlite3`
- **紧急备份**: `db_emergency_backup_YYYYMMDD_HHMMSS.sqlite3`
- **损坏备份**: `db_corrupted_YYYYMMDD_HHMMSS.sqlite3`

### 恢复优先级

1. 最新的常规备份
2. 最新的紧急备份
3. 完整的数据库重建
4. 默认数据初始化

这个数据库恢复系统确保了在各种数据库问题场景下都能够自动或手动恢复到可用状态，最大程度地保护用户数据的安全性和完整性。