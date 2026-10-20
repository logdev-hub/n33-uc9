/* VETTA EDU — geração da planilha real (.xlsx) com fórmulas vivas, no navegador,
   via xlsx-js-style (fork do SheetJS com suporte a estilo de célula), carregada por
   CDN. Gerado sob demanda (clique do usuário), sem necessidade de backend ou passo
   de build com Node.
   As fórmulas são gravadas no formato interno do Office Open XML (nomes de função em
   inglês, argumentos separados por vírgula) — é assim que todo arquivo .xlsx guarda
   fórmulas internamente; o Excel em português do Brasil as exibe com SOMA, SE, ; etc.
   automaticamente, de acordo com o idioma da instalação do usuário.

   Duas versões são geradas a partir das mesmas funções construirX(), para que os
   dados e fórmulas nunca fiquem divergentes entre elas:
   - "exercicio": aba Curva ABC com % acumulado e Classe em branco, para o aluno
     ordenar e calcular na mão (como no case original).
   - "gabarito": a mesma aba já ordenada e resolvida, para conferência do professor.
   As cores de preenchimento reaproveitam a paleta visual do site (ver
   assets/css/styles.css e assets/js/charts.js), para que a planilha pareça uma
   extensão do mesmo material, não um documento solto. */
(function (global) {
  "use strict";
  const D = global.VETTA_DATA;
  const C = global.VETTA_CALC;
  const BRL = "R$ #,##0.00";
  const PCT = "0.00%";
  const NUM2 = "0.00";

  // Paleta — mesmos valores de assets/css/styles.css (modo claro) e charts.js.
  const COR = {
    azul: "064C8C", azulEscuro: "04335E", azulClaro: "E8F1F8",
    laranja: "F7941D", verde: "2E7D4F", verdeEscuro: "1F5D37", verdeClaro: "E7F4EC",
    cinza: "9AA7B3", branco: "FFFFFF", alertaBg: "FFF4E5", alertaTexto: "7A4A00",
    borda: "D8E3EE"
  };

  const FONTE = { name: "Calibri", sz: 11 };

  const ESTILO = {
    titulo: { font: { ...FONTE, sz: 14, bold: true, color: { rgb: COR.azul } } },
    subtitulo: { font: { ...FONTE, bold: true, color: { rgb: COR.azulEscuro } } },
    header: {
      font: { ...FONTE, bold: true, color: { rgb: COR.branco } },
      fill: { patternType: "solid", fgColor: { rgb: COR.azul } },
      alignment: { vertical: "center", wrapText: true }
    },
    total: {
      font: { ...FONTE, bold: true },
      border: { top: { style: "thin", color: { rgb: COR.borda } } }
    },
    destaque: {
      font: { ...FONTE, bold: true, color: { rgb: COR.branco } },
      fill: { patternType: "solid", fgColor: { rgb: COR.azul } }
    },
    input: {
      font: { ...FONTE, color: { rgb: COR.azulEscuro } },
      fill: { patternType: "solid", fgColor: { rgb: COR.azulClaro } }
    },
    formula: {
      font: { ...FONTE, color: { rgb: COR.verdeEscuro } },
      fill: { patternType: "solid", fgColor: { rgb: COR.verdeClaro } }
    },
    alerta: {
      font: { ...FONTE, italic: true, color: { rgb: COR.alertaTexto } },
      fill: { patternType: "solid", fgColor: { rgb: COR.alertaBg } },
      border: { top: { style: "dashed", color: { rgb: COR.laranja } }, bottom: { style: "dashed", color: { rgb: COR.laranja } }, left: { style: "dashed", color: { rgb: COR.laranja } }, right: { style: "dashed", color: { rgb: COR.laranja } } }
    },
    classeA: { font: { ...FONTE, bold: true, color: { rgb: "2B1A00" } }, fill: { patternType: "solid", fgColor: { rgb: COR.laranja } }, alignment: { horizontal: "center" } },
    classeB: { font: { ...FONTE, bold: true, color: { rgb: COR.branco } }, fill: { patternType: "solid", fgColor: { rgb: COR.azul } }, alignment: { horizontal: "center" } },
    classeC: { font: { ...FONTE, bold: true, color: { rgb: COR.branco } }, fill: { patternType: "solid", fgColor: { rgb: COR.cinza } }, alignment: { horizontal: "center" } }
  };

  function aoa(rows) {
    return XLSX.utils.aoa_to_sheet(rows);
  }

  function setCols(ws, larguras) {
    ws["!cols"] = larguras.map((w) => ({ wch: w }));
  }

  function setNumFmt(ws, ref, fmt) {
    if (ws[ref]) ws[ref].z = fmt;
  }

  function setEstilo(ws, ref, estilo) {
    if (ws[ref]) ws[ref].s = estilo;
  }

  function estilizarLinha(ws, linha, nColunas, estilo) {
    for (let c = 0; c < nColunas; c++) {
      setEstilo(ws, XLSX.utils.encode_cell({ r: linha - 1, c }), estilo);
    }
  }

  function estilizarColuna(ws, coluna, linhaInicio, linhaFim, estilo) {
    for (let r = linhaInicio; r <= linhaFim; r++) setEstilo(ws, coluna + r, estilo);
  }

  function construirInstrucoes(modo) {
    const tituloModo = modo === "gabarito"
      ? "VERSÃO GABARITO — com a Curva ABC já resolvida (uso do professor)"
      : "VERSÃO EXERCÍCIO — a aba Curva ABC traz colunas em branco para o aluno preencher";
    const rows = [
      ["VETTA EDU — Gestão de Materiais e Patrimônio"],
      [tituloModo],
      ["Planilha de apoio ao Case VETTA (Senac Guarulhos, Técnico em Administração, UC 9)"],
      [""],
      ["Como usar esta pasta de trabalho:"],
      ["1. Os valores em azul (abas de Parâmetros) podem ser alterados — as demais abas recalculam automaticamente."],
      ["2. Os valores em verde são resultados calculados por fórmula — não digite sobre eles."],
      ["3. Células em laranja indicam alertas ou pontos que merecem revisão manual (ou, na versão Exercício, pontos a preencher)."],
      [""],
      ["Abas desta pasta de trabalho:"],
      ["00 Instruções — esta página"],
      ["01 Parâmetros — dados globais e hipóteses do case"],
      ["02 Curva ABC — classificação de materiais por valor movimentado"],
      ["03 Reposição — consumo médio, LEC, estoque de segurança e ponto de pedido"],
      ["04 Custos — comparação entre política atual e política do LEC"],
      ["05 Indicadores — giro, cobertura e capital liberado"],
      ["06 Inventário Estoque — divergências e acuracidade"],
      ["07 Fornecedores — cotações, valor presente e taxa implícita"],
      ["08 Matriz Decisão — notas ponderadas por fornecedor"],
      ["09 Depreciação — cálculo patrimonial da empilhadeira"],
      ["10 Inventário Bens — conciliação física do patrimônio"],
      ["11 Relatório Gerencial — síntese e plano de ação"],
      [""],
      ["Fonte: Guia do Docente do Case VETTA — conteúdo didático adaptado para uso em sala de aula."]
    ];
    const ws = aoa(rows);
    setCols(ws, [100]);
    setEstilo(ws, "A1", ESTILO.titulo);
    setEstilo(ws, "A2", modo === "gabarito" ? ESTILO.formula : ESTILO.alerta);
    setEstilo(ws, "A10", ESTILO.subtitulo);
    return ws;
  }

  function construirParametros() {
    const rows = [
      ["Parâmetro", "Valor", "Unidade"],
      ["Dias úteis por ano", D.empresa.diasUteisAno, "dias"],
      ["Demanda anual do toner (D)", D.reposicaoToner.demandaAnual, "un/ano"],
      ["Custo unitário do toner (Cu)", D.reposicaoToner.custoUnitario, "R$"],
      ["Custo de emitir um pedido (S)", D.reposicaoToner.custoPedido, "R$"],
      ["Taxa de manutenção anual (i)", D.reposicaoToner.taxaManutencao, "%"],
      ["Tempo de reposição (TR)", D.reposicaoToner.tempoReposicaoDiasUteis, "dias úteis"],
      ["Consumo máximo diário observado", D.reposicaoToner.consumoMaximoDiario, "un/dia"],
      ["Política atual de compra (Q)", D.reposicaoToner.politicaAtualQ, "un/pedido"],
      ["Saldo em estoque hoje", D.reposicaoToner.saldoAtual, "un"]
    ];
    const ws = aoa(rows);
    setCols(ws, [35, 15, 14]);
    [5, 6, 7, 8, 9, 10].forEach((r) => setNumFmt(ws, "B" + r, r === 6 ? PCT : NUM2));
    estilizarLinha(ws, 1, 3, ESTILO.header);
    estilizarColuna(ws, "B", 2, 10, ESTILO.input);
    return ws;
  }

  function construirCurvaABC(modo) {
    const itensOriginais = D.abc.itens;
    const header = ["Item", "Demanda anual (un)", "Custo unitário (R$)", "Valor anual (R$)", "% do total", "% acumulado (ordene manualmente)", "Classe (fórmula)"];
    const gabarito = modo === "gabarito";
    // Na versão Gabarito, os itens aparecem já ordenados do maior para o menor valor
    // anual — exatamente o que o aluno deve fazer manualmente na versão Exercício.
    const itens = gabarito ? [...itensOriginais].sort((a, b) => (b.demanda * b.custoUnit) - (a.demanda * a.custoUnit)) : itensOriginais;
    const resultado = gabarito ? C.calcularCurvaABC(itensOriginais, D.abc.limiteA, D.abc.limiteB) : null;

    const rows = [header];
    itens.forEach((it, i) => {
      const linha = i + 2;
      const pctAcumulado = gabarito ? { f: i === 0 ? `E${linha}` : `F${linha - 1}+E${linha}` } : "";
      const classe = gabarito ? { f: `IF(F${linha}<=${D.abc.limiteA / 100},"A",IF(F${linha}<=${D.abc.limiteB / 100},"B","C"))` } : "";
      rows.push([it.item, it.demanda, it.custoUnit, { f: `B${linha}*C${linha}` }, { f: `D${linha}/$D$${itens.length + 2}` }, pctAcumulado, classe]);
    });
    const totalLinha = itens.length + 2;
    rows.push(["TOTAL", { f: `SUM(B2:B${itens.length + 1})` }, "", { f: `SUM(D2:D${itens.length + 1})` }, { f: `SUM(E2:E${itens.length + 1})` }, "", ""]);
    rows.push([""]);
    if (gabarito) {
      rows.push([`Limite Classe A: até ${D.abc.limiteA}% acumulado · Limite Classe B: até ${D.abc.limiteB}% acumulado.`]);
    } else {
      rows.push(["Instruções: 1) ordene a coluna D (valor anual) do maior para o menor usando Dados > Classificar;"]);
      rows.push(["2) na coluna F, calcule o % acumulado com =F2+E3 (primeira linha = E2); 3) na coluna G, use:"]);
      rows.push(['=SE(F2<=0,8;"A";SE(F2<=0,95;"B";"C"))  (exemplo em português; em inglês: =IF(F2<=0.8,"A",IF(F2<=0.95,"B","C")))']);
    }
    const ws = aoa(rows);
    setCols(ws, [28, 16, 16, 16, 12, 16, 10]);
    for (let r = 2; r <= totalLinha; r++) {
      setNumFmt(ws, "C" + r, BRL); setNumFmt(ws, "D" + r, BRL); setNumFmt(ws, "E" + r, PCT); setNumFmt(ws, "F" + r, PCT);
    }
    estilizarLinha(ws, 1, 7, ESTILO.header);
    estilizarColuna(ws, "D", 2, itens.length + 1, ESTILO.formula);
    estilizarLinha(ws, totalLinha, 5, ESTILO.total);
    if (gabarito) {
      estilizarColuna(ws, "F", 2, itens.length + 1, ESTILO.formula);
      resultado.ranking.forEach((r, i) => {
        const linha = i + 2;
        setEstilo(ws, "G" + linha, r.classe === "A" ? ESTILO.classeA : r.classe === "B" ? ESTILO.classeB : ESTILO.classeC);
      });
    } else {
      estilizarColuna(ws, "F", 2, itens.length + 1, ESTILO.alerta);
      estilizarColuna(ws, "G", 2, itens.length + 1, ESTILO.alerta);
      [itens.length + 4, itens.length + 5, itens.length + 6].forEach((r) => setEstilo(ws, "A" + r, ESTILO.alerta));
    }
    return ws;
  }

  function construirReposicao() {
    const rows = [
      ["Grandeza", "Fórmula", "Valor"],
      ["Consumo médio diário (Cméd)", "=Parâmetros!B3/Parâmetros!B2", { f: "Parâmetros!B3/Parâmetros!B2" }],
      ["Custo de manter 1 un/ano (H)", "=Parâmetros!B6*Parâmetros!B4", { f: "Parâmetros!B6*Parâmetros!B4" }],
      ["Lote Econômico de Compra (LEC)", "=SQRT(2*D*S/H)", { f: "SQRT(2*Parâmetros!B3*Parâmetros!B5/C3)" }],
      ["Nº de pedidos por ano (N)", "=D/LEC", { f: "Parâmetros!B3/C4" }],
      ["Intervalo entre pedidos (dias)", "=dias úteis/N", { f: "Parâmetros!B2/C5" }],
      ["Consumo durante o TR", "=Cméd*TR", { f: "C2*Parâmetros!B7" }],
      ["Estoque de segurança (SS)", "=(Cmáx-Cméd)*TR", { f: "(Parâmetros!B8-C2)*Parâmetros!B7" }],
      ["Ponto de pedido (PP)", "=Cméd*TR+SS", { f: "C7+C8" }],
      ["Estoque máximo (Emáx)", "=SS+LEC", { f: "C8+C4" }],
      ["Estoque médio (Eméd)", "=LEC/2+SS", { f: "C4/2+C8" }],
      ["Dias até atingir o PP (saldo atual)", "=(Saldo-PP)/Cméd", { f: "(Parâmetros!B10-C9)/C2" }]
    ];
    const ws = aoa(rows);
    setCols(ws, [34, 30, 14]);
    ["C2", "C3"].forEach((r) => setNumFmt(ws, r, NUM2));
    [4, 5, 6, 7, 8, 9, 10, 11].forEach((r) => setNumFmt(ws, "C" + r, NUM2));
    estilizarLinha(ws, 1, 3, ESTILO.header);
    estilizarColuna(ws, "C", 2, 12, ESTILO.formula);
    return ws;
  }

  function construirCustos() {
    const rows = [
      ["Custo anual", "Política atual (Q)", "Política LEC"],
      ["Q adotado", { f: "Parâmetros!B9" }, { f: "Reposição!C4" }],
      ["Custo de compra (D×Cu)", { f: "Parâmetros!B3*Parâmetros!B4" }, { f: "Parâmetros!B3*Parâmetros!B4" }],
      ["Custo de pedir ((D/Q)×S)", { f: "(Parâmetros!B3/B2)*Parâmetros!B5" }, { f: "(Parâmetros!B3/C2)*Parâmetros!B5" }],
      ["Custo de manter ((Q/2)×H)", { f: "(B2/2)*Reposição!C3" }, { f: "(C2/2)*Reposição!C3" }],
      ["CUSTO TOTAL", { f: "SUM(B3:B5)" }, { f: "SUM(C3:C5)" }],
      ["Economia anual (atual − LEC)", { f: "B6-C6" }, ""]
    ];
    const ws = aoa(rows);
    setCols(ws, [30, 18, 18]);
    for (let r = 2; r <= 7; r++) { setNumFmt(ws, "B" + r, BRL); setNumFmt(ws, "C" + r, BRL); }
    estilizarLinha(ws, 1, 3, ESTILO.header);
    estilizarColuna(ws, "B", 2, 5, ESTILO.formula); estilizarColuna(ws, "C", 2, 5, ESTILO.formula);
    estilizarLinha(ws, 6, 3, ESTILO.total);
    setEstilo(ws, "B7", ESTILO.destaque);
    return ws;
  }

  function construirIndicadores() {
    const rows = [
      ["Indicador", "Política atual", "Política LEC"],
      ["Estoque médio (un)", { f: "Parâmetros!B9/2+Reposição!C8" }, { f: "Reposição!C10" }],
      ["Estoque médio (R$)", { f: "B2*Parâmetros!B4" }, { f: "C2*Parâmetros!B4" }],
      ["Consumo anual (R$)", { f: "Parâmetros!B3*Parâmetros!B4" }, { f: "Parâmetros!B3*Parâmetros!B4" }],
      ["Giro (vezes/ano)", { f: "B4/B3" }, { f: "C4/C3" }],
      ["Cobertura (dias úteis)", { f: "Parâmetros!B2/B5" }, { f: "Parâmetros!B2/C5" }],
      ["Capital liberado (R$)", { f: "B3-C3" }, ""]
    ];
    const ws = aoa(rows);
    setCols(ws, [26, 18, 18]);
    [3, 4].forEach((r) => { setNumFmt(ws, "B" + r, BRL); setNumFmt(ws, "C" + r, BRL); });
    [6].forEach((r) => setNumFmt(ws, "B" + r, BRL));
    [5].forEach((r) => { setNumFmt(ws, "B" + r, NUM2); setNumFmt(ws, "C" + r, NUM2); });
    estilizarLinha(ws, 1, 3, ESTILO.header);
    estilizarColuna(ws, "B", 2, 6, ESTILO.formula); estilizarColuna(ws, "C", 2, 6, ESTILO.formula);
    setEstilo(ws, "B7", ESTILO.destaque);
    return ws;
  }

  function construirInventarioEstoque() {
    const itens = D.inventarioEstoque.itens;
    const header = ["Item", "Custo unitário", "Qtd. sistema", "Qtd. física", "Divergência (un)", "Divergência (R$)", "Valor sistema (R$)", "|Divergência| (R$)"];
    const rows = [header];
    itens.forEach((it, i) => {
      const l = i + 2;
      rows.push([it.item, it.custoUnit, it.qtdSistema, it.qtdFisica, { f: `D${l}-C${l}` }, { f: `E${l}*B${l}` }, { f: `C${l}*B${l}` }, { f: `ABS(F${l})` }]);
    });
    const last = itens.length + 1;
    rows.push(["TOTAL", "", "", "", "", { f: `SUM(F2:F${last})` }, { f: `SUM(G2:G${last})` }, { f: `SUM(H2:H${last})` }]);
    rows.push([""]);
    rows.push(["Itens sem divergência:", { f: `COUNTIF(E2:E${last},0)` }]);
    rows.push(["Total de itens contados:", itens.length]);
    rows.push(["Acuracidade por item (%):", { f: `B${last + 3}/B${last + 4}` }]);
    rows.push(["Acuracidade por valor (%):", { f: `1-H${last + 1}/G${last + 1}` }]);
    const ws = aoa(rows);
    setCols(ws, [26, 14, 12, 12, 14, 16, 16, 16]);
    for (let r = 2; r <= last + 1; r++) { setNumFmt(ws, "B" + r, BRL); setNumFmt(ws, "F" + r, BRL); setNumFmt(ws, "G" + r, BRL); setNumFmt(ws, "H" + r, BRL); }
    setNumFmt(ws, "B" + (last + 5), PCT); setNumFmt(ws, "B" + (last + 6), PCT);
    estilizarLinha(ws, 1, 8, ESTILO.header);
    estilizarLinha(ws, last + 1, 8, ESTILO.total);
    setEstilo(ws, "B" + (last + 5), ESTILO.destaque); setEstilo(ws, "B" + (last + 6), ESTILO.destaque);
    return ws;
  }

  function construirFornecedores() {
    const props = D.fornecedores.propostas;
    const lastProposalRow = props.length + 1; // header = linha 1
    const qtdRow = lastProposalRow + 2;        // 1 linha em branco entre a tabela e os parâmetros
    const custoOpRow = qtdRow + 1;
    const rows = [["Fornecedor", "Preço unit.", "Frete", "Prazo (dias)", "Custo do pedido (Q×preço+frete)", "Desconto à vista", "VP à vista", "VP a prazo (1 mês)", "VP adotado (menor)"]];
    props.forEach((p, i) => {
      const l = i + 2;
      const condVista = p.condicoes.find((c) => c.nMeses === 0);
      const condPrazo = p.condicoes.find((c) => c.nMeses > 0);
      rows.push([
        p.nome, p.precoUnit, p.frete, p.prazoDias,
        { f: `$B$${qtdRow}*B${l}+C${l}` },
        condVista ? condVista.desconto : 0,
        condVista ? { f: `$B$${qtdRow}*B${l}*(1-F${l})+C${l}` } : "—",
        condPrazo ? { f: `(E${l})/(1+$B$${custoOpRow})^1` } : "—",
        { f: condVista && condPrazo ? `MIN(G${l},H${l})` : condVista ? `G${l}` : `H${l}` }
      ]);
    });
    rows.push([""]);
    rows.push(["Quantidade cotada (Q):", D.fornecedores.quantidadeCotada]);
    rows.push(["Custo de oportunidade mensal (i):", D.fornecedores.custoOportunidadeMensal]);
    const ws = aoa(rows);
    setCols(ws, [22, 12, 10, 12, 16, 14, 14, 16, 16]);
    for (let r = 2; r <= lastProposalRow; r++) ["B", "C", "E", "G", "H", "I"].forEach((col) => setNumFmt(ws, col + r, BRL));
    setNumFmt(ws, "B" + custoOpRow, PCT);
    estilizarLinha(ws, 1, 9, ESTILO.header);
    estilizarColuna(ws, "I", 2, lastProposalRow, ESTILO.formula);
    estilizarColuna(ws, "B", qtdRow, custoOpRow, ESTILO.input);
    return ws;
  }

  function construirMatrizDecisao() {
    const pesos = D.fornecedores.pesos;
    const props = D.fornecedores.propostas;
    const fornLastRow = props.length + 1;
    const rows = [["Critério", "Peso", ...props.map((p) => p.nome)]];
    rows.push(["Preço (nota)", pesos.preco, ...props.map((p, i) => ({ f: `MIN(Fornecedores!I2:I${fornLastRow})/Fornecedores!I${i + 2}*10` }))]);
    rows.push(["Prazo (nota)", pesos.prazo, ...props.map((p, i) => ({ f: `MIN(Fornecedores!D2:D${fornLastRow})/Fornecedores!D${i + 2}*10` }))]);
    rows.push(["Qualidade (nota)", pesos.qualidade, ...props.map((p) => p.qualidade)]);
    rows.push(["Atendimento (nota)", pesos.atendimento, ...props.map((p) => p.atendimento)]);
    const colsLetras = props.map((_, i) => String.fromCharCode(67 + i));
    rows.push(["NOTA FINAL", "", ...colsLetras.map((c) => ({ f: `${c}2*$B2+${c}3*$B3+${c}4*$B4+${c}5*$B5` }))]);
    const ws = aoa(rows);
    setCols(ws, [20, 10, 18, 18, 18]);
    setNumFmt(ws, "B2", PCT); setNumFmt(ws, "B3", PCT); setNumFmt(ws, "B4", PCT); setNumFmt(ws, "B5", PCT);
    estilizarLinha(ws, 1, 2 + props.length, ESTILO.header);
    estilizarLinha(ws, 6, 2 + props.length, ESTILO.destaque);
    return ws;
  }

  function construirDepreciacao() {
    const emp = D.patrimonio.empilhadeira;
    const rows = [
      ["Dado", "Valor"],
      ["Valor de aquisição", emp.valorAquisicao],
      ["Data de aquisição", new Date(emp.dataAquisicao)],
      ["Vida útil (anos)", emp.vidaUtilAnos],
      ["% residual", emp.residualPercent],
      ["Data-base", new Date(emp.dataBase)],
      ["Valor residual (R$)", { f: "B2*B5" }],
      ["Valor depreciável (R$)", { f: "B2-B7" }],
      ["Quota anual (R$)", { f: "B8/B4" }],
      ["Quota mensal (R$)", { f: "B9/12" }],
      ["Meses de uso até a data-base", { f: "DATEDIF(B3,B6,\"m\")+1" }],
      ["Depreciação acumulada (R$)", { f: "MIN(B10*B11,B8)" }],
      ["Valor contábil na data-base (R$)", { f: "B2-B12" }]
    ];
    const ws = aoa(rows);
    setCols(ws, [30, 18]);
    setNumFmt(ws, "B2", BRL); setNumFmt(ws, "B3", "dd/mm/yyyy"); setNumFmt(ws, "B5", PCT); setNumFmt(ws, "B6", "dd/mm/yyyy");
    ["B7", "B8", "B9", "B10", "B12", "B13"].forEach((r) => setNumFmt(ws, r, BRL));
    estilizarLinha(ws, 1, 2, ESTILO.header);
    estilizarColuna(ws, "B", 2, 6, ESTILO.input);
    estilizarColuna(ws, "B", 7, 12, ESTILO.formula);
    setEstilo(ws, "B13", ESTILO.destaque);
    return ws;
  }

  function construirInventarioBens() {
    const bens = D.patrimonio.inventarioFisico;
    const header = ["Plaqueta", "Bem", "Local no sistema", "Constatação", "Classe patrimonial", "Situação", "Ação recomendada"];
    const rows = [header, ...bens.map((b) => [b.plaqueta, b.bem, b.localSistema, b.constatacao, b.classe, b.situacao, b.acao])];
    rows.push([""]);
    rows.push(["Bens conformes:", { f: `COUNTIF(F2:F${bens.length + 1},"Conforme")` }]);
    rows.push(["Total de bens registrados (exceto sobra física):", { f: `COUNTIF(F2:F${bens.length + 1},"<>Sobra física")` }]);
    rows.push(["Conformidade (%):", { f: `B${bens.length + 3}/B${bens.length + 4}` }]);
    const ws = aoa(rows);
    setCols(ws, [12, 24, 16, 30, 20, 16, 30]);
    setNumFmt(ws, "B" + (bens.length + 5), PCT);
    estilizarLinha(ws, 1, 7, ESTILO.header);
    setEstilo(ws, "B" + (bens.length + 5), ESTILO.destaque);
    return ws;
  }

  function construirRelatorio() {
    const rows = [
      ["RELATÓRIO GERENCIAL — VETTA Suprimentos & Patrimônio Ltda."],
      [""],
      ["1. Resumo executivo"],
      ["Política recomendada para o toner (LEC/PP/SS):", "", { f: "Reposição!C4" }, "un (LEC)"],
      ["Economia anual estimada:", "", { f: "Custos!B7" }],
      ["Capital liberado estimado:", "", { f: "Indicadores!B6" }],
      [""],
      ["2. Diagnóstico"],
      ["Acuracidade do inventário por item:", "", { f: "'Inventário Estoque'!B" + (D.inventarioEstoque.itens.length + 6) }],
      ["Acuracidade do inventário por valor:", "", { f: "'Inventário Estoque'!B" + (D.inventarioEstoque.itens.length + 7) }],
      [""],
      ["3. Patrimônio"],
      ["Valor contábil da empilhadeira na data-base:", "", { f: "Depreciação!B13" }],
      ["Conformidade do inventário patrimonial:", "", { f: "'Inventário Bens'!B" + (D.patrimonio.inventarioFisico.length + 5) }],
      [""],
      ["4. Riscos e limitações"],
      ["Demanda tratada como estável; preços sem desconto por volume; custo de pedir estimado. Revisar parâmetros a cada trimestre."]
    ];
    const ws = aoa(rows);
    setCols(ws, [45, 4, 18, 14]);
    ["C5", "C6", "C13"].forEach((r) => setNumFmt(ws, r, BRL));
    ["C9", "C10", "C14"].forEach((r) => setNumFmt(ws, r, PCT));
    setEstilo(ws, "A1", ESTILO.titulo);
    ["A3", "A8", "A12", "A17"].forEach((r) => setEstilo(ws, r, ESTILO.subtitulo));
    ["C5", "C6", "C9", "C10", "C13", "C14"].forEach((r) => setEstilo(ws, r, ESTILO.formula));
    return ws;
  }

  function gerarWorkbook(modo) {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, construirInstrucoes(modo), "00 Instruções");
    XLSX.utils.book_append_sheet(wb, construirParametros(), "Parâmetros");
    XLSX.utils.book_append_sheet(wb, construirCurvaABC(modo), "Curva ABC");
    XLSX.utils.book_append_sheet(wb, construirReposicao(), "Reposição");
    XLSX.utils.book_append_sheet(wb, construirCustos(), "Custos");
    XLSX.utils.book_append_sheet(wb, construirIndicadores(), "Indicadores");
    XLSX.utils.book_append_sheet(wb, construirInventarioEstoque(), "Inventário Estoque");
    XLSX.utils.book_append_sheet(wb, construirFornecedores(), "Fornecedores");
    XLSX.utils.book_append_sheet(wb, construirMatrizDecisao(), "Matriz Decisão");
    XLSX.utils.book_append_sheet(wb, construirDepreciacao(), "Depreciação");
    XLSX.utils.book_append_sheet(wb, construirInventarioBens(), "Inventário Bens");
    XLSX.utils.book_append_sheet(wb, construirRelatorio(), "Relatório Gerencial");
    return wb;
  }

  function baixarPlanilha(modo) {
    if (typeof XLSX === "undefined") {
      alert("A biblioteca de geração de planilhas não carregou (verifique sua conexão com a internet). Tente novamente.");
      return;
    }
    const wb = gerarWorkbook(modo);
    const nomeArquivo = modo === "gabarito"
      ? "VETTA_Gestao_Materiais_Patrimonio_Gabarito_Excel365.xlsx"
      : "VETTA_Gestao_Materiais_Patrimonio_Exercicio_Excel365.xlsx";
    XLSX.writeFile(wb, nomeArquivo);
  }

  global.VETTA_EXCEL_EXPORT = { gerarWorkbook, baixarPlanilha };
})(window);
