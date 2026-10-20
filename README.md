# Site-caderno — UC 9 Gestão de Materiais e Patrimônio

Material de estudo da turma ADM N-33 do curso Técnico em Administração.

Ao longo de 11 aulas, você acompanhará a equipe da empresa fictícia VETTA em situações envolvendo estoques, fornecedores, movimentação de bens, inventário e relatórios patrimoniais.

## Como começar

Abra [`index.html`](index.html) no navegador e selecione uma aula no mapa da trilha.

Não é necessário instalar programas ou criar uma conta. O site também pode ser aberto diretamente pelo celular, computador ou endereço publicado pelo docente.

## O que você encontrará

- 11 aulas com fundamentação teórica, situações práticas e resoluções comentadas.
- 6 atividades por aula, totalizando 66 atividades.
- Calculadoras de Curva ABC, Kardex PEPS, ponto de pedido, estoque de segurança, estoque máximo, giro, cobertura, EOQ e depreciação, com exemplos completos de reposição contínua e periódica.
- Um guia passo a passo para montar a calculadora de reposição contínua no Excel ([`excel.html`](excel.html)).
- O **[Laboratório do Case VETTA](recursos/laboratorio-vetta/index.html)**: uma aplicação interativa à parte que percorre o case completo (Curva ABC, LEC/SS/PP, indicadores de estoque, seleção de fornecedores, patrimônio e relatório gerencial) com simulações, gráficos e exportação de planilha Excel real — é a prática integrada ligada a partir das Aulas 9, 10 e 11 (ver [`recursos/laboratorio-vetta/README.md`](recursos/laboratorio-vetta/README.md) para detalhes técnicos desse módulo).
- Glossário de termos técnicos.
- Guia para uso responsável de inteligência artificial nos estudos.
- Conexões entre cada aula e o Projeto Integrador.

## Como estudar

1. Leia a conversa inicial da equipe VETTA e identifique a pergunta-problema.
2. Estude a fundamentação e acompanhe a resolução passo a passo.
3. Refaça os cálculos manualmente antes de usar as calculadoras.
4. Resolva as seis atividades da aula e registre seu raciocínio.
5. Compare suas conclusões com os colegas ou converse com o docente.
6. Marque a aula como concluída para acompanhar seu progresso.

## Progresso e privacidade

As aulas e atividades concluídas ficam armazenadas somente no navegador utilizado. Nenhuma resposta é enviada para um servidor.

Se os dados do navegador forem apagados ou se você trocar de aparelho, as marcações de progresso poderão ser perdidas. Os textos digitados nos campos de resposta não são salvos automaticamente; registre respostas importantes também em seu caderno ou arquivo pessoal.

## Acessibilidade

O cabeçalho oferece:

- Tema claro ou escuro.
- Modo de alto contraste.
- Controles para aumentar ou diminuir o texto.
- Navegação por teclado.
- Versão amigável para impressão.

## Uso com ou sem internet

O conteúdo principal, as atividades, as calculadoras e o progresso funcionam quando o site é aberto localmente. Bootstrap 5 e as fontes são carregados pela internet; sem conexão, alguns detalhes visuais podem ficar simplificados, mas o material continua legível.

## Estrutura de arquivos

```text
./
├── index.html                      ← página inicial (trilha das 11 aulas)
├── excel.html                      ← guia passo a passo: calculadora de reposição no Excel
├── aulas/aula-01.html … aula-11.html
├── exercicios/exercicios-aula-01.html … aula-11.html
├── components/                     ← referência dos componentes injetados por assets/js/main.js
├── recursos/
│   ├── calculadoras.html            ← calculadoras comentadas (ABC, Kardex, PP/ES, giro, EOQ, depreciação)
│   ├── glossario.html
│   ├── como-usar-ia.html
│   ├── escolha-fornecedores.html
│   └── laboratorio-vetta/           ← aplicação interativa à parte (SPA) com o case completo
└── assets/
    ├── css/theme.css
    └── js/
        ├── main.js                  ← navbar/footer, tema, acessibilidade (injetados via JS)
        ├── progresso.js             ← progresso das aulas em localStorage
        ├── lesson-data.js / lesson-renderer.js   ← conteúdo e renderização das aulas
        ├── exercise-data.js / exercise-renderer.js
        └── calculadoras.js
```

## Publicação no GitHub Pages

Não há passo de build: faça commit desta pasta como raiz do repositório e ative o GitHub Pages apontando para a branch/pasta raiz. O Laboratório do Case VETTA em `recursos/laboratorio-vetta/` é totalmente auto-contido (seus próprios `assets/`, `data/`, `docs/`, `tests/`) e sobe junto, sem nenhuma configuração adicional.

Bom estudo!
