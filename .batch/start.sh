#!/bin/bash

WORK_DIR=/work/start_app
PYTHON_APP=python

echo --------------------
echo --- Docker Start ---
echo --------------------

cd $WORK_DIR
docker-compose up -d
if [ $? -ne 0 ]; then
    echo Error: Failed to start Docker.
    exit $?
fi

echo --------------------
echo --- Python Start ---
echo --------------------

cd $WORK_DIR/$PYTHON_APP
python manage.py runserver 127.0.0.1:8310
if [ $? -ne 0 ]; then
    echo Error: Failed to start Python app.
    exit $?
fi