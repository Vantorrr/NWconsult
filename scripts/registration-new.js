// Registration page functionality
(function() {
  // Countries data with proper structure
  const countriesData = [
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
    },
    { 
      id: 'usa',
      name: 'США (Delaware)',
      flag: '🇺🇸',
      region: 'america',
      time: '1-2 дня',
      price: 1000,
      priceText: '$1,000',
      features: ['Быстро', 'Анонимность', 'Гибкость']
    },
    { 
      id: 'marshall',
      name: 'Маршалловы острова',
      flag: '🇲🇭',
      region: 'offshore',
      time: '3-5 дней',
      price: 1800,
      priceText: '$1,800',
      features: ['Оффшор', 'Конфиденциальность', '0% налогов']
    },
    { 
      id: 'bvi',
      name: 'Британские Виргинские острова',
      flag: '🇻🇬',
      region: 'offshore',
      time: '5-7 дней',
      price: 2200,
      priceText: '$2,200',
      features: ['Классический оффшор', 'Конфиденциальность', 'Гибкость']
    },
    { 
      id: 'seychelles',
      name: 'Сейшельские острова',
      flag: '🇸🇨',
      region: 'offshore',
      time: '1-2 дня',
      price: 1500,
      priceText: '$1,500',
      features: ['Быстрая регистрация', '0% налогов', 'Простота']
    },
    { 
      id: 'malta',
      name: 'Мальта',
      flag: '🇲🇹',
      region: 'europe',
      time: '10-14 дней',
      price: 5000,
      priceText: '$5,000',
      features: ['EU компания', 'Игорный бизнес', 'Крипто']
    },
    { 
      id: 'switzerland',
      name: 'Швейцария',
      flag: '🇨🇭',
      region: 'europe',
      time: '14-21 день',
      price: 7500,
      priceText: '$7,500',
      features: ['Максимальный престиж', 'Банки', 'Стабильность']
    }
  ];

  // Get countries data from localStorage or use default
  let countries = JSON.parse(localStorage.getItem('registrationCountries')) || countriesData;
  
  // DOM elements
  const countriesGrid = document.getElementById('countries-grid');
  const searchInput = document.getElementById('country-search');
  const regionFilter = document.getElementById('region-filter');
  const resetBtn = document.getElementById('reset-filters');

  // Render countries
  function renderCountries(data = countries) {
    if (!countriesGrid) return;
    
    countriesGrid.innerHTML = data.map((country, index) => `
      <div class="country-card" data-country-id="${country.id}" style="animation-delay: ${index * 0.1}s">
        <div class="country-flag">${country.flag}</div>
        <h3 class="country-name">${country.name}</h3>
        
        <div class="country-info">
          <div class="country-info-item">
            <span class="country-info-label">Срок регистрации:</span>
            <span class="country-info-value">${country.time}</span>
          </div>
          ${country.features ? `
            <div class="country-info-item">
              <span class="country-info-label">Преимущества:</span>
            </div>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: rgba(255,255,255,0.8); font-size: 14px;">
              ${country.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        
        <div class="country-price">от ${country.priceText}</div>
        
        <button class="country-cta" onclick="openRegistrationModal('${country.id}')">
          Заказать регистрацию
        </button>
      </div>
    `).join('');
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
    modalTitle.textContent = `Регистрация компании в ${country.name}`;
    modalSubtitle.textContent = `Заполните форму и получите консультацию по регистрации в ${country.name}`;
    countryInput.value = country.name;
    formSubject.value = `Заказ регистрации компании в ${country.name}`;
    
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
      alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
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
