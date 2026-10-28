/*
 * Categoria: brasil
 * Prefixo: br
 * Próximo id livre: br-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'br-999', categoria: 'brasil', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasBrasil: Pergunta[] = [
  {
    "id": "br-010",
    "categoria": "brasil",
    "dificuldade": "facil",
    "enunciado": "Qual dança típica brasileira é praticada nas festas juninas?",
    "alternativas": [
      "Quadrilha",
      "Valsa",
      "Tango",
      "Flamenco"
    ],
    "correta": 0,
    "explicacao": "A quadrilha foi trazida pelos europeus e ganhou um jeito brasileiro, com o marcador dando as ordens em tom de brincadeira."
  },
  {
    "id": "br-011",
    "categoria": "brasil",
    "dificuldade": "facil",
    "enunciado": "Em qual cidade acontece o desfile das escolas de samba na Marquês de Sapucaí?",
    "alternativas": [
      "Salvador",
      "Rio de Janeiro",
      "Recife",
      "São Paulo"
    ],
    "correta": 1,
    "explicacao": "O Sambódromo da Marquês de Sapucaí, no Rio de Janeiro, foi inaugurado em 1984."
  },
  {
    "id": "br-012",
    "categoria": "brasil",
    "dificuldade": "facil",
    "enunciado": "Qual é o esporte mais popular do Brasil?",
    "alternativas": [
      "Vôlei",
      "Futebol",
      "Basquete",
      "Automobilismo"
    ],
    "correta": 1,
    "explicacao": "O futebol é paixão nacional, e o Brasil é o país com mais títulos de Copa do Mundo masculina."
  },
  {
    "id": "br-013",
    "categoria": "brasil",
    "dificuldade": "facil",
    "enunciado": "Qual é a cidade mais populosa do Brasil?",
    "alternativas": [
      "Rio de Janeiro",
      "São Paulo",
      "Brasília",
      "Salvador"
    ],
    "correta": 1,
    "explicacao": "São Paulo tem mais de 11 milhões de habitantes, segundo os censos do IBGE."
  },
  {
    "id": "br-014",
    "categoria": "brasil",
    "dificuldade": "medio",
    "enunciado": "Qual região brasileira é formada por Rio Grande do Sul, Santa Catarina e Paraná?",
    "alternativas": [
      "Sul",
      "Sudeste",
      "Centro-Oeste",
      "Nordeste"
    ],
    "correta": 0,
    "explicacao": "O Brasil tem cinco regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul."
  },
  {
    "id": "br-015",
    "categoria": "brasil",
    "dificuldade": "medio",
    "enunciado": "Qual cidade brasileira abriga o Pelourinho, em seu centro histórico?",
    "alternativas": [
      "Olinda",
      "Salvador",
      "São Luís",
      "Ouro Preto"
    ],
    "correta": 1,
    "explicacao": "O Centro Histórico de Salvador é Patrimônio Mundial da UNESCO e tem casarões coloridos do período colonial."
  },
  {
    "id": "br-016",
    "categoria": "brasil",
    "dificuldade": "medio",
    "enunciado": "Qual compositor escreveu Garota de Ipanema em parceria com Vinicius de Moraes?",
    "alternativas": [
      "Tom Jobim",
      "Chico Buarque",
      "Caetano Veloso",
      "João Gilberto"
    ],
    "correta": 0,
    "explicacao": "A canção, de 1962, é um dos maiores símbolos da Bossa Nova e uma das músicas mais gravadas do mundo."
  },
  {
    "id": "br-017",
    "categoria": "brasil",
    "dificuldade": "medio",
    "enunciado": "Qual estado brasileiro é o maior produtor de café do país?",
    "alternativas": [
      "Minas Gerais",
      "Bahia",
      "Goiás",
      "Ceará"
    ],
    "correta": 0,
    "explicacao": "Minas Gerais responde por grande parte da produção nacional de café, e o Brasil é o maior produtor mundial."
  },
  {
    "id": "br-018",
    "categoria": "brasil",
    "dificuldade": "dificil",
    "enunciado": "Qual presidente brasileiro inaugurou Brasília, em 1960?",
    "alternativas": [
      "Getúlio Vargas",
      "Juscelino Kubitschek",
      "Jânio Quadros",
      "Eurico Gaspar Dutra"
    ],
    "correta": 1,
    "explicacao": "Juscelino Kubitschek construiu a capital em pouco mais de três anos, com o lema \"50 anos em 5\"."
  },
  {
    "id": "br-019",
    "categoria": "brasil",
    "dificuldade": "dificil",
    "enunciado": "Qual é o ponto extremo sul do território brasileiro?",
    "alternativas": [
      "Arroio Chuí",
      "Monte Caburaí",
      "Ponta do Seixas",
      "Serra do Divisor"
    ],
    "correta": 0,
    "explicacao": "O Arroio Chuí fica no Rio Grande do Sul, na fronteira com o Uruguai. O Monte Caburaí é o extremo norte e a Ponta do Seixas, o extremo leste."
  },
  {
    "id": "br-020",
    "categoria": "brasil",
    "dificuldade": "dificil",
    "enunciado": "Qual rio se encontra com o Rio Negro, perto de Manaus, formando o fenômeno chamado Encontro das Águas?",
    "alternativas": [
      "Solimões",
      "Madeira",
      "Tapajós",
      "Xingu"
    ],
    "correta": 0,
    "explicacao": "As águas escuras do Negro correm lado a lado com as águas barrentas do Solimões por vários quilômetros, sem se misturar de imediato."
  },
  {
    "id": "br-001",
    "categoria": "brasil",
    "dificuldade": "facil",
    "enunciado": "Qual é a maior floresta tropical do Brasil?",
    "alternativas": [
      "Mata Atlântica",
      "Floresta Amazônica",
      "Pantanal",
      "Caatinga"
    ],
    "correta": 1,
    "explicacao": "A Amazônia ocupa quase metade do território brasileiro."
  },
  {
    "id": "br-002",
    "categoria": "brasil",
    "dificuldade": "facil",
    "enunciado": "Qual monumento fica no alto do Corcovado, no Rio de Janeiro?",
    "alternativas": [
      "Pão de Açúcar",
      "Cristo Redentor",
      "Arcos da Lapa",
      "Maracanã"
    ],
    "correta": 1,
    "explicacao": "O Cristo Redentor foi inaugurado em 1931 e é uma das Sete Maravilhas do Mundo Moderno."
  },
  {
    "id": "br-003",
    "categoria": "brasil",
    "dificuldade": "facil",
    "enunciado": "Qual é a língua oficial do Brasil?",
    "alternativas": [
      "Espanhol",
      "Português",
      "Tupi",
      "Inglês"
    ],
    "correta": 1,
    "explicacao": "O português é a língua oficial segundo a Constituição Federal."
  },
  {
    "id": "br-004",
    "categoria": "brasil",
    "dificuldade": "medio",
    "enunciado": "Qual é o estado brasileiro com maior área territorial?",
    "alternativas": [
      "Pará",
      "Amazonas",
      "Mato Grosso",
      "Minas Gerais"
    ],
    "correta": 1,
    "explicacao": "O Amazonas tem mais de 1,5 milhão de km²."
  },
  {
    "id": "br-005",
    "categoria": "brasil",
    "dificuldade": "medio",
    "enunciado": "Qual rio é conhecido como Velho Chico?",
    "alternativas": [
      "Rio Tietê",
      "Rio São Francisco",
      "Rio Paraná",
      "Rio Tocantins"
    ],
    "correta": 1,
    "explicacao": "O Rio São Francisco nasce em Minas Gerais e atravessa o sertão nordestino até o Atlântico."
  },
  {
    "id": "br-006",
    "categoria": "brasil",
    "dificuldade": "medio",
    "enunciado": "Em qual cidade aconteceu a Semana de Arte Moderna de 1922?",
    "alternativas": [
      "Rio de Janeiro",
      "São Paulo",
      "Salvador",
      "Belo Horizonte"
    ],
    "correta": 1,
    "explicacao": "O evento foi realizado no Theatro Municipal de São Paulo e marcou o início do Modernismo brasileiro."
  },
  {
    "id": "br-007",
    "categoria": "brasil",
    "dificuldade": "dificil",
    "enunciado": "Qual bioma existe exclusivamente em território brasileiro?",
    "alternativas": [
      "Cerrado",
      "Pampa",
      "Caatinga",
      "Pantanal"
    ],
    "correta": 2,
    "explicacao": "A Caatinga, típica do semiárido nordestino, é o único grande bioma restrito ao Brasil."
  },
  {
    "id": "br-008",
    "categoria": "brasil",
    "dificuldade": "dificil",
    "enunciado": "Qual foi a primeira capital do Brasil?",
    "alternativas": [
      "Rio de Janeiro",
      "Salvador",
      "São Vicente",
      "Olinda"
    ],
    "correta": 1,
    "explicacao": "Salvador foi a capital da colônia de 1549 a 1763, quando o posto passou ao Rio de Janeiro."
  },
  {
    "id": "br-009",
    "categoria": "brasil",
    "dificuldade": "dificil",
    "enunciado": "Qual é o ponto mais alto do Brasil?",
    "alternativas": [
      "Pico da Bandeira",
      "Pico da Neblina",
      "Monte Roraima",
      "Pico Paraná"
    ],
    "correta": 1,
    "explicacao": "O Pico da Neblina, no Amazonas, tem cerca de 2.995 metros. O Pico da Bandeira é o segundo mais alto."
  }
] as Pergunta[]
