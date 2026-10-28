/*
 * Categoria: esportes
 * Prefixo: es
 * Próximo id livre: es-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'es-999', categoria: 'esportes', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasEsportes: Pergunta[] = [
  {
    "id": "es-010",
    "categoria": "esportes",
    "dificuldade": "facil",
    "enunciado": "Qual esporte é praticado em uma piscina e tem provas como nado livre e borboleta?",
    "alternativas": [
      "Natação",
      "Polo aquático",
      "Remo",
      "Surfe"
    ],
    "correta": 0,
    "explicacao": "Os quatro estilos da natação competitiva são crawl (nado livre), costas, peito e borboleta."
  },
  {
    "id": "es-011",
    "categoria": "esportes",
    "dificuldade": "facil",
    "enunciado": "Quantos jogadores de cada equipe ficam em quadra no vôlei de quadra?",
    "alternativas": [
      "4",
      "5",
      "6",
      "7"
    ],
    "correta": 2,
    "explicacao": "Cada equipe joga com seis atletas em quadra, que fazem rodízio de posições a cada ponto conquistado no saque."
  },
  {
    "id": "es-012",
    "categoria": "esportes",
    "dificuldade": "facil",
    "enunciado": "Qual é a cor da medalha entregue ao segundo colocado nas Olimpíadas?",
    "alternativas": [
      "Ouro",
      "Prata",
      "Bronze",
      "Cobre"
    ],
    "correta": 1,
    "explicacao": "Ouro para o primeiro lugar, prata para o segundo e bronze para o terceiro."
  },
  {
    "id": "es-013",
    "categoria": "esportes",
    "dificuldade": "facil",
    "enunciado": "Qual país é o berço do judô?",
    "alternativas": [
      "China",
      "Japão",
      "Coreia do Sul",
      "Brasil"
    ],
    "correta": 1,
    "explicacao": "O judô foi criado no Japão por Jigoro Kano, em 1882."
  },
  {
    "id": "es-014",
    "categoria": "esportes",
    "dificuldade": "medio",
    "enunciado": "Em qual esporte se disputa o Tour de France?",
    "alternativas": [
      "Atletismo",
      "Ciclismo",
      "Automobilismo",
      "Natação"
    ],
    "correta": 1,
    "explicacao": "O Tour de France é a maior corrida de ciclismo do mundo e dura cerca de três semanas."
  },
  {
    "id": "es-015",
    "categoria": "esportes",
    "dificuldade": "medio",
    "enunciado": "Qual país sediou os Jogos Olímpicos de 2016?",
    "alternativas": [
      "China",
      "Brasil",
      "Reino Unido",
      "Japão"
    ],
    "correta": 1,
    "explicacao": "Os Jogos de 2016 aconteceram no Rio de Janeiro, a primeira vez que a América do Sul sediou uma Olimpíada."
  },
  {
    "id": "es-016",
    "categoria": "esportes",
    "dificuldade": "medio",
    "enunciado": "No vôlei de quadra, quantos sets uma equipe precisa vencer para ganhar a partida, no formato tradicional de melhor de cinco?",
    "alternativas": [
      "2",
      "3",
      "4",
      "5"
    ],
    "correta": 1,
    "explicacao": "Vence quem ganhar três sets primeiro. Se houver empate em 2 a 2, o quinto set decide."
  },
  {
    "id": "es-017",
    "categoria": "esportes",
    "dificuldade": "medio",
    "enunciado": "Qual jogador de basquete ficou famoso com a camisa 23 do Chicago Bulls?",
    "alternativas": [
      "Kobe Bryant",
      "Michael Jordan",
      "LeBron James",
      "Magic Johnson"
    ],
    "correta": 1,
    "explicacao": "Michael Jordan foi seis vezes campeão da NBA com os Bulls, nos anos 1990."
  },
  {
    "id": "es-018",
    "categoria": "esportes",
    "dificuldade": "dificil",
    "enunciado": "Qual atleta brasileiro conquistou o ouro olímpico no salto com vara nos Jogos do Rio, em 2016?",
    "alternativas": [
      "Thiago Braz",
      "Fabiana Murer",
      "Maurren Maggi",
      "Joaquim Cruz"
    ],
    "correta": 0,
    "explicacao": "Thiago Braz saltou 6,03 m e bateu o recorde olímpico da prova."
  },
  {
    "id": "es-019",
    "categoria": "esportes",
    "dificuldade": "dificil",
    "enunciado": "Em qual cidade foram realizados os primeiros Jogos Olímpicos da era moderna, em 1896?",
    "alternativas": [
      "Paris",
      "Atenas",
      "Londres",
      "Roma"
    ],
    "correta": 1,
    "explicacao": "Os Jogos foram reeditados em Atenas, em homenagem à origem grega das Olimpíadas, por iniciativa do barão Pierre de Coubertin."
  },
  {
    "id": "es-020",
    "categoria": "esportes",
    "dificuldade": "dificil",
    "enunciado": "No golfe, como se chama terminar um buraco com duas tacadas abaixo do par?",
    "alternativas": [
      "Birdie",
      "Eagle",
      "Bogey",
      "Albatross"
    ],
    "correta": 1,
    "explicacao": "Birdie é uma tacada abaixo do par, eagle são duas e albatross são três. Bogey é uma tacada acima."
  },
  {
    "id": "es-001",
    "categoria": "esportes",
    "dificuldade": "facil",
    "enunciado": "Quantos jogadores cada time mantém em campo no futebol, contando o goleiro?",
    "alternativas": [
      "9",
      "10",
      "11",
      "12"
    ],
    "correta": 2,
    "explicacao": "Cada equipe joga com onze atletas, sendo um deles o goleiro."
  },
  {
    "id": "es-002",
    "categoria": "esportes",
    "dificuldade": "facil",
    "enunciado": "Qual esporte é jogado com uma bola e uma cesta em quadra?",
    "alternativas": [
      "Vôlei",
      "Basquete",
      "Handebol",
      "Rúgbi"
    ],
    "correta": 1,
    "explicacao": "No basquete, os times tentam acertar a bola na cesta do adversário."
  },
  {
    "id": "es-003",
    "categoria": "esportes",
    "dificuldade": "facil",
    "enunciado": "De quantos em quantos anos acontece a Copa do Mundo de futebol masculino?",
    "alternativas": [
      "2",
      "3",
      "4",
      "5"
    ],
    "correta": 2,
    "explicacao": "O torneio é realizado a cada quatro anos."
  },
  {
    "id": "es-004",
    "categoria": "esportes",
    "dificuldade": "medio",
    "enunciado": "Em que ano o Brasil conquistou o pentacampeonato mundial de futebol masculino?",
    "alternativas": [
      "1994",
      "1998",
      "2002",
      "2006"
    ],
    "correta": 2,
    "explicacao": "A seleção venceu a Alemanha na final de 2002, na Coreia do Sul e no Japão."
  },
  {
    "id": "es-005",
    "categoria": "esportes",
    "dificuldade": "medio",
    "enunciado": "Em qual país nasceram os Jogos Olímpicos da Antiguidade?",
    "alternativas": [
      "Itália",
      "Grécia",
      "Egito",
      "França"
    ],
    "correta": 1,
    "explicacao": "Os jogos antigos eram realizados em Olímpia, na Grécia, em homenagem a Zeus."
  },
  {
    "id": "es-006",
    "categoria": "esportes",
    "dificuldade": "medio",
    "enunciado": "Qual esporte é disputado no torneio de Wimbledon?",
    "alternativas": [
      "Golfe",
      "Tênis",
      "Críquete",
      "Rúgbi"
    ],
    "correta": 1,
    "explicacao": "Wimbledon é o torneio de tênis mais antigo do mundo e é jogado em quadras de grama."
  },
  {
    "id": "es-007",
    "categoria": "esportes",
    "dificuldade": "dificil",
    "enunciado": "Qual país sediou a primeira Copa do Mundo de futebol, em 1930?",
    "alternativas": [
      "Brasil",
      "Itália",
      "Uruguai",
      "Argentina"
    ],
    "correta": 2,
    "explicacao": "O Uruguai foi sede e também campeão da primeira edição."
  },
  {
    "id": "es-008",
    "categoria": "esportes",
    "dificuldade": "dificil",
    "enunciado": "Quantos títulos mundiais de Fórmula 1 Ayrton Senna conquistou?",
    "alternativas": [
      "Dois",
      "Três",
      "Quatro",
      "Cinco"
    ],
    "correta": 1,
    "explicacao": "Senna foi campeão em 1988, 1990 e 1991."
  },
  {
    "id": "es-009",
    "categoria": "esportes",
    "dificuldade": "dificil",
    "enunciado": "Qual é a distância oficial de uma maratona?",
    "alternativas": [
      "32,195 km",
      "40 km",
      "42,195 km",
      "45 km"
    ],
    "correta": 2,
    "explicacao": "A distância de 42,195 km foi padronizada nos Jogos Olímpicos de 1908, em Londres."
  }
] as Pergunta[]
