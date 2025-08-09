#!/bin/bash
set -e

echo "开始初始化数据目录..."

# 确保数据目录存在并有正确权限
if [ ! -d "/app/data" ]; then
    echo "创建数据目录: /app/data"
    mkdir -p /app/data
else
    echo "数据目录已存在: /app/data"
fi

# 设置数据目录权限
chmod 755 /app/data
echo "设置数据目录权限: 755"

# 检查数据库文件
if [ ! -f "/app/data/db.sqlite3" ]; then
    echo "数据库文件不存在，创建空文件: /app/data/db.sqlite3"
    touch /app/data/db.sqlite3
    chmod 644 /app/data/db.sqlite3
    echo "设置数据库文件权限: 644"
    DB_IS_NEW=true
else
    echo "数据库文件已存在: /app/data/db.sqlite3"
    # 确保现有文件有正确权限
    chmod 644 /app/data/db.sqlite3
    DB_IS_NEW=false
fi

# 显示目录状态
echo "数据目录状态:"
ls -la /app/data/

echo "数据目录初始化完成"

# 检查数据库完整性和表结构
echo "检查数据库完整性..."
check_database_integrity() {
    python3 -c "
import sqlite3
import sys
import os

try:
    # 连接数据库
    conn = sqlite3.connect('/app/data/db.sqlite3')
    cursor = conn.cursor()
    
    # 检查数据库文件大小
    db_size = os.path.getsize('/app/data/db.sqlite3')
    print(f'数据库文件大小: {db_size} bytes')
    
    if db_size == 0:
        print('数据库文件为空，需要完整初始化')
        sys.exit(1)
    
    # 动态获取数据库表结构，避免硬编码
    # 获取所有表名
    cursor.execute('SELECT name FROM sqlite_master WHERE type=\"table\" AND name NOT LIKE \"sqlite_%\"')
    all_tables = [row[0] for row in cursor.fetchall()]
    
    # 核心表列表（必须存在的表）
    core_tables = ['user', 'setting', 'blog', 'category', 'api_token']
    
    # 检查核心表是否存在
    missing_core_tables = []
    for table in core_tables:
        if table not in all_tables:
            missing_core_tables.append(table)
    
    if missing_core_tables:
        print(f'缺失核心表: {missing_core_tables}')
        print('数据库需要完整初始化')
        sys.exit(1)
    
    # 检查所有表的完整性
    corrupted_tables = []
    
    for table_name in all_tables:
        try:
            # 检查表结构是否可以正常访问
            cursor.execute(f'PRAGMA table_info({table_name})')
            columns_info = cursor.fetchall()
            
            if not columns_info:
                print(f'表 {table_name} 无字段信息，可能损坏')
                corrupted_tables.append(table_name)
                continue
            
            existing_columns = [row[1] for row in columns_info]
            print(f'表 {table_name} 字段: {existing_columns}')
            
            # 检查表是否可以正常查询
            cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
            count = cursor.fetchone()[0]
            print(f'表 {table_name} 记录数: {count}')
            
        except Exception as table_error:
            print(f'表 {table_name} 损坏或无法访问: {table_error}')
            corrupted_tables.append(table_name)
    
    # 检查核心表的数据完整性
    data_issues = []
    
    # 检查用户表数据
    if 'user' in all_tables and 'user' not in corrupted_tables:
        try:
            cursor.execute('SELECT COUNT(*) FROM user')
            user_count = cursor.fetchone()[0]
            print(f'用户数量: {user_count}')
            if user_count == 0:
                data_issues.append('用户表为空')
        except:
            data_issues.append('用户表数据损坏')
    
    # 检查设置表数据
    if 'setting' in all_tables and 'setting' not in corrupted_tables:
        try:
            cursor.execute('SELECT COUNT(*) FROM setting')
            setting_count = cursor.fetchone()[0]
            print(f'设置记录数量: {setting_count}')
            if setting_count == 0:
                data_issues.append('设置表为空')
        except:
            data_issues.append('设置表数据损坏')
    
    conn.close()
    
    # 判断是否需要修复
    if corrupted_tables or data_issues:
        print('数据库问题汇总:')
        if corrupted_tables:
            print(f'  损坏表: {corrupted_tables}')
        if data_issues:
            print(f'  数据问题: {data_issues}')
        print('需要运行数据库修复和迁移')
        sys.exit(1)
    else:
        print('数据库完整性检查通过')
        sys.exit(0)
        
except Exception as e:
    print(f'数据库检查失败: {e}')
    print('数据库可能严重损坏，需要完整重建')
    sys.exit(1)
"
}

# 数据库备份和恢复功能
create_database_backup() {
    if [ -f "/app/data/db.sqlite3" ]; then
        BACKUP_FILE="/app/data/db_backup_$(date +%Y%m%d_%H%M%S).sqlite3"
        echo "创建数据库备份: $BACKUP_FILE"
        cp "/app/data/db.sqlite3" "$BACKUP_FILE"
        
        # 只保留最近5个备份文件
        ls -t /app/data/db_backup_*.sqlite3 2>/dev/null | tail -n +6 | xargs -r rm
        echo "数据库备份完成"
    fi
}

