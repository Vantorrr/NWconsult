// Синхронизация выпадающего списка стран с данными из localStorage
(function() {
  // Функция для загрузки стран из localStorage
  function loadCountriesForDropdown() {
    try {
      const stored = localStorage.getItem('registrationCountries');
      if (stored) {
        const countries = JSON.parse(stored);
        if (Array.isArray(countries) && countries.length > 0) {
          return countries;
        }
      }
    } catch (e) {
      console.error('Error loading countries for dropdown:', e);
    }
    
    // Дефолтные страны
    return [
      { id: 'cyprus', name: 'Кипр', flag: '🇨🇾' },
      { id: 'uae', name: 'ОАЭ', flag: '🇦🇪' },
      { id: 'hongkong', name: 'Гонконг', flag: '🇭🇰' },
      { id: 'china', name: 'Китай', flag: '🇨🇳' },
      { id: 'uk', name: 'Великобритания', flag: '🇬🇧' },
      { id: 'usa', name: 'США', flag: '🇺🇸' },
      { id: 'singapore', name: 'Сингапур', flag: '🇸🇬' },
      { id: 'bvi', name: 'БВО', flag: '🇻🇬' },
      { id: 'seychelles', name: 'Сейшелы', flag: '🇸🇨' },
      { id: 'belize', name: 'Белиз', flag: '🇧🇿' }
    ];
  }
  
  // Функция для обновления выпадающего списка
  function updateDropdown() {
    // Находим меню регистрации
    const registrationMenuItem = document.querySelector('.nav__item a[href*="registratsiya"]');
    if (!registrationMenuItem) return;
    
    // Находим выпадающий список
    const dropdown = registrationMenuItem.parentElement.querySelector('.dropdown');
    if (!dropdown) return;
    
    // Загружаем страны
    const countries = loadCountriesForDropdown();
    
    // Создаём новый HTML для выпадающего списка
    const dropdownHTML = countries.map(country => {
      const countryId = country.id || country.name.toLowerCase().replace(/[^a-z]/g, '');
      return `<li><a href="./pages/registratsiya.html#${countryId}"><span class="dropdown-flag">${country.flag || '🏳️'}</span> ${country.name}</a></li>`;
    }).join('');
    
    // Добавляем пункт "Другие по запросу"
    const finalHTML = dropdownHTML + '<li><a href="./pages/registratsiya.html"><span class="dropdown-flag">🌍</span> Другие по запросу</a></li>';
    
    // Обновляем dropdown
    dropdown.innerHTML = finalHTML;
  }
  
  // Обновляем при загрузке страницы
  document.addEventListener('DOMContentLoaded', updateDropdown);
  
  // Обновляем при изменении localStorage (если админка открыта в другой вкладке)
  window.addEventListener('storage', function(e) {
    if (e.key === 'registrationCountries') {
      updateDropdown();
    }
  });
})();
