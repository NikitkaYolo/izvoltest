// Telegram WebApp API
const tg = window.Telegram?.WebApp;

// Инициализация Telegram WebApp (если доступен)
if (tg) {
    tg.ready();
    tg.expand();
}

// Мок-данные (начальные)
const INITIAL_DATA = {
    locations: [
        { id: 1, name: "Точка продаж #1", address: "ул. Ленина, 10" },
        { id: 2, name: "Точка продаж #2", address: "пр. Мира, 25" },
        { id: 3, name: "Точка продаж #3", address: "ул. Пушкина, 5" },
    ],
    devices: {
        1: [
            { id: 1, name: "Устройство 1-1", location_id: 1 },
            { id: 2, name: "Устройство 1-2", location_id: 1 },
        ],
        2: [
            { id: 3, name: "Устройство 2-1", location_id: 2 },
            { id: 4, name: "Устройство 2-2", location_id: 2 },
        ],
        3: [
            { id: 5, name: "Устройство 3-1", location_id: 3 },
            { id: 6, name: "Устройство 3-2", location_id: 3 },
        ],
    },
    items: {
        1: [
            { id: 1, name: "Позиция 1-1-1", device_id: 1, archived: false },
            { id: 2, name: "Позиция 1-1-2", device_id: 1, archived: false },
            { id: 3, name: "Позиция 1-1-3", device_id: 1, archived: true },
            { id: 4, name: "Позиция 1-1-4", device_id: 1, archived: false },
            { id: 5, name: "Позиция 1-1-5", device_id: 1, archived: false },
            { id: 6, name: "Позиция 1-1-6", device_id: 1, archived: true },
        ],
        2: [
            { id: 7, name: "Позиция 1-2-1", device_id: 2, archived: false },
            { id: 8, name: "Позиция 1-2-2", device_id: 2, archived: false },
            { id: 9, name: "Позиция 1-2-3", device_id: 2, archived: false },
            { id: 10, name: "Позиция 1-2-4", device_id: 2, archived: false },
            { id: 11, name: "Позиция 1-2-5", device_id: 2, archived: false },
            { id: 12, name: "Позиция 1-2-6", device_id: 2, archived: true },
        ],
        3: [
            { id: 13, name: "Позиция 2-1-1", device_id: 3, archived: false },
            { id: 14, name: "Позиция 2-1-2", device_id: 3, archived: false },
            { id: 15, name: "Позиция 2-1-3", device_id: 3, archived: false },
            { id: 16, name: "Позиция 2-1-4", device_id: 3, archived: false },
            { id: 17, name: "Позиция 2-1-5", device_id: 3, archived: false },
            { id: 18, name: "Позиция 2-1-6", device_id: 3, archived: true },
        ],
        4: [
            { id: 19, name: "Позиция 2-2-1", device_id: 4, archived: false },
            { id: 20, name: "Позиция 2-2-2", device_id: 4, archived: false },
            { id: 21, name: "Позиция 2-2-3", device_id: 4, archived: false },
            { id: 22, name: "Позиция 2-2-4", device_id: 4, archived: false },
            { id: 23, name: "Позиция 2-2-5", device_id: 4, archived: false },
            { id: 24, name: "Позиция 2-2-6", device_id: 4, archived: true },
        ],
        5: [
            { id: 25, name: "Позиция 3-1-1", device_id: 5, archived: false },
            { id: 26, name: "Позиция 3-1-2", device_id: 5, archived: false },
            { id: 27, name: "Позиция 3-1-3", device_id: 5, archived: false },
            { id: 28, name: "Позиция 3-1-4", device_id: 5, archived: false },
            { id: 29, name: "Позиция 3-1-5", device_id: 5, archived: false },
            { id: 30, name: "Позиция 3-1-6", device_id: 5, archived: true },
        ],
        6: [
            { id: 31, name: "Позиция 3-2-1", device_id: 6, archived: false },
            { id: 32, name: "Позиция 3-2-2", device_id: 6, archived: false },
            { id: 33, name: "Позиция 3-2-3", device_id: 6, archived: false },
            { id: 34, name: "Позиция 3-2-4", device_id: 6, archived: false },
            { id: 35, name: "Позиция 3-2-5", device_id: 6, archived: false },
            { id: 36, name: "Позиция 3-2-6", device_id: 6, archived: true },
        ],
    },
    nextItemId: 37,
};

