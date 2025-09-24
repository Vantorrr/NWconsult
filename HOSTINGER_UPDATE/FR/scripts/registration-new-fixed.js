// Registration page functionality - FIXED VERSION
(function() {
  const isEnglish = (document.documentElement.getAttribute('lang') || '').toLowerCase() === 'en';
  
  // Default countries data
  const defaultCountries = [
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
    },
    { 
      id: 'singapore',
      name: 'Сингапур',
      flag: '🇸🇬',
      region: 'asia',
      time: '5-7 дней',
      price: 3000,
      priceText: '$3,000',
      features: ['Азиатский хаб', 'Стабильность', 'Банки']
    },
    { 
      id: 'hongkong',
      name: 'Гонконг',
      flag: '🇭🇰',
      region: 'asia',
      time: '7-14 дней',
      price: 3500,
      priceText: '$3,500',
      features: ['Доступ к Китаю', 'Низкие налоги', 'Престиж']
    },
    { 
      id: 'uae',
      name: 'ОАЭ',
      flag: '🇦🇪',
      region: 'asia',
      time: '7-10 дней',
      price: 4000,
      priceText: '$4,000',
      features: ['0% налогов', 'Резидентская виза', 'Банки']
    }
  ];

  // English translations
  const enT = {
    cyprus: { name: 'Cyprus', time: '7-10 days', features: ['EU company', 'Low taxes', 'Prestige'] },
    uk: { name: 'United Kingdom', time: '3-5 days', features: ['Fast registration', 'World prestige', 'Banks'] },
    estonia: { name: 'Estonia', time: '1-3 days', features: ['E-Residency', 'Online management', 'EU company'] },
    singapore: { name: 'Singapore', time: '5-7 days', features: ['Asian hub', 'Stability', 'Banks'] },
    hongkong: { name: 'Hong Kong', time: '7-14 days', features: ['Access to China', 'Low taxes', 'Prestige'] },
    uae: { name: 'UAE', time: '7-10 days', features: ['0% taxes', 'Residency visa', 'Banks'] }
  };

  // Загружаем данные
  let countries = [];
  
  function loadCountriesData() {
    try {
      if (isEnglish) {
        // Для английской версии используем дефолтные данные
        countries = defaultCountries;
      } else {
        // Для других версий пробуем загрузить из localStorage
        const storedData = localStorage.getItem('registrationCountries');
        
        if (storedData) {
          const parsed = JSON.parse(storedData);
          
          // Проверяем валидность данных
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Проверяем структуру первого элемента
            const isValid = parsed[0].name && 
                          (parsed[0].flag || parsed[0].flag === '') && 
                          (parsed[0].region || parsed[0].region === '');
            
            if (isValid) {
              countries = parsed;
              console.log('Loaded', countries.length, 'countries from localStorage');
            } else {
              console.warn('Invalid data structure in localStorage, using defaults');
              countries = defaultCountries;
            }
          } else {
            console.warn('Empty or invalid data in localStorage, using defaults');
            countries = defaultCountries;
          }
        } else {
          // Нет данных в localStorage - используем дефолтные
          countries = defaultCountries;
        }
      }
    } catch (e) {
      console.error('Error loading countries:', e);
      countries = defaultCountries;
    }
  }

  // Загружаем данные при старте
  loadCountriesData();
  
  // DOM elements
  const countriesGrid = document.getElementById('countries-grid');
  const searchInput = document.getElementById('country-search');
  const regionFilter = document.getElementById('region-filter');
  const resetBtn = document.getElementById('reset-filters');

  // Render countries
  function renderCountries(data = countries) {
    if (!countriesGrid) {
      console.error('Countries grid not found');
      return;
    }
    
    // Проверяем что есть данные
    if (!data || !Array.isArray(data) || data.length === 0) {
      countriesGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Нет стран для отображения. Пожалуйста, добавьте страны в админ панели.</p>';
      return;
    }
    
    // Фильтруем невалидные записи и рендерим
    const validCountries = data.filter(country => country && country.name);
    
    if (validCountries.length === 0) {
      countriesGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Нет валидных данных для отображения.</p>';
      return;
    }
    
    countriesGrid.innerHTML = validCountries.map((country, index) => {
      const display = isEnglish && enT[country.id] ? { ...country, ...enT[country.id] } : country;
      
      // Безопасное получение данных
      const countryId = country.id || `country-${index}`;
      const flag = country.flag || '🏳️';
      const name = display.name || 'Unnamed';
      const time = display.time || 'N/A';
      const priceText = display.priceText || country.priceText || (country.price ? `$${country.price}` : 'Contact us');
      const features = display.features || country.features || [];
      
      return `
      <div class="country-card" data-country-id="${countryId}" style="animation-delay: ${index * 0.1}s">
        <div class="country-flag">${flag}</div>
        <h3 class="country-name">${name}</h3>
        
        <div class="country-info">
          <div class="country-info-item">
            <span class="country-info-label">${isEnglish ? 'Registration time:' : 'Срок регистрации:'}</span>
            <span class="country-info-value">${time}</span>
          </div>
          ${features.length > 0 ? `
            <div class="country-info-item">
              <span class="country-info-label">${isEnglish ? 'Advantages:' : 'Преимущества:'}</span>
            </div>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: rgba(255,255,255,0.8); font-size: 14px;">
              ${features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        
        <div class="country-price">${isEnglish ? 'from ' : 'от '} ${priceText}</div>
        
        <button class="country-cta" onclick="openRegistrationModal('${countryId}')">
          ${isEnglish ? 'Order registration' : 'Заказать регистрацию'}
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
        c.name && c.name.toLowerCase().includes(searchTerm)
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

  // Open modal function
  window.openRegistrationModal = (countryId) => {
    const country = countries.find(c => (c.id || `country-${countries.indexOf(c)}`) === countryId);
    if (!country) {
      console.error('Country not found:', countryId);
      return;
    }

    if (!modal) {
      console.error('Modal not found!');
      return;
    }

    modalFlag.textContent = country.flag || '🏳️';
    const displayName = isEnglish && enT[country.id]?.name ? enT[country.id].name : country.name;
    
    if (isEnglish) {
      modalTitle.textContent = `Company registration in ${displayName}`;
      modalSubtitle.textContent = `Fill the form to get a consultation on registering in ${displayName}`;
      formSubject.value = `Company registration request in ${displayName}`;
    } else {
      modalTitle.textContent = `Регистрация компании в ${displayName}`;
      modalSubtitle.textContent = `Заполните форму и получите консультацию по регистрации в ${displayName}`;
      formSubject.value = `Заказ регистрации компании в ${displayName}`;
    }
    
    countryInput.value = displayName;
    modal.classList.add('active');
  };

  // Close modal
  modalClose?.addEventListener('click', () => modal.classList.remove('active'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Form submission
  registrationForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registrationForm);
    const data = {
      service: 'registration',
      country: formData.get('country'),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    };

    try {
      await sendToTelegram(data);
      
      registrationForm.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.innerHTML = isEnglish ? 
        '<p>✅ Thank you! We will contact you within 15 minutes.</p>' :
        '<p>✅ Спасибо! Мы свяжемся с вами в течение 15 минут.</p>';
      
      setTimeout(() => {
        modal.classList.remove('active');
        registrationForm.style.display = 'block';
        formSuccess.style.display = 'none';
        registrationForm.reset();
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      alert(isEnglish ? 'Error sending form. Please try again.' : 'Ошибка отправки формы. Попробуйте еще раз.');
    }
  });

  // Для отладки - выводим количество загруженных стран
  console.log('Registration page loaded. Countries:', countries.length);
})();
