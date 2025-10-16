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

// Hero Slider
document.addEventListener('DOMContentLoaded', () => {
  const heroSlides = document.getElementById('hero-slides');
  const heroDots = document.getElementById('hero-dots');
  
  if (!heroSlides) return;
  
  // Load slides from localStorage
  function loadHeroSlides() {
    const slides = localStorage.getItem('showcaseSlides');
    if (slides) {
      return JSON.parse(slides);
    }
    // Default slides
    return [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop',
        imageAlt: 'Dubai skyline'
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1920&h=1080&fit=crop',
        imageAlt: 'European city'
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop',
        imageAlt: 'Digital banking'
      }
    ];
  }
  
  // Render slides
  const slidesData = loadHeroSlides();
  
  heroSlides.innerHTML = slidesData.map((slide, index) => `
    <div class="hero__slide ${index === 0 ? 'active' : ''}">
      <img src="${slide.image}" alt="${slide.imageAlt}">
    </div>
  `).join('');
  
  heroDots.innerHTML = slidesData.map((_, index) => `
    <button class="hero__dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
  `).join('');
  
  // Re-query elements after dynamic content
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  let currentSlide = 0;
  
  // Change slide function
  function changeSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  // Auto-play
  setInterval(() => {
    const nextSlide = (currentSlide + 1) % slides.length;
    changeSlide(nextSlide);
  }, 5000);
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      changeSlide(index);
    });
  });
});

// Keep the old Showcase Slider for compatibility
// Showcase Slider
document.addEventListener('DOMContentLoaded', () => {
  const showcaseSlider = document.querySelector('.showcase__slider');
  
  if (!showcaseSlider) return;
  
  // Load slides from localStorage
  function loadShowcaseSlides() {
    const slides = localStorage.getItem('showcaseSlides');
    if (slides) {
      try {
        const parsed = JSON.parse(slides);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Не удалось прочитать сохранённые слайды, используем дефолтные.', e);
      }
    }
    // Default slides
    return [
      {
        id: '1',
        title: 'Спецпредложение месяца',
        desc: 'Регистрация компании в ОАЭ + открытие корпоративного счета всего за $2,500',
        link: './pages/registratsiya.html',
        linkText: 'Узнать подробнее →',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
        imageAlt: 'Dubai skyline'
      },
      {
        id: '2',
        title: 'Новые юрисдикции',
        desc: 'Теперь доступна регистрация компаний в Эстонии и Швейцарии с дистанционным открытием счетов',
        link: './pages/registratsiya.html',
        linkText: 'Выбрать юрисдикцию →',
        image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=600&h=400&fit=crop',
        imageAlt: 'European city'
      },
      {
        id: '3',
        title: 'Банки для IT',
        desc: 'Специальные условия открытия счетов для IT-компаний. Быстрое рассмотрение заявок',
        link: './pages/banki.html',
        linkText: 'Подобрать банк →',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
        imageAlt: 'Digital banking'
      }
    ];
  }
  
  // Render slides
  const slidesData = loadShowcaseSlides();
  const dotsContainer = document.querySelector('.showcase__dots');
  
  showcaseSlider.innerHTML = slidesData.map((slide, index) => `
    <div class="showcase__slide ${index === 0 ? 'active' : ''}" data-slide="${index + 1}">
      <div class="showcase__content">
        <h3 class="showcase__title">${slide.title}</h3>
        <p class="showcase__desc">${slide.desc}</p>
        <a href="${slide.link}" class="showcase__link">${slide.linkText}</a>
      </div>
      <div class="showcase__image">
        <img src="${slide.image}" alt="${slide.imageAlt || slide.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%22300%22 y=%22200%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22%3E${slide.title}%3C/text%3E%3C/svg%3E'">
      </div>
    </div>
  `).join('');
  
  dotsContainer.innerHTML = slidesData.map((_, index) => `
    <button class="showcase__dot ${index === 0 ? 'active' : ''}" data-slide="${index + 1}"></button>
  `).join('');
  
  // Re-query elements after rendering
  const slides = document.querySelectorAll('.showcase__slide');
  const dots = document.querySelectorAll('.showcase__dot');
  
  if (!slides.length || !dots.length) return;
  
  let currentSlide = 0;
  
  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }
  
  // Auto-play
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });
});