// Загрузка данных из localStorage или использование начальных
function loadData() {
    const saved = localStorage.getItem('telegram_miniapp_data');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA)); // Глубокая копия
}

// Сохранение данных в localStorage
function saveData(data) {
    localStorage.setItem('telegram_miniapp_data', JSON.stringify(data));
}

// Глобальное состояние данных
let appData = loadData();

// Состояние приложения
const state = {
    currentScreen: 'locations',
    currentLocation: null,
    currentDevice: null,
    currentMode: 'view', // view, edit, archive
    editingItemId: null,
    archivingItemId: null,
};

// DOM элементы
const elements = {
    header: document.getElementById('header'),
    backBtn: document.getElementById('backBtn'),
    headerTitle: document.getElementById('headerTitle'),
    breadcrumbs: document.getElementById('breadcrumbs'),
    mainContent: document.getElementById('mainContent'),
    screenLocations: document.getElementById('screenLocations'),
    screenDevices: document.getElementById('screenDevices'),
    screenItems: document.getElementById('screenItems'),
    locationsList: document.getElementById('locationsList'),
    devicesList: document.getElementById('devicesList'),
    itemsList: document.getElementById('itemsList'),
    modeSwitcher: document.getElementById('modeSwitcher'),
    addItemBtn: document.getElementById('addItemBtn'),
    itemModal: document.getElementById('itemModal'),
    archiveModal: document.getElementById('archiveModal'),
    userInfo: document.getElementById('userInfo'),
};

// Инициализация пользователя
function initUser() {
    // ВАЖНО: В продакшене initData НЕОБХОДИМО валидировать на сервере!
    // Telegram предупреждает: initDataUnsafe может быть подделан клиентом.
    // Для демо используем напрямую, но в проде нужна серверная валидация.
    if (tg?.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        const username = user.username ? `@${user.username}` : `ID: ${user.id}`;
        elements.userInfo.textContent = `Пользователь: ${username}`;
    } else {
        elements.userInfo.textContent = 'Пользователь: Неизвестен (не в Telegram)';
    }
}

// Навигация между экранами
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    state.currentScreen = screenName;
    
    switch (screenName) {
        case 'locations':
            elements.screenLocations.classList.add('active');
            elements.headerTitle.textContent = 'Точки';
            elements.backBtn.style.display = 'none';
            elements.breadcrumbs.classList.remove('active');
            if (tg) tg.BackButton.hide();
            loadLocations();
            break;
        case 'devices':
            elements.screenDevices.classList.add('active');
            elements.headerTitle.textContent = 'Устройства';
            elements.backBtn.style.display = 'block';
            updateBreadcrumbs();
            if (tg) tg.BackButton.show();
            loadDevices();
            break;
        case 'items':
            elements.screenItems.classList.add('active');
            elements.headerTitle.textContent = 'Позиции';
            elements.backBtn.style.display = 'block';
            updateBreadcrumbs();
            if (tg) tg.BackButton.show();
            loadItems();
            break;
    }
}

// Обновление хлебных крошек
function updateBreadcrumbs() {
    const crumbs = [];
    if (state.currentLocation) {
        crumbs.push(`<span>${state.currentLocation.name}</span>`);
    }
    if (state.currentDevice) {
        crumbs.push(`<span>${state.currentDevice.name}</span>`);
    }
    if (crumbs.length > 0) {
        elements.breadcrumbs.innerHTML = crumbs.join(' / ');
        elements.breadcrumbs.classList.add('active');
    } else {
        elements.breadcrumbs.classList.remove('active');
    }
}

