#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::{Command, Stdio};
use std::thread;
use std::time::Duration;
use tauri::Manager;
use std::env;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn toggle_fullscreen(window: tauri::Window) -> Result<(), String> {
    let is_fullscreen = window.is_fullscreen().map_err(|e| e.to_string())?;
    window.set_fullscreen(!is_fullscreen).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn is_fullscreen(window: tauri::Window) -> Result<bool, String> {
    window.is_fullscreen().map_err(|e| e.to_string())
}

// 启动FastAPI后端服务器
fn start_backend() {
    thread::spawn(|| {
        // 获取当前可执行文件的目录
        let exe_dir = env::current_exe()
            .ok()
            .and_then(|path| path.parent().map(|p| p.to_path_buf()))
            .unwrap_or_else(|| std::path::PathBuf::from("."));
        
        // 在开发模式下，后端在项目根目录
        // 动态检测路径，支持应用包和直接运行两种情况
        let (backend_path, working_dir, python_path) = if cfg!(debug_assertions) {
            (exe_dir.join("../../../../run.py"), exe_dir.join("../../../.."), "python3".to_string())
        } else {
            // 首先尝试应用包路径
            let app_bundle_path = exe_dir.join("../Resources/python-dist/run.py");
            let app_bundle_working = exe_dir.join("../Resources/python-dist");
            let app_bundle_python = exe_dir.join("../Resources/python-dist/bin/python");
            
            // 如果应用包路径不存在，尝试直接运行路径
            if app_bundle_path.exists() {
                (app_bundle_path, app_bundle_working, app_bundle_python.to_string_lossy().to_string())
            } else {
                let direct_path = exe_dir.join("./python-dist/run.py");
                let direct_working = exe_dir.join("./python-dist");
                let direct_python = exe_dir.join("./python-dist/bin/python");
                (direct_path, direct_working, direct_python.to_string_lossy().to_string())
            }
        };
        
        // 确保数据目录存在
        let data_dir = working_dir.join("data");
        if let Err(e) = std::fs::create_dir_all(&data_dir) {
            eprintln!("Failed to create data directory: {}", e);
        } else {
            println!("Data directory created/verified: {:?}", data_dir);
        }
        
        // 设置 Python 可执行文件权限（仅限 Unix 系统）
        #[cfg(unix)]
        if !cfg!(debug_assertions) {
            use std::os::unix::fs::PermissionsExt;
            if let Ok(python_path_buf) = std::path::Path::new(&python_path).canonicalize() {
                if let Ok(metadata) = std::fs::metadata(&python_path_buf) {
                    let mut perms = metadata.permissions();
                    perms.set_mode(0o755);
                    let _ = std::fs::set_permissions(&python_path_buf, perms);
                }
            }
        }
        
        // 设置 PYTHONPATH 环境变量
        let site_packages_path = working_dir.join("lib/python3.11/site-packages");
        
        let mut cmd = if cfg!(target_os = "windows") {
            let mut cmd = Command::new("cmd");
            cmd.args(["/C", &python_path, backend_path.to_str().unwrap()]);
            cmd
        } else {
            let mut cmd = Command::new(&python_path);
            cmd.arg(backend_path.to_str().unwrap());
            cmd
        };
        
        // 设置环境变量
        if site_packages_path.exists() {
            cmd.env("PYTHONPATH", site_packages_path.to_string_lossy().to_string());
        }
        cmd.env("PYTHONUNBUFFERED", "1");
        
        println!("Attempting to start backend at: {:?}", backend_path);
        println!("Working directory: {:?}", working_dir);
        println!("Python path: {}", python_path);
        
        cmd.current_dir(&working_dir);
        
        match cmd.stdout(Stdio::inherit())
           .stderr(Stdio::inherit())
           .spawn() {
            Ok(mut child) => {
                println!("Backend server started successfully with PID: {}", child.id());
                // 在后台线程中等待子进程
                thread::spawn(move || {
                    match child.wait() {
                        Ok(status) => {
                            println!("Backend process exited with status: {}", status);
                        },
                        Err(e) => {
                            eprintln!("Error waiting for backend process: {}", e);
                        }
                    }
                });
            },
            Err(e) => {
                eprintln!("Failed to start backend server: {}", e);
                eprintln!("Backend path: {:?}", backend_path);
                eprintln!("Working dir: {:?}", working_dir);
            },
        }
    });
}

fn main() {
    // 启动后端服务器
    start_backend();
    
    // 等待后端服务器启动
    thread::sleep(Duration::from_secs(2));
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![greet, toggle_fullscreen, is_fullscreen])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            // 设置窗口标题
            window.set_title("Memory-不负时光相册程序").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}