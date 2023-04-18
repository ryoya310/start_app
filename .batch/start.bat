@echo off

set WORK_DIR=C:\work\start_app
set PYTHON_APP=python

echo --------------------
echo --- Docker Start ---
echo --------------------

cd %WORK_DIR%\
docker-compose up -d
if %errorlevel% neq 0 (
    echo Error: Failed to start Docker.
    exit /b %errorlevel%
)

echo --------------------
echo --- Python Start ---
echo --------------------

cd %WORK_DIR%\%PYTHON_APP%
python manage.py runserver 127.0.0.1:8310
if %errorlevel% neq 0 (
    echo Error: Failed to start Python app.
    exit /b %errorlevel%
)