// Обработчик кнопки "Назад"
if (elements.backBtn) {
    elements.backBtn.addEventListener('click', () => {
        handleBack();
    });
}

if (tg && tg.BackButton) {
    tg.BackButton.onClick(() => {
        handleBack();
    });
}

function handleBack() {
    if (state.currentScreen === 'items') {
        showScreen('devices');
    } else if (state.currentScreen === 'devices') {
        showScreen('locations');
    }
}

// Загрузка точек
function loadLocations() {
    elements.locationsList.innerHTML = '';
    
    appData.locations.forEach(location => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-name">${escapeHtml(location.name)}</div>
            <div class="list-item-subtitle">${escapeHtml(location.address)}</div>
        `;
        item.addEventListener('click', () => {
            state.currentLocation = location;
            showScreen('devices');
        });
        elements.locationsList.appendChild(item);
    });
}

// Загрузка устройств
function loadDevices() {
    if (!elements.devicesList) return;
    elements.devicesList.innerHTML = '';
    
    const devices = appData.devices[state.currentLocation.id] || [];
    
    if (devices.length === 0) {
        elements.devicesList.innerHTML = '<div class="empty-state">Нет устройств</div>';
        return;
    }
    
    devices.forEach(device => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-name">${escapeHtml(device.name)}</div>
        `;
        item.addEventListener('click', () => {
            state.currentDevice = device;
            state.currentMode = 'view';
            updateModeButtons();
            showScreen('items');
        });
        elements.devicesList.appendChild(item);
    });
}

// Загрузка позиций
function loadItems() {
    const items = appData.items[state.currentDevice.id] || [];
    renderItems(items);
}

// Рендеринг позиций
function renderItems(items) {
    if (!elements.itemsList) return;
    if (items.length === 0) {
        elements.itemsList.innerHTML = '<div class="empty-state">Нет позиций</div>';
        return;
    }
    
    // Фильтруем в зависимости от режима
    let filteredItems = items;
    if (state.currentMode === 'view') {
        filteredItems = items.filter(item => !item.archived);
    } else if (state.currentMode === 'archive') {
        filteredItems = items.filter(item => item.archived);
    }
    
    if (filteredItems.length === 0) {
        elements.itemsList.innerHTML = '<div class="empty-state">Нет позиций для отображения</div>';
        return;
    }
    
    elements.itemsList.innerHTML = '';
    filteredItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'list-item' + (item.archived ? ' archived' : '');
        const archivedIcon = item.archived ? ' 🗄️' : '';
        itemEl.innerHTML = `
            <div class="list-item-name">${escapeHtml(item.name)}${archivedIcon}</div>
            ${item.archived ? '<div class="list-item-subtitle">Архивная</div>' : ''}
        `;
        
        // Обработка клика в зависимости от режима
        if (state.currentMode === 'edit' && !item.archived) {
            itemEl.addEventListener('click', () => {
                openEditModal(item);
            });
        } else if (state.currentMode === 'archive' && !item.archived) {
            itemEl.addEventListener('click', () => {
                openArchiveModal(item);
            });
        }
        
        elements.itemsList.appendChild(itemEl);
    });
}

// Переключение режимов (инициализация после загрузки DOM)
let modeButtons = null;
function initModeButtons() {
    modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            state.currentMode = mode;
            updateModeButtons();
            loadItems();
        });
    });
}

