/* VETTA EDU — Biblioteca de prompts (Papel + Contexto + Dados + Tarefa + Regras + Formato + Verificação). */
window.VETTA_PROMPTS = [
  // ---------- Etapa 1 — Curva ABC ----------
  {
    etapa: 1, titulo: "Calcular e classificar materiais por curva ABC",
    objetivo: "Obter o valor anual, o ranking e a classificação A/B/C de uma lista de materiais.",
    quando: "Quando você tem uma lista de itens com demanda anual e custo unitário e precisa descobrir onde está concentrado o valor do estoque.",
    texto: `Papel: você é um analista de estoques experiente em classificação ABC.
Contexto: a empresa VETTA Suprimentos & Patrimônio Ltda. quer saber quais materiais do almoxarifado merecem mais atenção de controle.
Dados: [cole aqui a lista de itens com demanda anual e custo unitário, uma linha por item]
Tarefa: calcule o valor anual de cada item (demanda × custo unitário), ordene do maior para o menor valor, calcule o percentual individual e o percentual acumulado, e classifique em A (até 80% acumulado), B (de 80% a 95%) e C (acima de 95%).
Regras: mostre a fórmula usada em cada etapa; apresente os resultados em uma tabela; não arredonde os percentuais antes de acumular.
Formato de saída: tabela com colunas Item, Valor anual, % do total, % acumulado, Classe — seguida de um resumo com a quantidade e o percentual de valor de cada classe.
Verificação: confira se a soma dos valores anuais da tabela bate com o total informado, e se o percentual acumulado do último item é 100%.`,
    exemploDados: "Papel sulfite A4: 12.000 un/ano, R$ 24,00; Cartucho de toner: 900 un/ano, R$ 210,00; ...",
    resultadoEsperado: "Tabela ordenada com papel e toner classificados como A (juntos, ~74% do valor).",
    conferir: "Compare com o resultado do site na Etapa 1 — o valor total deve ser R$ 646.260,00.",
    limitacoes: "A IA pode errar a ordenação se os dados forem colados fora de ordem; sempre confira o total e o percentual acumulado final.",
    aplicacao: "Um analista de estoques pode usar esse prompt para classificar rapidamente centenas de itens de um relatório de giro, antes de decidir onde focar a contagem cíclica."
  },
  {
    etapa: 1, titulo: "Interpretar o gráfico de Pareto",
    objetivo: "Obter uma leitura gerencial do gráfico de Pareto da curva ABC.",
    quando: "Depois de gerar a classificação ABC, quando você quer transformar números em uma explicação para a diretoria.",
    texto: `Papel: você é um consultor de gestão de materiais explicando resultados para uma diretoria não técnica.
Contexto: a VETTA classificou seus 10 principais materiais em classes A, B e C.
Dados: [cole a tabela de ranking com classes A/B/C]
Tarefa: explique, em linguagem simples, o que o gráfico de Pareto revela sobre a concentração do valor, e quais riscos existem se a empresa ignorar essa distribuição.
Regras: evite jargão técnico sem explicação; traga pelo menos um risco concreto para a classe A e um para a classe C.
Formato de saída: um parágrafo de no máximo 150 palavras, seguido de 3 recomendações práticas em lista.
Verificação: confirme que as recomendações citam números reais da tabela (não genéricos).`,
    exemploDados: "Classe A: 2 itens = 73,81% do valor; Classe B: 3 itens = 19,22%; Classe C: 5 itens = 6,97%.",
    resultadoEsperado: "Explicação de que 20% dos itens concentram quase 3/4 do valor movimentado.",
    conferir: "Verifique se os números citados batem com a tabela da Etapa 1.",
    limitacoes: "A IA pode generalizar demais; sempre peça que ela cite os números específicos do seu caso.",
    aplicacao: "Útil para preparar a fala de uma reunião de diretoria sem precisar escrever o texto do zero."
  },
  {
    etapa: 1, titulo: "Definir políticas de controle por classe",
    objetivo: "Gerar recomendações de frequência de contagem e nível de controle por classe ABC.",
    quando: "Depois da classificação, para decidir como a operação deve tratar cada classe no dia a dia.",
    texto: `Papel: você é um especialista em controle de estoques.
Contexto: a VETTA tem itens classificados em A, B e C.
Dados: [cole o resumo de quantidade e valor por classe]
Tarefa: proponha, para cada classe, a frequência de contagem (cíclica), o nível de revisão dos parâmetros de reposição e o tipo de controle (rigoroso, intermediário ou simples).
Regras: justifique cada recomendação com base no valor financeiro e no risco de ruptura, não apenas repita regras genéricas de livro-texto.
Formato de saída: tabela com colunas Classe, Frequência de contagem, Revisão de parâmetros, Tipo de reposição, Justificativa.
Verificação: confira se a classe A recebe o controle mais rigoroso e a classe C o mais simples — o inverso seria um erro.`,
    exemploDados: "Classe A: 2 itens, 73,81% do valor. Classe C: 5 itens, 6,97% do valor.",
    resultadoEsperado: "Classe A com contagem mensal; Classe C com contagem semestral/anual.",
    conferir: "Compare com a Etapa 1 do site, questão 1.4.",
    limitacoes: "A IA não conhece a realidade operacional da sua equipe; valide a frequência proposta com a capacidade real de contagem.",
    aplicacao: "Serve de ponto de partida para escrever o procedimento operacional de inventário rotativo da empresa."
  },

  // ---------- Etapa 2 — Reposição ----------
  {
    etapa: 2, titulo: "Calcular LEC, SS e PP",
    objetivo: "Obter o Lote Econômico de Compra, o estoque de segurança e o ponto de pedido de um item.",
    quando: "Quando você tem demanda anual, custo de pedido, custo de manter e tempo de reposição de um item crítico.",
    texto: `Papel: você é um analista de reposição de estoques.
Contexto: a VETTA precisa definir quanto e quando comprar o cartucho de toner.
Dados: demanda anual = [valor]; custo unitário = [valor]; custo de emitir um pedido = [valor]; taxa de manutenção anual = [valor]; dias úteis no ano = [valor]; tempo de reposição = [valor] dias úteis; consumo máximo diário observado = [valor].
Tarefa: calcule o consumo médio diário, o custo de manter uma unidade por ano, o Lote Econômico de Compra, o número de pedidos por ano, o estoque de segurança, o ponto de pedido, o estoque máximo e o estoque médio.
Regras: mostre cada fórmula antes de calcular; use duas casas decimais para valores em reais; arredonde quantidades para o inteiro acima apenas no resultado final de compra.
Formato de saída: lista numerada com fórmula, substituição e resultado para cada grandeza.
Verificação: confira que Emáx = SS + LEC e que Eméd = LEC/2 + SS.`,
    exemploDados: "D=900 un/ano; Cu=R$210; S=R$84; i=20%; TR=10 dias úteis; Cmáx=5 un/dia; dias úteis=250.",
    resultadoEsperado: "LEC=60 un; SS=14 un; PP=50 un; Emáx=74 un; Eméd=44 un.",
    conferir: "Compare exatamente com os números da Etapa 2 do site.",
    limitacoes: "O modelo assume demanda constante — se a demanda variar muito, peça à IA para considerar o SS estatístico (desafio 2.8).",
    aplicacao: "Pode ser reaplicado para qualquer item crítico do almoxarifado, bastando trocar os dados de entrada."
  },
  {
    etapa: 2, titulo: "Comparar políticas de compra (custo total anual)",
    objetivo: "Comparar o custo total de uma política de compra atual com a política do LEC.",
    quando: "Para justificar, com números, a troca de uma prática informal de compras por uma política técnica.",
    texto: `Papel: você é um analista financeiro de suprimentos.
Contexto: a VETTA compra hoje em lotes de [Q atual] unidades, sem critério técnico; o LEC calculado é [LEC] unidades.
Dados: demanda anual, custo unitário, custo de pedido, custo de manter (informe os valores).
Tarefa: calcule o custo total anual (compra + pedir + manter) para as duas políticas e aponte a economia anual, explicando de onde ela vem.
Regras: separe claramente os três componentes do custo em cada política; não misture economia em compras com economia em manutenção de estoque de segurança.
Formato de saída: tabela comparativa com uma linha por componente de custo e uma conclusão de até 80 palavras.
Verificação: no ponto do LEC, o custo de pedir deve ser igual (ou muito próximo) ao custo de manter — se não for, revise o cálculo do LEC.`,
    exemploDados: "Q atual=150; LEC=60; D=900; Cu=R$210; S=R$84; H=R$42.",
    resultadoEsperado: "Economia de R$ 1.134,00/ano.",
    conferir: "Confira com a Etapa 2, questão 2.6, do site.",
    limitacoes: "A fórmula de custo total cíclico não inclui separadamente o custo de manter o estoque de segurança — peça à IA para mencionar essa simplificação.",
    aplicacao: "Base para o argumento financeiro de um pedido de mudança de política de compras à diretoria."
  },
  {
    etapa: 2, titulo: "Simular mudanças de demanda e prazo de reposição",
    objetivo: "Testar como o LEC, o SS e o PP mudam quando a demanda ou o tempo de reposição variam.",
    quando: "Para avaliar riscos antes de negociar um novo fornecedor ou enfrentar um pico de demanda.",
    texto: `Papel: você é um analista de planejamento de materiais fazendo análise de sensibilidade.
Contexto: os parâmetros atuais do item são [cole os dados usados na Etapa 2].
Dados: cenário 1 = parâmetros originais; cenário 2 = [descreva a mudança, ex.: tempo de reposição dobra para 20 dias].
Tarefa: recalcule LEC, SS, PP e estoque médio nos dois cenários e explique o impacto prático de cada mudança no capital investido em estoque e no risco de ruptura.
Regras: apresente os dois cenários lado a lado; destaque qual grandeza muda mais e por quê.
Formato de saída: tabela comparativa cenário 1 × cenário 2, seguida de uma recomendação de ação.
Verificação: se o tempo de reposição aumentar, o SS e o PP devem aumentar também — confira essa direção antes de aceitar a resposta.`,
    exemploDados: "Cenário 2: TR passa de 10 para 20 dias úteis.",
    resultadoEsperado: "SS e PP aumentam proporcionalmente ao novo TR.",
    conferir: "Use o Simulador Gerencial do site para validar o resultado numérico exato.",
    limitacoes: "A IA pode esquecer de recalcular o LEC quando apenas o custo de pedir muda — sempre peça o recálculo completo.",
    aplicacao: "Ajuda a preparar a empresa para negociar prazos com fornecedores, mostrando o custo real de cada dia extra de espera."
  },

  // ---------- Etapa 3 — Indicadores ----------
  {
    etapa: 3, titulo: "Calcular giro e cobertura de estoque",
    objetivo: "Medir quantas vezes o estoque gira por ano e quantos dias de cobertura ele garante.",
    quando: "Para avaliar se uma política de estoque está liberando ou prendendo capital de giro.",
    texto: `Papel: você é um analista de indicadores de supply chain.
Contexto: a VETTA quer comparar o desempenho do estoque de toner em duas políticas de compra diferentes.
Dados: consumo anual em R$ = [valor]; estoque médio em R$ para cada política = [valores]; dias úteis no ano = [valor].
Tarefa: calcule o giro (consumo anual ÷ estoque médio) e a cobertura em dias (dias úteis ÷ giro) para cada política, e explique a diferença de capital imobilizado entre elas.
Regras: mantenha consumo e estoque médio na mesma unidade monetária; não troque reais por unidades no meio do cálculo.
Formato de saída: tabela com giro e cobertura por política, seguida do valor de capital liberado.
Verificação: a política com maior giro deve ter menor cobertura em dias — se a IA apresentar o contrário, há um erro de cálculo.`,
    exemploDados: "Consumo anual R$189.000; Eméd política A = R$18.690; Eméd política B = R$9.240.",
    resultadoEsperado: "Giro de ~10,11× e ~20,45×; capital liberado de R$9.450,00.",
    conferir: "Compare com a Etapa 3, questões 3.1 e 3.2, do site.",
    limitacoes: "Giro alto nem sempre é bom — peça à IA para comentar o risco de ruptura se o estoque de segurança for reduzido.",
    aplicacao: "Indicador padrão apresentado em reuniões de resultado de operações e suprimentos."
  },
  {
    etapa: 3, titulo: "Investigar divergências de inventário",
    objetivo: "Levantar hipóteses de causa para divergências entre saldo físico e saldo do sistema.",
    quando: "Depois de uma contagem cíclica que revelou diferenças entre o estoque físico e o sistema.",
    texto: `Papel: você é um auditor interno de estoques.
Contexto: uma contagem física na VETTA encontrou divergências em alguns itens.
Dados: [cole a tabela com item, quantidade do sistema, quantidade física e custo unitário]
Tarefa: calcule a divergência em unidades e em reais de cada item, a acuracidade por item e a acuracidade por valor, e liste pelo menos duas causas prováveis para cada tipo de divergência (falta e sobra).
Regras: use o valor absoluto das divergências para o cálculo de acuracidade; não compense divergências positivas com negativas.
Formato de saída: tabela de divergências + lista de causas prováveis + lista de ações corretivas recomendadas.
Verificação: a acuracidade por valor é quase sempre maior que a acuracidade por item quando o erro está concentrado em poucos itens de alto valor — confirme se esse padrão aparece no seu caso.`,
    exemploDados: "Papel A4: sistema 1.800, físico 1.764, custo R$24,00.",
    resultadoEsperado: "Acuracidade por item ~60%; por valor ~98,77%.",
    conferir: "Compare com a Etapa 3, questão 3.3, do site.",
    limitacoes: "A IA não pode confirmar a causa real da divergência — ela só sugere hipóteses, que precisam ser investigadas na empresa.",
    aplicacao: "Modelo de checklist para o responsável pelo inventário rotativo investigar antes de qualquer ajuste de saldo."
  },
  {
    etapa: 3, titulo: "Elaborar recomendações de controle de estoque",
    objetivo: "Transformar indicadores de giro, cobertura e acuracidade em um plano de melhoria.",
    quando: "Para fechar a análise de indicadores com ações concretas, não apenas números.",
    texto: `Papel: você é um gerente de operações revisando indicadores de estoque.
Contexto: os indicadores calculados da VETTA são [cole giro, cobertura, acuracidade por item e por valor].
Tarefa: proponha três ações de melhoria priorizadas, cada uma com responsável sugerido, prazo e benefício esperado.
Regras: priorize primeiro os riscos de ruptura e de perda de controle, depois as oportunidades de redução de capital parado.
Formato de saída: tabela de plano de ação (ação, responsável, prazo, benefício esperado).
Verificação: cada ação deve estar amarrada a um número específico citado no contexto — rejeite ações genéricas sem relação com os dados.`,
    exemploDados: "Acuracidade por item 60% (meta 95%); giro 10,11×.",
    resultadoEsperado: "Plano com ação de contagem cíclica mensal, revisão de parâmetros e negociação de prazo.",
    conferir: "Compare com o plano de ação apresentado na Etapa 6 do site.",
    limitacoes: "Responsáveis e prazos sugeridos pela IA são apenas exemplos — ajuste à realidade da sua equipe.",
    aplicacao: "Rascunho inicial para a reunião de fechamento mensal de indicadores de estoque."
  },

  // ---------- Etapa 4 — Fornecedores ----------
  {
    etapa: 4, titulo: "Comparar cotações de fornecedores",
    objetivo: "Trazer propostas de fornecedores diferentes para a mesma base de comparação (valor presente).",
    quando: "Quando você tem cotações com preços, fretes e prazos de pagamento diferentes.",
    texto: `Papel: você é um comprador sênior avaliando cotações.
Contexto: a VETTA recebeu cotações de três fornecedores para a mesma quantidade de um item.
Dados: [cole, para cada fornecedor: preço unitário, frete, condição de pagamento, prazo de entrega]
Tarefa: calcule o custo do pedido de cada fornecedor (sem desconto), o valor presente considerando a condição de pagamento mais vantajosa de cada um, e aponte qual tem o menor valor presente.
Regras: use o custo de oportunidade do dinheiro informado para descontar pagamentos a prazo; pagamentos à vista não são descontados.
Formato de saída: tabela com custo do pedido, condição usada e valor presente por fornecedor, ordenada do menor para o maior VP.
Verificação: um fornecedor com preço unitário menor pode não ter o menor valor presente — confira se o frete e a condição de pagamento foram considerados.`,
    exemploDados: "Fornecedor A: R$205/un, frete R$180, 30 dias ou à vista com 3% de desconto. Custo de oportunidade: 2% a.m.",
    resultadoEsperado: "Fornecedor A, à vista com desconto, tem o menor VP (R$12.111,00).",
    conferir: "Compare com a Etapa 4, questões 4.1 e 4.2, do site.",
    limitacoes: "A IA pode esquecer de aplicar o desconto apenas sobre a mercadoria (não sobre o frete) — confira esse detalhe.",
    aplicacao: "Modelo direto para qualquer rodada de cotação de compras recorrentes."
  },
  {
    etapa: 4, titulo: "Aplicar matriz de decisão ponderada",
    objetivo: "Combinar preço, prazo, qualidade e atendimento em uma nota final de fornecedor.",
    quando: "Quando o menor preço não é, isoladamente, a melhor decisão de compra.",
    texto: `Papel: você é um analista de sourcing estruturando uma decisão multicritério.
Contexto: a VETTA quer escolher um fornecedor considerando mais do que o preço.
Dados: [cole, para cada fornecedor: valor presente, prazo de entrega, nota de qualidade (0-10), nota de atendimento (0-10)] e os pesos de cada critério.
Tarefa: calcule a nota de preço (menor VP ÷ VP do fornecedor × 10), a nota de prazo (menor prazo ÷ prazo do fornecedor × 10), e a nota final ponderada pelos pesos informados.
Regras: normalize preço e prazo sempre em relação ao melhor valor do grupo (menor VP, menor prazo); qualidade e atendimento já vêm em escala 0-10.
Formato de saída: tabela de notas por critério + nota final, ordenada do maior para o menor.
Verificação: teste com pesos diferentes (ex.: preço 60%) e veja se o fornecedor vencedor muda — isso mostra a robustez (ou fragilidade) da decisão.`,
    exemploDados: "Pesos: preço 40%, prazo 25%, qualidade 20%, atendimento 15%.",
    resultadoEsperado: "Fornecedor C com nota final 9,57, à frente de A (8,05) e B (7,10).",
    conferir: "Compare com a Etapa 4, questão 4.4, do site.",
    limitacoes: "Pesos são uma escolha de gestão, não um cálculo objetivo — documente por que cada peso foi escolhido.",
    aplicacao: "Estrutura reutilizável para qualquer decisão de compra com múltiplos critérios relevantes."
  },
  {
    etapa: 4, titulo: "Preparar uma negociação com fornecedor",
    objetivo: "Calcular o desconto-alvo necessário para igualar a melhor proposta do mercado.",
    quando: "Antes de uma reunião de negociação com o fornecedor preferido por qualidade/prazo, mas não pelo menor custo.",
    texto: `Papel: você é um comprador se preparando para negociar.
Contexto: o fornecedor [X] tem a melhor nota geral, mas não o menor valor presente; o fornecedor com menor VP é [Y].
Dados: valor presente do fornecedor X (sem desconto); menor valor presente do mercado (fornecedor Y); número de pedidos por ano.
Tarefa: calcule a diferença de custo anual entre manter o fornecedor X sem desconto e migrar para Y, e o percentual de desconto que X precisaria oferecer para igualar o VP de Y.
Regras: explicite que o ganho de manter X também inclui benefícios não financeiros (qualidade, prazo, estoque menor) — não resuma tudo a uma única conta.
Formato de saída: um parágrafo com o argumento de negociação pronto para ser dito ao fornecedor, citando o percentual de desconto-alvo.
Verificação: o desconto-alvo calculado deve, quando aplicado ao preço de X, resultar em um VP igual (ou muito próximo) ao de Y.`,
    exemploDados: "VP de C = R$12.352,94; menor VP do mercado (A) = R$12.111,00; 15 pedidos/ano.",
    resultadoEsperado: "Desconto-alvo de aproximadamente 3,88%.",
    conferir: "Compare com a Etapa 4, questão 4.5, do site.",
    limitacoes: "A IA não negocia por você — ela só prepara o argumento numérico; a condução da conversa é humana.",
    aplicacao: "Argumento pronto para levar a uma reunião de negociação comercial."
  },

  // ---------- Etapa 5 — Patrimônio ----------
  {
    etapa: 5, titulo: "Calcular depreciação linear de um bem",
    objetivo: "Obter a quota de depreciação e o valor contábil de um bem patrimonial em uma data-base.",
    quando: "Para atualizar o valor contábil de qualquer bem do ativo imobilizado.",
    texto: `Papel: você é um analista de controladoria patrimonial.
Contexto: a VETTA precisa atualizar o valor contábil de um bem do ativo imobilizado.
Dados: valor de aquisição = [valor]; data de aquisição = [data]; vida útil = [anos]; valor residual = [percentual ou valor]; data-base do cálculo = [data].
Tarefa: calcule o valor residual, o valor depreciável, a quota anual, a quota mensal, os meses completos de uso até a data-base, a depreciação acumulada e o valor contábil nessa data.
Regras: conte meses completos de uso, nunca anos arredondados; desconte o valor residual antes de dividir pela vida útil.
Formato de saída: lista numerada com cada grandeza calculada e sua fórmula.
Verificação: o valor contábil não pode ficar abaixo do valor residual — se isso ocorrer, revise a contagem de meses.`,
    exemploDados: "Valor de aquisição R$96.000; aquisição 01/07/2024; vida útil 10 anos; residual 10%; data-base 31/12/2026.",
    resultadoEsperado: "Valor contábil de R$74.400,00 (25% do valor depreciável consumido).",
    conferir: "Compare com a Etapa 5, questões 5.1 e 5.2, do site.",
    limitacoes: "As taxas deste exercício são didáticas; taxas fiscais reais seguem tabela da Receita Federal.",
    aplicacao: "Modelo direto para a rotina de fechamento contábil mensal de qualquer bem do imobilizado."
  },
  {
    etapa: 5, titulo: "Analisar inventário patrimonial",
    objetivo: "Classificar a situação de cada bem conferido e definir a ação corretiva adequada.",
    quando: "Depois de uma conferência física de bens patrimoniais contra o sistema.",
    texto: `Papel: você é um responsável por patrimônio conciliando um inventário físico.
Contexto: a VETTA conferiu seus bens patrimoniais contra o cadastro do sistema.
Dados: [cole, para cada bem: plaqueta, local no sistema, o que foi constatado fisicamente]
Tarefa: classifique cada bem em uma das situações (Conforme, Local divergente, Não localizado, Plaqueta ilegível, Sobra física) e recomende a ação adequada para cada uma.
Regras: nunca recomende "baixar" um bem não localizado sem antes recomendar uma apuração formal; sobra física não é patrimônio da empresa até ser investigada e cadastrada.
Formato de saída: tabela com plaqueta, situação e ação recomendada, seguida do percentual de conformidade do inventário.
Verificação: a soma de bens em cada situação deve bater com o total de bens conferidos.`,
    exemploDados: "P-0104 Notebook Lenovo: sistema diz 'Compras', não encontrado em nenhum setor.",
    resultadoEsperado: "P-0104 classificado como 'Não localizado', com recomendação de apuração formal.",
    conferir: "Compare com a Etapa 5, questão 5.3, do site.",
    limitacoes: "A IA não decide se um bem deve ser baixado — essa é uma decisão formal da empresa, com aprovação e registro.",
    aplicacao: "Checklist de apoio para quem conduz o inventário físico anual de bens patrimoniais."
  },
  {
    etapa: 5, titulo: "Organizar ações corretivas de patrimônio",
    objetivo: "Priorizar as ocorrências mais graves encontradas no inventário patrimonial.",
    quando: "Para decidir por onde começar depois de uma conferência física com várias pendências.",
    texto: `Papel: você é um gestor de patrimônio priorizando um plano de regularização.
Contexto: o inventário físico da VETTA encontrou bens com diferentes situações: não localizado, sobra física, local divergente e plaqueta ilegível.
Dados: [cole a lista de ocorrências por bem]
Tarefa: ordene as ocorrências por gravidade (risco financeiro e de controle), explique o motivo da ordem escolhida, e sugira um prazo razoável para cada tipo de ocorrência.
Regras: bens não localizados e sobras físicas devem vir antes de correções puramente administrativas (local, plaqueta).
Formato de saída: lista ordenada com ocorrência, motivo da prioridade e prazo sugerido.
Verificação: confirme que nenhuma ocorrência de "não localizado" ficou com prioridade baixa.`,
    exemploDados: "1 não localizado, 1 sobra física, 1 local divergente, 1 plaqueta ilegível.",
    resultadoEsperado: "Não localizado e sobra física em primeiro lugar; correções administrativas depois.",
    conferir: "Compare com a priorização da Etapa 5 do site.",
    limitacoes: "Prazos sugeridos são apenas uma referência inicial — ajuste à capacidade da equipe de patrimônio.",
    aplicacao: "Guia rápido para montar o cronograma de regularização após um inventário físico."
  },

  // ---------- Etapa 6 — Relatório ----------
  {
    etapa: 6, titulo: "Construir um relatório gerencial de uma página",
    objetivo: "Consolidar os resultados de todas as etapas em um relatório curto e decisório.",
    quando: "Ao final da análise, quando é hora de apresentar a recomendação à diretoria.",
    texto: `Papel: você é um gerente de suprimentos preparando um relatório executivo.
Contexto: os resultados consolidados das etapas de curva ABC, reposição, indicadores, fornecedores e patrimônio da VETTA são: [cole um resumo dos principais números de cada etapa].
Tarefa: escreva um relatório de uma página com as seções: resumo executivo, diagnóstico, reposição, fornecedor recomendado, patrimônio, riscos e limitações.
Regras: cada afirmação precisa estar amarrada a um número específico; nada de recomendação sem evidência numérica; use no máximo 350 palavras no total.
Formato de saída: relatório estruturado em seções numeradas, pronto para apresentação.
Verificação: releia e confirme que cada seção responde a uma das quatro perguntas: o que encontramos? o que significa? o que recomendamos? o que acontece se nada for feito?`,
    exemploDados: "LEC=60un; economia R$1.134/ano; fornecedor C nota 9,57; valor contábil empilhadeira R$74.400.",
    resultadoEsperado: "Relatório de uma página cobrindo as seis etapas com números específicos.",
    conferir: "Compare com o modelo de relatório da Etapa 6 do site.",
    limitacoes: "A IA organiza e escreve o texto, mas a decisão final e a responsabilidade pela recomendação são da equipe humana.",
    aplicacao: "Acelera a redação do relatório gerencial sem substituir a validação dos números pela equipe."
  },
  {
    etapa: 6, titulo: "Elaborar plano de ação a partir do relatório",
    objetivo: "Transformar as recomendações do relatório em tarefas com responsável, prazo e benefício.",
    quando: "Logo após fechar o relatório gerencial, antes de apresentá-lo à diretoria.",
    texto: `Papel: você é um gerente de operações transformando recomendações em plano de ação.
Contexto: o relatório gerencial da VETTA recomenda mudar a política de reposição do toner, negociar com um novo fornecedor e regularizar o patrimônio.
Dados: [cole as recomendações do relatório]
Tarefa: crie um plano de ação com colunas: o quê, quem, quando, como, quanto custa ou quanto se ganha.
Regras: cada linha do plano precisa ter um responsável nomeado (ou papel, como "Compradora sênior") e um prazo realista; evite ações vagas como "melhorar o processo".
Formato de saída: tabela de plano de ação com no mínimo 4 linhas.
Verificação: cada ação do plano deve corresponder a uma recomendação específica do relatório — nenhuma ação "solta".`,
    exemploDados: "Recomendações: adotar LEC; negociar fornecedor C; apurar bens não localizados.",
    resultadoEsperado: "Plano de ação com 4 a 6 linhas, cada uma ligada a uma recomendação do relatório.",
    conferir: "Compare com o plano de ação apresentado na Etapa 6 do site.",
    limitacoes: "Responsáveis e prazos são sugestões — a equipe real deve validar a viabilidade.",
    aplicacao: "Transforma a análise em um documento operacional que pode ser acompanhado semana a semana."
  },
  {
    etapa: 6, titulo: "Revisar criticamente a recomendação final",
    objetivo: "Testar a robustez da recomendação antes de apresentá-la, buscando pontos fracos.",
    quando: "Como última checagem, antes de finalizar o relatório gerencial.",
    texto: `Papel: você é um revisor crítico e cético, procurando falhas em uma recomendação de negócio.
Contexto: a recomendação final da VETTA é [cole a recomendação, ex.: adotar o LEC de 60 un e comprar do fornecedor C].
Dados: [cole os principais números que sustentam a recomendação]
Tarefa: aponte as três maiores fragilidades ou hipóteses não comprovadas dessa recomendação (ex.: demanda pode não ser estável; fornecedor pode não sustentar o prazo).
Regras: para cada fragilidade apontada, sugira uma forma simples de mitigá-la ou monitorá-la.
Formato de saída: lista de até 3 fragilidades, cada uma com uma ação de mitigação associada.
Verificação: confirme que nenhuma fragilidade apontada é genérica demais para ser útil — ela precisa se referir a um número ou premissa específica do caso.`,
    exemploDados: "Recomendação: trocar o fornecedor atual pelo fornecedor C, adotando o LEC de 60 unidades.",
    resultadoEsperado: "Fragilidades como: dependência de um único fornecedor; demanda tratada como constante; custo de pedir estimado.",
    conferir: "Compare com a seção 'Riscos e limitações' do relatório da Etapa 6 do site.",
    limitacoes: "Esse exercício não substitui a revisão humana da diretoria antes da decisão final.",
    aplicacao: "Prática de pensamento crítico antes de qualquer apresentação importante de negócio."
  }
];
