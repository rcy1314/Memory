import logging
import asyncio
from datetime import datetime
from fastapi import APIRouter, HTTPException
from tortoise import Tortoise, connections
from tortoise.exceptions import DBConnectionError

from app.schemas.base import Fail, Success
from app.schemas.database import DatabaseTestConnection, DatabaseMigration
from app.core.dependency import DependPermisson
from app.controllers.setting import setting_controller
from app.core.database import init_db
from app.utils.logger import logger

database_router = APIRouter()


async def _create_postgresql_tables(conn):
    """为PostgreSQL手动创建表结构"""
    tables_sql = [
        """
        CREATE TABLE IF NOT EXISTS "user" (
            "id" SERIAL PRIMARY KEY,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "username" VARCHAR(20) NOT NULL UNIQUE,
            "alias" VARCHAR(30),
            "email" VARCHAR(191) NOT NULL UNIQUE,
            "avatar" VARCHAR(191) NOT NULL,
            "password" VARCHAR(128),
            "last_login" TIMESTAMP NULL,
            "remark" TEXT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS "setting" (
            "id" SERIAL PRIMARY KEY,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "general" TEXT NOT NULL,
            "meta" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "storage" TEXT NOT NULL,
            "database" TEXT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS "category" (
            "id" SERIAL PRIMARY KEY,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "name" VARCHAR(30) NOT NULL UNIQUE,
            "alias" VARCHAR(50) NOT NULL UNIQUE,
            "desc" TEXT,
            "order" INT NOT NULL DEFAULT 0,
            "parent_id" INT NOT NULL DEFAULT 0,
            "remark" TEXT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS "blog" (
            "id" SERIAL PRIMARY KEY,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "title" VARCHAR(50) NOT NULL,
            "desc" TEXT,
            "location" TEXT,
            "time" TIMESTAMP NULL,
            "is_hidden" BOOLEAN NOT NULL DEFAULT FALSE,
            "remark" TEXT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS "blog_image" (
            "id" SERIAL PRIMARY KEY,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "blog_id" INT NOT NULL,
            "image_url" TEXT NOT NULL,
            "title" VARCHAR(50),
            "desc" TEXT,
            "location" TEXT,
            "time" TIMESTAMP NULL,
            "is_hidden" BOOLEAN NOT NULL DEFAULT FALSE,
            "metadata" TEXT,
            "order" INT NOT NULL DEFAULT 0,
            FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE CASCADE
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS "api_token" (
            "id" SERIAL PRIMARY KEY,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "name" VARCHAR(100) NOT NULL,
            "token" VARCHAR(191) NOT NULL UNIQUE,
            "is_permanent" BOOLEAN NOT NULL DEFAULT FALSE,
            "expires_at" TIMESTAMP NULL,
            "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
            "last_used" TIMESTAMP NULL,
            "user_id" INT NOT NULL,
            "remark" TEXT,
            FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS "blog_category" (
            "blog_id" INT NOT NULL,
            "category_id" INT NOT NULL,
            PRIMARY KEY ("blog_id", "category_id"),
            FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE CASCADE,
            FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE
        );
        """
    ]
    
    for sql in tables_sql:
        try:
            await conn.execute_query(sql.strip())
            quote_char = '"'
            logger.info(f"成功创建表: {sql.split(quote_char)[1]}")
        except Exception as e:
            logger.error(f"创建表失败: {str(e)}")
            raise e


async def _create_mysql_tables(conn):
    """为MySQL手动创建表结构，避免JSON字段语法问题"""
    tables_sql = [
        """
        CREATE TABLE IF NOT EXISTS `user` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `username` VARCHAR(20) NOT NULL UNIQUE COMMENT '用户名',
            `alias` VARCHAR(30) COMMENT '昵称',
            `email` VARCHAR(191) NOT NULL UNIQUE COMMENT '邮箱',
            `avatar` VARCHAR(191) NOT NULL UNIQUE COMMENT '头像地址',
            `password` VARCHAR(128) COMMENT '密码',
            `last_login` TIMESTAMP NULL COMMENT '最后登录时间',
            `remark` TEXT COMMENT '保留字段'
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `setting` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `general` TEXT NOT NULL COMMENT '通用设置',
            `meta` TEXT NOT NULL COMMENT '网站设置',
            `content` TEXT NOT NULL COMMENT '内容设置',
            `storage` TEXT NOT NULL COMMENT '存储设置',
            `database` TEXT COMMENT '数据库设置'
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `category` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `name` VARCHAR(30) NOT NULL UNIQUE COMMENT '分类名称',
            `alias` VARCHAR(50) NOT NULL UNIQUE COMMENT '分类别名，用于生成路径',
            `desc` TEXT COMMENT '描述',
            `order` INT NOT NULL DEFAULT 0 COMMENT '排序',
            `parent_id` INT NOT NULL DEFAULT 0 COMMENT '父分类ID',
            `remark` TEXT COMMENT '保留字段'
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `blog` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `title` VARCHAR(50) NOT NULL COMMENT '博客标题',
            `desc` TEXT COMMENT '博客描述',
            `location` TEXT COMMENT '博客位置，如黄山等',
            `time` TIMESTAMP NULL COMMENT '博客时间',
            `is_hidden` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否隐藏此博客',
            `remark` TEXT COMMENT '保留字段'
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `blog_image` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `blog_id` INT NOT NULL,
            `image_url` TEXT NOT NULL COMMENT '图片地址',
            `title` VARCHAR(50) COMMENT '图片标题，留空则使用博客标题',
            `desc` TEXT COMMENT '图片描述，留空则使用博客描述',
            `location` TEXT COMMENT '图片的具体位置，如莲花峰、天都峰等，如果和博客位置相同则留空',
            `time` TIMESTAMP NULL COMMENT '图片时间，留空则使用博客时间',
            `is_hidden` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否隐藏此图片',
            `metadata` TEXT COMMENT '拍摄参数，EXIF信息等',
            `order` INT NOT NULL DEFAULT 0 COMMENT '排序',
            FOREIGN KEY (`blog_id`) REFERENCES `blog`(`id`) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `api_token` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            `name` VARCHAR(100) NOT NULL COMMENT 'Token名称',
            `token` VARCHAR(191) NOT NULL UNIQUE COMMENT 'Token值',
            `is_permanent` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否永久有效',
            `expires_at` TIMESTAMP NULL COMMENT '过期时间',
            `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
            `last_used` TIMESTAMP NULL COMMENT '最后使用时间',
            `user_id` INT NOT NULL,
            `remark` TEXT COMMENT '备注',
            FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `blog_category` (
            `blog_id` INT NOT NULL,
            `category_id` INT NOT NULL,
            PRIMARY KEY (`blog_id`, `category_id`),
            FOREIGN KEY (`blog_id`) REFERENCES `blog`(`id`) ON DELETE CASCADE,
            FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        """
    ]
    
    for sql in tables_sql:
        try:
            await conn.execute_query(sql.strip())
            logger.info(f"成功创建表: {sql.split('`')[1]}")
        except Exception as e:
            logger.error(f"创建表失败: {str(e)}")
            raise e


