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
    """Create a proper virtual environment for distribution"""
    print("Creating virtual environment...")
    
    try:
        # Create virtual environment using venv module
        venv_path = dist_dir
        print(f"Creating virtual environment at: {venv_path}")
        
        # Create virtual environment
        subprocess.run([
            sys.executable, "-m", "venv", 
            str(venv_path),
            "--copies"  # Use copies instead of symlinks for better portability
        ], check=True)
        
        # Determine system type and set paths
        system = platform.system().lower()
        if system == "windows":
            python_executable = venv_path / "Scripts" / "python.exe"
            pip_executable = venv_path / "Scripts" / "pip.exe"
        else:
            python_executable = venv_path / "bin" / "python"
            pip_executable = venv_path / "bin" / "pip"
        
        # Verify Python executable exists and works
        if not python_executable.exists():
            raise FileNotFoundError(f"Python executable not found: {python_executable}")
        
        # Test the Python executable
        result = subprocess.run([str(python_executable), "--version"], 
                              capture_output=True, text=True, check=True)
        print(f"Virtual environment Python version: {result.stdout.strip()}")
        
        # Upgrade pip in virtual environment
        print("Upgrading pip in virtual environment...")
        subprocess.run([
            str(python_executable), "-m", "pip", "install", "--upgrade", "pip"
        ], check=True)
        
        # Install packages from requirements.txt
        requirements_file = Path("requirements.txt")
        if requirements_file.exists():
            print(f"Installing packages from requirements.txt...")
            try:
                subprocess.run([
                    str(python_executable), "-m", "pip", "install", 
                    "-r", str(requirements_file),
                    "--no-warn-script-location"
                ], check=True, cwd=str(Path.cwd()))
                print("Successfully installed all required packages")
            except subprocess.CalledProcessError as e:
                print(f"Failed to install some packages: {e}")
                print("Continuing with available packages...")
        else:
            print("Warning: requirements.txt not found")
        
        # Create symlinks for easier access (Unix systems)
        if system != "windows":
            # Create python3 symlink
            python3_link = bin_dir / "python3"
            if python3_link.exists():
                python3_link.unlink()
            python3_link.symlink_to(python_executable)
            
            # Create pip3 symlink  
            pip3_link = bin_dir / "pip3"
            if pip3_link.exists():
                pip3_link.unlink()
            pip3_link.symlink_to(pip_executable)
            
            # Set proper permissions
            os.chmod(python_executable, 0o755)
            os.chmod(pip_executable, 0o755)
        
        # Copy application files
        copy_application_files(dist_dir)
        
        print("Python virtual environment created successfully")
        
    except subprocess.CalledProcessError as e:
        print(f"Failed to create virtual environment: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


def copy_essential_packages(target_site_packages):
    """Create minimal site-packages with just __init__.py"""
    # Create a minimal site-packages directory
    target_site_packages.mkdir(parents=True, exist_ok=True)
    
    # Create __init__.py to make it a valid Python package directory
    init_file = target_site_packages / "__init__.py"
    with open(init_file, 'w') as f:
        f.write("# Minimal site-packages directory for Tauri app\n")
    
    print("Created minimal site-packages directory")


def copy_application_files(dist_dir):
    """Copy application files to distribution directory"""
    try:
        # Copy main application files
        files_to_copy = [
            'run.py',
            'Memory_api.py',
            'requirements.txt',
            'uvicorn_loggin_config.json'
        ]
        
        for file_name in files_to_copy:
            src_file = Path(file_name)
            if src_file.exists():
                dst_file = dist_dir / file_name
                shutil.copy2(src_file, dst_file)
                print(f"Copied {file_name} to distribution")
        
        # Copy directories
        dirs_to_copy = ['app', 'migrations', 'data']
        for dir_name in dirs_to_copy:
            src_dir = Path(dir_name)
            if src_dir.exists():
                dst_dir = dist_dir / dir_name
                if dst_dir.exists():
                    shutil.rmtree(dst_dir)
                shutil.copytree(src_dir, dst_dir)
                print(f"Copied {dir_name}/ directory to distribution")
        
        # Copy frontend dist directory
        frontend_dist = Path('dist')
        if frontend_dist.exists():
            dst_dist = dist_dir / 'dist'
            if dst_dist.exists():
                shutil.rmtree(dst_dist)
            shutil.copytree(frontend_dist, dst_dist)
            print(f"Copied dist/ directory to distribution")
        
        # Ensure data directory exists
        data_dir = dist_dir / "data"
        data_dir.mkdir(exist_ok=True)
        
    except Exception as e:
        print(f"Error copying application files: {e}")

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