# VETTA EDU | Operação Reposição Inteligente

> Este módulo é o **Laboratório do Case VETTA**: uma aplicação interativa à parte,
> incorporada como recurso dentro do site-caderno principal da UC 9
> (`../../index.html`). É linkado a partir do menu "Recursos" e das Aulas 9, 10 e
> 11 ("aplicação integrada"). Funciona de forma independente — pode ser aberto
> diretamente por `recursos/laboratorio-vetta/index.html` sem depender do restante
> do site.

Plataforma educacional baseada no **Case VETTA** (Senac Guarulhos — Técnico em
Administração, Turma ADM N33, UC 9: Gestão de Materiais e Patrimônio). Ensina curva
ABC, política de reposição (LEC/SS/PP), indicadores de estoque, seleção de
fornecedores, gestão patrimonial e relatório gerencial, com cálculos explicados
passo a passo, simulações interativas e geração de planilha Excel real.

## 1. Objetivo e público-alvo

Estudantes do Técnico em Administração (UC 9) que precisam compreender — não só
decorar — como calcular e interpretar os indicadores de gestão de materiais e
patrimônio usados no case, e como reproduzi-los no Microsoft Excel 365.

## 2. Tecnologias utilizadas

- HTML5 + CSS3 (sem framework de build; abra `index.html` diretamente).
- JavaScript ES6+ puro (sem React/Vue — um roteador hash simples em `app.js`).
- Bootstrap 5 e Bootstrap Icons (via CDN).
- Chart.js (via CDN) para os gráficos.
- `xlsx-js-style` (fork do SheetJS com suporte a estilo de célula, via CDN) para
  gerar a planilha `.xlsx` real **no navegador**, com cores e fórmulas vivas, sem
  precisar de Node.js ou de um backend.
- Google Fonts (Inter).

**Decisão de arquitetura:** o prompt mestre original sugeria um passo de build com
Node.js (ExcelJS) para gerar a planilha. Esta implementação usa **SheetJS
carregado por CDN e executado no navegador**, para que o site funcione inteiramente
abrindo `index.html`, sem `npm install` nem passo de build algum. Essa troca foi
combinada explicitamente antes do desenvolvimento.

## 3. Estrutura de arquivos

```text
recursos/laboratorio-vetta/     ← este módulo, dentro do repositório principal da UC 9
├── index.html                  ← ponto de entrada único (abra este arquivo)
├── data/
│   └── case.json                ← cópia de referência dos dados do case (documentação)
├── assets/
│   ├── css/styles.css           ← tema visual (paleta extraída do Guia do Docente)
│   └── js/
│       ├── data.js              ← FONTE ÚNICA dos dados do case (usada em runtime)
│       ├── calculations.js      ← FONTE ÚNICA das fórmulas (funções puras)
│       ├── components.js        ← componentes de UI reutilizáveis
│       ├── charts.js            ← fábricas de gráficos Chart.js
│       ├── excel-export.js      ← gera o .xlsx real no navegador (SheetJS)
│       ├── prompts-data.js      ← biblioteca de prompts (18 prompts)
│       ├── app.js               ← roteador hash + navegação + progresso
│       └── views/*.js           ← uma view por página (home, etapa1..6, etc.)
├── docs/
│   ├── mapeamento-case.md       ← PDF → implementação, questão por questão
│   └── auditoria-calculos.md    ← auditoria de precisão/arredondamento
├── tests/
│   └── calculations.test.js     ← 17 testes contra o gabarito (zero dependências)
└── downloads/                   ← pasta reservada para builds exportados manualmente
```

## 4. Como executar localmente (Windows 11, sem privilégios de administrador)

Não há passo de build. Duas formas de abrir:

1. **Mais simples:** dê duplo clique em `index.html` (abre no navegador padrão via
   `file://`). Toda a aplicação funciona offline, exceto os ícones/fontes/
   bibliotecas carregados por CDN (Bootstrap, Chart.js, SheetJS), que exigem
   internet na primeira carga.
