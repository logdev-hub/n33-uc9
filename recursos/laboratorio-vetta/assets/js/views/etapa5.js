/* VETTA EDU — Etapa 5: Patrimônio — depreciação e inventário */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const C = window.VETTA_CALC;
  const D = window.VETTA_DATA;

  function fmtData(iso) {
    const [a, m, d] = iso.split("-");
    return `${d}/${m}/${a}`;
  }

  window.VETTA_VIEWS.etapa5 = function () {
    const emp = D.patrimonio.empilhadeira;
    const dep = C.calcularDepreciacao(emp);
    const tabelaExerc = C.tabelaDepreciacaoPorExercicio(emp);
    const lenovo = D.patrimonio.notebookLenovo;
    const depLenovo = C.calcularDepreciacao(lenovo);
    const conf = C.conformidadePatrimonial(D.patrimonio.inventarioFisico);

    const linhasExerc = tabelaExerc.map(l => `
      <tr><td>${l.exercicio}</td><td class="text-end">${l.meses}</td><td class="text-end">${C.fmtMoeda(l.quotaExercicio)}</td><td class="text-end">${C.fmtMoeda(l.depAcumulada)}</td><td class="text-end">${C.fmtMoeda(l.valorContabil)}</td></tr>`).join("");

    const linhasInventario = D.patrimonio.inventarioFisico.map((b) => {
      const corClasse = b.situacao === "Conforme" ? "table-success" : b.situacao === "Não localizado" ? "table-danger" : b.situacao === "Sobra física" ? "table-warning" : "";
      return `<tr class="${corClasse}">
        <td>${UI.esc(b.plaqueta)}</td><td>${UI.esc(b.bem)}</td><td>${UI.esc(b.localSistema)}</td>
        <td class="small">${UI.esc(b.constatacao)}</td><td class="small">${UI.esc(b.classe)}</td>
        <td><strong>${UI.esc(b.situacao)}</strong></td><td class="small">${UI.esc(b.acao)}</td></tr>`;
    }).join("");

    return `
    ${UI.heroEtapa(5, "Patrimônio: depreciação e inventário", "Calcule o valor contábil da empilhadeira e concilie o inventário físico", "45 min")}

    <div class="vetta-card">
      <p>Otávio precisa atualizar o valor contábil da empilhadeira elétrica (plaqueta ${emp.plaqueta}) e conferir se os bens do sistema estão no lugar certo.</p>
      ${UI.tabelaDados([
        { descricao: "Valor de aquisição", valor: C.fmtMoeda(emp.valorAquisicao), unidade: "R$" },
        { descricao: "Data de aquisição", valor: fmtData(emp.dataAquisicao), unidade: "" },
        { descricao: "Vida útil", valor: emp.vidaUtilAnos, unidade: "anos" },
        { descricao: "Valor residual", valor: (emp.residualPercent*100).toFixed(0) + "%", unidade: "do valor de aquisição" },
        { descricao: "Método", valor: emp.metodo, unidade: "" },
        { descricao: "Data-base do cálculo", valor: fmtData(emp.dataBase), unidade: "" }
      ])}
    </div>

    <div class="vetta-card">
      <h2 class="h4">🧮 5.1 e 5.2 — Depreciação linear da empilhadeira</h2>
      ${UI.passo(1, "Entenda o problema", "<p>O valor contábil de um bem diminui ao longo da vida útil. Precisamos saber quanto a empilhadeira ainda vale nos livros da VETTA em 31/12/2026, para fins de controle patrimonial e eventual baixa ou seguro.</p>")}
      ${UI.passo(2, "Descubra por que o cálculo é necessário", "<p>A quota de depreciação distribui o custo do bem (descontado o valor residual) ao longo da vida útil, de forma constante — é o método linear.</p>")}
      ${UI.passo(3, "Conheça os dados", UI.tabelaDados([
        { descricao: "Valor de aquisição", valor: C.fmtMoeda(emp.valorAquisicao), unidade: "R$" },
        { descricao: "Valor residual (10%)", valor: C.fmtMoeda(dep.valorResidual), unidade: "R$" },
        { descricao: "Vida útil", valor: emp.vidaUtilAnos, unidade: "anos" }
      ]))}
      ${UI.passo(4, "Entenda a fórmula", UI.formula("Quota anual = (Valor − Residual) ÷ Vida útil\nQuota mensal = Quota anual ÷ 12\nDep. acumulada = Quota mensal × meses de uso\nValor contábil = Valor de aquisição − Dep. acumulada"))}
      ${UI.passo(5, "Substitua os valores", UI.formula(`Valor depreciável = 96.000,00 − 9.600,00\nQuota anual = 86.400,00 ÷ 10\nMeses de uso até 31/12/2026 = ${dep.meses}\nDep. acumulada = ${UI.br(dep.quotaMensal,2)} × ${dep.meses}`))}
      ${UI.passo(6, "Resolva passo a passo", `<p>Valor depreciável = <strong>${C.fmtMoeda(dep.valorDepreciavel)}</strong></p><p>Quota anual = <strong>${C.fmtMoeda(dep.quotaAnual)}</strong> · Quota mensal = <strong>${C.fmtMoeda(dep.quotaMensal)}</strong></p><p>Dep. acumulada = ${C.fmtMoeda(dep.quotaMensal)} × ${dep.meses} meses = <strong>${C.fmtMoeda(dep.depAcumulada)}</strong></p>`)}
      ${UI.passo(7, "Interprete o resultado", `${UI.resultadoDestaque("Valor contábil em 31/12/2026 = " + C.fmtMoeda(dep.valorContabil))}<p>Isso representa ${dep.percentConsumido.toFixed(0)}% do valor depreciável já consumido — restam ${(emp.vidaUtilAnos*12 - dep.meses)} meses (${UI.br((emp.vidaUtilAnos*12 - dep.meses)/12,1)} anos) até o fim da vida útil.</p>`, "resultado")}
      ${UI.passo(8, "Reflita sobre a gestão", `<ul>
        <li>A contagem é feita em <strong>meses completos de uso</strong>, não em anos arredondados — contar 2,5 ou 3 anos é um erro comum.</li>
        <li>Depreciação contábil não representa necessariamente o valor de mercado do bem: é um reconhecimento de custo, não uma avaliação.</li>
        <li>As taxas fiscais de depreciação são definidas pela Receita Federal por tipo de bem; os valores deste case são didáticos.</li></ul>`, "reflexao")}
      ${UI.passo(9, "Aplique no Excel", UI.excelCelula("C5", "=B4*10%", C.fmtMoeda(dep.valorResidual), "B4 = valor de aquisição; aplica-se o percentual de residual.") +
        UI.excelCelula("C8", "=(B4-C5)/B6", C.fmtMoeda(dep.quotaAnual), "B6 = vida útil em anos.") +
        UI.excelCelula("C10", "=C9*DATADIF(B5;B7;\"m\")+1", C.fmtMoeda(dep.depAcumulada), "DATADIF conta os meses completos entre a aquisição (B5) e a data-base (B7)."))}
      ${UI.passo(10, "Experimente uma mudança", `<p>No <a href="#/simulador">Simulador Gerencial</a>, altere a vida útil ou o valor residual e observe o novo valor contábil na data-base.</p>`)}
    </div>

    <div class="vetta-card">
      <h2 class="h4">📅 Tabela de depreciação por exercício</h2>
      <div class="row g-3">
        <div class="col-md-7">
          <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
            <thead><tr><th>Exercício</th><th class="text-end">Meses</th><th class="text-end">Quota do exercício</th><th class="text-end">Dep. acumulada</th><th class="text-end">Valor contábil</th></tr></thead>
            <tbody>${linhasExerc}</tbody>
          </table></div>
        </div>
        <div class="col-md-5"><canvas id="chartDepreciacao5" height="220" role="img" aria-label="Evolução do valor contábil da empilhadeira"></canvas></div>
      </div>
    </div>

    <div class="vetta-card">
      <h2 class="h4">📋 Inventário físico dos bens</h2>
      <p>Otávio percorreu a empresa com a lista do sistema. Situações possíveis: Conforme · Local divergente · Não localizado · Plaqueta ilegível · Sobra física.</p>
      <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
        <thead><tr><th>Plaqueta</th><th>Bem</th><th>Local no sistema</th><th>Constatação</th><th>Classe patrimonial</th><th>Situação</th><th>Ação recomendada</th></tr></thead>
        <tbody>${linhasInventario}</tbody>
      </table></div>
    </div>

    <div class="vetta-card">
      <h2 class="h4">5.3 — Conformidade do inventário e prioridades</h2>
      ${UI.formula("Conformidade = bens conformes ÷ bens registrados × 100")}
      ${UI.resultadoDestaque(conf.conformes + " de " + conf.registrados + " bens registrados estão conformes = " + C.fmtPercent(conf.percentSemSobra))}
      <p class="small text-muted">Se a sobra física entrar no denominador: ${conf.conformes} ÷ ${conf.totalComSobra} = ${C.fmtPercent(conf.percentComSobra)}.</p>
      <p><strong>Prioridades de tratamento:</strong></p>
      <ol class="mb-0">
        <li><strong>Não localizado</strong> (P-0104): risco de perda/furto, exige apuração formal e responsável.</li>
        <li><strong>Sobra física</strong> (monitor sem plaqueta): bem sem registro, risco de fraude ou erro de cadastro.</li>
        <li><strong>Local divergente</strong> (P-0103) e <strong>plaqueta ilegível</strong> (P-0105): correções administrativas de rotina.</li>
      </ol>
      <p class="small text-muted mt-2 mb-0">Após a apuração, um bem não localizado pode ser baixado, mas somente com aprovação e registro formal — nunca apagado automaticamente do sistema.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">5.4 — Valor contábil do Notebook Lenovo (P-0104)</h2>
      ${UI.tabelaDados([
        { descricao: "Valor de aquisição", valor: C.fmtMoeda(lenovo.valorAquisicao), unidade: "R$" },
        { descricao: "Vida útil", valor: lenovo.vidaUtilAnos, unidade: "anos" },
        { descricao: "Valor residual", valor: "R$ 0,00", unidade: "" },
        { descricao: "Data de aquisição", valor: fmtData(lenovo.dataAquisicao), unidade: "" }
      ])}
      ${UI.resultadoDestaque("Valor contábil em 31/12/2026 = " + C.fmtMoeda(depLenovo.valorContabil))}
      <p class="small text-muted mb-0">Se o bem for baixado por extravio após a apuração formal, esse é o valor a ser reconhecido como perda patrimonial — base para o registro contábil e para a eventual apuração de responsabilidade. Não se trata de uma perda automática: a investigação vem primeiro.</p>
    </div>

    <div class="vetta-docente-box">
      <h4>⚠️ Erros comuns a evitar</h4>
      <ul class="mb-0 small">
        <li>Contar anos arredondados (2,5 ou 3 anos) em vez de meses completos de uso.</li>
        <li>Depreciar sobre o valor total, esquecendo de descontar o valor residual primeiro.</li>
        <li>Confundir depreciação contábil (reconhecimento de custo) com desvalorização de mercado.</li>
      </ul>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "etapa-5") return;
    const emp = D.patrimonio.empilhadeira;
    const tabelaExerc = C.tabelaDepreciacaoPorExercicio(emp);
    window.VETTA_CHARTS.linhaDepreciacao("chartDepreciacao5", tabelaExerc, emp.valorAquisicao);
  });
})();
