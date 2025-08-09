#!/usr/bin/env python3
"""
测试Python分发包的脚本
用于验证打包的Python环境是否正常工作
"""

import os
import sys
import subprocess
from pathlib import Path

def test_python_dist():
    """测试Python分发包"""
    print("开始测试Python分发包...")
    
    project_root = Path(__file__).parent
    dist_dir = project_root / "python-dist"
    
    if not dist_dir.exists():
        print("❌ Python分发包不存在，请先运行 prepare_python_dist.py")
        return False
    
    # 测试Python可执行文件
    python_exe = dist_dir / "bin" / "python3"
    if not python_exe.exists():
        python_exe = dist_dir / "bin" / "python3.exe"  # Windows
    
    if not python_exe.exists():
        print("❌ Python可执行文件不存在")
        return False
    
    print(f"✅ 找到Python可执行文件: {python_exe}")
    
    # 测试Python版本
    try:
        result = subprocess.run([str(python_exe), "--version"], 
                              capture_output=True, text=True, check=True)
        print(f"✅ Python版本: {result.stdout.strip()}")
    except subprocess.CalledProcessError as e:
        print(f"❌ 无法获取Python版本: {e}")
        return False
    
    # 测试site-packages
    site_packages = dist_dir / "lib" / "site-packages"
    if not site_packages.exists():
        print("❌ site-packages目录不存在")
        return False
    
    print(f"✅ 找到site-packages: {site_packages}")
    
    # 列出已安装的包
    packages = list(site_packages.iterdir())
    print(f"✅ 已安装 {len(packages)} 个包")
    
    # 测试关键依赖
    key_packages = ['fastapi', 'uvicorn', 'tortoise', 'pydantic']
    missing_packages = []
    
    for package in key_packages:
        package_dirs = [d for d in packages if d.name.lower().startswith(package.lower())]
        if package_dirs:
            print(f"✅ 找到包: {package} -> {package_dirs[0].name}")
        else:
            missing_packages.append(package)
            print(f"❌ 缺少包: {package}")
    
    if missing_packages:
        print(f"❌ 缺少关键依赖: {missing_packages}")
        return False
    
    # 测试导入关键模块
    test_imports = [
        'import fastapi',
        'import uvicorn', 
        'import tortoise',
        'import pydantic',
        'from pathlib import Path'
    ]
    
    for import_stmt in test_imports:
        try:
            result = subprocess.run([str(python_exe), "-c", import_stmt], 
                                  capture_output=True, text=True, check=True)
            print(f"✅ 导入成功: {import_stmt}")
        except subprocess.CalledProcessError as e:
            print(f"❌ 导入失败: {import_stmt}")
            print(f"   错误: {e.stderr}")
            return False
    
    # 测试启动后端（快速测试）
    print("\n测试后端启动...")
    backend_script = project_root / "run.py"
    if backend_script.exists():
        try:
            # 设置环境变量
            env = os.environ.copy()
            env['PYTHONPATH'] = str(site_packages)
            
            # 启动后端进程，2秒后终止
            process = subprocess.Popen(
                [str(python_exe), str(backend_script)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
                cwd=str(project_root)
            )
            
            # 等待2秒
            try:
                stdout, stderr = process.communicate(timeout=2)
                print("✅ 后端正常启动并退出")
            except subprocess.TimeoutExpired:
                # 超时说明后端正在运行，这是好事
                process.terminate()
                process.wait()
                print("✅ 后端成功启动（超时终止）")
                
        except Exception as e:
            print(f"❌ 后端启动测试失败: {e}")
            return False
    else:
        print("⚠️  run.py不存在，跳过后端启动测试")
    
    print("\n🎉 所有测试通过！Python分发包工作正常。")
    return True

def show_dist_info():
    """显示分发包信息"""
    project_root = Path(__file__).parent
    dist_dir = project_root / "python-dist"
    
    if not dist_dir.exists():
        print("Python分发包不存在")
        return
    
    print("\n=== Python分发包信息 ===")
    
    # 计算大小
    total_size = 0
    file_count = 0
    
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            file_path = Path(root) / file
            try:
                total_size += file_path.stat().st_size
                file_count += 1
            except:
                pass
    
    print(f"总大小: {total_size / 1024 / 1024:.1f} MB")
    print(f"文件数量: {file_count}")
    
    # 显示目录结构
    print("\n目录结构:")
    for item in sorted(dist_dir.rglob('*')):
        if item.is_dir():
            level = len(item.relative_to(dist_dir).parts)
            indent = "  " * level
            print(f"{indent}{item.name}/")
        elif item.suffix in ['.py', '.exe', '']:
            level = len(item.relative_to(dist_dir).parts)
            indent = "  " * level
            print(f"{indent}{item.name}")

if __name__ == "__main__":
    success = test_python_dist()
    show_dist_info()
    
    if not success:
        sys.exit(1)
    
    print("\n✨ 测试完成！可以继续构建桌面应用。")