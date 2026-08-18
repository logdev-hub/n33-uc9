window.UC9_LESSONS = [
  {
    n: 1, title: 'Fundamentos da Gestão de Materiais', hours: '3,5h', indicator: 'Indicador 1', bloom: 'Lembrar', spiral: '1ª abordagem',
    objective: 'Identificar os principais conceitos de gestão de materiais e sua aplicação em situações reais.',
    chat: [
      ['👩🏽','Renata Aquino','19:04','Recebemos pedidos urgentes de três setores, mas cada um usa um nome diferente para o mesmo material. Não sei o que já temos nem quem deve autorizar a saída.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:06','Uma planilha resolve? Posso pedir para uma IA organizar a lista, mas primeiro precisamos definir os campos e conferir o cadastro.'],
      ['👨🏽‍💼','Otávio Ferraz','19:08','Antes da ferramenta, precisamos enxergar o fluxo: necessidade, compra, recebimento, armazenagem, movimentação, controle e destinação.']
    ],
    question: 'Como organizar o fluxo de materiais da VETTA para saber o que existe, onde está e quando repor?',
    theory: [
      ['Gestão de materiais','É o conjunto coordenado de decisões sobre planejamento, aquisição, recebimento, armazenagem, movimentação, controle e distribuição de materiais. Seu objetivo é disponibilizar o item correto, na quantidade necessária, no momento e local adequados, com custo total controlado.'],
      ['Material, estoque e patrimônio','Material é o item usado ou movimentado pela organização. Estoque é o conjunto de materiais mantidos para consumo ou venda. Bem patrimonial é um recurso durável sob responsabilidade da organização, identificado e acompanhado durante sua vida útil.'],
      ['Fluxo e registro','Um fluxo confiável liga solicitação, aprovação, compra, conferência, guarda, requisição, entrega e baixa. Cada movimentação precisa de data, item, quantidade, origem, destino e responsável para gerar rastreabilidade.'],
      ['Visão sistêmica','Compras, almoxarifado, patrimônio, financeiro e setores usuários compartilham dados. Uma decisão isolada pode causar falta, excesso, perda, retrabalho ou capital parado.']
    ],
    resolution: `<p><strong>Situação:</strong> Otávio propõe mapear o processo antes de escolher a ferramenta.</p>
      <ol><li><strong>Passo 1 — delimitar:</strong> listar os materiais críticos e os setores que solicitam, aprovam e recebem.</li>
      <li><strong>Passo 2 — padronizar:</strong> criar código, descrição, unidade de medida e localização únicos para cada item.</li>
      <li><strong>Passo 3 — registrar:</strong> usar um documento de entrada e outro de saída com data, quantidade e responsável.</li>
      <li><strong>Passo 4 — controlar:</strong> comparar saldo registrado com saldo físico e investigar diferenças.</li>
      <li><strong>Passo 5 — decidir:</strong> comunicar necessidades de reposição com base em consumo, saldo e prazo do fornecedor.</li></ol>
      <p class="mb-0"><strong>Resultado gerencial:</strong> a VETTA passa a rastrear cada item e transforma registros operacionais em decisões de reposição.</p>`,
    mentor: [['Otávio','“Organização começa no cadastro: nomes diferentes geram saldos que parecem diferentes.”'],['Renata','“Vou confirmar a unidade de medida e o responsável antes de lançar.”'],['Otávio','“Essa proatividade, junto com clareza na comunicação, evita retrabalho entre os setores.”']],
    tips: ['Defina responsáveis e pontos de controle em cada etapa.','Padronize descrições e unidades antes de importar dados.','Faça conferências físicas periódicas e registre divergências.'],
    research: ['“fundamentos da gestão de materiais” em livros e periódicos de Administração e Logística','manuais de almoxarifado de órgãos públicos','conteúdos do SEBRAE sobre organização e controle de estoques'],
    prompt: 'Atue como tutor de gestão de materiais. Analise este fluxo da VETTA: solicitação, compra, recebimento, armazenagem e saída. Identifique os registros mínimos de cada etapa, explique por que são necessários e faça três perguntas para eu conferir meu entendimento. Não invente normas.',
    ai: 'Uma IA pode organizar o fluxo, sugerir campos e apontar lacunas. A equipe ainda deve conferir os dados, as responsabilidades e os procedimentos internos.',
    closing: 'O mapa do fluxo será a base do Projeto Integrador. Sem registros padronizados, os cálculos de níveis de estoque e reposição não representam a realidade.'
  },
  {
    n: 2, title: 'Controle de Estoques e Reposição', hours: '3,5h', indicator: 'Indicador 2', bloom: 'Compreender', spiral: '1ª abordagem',
    objective: 'Calcular e analisar os níveis de estoques e propor formas de reposição adequadas.',
    chat: [
      ['👩🏽','Renata Aquino','19:02','Temos cinco itens e pouco orçamento. O item com mais unidades deve ser comprado primeiro?'],
      ['🧑🏻‍💻','Diego Bittencourt','19:04','Posso ordenar a planilha, mas precisamos escolher o critério. Quantidade sozinha não mostra o dinheiro comprometido.'],
      ['👨🏽‍💼','Otávio Ferraz','19:07','Vamos calcular o valor de consumo e aplicar a Curva ABC. Depois definimos controles proporcionais à relevância de cada item.']
    ],
    question: 'Quais itens concentram o maior valor de consumo e, por isso, exigem controle prioritário?',
    theory: [
      ['Valor de consumo','É a quantidade consumida no período multiplicada pelo custo unitário. Ele combina volume e valor financeiro para comparar itens diferentes.'],
      ['Curva ABC','Os itens são ordenados do maior para o menor valor de consumo. Calculam-se percentuais individual e acumulado. Como referência: A até cerca de 80%; B de cerca de 80% a 95%; C de cerca de 95% a 100%. Os limites orientam a análise, não substituem o julgamento gerencial.'],
      ['FIFO/PEPS','No método Primeiro que Entra, Primeiro que Sai, a saída consome o lote mais antigo pelo seu custo de aquisição. O Kardex registra entradas, saídas e saldo em quantidade e valor.'],
      ['Reposição','Políticas de reposição combinam consumo, prazo de entrega, estoque de segurança e custo do pedido. Classificação ABC não determina sozinha a compra; criticidade e risco de falta também importam.']
    ],
    resolution: `<div class="table-responsive"><table class="table data-table"><thead><tr><th>Item</th><th>Consumo</th><th>Custo</th><th>Valor de consumo</th></tr></thead><tbody><tr><td>Cartucho</td><td>40</td><td>R$ 180,00</td><td>R$ 7.200,00</td></tr><tr><td>Papel A4</td><td>100</td><td>R$ 32,00</td><td>R$ 3.200,00</td></tr><tr><td>Etiqueta</td><td>200</td><td>R$ 8,00</td><td>R$ 1.600,00</td></tr><tr><td>Caneta</td><td>300</td><td>R$ 2,00</td><td>R$ 600,00</td></tr><tr><td>Clipe</td><td>500</td><td>R$ 0,40</td><td>R$ 200,00</td></tr></tbody></table></div>
      <p><span class="step-number">1</span><strong>Calcular:</strong> quantidade × custo unitário. Total = R$ 12.800,00.</p>
      <p><span class="step-number">2</span><strong>Ordenar:</strong> os itens já estão do maior para o menor valor de consumo.</p>
      <p><span class="step-number">3</span><strong>Percentuais:</strong> cartucho = 7.200 ÷ 12.800 × 100 = 56,25%; papel = 25%; acumulado após papel = 81,25%.</p>
      <p><span class="step-number">4</span><strong>Classificar:</strong> A: cartucho e papel (81,25%); B: etiqueta e caneta (98,44%, aceitando o corte aproximado); C: clipe (100%).</p>
      <p class="mb-0"><strong>Interpretação:</strong> cartucho e papel concentram a maior parcela financeira e pedem revisão frequente, cadastro preciso e negociação cuidadosa.</p>`,
    formulas: ['Valor de consumo = quantidade consumida × custo unitário','% individual = valor do item ÷ valor total × 100','% acumulado = soma progressiva dos percentuais'],
    mentor: [['Otávio','“Classe A não quer dizer item melhor; quer dizer maior impacto no valor analisado.”'],['Renata','“Então devo explicar o critério e não apenas colorir a planilha.”'],['Otávio','“Exato. Organizar os dados e comunicar a decisão com clareza são parte do controle.”']],
    tips: ['Revise itens A com maior frequência.','Considere criticidade e prazo além do valor.','Mantenha o período de consumo igual para todos os itens.'],
    research: ['“Curva ABC estoque valor de consumo” em livros de logística','“Kardex PEPS exemplos” em materiais acadêmicos','conteúdos do SEBRAE sobre controle de estoque'],
    prompt: 'Ensine Curva ABC sem fazer o trabalho por mim. Com os itens e valores que vou fornecer, confira a ordem, mostre como calcular os percentuais e questione classificações próximas aos limites de 80% e 95%.',
    ai: 'Uma IA pode revisar aritmética e explicar a ordem. Ela não conhece, sem dados adicionais, a criticidade do item, o prazo real ou a política da empresa.',
    closing: 'A Curva ABC ajuda o PI a concentrar análise nos itens de maior impacto. A turma poderá combinar essa prioridade com níveis de estoque e formas de reposição.'
  },
  {
    n: 3, title: 'Pesquisa e Negociação com Fornecedores', hours: '3,5h', indicator: 'Indicador 3', bloom: 'Aplicar', spiral: '1ª abordagem',
    objective: 'Realizar pesquisa de fornecedores e elaborar proposta de aquisição de materiais.',
    chat: [
      ['👩🏻‍💼','Fernanda Lopes','19:01','Recebi três cotações, mas cada fornecedor respondeu com prazo, frete e condição de pagamento diferentes.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:03','O menor preço apareceu rápido, só que uma proposta não confirma a especificação técnica.'],
      ['👩🏽','Renata Aquino','19:05','Precisamos tornar as ofertas comparáveis antes de recomendar a compra.']
    ],
    question: 'Como comparar e negociar propostas sem escolher apenas pelo menor preço nominal?',
    theory: [
      ['Requisição e especificação','A pesquisa começa com descrição objetiva: característica técnica, unidade, quantidade, prazo, local de entrega, garantia e critérios de aceitação. Uma especificação ambígua gera propostas incomparáveis.'],
      ['Cotação','O mapa de cotação registra fornecedor, conformidade, preço, impostos, frete, prazo, pagamento, validade e observações. O custo total de aquisição é mais informativo que o preço unitário isolado.'],
      ['Cadastro e atendimento','Dados cadastrais, contatos, documentos requeridos e histórico de desempenho devem seguir o procedimento da organização e a proteção adequada das informações.'],
      ['Negociação ética','Negociar é buscar condições sustentáveis, documentadas e coerentes com os requisitos. Tratamento cortês, igualdade de informação e registro dos compromissos reduzem riscos.']
    ],
    resolution: `<p><strong>Dados:</strong> 20 cadeiras ergonômicas. Alfa: R$ 720/un., frete R$ 600, 7 dias; Beta: R$ 735/un., frete incluso, 4 dias; Gama: R$ 690/un., especificação não confirmada.</p><ol><li><strong>Passo 1 — validar requisito:</strong> Gama fica pendente até comprovar conformidade.</li><li><strong>Passo 2 — equalizar custo:</strong> Alfa = 20 × 720 + 600 = R$ 15.000; Beta = 20 × 735 = R$ 14.700.</li><li><strong>Passo 3 — comparar condições:</strong> Beta também entrega três dias antes; conferir pagamento, garantia e validade.</li><li><strong>Passo 4 — negociar:</strong> solicitar à Alfa revisão do frete/preço e à Gama confirmação documental, sem revelar condições confidenciais das concorrentes.</li></ol><p class="mb-0"><strong>Resultado gerencial:</strong> entre as propostas confirmadas, Beta tem menor custo total e menor prazo, sujeito às demais condições acordadas.</p>`,
    formulas: ['Custo total de aquisição = (quantidade × preço unitário) + frete + demais custos aplicáveis'],
    mentor: [['Fernanda','“Antes de negociar preço, confirme se todos cotaram o mesmo objeto.”'],['Renata','“Vou registrar dúvidas e prazos de resposta no mapa.”'],['Fernanda','“Boa prática: cortesia no atendimento e responsabilidade com os prazos fortalecem a relação.”']],
    tips: ['Envie a mesma especificação e prazo a todos.','Registre versões, validade e contatos da proposta.','Justifique a recomendação com critérios verificáveis.'],
    research: ['“mapa comparativo de cotação” em manuais de compras','conteúdos do SEBRAE sobre negociação com fornecedores','boas práticas de homologação e avaliação de fornecedores'],
    prompt: 'Revise este mapa de cotação como tutor. Aponte campos ausentes, calcule apenas o custo total com os dados fornecidos e separe fatos, pendências e critérios de decisão. Não escolha fornecedor sem confirmar conformidade.',
    ai: 'A IA pode estruturar critérios e detectar campos ausentes. Preços, documentos, reputação e condições precisam ser confirmados diretamente com fontes confiáveis e com o fornecedor.',
    closing: 'Fornecedores confiáveis afetam o prazo de reposição usado no PI. Uma cotação bem equalizada torna as propostas de aquisição justificáveis.'
  },
  {
    n: 4, title: 'Classificação e Organização de Bens Patrimoniais', hours: '3,5h', indicator: 'Indicador 4', bloom: 'Analisar', spiral: '1ª abordagem',
    objective: 'Classificar e organizar bens patrimoniais conforme normas estabelecidas.',
    chat: [
      ['👩🏽','Renata Aquino','19:08','Na mudança do escritório encontramos notebooks, cadeiras, peças de reposição e materiais de consumo na mesma lista.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:10','Posso gerar etiquetas, mas ainda não sabemos quais itens precisam de identificação patrimonial individual.'],
      ['👨🏽‍💼','Otávio Ferraz','19:12','Primeiro classificamos pela natureza e pelo procedimento interno; depois codificamos, localizamos e etiquetamos.']
    ],
    question: 'Quais critérios permitem separar materiais de consumo e bens patrimoniais e organizar seu controle?',
    theory: [
      ['Classificação','Classificar agrupa itens por critérios úteis ao controle: natureza, uso, durabilidade, localização, responsabilidade, risco ou família. A política contábil e patrimonial da organização define o tratamento formal.'],
      ['Identificação patrimonial','Bens sujeitos a controle individual recebem número único e etiqueta compatível com o ambiente. O cadastro liga identificação, descrição, aquisição, valor, localização, responsável e estado.'],
      ['Organização física','Endereçamento, sinalização e separação por característica reduzem tempo de busca e avarias. O local físico deve corresponder ao cadastro.'],
      ['Referências de gestão','Práticas de controle patrimonial e os princípios da família ISO 55000 ajudam a pensar o ativo ao longo do ciclo de vida. A aplicação deve seguir as normas e procedimentos vigentes da organização.']
    ],
    resolution: `<p><strong>Lote analisado:</strong> 8 notebooks, 30 resmas de papel, 20 cadeiras, 50 canetas e 6 memórias RAM para manutenção.</p><ol><li><strong>Passo 1 — identificar uso e durabilidade:</strong> notebooks e cadeiras têm uso continuado; papel e canetas são consumidos; memórias são peças até a aplicação.</li><li><strong>Passo 2 — consultar regra interna:</strong> confirmar critérios contábeis e de controle individual, sem presumir apenas pelo preço.</li><li><strong>Passo 3 — codificar:</strong> atribuir identificador único aos bens controlados e código de estoque aos consumíveis/peças.</li><li><strong>Passo 4 — localizar:</strong> registrar sala ou endereço de almoxarifado e responsável.</li><li><strong>Passo 5 — etiquetar e conferir:</strong> aplicar etiqueta sem impedir uso ou manutenção; conferir cadastro × item.</li></ol><p class="mb-0"><strong>Resultado gerencial:</strong> cada grupo recebe tratamento coerente e pode ser localizado, inventariado e auditado.</p>`,
    mentor: [['Otávio','“Não decida pelo tamanho do objeto. A classificação depende da natureza e da regra da organização.”'],['Renata','“Vou documentar o critério e pedir validação quando houver dúvida.”'],['Otávio','“Isso demonstra zelo, responsabilidade e visão sistêmica.”']],
    tips: ['Nunca reutilize número patrimonial.','Posicione etiquetas em local acessível e protegido.','Registre mudança de localização no momento da movimentação.'],
    research: ['“ISO 55000 gestão de ativos visão geral” em fontes oficiais da ISO/ABNT','manuais de patrimônio de órgãos públicos','boas práticas de codificação e etiquetagem patrimonial'],
    prompt: 'Ajude-me a analisar uma lista de itens para controle. Proponha perguntas de classificação por natureza, durabilidade, uso e regra interna. Marque incertezas; não invente limites contábeis nem normas.',
    ai: 'A IA ajuda a formular critérios e organizar listas. A classificação oficial depende da política contábil, das normas aplicáveis e da validação do responsável.',
    closing: 'Classificação consistente melhora a qualidade do inventário e dos dados do PI. Ela evita misturar reposição de consumíveis com gestão de bens duráveis.'
  },
  {
    n: 5, title: 'Controle de Bens Patrimoniais', hours: '3,5h', indicator: 'Indicadores 1 e 4', bloom: 'Avaliar', spiral: 'aprofundamento',
    objective: 'Identificar e registrar a movimentação de bens patrimoniais em uma organização.',
    chat: [
      ['👩🏽','Renata Aquino','19:00','Um projetor saiu da sala de treinamento e apareceu no comercial, mas não há termo de transferência.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:02','O cadastro tem valor de compra, porém ninguém atualizou localização nem responsável.'],
      ['👨🏽‍💼','Otávio Ferraz','19:05','Vamos reconciliar o inventário e calcular a depreciação linear para separar localização física de valor contábil estimado.']
    ],
    question: 'Como registrar a movimentação e interpretar o valor do bem sem confundir controle físico e depreciação?',
    theory: [
      ['Inventário patrimonial','É a verificação sistemática dos bens, confrontando existência, identificação, localização, responsável e estado com o cadastro. Divergências exigem apuração e registro.'],
      ['Movimentação','Transferência, empréstimo, manutenção, retorno e baixa precisam de autorização e documento com bem, origem, destino, responsáveis, datas e condição.'],
      ['Depreciação linear','Distribui a base depreciável — valor de aquisição menos valor residual — igualmente pela vida útil estimada. É um cálculo patrimonial; não mede sozinho preço de mercado nem condição física.'],
      ['Segregação de responsabilidades','Quem solicita, autoriza, movimenta e confere pode ter papéis distintos conforme o controle interno. O histórico preserva rastreabilidade.']
    ],
    resolution: `<div class="table-responsive"><table class="table data-table"><tbody><tr><th>Valor de aquisição</th><td>R$ 9.000,00</td></tr><tr><th>Valor residual</th><td>R$ 1.000,00</td></tr><tr><th>Vida útil estimada</th><td>5 anos</td></tr><tr><th>Tempo transcorrido</th><td>2 anos</td></tr></tbody></table></div><p><span class="step-number">1</span><strong>Conferir o bem:</strong> número patrimonial, série, estado, sala atual e responsável.</p><p><span class="step-number">2</span><strong>Registrar a transferência:</strong> comercial como destino, responsáveis de origem/destino e data real identificada.</p><p><span class="step-number">3</span><strong>Calcular:</strong> depreciação anual = (9.000 − 1.000) ÷ 5 = R$ 1.600,00.</p><p><span class="step-number">4</span><strong>Acumular:</strong> 1.600 × 2 = R$ 3.200,00; valor contábil estimado = 9.000 − 3.200 = R$ 5.800,00.</p><p class="mb-0"><strong>Interpretação:</strong> o valor de R$ 5.800,00 representa o saldo pelo método informado após dois anos; a decisão de manutenção ou substituição também depende de estado, desempenho e política da VETTA.</p>`,
    formulas: ['Depreciação anual = (Valor de aquisição − Valor residual) ÷ Vida útil em anos','Valor contábil estimado = Valor de aquisição − Depreciação acumulada'],
    mentor: [['Otávio','“O bem pode estar funcionando e, ainda assim, o cadastro estar errado.”'],['Renata','“Vou comunicar a divergência e regularizar o documento sem apagar o histórico.”'],['Otávio','“Responsabilidade e zelo significam corrigir com rastreabilidade.”']],
    tips: ['Fotografe ou descreva avarias conforme a política interna.','Não altere cadastro sem evidência e autorização.','Concilie inventário físico, responsabilidade e registros contábeis.'],
    research: ['“inventário físico de bens patrimoniais” em manuais oficiais','“depreciação linear conceito” em fontes contábeis reconhecidas','“ISO 55000 ciclo de vida de ativos” em fontes oficiais'],
    prompt: 'Confira meu cálculo de depreciação linear com valor de aquisição, residual, vida útil e tempo transcorrido. Mostre fórmula, substituição e interpretação; diferencie valor contábil, estado físico e valor de mercado.',
    ai: 'A IA pode conferir a fórmula e ajudar a descrever divergências. Vida útil, residual, datas e tratamento contábil devem vir dos registros e das regras vigentes.',
    closing: 'O controle de movimentações evita compras desnecessárias e revela a disponibilidade real de equipamentos. No PI, isso amplia a análise além do estoque consumível.'
  },
  {
    n: 6, title: 'Pesquisa de Fornecedores', hours: '3,5h', indicator: 'Indicador 2', bloom: 'Criar', spiral: 'aprofundamento',
    objective: 'Realizar pesquisa com fornecedores para aquisição de materiais.',
    chat: [
      ['👩🏻‍💼','Fernanda Lopes','19:06','A VETTA precisa de um novo fornecedor de etiquetas resistentes à umidade; os atuais não atendem ao novo armazém.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:08','Encontrei muitos nomes na busca, mas anúncios e avaliações não comprovam capacidade de entrega.'],
      ['👩🏽','Renata Aquino','19:11','Vamos criar um roteiro de pesquisa e uma matriz de evidências antes de convidar fornecedores para cotação.']
    ],
    question: 'Como criar uma pesquisa de fornecedores confiável, comparável e conectada aos requisitos da aquisição?',
    theory: [
      ['Estratégia de pesquisa','Defina objeto, mercado, fontes, critérios eliminatórios, critérios classificatórios e evidências. Diversificar fontes reduz dependência de um único canal.'],
      ['Pré-qualificação','Capacidade técnica, regularidade requerida, localização, prazo, atendimento, amostras e histórico podem compor a análise, conforme risco e procedimento interno.'],
      ['Matriz de evidências','Cada afirmação relevante deve apontar fonte, data de consulta e verificação pendente. Ausência de evidência não equivale a reprovação automática, mas exige diligência.'],
      ['Integração ao PI','A confiabilidade do fornecedor influencia lead time, estoque de segurança e continuidade de abastecimento.']
    ],
    resolution: `<ol><li><strong>Passo 1 — especificar:</strong> etiqueta, dimensões, adesivo, resistência à umidade, impressora compatível, volume mensal e prazo.</li><li><strong>Passo 2 — escolher fontes:</strong> cadastros internos, associações setoriais, fabricantes, referências verificáveis e busca web crítica.</li><li><strong>Passo 3 — criar matriz:</strong> fornecedor × conformidade técnica × capacidade × prazo × atendimento × evidência × status.</li><li><strong>Passo 4 — validar:</strong> solicitar ficha técnica, amostra, proposta formal e documentos previstos no processo.</li><li><strong>Passo 5 — selecionar para cotação:</strong> convidar quem atende aos mínimos e registrar justificativas.</li></ol><p class="mb-0"><strong>Resultado gerencial:</strong> a VETTA cria uma lista curta auditável, pronta para cotação e teste, sem tratar resultado de busca como prova.</p>`,
    mentor: [['Fernanda','“Pesquisa boa registra também o que ainda não foi confirmado.”'],['Renata','“Vou separar fonte consultada, evidência recebida e validação pendente.”'],['Fernanda','“Ótimo: organização de dados e gestão de tempo tornam a pesquisa útil para compras.”']],
    tips: ['Registre data e origem de cada evidência.','Teste amostras críticas antes de ampliar o pedido.','Evite depender de um único fornecedor sem análise de risco.'],
    research: ['associações e catálogos do setor de suprimentos','conteúdos do SEBRAE sobre seleção de fornecedores','“supplier qualification best practices” em fontes acadêmicas e profissionais'],
    prompt: 'Crie comigo uma matriz de pesquisa para fornecedores de etiquetas resistentes à umidade. Faça perguntas antes de sugerir critérios, diferencie evidência de alegação e inclua fonte e data de verificação.',
    ai: 'A IA pode ampliar critérios e organizar resultados, mas não comprova existência, situação cadastral, capacidade técnica ou desempenho de uma empresa.',
    closing: 'A pesquisa fornece dados reais para estimar prazos e riscos no PI. O produto da aula é um processo reutilizável, não apenas uma lista de nomes.'
  },
  {
    n: 7, title: 'Classificação de Bens Patrimoniais', hours: '3,5h', indicator: 'Indicador 4', bloom: 'Lembrar', spiral: 'revisão estruturada',
    objective: 'Classificar e organizar bens patrimoniais conforme normas de controle.',
    chat: [
      ['👩🏽','Renata Aquino','19:03','Chegaram bens do novo setor e preciso cadastrá-los sem repetir os erros encontrados no inventário.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:05','Preparei etiquetas com QR Code, mas percebi que tecnologia não corrige uma classe ou localização errada.'],
      ['👨🏽‍💼','Otávio Ferraz','19:07','Vamos revisar os critérios e montar uma sequência de conferência antes da etiqueta.']
    ],
    question: 'Qual sequência de controle garante que cada bem seja classificado, cadastrado e etiquetado corretamente?',
    theory: [
      ['Revisão dos conceitos','Identificar é distinguir o item; classificar é atribuí-lo a categorias; cadastrar é registrar atributos; etiquetar é ligar fisicamente o bem ao identificador. As ações são relacionadas, mas não iguais.'],
      ['Campos essenciais','Identificação, descrição padronizada, grupo, marca/modelo/série quando aplicável, documento e data de aquisição, valor, localização, responsável e estado.'],
      ['Normas de controle','O procedimento interno define sequência, aprovações, formato do código, eventos de movimentação e critérios de baixa. Ele deve ser consultado sempre que houver exceção.'],
      ['Qualidade do dado','Completude, exatidão, consistência e atualidade tornam o cadastro útil para inventários e relatórios.']
    ],
    resolution: `<ol><li><strong>Passo 1 — conferir recebimento:</strong> confrontar bem, documento e especificação.</li><li><strong>Passo 2 — identificar natureza:</strong> aplicar critérios e procedimento interno.</li><li><strong>Passo 3 — atribuir código:</strong> gerar identificador único sem significado que fique obsoleto.</li><li><strong>Passo 4 — cadastrar:</strong> preencher campos obrigatórios e validar série duplicada.</li><li><strong>Passo 5 — etiquetar:</strong> posicionar, testar leitura e registrar localização/responsável.</li><li><strong>Passo 6 — revisar:</strong> outra pessoa confere amostra ou lote conforme o controle definido.</li></ol><p class="mb-0"><strong>Resultado gerencial:</strong> a sequência reduz cadastros incompletos e permite inventário rastreável.</p>`,
    mentor: [['Otávio','“A etiqueta é a ponta visível de um cadastro confiável.”'],['Renata','“Vou conferir o documento e a série antes de fixá-la.”'],['Otávio','“Zelo e colaboração na dupla conferência preservam o patrimônio.”']],
    tips: ['Use descrição que outra pessoa consiga reconhecer.','Valide duplicidade de número de série.','Registre exceções e quem as autorizou.'],
    research: ['manuais de cadastramento patrimonial de instituições públicas','“qualidade de dados cadastrais” em fontes de gestão da informação','princípios da família ISO 55000 em fontes oficiais'],
    prompt: 'Transforme estes campos patrimoniais em um checklist de conferência. Explique a finalidade de cada campo e destaque o que depende da regra interna. Não preencha dados ausentes por suposição.',
    ai: 'A IA pode produzir checklists e detectar inconsistências textuais. Ela não deve criar série, localização, valor ou responsável ausentes.',
    closing: 'Cadastros consistentes dão confiança aos relatórios e evitam reposição baseada em duplicidades. Essa revisão prepara a aplicação integrada da Aula 9.'
  },
  {
    n: 8, title: 'Elaboração de Relatórios de Bens', hours: '3,5h', indicator: 'Indicador 5', bloom: 'Compreender', spiral: '1ª abordagem',
    objective: 'Auxiliar na elaboração de relatórios de bens patrimoniais conforme necessidades dos clientes internos.',
    chat: [
      ['👩🏽','Renata Aquino','19:02','A diretoria pediu “um relatório do patrimônio”, mas não informou que decisão precisa tomar.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:04','Consigo criar gráficos em segundos, porém posso destacar a métrica errada.'],
      ['👨🏽‍💼','Otávio Ferraz','19:06','Primeiro entendemos o cliente interno, o período e a decisão. Depois escolhemos dados e apresentação.']
    ],
    question: 'Como transformar registros patrimoniais em um relatório claro, verificável e útil para o cliente interno?',
    theory: [
      ['Finalidade e público','Relatório gerencial responde a uma necessidade definida. Diretoria, manutenção e responsáveis de setor podem precisar de recortes, linguagem e nível de detalhe diferentes.'],
      ['Estrutura','Identificação, objetivo, escopo/período, fonte e data de extração, critérios, síntese, achados, detalhamento, pendências e recomendações.'],
      ['Indicadores e evidências','Quantidades por situação, localização, estado, divergência e movimentação podem apoiar decisões. Todo total deve ser reconciliável com a base.'],
      ['Clareza e proteção','Tabelas e gráficos precisam de título, unidade, período e fonte. Inclua somente dados pessoais necessários e aplique o procedimento de acesso da organização.']
    ],
    resolution: `<p><strong>Solicitação refinada:</strong> a diretoria quer decidir prioridades de manutenção para o próximo mês.</p><ol><li><strong>Passo 1 — definir escopo:</strong> bens ativos, todas as unidades, posição em 31/08.</li><li><strong>Passo 2 — selecionar campos:</strong> grupo, localização, estado, última inspeção, chamado aberto e custo estimado disponível.</li><li><strong>Passo 3 — validar:</strong> remover duplicidades justificadamente, conferir totais e listar registros incompletos.</li><li><strong>Passo 4 — sintetizar:</strong> apresentar total inspecionado, quantidade por estado e itens críticos com evidência.</li><li><strong>Passo 5 — recomendar:</strong> priorizar inspeção das pendências e manutenção conforme risco e procedimento.</li></ol><p class="mb-0"><strong>Resultado gerencial:</strong> o relatório passa de inventário genérico a instrumento de decisão, com limitações transparentes.</p>`,
    mentor: [['Otávio','“Um relatório começa com uma pergunta de gestão, não com um gráfico.”'],['Renata','“Vou confirmar objetivo, período e público antes de extrair.”'],['Otávio','“Comunicação clara e responsabilidade com os dados aumentam a confiança do cliente interno.”']],
    tips: ['Apresente data de corte e fonte dos dados.','Separe fato, interpretação e recomendação.','Revise totais e filtros antes de enviar.'],
    research: ['“relatório gerencial patrimônio” em manuais institucionais','boas práticas de visualização de dados em fontes acadêmicas','modelos de inventário patrimonial de órgãos públicos'],
    prompt: 'Ajude-me a planejar um relatório para priorizar manutenção patrimonial. Pergunte sobre público, decisão, período e dados. Proponha uma estrutura e uma lista de validações, sem inventar resultados.',
    ai: 'A IA ajuda a adaptar linguagem, estrutura e revisão. Totais, evidências, sigilo e recomendações precisam ser validados por quem responde pelo processo.',
    closing: 'Relatórios conectam registros ao planejamento de recursos. No PI, a mesma disciplina ajuda a comunicar níveis de estoque, riscos e propostas de reposição.'
  },
  {
    n: 9, title: 'Controle de Bens Patrimoniais — Aplicação Integrada', hours: '3,5h', indicator: 'Indicador 1', bloom: 'Aplicar / Analisar', spiral: 'aplicação integrada',
    objective: 'Identificar e classificar bens patrimoniais, organizando a movimentação e o inventário de forma eficiente.',
    chat: [
      ['👩🏽','Renata Aquino','19:01','O inventário encontrou 12 leitores de código, mas três estão em manutenção e dois foram transferidos sem atualização.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:03','O consumo de peças também variou. Dá para calcular quando repor sem misturar equipamento e peça?'],
      ['👨🏽‍💼','Otávio Ferraz','19:05','Sim. Conciliamos os bens individualmente e calculamos ponto de pedido para a peça estocável com dados de consumo e prazo.']
    ],
    question: 'Como integrar inventário, movimentação e reposição de peças para manter os equipamentos disponíveis?',
    theory: [
      ['Tipos e etapas do inventário','Inventários podem ser gerais, rotativos ou direcionados, conforme planejamento interno. Preparar base e equipes, contar, reconciliar, apurar, ajustar com autorização e relatar são etapas fundamentais.'],
      ['Conciliação','Diferença não é automaticamente perda. Pode representar movimentação não lançada, erro de identificação, item em manutenção, duplicidade ou ocorrência que exige apuração.'],
      ['Ponto de pedido','O PP sinaliza quando iniciar a reposição: consumo médio no período multiplicado pelo tempo de reposição, somado ao estoque de segurança. Unidades de tempo devem ser compatíveis.'],
      ['Estoque de segurança simplificado','ES = (consumo máximo − consumo médio) × tempo de reposição. O modelo simplificado depende da qualidade do histórico e deve ser revisto quando consumo ou lead time mudam.']
    ],
    resolution: `<div class="table-responsive"><table class="table data-table"><tbody><tr><th>Peça</th><td>Cabeça de leitura</td></tr><tr><th>Consumo médio</th><td>4 unidades/semana</td></tr><tr><th>Consumo máximo</th><td>7 unidades/semana</td></tr><tr><th>Lead time</th><td>2 semanas</td></tr><tr><th>Saldo atual</th><td>15 unidades</td></tr></tbody></table></div><p><span class="step-number">1</span><strong>Conciliar bens:</strong> confirmar 7 em uso, 3 em manutenção e 2 transferidos; atualizar eventos com evidência e responsável.</p><p><span class="step-number">2</span><strong>Calcular ES:</strong> (7 − 4) × 2 = 6 unidades.</p><p><span class="step-number">3</span><strong>Calcular PP:</strong> (4 × 2) + 6 = 14 unidades.</p><p><span class="step-number">4</span><strong>Comparar:</strong> saldo de 15 está uma unidade acima do PP. A equipe monitora; ao atingir 14, inicia a reposição conforme a política.</p><p class="mb-0"><strong>Interpretação:</strong> o ponto de pedido protege o consumo esperado durante as duas semanas e adiciona seis unidades para a variação observada.</p>`,
    formulas: ['ES = (Consumo máximo − Consumo médio) × Tempo de reposição','PP = (Consumo médio no período × Tempo de reposição/lead time) + Estoque de Segurança'],
    mentor: [['Otávio','“Equipamento em manutenção não está perdido; precisa estar no evento e local corretos.”'],['Renata','“E vou manter semana com semana no cálculo, sem misturar dias.”'],['Otávio','“Essa visão sistêmica conecta patrimônio, manutenção, compras e almoxarifado.”']],
    tips: ['Congele ou registre a base usada na contagem.','Apure divergências antes de ajustar saldos.','Revise consumo e lead time periodicamente.'],
    research: ['manuais de inventário patrimonial de órgãos públicos','“ponto de pedido estoque de segurança” em livros de logística','princípios de gestão de ativos da família ISO 55000'],
    prompt: 'Confira meu ponto de pedido. Antes de calcular, verifique se consumo e lead time usam a mesma unidade. Mostre ES e PP separadamente, interprete o resultado e liste dados que precisam de validação.',
    ai: 'A IA pode conferir unidade, fórmula e cenários. Ela não confirma saldo físico, movimentações, lead time real ou adequação do modelo ao risco da operação.',
    closing: 'Esta aplicação integrada aproxima o PI da operação real: disponibilidade depende tanto do cadastro dos bens quanto da reposição planejada das peças.'
  },
  {
    n: 10, title: 'Aquisição de Materiais e Fornecedores', hours: '3,5h', indicator: 'Indicador 2', bloom: 'Analisar', spiral: 'aplicação integrada',
    objective: 'Realizar pesquisa com fornecedores e elaborar proposta de aquisição conforme requisitos estabelecidos.',
    chat: [
      ['👩🏻‍💼','Fernanda Lopes','19:00','A demanda anual do material crítico cresceu. A diretoria quer uma proposta que considere preço, prazo e frequência de pedidos.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:02','O fornecedor oferece desconto em lote grande, mas isso aumenta custo de armazenagem.'],
      ['👩🏽','Renata Aquino','19:04','Podemos usar o lote econômico como referência e analisar as condições reais antes de recomendar.']
    ],
    question: 'Qual lote equilibra custo de pedir e custo de manter estoque, e como integrá-lo à proposta de aquisição?',
    theory: [
      ['Proposta de aquisição','Consolida necessidade, especificação, quantidade, justificativa, pesquisa, comparação, riscos, orçamento e recomendação. Precisa explicitar premissas.'],
      ['Modelo de Wilson (EOQ)','Estima o lote que equilibra custo fixo de pedidos e custo anual de manutenção, sob premissas simplificadas como demanda conhecida e reposição estável.'],
      ['Análise além do modelo','Embalagem mínima, validade, capacidade, desconto, fluxo de caixa, criticidade e lead time podem justificar arredondamento ou decisão diferente.'],
      ['Governança','A recomendação deve seguir alçadas e procedimentos de compras, com propostas e validações anexadas.']
    ],
    resolution: `<div class="table-responsive"><table class="table data-table"><tbody><tr><th>Demanda anual (D)</th><td>4.800 unidades</td></tr><tr><th>Custo por pedido (S)</th><td>R$ 75,00</td></tr><tr><th>Manutenção unitária/ano (H)</th><td>R$ 6,00</td></tr></tbody></table></div><p><span class="step-number">1</span><strong>Aplicar:</strong> Q* = √((2 × D × S) ÷ H).</p><p><span class="step-number">2</span><strong>Substituir:</strong> Q* = √((2 × 4.800 × 75) ÷ 6) = √120.000.</p><p><span class="step-number">3</span><strong>Resultado:</strong> Q* ≈ 346,41 unidades; referência prática de 346 unidades.</p><p><span class="step-number">4</span><strong>Analisar:</strong> se a embalagem for 25 unidades, comparar 350 unidades com alternativas próximas; validar espaço, validade, caixa e ponto de pedido.</p><p class="mb-0"><strong>Interpretação:</strong> cerca de 346 unidades minimizam os custos considerados pelo modelo; não é uma ordem automática de compra.</p>`,
    formulas: ['Q* = √((2 × D × S) ÷ H)','D = demanda anual; S = custo fixo por pedido; H = custo de manutenção unitário/ano'],
    mentor: [['Fernanda','“O cálculo é referência para negociar, não substituto da análise comercial.”'],['Renata','“Vou registrar premissas e simular o múltiplo de embalagem mais próximo.”'],['Fernanda','“Assim você negocia com dados e assume responsabilidade pela recomendação.”']],
    tips: ['Documente como D, S e H foram estimados.','Compare cenários próximos ao EOQ.','Recalcule quando demanda ou custos mudarem.'],
    research: ['“modelo de Wilson lote econômico de compra” em livros de operações','conteúdos do SEBRAE sobre planejamento de compras','boas práticas de custo total de aquisição'],
    prompt: 'Calcule o EOQ com D, S e H que fornecerei. Antes, confirme unidades e período. Mostre fórmula, substituição, raiz e arredondamento; depois liste premissas e fatores comerciais não cobertos.',
    ai: 'A IA pode calcular e testar cenários. Custos, demanda, embalagem, capacidade e condições do fornecedor devem ser comprovados antes da decisão.',
    closing: 'A proposta une pesquisa de fornecedores e política de reposição do PI. Ela mostra que quantidade de compra é uma decisão econômica e operacional.'
  },
  {
    n: 11, title: 'Elaboração de Relatórios Patrimoniais', hours: '3,5h', indicator: 'Indicador 5', bloom: 'Avaliar', spiral: 'aplicação integrada',
    objective: 'Auxiliar na elaboração de relatórios de bens patrimoniais conforme necessidades dos clientes internos.',
    chat: [
      ['👩🏽','Renata Aquino','19:01','Chegamos ao fechamento da UC. Preciso entregar um relatório que reúna inventário, divergências e recomendações.'],
      ['🧑🏻‍💻','Diego Bittencourt','19:03','A planilha tem muitos filtros. Posso resumir com IA, desde que os totais e dados sensíveis sejam controlados.'],
      ['👨🏽‍💼','Otávio Ferraz','19:05','Vamos avaliar a evidência, explicitar limitações e construir uma conclusão que o cliente interno consiga executar.']
    ],
    question: 'Como avaliar a qualidade dos dados e produzir um relatório patrimonial final que sustente decisões?',
    theory: [
      ['Avaliação da base','Antes do relatório, teste completude, duplicidade, consistência, atualidade e reconciliação com a contagem. Registre critérios de tratamento.'],
      ['Trilha de auditoria','Fonte, data de extração, filtros, versão, autor, revisores e ajustes autorizados permitem reproduzir o resultado.'],
      ['Conclusão gerencial','Uma boa conclusão responde ao objetivo, prioriza achados por impacto/urgência, distingue evidência de hipótese e atribui ação, responsável e prazo.'],
      ['Limitações','Registros sem etiqueta, setores não contados ou valores pendentes precisam aparecer. Transparência evita falsa precisão.']
    ],
    resolution: `<p><strong>Base:</strong> 240 registros; 232 localizados; 5 transferências sem atualização; 3 itens não localizados; 18 estados de conservação em branco.</p><ol><li><strong>Passo 1 — reconciliar:</strong> 232 ÷ 240 × 100 = 96,67% localizados.</li><li><strong>Passo 2 — separar ocorrências:</strong> transferências documentáveis não são tratadas automaticamente como ausência definitiva.</li><li><strong>Passo 3 — avaliar qualidade:</strong> 18 campos em branco limitam a priorização de manutenção.</li><li><strong>Passo 4 — recomendar:</strong> regularizar 5 transferências; apurar 3 não localizados; inspecionar/preencher 18 estados; definir responsáveis e prazos.</li><li><strong>Passo 5 — revisar:</strong> conferir totais, anexar critérios e obter validação do supervisor.</li></ol><p class="mb-0"><strong>Resultado gerencial:</strong> o relatório comunica 96,67% de localização, sem esconder pendências, e converte achados em plano de ação.</p>`,
    formulas: ['Percentual localizado = bens localizados ÷ registros esperados × 100'],
    mentor: [['Otávio','“Avaliar não é esconder erro; é medir a confiança e explicar o impacto.”'],['Renata','“Vou separar correção cadastral, apuração e manutenção, com responsáveis.”'],['Otávio','“Clareza, colaboração e cumprimento de prazos fecham o ciclo profissional.”']],
    tips: ['Inclua resumo executivo e detalhamento rastreável.','Atribua ação, responsável e prazo às recomendações.','Preserve versão e evidências da base analisada.'],
    research: ['modelos de relatório de inventário patrimonial em órgãos públicos','boas práticas de qualidade e governança de dados','princípios da ISO 55000 para informação sobre ativos'],
    prompt: 'Revise a estrutura do meu relatório patrimonial. Confira se objetivo, escopo, fonte, achados, limitações e plano de ação estão claros. Não invente totais; sinalize afirmações sem evidência.',
    ai: 'A IA pode melhorar clareza e consistência, desde que se usem dados autorizados e minimizados. A revisão humana confirma números, contexto, sigilo e responsabilidade.',
    closing: 'O relatório final fecha o ciclo da UC: dados de materiais e patrimônio sustentam ações. No PI, a mesma lógica transforma cálculos de estoque e reposição em proposta comunicável.'
  }
];

