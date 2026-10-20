/* VETTA EDU — Página "Conheça a VETTA" */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const D = window.VETTA_DATA;

  window.VETTA_VIEWS.conheca = function () {
    const personas = D.empresa.personagens.map((p) => `
      <div class="col-sm-6 col-lg-4 col-xl mb-3">
        <div class="vetta-persona-card">
          <div class="emoji mb-1">${p.emoji}</div>
          <h3 class="h6 mb-0">${UI.esc(p.nome)}</h3>
          <div class="text-muted small mb-2">${UI.esc(p.funcao)}</div>
          <p class="small mb-0">No case, ela(e) ${UI.esc(p.papel)}</p>
        </div>
      </div>`).join("");

    return `
    <div class="vetta-hero">
      <h1 class="h3 mb-1">🏢 Conheça a VETTA</h1>
      <p class="mb-0">VETTA Suprimentos &amp; Patrimônio Ltda. — ${UI.esc(D.empresa.cidade)}</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">O que a VETTA faz</h2>
      <p>A VETTA distribui materiais de escritório e de segurança para empresas da região de Guarulhos (SP). Para atender bem, mantém um <strong>almoxarifado próprio</strong> e um <strong>controle patrimonial</strong> dos bens da empresa (equipamentos, móveis e informática).</p>
      <p>Esta plataforma segue o mesmo ano comercial do case: <strong>${D.empresa.diasUteisAno} dias úteis</strong>. Todos os prazos e consumos diários dos cálculos usam dias úteis, não dias corridos.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">👥 A equipe (e a IA) que faz a operação girar</h2>
      <div class="row">${personas}</div>
    </div>

    <div class="vetta-card">
      <h2 class="h4">📏 Regras de trabalho usadas no case</h2>
      <ul>
        <li><strong>Mostre o raciocínio:</strong> fórmula → substituição → cálculo → resultado com unidade (un, R$, dias, %).</li>
        <li><strong>Arredondamentos:</strong> valores em reais com 2 casas; percentuais e índices com 2 casas; quantidades a comprar sempre para o inteiro imediatamente acima quando não forem exatas.</li>
        <li><strong>Ano comercial da VETTA:</strong> ${D.empresa.diasUteisAno} dias úteis.</li>
        <li><strong>Papéis:</strong> cada integrante do grupo assume um personagem e faz o rodízio a cada etapa.</li>
        <li><strong>Sempre confira o resultado:</strong> estoque negativo? preço absurdo? percentual acima de 100%? Se sim, volte e revise o cálculo.</li>
      </ul>
    </div>

    <div class="text-center my-4">
      <a href="#/etapa-1" class="btn btn-vetta-laranja btn-lg"><i class="bi bi-arrow-right-circle"></i> Ir para a Etapa 1 — Curva ABC</a>
    </div>`;
  };
})();
