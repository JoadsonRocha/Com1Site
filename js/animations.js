/**
 * Com1Site - Smooth Animations & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initStatCounters();
});

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.service-card, .portfolio-card, .plan-card, .testimonial-card, .faq-item');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s`;
    observer.observe(el);
  });
}

function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  let hasAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumbers();
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  function animateNumbers() {
    statNumbers.forEach(stat => {
      const targetText = stat.textContent.trim();
      const targetNumber = parseInt(targetText.replace(/\D/g, ''), 10);
      const suffix = targetText.includes('+') ? '+' : (targetText.includes('%') ? '%' : '');

      if (isNaN(targetNumber)) return;

      let current = 0;
      const duration = 1800; // ms
      const stepTime = 20;
      const increment = targetNumber / (duration / stepTime);

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          stat.textContent = targetNumber + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + suffix;
        }
      }, stepTime);
    });
  }
}
