#!/bin/bash

echo "🚀 Подготовка файлов для Хостингера..."

# Создаем структуру папок
mkdir -p UPLOAD_TO_HOSTINGER/{RU,EN,FR}

# === РУССКАЯ ВЕРСИЯ ===
echo "📁 Подготовка русской версии..."
mkdir -p UPLOAD_TO_HOSTINGER/RU/{admin,scripts,styles,pages}

# Админка
cp admin/simple.html UPLOAD_TO_HOSTINGER/RU/admin/
cp admin/index.html UPLOAD_TO_HOSTINGER/RU/admin/

# Скрипты
cp scripts/admin.js UPLOAD_TO_HOSTINGER/RU/scripts/
cp scripts/registration.js UPLOAD_TO_HOSTINGER/RU/scripts/

# Стили
cp styles/admin.css UPLOAD_TO_HOSTINGER/RU/styles/

# Страница бухгалтерии
cp pages/buhgalteriya.html UPLOAD_TO_HOSTINGER/RU/pages/

# === АНГЛИЙСКАЯ ВЕРСИЯ ===
echo "📁 Подготовка английской версии..."
mkdir -p UPLOAD_TO_HOSTINGER/EN/{admin,scripts,styles,pages}

# Админка
cp nw-consulting-en/admin/simple.html UPLOAD_TO_HOSTINGER/EN/admin/
cp nw-consulting-en/admin/index.html UPLOAD_TO_HOSTINGER/EN/admin/

# Скрипты
cp nw-consulting-en/scripts/admin.js UPLOAD_TO_HOSTINGER/EN/scripts/
cp nw-consulting-en/scripts/registration.js UPLOAD_TO_HOSTINGER/EN/scripts/

# Стили
cp nw-consulting-en/styles/admin.css UPLOAD_TO_HOSTINGER/EN/styles/

# Страница бухгалтерии
cp nw-consulting-en/pages/buhgalteriya.html UPLOAD_TO_HOSTINGER/EN/pages/

# === ФРАНЦУЗСКАЯ ВЕРСИЯ ===
echo "📁 Подготовка французской версии..."
mkdir -p UPLOAD_TO_HOSTINGER/FR/{admin,scripts,styles,pages}

# Админка
cp nw-consulting-fr/admin/simple.html UPLOAD_TO_HOSTINGER/FR/admin/
cp nw-consulting-fr/admin/index.html UPLOAD_TO_HOSTINGER/FR/admin/

# Скрипты
cp nw-consulting-fr/scripts/admin.js UPLOAD_TO_HOSTINGER/FR/scripts/
cp nw-consulting-fr/scripts/registration.js UPLOAD_TO_HOSTINGER/FR/scripts/

# Стили
cp nw-consulting-fr/styles/admin.css UPLOAD_TO_HOSTINGER/FR/styles/

# Страницы
cp nw-consulting-fr/pages/buhgalteriya.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/buhgalteriya-new.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/banki.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/registratsiya.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/audit.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/banki-new.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/kontakty.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/prochie-uslugi.html UPLOAD_TO_HOSTINGER/FR/pages/
cp nw-consulting-fr/pages/audit-country.html UPLOAD_TO_HOSTINGER/FR/pages/

# Статьи
mkdir -p UPLOAD_TO_HOSTINGER/FR/pages/articles
cp nw-consulting-fr/pages/articles/audit-template.html UPLOAD_TO_HOSTINGER/FR/pages/articles/
cp nw-consulting-fr/pages/articles/ru-kik.html UPLOAD_TO_HOSTINGER/FR/pages/articles/

echo "✅ Все файлы подготовлены!"
echo ""
echo "📋 СТРУКТУРА ПАПОК:"
echo "├── UPLOAD_TO_HOSTINGER/"
echo "│   ├── RU/ - Загрузи на русский хостинг"
echo "│   ├── EN/ - Загрузи на английский хостинг"
echo "│   └── FR/ - Загрузи на французский хостинг"
echo ""
echo "🔥 В каждой папке уже правильная структура - просто загружай!"

