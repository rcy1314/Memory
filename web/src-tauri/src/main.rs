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

// 启动后端服务器
fn start_backend() {
    thread::spawn(|| {
        // 获取当前可执行文件的目录
        let exe_dir = env::current_exe()
            .ok()
            .and_then(|path| path.parent().map(|p| p.to_path_buf()))
            .unwrap_or_else(|| std::path::PathBuf::from("."));
        
        println!("Current executable directory: {:?}", exe_dir);
        
        // 在开发模式下，后端在项目根目录
        // 动态检测路径，支持应用包和直接运行两种情况
        let (backend_path, working_dir, python_path) = if cfg!(debug_assertions) {
            (exe_dir.join("../../../../run.py"), exe_dir.join("../../../.."), "python3".to_string())
        } else {
            // 应用包路径：从MacOS目录到Resources目录
            let app_bundle_path = exe_dir.join("../Resources/_up_/_up_/python-dist/run.py");
            let app_bundle_working = exe_dir.join("../Resources/_up_/_up_/python-dist");
            
            // 检查虚拟环境中的Python路径
             let venv_python_path = if cfg!(target_os = "windows") {
                 app_bundle_working.join("Scripts").join("python.exe")
             } else {
                 app_bundle_working.join("bin").join("python")
             };
            
            // 检查传统的bin目录中的python3符号链接
            let bin_python_path = if cfg!(target_os = "windows") {
                app_bundle_working.join("bin").join("python3.exe")
            } else {
                app_bundle_working.join("bin").join("python3")
            };
            
            println!("Checking app bundle path: {:?}", app_bundle_path);
            println!("App bundle working dir: {:?}", app_bundle_working);
            println!("Venv python path: {:?}", venv_python_path);
            println!("Bin python path: {:?}", bin_python_path);
            
            // 检查各个路径是否存在
            println!("App bundle path exists: {}", app_bundle_path.exists());
            println!("App bundle working dir exists: {}", app_bundle_working.exists());
            println!("Venv python path exists: {}", venv_python_path.exists());
            println!("Bin python path exists: {}", bin_python_path.exists());
            
            let python_path = if venv_python_path.exists() {
                println!("Using virtual environment Python: {:?}", venv_python_path);
                venv_python_path.to_string_lossy().to_string()
            } else if bin_python_path.exists() {
                println!("Using symlinked Python: {:?}", bin_python_path);
                bin_python_path.to_string_lossy().to_string()
            } else {
                println!("Python executable not found in app bundle, trying direct paths");
                let direct_working = exe_dir.join("./python-dist");
                let direct_venv_path = if cfg!(target_os = "windows") {
                     direct_working.join("Scripts").join("python.exe")
                 } else {
                     direct_working.join("bin").join("python")
                 };
                
                let direct_bin_path = if cfg!(target_os = "windows") {
                    direct_working.join("bin").join("python3.exe")
                } else {
                    direct_working.join("bin").join("python3")
                };
                
                if direct_venv_path.exists() {
                    println!("Using direct virtual environment Python: {:?}", direct_venv_path);
                    direct_venv_path.to_string_lossy().to_string()
                } else if direct_bin_path.exists() {
                    println!("Using direct symlinked Python: {:?}", direct_bin_path);
                    direct_bin_path.to_string_lossy().to_string()
                } else {
                    println!("Python executable not found in expected locations");
                    "python3".to_string() // 最后回退到系统Python
                }
            };
            
            // 如果应用包路径不存在，尝试直接运行路径
            if app_bundle_path.exists() {
                println!("Using app bundle paths");
                (app_bundle_path, app_bundle_working, python_path)
            } else {
                println!("App bundle paths not found, trying direct paths");
                let direct_path = exe_dir.join("./python-dist/run.py");
                let direct_working = exe_dir.join("./python-dist");
                println!("Direct path: {:?}", direct_path);
                println!("Direct working: {:?}", direct_working);
                (direct_path, direct_working, python_path)
            }
        };
        
        // 确保数据目录存在
        let data_dir = working_dir.join("data");
        if let Err(e) = std::fs::create_dir_all(&data_dir) {
            eprintln!("Failed to create data directory: {}", e);
        } else {
            println!("Data directory created/verified: {:?}", data_dir);
        }
        
        // 设置Python环境变量 - 总是尝试使用虚拟环境的site-packages
         let python_env = {
             // 尝试多个可能的site-packages路径
             let possible_paths = vec![
                 working_dir.join("lib/python3.13/site-packages"),
                 working_dir.join("lib/python3.12/site-packages"),
                 working_dir.join("lib/python3.11/site-packages"),
                 working_dir.join("lib/python3.10/site-packages"),
                 working_dir.join("lib/site-packages"),
             ];
             
             let mut found_path = None;
             for path in possible_paths {
                 if path.exists() {
                     println!("Found site-packages at: {:?}", path);
                     found_path = Some(path.to_string_lossy().to_string());
                     break;
                 }
             }
             
             if found_path.is_none() {
                 println!("No site-packages directory found in virtual environment");
             }
             
             found_path
         };
        
        // 确保Python可执行文件有执行权限（Unix系统）
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            if let Ok(metadata) = std::fs::metadata(&python_path) {
                let mut perms = metadata.permissions();
                perms.set_mode(0o755);
                if let Err(e) = std::fs::set_permissions(&python_path, perms) {
                    eprintln!("Failed to set Python executable permissions: {}", e);
                } else {
                    println!("Python executable permissions set successfully");
                }
            } else {
                eprintln!("Cannot read Python executable metadata: {}", python_path);
            }
        }
        
        // 测试Python解释器是否可执行
        println!("Testing Python interpreter...");
        let test_result = if cfg!(target_os = "windows") {
            Command::new("cmd")
                .args(["/C", &python_path, "--version"])
                .output()
        } else {
            Command::new(&python_path)
                .arg("--version")
                .output()
        };
        
        match test_result {
            Ok(output) => {
                println!("Python version test successful: {}", String::from_utf8_lossy(&output.stdout));
                if !output.stderr.is_empty() {
                    println!("Python stderr: {}", String::from_utf8_lossy(&output.stderr));
                }
            },
            Err(e) => {
                eprintln!("Python interpreter test failed: {}", e);
                eprintln!("This may indicate the Python executable is not working properly");
            }
        }
        
        println!("Attempting to start backend at: {:?}", backend_path);
        println!("Working directory: {:?}", working_dir);
        println!("Python executable: {}", python_path);
        
        // 检查关键文件是否存在
        println!("Backend script exists: {}", backend_path.exists());
        println!("Working directory exists: {}", working_dir.exists());
        
        // 尝试启动后端，如果失败则重试
        let mut attempts = 0;
        let max_attempts = 3;
        
        while attempts < max_attempts {
            attempts += 1;
            println!("Backend start attempt {} of {}", attempts, max_attempts);
            
            // 每次重试都创建新的Command对象
            let mut cmd = if cfg!(target_os = "windows") {
                // Windows下使用cmd执行
                let mut cmd = Command::new("cmd");
                cmd.args(["/C", &python_path, backend_path.to_str().unwrap()]);
                cmd
            } else {
                // Unix系统直接执行Python
                let mut cmd = Command::new(&python_path);
                cmd.arg(backend_path.to_str().unwrap());
                cmd
            };
            
            cmd.current_dir(&working_dir);
            
            // 设置Python环境变量
            if let Some(ref python_lib_path) = python_env {
                cmd.env("PYTHONPATH", python_lib_path);
                println!("Set PYTHONPATH to: {}", python_lib_path);
            }
            
            // 添加更多环境变量以确保Python运行环境正确
            cmd.env("PYTHONUNBUFFERED", "1");
            cmd.env("PYTHONDONTWRITEBYTECODE", "1");
            
            println!("About to execute command: {:?}", cmd);
            
            match cmd.stdout(Stdio::inherit())
               .stderr(Stdio::inherit())
               .spawn() {
                Ok(mut child) => {
                    println!("Backend server started successfully with PID: {}", child.id());
                    
                    // 等待一小段时间确认进程没有立即退出
                    thread::sleep(Duration::from_millis(500));
                    
                    match child.try_wait() {
                        Ok(Some(status)) => {
                            eprintln!("Backend process exited immediately with status: {}", status);
                            if attempts < max_attempts {
                                println!("Retrying backend start...");
                                thread::sleep(Duration::from_secs(1));
                                continue;
                            }
                        },
                        Ok(None) => {
                            println!("Backend process is running successfully");
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
                            break;
                        },
                        Err(e) => {
                            eprintln!("Error checking backend process status: {}", e);
                        }
                    }
                },
                Err(e) => {
                    eprintln!("Failed to start backend server (attempt {}): {}", attempts, e);
                    eprintln!("Backend path: {:?}", backend_path);
                    eprintln!("Working dir: {:?}", working_dir);
                    eprintln!("Python path: {}", python_path);
                    
                    // 详细诊断信息
                    eprintln!("=== Diagnostic Information ===");
                    eprintln!("Current working directory: {:?}", std::env::current_dir());
                    eprintln!("Backend script readable: {}", backend_path.is_file());
                    eprintln!("Python executable readable: {}", std::path::Path::new(&python_path).is_file());
                    
                    // 检查关键依赖文件
                    let requirements_path = working_dir.join("requirements.txt");
                    let memory_api_path = working_dir.join("Memory_api.py");
                    let app_dir = working_dir.join("app");
                    
                    eprintln!("Requirements.txt exists: {}", requirements_path.exists());
                    eprintln!("Memory_api.py exists: {}", memory_api_path.exists());
                    eprintln!("App directory exists: {}", app_dir.exists());
                    
                    if let Some(ref python_lib_path) = python_env {
                        eprintln!("PYTHONPATH directory exists: {}", std::path::Path::new(python_lib_path).exists());
                    }
                    
                    if attempts < max_attempts {
                        println!("Retrying in 2 seconds...");
                        thread::sleep(Duration::from_secs(2));
                    } else {
                        eprintln!("All backend start attempts failed!");
                        eprintln!("=== Troubleshooting Suggestions ===");
                        eprintln!("1. Check if Python executable has proper permissions");
                        eprintln!("2. Verify all required files are present in the bundle");
                        eprintln!("3. Check system logs for additional error details");
                        eprintln!("4. Try running the backend manually from terminal for more details");
                    }
                },
            }
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