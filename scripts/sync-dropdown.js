// Sync dropdown menu with server data
(async function() {
  try {
    const res = await fetch('/api/save-data?lang=ru', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    
    if (data && Array.isArray(data.registrationCountries)) {
      const countries = data.registrationCountries;
      
      // Update navigation dropdown
      const registrationMenuItem = document.querySelector('.nav__item a[href*="registratsiya"]');
      if (registrationMenuItem) {
        const dropdown = registrationMenuItem.parentElement.querySelector('.dropdown');
        if (dropdown && countries.length > 0) {
          const sorted = [...countries].filter(c=>c&&c.name).sort((a,b)=>a.name.localeCompare(b.name,'ru'));
          const dropdownHTML = sorted.map(country => {
            const countryId = country.id || country.name.toLowerCase().replace(/[^a-z]/g, '');
            return `<li><a href="./pages/registratsiya.html#${countryId}"><span class="dropdown-flag">${country.flag || '🏳️'}</span> ${country.name}</a></li>`;
          }).join('');
          
          dropdown.innerHTML = dropdownHTML + '<li><a href="./pages/registratsiya.html"><span class="dropdown-flag">🌍</span> Другие по запросу</a></li>';
        }
      }
    }
  } catch (e) {}
})();

