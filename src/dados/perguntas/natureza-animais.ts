/*
 * Categoria: natureza-animais
 * Prefixo: na
 * Próximo id livre: na-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'na-999', categoria: 'natureza-animais', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasNaturezaAnimais: Pergunta[] = [
  {
    "id": "na-010",
    "categoria": "natureza-animais",
    "dificuldade": "facil",
    "enunciado": "Qual ave não voa e vive em regiões frias do hemisfério sul, como a Antártida?",
    "alternativas": [
      "Pinguim",
      "Albatroz",
      "Gaivota",
      "Pelicano"
    ],
    "correta": 0,
    "explicacao": "Os pinguins perderam a capacidade de voar, mas nadam muito bem usando as asas como nadadeiras."
  },
  {
    "id": "na-011",
    "categoria": "natureza-animais",
    "dificuldade": "facil",
    "enunciado": "Qual é o animal terrestre mais alto do mundo?",
    "alternativas": [
      "Elefante",
      "Girafa",
      "Avestruz",
      "Camelo"
    ],
    "correta": 1,
    "explicacao": "Uma girafa adulta pode passar de 5 metros de altura."
  },
  {
    "id": "na-012",
    "categoria": "natureza-animais",
    "dificuldade": "facil",
    "enunciado": "Qual inseto é conhecido por produzir mel?",
    "alternativas": [
      "Abelha",
      "Formiga",
      "Vespa",
      "Joaninha"
    ],
    "correta": 0,
    "explicacao": "As abelhas transformam o néctar das flores em mel e o guardam na colmeia."
  },
  {
    "id": "na-013",
    "categoria": "natureza-animais",
    "dificuldade": "facil",
    "enunciado": "Qual destes animais é um réptil?",
    "alternativas": [
      "Sapo",
      "Jacaré",
      "Golfinho",
      "Salamandra"
    ],
    "correta": 1,
    "explicacao": "Répteis têm pele coberta de escamas. Sapos e salamandras são anfíbios, e o golfinho é um mamífero."
  },
  {
    "id": "na-014",
    "categoria": "natureza-animais",
    "dificuldade": "medio",
    "enunciado": "Qual é a função das raízes de uma planta?",
    "alternativas": [
      "Produzir flores",
      "Fixar a planta e absorver água e sais minerais",
      "Realizar a fotossíntese",
      "Espalhar as sementes"
    ],
    "correta": 1,
    "explicacao": "As raízes sustentam a planta no solo e retiram dele a água e os nutrientes de que ela precisa."
  },
  {
    "id": "na-015",
    "categoria": "natureza-animais",
    "dificuldade": "medio",
    "enunciado": "Qual é o maior réptil vivo do mundo?",
    "alternativas": [
      "Anaconda",
      "Crocodilo-de-água-salgada",
      "Dragão-de-komodo",
      "Jacaré-açu"
    ],
    "correta": 1,
    "explicacao": "O crocodilo-de-água-salgada pode passar de 5 metros de comprimento e vive do sul da Ásia ao norte da Austrália."
  },
  {
    "id": "na-016",
    "categoria": "natureza-animais",
    "dificuldade": "medio",
    "enunciado": "Qual destes animais é famoso por mudar de cor para se camuflar?",
    "alternativas": [
      "Camaleão",
      "Iguana",
      "Salamandra",
      "Jacaré"
    ],
    "correta": 0,
    "explicacao": "O camaleão muda de cor para se comunicar, regular a temperatura e se camuflar."
  },
  {
    "id": "na-017",
    "categoria": "natureza-animais",
    "dificuldade": "medio",
    "enunciado": "Qual destes animais é um marsupial, ou seja, carrega os filhotes em uma bolsa?",
    "alternativas": [
      "Canguru",
      "Coelho",
      "Esquilo",
      "Morcego"
    ],
    "correta": 0,
    "explicacao": "Cangurus e coalas são marsupiais típicos da Austrália. No Brasil, o gambá também é um marsupial."
  },
  {
    "id": "na-018",
    "categoria": "natureza-animais",
    "dificuldade": "dificil",
    "enunciado": "Como se chama o processo pelo qual as plantas liberam vapor d'água pelas folhas?",
    "alternativas": [
      "Transpiração",
      "Fotossíntese",
      "Germinação",
      "Polinização"
    ],
    "correta": 0,
    "explicacao": "A transpiração acontece principalmente pelos estômatos, pequenos poros das folhas. Ela ajuda a puxar a água das raízes."
  },
  {
    "id": "na-019",
    "categoria": "natureza-animais",
    "dificuldade": "dificil",
    "enunciado": "Qual é o maior primata do mundo?",
    "alternativas": [
      "Orangotango",
      "Gorila",
      "Chimpanzé",
      "Mandril"
    ],
    "correta": 1,
    "explicacao": "Os gorilas são os maiores primatas vivos. Um macho adulto pode passar de 150 kg."
  },
  {
    "id": "na-020",
    "categoria": "natureza-animais",
    "dificuldade": "dificil",
    "enunciado": "Qual é o maior roedor do mundo?",
    "alternativas": [
      "Capivara",
      "Castor",
      "Paca",
      "Porco-espinho"
    ],
    "correta": 0,
    "explicacao": "A capivara pode pesar mais de 50 kg e é um animal muito comum nos rios e lagos do Brasil."
  },
  {
    "id": "na-001",
    "categoria": "natureza-animais",
    "dificuldade": "facil",
    "enunciado": "Qual é o maior animal terrestre atual?",
    "alternativas": [
      "Girafa",
      "Elefante-africano",
      "Rinoceronte",
      "Hipopótamo"
    ],
    "correta": 1,
    "explicacao": "O elefante-africano pode passar de 6 toneladas. A girafa é a mais alta, mas é mais leve."
  },
  {
    "id": "na-002",
    "categoria": "natureza-animais",
    "dificuldade": "facil",
    "enunciado": "Quantas patas tem uma aranha?",
    "alternativas": [
      "Seis",
      "Oito",
      "Dez",
      "Quatro"
    ],
    "correta": 1,
    "explicacao": "Aranhas são aracnídeos e têm oito patas. Insetos têm seis."
  },
  {
    "id": "na-003",
    "categoria": "natureza-animais",
    "dificuldade": "facil",
    "enunciado": "Qual animal é popularmente chamado de rei da selva?",
    "alternativas": [
      "Tigre",
      "Leão",
      "Urso",
      "Lobo"
    ],
    "correta": 1,
    "explicacao": "O apelido é popular, mas os leões vivem principalmente em savanas, não em selvas."
  },
  {
    "id": "na-004",
    "categoria": "natureza-animais",
    "dificuldade": "medio",
    "enunciado": "Qual é o maior mamífero do mundo?",
    "alternativas": [
      "Cachalote",
      "Baleia-azul",
      "Elefante-africano",
      "Orca"
    ],
    "correta": 1,
    "explicacao": "A baleia-azul pode ultrapassar 25 metros e é o maior animal que já existiu."
  },
  {
    "id": "na-005",
    "categoria": "natureza-animais",
    "dificuldade": "medio",
    "enunciado": "Qual destes mamíferos põe ovos?",
    "alternativas": [
      "Canguru",
      "Ornitorrinco",
      "Morcego",
      "Golfinho"
    ],
    "correta": 1,
    "explicacao": "O ornitorrinco e as equidnas formam o grupo dos monotremados, mamíferos que botam ovos."
  },
  {
    "id": "na-006",
    "categoria": "natureza-animais",
    "dificuldade": "medio",
    "enunciado": "Como se chama a transformação pela qual uma lagarta vira borboleta?",
    "alternativas": [
      "Fotossíntese",
      "Metamorfose",
      "Hibernação",
      "Simbiose"
    ],
    "correta": 1,
    "explicacao": "Na metamorfose completa, o animal passa por ovo, larva (lagarta), pupa (casulo) e adulto."
  },
  {
    "id": "na-007",
    "categoria": "natureza-animais",
    "dificuldade": "dificil",
    "enunciado": "Qual é o maior felino das Américas?",
    "alternativas": [
      "Puma",
      "Onça-pintada",
      "Jaguatirica",
      "Lince"
    ],
    "correta": 1,
    "explicacao": "A onça-pintada é o maior felino do continente americano e o terceiro maior do mundo."
  },
  {
    "id": "na-008",
    "categoria": "natureza-animais",
    "dificuldade": "dificil",
    "enunciado": "Quantos corações tem um polvo?",
    "alternativas": [
      "Um",
      "Dois",
      "Três",
      "Quatro"
    ],
    "correta": 2,
    "explicacao": "Dois corações bombeiam sangue para as brânquias e um terceiro leva o sangue ao resto do corpo."
  },
  {
    "id": "na-009",
    "categoria": "natureza-animais",
    "dificuldade": "dificil",
    "enunciado": "Qual ave é famosa por conseguir voar para trás e parar no ar?",
    "alternativas": [
      "Andorinha",
      "Beija-flor",
      "Pardal",
      "Falcão"
    ],
    "correta": 1,
    "explicacao": "O beija-flor bate as asas dezenas de vezes por segundo, o que permite pairar e recuar."
  }
] as Pergunta[]
