import subprocess
import sys


def run_command(command):
    result = subprocess.run(command, check=False)

    if result.returncode != 0:
        sys.exit(result.returncode)


run_command(
    [
        sys.executable,
        "manage.py",
        "migrate",
        "--noinput",
    ]
)

run_command(
    [
        sys.executable,
        "manage.py",
        "runserver",
        "0.0.0.0:8000",
    ]
)