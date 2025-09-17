// Banks page functionality
(function() {
  const isEnglish = (document.documentElement.getAttribute('lang') || '').toLowerCase() === 'en';
  const isFrench = (document.documentElement.getAttribute('lang') || '').toLowerCase() === 'fr';
  // Banks data
  const banksData = [
    {
      id: 'swiss-cim',
      country: 'Switzerland',
      countryFr: 'Suisse',
      countryCode: 'switzerland',
      flag: '🇨🇭',
      bank: 'CIM Banque',
      type: 'traditional',
      typeText: 'Traditional',
      typeTextFr: 'Banque traditionnelle',
      remote: false,
      time: '10-14 days',
      timeFr: '10-14 jours',
      minimum: '$5,000',
      features: 'Multi-currency accounts, investments, premium service',
      featuresFr: 'Comptes multidevises, investissements, service premium'
    },
    {
      id: 'singapore-dbs',
      country: 'Singapore',
      countryFr: 'Singapour',
      countryCode: 'singapore',
      flag: '🇸🇬',
      bank: 'DBS Bank',
      type: 'traditional',
      typeText: 'Traditional',
      typeTextFr: 'Banque traditionnelle',
      remote: false,
      time: '7-10 days',
      timeFr: '7-10 jours',
      minimum: '$30,000',
      features: 'Asian hub, excellent reputation, online banking',
      featuresFr: 'Hub asiatique, excellente réputation, banque en ligne'
    },
    {
      id: 'uk-revolut',
      country: 'United Kingdom',
      countryFr: 'Royaume-Uni',
      countryCode: 'uk',
      flag: '🇬🇧',
      bank: 'Revolut Business',
      type: 'digital',
      typeText: 'Digital bank',
      typeTextFr: 'Banque numérique',
      remote: true,
      time: '1-3 days',
      timeFr: '1-3 jours',
      minimum: '€0',
      features: 'Fast opening, multi-currency, business API',
      featuresFr: 'Ouverture rapide, multidevise, API business'
    },
    {
      id: 'cyprus-bank',
      country: 'Cyprus',
      countryCode: 'cyprus',
      flag: '🇨🇾',
      bank: 'Bank of Cyprus',
      type: 'traditional',
      typeText: 'Traditional',
      remote: false,
      time: '5-7 days',
      minimum: '€1,000',
      features: 'EU accounts, suitable for holdings'
    },
    {
      id: 'hongkong-hsbc',
      country: 'Hong Kong',
      countryCode: 'hongkong',
      flag: '🇭🇰',
      bank: 'HSBC Hong Kong',
      type: 'traditional',
      typeText: 'Traditional',
      remote: false,
      time: '14-21 days',
      minimum: 'HKD 50,000',
      features: 'Access to Asian markets, prestige, financement du commerce'
    },
    {
      id: 'uae-rakbank',
      country: 'UAE',
      countryCode: 'uae',
      flag: '🇦🇪',
      bank: 'RAKBANK',
      type: 'traditional',
      typeText: 'Traditional',
      remote: false,
      time: '7-10 days',
      minimum: 'AED 25,000',
      features: 'Islamic banking, 0% taxes, resident visa'
    },
    {
      id: 'georgia-tbc',
      country: 'Georgia',
      countryCode: 'georgia',
      flag: '🇬🇪',
      bank: 'TBC Bank',
      type: 'traditional',
      typeText: 'Traditional',
      remote: true,
      time: '3-5 days',
      minimum: '$0',
      features: 'Easy opening, low fees'
    },
    {
      id: 'armenia-ameriabank',
      country: 'Armenia',
      countryCode: 'armenia',
      flag: '🇦🇲',
      bank: 'Ameriabank',
      type: 'traditional',
      typeText: 'Traditional',
      remote: true,
      time: '3-5 days',
      minimum: '$0',
      features: 'Remote opening, low requirements'
    },
    {
      id: 'uk-wise',
      country: 'United Kingdom',
      countryCode: 'uk',
      flag: '🇬🇧',
      bank: 'Wise Business',
      type: 'emi',
      typeText: 'EMI',
      remote: true,
      time: '1-2 days',
      minimum: '€0',
      features: 'Multi-currency, low fees, API integration'
    },
    {
      id: 'singapore-aspire',
      country: 'Singapore',
      countryCode: 'singapore',
      flag: '🇸🇬',
      bank: 'Aspire',
      type: 'digital',
      typeText: 'Digital bank',
      remote: true,
      time: '1-3 days',
      minimum: '$0',
      features: 'For startups, corporate cards, expense management'
    },
    {
      id: 'swiss-sygnum',
      country: 'Switzerland',
      countryCode: 'switzerland',
      flag: '🇨🇭',
      bank: 'Sygnum Bank',
      type: 'crypto',
      typeText: 'Crypto-friendly',
      remote: false,
      time: '14-21 days',
      minimum: 'CHF 50,000',
      features: 'Digital assets, DeFi, traditional banking + crypto'
    },
    {
      id: 'uk-bankera',
      country: 'Lithuania',
      countryCode: 'uk',
      flag: '🇱🇹',
      bank: 'Bankera',
      type: 'emi',
      typeText: 'EMI',
      remote: true,
      time: '5-7 jours',
      minimum: '€0',
      features: 'Crypto-френдли, Comptes IBAN, SEPA/SWIFT'
    }
  ];

  // Get banks data from localStorage or use default
  // For EN pages ignore localStorage (it contains RU data from admin) and use EN dataset
  let banks = isEnglish ? banksData : (JSON.parse(localStorage.getItem('banksData')) || banksData);
  
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
            <span>${isFrench && bank.countryFr ? bank.countryFr : bank.country}</span>
          </div>
        </td>
        <td>
          <div class="bank-name">${bank.bank}</div>
        </td>
        <td>
          <span class="bank-type ${bank.type}">${isFrench && bank.typeTextFr ? bank.typeTextFr : bank.typeText}</span>
        </td>
        <td>
          ${bank.remote 
            ? `<span class="bank-remote">✓ ${isFrench ? 'À distance' : 'Remote'}</span>` 
            : `<span class="bank-visit">✈ ${isFrench ? 'Avec visite' : 'With visit'}</span>`
          }
        </td>
        <td>${isFrench && bank.timeFr ? bank.timeFr : bank.time}</td>
        <td>${bank.minimum}</td>
        <td>
          <button class="bank-cta" onclick="openBankModal('${bank.id}')">
            ${isFrench ? 'Commander' : 'Order'}
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
  
  // Bank Modal functionality
  const bankModal = document.getElementById('bank-modal');
  const bankModalClose = document.getElementById('bank-modal-close');
  const bankModalFlag = document.getElementById('bank-modal-flag');
  const bankModalTitle = document.getElementById('bank-modal-title');
  const bankModalSubtitle = document.getElementById('bank-modal-subtitle');
  const bankInput = document.getElementById('bank-input');
  const bankFormSubject = document.getElementById('bank-form-subject');
  const bankForm = document.getElementById('bank-form');
  const bankFormSuccess = document.getElementById('bank-form-success');

  // Open bank modal function
  window.openBankModal = (bankId) => {
    const bank = banks.find(b => b.id === bankId);
    if (!bank) return;

    if (!bankModal) {
      console.error('Bank modal not found!');
      return;
    }

    bankModalFlag.textContent = bank.flag;
    const countryName = isFrench && bank.countryFr ? bank.countryFr : bank.country;
    
    if (isEnglish) {
      bankModalTitle.textContent = `Open an account at ${bank.bank}`;
      bankModalSubtitle.textContent = `Fill the form to get a consultation on opening an account at ${bank.bank} (${bank.country})`;
      bankFormSubject.value = `Bank account opening request at ${bank.bank} (${bank.country})`;
    } else if (isFrench) {
      bankModalTitle.textContent = `Ouvrir un compte chez ${bank.bank}`;
      bankModalSubtitle.textContent = `Remplissez le formulaire pour obtenir une consultation sur l'ouverture d'un compte chez ${bank.bank} (${countryName})`;
      bankFormSubject.value = `Demande d'ouverture de compte chez ${bank.bank} (${countryName})`;
    } else {
      bankModalTitle.textContent = `Открытие счета в ${bank.bank}`;
      bankModalSubtitle.textContent = `Заполните форму и получите консультацию по открытию счета в ${bank.bank} (${bank.country})`;
      bankFormSubject.value = `Заказ открытия счета в ${bank.bank} (${bank.country})`;
    }
    bankInput.value = `${bank.bank} (${bank.country})`;
    
    bankModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close bank modal function
  function closeBankModal() {
    bankModal.classList.remove('active');
    document.body.style.overflow = '';
    // Reset form
    bankForm.reset();
    bankForm.style.display = 'flex';
    bankFormSuccess.style.display = 'none';
  }

  // Event listeners for bank modal
  bankModalClose?.addEventListener('click', closeBankModal);
  bankModal?.addEventListener('click', (e) => {
    if (e.target === bankModal) closeBankModal();
  });

  // Bank form submission
  bankForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(bankForm);
    
    try {
      // Send to Telegram
      const telegramSent = await window.sendBankToTelegram(formData);
      
      if (telegramSent) {
        bankForm.style.display = 'none';
        bankFormSuccess.style.display = 'block';
        
        // Auto close after 3 seconds
        setTimeout(() => {
          closeBankModal();
        }, 3000);
      } else {
        throw new Error('Failed to send to Telegram');
      }
    } catch (error) {
      console.error('Bank form submission error:', error);
      alert(isEnglish ? 'An error occurred while submitting the form. Please try again or contact us directly.' : 'Произошла ошибка при à partir deправке формы. Пожалуйdepuisта, попробуйте еще раз или depuisвяжитеdepuisь depuis нами напрямую.');
    }
  });

  // Escape key to close bank modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bankModal.classList.contains('active')) {
      closeBankModal();
    }
  });

  // Export functions for admin panel
  window.getBanksData = () => banks;
  window.setBanksData = (newBanks) => {
    banks = newBanks;
    localStorage.setItem('banksData', JSON.stringify(banks));
    renderBanks();
  };
})();
