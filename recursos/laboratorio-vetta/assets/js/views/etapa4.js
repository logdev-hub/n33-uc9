/* VETTA EDU — Etapa 4: Escolha do fornecedor */
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

  function avaliacao() {
    const r = dadosReposicao();
    const parametrosEstoque = { cmed: r.cmed, cmax: D.reposicaoToner.consumoMaximoDiario, diasUteis: D.empresa.diasUteisAno, lec: r.lec };
    return C.avaliarFornecedores(D.fornecedores.propostas, D.fornecedores.quantidadeCotada, D.fornecedores.custoOportunidadeMensal, D.fornecedores.pesos, parametrosEstoque);
  }

  window.VETTA_VIEWS.etapa4 = function () {
    const forn = avaliacao();
    const r = dadosReposicao();
    const propostasOriginais = D.fornecedores.propostas;
    const vencedor = forn.propostas[0];
    const menorVPProp = forn.propostas.reduce((best, p) => (p.vp < best.vp ? p : best));
    const diferenca = vencedor.id !== menorVPProp.id
      ? (vencedor.vp - menorVPProp.vp)
      : 0;
    const diferencaAnual = diferenca * r.n;
    const descontoNecessario = vencedor.id !== menorVPProp.id
      ? ((vencedor.custoPedido - menorVPProp.vp) / vencedor.custoPedido) * 100
      : 0;

    return `
    ${UI.heroEtapa(4, "Escolha do fornecedor", "Compare propostas por custo total, valor presente e critérios ponderados", "45 min")}

    <div class="vetta-card">
      <p>Diego pediu cotação de <strong>${D.fornecedores.quantidadeCotada} cartuchos</strong> (o LEC) a três fornecedores. Fernanda diz: <em>"o menor preço não é sempre o melhor negócio."</em> O custo de oportunidade do dinheiro na VETTA é de <strong>${(D.fornecedores.custoOportunidadeMensal*100).toFixed(0)}% ao mês</strong>.</p>
      <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
        <thead><tr><th></th>${propostasOriginais.map(p => `<th>${p.id}: ${UI.esc(p.nome)}</th>`).join("")}</tr></thead>
        <tbody>
          <tr><td>Preço unitário</td>${propostasOriginais.map(p => `<td>${C.fmtMoeda(p.precoUnit)}</td>`).join("")}</tr>
          <tr><td>Frete por pedido</td>${propostasOriginais.map(p => `<td>${p.frete > 0 ? C.fmtMoeda(p.frete) : "Grátis"}</td>`).join("")}</tr>
          <tr><td>Prazo de entrega (TR)</td>${propostasOriginais.map(p => `<td>${p.prazoDias} dias úteis</td>`).join("")}</tr>
          <tr><td>Condição de pagamento</td>${propostasOriginais.map(p => `<td class="small">${UI.esc(p.pagamento)}</td>`).join("")}</tr>
          <tr><td>Qualidade (0 a 10)</td>${propostasOriginais.map(p => `<td>${p.qualidade}</td>`).join("")}</tr>
          <tr><td>Atendimento (0 a 10)</td>${propostasOriginais.map(p => `<td>${p.atendimento}</td>`).join("")}</tr>
        </tbody>
      </table></div>
    </div>

    <div class="vetta-card">
      <h2 class="h4">🧮 4.1 e 4.2 — Custo do pedido e valor presente</h2>
      ${UI.passo(1, "Entenda o problema", "<p>Comparar só o preço unitário esconde diferenças de frete e de prazo de pagamento. Precisamos trazer todas as propostas para a <strong>mesma base de comparação</strong>: o valor na data de hoje.</p>")}
      ${UI.passo(2, "Descubra por que o cálculo é necessário", "<p>O valor presente (VP) desconta pagamentos futuros pelo custo de oportunidade do dinheiro, permitindo comparar uma proposta à vista com outra a prazo de forma justa.</p>")}
      ${UI.passo(3, "Conheça os dados", UI.tabelaDados([
        { descricao: "Quantidade cotada (Q)", valor: "60", unidade: "un" },
        { descricao: "Custo de oportunidade mensal (i)", valor: "2%", unidade: "ao mês" }
      ]))}
      ${UI.passo(4, "Entenda a fórmula", UI.formula("Custo do pedido = Q × preço + frete\nVP = VF ÷ (1 + i)ⁿ\nTaxa implícita do desconto = d ÷ (1 − d)"))}
      ${UI.passo(5, "Substitua os valores", UI.formula("A (30 dias): 60 × 205,00 + 180,00\nA (à vista, 3% sobre mercadorias): 60 × 205,00 × 0,97 + 180,00"))}
      ${UI.passo(6, "Resolva passo a passo", `<div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
        <thead><tr><th>Fornecedor</th><th class="text-end">Custo do pedido (sem desconto)</th><th>Melhor condição de pagamento</th><th class="text-end">VP</th></tr></thead>
        <tbody>${forn.propostas.map(p => `<tr><td>${p.id} — ${UI.esc(p.nome)}</td><td class="text-end">${C.fmtMoeda(p.custoPedido)}</td><td class="small">${UI.esc(p.melhorCondicao.tipo)}</td><td class="text-end fw-bold">${C.fmtMoeda(p.vp)}</td></tr>`).join("")}</tbody>
      </table></div>`)}
      ${UI.passo(7, "Interprete o resultado", `${UI.resultadoDestaque("Menor VP = " + C.fmtMoeda(forn.menorVP) + " (" + menorVPProp.nome + ", " + menorVPProp.melhorCondicao.tipo + ")")}<p>Só olhando o preço unitário, B parecia o melhor (R$ 198,00); ao somar o frete e trazer tudo a valor presente, o quadro muda.</p>`, "resultado")}
      ${UI.passo(8, "Reflita sobre a gestão", `<ul>
        <li>Taxa implícita do desconto à vista de A = d ÷ (1−d) = 0,03 ÷ 0,97 ≈ <strong>${UI.br(C.taxaImplicitaDesconto(0.03)*100,2)}% ao mês</strong>. Como isso é maior que os 2% de custo de oportunidade, <strong>vale antecipar o pagamento</strong>.</li>
        <li>Comparar o VP de uma proposta com o valor nominal de outra seria um erro: todas precisam estar na mesma data.</li>
        <li>O desconto à vista de A incide apenas sobre as mercadorias, nunca sobre o frete.</li></ul>`, "reflexao")}
      ${UI.passo(9, "Aplique no Excel", UI.excelCelula("B14", "=B12/(1+$B$2)^1", "R$ 12.235,29", "B12 = custo nominal a prazo; $B$2 = taxa mensal (2%); expoente = nº de meses até o pagamento.") +
        UI.excelCelula("B15", "=(B13*0,97)+B_frete", "R$ 12.111,00", "Condição à vista: desconto aplicado só sobre o valor das mercadorias, frete somado depois."))}
      ${UI.passo(10, "Experimente uma mudança", `<p>No <a href="#/simulador">Simulador Gerencial</a>, altere os pesos da matriz de decisão (ex.: preço 60%) e veja se o fornecedor C continua na frente.</p>`)}
    </div>

    <div class="vetta-card">
      <h2 class="h4">4.3 — Efeito do prazo de entrega no estoque</h2>
      <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
        <thead><tr><th>Fornecedor</th><th>Prazo (TR)</th><th class="text-end">SS</th><th class="text-end">PP</th><th class="text-end">Eméd</th></tr></thead>
        <tbody>${forn.propostas.map(p => `<tr><td>${p.id} — ${UI.esc(p.nome)}</td><td>${p.prazoDias} dias</td><td class="text-end">${p.estoque ? p.estoque.ss.toFixed(0) : "-"}</td><td class="text-end">${p.estoque ? p.estoque.pp.toFixed(0) : "-"}</td><td class="text-end">${p.estoque ? p.estoque.emed.toFixed(0) : "-"}</td></tr>`).join("")}</tbody>
      </table></div>
      <p class="small text-muted">Prazo menor significa menos estoque de segurança necessário — cada unidade a menos de Eméd custa ${C.fmtMoeda(r.h)} a menos por ano em custo de manter.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">4.4 — Matriz de decisão ponderada</h2>
      <p>Pesos: preço ${(D.fornecedores.pesos.preco*100).toFixed(0)}% · prazo ${(D.fornecedores.pesos.prazo*100).toFixed(0)}% · qualidade ${(D.fornecedores.pesos.qualidade*100).toFixed(0)}% · atendimento ${(D.fornecedores.pesos.atendimento*100).toFixed(0)}%.</p>
      <div class="row g-3">
        <div class="col-md-7">
          <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
            <thead><tr><th>Fornecedor</th><th class="text-end">Nota preço</th><th class="text-end">Nota prazo</th><th class="text-end">Qualidade</th><th class="text-end">Atendimento</th><th class="text-end">NOTA FINAL</th></tr></thead>
            <tbody>${forn.propostas.map((p, i) => `<tr class="${i === 0 ? 'table-success' : ''}"><td>${p.id} — ${UI.esc(p.nome)}</td><td class="text-end">${UI.br(p.notas.preco,2)}</td><td class="text-end">${UI.br(p.notas.prazo,2)}</td><td class="text-end">${UI.br(p.notas.qualidade,2)}</td><td class="text-end">${UI.br(p.notas.atendimento,2)}</td><td class="text-end fw-bold">${UI.br(p.nota,2)}</td></tr>`).join("")}</tbody>
          </table></div>
        </div>
        <div class="col-md-5"><canvas id="chartRadarFornecedores" height="220" role="img" aria-label="Radar comparando preço, prazo, qualidade e atendimento"></canvas></div>
      </div>
      ${UI.resultadoDestaque("Ranking: 1º " + forn.propostas[0].id + " (" + UI.br(forn.propostas[0].nota,2) + ") · 2º " + forn.propostas[1].id + " (" + UI.br(forn.propostas[1].nota,2) + ") · 3º " + forn.propostas[2].id + " (" + UI.br(forn.propostas[2].nota,2) + ")")}
    </div>

    <div class="vetta-card">
      <h2 class="h4">4.5 — Fornecedor de menor VP × fornecedor de maior nota</h2>
      ${diferenca > 0 ? `
      <p>Diferença por pedido entre ${vencedor.id} (maior nota) e ${menorVPProp.id} (menor VP) = ${C.fmtMoeda(diferenca)}.</p>
      ${UI.resultadoDestaque("Diferença anual (" + r.n.toFixed(0) + " pedidos) ≈ " + C.fmtMoeda(diferencaAnual) + " a mais com " + vencedor.id)}
      <p>Desconto à vista que Fernanda deve negociar com ${vencedor.id} para igualar o menor VP ≈ <strong>${UI.br(descontoNecessario,2)}%</strong>.</p>
      ` : `<p>Neste cenário, o fornecedor de maior nota também tem o menor valor presente — a decisão é direta.</p>`}
      <p><strong>Recomendação:</strong> ${forn.propostas[0].id} — ${UI.esc(forn.propostas[0].nome)} como fornecedor principal (melhor nota, menor risco de ruptura, menos estoque necessário), negociando o desconto à vista indicado acima; manter o segundo colocado como fornecedor homologado de contingência para reduzir dependência de um único fornecedor.</p>
      <p class="small text-muted mb-0">Este é o ponto pedagógico central da etapa: o custo não é o único critério, mas o custo da escolha precisa estar explícito e quantificado — nunca escondido.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">4.6 — Cadastro de um fornecedor novo</h2>
      <p>Antes de comprar de um fornecedor novo, é preciso cadastrá-lo. Itens de verificação cadastral recomendados:</p>
      <ul class="mb-0">
        <li>CNPJ ativo e situação cadastral regular.</li>
        <li>Certidões negativas (federal, FGTS, trabalhista).</li>
        <li>Contrato social e identificação dos sócios.</li>
        <li>Dados bancários e contato do responsável comercial.</li>
        <li>Referências comerciais e, quando aplicável, conferência de listas restritivas.</li>
      </ul>
    </div>

    <div class="vetta-docente-box">
      <h4>⚠️ Erros comuns a evitar</h4>
      <ul class="mb-0 small">
        <li>Comparar o VP de uma proposta com o valor nominal de outra — todas as propostas precisam estar na mesma data.</li>
        <li>Aplicar o desconto à vista também sobre o frete — o desconto de A incide apenas sobre as mercadorias.</li>
      </ul>
      <p class="small mt-2 mb-0"><strong>Ética:</strong> discuta o conflito de interesses e a importância de registrar os critérios de decisão (rastreabilidade da compra).</p>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "etapa-4") return;
    const forn = avaliacao();
    window.VETTA_CHARTS.radarFornecedores("chartRadarFornecedores", forn.propostas);
  });
})();
