// Universal animations for all pages
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
  
  function initAnimations() {
    // Create Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Add animations to all elements
    const selectors = [
      // Text elements
      'h1', 'h2', 'h3', 'h4', 'p',
      '.hero__title', '.hero__desc',
      '.section-title', '.section-desc',
      
      // Cards and blocks
      '.service-card', '.country-card', '.bank-card',
      '.price-card', '.accounting-card', '.it-card',
      '.article__card', '.kik-card', '.process-step',
      
      // List items
      'li', '.feature', '.advantage',
      
      // Forms and buttons
      '.form-group', '.btn',
      
      // Tables
      'table', 'tbody tr',
      
      // Sections
      'section > .container > *'
    ];
    
    // Apply to each selector
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        if (!el.classList.contains('animate-in')) {
          // Choose animation based on element type
          if (el.tagName === 'H1' || el.classList.contains('hero__title')) {
            el.classList.add('animate-fade-down');
          } else if (el.classList.contains('btn')) {
            el.classList.add('animate-scale');
          } else if (index % 2 === 0) {
            el.classList.add('animate-fade-up');
          } else {
            el.classList.add('animate-fade-up');
          }
          
          // Add stagger delay
          if (el.parentElement && el.parentElement.children.length > 1) {
            const siblings = Array.from(el.parentElement.children);
            const myIndex = siblings.indexOf(el);
            el.style.animationDelay = `${myIndex * 0.1}s`;
          }
          
          observer.observe(el);
        }
      });
    });
    
    // Special animations for hero sections
    const heroSections = document.querySelectorAll('[class*="hero"]');
    heroSections.forEach(hero => {
      const bg = hero.querySelector('[class*="__bg"]');
      if (bg) {
        bg.style.animation = 'parallaxFloat 20s ease-in-out infinite';
      }
    });
  }
})();
