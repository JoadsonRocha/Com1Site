/**
 * Com1Site - Interactive Core Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initSimulator();
  initPortfolioFilters();
  initPortfolioModal();
  initPortalModal();
  initSocialProofToast();
  initFaqAccordion();
  initContactForm();
});

/* ==========================================================================
   THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check stored theme or default to dark
  const savedTheme = localStorage.getItem('com1site_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('com1site_theme', newTheme);
      updateIcon(newTheme);
    });
  }

  function updateIcon(theme) {
    if (!themeIcon) return;
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('title', theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro');
  }
}

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

  // Close mobile menu on link click
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
    checkbox.addEventListener('change', () => {
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

      simWhatsappBtn.href = `https://api.whatsapp.com/send?phone=5511999999999&text=${message}`;
    }
  }

  // Initial calculation
  calculateTotal();
}

/* ==========================================================================
   PORTFOLIO FILTERS & MODAL
   ========================================================================== */
const projectDetailsData = {
  p1: {
    title: 'Nexus AI Analytics - Landing Page',
    category: 'Landing Page de Alta Conversão',
    result: '+34% de aumento na taxa de conversão em leads B2B',
    deliveryTime: '5 dias úteis',
    pageSpeed: '99/100 Mobile',
    description: 'Desenvolvemos uma Landing Page institucional focada no público corporativo com estética Dark Glassmorphism, integrações de formulário dinâmico e carregamento instantâneo para reduzir custo por clique no Google Ads.',
    technologies: ['HTML5 Semântico', 'CSS3 Puro & Glassmorphism', 'Vanilla JS', 'Integração Webhook CRM']
  },
  p2: {
    title: 'Clínica BioHealth - Portal Médico',
    category: 'Site Institucional & Portais',
    result: '+80 consultas mensais agendadas diretamente pelo site',
    deliveryTime: '10 dias úteis',
    pageSpeed: '98/100 Mobile',
    description: 'Criação da identidade digital da Clínica BioHealth, integrando catálogo de especialidades, agendamento de consultas via WhatsApp automatizado e blog focado em SEO de termos de saúde.',
    technologies: ['Multi-páginas', 'SEO Estruturado', 'Sistema de Agendamento', 'Layout Responsivo']
  },
  p3: {
    title: 'Urban Trend - E-commerce Streetwear',
    category: 'Loja Virtual & E-commerce',
    result: 'Faturamento de R$ 45k no primeiro mês de lançamento',
    deliveryTime: '18 dias úteis',
    pageSpeed: '96/100 Mobile',
    description: 'Construção de uma loja virtual ágil e minimalista com fluxo de checkout simplificado via Pix em 1 clique, recuperação de carrinho automática e sincronização com catálogo do Instagram.',
    technologies: ['Checkout Transparente', 'Cálculo de Frete Correios', 'Anti-Fraude', 'Mobile First']
  },
  p4: {
    title: 'Portal do Cliente & Gestão Com1',
    category: 'Sistema Web & Painel SaaS',
    result: '100% dos clientes gerenciados em um painel unificado',
    deliveryTime: 'Solução Integrada',
    pageSpeed: '100/100',
    description: 'Sistema completo da agência Com1Site onde o cliente acompanha em tempo real a evolução do seu projeto, chamados de manutenção e relatórios de tráfego.',
    technologies: ['Arquitetura Modular', 'API Rest', 'Dashboard Analytics', 'Gestão de Faturas']
  }
};

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

function initPortfolioModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const modalContent = document.getElementById('modal-project-content');
  const projectCards = document.querySelectorAll('.project-card-item');

  if (!modal || !modalContent) return;

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.id;
      const data = projectDetailsData[projectId];
      if (!data) return;

      modalContent.innerHTML = `
        <span class="section-tag" style="margin-bottom: 0.5rem;">${data.category}</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 1rem;">${data.title}</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); padding: 0.8rem; border-radius: 8px;">
            <div style="font-size: 0.75rem; color: var(--text-dim);">Resultado Chave</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #10b981;">${data.result}</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); padding: 0.8rem; border-radius: 8px;">
            <div style="font-size: 0.75rem; color: var(--text-dim);">Tempo de Entrega</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--primary);">${data.deliveryTime}</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); padding: 0.8rem; border-radius: 8px;">
            <div style="font-size: 0.75rem; color: var(--text-dim);">PageSpeed Score</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #38bdf8;">${data.pageSpeed}</div>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${data.description}
        </p>

        <h4 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.8rem;">Diferenciais & Tecnologias:</h4>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
          ${data.technologies.map(t => `<span class="portfolio-tag-badge" style="padding: 0.3rem 0.8rem; font-size: 0.82rem;">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="#simulador" class="btn btn-primary btn-glow" onclick="document.getElementById('project-modal').classList.remove('open');">
            Simular Projeto Parecido
          </a>
          <button class="btn btn-secondary" onclick="document.getElementById('project-modal').classList.remove('open');">
            Fechar
          </button>
        </div>
      `;

      modal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

/* ==========================================================================
   PORTAL DO CLIENTE MODAL
   ========================================================================== */
function initPortalModal() {
  const portalModal = document.getElementById('portal-modal');
  const openBtn = document.getElementById('open-portal-btn');
  const closeBtn = document.getElementById('close-portal-modal');
  const tabs = document.querySelectorAll('.portal-tab-btn');

  if (!portalModal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => portalModal.classList.add('open'));
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => portalModal.classList.remove('open'));
  }

  portalModal.addEventListener('click', (e) => {
    if (e.target === portalModal) portalModal.classList.remove('open');
  });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.dataset.tab;
      document.getElementById('tab-demo').style.display = targetTab === 'demo' ? 'block' : 'none';
      document.getElementById('tab-login').style.display = targetTab === 'login' ? 'block' : 'none';
    });
  });
}

/* ==========================================================================
   LIVE SOCIAL PROOF NOTIFICATION
   ========================================================================== */
function initSocialProofToast() {
  const toast = document.getElementById('social-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastSubtitle = document.getElementById('toast-subtitle');
  const closeToast = document.getElementById('close-toast');

  if (!toast) return;

  const proofs = [
    { title: 'Novo projeto de Landing Page', subtitle: 'Iniciado para cliente em São Paulo • há 6 min' },
    { title: 'Orçamento de Loja Virtual', subtitle: 'Simulado por empresa em Curitiba • há 14 min' },
    { title: 'Site Institucional Publicado 🚀', subtitle: 'Clínica Odontológica em BH • há 28 min' },
    { title: 'Avaliação 5 Estrelas Recebida ⭐', subtitle: 'Nexo Soluções • há 45 min' }
  ];

  let currentIndex = 0;
  let isClosed = false;

  function showNextProof() {
    if (isClosed) return;

    const current = proofs[currentIndex];
    toastTitle.textContent = current.title;
    toastSubtitle.textContent = current.subtitle;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      currentIndex = (currentIndex + 1) % proofs.length;
    }, 4500);
  }

  // First trigger after 4s, then cycle every 14s
  setTimeout(() => {
    showNextProof();
    setInterval(showNextProof, 14000);
  }, 4000);

  if (closeToast) {
    closeToast.addEventListener('click', () => {
      toast.classList.remove('show');
      isClosed = true;
    });
  }
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

    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${whatsappMessage}`, '_blank');
    contactForm.reset();
  });
}
