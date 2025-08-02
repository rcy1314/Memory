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
        // 在生产模式下，需要相对于应用程序包的位置
        let backend_path = if cfg!(debug_assertions) {
            exe_dir.join("../../run.py")
        } else {
            // 在macOS应用包中，可执行文件在 Contents/MacOS/
            // 后端文件在 Contents/Resources/_up_/_up_/ 目录中
            exe_dir.join("../Resources/_up_/_up_/run.py")
        };
        
        let working_dir = if cfg!(debug_assertions) {
            exe_dir.join("../..")
        } else {
            exe_dir.join("../Resources/_up_/_up_")
        };
        
        let mut cmd = if cfg!(target_os = "windows") {
            let mut cmd = Command::new("cmd");
            cmd.args(["/C", "python", backend_path.to_str().unwrap()]);
            cmd
        } else {
            let mut cmd = Command::new("python3");
            cmd.arg(backend_path.to_str().unwrap());
            cmd
        };
        
        cmd.current_dir(working_dir);
        
        match cmd.stdout(Stdio::piped())
           .stderr(Stdio::piped())
           .spawn() {
            Ok(_) => println!("Backend server started successfully"),
            Err(e) => eprintln!("Failed to start backend server: {}", e),
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