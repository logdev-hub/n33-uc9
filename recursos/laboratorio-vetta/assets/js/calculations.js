/* VETTA EDU — Núcleo de cálculo (fonte única das fórmulas do case).
   Todas as funções são puras: recebem parâmetros e devolvem números/objetos.
   Isso garante que site, simulador e exportação para Excel usem exatamente a mesma lógica. */
(function (global) {
  "use strict";

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
  const ceilInt = (n) => Math.ceil(n - 1e-9);

  // ---------- ETAPA 1 — Curva ABC ----------
  function calcularCurvaABC(itens, limiteA = 80, limiteB = 95) {
    const comValor = itens.map((it) => ({
      ...it,
      valorAnual: it.demanda * it.custoUnit
    }));
    const total = comValor.reduce((s, it) => s + it.valorAnual, 0);
    const ordenado = [...comValor].sort((a, b) => b.valorAnual - a.valorAnual);

    let acumulado = 0;
    const ranking = ordenado.map((it, i) => {
      const percentual = (it.valorAnual / total) * 100;
      acumulado += percentual;
      let classe = "C";
      if (acumulado <= limiteA) classe = "A";
      else if (acumulado <= limiteB) classe = "B";
      return {
        posicao: i + 1,
        item: it.item,
        demanda: it.demanda,
        custoUnit: it.custoUnit,
        valorAnual: it.valorAnual,
        percentual,
        percentualAcumulado: acumulado,
        classe
      };
    });

    const resumoClasses = ["A", "B", "C"].map((classe) => {
      const doClasse = ranking.filter((r) => r.classe === classe);
      const valorClasse = doClasse.reduce((s, r) => s + r.valorAnual, 0);
      return {
        classe,
        qtdItens: doClasse.length,
        percentItens: (doClasse.length / ranking.length) * 100,
        valorClasse,
        percentValor: (valorClasse / total) * 100
      };
    });

    return { total, ranking, resumoClasses };
  }

  // ---------- ETAPA 2 — Política de reposição (LEC / SS / PP) ----------
  function consumoMedioDiario(demandaAnual, diasUteis) {
    return demandaAnual / diasUteis;
  }

  function custoManterUnidade(taxaManutencao, custoUnitario) {
    return taxaManutencao * custoUnitario;
  }

  function loteEconomicoCompra(demandaAnual, custoPedido, custoManter) {
    return Math.sqrt((2 * demandaAnual * custoPedido) / custoManter);
  }

  function numeroPedidosAno(demandaAnual, lec) {
    return demandaAnual / lec;
  }

  function intervaloEntrePedidos(diasUteis, numeroPedidos) {
    return diasUteis / numeroPedidos;
  }

  function estoqueSeguranca(consumoMaximo, consumoMedio, tempoReposicao) {
    return (consumoMaximo - consumoMedio) * tempoReposicao;
  }

  function estoqueSegurancaEstatistico(z, sigma, tempoReposicao) {
    return z * sigma * Math.sqrt(tempoReposicao);
  }

  function pontoPedido(consumoMedio, tempoReposicao, ss) {
    return consumoMedio * tempoReposicao + ss;
  }

  function estoqueMaximo(ss, lec) {
    return ss + lec;
  }

  function estoqueMedio(lec, ss) {
    return lec / 2 + ss;
  }

  function custoTotalAnual(demandaAnual, custoUnitario, q, custoPedido, custoManter) {
    const compra = demandaAnual * custoUnitario;
    const pedir = (demandaAnual / q) * custoPedido;
    const manter = (q / 2) * custoManter;
    return { compra, pedir, manter, total: compra + pedir + manter };
  }

  function politicaReposicaoCompleta(params) {
    const {
      demandaAnual, custoUnitario, custoPedido, taxaManutencao,
      diasUteis, tempoReposicao, consumoMaximo, qAtual, saldoAtual
    } = params;

    const cmed = consumoMedioDiario(demandaAnual, diasUteis);
    const h = custoManterUnidade(taxaManutencao, custoUnitario);
    const lecExato = loteEconomicoCompra(demandaAnual, custoPedido, h);
    const n = numeroPedidosAno(demandaAnual, lecExato);
    const intervalo = intervaloEntrePedidos(diasUteis, n);
    const consumoNoTR = cmed * tempoReposicao;
    const ss = estoqueSeguranca(consumoMaximo, cmed, tempoReposicao);
    const pp = pontoPedido(cmed, tempoReposicao, ss);
    const emax = estoqueMaximo(ss, lecExato);
    const emed = estoqueMedio(lecExato, ss);
    const ctAtual = custoTotalAnual(demandaAnual, custoUnitario, qAtual, custoPedido, h);
    const ctLec = custoTotalAnual(demandaAnual, custoUnitario, lecExato, custoPedido, h);
    const economiaAnual = ctAtual.total - ctLec.total;
    const diasAtePP = (saldoAtual - pp) / cmed;

    return {
      cmed, h, lec: lecExato, n, intervalo, consumoNoTR, ss, pp, emax, emed,
      ctAtual, ctLec, economiaAnual, diasAtePP
    };
  }

  // ---------- ETAPA 3 — Indicadores e inventário ----------
  function giroEstoque(consumoAnualRS, estoqueMedioRS) {
    return consumoAnualRS / estoqueMedioRS;
  }

  function coberturaDias(diasUteis, giro) {
    return diasUteis / giro;
  }

  function acuraciadeItens(itensSemDivergencia, itensContados) {
    return (itensSemDivergencia / itensContados) * 100;
  }

  function acuraciadeValor(somaDivergenciasAbsolutas, valorTotalSistema) {
    return (1 - somaDivergenciasAbsolutas / valorTotalSistema) * 100;
  }

  function calcularInventario(itens) {
    const linhas = itens.map((it) => {
      const divergenciaUn = it.qtdFisica - it.qtdSistema;
      const divergenciaRS = divergenciaUn * it.custoUnit;
      const valorSistema = it.qtdSistema * it.custoUnit;
      return { ...it, divergenciaUn, divergenciaRS, valorSistema };
    });
    const itensSemDivergencia = linhas.filter((l) => l.divergenciaUn === 0).length;
    const somaAbs = linhas.reduce((s, l) => s + Math.abs(l.divergenciaRS), 0);
    const somaLiquida = linhas.reduce((s, l) => s + l.divergenciaRS, 0);
    const valorTotalSistema = linhas.reduce((s, l) => s + l.valorSistema, 0);

    return {
      linhas,
      itensSemDivergencia,
      totalItens: linhas.length,
      somaAbs,
      somaLiquida,
      valorTotalSistema,
      acuraciadeItens: acuraciadeItens(itensSemDivergencia, linhas.length),
      acuraciadeValor: acuraciadeValor(somaAbs, valorTotalSistema)
    };
  }

  // ---------- ETAPA 4 — Fornecedores ----------
  function custoPedidoFornecedor(q, preco, frete) {
    return q * preco + frete;
  }

  function valorPresente(valorFuturo, iMensal, nMeses) {
    return valorFuturo / Math.pow(1 + iMensal, nMeses);
  }

  function taxaImplicitaDesconto(d) {
    return d / (1 - d);
  }

  function notaPreco(menorVP, vp) {
    return (menorVP / vp) * 10;
  }

  function notaPrazo(menorPrazo, prazo) {
    return (menorPrazo / prazo) * 10;
  }

  function notaFinal(notas, pesos) {
    return (
      notas.preco * pesos.preco +
      notas.prazo * pesos.prazo +
      notas.qualidade * pesos.qualidade +
      notas.atendimento * pesos.atendimento
    );
  }

  // Cada condição de pagamento tem seu próprio horizonte: à vista (nMeses = 0,
  // valor nominal já é o valor presente) ou a prazo (nMeses > 0, desconta-se pelo
  // custo de oportunidade). A "melhor condição" de cada fornecedor é a de menor VP.
  function avaliarCondicoesPagamento(q, precoUnit, frete, condicoes, iMensal) {
    return condicoes.map((cond) => {
      const valorMercadorias = q * precoUnit * (1 - (cond.desconto || 0));
      const nominal = valorMercadorias + frete;
      const vp = cond.nMeses > 0 ? valorPresente(nominal, iMensal, cond.nMeses) : nominal;
      return { ...cond, valorMercadorias, nominal, vp };
    });
  }

  function avaliarFornecedores(propostas, q, iMensal, pesos, parametrosEstoque) {
    const custos = propostas.map((p) => {
      const custoPedido = custoPedidoFornecedor(q, p.precoUnit, p.frete); // preço cheio + frete, sem desconto (item 4.1)
      const condicoesAvaliadas = avaliarCondicoesPagamento(q, p.precoUnit, p.frete, p.condicoes, iMensal);
      const melhorCondicao = condicoesAvaliadas.reduce((best, c) => (c.vp < best.vp ? c : best));
      const vp = melhorCondicao.vp;
      return { ...p, custoPedido, condicoesAvaliadas, melhorCondicao, vp };
    });

    const menorVP = Math.min(...custos.map((c) => c.vp));
    const menorPrazo = Math.min(...custos.map((c) => c.prazoDias));

    const comNotas = custos.map((c) => {
      const notas = {
        preco: notaPreco(menorVP, c.vp),
        prazo: notaPrazo(menorPrazo, c.prazoDias),
        qualidade: c.qualidade,
        atendimento: c.atendimento
      };
      const nota = notaFinal(notas, pesos);

      let estoque = null;
      if (parametrosEstoque) {
        const { cmed, cmax } = parametrosEstoque;
        const ss = estoqueSeguranca(cmax, cmed, c.prazoDias);
        const pp = pontoPedido(cmed, c.prazoDias, ss);
        const emed = cmed * parametrosEstoque.diasUteis / parametrosEstoque.diasUteis; // placeholder not used
        estoque = { ss, pp, emed: (parametrosEstoque.lec || 0) / 2 + ss };
      }

      return { ...c, notas, nota, estoque };
    });

    comNotas.sort((a, b) => b.nota - a.nota);
    return { menorVP, menorPrazo, propostas: comNotas };
  }

  // ---------- ETAPA 5 — Patrimônio ----------
  function mesesEntre(dataInicioISO, dataFimISO) {
    const inicio = new Date(dataInicioISO + "T00:00:00");
    const fim = new Date(dataFimISO + "T00:00:00");
    return (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth()) + 1;
  }

  function calcularDepreciacao(bem) {
    const valorResidual = bem.residualPercent * bem.valorAquisicao;
    const valorDepreciavel = bem.valorAquisicao - valorResidual;
    const quotaAnual = valorDepreciavel / bem.vidaUtilAnos;
    const quotaMensal = quotaAnual / 12;
    const meses = mesesEntre(bem.dataAquisicao, bem.dataBase);
    const depAcumulada = Math.min(quotaMensal * meses, valorDepreciavel);
    const valorContabil = bem.valorAquisicao - depAcumulada;
    const percentConsumido = (depAcumulada / valorDepreciavel) * 100;
    const taxaAnual = (quotaAnual / bem.valorAquisicao) * 100;

    return {
      valorResidual, valorDepreciavel, quotaAnual, quotaMensal,
      meses, depAcumulada, valorContabil, percentConsumido, taxaAnual
    };
  }

  function tabelaDepreciacaoPorExercicio(bem) {
    const { quotaMensal, valorDepreciavel } = calcularDepreciacao(bem);
    const inicio = new Date(bem.dataAquisicao + "T00:00:00");
    const fim = new Date(bem.dataBase + "T00:00:00");
    const linhas = [];
    let acumulada = 0;
    for (let ano = inicio.getFullYear(); ano <= fim.getFullYear(); ano++) {
      const mesIni = ano === inicio.getFullYear() ? inicio.getMonth() : 0;
      const mesFim = ano === fim.getFullYear() ? fim.getMonth() : 11;
      const meses = mesFim - mesIni + 1;
      let quota = quotaMensal * meses;
      if (acumulada + quota > valorDepreciavel) quota = valorDepreciavel - acumulada;
      acumulada += quota;
      linhas.push({
        exercicio: ano,
        meses,
        quotaExercicio: quota,
        depAcumulada: acumulada,
        valorContabil: bem.valorAquisicao - acumulada
      });
    }
    return linhas;
  }

  function conformidadePatrimonial(inventario) {
    const conformes = inventario.filter((b) => b.situacao === "Conforme").length;
    const registrados = inventario.filter((b) => b.situacao !== "Sobra física").length;
    return {
      conformes,
      registrados,
      totalComSobra: inventario.length,
      percentSemSobra: (conformes / registrados) * 100,
      percentComSobra: (conformes / inventario.length) * 100
    };
  }

  // ---------- Formatação ----------
  function fmtMoeda(n) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function fmtNum(n, casas = 2) {
    return n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  }
  function fmtPercent(n, casas = 2) {
    return fmtNum(n, casas) + "%";
  }

  global.VETTA_CALC = {
    round2, ceilInt,
    calcularCurvaABC,
    consumoMedioDiario, custoManterUnidade, loteEconomicoCompra, numeroPedidosAno,
    intervaloEntrePedidos, estoqueSeguranca, estoqueSegurancaEstatistico, pontoPedido,
    estoqueMaximo, estoqueMedio, custoTotalAnual, politicaReposicaoCompleta,
    giroEstoque, coberturaDias, acuraciadeItens, acuraciadeValor, calcularInventario,
    custoPedidoFornecedor, valorPresente, taxaImplicitaDesconto, notaPreco, notaPrazo,
    notaFinal, avaliarFornecedores,
    mesesEntre, calcularDepreciacao, tabelaDepreciacaoPorExercicio, conformidadePatrimonial,
    fmtMoeda, fmtNum, fmtPercent
  };
})(window);
