// PRELOADER обрабатывается инлайн скриптом в index.html

// Navigation burger toggle
const toggle = document.querySelector('.nav__toggle');
const body = document.body;
if (toggle) {
  toggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}
document.querySelectorAll('.nav__list a').forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
  });
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Dropdowns (desktop hover)
document.querySelectorAll('.nav__item').forEach((item)=>{
  item.addEventListener('mouseenter', ()=> item.classList.add('open'));
  item.addEventListener('mouseleave', ()=> item.classList.remove('open'));
});

// Reveal animations - Enhanced
window.addEventListener('load', () => {
  // Original reveal animation
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e)=>{ if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, {rootMargin:'-10% 0px'});
  document.querySelectorAll('.reveal-up').forEach(el=> io.observe(el));
  
  // Enhanced animations for all elements
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Add stagger effect for children with animate-child class
        const children = entry.target.querySelectorAll('.animate-child');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('animate-in');
          }, index * 100);
        });
        
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Add animation classes to elements
  const elementsToAnimate = [
    // Headings
    'h1:not(.hero__title)', 'h2:not(.section-title)', 'h3', 'h4',
    '.section-title', '.hero__title', '.hero__desc',
    '.audit-hero__title', '.audit-hero__desc',
    '.banks-hero__title', '.banks-hero__desc', 
    '.other-hero__title', '.other-hero__desc',
    '.accounting-hero__title', '.accounting-hero__desc',
    
    // Cards
    '.service-card', '.news-card', '.country-card',
    '.bank-card', '.process-step', '.stat-card',
    '.feature', '.advantage', '.it-card', '.kik-card',
    '.accounting-card', '.article__card', '.price-card',
    
    // Sections and grids
    '.services__wrapper > *', '.news__grid > *',
    '.countries-grid > *', '.banks-grid > *',
    '.it-preview__grid > *', '.process-steps > *',
    '.advantages-grid > *', '.features-grid > *',
    
    // Forms and CTAs
    '.form-group', '.cta-card', '.audit-cta-card',
    '.banks-cta-card', '.other-cta-card',
    
    // Tables and lists
    'table', '.filters-container',
    '.article__list li', '.article__steps li',
    
    // Footer
    '.footer__grid > div'
  ];
  
  // Apply animations
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.classList.contains('animate-in') && !el.classList.contains('is-visible')) {
        el.classList.add('animate-fade-up');
        
        // Add delay for elements in same container
        if (el.parentElement && el.parentElement.children.length > 1) {
          el.style.animationDelay = `${index * 0.1}s`;
        }
        
        animationObserver.observe(el);
      }
    });
  });
  
  // Special hero animations
  const heroSections = document.querySelectorAll('.hero, .audit-hero, .banks-hero, .other-hero, .accounting-hero');
  heroSections.forEach(hero => {
    const title = hero.querySelector('h1');
    const desc = hero.querySelector('p');
    const buttons = hero.querySelectorAll('.btn');
    const features = hero.querySelectorAll('.hero__feature, .audit-hero__feature, .banks-hero__stat');
    
    if (title && !title.classList.contains('animate-in')) {
      title.classList.add('animate-fade-down');
      setTimeout(() => title.classList.add('animate-in'), 100);
    }
    
    if (desc && !desc.classList.contains('animate-in')) {
      desc.classList.add('animate-fade-up');
      setTimeout(() => desc.classList.add('animate-in'), 200);
    }
    
    buttons.forEach((btn, i) => {
      if (!btn.classList.contains('animate-in')) {
        btn.classList.add('animate-scale');
        setTimeout(() => btn.classList.add('animate-in'), 300 + i * 100);
      }
    });
    
    features.forEach((feat, i) => {
      if (!feat.classList.contains('animate-in')) {
        feat.classList.add('animate-fade-left');
        setTimeout(() => feat.classList.add('animate-in'), 400 + i * 100);
      }
    });
  });
  
  // Animate counters
  const counters = document.querySelectorAll('.stat-card__number, .banks-hero__number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.textContent.replace(/\D/g, ''));
        const suffix = entry.target.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          entry.target.textContent = Math.floor(current) + suffix;
        }, 16);
        
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
});
