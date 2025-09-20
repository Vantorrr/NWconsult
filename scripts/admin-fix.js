// ПРОСТОЙ РАБОЧИЙ СКРИПТ ДЛЯ АДМИНКИ
document.addEventListener('DOMContentLoaded', function() {
  // PIN авторизация
  const DEFAULT_PIN = '123456';
  const pinScreen = document.getElementById('pin-screen');
  const adminPanel = document.getElementById('admin-panel');
  const pinInput = document.getElementById('pin-input');
  
  // Проверяем авторизацию
  if (sessionStorage.getItem('adminAuthenticated') === 'true') {
    pinScreen.style.display = 'none';
    adminPanel.style.display = 'block';
    loadAllData();
  }
  
  // Обработка PIN
  pinInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      if (pinInput.value === DEFAULT_PIN) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        pinScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        loadAllData();
      } else {
        alert('Неверный PIN');
      }
    }
  });
  
  // Выход
  document.getElementById('logout-btn')?.addEventListener('click', function() {
    sessionStorage.removeItem('adminAuthenticated');
    location.reload();
  });
  
  // ТАБЫ
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
    });
  });
  
  // ЗАГРУЗКА ДАННЫХ
  function loadAllData() {
    loadCountries();
    loadBanks();
    loadAudit();
  }
  
  // СТРАНЫ ДЛЯ РЕГИСТРАЦИИ
  function loadCountries() {
    const grid = document.getElementById('admin-countries-grid');
    if (!grid) return;
    
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || [
      { id: 'cyprus', name: 'Кипр', flag: '🇨🇾', region: 'europe', time: '5-10 дней', price: 3900, priceText: '€3,900' },
      { id: 'uae', name: 'ОАЭ (Freezone)', flag: '🇦🇪', region: 'asia', time: '5-14 дней', price: 2900, priceText: '$2,900' },
      { id: 'hongkong', name: 'Гонконг', flag: '🇭🇰', region: 'asia', time: '5-7 дней', price: 1800, priceText: '$1,800' },
      { id: 'uk', name: 'Великобритания', flag: '🇬🇧', region: 'europe', time: '1-3 дня', price: 950, priceText: '£950' },
      { id: 'usa', name: 'США (LLC)', flag: '🇺🇸', region: 'america', time: '2-7 дней', price: 650, priceText: '$650' }
    ];
    
    grid.innerHTML = countries.map(c => `
      <div class="admin-country-card">
        <h3>${c.flag} ${c.name}</h3>
        <p>Регион: ${c.region}</p>
        <p>Срок: ${c.time}</p>
        <p>Цена: ${c.priceText}</p>
        <button onclick="deleteCountry('${c.id}')" class="btn btn--danger btn--sm">Удалить</button>
      </div>
    `).join('');
  }
  
  window.deleteCountry = function(id) {
    if (confirm('Удалить страну?')) {
      let countries = JSON.parse(localStorage.getItem('registrationCountries')) || [];
      countries = countries.filter(c => c.id !== id);
      localStorage.setItem('registrationCountries', JSON.stringify(countries));
      loadCountries();
    }
  };
  
  // БАНКИ
  function loadBanks() {
    const tbody = document.querySelector('#admin-banks-table tbody');
    if (!tbody) return;
    
    const banks = JSON.parse(localStorage.getItem('banksData')) || [
      { id: 1, bank: 'Bank of Cyprus', country: 'Кипр', type: 'Корпоративный', balance: '€5,000', time: '2-3 недели' },
      { id: 2, bank: 'Emirates NBD', country: 'ОАЭ', type: 'Корпоративный', balance: 'AED 25,000', time: '1-2 недели' }
    ];
    
    tbody.innerHTML = banks.map(b => `
      <tr>
        <td>${b.bank}</td>
        <td>${b.country}</td>
        <td>${b.type}</td>
        <td>${b.balance}</td>
        <td>${b.time}</td>
        <td><button onclick="deleteBank(${b.id})" class="btn btn--danger btn--sm">Удалить</button></td>
      </tr>
    `).join('');
  }
  
  window.deleteBank = function(id) {
    if (confirm('Удалить банк?')) {
      let banks = JSON.parse(localStorage.getItem('banksData')) || [];
      banks = banks.filter(b => b.id !== id);
      localStorage.setItem('banksData', JSON.stringify(banks));
      loadBanks();
    }
  };
  
  // АУДИТ
  function loadAudit() {
    const tbody = document.querySelector('#admin-audit-table tbody');
    if (!tbody) return;
    
    const audits = JSON.parse(localStorage.getItem('auditCountries')) || [
      { id: 1, country: 'Кипр', region: 'Европа', tax: '12.5%', requirements: 'Обязательный', standards: 'IFRS' },
      { id: 2, country: 'ОАЭ', region: 'Азия', tax: '0-9%', requirements: 'По требованию', standards: 'IFRS/Local' }
    ];
    
    tbody.innerHTML = audits.map(a => `
      <tr>
        <td>${a.country}</td>
        <td>${a.region}</td>
        <td>${a.tax}</td>
        <td>${a.requirements}</td>
        <td>${a.standards}</td>
        <td><button onclick="deleteAudit(${a.id})" class="btn btn--danger btn--sm">Удалить</button></td>
      </tr>
    `).join('');
  }
  
  window.deleteAudit = function(id) {
    if (confirm('Удалить страну из аудита?')) {
      let audits = JSON.parse(localStorage.getItem('auditCountries')) || [];
      audits = audits.filter(a => a.id !== id);
      localStorage.setItem('auditCountries', JSON.stringify(audits));
      loadAudit();
    }
  };
  
  // КНОПКА ДОБАВИТЬ СТРАНУ (РЕГИСТРАЦИЯ)
  document.getElementById('reg-add-country')?.addEventListener('click', function() {
    const name = prompt('Название страны:');
    if (!name) return;
    
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || [];
    countries.push({
      id: 'country_' + Date.now(),
      name: name,
      flag: '🏳️',
      region: 'europe',
      time: '7-14 дней',
      price: 1000,
      priceText: '$1,000'
    });
    
    localStorage.setItem('registrationCountries', JSON.stringify(countries));
    loadCountries();
    alert('Страна добавлена!');
  });
  
  // КНОПКА ДОБАВИТЬ БАНК
  document.getElementById('bank-add')?.addEventListener('click', function() {
    const bank = prompt('Название банка:');
    if (!bank) return;
    
    const banks = JSON.parse(localStorage.getItem('banksData')) || [];
    banks.push({
      id: Date.now(),
      bank: bank,
      country: 'Страна',
      type: 'Корпоративный',
      balance: '$1,000',
      time: '1-2 недели'
    });
    
    localStorage.setItem('banksData', JSON.stringify(banks));
    loadBanks();
    alert('Банк добавлен!');
  });
  
  // КНОПКА ДОБАВИТЬ АУДИТ
  document.getElementById('audit-add')?.addEventListener('click', function() {
    const country = prompt('Название страны:');
    if (!country) return;
    
    const audits = JSON.parse(localStorage.getItem('auditCountries')) || [];
    audits.push({
      id: Date.now(),
      country: country,
      region: 'Регион',
      tax: '0%',
      requirements: 'По требованию',
      standards: 'IFRS'
    });
    
    localStorage.setItem('auditCountries', JSON.stringify(audits));
    loadAudit();
    alert('Страна для аудита добавлена!');
  });
});

