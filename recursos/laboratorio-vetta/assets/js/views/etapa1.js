/* VETTA EDU — Etapa 1: Curva ABC */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const C = window.VETTA_CALC;
  const D = window.VETTA_DATA;

  function abcResult() {
    return C.calcularCurvaABC(D.abc.itens, D.abc.limiteA, D.abc.limiteB);
  }

  function tabelaRanking(abc) {
    const linhas = abc.ranking.map((r) => `
      <tr class="classe-${r.classe}">
        <td>${r.posicao}</td>
        <td>${UI.esc(r.item)}</td>
        <td class="text-end">${C.fmtMoeda(r.valorAnual)}</td>
        <td class="text-end">${C.fmtPercent(r.percentual)}</td>
        <td class="text-end">${C.fmtPercent(r.percentualAcumulado)}</td>
        <td class="text-center"><span class="badge badge-classe-${r.classe}">${r.classe}</span></td>
      </tr>`).join("");
    return `<div class="vetta-table-wrap">
      <table class="table table-vetta table-bordered align-middle">
        <thead><tr><th>Pos.</th><th>Item</th><th class="text-end">Valor anual</th><th class="text-end">% do total</th><th class="text-end">% acumulado</th><th>Classe</th></tr></thead>
        <tbody>${linhas}</tbody>
        <tfoot><tr class="fw-bold"><td colspan="2">TOTAL</td><td class="text-end">${C.fmtMoeda(abc.total)}</td><td colspan="3"></td></tr></tfoot>
      </table></div>`;
  }

  window.VETTA_VIEWS.etapa1 = function () {
    const abc = abcResult();
    const resumo = abc.resumoClasses;
    const pastaSuspensa = abc.ranking.find(r => r.item.includes("Pasta suspensa"));

    return `
    ${UI.heroEtapa(1, "Curva ABC: onde está o dinheiro?", "Classifique os itens do almoxarifado pelo valor movimentado no ano", "35 min")}

    <div class="vetta-card">
      <p>Diego exportou do sistema a demanda dos últimos 12 meses e o custo unitário dos 10 itens de maior giro do almoxarifado. Renata precisa saber em quais deles concentrar o controle.</p>
      ${UI.cardAlma("A curva ABC segue o princípio de Pareto: poucos itens concentram a maior parte do valor. Primeiro calcule o valor anual de cada item; depois ordene do maior para o menor.")}
    </div>

    <div class="vetta-card">
      <h2 class="h4">🧮 Passo a passo: por que calcular o valor anual?</h2>
      ${UI.passo(1, "Entenda o problema", "<p>A VETTA controla dezenas de materiais no almoxarifado, mas não tem tempo nem recursos para vigiar todos com a mesma intensidade. Precisamos descobrir <strong>onde o dinheiro da empresa está concentrado</strong> para decidir onde vale a pena investir em controle rigoroso.</p>")}
      ${UI.passo(2, "Descubra por que o cálculo é necessário", "<p>O valor anual de cada item (quanto se compra × quanto custa cada unidade) mostra o impacto financeiro real de cada material — não apenas o preço unitário, nem apenas a quantidade.</p>")}
      ${UI.passo(3, "Conheça os dados", UI.tabelaDados([
        { descricao: "Demanda anual do cartucho de toner (D)", valor: "900", unidade: "un/ano" },
        { descricao: "Custo unitário do cartucho de toner (Cu)", valor: "R$ 210,00", unidade: "R$/un" }
      ]) + `<p class="small text-muted mt-2">A tabela completa com os 10 itens está logo abaixo — o raciocínio é o mesmo para cada linha.</p>`)}
      ${UI.passo(4, "Entenda a fórmula", UI.formula("Valor anual = Demanda anual (D) × Custo unitário (Cu)"))}
      ${UI.passo(5, "Substitua os valores", UI.formula("Valor anual (toner) = 900 × 210,00"))}
      ${UI.passo(6, "Resolva passo a passo", "<p>900 × 210,00 = 189.000,00</p>")}
      ${UI.passo(7, "Interprete o resultado", "<p>O cartucho de toner movimenta <strong>R$ 189.000,00 por ano</strong> — não é o item mais caro por unidade, mas é comprado com frequência suficiente para pesar muito no orçamento.</p>", "resultado")}
      ${UI.passo(8, "Reflita sobre a gestão",
        `<ul><li>Esse valor entra direto na prioridade de controle: quanto maior, mais atenção merece.</li>
        <li>Um item barato comprado em grande volume (como o papel A4) pode valer mais que um item caro comprado raramente.</li>
        <li>Ignorar esse cálculo faz a empresa vigiar o item errado — gastando energia em itens classe C enquanto a classe A fica sem controle.</li></ul>`, "reflexao")}
      ${UI.passo(9, "Aplique no Excel", UI.excelCelula("D4", "=B4*C4", "189.000,00", "B4 = demanda anual (900); C4 = custo unitário (210,00). Arraste a fórmula para as demais linhas.") +
        UI.excelCelula("D14", "=SOMA(D4:D13)", C.fmtMoeda(abc.total), "Soma todos os valores anuais para obter o total movimentado."))}
      ${UI.passo(10, "Experimente uma mudança", `<p>Use o <a href="#/simulador">Simulador Gerencial</a> para alterar a demanda ou o custo do toner e ver a classificação ABC recalculada na hora.</p>`)}
    </div>

    <div class="vetta-card">
      <h2 class="h4">📊 Tabela 1A → 1B: ranking e classificação completos</h2>
      <p>Classificação adotada neste case: <strong>A</strong> até ${D.abc.limiteA}% acumulado · <strong>B</strong> acima de ${D.abc.limiteA}% até ${D.abc.limiteB}% · <strong>C</strong> acima de ${D.abc.limiteB}%.</p>
      ${tabelaRanking(abc)}
      <div class="mt-3">
        <canvas id="chartPareto1" height="110" role="img" aria-label="Gráfico de Pareto da curva ABC"></canvas>
      </div>
      <div class="row g-2 mt-1">
        ${resumo.map(r => `<div class="col-md-4">${UI.statTile(r.qtdItens + " itens", `Classe ${r.classe} = ${C.fmtPercent(r.percentValor)} do valor`)}</div>`).join("")}
      </div>
      <p class="small text-muted mt-2">Alternativa textual ao gráfico: as barras mostram o valor anual de cada item em ordem decrescente; a linha verde mostra o percentual acumulado, que cruza 80% e 95% nas fronteiras das classes A/B e B/C.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">1.1 — Valor total e distribuição por classe</h2>
      ${UI.resultadoDestaque(`Valor total movimentado no ano = ${C.fmtMoeda(abc.total)}`)}
      <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered mt-2">
        <thead><tr><th>Classe</th><th>Itens</th><th>% dos itens</th><th>% do valor</th></tr></thead>
        <tbody>${resumo.map(r => `<tr><td><span class="badge badge-classe-${r.classe}">${r.classe}</span></td><td>${r.qtdItens}</td><td>${C.fmtPercent(r.percentItens)}</td><td>${C.fmtPercent(r.percentValor)}</td></tr>`).join("")}</tbody>
      </table></div>
      <p><strong>Leitura gerencial:</strong> ${C.fmtPercent(resumo[0].percentItens, 0)} dos itens concentram quase ${C.fmtPercent(resumo[0].percentValor, 0)} do dinheiro; metade dos itens responde por menos de 7% do valor.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">1.2 — A pasta suspensa está na fronteira: A, B ou C?</h2>
      <p>Regra: a classe B vai até 95% acumulado; acima disso é C.</p>
      ${UI.resultadoDestaque(`${pastaSuspensa ? C.fmtPercent(pastaSuspensa.percentualAcumulado) : ""} > 95% → Classe C`)}
      <p>Está muito próxima do limite — por isso a regra de corte precisa ser aplicada com rigor e registrada no relatório, evitando decisões subjetivas de última hora.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">1.3 — Por que o toner foi escolhido para a Etapa 2?</h2>
      <p>Além de ser classe A, o toner reúne outras razões que sustentam essa escolha:</p>
      <ul>
        <li>Já causou <strong>duas rupturas</strong> no trimestre: o problema é urgente e visível.</li>
        <li>Tem <strong>demanda estável</strong> (~3,6 un/dia), o que permite aplicar o modelo do LEC com segurança.</li>
        <li><strong>Alto custo unitário</strong> (R$ 210,00): estoque parado imobiliza muito capital por unidade.</li>
        <li>O papel A4 também é classe A, mas seu excesso já foi notado e o risco operacional é menor — ele não paralisa a emissão de notas fiscais.</li>
      </ul>
    </div>

    <div class="vetta-card">
      <h2 class="h4">1.4 — Nível de controle recomendado por classe</h2>
      <div class="row g-3">
        <div class="col-md-4"><div class="vetta-card mb-0 h-100"><h3 class="h6 badge-classe-A d-inline-block px-2 py-1 rounded text-white">Classe A</h3><p class="small mb-0">Controle rigoroso; contagem cíclica mensal; revisão frequente do LEC, SS e PP; acompanhamento da previsão de demanda; fornecedores negociados e com alternativa.</p></div></div>
        <div class="col-md-4"><div class="vetta-card mb-0 h-100"><h3 class="h6 badge-classe-B d-inline-block px-2 py-1 rounded text-white">Classe B</h3><p class="small mb-0">Controle intermediário; contagem trimestral; revisão semestral dos parâmetros.</p></div></div>
        <div class="col-md-4"><div class="vetta-card mb-0 h-100"><h3 class="h6 badge-classe-C d-inline-block px-2 py-1 rounded text-white">Classe C</h3><p class="small mb-0">Controle simples; compras em lotes maiores para reduzir o custo de pedir; contagem semestral ou anual; sistema de duas gavetas / revisão visual.</p></div></div>
      </div>
    </div>

    <div class="vetta-docente-box">
      <h4>⚠️ Erros comuns a evitar</h4>
      <ul class="mb-0 small">
        <li>Calcular o % acumulado <strong>sem ordenar antes</strong> o ranking do maior para o menor valor — o resultado fica sem sentido.</li>
        <li>Confundir % do item (participação individual) com % acumulado (soma progressiva) na hora de classificar.</li>
      </ul>
      <p class="small mt-2 mb-0"><strong>Pergunta para refletir:</strong> se o gestor só tem tempo para acompanhar 2 itens, quais escolhe? E se um item classe C parar de repente, o que acontece? (Isso ajuda a discutir <em>criticidade</em> versus <em>valor</em>.)</p>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "etapa-1") return;
    const abc = abcResult();
    window.VETTA_CHARTS.paretoChart("chartPareto1", abc.ranking);
  });
})();
