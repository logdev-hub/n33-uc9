/* VETTA EDU — componentes de UI reutilizáveis (geram HTML a partir de dados). */
(function (global) {
  "use strict";
  const C = () => global.VETTA_CALC;

  // Formata um número com vírgula decimal (padrão brasileiro), para uso em textos
  // onde apenas .toFixed() deixaria o separador decimal em ponto.
  function br(n, casas) {
    casas = casas === undefined ? 2 : casas;
    return Number(n).toFixed(casas).replace(".", ",");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function heroEtapa(numero, titulo, pergunta, tempo) {
    return `
    <div class="vetta-hero">
      <span class="badge badge-laranja mb-2">ETAPA ${numero}</span>
      <h1 class="h3 mb-1">${esc(titulo)}</h1>
      <p class="mb-0">${esc(pergunta)} <span class="opacity-75">· ⏱ ${esc(tempo)}</span></p>
    </div>`;
  }

  function cardAlma(texto) {
    return `
    <div class="vetta-card" style="border-left:4px solid var(--vetta-laranja)">
      <strong>🤖 ALMA lembra:</strong> ${texto}
    </div>`;
  }

  // Bloco de um passo do método pedagógico em 10 passos.
  function passo(numero, titulo, corpoHtml, tipo) {
    const classe = tipo === "resultado" ? "passo-resultado" : tipo === "reflexao" ? "passo-reflexao" : "";
    return `
    <div class="passo-step ${classe}">
      <h4>PASSO ${numero} — ${esc(titulo)}</h4>
      <div>${corpoHtml}</div>
    </div>`;
  }

  function formula(texto) {
    return `<div class="vetta-formula">${texto}</div>`;
  }

  function resultadoDestaque(texto) {
    return `<div class="vetta-resultado-destaque">➜ ${texto}</div>`;
  }

  function tabelaDados(linhas) {
    // linhas: [{descricao, valor, unidade}]
    const corpo = linhas.map(l => `<tr><td>${esc(l.descricao)}</td><td class="text-end fw-semibold">${esc(l.valor)}</td><td>${esc(l.unidade || "")}</td></tr>`).join("");
    return `<div class="vetta-table-wrap"><table class="table table-sm table-vetta table-bordered mb-0">
      <thead><tr><th>Dado</th><th class="text-end">Valor</th><th>Unidade</th></tr></thead>
      <tbody>${corpo}</tbody></table></div>`;
  }

  function statTile(num, label) {
    return `<div class="vetta-stat-tile"><div class="num">${esc(num)}</div><div class="label">${esc(label)}</div></div>`;
  }

  function docenteBox(titulo, itensHtml) {
    return `<div class="vetta-docente-box"><h4>${esc(titulo)}</h4>${itensHtml}</div>`;
  }

  function excelCelula(celula, formula, resultado, explicacao) {
    return `
    <div class="vetta-excel-grid mb-2">
      <div class="vetta-excel-formulabar">
        <span class="cellref">${esc(celula)}</span>
        <span class="text-muted">fx</span>
        <code>${esc(formula)}</code>
      </div>
      <div class="p-2 small">
        <span class="badge bg-success-subtle text-success border border-success-subtle">Resultado: ${esc(resultado)}</span>
        ${explicacao ? `<div class="mt-1 text-muted">${explicacao}</div>` : ""}
      </div>
    </div>`;
  }

  function sliderRow(id, label, min, max, step, value, unidade) {
    return `
    <div class="vetta-slider-row">
      <label for="${id}">${esc(label)}</label>
      <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}">
      <span class="val" id="${id}_val">${value}${unidade || ""}</span>
    </div>`;
  }

  function copyButton(targetId, label) {
    return `<button type="button" class="btn btn-sm btn-vetta-primary" data-copy-target="${targetId}"><i class="bi bi-clipboard"></i> ${esc(label || "Copiar")}</button>`;
  }

  // Liga qualquer <input type=range> dentro de container a uma função de callback com debounce leve via rAF.
  function bindSliders(containerSel, onChange) {
    const container = document.querySelector(containerSel);
    if (!container) return;
    container.querySelectorAll('input[type="range"]').forEach((input) => {
      input.addEventListener("input", () => {
        const valEl = document.getElementById(input.id + "_val");
        if (valEl) {
          const suffix = valEl.textContent.replace(/[0-9.,\-]/g, "").trim();
          valEl.textContent = input.value + (suffix || "");
        }
        onChange();
      });
    });
  }

  function bindCopyButtons(root) {
    (root || document).querySelectorAll("[data-copy-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const el = document.getElementById(btn.getAttribute("data-copy-target"));
        if (!el) return;
        const text = el.innerText || el.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const old = btn.innerHTML;
          btn.innerHTML = '<i class="bi bi-check2"></i> Copiado!';
          setTimeout(() => (btn.innerHTML = old), 1500);
        }).catch(() => {
          alert("Não foi possível copiar automaticamente. Selecione o texto manualmente.");
        });
      });
    });
  }

  global.VETTA_UI = {
    esc, br, heroEtapa, cardAlma, passo, formula, resultadoDestaque, tabelaDados,
    statTile, docenteBox, excelCelula, sliderRow, copyButton, bindSliders, bindCopyButtons
  };
})(window);
