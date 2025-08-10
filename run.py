import uvicorn
import os
import sys

if __name__ == "__main__":
    # Get the directory where the executable is located
    if getattr(sys, 'frozen', False):
        # Running as PyInstaller bundle
        bundle_dir = sys._MEIPASS
        log_config_path = os.path.join(bundle_dir, "uvicorn_loggin_config.json")
    else:
        # Running as normal Python script
        log_config_path = "uvicorn_loggin_config.json"
    
    # Check if log config file exists, otherwise use None for default logging
    if not os.path.exists(log_config_path):
        log_config_path = None
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=9999,
        reload=False,
        log_config=log_config_path,
    )
