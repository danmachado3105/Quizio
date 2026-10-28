/*
 * Categoria: geografia
 * Prefixo: ge
 * Próximo id livre: ge-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'ge-999', categoria: 'geografia', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasGeografia: Pergunta[] = [
  {
    "id": "ge-010",
    "categoria": "geografia",
    "dificuldade": "facil",
    "enunciado": "Qual é a capital da França?",
    "alternativas": [
      "Lyon",
      "Paris",
      "Marselha",
      "Nice"
    ],
    "correta": 1,
    "explicacao": "Paris é a capital e a maior cidade da França, cortada pelo Rio Sena."
  },
  {
    "id": "ge-011",
    "categoria": "geografia",
    "dificuldade": "facil",
    "enunciado": "Em qual continente fica o Brasil?",
    "alternativas": [
      "América do Norte",
      "América do Sul",
      "África",
      "Europa"
    ],
    "correta": 1,
    "explicacao": "O Brasil ocupa quase metade da América do Sul."
  },
  {
    "id": "ge-012",
    "categoria": "geografia",
    "dificuldade": "facil",
    "enunciado": "Qual é o menor continente do mundo em área?",
    "alternativas": [
      "Europa",
      "Oceania",
      "Antártida",
      "América do Sul"
    ],
    "correta": 1,
    "explicacao": "A Oceania, que inclui a Austrália e várias ilhas do Pacífico, é o menor dos continentes."
  },
  {
    "id": "ge-013",
    "categoria": "geografia",
    "dificuldade": "facil",
    "enunciado": "Qual país é conhecido como a Terra do Sol Nascente?",
    "alternativas": [
      "China",
      "Japão",
      "Coreia do Sul",
      "Tailândia"
    ],
    "correta": 1,
    "explicacao": "O nome do Japão em japonês, Nihon (ou Nippon), significa \"origem do sol\"."
  },
  {
    "id": "ge-014",
    "categoria": "geografia",
    "dificuldade": "medio",
    "enunciado": "Qual é a capital da Argentina?",
    "alternativas": [
      "Córdoba",
      "Buenos Aires",
      "Montevidéu",
      "Santiago"
    ],
    "correta": 1,
    "explicacao": "Buenos Aires fica às margens do Rio da Prata. Montevidéu é a capital do Uruguai e Santiago, a do Chile."
  },
  {
    "id": "ge-015",
    "categoria": "geografia",
    "dificuldade": "medio",
    "enunciado": "Qual é o maior deserto quente do mundo?",
    "alternativas": [
      "Gobi",
      "Kalahari",
      "Saara",
      "Atacama"
    ],
    "correta": 2,
    "explicacao": "O Saara, no norte da África, tem área parecida com a dos Estados Unidos. O maior deserto de todos é a Antártida, que é frio."
  },
  {
    "id": "ge-016",
    "categoria": "geografia",
    "dificuldade": "medio",
    "enunciado": "Qual rio atravessa a cidade de Paris?",
    "alternativas": [
      "Tâmisa",
      "Sena",
      "Reno",
      "Danúbio"
    ],
    "correta": 1,
    "explicacao": "O Sena corta Paris e passa ao lado de monumentos como a Catedral de Notre-Dame. O Tâmisa passa por Londres."
  },
  {
    "id": "ge-017",
    "categoria": "geografia",
    "dificuldade": "medio",
    "enunciado": "Qual é a montanha mais alta do mundo acima do nível do mar?",
    "alternativas": [
      "K2",
      "Monte Everest",
      "Kilimanjaro",
      "Aconcágua"
    ],
    "correta": 1,
    "explicacao": "O Everest, na fronteira entre o Nepal e o Tibete, tem cerca de 8.849 metros de altitude."
  },
  {
    "id": "ge-018",
    "categoria": "geografia",
    "dificuldade": "dificil",
    "enunciado": "Qual país tem a maior extensão de costa marítima do mundo?",
    "alternativas": [
      "Rússia",
      "Canadá",
      "Austrália",
      "Indonésia"
    ],
    "correta": 1,
    "explicacao": "O Canadá tem uma costa de mais de 200 mil km, por causa de suas inúmeras ilhas e baías."
  },
  {
    "id": "ge-019",
    "categoria": "geografia",
    "dificuldade": "dificil",
    "enunciado": "Qual é a capital da Nova Zelândia?",
    "alternativas": [
      "Auckland",
      "Wellington",
      "Christchurch",
      "Queenstown"
    ],
    "correta": 1,
    "explicacao": "Wellington é a capital. Auckland é a cidade mais populosa do país."
  },
  {
    "id": "ge-020",
    "categoria": "geografia",
    "dificuldade": "dificil",
    "enunciado": "Qual é a capital do Marrocos?",
    "alternativas": [
      "Casablanca",
      "Rabat",
      "Marrakech",
      "Fez"
    ],
    "correta": 1,
    "explicacao": "Rabat é a capital. Casablanca é a maior cidade e o principal centro econômico do país."
  },
  {
    "id": "ge-001",
    "categoria": "geografia",
    "dificuldade": "facil",
    "enunciado": "Qual é a capital do Brasil?",
    "alternativas": [
      "Rio de Janeiro",
      "São Paulo",
      "Brasília",
      "Salvador"
    ],
    "correta": 2,
    "explicacao": "Brasília é a capital federal desde sua inauguração, em 1960."
  },
  {
    "id": "ge-002",
    "categoria": "geografia",
    "dificuldade": "facil",
    "enunciado": "Qual é o maior país do mundo em área territorial?",
    "alternativas": [
      "Canadá",
      "China",
      "Estados Unidos",
      "Rússia"
    ],
    "correta": 3,
    "explicacao": "A Rússia tem mais de 17 milhões de km²."
  },
  {
    "id": "ge-003",
    "categoria": "geografia",
    "dificuldade": "facil",
    "enunciado": "Qual é o maior continente do mundo em área?",
    "alternativas": [
      "África",
      "América do Norte",
      "Ásia",
      "Europa"
    ],
    "correta": 2,
    "explicacao": "A Ásia ocupa cerca de 30% das terras emersas do planeta."
  },
  {
    "id": "ge-004",
    "categoria": "geografia",
    "dificuldade": "medio",
    "enunciado": "Qual é a capital da Austrália?",
    "alternativas": [
      "Sydney",
      "Melbourne",
      "Camberra",
      "Perth"
    ],
    "correta": 2,
    "explicacao": "Camberra foi planejada para ser capital, evitando a disputa entre Sydney e Melbourne."
  },
  {
    "id": "ge-005",
    "categoria": "geografia",
    "dificuldade": "medio",
    "enunciado": "Qual é o rio mais caudaloso do mundo?",
    "alternativas": [
      "Nilo",
      "Amazonas",
      "Yangtzé",
      "Mississippi"
    ],
    "correta": 1,
    "explicacao": "O Amazonas despeja mais água no oceano do que qualquer outro rio."
  },
  {
    "id": "ge-006",
    "categoria": "geografia",
    "dificuldade": "medio",
    "enunciado": "Qual cordilheira acompanha a costa oeste da América do Sul?",
    "alternativas": [
      "Himalaia",
      "Alpes",
      "Andes",
      "Montanhas Rochosas"
    ],
    "correta": 2,
    "explicacao": "Os Andes são a mais longa cordilheira continental do mundo."
  },
  {
    "id": "ge-007",
    "categoria": "geografia",
    "dificuldade": "dificil",
    "enunciado": "Qual é o país mais populoso da África?",
    "alternativas": [
      "Egito",
      "Etiópia",
      "Nigéria",
      "África do Sul"
    ],
    "correta": 2,
    "explicacao": "A Nigéria tem mais de 200 milhões de habitantes."
  },
  {
    "id": "ge-008",
    "categoria": "geografia",
    "dificuldade": "dificil",
    "enunciado": "Qual é o lago de água doce com maior área de superfície do mundo?",
    "alternativas": [
      "Lago Vitória",
      "Lago Superior",
      "Lago Baikal",
      "Lago Michigan"
    ],
    "correta": 1,
    "explicacao": "O Lago Superior, na América do Norte, é o maior em área. O Baikal é o mais profundo e de maior volume."
  },
  {
    "id": "ge-009",
    "categoria": "geografia",
    "dificuldade": "dificil",
    "enunciado": "Qual é a capital da Turquia?",
    "alternativas": [
      "Istambul",
      "Ancara",
      "Izmir",
      "Antália"
    ],
    "correta": 1,
    "explicacao": "Ancara é a capital desde 1923. Istambul é a cidade mais populosa, mas não é a capital."
  }
] as Pergunta[]
