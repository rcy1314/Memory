#!/usr/bin/env python3
"""
准备Python运行时分发包的脚本
用于将Python运行时和依赖打包到桌面应用中
"""

import os
import sys
import shutil
import subprocess
import platform
from pathlib import Path

def create_python_dist():
    """创建Python分发包"""
    print("开始创建Python分发包...")
    
    # 获取项目根目录
    project_root = Path(__file__).parent
    dist_dir = project_root / "python-dist"
    
    # 清理旧的分发目录
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    
    # 创建分发目录结构
    dist_dir.mkdir(exist_ok=True)
    bin_dir = dist_dir / "bin"
    lib_dir = dist_dir / "lib"
    bin_dir.mkdir(exist_ok=True)
    lib_dir.mkdir(exist_ok=True)
    
    # 创建虚拟环境
    create_virtual_env(dist_dir, bin_dir, lib_dir)
    
    print(f"Python分发包创建完成: {dist_dir}")

def create_virtual_env(dist_dir, bin_dir, lib_dir):
    """创建虚拟环境并安装依赖"""
    print("创建虚拟环境...")
    
    try:
        # 创建虚拟环境
        venv_dir = dist_dir / "venv"
        subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], check=True)
        
        # 确定虚拟环境中的Python和pip路径
        system = platform.system().lower()
        if system == "windows":
            venv_python = venv_dir / "Scripts" / "python.exe"
            venv_pip = venv_dir / "Scripts" / "pip.exe"
            python_target = bin_dir / "python3.exe"
            pip_target = bin_dir / "pip3.exe"
        else:
            venv_python = venv_dir / "bin" / "python"
            venv_pip = venv_dir / "bin" / "pip"
            python_target = bin_dir / "python3"
            pip_target = bin_dir / "pip3"
        
        # 升级pip
        subprocess.run([str(venv_python), "-m", "pip", "install", "--upgrade", "pip"], check=True)
        
        # 安装依赖
        requirements_file = Path(__file__).parent / "requirements.txt"
        if requirements_file.exists():
            print("安装Python依赖...")
            subprocess.run([str(venv_pip), "install", "-r", str(requirements_file)], check=True)
        
        # 复制Python可执行文件到bin目录
        shutil.copy2(venv_python, python_target)
        shutil.copy2(venv_pip, pip_target)
        
        # 在非Windows系统上设置执行权限
        if system != "windows":
            os.chmod(python_target, 0o755)
            os.chmod(pip_target, 0o755)
        
        # 复制site-packages到lib目录
        if system == "windows":
            site_packages = venv_dir / "Lib" / "site-packages"
        else:
            # 查找正确的site-packages路径
            lib_python_dir = venv_dir / "lib"
            python_version_dirs = [d for d in lib_python_dir.iterdir() if d.is_dir() and d.name.startswith("python")]
            if python_version_dirs:
                site_packages = python_version_dirs[0] / "site-packages"
            else:
                site_packages = lib_python_dir / f"python{sys.version_info.major}.{sys.version_info.minor}" / "site-packages"
        
        if site_packages.exists():
            print(f"复制site-packages: {site_packages} -> {lib_dir / 'site-packages'}")
            shutil.copytree(site_packages, lib_dir / "site-packages")
        
        # 创建启动脚本
        create_launcher_script(bin_dir)
        
        print("Python环境准备完成")
        
    except subprocess.CalledProcessError as e:
        print(f"创建Python环境失败: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"意外错误: {e}")
        sys.exit(1)

def create_launcher_script(bin_dir):
    """创建Python启动脚本"""
    launcher_content = '''
#!/usr/bin/env python3
import sys
import os
from pathlib import Path

# 获取脚本所在目录
script_dir = Path(__file__).parent
lib_dir = script_dir.parent / "lib" / "site-packages"

# 添加lib目录到Python路径
if lib_dir.exists():
    sys.path.insert(0, str(lib_dir))

# 设置环境变量
os.environ["PYTHONPATH"] = str(lib_dir) + os.pathsep + os.environ.get("PYTHONPATH", "")

if __name__ == "__main__":
    # 运行传入的Python脚本
    if len(sys.argv) > 1:
        script_path = sys.argv[1]
        with open(script_path, 'r') as f:
            exec(f.read())
'''
    
    launcher_path = bin_dir / "python_launcher.py"
    with open(launcher_path, "w") as f:
        f.write(launcher_content)
    
    if platform.system().lower() != "windows":
        os.chmod(launcher_path, 0o755)

if __name__ == "__main__":
    create_python_dist()