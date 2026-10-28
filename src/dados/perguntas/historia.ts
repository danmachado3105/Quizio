/*
 * Categoria: historia
 * Prefixo: hi
 * Próximo id livre: hi-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'hi-999', categoria: 'historia', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasHistoria: Pergunta[] = [
  {
    "id": "hi-010",
    "categoria": "historia",
    "dificuldade": "facil",
    "enunciado": "Qual povo construiu o Coliseu, em Roma?",
    "alternativas": [
      "Gregos",
      "Romanos",
      "Egípcios",
      "Persas"
    ],
    "correta": 1,
    "explicacao": "O Coliseu foi inaugurado no ano 80 d.C. e recebia lutas de gladiadores e outros espetáculos."
  },
  {
    "id": "hi-011",
    "categoria": "historia",
    "dificuldade": "facil",
    "enunciado": "Quem chegou à América em 1492, navegando a serviço da Espanha?",
    "alternativas": [
      "Américo Vespúcio",
      "Cristóvão Colombo",
      "Vasco da Gama",
      "Fernão de Magalhães"
    ],
    "correta": 1,
    "explicacao": "Colombo buscava um caminho marítimo para as Índias e acabou chegando ao continente americano."
  },
  {
    "id": "hi-012",
    "categoria": "historia",
    "dificuldade": "facil",
    "enunciado": "Em que ano a frota de Pedro Álvares Cabral chegou ao Brasil?",
    "alternativas": [
      "1492",
      "1500",
      "1530",
      "1822"
    ],
    "correta": 1,
    "explicacao": "A frota portuguesa chegou ao litoral da atual Bahia em abril de 1500."
  },
  {
    "id": "hi-013",
    "categoria": "historia",
    "dificuldade": "facil",
    "enunciado": "Qual era a principal função das grandes pirâmides do Egito?",
    "alternativas": [
      "Túmulos dos faraós",
      "Mercados",
      "Quartéis",
      "Observatórios"
    ],
    "correta": 0,
    "explicacao": "Os egípcios acreditavam na vida após a morte e construíam as pirâmides para abrigar os faraós."
  },
  {
    "id": "hi-014",
    "categoria": "historia",
    "dificuldade": "medio",
    "enunciado": "Qual revolução, iniciada em 1789, acabou com a monarquia absoluta na França?",
    "alternativas": [
      "Revolução Industrial",
      "Revolução Francesa",
      "Revolução Russa",
      "Revolução Americana"
    ],
    "correta": 1,
    "explicacao": "O lema da Revolução Francesa era \"Liberdade, Igualdade e Fraternidade\"."
  },
  {
    "id": "hi-015",
    "categoria": "historia",
    "dificuldade": "medio",
    "enunciado": "Quem liderou a Revolução Russa de 1917 e se tornou o primeiro chefe do governo soviético?",
    "alternativas": [
      "Stálin",
      "Lênin",
      "Trótski",
      "Gorbatchev"
    ],
    "correta": 1,
    "explicacao": "Vladimir Lênin liderou os bolcheviques. A União Soviética foi fundada em 1922."
  },
  {
    "id": "hi-016",
    "categoria": "historia",
    "dificuldade": "medio",
    "enunciado": "Em que ano terminou a Segunda Guerra Mundial?",
    "alternativas": [
      "1918",
      "1939",
      "1945",
      "1950"
    ],
    "correta": 2,
    "explicacao": "A guerra terminou em 1945, com a rendição da Alemanha, em maio, e a do Japão, em setembro."
  },
  {
    "id": "hi-017",
    "categoria": "historia",
    "dificuldade": "medio",
    "enunciado": "Qual era a capital do Império Inca?",
    "alternativas": [
      "Machu Picchu",
      "Cusco",
      "Lima",
      "Quito"
    ],
    "correta": 1,
    "explicacao": "Cusco, nos Andes peruanos, era o centro do império. Machu Picchu era uma cidadela, não a capital."
  },
  {
    "id": "hi-018",
    "categoria": "historia",
    "dificuldade": "dificil",
    "enunciado": "Quem fundou o Império Mongol, o maior império contínuo por terra da história?",
    "alternativas": [
      "Kublai Khan",
      "Gengis Khan",
      "Átila",
      "Tamerlão"
    ],
    "correta": 1,
    "explicacao": "Gengis Khan unificou as tribos mongóis em 1206. Seu neto Kublai Khan fundou a dinastia Yuan na China."
  },
  {
    "id": "hi-019",
    "categoria": "historia",
    "dificuldade": "dificil",
    "enunciado": "Qual guerra, entre 1864 e 1870, colocou Brasil, Argentina e Uruguai contra o Paraguai?",
    "alternativas": [
      "Guerra do Paraguai",
      "Guerra da Cisplatina",
      "Guerra dos Farrapos",
      "Guerra de Canudos"
    ],
    "correta": 0,
    "explicacao": "Também chamada de Guerra da Tríplice Aliança, foi o maior conflito armado da América do Sul."
  },
  {
    "id": "hi-020",
    "categoria": "historia",
    "dificuldade": "dificil",
    "enunciado": "Qual rei da Inglaterra assinou a Magna Carta, em 1215?",
    "alternativas": [
      "Henrique VIII",
      "João Sem Terra",
      "Ricardo Coração de Leão",
      "Eduardo I"
    ],
    "correta": 1,
    "explicacao": "A Magna Carta limitou o poder do rei e é considerada um marco na história dos direitos políticos."
  },
  {
    "id": "hi-001",
    "categoria": "historia",
    "dificuldade": "facil",
    "enunciado": "Em que ano o Brasil declarou independência de Portugal?",
    "alternativas": [
      "1500",
      "1822",
      "1889",
      "1808"
    ],
    "correta": 1,
    "explicacao": "Dom Pedro I proclamou a independência em 7 de setembro de 1822."
  },
  {
    "id": "hi-002",
    "categoria": "historia",
    "dificuldade": "facil",
    "enunciado": "Quem foi o primeiro presidente do Brasil?",
    "alternativas": [
      "Getúlio Vargas",
      "Deodoro da Fonseca",
      "Dom Pedro II",
      "Juscelino Kubitschek"
    ],
    "correta": 1,
    "explicacao": "O marechal Deodoro da Fonseca assumiu o governo após a Proclamação da República, em 1889."
  },
  {
    "id": "hi-003",
    "categoria": "historia",
    "dificuldade": "facil",
    "enunciado": "Qual civilização construiu as pirâmides de Gizé?",
    "alternativas": [
      "Romana",
      "Egípcia",
      "Maia",
      "Grega"
    ],
    "correta": 1,
    "explicacao": "As pirâmides de Gizé foram construídas pelos antigos egípcios há mais de 4 mil anos."
  },
  {
    "id": "hi-004",
    "categoria": "historia",
    "dificuldade": "medio",
    "enunciado": "Em que ano caiu o Muro de Berlim?",
    "alternativas": [
      "1979",
      "1985",
      "1989",
      "1991"
    ],
    "correta": 2,
    "explicacao": "A queda, em 9 de novembro de 1989, simbolizou o fim da divisão entre as duas Alemanhas."
  },
  {
    "id": "hi-005",
    "categoria": "historia",
    "dificuldade": "medio",
    "enunciado": "Quem liderou o movimento pela independência da Índia usando a resistência não violenta?",
    "alternativas": [
      "Jawaharlal Nehru",
      "Mahatma Gandhi",
      "Muhammad Ali Jinnah",
      "Rabindranath Tagore"
    ],
    "correta": 1,
    "explicacao": "Mahatma Gandhi foi o principal símbolo da desobediência civil pacífica contra o domínio britânico."
  },
  {
    "id": "hi-006",
    "categoria": "historia",
    "dificuldade": "medio",
    "enunciado": "Qual fato é considerado o estopim da Primeira Guerra Mundial?",
    "alternativas": [
      "A invasão da Polônia",
      "O assassinato do arquiduque Francisco Ferdinando",
      "O ataque a Pearl Harbor",
      "A Revolução Russa"
    ],
    "correta": 1,
    "explicacao": "O atentado de Sarajevo, em 1914, desencadeou uma sequência de alianças e declarações de guerra."
  },
  {
    "id": "hi-007",
    "categoria": "historia",
    "dificuldade": "dificil",
    "enunciado": "Qual tratado dividiu as terras do Novo Mundo entre Portugal e Espanha em 1494?",
    "alternativas": [
      "Tratado de Versalhes",
      "Tratado de Tordesilhas",
      "Tratado de Utrecht",
      "Tratado de Madri"
    ],
    "correta": 1,
    "explicacao": "O Tratado de Tordesilhas traçou uma linha imaginária a oeste das ilhas de Cabo Verde."
  },
  {
    "id": "hi-008",
    "categoria": "historia",
    "dificuldade": "dificil",
    "enunciado": "Em que ano foi assinada a Lei Áurea, que aboliu a escravidão no Brasil?",
    "alternativas": [
      "1871",
      "1885",
      "1888",
      "1889"
    ],
    "correta": 2,
    "explicacao": "A princesa Isabel assinou a lei em 13 de maio de 1888."
  },
  {
    "id": "hi-009",
    "categoria": "historia",
    "dificuldade": "dificil",
    "enunciado": "Quem foi derrotado na Batalha de Waterloo, em 1815?",
    "alternativas": [
      "Luís XIV",
      "Napoleão Bonaparte",
      "Carlos Magno",
      "Napoleão III"
    ],
    "correta": 1,
    "explicacao": "Napoleão foi vencido por tropas britânicas e prussianas e depois exilado na ilha de Santa Helena."
  }
] as Pergunta[]
