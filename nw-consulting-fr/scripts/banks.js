/* Dynamic bank accounts page: editable list with filters and local storage */
(function(){
  const STORAGE_KEY = 'nw_banks_v1';
  const defaults = [
    { country:'Suisse', bank:'Private/Corporate', channels:'SWIFT', remote:true, minBalance:'50k+', notes:'' },
    { country:'ÉAU', bank:'Local/International', channels:'SWIFT', remote:false, minBalance:'10k+', notes:'' },
    { country:'EMI (Europe)', bank:'IBAN/SEPA', channels:'SEPA, SWIFT', remote:true, minBalance:'0–5k', notes:'' },
    { country:'Hong Kong', bank:'Corporate', channels:'SWIFT', remote:false, minBalance:'10k+', notes:'' },
    { country:'Singapour', bank:'Corporate', channels:'SWIFT', remote:false, minBalance:'20k+', notes:'' }
  ];

  function load(){
    try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : defaults; }
    catch{ return defaults; }
  }
  function save(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

  function render(data){
    const tbody = document.querySelector('#banks-table tbody'); if(!tbody) return;
    tbody.innerHTML = '';
    data.forEach((r, i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.country}</td>
        <td>${r.bank}</td>
        <td>${r.channels}</td>
        <td>${r.remote ? 'Да' : 'Нет'}</td>
        <td>${r.minBalance}</td>
        <td>${r.notes||''}</td>
        <td>
          <button class="btn btn--outline" data-edit="${i}">Изменить</button>
          <button class="btn" data-remove="${i}">Supprimer</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  function openDialog(r, onSave){
    const country = prompt('Pays', r?.country||''); if(!country) return;
    const bank = prompt('Type / Банк', r?.bank||'');
    const channels = prompt('Платежные каналы', r?.channels||'SWIFT');
    const remote = confirm('Возможна удаленная подача? Ок = Да, Отмена = Нет');
    const minBalance = prompt('Мин. оdepuisтаток', r?.minBalance||'');
    const notes = prompt('Заметки', r?.notes||'');
    onSave({country, bank, channels, remote, minBalance, notes});
  }

  function setup(data){
    const search = document.getElementById('banks-search');
    const addBtn = document.getElementById('banks-add');
    const exportBtn = document.getElementById('banks-export');
    const importBtn = document.getElementById('banks-import');
    const filterRemote = document.getElementById('banks-remote');

    function filtered(){
      const q = (search?.value||'').toLowerCase();
      const onlyRemote = filterRemote?.checked;
      return data.filter(r =>
        (!onlyRemote || r.remote) &&
        (r.country+ ' ' + r.bank+ ' ' + r.channels).toLowerCase().includes(q)
      );
    }
    function rerender(){ render(filtered()); }

    search?.addEventListener('input', rerender);
    filterRemote?.addEventListener('change', rerender);
    addBtn?.addEventListener('click', ()=> openDialog(null, (row)=>{ data.push(row); save(data); rerender(); }));
    exportBtn?.addEventListener('click', ()=>{
      const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='banks.json'; a.click(); URL.revokeObjectURL(url);
    });
    importBtn?.addEventListener('click', ()=>{
      const input = document.createElement('input'); input.type='file'; input.accept='application/json';
      input.onchange = async ()=>{ const f=input.files?.[0]; if(!f) return; try{ const text=await f.text(); const json=JSON.parse(text); if(Array.isArray(json)){ data.splice(0,data.length,...json); save(data); rerender(); }} catch{ alert('Неверный JSON'); } };
      input.click();
    });
    document.querySelector('#banks-table')?.addEventListener('click', (e)=>{
      const t = e.target; if(!(t instanceof HTMLElement)) return;
      const ie = t.getAttribute('data-edit'); const ir = t.getAttribute('data-remove');
      if (ie!=null){ const i=Number(ie); openDialog(data[i], (row)=>{ data[i]=row; save(data); rerender(); }); }
      if (ir!=null){ const i=Number(ir); data.splice(i,1); save(data); rerender(); }
    });
    rerender();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ const data=load(); render(data); setup(data); });
})();



