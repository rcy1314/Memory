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

// 启动后端服务器
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
            // 应用包路径：资源在Resources目录下的嵌套_up_目录中
            let app_bundle_path = exe_dir.join("../Resources/_up_/_up_/python-dist/run.py");
            let app_bundle_working = exe_dir.join("../Resources/_up_/_up_/python-dist");
            let app_python_path = exe_dir.join("../Resources/_up_/_up_/python-dist/bin/python3");
            
            // 如果应用包路径不存在，尝试直接运行路径
            if app_bundle_path.exists() {
                (app_bundle_path, app_bundle_working, app_python_path.to_string_lossy().to_string())
            } else {
                let direct_path = exe_dir.join("./python-dist/run.py");
                let direct_working = exe_dir.join("./python-dist");
                let direct_python = exe_dir.join("./python-dist/bin/python3");
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
        
        // 设置Python环境变量 - 总是尝试使用打包的site-packages
        let python_env = {
            let lib_path = working_dir.join("lib/site-packages");
            if lib_path.exists() {
                Some(lib_path.to_string_lossy().to_string())
            } else {
                None
            }
        };
        
        let mut cmd = if cfg!(target_os = "windows") {
            let mut cmd = Command::new("cmd");
            cmd.args(["/C", &python_path, backend_path.to_str().unwrap()]);
            cmd
        } else {
            let mut cmd = Command::new(&python_path);
            cmd.arg(backend_path.to_str().unwrap());
            cmd
        };
        
        println!("Attempting to start backend at: {:?}", backend_path);
        println!("Working directory: {:?}", working_dir);
        
        cmd.current_dir(&working_dir);
        
        // 设置Python环境变量
        if let Some(python_lib_path) = python_env {
            cmd.env("PYTHONPATH", &python_lib_path);
            println!("Set PYTHONPATH to: {}", python_lib_path);
        }
        
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
    start_backend();
    thread::sleep(Duration::from_secs(2));
    
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