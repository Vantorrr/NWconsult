// Простая админка без всяких заморочек
document.addEventListener('DOMContentLoaded', function() {
  console.log('New admin script loaded!');
  
  // PIN авторизация
  const DEFAULT_PIN = '123456';
  const pinScreen = document.getElementById('pin-screen');
  const adminPanel = document.getElementById('admin-panel');
  const pinInput = document.getElementById('pin-input');
  
  // Проверяем авторизацию
  if (sessionStorage.getItem('adminAuthenticated') === 'true') {
    showAdmin();
  } else {
    showPin();
  }
  
  function showPin() {
    pinScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
  }
  
  function showAdmin() {
    pinScreen.style.display = 'none';
    adminPanel.style.display = 'block';
    loadCountries();
  }
  
  // Обработка PIN
  pinInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      if (pinInput.value === DEFAULT_PIN) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        showAdmin();
      } else {
        alert('Неверный PIN');
      }
    }
  });
  
  // Выход
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('adminAuthenticated');
    showPin();
  });
  
  // Страны по умолчанию
  const defaultCountries = [
    { 
      id: 'cyprus',
      name: 'Кипр',
      flag: '🇨🇾',
      region: 'europe',
      time: '5-10 дней',
      price: 3900,
      priceText: '€3,900',
      features: ['EU компания', 'Низкие налоги', 'Престиж']
    },
    { 
      id: 'uae',
      name: 'ОАЭ (Freezone)',
      flag: '🇦🇪',
      region: 'asia',
      time: '5-14 дней',
      price: 2900,
      priceText: '$2,900',
      features: ['0% налог', 'Банковский счет', 'Виза резидента']
    },
    { 
      id: 'hongkong',
      name: 'Гонконг',
      flag: '🇭🇰',
      region: 'asia',
      time: '5-7 дней',
      price: 1800,
      priceText: '$1,800',
      features: ['Международный центр', 'Простая отчетность', 'Банки']
    },
    { 
      id: 'uk',
      name: 'Великобритания',
      flag: '🇬🇧',
      region: 'europe',
      time: '1-3 дня',
      price: 950,
      priceText: '£950',
      features: ['Быстрая регистрация', 'Мировой престиж', 'Банки']
    },
    { 
      id: 'usa',
      name: 'США (LLC)',
      flag: '🇺🇸',
      region: 'america',
      time: '2-7 дней',
      price: 650,
      priceText: '$650',
      features: ['LLC структура', 'Банковский счет', 'Международный бизнес']
    }
  ];
  
  let editingCountryId = null;
  
  // Загрузка стран
  function loadCountries() {
    console.log('Loading countries...');
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || defaultCountries;
    renderCountries(countries);
  }
  
  // Отображение стран
  function renderCountries(countries) {
    const grid = document.getElementById('admin-countries-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    countries.forEach(country => {
      const card = document.createElement('div');
      card.className = 'admin-country-card';
      card.innerHTML = `
        <div class="country-header">
          <span class="country-flag">${country.flag}</span>
          <h3>${country.name}</h3>
        </div>
        <div class="country-info">
          <p><strong>Регион:</strong> ${getRegionName(country.region)}</p>
          <p><strong>Срок:</strong> ${country.time}</p>
          <p><strong>Цена:</strong> ${country.priceText}</p>
          <div class="country-features">
            ${country.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
          </div>
        </div>
        <div class="country-actions">
          <button onclick="editCountry('${country.id}')" class="btn btn--sm">Редактировать</button>
          <button onclick="deleteCountry('${country.id}')" class="btn btn--sm btn--danger">Удалить</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  
  function getRegionName(region) {
    const regions = {
      'europe': 'Европа',
      'asia': 'Азия',
      'america': 'Америка',
      'offshore': 'Оффшоры'
    };
    return regions[region] || region;
  }
  
  // Глобальные функции
  window.openAddCountryModal = function() {
    console.log('Opening add country modal...');
    editingCountryId = null;
    document.getElementById('country-modal-title').textContent = 'Добавить страну';
    document.getElementById('country-form').reset();
    document.getElementById('country-modal').style.display = 'flex';
  };
  
  window.closeCountryModal = function() {
    document.getElementById('country-modal').style.display = 'none';
    document.getElementById('country-form').reset();
    editingCountryId = null;
  };
  
  window.editCountry = function(id) {
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || defaultCountries;
    const country = countries.find(c => c.id === id);
    
    if (country) {
      editingCountryId = id;
      document.getElementById('country-modal-title').textContent = 'Редактировать страну';
      document.getElementById('country-name').value = country.name;
      document.getElementById('country-flag').value = country.flag || '';
      document.getElementById('country-region').value = country.region;
      document.getElementById('country-time').value = country.time;
      document.getElementById('country-price').value = country.price;
      document.getElementById('country-features').value = (country.features || []).join('\n');
      document.getElementById('country-modal').style.display = 'flex';
    }
  };
  
  window.deleteCountry = function(id) {
    if (confirm('Удалить эту страну?')) {
      let countries = JSON.parse(localStorage.getItem('registrationCountries')) || defaultCountries;
      countries = countries.filter(c => c.id !== id);
      localStorage.setItem('registrationCountries', JSON.stringify(countries));
      loadCountries();
    }
  };
  
  // Обработка формы
  document.getElementById('country-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || defaultCountries;
    
    const countryData = {
      id: editingCountryId || `country_${Date.now()}`,
      name: document.getElementById('country-name').value,
      flag: document.getElementById('country-flag').value || '🏳️',
      region: document.getElementById('country-region').value,
      time: document.getElementById('country-time').value,
      price: parseInt(document.getElementById('country-price').value),
      priceText: `$${parseInt(document.getElementById('country-price').value).toLocaleString()}`,
      features: document.getElementById('country-features').value.split('\n').filter(f => f.trim())
    };
    
    if (editingCountryId) {
      const index = countries.findIndex(c => c.id === editingCountryId);
      if (index !== -1) {
        countries[index] = countryData;
      }
    } else {
      countries.push(countryData);
    }
    
    localStorage.setItem('registrationCountries', JSON.stringify(countries));
    loadCountries();
    closeCountryModal();
    
    alert('Страна сохранена!');
  });
  
  // Закрытие модального окна
  document.querySelector('.modal-close').addEventListener('click', closeCountryModal);
  
  console.log('Admin script fully loaded!');
});