2. **Com servidor local (opcional, recomendado para evitar particularidades de
   `file://` em alguns navegadores):** no VS Code, clique com o botão direito em
   `index.html` → "Open with Live Server" (extensão Live Server), ou rode, em um
   terminal, dentro da pasta do projeto:
   ```powershell
   npx --yes serve .
   ```
   e abra o endereço local que aparecer (ex.: http://localhost:3000).

## 5. Rodando os testes

```powershell
node tests/calculations.test.js
```
Não exige `npm install` — o script usa apenas módulos nativos do Node.js.

## 6. Gerando a planilha Excel

Na navegação, abra **Downloads e Materiais**. Há dois botões, lado a lado:

- **Versão Exercício** (`VETTA_Gestao_Materiais_Patrimonio_Exercicio_Excel365.xlsx`) —
  a aba "Curva ABC" vem com as colunas "% acumulado" e "Classe" em branco, para o
  aluno ordenar os itens e calcular na mão, como no case original.
- **Versão Gabarito** (`VETTA_Gestao_Materiais_Patrimonio_Gabarito_Excel365.xlsx`) —
  a mesma planilha com a Curva ABC já ordenada e resolvida por fórmula, para
  conferência do professor ou autoavaliação do aluno.

Ambas são geradas pela mesma função `construirX()` de `assets/js/excel-export.js`
(parametrizada por `modo: "exercicio" | "gabarito"`), para que os dados e fórmulas
nunca fiquem divergentes entre as duas versões. O arquivo é gerado inteiramente no
seu navegador (nenhum dado é enviado a um servidor) e contém 12 abas com fórmulas
reais e vinculadas entre si — altere um valor na aba "Parâmetros" e as demais abas
recalculam ao abrir no Excel. As cores de preenchimento das células reaproveitam a
paleta visual do site (azul = dado de entrada, verde = resultado calculado, laranja
= alerta ou ponto a preencher na versão Exercício).

## 7. Atualizando os conteúdos

- **Dados do case:** edite `assets/js/data.js` (e, por documentação, replique a
  mudança em `data/case.json`). Todas as views e a planilha exportada leem
  automaticamente da mesma fonte — não há números fixos espalhados pelo código das
  views além de textos explicativos.
- **Fórmulas:** edite `assets/js/calculations.js`. Toda função é pura (recebe
  parâmetros, devolve um valor) para facilitar testes e reutilização.
- **Novos prompts:** adicione um objeto ao array em `assets/js/prompts-data.js`.
- **Novas abas na planilha exportada:** adicione uma função `construirX()` em
  `assets/js/excel-export.js` e registre-a em `gerarWorkbook()`.

## 8. Limitações conhecidas

- O PDF original (`casedocente.pdf`) não está incluído neste repositório — é
  material de uso exclusivo do(a) docente, com gabarito; o conteúdo foi extraído e
  adaptado para apresentação ao estudante (ver `docs/mapeamento-case.md`).
- A grade do "Laboratório Excel" é uma **simulação em JavaScript** para fins
  didáticos — ela não recalcula com um motor real do Excel. A planilha baixada em
  "Downloads", essa sim, tem fórmulas reais e editáveis.
- O agente **VETTA-IA** é um link para um agente Microsoft Copilot que exige conta
  institucional (M365) — não há acesso público irrestrito, e esta plataforma não
  reimplementa nem simula esse agente.
- O "Manual de fórmulas" é oferecido como página imprimível (Ctrl+P / "Salvar como
  PDF") em vez de um arquivo `.pdf` pré-gerado, já que a geração não usa um passo
  de build com Node.
- Sem backend: progresso do aluno e rascunho do relatório da Etapa 6 são salvos em
  `localStorage` do navegador (por dispositivo/navegador, não sincronizado).

## 9. Publicação

Este módulo é publicado junto com o repositório principal da UC 9 (ver README na
raiz do repositório). Como não há passo de build, basta que a raiz do repositório
seja servida como estática (GitHub Pages, Netlify, Vercel, IIS/Apache) — este
laboratório fica automaticamente acessível em `recursos/laboratorio-vetta/`.

---
Conteúdo didático adaptado do Guia do Docente do Case VETTA para uso em sala de
aula. Não substitui a orientação do(a) professor(a) responsável pela UC 9.
