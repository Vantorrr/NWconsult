// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
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

  function showNotification(message, type = 'success') {
    if (!message) return;
    const existing = document.querySelector('.admin-toast');
    existing?.remove();
    
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });
    
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }
  
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
  
  // Load countries (with self-heal if storage is empty/corrupted)
  function loadCountries() {
    try {
      const raw = localStorage.getItem('registrationCountries');
      if (!raw) {
        const defaults = getDefaultCountries();
        localStorage.setItem('registrationCountries', JSON.stringify(defaults));
        renderCountries(defaults);
        return;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const defaults = getDefaultCountries();
        localStorage.setItem('registrationCountries', JSON.stringify(defaults));
        renderCountries(defaults);
        return;
      }
      renderCountries(parsed);
    } catch (e) {
      const defaults = getDefaultCountries();
      localStorage.setItem('registrationCountries', JSON.stringify(defaults));
      renderCountries(defaults);
    }
  }
  
  // Get default countries
  function getDefaultCountries() {
    return [
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
  
  // Add country (also expose a global for inline fallback)
  function openAddModalInternal() {
    editingCountryId = null;
    modalTitle.textContent = 'Добавить страну';
    countryForm.reset();
    showModal();
  }

  function getAuditRegionName(regionKey, fallback) {
    const regions = {
      'europe': 'Европа',
      'asia': 'Азия',
      'america': 'Америка',
      'middle-east': 'Ближний Восток',
      'offshore': 'Оффшоры',
      'africa': 'Африка'
    };
    return fallback || regions[regionKey] || regionKey || 'Регион не указан';
  }

  window.openAddCountryModal = () => openAddModalInternal();

  if (addCountryBtn) {
    addCountryBtn.addEventListener('click', openAddModalInternal);
  }
  
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
      
      // Set currency based on priceText
      if (document.getElementById('country-currency')) {
        if (country.priceText.includes('€')) {
          document.getElementById('country-currency').value = '€';
        } else if (country.priceText.includes('£')) {
          document.getElementById('country-currency').value = '£';
        } else {
          document.getElementById('country-currency').value = '$';
        }
      }
      
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
    if (countryModal) {
      countryModal.style.display = 'flex';
    }
  }
  
  window.closeCountryModal = () => {
    const modal = document.getElementById('country-modal');
    const form = document.getElementById('country-form');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
    editingCountryId = null;
  };
  
  if (modalClose) {
    modalClose.addEventListener('click', closeCountryModal);
  }
  
  // Country form submit
  if (countryForm) {
    console.log('Setting up form submit handler');
    countryForm.addEventListener('submit', (e) => {
      console.log('Form submitted!');
      e.preventDefault();
      
      try {
        const countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
        console.log('Current countries:', countries);
        
        const currency = document.getElementById('country-currency')?.value || '$';
        const price = parseInt(document.getElementById('country-price').value);
        
        const countryData = {
          id: editingCountryId || `country_${Date.now()}`,
          name: document.getElementById('country-name').value,
          flag: document.getElementById('country-flag').value || '🏳️',
          region: document.getElementById('country-region').value,
          time: document.getElementById('country-time').value,
          price: price,
          priceText: `${currency}${price.toLocaleString()}`,
          features: document.getElementById('country-features').value.split('\n').filter(f => f.trim())
        };
        console.log('New country data:', countryData);
        
        if (editingCountryId) {
          // Update existing
          const index = countries.findIndex(c => c.id === editingCountryId);
          if (index !== -1) {
            countries[index] = countryData;
            console.log('Updated country at index:', index);
          }
        } else {
          // Add new
          countries.push(countryData);
          console.log('Added new country');
        }
        
        localStorage.setItem('registrationCountries', JSON.stringify(countries));
        console.log('Saved to localStorage');
        
        loadCountries();
        closeCountryModal();
        
        alert('Страна сохранена!');
        
        // Update main page if function exists
        if (window.setRegistrationCountries) {
          window.setRegistrationCountries(countries);
        }
      } catch (error) {
        console.error('Error saving country:', error);
        alert('Ошибка при сохранении: ' + error.message);
      }
    });
  } else {
    console.error('Country form not found!');
  }
  
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
    let banks = JSON.parse(localStorage.getItem('banksData'));
    
    // If only one bank exists, reset to defaults
    if (!banks || banks.length <= 1) {
      banks = getDefaultBanks();
      localStorage.setItem('banksData', JSON.stringify(banks));
    }
    
    console.log('Loading banks:', banks.length, 'banks');
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
        cost: '$5,000',
        features: 'Мультивалютные счета, инвестиции, премиум обслуживание'
      },
      {
        id: 'singapore-dbs',
        country: 'Сингапур',
        countryCode: 'singapore',
        flag: '🇸🇬',
        bank: 'DBS Bank',
        type: 'traditional',
        typeText: 'Традиционный',
        remote: false,
        time: '2-3 недели',
        cost: '$30,000',
        features: 'Азиатский хаб, мультивалютные счета, торговое финансирование'
      },
      {
        id: 'uk-revolut',
        country: 'Великобритания',
        countryCode: 'uk',
        flag: '🇬🇧',
        bank: 'Revolut Business',
        type: 'digital',
        typeText: 'Цифровой банк',
        remote: true,
        time: '1-2 дня',
        cost: '$0',
        features: 'Мультивалютные счета, крипто операции, API интеграция'
      },
      {
        id: 'usa-mercury',
        country: 'США',
        countryCode: 'usa',
        flag: '🇺🇸',
        bank: 'Mercury Bank',
        type: 'digital',
        typeText: 'Цифровой банк',
        remote: true,
        time: '1-3 дня',
        cost: '$0',
        features: 'USD счета, интеграции, высокие лимиты'
      },
      {
        id: 'cyprus-bank',
        country: 'Кипр',
        countryCode: 'cyprus',
        flag: '🇨🇾',
        bank: 'Bank of Cyprus',
        type: 'traditional',
        typeText: 'Традиционный',
        remote: false,
        time: '5-7 дней',
        cost: '€5,000',
        features: 'EU счета, торговое финансирование'
      },
      {
        id: 'wise-business',
        country: 'Бельгия',
        countryCode: 'belgium',
        flag: '🇧🇪',
        bank: 'Wise Business',
        type: 'emi',
        typeText: 'EMI',
        remote: true,
        time: '1 день',
        cost: '$0',
        features: 'Мультивалютные счета, низкие комиссии, API'
      },
      {
        id: 'lithuania-paysera',
        country: 'Литва',
        countryCode: 'lithuania',
        flag: '🇱🇹',
        bank: 'Paysera',
        type: 'emi',
        typeText: 'EMI',
        remote: true,
        time: '1-2 дня',
        cost: '€0',
        features: 'SEPA платежи, мультивалютные счета'
      },
      {
        id: 'estonia-lpb',
        country: 'Эстония',
        countryCode: 'estonia',
        flag: '🇪🇪',
        bank: 'LHV Bank',
        type: 'traditional',
        typeText: 'Традиционный',
        remote: true,
        time: '7-10 дней',
        cost: '€1,000',
        features: 'e-Residency поддержка, крипто-френдли'
      },
      {
        id: 'hongkong-hsbc',
        country: 'Гонконг',
        countryCode: 'hongkong',
        flag: '🇭🇰',
        bank: 'HSBC',
        type: 'traditional',
        typeText: 'Традиционный',
        remote: false,
        time: '2-4 недели',
        cost: 'HKD 50,000',
        features: 'Глобальная сеть, премиум обслуживание'
      },
      {
        id: 'uae-emirates',
        country: 'ОАЭ',
        countryCode: 'uae',
        flag: '🇦🇪',
        bank: 'Emirates NBD',
        type: 'traditional',
        typeText: 'Традиционный',
        remote: false,
        time: '1-2 недели',
        cost: 'AED 25,000',
        features: 'Исламский банкинг, мультивалютные счета'
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
        <td>${bank.remote ? 'Удалённо' : 'С визитом'}</td>
        <td>${bank.cost || bank.minimum || '—'}</td>
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
              <label>Стоимость (услуги/пакета)</label>
              <input type="text" id="bank-cost" value="${bank?.cost || bank?.minimum || ''}" placeholder="$1,000">
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
        cost: modal.querySelector('#bank-cost').value,
        minimum: modal.querySelector('#bank-cost').value,
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
  const auditGrid = document.getElementById('admin-audit-grid');
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
        region: 'europe',
        regionText: 'Европа',
        taxRate: '12.5%',
        auditRequired: 'Обязательный ежегодный',
        standards: 'МСФО',
        articleUrl: './articles/audit-cyprus.html'
      },
      {
        id: 'malta',
        name: 'Мальта',
        flag: '🇲🇹',
        region: 'europe',
        regionText: 'Европа',
        taxRate: '35%',
        auditRequired: 'Для крупных компаний',
        standards: 'МСФО',
        articleUrl: './articles/audit-malta.html'
      },
      {
        id: 'singapore',
        name: 'Сингапур',
        flag: '🇸🇬',
        region: 'asia',
        regionText: 'Азия',
        taxRate: '17%',
        auditRequired: 'По размеру компании',
        standards: 'SFRS',
        articleUrl: './articles/audit-singapore.html'
      },
      {
        id: 'hongkong',
        name: 'Гонконг',
        flag: '🇭🇰',
        region: 'asia',
        regionText: 'Азия',
        taxRate: '16.5%',
        auditRequired: 'Обязательный',
        standards: 'HKFRS',
        articleUrl: './articles/audit-hongkong.html'
      },
      {
        id: 'uae',
        name: 'ОАЭ',
        flag: '🇦🇪',
        region: 'middle-east',
        regionText: 'Ближний Восток',
        taxRate: '0-9%',
        auditRequired: 'В свободных зонах - нет',
        standards: 'IFRS',
        articleUrl: './articles/audit-uae.html'
      },
      {
        id: 'uk',
        name: 'Великобритания',
        flag: '🇬🇧',
        region: 'europe',
        regionText: 'Европа',
        taxRate: '19-25%',
        auditRequired: 'По размеру компании',
        standards: 'UK GAAP',
        articleUrl: './articles/audit-uk.html'
      },
      {
        id: 'estonia',
        name: 'Эстония',
        flag: '🇪🇪',
        region: 'europe',
        regionText: 'Европа',
        taxRate: '20%',
        auditRequired: 'По размеру компании',
        standards: 'МСФО',
        articleUrl: './articles/audit-estonia.html'
      },
      {
        id: 'switzerland',
        name: 'Швейцария',
        flag: '🇨🇭',
        region: 'europe',
        regionText: 'Европа',
        taxRate: '12-21%',
        auditRequired: 'Обязательный',
        standards: 'Swiss GAAP',
        articleUrl: './articles/audit-switzerland.html'
      }
    ];
  }

  function renderAuditCountries(countries) {
    if (!auditGrid) return;

    if (!Array.isArray(countries) || countries.length === 0) {
      auditGrid.innerHTML = `
        <div class="admin-country-card admin-country-card--placeholder">
          <p class="muted">Добавьте первую юрисдикцию аудита, чтобы она появилась здесь.</p>
        </div>
      `;
      return;
    }

    auditGrid.innerHTML = countries.map((country, index) => `
      <div class="admin-country-card">
        <div class="admin-country-header">
          <h3 class="admin-country-name">
            <span class="admin-country-flag">${country.flag || '🏳️'}</span>
            ${country.name}
          </h3>
          <div class="admin-country-actions">
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
          </div>
        </div>
        <div class="admin-country-info">
          <div><strong>Регион:</strong> ${getAuditRegionName(country.region, country.regionText)}</div>
          <div><strong>Налог:</strong> ${country.taxRate || '—'}</div>
          <div><strong>Требования:</strong> ${country.auditRequired || '—'}</div>
          <div><strong>Стандарты:</strong> ${country.standards || '—'}</div>
          ${country.articleUrl ? `<div><strong>Статья:</strong> <a href="${country.articleUrl}" target="_blank" rel="noopener">${country.articleUrl}</a></div>` : ''}
        </div>
      </div>
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
      localStorage.setItem('auditCountries', JSON.stringify(countries));
      loadAuditCountries();
      if (window.setAuditCountries) {
        window.setAuditCountries(countries);
      }
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
                <option value="europe" ${(!country || country?.region === 'europe') ? 'selected' : ''}>Европа</option>
                <option value="asia" ${country?.region === 'asia' ? 'selected' : ''}>Азия</option>
                <option value="america" ${country?.region === 'america' ? 'selected' : ''}>Америка</option>
                <option value="middle-east" ${country?.region === 'middle-east' ? 'selected' : ''}>Ближний Восток</option>
                <option value="offshore" ${country?.region === 'offshore' ? 'selected' : ''}>Оффшоры</option>
                <option value="africa" ${country?.region === 'africa' ? 'selected' : ''}>Африка</option>
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
            <div class="form-group">
              <label>Ссылка на статью</label>
              <input type="text" id="audit-article" value="${country?.articleUrl || ''}" placeholder="./articles/audit-cyprus.html">
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
      const regionValue = modal.querySelector('#audit-region').value;
      const countryName = modal.querySelector('#audit-name').value.trim();
      const normalizedId = country?.id || countryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      const countryData = {
        id: normalizedId || `audit_${Date.now()}`,
        name: countryName || 'Без названия',
        flag: modal.querySelector('#audit-flag').value || '🏴',
        region: regionValue,
        regionText: getAuditRegionName(regionValue),
        taxRate: modal.querySelector('#audit-tax').value,
        auditRequired: modal.querySelector('#audit-requirements').value,
        standards: modal.querySelector('#audit-standards').value,
        articleUrl: modal.querySelector('#audit-article').value || `./articles/audit-${normalizedId}.html`
      };

      if (index !== null) {
        countries[index] = countryData;
      } else {
        countries.push(countryData);
      }
      
      localStorage.setItem('auditData', JSON.stringify(countries));
      localStorage.setItem('auditCountries', JSON.stringify(countries));
      loadAuditCountries();
      modal.remove();
      
      if (window.setAuditCountries) {
        window.setAuditCountries(countries);
      }
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
          localStorage.setItem('auditCountries', JSON.stringify(countries));
          loadAuditCountries();
          alert('Страны аудита успешно импортированы!');
          if (window.setAuditCountries) {
            window.setAuditCountries(countries);
          }
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

  // Other services management
  const otherServicesBody = document.getElementById('other-services-body');
  const otherServiceAddBtn = document.getElementById('other-service-add');
  const otherServiceModal = document.getElementById('other-service-modal');
  const otherServiceModalTitle = document.getElementById('other-service-modal-title');
  const otherServiceModalClose = document.getElementById('other-service-modal-close');
  const otherServiceModalCancel = document.getElementById('other-service-modal-cancel');
  const otherServiceForm = document.getElementById('other-service-form');
  const otherServiceIdInput = document.getElementById('other-service-id');
  const otherServiceTitleInput = document.getElementById('other-service-title');
  const otherServiceDescInput = document.getElementById('other-service-desc');
  const otherServiceLinkInput = document.getElementById('other-service-link');
  let editingServiceId = null;

  function getDefaultOtherServices() {
    return [
      {
        id: 'kik-consulting',
        title: 'Консультации по КИК',
        desc: 'Сопровождение уведомлений, расчёт прибыли и проверка обязательств контролирующих лиц.',
        link: '/pages/articles/ru-kik.html'
      }
    ];
  }

  function loadOtherServices() {
    if (!otherServicesBody) return;

    let services;
    try {
      const raw = localStorage.getItem('otherServices');
      if (!raw) {
        services = getDefaultOtherServices();
        localStorage.setItem('otherServices', JSON.stringify(services));
      } else {
        services = JSON.parse(raw);
        if (!Array.isArray(services)) throw new Error('invalid');
      }
    } catch (error) {
      console.error('Failed to load other services, resetting to defaults.', error);
      services = getDefaultOtherServices();
      localStorage.setItem('otherServices', JSON.stringify(services));
    }

    renderOtherServices(services);
  }

  function renderOtherServices(services) {
    if (!otherServicesBody) return;

    if (!services || services.length === 0) {
      otherServicesBody.innerHTML = `
        <tr class="table-placeholder">
          <td colspan="4" style="text-align:center;">Добавьте первую услугу, чтобы она появилась здесь</td>
        </tr>
      `;
      return;
    }

    otherServicesBody.innerHTML = services.map(service => `
      <tr data-service-id="${service.id}">
        <td>${service.title}</td>
        <td>${service.desc || '—'}</td>
        <td>${service.link ? `<a href="${service.link}" target="_blank" rel="noopener">${service.link}</a>` : '—'}</td>
        <td>
          <button class="icon-btn" title="Редактировать" onclick="editOtherService('${service.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="icon-btn danger" title="Удалить" onclick="deleteOtherService('${service.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function openOtherServiceModal(service = null) {
    if (!otherServiceModal) return;

    editingServiceId = service?.id || null;
    otherServiceModalTitle.textContent = service ? 'Редактировать услугу' : 'Добавить услугу';
    otherServiceIdInput.value = service?.id || '';
    otherServiceTitleInput.value = service?.title || '';
    otherServiceDescInput.value = service?.desc || '';
    otherServiceLinkInput.value = service?.link || '';
    otherServiceModal.style.display = 'block';
  }

  function closeOtherServiceModal() {
    if (!otherServiceModal) return;
    otherServiceModal.style.display = 'none';
    otherServiceForm?.reset();
    editingServiceId = null;
  }

  if (otherServiceAddBtn) {
    otherServiceAddBtn.addEventListener('click', () => openOtherServiceModal());
  }

  otherServiceModalClose?.addEventListener('click', closeOtherServiceModal);
  otherServiceModalCancel?.addEventListener('click', closeOtherServiceModal);

  window.editOtherService = (id) => {
    const services = JSON.parse(localStorage.getItem('otherServices') || '[]');
    const service = services.find(item => item.id === id);
    if (!service) {
      showNotification('Услуга не найдена', 'error');
      return;
    }
    openOtherServiceModal(service);
  };

  window.deleteOtherService = (id) => {
    if (!confirm('Удалить эту услугу?')) return;
    let services = JSON.parse(localStorage.getItem('otherServices') || '[]');
    services = services.filter(item => item.id !== id);
    localStorage.setItem('otherServices', JSON.stringify(services));
    renderOtherServices(services);
    showNotification('Услуга удалена');
  };

  otherServiceForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = otherServiceTitleInput.value.trim();
    const desc = otherServiceDescInput.value.trim();
    const link = otherServiceLinkInput.value.trim();

    if (!title) {
      showNotification('Введите название услуги', 'error');
      return;
    }

    let services = JSON.parse(localStorage.getItem('otherServices') || '[]');
    if (!Array.isArray(services)) services = [];

    const id = editingServiceId || `service_${Date.now()}`;
    const serviceData = { id, title, desc, link };

    if (editingServiceId) {
      services = services.map(item => item.id === id ? serviceData : item);
    } else {
      services.push(serviceData);
    }

    localStorage.setItem('otherServices', JSON.stringify(services));
    renderOtherServices(services);
    closeOtherServiceModal();
    showNotification('Услуга сохранена');
  });

  // Initialize
  checkAuth();
  
  // Debug info
  console.log('Admin script loaded');
  console.log('Country modal:', document.getElementById('country-modal'));
  console.log('Add button:', document.getElementById('reg-add-country'));
  console.log('Country form:', document.getElementById('country-form'));
  
  // Глобальная функция для добавления страны
  window.openAddCountryModal = function() {
    console.log('Opening add country modal...');
    const modal = document.getElementById('country-modal');
    const form = document.getElementById('country-form');
    const title = document.getElementById('country-modal-title');
    
    if (modal && form && title) {
      editingCountryId = null;
      title.textContent = 'Добавить страну';
      form.reset();
      modal.style.display = 'flex';
      console.log('Modal opened successfully');
    } else {
      console.error('Modal elements not found:', {modal, form, title});
    }
  };
  
  // Глобальная функция для тестирования
  window.testAddCountry = function() {
    console.log('Testing add country...');
    const modal = document.getElementById('country-modal');
    if (modal) {
      modal.style.display = 'flex';
      console.log('Modal should be visible now');
    } else {
      console.error('Modal not found!');
    }
  };
  
  // Тестовая функция для добавления страны напрямую
  window.testSaveCountry = function() {
    try {
      const countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
      const testCountry = {
        id: `country_${Date.now()}`,
        name: 'Тестовая страна',
        flag: '🏳️',
        region: 'europe',
        time: '1-2 дня',
        price: 1000,
        priceText: '$1,000',
        features: ['Тест 1', 'Тест 2']
      };
      countries.push(testCountry);
      localStorage.setItem('registrationCountries', JSON.stringify(countries));
      loadCountries();
      alert('Тестовая страна добавлена!');
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка: ' + error.message);
    }
  };
  
  // Load data if on admin page
  if (document.querySelector('#admin-audit-grid')) {
    loadAuditCountries();
  }
  
  if (document.querySelector('#kik-title')) {
    loadKikData();
  }
  if (otherServicesBody) {
    loadOtherServices();
  }

  // ========== SHOWCASE MANAGEMENT ==========
  const showcaseList = document.getElementById('showcase-list');
  const addSlideBtn = document.getElementById('add-slide-btn');
  const showcaseModal = document.getElementById('showcase-modal');
  const showcaseModalTitle = document.getElementById('showcase-modal-title');
  const showcaseForm = document.getElementById('showcase-form');
  const showcaseModalClose = document.getElementById('showcase-modal-close');
  const showcaseModalCancel = document.getElementById('showcase-modal-cancel');
  const showcaseImageInput = document.getElementById('showcase-image');
  const showcaseImageUpload = document.getElementById('showcase-image-upload');
  const showcaseUploadTrigger = document.getElementById('showcase-upload-trigger');
  const showcaseImageStatus = document.getElementById('showcase-image-status');

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
    if (showcaseImageInput) {
      showcaseImageInput.value = slide.image;
    }
    if (showcaseImageStatus) {
      showcaseImageStatus.textContent = slide.image ? 'Используется сохранённое изображение' : 'Файл не выбран';
    }
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
    if (showcaseImageInput) showcaseImageInput.value = '';
    if (showcaseImageUpload) showcaseImageUpload.value = '';
    if (showcaseImageStatus) showcaseImageStatus.textContent = 'Файл не выбран';
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
      if (showcaseImageInput && !showcaseImageInput.value) {
        showNotification('Пожалуйста, загрузите изображение для слайда', 'error');
        return;
      }
      
      const slideData = {
        id: document.getElementById('showcase-id').value || Date.now().toString(),
        title: document.getElementById('showcase-title').value,
        desc: document.getElementById('showcase-desc').value,
        link: document.getElementById('showcase-link').value,
        linkText: document.getElementById('showcase-link-text').value,
        image: showcaseImageInput ? showcaseImageInput.value : '',
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

  showcaseUploadTrigger?.addEventListener('click', () => {
    showcaseImageUpload?.click();
  });

  showcaseImageUpload?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (showcaseImageStatus) showcaseImageStatus.textContent = 'Файл не выбран';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (showcaseImageInput) showcaseImageInput.value = reader.result;
      if (showcaseImageStatus) showcaseImageStatus.textContent = `Загружено: ${file.name}`;
    };
    reader.onerror = () => {
      showNotification('Не удалось прочитать файл изображения', 'error');
    };
    reader.readAsDataURL(file);
  });
})();

