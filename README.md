# Smart Table - Интерактивная таблица данных

Веб-приложение для отображения и управления таблицей данных с продажами.

## Возможности

- 🔍 **Глобальный поиск** по всем полям таблицы
- ⬆️⬇️ **Сортировка** по дате и сумме
- 🔧 **Фильтрация** по дате, клиенту, продавцу, сумме
- 📄 **Пагинация** с настраиваемым количеством записей на странице

## Установка и запуск

### Требования

- Node.js >= 18.0.0
- npm

### Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/Maksim-driller/smart-tablee.git
cd smart-tablee

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

### Решение проблем на macOS

Если при запуске `npm run dev` возникает ошибка:

```
Error: Cannot find module @rollup/rollup-darwin-arm64
library load disallowed by system policy
```

Выполните следующие шаги:

#### Вариант 1: Очистка и переустановка

```bash
# Удаление node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Переустановка зависимостей
npm install

# Запуск проекта
npm run dev
```

#### Вариант 2: Использование скрипта очистки

```bash
npm run clean
npm run dev
```

#### Вариант 3: Разрешение загрузки модуля (macOS)

```bash
# Разрешить загрузку нативных модулей
sudo xattr -r -d com.apple.quarantine node_modules/@rollup/rollup-darwin-arm64/

# Или для всей папки node_modules
sudo xattr -r -d com.apple.quarantine node_modules/
```

#### Вариант 4: Использование другой версии Node.js

```bash
# Если используете nvm
nvm use 18
npm install
npm run dev
```

### Альтернативные команды

```bash
# Сборка проекта
npm run build

# Предварительный просмотр сборки
npm run preview

# Очистка зависимостей
npm run clean
```

## Структура проекта

```
src/
├── components/          # Компоненты приложения
│   ├── table.js        # Основная таблица
│   ├── sorting.js      # Логика сортировки
│   ├── searching.js    # Логика поиска
│   ├── pagination.js   # Пагинация
│   └── filtering.js    # Фильтрация
├── lib/                # Утилиты и библиотеки
│   ├── sort.js         # Функции сортировки
│   ├── compare.js      # Система сравнения объектов
│   └── utils.js        # Общие утилиты
├── data/               # Данные и API
│   ├── data.js         # API для работы с бэкендом
│   └── dataset_*.js    # Тестовые данные
└── main.js             # Точка входа приложения
```

## Технологии

- **Vanilla JavaScript** (ES6+)
- **Vite** - быстрый сборщик
- **HTML Templates** - для рендеринга
- **CSS Variables** - для стилизации

## API

Приложение работает с API: `https://webinars.webdev.education-services.ru/sp7-api`

## Лицензия

MIT
