(() => {
  'use strict';

  const root = document.body.dataset.root || './';
  const lessonLinks = Array.from({ length: 11 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<li><a class="dropdown-item" href="${root}aulas/aula-${n}.html">Aula ${n}</a></li>`;
  }).join('');

  const nav = `
    <a class="skip-link" href="#conteudo">Pular para o conteúdo principal</a>
    <nav class="navbar navbar-expand-lg site-nav sticky-top" role="navigation" aria-label="Navegação principal">
      <div class="container">
        <a class="navbar-brand brand" href="${root}index.html">UC 9 · Materiais & Patrimônio</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Abrir menu"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item"><a class="nav-link" href="${root}index.html">Home</a></li>
            <li class="nav-item dropdown"><button class="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" aria-expanded="false">Trilha de aulas</button><ul class="dropdown-menu">${lessonLinks}</ul></li>
            <li class="nav-item dropdown"><button class="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" aria-expanded="false">Recursos</button><ul class="dropdown-menu">
              <li><a class="dropdown-item" href="${root}recursos/calculadoras.html">Calculadoras</a></li>
              <li><a class="dropdown-item" href="${root}recursos/glossario.html">Glossário</a></li>
              <li><a class="dropdown-item" href="${root}recursos/como-usar-ia.html">Como usar IA</a></li>
            </ul></li>
          </ul>
          <div class="access-tools ms-lg-3" aria-label="Ferramentas de acessibilidade">
            <button class="btn btn-sm btn-outline-light" type="button" data-font="down" aria-label="Diminuir fonte">A−</button>
            <button class="btn btn-sm btn-outline-light" type="button" data-font="reset" aria-label="Restaurar fonte">A</button>
            <button class="btn btn-sm btn-outline-light" type="button" data-font="up" aria-label="Aumentar fonte">A+</button>
            <button class="btn btn-sm btn-outline-light" type="button" id="contrastToggle" aria-pressed="false">Contraste</button>
            <button class="btn btn-sm btn-orange" type="button" id="themeToggle" aria-label="Alternar tema">🌙 Tema</button>
          </div>
        </div>
      </div>
    </nav>`;

  const footer = `<footer class="footer" role="contentinfo"><div class="container"><p class="mb-1"><strong>Material didático produzido para a UC 9 — Técnico em Administração — Senac SP</strong></p><p class="mb-0">Turma ADM N-33 · Docente: Leandro Pereira · 2026</p></div></footer>`;

  document.getElementById('site-header')?.insertAdjacentHTML('afterbegin', nav);
  document.getElementById('site-footer')?.insertAdjacentHTML('afterbegin', footer);

  const savedTheme = localStorage.getItem('uc9_theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  const themeBtn = document.getElementById('themeToggle');
  const refreshThemeLabel = () => {
    if (themeBtn) themeBtn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️ Tema' : '🌙 Tema';
  };
  refreshThemeLabel();
  themeBtn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('uc9_theme', next);
    refreshThemeLabel();
  });

  let fontScale = 1;
  document.querySelectorAll('[data-font]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.font;
    fontScale = action === 'up' ? Math.min(1.25, fontScale + .1) : action === 'down' ? Math.max(.85, fontScale - .1) : 1;
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }));
  document.getElementById('contrastToggle')?.addEventListener('click', event => {
    const active = document.body.classList.toggle('high-contrast');
    event.currentTarget.setAttribute('aria-pressed', String(active));
  });

  // Mantém menus e acordeões utilizáveis quando o Bootstrap CDN não carregar.
  if (!window.bootstrap) {
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => button.addEventListener('click', () => {
      const selector = button.getAttribute('data-bs-target');
      const target = selector ? document.querySelector(selector) : null;
      if (!target) return;
      const willOpen = !target.classList.contains('show');
      const parentSelector = target.getAttribute('data-bs-parent');
      if (willOpen && parentSelector) {
        document.querySelectorAll(`${parentSelector} .accordion-collapse.show`).forEach(open => {
          if (open !== target) open.classList.remove('show');
        });
        document.querySelectorAll(`${parentSelector} [data-bs-toggle="collapse"]`).forEach(control => control.setAttribute('aria-expanded', 'false'));
      }
      target.classList.toggle('show', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
      button.classList.toggle('collapsed', !willOpen);
    }));
  }

  const toast = message => {
    const node = document.createElement('div');
    node.className = 'toast-local';
    node.setAttribute('role', 'status');
    node.textContent = message;
    document.body.append(node);
    setTimeout(() => node.remove(), 1800);
  };

  document.addEventListener('click', async event => {
    const copy = event.target.closest('[data-copy]');
    if (!copy) return;
    const target = document.getElementById(copy.dataset.copy);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.innerText);
      toast('Conteúdo copiado.');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      toast('Conteúdo selecionado; pressione Ctrl+C.');
    }
  });
})();
