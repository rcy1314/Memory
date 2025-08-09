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
    """Create Python distribution package"""
    print("Starting to create Python distribution package...")
    
    # Get project root directory
    project_root = Path(__file__).parent
    dist_dir = project_root / "python-dist"
    
    # Clean old distribution directory
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    
    # Create distribution directory structure
    dist_dir.mkdir(exist_ok=True)
    bin_dir = dist_dir / "bin"
    lib_dir = dist_dir / "lib"
    bin_dir.mkdir(exist_ok=True)
    lib_dir.mkdir(exist_ok=True)
    
    # Create virtual environment
    create_virtual_env(dist_dir, bin_dir, lib_dir)
    
    print(f"Python distribution package created: {dist_dir}")

def create_virtual_env(dist_dir, bin_dir, lib_dir):
    """Create virtual environment and install dependencies"""
    print("Creating virtual environment...")
    
    try:
        # Create virtual environment
        venv_dir = dist_dir / "venv"
        subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], check=True)
        
        # Determine Python and pip paths in virtual environment
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
        
        # Upgrade pip
        subprocess.run([str(venv_python), "-m", "pip", "install", "--upgrade", "pip"], check=True)
        
        # Install dependencies
        requirements_file = Path(__file__).parent / "requirements.txt"
        if requirements_file.exists():
            print("Installing Python dependencies...")
            subprocess.run([str(venv_pip), "install", "-r", str(requirements_file)], check=True)
        
        # Copy Python executable to bin directory
        shutil.copy2(venv_python, python_target)
        shutil.copy2(venv_pip, pip_target)
        
        # Set execution permissions on non-Windows systems
        if system != "windows":
            os.chmod(python_target, 0o755)
            os.chmod(pip_target, 0o755)
        
        # Copy site-packages to lib directory
        if system == "windows":
            site_packages = venv_dir / "Lib" / "site-packages"
        else:
            # Find correct site-packages path
            lib_python_dir = venv_dir / "lib"
            python_version_dirs = [d for d in lib_python_dir.iterdir() if d.is_dir() and d.name.startswith("python")]
            if python_version_dirs:
                site_packages = python_version_dirs[0] / "site-packages"
            else:
                site_packages = lib_python_dir / f"python{sys.version_info.major}.{sys.version_info.minor}" / "site-packages"
        
        if site_packages.exists():
            print(f"Copying site-packages: {site_packages} -> {lib_dir / 'site-packages'}")
            shutil.copytree(site_packages, lib_dir / "site-packages")
        
        # Create launcher script
        create_launcher_script(bin_dir)
        
        print("Python environment preparation completed")
        
    except subprocess.CalledProcessError as e:
        print(f"Failed to create Python environment: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

def create_launcher_script(bin_dir):
    """Create Python launcher script"""
    launcher_content = '''
#!/usr/bin/env python3
import sys
import os
from pathlib import Path

# Get script directory
script_dir = Path(__file__).parent
lib_dir = script_dir.parent / "lib" / "site-packages"

# Add lib directory to Python path
if lib_dir.exists():
    sys.path.insert(0, str(lib_dir))

# Set environment variables
os.environ["PYTHONPATH"] = str(lib_dir) + os.pathsep + os.environ.get("PYTHONPATH", "")

if __name__ == "__main__":
    # Run the passed Python script
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