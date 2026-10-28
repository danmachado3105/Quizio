/*
 * Categoria: ciencia-espaco
 * Prefixo: ce
 * Próximo id livre: ce-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'ce-999', categoria: 'ciencia-espaco', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasCienciaEspaco: Pergunta[] = [
  {
    "id": "ce-010",
    "categoria": "ciencia-espaco",
    "dificuldade": "facil",
    "enunciado": "Qual é o planeta mais próximo do Sol?",
    "alternativas": [
      "Vênus",
      "Mercúrio",
      "Terra",
      "Marte"
    ],
    "correta": 1,
    "explicacao": "Mercúrio é o menor planeta do Sistema Solar e dá uma volta no Sol em apenas 88 dias."
  },
  {
    "id": "ce-011",
    "categoria": "ciencia-espaco",
    "dificuldade": "facil",
    "enunciado": "Qual é o maior planeta do Sistema Solar?",
    "alternativas": [
      "Saturno",
      "Júpiter",
      "Netuno",
      "Urano"
    ],
    "correta": 1,
    "explicacao": "Júpiter é tão grande que caberiam mais de mil Terras dentro dele."
  },
  {
    "id": "ce-012",
    "categoria": "ciencia-espaco",
    "dificuldade": "facil",
    "enunciado": "Qual estrela fica no centro do Sistema Solar?",
    "alternativas": [
      "Sol",
      "Sirius",
      "Alfa Centauro",
      "Polaris"
    ],
    "correta": 0,
    "explicacao": "O Sol é a estrela que fornece luz e calor para todos os planetas."
  },
  {
    "id": "ce-013",
    "categoria": "ciencia-espaco",
    "dificuldade": "facil",
    "enunciado": "Em que estado físico a água se encontra abaixo de 0 °C, ao nível do mar?",
    "alternativas": [
      "Gasoso",
      "Líquido",
      "Sólido",
      "Plasma"
    ],
    "correta": 2,
    "explicacao": "Abaixo de 0 °C, a água congela e vira gelo, que é o estado sólido."
  },
  {
    "id": "ce-014",
    "categoria": "ciencia-espaco",
    "dificuldade": "medio",
    "enunciado": "Qual planeta é famoso por seus anéis brilhantes, visíveis até em telescópios pequenos?",
    "alternativas": [
      "Saturno",
      "Marte",
      "Mercúrio",
      "Vênus"
    ],
    "correta": 0,
    "explicacao": "Os anéis de Saturno são formados principalmente por pedaços de gelo e rocha."
  },
  {
    "id": "ce-015",
    "categoria": "ciencia-espaco",
    "dificuldade": "medio",
    "enunciado": "Qual é a unidade de medida de energia no Sistema Internacional?",
    "alternativas": [
      "Newton",
      "Joule",
      "Watt",
      "Pascal"
    ],
    "correta": 1,
    "explicacao": "O joule (J) mede energia e trabalho. O watt mede potência e o newton, força."
  },
  {
    "id": "ce-016",
    "categoria": "ciencia-espaco",
    "dificuldade": "medio",
    "enunciado": "Como se chama a força que atrai os objetos em direção ao centro da Terra?",
    "alternativas": [
      "Magnetismo",
      "Gravidade",
      "Atrito",
      "Inércia"
    ],
    "correta": 1,
    "explicacao": "A gravidade é a força de atração entre massas. É ela que mantém a Lua em órbita da Terra."
  },
  {
    "id": "ce-017",
    "categoria": "ciencia-espaco",
    "dificuldade": "medio",
    "enunciado": "Qual é o símbolo químico do ouro?",
    "alternativas": [
      "Ag",
      "Au",
      "Go",
      "Or"
    ],
    "correta": 1,
    "explicacao": "Au vem de aurum, a palavra latina para ouro. Ag é o símbolo da prata."
  },
  {
    "id": "ce-018",
    "categoria": "ciencia-espaco",
    "dificuldade": "dificil",
    "enunciado": "Qual astrônomo propôs, no século XVI, que a Terra gira em torno do Sol?",
    "alternativas": [
      "Ptolomeu",
      "Nicolau Copérnico",
      "Tycho Brahe",
      "Johannes Kepler"
    ],
    "correta": 1,
    "explicacao": "Copérnico publicou o modelo heliocêntrico em 1543, contrariando a ideia de que a Terra era o centro do universo."
  },
  {
    "id": "ce-019",
    "categoria": "ciencia-espaco",
    "dificuldade": "dificil",
    "enunciado": "Qual grande galáxia espiral é a mais próxima da Via Láctea?",
    "alternativas": [
      "Triângulo",
      "Andrômeda",
      "Sombreiro",
      "Redemoinho"
    ],
    "correta": 1,
    "explicacao": "Andrômeda está a cerca de 2,5 milhões de anos-luz de nós e, no futuro distante, vai se fundir com a Via Láctea."
  },
  {
    "id": "ce-020",
    "categoria": "ciencia-espaco",
    "dificuldade": "dificil",
    "enunciado": "Quantos prótons tem o núcleo de um átomo de carbono?",
    "alternativas": [
      "4",
      "6",
      "8",
      "12"
    ],
    "correta": 1,
    "explicacao": "O número de prótons define o elemento. O carbono tem 6, e o seu número atômico é 6."
  },
  {
    "id": "ce-001",
    "categoria": "ciencia-espaco",
    "dificuldade": "facil",
    "enunciado": "Qual planeta é conhecido como Planeta Vermelho?",
    "alternativas": [
      "Vênus",
      "Marte",
      "Júpiter",
      "Mercúrio"
    ],
    "correta": 1,
    "explicacao": "A cor de Marte vem do óxido de ferro (ferrugem) presente em sua superfície."
  },
  {
    "id": "ce-002",
    "categoria": "ciencia-espaco",
    "dificuldade": "facil",
    "enunciado": "Qual gás as plantas absorvem do ar durante a fotossíntese?",
    "alternativas": [
      "Oxigênio",
      "Nitrogênio",
      "Gás carbônico",
      "Hélio"
    ],
    "correta": 2,
    "explicacao": "Com luz, água e gás carbônico, as plantas produzem açúcar e liberam oxigênio."
  },
  {
    "id": "ce-003",
    "categoria": "ciencia-espaco",
    "dificuldade": "facil",
    "enunciado": "Qual é a fórmula química da água?",
    "alternativas": [
      "H2O",
      "CO2",
      "O2",
      "NaCl"
    ],
    "correta": 0,
    "explicacao": "Cada molécula de água tem dois átomos de hidrogênio e um de oxigênio."
  },
  {
    "id": "ce-004",
    "categoria": "ciencia-espaco",
    "dificuldade": "medio",
    "enunciado": "Qual é a velocidade aproximada da luz no vácuo?",
    "alternativas": [
      "300 mil km/s",
      "150 mil km/s",
      "30 mil km/s",
      "3 milhões km/s"
    ],
    "correta": 0,
    "explicacao": "A luz viaja a cerca de 299.792 km por segundo."
  },
  {
    "id": "ce-005",
    "categoria": "ciencia-espaco",
    "dificuldade": "medio",
    "enunciado": "Em qual camada da atmosfera ocorre a maior parte dos fenômenos do tempo, como chuva e vento?",
    "alternativas": [
      "Estratosfera",
      "Troposfera",
      "Mesosfera",
      "Exosfera"
    ],
    "correta": 1,
    "explicacao": "A troposfera é a camada mais próxima da superfície e concentra quase todo o vapor d'água."
  },
  {
    "id": "ce-006",
    "categoria": "ciencia-espaco",
    "dificuldade": "medio",
    "enunciado": "Quem formulou a teoria da relatividade?",
    "alternativas": [
      "Isaac Newton",
      "Albert Einstein",
      "Niels Bohr",
      "Galileu Galilei"
    ],
    "correta": 1,
    "explicacao": "Albert Einstein publicou a relatividade restrita em 1905 e a geral em 1915."
  },
  {
    "id": "ce-007",
    "categoria": "ciencia-espaco",
    "dificuldade": "dificil",
    "enunciado": "Qual é o elemento químico mais abundante no universo?",
    "alternativas": [
      "Oxigênio",
      "Carbono",
      "Hidrogênio",
      "Ferro"
    ],
    "correta": 2,
    "explicacao": "O hidrogênio compõe cerca de três quartos da matéria comum do universo."
  },
  {
    "id": "ce-008",
    "categoria": "ciencia-espaco",
    "dificuldade": "dificil",
    "enunciado": "Qual é a maior lua de Saturno?",
    "alternativas": [
      "Titã",
      "Europa",
      "Ganimedes",
      "Encélado"
    ],
    "correta": 0,
    "explicacao": "Titã é a maior lua de Saturno e tem uma atmosfera densa. Europa e Ganimedes orbitam Júpiter."
  },
  {
    "id": "ce-009",
    "categoria": "ciencia-espaco",
    "dificuldade": "dificil",
    "enunciado": "Como se chama a camada externa do Sol visível durante um eclipse solar total?",
    "alternativas": [
      "Cromosfera",
      "Coroa",
      "Fotosfera",
      "Magnetosfera"
    ],
    "correta": 1,
    "explicacao": "A coroa solar é a atmosfera mais externa do Sol e só aparece quando a Lua cobre o disco solar."
  }
] as Pergunta[]
