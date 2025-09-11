// Other Services functionality

// Get services data
function getServicesData() {
  const savedData = localStorage.getItem('otherServicesData');
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error('Error parsing services data:', e);
    }
  }
  
  // Default services
  return [
    {
      id: 'kik',
      title: 'КИК - Контролируемые иностранные компании',
      description: 'Консультации по вопросам КИК, подготовка уведомлений, налоговое планирование',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>`,
      link: './articles/ru-kik.html',
      featured: true,
      language: 'ru'
    }
  ];
}

// Render services
function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  
  const services = getServicesData();
  const additionalServices = services.filter(s => !s.featured);
  
  if (additionalServices.length === 0) {
    grid.style.display = 'none';
    return;
  }
  
  grid.innerHTML = additionalServices.map(service => `
    <div class="service-card">
      <div class="service-card__icon">
        ${service.icon}
      </div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <a href="${service.link}" class="btn btn--primary">Подробнее</a>
    </div>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  
  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements
  const elementsToAnimate = document.querySelectorAll('.it-card, .kik-card');
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
