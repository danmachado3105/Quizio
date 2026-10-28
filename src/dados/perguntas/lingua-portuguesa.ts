/*
 * Categoria: lingua-portuguesa
 * Prefixo: pt
 * Próximo id livre: pt-016
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'pt-999', categoria: 'lingua-portuguesa', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasLinguaPortuguesa: Pergunta[] = [
  {
    "id": "pt-001",
    "categoria": "lingua-portuguesa",
    "dificuldade": "facil",
    "enunciado": "Qual é o plural de \"cidadão\"?",
    "alternativas": [
      "Cidadões",
      "Cidadãos",
      "Cidadães",
      "Cidadãoes"
    ],
    "correta": 1,
    "explicacao": "O plural correto é \"cidadãos\". Palavras como mão, irmão e cidadão fazem o plural com -s."
  },
  {
    "id": "pt-002",
    "categoria": "lingua-portuguesa",
    "dificuldade": "facil",
    "enunciado": "Qual destas palavras é um substantivo?",
    "alternativas": [
      "Rápido",
      "Correr",
      "Casa",
      "Muito"
    ],
    "correta": 2,
    "explicacao": "Substantivos nomeiam seres, lugares e coisas. \"Casa\" é um substantivo; \"rápido\" é adjetivo e \"correr\" é verbo."
  },
  {
    "id": "pt-003",
    "categoria": "lingua-portuguesa",
    "dificuldade": "facil",
    "enunciado": "Qual destas palavras está escrita corretamente?",
    "alternativas": [
      "Exceção",
      "Esceção",
      "Excessão",
      "Eceção"
    ],
    "correta": 0,
    "explicacao": "A grafia correta é \"exceção\", com xc e ç."
  },
  {
    "id": "pt-004",
    "categoria": "lingua-portuguesa",
    "dificuldade": "facil",
    "enunciado": "Qual é o antônimo de \"generoso\"?",
    "alternativas": [
      "Bondoso",
      "Avarento",
      "Humilde",
      "Corajoso"
    ],
    "correta": 1,
    "explicacao": "Antônimos têm sentidos opostos. Quem é avarento tem apego excessivo ao dinheiro e não gosta de dar."
  },
  {
    "id": "pt-005",
    "categoria": "lingua-portuguesa",
    "dificuldade": "facil",
    "enunciado": "Quantas letras tem o alfabeto da língua portuguesa atualmente?",
    "alternativas": [
      "23",
      "24",
      "26",
      "28"
    ],
    "correta": 2,
    "explicacao": "Desde o Acordo Ortográfico de 1990 (em vigor no Brasil a partir de 2009), K, W e Y fazem oficialmente parte do alfabeto, que tem 26 letras."
  },
  {
    "id": "pt-006",
    "categoria": "lingua-portuguesa",
    "dificuldade": "medio",
    "enunciado": "Qual é o sinônimo de \"efêmero\"?",
    "alternativas": [
      "Duradouro",
      "Passageiro",
      "Antigo",
      "Frágil"
    ],
    "correta": 1,
    "explicacao": "Efêmero é aquilo que dura pouco tempo, ou seja, é passageiro."
  },
  {
    "id": "pt-007",
    "categoria": "lingua-portuguesa",
    "dificuldade": "medio",
    "enunciado": "Na frase \"Os alunos chegaram cedo\", qual é o sujeito?",
    "alternativas": [
      "Chegaram",
      "Cedo",
      "Os alunos",
      "Alunos cedo"
    ],
    "correta": 2,
    "explicacao": "O sujeito é o termo sobre o qual se declara algo. Aqui, quem chegou foram \"os alunos\"."
  },
  {
    "id": "pt-008",
    "categoria": "lingua-portuguesa",
    "dificuldade": "medio",
    "enunciado": "Qual destas palavras é proparoxítona, ou seja, tem a sílaba mais forte na antepenúltima?",
    "alternativas": [
      "Médico",
      "Café",
      "Você",
      "Jacaré"
    ],
    "correta": 0,
    "explicacao": "Em mé-di-co, a sílaba tônica é \"mé\". Todas as proparoxítonas levam acento gráfico."
  },
  {
    "id": "pt-009",
    "categoria": "lingua-portuguesa",
    "dificuldade": "medio",
    "enunciado": "Qual é o coletivo de \"cães\"?",
    "alternativas": [
      "Cardume",
      "Matilha",
      "Rebanho",
      "Enxame"
    ],
    "correta": 1,
    "explicacao": "Uma matilha é um grupo de cães. Cardume é de peixes e enxame, de abelhas."
  },
  {
    "id": "pt-010",
    "categoria": "lingua-portuguesa",
    "dificuldade": "medio",
    "enunciado": "Qual é a classe gramatical da palavra \"rapidamente\"?",
    "alternativas": [
      "Adjetivo",
      "Advérbio",
      "Verbo",
      "Pronome"
    ],
    "correta": 1,
    "explicacao": "Os advérbios modificam verbos, adjetivos ou outros advérbios. Muitos terminam em -mente."
  },
  {
    "id": "pt-011",
    "categoria": "lingua-portuguesa",
    "dificuldade": "dificil",
    "enunciado": "Qual figura de linguagem aparece em \"Seus olhos são duas estrelas\"?",
    "alternativas": [
      "Metáfora",
      "Comparação",
      "Ironia",
      "Onomatopeia"
    ],
    "correta": 0,
    "explicacao": "Na metáfora, a comparação é implícita (sem \"como\"). Com \"como\", seria uma comparação."
  },
  {
    "id": "pt-012",
    "categoria": "lingua-portuguesa",
    "dificuldade": "dificil",
    "enunciado": "Qual é a forma correta do verbo \"pôr\" em \"Ontem eu ___ o livro na mesa\"?",
    "alternativas": [
      "pus",
      "pôs",
      "poz",
      "ponhei"
    ],
    "correta": 0,
    "explicacao": "No pretérito perfeito, a primeira pessoa é \"eu pus\". \"Ele pôs\" leva acento circunflexo."
  },
  {
    "id": "pt-013",
    "categoria": "lingua-portuguesa",
    "dificuldade": "dificil",
    "enunciado": "Qual destas palavras tem um hiato, ou seja, vogais que ficam em sílabas separadas?",
    "alternativas": [
      "Saída",
      "Quando",
      "Muito",
      "Aula"
    ],
    "correta": 0,
    "explicacao": "Em sa-í-da, as vogais \"a\" e \"í\" ficam em sílabas diferentes. Em \"muito\" e \"aula\" há ditongos."
  },
  {
    "id": "pt-014",
    "categoria": "lingua-portuguesa",
    "dificuldade": "dificil",
    "enunciado": "Qual é o plural do substantivo \"mal\" (aquilo que é ruim)?",
    "alternativas": [
      "Males",
      "Mals",
      "Mais",
      "Maus"
    ],
    "correta": 0,
    "explicacao": "\"Mal\" faz o plural \"males\", como em \"os males da guerra\". \"Maus\" é o plural do adjetivo \"mau\"."
  },
  {
    "id": "pt-015",
    "categoria": "lingua-portuguesa",
    "dificuldade": "dificil",
    "enunciado": "Segundo a norma-padrão, qual é a regência correta do verbo \"assistir\" no sentido de \"ver\"?",
    "alternativas": [
      "Assistir ao filme",
      "Assistir o filme",
      "Assistir no filme",
      "Assistir pelo filme"
    ],
    "correta": 0,
    "explicacao": "Nesse sentido, \"assistir\" pede a preposição \"a\" (verbo transitivo indireto). Na fala informal, o uso sem preposição é comum."
  }
] as Pergunta[]
