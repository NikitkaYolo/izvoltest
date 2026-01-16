# Telegram Mini App - Панель управления

Простой Telegram Mini App (Web App) для управления точками, устройствами и позициями. Работает полностью на клиенте с мок-данными и localStorage.

## Стек технологий

- Python 3.11+
- aiogram v3 (Telegram бот)
- python-dotenv (управление переменными окружения)
- Vanilla JavaScript (SPA без фреймворков)
- GitHub Pages (хостинг веб-приложения)

## Структура проекта

```
.
├── bot.py              # Telegram бот (aiogram v3)
├── requirements.txt    # Зависимости Python
├── env.example         # Пример файла с переменными окружения
├── README.md           # Документация
└── docs/               # Веб-приложение (для GitHub Pages)
    ├── index.html      # Главная страница Mini App
    ├── app.js          # JavaScript логика SPA с мок-данными
    └── styles.css      # Стили с поддержкой Telegram theme
```

## ⚠️ Важно: Telegram Mini App требует публичный HTTPS URL

**Telegram Mini App работает только с публичными HTTPS URL с валидным SSL сертификатом.**

- ❌ `http://127.0.0.1:8000` - не работает в Telegram (только для локального тестирования в браузере)
- ✅ `https://USERNAME.github.io/REPO/` - работает в Telegram (через GitHub Pages)

## Быстрый старт

### 1. Установка зависимостей

Откройте терминал в папке проекта и выполните:

```bash
# Создание виртуального окружения
python3 -m venv .venv
# или на Windows: python -m venv .venv

# Активация виртуального окружения
# Linux/Mac:
source .venv/bin/activate
# Windows (cmd):
# .venv\Scripts\activate
# Windows (PowerShell):
# .\.venv\Scripts\Activate.ps1

# Установка зависимостей
pip install -r requirements.txt
```

### 2. Настройка переменных окружения

```bash
# Копирование примера конфигурации
cp env.example .env
# или на Windows: copy env.example .env
```

Откройте `.env` файл и заполните:

```env
BOT_TOKEN=your_bot_token_here
WEBAPP_URL=https://USERNAME.github.io/REPO/
```

**Как получить BOT_TOKEN:**
1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot` или `/mybots` для существующего бота
3. Скопируйте токен бота и вставьте в `.env`

**WEBAPP_URL:**
- Будет установлен после публикации на GitHub Pages (см. шаг 3)

### 3. Публикация веб-приложения на GitHub Pages

1. **Создайте репозиторий на GitHub** (если ещё не создан)

2. **Загрузите файлы проекта** в репозиторий:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

3. **Настройте GitHub Pages:**
   - Откройте репозиторий на GitHub
   - Перейдите в **Settings** → **Pages**
   - В разделе **Source** выберите:
     - **Deploy from a branch**
     - **Branch:** `main`
     - **Folder:** `/docs`
   - Нажмите **Save**

4. **Получите URL:**
   - После настройки GitHub Pages будет доступен по адресу:
     ```
     https://USERNAME.github.io/REPO/
     ```
   - Подождите 1-2 минуты для активации

5. **Обновите `.env`:**
   ```env
   WEBAPP_URL=https://USERNAME.github.io/REPO/
   ```

6. **Настройте бота в BotFather:**
   - Откройте [@BotFather](https://t.me/BotFather)
   - Отправьте `/mybots` и выберите вашего бота
   - Выберите "Bot Settings" → "Menu Button"
   - Укажите URL: `https://USERNAME.github.io/REPO/`

   Или используйте команду:
   ```
   /setmenubutton
   ```
   Выберите бота и укажите HTTPS URL.

### 4. Запуск бота

```bash
# Активация venv (если не активирован)
# Linux/Mac:
source .venv/bin/activate
# Windows (cmd):
# .venv\Scripts\activate
# Windows (PowerShell):
# .\.venv\Scripts\Activate.ps1

# Запуск бота
python bot.py
# или: python3 bot.py
```

### 5. Тестирование

1. **В браузере (для локального тестирования UI):**
   - Откройте `docs/index.html` в браузере
   - Или используйте VS Code Live Server расширение
   - ⚠️ Telegram WebApp API не будет работать в браузере (только в Telegram)

2. **В Telegram:**
   - Откройте вашего бота в Telegram
   - Отправьте команду `/start`
   - Нажмите кнопку **"Открыть панель"**
   - Mini App должен открыться с полным функционалом

## Использование

### Навигация

- **Точки** → **Устройства** → **Позиции**
- Кнопка "Назад" в шапке и синхронизация с Telegram BackButton
- Хлебные крошки показывают текущий путь

### Режимы работы с позициями

