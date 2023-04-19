@echo off

set WORK_DIR=C:\work\project\project.jp
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

echo Waiting for Docker to start...
:WAIT_DOCKER
timeout /t 5 > NUL
docker ps > NUL 2>&1
if %errorlevel% neq 0 goto WAIT_DOCKER

echo --------------------
echo --- Python Start ---
echo --------------------

cd %WORK_DIR%\%PYTHON_APP%
python manage.py runserver 127.0.0.1:8310
if %errorlevel% neq 0 (
    echo Error: Failed to start Python app.
    exit /b %errorlevel%
)
