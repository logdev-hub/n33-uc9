/* VETTA EDU — roteador principal (hash-based), navegação e progresso. */
(function () {
  "use strict";

  const ROTAS = [
    { seção: "Início" },
    { path: "inicio", label: "Início", icon: "bi-house-door", render: () => window.VETTA_VIEWS.home() },
    { path: "conheca-a-vetta", label: "Conheça a VETTA", icon: "bi-building", render: () => window.VETTA_VIEWS.conheca() },
    { seção: "Estudo de caso" },
    { path: "etapa-1", label: "1. Curva ABC", icon: "bi-bar-chart", badge: "35 min", render: () => window.VETTA_VIEWS.etapa1() },
    { path: "etapa-2", label: "2. Reposição (LEC/SS/PP)", icon: "bi-calculator", badge: "55 min", render: () => window.VETTA_VIEWS.etapa2() },
    { path: "etapa-3", label: "3. Indicadores e inventário", icon: "bi-speedometer2", badge: "35 min", render: () => window.VETTA_VIEWS.etapa3() },
    { path: "etapa-4", label: "4. Fornecedores", icon: "bi-truck", badge: "45 min", render: () => window.VETTA_VIEWS.etapa4() },
    { path: "etapa-5", label: "5. Patrimônio", icon: "bi-boxes", badge: "45 min", render: () => window.VETTA_VIEWS.etapa5() },
    { path: "etapa-6", label: "6. Relatório gerencial", icon: "bi-file-earmark-text", badge: "35 min", render: () => window.VETTA_VIEWS.etapa6() },
    { seção: "Ferramentas" },
    { path: "laboratorio-excel", label: "Laboratório Excel", icon: "bi-grid-3x3", render: () => window.VETTA_VIEWS.excelLab() },
    { path: "laboratorio-prompts", label: "Laboratório de Prompts", icon: "bi-chat-dots", render: () => window.VETTA_VIEWS.prompts() },
    { path: "simulador", label: "Simulador Gerencial", icon: "bi-sliders", render: () => window.VETTA_VIEWS.simulador() },
    { path: "vetta-ia", label: "Agente VETTA-IA", icon: "bi-robot", render: () => window.VETTA_VIEWS.copilot() },
    { path: "downloads", label: "Downloads e Materiais", icon: "bi-download", render: () => window.VETTA_VIEWS.downloads() }
  ];

  const ETAPAS_PROGRESSO = ["etapa-1", "etapa-2", "etapa-3", "etapa-4", "etapa-5", "etapa-6"];

  function lerConcluidas() {
    try { return JSON.parse(localStorage.getItem("vetta_progresso") || "[]"); } catch (e) { return []; }
  }
  function marcarConcluida(path) {
    if (!ETAPAS_PROGRESSO.includes(path)) return;
    try {
      const atuais = new Set(lerConcluidas());
      atuais.add(path);
      localStorage.setItem("vetta_progresso", JSON.stringify([...atuais]));
    } catch (e) { /* localStorage indisponível: progresso não é persistido, mas a navegação continua funcionando */ }
    atualizarProgresso();
  }
  function atualizarProgresso() {
    const concluidas = lerConcluidas();
    const pct = Math.round((concluidas.length / ETAPAS_PROGRESSO.length) * 100);
    const fill = document.getElementById("progressFill");
    const label = document.getElementById("progressLabel");
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = pct + "%";
  }

  function montarMenu() {
    const navList = document.getElementById("navList");
    navList.innerHTML = ROTAS.map((r) => {
      if (r.seção) return `<li class="vetta-nav-section-title nav-section-title">${r.seção}</li>`;
      return `<li class="nav-item">
        <a class="nav-link" href="#/${r.path}" data-path="${r.path}">
          <i class="bi ${r.icon}"></i> <span>${r.label}</span>
          ${r.badge ? `<span class="step-badge">${r.badge}</span>` : ""}
        </a>
      </li>`;
    }).join("");
  }

  function currentPath() {
    const hash = location.hash.replace(/^#\/?/, "");
    return hash || "inicio";
  }

  function render() {
    const path = currentPath();
    const rota = ROTAS.find((r) => r.path === path);
    const app = document.getElementById("app");

    document.querySelectorAll("#navList .nav-link").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("data-path") === path);
    });

    if (!rota) {
      app.innerHTML = `<div class="vetta-card"><h2>Página não encontrada</h2><p>Volte para o <a href="#/inicio">início</a>.</p></div>`;
      return;
    }

    try {
      app.innerHTML = rota.render();
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="vetta-card"><h2>Ops, algo deu errado ao carregar esta página.</h2>
        <p class="text-muted">Detalhes técnicos: ${String(err && err.message || err)}</p></div>`;
    }

    document.getElementById("conteudo").focus({ preventScroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
    fecharSidebarMobile();

    if (ETAPAS_PROGRESSO.includes(path)) marcarConcluida(path);

    // Hooks de pós-render (cada view pode registrar o seu em VETTA_VIEWS.afterRenderHooks).
    if (window.VETTA_VIEWS && Array.isArray(window.VETTA_VIEWS.afterRenderHooks)) {
      window.VETTA_VIEWS.afterRenderHooks.forEach((hook) => {
        try { hook(path); } catch (e) { console.error("Erro em afterRenderHook:", e); }
      });
    }
    if (window.VETTA_UI && typeof window.VETTA_UI.bindCopyButtons === "function") {
      window.VETTA_UI.bindCopyButtons(app);
    }
  }

  function abrirSidebarMobile() {
    document.getElementById("sidebarNav").classList.add("open");
    document.getElementById("sidebarBackdrop").classList.add("open");
    document.getElementById("btnMenu").setAttribute("aria-expanded", "true");
  }
  function fecharSidebarMobile() {
    document.getElementById("sidebarNav").classList.remove("open");
    document.getElementById("sidebarBackdrop").classList.remove("open");
    const btn = document.getElementById("btnMenu");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function init() {
    montarMenu();
    atualizarProgresso();
    window.addEventListener("hashchange", render);

    document.getElementById("btnMenu").addEventListener("click", () => {
      const sidebar = document.getElementById("sidebarNav");
      sidebar.classList.contains("open") ? fecharSidebarMobile() : abrirSidebarMobile();
    });
    document.getElementById("sidebarBackdrop").addEventListener("click", fecharSidebarMobile);

    render();
  }

  window.VETTA_APP = { ROTAS, ETAPAS_PROGRESSO, marcarConcluida, atualizarProgresso };
  document.addEventListener("DOMContentLoaded", init);
})();
