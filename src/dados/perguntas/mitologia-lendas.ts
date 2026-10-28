/*
 * Categoria: mitologia-lendas
 * Prefixo: mi
 * Próximo id livre: mi-016
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'mi-999', categoria: 'mitologia-lendas', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasMitologiaLendas: Pergunta[] = [
  {
    "id": "mi-001",
    "categoria": "mitologia-lendas",
    "dificuldade": "facil",
    "enunciado": "Quem é o rei dos deuses na mitologia grega?",
    "alternativas": [
      "Zeus",
      "Apolo",
      "Hades",
      "Poseidon"
    ],
    "correta": 0,
    "explicacao": "Zeus governa o Olimpo e é o deus do céu e do trovão."
  },
  {
    "id": "mi-002",
    "categoria": "mitologia-lendas",
    "dificuldade": "facil",
    "enunciado": "Qual deus grego governa os mares?",
    "alternativas": [
      "Hades",
      "Poseidon",
      "Ares",
      "Hermes"
    ],
    "correta": 1,
    "explicacao": "Poseidon é irmão de Zeus e costuma ser representado com um tridente."
  },
  {
    "id": "mi-003",
    "categoria": "mitologia-lendas",
    "dificuldade": "facil",
    "enunciado": "Na mitologia nórdica, qual deus empunha o martelo Mjölnir?",
    "alternativas": [
      "Odin",
      "Thor",
      "Loki",
      "Baldur"
    ],
    "correta": 1,
    "explicacao": "Thor é o deus do trovão, filho de Odin."
  },
  {
    "id": "mi-004",
    "categoria": "mitologia-lendas",
    "dificuldade": "facil",
    "enunciado": "Qual criatura da mitologia grega tem corpo de homem e cabeça de touro?",
    "alternativas": [
      "Minotauro",
      "Centauro",
      "Sátiro",
      "Hidra"
    ],
    "correta": 0,
    "explicacao": "O Minotauro vivia no Labirinto de Creta, até ser derrotado pelo herói Teseu."
  },
  {
    "id": "mi-005",
    "categoria": "mitologia-lendas",
    "dificuldade": "facil",
    "enunciado": "Qual personagem do folclore brasileiro é um menino de uma perna só que usa um gorro vermelho?",
    "alternativas": [
      "Curupira",
      "Saci-pererê",
      "Boitatá",
      "Mapinguari"
    ],
    "correta": 1,
    "explicacao": "O Saci aparece em redemoinhos e gosta de pregar peças nas pessoas."
  },
  {
    "id": "mi-006",
    "categoria": "mitologia-lendas",
    "dificuldade": "medio",
    "enunciado": "Qual herói grego realizou doze trabalhos como penitência?",
    "alternativas": [
      "Perseu",
      "Hércules",
      "Aquiles",
      "Teseu"
    ],
    "correta": 1,
    "explicacao": "Hércules (Héracles, em grego) cumpriu as doze tarefas para se redimir de um crime cometido em um acesso de loucura."
  },
  {
    "id": "mi-007",
    "categoria": "mitologia-lendas",
    "dificuldade": "medio",
    "enunciado": "Qual criatura do folclore brasileiro protege as matas e tem os pés virados para trás?",
    "alternativas": [
      "Curupira",
      "Iara",
      "Cuca",
      "Boitatá"
    ],
    "correta": 0,
    "explicacao": "Os pés virados para trás servem para confundir quem tenta seguir suas pegadas."
  },
  {
    "id": "mi-008",
    "categoria": "mitologia-lendas",
    "dificuldade": "medio",
    "enunciado": "Qual deusa grega é associada à sabedoria e à estratégia de guerra?",
    "alternativas": [
      "Afrodite",
      "Atena",
      "Hera",
      "Ártemis"
    ],
    "correta": 1,
    "explicacao": "Segundo o mito, Atena nasceu já adulta e armada, saindo da cabeça de Zeus."
  },
  {
    "id": "mi-009",
    "categoria": "mitologia-lendas",
    "dificuldade": "medio",
    "enunciado": "Na mitologia egípcia, qual deus tem cabeça de chacal e guia os mortos?",
    "alternativas": [
      "Anúbis",
      "Rá",
      "Hórus",
      "Osíris"
    ],
    "correta": 0,
    "explicacao": "Anúbis era ligado ao embalsamamento e acompanhava as almas ao julgamento."
  },
  {
    "id": "mi-010",
    "categoria": "mitologia-lendas",
    "dificuldade": "medio",
    "enunciado": "Em qual mitologia aparecem Odin, Freya e Valhalla?",
    "alternativas": [
      "Grega",
      "Nórdica",
      "Egípcia",
      "Romana"
    ],
    "correta": 1,
    "explicacao": "Valhalla é o salão onde Odin recebe os guerreiros mortos em combate."
  },
  {
    "id": "mi-011",
    "categoria": "mitologia-lendas",
    "dificuldade": "dificil",
    "enunciado": "Qual rio do submundo grego fazia as almas esquecerem a vida passada?",
    "alternativas": [
      "Estige",
      "Lete",
      "Aqueronte",
      "Cócito"
    ],
    "correta": 1,
    "explicacao": "Lete era o rio do esquecimento. O Estige, o do ódio, e o Aqueronte, o da dor."
  },
  {
    "id": "mi-012",
    "categoria": "mitologia-lendas",
    "dificuldade": "dificil",
    "enunciado": "Qual barqueiro levava as almas dos mortos através do rio no mundo subterrâneo grego?",
    "alternativas": [
      "Caronte",
      "Cérbero",
      "Tântalo",
      "Orfeu"
    ],
    "correta": 0,
    "explicacao": "Caronte cobrava uma moeda pela travessia, que era colocada na boca dos mortos."
  },
  {
    "id": "mi-013",
    "categoria": "mitologia-lendas",
    "dificuldade": "dificil",
    "enunciado": "Qual monstro de muitas cabeças foi derrotado por Hércules em um de seus trabalhos?",
    "alternativas": [
      "Hidra de Lerna",
      "Quimera",
      "Medusa",
      "Esfinge"
    ],
    "correta": 0,
    "explicacao": "Quando uma cabeça da Hidra era cortada, duas nasciam no lugar."
  },
  {
    "id": "mi-014",
    "categoria": "mitologia-lendas",
    "dificuldade": "dificil",
    "enunciado": "Como se chamava o navio de Jasão e dos argonautas na busca pelo Velocino de Ouro?",
    "alternativas": [
      "Argo",
      "Odisseia",
      "Pégaso",
      "Poseidon"
    ],
    "correta": 0,
    "explicacao": "O nome \"argonautas\" significa \"marinheiros do Argo\"."
  },
  {
    "id": "mi-015",
    "categoria": "mitologia-lendas",
    "dificuldade": "dificil",
    "enunciado": "Qual deus da mitologia romana corresponde ao grego Zeus?",
    "alternativas": [
      "Júpiter",
      "Marte",
      "Netuno",
      "Saturno"
    ],
    "correta": 0,
    "explicacao": "Os romanos adaptaram os deuses gregos: Júpiter é Zeus, Marte é Ares e Netuno é Poseidon."
  }
] as Pergunta[]
