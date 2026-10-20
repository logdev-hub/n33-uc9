/* VETTA EDU — Etapa 2: Política de reposição do toner (LEC, SS, PP) */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const C = window.VETTA_CALC;
  const D = window.VETTA_DATA;

  function dadosBase() {
    const p = D.reposicaoToner;
    return {
      demandaAnual: p.demandaAnual, custoUnitario: p.custoUnitario, custoPedido: p.custoPedido,
      taxaManutencao: p.taxaManutencao, diasUteis: D.empresa.diasUteisAno,
      tempoReposicao: p.tempoReposicaoDiasUteis, consumoMaximo: p.consumoMaximoDiario,
      qAtual: p.politicaAtualQ, saldoAtual: p.saldoAtual
    };
  }

  // Simulação estática do ciclo de estoque (determinística: consumo = Cméd por dia,
  // pedido emitido assim que o saldo projetado atinge o PP, chega após TR dias).
  // Começa no estoque máximo (SS + LEC) e cobre ~3 ciclos completos de reposição.
  function gerarSerieEstoque(r, tempoReposicao, nCiclos) {
    const cicloDias = Math.max(1, Math.round(r.lec / r.cmed));
    const totalDias = cicloDias * nCiclos + tempoReposicao + 2;
    let saldo = r.ss + r.lec;
    let pedidosEmTransito = [];
    const historico = [saldo];
    for (let dia = 1; dia <= totalDias; dia++) {
      saldo -= r.cmed;
      pedidosEmTransito = pedidosEmTransito.filter((p) => {
        if (p.chegaNoDia === dia) { saldo += p.qtd; return false; }
        return true;
      });
      if (saldo <= r.pp && pedidosEmTransito.length === 0) {
        pedidosEmTransito.push({ qtd: r.lec, chegaNoDia: dia + tempoReposicao });
      }
      historico.push(Math.max(saldo, 0));
    }
    return historico;
  }

  window.VETTA_VIEWS.etapa2 = function () {
    const r = C.politicaReposicaoCompleta(dadosBase());
    const ssStat = C.estoqueSegurancaEstatistico(D.reposicaoToner.desafioEstatistico.z95, D.reposicaoToner.desafioEstatistico.sigma, D.reposicaoToner.tempoReposicaoDiasUteis);
    const ssStatArred = Math.ceil(ssStat);
    const ppStat = r.consumoNoTR + ssStatArred;
    const diferencaCustoSS = (r.ss - ssStatArred) * r.h;

    return `
    ${UI.heroEtapa(2, "Política de reposição do toner", "Descubra quanto e quando comprar: LEC, estoque de segurança e ponto de pedido", "55 min")}

    <div class="vetta-card">
      <p>Renata reuniu os dados do cartucho de toner. Hoje a VETTA compra <strong>150 unidades por pedido</strong>, sem critério técnico, e mesmo assim já teve duas rupturas. Fernanda quer uma política baseada em números.</p>
      ${UI.tabelaDados([
        { descricao: "Demanda anual (D)", valor: "900", unidade: "un/ano" },
        { descricao: "Custo unitário (Cu)", valor: "R$ 210,00", unidade: "R$/un" },
        { descricao: "Custo de emitir um pedido (S)", valor: "R$ 84,00", unidade: "R$/pedido" },
        { descricao: "Taxa de manutenção do estoque (i)", valor: "20%", unidade: "ao ano" },
        { descricao: "Tempo de reposição (TR)", valor: "10", unidade: "dias úteis" },
        { descricao: "Consumo máximo diário observado", valor: "5", unidade: "un/dia" },
        { descricao: "Dias úteis por ano", valor: "250", unidade: "dias" },
        { descricao: "Política atual de compra (Q)", valor: "150", unidade: "un/pedido" },
        { descricao: "Saldo em estoque hoje", valor: "52", unidade: "un" }
      ])}
      ${UI.cardAlma("O custo de emitir um pedido (S) reúne mão de obra da compra, comunicação, conferência e recebimento. O custo de manter (H) reúne capital parado, armazenagem, seguro e obsolescência. O LEC busca o ponto em que a soma dos dois é a menor possível.")}
    </div>

    <div class="vetta-card">
      <h2 class="h4">🧮 2.1 e 2.2 — Consumo médio, custo de manter e Lote Econômico de Compra</h2>
      ${UI.passo(1, "Entenda o problema", "<p>A VETTA precisa decidir <strong>quantas unidades de toner comprar a cada pedido</strong>. Comprar pouco aumenta o número de pedidos (e o custo de pedir); comprar muito aumenta o estoque parado (e o custo de manter).</p>")}
      ${UI.passo(2, "Descubra por que o cálculo é necessário", "<p>O Lote Econômico de Compra (LEC) encontra o tamanho de pedido que minimiza a soma dos dois custos que competem entre si.</p>")}
      ${UI.passo(3, "Conheça os dados", UI.tabelaDados([
        { descricao: "Demanda anual (D)", valor: "900", unidade: "un/ano" },
        { descricao: "Custo de emitir um pedido (S)", valor: "R$ 84,00", unidade: "R$" },
        { descricao: "Taxa de manutenção (i)", valor: "20%", unidade: "%" },
        { descricao: "Custo unitário (Cu)", valor: "R$ 210,00", unidade: "R$" }
      ]))}
      ${UI.passo(4, "Entenda a fórmula", UI.formula("Cméd = D ÷ dias úteis\nH = i × Cu\nLEC = √( 2 × D × S ÷ H )"))}
      ${UI.passo(5, "Substitua os valores", UI.formula(`Cméd = 900 ÷ 250\nH = 0,20 × 210,00\nLEC = √( 2 × 900 × 84 ÷ ${UI.br(r.h,2)} )`))}
      ${UI.passo(6, "Resolva passo a passo", `<p>Cméd = 900 ÷ 250 = <strong>${UI.br(r.cmed,2)} un/dia</strong></p><p>H = 0,20 × 210,00 = <strong>${C.fmtMoeda(r.h)}</strong> por unidade/ano</p><p>LEC = √(151.200 ÷ 42) = √3.600 = <strong>${UI.br(r.lec,2)} un</strong></p>`)}
      ${UI.passo(7, "Interprete o resultado", `${UI.resultadoDestaque("LEC = " + r.lec.toFixed(0) + " unidades por pedido")}<p>Esse é o tamanho de pedido que equilibra os dois custos — não é o maior nem o menor lote possível, é o <em>mais econômico</em>.</p>`, "resultado")}
      ${UI.passo(8, "Reflita sobre a gestão", `<ul>
        <li>O consumo médio diário não significa que todo dia a VETTA usa exatamente 3,6 cartuchos — é uma média para planejamento.</li>
        <li>Se a empresa ignorar o LEC e continuar comprando por "feeling", ela paga mais caro em custo de pedir e manter juntos, como veremos na comparação de custos totais.</li>
        <li>O LEC pressupõe demanda estável e preço sem desconto por volume — limitações que precisam ser lembradas antes de aplicar o modelo cegamente.</li></ul>`, "reflexao")}
      ${UI.passo(9, "Aplique no Excel", UI.excelCelula("B6", "=B4/B5", "3,60", "B4 = demanda anual (900); B5 = dias úteis (250).") +
        UI.excelCelula("B9", "=RAIZ((2*B4*B7)/(B8*C4))", "60,00", "B7 = custo do pedido (84); B8 = taxa de manutenção (20%); C4 = custo unitário (210,00)."))}
      ${UI.passo(10, "Experimente uma mudança", `<p>No <a href="#/simulador">Simulador Gerencial</a>, dobre o tempo de reposição ou reduza o custo de pedir para R$ 21,00 e observe como o LEC muda.</p>`)}
    </div>

    <div class="vetta-card">
      <h2 class="h4">📈 Curvas de custo e ponto econômico</h2>
      <canvas id="chartLEC2" height="220" role="img" aria-label="Gráfico das curvas de custo de pedir, manter e total"></canvas>
      <p class="small text-muted mt-2">Alternativa textual: a curva de custo de pedir cai conforme o lote aumenta; a curva de custo de manter sobe; a curva de custo total relevante tem seu ponto mais baixo exatamente em Q = ${r.lec.toFixed(0)} unidades.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">2.3 — Pedidos por ano e intervalo entre pedidos</h2>
      ${UI.formula("N = D ÷ LEC\nIntervalo = dias úteis ÷ N")}
      <p>N = 900 ÷ 60 = <strong>${r.n.toFixed(0)} pedidos/ano</strong> · Intervalo = 250 ÷ 15 ≈ <strong>${UI.br(r.intervalo,1)} dias úteis</strong> entre pedidos.</p>
      ${UI.resultadoDestaque("Valor de cada pedido a preço de tabela = " + C.fmtMoeda(r.lec * D.reposicaoToner.custoUnitario))}
      <p class="small text-muted">Esse intervalo é uma média estimada, não uma obrigação de emitir pedidos em datas fixas do calendário.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">2.4 e 2.5 — Estoque de segurança, ponto de pedido, estoque máximo e médio</h2>
      ${UI.formula("Consumo no TR = Cméd × TR\nSS = (Cmáx − Cméd) × TR\nPP = Cméd × TR + SS\nEmáx = SS + LEC\nEméd = LEC ÷ 2 + SS")}
      <div class="row g-2 mt-1">
        <div class="col-6 col-md-3">${UI.statTile(r.consumoNoTR.toFixed(0) + " un", "consumo durante o TR")}</div>
        <div class="col-6 col-md-3">${UI.statTile(r.ss.toFixed(0) + " un", "estoque de segurança (SS)")}</div>
        <div class="col-6 col-md-3">${UI.statTile(r.pp.toFixed(0) + " un", "ponto de pedido (PP)")}</div>
        <div class="col-6 col-md-3">${UI.statTile(r.emax.toFixed(0) + " un", "estoque máximo")}</div>
      </div>
      <p class="mt-2">Estoque médio (Eméd) = ${r.lec.toFixed(0)} ÷ 2 + ${r.ss.toFixed(0)} = <strong>${r.emed.toFixed(0)} unidades</strong>.</p>
      <p class="small text-muted">Conferência: quando o pedido chega, o saldo é PP − consumo no TR + LEC = ${r.pp.toFixed(0)} − ${r.consumoNoTR.toFixed(0)} + ${r.lec.toFixed(0)} = ${(r.pp - r.consumoNoTR + r.lec).toFixed(0)} = Emáx ✓</p>
      <p>O SS cobre o pior dia observado (consumo máximo) durante todo o tempo de reposição — é o "colchão" contra a ruptura.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">🎬 Simule o ciclo de estoque do toner</h2>
      <p class="small text-muted">Simulação de ~3 ciclos de reposição a partir do estoque cheio (SS + LEC).</p>
      <canvas id="chartEstoqueSim" height="220" role="img" aria-label="Simulação do saldo de estoque ao longo do tempo"></canvas>
      <p class="mt-2">O saldo cai todo dia útil no ritmo do consumo médio (Cméd). Assim que toca a linha laranja (ponto de pedido), um novo lote de ${r.lec.toFixed(0)} unidades é emitido; durante o tempo de reposição (${D.reposicaoToner.tempoReposicaoDiasUteis} dias úteis) o saldo continua caindo sozinho, sustentado pelo estoque de segurança (linha vermelha), até o pedido chegar e o saldo saltar de volta para perto do topo. O "dente de serra" se repete em cada ciclo porque a política é a mesma a cada vez: pedir o LEC assim que cruzar o PP.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">2.6 — Comparando a política atual com o LEC</h2>
      ${UI.formula("CT = D × Cu + (D ÷ Q) × S + (Q ÷ 2) × H")}
      <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
        <thead><tr><th>Custo anual</th><th class="text-end">Política atual (Q=150)</th><th class="text-end">Política LEC (Q=60)</th></tr></thead>
        <tbody>
          <tr><td>Custo de compra (D × Cu)</td><td class="text-end">${C.fmtMoeda(r.ctAtual.compra)}</td><td class="text-end">${C.fmtMoeda(r.ctLec.compra)}</td></tr>
          <tr><td>Custo de pedir</td><td class="text-end">${C.fmtMoeda(r.ctAtual.pedir)}</td><td class="text-end">${C.fmtMoeda(r.ctLec.pedir)}</td></tr>
          <tr><td>Custo de manter</td><td class="text-end">${C.fmtMoeda(r.ctAtual.manter)}</td><td class="text-end">${C.fmtMoeda(r.ctLec.manter)}</td></tr>
          <tr class="fw-bold"><td>Custo total</td><td class="text-end">${C.fmtMoeda(r.ctAtual.total)}</td><td class="text-end">${C.fmtMoeda(r.ctLec.total)}</td></tr>
        </tbody>
      </table></div>
      ${UI.resultadoDestaque("Economia anual = " + C.fmtMoeda(r.economiaAnual) + " (" + C.fmtPercent((r.economiaAnual/r.ctAtual.total)*100) + " do custo total; " + C.fmtPercent((r.economiaAnual/(r.ctAtual.pedir+r.ctAtual.manter))*100) + " do custo de pedir + manter, que é o que a gestão controla)")}
      <p class="small text-muted mt-2">No LEC, custo de pedir = custo de manter (${C.fmtMoeda(r.ctLec.pedir)} cada) — este é o ponto de equilíbrio clássico do modelo. <strong>Importante:</strong> esta fórmula compara o custo do estoque cíclico e não inclui separadamente o custo de manter o estoque de segurança (SS × H = ${C.fmtMoeda(r.ss*r.h)}/ano), que é igual nas duas políticas porque o SS não muda com Q.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">2.7 — Quando emitir o próximo pedido?</h2>
      ${UI.formula("Dias até o PP = (Saldo atual − PP) ÷ Cméd")}
      <p>Dias até o PP = (52 − 50) ÷ 3,6 ≈ <strong>${UI.br(r.diasAtePP,2)} dia útil</strong>.</p>
      ${UI.resultadoDestaque("Emitir pedido de " + r.lec.toFixed(0) + " unidades assim que o saldo chegar a " + r.pp.toFixed(0) + " un (ou já, por segurança, dada a proximidade)")}
      <p class="small text-muted">Por que não esperar o saldo zerar? Porque o pedido leva ${D.reposicaoToner.tempoReposicaoDiasUteis} dias úteis para chegar, e o consumo nesse período é de ${r.consumoNoTR.toFixed(0)} unidades.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">2.8 — Desafio: estoque de segurança estatístico</h2>
      ${UI.formula("SS = Z × σ × √TR")}
      <p>Com Z = 1,65 (nível de serviço de 95%) e σ = 1,2 un/dia: SS = 1,65 × 1,2 × √10 ≈ <strong>${UI.br(ssStat,2)}</strong> → adotar <strong>${ssStatArred} unidades</strong> (arredondar para cima).</p>
      <p>Novo PP = ${r.consumoNoTR.toFixed(0)} + ${ssStatArred} = <strong>${ppStat.toFixed(0)} unidades</strong>.</p>
      ${UI.resultadoDestaque("Diferença de estoque = " + (r.ss - ssStatArred).toFixed(0) + " un × " + C.fmtMoeda(r.h) + " = " + C.fmtMoeda(diferencaCustoSS) + " a menos de custo de manter por ano")}
      <p class="small text-muted">O método simples ((Cmáx−Cméd)×TR) é bem mais conservador que o estatístico. A escolha depende da criticidade: para o toner, que já parou a emissão de notas fiscais, uma decisão intermediária é defensável.</p>
    </div>

    <div class="vetta-docente-box">
      <h4>⚠️ Erros comuns a evitar</h4>
      <ul class="mb-0 small">
        <li>Esquecer de multiplicar por 2 dentro da raiz quadrada, ou usar a taxa de manutenção (20%) sem multiplicar pelo custo unitário.</li>
        <li>Usar 365 dias em vez dos 250 dias úteis fixados para a VETTA.</li>
        <li>Somar o SS ao LEC no cálculo do estoque médio sem dividir o LEC por 2.</li>
      </ul>
      <p class="small mt-2 mb-0"><strong>Limites do modelo:</strong> demanda constante, preço sem desconto por quantidade e capacidade de armazenagem ilimitada.</p>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "etapa-2") return;
    const base = dadosBase();
    const r = C.politicaReposicaoCompleta(base);
    window.VETTA_CHARTS.lecCurveChart("chartLEC2", { demandaAnual: base.demandaAnual, custoPedido: base.custoPedido, custoManter: r.h, lecOtimo: r.lec });
    const serie = gerarSerieEstoque(r, base.tempoReposicao, 3);
    window.VETTA_CHARTS.estoqueAoLongoDoTempoChart("chartEstoqueSim", serie, r.ss, r.pp);
  });
})();
