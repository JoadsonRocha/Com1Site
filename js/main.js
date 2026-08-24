/**
 * Com1Site - Interactive Core Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSimulator();
  initPortfolioFilters();
  initFaqAccordion();
  initContactForm();
});

/* ==========================================================================
   NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky navbar with blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      mobileToggle.innerHTML = isOpen 
        ? `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`
        : `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
    });
  }

  // Close mobile menu on link click & active state highlight
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
        }
      }
    });
  });
}

/* ==========================================================================
   INTERACTIVE BUDGET SIMULATOR
   ========================================================================== */
function initSimulator() {
  const projectCards = document.querySelectorAll('.sim-project-card');
  const addonCheckboxes = document.querySelectorAll('.sim-addon-check');
  const planRadios = document.querySelectorAll('.sim-plan-radio');

  const summaryProjectName = document.getElementById('sum-project-name');
  const summaryProjectPrice = document.getElementById('sum-project-price');
  const summaryAddonsList = document.getElementById('sum-addons-list');
  const summaryPlanName = document.getElementById('sum-plan-name');
  const summaryPlanPrice = document.getElementById('sum-plan-price');
  const totalPriceElement = document.getElementById('sim-total-display');
  const simWhatsappBtn = document.getElementById('sim-whatsapp-btn');

  let currentProject = {
    name: 'Landing Page de Alta Conversão',
    price: 990
  };

  let selectedAddons = [];
  let currentPlan = {
    name: 'Essencial (Manutenção)',
    price: 149
  };

  // Select project type
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      projectCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      currentProject.name = card.dataset.name;
      currentProject.price = parseFloat(card.dataset.price);
      calculateTotal();
    });
  });

  // Select add-ons
  addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const parentLabel = checkbox.closest('.addon-checkbox-label');
      if (checkbox.checked) {
        parentLabel.classList.add('checked');
      } else {
        parentLabel.classList.remove('checked');
      }
      updateAddons();
      calculateTotal();
    });
  });

  // Select maintenance plan
  planRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.sim-plan-card').forEach(c => c.classList.remove('active'));
      radio.closest('.sim-plan-card').classList.add('active');
      currentPlan.name = radio.dataset.name;
      currentPlan.price = parseFloat(radio.dataset.price);
      calculateTotal();
    });
  });

  function updateAddons() {
    selectedAddons = [];
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        selectedAddons.push({
          name: cb.dataset.name,
          price: parseFloat(cb.dataset.price)
        });
      }
    });
  }

  function calculateTotal() {
    let projectTotal = currentProject.price;
    let addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    let totalInitial = projectTotal + addonsTotal;

    // Update UI elements
    if (summaryProjectName) summaryProjectName.textContent = currentProject.name;
    if (summaryProjectPrice) summaryProjectPrice.textContent = `R$ ${currentProject.price.toLocaleString('pt-BR')}`;

    if (summaryAddonsList) {
      if (selectedAddons.length === 0) {
        summaryAddonsList.innerHTML = '<span class="text-dim">Nenhum adicional selecionado</span>';
      } else {
        summaryAddonsList.innerHTML = selectedAddons.map(ad => 
          `<div class="summary-item-row"><span>+ ${ad.name}</span><strong>R$ ${ad.price.toLocaleString('pt-BR')}</strong></div>`
        ).join('');
      }
    }

    if (summaryPlanName) summaryPlanName.textContent = currentPlan.name;
    if (summaryPlanPrice) summaryPlanPrice.textContent = `R$ ${currentPlan.price.toLocaleString('pt-BR')}/mês`;

    if (totalPriceElement) {
      totalPriceElement.textContent = `R$ ${totalInitial.toLocaleString('pt-BR')}`;
    }

    // Build WhatsApp conversion message
    if (simWhatsappBtn) {
      const addonsText = selectedAddons.length > 0 
        ? selectedAddons.map(a => `• ${a.name} (R$ ${a.price})`).join('%0A')
        : 'Nenhum';

      const message = `Olá, Com1Site! 👋%0A%0AGostaria de um orçamento personalizado para o meu projeto:%0A%0A📌 *Tipo de Site:* ${encodeURIComponent(currentProject.name)} (R$ ${currentProject.price})%0A➕ *Recursos Adicionais:*%0A${addonsText}%0A🛡️ *Plano de Gestão:* ${encodeURIComponent(currentPlan.name)} (R$ ${currentPlan.price}/mês)%0A%0A💰 *Investimento Estimado:* R$ ${totalInitial.toLocaleString('pt-BR')}%0A%0APodemos agendar um bate-papo para alinhar os detalhes?`;

      // Telefone de atendimento (padrão com link configurável)
      simWhatsappBtn.href = `https://api.whatsapp.com/send?phone=5511999999999&text=${message}`;
    }
  }

  // Initial calculation
  calculateTotal();
}

/* ==========================================================================
   PORTFOLIO FILTERS
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('main-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value.trim();

    if (!name || !phone) {
      alert('Por favor, preencha seu nome e telefone para contato.');
      return;
    }

    const whatsappMessage = `Olá, Equipe Com1Site! 👋%0A%0AMeu nome é *${encodeURIComponent(name)}*.%0A📞 *Telefone:* ${encodeURIComponent(phone)}%0A📧 *E-mail:* ${encodeURIComponent(email || 'Não informado')}%0A🎯 *Interesse:* ${encodeURIComponent(service)}%0A%0A💬 *Mensagem:*%0A${encodeURIComponent(message || 'Gostaria de mais informações sobre os serviços da Com1Site.')}`;

    // Open WhatsApp
    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${whatsappMessage}`, '_blank');
    contactForm.reset();
  });
}
