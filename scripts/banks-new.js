// Banks page functionality
(function() {
  // Banks data
  const banksData = [
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
      time: '7-10 дней',
      minimum: '$30,000',
      features: 'Азиатский хаб, отличная репутация, онлайн-банкинг'
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
      time: '1-3 дня',
      minimum: '€0',
      features: 'Быстрое открытие, мультивалюта, API для бизнеса'
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
      minimum: '€1,000',
      features: 'EU счета, подходит для холдингов, русскоязычная поддержка'
    },
    {
      id: 'hongkong-hsbc',
      country: 'Гонконг',
      countryCode: 'hongkong',
      flag: '🇭🇰',
      bank: 'HSBC Hong Kong',
      type: 'traditional',
      typeText: 'Традиционный',
      remote: false,
      time: '14-21 день',
      minimum: 'HKD 50,000',
      features: 'Доступ к азиатским рынкам, престиж, trade finance'
    },
    {
      id: 'uae-rakbank',
      country: 'ОАЭ',
      countryCode: 'uae',
      flag: '🇦🇪',
      bank: 'RAKBANK',
      type: 'traditional',
      typeText: 'Традиционный',
      remote: false,
      time: '7-10 дней',
      minimum: 'AED 25,000',
      features: 'Исламский банкинг, 0% налогов, резидентская виза'
    },
    {
      id: 'georgia-tbc',
      country: 'Грузия',
      countryCode: 'georgia',
      flag: '🇬🇪',
      bank: 'TBC Bank',
      type: 'traditional',
      typeText: 'Традиционный',
      remote: true,
      time: '3-5 дней',
      minimum: '$0',
      features: 'Простое открытие, низкие комиссии, русскоязычная поддержка'
    },
    {
      id: 'armenia-ameriabank',
      country: 'Армения',
      countryCode: 'armenia',
      flag: '🇦🇲',
      bank: 'Ameriabank',
      type: 'traditional',
      typeText: 'Традиционный',
      remote: true,
      time: '3-5 дней',
      minimum: '$0',
      features: 'Удалённое открытие, CIS-friendly, низкие требования'
    },
    {
      id: 'uk-wise',
      country: 'Великобритания',
      countryCode: 'uk',
      flag: '🇬🇧',
      bank: 'Wise Business',
      type: 'emi',
      typeText: 'EMI',
      remote: true,
      time: '1-2 дня',
      minimum: '€0',
      features: 'Мультивалюта, низкие комиссии, API интеграция'
    },
    {
      id: 'singapore-aspire',
      country: 'Сингапур',
      countryCode: 'singapore',
      flag: '🇸🇬',
      bank: 'Aspire',
      type: 'digital',
      typeText: 'Цифровой банк',
      remote: true,
      time: '1-3 дня',
      minimum: '$0',
      features: 'Для стартапов, корпоративные карты, expense management'
    },
    {
      id: 'swiss-sygnum',
      country: 'Швейцария',
      countryCode: 'switzerland',
      flag: '🇨🇭',
      bank: 'Sygnum Bank',
      type: 'crypto',
      typeText: 'Крипто-френдли',
      remote: false,
      time: '14-21 день',
      minimum: 'CHF 50,000',
      features: 'Цифровые активы, DeFi, традиционный банкинг + крипто'
    },
    {
      id: 'uk-bankera',
      country: 'Литва',
      countryCode: 'uk',
      flag: '🇱🇹',
      bank: 'Bankera',
      type: 'emi',
      typeText: 'EMI',
      remote: true,
      time: '5-7 дней',
      minimum: '€0',
      features: 'Крипто-френдли, IBAN счета, SEPA/SWIFT'
    }
  ];

  // Get banks data from localStorage or use default
  let banks = JSON.parse(localStorage.getItem('banksData')) || banksData;
  
  // DOM elements
  const banksTbody = document.getElementById('banks-tbody');
  const searchInput = document.getElementById('bank-search');
  const countryFilter = document.getElementById('country-filter');
  const typeFilter = document.getElementById('type-filter');
  const remoteFilter = document.getElementById('remote-filter');
  const resetBtn = document.getElementById('reset-filters');
  const sortableHeaders = document.querySelectorAll('.sortable');
  
  // Current sort
  let currentSort = { field: null, direction: 'asc' };
  
  // Render banks table
  function renderBanks(data = banks) {
    if (!banksTbody) return;
    
    banksTbody.innerHTML = data.map(bank => `
      <tr>
        <td>
          <div class="bank-country">
            <span class="bank-flag">${bank.flag}</span>
            <span>${bank.country}</span>
          </div>
        </td>
        <td>
          <div class="bank-name">${bank.bank}</div>
        </td>
        <td>
          <span class="bank-type ${bank.type}">${bank.typeText}</span>
        </td>
        <td>
          ${bank.remote 
            ? '<span class="bank-remote">✓ Удалённо</span>' 
            : '<span class="bank-visit">✈ С визитом</span>'
          }
        </td>
        <td>${bank.time}</td>
        <td>${bank.minimum}</td>
        <td>
          <button class="bank-cta" onclick="window.location.href='./kontakty.html#form'">
            Заказать
          </button>
        </td>
      </tr>
    `).join('');
  }
  
  // Filter banks
  function filterBanks() {
    let filtered = [...banks];
    
    // Search filter
    const searchTerm = searchInput?.value.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.bank.toLowerCase().includes(searchTerm) ||
        b.country.toLowerCase().includes(searchTerm) ||
        b.features.toLowerCase().includes(searchTerm)
      );
    }
    
    // Country filter
    const country = countryFilter?.value || '';
    if (country) {
      filtered = filtered.filter(b => b.countryCode === country);
    }
    
    // Type filter
    const type = typeFilter?.value || '';
    if (type) {
      filtered = filtered.filter(b => b.type === type);
    }
    
    // Remote filter
    const remote = remoteFilter?.value || '';
    if (remote === 'remote') {
      filtered = filtered.filter(b => b.remote === true);
    } else if (remote === 'visit') {
      filtered = filtered.filter(b => b.remote === false);
    }
    
    // Apply current sort
    if (currentSort.field) {
      sortBanks(filtered, currentSort.field, currentSort.direction);
    }
    
    renderBanks(filtered);
  }
  
  // Sort banks
  function sortBanks(data, field, direction = 'asc') {
    data.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      // Handle numeric values
      if (field === 'minimum') {
        aVal = parseInt(aVal.replace(/[^0-9]/g, '')) || 0;
        bVal = parseInt(bVal.replace(/[^0-9]/g, '')) || 0;
      }
      
      // Handle time values
      if (field === 'time') {
        aVal = parseInt(aVal.match(/\d+/)?.[0]) || 0;
        bVal = parseInt(bVal.match(/\d+/)?.[0]) || 0;
      }
      
      // Compare
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  // Sort click handler
  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const field = header.getAttribute('data-sort');
      
      // Update direction
      if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
      }
      
      // Update UI
      sortableHeaders.forEach(h => h.classList.remove('sorted'));
      header.classList.add('sorted');
      
      // Filter and render
      filterBanks();
    });
  });
  
  // Event listeners
  searchInput?.addEventListener('input', filterBanks);
  countryFilter?.addEventListener('change', filterBanks);
  typeFilter?.addEventListener('change', filterBanks);
  remoteFilter?.addEventListener('change', filterBanks);
  
  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (countryFilter) countryFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (remoteFilter) remoteFilter.value = '';
    currentSort = { field: null, direction: 'asc' };
    sortableHeaders.forEach(h => h.classList.remove('sorted'));
    renderBanks();
  });
  
  // Initial render
  renderBanks();
  
  // Export functions for admin panel
  window.getBanksData = () => banks;
  window.setBanksData = (newBanks) => {
    banks = newBanks;
    localStorage.setItem('banksData', JSON.stringify(banks));
    renderBanks();
  };
})();
