/* VETTA EDU — Laboratório de Prompts */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const PROMPTS = window.VETTA_PROMPTS;

  function cardPrompt(p, idx) {
    const id = "promptTxt" + idx;
    return `
    <div class="prompt-card">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <span class="badge badge-classe-B mb-1">Etapa ${p.etapa}</span>
          <h3 class="h6 mb-1">${UI.esc(p.titulo)}</h3>
        </div>
        ${UI.copyButton(id, "Copiar prompt")}
      </div>
      <p class="small mb-1"><strong>Objetivo:</strong> ${UI.esc(p.objetivo)}</p>
      <p class="small text-muted mb-2"><strong>Quando usar:</strong> ${UI.esc(p.quando)}</p>
      <div class="prompt-text" id="${id}">${UI.esc(p.texto)}</div>
      <div class="row small mt-2">
        <div class="col-md-6"><strong>Dados de exemplo:</strong> ${UI.esc(p.exemploDados)}</div>
        <div class="col-md-6"><strong>Resultado esperado:</strong> ${UI.esc(p.resultadoEsperado)}</div>
        <div class="col-md-6 mt-1"><strong>Como conferir:</strong> ${UI.esc(p.conferir)}</div>
        <div class="col-md-6 mt-1"><strong>Limitações da IA:</strong> ${UI.esc(p.limitacoes)}</div>
      </div>
      <div class="alert alert-light border mt-2 mb-0 small"><strong>Como ajuda na rotina profissional?</strong> ${UI.esc(p.aplicacao)}</div>
    </div>`;
  }

  window.VETTA_VIEWS.prompts = function () {
    const filtros = [0, 1, 2, 3, 4, 5, 6].map((n) => n === 0
      ? `<button class="btn btn-sm btn-vetta-primary me-1 mb-1" data-filtro="todas">Todas</button>`
      : `<button class="btn btn-sm btn-outline-primary me-1 mb-1" data-filtro="${n}">Etapa ${n}</button>`
    ).join("");

    return `
    <div class="vetta-hero">
      <h1 class="h3 mb-1">💬 Laboratório de Prompts</h1>
      <p class="mb-0">Aprendendo a resolver problemas de gestão de materiais e patrimônio com Inteligência Artificial.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h5">🧩 Estrutura padrão de um bom prompt</h2>
      <p>Todos os prompts desta biblioteca seguem o modelo: <strong>Papel + Contexto + Dados + Tarefa + Regras + Formato de saída + Verificação</strong>.</p>
      <div class="row small">
        <div class="col-md-6"><strong>Papel:</strong> quem a IA deve "ser" ao responder (ex.: analista de estoques).</div>
        <div class="col-md-6"><strong>Contexto:</strong> a situação da VETTA relevante para a tarefa.</div>
        <div class="col-md-6"><strong>Dados:</strong> os números e informações concretas a usar.</div>
        <div class="col-md-6"><strong>Tarefa:</strong> o que exatamente deve ser calculado ou produzido.</div>
        <div class="col-md-6"><strong>Regras:</strong> restrições e cuidados para evitar erros comuns.</div>
        <div class="col-md-6"><strong>Formato de saída:</strong> como o resultado deve ser organizado.</div>
      </div>
      <p class="small text-muted mt-2 mb-0"><strong>Verificação</strong> é o passo final: sempre confira a resposta da IA contra um cálculo próprio ou contra o gabarito do site — a IA apoia a análise, mas não substitui a validação humana.</p>
    </div>

    <div class="vetta-card">
      <div class="mb-2">${filtros}</div>
      <div id="listaPrompts">${PROMPTS.map((p, i) => cardPrompt(p, i)).join("")}</div>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "laboratorio-prompts") return;
    document.querySelectorAll("[data-filtro]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-filtro]").forEach((b) => b.classList.replace("btn-vetta-primary", "btn-outline-primary"));
        btn.classList.replace("btn-outline-primary", "btn-vetta-primary");
        const filtro = btn.getAttribute("data-filtro");
        const lista = document.getElementById("listaPrompts");
        const filtrados = filtro === "todas" ? PROMPTS : PROMPTS.filter((p) => String(p.etapa) === filtro);
        lista.innerHTML = filtrados.map((p) => cardPrompt(p, PROMPTS.indexOf(p))).join("");
        window.VETTA_UI.bindCopyButtons(lista);
      });
    });
  });
})();