# 尝试数据恢复
attempt_data_recovery() {
    echo "尝试数据恢复..."
    
    # 查找最新的备份文件
    LATEST_BACKUP=$(ls -t /app/data/db_backup_*.sqlite3 2>/dev/null | head -n 1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        echo "发现备份文件: $LATEST_BACKUP"
        echo "尝试从备份恢复数据..."
        
        # 备份当前损坏的数据库
        if [ -f "/app/data/db.sqlite3" ]; then
            mv "/app/data/db.sqlite3" "/app/data/db_corrupted_$(date +%Y%m%d_%H%M%S).sqlite3"
        fi
        
        # 从备份恢复
        cp "$LATEST_BACKUP" "/app/data/db.sqlite3"
        chmod 644 "/app/data/db.sqlite3"
        
        echo "数据恢复完成，重新检查数据库完整性..."
        
        # 重新检查恢复后的数据库
        if check_database_integrity; then
            echo "数据恢复成功，数据库完整性验证通过"
            return 0
        else
            echo "恢复的数据库仍有问题，将进行完整重建"
            return 1
        fi
    else
        echo "未找到可用的备份文件，将进行完整重建"
        return 1
    fi
}

# 执行数据库完整性检查
if [ "$DB_IS_NEW" = "false" ]; then
    if check_database_integrity; then
        echo "数据库完整性检查通过，跳过迁移"
        SKIP_MIGRATION=true
    else
        echo "数据库需要迁移或修复"
        SKIP_MIGRATION=false
    fi
else
    echo "新数据库，需要完整初始化"
    SKIP_MIGRATION=false
fi

# 运行数据库迁移（如果需要）
if [ "$SKIP_MIGRATION" != "true" ]; then
    echo "检测到数据库问题，开始修复流程..."
    
    # 如果不是新数据库，先创建备份
    if [ "$DB_IS_NEW" = "false" ]; then
        create_database_backup
        
        # 尝试数据恢复
        if attempt_data_recovery; then
            echo "数据恢复成功，跳过迁移"
        else
            echo "数据恢复失败，开始运行数据库迁移..."
            
            # 按顺序运行所有迁移脚本
            echo "运行主要迁移脚本..."
            python -m migrations.migrations_001
            echo "migrations_001 完成"
            
            # 检查并运行其他迁移脚本
            if [ -f "migrations/migrations_003_storage_defaults.py" ]; then
                echo "运行存储默认设置迁移..."
                python -m migrations.migrations_003_storage_defaults
                echo "migrations_003_storage_defaults 完成"
            fi
            
            echo "所有数据库迁移完成"
        fi
    else
        echo "新数据库，开始完整初始化..."
        
        # 按顺序运行所有迁移脚本
        echo "运行主要迁移脚本..."
        python -m migrations.migrations_001
        echo "migrations_001 完成"
        
        # 检查并运行其他迁移脚本
        if [ -f "migrations/migrations_003_storage_defaults.py" ]; then
            echo "运行存储默认设置迁移..."
            python -m migrations.migrations_003_storage_defaults
            echo "migrations_003_storage_defaults 完成"
        fi
        
        echo "所有数据库迁移完成"
    fi
    
    # 迁移完成后创建新的备份
    create_database_backup
else
    echo "数据库完整性检查通过，跳过迁移"
    # 即使跳过迁移，也创建一个备份以备后用
    create_database_backup
fi

# 创建数据库健康检查脚本
cat > /app/db_health_check.sh << 'EOF'
#!/bin/bash
# 数据库健康检查脚本

check_and_repair_database() {
    echo "$(date): 开始数据库健康检查..."
    
    # 使用相同的完整性检查逻辑
    python3 -c "
import sqlite3
import sys
import os

try:
    conn = sqlite3.connect('/app/data/db.sqlite3')
    cursor = conn.cursor()
    
    # 快速健康检查
    cursor.execute('SELECT name FROM sqlite_master WHERE type=\"table\" AND name NOT LIKE \"sqlite_%\"')
    all_tables = [row[0] for row in cursor.fetchall()]
    
    # 核心表列表
    core_tables = ['user', 'setting', 'blog', 'category', 'api_token']
    
    issues = []
    
    # 检查核心表是否存在
    for table_name in core_tables:
        if table_name not in all_tables:
            issues.append(f'缺失核心表: {table_name}')
    
    # 检查所有表的基本完整性
    for table_name in all_tables:
        try:
            cursor.execute(f'PRAGMA table_info({table_name})')
            columns_info = cursor.fetchall()
            
            if not columns_info:
                issues.append(f'表 {table_name} 无字段信息')
                continue
            
            cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
        except Exception as e:
            issues.append(f'表 {table_name} 访问异常: {str(e)}')
    
    conn.close()
    
    if issues:
        print('检测到数据库问题:')
        for issue in issues:
            print(f'  - {issue}')
        sys.exit(1)
    else:
        print('数据库健康检查通过')
        sys.exit(0)
        
except Exception as e:
    print(f'健康检查失败: {e}')
    sys.exit(1)
"
    
    if [ $? -eq 0 ]; then
        echo "$(date): 数据库健康检查通过"
        return 0
    else
        echo "$(date): 检测到数据库问题，尝试自动修复..."
        
        # 创建紧急备份
        if [ -f "/app/data/db.sqlite3" ]; then
            cp "/app/data/db.sqlite3" "/app/data/db_emergency_backup_$(date +%Y%m%d_%H%M%S).sqlite3"
        fi
        
        # 尝试从最新备份恢复
        LATEST_BACKUP=$(ls -t /app/data/db_backup_*.sqlite3 2>/dev/null | head -n 1)
        if [ -n "$LATEST_BACKUP" ]; then
            echo "$(date): 从备份恢复: $LATEST_BACKUP"
            cp "$LATEST_BACKUP" "/app/data/db.sqlite3"
            chmod 644 "/app/data/db.sqlite3"
            echo "$(date): 数据库已从备份恢复"
        else
            echo "$(date): 未找到备份文件，数据库可能需要手动修复"
        fi
        
        return 1
    fi
}

# 如果作为健康检查调用
if [ "$1" = "health-check" ]; then
    check_and_repair_database
fi
EOF

chmod +x /app/db_health_check.sh

echo "数据库健康检查脚本已创建"
echo "启动应用..."

# 启动应用
exec "$@"