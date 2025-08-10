
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
