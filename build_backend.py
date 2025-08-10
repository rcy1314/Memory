#!/usr/bin/env python3
"""
PyInstaller build script for Memory backend
This script creates standalone executables for different platforms
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

def install_pyinstaller():
    """Install PyInstaller if not already installed"""
    try:
        import PyInstaller
        print("PyInstaller already installed")
    except ImportError:
        print("Installing PyInstaller...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])

def create_spec_file():
    """Create PyInstaller spec file"""
    spec_content = '''
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['run.py'],
    pathex=['.'],
    binaries=[],
    datas=[
        ('app', 'app'),
        ('data', 'data'),
        ('migrations', 'migrations'),
        ('uvicorn_loggin_config.json', '.'),
        ('Memory_api.py', '.'),
    ],
    hiddenimports=[
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'fastapi',
        'fastapi.middleware',
        'fastapi.middleware.cors',
        'fastapi.middleware.trustedhost',
        'fastapi.middleware.gzip',
        'fastapi.responses',
        'fastapi.staticfiles',
        'starlette',
        'starlette.middleware',
        'starlette.middleware.cors',
        'starlette.middleware.sessions',
        'starlette.responses',
        'starlette.staticfiles',
        'tortoise',
        'tortoise.backends.sqlite',
        'tortoise.backends.mysql',
        'tortoise.backends.asyncpg',
        'tortoise.models',
        'tortoise.fields',
        'tortoise.contrib.pydantic',
        'aiosqlite',
        'aiomysql',
        'asyncpg',
        'passlib.handlers.argon2',
        'passlib.handlers.bcrypt',
        'passlib.context',
        'argon2',
        'pydantic',
        'pydantic.fields',
        'pydantic.validators',
        'pydantic_settings',
        'email_validator',
        'multipart',
        'python_multipart',
        'PIL',
        'PIL.Image',
        'PIL._tkinter_finder',
        'boto3',
        'botocore',
        'requests',
        'aiohttp',
        'loguru',
        'jwt',
        'pkg_resources.py2_warn',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='memory-backend',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
'''
    
    with open('memory-backend.spec', 'w') as f:
        f.write(spec_content)
    print("Created memory-backend.spec")

def build_executable():
    """Build the executable using PyInstaller"""
    print("Building executable...")
    cmd = [sys.executable, "-m", "PyInstaller", "--clean", "memory-backend.spec"]
    subprocess.check_call(cmd)
    print("Build completed!")

def create_dist_structure():
    """Create distribution structure"""
    dist_dir = Path("backend-dist")
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    
    dist_dir.mkdir()
    
    # Copy executable
    exe_name = "memory-backend.exe" if sys.platform == "win32" else "memory-backend"
    src_exe = Path("dist") / exe_name
    dst_exe = dist_dir / exe_name
    
    if src_exe.exists():
        shutil.copy2(src_exe, dst_exe)
        # Make executable on Unix systems
        if sys.platform != "win32":
            os.chmod(dst_exe, 0o755)
        print(f"Copied executable to {dst_exe}")
    else:
        print(f"Warning: Executable {src_exe} not found")
    
    print(f"Distribution created in {dist_dir}")

def main():
    """Main build process"""
    print("Building Memory backend executable...")
    
    # Install PyInstaller
    install_pyinstaller()
    
    # Create spec file
    create_spec_file()
    
    # Build executable
    build_executable()
    
    # Create distribution structure
    create_dist_structure()
    
    print("\nBuild process completed!")
    print("The executable is available in the 'backend-dist' directory")

if __name__ == "__main__":
    main()