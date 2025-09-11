/* Dynamic table for company registration pricing */
(function(){
  const STORAGE_KEY = 'nw_registration_pricing_v1';

  const defaultCountries = [
    { country: 'Cyprus', code: 'CY', price: 3900, currency: 'EUR', time: '5–10 дней' },
    { country: 'UAE (Freezone)', code: 'AEFZ', price: 2900, currency: 'USD', time: '5–14 дней' },
    { country: 'Hong Kong', code: 'HK', price: 1800, currency: 'USD', time: '5–7 дней' },
    { country: 'United Kingdom', code: 'UK', price: 950, currency: 'GBP', time: '1–3 дня' },
    { country: 'USA (LLC)', code: 'US', price: 650, currency: 'USD', time: '2–7 дней' }
  ];

  function loadData(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultCountries;
      const data = JSON.parse(raw);
      if (!Array.isArray(data) || data.length === 0) return defaultCountries;
      return data;
    }catch{ return defaultCountries; }
  }

  function saveData(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function currencyLabel(c){
    return c || 'USD';
  }

  function renderTable(data){
    const tbody = document.querySelector('#reg-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.country}</td>
        <td>${row.time || ''}</td>
        <td><strong>${row.price.toLocaleString()} ${currencyLabel(row.currency)}</strong></td>
        <td>
          <button class="btn btn--outline" data-edit="${idx}">Изменить</button>
          <button class="btn" data-remove="${idx}">Удалить</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  function openEditDialog(current, onSave){
    const country = prompt('Страна', current?.country || '');
    if (!country) return;
    const time = prompt('Сроки', current?.time || '');
    const priceStr = prompt('Цена (число)', current?.price != null ? String(current.price) : '');
    const currency = prompt('Валюта (USD/EUR/GBP...)', current?.currency || 'USD');
    const price = Number(priceStr?.replace(/\s/g,''));
    if (Number.isNaN(price)) { alert('Цена должна быть числом'); return; }
    onSave({ country, time, price, currency });
  }

  function hookControls(data){
    const inputSearch = document.getElementById('reg-search');
    const addBtn = document.getElementById('reg-add');
    const exportBtn = document.getElementById('reg-export');
    const importBtn = document.getElementById('reg-import');
    const sortBtn = document.getElementById('reg-sort');

    function applyRender(){ renderTable(dataFiltered()); }
    function dataFiltered(){
      const q = (inputSearch?.value || '').toLowerCase();
      return data.filter(r => r.country.toLowerCase().includes(q));
    }

    inputSearch?.addEventListener('input', applyRender);
    sortBtn?.addEventListener('click', () => {
      const by = sortBtn.getAttribute('data-by') || 'country';
      const next = by === 'country' ? 'price' : 'country';
      sortBtn.setAttribute('data-by', next);
      data.sort((a,b)=> next==='country' ? a.country.localeCompare(b.country) : a.price-b.price);
      saveData(data); applyRender();
    });

    addBtn?.addEventListener('click', () => {
      openEditDialog(null, (row) => { data.push(row); saveData(data); applyRender(); });
    });
    exportBtn?.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'registration-pricing.json'; a.click();
      URL.revokeObjectURL(url);
    });
    importBtn?.addEventListener('click', async () => {
      const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
      input.onchange = async () => {
        const file = input.files?.[0]; if (!file) return;
        try { const text = await file.text(); const json = JSON.parse(text); if (Array.isArray(json)) { data.splice(0, data.length, ...json); saveData(data); applyRender(); } }
        catch { alert('Неверный JSON'); }
      };
      input.click();
    });
    // no remote fetch by request

    document.querySelector('#reg-table')?.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const idxEdit = t.getAttribute('data-edit');
      const idxRemove = t.getAttribute('data-remove');
      if (idxEdit != null){
        const i = Number(idxEdit); openEditDialog(data[i], (row)=>{ data[i]=row; saveData(data); applyRender(); });
      }
      if (idxRemove != null){
        const i = Number(idxRemove); data.splice(i,1); saveData(data); applyRender();
      }
    });

    applyRender();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const data = loadData();
    renderTable(data);
    hookControls(data);
  });
})();


