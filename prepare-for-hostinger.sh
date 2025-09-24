#!/bin/bash

echo "🚀 Подготовка файлов для Hostinger..."

# Создаем папку для загрузки
mkdir -p hostinger-upload

# Копируем основные файлы
cp index.html hostinger-upload/
cp admin.html hostinger-upload/
cp logo.png hostinger-upload/
cp robots.txt hostinger-upload/
cp sitemap.xml hostinger-upload/

# Копируем папки русской версии
cp -r pages hostinger-upload/
cp -r scripts hostinger-upload/
cp -r styles hostinger-upload/
cp -r admin hostinger-upload/

# Копируем английскую версию с переименованием
cp -r nw-consulting-en hostinger-upload/en
# Удаляем лишнее из английской версии
rm -rf hostinger-upload/en/admin
rm -f hostinger-upload/en/logo.png
rm -f hostinger-upload/en/robots.txt
rm -f hostinger-upload/en/sitemap.xml

# Копируем французскую версию с переименованием
cp -r nw-consulting-fr hostinger-upload/fr
# Удаляем лишнее из французской версии
rm -rf hostinger-upload/fr/admin
rm -f hostinger-upload/fr/logo.png
rm -f hostinger-upload/fr/robots.txt
rm -f hostinger-upload/fr/sitemap.xml

echo "✅ Готово! Файлы подготовлены в папке hostinger-upload/"
echo "📁 Теперь загрузи содержимое папки hostinger-upload в public_html на Hostinger"


