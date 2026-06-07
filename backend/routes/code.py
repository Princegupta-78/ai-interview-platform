from fastapi import APIRouter
from schemas.code import CodeSubmission

import tempfile
import subprocess
import os

router = APIRouter()

# --- REAL TEST CASES (FOR STANDARD IO) ---
TEST_CASES = {
    1: [
        {
            "input": "2 7 11 15\n9\n",
            "output": "0 1"
        },
        {
            "input": "3 2 4\n6\n",
            "output": "1 2"
        }
    ]
}

@router.post("/evaluate")
def evaluate_code(submission: CodeSubmission):
    
    # Check if we have test cases for this problem ID
    if submission.problem_id not in TEST_CASES:
        return {
            "passed": False,
            "message": f"Problem {submission.problem_id} not found in execution engine."
        }

    try:
        # Create a secure, isolated temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:

            cpp_file = os.path.join(temp_dir, "solution.cpp")
            exe_file = os.path.join(temp_dir, "solution")

            # Write the user's code to a physical file
            with open(cpp_file, "w") as f:
                f.write(submission.code)

            # Compile the C++ code
            compile_process = subprocess.run(
                [
                    "g++",
                    cpp_file,
                    "-std=c++17",
                    "-o",
                    exe_file
                ],
                capture_output=True,
                text=True
            )

            # Check for Compilation Errors
            if compile_process.returncode != 0:
                return {
                    "passed": False,
                    "message": f"❌ Compilation Error\n\n{compile_process.stderr}"
                }

            # Run the executable against each test case
            for case in TEST_CASES[submission.problem_id]:

                run_process = subprocess.run(
                    [exe_file],
                    input=case["input"],
                    capture_output=True,
                    text=True,
                    timeout=2  # 2 second time limit
                )

                output = run_process.stdout.strip()

                # Check if output matches expected output
                if output != case["output"]:
                    return {
                        "passed": False,
                        "message": f"❌ Failed Test Case\n\nInput provided:\n{case['input']}\nExpected:\n{case['output']}\n\nGot:\n{output}"
                    }

            # If it passes all test cases
            return {
                "passed": True,
                "message": "✅ All Test Cases Passed"
            }

    except subprocess.TimeoutExpired:
        return {
            "passed": False,
            "message": "❌ Time Limit Exceeded"
        }

    except Exception as e:
        return {
            "passed": False,
            "message": f"❌ Execution Error: {str(e)}"
        }