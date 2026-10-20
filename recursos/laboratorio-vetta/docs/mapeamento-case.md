# Mapeamento do Case VETTA — PDF → Plataforma

Fonte: `casedocente.pdf` (Guia do Docente, 18 páginas — Senac Guarulhos, Técnico em
Administração, ADM N33, UC 9: Gestão de Materiais e Patrimônio).

> O arquivo PDF original não foi incluído no repositório publicado (é um material de
> uso exclusivo do(a) docente, com gabarito). O conteúdo abaixo foi extraído dele e
> reorganizado como material didático de resolução orientada para o estudante — a
> pauta de avaliação reservada (página 18) não é reproduzida na plataforma.

Convenções desta tabela: **Arquivo** = onde o cálculo/conteúdo foi implementado.
Todas as fórmulas usam como fonte única `assets/js/calculations.js` (verificado em
`docs/auditoria-calculos.md`); a UI apenas chama essas funções.

| Pág. | Etapa | Questão | Dado de entrada | Fórmula | Resultado | Arquivo / componente |
|---|---|---|---|---|---|---|
| 4–5 | 1 | 1.1 | 10 itens (demanda × custo) | `Valor anual = D×Cu`; ranking; % acumulado | Total R$ 646.260,00; A=2 itens (73,81%), B=3 (19,22%), C=5 (6,97%) | `calculations.js:calcularCurvaABC`, `views/etapa1.js` |
| 5 | 1 | 1.2 | Pasta suspensa, 95,81% acum. | Regra de corte 80/95 | Classe C (acima de 95%) | `views/etapa1.js` §1.2 |
| 5 | 1 | 1.3 | Toner classe A | Justificativa qualitativa | 3 razões (rupturas, demanda estável, custo alto) | `views/etapa1.js` §1.3 |
| 5 | 1 | 1.4 | Classes A/B/C | Política de controle por classe | Tabela de controle por classe | `views/etapa1.js` §1.4 |
| 6 | 2 | 2.1 | D=900, dias=250, i=20%, Cu=210 | `Cméd=D/dias`; `H=i×Cu` | Cméd=3,60 un/dia; H=R$42,00 | `calculations.js: consumoMedioDiario, custoManterUnidade` |
| 6 | 2 | 2.2 | D, S=84, H=42 | `LEC=√(2DS/H)` | LEC=60 un | `calculations.js: loteEconomicoCompra` |
| 6 | 2 | 2.3 | D, LEC, dias=250 | `N=D/LEC`; `Intervalo=dias/N` | N=15; Intervalo≈16,7 dias; pedido=R$12.600,00 | `calculations.js: numeroPedidosAno, intervaloEntrePedidos` |
| 6 | 2 | 2.4 | Cmáx=5, Cméd, TR=10 | `SS=(Cmáx−Cméd)×TR` | Consumo no TR=36 un; SS=14 un | `calculations.js: estoqueSeguranca` |
| 7 | 2 | 2.5 | Cméd, TR, SS, LEC | `PP=Cméd×TR+SS`; `Emáx=SS+LEC`; `Eméd=LEC/2+SS` | PP=50; Emáx=74; Eméd=44 | `calculations.js: pontoPedido, estoqueMaximo, estoqueMedio` |
| 7 | 2 | 2.6 | Q=150 vs Q=60(LEC) | `CT=D×Cu+(D/Q)×S+(Q/2)×H` | CTatual=R$192.654,00; CTLEC=R$191.520,00; economia=R$1.134,00 | `calculations.js: custoTotalAnual` |
| 7 | 2 | 2.7 | Saldo=52, PP=50, Cméd | `Dias até PP=(Saldo−PP)/Cméd` | ≈0,56 dia útil | `calculations.js: politicaReposicaoCompleta.diasAtePP` |
| 7 | 2 | 2.8 (desafio) | Z=1,65; σ=1,2; TR=10 | `SS=Z×σ×√TR` | SS≈6,26→7 un; novo PP=43; diferença=R$294,00/ano | `calculations.js: estoqueSegurancaEstatistico` |
| 9 | 3 | 3.1/3.2 | Eméd (LEC e atual), Cu | `Giro=Consumo/Eméd(R$)`; `Cobertura=dias/Giro` | LEC: giro≈20,45, cobertura≈12,2 d; Atual: giro≈10,11, cobertura≈24,7 d; capital liberado=R$9.450,00 | `calculations.js: giroEstoque, coberturaDias` |
| 9–10 | 3 | 3.3 | 5 itens contados | `Divergência`; `Acuracidade(itens/valor)` | Itens=60,00%; Valor=98,77% | `calculations.js: calcularInventario` |
| 10 | 3 | 3.4 | Divergências papel/fita | Causas e ações (qualitativo) | Lista de causas/ações | `views/etapa3.js` §3.4 |
| 11 | 4 | 4.1 | 3 propostas, Q=60 | `Custo=Q×preço+frete` | A=R$12.480; B=R$12.200; C=R$12.600 | `calculations.js: custoPedidoFornecedor` |
| 11 | 4 | 4.2 | i=2%a.m., descontos | `VP=VF/(1+i)^n`; `Taxa implícita=d/(1−d)` | Menor VP=R$12.111,00 (A à vista); taxa implícita=3,09% | `calculations.js: valorPresente, taxaImplicitaDesconto, avaliarCondicoesPagamento` |
| 11 | 4 | 4.3 | TR por fornecedor | SS/PP/Eméd por fornecedor | A: SS=14; B: SS=21; C: SS=7 | `calculations.js: avaliarFornecedores` (parametrosEstoque) |
| 12 | 4 | 4.4 | Pesos 40/25/20/15% | `Nota final=Σ(nota×peso)` | C=9,57; A=8,05; B=7,10 | `calculations.js: notaPreco, notaPrazo, notaFinal` |
| 12 | 4 | 4.5 | Menor VP × maior nota | Diferença anual; desconto-alvo | Dif.≈R$3.629,12/ano; desconto-alvo≈3,88% | `views/etapa4.js` §4.5 |
| 12 | 4 | 4.6 | — | Checklist cadastral (qualitativo) | 5 itens de verificação | `views/etapa4.js` §4.6 |
| 14 | 5 | 5.1 | Valor=96.000; vida=10a; residual=10% | `Quota anual=(Valor−Residual)/Vida`; `Quota mensal` | Residual=R$9.600; depreciável=R$86.400; quota anual=R$8.640; mensal=R$720 | `calculations.js: calcularDepreciacao` |
| 14 | 5 | 5.2 | Aquisição 01/07/2024 → base 31/12/2026 | `Dep.acumulada=Quota mensal×meses`; `VC=Valor−Dep.acum.` | 30 meses; dep.acum.=R$21.600; VC=R$74.400 | `calculations.js: mesesEntre, calcularDepreciacao, tabelaDepreciacaoPorExercicio` |
| 15 | 5 | Inventário físico | 8 bens (P-0101 a sobra física) | Classificação por situação | 4/7 conformes (57,14%) | `data.js: patrimonio.inventarioFisico`; `calculations.js: conformidadePatrimonial` |
| 15 | 5 | 5.3 | 7 bens registrados + 1 sobra | `Conformidade=conformes/registrados` | 57,14% (ou 50% com sobra no denominador) | `calculations.js: conformidadePatrimonial` |
| 15 | 5 | 5.4 | Lenovo R$5.400; vida 5a; residual 0 | Mesmo método do 5.1/5.2 | VC em 31/12/2026 = R$3.240,00 | `calculations.js: calcularDepreciacao` (notebookLenovo) |
| 17 | 6 | Relatório | Resultados de 1–5 | Consolidação (sem valores manuais) | Relatório de 1 página + plano de ação | `views/etapa6.js: dadosConsolidados, montarRelatorioHtml` |

## Observações de implementação

- Todas as linhas da tabela acima são calculadas em tempo real a partir de
  `assets/js/data.js` (fonte única dos dados do case) — nenhum resultado é digitado
  como texto fixo nas views; o HTML é montado chamando as funções de
  `calculations.js`.
- A pauta de avaliação (página 18 do PDF) é material de uso exclusivo docente e
  **não foi reproduzida** nesta plataforma pública, conforme instrução do prompt
  mestre.
- O desafio estatístico (2.8) e a tabela de depreciação por exercício aparecem como
  conteúdo expandido/opcional nas respectivas etapas.
