(() => {
  'use strict';
  const KEY = 'uc9_progress';
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || { lessons: {}, exercises: {} }; }
    catch { return { lessons: {}, exercises: {} }; }
  };
  const write = data => localStorage.setItem(KEY, JSON.stringify(data));
  const updateBars = () => {
    const data = read();
    const complete = Object.values(data.lessons).filter(Boolean).length;
    document.querySelectorAll('[data-progress-bar]').forEach(bar => {
      const value = Math.round((complete / 11) * 100);
      bar.style.width = `${value}%`;
      bar.setAttribute('aria-valuenow', String(value));
    });
    document.querySelectorAll('[data-progress-label]').forEach(label => label.textContent = `${complete} de 11 aulas concluídas`);
    document.querySelectorAll('[data-lesson-check]').forEach(input => {
      input.checked = Boolean(data.lessons[input.dataset.lessonCheck]);
      input.closest('.trail-item')?.classList.toggle('completed', input.checked);
    });
    document.querySelectorAll('[data-exercise-check]').forEach(input => input.checked = Boolean(data.exercises[input.dataset.exerciseCheck]));
  };
  document.addEventListener('change', event => {
    const lesson = event.target.closest('[data-lesson-check]');
    const exercise = event.target.closest('[data-exercise-check]');
    if (!lesson && !exercise) return;
    const data = read();
    if (lesson) data.lessons[lesson.dataset.lessonCheck] = lesson.checked;
    if (exercise) data.exercises[exercise.dataset.exerciseCheck] = exercise.checked;
    write(data);
    updateBars();
  });
  window.UC9Progress = { read, updateBars };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateBars); else updateBars();
})();

