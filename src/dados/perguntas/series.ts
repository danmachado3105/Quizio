/*
 * Categoria: series
 * Prefixo: sr
 * Próximo id livre: sr-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'sr-999', categoria: 'series', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasSeries: Pergunta[] = [
  {
    "id": "sr-001",
    "categoria": "series",
    "dificuldade": "facil",
    "enunciado": "Qual série se passa em um mundo com os reinos de Westeros?",
    "alternativas": [
      "The Witcher",
      "Game of Thrones",
      "Vikings",
      "Arcane"
    ],
    "correta": 1,
    "explicacao": "Game of Thrones é baseada nos livros de George R. R. Martin."
  },
  {
    "id": "sr-002",
    "categoria": "series",
    "dificuldade": "facil",
    "enunciado": "Qual série da Netflix se passa na cidade de Hawkins e tem uma garota chamada Eleven?",
    "alternativas": [
      "Dark",
      "Stranger Things",
      "Sex Education",
      "Elite"
    ],
    "correta": 1,
    "explicacao": "Em Stranger Things, um grupo de amigos enfrenta forças sobrenaturais nos anos 1980."
  },
  {
    "id": "sr-003",
    "categoria": "series",
    "dificuldade": "facil",
    "enunciado": "Qual sitcom acompanha seis amigos de Nova York que frequentam o café Central Perk?",
    "alternativas": [
      "Friends",
      "Seinfeld",
      "How I Met Your Mother",
      "The Office"
    ],
    "correta": 0,
    "explicacao": "Friends foi exibida de 1994 a 2004 e segue fazendo sucesso em reprises e no streaming."
  },
  {
    "id": "sr-004",
    "categoria": "series",
    "dificuldade": "facil",
    "enunciado": "Qual desenho animado mostra a família formada por Homer, Marge, Bart, Lisa e Maggie?",
    "alternativas": [
      "Os Simpsons",
      "Uma Família da Pesada",
      "South Park",
      "Futurama"
    ],
    "correta": 0,
    "explicacao": "Os Simpsons estreou em 1989 e é uma das séries mais longas da televisão americana."
  },
  {
    "id": "sr-005",
    "categoria": "series",
    "dificuldade": "facil",
    "enunciado": "Em qual programa brasileiro aparecem Emília, Narizinho e o Visconde de Sabugosa?",
    "alternativas": [
      "Sítio do Picapau Amarelo",
      "Castelo Rá-Tim-Bum",
      "Chaves",
      "Carrossel"
    ],
    "correta": 0,
    "explicacao": "Os personagens foram criados por Monteiro Lobato e ganharam várias versões na TV."
  },
  {
    "id": "sr-006",
    "categoria": "series",
    "dificuldade": "facil",
    "enunciado": "Qual série de comédia mostra o dia a dia dos funcionários de uma empresa de papel chamada Dunder Mifflin?",
    "alternativas": [
      "Parks and Recreation",
      "The Office",
      "Brooklyn Nine-Nine",
      "Modern Family"
    ],
    "correta": 1,
    "explicacao": "A série é gravada como um falso documentário, em um escritório da cidade de Scranton."
  },
  {
    "id": "sr-007",
    "categoria": "series",
    "dificuldade": "facil",
    "enunciado": "Qual série do Disney+ tem um caçador de recompensas e uma criatura chamada Grogu?",
    "alternativas": [
      "The Mandalorian",
      "The Witcher",
      "Andor",
      "Loki"
    ],
    "correta": 0,
    "explicacao": "The Mandalorian se passa no universo de Star Wars, depois dos eventos de O Retorno de Jedi."
  },
  {
    "id": "sr-008",
    "categoria": "series",
    "dificuldade": "medio",
    "enunciado": "Qual série acompanha o professor de química Walter White?",
    "alternativas": [
      "Breaking Bad",
      "Dexter",
      "Lost",
      "House"
    ],
    "correta": 0,
    "explicacao": "Em Breaking Bad, Walter White passa a produzir drogas após receber um diagnóstico grave."
  },
  {
    "id": "sr-009",
    "categoria": "series",
    "dificuldade": "medio",
    "enunciado": "Qual série de ficção científica ficou famosa pela frase \"a verdade está lá fora\"?",
    "alternativas": [
      "Fringe",
      "Arquivo X",
      "Lost",
      "Black Mirror"
    ],
    "correta": 1,
    "explicacao": "Em Arquivo X, os agentes Mulder e Scully investigam casos sobrenaturais."
  },
  {
    "id": "sr-010",
    "categoria": "series",
    "dificuldade": "medio",
    "enunciado": "Em qual série os sobreviventes de um acidente de avião ficam em uma ilha misteriosa?",
    "alternativas": [
      "Lost",
      "Naufrágios",
      "Survivor",
      "Prison Break"
    ],
    "correta": 0,
    "explicacao": "Lost foi exibida de 2004 a 2010 e misturava drama, mistério e ficção científica."
  },
  {
    "id": "sr-011",
    "categoria": "series",
    "dificuldade": "medio",
    "enunciado": "Qual série tem entre seus personagens o físico Sheldon Cooper?",
    "alternativas": [
      "Two and a Half Men",
      "The Big Bang Theory",
      "Community",
      "Scrubs"
    ],
    "correta": 1,
    "explicacao": "Sheldon é interpretado por Jim Parsons em The Big Bang Theory."
  },
  {
    "id": "sr-012",
    "categoria": "series",
    "dificuldade": "medio",
    "enunciado": "Qual série britânica mostra o detetive de Baker Street interpretado por Benedict Cumberbatch?",
    "alternativas": [
      "Luther",
      "Sherlock",
      "Broadchurch",
      "Doctor Who"
    ],
    "correta": 1,
    "explicacao": "A série atualiza as histórias de Sherlock Holmes para os dias de hoje."
  },
  {
    "id": "sr-013",
    "categoria": "series",
    "dificuldade": "medio",
    "enunciado": "Qual série tem um professor que planeja um grande assalto à Casa da Moeda da Espanha?",
    "alternativas": [
      "Narcos",
      "La Casa de Papel",
      "Elite",
      "Vis a Vis"
    ],
    "correta": 1,
    "explicacao": "La Casa de Papel é uma produção espanhola que fez sucesso mundial no streaming."
  },
  {
    "id": "sr-014",
    "categoria": "series",
    "dificuldade": "medio",
    "enunciado": "Qual série animada tem como protagonistas um cientista chamado Rick e seu neto Morty?",
    "alternativas": [
      "Rick and Morty",
      "Bob's Burgers",
      "Archer",
      "BoJack Horseman"
    ],
    "correta": 0,
    "explicacao": "Rick and Morty mistura ficção científica e comédia, com viagens entre universos."
  },
  {
    "id": "sr-015",
    "categoria": "series",
    "dificuldade": "dificil",
    "enunciado": "Qual série da HBO acompanha o chefe de uma família mafiosa de Nova Jersey?",
    "alternativas": [
      "Boardwalk Empire",
      "Os Sopranos",
      "The Wire",
      "Six Feet Under"
    ],
    "correta": 1,
    "explicacao": "Os Sopranos foi exibida de 1999 a 2007, com James Gandolfini como Tony Soprano."
  },
  {
    "id": "sr-016",
    "categoria": "series",
    "dificuldade": "dificil",
    "enunciado": "Qual série britânica acompanha um Senhor do Tempo que viaja em uma cabine chamada TARDIS?",
    "alternativas": [
      "Doctor Who",
      "Torchwood",
      "Black Mirror",
      "Red Dwarf"
    ],
    "correta": 0,
    "explicacao": "Doctor Who estreou em 1963 e é uma das séries de ficção científica mais longas do mundo."
  },
  {
    "id": "sr-017",
    "categoria": "series",
    "dificuldade": "dificil",
    "enunciado": "Qual série dos anos 1990 mostra um jovem da Filadélfia que vai morar com os tios ricos em Bel-Air?",
    "alternativas": [
      "Um Maluco no Pedaço",
      "Todo Mundo Odeia o Chris",
      "Anos Incríveis",
      "Eu, a Patroa e as Crianças"
    ],
    "correta": 0,
    "explicacao": "A série foi estrelada por Will Smith e exibida de 1990 a 1996."
  },
  {
    "id": "sr-018",
    "categoria": "series",
    "dificuldade": "dificil",
    "enunciado": "Qual série da Netflix, de 2016, retrata o reinado da rainha Elizabeth II?",
    "alternativas": [
      "The Crown",
      "Bridgerton",
      "Downton Abbey",
      "Victoria"
    ],
    "correta": 0,
    "explicacao": "A cada temporada, o elenco muda para acompanhar o envelhecimento dos personagens."
  },
  {
    "id": "sr-019",
    "categoria": "series",
    "dificuldade": "dificil",
    "enunciado": "Qual série sul-coreana de 2021, conhecida no Brasil como Round 6, reúne 456 participantes em jogos mortais?",
    "alternativas": [
      "Round 6 (Squid Game)",
      "Alice in Borderland",
      "Sweet Home",
      "Kingdom"
    ],
    "correta": 0,
    "explicacao": "Os jogos são versões perigosas de brincadeiras infantis coreanas, com um grande prêmio em dinheiro."
  },
  {
    "id": "sr-020",
    "categoria": "series",
    "dificuldade": "dificil",
    "enunciado": "Qual série britânica acompanha a vida da família Crawley em uma grande mansão?",
    "alternativas": [
      "Downton Abbey",
      "Peaky Blinders",
      "The Crown",
      "Bridgerton"
    ],
    "correta": 0,
    "explicacao": "Downton Abbey se passa no início do século XX e mostra a vida da aristocracia e dos empregados."
  }
] as Pergunta[]
