/* VETTA EDU — fábricas de gráficos Chart.js. Cada função destrói o gráfico anterior
   da mesma canvas (se existir) antes de criar um novo, para permitir recriação ao
   trocar de view ou reagir ao simulador. */
(function (global) {
  "use strict";
  const registry = {};
  const PALETA = {
    azul: "#064C8C", azulClaro: "#8FB8E0", laranja: "#F7941D", verde: "#2E7D4F",
    cinza: "#9AA7B3", vermelho: "#C0392B"
  };

  function destroy(id) {
    if (registry[id]) { registry[id].destroy(); delete registry[id]; }
  }

  function paretoChart(canvasId, ranking) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || !global.Chart) return;
    const labels = ranking.map(r => r.item);
    const valores = ranking.map(r => r.valorAnual);
    const acumulado = ranking.map(r => r.percentualAcumulado);
    const cores = ranking.map(r => r.classe === "A" ? PALETA.laranja : r.classe === "B" ? PALETA.azul : PALETA.cinza);

    registry[canvasId] = new global.Chart(ctx, {
      data: {
        labels,
        datasets: [
          { type: "bar", label: "Valor anual (R$)", data: valores, backgroundColor: cores, yAxisID: "y" },
          { type: "line", label: "% acumulado", data: acumulado, borderColor: PALETA.verde, backgroundColor: PALETA.verde, yAxisID: "y1", tension: .25, pointRadius: 3 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" }, title: { display: true, text: "Gráfico de Pareto — Curva ABC" } },
        scales: {
          y: { type: "linear", position: "left", title: { display: true, text: "R$" } },
          y1: { type: "linear", position: "right", min: 0, max: 100, grid: { drawOnChartArea: false }, title: { display: true, text: "% acumulado" } },
          x: { ticks: { autoSkip: false, maxRotation: 60, minRotation: 30 } }
        }
      }
    });
  }

  function lecCurveChart(canvasId, params) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || !global.Chart) return;
    const { demandaAnual, custoPedido, custoManter, lecOtimo } = params;
    const max = Math.max(lecOtimo * 3, 20);
    const pontos = [];
    for (let q = 5; q <= max; q += Math.max(1, Math.round(max / 60))) pontos.push(q);
    const pedir = pontos.map(q => (demandaAnual / q) * custoPedido);
    const manter = pontos.map(q => (q / 2) * custoManter);
    const totalRelevante = pontos.map((q, i) => pedir[i] + manter[i]);

    registry[canvasId] = new global.Chart(ctx, {
      type: "line",
      data: {
        labels: pontos,
        datasets: [
          { label: "Custo de pedir", data: pedir, borderColor: PALETA.azul, borderDash: [6, 3], pointRadius: 0 },
          { label: "Custo de manter", data: manter, borderColor: PALETA.verde, borderDash: [2, 2], pointRadius: 0 },
          { label: "Custo total relevante", data: totalRelevante, borderColor: PALETA.laranja, borderWidth: 3, pointRadius: 0 }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: `Ponto econômico: Q = ${lecOtimo.toFixed(0)} un.` },
          annotation: undefined
        },
        scales: { x: { title: { display: true, text: "Tamanho do lote (Q)" } }, y: { title: { display: true, text: "Custo anual (R$)" } } }
      }
    });
  }

  function estoqueAoLongoDoTempoChart(canvasId, serie, ss, pp) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || !global.Chart) return;
    registry[canvasId] = new global.Chart(ctx, {
      type: "line",
      data: {
        labels: serie.map((_, i) => "Dia " + i),
        datasets: [
          { label: "Saldo em estoque", data: serie, borderColor: PALETA.azul, backgroundColor: "rgba(6,76,140,.12)", fill: true, stepped: false, pointRadius: 2 },
          { label: "Ponto de pedido", data: serie.map(() => pp), borderColor: PALETA.laranja, borderDash: [6, 4], pointRadius: 0 },
          { label: "Estoque de segurança", data: serie.map(() => ss), borderColor: PALETA.vermelho, borderDash: [2, 2], pointRadius: 0 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: { y: { title: { display: true, text: "Unidades" }, beginAtZero: true } }
      }
    });
  }

  function barrasComparativas(canvasId, labels, valores, titulo, cor) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || !global.Chart) return;
    registry[canvasId] = new global.Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ label: titulo, data: valores, backgroundColor: cor || PALETA.azul }] },
      options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: titulo } } }
    });
  }

  function radarFornecedores(canvasId, propostas) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || !global.Chart) return;
    const cores = [PALETA.azul, PALETA.verde, PALETA.laranja];
    registry[canvasId] = new global.Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Preço", "Prazo", "Qualidade", "Atendimento"],
        datasets: propostas.map((p, i) => ({
          label: p.nome,
          data: [p.notas.preco, p.notas.prazo, p.notas.qualidade, p.notas.atendimento],
          borderColor: cores[i % cores.length],
          backgroundColor: cores[i % cores.length] + "33"
        }))
      },
      options: { responsive: true, scales: { r: { min: 0, max: 10 } }, plugins: { legend: { position: "bottom" } } }
    });
  }

  function linhaDepreciacao(canvasId, tabela, valorAquisicao) {
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || !global.Chart) return;
    registry[canvasId] = new global.Chart(ctx, {
      type: "line",
      data: {
        labels: tabela.map(l => l.exercicio),
        datasets: [{ label: "Valor contábil (R$)", data: tabela.map(l => l.valorContabil), borderColor: PALETA.azul, backgroundColor: "rgba(6,76,140,.15)", fill: true, pointRadius: 4 }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, title: { display: true, text: "Evolução do valor contábil" } },
        scales: { y: { beginAtZero: true, max: valorAquisicao * 1.05 } }
      }
    });
  }

  global.VETTA_CHARTS = {
    destroy, paretoChart, lecCurveChart, estoqueAoLongoDoTempoChart,
    barrasComparativas, radarFornecedores, linhaDepreciacao
  };
})(window);
