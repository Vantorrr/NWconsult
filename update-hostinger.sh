#!/bin/bash

echo "🔄 Подготовка обновлений для Hostinger..."

# Создаем папку для обновлений
mkdir -p hostinger-update

# ГЛАВНЫЕ ОБНОВЛЕНИЯ:

# 1. Новая универсальная админка
cp admin.html hostinger-update/
cp -r admin/simple.html hostinger-update/admin-simple.html

# 2. Обновленные скрипты админки
mkdir -p hostinger-update/scripts
cp scripts/admin.js hostinger-update/scripts/
cp scripts/registration.js hostinger-update/scripts/

# 3. Обновленные стили админки  
mkdir -p hostinger-update/styles
cp styles/admin.css hostinger-update/styles/

# 4. Французская версия - исправленные страницы
mkdir -p hostinger-update/fr/pages
cp nw-consulting-fr/pages/buhgalteriya.html hostinger-update/fr/pages/
cp nw-consulting-fr/pages/buhgalteriya-new.html hostinger-update/fr/pages/
cp nw-consulting-fr/pages/banki.html hostinger-update/fr/pages/
cp nw-consulting-fr/pages/audit.html hostinger-update/fr/pages/
cp nw-consulting-fr/pages/kontakty.html hostinger-update/fr/pages/
cp nw-consulting-fr/pages/prochie-uslugi.html hostinger-update/fr/pages/

# 5. Французские скрипты
mkdir -p hostinger-update/fr/scripts
cp nw-consulting-fr/scripts/accounting-forms.js hostinger-update/fr/scripts/
cp nw-consulting-fr/scripts/telegram-sender.js hostinger-update/fr/scripts/

# 6. Французские статьи
mkdir -p hostinger-update/fr/pages/articles
cp -r nw-consulting-fr/pages/articles/* hostinger-update/fr/pages/articles/

echo "✅ Готово! Обновления подготовлены в папке hostinger-update/"
echo ""
echo "📋 ЧТО ОБНОВЛЕНО:"
echo "  - admin.html (новая универсальная админка)"
echo "  - admin/simple.html"
echo "  - scripts/admin.js"
echo "  - scripts/registration.js"  
echo "  - styles/admin.css"
echo "  - Все страницы французской версии"
echo "  - Французские скрипты"
echo ""
echo "📤 Загрузи эти файлы на Hostinger с заменой существующих!"

