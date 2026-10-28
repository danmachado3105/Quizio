/*
 * Categoria: jogos
 * Prefixo: jg
 * Próximo id livre: jg-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'jg-999', categoria: 'jogos', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasJogos: Pergunta[] = [
  {
    "id": "jg-001",
    "categoria": "jogos",
    "dificuldade": "facil",
    "enunciado": "Qual é o nome do encanador mais famoso dos videogames, criado pela Nintendo?",
    "alternativas": [
      "Luigi",
      "Mario",
      "Wario",
      "Sonic"
    ],
    "correta": 1,
    "explicacao": "Mario é o mascote da Nintendo. Luigi é seu irmão."
  },
  {
    "id": "jg-002",
    "categoria": "jogos",
    "dificuldade": "facil",
    "enunciado": "Em qual clássico dos videogames o jogador encaixa peças que caem para completar linhas?",
    "alternativas": [
      "Pac-Man",
      "Tetris",
      "Pong",
      "Snake"
    ],
    "correta": 1,
    "explicacao": "Tetris foi criado em 1984 pelo programador russo Alexey Pajitnov."
  },
  {
    "id": "jg-003",
    "categoria": "jogos",
    "dificuldade": "facil",
    "enunciado": "Qual personagem azul e veloz é o mascote da Sega?",
    "alternativas": [
      "Sonic",
      "Mario",
      "Crash",
      "Kirby"
    ],
    "correta": 0,
    "explicacao": "Sonic, o Ouriço, estreou em 1991 como resposta da Sega ao Mario."
  },
  {
    "id": "jg-004",
    "categoria": "jogos",
    "dificuldade": "facil",
    "enunciado": "Em qual jogo o jogador explora e constrói em um mundo feito de blocos?",
    "alternativas": [
      "Pac-Man",
      "Minecraft",
      "Pong",
      "Street Fighter"
    ],
    "correta": 1,
    "explicacao": "Minecraft foi lançado em 2011 e é um dos jogos mais vendidos da história."
  },
  {
    "id": "jg-005",
    "categoria": "jogos",
    "dificuldade": "facil",
    "enunciado": "Qual personagem amarelo come bolinhas e foge de fantasmas em um labirinto?",
    "alternativas": [
      "Pac-Man",
      "Kirby",
      "Sonic",
      "Crash Bandicoot"
    ],
    "correta": 0,
    "explicacao": "Pac-Man foi lançado em 1980 e se tornou um símbolo dos fliperamas."
  },
  {
    "id": "jg-006",
    "categoria": "jogos",
    "dificuldade": "facil",
    "enunciado": "Em qual franquia o jogador captura criaturas usando Poké Bolas?",
    "alternativas": [
      "Digimon",
      "Pokémon",
      "Yu-Gi-Oh!",
      "Monster Hunter"
    ],
    "correta": 1,
    "explicacao": "Em Pokémon, os treinadores capturam e treinam criaturas para batalhar."
  },
  {
    "id": "jg-007",
    "categoria": "jogos",
    "dificuldade": "facil",
    "enunciado": "Qual console da Nintendo, lançado em 2017, pode ser jogado na TV ou como portátil?",
    "alternativas": [
      "Wii U",
      "Nintendo Switch",
      "Game Boy Advance",
      "Nintendo 3DS"
    ],
    "correta": 1,
    "explicacao": "O Switch é um console híbrido: encaixado na base ele joga na TV e, fora dela, funciona como portátil."
  },
  {
    "id": "jg-008",
    "categoria": "jogos",
    "dificuldade": "medio",
    "enunciado": "Qual é o nome do protagonista da série The Legend of Zelda?",
    "alternativas": [
      "Zelda",
      "Link",
      "Ganon",
      "Epona"
    ],
    "correta": 1,
    "explicacao": "O jogador controla Link. Zelda é a princesa de Hyrule."
  },
  {
    "id": "jg-009",
    "categoria": "jogos",
    "dificuldade": "medio",
    "enunciado": "Qual empresa criou o console PlayStation?",
    "alternativas": [
      "Nintendo",
      "Sega",
      "Sony",
      "Microsoft"
    ],
    "correta": 2,
    "explicacao": "O primeiro PlayStation foi lançado pela Sony, no Japão, em 1994."
  },
  {
    "id": "jg-010",
    "categoria": "jogos",
    "dificuldade": "medio",
    "enunciado": "Qual é o nome do reino onde vive a princesa Peach nos jogos do Mario?",
    "alternativas": [
      "Hyrule",
      "Reino dos Cogumelos",
      "Azeroth",
      "Kanto"
    ],
    "correta": 1,
    "explicacao": "A princesa Peach governa o Reino dos Cogumelos e costuma ser sequestrada por Bowser."
  },
  {
    "id": "jg-011",
    "categoria": "jogos",
    "dificuldade": "medio",
    "enunciado": "Qual jogo da Epic Games popularizou o estilo battle royale para até 100 jogadores a partir de 2017?",
    "alternativas": [
      "PUBG",
      "Fortnite",
      "Apex Legends",
      "Free Fire"
    ],
    "correta": 1,
    "explicacao": "O modo battle royale de Fortnite é gratuito e ficou famoso por permitir construir estruturas durante a partida."
  },
  {
    "id": "jg-012",
    "categoria": "jogos",
    "dificuldade": "medio",
    "enunciado": "Qual estúdio criou o primeiro jogo da série Halo, lançado em 2001?",
    "alternativas": [
      "Bungie",
      "Naughty Dog",
      "Rockstar",
      "Valve"
    ],
    "correta": 0,
    "explicacao": "Halo: Combat Evolved foi um dos jogos de lançamento do primeiro Xbox."
  },
  {
    "id": "jg-013",
    "categoria": "jogos",
    "dificuldade": "medio",
    "enunciado": "Quem é o protagonista de The Last of Us que viaja ao lado da jovem Ellie?",
    "alternativas": [
      "Joel",
      "Nathan Drake",
      "Kratos",
      "Geralt"
    ],
    "correta": 0,
    "explicacao": "Joel é um sobrevivente que precisa levar Ellie por um país devastado por uma infecção."
  },
  {
    "id": "jg-014",
    "categoria": "jogos",
    "dificuldade": "medio",
    "enunciado": "Qual jogo da Nintendo tem personagens como Mario e Luigi disputando corridas de kart?",
    "alternativas": [
      "Mario Kart",
      "F-Zero",
      "Need for Speed",
      "Gran Turismo"
    ],
    "correta": 0,
    "explicacao": "O primeiro Mario Kart foi lançado em 1992 para o Super Nintendo."
  },
  {
    "id": "jg-015",
    "categoria": "jogos",
    "dificuldade": "dificil",
    "enunciado": "Em que ano foi lançado o primeiro Super Mario Bros. no Japão?",
    "alternativas": [
      "1983",
      "1985",
      "1989",
      "1991"
    ],
    "correta": 1,
    "explicacao": "O jogo chegou ao Famicom, em setembro de 1985, e ajudou a reerguer a indústria de games."
  },
  {
    "id": "jg-016",
    "categoria": "jogos",
    "dificuldade": "dificil",
    "enunciado": "Em qual jogo da Valve o protagonista é o cientista Gordon Freeman?",
    "alternativas": [
      "Portal",
      "Half-Life",
      "Left 4 Dead",
      "Team Fortress"
    ],
    "correta": 1,
    "explicacao": "Half-Life, de 1998, é famoso por contar a história sem sair da visão do jogador."
  },
  {
    "id": "jg-017",
    "categoria": "jogos",
    "dificuldade": "dificil",
    "enunciado": "Qual estúdio desenvolve a série The Elder Scrolls?",
    "alternativas": [
      "Bethesda Game Studios",
      "BioWare",
      "Ubisoft Montreal",
      "Rockstar North"
    ],
    "correta": 0,
    "explicacao": "A série inclui Morrowind, Oblivion e Skyrim."
  },
  {
    "id": "jg-018",
    "categoria": "jogos",
    "dificuldade": "dificil",
    "enunciado": "Em que ano foram lançados os primeiros jogos da série Pokémon (Red e Green) no Japão?",
    "alternativas": [
      "1992",
      "1996",
      "1999",
      "2001"
    ],
    "correta": 1,
    "explicacao": "Os jogos chegaram ao Game Boy em 1996 e deram início a uma das maiores franquias do mundo."
  },
  {
    "id": "jg-019",
    "categoria": "jogos",
    "dificuldade": "dificil",
    "enunciado": "Qual é o nome do filho de Kratos no jogo God of War de 2018?",
    "alternativas": [
      "Atreus",
      "Baldur",
      "Deimos",
      "Tyr"
    ],
    "correta": 0,
    "explicacao": "Atreus acompanha Kratos na jornada pela mitologia nórdica. Deimos é irmão de Kratos."
  },
  {
    "id": "jg-020",
    "categoria": "jogos",
    "dificuldade": "dificil",
    "enunciado": "Qual designer japonês criou Super Mario e The Legend of Zelda?",
    "alternativas": [
      "Hideo Kojima",
      "Shigeru Miyamoto",
      "Satoru Iwata",
      "Hidetaka Miyazaki"
    ],
    "correta": 1,
    "explicacao": "Shigeru Miyamoto trabalha na Nintendo desde 1977 e é um dos criadores mais influentes dos games."
  }
] as Pergunta[]
