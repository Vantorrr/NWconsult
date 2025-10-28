// Registration page functionality - FIXED VERSION (RU)
(function() {
  const isEnglish = (document.documentElement.getAttribute('lang') || '').toLowerCase() === 'en';

  // Default countries data (fallback)
  const defaultCountries = [
    { id: 'cyprus', name: 'Кипр', flag: '🇨🇾', region: 'europe', time: '7-10 дней', price: 2500, priceText: '$2,500', features: ['EU компания', 'Низкие налоги', 'Престиж'] },
    { id: 'uk', name: 'Великобритания', flag: '🇬🇧', region: 'europe', time: '3-5 дней', price: 1500, priceText: '$1,500', features: ['Быстрая регистрация', 'Мировой престиж', 'Банки'] },
    { id: 'estonia', name: 'Эстония', flag: '🇪🇪', region: 'europe', time: '1-3 дня', price: 1200, priceText: '$1,200', features: ['E-Residency', 'Онлайн управление', 'EU компания'] },
    { id: 'singapore', name: 'Сингапур', flag: '🇸🇬', region: 'asia', time: '5-7 дней', price: 3000, priceText: '$3,000', features: ['Азиатский хаб', 'Стабильность', 'Банки'] },
    { id: 'hongkong', name: 'Гонконг', flag: '🇭🇰', region: 'asia', time: '7-14 дней', price: 3500, priceText: '$3,500', features: ['Доступ к Китаю', 'Низкие налоги', 'Престиж'] },
    { id: 'uae', name: 'ОАЭ', flag: '🇦🇪', region: 'asia', time: '7-10 дней', price: 4000, priceText: '$4,000', features: ['0% налогов', 'Резидентская виза', 'Банки'] }
  ];

  // Load countries from localStorage (RU), otherwise fallback
  let countries = [];
  try {
    const stored = localStorage.getItem('registrationCountries');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
        countries = parsed;
      } else {
        countries = defaultCountries;
      }
    } else {
      countries = defaultCountries;
    }
  } catch (e) {
    console.warn('registrationCountries corrupted, using defaults', e);
    countries = defaultCountries;
  }

  // DOM elements
  const countriesGrid = document.getElementById('countries-grid');
  const searchInput = document.getElementById('country-search');
  const regionFilter = document.getElementById('region-filter');
  const resetBtn = document.getElementById('reset-filters');
  const openPickerBtn = document.getElementById('open-country-picker');
  const pickerModal = document.getElementById('country-picker-modal');

  // Render countries
  function renderCountries(data = countries) {
    if (!countriesGrid) {
      return;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      countriesGrid.innerHTML = '<p style="text-align:center;color:#8899a6;padding:40px;">Нет стран для отображения. Добавьте страны в админ-панели.</p>';
      return;
    }

    const valid = data.filter(c => c && c.name);
    countriesGrid.innerHTML = valid.map((country, index) => {
      const priceText = country.priceText || (country.price ? `$${country.price}` : 'По запросу');
      const hasArticle = !!country.articleUrl;
      return `
      <div class="country-card" data-country-id="${country.id || `country-${index}`}" style="animation-delay: ${index * 0.1}s">
        <div class="country-flag">${country.flag || '🏳️'}</div>
        <h3 class="country-name">${country.name}</h3>
        <div class="country-info">
          <div class="country-info-item">
            <span class="country-info-label">Регион:</span>
            <span class="country-info-value">${getRegionName(country.region)}</span>
          </div>
          <div class="country-info-item">
            <span class="country-info-label">Срок регистрации:</span>
            <span class="country-info-value">${country.time || '—'}</span>
          </div>
          ${country.features && country.features.length ? `
            <div class="country-info-item">
              <span class="country-info-label">Преимущества:</span>
            </div>
            <ul style="margin:8px 0 0 0;padding-left:20px;color:rgba(255,255,255,0.8);font-size:14px;">
              ${country.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        <div class="country-price">от ${priceText}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="country-cta" onclick="openRegistrationModal('${country.id || `country-${index}`}')">Заказать</button>
          ${hasArticle ? `<button class=\"country-cta\" style=\"background:#2c3e50;\" onclick=\"openCountryArticle('${(country.articleUrl || '').replace(/'/g, '')}', '${(country.name || '').replace(/'/g, '')}')\">Подробнее</button>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function getRegionName(region) {
    const regionNames = {
      'europe': 'Европа',
      'asia': 'Азия', 
      'america': 'Америка',
      'oceania': 'Австралия и Океания',
      'africa': 'Африка',
      'offshore': 'Оффшоры'
    };
    return regionNames[region] || region || 'Не указан';
  }

  // Filter
  function filterCountries() {
    let filtered = [...countries];
    const term = (searchInput?.value || '').toLowerCase();
    if (term) filtered = filtered.filter(c => (c.name || '').toLowerCase().includes(term));
    const region = regionFilter?.value || '';
    if (region) filtered = filtered.filter(c => c.region === region);
    renderCountries(filtered);
  }

  // Filter by exact country id and render only that card
  function filterByCountryId(countryId) {
    if (!countryId) {
      renderCountries();
      return;
    }
    console.log('Filtering by countryId:', countryId);
    // Try to match by id first, then by generated id from name
    const match = (countries || []).find(c => {
      const cId = (c.id !== undefined && c.id !== null) ? String(c.id) : slugify(c.name);
      console.log('Checking country:', c.name, 'generated id:', cId, 'matches:', cId === countryId);
      return cId === countryId;
    });
    console.log('Found match:', match);
    if (searchInput) searchInput.value = '';
    if (regionFilter) regionFilter.value = '';
    if (match) {
      renderCountries([match]);
      try { countriesGrid?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
    } else {
      console.log('No match found, showing all countries');
      renderCountries();
    }
  }

  searchInput?.addEventListener('input', filterCountries);
  regionFilter?.addEventListener('change', filterCountries);
  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (regionFilter) regionFilter.value = '';
    renderCountries();
  });

  // Fullscreen Country Picker
  const pickerClose = document.getElementById('picker-close');
  const pickerSearch = document.getElementById('picker-search');
  const pickerRegion = document.getElementById('picker-region');
  const pickerList = document.getElementById('picker-list');

  function openPicker() {
    if (!pickerModal) return;
    buildPickerList();
    pickerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => pickerSearch?.focus(), 100);
  }
  function closePicker() {
    if (!pickerModal) return;
    pickerModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  function buildPickerList() {
    if (!pickerList) return;
    const term = (pickerSearch?.value || '').toLowerCase();
    const region = pickerRegion?.value || '';
    let list = [...countries].filter(c => c && c.name);
    if (region) list = list.filter(c => c.region === region);
    if (term) list = list.filter(c => (c.name || '').toLowerCase().includes(term));
    // group by region then sort by name
    const regionOrder = ['europe','asia','america','oceania','africa','offshore'];
    const byRegion = region ? regionOrder : regionOrder;
    const groups = {};
    list.forEach(c => {
      const key = c.region || 'other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    const parts = [];
    byRegion.forEach(key => {
      const items = (groups[key] || []).sort((a,b) => a.name.localeCompare(b.name, 'ru'));
      if (items.length) {
        parts.push(`<div style="padding:8px 0;color:#3498db;font-weight:600;font-size:15px;border-bottom:1px solid #2c3e50;">${regionLabel(key)}</div>`);
        parts.push('<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;padding:8px 0;">' +
          items.map(c => `<button class="btn btn-sm" style="justify-content:flex-start;font-size:13px;padding:10px 14px;" data-pick="${c.id}">${c.flag || '🏳️'} ${c.name}</button>`).join('') +
        '</div>');
      }
    });
    pickerList.innerHTML = parts.join('') || '<p style="color:#8899a6;text-align:center;padding:20px;">Ничего не найдено</p>';
    pickerList.querySelectorAll('[data-pick]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-pick');
        closePicker();
        filterByCountryId(id);
      });
    });
  }
  function regionLabel(r){
    switch(r){
      case 'europe': return 'Европа';
      case 'asia': return 'Азия';
      case 'america': return 'Америка';
      case 'oceania': return 'Австралия и Океания';
      case 'africa': return 'Африка';
      case 'offshore': return 'Оффшоры';
      default: return 'Прочее';
    }
  }
  openPickerBtn?.addEventListener('click', openPicker);
  pickerClose?.addEventListener('click', closePicker);
  pickerModal?.addEventListener('click', (e) => { if (e.target === pickerModal) closePicker(); });
  pickerSearch?.addEventListener('input', buildPickerList);
  pickerRegion?.addEventListener('change', buildPickerList);

  // Hydrate from server FIRST so all visitors see the same data
  (async function hydrateFromServer() {
    try {
      const res = await fetch('/api/save-data?lang=ru', { cache: 'no-store' });
      if (!res.ok) {
        console.warn('Server returned', res.status);
        renderCountries();
        return;
      }
      const data = await res.json();
      if (data && Array.isArray(data.registrationCountries)) {
        const serverCountries = (data.registrationCountries || []).filter(c => c && c.name);
        if (serverCountries.length > 0) {
          countries = serverCountries;
          try { localStorage.setItem('registrationCountries', JSON.stringify(countries)); } catch(_) {}
        }
      }
    } catch (e) {
      console.error('Failed to load from server', e);
    } finally {
      // If navigated with hash like #cyprus, filter immediately
      const hash = (location.hash || '').replace('#','');
      console.log('Page loaded with hash:', hash);
      if (hash) {
        renderCountries();
        setTimeout(() => filterByCountryId(hash), 100);
      } else {
        renderCountries();
      }
    }
  })();

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const hash = (location.hash || '').replace('#','');
    console.log('Hash changed to:', hash);
    if (hash) {
      filterByCountryId(hash);
    } else {
      renderCountries();
    }
  });

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

  window.openRegistrationModal = (countryId) => {
    console.log('Opening modal for country:', countryId);
    console.log('Available countries:', countries.map(c => ({id: c.id, name: c.name})));
    
    // Try to find by exact ID first, then by generated ID
    let country = countries.find(c => String(c.id) === String(countryId));
    if (!country) {
      country = countries.find(c => `country-${countries.indexOf(c)}` === countryId);
    }
    
    console.log('Found country:', country);
    console.log('Modal element:', modal);
    if (!country || !modal) {
      console.error('Country or modal not found');
      return;
    }
    modalFlag.textContent = country.flag || '🏳️';
    modalTitle.textContent = `Регистрация компании в ${country.name}`;
    modalSubtitle.textContent = `Заполните форму и получите консультацию по регистрации в ${country.name}`;
    formSubject.value = `Заказ регистрации компании в ${country.name}`;
    countryInput.value = country.name;
    modal.classList.add('active');
  };

  modalClose?.addEventListener('click', () => modal.classList.remove('active'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  registrationForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registrationForm);
    const data = {
      country: formData.get('country'),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      contactMethod: formData.get('contactMethod'),
      message: formData.get('message')
    };
    try {
      if (window.sendRegistrationToTelegram) {
        await window.sendRegistrationToTelegram(formData);
      } else {
        // Fallback to old method
        await sendToTelegram(`Регистрация: ${data.country}\nИмя: ${data.name}\nEmail: ${data.email}\nТелефон: ${data.phone}\nСпособ связи: ${data.contactMethod || 'Не указан'}${data.message ? `\nСообщение: ${data.message}` : ''}`);
      }
      registrationForm.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.innerHTML = '<p>✅ Спасибо! Мы свяжемся с вами в течение 15 минут.</p>';
      setTimeout(() => {
        modal.classList.remove('active');
        registrationForm.style.display = 'block';
        formSuccess.style.display = 'none';
        registrationForm.reset();
      }, 3000);
    } catch (err) {
      alert('Ошибка отправки формы. Попробуйте еще раз.');
    }
  });

  // Открытие статьи с проверкой существования URL и запасным вариантом через viewer
  function slugify(text) {
    const map = {
      'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
      'А':'a','Б':'b','В':'v','Г':'g','Д':'d','Е':'e','Ё':'e','Ж':'zh','З':'z','И':'i','Й':'y','К':'k','Л':'l','М':'m','Н':'n','О':'o','П':'p','Р':'r','С':'s','Т':'t','У':'u','Ф':'f','Х':'h','Ц':'c','Ч':'ch','Ш':'sh','Щ':'sch','Ъ':'','Ы':'y','Ь':'','Э':'e','Ю':'yu','Я':'ya'
    };
    return String(text)
      .split('')
      .map(ch => map[ch] !== undefined ? map[ch] : ch)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async function urlExists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  window.openCountryArticle = async (rawUrl, countryName) => {
    const url = (rawUrl || '').trim();
    if (url) {
      const ok = await urlExists(url.endsWith('.html') || url.includes('?') ? url : `${url}.html`);
      if (ok) {
        window.location.href = url.endsWith('.html') || url.includes('?') ? url : `${url}.html`;
        return;
      }
    }
    const slug = slugify(countryName || 'article');
    const viewer = '../pages/articles/view.html?slug=' + encodeURIComponent(slug);
    window.location.href = viewer;
  };
})();

