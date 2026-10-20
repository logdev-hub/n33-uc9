/* VETTA EDU — Agente VETTA-IA (Microsoft Copilot) */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;

  const LINK_AGENTE = "https://m365.cloud.microsoft/chat/?titleId=T_b8809ecf-a50b-990b-d477-2bac45485312&source=embedded-builder";

  const USOS_POR_ETAPA = [
    { etapa: 1, exemplo: "“Classifique estes 10 itens em curva ABC e explique por que a pasta suspensa ficou na fronteira entre B e C.”" },
    { etapa: 2, exemplo: "“O ponto de pedido calculado para a VETTA foi de 50 unidades. Explique, passo a passo, por que isso não significa comprar só quando o estoque chegar a zero.”" },
    { etapa: 3, exemplo: "“A acuracidade por item deu 60% e por valor deu 98,77%. Por que os dois números são tão diferentes, e qual devo priorizar?”" },
    { etapa: 4, exemplo: "“Compare estas três cotações de fornecedor trazendo tudo a valor presente e explique qual desconto eu deveria negociar.”" },
    { etapa: 5, exemplo: "“Um notebook não foi localizado no inventário. Quais passos devo seguir antes de considerar baixá-lo do patrimônio?”" },
    { etapa: 6, exemplo: "“Revise criticamente esta recomendação de relatório gerencial e aponte as três maiores fragilidades.”" }
  ];

  window.VETTA_VIEWS.copilot = function () {
    return `
    <div class="vetta-hero">
      <h1 class="h3 mb-1">🤖 VETTA-IA | Gestão Inteligente</h1>
      <p class="mb-0">Tutor educacional de Gestão de Materiais e Patrimônio, dedicado ao estudo de caso VETTA, disponível no Microsoft Copilot.</p>
    </div>

    <div class="vetta-card">
      <h2 class="h4">O que o agente pode fazer por você</h2>
      <div class="row small">
        <div class="col-md-6"><ul>
          <li>Compreender conceitos de gestão de materiais e patrimônio.</li>
          <li>Interpretar as fórmulas usadas no case.</li>
          <li>Revisar seus cálculos passo a passo.</li>
          <li>Ajudar a formular novas perguntas sobre o case.</li>
        </ul></div>
        <div class="col-md-6"><ul>
          <li>Investigar hipóteses para divergências de inventário.</li>
          <li>Comparar alternativas de fornecedores e políticas.</li>
          <li>Ajudar a estruturar relatórios gerenciais.</li>
          <li>Estimular o raciocínio crítico antes da decisão final.</li>
        </ul></div>
      </div>
    </div>

    <div class="vetta-card text-center">
      <h2 class="h4">Acessar o agente</h2>
      <p class="small text-muted">O acesso pode exigir autenticação Microsoft e permissões da sua organização (conta institucional do Senac/M365). Não há acesso público irrestrito.</p>
      <a href="${LINK_AGENTE}" target="_blank" rel="noopener noreferrer" class="btn btn-vetta-laranja btn-lg">
        <i class="bi bi-box-arrow-up-right"></i> Acessar o agente VETTA-IA
      </a>
    </div>

    <div class="vetta-card">
      <h2 class="h4">Um prompt de exemplo para cada etapa</h2>
      <div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered">
        <thead><tr><th>Etapa</th><th>Exemplo de pergunta ao agente</th></tr></thead>
        <tbody>${USOS_POR_ETAPA.map(u => `<tr><td>${u.etapa}</td><td class="small">${UI.esc(u.exemplo)}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>

    <div class="vetta-card">
      <h2 class="h4">⚠️ Importante</h2>
      <p class="small mb-0">A ALMA e o agente VETTA-IA dão dicas e ajudam a verificar dados, mas <strong>não decidem por você</strong>. Toda recomendação final precisa ser conferida com cálculo próprio e validada pela equipe humana antes de chegar à diretoria.</p>
    </div>`;
  };
})();
