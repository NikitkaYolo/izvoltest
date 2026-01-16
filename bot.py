import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация бота и диспетчера
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL")

if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не установлен в переменных окружения")

if not WEBAPP_URL:
    raise ValueError("WEBAPP_URL не установлен в переменных окружения")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    """Обработчик команды /start - сбрасывает состояние и показывает кнопку для открытия панели"""
    keyboard = types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(
                    text="Открыть панель",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )
    
    await message.answer(
        "Добро пожаловать! Нажмите кнопку ниже, чтобы открыть панель управления.",
        reply_markup=keyboard
    )


@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    """Обработчик команды /help - краткое объяснение функционала"""
    help_text = (
        "🤖 Бот для управления панелью\n\n"
        "Команды:\n"
        "/start - Открыть панель управления\n"
        "/help - Показать эту справку\n\n"
        "Используйте кнопку 'Открыть панель' для доступа к веб-интерфейсу."
    )
    await message.answer(help_text)


@dp.message()
async def message_handler(message: types.Message):
    """Обработчик сообщений, включая web_app_data"""
    # Обработка данных от Mini App (если Mini App отправляет через Telegram.WebApp.sendData)
    if message.web_app_data:
        data = message.web_app_data.data
        logger.info(f"Получены данные от Mini App: {data}")
        await message.answer("Ок, получил.")
        return
    
    # Обработка остальных сообщений
    await message.answer("Используйте /start для открытия панели или /help для справки.")


async def main():
    """Главная функция для запуска бота"""
    logger.info("Запуск бота...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
