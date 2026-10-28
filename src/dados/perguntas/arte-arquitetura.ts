/*
 * Categoria: arte-arquitetura
 * Prefixo: ar
 * Próximo id livre: ar-016
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'ar-999', categoria: 'arte-arquitetura', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasArteArquitetura: Pergunta[] = [
  {
    "id": "ar-001",
    "categoria": "arte-arquitetura",
    "dificuldade": "facil",
    "enunciado": "Quem pintou a Mona Lisa?",
    "alternativas": [
      "Michelangelo",
      "Leonardo da Vinci",
      "Rafael",
      "Botticelli"
    ],
    "correta": 1,
    "explicacao": "Leonardo da Vinci pintou a obra no início do século XVI. Hoje ela está no Museu do Louvre, em Paris."
  },
  {
    "id": "ar-002",
    "categoria": "arte-arquitetura",
    "dificuldade": "facil",
    "enunciado": "Em qual cidade fica a Torre Eiffel?",
    "alternativas": [
      "Londres",
      "Roma",
      "Paris",
      "Berlim"
    ],
    "correta": 2,
    "explicacao": "A torre foi inaugurada em 1889 para a Exposição Universal de Paris."
  },
  {
    "id": "ar-003",
    "categoria": "arte-arquitetura",
    "dificuldade": "facil",
    "enunciado": "Qual pintor holandês é o autor de A Noite Estrelada?",
    "alternativas": [
      "Rembrandt",
      "Vincent van Gogh",
      "Vermeer",
      "Piet Mondrian"
    ],
    "correta": 1,
    "explicacao": "Van Gogh pintou a obra em 1889, inspirado na vista da janela de seu quarto em Saint-Rémy-de-Provence."
  },
  {
    "id": "ar-004",
    "categoria": "arte-arquitetura",
    "dificuldade": "facil",
    "enunciado": "Quais são as três cores primárias tradicionais na pintura?",
    "alternativas": [
      "Vermelho, azul e amarelo",
      "Verde, roxo e laranja",
      "Preto, branco e cinza",
      "Rosa, verde e azul"
    ],
    "correta": 0,
    "explicacao": "Misturando vermelho, azul e amarelo é possível obter muitas outras cores."
  },
  {
    "id": "ar-005",
    "categoria": "arte-arquitetura",
    "dificuldade": "facil",
    "enunciado": "Como se chama a superfície onde o pintor mistura as tintas, geralmente com um furo para o polegar?",
    "alternativas": [
      "Paleta",
      "Cavalete",
      "Pincel",
      "Espátula"
    ],
    "correta": 0,
    "explicacao": "A paleta é segurada com uma das mãos, e o furo para o polegar facilita o apoio."
  },
  {
    "id": "ar-006",
    "categoria": "arte-arquitetura",
    "dificuldade": "medio",
    "enunciado": "Claude Monet foi um dos principais nomes de qual movimento artístico?",
    "alternativas": [
      "Cubismo",
      "Impressionismo",
      "Surrealismo",
      "Barroco"
    ],
    "correta": 1,
    "explicacao": "O nome do movimento vem da obra Impressão, Nascer do Sol, que Monet pintou em 1872."
  },
  {
    "id": "ar-007",
    "categoria": "arte-arquitetura",
    "dificuldade": "medio",
    "enunciado": "Quem pintou Guernica?",
    "alternativas": [
      "Salvador Dalí",
      "Joan Miró",
      "Pablo Picasso",
      "Henri Matisse"
    ],
    "correta": 2,
    "explicacao": "Picasso pintou a obra em 1937, em protesto contra o bombardeio da cidade basca de Guernica."
  },
  {
    "id": "ar-008",
    "categoria": "arte-arquitetura",
    "dificuldade": "medio",
    "enunciado": "Em qual cidade fica a Sagrada Família, basílica projetada por Antoni Gaudí?",
    "alternativas": [
      "Madri",
      "Barcelona",
      "Lisboa",
      "Valência"
    ],
    "correta": 1,
    "explicacao": "A construção começou em 1882 e continua até hoje."
  },
  {
    "id": "ar-009",
    "categoria": "arte-arquitetura",
    "dificuldade": "medio",
    "enunciado": "Qual escultor criou a famosa estátua O Pensador?",
    "alternativas": [
      "Auguste Rodin",
      "Donatello",
      "Alberto Giacometti",
      "Antônio Canova"
    ],
    "correta": 0,
    "explicacao": "Rodin concebeu a figura como parte da obra A Porta do Inferno."
  },
  {
    "id": "ar-010",
    "categoria": "arte-arquitetura",
    "dificuldade": "medio",
    "enunciado": "Qual artista brasileira pintou o quadro Abaporu, em 1928?",
    "alternativas": [
      "Anita Malfatti",
      "Tarsila do Amaral",
      "Djanira",
      "Lasar Segall"
    ],
    "correta": 1,
    "explicacao": "Tarsila deu a obra de presente a Oswald de Andrade, e ela inspirou o Movimento Antropofágico."
  },
  {
    "id": "ar-011",
    "categoria": "arte-arquitetura",
    "dificuldade": "dificil",
    "enunciado": "Quem projetou os principais edifícios de Brasília, como o Palácio da Alvorada?",
    "alternativas": [
      "Lúcio Costa",
      "Oscar Niemeyer",
      "Burle Marx",
      "Paulo Mendes da Rocha"
    ],
    "correta": 1,
    "explicacao": "Niemeyer projetou os edifícios. Lúcio Costa foi o autor do plano urbanístico da cidade, o Plano Piloto."
  },
  {
    "id": "ar-012",
    "categoria": "arte-arquitetura",
    "dificuldade": "dificil",
    "enunciado": "Qual artista criou o Cubismo junto com Pablo Picasso, por volta de 1907?",
    "alternativas": [
      "Georges Braque",
      "Marc Chagall",
      "Paul Cézanne",
      "Edvard Munch"
    ],
    "correta": 0,
    "explicacao": "Picasso e Braque desenvolveram o estilo juntos, decompondo os objetos em formas geométricas."
  },
  {
    "id": "ar-013",
    "categoria": "arte-arquitetura",
    "dificuldade": "dificil",
    "enunciado": "Como se chama a técnica de pintar sobre a parede com o reboco ainda úmido, usada por Michelangelo na Capela Sistina?",
    "alternativas": [
      "Aquarela",
      "Afresco",
      "Têmpera",
      "Encáustica"
    ],
    "correta": 1,
    "explicacao": "No afresco, o pigmento se fixa ao secar junto com o reboco, o que torna a pintura muito durável."
  },
  {
    "id": "ar-014",
    "categoria": "arte-arquitetura",
    "dificuldade": "dificil",
    "enunciado": "Qual estilo arquitetônico medieval é marcado por arcos ogivais, vitrais e arcobotantes, como na Catedral de Notre-Dame?",
    "alternativas": [
      "Gótico",
      "Romântico",
      "Barroco",
      "Neoclássico"
    ],
    "correta": 0,
    "explicacao": "O gótico surgiu na França no século XII e buscava construir edifícios altos e cheios de luz."
  },
  {
    "id": "ar-015",
    "categoria": "arte-arquitetura",
    "dificuldade": "dificil",
    "enunciado": "Qual pintor surrealista criou A Persistência da Memória, famosa pelos relógios derretidos?",
    "alternativas": [
      "René Magritte",
      "Salvador Dalí",
      "Max Ernst",
      "Joan Miró"
    ],
    "correta": 1,
    "explicacao": "Dalí pintou a obra em 1931. Ela é um dos símbolos do surrealismo."
  }
] as Pergunta[]
