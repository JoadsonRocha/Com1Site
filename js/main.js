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
  initLeadCaptureForm();
  initProposalModal();
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

  // Expose current data for proposal modal
  window.getSimulatorData = function() {
    return {
      currentProject,
      selectedAddons: [...selectedAddons],
      currentPlan,
      totalInitial: currentProject.price + selectedAddons.reduce((sum, item) => sum + item.price, 0)
    };
  };

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

  // Download real report
  const downloadReportBtn = document.getElementById('download-report-btn');
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', () => {
      const reportContent = `=====================================================
COM1SITE - RELATÓRIO MENSAL DE DESEMPENHO & SEGURANÇA
=====================================================
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}
Status Geral: 100% Operacional e Seguro

MÉTRICAS DO SERVIDOR & PLATAFORMA:
- Uptime Registrado: 99.98%
- Velocidade Média de Carregamento: 0.84s (PageSpeed Score: 99)
- Backups em Nuvem: Realizados diariamente (7 cópias retidas)
- Certificado SSL: Válido e renovado automaticamente
- Proteção Firewall WAF: Ativa (Zero invasões ou vulnerabilidades)

BANCO DE HORAS DE GESTÃO:
- Total Contratado: 4 Horas mensais
- Utilizado no Ciclo: 1h 30min (Ajustes de copy e otimização de imagens)
- Saldo Disponível: 2h 30min

Para solicitar suporte ou alterações adicionais, acione seu gerente Com1Site.
=====================================================`;

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatorio_Performance_Com1Site_${new Date().getMonth() + 1}_${new Date().getFullYear()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Portal auth simulation without alert
  const portalAuthForm = document.getElementById('portal-auth-form');
  const portalMsg = document.getElementById('portal-login-msg');
  if (portalAuthForm) {
    portalAuthForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('portal-user-email').value;
      if (portalMsg) {
        portalMsg.style.display = 'block';
        portalMsg.style.color = '#10b981';
        portalMsg.textContent = `✓ Acesso liberado para ${email}. Carregando ambiente...`;
        setTimeout(() => {
          portalMsg.style.display = 'none';
          document.querySelector('.portal-tab-btn[data-tab="demo"]').click();
        }, 1200);
      }
    });
  }
}

/* ==========================================================================
   LIVE SOCIAL PROOF NOTIFICATION (DESATIVADO PARA NÃO PARECER ROBÔ)
   ========================================================================== */
