/*
 * Categoria: conhecimentos-gerais
 * Prefixo: cg
 * Próximo id livre: cg-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'cg-999', categoria: 'conhecimentos-gerais', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasConhecimentosGerais: Pergunta[] = [
  {
    "id": "cg-010",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "facil",
    "enunciado": "Qual cor se obtém ao misturar azul e amarelo?",
    "alternativas": [
      "Verde",
      "Roxo",
      "Laranja",
      "Marrom"
    ],
    "correta": 0,
    "explicacao": "Azul e amarelo são cores primárias. Quando se misturam, formam o verde."
  },
  {
    "id": "cg-011",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "facil",
    "enunciado": "Qual destes animais é um mamífero?",
    "alternativas": [
      "Tubarão",
      "Golfinho",
      "Sardinha",
      "Polvo"
    ],
    "correta": 1,
    "explicacao": "O golfinho respira ar pelos pulmões e amamenta os filhotes. Tubarão e sardinha são peixes, e o polvo é um molusco."
  },
  {
    "id": "cg-012",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "facil",
    "enunciado": "Em qual estação do ano as folhas de muitas árvores caem em países de clima temperado?",
    "alternativas": [
      "Primavera",
      "Verão",
      "Outono",
      "Inverno"
    ],
    "correta": 2,
    "explicacao": "No outono, as árvores perdem as folhas para economizar energia antes do frio do inverno."
  },
  {
    "id": "cg-013",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "facil",
    "enunciado": "Qual é o único satélite natural da Terra?",
    "alternativas": [
      "Lua",
      "Fobos",
      "Titã",
      "Europa"
    ],
    "correta": 0,
    "explicacao": "A Lua é o nosso satélite natural. Fobos orbita Marte, Titã orbita Saturno e Europa orbita Júpiter."
  },
  {
    "id": "cg-014",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "medio",
    "enunciado": "Qual é o metal que fica líquido à temperatura ambiente?",
    "alternativas": [
      "Ferro",
      "Mercúrio",
      "Alumínio",
      "Cobre"
    ],
    "correta": 1,
    "explicacao": "O mercúrio é líquido em temperatura ambiente e foi muito usado em termômetros antigos."
  },
  {
    "id": "cg-015",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "medio",
    "enunciado": "Qual é a moeda oficial do Japão?",
    "alternativas": [
      "Won",
      "Iene",
      "Yuan",
      "Baht"
    ],
    "correta": 1,
    "explicacao": "O iene é a moeda japonesa. O won é sul-coreano, o yuan é chinês e o baht é tailandês."
  },
  {
    "id": "cg-016",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "medio",
    "enunciado": "Como se chama o sistema de leitura e escrita formado por pontos em relevo, usado por pessoas cegas?",
    "alternativas": [
      "Braille",
      "Morse",
      "Cuneiforme",
      "Hieróglifo"
    ],
    "correta": 0,
    "explicacao": "O sistema foi criado pelo francês Louis Braille, no século XIX."
  },
  {
    "id": "cg-017",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "medio",
    "enunciado": "Qual é a capital do Canadá?",
    "alternativas": [
      "Toronto",
      "Vancouver",
      "Ottawa",
      "Montreal"
    ],
    "correta": 2,
    "explicacao": "Ottawa é a capital. Toronto é a cidade mais populosa, mas não é a capital."
  },
  {
    "id": "cg-018",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "dificil",
    "enunciado": "Qual estreito separa a Europa da África, ligando o Mar Mediterrâneo ao Oceano Atlântico?",
    "alternativas": [
      "Bósforo",
      "Gibraltar",
      "Magalhães",
      "Ormuz"
    ],
    "correta": 1,
    "explicacao": "No Estreito de Gibraltar, a distância entre a Espanha e o Marrocos é de apenas cerca de 14 km."
  },
  {
    "id": "cg-019",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "dificil",
    "enunciado": "Qual é a capital da Suíça?",
    "alternativas": [
      "Zurique",
      "Genebra",
      "Berna",
      "Basileia"
    ],
    "correta": 2,
    "explicacao": "Berna é a sede do governo suíço. Zurique é a maior cidade e Genebra é famosa por organizações internacionais."
  },
  {
    "id": "cg-020",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "dificil",
    "enunciado": "Qual deserto, no norte do Chile, é um dos lugares mais secos do planeta?",
    "alternativas": [
      "Atacama",
      "Gobi",
      "Kalahari",
      "Mojave"
    ],
    "correta": 0,
    "explicacao": "Em algumas áreas do Atacama, anos inteiros se passam sem chuva."
  },
  {
    "id": "cg-001",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "facil",
    "enunciado": "Quantos dias tem um ano bissexto?",
    "alternativas": [
      "365",
      "366",
      "367",
      "364"
    ],
    "correta": 1,
    "explicacao": "O dia extra é 29 de fevereiro, que mantém o calendário alinhado com o movimento da Terra."
  },
  {
    "id": "cg-002",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "facil",
    "enunciado": "Qual é o maior oceano do planeta?",
    "alternativas": [
      "Atlântico",
      "Índico",
      "Pacífico",
      "Ártico"
    ],
    "correta": 2,
    "explicacao": "O Oceano Pacífico cobre cerca de um terço da superfície da Terra."
  },
  {
    "id": "cg-003",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "facil",
    "enunciado": "Quantas cores tem o arco-íris na divisão tradicional?",
    "alternativas": [
      "Cinco",
      "Seis",
      "Sete",
      "Oito"
    ],
    "correta": 2,
    "explicacao": "São sete: vermelho, laranja, amarelo, verde, azul, anil e violeta."
  },
  {
    "id": "cg-004",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "medio",
    "enunciado": "Qual é o menor país do mundo em área?",
    "alternativas": [
      "Mônaco",
      "Vaticano",
      "San Marino",
      "Liechtenstein"
    ],
    "correta": 1,
    "explicacao": "A Cidade do Vaticano tem cerca de 0,44 km²."
  },
  {
    "id": "cg-005",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "medio",
    "enunciado": "Qual idioma tem mais falantes nativos no mundo?",
    "alternativas": [
      "Inglês",
      "Espanhol",
      "Mandarim",
      "Hindi"
    ],
    "correta": 2,
    "explicacao": "O mandarim é a língua materna do maior número de pessoas."
  },
  {
    "id": "cg-006",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "medio",
    "enunciado": "Qual é o osso mais longo do corpo humano?",
    "alternativas": [
      "Úmero",
      "Tíbia",
      "Fêmur",
      "Rádio"
    ],
    "correta": 2,
    "explicacao": "O fêmur, na coxa, é o maior e mais resistente osso do corpo."
  },
  {
    "id": "cg-007",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "dificil",
    "enunciado": "Como se chama o ponto mais profundo dos oceanos?",
    "alternativas": [
      "Fossa das Marianas",
      "Fossa de Porto Rico",
      "Fossa de Java",
      "Fossa das Filipinas"
    ],
    "correta": 0,
    "explicacao": "A Fossa das Marianas, no Pacífico, chega a cerca de 11 mil metros de profundidade."
  },
  {
    "id": "cg-008",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "dificil",
    "enunciado": "Qual é a unidade de frequência no Sistema Internacional?",
    "alternativas": [
      "Watt",
      "Hertz",
      "Pascal",
      "Joule"
    ],
    "correta": 1,
    "explicacao": "O hertz (Hz) mede ciclos por segundo."
  },
  {
    "id": "cg-009",
    "categoria": "conhecimentos-gerais",
    "dificuldade": "dificil",
    "enunciado": "Quantos elementos químicos a tabela periódica atual reconhece?",
    "alternativas": [
      "108",
      "112",
      "118",
      "126"
    ],
    "correta": 2,
    "explicacao": "São 118 elementos confirmados, do hidrogênio ao oganésson."
  }
] as Pergunta[]
