/* VETTA EDU — Etapa 3: Indicadores de desempenho e inventário */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const C = window.VETTA_CALC;
  const D = window.VETTA_DATA;

  function dadosReposicao() {
    const p = D.reposicaoToner;
    return C.politicaReposicaoCompleta({
      demandaAnual: p.demandaAnual, custoUnitario: p.custoUnitario, custoPedido: p.custoPedido,
      taxaManutencao: p.taxaManutencao, diasUteis: D.empresa.diasUteisAno,
      tempoReposicao: p.tempoReposicaoDiasUteis, consumoMaximo: p.consumoMaximoDiario,
      qAtual: p.politicaAtualQ, saldoAtual: p.saldoAtual
    });
  }

  function tabelaInventario(inv) {
    const linhas = inv.linhas.map((l) => `
      <tr>
        <td>${UI.esc(l.item)}</td>
        <td class="text-end">${C.fmtMoeda(l.custoUnit)}</td>
        <td class="text-end">${l.qtdSistema}</td>
        <td class="text-end">${l.qtdFisica}</td>
        <td class="text-end ${l.divergenciaUn !== 0 ? 'text-danger fw-bold' : ''}">${l.divergenciaUn > 0 ? "+" : ""}${l.divergenciaUn}</td>
        <td class="text-end ${l.divergenciaRS !== 0 ? 'text-danger fw-bold' : ''}">${C.fmtMoeda(l.divergenciaRS)}</td>
        <td class="text-end">${C.fmtMoeda(l.valorSistema)}</td>
      </tr>`).join("");
    return `<div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
      <thead><tr><th>Item</th><th class="text-end">Custo unit.</th><th class="text-end">Qtd. sistema</th><th class="text-end">Qtd. física</th><th class="text-end">Diverg. (un)</th><th class="text-end">Diverg. (R$)</th><th class="text-end">Valor sistema</th></tr></thead>
      <tbody>${linhas}</tbody>
      <tfoot><tr class="fw-bold"><td colspan="5">TOTAL (líquido / sistema)</td><td class="text-end">${C.fmtMoeda(inv.somaLiquida)}</td><td class="text-end">${C.fmtMoeda(inv.valorTotalSistema)}</td></tr></tfoot>
      </table></div>`;
  }

  window.VETTA_VIEWS.etapa3 = function () {
    const r = dadosReposicao();
    const consumoAnualRS = D.reposicaoToner.demandaAnual * D.reposicaoToner.custoUnitario;
    const estoqueMedioRSLec = r.emed * D.reposicaoToner.custoUnitario;
    const giroLec = C.giroEstoque(consumoAnualRS, estoqueMedioRSLec);
    const covLec = C.coberturaDias(D.empresa.diasUteisAno, giroLec);

    const emedAtual = D.reposicaoToner.politicaAtualQ / 2 + r.ss;
    const estoqueMedioRSAtual = emedAtual * D.reposicaoToner.custoUnitario;
    const giroAtual = C.giroEstoque(consumoAnualRS, estoqueMedioRSAtual);
    const covAtual = C.coberturaDias(D.empresa.diasUteisAno, giroAtual);
    const capitalLiberado = estoqueMedioRSAtual - estoqueMedioRSLec;

    const inv = C.calcularInventario(D.inventarioEstoque.itens);
    const metaItensOK = inv.acuraciadeItens >= D.inventarioEstoque.metaAcuraciadeItens;
    const metaValorOK = inv.acuraciadeValor >= D.inventarioEstoque.metaAcuraciadeValor;

    return `
    ${UI.heroEtapa(3, "Indicadores de desempenho e inventário", "Meça giro, cobertura e acuracidade e interprete o resultado", "35 min")}

    <div class="vetta-card">
      <p>A diretoria não quer só uma política de compras: quer saber se <strong>o estoque está saudável</strong> e se <strong>os números do sistema são confiáveis</strong>. Usaremos os resultados da Etapa 2.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">🧮 3.1 e 3.2 — Giro, cobertura e capital liberado</h2>
      ${UI.passo(1, "Entenda o problema", "<p>Ter um bom ponto de pedido não basta: a diretoria quer saber se o dinheiro aplicado em estoque de toner está sendo bem utilizado, e o quanto a nova política de compras melhora isso frente à política atual.</p>")}
      ${UI.passo(2, "Descubra por que o cálculo é necessário", "<p>O <strong>giro</strong> mostra quantas vezes por ano o estoque médio é renovado; a <strong>cobertura</strong> traduz isso em dias de consumo garantidos pelo estoque atual.</p>")}
      ${UI.passo(3, "Conheça os dados", UI.tabelaDados([
        { descricao: "Estoque médio — política LEC (Eméd)", valor: r.emed.toFixed(0), unidade: "un" },
        { descricao: "Estoque médio — política atual (Q=150)", valor: emedAtual.toFixed(0), unidade: "un" },
        { descricao: "Custo unitário do toner", valor: "R$ 210,00", unidade: "R$/un" },
        { descricao: "Consumo anual (D × Cu)", valor: C.fmtMoeda(consumoAnualRS), unidade: "R$/ano" }
      ]))}
      ${UI.passo(4, "Entenda a fórmula", UI.formula("Giro = Consumo anual (R$) ÷ Estoque médio (R$)\nCobertura (dias) = dias úteis ÷ Giro"))}
      ${UI.passo(5, "Substitua os valores", UI.formula(`Estoque médio (R$) = ${r.emed.toFixed(0)} × 210,00\nGiro = ${C.fmtMoeda(consumoAnualRS)} ÷ ${C.fmtMoeda(estoqueMedioRSLec)}`))}
      ${UI.passo(6, "Resolva passo a passo", `<p>Estoque médio (R$) = ${C.fmtMoeda(estoqueMedioRSLec)}</p><p>Giro = ${UI.br(giroLec,2)} vezes/ano</p><p>Cobertura = 250 ÷ ${UI.br(giroLec,2)} ≈ <strong>${UI.br(covLec,2)} dias úteis</strong></p>`)}
      ${UI.passo(7, "Interprete o resultado", `${UI.resultadoDestaque("Com o LEC: giro ≈ " + UI.br(giroLec,2) + "× por ano · cobertura ≈ " + UI.br(covLec,1) + " dias")}<p>Isso significa que o estoque médio de toner é totalmente renovado cerca de ${giroLec.toFixed(0)} vezes ao ano, e o saldo médio garante por volta de ${covLec.toFixed(0)} dias úteis de consumo.</p>`, "resultado")}
      ${UI.passo(8, "Reflita sobre a gestão", `<ul>
        <li>Um giro de ${giroLec.toFixed(0)} vezes não é "sempre bom": ele exige reposição precisa e fornecedor confiável. Se o SS for ignorado, o risco de ruptura sobe.</li>
        <li>Comparando com a política atual (Q=150): giro de ${UI.br(giroAtual,2)}× e cobertura de ${UI.br(covAtual,1)} dias — quase o dobro de estoque parado para o mesmo nível de proteção contra ruptura.</li>
        <li>O capital liberado ao trocar de política pode ser investido em outras prioridades da empresa.</li></ul>`, "reflexao")}
      ${UI.passo(9, "Aplique no Excel", UI.excelCelula("E6", "=B6*C4", C.fmtMoeda(estoqueMedioRSLec), "B6 = estoque médio em unidades (Eméd); C4 = custo unitário.") +
        UI.excelCelula("E8", "=E7/E6", UI.br(giroLec,2), "E7 = consumo anual em R$; E6 = estoque médio em R$."))}
      ${UI.passo(10, "Experimente uma mudança", `<p>No <a href="#/simulador">Simulador Gerencial</a>, aumente o tempo de reposição e veja a cobertura necessária subir junto.</p>`)}
    </div>

    <div class="vetta-card">
      <h2 class="h4">📊 Política atual × Política LEC</h2>
      <div class="row g-3">
        <div class="col-md-6"><canvas id="chartGiroComparativo" height="200"></canvas></div>
        <div class="col-md-6"><canvas id="chartCoberturaComparativo" height="200"></canvas></div>
      </div>
      ${UI.resultadoDestaque("Capital liberado = " + C.fmtMoeda(capitalLiberado) + " deixam de ficar parados em toner")}
      <p class="small text-muted">O giro dobrou (${UI.br(giroAtual,2)} → ${UI.br(giroLec,2)}) e o capital imobilizado caiu quase pela metade, sem aumentar o risco de ruptura, porque o estoque de segurança foi mantido igual nas duas políticas.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">📋 Inventário rotativo: Renata contou 5 itens</h2>
      <p>Divergência = quantidade física − quantidade do sistema. Para a acuracidade, usa-se o <strong>valor absoluto</strong> da divergência; o valor líquido serve apenas para o ajuste contábil.</p>
      ${tabelaInventario(inv)}
    </div>

    <div class="vetta-card">
      <h2 class="h4">3.3 — Acuracidade por item e por valor</h2>
      ${UI.formula("Acuracidade (itens) = itens sem divergência ÷ itens contados × 100\nAcuracidade (valor) = (1 − Σ|divergência R$| ÷ Σ valor do sistema) × 100")}
      <div class="row g-3 mt-1">
        <div class="col-md-6">
          ${UI.resultadoDestaque("Acuracidade por item = " + C.fmtPercent(inv.acuraciadeItens))}
          <p class="small ${metaItensOK ? 'text-success' : 'text-danger'}">${metaItensOK ? "✅ Meta de " + D.inventarioEstoque.metaAcuraciadeItens + "% atingida." : "❌ Meta de " + D.inventarioEstoque.metaAcuraciadeItens + "% NÃO atingida: apenas " + inv.itensSemDivergencia + " de " + inv.totalItens + " itens bateram exatamente."}</p>
        </div>
        <div class="col-md-6">
          ${UI.resultadoDestaque("Acuracidade por valor = " + C.fmtPercent(inv.acuraciadeValor))}
          <p class="small ${metaValorOK ? 'text-success' : 'text-danger'}">${metaValorOK ? "✅ Meta de " + D.inventarioEstoque.metaAcuraciadeValor + "% atingida." : "❌ Meta de " + D.inventarioEstoque.metaAcuraciadeValor + "% NÃO atingida."}</p>
        </div>
      </div>
      <p>O valor está controlado, mas a contagem por item revela erros de processo (papel: falta de 36 resmas; fita: sobra de 14 rolos). <strong>Erros que se compensam podem esconder problemas</strong> — por isso os dois indicadores são acompanhados juntos.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">3.4 — Causas prováveis e ações de correção</h2>
      <div class="row">
        <div class="col-md-6">
          <h3 class="h6">Causas prováveis</h3>
          <ul class="small">
            <li>Baixa sem registro (consumo interno não apontado).</li>
            <li>Erro de conferência no recebimento.</li>
            <li>Troca de unidade de medida (caixa × unidade).</li>
            <li>Lançamento em item errado (explicaria a sobra de fita).</li>
            <li>Perda ou furto.</li>
          </ul>
        </div>
        <div class="col-md-6">
          <h3 class="h6">Ações recomendadas</h3>
          <ul class="small">
            <li>Recontar antes de ajustar qualquer saldo.</li>
            <li>Investigar as últimas notas e requisições.</li>
            <li>Ajustar o saldo com autorização e justificativa registrada.</li>
            <li>Reforçar requisição obrigatória e treinar a conferência no recebimento.</li>
            <li>Adotar contagem cíclica mensal para os itens classe A.</li>
          </ul>
        </div>
      </div>
      <p class="small text-muted mb-0"><strong>Boa prática:</strong> não ajustar o saldo sem investigar a causa — o ajuste sem investigação esconde o problema.</p>
    </div>

    <div class="vetta-docente-box">
      <h4>⚠️ Erros comuns a evitar</h4>
      <ul class="mb-0 small">
        <li>Somar as divergências com sinal (ex.: −864 + 56) e concluir que o erro é de R$ 808,00. Para acuracidade usa-se o <strong>valor absoluto</strong>; o líquido serve só para o ajuste contábil.</li>
        <li>Usar consumo em unidades no cálculo do giro — ele exige consumo e estoque médio na mesma unidade monetária (R$).</li>
      </ul>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "etapa-3") return;
    const r = dadosReposicao();
    const emedAtual = D.reposicaoToner.politicaAtualQ / 2 + r.ss;
    window.VETTA_CHARTS.barrasComparativas("chartGiroComparativo", ["Política atual", "Política LEC"],
      [C.giroEstoque(D.reposicaoToner.demandaAnual * D.reposicaoToner.custoUnitario, emedAtual * D.reposicaoToner.custoUnitario),
       C.giroEstoque(D.reposicaoToner.demandaAnual * D.reposicaoToner.custoUnitario, r.emed * D.reposicaoToner.custoUnitario)],
      "Giro de estoque (vezes/ano)", "#064C8C");
    window.VETTA_CHARTS.barrasComparativas("chartCoberturaComparativo", ["Política atual", "Política LEC"],
      [C.coberturaDias(D.empresa.diasUteisAno, C.giroEstoque(D.reposicaoToner.demandaAnual * D.reposicaoToner.custoUnitario, emedAtual * D.reposicaoToner.custoUnitario)),
       C.coberturaDias(D.empresa.diasUteisAno, C.giroEstoque(D.reposicaoToner.demandaAnual * D.reposicaoToner.custoUnitario, r.emed * D.reposicaoToner.custoUnitario))],
      "Cobertura (dias úteis)", "#F7941D");
  });
})();
