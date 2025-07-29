if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}
const currencies = {
    'USD': { name: 'Доллар США', flag: '🇺🇸' },
    'EUR': { name: 'Евро', flag: '🇪🇺' },
    'GBP': { name: 'Фунт стерлингов', flag: '🇬🇧' },
    'JPY': { name: 'Японская иена', flag: '🇯🇵' },
    'RUB': { name: 'Российский рубль', flag: '🇷🇺' },
    'CNY': { name: 'Китайский юань', flag: '🇨🇳' },
    'KRW': { name: 'Южнокорейская вона', flag: '🇰🇷' },
    'INR': { name: 'Индийская рупия', flag: '🇮🇳' },
    'BRL': { name: 'Бразильский реал', flag: '🇧🇷' },
    'CAD': { name: 'Канадский доллар', flag: '🇨🇦' },
    'AUD': { name: 'Австралийский доллар', flag: '🇦🇺' },
    'CHF': { name: 'Швейцарский франк', flag: '🇨🇭' },
    'MXN': { name: 'Мексиканское песо', flag: '🇲🇽' },
    'SGD': { name: 'Сингапурский доллар', flag: '🇸🇬' },
    'HKD': { name: 'Гонконгский доллар', flag: '🇭🇰' },
    'NZD': { name: 'Новозеландский доллар', flag: '🇳🇿' },
    'TRY': { name: 'Турецкая лира', flag: '🇹🇷' },
    'ZAR': { name: 'Южноафриканский рэнд', flag: '🇿🇦' },
    'SEK': { name: 'Шведская крона', flag: '🇸🇪' },
    'NOK': { name: 'Норвежская крона', flag: '🇳🇴' }
};
let fromCurrency = 'USD';
let toCurrency = 'EUR';
let currentSelection = 'from';
function setPersonalizedGreeting() {
    const greetingElement = document.getElementById('greeting');
    const now = new Date();
    const hours = now.getHours();
    let greeting = 'Добрый день';
    if (hours >= 5 && hours < 12) {
        greeting = 'Доброе утро';
    } else if (hours >= 12 && hours < 18) {
        greeting = 'Добрый день';
    } else if (hours >= 18 && hours < 23) {
        greeting = 'Добрый вечер';
    } else {
        greeting = 'Доброй ночи';
    }
    try {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            const firstName = user.first_name || 'пользователь';
            greeting += `, ${firstName}!`;
        } else {
            greeting += '!';
        }
    } catch (e) {
        greeting += '!';
    }
    greetingElement.textContent = greeting;
}
function loadApp() {
    setPersonalizedGreeting();
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');
        loadingScreen.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContainer.style.display = 'block';
            mainContainer.style.animation = 'fadeIn 0.5s ease';
            convert();
        }, 500);
    }, 2000);
}
function openCurrencyModal(type) {
    currentSelection = type;
    const modal = document.getElementById('currencyModal');
    const title = modal.querySelector('.modal-title');
    title.textContent = type === 'from' ? 'Выберите исходную валюту' : 'Выберите целевую валюту';
    renderCurrencyList();
    modal.style.display = 'block';
    document.getElementById('searchCurrency').value = '';
    document.getElementById('searchCurrency').focus();
}
function closeModal() {
    document.getElementById('currencyModal').style.display = 'none';
}
function renderCurrencyList(search = '') {
    const currencyList = document.getElementById('currencyList');
    let html = '';
    const filteredCurrencies = Object.keys(currencies).filter(code => {
        if (!search) return true;
        const currency = currencies[code];
        return code.toLowerCase().includes(search.toLowerCase()) || 
               currency.name.toLowerCase().includes(search.toLowerCase());
    });
    filteredCurrencies.forEach(code => {
        const currency = currencies[code];
        const isSelected = (currentSelection === 'from' && code === fromCurrency) || 
                         (currentSelection === 'to' && code === toCurrency);
        html += `
            <div class="currency-option ${isSelected ? 'selected' : ''}" onclick="selectCurrency('${code}')">
                <div class="flag">${currency.flag}</div>
                <div class="currency-info">
                    <div class="currency-code-modal">${code}</div>
                    <div class="currency-name-modal">${currency.name}</div>
                </div>
            </div>
        `;
    });
    currencyList.innerHTML = html;
}
function filterCurrencies() {
    const search = document.getElementById('searchCurrency').value;
    renderCurrencyList(search);
}
function selectCurrency(currencyCode) {
    if (currentSelection === 'from') {
        fromCurrency = currencyCode;
        document.getElementById('from-code').textContent = currencyCode;
        document.getElementById('from-name').textContent = currencies[currencyCode].name;
        document.getElementById('from-flag').textContent = currencies[currencyCode].flag;
    } else {
        toCurrency = currencyCode;
        document.getElementById('to-code').textContent = currencyCode;
        document.getElementById('to-name').textContent = currencies[currencyCode].name;
        document.getElementById('to-flag').textContent = currencies[currencyCode].flag;
    }
    closeModal();
    convert();
}
function swapCurrencies() {
    const temp = fromCurrency;
    fromCurrency = toCurrency;
    toCurrency = temp;
    document.getElementById('from-code').textContent = fromCurrency;
    document.getElementById('from-name').textContent = currencies[fromCurrency].name;
    document.getElementById('from-flag').textContent = currencies[fromCurrency].flag;
    document.getElementById('to-code').textContent = toCurrency;
    document.getElementById('to-name').textContent = currencies[toCurrency].name;
    document.getElementById('to-flag').textContent = currencies[toCurrency].flag;
    convert();
}
async function convert() {
    const amount = parseFloat(document.getElementById('amount').value) || 1;
    const loading = document.getElementById('loading');
    const rateInfo = document.getElementById('rate-info');
    loading.style.display = 'block';
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        if (data.rates[toCurrency]) {
            const rate = data.rates[toCurrency];
            const result = amount * rate;
            document.getElementById('result-amount').textContent = result.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            });
            document.getElementById('result-text').textContent = `${toCurrency} по курсу ${rate.toFixed(6)}`;
            rateInfo.textContent = `Курс обновлен: ${new Date().toLocaleDateString()}`;
        } else {
            document.getElementById('result-amount').textContent = 'Ошибка';
            document.getElementById('result-text').textContent = 'Валюта не найдена';
        }
    } catch (error) {
        const fakeRates = {
            'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50,
            'RUB': 92.50, 'CNY': 7.25, 'KRW': 1330, 'INR': 83.20,
            'BRL': 4.95, 'CAD': 1.36, 'AUD': 1.52, 'CHF': 0.88,
            'MXN': 17.50, 'SGD': 1.35, 'HKD': 7.80, 'NZD': 1.65,
            'TRY': 28.50, 'ZAR': 18.80, 'SEK': 10.80, 'NOK': 10.50
        };
        const fakeRate = fakeRates[toCurrency] / fakeRates[fromCurrency];
        const result = amount * fakeRate;
        document.getElementById('result-amount').textContent = result.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        });
        document.getElementById('result-text').textContent = `${toCurrency} (демо курс)`;
        rateInfo.textContent = 'Демонстрационные данные';
    }
    loading.style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('currencyModal');
    if (event.target === modal) {
        closeModal();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    loadApp();
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
setInterval(convert, 30000);
