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

## Decisões

- A branch `migracao-react-ts` acompanha as fases descritas no briefing.
- A estrutura original foi preservada em `legado/`; os estilos e imagens foram copiados para a nova aplicação.
- A implementação de páginas e regras acontecerá em fases para permitir comparação com o comportamento anterior.
