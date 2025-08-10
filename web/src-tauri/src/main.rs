#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::{Command, Stdio};
use std::thread;
use std::time::Duration;
use std::path::PathBuf;
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

// 检查后端服务器是否启动
// 启动后端服务器
fn start_backend() {
    thread::spawn(|| {
        // 获取当前可执行文件的目录
        let exe_dir = env::current_exe()
            .ok()
            .and_then(|path| path.parent().map(|p| p.to_path_buf()))
            .unwrap_or_else(|| std::path::PathBuf::from("."));
        
        // 简化路径检测逻辑
        let (backend_path, working_dir, python_path) = if cfg!(debug_assertions) {
            // 开发模式
            let project_root = exe_dir.join("_up_").join("_up_");
            let python_dist = project_root.join("python-dist");
            let python_exe = python_dist.join("bin").join("python");
            let python_path = if python_exe.exists() {
                python_exe.to_string_lossy().to_string()
            } else {
                "python3".to_string()
            };
            (python_dist.join("run.py"), python_dist, python_path)
        } else {
            // 生产模式 - 简化路径检测
            let app_bundle_path = exe_dir.join("../Resources/python-dist/run.py");
            let app_bundle_working = exe_dir.join("../Resources/python-dist");
            let venv_python = app_bundle_working.join("bin").join("python");
            
            if app_bundle_path.exists() && venv_python.exists() {
                (app_bundle_path, app_bundle_working, venv_python.to_string_lossy().to_string())
            } else {
                // 回退到直接路径
                let direct_path = exe_dir.join("./python-dist/run.py");
                let direct_working = exe_dir.join("./python-dist");
                let direct_python = direct_working.join("bin").join("python");
                (direct_path, direct_working, direct_python.to_string_lossy().to_string())
            }
        };
        
        // 确保数据目录存在
        let data_dir = working_dir.join("data");
        let _ = std::fs::create_dir_all(&data_dir);
        
        // 设置Python环境变量
        let python_env = working_dir.join("lib").join("python3.12").join("site-packages");
        let python_lib_path = if python_env.exists() {
            Some(python_env.to_string_lossy().to_string())
        } else {
            None
        };
        
        // 简化的后端启动逻辑
        let mut cmd = if cfg!(target_os = "windows") {
            let mut cmd = Command::new("cmd");
            cmd.args(["/C", &python_path, backend_path.to_str().unwrap()]);
            cmd.current_dir(&working_dir);
            cmd
        } else {
            let mut cmd = Command::new(&python_path);
            cmd.arg(backend_path.to_str().unwrap());
            cmd.current_dir(&working_dir);
            cmd
        };
        
        // 设置基本环境变量
        if let Some(ref python_lib_path) = python_lib_path {
            cmd.env("PYTHONPATH", python_lib_path);
        }
        cmd.env("PYTHONUNBUFFERED", "1");
        
        // 启动后端进程
        match cmd.stdout(Stdio::null())
           .stderr(Stdio::null())
           .spawn() {
            Ok(mut child) => {
                // 在后台线程中等待子进程
                thread::spawn(move || {
                    let _ = child.wait();
                });
            },
            Err(_) => {
                // 静默处理启动失败，不影响前端启动
            }
        }
    });
}

fn main() {
    println!("Starting Memory Photo Album application...");
    
    // 异步启动后端，不等待
    start_backend();
    
    // 立即启动前端，不进行健康检查
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![greet, toggle_fullscreen, is_fullscreen])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_title("Memory-不负时光相册程序");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}