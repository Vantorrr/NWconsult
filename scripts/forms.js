/**
 * Form submitter with Telegram integration
 */
(function(){
  
  // Success modal functions
  function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Auto close after 5 seconds
      setTimeout(() => {
        closeSuccessModal();
      }, 5000);
    }
  }
  
  function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Modal event listeners
  document.addEventListener('DOMContentLoaded', () => {
    const modalClose = document.getElementById('success-modal-close');
    const modal = document.getElementById('success-modal');
    
    modalClose?.addEventListener('click', closeSuccessModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeSuccessModal();
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        closeSuccessModal();
      }
    });
  });
  async function handleSubmit(event){
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
    }
    
    try {
      const formData = new FormData(form);
      
      // Check if Telegram function is available
      if (typeof window.sendContactToTelegram === 'function') {
        // Send to Telegram
        const success = await window.sendContactToTelegram(formData);
        
        if (success) {
          form.reset();
          showSuccessModal();
        } else {
          throw new Error('Failed to send to Telegram');
        }
      } else {
        console.error('Telegram sender not loaded');
        alert('Функция отправки не загружена. Обновите страницу и попробуйте снова.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Произошла ошибка при отправке. Напишите нам в Telegram или WhatsApp.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
      }
    }
  }

  document.addEventListener('submit', function(e){
    const form = e.target;
    if (form && form.tagName === 'FORM') handleSubmit(e);
  });
})();



