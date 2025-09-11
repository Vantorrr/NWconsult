/**
 * Simple form submitter. Attach to any form; send JSON to endpoint from
 * data-endpoint attribute. If absent, falls back to Formspree placeholder.
 */
(function(){
  function handleSubmit(event){
    event.preventDefault();
    const form = event.target;
    const endpoint = form.getAttribute('data-endpoint') || 'https://formspree.io/f/your-id';
    const data = Object.fromEntries(new FormData(form).entries());
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    fetch(endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({source:location.href, data})
    }).then(r=>{
      if(!r.ok) throw new Error('Network error');
      form.reset();
      alert('Заявка отправлена. Мы свяжемся с вами.');
    }).catch(()=>{
      alert('Не удалось отправить. Напишите нам в Telegram/WhatsApp.');
    }).finally(()=>{ if (submitBtn) submitBtn.disabled = false; });
  }

  document.addEventListener('submit', function(e){
    const form = e.target;
    if (form && form.tagName === 'FORM') handleSubmit(e);
  });
})();



