from fastapi import APIRouter
from pydantic import BaseModel
import tempfile
import subprocess
import os

router = APIRouter()

class ExecuteRequest(BaseModel):
    code: str

@router.post("/run")
def run_code(req: ExecuteRequest):
    # 1. Create a temporary file to hold the C++ code
    with tempfile.NamedTemporaryFile(suffix=".cpp", delete=False) as source_file:
        source_file.write(req.code.encode('utf-8'))
        cpp_file_path = source_file.name

    # Determine the output executable path
    exe_file_path = cpp_file_path.replace(".cpp", ".out")

    try:
        # 2. Compile the code using g++
        compile_process = subprocess.run(
            ["g++", cpp_file_path, "-o", exe_file_path],
            capture_output=True,
            text=True
        )

        # Check for compilation errors
        if compile_process.returncode != 0:
            return {"status": "error", "type": "Compilation Error", "output": compile_process.stderr}

        # 3. Run the compiled executable
        # We add a 5-second timeout to prevent infinite loops from crashing the server
        run_process = subprocess.run(
            [exe_file_path],
            capture_output=True,
            text=True,
            timeout=5
        )

        # Check for runtime errors
        if run_process.returncode != 0:
            return {"status": "error", "type": "Runtime Error", "output": run_process.stderr}

        # 4. Success! Return the standard output
        return {"status": "success", "output": run_process.stdout}

    except subprocess.TimeoutExpired:
        return {"status": "error", "type": "Timeout Error", "output": "Code execution exceeded 5 seconds. Check for infinite loops."}
    except Exception as e:
        return {"status": "error", "type": "System Error", "output": str(e)}
    finally:
        # 5. Cleanup: Always delete the temporary files after execution
        if os.path.exists(cpp_file_path):
            os.remove(cpp_file_path)
        if os.path.exists(exe_file_path):
            os.remove(exe_file_path)