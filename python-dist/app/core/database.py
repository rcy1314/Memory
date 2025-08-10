import os
from tortoise import Tortoise
from app.utils import logger
import glob
import importlib
import asyncio


async def get_db_connection_config():
    """动态获取数据库连接配置"""
    from app.utils.config import settings
    
    # 首先尝试使用默认SQLite配置连接，以读取数据库设置
    default_config = {
        "db_url": f"sqlite:///{settings.DATA_DIR}/db.sqlite3?timeout=30&journal_mode=WAL&synchronous=NORMAL&cache_size=10000&temp_store=memory",
        "modules": {"models": ["app.models"]},
        "use_tz": False,
        "timezone": "Asia/Shanghai",
    }
    
    try:
        # 临时连接到默认数据库以读取设置
        await Tortoise.init(**default_config)
        
        # 检查setting表是否存在
        connection = Tortoise.get_connection("default")
        try:
            result = await connection.execute_query('SELECT database FROM "setting" WHERE id = 1')
            if result[1] and result[1][0] and result[1][0][0]:
                import json
                db_config = json.loads(result[1][0][0])
                
                # 根据数据库类型构建连接配置
                if db_config.get("database_type") == "postgresql" or db_config.get("database_type") == "neon":
                    ssl_param = "?ssl=true" if db_config.get("neon_ssl", True) else "?ssl=false"
                    db_url = f"postgres://{db_config['neon_username']}:{db_config['neon_password']}@{db_config['neon_host']}:{db_config['neon_port']}/{db_config['neon_database']}{ssl_param}"
                    
                    await Tortoise.close_connections()
                    return {
                        "db_url": db_url,
                        "modules": {"models": ["app.models"]},
                        "use_tz": False,
                        "timezone": "Asia/Shanghai",
                    }
                    
                elif db_config.get("database_type") == "mysql":
                    db_url = f"mysql://{db_config['mysql_username']}:{db_config['mysql_password']}@{db_config['mysql_host']}:{db_config['mysql_port']}/{db_config['mysql_database']}"
                    
                    await Tortoise.close_connections()
                    return {
                        "db_url": db_url,
                        "modules": {"models": ["app.models"]},
                        "use_tz": False,
                        "timezone": "Asia/Shanghai",
                    }
                    
        except Exception as e:
            logger.info(f"无法读取数据库设置，使用默认SQLite配置: {str(e)}")
            
        await Tortoise.close_connections()
        return default_config
        
    except Exception as e:
        logger.info(f"使用默认SQLite配置: {str(e)}")
        return default_config


async def init_db():
    try:
        # 获取动态数据库连接配置
        db_connection = await get_db_connection_config()
        logger.info(f"使用数据库连接: {db_connection['db_url'].split('@')[0]}@***")
        
        await Tortoise.init(**db_connection)
        
        # 验证数据库连接
        connection = Tortoise.get_connection("default")
        await connection.execute_query("SELECT 1")
        logger.info("数据库连接验证成功")

        # 创建migrations表（兼容不同数据库类型）
        db_url = db_connection['db_url']
        if 'postgres' in db_url:
            # PostgreSQL语法
            await connection.execute_script(
                """
                CREATE TABLE IF NOT EXISTS migrates (
                    id SERIAL PRIMARY KEY,
                    migration_file VARCHAR(255) NOT NULL UNIQUE,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """
            )
        elif 'mysql' in db_url:
            # MySQL语法
            await connection.execute_script(
                """
                CREATE TABLE IF NOT EXISTS migrates (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    migration_file VARCHAR(255) NOT NULL UNIQUE,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """
            )
        else:
            # SQLite语法
            await connection.execute_script(
                """
                CREATE TABLE IF NOT EXISTS migrates (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    migration_file VARCHAR(255) NOT NULL UNIQUE,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """
            )

        await execute_migrations()
    except Exception as e:
        logger.error(f"数据库初始化失败: {str(e)}")
        raise


async def execute_migrations():
    """执行数据库迁移"""
    try:
        # 收集迁移文件
        migration_files = []
        for root, dirs, _ in os.walk("."):
            if "migrations" in dirs:
                migration_path = os.path.join(root, "migrations")
                migration_files.extend(
                    glob.glob(os.path.join(migration_path, "migrations_*.py"))
                )

        migration_files.sort()
        
        # 获取数据库连接信息以确定参数占位符类型
        connection = Tortoise.get_connection("default")
        # 通过连接类型判断数据库类型
        is_postgres = 'asyncpg' in str(type(connection))
        is_mysql = 'aiomysql' in str(type(connection))
        
        for migration_file in migration_files:
            file_name = os.path.basename(migration_file)
            
            # 根据数据库类型使用不同的参数占位符
            if is_postgres:
                # PostgreSQL使用$1, $2等
                executed = await connection.execute_query(
                    "SELECT id FROM migrates WHERE migration_file = $1", [file_name]
                )
            else:
                # SQLite和MySQL使用?
                executed = await connection.execute_query(
                    "SELECT id FROM migrates WHERE migration_file = ?", [file_name]
                )

            if not executed[1]:
                logger.info(f"执行迁移: {file_name} for {migration_file}")
                module_path = (
                    migration_file.replace("./", "")
                    .replace("/", ".")
                    .replace(".\\", "")
                    .replace("\\", ".")
                    .replace(".py", "")
                )
                try:
                    migration_module = importlib.import_module(module_path)
                    if hasattr(migration_module, "migrate"):
                        await migration_module.migrate()
                        
                        # 根据数据库类型使用不同的参数占位符
                        if is_postgres:
                            await connection.execute_query(
                                "INSERT INTO migrates (migration_file) VALUES ($1)",
                                [file_name],
                            )
                        else:
                            await connection.execute_query(
                                "INSERT INTO migrates (migration_file) VALUES (?)",
                                [file_name],
                            )
                        logger.info(f"迁移完成: {file_name}")
                except Exception as e:
                    logger.error(f"迁移 {file_name} 执行失败: {str(e)}")
                    raise

    except Exception as e:
        logger.error(f"迁移过程发生错误: {str(e)}")
        raise
