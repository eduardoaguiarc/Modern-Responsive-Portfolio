document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Reveal ao rolar a página ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('active'));
  }

  /* ---------- Aba ativa conforme a seção visível ---------- */
  const tabs = document.querySelectorAll('.tab');
  const sections = [...tabs].map((tab) => document.querySelector(tab.getAttribute('href')));
  const setActiveTab = () => {
    const scrollPos = window.scrollY + window.innerHeight * 0.3;
    let current = sections[0];
    sections.forEach((sec) => { if (sec && sec.offsetTop <= scrollPos) current = sec; });
    tabs.forEach((tab) => tab.classList.toggle('is-active', tab.getAttribute('href') === `#${current.id}`));
  };
  window.addEventListener('scroll', setActiveTab, { passive: true });

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const tabsNav = document.getElementById('tabs');
  if (menuToggle && tabsNav) {
    menuToggle.addEventListener('click', () => tabsNav.classList.toggle('is-open'));
    tabsNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => tabsNav.classList.remove('is-open')));
  }

  /* ---------- Efeito de "digitação" no terminal do hero ---------- */
  const terminalBody = document.getElementById('terminal-body');
  const lines = [
    { prompt: '$ whoami', response: 'Eduardo — Estudante de Engenharia de Software' },
    { prompt: '$ cat foco.txt', response: 'Backend com Java + Spring Boot (e frontend também)' },
    { prompt: '$ echo $OBJETIVO', response: 'Conseguir uma vaga de estágio e melhorar como dev' },
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderStatic() {
    terminalBody.innerHTML = lines
      .map((l) => `<span class="line-prompt">${l.prompt}</span>\n${l.response}\n`)
      .join('\n') + '<span class="terminal__cursor"></span>';
  }

  function typeLines() {
    let lineIndex = 0;
    let charIndex = 0;
    let phase = 'prompt'; // 'prompt' -> 'response'
    terminalBody.textContent = '';

    function step() {
      if (lineIndex >= lines.length) {
        const cursor = document.createElement('span');
        cursor.className = 'terminal__cursor';
        terminalBody.appendChild(cursor);
        return;
      }
      const current = lines[lineIndex];
      const target = phase === 'prompt' ? current.prompt : current.response;

      if (charIndex <= target.length) {
        terminalBody.innerHTML = lines
          .slice(0, lineIndex)
          .map((l) => `<span class="line-prompt">${l.prompt}</span>\n${l.response}\n`)
          .join('\n');
        if (lineIndex > 0) terminalBody.innerHTML += '\n';

        if (phase === 'prompt') {
          terminalBody.innerHTML += `<span class="line-prompt">${target.slice(0, charIndex)}</span>`;
        } else {
          terminalBody.innerHTML += `<span class="line-prompt">${current.prompt}</span>\n${target.slice(0, charIndex)}`;
        }
        charIndex++;
        setTimeout(step, phase === 'prompt' ? 45 : 22);
      } else {
        charIndex = 0;
        if (phase === 'prompt') {
          phase = 'response';
          setTimeout(step, 200);
        } else {
          phase = 'prompt';
          lineIndex++;
          setTimeout(step, 350);
        }
      }
    }
    step();
  }

  if (terminalBody) {
    if (prefersReducedMotion) renderStatic();
    else typeLines();
  }

  /* ---------- Formulário de contato -> abre o cliente de e-mail ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = data.get('nome') || '';
      const email = data.get('email') || '';
      const mensagem = data.get('mensagem') || '';

      const subject = encodeURIComponent(`Contato pelo portfólio — ${nome}`);
      const body = encodeURIComponent(`${mensagem}\n\n— ${nome} (${email})`);

      // Substitua "seu-email@exemplo.com" pelo seu e-mail real
      window.location.href = `mailto:seu-email@exemplo.com?subject=${subject}&body=${body}`;
    });
  }
});
