/* VETTA EDU — Etapa 6: Relatório gerencial */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const C = window.VETTA_CALC;
  const D = window.VETTA_DATA;

  function dadosConsolidados() {
    const abc = C.calcularCurvaABC(D.abc.itens, D.abc.limiteA, D.abc.limiteB);
    const p = D.reposicaoToner;
    const r = C.politicaReposicaoCompleta({
      demandaAnual: p.demandaAnual, custoUnitario: p.custoUnitario, custoPedido: p.custoPedido,
      taxaManutencao: p.taxaManutencao, diasUteis: D.empresa.diasUteisAno,
      tempoReposicao: p.tempoReposicaoDiasUteis, consumoMaximo: p.consumoMaximoDiario,
      qAtual: p.politicaAtualQ, saldoAtual: p.saldoAtual
    });
    const consumoAnualRS = p.demandaAnual * p.custoUnitario;
    const giroLec = C.giroEstoque(consumoAnualRS, r.emed * p.custoUnitario);
    const covLec = C.coberturaDias(D.empresa.diasUteisAno, giroLec);
    const emedAtual = p.politicaAtualQ / 2 + r.ss;
    const giroAtual = C.giroEstoque(consumoAnualRS, emedAtual * p.custoUnitario);
    const covAtual = C.coberturaDias(D.empresa.diasUteisAno, giroAtual);
    const capitalLiberado = (emedAtual - r.emed) * p.custoUnitario;
    const inv = C.calcularInventario(D.inventarioEstoque.itens);
    const parametrosEstoque = { cmed: r.cmed, cmax: p.consumoMaximoDiario, diasUteis: D.empresa.diasUteisAno, lec: r.lec };
    const forn = C.avaliarFornecedores(D.fornecedores.propostas, D.fornecedores.quantidadeCotada, D.fornecedores.custoOportunidadeMensal, D.fornecedores.pesos, parametrosEstoque);
    const dep = C.calcularDepreciacao(D.patrimonio.empilhadeira);
    const conf = C.conformidadePatrimonial(D.patrimonio.inventarioFisico);
    const classeA = abc.resumoClasses.find(r2 => r2.classe === "A");
    const vencedor = forn.propostas[0];
    return { abc, r, giroLec, covLec, giroAtual, covAtual, capitalLiberado, inv, forn, dep, conf, classeA, vencedor };
  }

  function montarRelatorioHtml(d) {
    return `
      <p><strong>1. Resumo executivo.</strong> A VETTA teve duas rupturas de toner no trimestre e trabalha com compras de ${D.reposicaoToner.politicaAtualQ} un sem critério técnico. Recomendamos adotar o LEC de ${d.r.lec.toFixed(0)} un, PP de ${d.r.pp.toFixed(0)} un e SS de ${d.r.ss.toFixed(0)} un, comprar do fornecedor ${d.vencedor.id} e revisar o patrimônio. Ganho estimado: ${C.fmtMoeda(d.r.economiaAnual)}/ano em custos de pedir e manter, e ${C.fmtMoeda(d.capitalLiberado)} de capital liberado.</p>
      <p><strong>2. Diagnóstico.</strong> Dois itens (papel e toner) concentram ${C.fmtPercent(d.classeA.percentValor)} do valor movimentado (classe A). O toner gira ${UI.br(d.giroAtual,2)}× ao ano e mantém ${UI.br(d.covAtual,1)} dias de cobertura na política atual; a acuracidade por item é de ${C.fmtPercent(d.inv.acuraciadeItens)} (meta ${D.inventarioEstoque.metaAcuraciadeItens}%), embora por valor seja ${C.fmtPercent(d.inv.acuraciadeValor)}.</p>
      <p><strong>3. Reposição.</strong> LEC = ${d.r.lec.toFixed(0)} un (${d.r.n.toFixed(0)} pedidos/ano); SS = ${d.r.ss.toFixed(0)} un; PP = ${d.r.pp.toFixed(0)} un; Emáx = ${d.r.emax.toFixed(0)} un. Com o saldo atual em ${D.reposicaoToner.saldoAtual} un, emitir o próximo pedido imediatamente.</p>
      <p><strong>4. Fornecedor.</strong> ${d.vencedor.nome} (nota ${UI.br(d.vencedor.nota,2)}): entrega em ${d.vencedor.prazoDias} dias, melhor qualidade e menor estoque exigido. Negociar desconto à vista; manter o segundo colocado como contingência.</p>
      <p><strong>5. Patrimônio.</strong> Empilhadeira: quota de ${C.fmtMoeda(d.dep.quotaAnual)}/ano; valor contábil de ${C.fmtMoeda(d.dep.valorContabil)} na data-base. Inventário: ${d.conf.conformes} de ${d.conf.registrados} bens conformes; itens a regularizar: não localizado, sobra física, local divergente e plaqueta ilegível.</p>
      <p><strong>6. Riscos e limitações.</strong> Demanda tratada como estável; preços sem desconto por volume; custo de pedir estimado. Revisar os parâmetros a cada trimestre, e sempre que a demanda ou o prazo de entrega mudarem.</p>`;
  }

  window.VETTA_VIEWS.etapa6 = function () {
    const d = dadosConsolidados();
    const relatorioHtml = montarRelatorioHtml(d);

    return `
    ${UI.heroEtapa(6, "Relatório gerencial", "Transforme números em decisão: um relatório de uma página para a diretoria", "35 min")}

    <div class="vetta-card">
      <p>Fernanda apresentará o resultado na sexta-feira. Um bom relatório gerencial responde a quatro perguntas: <strong>o que encontramos? o que significa? o que recomendamos? o que acontece se nada for feito?</strong> Os números abaixo vêm diretamente dos cálculos das etapas 1 a 5 — nenhum valor foi digitado manualmente.</p>
    </div>

    <div class="vetta-card" id="relatorioImprimivel">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
        <h2 class="h4 mb-0">📑 Relatório — VETTA Suprimentos & Patrimônio Ltda.</h2>
        <div class="d-print-none">
          <button class="btn btn-sm btn-vetta-primary" onclick="window.print()"><i class="bi bi-printer"></i> Imprimir / salvar como PDF</button>
        </div>
      </div>
      ${relatorioHtml}
    </div>

    <div class="vetta-card d-print-none">
      <h2 class="h4">🛠️ Construtor de relatório — registre sua própria análise</h2>
      <p class="small text-muted">Preencha os campos abaixo para praticar a estrutura de um relatório gerencial completo (problema → evidência → interpretação → recomendação → plano de ação). O conteúdo fica salvo neste navegador.</p>
      <form id="formRelatorio">
        <div class="row g-3">
          <div class="col-md-6"><label class="form-label small fw-semibold">Problema encontrado</label><textarea class="form-control" id="campoProblema" rows="2"></textarea></div>
          <div class="col-md-6"><label class="form-label small fw-semibold">Evidência numérica</label><textarea class="form-control" id="campoEvidencia" rows="2"></textarea></div>
          <div class="col-md-6"><label class="form-label small fw-semibold">Interpretação</label><textarea class="form-control" id="campoInterpretacao" rows="2"></textarea></div>
          <div class="col-md-6"><label class="form-label small fw-semibold">Recomendação</label><textarea class="form-control" id="campoRecomendacao" rows="2"></textarea></div>
          <div class="col-md-3"><label class="form-label small fw-semibold">Responsável</label><input class="form-control" id="campoResponsavel"></div>
          <div class="col-md-3"><label class="form-label small fw-semibold">Prazo</label><input class="form-control" id="campoPrazo"></div>
          <div class="col-md-3"><label class="form-label small fw-semibold">Benefício esperado</label><input class="form-control" id="campoBeneficio"></div>
          <div class="col-md-3"><label class="form-label small fw-semibold">Risco de não agir</label><input class="form-control" id="campoRisco"></div>
        </div>
        <div class="mt-3 d-flex gap-2 flex-wrap">
          <button type="button" class="btn btn-outline-primary" id="btnExemploRelatorio"><i class="bi bi-magic"></i> Ver exemplo preenchido</button>
          <button type="button" class="btn btn-vetta-primary" id="btnSalvarRelatorio"><i class="bi bi-save"></i> Salvar no navegador</button>
          <button type="button" class="btn btn-outline-secondary" id="btnLimparRelatorio"><i class="bi bi-eraser"></i> Limpar</button>
        </div>
        <div id="statusRelatorio" class="small text-success mt-2" aria-live="polite"></div>
      </form>
    </div>

    <div class="vetta-card">
      <h2 class="h4">📋 Plano de ação (modelo)</h2>
      <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
        <thead><tr><th>O quê?</th><th>Quem?</th><th>Quando?</th><th>Como?</th><th>Quanto custa / ganha?</th></tr></thead>
        <tbody>
          <tr><td>Parametrizar LEC/PP/SS do toner no sistema</td><td>Renata</td><td>Esta semana</td><td>Cadastro de estoque mínimo e ponto de pedido</td><td>Ganho de ${C.fmtMoeda(d.r.economiaAnual)}/ano</td></tr>
          <tr><td>Negociar com ${UI.esc(d.vencedor.nome)}</td><td>Fernanda</td><td>Próximos 7 dias</td><td>Cotação com desconto à vista e contrato anual</td><td>Reduzir risco de ruptura</td></tr>
          <tr><td>Apurar bens não localizados / sobra física</td><td>Otávio</td><td>15 dias</td><td>Sindicância interna; cadastro e plaquetamento</td><td>Regularizar patrimônio</td></tr>
          <tr><td>Contagem cíclica mensal dos itens classe A</td><td>Renata</td><td>Mensal</td><td>Inventário rotativo com relatório de acuracidade</td><td>Meta: ≥ ${D.inventarioEstoque.metaAcuraciadeItens}% por item</td></tr>
        </tbody>
      </table></div>
    </div>

    <div class="vetta-card d-print-none">
      <h2 class="h4">📥 Exportar</h2>
      <p class="small text-muted">O relatório completo também pode ser gerado como planilha (aba "Relatório Gerencial" da pasta de trabalho) no <a href="#/downloads">Laboratório Excel / Downloads</a>.</p>
      <button class="btn btn-vetta-laranja" onclick="window.print()"><i class="bi bi-file-earmark-pdf"></i> Gerar PDF (imprimir página)</button>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "etapa-6") return;
    const campos = ["campoProblema", "campoEvidencia", "campoInterpretacao", "campoRecomendacao", "campoResponsavel", "campoPrazo", "campoBeneficio", "campoRisco"];
    let salvo = {};
    try { salvo = JSON.parse(localStorage.getItem("vetta_relatorio_aluno") || "{}"); } catch (e) { /* ignora */ }
    campos.forEach((id) => { const el = document.getElementById(id); if (el && salvo[id]) el.value = salvo[id]; });

    const btnExemplo = document.getElementById("btnExemploRelatorio");
    const btnSalvar = document.getElementById("btnSalvarRelatorio");
    const btnLimpar = document.getElementById("btnLimparRelatorio");
    const status = document.getElementById("statusRelatorio");
    if (btnExemplo) btnExemplo.addEventListener("click", () => {
      const d = dadosConsolidados();
      const exemplo = {
        campoProblema: "A política atual de compra do toner (lotes de " + D.reposicaoToner.politicaAtualQ + " un, sem critério técnico) já causou duas rupturas de estoque no trimestre.",
        campoEvidencia: "O toner é item classe A (" + C.fmtPercent(d.classeA.percentValor) + " do valor movimentado) e gira apenas " + UI.br(d.giroAtual, 2) + "× ao ano, com " + UI.br(d.covAtual, 1) + " dias de cobertura na política atual.",
        campoInterpretacao: "Sem ponto de pedido e estoque de segurança definidos, o reabastecimento depende de percepção informal — isso explica as rupturas e o capital parado em excesso.",
        campoRecomendacao: "Adotar LEC = " + d.r.lec.toFixed(0) + " un, SS = " + d.r.ss.toFixed(0) + " un e PP = " + d.r.pp.toFixed(0) + " un, parametrizados no sistema de compras.",
        campoResponsavel: "Renata (Suprimentos)",
        campoPrazo: "Até sexta-feira desta semana",
        campoBeneficio: C.fmtMoeda(d.r.economiaAnual) + "/ano em custos de pedir e manter",
        campoRisco: "Nova ruptura de toner, paralisando a emissão de notas fiscais"
      };
      campos.forEach((id) => { const el = document.getElementById(id); if (el && exemplo[id] !== undefined) el.value = exemplo[id]; });
      if (status) {
        status.classList.remove("text-danger");
        status.classList.add("text-success");
        status.textContent = "Exemplo preenchido — edite livremente e depois clique em \"Salvar no navegador\".";
      }
    });
    if (btnSalvar) btnSalvar.addEventListener("click", () => {
      const dados = {};
      campos.forEach((id) => { const el = document.getElementById(id); if (el) dados[id] = el.value; });
      try {
        localStorage.setItem("vetta_relatorio_aluno", JSON.stringify(dados));
        status.textContent = "Rascunho salvo neste navegador em " + new Date().toLocaleTimeString("pt-BR") + ".";
      } catch (e) {
        status.textContent = "Não foi possível salvar (armazenamento local indisponível).";
        status.classList.replace("text-success", "text-danger");
      }
    });
    if (btnLimpar) btnLimpar.addEventListener("click", () => {
      campos.forEach((id) => { const el = document.getElementById(id); if (el) el.value = ""; });
      try { localStorage.removeItem("vetta_relatorio_aluno"); } catch (e) { /* ignora */ }
      if (status) status.textContent = "Rascunho limpo.";
    });
  });
})();
