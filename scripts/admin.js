// Admin Panel JavaScript
(function() {
  // Default PIN
  const DEFAULT_PIN = '123456';
  
  // DOM Elements
  const pinScreen = document.getElementById('pin-screen');
  const adminPanel = document.getElementById('admin-panel');
  const pinInput = document.getElementById('pin-input');
  const pinError = document.getElementById('pin-error');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Tabs
  const tabs = document.querySelectorAll('.admin-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  
  // Countries
  const countriesGrid = document.getElementById('admin-countries-grid');
  const addCountryBtn = document.getElementById('reg-add-country');
  const exportCountriesBtn = document.getElementById('reg-export');
  const importCountriesBtn = document.getElementById('reg-import');
  
  // Modal
  const countryModal = document.getElementById('country-modal');
  const countryForm = document.getElementById('country-form');
  const modalTitle = document.getElementById('country-modal-title');
  const modalClose = document.querySelector('.modal-close');
  
  // Current editing country
  let editingCountryId = null;
  
  // Get PIN from localStorage or use default
  function getStoredPin() {
    return localStorage.getItem('adminPin') || DEFAULT_PIN;
  }
  
  // Check authentication
  function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      showAdminPanel();
    } else {
      showPinScreen();
    }
  }
  
  // Show PIN screen
  function showPinScreen() {
    pinScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
    pinInput.value = '';
    pinInput.focus();
  }
  
  // Show admin panel
  function showAdminPanel() {
    pinScreen.style.display = 'none';
    adminPanel.style.display = 'block';
    loadCountries();
    loadBanks();
  }
  
  // PIN input handler
  pinInput?.addEventListener('input', (e) => {
    const value = e.target.value;
    if (value.length === 6) {
      if (value === getStoredPin()) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        showAdminPanel();
      } else {
        pinError.textContent = 'Неверный PIN-код';
        pinInput.value = '';
        setTimeout(() => {
          pinError.textContent = '';
        }, 3000);
      }
    }
  });
  
  // Logout
  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('adminAuthenticated');
    showPinScreen();
  });
  
  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      
      // Update active states
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
  
  // Load countries
  function loadCountries() {
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
    renderCountries(countries);
  }
  
  // Get default countries
  function getDefaultCountries() {
    return [
      { 
        id: 'cyprus',
        name: 'Кипр',
        flag: '🇨🇾',
        region: 'europe',
        time: '7-10 дней',
        price: 2500,
        priceText: '$2,500',
        features: ['EU компания', 'Низкие налоги', 'Престиж']
      },
      { 
        id: 'uk',
        name: 'Великобритания',
        flag: '🇬🇧',
        region: 'europe',
        time: '3-5 дней',
        price: 1500,
        priceText: '$1,500',
        features: ['Быстрая регистрация', 'Мировой престиж', 'Банки']
      },
      { 
        id: 'estonia',
        name: 'Эстония',
        flag: '🇪🇪',
        region: 'europe',
        time: '1-3 дня',
        price: 1200,
        priceText: '$1,200',
        features: ['E-Residency', 'Онлайн управление', 'EU компания']
      }
    ];
  }
  
  // Render countries
  function renderCountries(countries) {
    if (!countriesGrid) return;
    
    countriesGrid.innerHTML = countries.map(country => `
      <div class="admin-country-card" data-country-id="${country.id}">
        <div class="admin-country-header">
          <h3 class="admin-country-name">
            <span class="admin-country-flag">${country.flag || '🏳️'}</span>
            ${country.name}
          </h3>
          <div class="admin-country-actions">
            <button class="icon-btn" onclick="editCountry('${country.id}')" title="Редактировать">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="icon-btn danger" onclick="deleteCountry('${country.id}')" title="Удалить">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="admin-country-info">
          <div><strong>Регион:</strong> ${getRegionName(country.region)}</div>
          <div><strong>Срок:</strong> ${country.time}</div>
          <div><strong>Цена:</strong> ${country.priceText}</div>
          ${country.features && country.features.length > 0 ? `
            <div><strong>Преимущества:</strong></div>
            <ul class="admin-country-features">
              ${country.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
  
  // Get region name
  function getRegionName(region) {
    const regions = {
      'europe': 'Европа',
      'asia': 'Азия',
      'america': 'Америка',
      'offshore': 'Оффшоры'
    };
    return regions[region] || region;
  }
  
  // Add country
  addCountryBtn?.addEventListener('click', () => {
    editingCountryId = null;
    modalTitle.textContent = 'Добавить страну';
    countryForm.reset();
    showModal();
  });
  
  // Edit country
  window.editCountry = (id) => {
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
    const country = countries.find(c => c.id === id);
    
    if (country) {
      editingCountryId = id;
      modalTitle.textContent = 'Редактировать страну';
      
      // Fill form
      document.getElementById('country-name').value = country.name;
      document.getElementById('country-flag').value = country.flag || '';
      document.getElementById('country-region').value = country.region;
      document.getElementById('country-time').value = country.time;
      document.getElementById('country-price').value = country.price;
      document.getElementById('country-features').value = (country.features || []).join('\n');
      
      showModal();
    }
  };
  
  // Delete country
  window.deleteCountry = (id) => {
    if (confirm('Удалить эту страну?')) {
      let countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
      countries = countries.filter(c => c.id !== id);
      localStorage.setItem('registrationCountries', JSON.stringify(countries));
      loadCountries();
      
      // Update main page if function exists
      if (window.setRegistrationCountries) {
        window.setRegistrationCountries(countries);
      }
    }
  };
  
  // Show/hide modal
  function showModal() {
    countryModal.style.display = 'flex';
  }
  
  window.closeCountryModal = () => {
    countryModal.style.display = 'none';
    countryForm.reset();
    editingCountryId = null;
  };
  
  modalClose?.addEventListener('click', closeCountryModal);
  
  // Country form submit
  countryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
    
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
      // Update existing
      const index = countries.findIndex(c => c.id === editingCountryId);
      if (index !== -1) {
        countries[index] = countryData;
      }
    } else {
      // Add new
      countries.push(countryData);
    }
    
    localStorage.setItem('registrationCountries', JSON.stringify(countries));
    loadCountries();
    closeCountryModal();
    
    // Update main page if function exists
    if (window.setRegistrationCountries) {
      window.setRegistrationCountries(countries);
    }
  });
  
  // Export countries
  exportCountriesBtn?.addEventListener('click', () => {
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
    const blob = new Blob([JSON.stringify(countries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registration-countries.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Import countries
  importCountriesBtn?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const countries = JSON.parse(text);
        
        if (Array.isArray(countries)) {
          localStorage.setItem('registrationCountries', JSON.stringify(countries));
          loadCountries();
          
          // Update main page if function exists
          if (window.setRegistrationCountries) {
            window.setRegistrationCountries(countries);
          }
          
          alert('Страны успешно импортированы!');
        } else {
          alert('Неверный формат файла');
        }
      } catch (error) {
        alert('Ошибка при чтении файла');
      }
    };
    input.click();
  });
  
  // Banks functionality
  const banksTbody = document.querySelector('#admin-banks-table tbody');
  const addBankBtn = document.getElementById('bank-add');
  const exportBanksBtn = document.getElementById('bank-export');
  const importBanksBtn = document.getElementById('bank-import');
  
  function loadBanks() {
    const banks = JSON.parse(localStorage.getItem('banksData')) || getDefaultBanks();
    renderBanks(banks);
  }
  
  function getDefaultBanks() {
    return [
      {
        id: 'swiss-cim',
        country: 'Швейцария',
        countryCode: 'switzerland',
        flag: '🇨🇭',
        bank: 'CIM Banque',
        type: 'traditional',
        typeText: 'Традиционный',
        remote: false,
        time: '10-14 дней',
        minimum: '$5,000',
        features: 'Мультивалютные счета, инвестиции, премиум обслуживание'
      }
    ];
  }
  
  function renderBanks(banks) {
    if (!banksTbody) return;
    
    banksTbody.innerHTML = banks.map((bank, index) => `
      <tr>
        <td>
          <span style="font-size: 20px; margin-right: 8px;">${bank.flag || '🏦'}</span>
          ${bank.bank}
        </td>
        <td>${bank.country}</td>
        <td>${bank.typeText}</td>
        <td>${bank.minimum}</td>
        <td>${bank.time}</td>
        <td>
          <button class="icon-btn" onclick="editBank(${index})" title="Редактировать">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="icon-btn danger" onclick="deleteBank(${index})" title="Удалить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
  }
  
  // Add bank
  addBankBtn?.addEventListener('click', () => {
    showBankModal();
  });
  
  // Edit bank
  window.editBank = (index) => {
    const banks = JSON.parse(localStorage.getItem('banksData')) || getDefaultBanks();
    showBankModal(banks[index], index);
  };
  
  // Delete bank
  window.deleteBank = (index) => {
    if (confirm('Удалить этот банк?')) {
      let banks = JSON.parse(localStorage.getItem('banksData')) || getDefaultBanks();
      banks.splice(index, 1);
      localStorage.setItem('banksData', JSON.stringify(banks));
      loadBanks();
      
      // Update main page if function exists
      if (window.setBanksData) {
        window.setBanksData(banks);
      }
    }
  };
  
  // Show bank modal
  function showBankModal(bank = null, index = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${bank ? 'Редактировать банк' : 'Добавить банк'}</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="bank-form">
            <div class="form-group">
              <label>Название банка</label>
              <input type="text" id="bank-name" value="${bank?.bank || ''}" required>
            </div>
            <div class="form-group">
              <label>Страна</label>
              <input type="text" id="bank-country" value="${bank?.country || ''}" required>
            </div>
            <div class="form-group">
              <label>Флаг (эмодзи)</label>
              <input type="text" id="bank-flag" value="${bank?.flag || '🏦'}" maxlength="2">
            </div>
            <div class="form-group">
              <label>Тип</label>
              <select id="bank-type">
                <option value="traditional" ${bank?.type === 'traditional' ? 'selected' : ''}>Традиционный банк</option>
                <option value="digital" ${bank?.type === 'digital' ? 'selected' : ''}>Цифровой банк</option>
                <option value="emi" ${bank?.type === 'emi' ? 'selected' : ''}>EMI</option>
                <option value="crypto" ${bank?.type === 'crypto' ? 'selected' : ''}>Крипто-френдли</option>
              </select>
            </div>
            <div class="form-group">
              <label>Открытие</label>
              <select id="bank-remote">
                <option value="true" ${bank?.remote === true ? 'selected' : ''}>Удалённо</option>
                <option value="false" ${bank?.remote === false ? 'selected' : ''}>С визитом</option>
              </select>
            </div>
            <div class="form-group">
              <label>Срок открытия</label>
              <input type="text" id="bank-time" value="${bank?.time || ''}" placeholder="5-7 дней">
            </div>
            <div class="form-group">
              <label>Минимальный баланс</label>
              <input type="text" id="bank-minimum" value="${bank?.minimum || ''}" placeholder="$1,000">
            </div>
            <div class="form-group">
              <label>Особенности</label>
              <textarea id="bank-features" rows="3">${bank?.features || ''}</textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn--ghost" onclick="this.closest('.modal').remove()">Отмена</button>
              <button type="submit" class="btn btn--primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Form submit
    const form = modal.querySelector('#bank-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const banks = JSON.parse(localStorage.getItem('banksData')) || getDefaultBanks();
      
      const typeSelect = modal.querySelector('#bank-type');
      const typeTexts = {
        'traditional': 'Традиционный',
        'digital': 'Цифровой банк',
        'emi': 'EMI',
        'crypto': 'Крипто-френдли'
      };
      
      const bankData = {
        id: bank?.id || `bank_${Date.now()}`,
        bank: modal.querySelector('#bank-name').value,
        country: modal.querySelector('#bank-country').value,
        flag: modal.querySelector('#bank-flag').value || '🏦',
        type: typeSelect.value,
        typeText: typeTexts[typeSelect.value],
        remote: modal.querySelector('#bank-remote').value === 'true',
        time: modal.querySelector('#bank-time').value,
        minimum: modal.querySelector('#bank-minimum').value,
        features: modal.querySelector('#bank-features').value
      };
      
      if (index !== null) {
        banks[index] = bankData;
      } else {
        banks.push(bankData);
      }
      
      localStorage.setItem('banksData', JSON.stringify(banks));
      loadBanks();
      modal.remove();
      
      // Update main page if function exists
      if (window.setBanksData) {
        window.setBanksData(banks);
      }
    });
  }
  
  // Export banks
  exportBanksBtn?.addEventListener('click', () => {
    const banks = JSON.parse(localStorage.getItem('banksData')) || getDefaultBanks();
    const blob = new Blob([JSON.stringify(banks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'banks-data.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Import banks
  importBanksBtn?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const banks = JSON.parse(text);
        
        if (Array.isArray(banks)) {
          localStorage.setItem('banksData', JSON.stringify(banks));
          loadBanks();
          
          // Update main page if function exists
          if (window.setBanksData) {
            window.setBanksData(banks);
          }
          
          alert('Банки успешно импортированы!');
        } else {
          alert('Неверный формат файла');
        }
      } catch (error) {
        alert('Ошибка при чтении файла');
      }
    };
    input.click();
  });
  
  // Settings
  const changePinBtn = document.getElementById('change-pin-btn');
  const newPinInput = document.getElementById('new-pin');
  const backupAllBtn = document.getElementById('backup-all');
  const restoreAllBtn = document.getElementById('restore-all');
  const clearAllBtn = document.getElementById('clear-all');
  
  // Change PIN
  changePinBtn?.addEventListener('click', () => {
    const newPin = newPinInput.value;
    if (newPin.length === 6 && /^\d+$/.test(newPin)) {
      localStorage.setItem('adminPin', newPin);
      alert('PIN-код успешно изменен!');
      newPinInput.value = '';
    } else {
      alert('PIN должен состоять из 6 цифр');
    }
  });
  
  // Backup all data
  backupAllBtn?.addEventListener('click', () => {
    const data = {
      registrationCountries: JSON.parse(localStorage.getItem('registrationCountries') || '[]'),
      banksData: JSON.parse(localStorage.getItem('banksData') || '[]'),
      adminPin: localStorage.getItem('adminPin') || DEFAULT_PIN,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nw-consulting-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Restore from backup
  restoreAllBtn?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (confirm('Это заменит все текущие данные. Продолжить?')) {
          if (data.registrationCountries) {
            localStorage.setItem('registrationCountries', JSON.stringify(data.registrationCountries));
          }
          if (data.banksData) {
            localStorage.setItem('banksData', JSON.stringify(data.banksData));
          }
          if (data.adminPin) {
            localStorage.setItem('adminPin', data.adminPin);
          }
          
          alert('Данные успешно восстановлены!');
          location.reload();
        }
      } catch (error) {
        alert('Ошибка при чтении файла резервной копии');
      }
    };
    input.click();
  });
  
  // Clear all data
  clearAllBtn?.addEventListener('click', () => {
    if (confirm('Вы уверены? Это удалит ВСЕ данные!')) {
      if (confirm('Это действие НЕОБРАТИМО! Вы точно уверены?')) {
        localStorage.removeItem('registrationCountries');
        localStorage.removeItem('banksData');
        localStorage.removeItem('adminPin');
        sessionStorage.clear();
        alert('Все данные удалены. Страница будет перезагружена.');
        location.reload();
      }
    }
  });
  
  // Audit functionality
  const auditTbody = document.querySelector('#admin-audit-table tbody');
  const addAuditBtn = document.getElementById('audit-add');
  const exportAuditBtn = document.getElementById('audit-export');
  const importAuditBtn = document.getElementById('audit-import');

  function loadAuditCountries() {
    const countries = JSON.parse(localStorage.getItem('auditData')) || getDefaultAuditCountries();
    renderAuditCountries(countries);
  }

  function getDefaultAuditCountries() {
    return [
      {
        id: 'cyprus',
        name: 'Кипр',
        flag: '🇨🇾',
        region: 'Европа',
        taxRate: '12.5%',
        auditRequired: 'Обязательный ежегодный',
        standards: 'МСФО'
      },
      {
        id: 'malta',
        name: 'Мальта',
        flag: '🇲🇹',
        region: 'Европа',
        taxRate: '35%',
        auditRequired: 'Для крупных компаний',
        standards: 'МСФО'
      },
      {
        id: 'singapore',
        name: 'Сингапур',
        flag: '🇸🇬',
        region: 'Азия',
        taxRate: '17%',
        auditRequired: 'По размеру компании',
        standards: 'SFRS'
      },
      {
        id: 'hongkong',
        name: 'Гонконг',
        flag: '🇭🇰',
        region: 'Азия',
        taxRate: '16.5%',
        auditRequired: 'Обязательный',
        standards: 'HKFRS'
      },
      {
        id: 'uae',
        name: 'ОАЭ',
        flag: '🇦🇪',
        region: 'Ближний Восток',
        taxRate: '0-9%',
        auditRequired: 'В свободных зонах - нет',
        standards: 'IFRS'
      },
      {
        id: 'uk',
        name: 'Великобритания',
        flag: '🇬🇧',
        region: 'Европа',
        taxRate: '19-25%',
        auditRequired: 'По размеру компании',
        standards: 'UK GAAP'
      },
      {
        id: 'estonia',
        name: 'Эстония',
        flag: '🇪🇪',
        region: 'Европа',
        taxRate: '20%',
        auditRequired: 'По размеру компании',
        standards: 'МСФО'
      },
      {
        id: 'switzerland',
        name: 'Швейцария',
        flag: '🇨🇭',
        region: 'Европа',
        taxRate: '12-21%',
        auditRequired: 'Обязательный',
        standards: 'Swiss GAAP'
      }
    ];
  }

  function renderAuditCountries(countries) {
    if (!auditTbody) return;
    
    auditTbody.innerHTML = countries.map((country, index) => `
      <tr>
        <td>
          <span style="font-size: 20px; margin-right: 8px;">${country.flag}</span>
          ${country.name}
        </td>
        <td>${country.region}</td>
        <td>${country.taxRate}</td>
        <td>${country.auditRequired}</td>
        <td>${country.standards}</td>
        <td>
          <button class="icon-btn" onclick="editAuditCountry(${index})" title="Редактировать">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="icon-btn danger" onclick="deleteAuditCountry(${index})" title="Удалить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Add audit country
  addAuditBtn?.addEventListener('click', () => {
    showAuditModal();
  });

  // Edit audit country
  window.editAuditCountry = (index) => {
    const countries = JSON.parse(localStorage.getItem('auditData')) || getDefaultAuditCountries();
    showAuditModal(countries[index], index);
  };

  // Delete audit country
  window.deleteAuditCountry = (index) => {
    if (confirm('Удалить эту страну из списка аудита?')) {
      let countries = JSON.parse(localStorage.getItem('auditData')) || getDefaultAuditCountries();
      countries.splice(index, 1);
      localStorage.setItem('auditData', JSON.stringify(countries));
      loadAuditCountries();
    }
  };

  // Show audit modal
  function showAuditModal(country = null, index = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${country ? 'Редактировать страну' : 'Добавить страну'}</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="audit-form">
            <div class="form-group">
              <label>Название страны</label>
              <input type="text" id="audit-name" value="${country?.name || ''}" required>
            </div>
            <div class="form-group">
              <label>Флаг (эмодзи)</label>
              <input type="text" id="audit-flag" value="${country?.flag || '🏴'}" maxlength="2">
            </div>
            <div class="form-group">
              <label>Регион</label>
              <select id="audit-region">
                <option value="Европа" ${country?.region === 'Европа' ? 'selected' : ''}>Европа</option>
                <option value="Азия" ${country?.region === 'Азия' ? 'selected' : ''}>Азия</option>
                <option value="Америка" ${country?.region === 'Америка' ? 'selected' : ''}>Америка</option>
                <option value="Африка" ${country?.region === 'Африка' ? 'selected' : ''}>Африка</option>
                <option value="Океания" ${country?.region === 'Океания' ? 'selected' : ''}>Океания</option>
                <option value="Ближний Восток" ${country?.region === 'Ближний Восток' ? 'selected' : ''}>Ближний Восток</option>
              </select>
            </div>
            <div class="form-group">
              <label>Налоговая ставка</label>
              <input type="text" id="audit-tax" value="${country?.taxRate || ''}" placeholder="12.5%">
            </div>
            <div class="form-group">
              <label>Требования к аудиту</label>
              <input type="text" id="audit-requirements" value="${country?.auditRequired || ''}" placeholder="Обязательный ежегодный">
            </div>
            <div class="form-group">
              <label>Стандарты отчётности</label>
              <input type="text" id="audit-standards" value="${country?.standards || ''}" placeholder="МСФО">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn--ghost" onclick="this.closest('.modal').remove()">Отмена</button>
              <button type="submit" class="btn btn--primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Form submit
    const form = modal.querySelector('#audit-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const countries = JSON.parse(localStorage.getItem('auditData')) || getDefaultAuditCountries();
      
      const countryData = {
        id: country?.id || modal.querySelector('#audit-name').value.toLowerCase().replace(/\s+/g, '-'),
        name: modal.querySelector('#audit-name').value,
        flag: modal.querySelector('#audit-flag').value,
        region: modal.querySelector('#audit-region').value,
        taxRate: modal.querySelector('#audit-tax').value,
        auditRequired: modal.querySelector('#audit-requirements').value,
        standards: modal.querySelector('#audit-standards').value
      };

      if (index !== null) {
        countries[index] = countryData;
      } else {
        countries.push(countryData);
      }

      localStorage.setItem('auditData', JSON.stringify(countries));
      loadAuditCountries();
      modal.remove();
    });
  }

  // Export audit data
  exportAuditBtn?.addEventListener('click', () => {
    const countries = JSON.parse(localStorage.getItem('auditData')) || getDefaultAuditCountries();
    const blob = new Blob([JSON.stringify(countries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-countries.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import audit data
  importAuditBtn?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const countries = JSON.parse(text);
        
        if (Array.isArray(countries)) {
          localStorage.setItem('auditData', JSON.stringify(countries));
          loadAuditCountries();
          alert('Страны аудита успешно импортированы!');
        } else {
          alert('Неверный формат файла');
        }
      } catch (error) {
        alert('Ошибка при чтении файла');
      }
    };
    input.click();
  });

  // KIK functionality
  const kikSaveBtn = document.getElementById('kik-save');
  const kikPreviewBtn = document.getElementById('kik-preview');
  
  // Load KIK data
  function loadKikData() {
    const savedData = localStorage.getItem('kikArticleData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const titleInput = document.getElementById('kik-title');
        const leadTextarea = document.getElementById('kik-lead');
        const metaInput = document.getElementById('kik-meta');
        
        if (titleInput) titleInput.value = data.title || 'Контролируемые иностранные компании (КИК)';
        if (leadTextarea) leadTextarea.value = data.lead || 'Комплексные консультации по вопросам КИК...';
        if (metaInput) metaInput.value = data.meta || '10 мин чтения';
      } catch (e) {
        console.error('Error loading KIK data:', e);
      }
    }
  }
  
  // Save KIK data
  kikSaveBtn?.addEventListener('click', () => {
    const data = {
      title: document.getElementById('kik-title').value,
      lead: document.getElementById('kik-lead').value,
      meta: document.getElementById('kik-meta').value,
      updatedAt: new Date().toLocaleString('ru-RU')
    };
    
    localStorage.setItem('kikArticleData', JSON.stringify(data));
    
    // Show success message
    const btn = kikSaveBtn;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Сохранено!';
    btn.style.background = 'var(--success)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  });
  
  // Preview KIK article
  kikPreviewBtn?.addEventListener('click', () => {
    window.open('../pages/articles/ru-kik.html', '_blank');
  });

  // Initialize
  checkAuth();
  
  // Load data if on admin page
  if (document.querySelector('#admin-audit-table')) {
    loadAuditCountries();
  }
  
  if (document.querySelector('#kik-title')) {
    loadKikData();
  }

  // ========== SHOWCASE MANAGEMENT ==========
  const showcaseList = document.getElementById('showcase-list');
  const addSlideBtn = document.getElementById('add-slide-btn');
  const showcaseModal = document.getElementById('showcase-modal');
  const showcaseModalTitle = document.getElementById('showcase-modal-title');
  const showcaseForm = document.getElementById('showcase-form');
  const showcaseModalClose = document.getElementById('showcase-modal-close');
  const showcaseModalCancel = document.getElementById('showcase-modal-cancel');

  function loadShowcaseSlides() {
    const slides = localStorage.getItem('showcaseSlides');
    return slides ? JSON.parse(slides) : getDefaultSlides();
  }

  function getDefaultSlides() {
    return [
      {
        id: '1',
        title: 'Спецпредложение месяца',
        desc: 'Регистрация компании в ОАЭ + открытие корпоративного счета всего за $2,500',
        link: './pages/registratsiya.html',
        linkText: 'Узнать подробнее →',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
        imageAlt: 'Dubai skyline'
      },
      {
        id: '2',
        title: 'Новые юрисдикции',
        desc: 'Теперь доступна регистрация компаний в Эстонии и Швейцарии с дистанционным открытием счетов',
        link: './pages/registratsiya.html',
        linkText: 'Выбрать юрисдикцию →',
        image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=600&h=400&fit=crop',
        imageAlt: 'European city'
      },
      {
        id: '3',
        title: 'Банки для IT',
        desc: 'Специальные условия открытия счетов для IT-компаний. Быстрое рассмотрение заявок',
        link: './pages/banki.html',
        linkText: 'Подобрать банк →',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
        imageAlt: 'Digital banking'
      }
    ];
  }

  function renderShowcaseSlides() {
    const slides = loadShowcaseSlides();
    showcaseList.innerHTML = slides.map(slide => `
      <div class="showcase-admin-item">
        <div class="showcase-admin-image">
          <img src="${slide.image}" alt="${slide.imageAlt || slide.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 150 100%22%3E%3Crect fill=%22%23ddd%22 width=%22150%22 height=%22100%22/%3E%3Ctext x=%2275%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="showcase-admin-content">
          <h4 class="showcase-admin-title">${slide.title}</h4>
          <p class="showcase-admin-desc">${slide.desc}</p>
          <a href="${slide.link}" class="showcase-admin-link" target="_blank">${slide.linkText}</a>
        </div>
        <div class="showcase-admin-actions">
          <button class="btn btn--sm" onclick="editShowcaseSlide('${slide.id}')">✏️</button>
          <button class="btn btn--sm btn--danger" onclick="deleteShowcaseSlide('${slide.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  window.editShowcaseSlide = function(id) {
    const slides = loadShowcaseSlides();
    const slide = slides.find(s => s.id === id);
    if (!slide) return;

    showcaseModalTitle.textContent = 'Редактировать слайд';
    document.getElementById('showcase-id').value = slide.id;
    document.getElementById('showcase-title').value = slide.title;
    document.getElementById('showcase-desc').value = slide.desc;
    document.getElementById('showcase-link').value = slide.link;
    document.getElementById('showcase-link-text').value = slide.linkText;
    document.getElementById('showcase-image').value = slide.image;
    document.getElementById('showcase-image-alt').value = slide.imageAlt || '';
    
    showcaseModal.style.display = 'block';
  };

  window.deleteShowcaseSlide = function(id) {
    if (!confirm('Удалить этот слайд?')) return;
    
    let slides = loadShowcaseSlides();
    slides = slides.filter(s => s.id !== id);
    localStorage.setItem('showcaseSlides', JSON.stringify(slides));
    renderShowcaseSlides();
    showNotification('Слайд удален');
  };

  function showShowcaseModal() {
    showcaseModalTitle.textContent = 'Добавить слайд';
    showcaseForm.reset();
    document.getElementById('showcase-id').value = '';
    showcaseModal.style.display = 'block';
  }

  // Event listeners
  if (addSlideBtn) {
    addSlideBtn.addEventListener('click', showShowcaseModal);
  }

  if (showcaseModalClose) {
    showcaseModalClose.addEventListener('click', () => {
      showcaseModal.style.display = 'none';
    });
  }

  if (showcaseModalCancel) {
    showcaseModalCancel.addEventListener('click', () => {
      showcaseModal.style.display = 'none';
    });
  }

  if (showcaseForm) {
    showcaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const slideData = {
        id: document.getElementById('showcase-id').value || Date.now().toString(),
        title: document.getElementById('showcase-title').value,
        desc: document.getElementById('showcase-desc').value,
        link: document.getElementById('showcase-link').value,
        linkText: document.getElementById('showcase-link-text').value,
        image: document.getElementById('showcase-image').value,
        imageAlt: document.getElementById('showcase-image-alt').value
      };
      
      let slides = loadShowcaseSlides();
      
      if (slideData.id && slides.find(s => s.id === slideData.id)) {
        // Update existing
        slides = slides.map(s => s.id === slideData.id ? slideData : s);
      } else {
        // Add new
        slides.push(slideData);
      }
      
      localStorage.setItem('showcaseSlides', JSON.stringify(slides));
      showcaseModal.style.display = 'none';
      renderShowcaseSlides();
      showNotification('Слайд сохранен');
    });
  }

  // Initialize showcase on tab switch
  document.querySelectorAll('.admin-tab').forEach(tab => {
    if (tab.dataset.tab === 'showcase') {
      tab.addEventListener('click', () => {
        setTimeout(() => {
          if (showcaseList) {
            renderShowcaseSlides();
          }
        }, 10);
      });
    }
  });
})();
