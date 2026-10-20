/* VETTA EDU — testes do núcleo de cálculo contra o gabarito do Guia do Docente.
   Zero dependências: roda com `node tests/calculations.test.js`. */
"use strict";
const path = require("path");
const assert = require("assert");

global.window = global;
require(path.join(__dirname, "..", "assets", "js", "data.js"));
require(path.join(__dirname, "..", "assets", "js", "calculations.js"));

const C = global.VETTA_CALC;
const D = global.VETTA_DATA;

let passou = 0, falhou = 0;
function teste(nome, fn) {
  try {
    fn();
    console.log("  OK  " + nome);
    passou++;
  } catch (e) {
    console.log("FALHA " + nome + " — " + e.message);
    falhou++;
  }
}
function aproxIgual(a, b, nome, casas = 2) {
  const fator = Math.pow(10, casas);
  assert.strictEqual(Math.round(a * fator) / fator, Math.round(b * fator) / fator, nome + " (obtido " + a + ", esperado " + b + ")");
}

console.log("=== Etapa 1 — Curva ABC ===");
const abc = C.calcularCurvaABC(D.abc.itens, D.abc.limiteA, D.abc.limiteB);
teste("Valor total = R$ 646.260,00", () => aproxIgual(abc.total, 646260.00, "total"));
teste("Classe A = 2 itens, 73,81%", () => {
  const a = abc.resumoClasses.find((r) => r.classe === "A");
  assert.strictEqual(a.qtdItens, 2);
  aproxIgual(a.percentValor, 73.81, "percentValor A");
});

console.log("=== Etapa 2 — Reposição ===");
const p = D.reposicaoToner;
const r = C.politicaReposicaoCompleta({
  demandaAnual: p.demandaAnual, custoUnitario: p.custoUnitario, custoPedido: p.custoPedido,
  taxaManutencao: p.taxaManutencao, diasUteis: D.empresa.diasUteisAno,
  tempoReposicao: p.tempoReposicaoDiasUteis, consumoMaximo: p.consumoMaximoDiario,
  qAtual: p.politicaAtualQ, saldoAtual: p.saldoAtual
});
teste("LEC = 60 un", () => aproxIgual(r.lec, 60, "LEC", 0));
teste("SS = 14 un", () => aproxIgual(r.ss, 14, "SS", 0));
teste("PP = 50 un", () => aproxIgual(r.pp, 50, "PP", 0));
teste("Emáx = 74 un", () => aproxIgual(r.emax, 74, "Emáx", 0));
teste("Eméd = 44 un", () => aproxIgual(r.emed, 44, "Eméd", 0));
teste("Economia anual = R$ 1.134,00", () => aproxIgual(r.economiaAnual, 1134.00, "economia"));

console.log("=== Etapa 3 — Indicadores e inventário ===");
const consumoAnualRS = p.demandaAnual * p.custoUnitario;
const estoqueMedioRSLec = r.emed * p.custoUnitario;
const emedAtual = p.politicaAtualQ / 2 + r.ss;
const estoqueMedioRSAtual = emedAtual * p.custoUnitario;
const capitalLiberado = estoqueMedioRSAtual - estoqueMedioRSLec;
teste("Capital liberado = R$ 9.450,00", () => aproxIgual(capitalLiberado, 9450.00, "capital liberado"));

const inv = C.calcularInventario(D.inventarioEstoque.itens);
teste("Acuracidade por item = 60,00%", () => aproxIgual(inv.acuraciadeItens, 60.00, "acuracidade itens"));
teste("Acuracidade por valor = 98,77%", () => aproxIgual(inv.acuraciadeValor, 98.77, "acuracidade valor"));

console.log("=== Etapa 4 — Fornecedores ===");
const parametrosEstoque = { cmed: r.cmed, cmax: p.consumoMaximoDiario, diasUteis: D.empresa.diasUteisAno, lec: r.lec };
const forn = C.avaliarFornecedores(D.fornecedores.propostas, D.fornecedores.quantidadeCotada, D.fornecedores.custoOportunidadeMensal, D.fornecedores.pesos, parametrosEstoque);
teste("Ranking: C > A > B", () => {
  assert.strictEqual(forn.propostas[0].id, "C");
  assert.strictEqual(forn.propostas[1].id, "A");
  assert.strictEqual(forn.propostas[2].id, "B");
});
teste("Notas: C=9,57 A=8,05 B=7,10", () => {
  aproxIgual(forn.propostas[0].nota, 9.57, "nota C");
  aproxIgual(forn.propostas[1].nota, 8.05, "nota A");
  aproxIgual(forn.propostas[2].nota, 7.10, "nota B");
});
teste("Menor VP = R$ 12.111,00 (A à vista)", () => aproxIgual(forn.menorVP, 12111.00, "menor VP"));

console.log("=== Etapa 5 — Patrimônio ===");
const dep = C.calcularDepreciacao(D.patrimonio.empilhadeira);
teste("Depreciação acumulada = R$ 21.600,00", () => aproxIgual(dep.depAcumulada, 21600.00, "dep acumulada"));
teste("Valor contábil = R$ 74.400,00", () => aproxIgual(dep.valorContabil, 74400.00, "valor contábil"));

const conf = C.conformidadePatrimonial(D.patrimonio.inventarioFisico);
teste("Conformidade = 57,14%", () => aproxIgual(conf.percentSemSobra, 57.14, "conformidade"));

console.log("\n" + passou + " teste(s) passaram, " + falhou + " falharam.");
process.exit(falhou > 0 ? 1 : 0);
