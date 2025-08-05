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
        let (backend_path, working_dir) = if cfg!(debug_assertions) {
            (exe_dir.join("../../run.py"), exe_dir.join("../.."))
        } else {
            // 首先尝试应用包路径
            let app_bundle_path = exe_dir.join("../Resources/_up_/_up_/run.py");
            let app_bundle_working = exe_dir.join("../Resources/_up_/_up_");
            
            // 如果应用包路径不存在，尝试直接运行路径
            if app_bundle_path.exists() {
                (app_bundle_path, app_bundle_working)
            } else {
                let direct_path = exe_dir.join("./_up_/_up_/run.py");
                let direct_working = exe_dir.join("./_up_/_up_");
                (direct_path, direct_working)
            }
        };
        
        // 确保数据目录存在
        let data_dir = working_dir.join("data");
        if let Err(e) = std::fs::create_dir_all(&data_dir) {
            eprintln!("Failed to create data directory: {}", e);
        } else {
            println!("Data directory created/verified: {:?}", data_dir);
        }
        
        let mut cmd = if cfg!(target_os = "windows") {
            let mut cmd = Command::new("cmd");
            cmd.args(["/C", "python", backend_path.to_str().unwrap()]);
            cmd
        } else {
            let mut cmd = Command::new("python3");
            cmd.arg(backend_path.to_str().unwrap());
            cmd
        };
        
        println!("Attempting to start backend at: {:?}", backend_path);
        println!("Working directory: {:?}", working_dir);
        
        cmd.current_dir(&working_dir);
        
        match cmd.stdout(Stdio::piped())
           .stderr(Stdio::piped())
           .spawn() {
            Ok(child) => {
                println!("Backend server started successfully with PID: {}", child.id());
                // 保持子进程运行
                std::mem::forget(child);
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