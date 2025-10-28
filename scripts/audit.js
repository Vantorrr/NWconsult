// Audit page functionality
(function() {
  const lang = (document.documentElement.getAttribute('lang') || 'ru').toLowerCase();
  const isEnglish = lang.startsWith('en');
  const isFrench = lang.startsWith('fr');

  const TEXT = {
    more: isEnglish ? 'Learn more about audit' : isFrench ? 'En savoir plus sur l’audit' : 'Подробнее об аудите',
    order: isEnglish ? 'Order' : isFrench ? 'Commander' : 'Заказать',
    tax: isEnglish ? 'Tax:' : isFrench ? 'Impôt :' : 'Налог:',
    audit: isEnglish ? 'Audit:' : isFrench ? 'Audit :' : 'Требования:',
    standards: isEnglish ? 'Standards:' : isFrench ? 'Normes :' : 'Стандарты:',
    noCountries: isEnglish ? 'No countries available' : isFrench ? 'Aucune juridiction disponible' : 'Нет доступных стран для отображения'
  };

  let auditCountriesData = [];
  let auditObserver = null;

  // Load audit data from server and refresh grid
  (async function loadFromServer() {
    try {
      const res = await fetch('/api/save-data?lang=ru', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.auditCountries) && data.auditCountries.length > 0) {
          localStorage.setItem('auditData', JSON.stringify(data.auditCountries));
          if (window.setAuditCountries) {
            window.setAuditCountries(data.auditCountries);
          }
        }
      }
    } catch (e) {
      console.warn('Не удалось загрузить данные аудита с сервера', e);
    }
  })();

  // Dropdown navigation
  document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country-select');
    if (!countrySelect) return;

    selectFirstCountryOption(countrySelect);

    countrySelect.addEventListener('change', function() {
      const selectedCountry = this.value;
      if (!selectedCountry) return;
      const target = (Array.isArray(auditCountriesData) ? auditCountriesData : []).find(c => c.id === selectedCountry);
      const articleUrl = prepareArticleUrl(target?.articleUrl, selectedCountry);
      window.location.href = articleUrl;
    });
  });

  function slugify(value) {
    return (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-');
  }

  function getCountriesData() {
    const savedData = localStorage.getItem('auditData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing audit data:', e);
      }
    }
    return getDefaultCountries();
  }

  function getDefaultCountries() {
    return [
      {
        id: 'cyprus',
        name: isEnglish ? 'Cyprus' : isFrench ? 'Chypre' : 'Кипр',
        flag: '🇨🇾',
        region: 'europe',
        regionText: isEnglish ? 'Europe' : isFrench ? 'Europe' : 'Европа',
        taxRate: isEnglish ? '12.5%' : isFrench ? '12,5 %' : '12.5%',
        auditRequired: isEnglish ? 'Mandatory annually' : isFrench ? 'Obligatoire chaque année' : 'Обязательный ежегодный',
        standards: isEnglish ? 'IFRS' : isFrench ? 'IFRS' : 'МСФО',
        articleUrl: './articles/audit-cyprus.html'
      },
      {
        id: 'malta',
        name: isEnglish ? 'Malta' : isFrench ? 'Malte' : 'Мальта',
        flag: '🇲🇹',
        region: 'europe',
        regionText: isEnglish ? 'Europe' : isFrench ? 'Europe' : 'Европа',
        taxRate: isEnglish ? '35%' : isFrench ? '35 %' : '35%',
        auditRequired: isEnglish ? 'For larger companies' : isFrench ? 'Pour les grandes entreprises' : 'Для крупных компаний',
        standards: isEnglish ? 'IFRS' : isFrench ? 'IFRS' : 'МСФО',
        articleUrl: './articles/audit-malta.html'
      },
      {
        id: 'singapore',
        name: isEnglish ? 'Singapore' : isFrench ? 'Singapour' : 'Сингапур',
        flag: '🇸🇬',
        region: 'asia',
        regionText: isEnglish ? 'Asia' : isFrench ? 'Asie' : 'Азия',
        taxRate: '17%',
        auditRequired: isEnglish ? 'Depends on company size' : isFrench ? 'Selon la taille' : 'По размеру компании',
        standards: isEnglish ? 'SFRS' : isFrench ? 'SFRS' : 'SFRS',
        articleUrl: './articles/audit-singapore.html'
      },
      {
        id: 'hongkong',
        name: isEnglish ? 'Hong Kong' : isFrench ? 'Hong Kong' : 'Гонконг',
        flag: '🇭🇰',
        region: 'asia',
        regionText: isEnglish ? 'Asia' : isFrench ? 'Asie' : 'Азия',
        taxRate: isEnglish ? '16.5%' : isFrench ? '16,5 %' : '16.5%',
        auditRequired: isEnglish ? 'Mandatory' : isFrench ? 'Obligatoire' : 'Обязательный',
        standards: isEnglish ? 'HKFRS' : isFrench ? 'HKFRS' : 'HKFRS',
        articleUrl: './articles/audit-hongkong.html'
      },
      {
        id: 'uae',
        name: isEnglish ? 'UAE' : isFrench ? 'EAU' : 'ОАЭ',
        flag: '🇦🇪',
        region: 'middle-east',
        regionText: isEnglish ? 'Middle East' : isFrench ? 'Moyen-Orient' : 'Ближний Восток',
        taxRate: '0-9%',
        auditRequired: isEnglish ? 'Depends on free zone' : isFrench ? 'Selon la zone franche' : 'В свободных зонах - нет',
        standards: 'IFRS',
        articleUrl: './articles/audit-uae.html'
      },
      {
        id: 'uk',
        name: isEnglish ? 'United Kingdom' : isFrench ? 'Royaume-Uni' : 'Великобритания',
        flag: '🇬🇧',
        region: 'europe',
        regionText: isEnglish ? 'Europe' : isFrench ? 'Europe' : 'Европа',
        taxRate: '19-25%',
        auditRequired: isEnglish ? 'Depends on company size' : isFrench ? 'Selon la taille' : 'По размеру компании',
        standards: isEnglish ? 'UK GAAP' : isFrench ? 'UK GAAP' : 'UK GAAP',
        articleUrl: './articles/audit-uk.html'
      },
      {
        id: 'estonia',
        name: isEnglish ? 'Estonia' : isFrench ? 'Estonie' : 'Эстония',
        flag: '🇪🇪',
        region: 'europe',
        regionText: isEnglish ? 'Europe' : isFrench ? 'Europe' : 'Европа',
        taxRate: '20%',
        auditRequired: isEnglish ? 'Depends on company size' : isFrench ? 'Selon la taille' : 'По размеру компании',
        standards: isEnglish ? 'IFRS' : isFrench ? 'IFRS' : 'МСФО',
        articleUrl: './articles/audit-estonia.html'
      },
      {
        id: 'switzerland',
        name: isEnglish ? 'Switzerland' : isFrench ? 'Suisse' : 'Швейцария',
        flag: '🇨🇭',
        region: 'europe',
        regionText: isEnglish ? 'Europe' : isFrench ? 'Europe' : 'Европа',
        taxRate: isEnglish ? '12-21%' : isFrench ? '12-21 %' : '12-21%',
        auditRequired: isEnglish ? 'Mandatory' : isFrench ? 'Obligatoire' : 'Обязательный',
        standards: isEnglish ? 'Swiss GAAP' : isFrench ? 'Swiss GAAP' : 'Swiss GAAP',
        articleUrl: './articles/audit-switzerland.html'
      }
    ];
  }

  function normalizeCountries(countries) {
    return (countries || []).map(country => {
      const id = country.id || slugify(country.name);
      return {
        ...country,
        id,
        regionText: country.regionText || country.region,
        standards: country.standards || country.reportingStandards,
        articleUrl: prepareArticleUrl(country.articleUrl, id)
      };
    });
  }

  function prepareArticleUrl(url, id) {
    if (url && url.startsWith('http')) return url;
    if (url && url.startsWith('./')) return url;
    if (url && url.startsWith('/')) return `.${url}`;
    const slug = id || 'article';
    return `./articles/audit-${slug}.html`;
  }

  function renderCountries(countries) {
    const grid = document.getElementById('countries-grid');
    if (!grid) {
      console.error('Countries grid element not found!');
      return;
    }

    if (!Array.isArray(countries) || countries.length === 0) {
      grid.innerHTML = `<p style="color: #fff; text-align: center;">${TEXT.noCountries}</p>`;
      return;
    }

    grid.innerHTML = countries.map(country => {
      const countryId = country.id || slugify(country.name);
      const articleUrl = prepareArticleUrl(country.articleUrl, countryId);

      return `
        <div class="country-card" data-country="${countryId}">
          <div class="country-card__header">
            <span class="country-card__flag">${country.flag || '🏳️'}</span>
            <div class="country-card__info">
              <h3>${country.name}</h3>
              <span class="country-card__region">${getRegionName(country.region)}</span>
            </div>
          </div>
          <div class="country-card__details">
            <div class="country-card__detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>${TEXT.tax} ${country.taxRate || country.tax || (isEnglish ? 'On request' : isFrench ? 'Sur demande' : 'По запросу')}</span>
            </div>
            <div class="country-card__detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>${TEXT.audit} ${country.auditRequired || (isEnglish ? 'Mandatory' : isFrench ? 'Obligatoire' : 'Аудит обязателен')}</span>
            </div>
            <div class="country-card__detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
              <span>${TEXT.standards} ${country.standards || (isEnglish ? 'International standards' : isFrench ? 'Normes internationales' : 'Международные стандарты')}</span>
            </div>
          </div>
          <div class="country-card__actions">
            <a href="${articleUrl}" class="country-card__link">${TEXT.more}</a>
            <button class="country-card__button" data-country="${countryId}">${TEXT.order}</button>
          </div>
        </div>
      `;
    }).join('');

    attachOrderHandlers();
    updateModalDataset(countries);
    requestAnimationFrame(setupAnimations);
  }

  function attachOrderHandlers() {
    const buttons = document.querySelectorAll('.country-card__button');
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.getAttribute('data-country');
        if (id && typeof window.openAuditModal === 'function') {
          window.openAuditModal(id);
        }
      });
    });
  }

  function updateModalDataset(countries) {
    if (typeof window.setAuditModalData === 'function') {
      window.setAuditModalData(countries);
    }
  }

  function filterCountries() {
    const searchInput = document.getElementById('search');
    const regionSelect = document.getElementById('region');
    // typeSelect reserved for future use

    let filtered = [...auditCountriesData];

    if (searchInput && searchInput.value) {
      const search = searchInput.value.toLowerCase();
      filtered = filtered.filter(c =>
        (c.name || '').toLowerCase().includes(search) ||
        (c.regionText || '').toLowerCase().includes(search)
      );
    }

    if (regionSelect && regionSelect.value) {
      filtered = filtered.filter(c => (c.region || '').toLowerCase() === regionSelect.value.toLowerCase());
    }

    renderCountries(filtered);
  }

  function selectDefaultCountry(countrySelect, countries) {
    if (!countrySelect) return;
    const source = Array.isArray(countries) && countries.length > 0 ? countries : auditCountriesData;
    if (!source || source.length === 0) {
      selectFirstCountryOption(countrySelect);
      return;
    }

    const firstCountry = source.find(item => item && (item.id || item.slug || item.name));
    if (!firstCountry) {
      selectFirstCountryOption(countrySelect);
      return;
    }

    const candidateValue = firstCountry.id || slugify(firstCountry.slug || firstCountry.name);
    const hasOption = Array.from(countrySelect.options).some(option => option.value === candidateValue);

    if (hasOption) {
      countrySelect.value = candidateValue;
    } else {
      selectFirstCountryOption(countrySelect);
    }
  }

  function selectFirstCountryOption(countrySelect) {
    if (!countrySelect) return;
    for (const option of Array.from(countrySelect.options)) {
      if (option.value) {
        countrySelect.value = option.value;
        break;
      }
    }
  }

  function initializeAuditPage() {
    auditCountriesData = normalizeCountries(getCountriesData());
    
    // Check for hash filter
    const hash = (location.hash || '').replace('#','');
    if (hash) {
      const found = auditCountriesData.find(c => {
        const cId = String(c.id || transliterate(c.name));
        return cId === hash;
      });
      if (found) {
        renderCountries([found]);
      } else {
        renderCountries(auditCountriesData);
      }
    } else {
      renderCountries(auditCountriesData);
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const hash = (location.hash || '').replace('#','');
      if (hash) {
        const found = auditCountriesData.find(c => {
          const cId = String(c.id || transliterate(c.name));
          return cId === hash;
        });
        if (found) {
          renderCountries([found]);
        } else {
          renderCountries(auditCountriesData);
        }
      } else {
        renderCountries(auditCountriesData);
      }
    });
  }

    const searchInput = document.getElementById('search');
    const regionSelect = document.getElementById('region');
    const typeSelect = document.getElementById('type');
    const countrySelect = document.getElementById('country-select');

    if (countrySelect) {
      selectDefaultCountry(countrySelect, auditCountriesData);
    }

    searchInput?.addEventListener('input', filterCountries);
    regionSelect?.addEventListener('change', filterCountries);
    typeSelect?.addEventListener('change', filterCountries);

    // initial animation setup
    setupAnimations();
  }

  // --- Modal picker for Audit page ---
  function initAuditPicker() {
    const overlay = document.getElementById('country-picker');
    const pickerSearch = document.getElementById('picker-search');
    const pickerList = document.getElementById('picker-list');
    const openBtn = document.getElementById('open-country-picker');
    const closeBtn = document.getElementById('picker-close');
    let selectedRegion = '';

    function transliterate(text) {
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

    function keyLabel(k){
      switch((k||'').toLowerCase()){
        case 'europe': return 'Европа';
        case 'asia': return 'Азия';
        case 'america': return 'Америка';
        case 'middle-east': return 'Ближний Восток';
        case 'oceania': return 'Австралия и Океания';
        case 'africa': return 'Африка';
        case 'offshore': return 'Оффшоры';
        default: return 'Прочее';
      }
    }

    function buildPickerList(){
      if (!pickerList) return;
      const term = (pickerSearch?.value || '').toLowerCase();
      let list = [...(auditCountriesData || [])];
      if (selectedRegion) list = list.filter(c => (c.region || '').toLowerCase() === selectedRegion.toLowerCase());
      if (term) list = list.filter(c => (c.name || '').toLowerCase().includes(term));

      const regionOrder = ['europe','asia','america','middle-east','oceania','africa','offshore'];
      const groups = {};
      list.forEach(c => { const key = (c.region || 'other'); (groups[key] ||= []).push(c); });

      const parts = [];
      regionOrder.forEach(key => {
        const items = (groups[key] || []).sort((a,b) => (a.name || '').localeCompare(b.name || '', 'ru'));
        if (items.length) {
          parts.push(`<div class="picker-group"><h4>${keyLabel(key)}</h4><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">` +
            items.map(c => `<button class="picker-item" data-pick="${c.id}"><span class="picker-flag">${c.flag || '🏳️'}</span><span>${c.name}</span></button>`).join('') +
          `</div></div>`);
        }
      });

      pickerList.innerHTML = parts.join('') || '<p style="color:#8899a6;text-align:center;padding:20px;">Ничего не найдено</p>';
      pickerList.querySelectorAll('[data-pick]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-pick');
          closePicker();
          const found = (auditCountriesData || []).find(c => (c.id || '') === id);
          if (found) renderCountries([found]); else renderCountries(auditCountriesData);
          try { document.getElementById('countries-grid')?.scrollIntoView({ behavior: 'smooth' }); } catch(_) {}
        });
      });
    }

    function openPicker(){
      if (!overlay) return;
      buildPickerList();
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      setTimeout(() => pickerSearch?.focus(), 50);
    }
    function closePicker(){
      if (!overlay) return;
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }

    openBtn?.addEventListener('click', openPicker);
    closeBtn?.addEventListener('click', closePicker);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) closePicker(); });
    pickerSearch?.addEventListener('input', buildPickerList);
    document.querySelectorAll('.picker-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.picker-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedRegion = chip.getAttribute('data-region') || '';
        buildPickerList();
      });
    });
  }

  function setupAnimations() {
    if (!auditObserver) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      auditObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);
    }
    
    const elementsToAnimate = document.querySelectorAll('.country-card, .process-step, .service-card');
    elementsToAnimate.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      auditObserver.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuditPage);
    document.addEventListener('DOMContentLoaded', initAuditPicker);
  } else {
    initializeAuditPage();
    initAuditPicker();
  }

  window.setAuditCountries = function(newCountries) {
    auditCountriesData = normalizeCountries(newCountries);
    renderCountries(auditCountriesData);
    if (document.getElementById('country-select')) {
      selectDefaultCountry(document.getElementById('country-select'), auditCountriesData);
    }
  };
  window.getAuditCountries = function() {
    return Array.isArray(auditCountriesData) ? auditCountriesData : [];
  };
})();
