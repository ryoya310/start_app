# 変更ファイル 変更フォルダ リスト

0-1 .git 削除
1-1 .env
2-1 .batch/.start.bat
2-2 .batch/.start.sh
3-1 htdocs
4-1 python/api/settings.py
4-2 python/.env ※内容は1-1と同様
4-3 python/index.cgi ※レンタルサーバーでDjangoが対応していないとき用

# ミドルウェア設定

## プロジェクト開発

### リネーム or コピー or フォルダを作成
※.env = CONTAINER_NAME = project.jp

#### リネーム
Windows - ren htdocs project.jp
MacOS - mv htdocs project.jp

#### コピー
Windows - xcopy /t htdocs project.jp
MacOS - cp -r htdocs project.jp

#### フォルダ作成
mkdir project.jp

## コンテナ起動
docker compose up -d

### nginx URL
[http://localhost:8888](http://localhost:8888)
※.env = WEB_PORT = 8888

## イメージ全削除  
docker rmi $(docker images -q) -f

## コンテナ全削除
docker rm $(docker ps -a -q) -f

## 不要物一括削除
docker system prune

## 再ビルド キャッシュ削除
docker-compose build --no-cache

# Python Django FullRestAPI
## インストール
pip install -r requirements.txt

### インストール確認
python -m django --version

## プロジェクト作成
django-admin startproject (ProjectName)

cd (ProjectName)

## アプリ作成
django-admin startapp (AppName)

## 初期設定
settings.py

## サーバー起動
python manage.py runserver 127.0.0.1:8310

## 既存のDB
python manage.py inspectdb > ./app/models.py
※文字コード注意

### モデルの反映
python manage.py makemigrations
python manage.py migrate

### __pycache__ リセット
Windows Remove-Item -Recurse -Force app/__pycache__/
Linux rm -rf app/__pycache__/
