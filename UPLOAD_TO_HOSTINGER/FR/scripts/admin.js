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
        pinError.textContent = 'PIN incorrect-код';
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
        name: 'Chypre',
        flag: '🇨🇾',
        region: 'europe',
        time: '7-10 jours',
        price: 2500,
        priceText: '$2,500',
        features: ['Société UE', 'Faibles impôts', 'Prestige']
      },
      { 
        id: 'uk',
        name: 'Royaume-Uni',
        flag: '🇬🇧',
        region: 'europe',
        time: '3-5 jours',
        price: 1500,
        priceText: '$1,500',
        features: ['Enregistrement rapide', 'Prestige mondial', 'Banques']
      },
      { 
        id: 'estonia',
        name: 'Estonie',
        flag: '🇪🇪',
        region: 'europe',
        time: '1-3 jours',
        price: 1200,
        priceText: '$1,200',
        features: ['E-Residency', 'Gestion en ligne', 'Société UE']
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
            <button class="icon-btn" onclick="editCountry('${country.id}')" title="Modifier">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="icon-btn danger" onclick="deleteCountry('${country.id}')" title="Supprimer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="admin-country-info">
          <div><strong>Région:</strong> ${getRegionName(country.region)}</div>
          <div><strong>Délai:</strong> ${country.time}</div>
          <div><strong>Prix:</strong> ${country.priceText}</div>
          ${country.features && country.features.length > 0 ? `
            <div><strong>Avantages:</strong></div>
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
      'europe': 'Europe',
      'asia': 'Asie',
      'america': 'Amérique',
      'offshore': 'Offshore'
    };
    return regions[region] || region;
  }
  
  // Add country
  addCountryBtn?.addEventListener('click', () => {
    editingCountryId = null;
    modalTitle.textContent = 'Ajouter un pays';
    countryForm.reset();
    showModal();
  });
  
  // Edit country
  window.editCountry = (id) => {
    const countries = JSON.parse(localStorage.getItem('registrationCountries')) || getDefaultCountries();
    const country = countries.find(c => c.id === id);
    
    if (country) {
      editingCountryId = id;
      modalTitle.textContent = 'Modifier depuisтрану';
      
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
    if (confirm('Supprimer эту depuisтрану?')) {
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
          
          alert('Страны уdepuisпешно импортированы!');
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
        country: 'Suisse',
        countryCode: 'switzerland',
        flag: '🇨🇭',
        bank: 'CIM Banque',
        type: 'traditional',
        typeText: 'Traditionnel',
        remote: false,
        time: '10-14 jours',
        minimum: '$5,000',
        features: 'Comptes multidevises, investissements, service premium'
      },
      {
        id: 'singapore-dbs',
        country: 'Singapour',
        countryCode: 'singapore',
        flag: '🇸🇬',
        bank: 'DBS Bank',
        type: 'traditional',
        typeText: 'Traditionnel',
        remote: false,
        time: '2-3 недели',
        minimum: '$30,000',
        features: 'Hub asiatique, мультивалютные depuisчета, торговое финанdepuisирование'
      },
      {
        id: 'uk-revolut',
        country: 'Royaume-Uni',
        countryCode: 'uk',
        flag: '🇬🇧',
        bank: 'Revolut Business',
        type: 'digital',
        typeText: 'Banque numérique',
        remote: true,
        time: '1-2 jours',
        minimum: '$0',
        features: 'Comptes multidevises, крипто операции, API интеграция'
      },
      {
        id: 'usa-mercury',
        country: 'États-Unis',
        countryCode: 'usa',
        flag: '🇺🇸',
        bank: 'Mercury Bank',
        type: 'digital',
        typeText: 'Banque numérique',
        remote: true,
        time: '1-3 jours',
        minimum: '$0',
        features: 'USD depuisчета, интеграции, выdepuisокие лимиты'
      },
      {
        id: 'cyprus-bank',
        country: 'Chypre',
        countryCode: 'cyprus',
        flag: '🇨🇾',
        bank: 'Bank of Cyprus',
        type: 'traditional',
        typeText: 'Traditionnel',
        remote: false,
        time: '5-7 jours',
        minimum: '€5,000',
        features: 'Comptes UE, торговое финанdepuisирование'
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
        time: '1 jour',
        minimum: '$0',
        features: 'Comptes multidevises, низкие комиdepuisdepuisии, API'
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
        time: '1-2 jours',
        minimum: '€0',
        features: 'SEPA платежи, мультивалютные depuisчета'
      },
      {
        id: 'estonia-lpb',
        country: 'Estonie',
        countryCode: 'estonia',
        flag: '🇪🇪',
        bank: 'LHV Bank',
        type: 'traditional',
        typeText: 'Traditionnel',
        remote: true,
        time: '7-10 jours',
        minimum: '€1,000',
        features: 'e-Residency поддержка, крипто-френдли'
      },
      {
        id: 'hongkong-hsbc',
        country: 'Hong Kong',
        countryCode: 'hongkong',
        flag: '🇭🇰',
        bank: 'HSBC',
        type: 'traditional',
        typeText: 'Traditionnel',
        remote: false,
        time: '2-4 недели',
        minimum: 'HKD 50,000',
        features: 'Глобальная depuisеть, service premium'
      },
      {
        id: 'uae-emirates',
        country: 'ÉAU',
        countryCode: 'uae',
        flag: '🇦🇪',
        bank: 'Emirates NBD',
        type: 'traditional',
        typeText: 'Traditionnel',
        remote: false,
        time: '1-2 недели',
        minimum: 'AED 25,000',
        features: 'Banque islamique, мультивалютные depuisчета'
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
          <button class="icon-btn" onclick="editBank(${index})" title="Modifier">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="icon-btn danger" onclick="deleteBank(${index})" title="Supprimer">
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
    if (confirm('Supprimer этà partir de банк?')) {
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
          <h3>${bank ? 'Modifier банк' : 'Добавить банк'}</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="bank-form">
            <div class="form-group">
              <label>Nom банка</label>
              <input type="text" id="bank-name" value="${bank?.bank || ''}" required>
            </div>
            <div class="form-group">
              <label>Pays</label>
              <input type="text" id="bank-country" value="${bank?.country || ''}" required>
            </div>
            <div class="form-group">
              <label>Флаг (эмодзи)</label>
              <input type="text" id="bank-flag" value="${bank?.flag || '🏦'}" maxlength="2">
            </div>
            <div class="form-group">
              <label>Type</label>
              <select id="bank-type">
                <option value="traditional" ${bank?.type === 'traditional' ? 'selected' : ''}>Banque traditionnelle</option>
                <option value="digital" ${bank?.type === 'digital' ? 'selected' : ''}>Banque numérique</option>
                <option value="emi" ${bank?.type === 'emi' ? 'selected' : ''}>EMI</option>
                <option value="crypto" ${bank?.type === 'crypto' ? 'selected' : ''}>Crypto-френдли</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ouverture</label>
              <select id="bank-remote">
                <option value="true" ${bank?.remote === true ? 'selected' : ''}>À distance</option>
                <option value="false" ${bank?.remote === false ? 'selected' : ''}>Avec visite</option>
              </select>
            </div>
            <div class="form-group">
              <label>Délai à partir deкрытия</label>
              <input type="text" id="bank-time" value="${bank?.time || ''}" placeholder="5-7 jours">
            </div>
            <div class="form-group">
              <label>Минимальный баланdepuis</label>
              <input type="text" id="bank-minimum" value="${bank?.minimum || ''}" placeholder="$1,000">
            </div>
            <div class="form-group">
              <label>Оdepuisобенноdepuisти</label>
              <textarea id="bank-features" rows="3">${bank?.features || ''}</textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn--ghost" onclick="this.closest('.modal').remove()">Отмена</button>
              <button type="submit" class="btn btn--primary">Enregistrer</button>
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
        'traditional': 'Traditionnel',
        'digital': 'Banque numérique',
        'emi': 'EMI',
        'crypto': 'Crypto-френдли'
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
          
          alert('Banques уdepuisпешно импортированы!');
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
      alert('PIN-код уdepuisпешно изменен!');
      newPinInput.value = '';
    } else {
      alert('PIN должен depuisоdepuisтоять из 6 цифр');
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
        
        if (confirm('Это заменит вdepuisе текущие данные. Продолжить?')) {
          if (data.registrationCountries) {
            localStorage.setItem('registrationCountries', JSON.stringify(data.registrationCountries));
          }
          if (data.banksData) {
            localStorage.setItem('banksData', JSON.stringify(data.banksData));
          }
          if (data.adminPin) {
            localStorage.setItem('adminPin', data.adminPin);
          }
          
          alert('Данные уdepuisпешно воdepuisdepuisтановлены!');
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
      if (confirm('Это дейdepuisтвие НЕОБРАТИМО! Вы точно уверены?')) {
        localStorage.removeItem('registrationCountries');
        localStorage.removeItem('banksData');
        localStorage.removeItem('adminPin');
        sessionStorage.clear();
        alert('Tous данные удалены. Страница будет перезагружена.');
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
        name: 'Chypre',
        flag: '🇨🇾',
        region: 'Europe',
        taxRate: '12.5%',
        auditRequired: 'Obligatoire annuel',
        standards: 'МСФО'
      },
      {
        id: 'malta',
        name: 'Malte',
        flag: '🇲🇹',
        region: 'Europe',
        taxRate: '35%',
        auditRequired: 'Pour les grandes entreprises',
        standards: 'МСФО'
      },
      {
        id: 'singapore',
        name: 'Singapour',
        flag: '🇸🇬',
        region: 'Asie',
        taxRate: '17%',
        auditRequired: 'Selon la taille de l'entreprise',
        standards: 'SFRS'
      },
      {
        id: 'hongkong',
        name: 'Hong Kong',
        flag: '🇭🇰',
        region: 'Asie',
        taxRate: '16.5%',
        auditRequired: 'Обязательный',
        standards: 'HKFRS'
      },
      {
        id: 'uae',
        name: 'ÉAU',
        flag: '🇦🇪',
        region: 'Ближний Воdepuisток',
        taxRate: '0-9%',
        auditRequired: 'Dans les zones franches - non',
        standards: 'IFRS'
      },
      {
        id: 'uk',
        name: 'Royaume-Uni',
        flag: '🇬🇧',
        region: 'Europe',
        taxRate: '19-25%',
        auditRequired: 'Selon la taille de l'entreprise',
        standards: 'UK GAAP'
      },
      {
        id: 'estonia',
        name: 'Estonie',
        flag: '🇪🇪',
        region: 'Europe',
        taxRate: '20%',
        auditRequired: 'Selon la taille de l'entreprise',
        standards: 'МСФО'
      },
      {
        id: 'switzerland',
        name: 'Suisse',
        flag: '🇨🇭',
        region: 'Europe',
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
          <button class="icon-btn" onclick="editAuditCountry(${index})" title="Modifier">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="icon-btn danger" onclick="deleteAuditCountry(${index})" title="Supprimer">
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
    if (confirm('Supprimer эту depuisтрану из depuisпиdepuisка аудита?')) {
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
          <h3>${country ? 'Modifier depuisтрану' : 'Ajouter un pays'}</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="audit-form">
            <div class="form-group">
              <label>Nom depuisтраны</label>
              <input type="text" id="audit-name" value="${country?.name || ''}" required>
            </div>
            <div class="form-group">
              <label>Флаг (эмодзи)</label>
              <input type="text" id="audit-flag" value="${country?.flag || '🏴'}" maxlength="2">
            </div>
            <div class="form-group">
              <label>Région</label>
              <select id="audit-region">
                <option value="Europe" ${country?.region === 'Europe' ? 'selected' : ''}>Europe</option>
                <option value="Asie" ${country?.region === 'Asie' ? 'selected' : ''}>Asie</option>
                <option value="Amérique" ${country?.region === 'Amérique' ? 'selected' : ''}>Amérique</option>
                <option value="Африка" ${country?.region === 'Африка' ? 'selected' : ''}>Африка</option>
                <option value="Океания" ${country?.region === 'Океания' ? 'selected' : ''}>Океания</option>
                <option value="Ближний Воdepuisток" ${country?.region === 'Ближний Воdepuisток' ? 'selected' : ''}>Ближний Воdepuisток</option>
              </select>
            </div>
            <div class="form-group">
              <label>Impôtовая depuisтавка</label>
              <input type="text" id="audit-tax" value="${country?.taxRate || ''}" placeholder="12.5%">
            </div>
            <div class="form-group">
              <label>Требования к аудиту</label>
              <input type="text" id="audit-requirements" value="${country?.auditRequired || ''}" placeholder="Obligatoire annuel">
            </div>
            <div class="form-group">
              <label>Стандарты à partir deчётноdepuisти</label>
              <input type="text" id="audit-standards" value="${country?.standards || ''}" placeholder="МСФО">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn--ghost" onclick="this.closest('.modal').remove()">Отмена</button>
              <button type="submit" class="btn btn--primary">Enregistrer</button>
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
          alert('Страны аудита уdepuisпешно импортированы!');
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
        
        if (titleInput) titleInput.value = data.title || 'Контролируемые иноdepuisтранные компании (КИК)';
        if (leadTextarea) leadTextarea.value = data.lead || 'Комплекdepuisные конdepuisультации по вопроdepuisам КИК...';
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
        title: 'Спецпредложение меdepuisяца',
        desc: 'Enregistrement de la société в ÉAU + à partir deкрытие корпоративного depuisчета вdepuisего за $2,500',
        link: './pages/registratsiya.html',
        linkText: 'En savoir plus →',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
        imageAlt: 'Dubai skyline'
      },
      {
        id: '2',
        title: 'Новые юриdepuisдикции',
        desc: 'Теперь доdepuisтупна региdepuisтрация компаний в Эdepuisтонии и Швейцарии depuis диdepuisтанционным à partir deкрытием depuisчетов',
        link: './pages/registratsiya.html',
        linkText: 'Choisir une juridiction →',
        image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=600&h=400&fit=crop',
        imageAlt: 'European city'
      },
      {
        id: '3',
        title: 'Banques для IT',
        desc: 'Специальные уdepuisловия à partir deкрытия depuisчетов для IT-компаний. Rapideе раdepuisdepuisмà partir deрение заявок',
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

    showcaseModalTitle.textContent = 'Modifier depuisлайд';
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
    if (!confirm('Supprimer этà partir de depuisлайд?')) return;
    
    let slides = loadShowcaseSlides();
    slides = slides.filter(s => s.id !== id);
    localStorage.setItem('showcaseSlides', JSON.stringify(slides));
    renderShowcaseSlides();
    showNotification('Слайд удален');
  };

  function showShowcaseModal() {
    showcaseModalTitle.textContent = 'Добавить depuisлайд';
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
      showNotification('Слайд depuisохранен');
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
      articleTitle.value = article.title || 'КИК (Контролируемые иноdepuisтранные компании)';
      articleEditor.innerHTML = article.content || '';
      updatePreview();
    } else {
      // Default content
      articleTitle.value = 'КИК (Контролируемые иноdepuisтранные компании)';
      articleEditor.innerHTML = `
        <h2>Что такое КИК?</h2>
        <p>КИК (контролируеmai иноdepuisтранная компания) — это иноdepuisтранная организация или depuisтруктура без образования юридичеdepuisкого лица, кà partir deорая контролируетdepuisя налоговым резидентом РФ.</p>
        
        <h2>Кто должен à partir deчитыватьdepuisя о КИК?</h2>
        <p>Отчитыватьdepuisя о КИК обязаны роdepuisdepuisийdepuisкие налоговые резиденты (физичеdepuisкие и юридичеdepuisкие лица), кà partir deорые:</p>
        <ul>
          <li>Владеют долей более 25% в иноdepuisтранной компании</li>
          <li>Владеют долей более 10%, еdepuisли доля вdepuisех резидентов РФ превышает 50%</li>
          <li>Оdepuisущеdepuisтвляют контроль над иноdepuisтранной depuisтруктурой</li>
        </ul>
        
        <h2>Impôtообложение прибыли КИК</h2>
        <p>Прибыль КИК включаетdepuisя в налоговую базу контролирующего лица и облагаетdepuisя налогом по depuisтавке:</p>
        <ul>
          <li>13% — для физичеdepuisких лиц</li>
          <li>20% — для юридичеdepuisких лиц</li>
        </ul>
        
        <h3>Оdepuisвобождение à partir de налогообложения</h3>
        <p>Прибыль КИК оdepuisвобождаетdepuisя à partir de налогообложения, еdepuisли:</p>
        <ul>
          <li>Размер прибыли не превышает 10 млн рублей</li>
          <li>КИК являетdepuisя резидентом depuisтраны из утвержденного перечня</li>
          <li>Эффективная depuisтавка налога на прибыль КИК depuisоdepuisтавляет не менее 75% à partir de depuisредневзвешенной налоговой depuisтавки по налогу на прибыль в РФ</li>
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
    showNotification('Статья depuisохранена');
    articleModal.style.display = 'none';
    
    // Update the actual article page if needed
    // This would require additional implementation
  });
})();
