# Auditoria de cálculos — Case VETTA

Esta auditoria revisa os resultados do Guia do Docente frente aos cálculos
implementados em `assets/js/calculations.js`, verificados programaticamente em
`tests/calculations.test.js`. Todos os 14 resultados-âncora do gabarito batem
exatamente com o valor exibido no site (ver seção "Resultados conferidos").

## 1. Curva ABC

- Os percentuais são calculados com **precisão total em ponto flutuante** e só
  arredondados na exibição (`fmtPercent`, 2 casas) — o acúmulo de arredondamento
  intermediário (ex.: somar percentuais já arredondados) não ocorre.
- Verificado: Total = R$ 646.260,00; Classe A = 73,81% (2 itens); Classe B = 19,22%
  (3 itens); Classe C = 6,97% (5 itens). Soma dos três percentuais = 100,00% exatos.
- A pasta suspensa fica em 95,81% acumulado — acima do limite de 95% da classe B,
  portanto corretamente classificada como C. É um caso de fronteira citado
  explicitamente na Etapa 1 do site.

## 2. LEC e estoque de segurança

- O LEC (60 un) é calculado com a fórmula clássica de Wilson. Essa fórmula pressupõe
  demanda constante, sem desconto por volume e capacidade de armazenagem ilimitada —
  limitações explicitadas em todas as etapas que usam o LEC.
- **Importante (divergência conceitual documentada, não um erro):** a fórmula de
  custo total anual usada no gabarito original (`CT = D×Cu + (D/Q)×S + (Q/2)×H`)
  compara apenas o **custo cíclico** das duas políticas. Ela não inclui
  separadamente o termo `SS × H` (custo de manter o estoque de segurança), porque
  esse termo é **idêntico nas duas políticas comparadas** (o SS não depende de Q) e
  por isso se cancela na comparação — mas ele existe e está sendo pago nos dois
  cenários. O site deixa isso explícito na Etapa 2, item 2.6, em vez de aplicar a
  simplificação silenciosamente.
- SS pelo método determinístico (14 un) é significativamente mais conservador que o
  SS estatístico (7 un, arredondado de 6,26). A diferença de custo de manter entre
  os dois métodos (R$ 294,00/ano) está corretamente calculada a partir da mesma
  constante H usada em todo o case.

## 3. Indicadores e inventário

- Giro e cobertura são sempre calculados com consumo e estoque médio **na mesma
  unidade monetária (R$)** — nunca misturando unidades físicas com valores
  monetários, erro comum sinalizado explicitamente na Etapa 3.
- Acuracidade por item (60,00%) e por valor (98,77%) usam bases de cálculo
  diferentes por definição (contagem de itens vs. soma de valores absolutos) — a
  diferença grande entre os dois números no case é esperada e didaticamente
  destacada, não um erro de cálculo.
- Confirmado: a soma das divergências absolutas em reais é R$ 920,00 (|−864| + |56|
  dos dois itens com diferença), **não** R$ 808,00 (que seria a soma líquida,
  errônea para fins de acuracidade).

## 4. Fornecedores

- **Ponto crítico identificado e corrigido durante o desenvolvimento:** a primeira
  versão do modelo de valor presente aplicava incorretamente o desconto de 1 mês a
  **todas** as propostas, inclusive a condições "à vista" (pagamento imediato, sem
  desconto temporal a aplicar). Isso fazia o fornecedor B aparecer com VP menor que
  o correto. O modelo foi corrigido para que cada condição de pagamento declare
  explicitamente seu horizonte (`nMeses`): condições à vista têm `nMeses = 0` (valor
  nominal já é o valor presente) e condições a prazo são descontadas pelo custo de
  oportunidade pelo número de meses correspondente. Após a correção, os valores
  batem exatamente com o gabarito: VP(A, à vista 3%) = R$ 12.111,00; VP(B, à vista) =
  R$ 12.200,00; VP(C, 30 dias) = R$ 12.352,94.
- A taxa implícita do desconto (3,09% a.m.) é maior que o custo de oportunidade
  (2% a.m.), portanto a recomendação de antecipar o pagamento ao fornecedor A está
  corretamente justificada pelos números, não apenas assumida.
- O desconto de 3% do fornecedor A incide **apenas sobre o valor das mercadorias**,
  nunca sobre o frete — essa regra está isolada explicitamente na função
  `avaliarCondicoesPagamento`, não misturada ao cálculo do frete.

## 5. Patrimônio

- A contagem de meses de uso (30 meses, de 01/07/2024 a 31/12/2026) é feita em
  **meses completos**, usando a mesma lógica de `DATEDIF` do Excel — nunca por
  arredondamento de anos.
- A depreciação acumulada é limitada ao valor depreciável
  (`Math.min(quotaMensal × meses, valorDepreciavel)`), evitando que o valor contábil
  fique abaixo do valor residual caso a data-base ultrapasse o fim da vida útil —
  uma proteção que o gabarito em papel não precisa, mas que o simulador interativo
  (que permite alterar vida útil e datas) exige para não gerar resultados absurdos.
- A conformidade patrimonial é apresentada nas duas bases possíveis (com e sem a
  sobra física no denominador: 57,14% e 50,00%), deixando explícita a escolha
  metodológica em vez de adotar uma sem explicar a outra.

## Resultados conferidos (script de teste)

Os 13 resultados abaixo são verificados automaticamente por
`tests/calculations.test.js` a cada execução (`node tests/calculations.test.js`):

| Resultado | Valor exigido |
|---|---|
| Valor total da Curva ABC | R$ 646.260,00 |
| LEC do toner | 60 unidades |
| Estoque de segurança (SS) | 14 unidades |
| Ponto de pedido (PP) | 50 unidades |
| Estoque máximo (Emáx) | 74 unidades |
| Estoque médio (Eméd) | 44 unidades |
| Economia anual (LEC vs. atual) | R$ 1.134,00 |
| Capital liberado | R$ 9.450,00 |
| Acuracidade por item | 60,00% |
| Acuracidade por valor | 98,77% |
| Ranking de fornecedores | C &gt; A &gt; B (9,57 / 8,05 / 7,10) |
| Depreciação acumulada (empilhadeira) | R$ 21.600,00 |
| Valor contábil (empilhadeira, 31/12/2026) | R$ 74.400,00 |
| Conformidade patrimonial | 57,14% |

Todos os 14 resultados passaram na última execução registrada deste documento.
