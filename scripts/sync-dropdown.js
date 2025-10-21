// Transliterate Russian to Latin
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
            const countryId = (country.id !== undefined && country.id !== null) ? String(country.id) : transliterate(country.name);
            return `<li><a href="./pages/registratsiya.html#${countryId}"><span class="dropdown-flag">${country.flag || '🏳️'}</span> ${country.name}</a></li>`;
          }).join('');
          
          dropdown.innerHTML = dropdownHTML + '<li><a href="./pages/registratsiya.html"><span class="dropdown-flag">🌍</span> Другие по запросу</a></li>';
        }
      }
    }
  } catch (e) {}
})();

