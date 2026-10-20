/* VETTA EDU — Página Início */
(function () {
  "use strict";
  window.VETTA_VIEWS = window.VETTA_VIEWS || {};
  const UI = window.VETTA_UI;
  const D = window.VETTA_DATA;

  window.VETTA_VIEWS.home = function () {
    const personas = D.empresa.personagens.map((p) => `
      <div class="col-sm-6 col-lg-4 col-xl mb-3">
        <div class="vetta-persona-card">
          <div class="emoji mb-1">${p.emoji}</div>
          <h3 class="h6 mb-0">${UI.esc(p.nome)}</h3>
          <div class="text-muted small mb-2">${UI.esc(p.funcao)}</div>
          <p class="small mb-0">${UI.esc(p.papel)}</p>
        </div>
      </div>`).join("");

    return `
    <div class="vetta-hero">
      <span class="badge badge-laranja mb-2">Senac Guarulhos · Técnico em Administração · ADM N33 · UC 9</span>
      <h1 class="display-6 fw-bold">VETTA EDU</h1>
      <p class="h5 fw-normal mb-3">Operação Reposição Inteligente</p>
      <p class="mb-4">Da análise de estoques à decisão gerencial: aprenda, calcule, simule e decida.</p>
      <a href="#/conheca-a-vetta" class="btn btn-vetta-laranja btn-lg"><i class="bi bi-play-fill"></i> Começar o case</a>
    </div>

    <div class="vetta-card">
      <h2 class="h4">📦 A situação</h2>
      <p>Segunda-feira, 8h15. Renata abre o almoxarifado e encontra um bilhete colado na porta: <em>“Faltou toner de novo. A impressão das notas parou às 16h de sexta.”</em> É a segunda ruptura do trimestre. Ao mesmo tempo, o papel A4 ocupa três corredores e há bens patrimoniais que ninguém sabe onde estão.</p>
      <div class="row g-3 mt-1">
        <div class="col-6 col-md-3">${UI.statTile("2ª ruptura", "de toner no trimestre")}</div>
        <div class="col-6 col-md-3">${UI.statTile("3 corredores", "ocupados por papel A4")}</div>
        <div class="col-6 col-md-3">${UI.statTile("R$ 646.260", "movimentados por ano em 10 itens")}</div>
        <div class="col-6 col-md-3">${UI.statTile("6 etapas", "até o relatório final")}</div>
      </div>
    </div>

    <div class="vetta-card">
      <h2 class="h4">✉ Comunicado interno da diretoria</h2>
      <blockquote class="border-start border-4 ps-3 border-warning-subtle">
        <p class="mb-2">“Equipe, os custos de estoque cresceram e ainda assim faltam itens essenciais. Precisamos de um <strong>diagnóstico completo</strong> até sexta-feira. Peço que a equipe:”</p>
        <ul>
          <li>descubra quais itens merecem mais atenção (onde está o dinheiro);</li>
          <li>defina a política de reposição do item mais crítico (quanto e quando comprar);</li>
          <li>meça o desempenho do estoque com indicadores e confira o inventário;</li>
          <li>escolha o melhor fornecedor com critérios claros;</li>
          <li>revise o patrimônio (depreciação e inventário físico);</li>
          <li>entregue um relatório de uma página com a recomendação final.</li>
        </ul>
      </blockquote>
    </div>

    <div class="vetta-card">
      <h2 class="h4">👥 Quem faz a operação girar</h2>
      <div class="row">${personas}</div>
    </div>

    <div class="vetta-card">
      <h2 class="h4">🧭 Roteiro do case</h2>
      <div class="vetta-table-wrap">
      <table class="table table-vetta table-bordered align-middle">
        <thead><tr><th>Etapa</th><th>Tema</th><th>Pergunta central</th><th>Tempo</th><th></th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Curva ABC</td><td>Onde está o dinheiro do estoque?</td><td>35 min</td><td><a href="#/etapa-1" class="btn btn-sm btn-vetta-primary">Abrir</a></td></tr>
          <tr><td>2</td><td>Política de reposição</td><td>Quanto e quando comprar o toner?</td><td>55 min</td><td><a href="#/etapa-2" class="btn btn-sm btn-vetta-primary">Abrir</a></td></tr>
          <tr><td>3</td><td>Indicadores e inventário</td><td>O estoque está saudável e confiável?</td><td>35 min</td><td><a href="#/etapa-3" class="btn btn-sm btn-vetta-primary">Abrir</a></td></tr>
          <tr><td>4</td><td>Fornecedores</td><td>De quem comprar, e em que condição?</td><td>45 min</td><td><a href="#/etapa-4" class="btn btn-sm btn-vetta-primary">Abrir</a></td></tr>
          <tr><td>5</td><td>Patrimônio</td><td>Quanto valem os bens hoje e onde estão?</td><td>45 min</td><td><a href="#/etapa-5" class="btn btn-sm btn-vetta-primary">Abrir</a></td></tr>
          <tr><td>6</td><td>Relatório gerencial</td><td>O que recomendamos à diretoria?</td><td>35 min</td><td><a href="#/etapa-6" class="btn btn-sm btn-vetta-primary">Abrir</a></td></tr>
        </tbody>
      </table>
      </div>
      <p class="small text-muted mb-0">Conteúdo didático adaptado do Guia do Docente do Case VETTA para apresentação ao estudante. A pauta de avaliação reservada ao(à) professor(a) não é reproduzida aqui.</p>
    </div>`;
  };
})();