def convert_datetime_fields(values, table_name):
    """转换日期时间字段从字符串到datetime对象"""
    converted_values = list(values)
    
    if table_name == "user":
        # User表的字段顺序：id, username, alias, email, avatar, password, last_login, remark, created_at, updated_at
        datetime_indices = [6, 8, 9]  # last_login, created_at, updated_at
    elif table_name == "setting":
        # Setting表的字段顺序：id, general, meta, content, storage, database, created_at, updated_at
        datetime_indices = [6, 7]  # created_at, updated_at
    elif table_name == "api_token":
        # ApiToken表的字段顺序：id, name, token, is_permanent, expires_at, is_active, last_used, user_id, remark, created_at, updated_at
        datetime_indices = [4, 6, 9, 10]  # expires_at, last_used, created_at, updated_at
    else:
        return converted_values
    
    for idx in datetime_indices:
        if idx < len(converted_values) and converted_values[idx] is not None:
            if isinstance(converted_values[idx], str):
                try:
                    # 尝试解析不同的日期时间格式
                    datetime_str = converted_values[idx]
                    
                    # 处理带时区的格式
                    if '+' in datetime_str and datetime_str.count(':') >= 3:
                        # 格式：2025-07-31 00:32:35.799337+08:00
                        datetime_str = datetime_str.split('+')[0]  # 移除时区部分
                    
                    # 处理微秒
                    if '.' in datetime_str:
                        # 格式：2025-08-01 14:36:53.480062
                        datetime_str = datetime_str.split('.')[0]  # 移除微秒部分
                    
                    if 'T' in datetime_str:
                        # ISO格式：2023-01-01T12:00:00
                        converted_values[idx] = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                    else:
                        # 标准格式：2023-01-01 12:00:00
                        converted_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                except (ValueError, TypeError) as e:
                    logger.warning(f"无法转换日期时间字段 {idx}: {converted_values[idx]}, 错误: {e}")
                    # 如果转换失败，设置为None
                    converted_values[idx] = None
    
    return converted_values


@database_router.post("/test-connection", summary="测试数据库连接", dependencies=[DependPermisson])
async def test_database_connection(
    connection_data: DatabaseTestConnection,
):
    """
    测试数据库连接
    """
    try:
        # 根据数据库类型构建连接字符串
        if connection_data.db_type == "sqlite":
            db_url = f"sqlite://{connection_data.db_path}"
        elif connection_data.db_type == "postgresql":
            db_url = f"postgres://{connection_data.username}:{connection_data.password}@{connection_data.host}:{connection_data.port}/{connection_data.database}"
        elif connection_data.db_type == "mysql":
            db_url = f"mysql://{connection_data.username}:{connection_data.password}@{connection_data.host}:{connection_data.port}/{connection_data.database}"
        else:
            raise HTTPException(status_code=400, detail="不支持的数据库类型")
        
        # 测试连接 - 只测试连接，不加载模型
        test_config = {
            "connections": {
                "test": db_url
            },
            "apps": {
                "models": {
                    "models": [],  # 空模型列表，只测试连接
                    "default_connection": "test",
                }
            },
        }
        
        await Tortoise.init(config=test_config)
        # 尝试执行一个简单的查询来验证连接
        from tortoise import connections
        conn = connections.get("test")
        await conn.execute_query("SELECT 1")
        await Tortoise.close_connections()
        
        return Success(msg="数据库连接测试成功")
        
    except DBConnectionError as e:
        logger.error(f"数据库连接失败: {str(e)}")
        return Fail(msg=f"数据库连接失败: {str(e)}")
    except Exception as e:
        logger.error(f"测试连接时发生错误: {str(e)}")
        return Fail(msg=f"测试连接时发生错误: {str(e)}")


