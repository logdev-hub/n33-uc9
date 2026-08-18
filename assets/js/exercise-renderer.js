(() => {
  'use strict';
  const holder = document.getElementById('exercise-app');
  if (!holder) return;
  const number = Number(document.body.dataset.lesson);
  const data = window.UC9_EXERCISES?.find(item => item.n === number);
  if (!data) return;
  const nn = String(number).padStart(2, '0');
  const tasks = data.tasks.map((task,index) => {
    const rows = task.rows.map((row,rowIndex) => `<tr>${row.map(cell => `<${rowIndex === 0 ? 'th' : 'td'}>${cell}</${rowIndex === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('');
    const qs = task.questions.map((q,i) => `<li class="mb-2">${q}</li>`).join('');
    const id = `${nn}-${index + 1}`;
    return `<article class="card exercise-card mb-4"><div class="card-header d-flex flex-wrap justify-content-between gap-2"><h2 class="h4 mb-0">${task.name}</h2><span class="badge badge-orange">${task.level}</span></div><div class="card-body"><div class="table-responsive"><table class="table data-table"><tbody>${rows}</tbody></table></div><h3 class="h5">Perguntas norteadoras</h3><ol>${qs}</ol><label class="form-label fw-bold" for="answer-${id}">Seu raciocínio e resposta</label><textarea class="form-control answer-field" id="answer-${id}" placeholder="Registre hipóteses, cálculos, justificativas e conclusão. O texto não é salvo automaticamente."></textarea><div class="form-check mt-3"><input class="form-check-input" type="checkbox" id="done-${id}" data-exercise-check="${id}"><label class="form-check-label" for="done-${id}">Marquei este exercício como concluído</label></div></div></article>`;
  }).join('');
  holder.innerHTML = `<header class="lesson-header"><div class="container"><nav class="breadcrumb d-flex justify-content-between" aria-label="Navegação"><a href="../aulas/aula-${nn}.html">← Voltar à Aula ${nn}</a><a href="../index.html#trilha">Trilha →</a></nav><p class="eyebrow">Caderno de atividades · Aula ${nn}</p><h1>${data.title}</h1><p class="lead mb-0">Resolva no universo da VETTA. Os cenários e números são diferentes dos exemplos da aula.</p></div></header><main id="conteudo" class="container content-section" role="main"><section class="info-box more-box" aria-labelledby="context"><h2 class="h4" id="context">Contexto</h2><p class="mb-0">${data.context}</p></section>${tasks}<aside class="info-box tip-box"><p class="mb-0"><strong>Finalizou?</strong> Confira com seu docente ou compare seu raciocínio com os colegas.</p></aside><a class="btn btn-senac" href="../aulas/aula-${nn}.html">Voltar à aula</a></main>`;
  document.title = `Exercícios da Aula ${nn} | UC 9`;
  window.UC9Progress?.updateBars();
})();