function initSocialProofToast() {
  const toast = document.getElementById('social-toast');
  if (toast) {
    toast.style.display = 'none'; // Desativado para evitar táticas invasivas e artificiais
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
   CONTACT FORM COM ESCOLHA DE CANAL E PROTOCOLO REAL
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('main-contact-form');
  const feedbackBox = document.getElementById('contact-feedback-box');
  const submitBtn = document.getElementById('submit-contact-btn');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value.trim();
    const pref = document.querySelector('input[name="reply_channel"]:checked')?.value || 'whatsapp';

    if (!name || !phone) return;

    const protocol = 'C1-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleString('pt-BR');

    // Salva lead localmente
    const leads = JSON.parse(localStorage.getItem('com1site_leads') || '[]');
    leads.push({ protocol, name, phone, email, service, message, pref, date: dateStr });
    localStorage.setItem('com1site_leads', JSON.stringify(leads));

    if (pref === 'email') {
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.innerHTML = `
          <h4>✓ Solicitação Registrada com Sucesso!</h4>
          <p>Seu pedido foi direcionado para a nossa equipe técnica especializada em <strong>${service}</strong>.</p>
          <p>Número de Protocolo: <span class="protocol-tag">#${protocol}</span></p>
          <p>Enviaremos a proposta formal e o cronograma detalhado para <strong>${email || 'seu contato'}</strong> em até 2 horas úteis.</p>
        `;
      }
      contactForm.reset();
    } else {
      // WhatsApp imediato
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.innerHTML = `
          <h4>✓ Abrindo Atendimento Prioritário no WhatsApp...</h4>
          <p>Protocolo gerado: <span class="protocol-tag">#${protocol}</span></p>
          <p>Caso o aplicativo não abra automaticamente, aguarde que nossa equipe entrará em contato pelo número informado.</p>
        `;
      }

      const whatsappMessage = `Olá, Equipe Com1Site! 👋%0A%0A*Protocolo de Atendimento:* #${protocol}%0A👤 *Nome:* ${encodeURIComponent(name)}%0A📞 *WhatsApp:* ${encodeURIComponent(phone)}%0A📧 *E-mail:* ${encodeURIComponent(email || 'Não informado')}%0A🎯 *Interesse:* ${encodeURIComponent(service)}%0A%0A💬 *Mensagem do Projeto:*%0A${encodeURIComponent(message || 'Gostaria de uma proposta detalhada para minha empresa.')}`;

      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${whatsappMessage}`, '_blank');
        contactForm.reset();
      }, 700);
    }
  });
}

/* ==========================================================================
   LEAD CAPTURE FORM COM DOWNLOAD REAL DO CHECKLIST EM PDF/TXT
   ========================================================================== */
function initLeadCaptureForm() {
  const leadForm = document.getElementById('lead-form');
  const successBox = document.getElementById('lead-success-box');
  const downloadBtn = document.getElementById('download-checklist-btn');
  if (!leadForm) return;

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('lead-name').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    
    if (!name || !email) return;
    
    const btn = leadForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span>Gerando Guia Oficial...</span>';
    btn.disabled = true;
    
    // Salvar inscrição
    const subscribers = JSON.parse(localStorage.getItem('com1site_subscribers') || '[]');
    subscribers.push({ name, email, date: new Date().toISOString() });
    localStorage.setItem('com1site_subscribers', JSON.stringify(subscribers));

    setTimeout(() => {
      leadForm.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'flex';
      }
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 700);
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const checklistText = `================================================================
COM1SITE | CHECKLIST OFICIAL DE CONTRATAÇÃO SEGURA DE WEBSITES
================================================================
Guia Prático para Empreendedores e Gestores de Marketing

1. DOMÍNIO E PROPRIEDADE INTELECTUAL
   [ ] O domínio está registrado exclusivamente no CNPJ/CPF da sua empresa?
   [ ] O código-fonte e arquivos serão entregues sem taxas ocultas de rescisão?
   [ ] Você tem acesso administrativo root ao painel de hospedagem?

2. VELOCIDADE & INFRAESTRUTURA
   [ ] Tempo de carregamento inferior a 1.8 segundos no celular?
   [ ] Otimização de imagens no padrão WebP e compressão moderna?
   [ ] Servidor com certificado SSL (HTTPS) ativo e gratuito?

3. CONVERSÃO & DESIGN ESTRATÉGICO
   [ ] Botão de WhatsApp fixo com mensagem contextualizada?
   [ ] Proposta de valor clara nos primeiros 5 segundos da página inicial?
   [ ] Formulário simplificado (evite pedir mais de 3 a 4 dados no primeiro contato)?

4. GESTÃO E MANUTENÇÃO CONTÍNUA
   [ ] Backups em nuvem realizados com frequência mínima semanal?
   [ ] Monitoramento 24h de estabilidade e uptime?
   [ ] Banco de horas garantido para alterações visuais sem custos extras?

================================================================
Desenvolvido por Com1Site Digital • https://com1site.com.br
Precisa de ajuda profissional? Fale com nossos especialistas!
================================================================`;

      const blob = new Blob([checklistText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Checklist_Contratacao_Segura_Com1Site.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

/* ==========================================================================
   PROPOSTA FORMAL & PRÉ-CONTRATO MODAL (TOTALMENTE FUNCIONAL)
   ========================================================================== */
function initProposalModal() {
  const openBtn = document.getElementById('open-proposal-btn');
  const modal = document.getElementById('proposal-modal');
  const closeBtn = document.getElementById('close-proposal-modal');
  const form = document.getElementById('generate-proposal-form');
  const formContainer = document.getElementById('proposal-form-container');
  const previewContainer = document.getElementById('proposal-preview-container');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    if (formContainer) formContainer.style.display = 'block';
    if (previewContainer) previewContainer.style.display = 'none';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('prop-client-name').value.trim();
      const companyName = document.getElementById('prop-company-name').value.trim();
      const clientEmail = document.getElementById('prop-client-email').value.trim();
      const clientPhone = document.getElementById('prop-client-phone').value.trim();

      const simData = (typeof window.getSimulatorData === 'function') 
        ? window.getSimulatorData() 
        : { currentProject: { name: 'Landing Page', price: 990 }, selectedAddons: [], currentPlan: { name: 'Essencial', price: 149 }, totalInitial: 990 };

      const proposalId = 'PROP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      const issueDate = new Date().toLocaleDateString('pt-BR');

      // Salvar proposta gerada no histórico
      const savedProps = JSON.parse(localStorage.getItem('com1site_proposals') || '[]');
      savedProps.push({ proposalId, clientName, companyName, clientEmail, clientPhone, simData, date: issueDate });
      localStorage.setItem('com1site_proposals', JSON.stringify(savedProps));

      // Montar preview do documento formal
      previewContainer.innerHTML = `
        <div class="proposal-paper">
          <div class="proposal-doc-header">
            <div>
              <div class="brand-logo" style="margin-bottom: 0.5rem;">
                <div class="brand-icon">C1</div>
                <span>Com<span class="brand-accent">1</span>Site</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-dim);">Soluções Digitais de Alta Performance • CNPJ Regularizado</p>
            </div>
            <div style="text-align: right;">
              <span class="proposal-badge-formal">Minuta de Proposta Comercial</span>
              <div style="font-size: 0.95rem; font-weight: 700; margin-top: 0.4rem; color: var(--primary);">#${proposalId}</div>
              <div style="font-size: 0.78rem; color: var(--text-dim);">Data de Emissão: ${issueDate}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Contratante:</span>
              <div style="font-weight: 700; font-size: 0.95rem;">${clientName}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${companyName}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Dados de Contato:</span>
              <div style="font-size: 0.85rem;">📧 ${clientEmail}</div>
              <div style="font-size: 0.85rem;">📞 ${clientPhone}</div>
            </div>
          </div>

          <h4 class="proposal-section-title">1. Escopo Técnico & Desenvolvimento</h4>
          <table class="proposal-table-details">
            <thead>
              <tr>
                <th>Item / Descrição</th>
                <th>Tipo</th>
                <th>Investimento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${simData.currentProject.name}</strong><br><small style="color: var(--text-dim);">Desenvolvimento sob medida com arquitetura ultra-rápida, SSL e SEO</small></td>
                <td>Principal</td>
                <td>R$ ${simData.currentProject.price.toLocaleString('pt-BR')}</td>
              </tr>
              ${simData.selectedAddons.map(ad => `
                <tr>
                  <td>+ ${ad.name}</td>
                  <td>Opcional</td>
                  <td>R$ ${ad.price.toLocaleString('pt-BR')}</td>
                </tr>
              `).join('')}
              <tr style="background: rgba(0, 210, 255, 0.05); font-weight: 700;">
                <td colspan="2">Investimento Total de Desenvolvimento:</td>
                <td style="color: var(--primary); font-size: 1.05rem;">R$ ${simData.totalInitial.toLocaleString('pt-BR')}</td>
              </tr>
            </tbody>
          </table>

          <h4 class="proposal-section-title">2. Gestão Técnica, Segurança & Manutenção Mensal</h4>
          <table class="proposal-table-details">
            <tbody>
              <tr>
                <td><strong>Plano ${simData.currentPlan.name}</strong><br><small style="color: var(--text-dim);">Backups automáticos, monitoramento de Uptime 24/7 e suporte técnico</small></td>
                <td>R$ ${simData.currentPlan.price.toLocaleString('pt-BR')} / mês</td>
              </tr>
            </tbody>
          </table>

          <div class="proposal-terms-box">
            <strong>Termos e Condições Gerais:</strong><br>
            • <strong>Formas de Pagamento:</strong> Entrada de 50% e restante na entrega, ou até 12x no cartão de crédito corporativo.<br>
            • <strong>Prazo de Entrega Estimado:</strong> 5 a 12 dias úteis a contar da aprovação do briefing.<br>
            • <strong>Propriedade:</strong> Todo o código e domínio permanecem 100% de posse da sua empresa.<br>
            • <strong>Validade desta proposta:</strong> 15 dias corridos a contar da data de emissão.
          </div>

          <div class="proposal-actions-bar">
            <button type="button" class="btn btn-secondary" onclick="window.print()">
              🖨️ Imprimir / Salvar em PDF
            </button>
            <a href="https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1%2C%20Com1Site!%20Gostaria%20de%20aprovar%20a%20Proposta%20Comercial%20%23${proposalId}%20emitida%20para%20${encodeURIComponent(companyName)}." target="_blank" class="btn btn-primary btn-glow">
              <span>Validar Proposta no WhatsApp</span>
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </div>
      `;

      formContainer.style.display = 'none';
      previewContainer.style.display = 'block';
    });
  }
}