function updateModeButtons() {
    if (!modeButtons) {
        modeButtons = document.querySelectorAll('.mode-btn');
    }
    modeButtons.forEach(btn => {
        if (btn.dataset.mode === state.currentMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Показываем кнопку добавления только в режиме просмотра
    if (elements.addItemBtn) {
        if (state.currentMode === 'view') {
            elements.addItemBtn.style.display = 'flex';
        } else {
            elements.addItemBtn.style.display = 'none';
        }
    }
}

// Модальное окно для добавления/редактирования
const itemModal = {
    title: document.getElementById('modalTitle'),
    input: document.getElementById('itemNameInput'),
    saveBtn: document.getElementById('modalSave'),
    cancelBtn: document.getElementById('modalCancel'),
};

if (elements.addItemBtn) {
    elements.addItemBtn.addEventListener('click', () => {
        state.editingItemId = null;
        if (itemModal.title) itemModal.title.textContent = 'Добавить позицию';
        if (itemModal.input) {
            itemModal.input.value = '';
            itemModal.input.focus();
        }
        if (elements.itemModal) elements.itemModal.classList.add('active');
    });
}

if (itemModal.cancelBtn) {
    itemModal.cancelBtn.addEventListener('click', () => {
        if (elements.itemModal) elements.itemModal.classList.remove('active');
    });
}

if (itemModal.saveBtn) {
    itemModal.saveBtn.addEventListener('click', () => {
        const name = itemModal.input ? itemModal.input.value.trim() : '';
    if (!name) {
        if (tg) {
            tg.showAlert('Введите название позиции');
        } else {
            alert('Введите название позиции');
        }
        return;
    }
    
    if (state.editingItemId) {
        // Редактирование
        const items = appData.items[state.currentDevice.id] || [];
        const item = items.find(i => i.id === state.editingItemId);
        if (item) {
            item.name = name;
            saveData(appData);
            if (tg) {
                tg.showAlert('Позиция обновлена');
            }
        }
    } else {
        // Создание
        if (!appData.items[state.currentDevice.id]) {
            appData.items[state.currentDevice.id] = [];
        }
        const newItem = {
            id: appData.nextItemId++,
            name: name,
            device_id: state.currentDevice.id,
            archived: false,
        };
        appData.items[state.currentDevice.id].push(newItem);
        saveData(appData);
        if (tg) {
            tg.showAlert('Позиция добавлена');
        }
    }
    
        if (elements.itemModal) elements.itemModal.classList.remove('active');
        loadItems();
    });
}

function openEditModal(item) {
    state.editingItemId = item.id;
    itemModal.title.textContent = 'Редактировать позицию';
    itemModal.input.value = item.name;
    itemModal.input.focus();
    elements.itemModal.classList.add('active');
}

// Модальное окно архивирования
const archiveModal = {
    itemName: document.getElementById('archiveItemName'),
    confirmBtn: document.getElementById('archiveConfirm'),
    cancelBtn: document.getElementById('archiveCancel'),
};

if (archiveModal.cancelBtn) {
    archiveModal.cancelBtn.addEventListener('click', () => {
        if (elements.archiveModal) elements.archiveModal.classList.remove('active');
    });
}

if (archiveModal.confirmBtn) {
    archiveModal.confirmBtn.addEventListener('click', () => {
        const items = appData.items[state.currentDevice.id] || [];
        const item = items.find(i => i.id === state.archivingItemId);
        if (item) {
            item.archived = true;
            saveData(appData);
            if (tg) {
                tg.showAlert('Позиция архивирована');
            }
        }
        if (elements.archiveModal) elements.archiveModal.classList.remove('active');
        loadItems();
    });
}

function openArchiveModal(item) {
    state.archivingItemId = item.id;
    archiveModal.itemName.textContent = `Архивировать "${item.name}"?`;
    elements.archiveModal.classList.add('active');
}

// Закрытие модалок по клику вне их
elements.itemModal.addEventListener('click', (e) => {
    if (e.target === elements.itemModal) {
        elements.itemModal.classList.remove('active');
    }
});

elements.archiveModal.addEventListener('click', (e) => {
    if (e.target === elements.archiveModal) {
        elements.archiveModal.classList.remove('active');
    }
});

// Ввод Enter в модалке
itemModal.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        itemModal.saveBtn.click();
    }
});

// Утилита для экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация при загрузке DOM
function initApp() {
    // Проверка наличия необходимых элементов
    if (!elements.locationsList || !elements.devicesList || !elements.itemsList) {
        console.error('Не найдены необходимые DOM элементы');
        return;
    }
    
    initUser();
    initModeButtons();
    showScreen('locations');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM уже загружен
    initApp();
}