@database_router.post("/migrate", summary="迁移数据库数据", dependencies=[DependPermisson])
async def migrate_database_data(
    migration_data: DatabaseMigration,
):
    """
    从当前数据库迁移数据到新数据库
    """
    try:
        # 获取当前数据库设置
        current_setting = await setting_controller.get(id=1)
        current_db_config = current_setting.database
        
        # 构建源数据库连接字符串
        if current_db_config["database_type"] == "sqlite":
            source_db_url = f"sqlite://{current_db_config['sqlite_path']}"
        elif current_db_config["database_type"] == "postgresql" or current_db_config["database_type"] == "neon":
            source_db_url = f"postgres://{current_db_config['neon_username']}:{current_db_config['neon_password']}@{current_db_config['neon_host']}:{current_db_config['neon_port']}/{current_db_config['neon_database']}"
        elif current_db_config["database_type"] == "mysql":
            source_db_url = f"mysql://{current_db_config['mysql_username']}:{current_db_config['mysql_password']}@{current_db_config['mysql_host']}:{current_db_config['mysql_port']}/{current_db_config['mysql_database']}"
        
        # 构建目标数据库连接字符串
        if migration_data.target_db_type == "sqlite":
            target_db_url = f"sqlite://{migration_data.target_db_path}"
        elif migration_data.target_db_type == "postgresql":
            ssl_param = "?ssl=true" if migration_data.target_ssl else "?ssl=false"
            target_db_url = f"postgres://{migration_data.target_username}:{migration_data.target_password}@{migration_data.target_host}:{migration_data.target_port}/{migration_data.target_database}{ssl_param}"
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            target_db_url = f"mysql://{migration_data.target_username}:{migration_data.target_password}@{migration_data.target_host}:{migration_data.target_port}/{migration_data.target_database}"
        
        # 配置源和目标数据库连接
        migration_config = {
            "connections": {
                "source": source_db_url,
                "target": target_db_url
            },
            "apps": {
                "models": {
                    "models": ["app.models"],
                    "default_connection": "target",
                }
            },
        }
        
        await Tortoise.init(config=migration_config)
        
        # 在目标数据库中创建表结构
        if migration_data.target_db_type in ("mysql", "mariadb"):
            # MySQL中手动创建表结构，避免JSON字段语法问题
            await _create_mysql_tables(connections.get("target"))
        elif migration_data.target_db_type in ("postgres", "postgresql"):
            # PostgreSQL中手动创建表结构，确保语法兼容性
            await _create_postgresql_tables(connections.get("target"))
        else:
            await Tortoise.generate_schemas(safe=True)
        
        # 获取数据库连接
        source_conn = connections.get("source")
        target_conn = connections.get("target")
        
        # 验证表是否已创建
        try:
            if migration_data.target_db_type in ("postgres", "postgresql"):
                test_query = await target_conn.execute_query('SELECT 1 FROM "user" LIMIT 1')
                logger.info("用户表验证成功")
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                test_query = await target_conn.execute_query('SELECT 1 FROM `user` LIMIT 1')
                logger.info("用户表验证成功")
            else:
                test_query = await target_conn.execute_query('SELECT 1 FROM "user" LIMIT 1')
                logger.info("用户表验证成功")
        except Exception as e:
            logger.error(f"表验证失败: {str(e)}")
            raise HTTPException(status_code=400, detail=f"表结构创建失败: {str(e)}")
        
        # 先检查目标数据库user表结构
        try:
            if migration_data.target_db_type in ("postgres", "postgresql"):
                # 先验证表是否存在
                table_exists = await target_conn.execute_query(
                    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user')"
                )
                if not table_exists[1][0][0]:
                    raise Exception("user表不存在")
                
                target_user_columns = await target_conn.execute_query(
                    "SELECT column_name FROM information_schema.columns WHERE table_name = 'user' AND table_schema = 'public' ORDER BY ordinal_position"
                )
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                target_user_columns = await target_conn.execute_query(
                    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user' AND TABLE_SCHEMA = DATABASE() ORDER BY ORDINAL_POSITION"
                )
            else:  # SQLite
                target_user_columns = await target_conn.execute_query('PRAGMA table_info("user")')
            
            if not target_user_columns[1]:
                raise Exception("无法获取user表结构信息")
        except Exception as e:
            logger.error(f"获取表结构失败: {str(e)}")
            raise HTTPException(status_code=400, detail=f"表结构检查失败: {str(e)}")
        
        logger.info(f"目标数据库user表字段数: {len(target_user_columns[1]) if target_user_columns[1] else 0}")
        if target_user_columns[1]:
            try:
                logger.info(f"target_user_columns[1]内容: {target_user_columns[1]}")
                logger.info(f"target_user_columns[1]类型: {type(target_user_columns[1])}")
                if target_user_columns[1]:
                    logger.info(f"第一行数据: {target_user_columns[1][0]}")
                    logger.info(f"第一行数据类型: {type(target_user_columns[1][0])}")
                # 处理不同数据库返回的字段结构格式
                if target_user_columns[1] and isinstance(target_user_columns[1][0], dict):
                    # MySQL返回字典格式: {'COLUMN_NAME': 'field_name'}
                    target_field_names = [row['COLUMN_NAME'] for row in target_user_columns[1]]
                else:
                    # SQLite返回元组格式: ('field_name', ...)
                    target_field_names = [row[0] for row in target_user_columns[1]]
                logger.info(f"目标数据库user表字段顺序: {target_field_names}")
            except Exception as field_error:
                logger.error(f"获取字段名称失败: {str(field_error)}")
                logger.error(f"异常类型: {type(field_error)}")
                logger.error(f"异常详情: {repr(field_error)}")
                raise Exception(f"无法解析目标数据库字段结构: {str(field_error)}") from field_error
        
        # 迁移用户数据
        logger.info("开始执行用户数据查询...")
        try:
            users_data = await source_conn.execute_query('SELECT * FROM "user"')
            logger.info("用户数据查询执行完成")
            logger.info(f"users_data结构: {users_data}")
            logger.info(f"users_data类型: {type(users_data)}")
            logger.info(f"users_data长度: {len(users_data) if users_data else 0}")
            if len(users_data) > 1:
                logger.info(f"users_data[1]类型: {type(users_data[1])}")
                logger.info(f"users_data[1]内容: {users_data[1]}")
            logger.info(f"源数据库用户数据列数: {len(users_data[1][0]) if users_data and len(users_data) > 1 and users_data[1] and len(users_data[1]) > 0 else 0}")
        except Exception as query_error:
            logger.error(f"执行用户数据查询失败: {str(query_error)}")
            logger.error(f"异常类型: {type(query_error)}")
            logger.error(f"异常详情: {repr(query_error)}")
            raise Exception(f"无法从源数据库获取用户数据: {str(query_error)}") from query_error
        
        if not users_data[1]:
            raise Exception("源数据库中没有用户数据，无法进行迁移")
        
        for user_row in users_data[1]:  # users_data[1] contains the actual rows
            # 将sqlite3.Row对象转换为tuple，然后转换为list
            source_values = tuple(user_row)
            logger.info(f"源数据参数数量: {len(source_values)}, 参数内容: {source_values}")
            
            # 源数据库字段顺序：id, username, alias, email, avatar, password, last_login, remark, created_at, updated_at
            # 目标数据库字段顺序：id, created_at, updated_at, username, alias, email, avatar, password, last_login, remark
            # 重新映射字段顺序
            if target_user_columns[1]:
                # 处理不同数据库返回的字段结构格式
                if isinstance(target_user_columns[1][0], dict):
                    # MySQL返回字典格式: {'COLUMN_NAME': 'field_name'}
                    target_field_names = [row['COLUMN_NAME'] for row in target_user_columns[1]]
                else:
                    # SQLite返回元组格式: ('field_name', ...)
                    target_field_names = [row[0] for row in target_user_columns[1]]
                # 创建字段映射
                source_field_mapping = {
                    'id': 0, 'username': 1, 'alias': 2, 'email': 3, 'avatar': 4, 
                    'password': 5, 'last_login': 6, 'remark': 7, 'created_at': 8, 'updated_at': 9
                }
                
                # 按目标字段顺序重新排列数据
                user_values = []
                for field_name in target_field_names:
                    if field_name in source_field_mapping:
                        user_values.append(source_values[source_field_mapping[field_name]])
                    else:
                        user_values.append(None)  # 如果字段不存在，设置为None
                
                logger.info(f"重新映射后参数数量: {len(user_values)}, 参数内容: {tuple(user_values)}")
            else:
                user_values = list(source_values)
            
            # 转换日期时间字段（基于目标数据库的字段顺序）
            if migration_data.target_db_type in ("postgres", "postgresql"):
                # 目标字段顺序中的datetime字段位置：created_at(1), updated_at(2), last_login(8)
                datetime_indices = [1, 2, 8]  # created_at, updated_at, last_login
                logger.info(f"开始转换datetime字段，索引: {datetime_indices}")
                for idx in datetime_indices:
                    if idx < len(user_values) and user_values[idx] is not None:
                        logger.info(f"处理字段 {idx}: {user_values[idx]}, 类型: {type(user_values[idx])}")
                        if isinstance(user_values[idx], str):
                            try:
                                datetime_str = user_values[idx]
                                original_str = datetime_str
                                # 处理带时区的ISO格式，如 '2025-07-31 00:32:35.799337+08:00'
                                if '+' in datetime_str or '-' in datetime_str[-6:]:
                                    # 使用 fromisoformat 处理带时区的格式
                                    user_values[idx] = datetime.fromisoformat(datetime_str)
                                    logger.info(f"成功转换带时区格式: {original_str} -> {user_values[idx]}")
                                elif 'T' in datetime_str:
                                    # 处理ISO格式
                                    user_values[idx] = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                                    logger.info(f"成功转换ISO格式: {original_str} -> {user_values[idx]}")
                                else:
                                    # 处理标准格式
                                    if '.' in datetime_str:
                                        # 有微秒的格式
                                        user_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S.%f')
                                        logger.info(f"成功转换微秒格式: {original_str} -> {user_values[idx]}")
                                    else:
                                        # 无微秒的格式
                                        user_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                                        logger.info(f"成功转换标准格式: {original_str} -> {user_values[idx]}")
                            except (ValueError, TypeError) as e:
                                logger.warning(f"无法转换日期时间字段 {idx}: {user_values[idx]}, 错误: {e}")
                                user_values[idx] = None
                logger.info(f"datetime转换完成后参数: {tuple(user_values)}")
            
            # 根据目标数据库类型调整占位符和表名引用
            if migration_data.target_db_type in ("postgres", "postgresql"):
                placeholders = ', '.join([f'${i+1}' for i in range(len(user_values))])
                sql_query = f'INSERT INTO "user" VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING'
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                placeholders = ', '.join(['%s'] * len(user_values))
                sql_query = f'INSERT IGNORE INTO `user` VALUES ({placeholders})'
            else:  # SQLite
                placeholders = ', '.join(['?'] * len(user_values))
                sql_query = f'INSERT OR IGNORE INTO "user" VALUES ({placeholders})'
            logger.info(f"执行SQL: {sql_query}")
            
            await target_conn.execute_query(sql_query, list(user_values))
        
        # 检查setting表结构
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_setting_columns = await target_conn.execute_query(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'setting' AND table_schema = 'public' ORDER BY ordinal_position"
            )
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            target_setting_columns = await target_conn.execute_query(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'setting' AND TABLE_SCHEMA = DATABASE() ORDER BY ORDINAL_POSITION"
            )
        else:  # SQLite
            target_setting_columns = await target_conn.execute_query('PRAGMA table_info("setting")')

        # 获取目标数据库setting表字段顺序
        target_setting_field_names = []
        if migration_data.target_db_type in ("postgres", "postgresql"):
            for row in target_setting_columns[1]:
                target_setting_field_names.append(row[0])
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            for row in target_setting_columns[1]:
                # MySQL返回字典格式: {'COLUMN_NAME': 'field_name'}
                if isinstance(row, dict):
                    target_setting_field_names.append(row['COLUMN_NAME'])
                else:
                    # 兼容元组格式: ('field_name', ...)
                    target_setting_field_names.append(row[0])
        else:  # SQLite
            for row in target_setting_columns[1]:
                target_setting_field_names.append(row[1])  # SQLite PRAGMA返回的字段名在索引1
        
        logger.info(f"目标数据库setting表字段顺序: {target_setting_field_names}")
        
        # 迁移设置数据
        settings_data = await source_conn.execute_query('SELECT * FROM "setting"')
        logger.info(f"设置数据列数: {len(settings_data[1][0]) if settings_data[1] else 0}")
        for setting_row in settings_data[1]:
            source_values = tuple(setting_row)
            logger.info(f"源setting数据参数: {source_values}")
            
            # 源数据库字段顺序（基于SQLite）：id, created_at, updated_at, general, meta, content, storage, database
            source_setting_field_mapping = {
                'id': 0,
                'created_at': 1,
                'updated_at': 2,
                'general': 3,
                'meta': 4, 
                'content': 5,
                'storage': 6,
                'database': 7
            }
            
            # 按目标字段顺序重新排列数据
            setting_values = []
            for field_name in target_setting_field_names:
                if field_name in source_setting_field_mapping:
                    setting_values.append(source_values[source_setting_field_mapping[field_name]])
                else:
                    setting_values.append(None)
            
            logger.info(f"重新映射后setting参数: {tuple(setting_values)}")
            
            # 转换日期时间字段（基于目标数据库的字段顺序）
            if migration_data.target_db_type in ("postgres", "postgresql"):
                # 查找created_at和updated_at在目标字段中的位置
                datetime_indices = []
                for i, field_name in enumerate(target_setting_field_names):
                    if field_name in ['created_at', 'updated_at']:
                        datetime_indices.append(i)
                
                logger.info(f"setting表datetime字段索引: {datetime_indices}")
                for idx in datetime_indices:
                    if idx < len(setting_values) and setting_values[idx] is not None:
                        if isinstance(setting_values[idx], str):
                            try:
                                datetime_str = setting_values[idx]
                                if '+' in datetime_str or '-' in datetime_str[-6:]:
                                    setting_values[idx] = datetime.fromisoformat(datetime_str)
                                elif 'T' in datetime_str:
                                    setting_values[idx] = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                                else:
                                    if '.' in datetime_str:
                                        setting_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S.%f')
                                    else:
                                        setting_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                                logger.info(f"成功转换setting datetime字段 {idx}: {setting_values[idx]}")
                            except (ValueError, TypeError) as e:
                                logger.warning(f"无法转换setting日期时间字段 {idx}: {setting_values[idx]}, 错误: {e}")
                                setting_values[idx] = None
            
            if migration_data.target_db_type in ("postgres", "postgresql"):
                placeholders = ', '.join([f'${i+1}' for i in range(len(setting_values))])
                sql_query = f'INSERT INTO "setting" VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING'
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                placeholders = ', '.join(['%s'] * len(setting_values))
                sql_query = f'INSERT IGNORE INTO `setting` VALUES ({placeholders})'
            else:  # SQLite
                placeholders = ', '.join(['?'] * len(setting_values))
                sql_query = f'INSERT OR IGNORE INTO "setting" VALUES ({placeholders})'
            
            await target_conn.execute_query(sql_query, list(setting_values))
        
        # 检查category表结构
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_category_columns = await target_conn.execute_query(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'category' AND table_schema = 'public' ORDER BY ordinal_position"
            )
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            target_category_columns = await target_conn.execute_query(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'category' AND TABLE_SCHEMA = DATABASE() ORDER BY ORDINAL_POSITION"
            )
        else:  # SQLite
            target_category_columns = await target_conn.execute_query('PRAGMA table_info("category")')

        # 获取目标数据库category表字段顺序
        target_category_field_names = []
        if migration_data.target_db_type in ("postgres", "postgresql"):
            for row in target_category_columns[1]:
                target_category_field_names.append(row[0])
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            for row in target_category_columns[1]:
                # MySQL返回字典格式: {'COLUMN_NAME': 'field_name'}
                if isinstance(row, dict):
                    target_category_field_names.append(row['COLUMN_NAME'])
                else:
                    # 兼容元组格式: ('field_name', ...)
                    target_category_field_names.append(row[0])
        else:  # SQLite
            for row in target_category_columns[1]:
                target_category_field_names.append(row[1])  # SQLite PRAGMA返回的字段名在索引1
        
        logger.info(f"目标数据库category表字段顺序: {target_category_field_names}")
        
        # 迁移分类数据
        categories_data = await source_conn.execute_query('SELECT * FROM "category"')
        logger.info(f"分类数据列数: {len(categories_data[1][0]) if categories_data[1] else 0}")
        for category_row in categories_data[1]:
            source_values = tuple(category_row)
            logger.info(f"源category数据参数: {source_values}")
            
            # 源数据库字段顺序（基于SQLite）：id, created_at, updated_at, name, alias, desc, order, parent_id, remark
            source_category_field_mapping = {
                'id': 0,
                'created_at': 1,
                'updated_at': 2,
                'name': 3,
                'alias': 4,
                'desc': 5,
                'order': 6,
                'parent_id': 7,
                'remark': 8
            }
            
            # 按目标字段顺序重新排列数据
            category_values = []
            for field_name in target_category_field_names:
                if field_name in source_category_field_mapping:
                    category_values.append(source_values[source_category_field_mapping[field_name]])
                else:
                    category_values.append(None)
            
            logger.info(f"重新映射后category参数: {tuple(category_values)}")
            
            # 转换日期时间字段（基于目标数据库的字段顺序）
            if migration_data.target_db_type in ("postgres", "postgresql"):
                # 查找created_at和updated_at在目标字段中的位置
                datetime_indices = []
                for i, field_name in enumerate(target_category_field_names):
                    if field_name in ['created_at', 'updated_at']:
                        datetime_indices.append(i)
                
                logger.info(f"category表datetime字段索引: {datetime_indices}")
                for idx in datetime_indices:
                    if idx < len(category_values) and category_values[idx] is not None:
                        if isinstance(category_values[idx], str):
                            try:
                                datetime_str = category_values[idx]
                                if '+' in datetime_str or '-' in datetime_str[-6:]:
                                    category_values[idx] = datetime.fromisoformat(datetime_str)
                                elif 'T' in datetime_str:
                                    category_values[idx] = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                                else:
                                    if '.' in datetime_str:
                                        category_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S.%f')
                                    else:
                                        category_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                                logger.info(f"成功转换category datetime字段 {idx}: {category_values[idx]}")
                            except (ValueError, TypeError) as e:
                                logger.warning(f"无法转换category日期时间字段 {idx}: {category_values[idx]}, 错误: {e}")
                                category_values[idx] = None
            
            if migration_data.target_db_type in ("postgres", "postgresql"):
                placeholders = ', '.join([f'${i+1}' for i in range(len(category_values))])
                sql_query = f'INSERT INTO "category" VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING'
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                placeholders = ', '.join(['%s'] * len(category_values))
                sql_query = f'INSERT IGNORE INTO `category` VALUES ({placeholders})'
            else:  # SQLite
                placeholders = ', '.join(['?'] * len(category_values))
                sql_query = f'INSERT OR IGNORE INTO "category" VALUES ({placeholders})'
            
            await target_conn.execute_query(sql_query, list(category_values))
        
        # 检查blog表结构
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_blog_columns = await target_conn.execute_query(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'blog' AND table_schema = 'public' ORDER BY ordinal_position"
            )
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            target_blog_columns = await target_conn.execute_query(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'blog' AND TABLE_SCHEMA = DATABASE() ORDER BY ORDINAL_POSITION"
            )
        else:  # SQLite
            target_blog_columns = await target_conn.execute_query('PRAGMA table_info("blog")')

        # 获取目标数据库blog表字段顺序
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_blog_field_names = [row[0] for row in target_blog_columns[1]] if target_blog_columns[1] else []
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            # MySQL返回字典格式: {'COLUMN_NAME': 'field_name'}
            if target_blog_columns[1] and isinstance(target_blog_columns[1][0], dict):
                target_blog_field_names = [row['COLUMN_NAME'] for row in target_blog_columns[1]]
            else:
                # 兼容元组格式: ('field_name', ...)
                target_blog_field_names = [row[0] for row in target_blog_columns[1]] if target_blog_columns[1] else []
        else:  # SQLite
            target_blog_field_names = [row[1] for row in target_blog_columns[1]] if target_blog_columns[1] else []
        
        logger.info(f"目标数据库blog表字段顺序: {target_blog_field_names}")
        
        # SQLite源数据库blog表字段映射 (基于实际schema)
        source_blog_field_mapping = {
            'id': 0,
            'created_at': 1,
            'updated_at': 2,
            'title': 3,
            'desc': 4,
            'location': 5,
            'time': 6,
            'is_hidden': 7,
            'remark': 8
        }

        # 迁移博客数据
        blogs_data = await source_conn.execute_query('SELECT * FROM "blog"')
        logger.info(f"博客数据列数: {len(blogs_data[1][0]) if blogs_data[1] else 0}")
        for blog_row in blogs_data[1]:
            blog_values = list(blog_row)
            logger.info(f"源blog数据参数: {tuple(blog_values)}")
            
            # 根据目标数据库字段顺序重新排列数据
            if target_blog_field_names:
                reordered_values = []
                for field_name in target_blog_field_names:
                    if field_name in source_blog_field_mapping:
                        source_index = source_blog_field_mapping[field_name]
                        if source_index < len(blog_values):
                            reordered_values.append(blog_values[source_index])
                        else:
                            reordered_values.append(None)
                    else:
                        reordered_values.append(None)
                blog_values = reordered_values
            
            logger.info(f"重新映射后blog参数: {tuple(blog_values)}")
            
            # 转换datetime字段
            if target_blog_field_names:
                datetime_indices = []
                for i, field_name in enumerate(target_blog_field_names):
                    if field_name in ['created_at', 'updated_at', 'time']:
                        datetime_indices.append(i)
                
                logger.info(f"blog表datetime字段索引: {datetime_indices}")
                for idx in datetime_indices:
                    if idx < len(blog_values) and blog_values[idx] is not None:
                        if isinstance(blog_values[idx], str):
                            try:
                                datetime_str = blog_values[idx]
                                if '+' in datetime_str or '-' in datetime_str[-6:]:
                                    blog_values[idx] = datetime.fromisoformat(datetime_str)
                                elif 'T' in datetime_str:
                                    blog_values[idx] = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                                else:
                                    if '.' in datetime_str:
                                        blog_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S.%f')
                                    else:
                                        blog_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                                logger.info(f"成功转换blog datetime字段 {idx}: {blog_values[idx]}")
                            except (ValueError, TypeError) as e:
                                logger.warning(f"无法转换blog日期时间字段 {idx}: {blog_values[idx]}, 错误: {e}")
                                blog_values[idx] = None
                
                # 转换布尔字段
                boolean_indices = []
                for i, field_name in enumerate(target_blog_field_names):
                    if field_name == 'is_hidden':
                        boolean_indices.append(i)
                
                logger.info(f"blog表boolean字段索引: {boolean_indices}")
                for idx in boolean_indices:
                    if idx < len(blog_values) and blog_values[idx] is not None:
                        if isinstance(blog_values[idx], int):
                            blog_values[idx] = bool(blog_values[idx])
                            logger.info(f"成功转换blog boolean字段 {idx}: {blog_values[idx]}")
                        elif isinstance(blog_values[idx], str):
                            blog_values[idx] = blog_values[idx].lower() in ('true', '1', 'yes', 'on')
                            logger.info(f"成功转换blog boolean字段 {idx}: {blog_values[idx]}")
            
            if migration_data.target_db_type in ("postgres", "postgresql"):
                placeholders = ', '.join([f'${i+1}' for i in range(len(blog_values))])
                sql_query = f'INSERT INTO "blog" VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING'
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                placeholders = ', '.join(['%s'] * len(blog_values))
                sql_query = f'INSERT IGNORE INTO `blog` VALUES ({placeholders})'
            else:  # SQLite
                placeholders = ', '.join(['?'] * len(blog_values))
                sql_query = f'INSERT OR IGNORE INTO "blog" VALUES ({placeholders})'
            
            await target_conn.execute_query(sql_query, list(blog_values))
        
        # 检查api_token表结构
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_api_token_columns = await target_conn.execute_query(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'api_token' AND table_schema = 'public' ORDER BY ordinal_position"
            )
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            target_api_token_columns = await target_conn.execute_query(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'api_token' AND TABLE_SCHEMA = DATABASE() ORDER BY ORDINAL_POSITION"
            )
        else:  # SQLite
            target_api_token_columns = await target_conn.execute_query('PRAGMA table_info("api_token")')

        # 获取目标数据库api_token表字段顺序
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_api_token_field_names = [row[0] for row in target_api_token_columns[1]] if target_api_token_columns[1] else []
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            # MySQL返回字典格式: {'COLUMN_NAME': 'field_name'}
            if target_api_token_columns[1] and isinstance(target_api_token_columns[1][0], dict):
                target_api_token_field_names = [row['COLUMN_NAME'] for row in target_api_token_columns[1]]
            else:
                # 兼容元组格式: ('field_name', ...)
                target_api_token_field_names = [row[0] for row in target_api_token_columns[1]] if target_api_token_columns[1] else []
        else:  # SQLite
            target_api_token_field_names = [row[1] for row in target_api_token_columns[1]] if target_api_token_columns[1] else []
        
        logger.info(f"目标数据库api_token表字段顺序: {target_api_token_field_names}")
        
        # SQLite源数据库api_token表字段映射 (基于实际schema)
        source_api_token_field_mapping = {
            'id': 0,
            'created_at': 1,
            'updated_at': 2,
            'name': 3,
            'token': 4,
            'is_permanent': 5,
            'expires_at': 6,
            'is_active': 7,
            'last_used': 8,
            'user_id': 9,
            'remark': 10
        }

        # 迁移API Token数据
        tokens_data = await source_conn.execute_query('SELECT * FROM "api_token"')
        logger.info(f"API Token数据列数: {len(tokens_data[1][0]) if tokens_data[1] else 0}")
        for token_row in tokens_data[1]:
            token_values = list(token_row)
            logger.info(f"源api_token数据参数: {tuple(token_values)}")
            
            # 根据目标数据库字段顺序重新排列数据
            if target_api_token_field_names:
                reordered_values = []
                for field_name in target_api_token_field_names:
                    if field_name in source_api_token_field_mapping:
                        source_index = source_api_token_field_mapping[field_name]
                        if source_index < len(token_values):
                            reordered_values.append(token_values[source_index])
                        else:
                            reordered_values.append(None)
                    else:
                        reordered_values.append(None)
                token_values = reordered_values
            
            logger.info(f"重新映射后api_token参数: {tuple(token_values)}")
            
            # 转换datetime字段
            if target_api_token_field_names:
                datetime_indices = []
                for i, field_name in enumerate(target_api_token_field_names):
                    if field_name in ['created_at', 'updated_at', 'expires_at', 'last_used']:
                        datetime_indices.append(i)
                
                logger.info(f"api_token表datetime字段索引: {datetime_indices}")
                for idx in datetime_indices:
                    if idx < len(token_values) and token_values[idx] is not None:
                        if isinstance(token_values[idx], str):
                            try:
                                datetime_str = token_values[idx]
                                if '+' in datetime_str or '-' in datetime_str[-6:]:
                                    token_values[idx] = datetime.fromisoformat(datetime_str)
                                elif 'T' in datetime_str:
                                    token_values[idx] = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                                else:
                                    if '.' in datetime_str:
                                        token_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S.%f')
                                    else:
                                        token_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                                logger.info(f"成功转换api_token datetime字段 {idx}: {token_values[idx]}")
                            except (ValueError, TypeError) as e:
                                logger.warning(f"无法转换api_token日期时间字段 {idx}: {token_values[idx]}, 错误: {e}")
                                token_values[idx] = None
                
                # 转换布尔字段
                boolean_indices = []
                for i, field_name in enumerate(target_api_token_field_names):
                    if field_name in ['is_permanent', 'is_active']:
                        boolean_indices.append(i)
                
                logger.info(f"api_token表boolean字段索引: {boolean_indices}")
                for idx in boolean_indices:
                    if idx < len(token_values) and token_values[idx] is not None:
                        if isinstance(token_values[idx], int):
                            token_values[idx] = bool(token_values[idx])
                            logger.info(f"成功转换api_token boolean字段 {idx}: {token_values[idx]}")
                        elif isinstance(token_values[idx], str):
                            token_values[idx] = token_values[idx].lower() in ('true', '1', 'yes', 'on')
                            logger.info(f"成功转换api_token boolean字段 {idx}: {token_values[idx]}")
            
            if migration_data.target_db_type in ("postgres", "postgresql"):
                placeholders = ', '.join([f'${i+1}' for i in range(len(token_values))])
                sql_query = f'INSERT INTO "api_token" VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING'
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                placeholders = ', '.join(['%s'] * len(token_values))
                sql_query = f'INSERT IGNORE INTO `api_token` VALUES ({placeholders})'
            else:  # SQLite
                placeholders = ', '.join(['?'] * len(token_values))
                sql_query = f'INSERT OR IGNORE INTO "api_token" VALUES ({placeholders})'
            
            await target_conn.execute_query(sql_query, list(token_values))
        
        # 检查blog_image表结构
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_blog_image_columns = await target_conn.execute_query(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'blog_image' AND table_schema = 'public' ORDER BY ordinal_position"
            )
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            target_blog_image_columns = await target_conn.execute_query(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'blog_image' AND TABLE_SCHEMA = DATABASE() ORDER BY ORDINAL_POSITION"
            )
        else:  # SQLite
            target_blog_image_columns = await target_conn.execute_query('PRAGMA table_info("blog_image")')

        # 获取目标数据库blog_image表字段顺序
        if migration_data.target_db_type in ("postgres", "postgresql"):
            target_blog_image_field_names = [row[0] for row in target_blog_image_columns[1]] if target_blog_image_columns[1] else []
        elif migration_data.target_db_type in ("mysql", "mariadb"):
            # MySQL返回字典格式: {'COLUMN_NAME': 'field_name'}
            if target_blog_image_columns[1] and isinstance(target_blog_image_columns[1][0], dict):
                target_blog_image_field_names = [row['COLUMN_NAME'] for row in target_blog_image_columns[1]]
            else:
                # 兼容元组格式: ('field_name', ...)
                target_blog_image_field_names = [row[0] for row in target_blog_image_columns[1]] if target_blog_image_columns[1] else []
        else:  # SQLite
            target_blog_image_field_names = [row[1] for row in target_blog_image_columns[1]] if target_blog_image_columns[1] else []
        
        logger.info(f"目标数据库blog_image表字段顺序: {target_blog_image_field_names}")
        
        # SQLite源数据库blog_image表字段映射 (基于实际schema)
        source_blog_image_field_mapping = {
            'id': 0,
            'created_at': 1,
            'updated_at': 2,
            'image_url': 3,
            'title': 4,
            'desc': 5,
            'location': 6,
            'time': 7,
            'is_hidden': 8,
            'metadata': 9,
            'order': 10,
            'blog_id': 11
        }

        # 迁移Blog Image数据
        blog_images_data = await source_conn.execute_query('SELECT * FROM "blog_image"')
        logger.info(f"Blog Image数据列数: {len(blog_images_data[1][0]) if blog_images_data[1] else 0}")
        for image_row in blog_images_data[1]:
            image_values = list(image_row)
            logger.info(f"源blog_image数据参数: {tuple(image_values)}")
            
            # 根据目标数据库字段顺序重新排列数据
            if target_blog_image_field_names:
                reordered_values = []
                for field_name in target_blog_image_field_names:
                    if field_name in source_blog_image_field_mapping:
                        source_index = source_blog_image_field_mapping[field_name]
                        if source_index < len(image_values):
                            reordered_values.append(image_values[source_index])
                        else:
                            reordered_values.append(None)
                    else:
                        reordered_values.append(None)
                image_values = reordered_values
            
            logger.info(f"重新映射后blog_image参数: {tuple(image_values)}")
            
            # 转换datetime字段
            if target_blog_image_field_names:
                datetime_indices = []
                for i, field_name in enumerate(target_blog_image_field_names):
                    if field_name in ['created_at', 'updated_at', 'time']:
                        datetime_indices.append(i)
                
                logger.info(f"blog_image表datetime字段索引: {datetime_indices}")
                for idx in datetime_indices:
                    if idx < len(image_values) and image_values[idx] is not None:
                        if isinstance(image_values[idx], str):
                            try:
                                datetime_str = image_values[idx]
                                if '+' in datetime_str or '-' in datetime_str[-6:]:
                                    image_values[idx] = datetime.fromisoformat(datetime_str)
                                elif 'T' in datetime_str:
                                    image_values[idx] = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                                else:
                                    if '.' in datetime_str:
                                        image_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S.%f')
                                    else:
                                        image_values[idx] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                                logger.info(f"成功转换blog_image datetime字段 {idx}: {image_values[idx]}")
                            except (ValueError, TypeError) as e:
                                logger.warning(f"无法转换blog_image日期时间字段 {idx}: {image_values[idx]}, 错误: {e}")
                                image_values[idx] = None
                
                # 转换布尔字段
                boolean_indices = []
                for i, field_name in enumerate(target_blog_image_field_names):
                    if field_name in ['is_hidden']:
                        boolean_indices.append(i)
                
                logger.info(f"blog_image表boolean字段索引: {boolean_indices}")
                for idx in boolean_indices:
                    if idx < len(image_values) and image_values[idx] is not None:
                        if isinstance(image_values[idx], int):
                            image_values[idx] = bool(image_values[idx])
                            logger.info(f"成功转换blog_image boolean字段 {idx}: {image_values[idx]}")
                        elif isinstance(image_values[idx], str):
                            image_values[idx] = image_values[idx].lower() in ('true', '1', 'yes', 'on')
                            logger.info(f"成功转换blog_image boolean字段 {idx}: {image_values[idx]}")
            
            if migration_data.target_db_type in ("postgres", "postgresql"):
                placeholders = ', '.join([f'${i+1}' for i in range(len(image_values))])
                sql_query = f'INSERT INTO "blog_image" VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING'
            elif migration_data.target_db_type in ("mysql", "mariadb"):
                placeholders = ', '.join(['%s'] * len(image_values))
                sql_query = f'INSERT IGNORE INTO `blog_image` VALUES ({placeholders})'
            else:  # SQLite
                placeholders = ', '.join(['?'] * len(image_values))
                sql_query = f'INSERT OR IGNORE INTO "blog_image" VALUES ({placeholders})'
            
            await target_conn.execute_query(sql_query, list(image_values))
        
        await Tortoise.close_connections()
        
        # 数据迁移成功后，更新数据库配置
        try:
            # 构建新的数据库配置
            new_db_config = {
                "database_type": migration_data.target_db_type,
                "sqlite_path": migration_data.target_db_path if migration_data.target_db_type == "sqlite" else "",
                "neon_host": migration_data.target_host if migration_data.target_db_type == "postgresql" else "",
                "neon_port": migration_data.target_port if migration_data.target_db_type == "postgresql" else 5432,
                "neon_database": migration_data.target_database if migration_data.target_db_type == "postgresql" else "",
                "neon_username": migration_data.target_username if migration_data.target_db_type == "postgresql" else "",
                "neon_password": migration_data.target_password if migration_data.target_db_type == "postgresql" else "",
                "neon_ssl": migration_data.target_ssl if migration_data.target_db_type == "postgresql" else True,
                "mysql_host": migration_data.target_host if migration_data.target_db_type in ("mysql", "mariadb") else "",
                "mysql_port": migration_data.target_port if migration_data.target_db_type in ("mysql", "mariadb") else 3306,
                "mysql_database": migration_data.target_database if migration_data.target_db_type in ("mysql", "mariadb") else "",
                "mysql_username": migration_data.target_username if migration_data.target_db_type in ("mysql", "mariadb") else "",
                "mysql_password": migration_data.target_password if migration_data.target_db_type in ("mysql", "mariadb") else "",
                "mysql_ssl": migration_data.target_ssl if migration_data.target_db_type in ("mysql", "mariadb") else False,
                "postgresql_host": "",
                "postgresql_port": 5432,
                "postgresql_database": "",
                "postgresql_username": "",
                "postgresql_password": "",
                "postgresql_ssl": False,
                "connection_pool_size": current_db_config.get("connection_pool_size", 10),
                "connection_timeout": current_db_config.get("connection_timeout", 30),
            }
            
            # 更新数据库配置
            from app.schemas.setting import SettingUpdateDatabase
            await setting_controller.update(id=1, obj_in=SettingUpdateDatabase(database=new_db_config))
            logger.info("数据库配置已更新")
            
            # 重新初始化数据库连接
            await init_db()
            logger.info("数据库连接已重新初始化")
            
        except Exception as config_error:
            logger.error(f"更新数据库配置失败: {str(config_error)}")
            try:
                # 配置更新失败时，恢复原来的数据库连接
                await init_db()
                logger.info("已恢复原数据库连接")
            except Exception as restore_error:
                logger.error(f"恢复原数据库连接失败: {str(restore_error)}")
            return Fail(msg=f"数据迁移完成，但配置更新失败: {str(config_error)}。请手动保存数据库设置。")
        
        return Success(msg="数据迁移完成，数据库配置已自动更新")
        
    except Exception as e:
        logger.error(f"数据迁移失败: {str(e)}")
        try:
            # 关闭迁移过程中的连接
            await Tortoise.close_connections()
            # 重新初始化原来的数据库连接
            await init_db()
            logger.info("已恢复原数据库连接")
        except Exception as restore_error:
            logger.error(f"恢复原数据库连接失败: {str(restore_error)}")
        return Fail(msg=f"数据迁移失败: {str(e)}")