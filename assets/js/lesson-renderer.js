(() => {
  'use strict';
  const holder = document.getElementById('lesson-app');
  if (!holder) return;
  const number = Number(document.body.dataset.lesson);
  const lesson = window.UC9_LESSONS?.find(item => item.n === number);
  if (!lesson) { holder.innerHTML = '<div class="container py-5"><p>Aula não encontrada.</p></div>'; return; }
  const nn = String(number).padStart(2, '0');
  const prev = number > 1 ? `<a href="aula-${String(number - 1).padStart(2,'0')}.html">← Aula anterior</a>` : '<a href="../index.html">← Home</a>';
  const next = number < 11 ? `<a href="aula-${String(number + 1).padStart(2,'0')}.html">Próxima aula →</a>` : '<a href="../index.html">Voltar à trilha →</a>';
  const renderChat = lesson.chat.map(([avatar,name,time,text]) => `<div class="chat-message"><span class="chat-avatar" role="img" aria-label="Avatar de ${name}">${avatar}</span><div class="chat-bubble"><div class="chat-meta"><strong>${name}</strong><time>${time}</time></div><div>${text}</div></div></div>`).join('');
  const theories = lesson.theory.map(([title,text]) => `<article class="mb-4"><h3 class="h5">${title}</h3><p>${text}</p></article>`).join('');
  const mentor = lesson.mentor.map(([name,text]) => `<p class="mentor-line"><strong>${name}:</strong> ${text}</p>`).join('');
  const tips = lesson.tips.map(item => `<li>${item}</li>`).join('');
  const research = lesson.research.map(item => `<li>${item}</li>`).join('');
  const formulas = (lesson.formulas || []).map((formula, i) => `<div class="formula-block"><span id="formula-${nn}-${i}">${formula}</span><button class="btn btn-sm btn-senac copy-btn" type="button" data-copy="formula-${nn}-${i}">Copiar</button></div>`).join('');
  holder.innerHTML = `
    <header class="lesson-header"><div class="container"><nav class="breadcrumb d-flex justify-content-between" aria-label="Navegação entre aulas">${prev}${next}</nav><p class="eyebrow">Aula ${nn} · ${lesson.spiral}</p><h1>${lesson.title}</h1><div class="d-flex flex-wrap gap-2 mt-3"><span class="badge badge-orange">⏱ ${lesson.hours}</span><span class="badge badge-orange">🎯 ${lesson.indicator}</span><span class="badge badge-orange">Bloom: ${lesson.bloom}</span></div><p class="lead mt-3 mb-0">${lesson.objective}</p></div></header>
    <main id="conteudo" class="container content-section" role="main"><div class="lesson-layout"><div>
      <section class="lesson-section" aria-labelledby="abertura"><h2 id="abertura">🎬 Abertura — Cena na VETTA</h2><div class="chat-window"><div class="chat-titlebar"><strong>VETTA · Frente de trabalho UC 9</strong><span>Equipe conectada</span></div><div class="chat-body">${renderChat}<div class="problem-question">Pergunta-problema: ${lesson.question}</div></div></div></section>
      <section class="lesson-section" aria-labelledby="fundamentacao"><h2 id="fundamentacao">📚 Fundamentação teórica</h2>${theories}<p class="small muted">Base de referência: práticas acadêmicas e profissionais de gestão de materiais, controles patrimoniais e, quando pertinente, princípios da família ISO 55000. A aplicação deve respeitar os procedimentos vigentes da organização.</p></section>
      <section class="lesson-section" aria-labelledby="resolucao"><h2 id="resolucao">🧮 Resolução passo a passo</h2><div class="card notebook"><div class="card-body">${lesson.resolution}${formulas}</div></div></section>
      <section class="lesson-section" aria-labelledby="mentoria"><h2 id="mentoria">💬 Diálogo de mentoria</h2><div class="mentor-dialogue">${mentor}</div></section>
      <aside class="info-box tip-box" aria-labelledby="dica"><h2 class="h4" id="dica">💡 Dica profissional</h2><ul class="mb-0">${tips}</ul></aside>
      <aside class="info-box more-box" aria-labelledby="saiba"><h2 class="h4" id="saiba">🔎 Saiba mais</h2><p>Pesquise:</p><ul>${research}</ul><p class="mb-0"><strong>Antes de usar:</strong> verifique autoria, instituição responsável, data de atualização, referências e compatibilidade com as normas vigentes.</p></aside>
      <aside class="info-box ai-box" aria-labelledby="alma"><h2 class="h4" id="alma">🤖 Resolução com IA — ALMA</h2><h3 class="h6">Prompt para revisão</h3><div class="formula-block"><span id="prompt-${nn}">${lesson.prompt}</span><button class="btn btn-sm btn-senac copy-btn" type="button" data-copy="prompt-${nn}">Copiar</button></div><h3 class="h6">Síntese esperada</h3><p>${lesson.ai}</p><p class="mb-0"><strong>Alerta da ALMA:</strong> IA é apoio. Faça o raciocínio e os cálculos manualmente, confira os dados de origem e valide a decisão com as normas e responsáveis da empresa.</p></aside>
      <section class="lesson-section" aria-labelledby="fechamento"><h2 id="fechamento">✅ Fechamento e conexão com o Projeto Integrador</h2><p>${lesson.closing}</p><a class="btn btn-orange btn-lg" href="../exercicios/exercicios-aula-${nn}.html">🚀 Ir para os exercícios da Aula ${nn}</a></section>
      <nav class="d-flex justify-content-between pt-3 border-top" aria-label="Navegação inferior">${prev}${next}</nav>
    </div><aside class="sticky-progress" aria-label="Progresso da UC"><div class="card"><div class="card-body"><h2 class="h5">Seu progresso</h2><div class="progress mb-2" role="progressbar" aria-label="Progresso" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" data-progress-bar></div></div><p class="small" data-progress-label>0 de 11 aulas concluídas</p><div class="form-check"><input class="form-check-input" type="checkbox" id="complete-${nn}" data-lesson-check="${nn}"><label class="form-check-label" for="complete-${nn}">Marcar aula como concluída</label></div><hr><a href="../recursos/glossario.html">Consultar glossário</a></div></div></aside></div></main>`;
  document.title = `Aula ${nn} — ${lesson.title} | UC 9`;
  window.UC9Progress?.updateBars();
})();

