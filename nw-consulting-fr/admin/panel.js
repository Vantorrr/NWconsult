(function(){
  const PIN_KEY = 'nw_admin_pin_v1';
  const REG_KEY = 'nw_registration_pricing_v1';
  const BANKS_KEY = 'nw_banks_v1';

  function getPin(){ return localStorage.getItem(PIN_KEY) || '0000'; }
  function setPin(v){ localStorage.setItem(PIN_KEY, v); }
  function load(key, fallback){ try{ const r=localStorage.getItem(key); return r?JSON.parse(r):fallback; } catch{ return fallback; } }
  function save(key, data){ localStorage.setItem(key, JSON.stringify(data)); }

  // Auth
  const login = document.getElementById('login');
  const app = document.getElementById('app');
  document.getElementById('pinBtn')?.addEventListener('click', ()=>{
    const v = (document.getElementById('pin')?.value||'').trim();
    if (v === getPin()) { login.style.display='none'; app.style.display='block'; initPanels(); }
    else alert('Неверный PIN');
  });

  function initPanels(){
    // Tabs
    document.querySelectorAll('.tabs button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('btn--primary'));
        document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
        btn.classList.add('btn--primary');
        document.getElementById('panel-'+btn.dataset.tab)?.classList.add('active');
      });
    });

    // Registration panel
    const regData = load(REG_KEY, []);
    const regBody = document.querySelector('#reg-admin tbody');
    function renderReg(){
      regBody.innerHTML='';
      regData.forEach((r,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td contenteditable>${r.country||''}</td>
                       <td contenteditable>${r.time||''}</td>
                       <td contenteditable>${r.price||''}</td>
                       <td contenteditable>${r.currency||'USD'}</td>
                       <td><button class="btn" data-remove="${i}">Удалить</button></td>`;
        regBody.appendChild(tr);
      });
    }
    renderReg();
    regBody?.addEventListener('input', ()=>{
      Array.from(regBody.rows).forEach((row,i)=>{
        regData[i] = {
          country: row.cells[0].textContent.trim(),
          time: row.cells[1].textContent.trim(),
          price: Number(row.cells[2].textContent.replace(/[^\d]/g,''))||0,
          currency: row.cells[3].textContent.trim()||'USD'
        };
      });
      save(REG_KEY, regData);
    });
    regBody?.addEventListener('click', (e)=>{
      const t=e.target; if(!(t instanceof HTMLElement)) return;
      const i=t.getAttribute('data-remove'); if(i!=null){ regData.splice(Number(i),1); save(REG_KEY, regData); renderReg(); }
    });
    document.getElementById('reg-add')?.addEventListener('click', ()=>{ regData.push({country:'',time:'',price:0,currency:'USD'}); save(REG_KEY, regData); renderReg(); });

    // Banks panel
    const banksData = load(BANKS_KEY, []);
    const banksBody = document.querySelector('#banks-admin tbody');
    function renderBanks(){
      banksBody.innerHTML='';
      banksData.forEach((r,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td contenteditable>${r.country||''}</td>
                       <td contenteditable>${r.bank||''}</td>
                       <td contenteditable>${r.channels||''}</td>
                       <td contenteditable>${r.remote?'Да':'Нет'}</td>
                       <td contenteditable>${r.minBalance||''}</td>
                       <td><button class="btn" data-remove="${i}">Удалить</button></td>`;
        banksBody.appendChild(tr);
      });
    }
    renderBanks();
    banksBody?.addEventListener('input', ()=>{
      Array.from(banksBody.rows).forEach((row,i)=>{
        banksData[i] = {
          country: row.cells[0].textContent.trim(),
          bank: row.cells[1].textContent.trim(),
          channels: row.cells[2].textContent.trim(),
          remote: /да/i.test(row.cells[3].textContent),
          minBalance: row.cells[4].textContent.trim(),
        };
      });
      save(BANKS_KEY, banksData);
    });
    banksBody?.addEventListener('click', (e)=>{
      const t=e.target; if(!(t instanceof HTMLElement)) return;
      const i=t.getAttribute('data-remove'); if(i!=null){ banksData.splice(Number(i),1); save(BANKS_KEY, banksData); renderBanks(); }
    });
    document.getElementById('banks-add')?.addEventListener('click', ()=>{ banksData.push({country:'',bank:'',channels:'',remote:false,minBalance:''}); save(BANKS_KEY, banksData); renderBanks(); });

    // Backup panel
    document.getElementById('backup-export')?.addEventListener('click', ()=>{
      const payload = { pin: getPin(), registration: load(REG_KEY, []), banks: load(BANKS_KEY, []) };
      const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='nw-backup.json'; a.click(); URL.revokeObjectURL(url);
    });
    document.getElementById('backup-import')?.addEventListener('click', ()=>{
      const input=document.createElement('input'); input.type='file'; input.accept='application/json';
      input.onchange=async()=>{ const f=input.files?.[0]; if(!f) return; try{ const text=await f.text(); const json=JSON.parse(text); if(json.registration) save(REG_KEY, json.registration); if(json.banks) save(BANKS_KEY, json.banks); alert('Импортировано. Перезагрузите страницы каталога для отображения.'); renderReg(); renderBanks(); } catch{ alert('Неверный JSON'); } };
      input.click();
    });
    document.getElementById('backup-clear')?.addEventListener('click', ()=>{ if(confirm('Очистить локальные данные?')){ localStorage.removeItem(REG_KEY); localStorage.removeItem(BANKS_KEY); alert('Очищено.'); } });

    // Settings
    document.getElementById('savePin')?.addEventListener('click', ()=>{ const v=(document.getElementById('newPin')?.value||'').trim(); if(v){ setPin(v); alert('PIN сохранён'); } });
  }
})();



