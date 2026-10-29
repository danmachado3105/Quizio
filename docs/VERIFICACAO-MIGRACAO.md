# Verificação da migração

## Verificações executadas

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm test`: 9 arquivos, 34 testes aprovados.
- `npm run auditar-perguntas`: 415 perguntas válidas, 23 categorias, sem itens inválidos. O relatório mostra avisos de perguntas faltantes para completar 50 por tema.
- `npm run build`: passou e gerou `dist/sw.js`, `dist/manifest.webmanifest` e precache de 48 recursos (aprox. 3 MB).
- As 23 capas públicas foram otimizadas; os originais seguem em `legado/assets/images/categorias/`.

## Revisão manual pendente

Antes de remover `legado/`, comparar a experiência e preencher esta lista:

- [ ] Navegar por todas as rotas e confirmar ausência de erros no console.
- [ ] Jogar uma partida completa em Clássico, Contra o tempo, Sobrevivência, Diário e Duelo.
- [ ] Recarregar uma partida ativa, conferir pausa, relógio, revisão e treino.
- [ ] Conferir busca, filtros, gaveta, favoritos, roleta e retorno de foco pelo teclado.
- [ ] Verificar as larguras 320, 375, 768, 1280, 1920 e 2560 px, nomes longos e estados vazios.
- [ ] Conferir preferência de movimento reduzido, localStorage bloqueado e dados corrompidos.
- [ ] Instalar o PWA, testar uma partida offline e verificar a atualização após um novo build.
- [ ] Rodar Lighthouse e registrar os resultados; meta de acessibilidade: 95+ por página.
- [ ] Adicionar uma captura de tela da versão final revisada.

Esta lista não marca a revisão manual, o Lighthouse ou o teste offline como concluídos. O legado deve continuar preservado até esses itens serem verificados.
