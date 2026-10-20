/* VETTA EDU — Simulador Gerencial Integrado */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const C = window.VETTA_CALC;
  const D = window.VETTA_DATA;

  const CENARIOS = {
    original: {
      nome: "Cenário original (case)",
      demandaAnual: 900, custoUnitario: 210, custoPedido: 84, taxaManutencao: 20,
      tempoReposicao: 10, consumoMaximo: 5, qAtual: 150
    },
    risco: {
      nome: "Cenário de risco (simulação)",
      demandaAnual: 1260, custoUnitario: 210, custoPedido: 84, taxaManutencao: 20,
      tempoReposicao: 18, consumoMaximo: 8, qAtual: 150
    },
    melhoria: {
      nome: "Cenário de melhoria (simulação)",
      demandaAnual: 900, custoUnitario: 205, custoPedido: 60, taxaManutencao: 18,
      tempoReposicao: 5, consumoMaximo: 4.5, qAtual: 150
    }
  };

  let estado = { ...CENARIOS.original };

  function calcular() {
    return C.politicaReposicaoCompleta({
      demandaAnual: estado.demandaAnual, custoUnitario: estado.custoUnitario,
      custoPedido: estado.custoPedido, taxaManutencao: estado.taxaManutencao / 100,
      diasUteis: D.empresa.diasUteisAno, tempoReposicao: estado.tempoReposicao,
      consumoMaximo: estado.consumoMaximo, qAtual: estado.qAtual, saldoAtual: D.reposicaoToner.saldoAtual
    });
  }

  function painelResultados() {
    const r = calcular();
    const ehCenarioOriginal = JSON.stringify(estado) === JSON.stringify(CENARIOS.original);
    return `
      <div class="row g-2">
        <div class="col-6 col-md-3">${UI.statTile(UI.br(r.cmed,2) + " un/dia", "consumo médio diário")}</div>
        <div class="col-6 col-md-3">${UI.statTile(C.fmtMoeda(r.h), "custo de manter (H)")}</div>
        <div class="col-6 col-md-3">${UI.statTile(UI.br(r.lec,1) + " un", "LEC")}</div>
        <div class="col-6 col-md-3">${UI.statTile(UI.br(r.n,1), "pedidos/ano")}</div>
        <div class="col-6 col-md-3">${UI.statTile(UI.br(r.ss,1) + " un", "estoque de segurança")}</div>
        <div class="col-6 col-md-3">${UI.statTile(UI.br(r.pp,1) + " un", "ponto de pedido")}</div>
        <div class="col-6 col-md-3">${UI.statTile(UI.br(r.emax,1) + " un", "estoque máximo")}</div>
        <div class="col-6 col-md-3">${UI.statTile(UI.br(r.emed,1) + " un", "estoque médio")}</div>
      </div>
      <div class="row g-2 mt-1">
        <div class="col-6 col-md-4">${UI.statTile(C.fmtMoeda(r.ctAtual.total), "custo total — política atual")}</div>
        <div class="col-6 col-md-4">${UI.statTile(C.fmtMoeda(r.ctLec.total), "custo total — política LEC")}</div>
        <div class="col-6 col-md-4">${UI.statTile(C.fmtMoeda(r.economiaAnual), "economia anual")}</div>
      </div>
      ${!ehCenarioOriginal ? `<p class="small text-warning mt-2 mb-0"><i class="bi bi-exclamation-triangle"></i> Estes resultados usam parâmetros <strong>simulados</strong>, diferentes do case original — não substituem o gabarito oficial da Etapa 2.</p>` : `<p class="small text-success mt-2 mb-0"><i class="bi bi-check-circle"></i> Estes são os parâmetros originais do case VETTA.</p>`}
    `;
  }

  function sliders() {
    return `
    ${UI.sliderRow("simDemanda", "Demanda anual (D)", 100, 2000, 10, estado.demandaAnual, " un")}
    ${UI.sliderRow("simCustoUnit", "Custo unitário (Cu)", 50, 500, 1, estado.custoUnitario, " R$")}
    ${UI.sliderRow("simCustoPedido", "Custo do pedido (S)", 10, 300, 1, estado.custoPedido, " R$")}
    ${UI.sliderRow("simTaxaManutencao", "Taxa de manutenção (i)", 5, 50, 1, estado.taxaManutencao, " %")}
    ${UI.sliderRow("simTR", "Tempo de reposição (TR)", 1, 30, 1, estado.tempoReposicao, " dias")}
    ${UI.sliderRow("simCmax", "Consumo máximo diário", 1, 20, 0.5, estado.consumoMaximo, " un/dia")}
    ${UI.sliderRow("simQAtual", "Política atual (Q)", 20, 400, 10, estado.qAtual, " un")}`;
  }

  window.VETTA_VIEWS.simulador = function () {
    estado = { ...CENARIOS.original };
    return `
    <div class="vetta-hero">
      <h1 class="h3 mb-1">🎛️ Simulador Gerencial Integrado</h1>
      <p class="mb-0">Altere os parâmetros da política de reposição do toner e veja o LEC, o SS, o PP e os custos recalculados na hora.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h5">Cenários prontos</h2>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-sm btn-vetta-primary" data-cenario="original">Cenário original</button>
        <button class="btn btn-sm btn-outline-danger" data-cenario="risco">Cenário de risco</button>
        <button class="btn btn-sm btn-outline-success" data-cenario="melhoria">Cenário de melhoria</button>
      </div>
      <p class="small text-muted mt-2 mb-0">O cenário original restaura exatamente os números do Guia do Docente. Os cenários de risco e de melhoria usam valores hipotéticos para fins de simulação.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h5">Parâmetros</h2>
      <div id="simSliders">${sliders()}</div>
    </div>

    <div class="vetta-card">
      <h2 class="h5">Resultados</h2>
      <div id="simResultados">${painelResultados()}</div>
    </div>

    <div class="vetta-card">
      <h2 class="h5">Curvas de custo</h2>
      <canvas id="chartLECSim" height="220"></canvas>
    </div>`;
  };

  function redesenharTudo() {
    document.getElementById("simResultados").innerHTML = painelResultados();
    const r = calcular();
    window.VETTA_CHARTS.lecCurveChart("chartLECSim", { demandaAnual: estado.demandaAnual, custoPedido: estado.custoPedido, custoManter: r.h, lecOtimo: r.lec });
  }

  function aplicarCenario(nome) {
    estado = { ...CENARIOS[nome] };
    document.getElementById("simSliders").innerHTML = sliders();
    ligarSliders();
    redesenharTudo();
  }

  function ligarSliders() {
    UI.bindSliders("#simSliders", () => {
      estado.demandaAnual = Number(document.getElementById("simDemanda").value);
      estado.custoUnitario = Number(document.getElementById("simCustoUnit").value);
      estado.custoPedido = Number(document.getElementById("simCustoPedido").value);
      estado.taxaManutencao = Number(document.getElementById("simTaxaManutencao").value);
      estado.tempoReposicao = Number(document.getElementById("simTR").value);
      estado.consumoMaximo = Number(document.getElementById("simCmax").value);
      estado.qAtual = Number(document.getElementById("simQAtual").value);
      redesenharTudo();
    });
  }

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "simulador") return;
    ligarSliders();
    redesenharTudo();
    document.querySelectorAll("[data-cenario]").forEach((btn) => {
      btn.addEventListener("click", () => aplicarCenario(btn.getAttribute("data-cenario")));
    });
  });
})();
