# Quizio

Quizio é um site de quizzes de conhecimentos gerais. A migração para React, TypeScript e Vite está em andamento; o site anterior permanece em `legado/` como referência e paridade.

## Rodar localmente

```sh
npm install
npm run dev
```

## Estrutura

- `src/app`: entrada e rotas da aplicação
- `src/paginas`, `src/componentes`: interface
- `src/dados`: conteúdo estático
- `src/servicos`: persistência e regras de produto
- `src/utilitarios`: funções puras
- `src/estilos`: CSS portado do site anterior
- `legado/`: versão original, preservada durante a migração

## Banco de perguntas

Cada tema tem um arquivo em `src/dados/perguntas/<id>.ts`, com o cabeçalho contendo o prefixo, o próximo id e a meta 17/17/16. Para acrescentar conteúdo, o dono do projeto deve editar o arquivo da categoria, usar o próximo id indicado e manter o formato `{ id, categoria, dificuldade, enunciado, alternativas, correta, explicacao }`. Não reutilize ids ou enunciados. Rode `npm run auditar-perguntas`; as faltantes são avisos, e uma pergunta inválida faz o comando terminar com erro.

Na migração, havia 525 registros físicos porque 110 ids apareciam duas vezes entre os arquivos de categoria e `expansoes.js`. Depois de remover repetições idênticas e corrigir a comparação de alternativas com pontuação, o destino contém 415 perguntas válidas e 415 ids distintos. Os arquivos antigos seguem preservados em `legado/` até a checklist final.

O script `npm run exportar-identidade` gera os favicons PNG, os ícones de instalação e a imagem Open Graph a partir dos SVGs em `public/identidade/`. Ele usa `sharp` somente na etapa de exportação de arte; o app não usa bibliotecas de interface ou animação.

O comando `npm run auditar-perguntas` valida o banco e mostra a contagem por categoria e dificuldade. `tsx` é usado somente para executar esse auditor TypeScript no Node.

## Decisões

- A branch `migracao-react-ts` acompanha as fases descritas no briefing.
- A estrutura original foi preservada em `legado/`; os estilos e imagens foram copiados para a nova aplicação.
- A implementação de páginas e regras acontecerá em fases para permitir comparação com o comportamento anterior.
- A origem contém 525 registros físicos, pois `expansoes.js` repete 110 perguntas já presentes nos pacotes de categoria. A migração conserva uma cópia por id: 415 perguntas únicas. O validador anterior também rejeitava `te-013` porque tratava os símbolos `#`, `@`, `&` e `%` como texto vazio; a validação nova preserva pontuação ao comparar alternativas, então as quatro opções distintas passam.
