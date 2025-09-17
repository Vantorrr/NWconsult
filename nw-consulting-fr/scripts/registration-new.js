// Registration page functionality
(function() {
  const isEnglish = (document.documentElement.getAttribute('lang') || '').toLowerCase() === 'en';
  const isFrench = (document.documentElement.getAttribute('lang') || '').toLowerCase() === 'fr';
  // Countries data with proper structure
  const countriesData = [
    { 
      id: 'cyprus',
      name: 'Кипр',
      nameEn: 'Cyprus',
      nameFr: 'Chypre',
      flag: '🇨🇾',
      region: 'europe',
      time: '7-10 дней',
      timeEn: '7-10 days',
      timeFr: '7-10 jours',
      price: 2500,
      priceText: '$2,500',
      features: ['EU компания', 'Низкие налоги', 'Престиж'],
      featuresEn: ['EU company', 'Low taxes', 'Prestige'],
      featuresFr: ['Société UE', 'Faibles impôts', 'Prestige']
    },
    { 
      id: 'uk',
      name: 'Великобритания',
      nameEn: 'UK',
      nameFr: 'Royaume-Uni',
      flag: '🇬🇧',
      region: 'europe',
      time: '3-5 дней',
      timeEn: '3-5 days',
      timeFr: '3-5 jours',
      price: 1500,
      priceText: '$1,500',
      features: ['Быстрая регистрация', 'Мировой престиж', 'Банки'],
      featuresEn: ['Fast registration', 'Global prestige', 'Banks'],
      featuresFr: ['Enregistrement rapide', 'Prestige mondial', 'Banques']
    },
    { 
      id: 'estonia',
      name: 'Эстония',
      nameEn: 'Estonia',
      nameFr: 'Estonie',
      flag: '🇪🇪',
      region: 'europe',
      time: '1-3 дня',
      timeEn: '1-3 days',
      timeFr: '1-3 jours',
      price: 1200,
      priceText: '$1,200',
      features: ['E-Residency', 'Онлайн управление', 'EU компания'],
      featuresEn: ['E-Residency', 'Online management', 'EU company'],
      featuresFr: ['E-Residency', 'Gestion en ligne', 'Société UE']
    },
    { 
      id: 'singapore',
      name: 'Singapour',
      flag: '🇸🇬',
      region: 'asia',
      time: '5-7 jours',
      price: 3000,
      priceText: '$3,000',
      features: ['Hub asiatique', 'Stabilité', 'Banques']
    },
    { 
      id: 'hongkong',
      name: 'Hong Kong',
      flag: '🇭🇰',
      region: 'asia',
      time: '7-14 jours',
      price: 3500,
      priceText: '$3,500',
      features: ['Accès à la Chine', 'Faibles impôts', 'Prestige']
    },
    { 
      id: 'uae',
      name: 'ÉAU',
      flag: '🇦🇪',
      region: 'asia',
      time: '7-10 jours',
      price: 4000,
      priceText: '$4,000',
      features: ['0% d'impôts', 'Visa de résidence', 'Banques']
    },
    { 
      id: 'usa',
      name: 'États-Unis (Delaware)',
      flag: '🇺🇸',
      region: 'america',
      time: '1-2 jours',
      price: 1000,
      priceText: '$1,000',
      features: ['Rapide', 'Anonymat', 'Flexibilité']
    },
    { 
      id: 'marshall',
      name: 'Îles Marshall',
      flag: '🇲🇭',
      region: 'offshore',
      time: '3-5 jours',
      price: 1800,
      priceText: '$1,800',
      features: ['Offshore', 'Confidentialité', '0% d'impôts']
    },
    { 
      id: 'bvi',
      name: 'Îles Vierges britanniques',
      flag: '🇻🇬',
      region: 'offshore',
      time: '5-7 jours',
      price: 2200,
      priceText: '$2,200',
      features: ['Offshore classique', 'Confidentialité', 'Flexibilité']
    },
    { 
      id: 'seychelles',
      name: 'Seychelles',
      flag: '🇸🇨',
      region: 'offshore',
      time: '1-2 jours',
      price: 1500,
      priceText: '$1,500',
      features: ['Enregistrement rapide', '0% d'impôts', 'Проdepuisтà partir deа']
    },
    { 
      id: 'malta',
      name: 'Malte',
      flag: '🇲🇹',
      region: 'europe',
      time: '10-14 jours',
      price: 5000,
      priceText: '$5,000',
      features: ['Société UE', 'Jeux d'argent', 'Crypto']
    },
    { 
      id: 'switzerland',
      name: 'Suisse',
      flag: '🇨🇭',
      region: 'europe',
      time: '14-21 jour',
      price: 7500,
      priceText: '$7,500',
      features: ['Prestige maximal', 'Banques', 'Stabilité']
    }
  ];

  // English translations for display
  const enT = {
    cyprus: { name: 'Cyprus', time: '7-10 days', features: ['EU company', 'Low taxes', 'Prestige'] },
    uk: { name: 'United Kingdom', time: '3-5 days', features: ['Fast registration', 'Global prestige', 'Banks'] },
    estonia: { name: 'Estonia', time: '1-3 days', features: ['E-Residency', 'Online management', 'EU company'] },
    singapore: { name: 'Singapore', time: '5-7 days', features: ['Asian hub', 'Stability', 'Banks'] },
    hongkong: { name: 'Hong Kong', time: '7-14 days', features: ['Access to China', 'Low taxes', 'Prestige'] },
    uae: { name: 'UAE', time: '7-10 days', features: ['0% taxes', 'Residence visa', 'Banks'] },
    usa: { name: 'USA (Delaware)', time: '1-2 days', features: ['Fast', 'Privacy', 'Flexibility'] },
    marshall: { name: 'Marshall Islands', time: '3-5 days', features: ['Offshore', 'Confidentiality', '0% taxes'] },
    bvi: { name: 'British Virgin Islands', time: '5-7 days', features: ['Classic offshore', 'Confidentiality', 'Flexibility'] },
    seychelles: { name: 'Seychelles', time: '1-2 days', features: ['Fast registration', '0% taxes', 'Simplicity'] },
    malta: { name: 'Malta', time: '10-14 days', features: ['EU company', 'Gaming', 'Crypto'] },
    switzerland: { name: 'Switzerland', time: '14-21 days', features: ['Maximum prestige', 'Banks', 'Stability'] }
  };

  // Get countries data from localStorage or use default
  // For EN pages ignore RU data from localStorage
  let countries = isEnglish ? countriesData : (JSON.parse(localStorage.getItem('registrationCountries')) || countriesData);
  
  // DOM elements
  const countriesGrid = document.getElementById('countries-grid');
  const searchInput = document.getElementById('country-search');
  const regionFilter = document.getElementById('region-filter');
  const resetBtn = document.getElementById('reset-filters');

  // Render countries
  function renderCountries(data = countries) {
    if (!countriesGrid) return;
    
    countriesGrid.innerHTML = data.map((country, index) => {
      const display = isEnglish && enT[country.id] ? { ...country, ...enT[country.id] } : country;
      return `
      <div class="country-card" data-country-id="${country.id}" style="animation-delay: ${index * 0.1}s">
        <div class="country-flag">${country.flag}</div>
        <h3 class="country-name">${display.name}</h3>
        
        <div class="country-info">
          <div class="country-info-item">
            <span class="country-info-label">${isEnglish ? 'Registration time:' : 'Délai de création:'}</span>
            <span class="country-info-value">${display.time}</span>
          </div>
          ${display.features ? `
            <div class="country-info-item">
              <span class="country-info-label">${isEnglish ? 'Advantages:' : 'Avantages:'}</span>
            </div>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: rgba(255,255,255,0.8); font-size: 14px;">
              ${display.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        
        <div class="country-price">${isEnglish ? 'from ' : 'à partir de '} ${country.priceText}</div>
        
        <button class="country-cta" onclick="openRegistrationModal('${country.id}')">
          ${isEnglish ? 'Order registration' : 'Commander l'enregistrement'}
        </button>
      </div>
    `}).join('');
  }

  // Filter countries
  function filterCountries() {
    let filtered = [...countries];
    
    // Search filter
    const searchTerm = searchInput?.value.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Region filter
    const region = regionFilter?.value || '';
    if (region) {
      filtered = filtered.filter(c => c.region === region);
    }
    
    
    renderCountries(filtered);
  }

  // Event listeners
  searchInput?.addEventListener('input', filterCountries);
  regionFilter?.addEventListener('change', filterCountries);
  
  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (regionFilter) regionFilter.value = '';
    renderCountries();
  });

  // Initial render
  renderCountries();
  
  // Modal functionality
  const modal = document.getElementById('registration-modal');
  const modalClose = document.getElementById('modal-close');
  const modalFlag = document.getElementById('modal-flag');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const countryInput = document.getElementById('country-input');
  const formSubject = document.getElementById('form-subject');
  const registrationForm = document.getElementById('registration-form');
  const formSuccess = document.getElementById('form-success');
  
  // Debug check
  if (!modal) {
    console.error('Modal not found! Make sure the modal HTML is on the page.');
  }

  // Open modal function
  window.openRegistrationModal = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    if (!country) return;

    if (!modal) {
      console.error('Modal not found!');
      return;
    }

    modalFlag.textContent = country.flag;
    const displayName = isFrench && country.nameFr ? country.nameFr : (isEnglish && enT[country.id]?.name ? enT[country.id].name : country.name);
    if (isEnglish) {
      modalTitle.textContent = `Company registration in ${displayName}`;
      modalSubtitle.textContent = `Fill the form to get a consultation on registering in ${displayName}`;
      formSubject.value = `Company registration request in ${displayName}`;
    } else if (isFrench) {
      modalTitle.textContent = `Enregistrement de société - ${displayName}`;
      modalSubtitle.textContent = `Remplissez le formulaire pour obtenir une consultation sur l'enregistrement en ${displayName}`;
      formSubject.value = `Demande d'enregistrement de société en ${displayName}`;
    } else {
      modalTitle.textContent = `Регистрация компании в ${displayName}`;
      modalSubtitle.textContent = `Заполните форму и получите консультацию по регистрации в ${displayName}`;
      formSubject.value = `Заказ регистрации компании в ${displayName}`;
    }
    countryInput.value = displayName;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close modal function
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Reset form
    registrationForm.reset();
    registrationForm.style.display = 'flex';
    formSuccess.style.display = 'none';
  }

  // Event listeners for modal
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Form submission
  registrationForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registrationForm);
    
    try {
      // Send to Telegram
      const telegramSent = await window.sendRegistrationToTelegram(formData);
      
      if (telegramSent) {
        registrationForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Auto close after 3 seconds
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        throw new Error('Failed to send to Telegram');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(isEnglish ? 'An error occurred while submitting the form. Please try again or contact us directly.' : 'Произошла ошибка при à partir deправке формы. Пожалуйdepuisта, попробуйте еще раз или depuisвяжитеdepuisь depuis нами напрямую.');
    }
  });

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Export function for admin panel
  window.getRegistrationCountries = () => countries;
  window.setRegistrationCountries = (newCountries) => {
    countries = newCountries;
    localStorage.setItem('registrationCountries', JSON.stringify(countries));
    renderCountries();
  };
})();
