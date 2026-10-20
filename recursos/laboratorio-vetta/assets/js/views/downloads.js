/* VETTA EDU — Downloads e Materiais (planilha real + dicionário de fórmulas) */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;

  const DICIONARIO = [
    { nome: "Valor anual (Curva ABC)", formula: "Valor anual = D × Cu", excel: "=B4*C4", onde: "Aba Curva ABC, coluna D", usoNaVetta: "Classificar os 10 materiais do almoxarifado por impacto financeiro.", erroComum: "Confundir demanda com valor anual já calculado.", limitacao: "Não considera sazonalidade da demanda." },
    { nome: "% acumulado (Curva ABC)", formula: "% acumulado = soma dos % em ordem decrescente", excel: "=F2+E3 (arrastando)", onde: "Aba Curva ABC, coluna F", usoNaVetta: "Definir a fronteira entre classes A, B e C.", erroComum: "Acumular sem antes ordenar os itens do maior para o menor valor.", limitacao: "Os limites de 80%/95% são uma convenção deste case, não uma regra universal." },
    { nome: "Consumo médio diário (Cméd)", formula: "Cméd = D ÷ dias úteis", excel: "=B4/B5", onde: "Aba Reposição", usoNaVetta: "Base de cálculo do SS, PP e dos indicadores de giro.", erroComum: "Usar 365 dias em vez dos 250 dias úteis da VETTA.", limitacao: "Pressupõe demanda estável ao longo do ano." },
    { nome: "Custo de manter (H)", formula: "H = i × Cu", excel: "=B7*C4", onde: "Aba Reposição", usoNaVetta: "Entrada direta no cálculo do LEC.", erroComum: "Esquecer de multiplicar a taxa pelo custo unitário.", limitacao: "A taxa de manutenção é uma estimativa da empresa, não um valor contábil exato." },
    { nome: "Lote Econômico de Compra (LEC)", formula: "LEC = √(2 × D × S ÷ H)", excel: "=RAIZ((2*B4*B9)/B8)", onde: "Aba Reposição", usoNaVetta: "Define o tamanho ideal de cada pedido de toner.", erroComum: "Esquecer o '2' dentro da raiz.", limitacao: "Assume preço sem desconto por volume e capacidade de armazenagem ilimitada." },
    { nome: "Estoque de segurança (SS)", formula: "SS = (Cmáx − Cméd) × TR", excel: "=(B8-B6)*B7", onde: "Aba Reposição", usoNaVetta: "'Colchão' contra ruptura durante o tempo de reposição.", erroComum: "Usar o consumo médio no lugar do consumo máximo.", limitacao: "Método determinístico — não usa desvio-padrão estatístico (veja SS estatístico)." },
    { nome: "Ponto de pedido (PP)", formula: "PP = Cméd × TR + SS", excel: "=B6*B7+SS", onde: "Aba Reposição", usoNaVetta: "Sinaliza o saldo em que um novo pedido deve ser emitido.", erroComum: "Esperar o estoque zerar antes de comprar.", limitacao: "Pressupõe tempo de reposição constante." },
    { nome: "Estoque médio (Eméd)", formula: "Eméd = LEC ÷ 2 + SS", excel: "=LEC/2+SS", onde: "Aba Reposição / Indicadores", usoNaVetta: "Base para o cálculo de giro, cobertura e capital imobilizado.", erroComum: "Somar SS ao LEC sem dividir o LEC por 2.", limitacao: "Representa uma média teórica do ciclo, não o saldo de um dia específico." },
    { nome: "Giro de estoque", formula: "Giro = Consumo anual (R$) ÷ Estoque médio (R$)", excel: "=B4/B3", onde: "Aba Indicadores", usoNaVetta: "Mede quantas vezes o estoque é renovado por ano.", erroComum: "Misturar unidades físicas com valores em reais.", limitacao: "Giro alto sem SS adequado aumenta o risco de ruptura." },
    { nome: "Acuracidade por valor", formula: "Acuracidade (valor) = (1 − Σ|divergência R$| ÷ Σ valor do sistema) × 100", excel: "=(1-H7/G7)*100", onde: "Aba Inventário Estoque", usoNaVetta: "Mede a confiabilidade financeira do cadastro de estoque.", erroComum: "Somar divergências com sinal em vez de valor absoluto.", limitacao: "Pode mascarar muitos erros pequenos que se compensam." },
    { nome: "Valor presente (VP)", formula: "VP = VF ÷ (1 + i)ⁿ", excel: "=E2/(1+$B$7)^1", onde: "Aba Fornecedores", usoNaVetta: "Compara propostas de fornecedores com prazos de pagamento diferentes.", erroComum: "Comparar VP de uma proposta com valor nominal de outra.", limitacao: "Depende de uma estimativa confiável do custo de oportunidade do dinheiro." },
    { nome: "Taxa implícita do desconto", formula: "Taxa implícita = d ÷ (1 − d)", excel: "=B2/(1-B2)", onde: "Aba Fornecedores", usoNaVetta: "Decide se vale antecipar pagamento para obter desconto à vista.", erroComum: "Comparar a taxa implícita mensal direto com uma taxa anual.", limitacao: "Assume que a empresa tem caixa disponível para antecipar o pagamento." },
    { nome: "Nota final ponderada", formula: "Nota final = Σ (nota × peso)", excel: "=C2*$B2+C3*$B3+C4*$B4+C5*$B5", onde: "Aba Matriz Decisão", usoNaVetta: "Escolhe o fornecedor considerando preço, prazo, qualidade e atendimento.", erroComum: "Pesos que não somam 100%.", limitacao: "Os pesos são uma escolha de gestão, não um cálculo objetivo." },
    { nome: "Quota anual de depreciação", formula: "Quota anual = (Valor − Residual) ÷ Vida útil", excel: "=(B2-B7)/B4", onde: "Aba Depreciação", usoNaVetta: "Atualiza o valor contábil dos bens patrimoniais.", erroComum: "Depreciar sobre o valor total sem descontar o residual.", limitacao: "Taxas fiscais reais seguem tabela própria da Receita Federal." },
    { nome: "Conformidade patrimonial", formula: "Conformidade = bens conformes ÷ bens registrados × 100", excel: "=B11/B12*100", onde: "Aba Inventário Bens", usoNaVetta: "Mede a qualidade do controle patrimonial físico.", erroComum: "Incluir ou excluir a sobra física do denominador sem deixar isso explícito.", limitacao: "Não substitui a investigação formal de bens não localizados." }
  ];

  function linhaDicionario(d) {
    return `
    <div class="vetta-card">
      <h3 class="h6">${UI.esc(d.nome)}</h3>
      <div class="row small">
        <div class="col-md-6"><strong>Fórmula:</strong> ${UI.esc(d.formula)}</div>
        <div class="col-md-6"><strong>No Excel:</strong> <code>${UI.esc(d.excel)}</code> (${UI.esc(d.onde)})</div>
        <div class="col-12 mt-1"><strong>Uso na VETTA:</strong> ${UI.esc(d.usoNaVetta)}</div>
        <div class="col-md-6 mt-1"><strong>Erro comum:</strong> ${UI.esc(d.erroComum)}</div>
        <div class="col-md-6 mt-1"><strong>Limitação:</strong> ${UI.esc(d.limitacao)}</div>
      </div>
    </div>`;
  }

  window.VETTA_VIEWS.downloads = function () {
    return `
    <div class="vetta-hero">
      <h1 class="h3 mb-1">📥 Downloads e Materiais</h1>
      <p class="mb-0">Planilha real com fórmulas vivas e dicionário completo de fórmulas do case.</p>
    </div>

    <div class="vetta-card d-print-none">
      <h2 class="h4">📊 Planilha VETTA (Excel 365)</h2>
      <p>Gera, no seu navegador, um arquivo <code>.xlsx</code> real com 12 abas (Instruções, Parâmetros, Curva ABC, Reposição, Custos, Indicadores, Inventário Estoque, Fornecedores, Matriz Decisão, Depreciação, Inventário Bens e Relatório Gerencial), com <strong>fórmulas editáveis e vinculadas entre abas</strong> — altere um parâmetro na aba "Parâmetros" e as demais abas recalculam. As cores das células seguem o mesmo padrão visual do site: azul para dados de entrada, verde para resultados calculados, laranja para alertas e pontos a preencher.</p>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="vetta-card mb-0 h-100">
            <h3 class="h6">📝 Versão Exercício</h3>
            <p class="small mb-2">A aba Curva ABC vem com as colunas "% acumulado" e "Classe" em branco — o aluno ordena os itens e calcula na mão, como no case original.</p>
            <button class="btn btn-vetta-laranja" id="btnBaixarExcelExercicio"><i class="bi bi-file-earmark-excel"></i> Baixar versão Exercício</button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="vetta-card mb-0 h-100">
            <h3 class="h6">✅ Versão Gabarito</h3>
            <p class="small mb-2">A mesma planilha com a Curva ABC já ordenada e resolvida por fórmula — para conferência do professor ou autoavaliação do aluno.</p>
            <button class="btn btn-vetta-verde" id="btnBaixarExcelGabarito"><i class="bi bi-file-earmark-check"></i> Baixar versão Gabarito</button>
          </div>
        </div>
      </div>
      <p class="small text-muted mt-3 mb-0">Gerado localmente com a biblioteca xlsx-js-style (baseada no SheetJS), sem enviar nenhum dado a servidores externos. Abra o arquivo no Microsoft Excel 365 (ou LibreOffice Calc) para ver as fórmulas vivas.</p>
    </div>

    <div class="vetta-card">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 class="h4 mb-0">📖 Dicionário de fórmulas</h2>
        <button class="btn btn-sm btn-vetta-primary d-print-none" onclick="window.print()"><i class="bi bi-printer"></i> Imprimir / salvar como PDF</button>
      </div>
      <p class="small text-muted">Guia de referência rápida com todas as fórmulas do case: significado, versão para o Excel, onde aparece na planilha, erro comum e limitação.</p>
      ${DICIONARIO.map(linhaDicionario).join("")}
    </div>

    <div class="vetta-card d-print-none">
      <h2 class="h4">📄 Outros materiais</h2>
      <ul class="mb-0">
        <li><a href="#/laboratorio-excel">Laboratório Excel</a> — demonstrações passo a passo de cada fórmula na grade simulada.</li>
        <li><a href="#/laboratorio-prompts">Laboratório de Prompts</a> — biblioteca de prompts prontos para usar com IA.</li>
        <li><a href="#/etapa-6">Relatório gerencial</a> — versão executiva de uma página, pronta para impressão.</li>
      </ul>
    </div>`;
  };

  window.VETTA_VIEWS.afterRenderHooks = window.VETTA_VIEWS.afterRenderHooks || [];
  window.VETTA_VIEWS.afterRenderHooks.push(function (path) {
    if (path !== "downloads") return;
    const btnExercicio = document.getElementById("btnBaixarExcelExercicio");
    const btnGabarito = document.getElementById("btnBaixarExcelGabarito");
    if (btnExercicio) btnExercicio.addEventListener("click", () => window.VETTA_EXCEL_EXPORT.baixarPlanilha("exercicio"));
    if (btnGabarito) btnGabarito.addEventListener("click", () => window.VETTA_EXCEL_EXPORT.baixarPlanilha("gabarito"));
  });
})();
