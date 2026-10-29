# Quizio

Quizio é um quiz de conhecimentos gerais 100% frontend. As partidas, o perfil e o progresso ficam no navegador; não há conta, servidor, ranking online nem multiplayer online. A versão nova usa React, TypeScript estrito, Vite e React Router.

## Rodar e validar

```sh
npm install
npm run dev
```

Comandos de qualidade:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run auditar-perguntas
```

## Estrutura

- `src/app`: rotas, foco de navegação e preferências globais
- `src/paginas`, `src/componentes`: telas e interface React
- `src/dados`: categorias, modos, missões, conquistas e perguntas
- `src/servicos`: armazenamento, partida, progresso, desafio, som e backup
- `src/utilitarios`: pontuação, nível, datas, sequência e sorteio
- `src/config/recompensas.ts`: economia, marcos, itens e missões semanais
- `src/estilos`: CSS original migrado e estilos das telas React
- `public`: imagens opcionais, identidade, ícones e recursos do PWA
- `legado`: aplicação original, mantida para comparação até terminar a verificação manual de paridade

## Regras principais

Pontos por acerto: 100 fácil, 150 médio e 200 difícil. Combo começa no terceiro acerto seguido (+10) e limita em +50. Contra o tempo concede até +50 conforme a fração restante em passos de 5. O XP por acerto é 5/8/12; concluir cinco ou mais perguntas dá +10 XP e uma partida perfeita com cinco ou mais dá +25 XP. O desafio diário concede +50 XP uma vez por data local.

O modo Clássico permite pausa e pulos limitados. Contra o tempo usa 20 segundos por pergunta. Sobrevivência termina no primeiro erro e usa todas as perguntas selecionadas. O desafio diário usa cinco perguntas determinísticas por data. Duelo é local, no mesmo aparelho. Treino usa somente as perguntas erradas do resultado. O motor e o progresso ficam em módulos puros e o estado em andamento usa `sessionStorage`.

## Economia local

Os valores estão centralizados em `src/config/recompensas.ts`. Cada acerto rende 1/2/3 moedas por dificuldade; missões diárias rendem 8 moedas, semanais 20, desafio diário 10 e concluir as seis missões diárias abre o baú com 25 moedas. Marcos de sequência pagam uma vez por sequência: 3 dias (+15 XP/10 moedas), 7 (+35/25), 14 (+75/50) e 30 (+180/100). Ao quebrar a sequência, os marcos da sequência seguinte recomeçam; o recorde de dias continua salvo. Moedas e itens são cosméticos, sem compra com dinheiro. O saldo, itens equipados, medalhas e baú são salvos localmente.

As recompensas são registradas dentro da mesma transação idempotente da partida. A chave continua `quizio:v1`; os dados agora usam `versao: 5`, com migração automática dos formatos anteriores e backup `quizio:v1:pre-v5` antes da migração. Importar um arquivo cria `quizio:v1:pre-import` antes de substituir os dados.

## Perguntas: acrescentar conteúdo

Cada categoria tem um arquivo `src/dados/perguntas/<id>.ts`. O cabeçalho informa prefixo e próximo id livre. Meta final: 50 itens por categoria — 17 fáceis, 17 médias e 16 difíceis. O banco atual tem 415 perguntas válidas e distintas; as faltantes são avisos porque o projeto não deve inventar perguntas. Para adicionar uma, siga o modelo comentado no arquivo, use o id seguinte e forneça quatro alternativas distintas e uma explicação educativa curta. Depois execute `npm run auditar-perguntas`.

O script de migração encontrou 525 registros físicos no legado: 110 ids estavam repetidos de forma idêntica em arquivos de categoria e `expansoes.js`. O banco novo preserva uma ocorrência de cada id. Também corrige a comparação de alternativas que rejeitava `te-013` ao remover pontuação dos textos. O relatório por categoria mostra totais, divisão por dificuldade, ids seguintes e problemas.

## Identidade e dependências

`public/previa-logos.html` mostra três opções; a opção 1 está ativa no componente `Logo` e em `public/favicon.svg`. Para regenerar favicon PNG, Apple touch icon, ícones PWA e Open Graph a partir dos SVGs, rode `npm run exportar-identidade`. `npm run otimizar-capas` recria as capas JPEG até 1200 px de largura e qualidade 78, usando os originais preservados em `legado/`; as 23 imagens passaram de cerca de 76 MB para 2,3 MB. `sharp` é usado somente pelos scripts de imagem; `tsx` executa o auditor TypeScript. `vite-plugin-pwa` gera o manifest e service worker com Workbox, que inclui as capas otimizadas no precache. A interface usa `lucide-react`; não usa kits de UI, CSS-in-JS, Tailwind ou bibliotecas de animação.

## Publicar no Netlify

O site usa rotas de histórico. `public/_redirects` envia caminhos desconhecidos para `index.html`, permitindo recarregar `/explorar`, `/perfil` e as demais rotas. No Netlify, conecte o repositório e configure o comando de build `npm run build` e a pasta de publicação `dist`. O domínio raiz é a base padrão do Vite. O service worker é gerado no build e atualiza o cache assim que uma nova versão está disponível; os caches antigos são limpos.

Para testar a versão de produção localmente, rode `npm run build` e `npm run preview`. O service worker só é registrado em produção.

## Decisões e estado da migração

- A branch de trabalho é `migracao-react-ts`; a aplicação original foi movida para `legado/` e ainda não foi removida.
- A fase de perguntas (F5) foi antecipada para antes das telas completas, porque Início e Explorar precisavam dos dados migrados e auditáveis. A contagem do merge foi exibida pelo script e a ordem está registrada no histórico de commits.
- A validação feita até aqui inclui lint, typecheck, Vitest e build. O roteiro completo de navegação manual, Lighthouse, instalação/offline do PWA e comparação visual nos tamanhos 320, 375, 768, 1280, 1920 e 2560 px ainda precisa ser concluído antes de remover `legado/`.
- A captura de tela final e uma checklist de paridade preenchida devem ser adicionadas após essa revisão visual. Não use esta nota como declaração de aprovação Lighthouse ou de teste offline.