// Article Editor
(function() {
  const editKikBtn = document.getElementById('edit-kik-btn');
  const articleModal = document.getElementById('article-modal');
  const articleEditor = document.getElementById('article-editor');
  const articlePreview = document.getElementById('article-preview');
  const articleTitle = document.getElementById('article-title');
  const saveArticleBtn = document.getElementById('save-article-btn');
  
  if (!editKikBtn || !articleModal) return;
  
  // Load article content from localStorage
  function loadArticle() {
    const savedArticle = localStorage.getItem('kikArticle');
    if (savedArticle) {
      const article = JSON.parse(savedArticle);
      articleTitle.value = article.title || 'КИК (Контролируемые иностранные компании)';
      articleEditor.innerHTML = article.content || '';
      updatePreview();
    } else {
      // Default content
      articleTitle.value = 'КИК (Контролируемые иностранные компании)';
      articleEditor.innerHTML = `
        <h2>Что такое КИК?</h2>
        <p>КИК (контролируемая иностранная компания) — это иностранная организация или структура без образования юридического лица, которая контролируется налоговым резидентом РФ.</p>
        
        <h2>Кто должен отчитываться о КИК?</h2>
        <p>Отчитываться о КИК обязаны российские налоговые резиденты (физические и юридические лица), которые:</p>
        <ul>
          <li>Владеют долей более 25% в иностранной компании</li>
          <li>Владеют долей более 10%, если доля всех резидентов РФ превышает 50%</li>
          <li>Осуществляют контроль над иностранной структурой</li>
        </ul>
        
        <h2>Налогообложение прибыли КИК</h2>
        <p>Прибыль КИК включается в налоговую базу контролирующего лица и облагается налогом по ставке:</p>
        <ul>
          <li>13% — для физических лиц</li>
          <li>20% — для юридических лиц</li>
        </ul>
        
        <h3>Освобождение от налогообложения</h3>
        <p>Прибыль КИК освобождается от налогообложения, если:</p>
        <ul>
          <li>Размер прибыли не превышает 10 млн рублей</li>
          <li>КИК является резидентом страны из утвержденного перечня</li>
          <li>Эффективная ставка налога на прибыль КИК составляет не менее 75% от средневзвешенной налоговой ставки по налогу на прибыль в РФ</li>
        </ul>
      `;
      updatePreview();
    }
  }
  
  // Update preview
  function updatePreview() {
    articlePreview.innerHTML = `
      <h1 class="article-title">${articleTitle.value}</h1>
      ${articleEditor.innerHTML}
    `;
  }
  
  // Editor toolbar commands
  document.querySelectorAll('.editor-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      
      switch(cmd) {
        case 'bold':
          document.execCommand('bold', false, null);
          break;
        case 'italic':
          document.execCommand('italic', false, null);
          break;
        case 'underline':
          document.execCommand('underline', false, null);
          break;
        case 'h2':
          document.execCommand('formatBlock', false, '<h2>');
          break;
        case 'h3':
          document.execCommand('formatBlock', false, '<h3>');
          break;
        case 'paragraph':
          document.execCommand('formatBlock', false, '<p>');
          break;
        case 'unorderedList':
          document.execCommand('insertUnorderedList', false, null);
          break;
        case 'orderedList':
          document.execCommand('insertOrderedList', false, null);
          break;
        case 'link':
          const url = prompt('Введите URL:');
          if (url) {
            document.execCommand('createLink', false, url);
          }
          break;
      }
      
      articleEditor.focus();
      updatePreview();
    });
  });
  
  // Update preview on input
  articleEditor.addEventListener('input', updatePreview);
  articleTitle.addEventListener('input', updatePreview);
  
  // Show modal
  editKikBtn.addEventListener('click', () => {
    loadArticle();
    articleModal.style.display = 'block';
  });
  
  // Close modal
  articleModal.querySelector('.modal-close').addEventListener('click', () => {
    articleModal.style.display = 'none';
  });
  
  articleModal.querySelector('.modal-cancel').addEventListener('click', () => {
    articleModal.style.display = 'none';
  });
  
  // Save article
  saveArticleBtn.addEventListener('click', () => {
    const article = {
      title: articleTitle.value,
      content: articleEditor.innerHTML
    };
    
    localStorage.setItem('kikArticle', JSON.stringify(article));
    showNotification('Статья сохранена');
    articleModal.style.display = 'none';
    
    // Update the actual article page if needed
    // This would require additional implementation
  });
});