1. **Просмотр** - отображает только активные позиции, кнопка ➕ для добавления
2. **Редактирование** - тап по позиции открывает модалку для изменения названия
3. **Архивирование** - тап по позиции архивирует её (подтверждение)

### Мок-данные

Приложение использует мок-данные, хранящиеся в localStorage:

- 3 точки продаж (с адресами)
- 2 устройства на каждую точку (всего 6 устройств)
- 6 позиций на каждое устройство (всего 36 позиций, часть архивированы)

**Изменения сохраняются в localStorage браузера** и не сбрасываются при перезапуске приложения.

## Особенности реализации

- ✅ SPA на vanilla JavaScript без фреймворков
- ✅ Интеграция с Telegram WebApp API
- ✅ Поддержка Telegram theme (dark/light режимы)
- ✅ Mobile-first responsive дизайн
- ✅ Учет safe-area для нижней панели
- ✅ Модальные окна для добавления/редактирования
- ✅ Подтверждение архивирования
- ✅ Данные хранятся в localStorage
- ⚠️ **initData не валидируется** (для продакшена нужно добавить валидацию на сервере)

## Команды бота

- `/start` - сброс состояния и показ кнопки "Открыть панель"
- `/help` - краткая справка

Бот также обрабатывает данные от Mini App (если Mini App отправляет через `Telegram.WebApp.sendData`), логирует их и отвечает "Ок, получил."

## Переменные окружения

См. `env.example` для полного списка переменных:

- `BOT_TOKEN` - токен Telegram бота (обязательно, получить у @BotFather)
- `WEBAPP_URL` - публичный HTTPS URL Mini App (обязательно для Telegram, получить через GitHub Pages)

## Локальная разработка веб-приложения

Для разработки и тестирования UI без Telegram:

1. **Откройте `docs/index.html` в браузере:**
   - Просто дважды кликните на файл
   - Или используйте VS Code Live Server расширение

2. **Ограничения:**
   - Telegram WebApp API не будет работать (только в Telegram)
   - Данные будут сохраняться в localStorage браузера
   - Интерфейс можно тестировать, но функционал, зависящий от Telegram API, будет недоступен

## Структура веб-приложения

Веб-приложение состоит из 3 экранов:

1. **Locations** - список точек (с адресами)
2. **Devices** - список устройств выбранной точки
3. **Items** - список позиций выбранного устройства с режимами работы

Навигация реализована через переключение видимости экранов (display: none/block).

### Telegram WebApp API

Используются следующие методы:
- `Telegram.WebApp.ready()` - инициализация
- `Telegram.WebApp.expand()` - развертывание на весь экран
- `Telegram.WebApp.BackButton` - управление кнопкой "Назад"
- `Telegram.WebApp.initDataUnsafe` - данные пользователя (без валидации, только для демо)
- `Telegram.WebApp.showAlert()` - показ уведомлений
- `Telegram.WebApp.sendData()` - отправка данных боту (опционально)

## Troubleshooting

### Бот не отвечает

- Проверьте правильность `BOT_TOKEN` в `.env`
- Убедитесь, что бот запущен
- Проверьте логи бота на наличие ошибок

### Mini App не открывается в Telegram

- **Убедитесь, что `WEBAPP_URL` начинается с `https://`** (обязательно!)
- Проверьте, что GitHub Pages активирован и сайт доступен
- Убедитесь, что в BotFather указан правильный URL (Menu Button)
- Проверьте, что папка `/docs` содержит файлы `index.html`, `app.js`, `styles.css`

### GitHub Pages не работает

- Убедитесь, что выбрана папка `/docs` в настройках Pages
- Проверьте, что файлы загружены в репозиторий
- Подождите 1-2 минуты после настройки (Pages активируется не мгновенно)
- Проверьте URL: должен быть `https://USERNAME.github.io/REPO/` (не `REPO.github.io`)

### Telegram WebApp API не работает в браузере

Это нормально! Telegram WebApp API работает только внутри Telegram. Для локальной разработки UI можно тестировать в браузере, но функционал, зависящий от Telegram API, будет недоступен.

### Данные не сохраняются

- Данные хранятся в localStorage браузера
- Каждый браузер/устройство имеет своё хранилище
- Для очистки данных: откройте консоль браузера и выполните `localStorage.clear()`

## Безопасность

⚠️ **Важно для продакшена:**

1. **Валидация initData:** Текущая реализация использует `initDataUnsafe` без валидации. В продакшене необходимо валидировать `initData` на сервере, так как клиент может подделать данные.

2. **Хранение данных:** Текущая реализация хранит данные в localStorage браузера. Для продакшена рекомендуется использовать серверную БД с авторизацией.

## Лицензия

Тестовый проект для MVP.
