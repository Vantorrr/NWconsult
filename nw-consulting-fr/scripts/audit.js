// Audit page functionality

// Load audit data from server
(async function() {
  try {
    const res = await fetch('/api/save-data?lang=ru', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.auditCountries)) {
        localStorage.setItem('auditData', JSON.stringify(data.auditCountries));
      }
    }
  } catch (e) {}
})();

// Simple dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const countrySelect = document.getElementById('country-select');
  if (countrySelect) {
    countrySelect.addEventListener('change', function() {
      const selectedCountry = this.value;
      if (selectedCountry) {
        // Redirect to the country audit page
        window.location.href = `./articles/audit-${selectedCountry}.html`;
      }
    });
  }
});

// Get countries data from registration
function getCountriesData() {
  // Try to get from localStorage first
  const savedData = localStorage.getItem('auditData');
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error('Error parsing audit data:', e);
    }
  }
  
  // Default countries if no data saved
  return [
    {
      id: 'cyprus',
      name: 'Кипр',
      flag: '🇨🇾',
      region: 'europe',
      regionText: 'Европа',
      taxRate: '12.5%',
      auditRequired: 'Обязательный ежегодный',
      reportingStandards: 'МСФО',
      specialFeatures: 'Налоговые льготы для холдингов'
    },
    {
      id: 'malta',
      name: 'Мальта',
      flag: '🇲🇹',
      region: 'europe',
      regionText: 'Европа',
      taxRate: '35%',
      auditRequired: 'Для крупных компаний',
      reportingStandards: 'МСФО',
      specialFeatures: 'Возврат налогов акционерам'
    },
    {
      id: 'singapore',
      name: 'Сингапур',
      flag: '🇸🇬',
      region: 'asia',
      regionText: 'Азия',
      taxRate: '17%',
      auditRequired: 'По размеру компании',
      reportingStandards: 'SFRS',
      specialFeatures: 'Территориальная система налогообложения'
    },
    {
      id: 'hongkong',
      name: 'Гонконг',
      flag: '🇭🇰',
      region: 'asia',
      regionText: 'Азия',
      taxRate: '16.5%',
      auditRequired: 'Обязательный',
      reportingStandards: 'HKFRS',
      specialFeatures: 'Налог только на местный доход'
    },
    {
      id: 'uae',
      name: 'ОАЭ',
      flag: '🇦🇪',
      region: 'asia',
      regionText: 'Ближний Восток',
      taxRate: '0-9%',
      auditRequired: 'В свободных зонах - нет',
      reportingStandards: 'IFRS',
      specialFeatures: 'Корпоративный налог с 2023'
    },
    {
      id: 'uk',
      name: 'Великобритания',
      flag: '🇬🇧',
      region: 'europe',
      regionText: 'Европа',
      taxRate: '19-25%',
      auditRequired: 'По размеру компании',
      reportingStandards: 'UK GAAP',
      specialFeatures: 'Прозрачная юрисдикция'
    },
    {
      id: 'estonia',
      name: 'Эстония',
      flag: '🇪🇪',
      region: 'europe',
      regionText: 'Европа',
      taxRate: '20%',
      auditRequired: 'По размеру компании',
      reportingStandards: 'МСФО',
      specialFeatures: 'Налог только при выводе прибыли'
    },
    {
      id: 'switzerland',
      name: 'Швейцария',
      flag: '🇨🇭',
      region: 'europe',
      regionText: 'Европа',
      taxRate: '12-21%',
      auditRequired: 'Обязательный',
      reportingStandards: 'Swiss GAAP',
      specialFeatures: 'Кантональные льготы'
    }
  ];
}

// Render countries grid
function renderCountries(countries) {
  const grid = document.getElementById('countries-grid');
  console.log('Grid element:', grid);
  console.log('Countries to render:', countries);
  
  if (!grid) {
    console.error('Countries grid element not found!');
    return;
  }
  
  if (!countries || countries.length === 0) {
    console.error('No countries to render!');
    grid.innerHTML = '<p style="color: #fff; text-align: center;">Нет доступных стран для отображения</p>';
    return;
  }
  
  grid.innerHTML = countries.map(country => {
    const countryId = country.id || country.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return `
    <a href="./articles/audit-${countryId}.html" class="country-card">
      <div class="country-card__header">
        <span class="country-card__flag">${country.flag}</span>
        <div class="country-card__info">
          <h3>${country.name}</h3>
          <span class="country-card__region">${country.regionText || country.region}</span>
        </div>
      </div>
      <div class="country-card__details">
        <div class="country-card__detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>Налог: ${country.taxRate || country.tax || 'По запросу'}</span>
        </div>
        <div class="country-card__detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>${country.auditRequired || 'Аудит обязателен'}</span>
        </div>
        <div class="country-card__detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span>${country.standards || country.reportingStandards || 'Международные стандарты'}</span>
        </div>
      </div>
      <div class="country-card__cta">
        <span>Подробнее об аудите</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </a>
  `}).join('');
}

// Filter countries
function filterCountries() {
  const searchInput = document.getElementById('search');
  const regionSelect = document.getElementById('region');
  const typeSelect = document.getElementById('type');
  
  let countries = getCountriesData();
  
  // Search filter
  if (searchInput && searchInput.value) {
    const search = searchInput.value.toLowerCase();
    countries = countries.filter(c => 
      c.name.toLowerCase().includes(search) ||
      (c.regionText && c.regionText.toLowerCase().includes(search))
    );
  }
  
  // Region filter
  if (regionSelect && regionSelect.value) {
    countries = countries.filter(c => c.region === regionSelect.value);
  }
  
  // Type filter (for future use)
  if (typeSelect && typeSelect.value) {
    // Can add audit type filtering here
  }
  
  renderCountries(countries);
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuditPage);
} else {
  initializeAuditPage();
}

function initializeAuditPage() {
  console.log('Initializing audit page...');
  
  // Load and render countries
  const countries = getCountriesData();
  console.log('Loaded countries:', countries);
  renderCountries(countries);
  
  // Set up filters
  const searchInput = document.getElementById('search');
  const regionSelect = document.getElementById('region');
  const typeSelect = document.getElementById('type');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterCountries);
  }
  
  if (regionSelect) {
    regionSelect.addEventListener('change', filterCountries);
  }
  
  if (typeSelect) {
    typeSelect.addEventListener('change', filterCountries);
  }
  
  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements
  const elementsToAnimate = document.querySelectorAll('.country-card, .process-step, .service-card');
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}