/* VETTA EDU — Laboratório Excel: demonstrações passo a passo em grade simulada. */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const C = window.VETTA_CALC;
  const D = window.VETTA_DATA;

  const COLUNAS = ["A", "B", "C", "D", "E"];
  const LINHAS = [1, 2, 3, 4, 5, 6, 7, 8];

  const LICOES = [
    {
      aba: "03 - Reposição", titulo: "Consumo médio diário (Cméd)",
      celulas: { B4: "900", B5: "250", B6: "=B4/B5" },
      rotulos: { A4: "Demanda anual (D)", A5: "Dias úteis", A6: "Cméd" },
      ativa: "B6", formulaAtiva: "=B4/B5", resultado: "3,60",
      explicacao: "B4 guarda a demanda anual; B5, os dias úteis. A célula ativa divide uma pela outra para obter o consumo médio diário em unidades."
    },
    {
      aba: "03 - Reposição", titulo: "Custo de manter 1 unidade por ano (H)",
      celulas: { B7: "0,20", C4: "210,00", B8: "=B7*C4" },
      rotulos: { A7: "Taxa de manutenção (i)", A4: "Custo unitário (Cu)", A8: "H" },
      ativa: "B8", formulaAtiva: "=B7*C4", resultado: "R$ 42,00",
      explicacao: "A taxa de manutenção (20%) multiplicada pelo custo unitário (R$ 210,00) dá o custo de manter uma unidade em estoque por um ano inteiro."
    },
    {
      aba: "03 - Reposição", titulo: "Lote Econômico de Compra (LEC)",
      celulas: { B4: "900", B9: "84,00", B6: "3,60", B8: "42,00", B10: "=RAIZ((2*B4*B9)/B8)" },
      rotulos: { A4: "Demanda anual (D)", A9: "Custo do pedido (S)", A8: "H", A10: "LEC" },
      ativa: "B10", formulaAtiva: "=RAIZ((2*B4*B9)/B8)", resultado: "60,00",
      explicacao: "A função RAIZ calcula a raiz quadrada de (2 × D × S ÷ H), o ponto em que o custo de pedir se iguala ao custo de manter."
    },
    {
      aba: "05 - Indicadores", titulo: "Giro de estoque",
      celulas: { B2: "189.000,00", B3: "9.240,00", B4: "=B2/B3" },
      rotulos: { A2: "Consumo anual (R$)", A3: "Estoque médio (R$)", A4: "Giro" },
      ativa: "B4", formulaAtiva: "=B2/B3", resultado: "20,45",
      explicacao: "O giro mostra quantas vezes por ano o estoque médio em reais é totalmente renovado pelo consumo anual."
    },
    {
      aba: "06 - Inventário Estoque", titulo: "Acuracidade por valor",
      celulas: { B2: "920,00", B3: "74.870,00", B4: "=(1-B2/B3)*100" },
      rotulos: { A2: "Σ divergências absolutas (R$)", A3: "Σ valor do sistema (R$)", A4: "Acuracidade (%)" },
      ativa: "B4", formulaAtiva: "=(1-B2/B3)*100", resultado: "98,77%",
      explicacao: "Usa-se sempre o valor absoluto das divergências — positivas e negativas não podem se compensar na medição de acuracidade."
    },
    {
      aba: "07 - Fornecedores", titulo: "Taxa implícita do desconto à vista",
      celulas: { B2: "0,03", B3: "=B2/(1-B2)" },
      rotulos: { A2: "Desconto à vista (d)", A3: "Taxa implícita mensal" },
      ativa: "B3", formulaAtiva: "=B2/(1-B2)", resultado: "3,09%",
      explicacao: "A taxa implícita converte um desconto percentual em uma taxa de juros mensal equivalente, comparável ao custo de oportunidade do dinheiro."
    },
    {
      aba: "09 - Depreciação", titulo: "Quota anual de depreciação",
      celulas: { B2: "96.000,00", B3: "9.600,00", B4: "10", B5: "=(B2-B3)/B4" },
      rotulos: { A2: "Valor de aquisição", A3: "Valor residual", A4: "Vida útil (anos)", A5: "Quota anual" },
      ativa: "B5", formulaAtiva: "=(B2-B3)/B4", resultado: "R$ 8.640,00",
      explicacao: "O valor depreciável (aquisição menos residual) é dividido pela vida útil, no método linear de quotas constantes."
    }
  ];

  let indiceAtual = 0;

  function montarGrade(licao) {
    const linhasHtml = LINHAS.map((linha) => {
      const celulas = COLUNAS.map((col) => {
        const ref = col + linha;
        const ehAtiva = ref === licao.ativa;
        const ehRotulo = licao.rotulos && licao.rotulos[ref];
        const ehDado = licao.celulas && licao.celulas[ref] && !String(licao.celulas[ref]).startsWith("=");
        let conteudo = "";
        let classe = "";
        if (ehRotulo) { conteudo = licao.rotulos[ref]; classe = ""; }
        else if (licao.celulas && licao.celulas[ref]) {
          const raw = licao.celulas[ref];
          conteudo = String(raw).startsWith("=") ? (ref === licao.ativa ? licao.resultado : "") : raw;
          classe = ehDado ? "input-cell" : "result-cell";
        }
        if (ehAtiva) classe += " active-cell";
        return `<td class="${classe}" data-ref="${ref}">${conteudo}</td>`;
      }).join("");
      return `<tr><td class="rowhead">${linha}</td>${celulas}</tr>`;
    }).join("");

    const cabecalho = `<tr><th></th>${COLUNAS.map(c => `<th>${c}</th>`).join("")}</tr>`;

    return `
    <div class="vetta-excel-grid">
      <div class="vetta-excel-toolbar">
        <i class="bi bi-file-earmark-spreadsheet text-success"></i>
        <strong>Pasta_VETTA.xlsx</strong> <span class="text-muted">— aba "${UI.esc(licao.aba)}"</span>
      </div>
      <div class="vetta-excel-formulabar">
        <span class="cellref">${licao.ativa}</span>
        <span class="text-muted">fx</span>
        <code>${UI.esc(licao.formulaAtiva)}</code>
      </div>
      <div style="overflow-x:auto">
        <table class="vetta-excel-table">
          <thead>${cabecalho}</thead>
          <tbody>${linhasHtml}</tbody>
        </table>
      </div>
    </div>`;
  }

  function painelLicao(licao, i, total) {
    return `
    <div class="vetta-card">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 class="h5 mb-0">${i + 1}/${total} — ${UI.esc(licao.titulo)}</h2>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" id="btnLicaoAnterior" ${i === 0 ? "disabled" : ""}><i class="bi bi-arrow-left"></i> Anterior</button>
          <button class="btn btn-sm btn-vetta-primary" id="btnLicaoProxima" ${i === total - 1 ? "disabled" : ""}>Próxima <i class="bi bi-arrow-right"></i></button>
        </div>
      </div>
      <div class="mt-3">${montarGrade(licao)}</div>
      <div class="alert alert-light border mt-3 mb-0">
        <strong>Resultado em ${licao.ativa}:</strong> <span class="badge bg-success-subtle text-success border border-success-subtle">${licao.resultado}</span>
        <p class="small text-muted mb-0 mt-2">${licao.explicacao}</p>
      </div>
    </div>`;
  }

  window.VETTA_VIEWS.excelLab = function () {
    indiceAtual = 0;
    return `
    <div class="vetta-hero">
      <h1 class="h3 mb-1">📊 Laboratório Excel | Construa sua planilha de gestão</h1>
      <p class="mb-0">Aprenda célula por célula a reproduzir os cálculos do case no Microsoft Excel 365 (português do Brasil).</p>
    </div>

    <div class="vetta-card">
      <p>Cada demonstração abaixo mostra: a aba correta, a célula ativa, a fórmula inserida (com separador de argumentos <code>;</code> e decimal <code>,</code> do Excel em português) e o resultado esperado. <strong>Importante:</strong> esta grade é uma simulação em JavaScript para fins didáticos — os valores exibidos não são recalculados por um motor real do Excel. Para fórmulas vivas e editáveis, baixe a planilha real em <a href="#/downloads">Downloads</a>.</p>
    </div>

    <div id="painelLicaoExcel">${painelLicao(LICOES[indiceAtual], indiceAtual, LICOES.length)}</div>

    <div class="vetta-card">
      <h2 class="h5">🔤 Convenções do Excel 365 em português do Brasil usadas neste case</h2>
      <ul class="small mb-0">
        <li>Separador decimal: vírgula (<code>3,60</code>) · separador de argumentos de função: ponto e vírgula (<code>SE(A2&gt;0;"Positivo";"Verificar")</code>).</li>
        <li>Funções usadas no case: <code>RAIZ()</code>, <code>SOMA()</code>, <code>SE()</code>, <code>ARREDONDAR.PARA.CIMA()</code>, <code>SOMARPRODUTO()</code>, <code>DATADIF()</code>.</li>
        <li>Datas no formato brasileiro (dd/mm/aaaa) e valores monetários formatados como R$.</li>
      </ul>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "laboratorio-excel") return;
    function ligar() {
      const prev = document.getElementById("btnLicaoAnterior");
      const next = document.getElementById("btnLicaoProxima");
      if (prev) prev.addEventListener("click", () => { if (indiceAtual > 0) { indiceAtual--; redesenha(); } });
      if (next) next.addEventListener("click", () => { if (indiceAtual < LICOES.length - 1) { indiceAtual++; redesenha(); } });
    }
    function redesenha() {
      document.getElementById("painelLicaoExcel").innerHTML = painelLicao(LICOES[indiceAtual], indiceAtual, LICOES.length);
      ligar();
    }
    ligar();
  });
})();
