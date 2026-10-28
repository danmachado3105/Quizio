/*
 * Categoria: literatura
 * Prefixo: li
 * Próximo id livre: li-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'li-999', categoria: 'literatura', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasLiteratura: Pergunta[] = [
  {
    "id": "li-010",
    "categoria": "literatura",
    "dificuldade": "facil",
    "enunciado": "Quem escreveu a série de livros Harry Potter?",
    "alternativas": [
      "J. K. Rowling",
      "Suzanne Collins",
      "Stephenie Meyer",
      "C. S. Lewis"
    ],
    "correta": 0,
    "explicacao": "O primeiro livro, Harry Potter e a Pedra Filosofal, foi publicado em 1997."
  },
  {
    "id": "li-011",
    "categoria": "literatura",
    "dificuldade": "facil",
    "enunciado": "Qual escritor brasileiro criou o Sítio do Picapau Amarelo?",
    "alternativas": [
      "Monteiro Lobato",
      "Ziraldo",
      "Ruth Rocha",
      "Maurício de Sousa"
    ],
    "correta": 0,
    "explicacao": "Monteiro Lobato publicou as histórias do sítio a partir dos anos 1920, e elas são um marco da literatura infantil brasileira."
  },
  {
    "id": "li-012",
    "categoria": "literatura",
    "dificuldade": "facil",
    "enunciado": "Quem escreveu O Senhor dos Anéis?",
    "alternativas": [
      "J. R. R. Tolkien",
      "George R. R. Martin",
      "C. S. Lewis",
      "Roald Dahl"
    ],
    "correta": 0,
    "explicacao": "Tolkien publicou a trilogia entre 1954 e 1955, ambientada na Terra-média."
  },
  {
    "id": "li-013",
    "categoria": "literatura",
    "dificuldade": "facil",
    "enunciado": "Qual detetive criado por Agatha Christie é famoso pelo bigode e pelas \"pequenas células cinzentas\"?",
    "alternativas": [
      "Hercule Poirot",
      "Sherlock Holmes",
      "Miss Marple",
      "Philip Marlowe"
    ],
    "correta": 0,
    "explicacao": "Poirot é um detetive belga que aparece em mais de trinta romances de Agatha Christie."
  },
  {
    "id": "li-014",
    "categoria": "literatura",
    "dificuldade": "medio",
    "enunciado": "Quem escreveu O Cortiço, romance naturalista de 1890?",
    "alternativas": [
      "Aluísio Azevedo",
      "Machado de Assis",
      "Raul Pompeia",
      "Graça Aranha"
    ],
    "correta": 0,
    "explicacao": "O livro retrata a vida em um cortiço do Rio de Janeiro e é um dos principais romances do naturalismo brasileiro."
  },
  {
    "id": "li-015",
    "categoria": "literatura",
    "dificuldade": "medio",
    "enunciado": "Qual escritor russo é o autor de Crime e Castigo?",
    "alternativas": [
      "Liev Tolstói",
      "Fiódor Dostoiévski",
      "Anton Tchekhov",
      "Nikolai Gógol"
    ],
    "correta": 1,
    "explicacao": "O romance, de 1866, acompanha o jovem Raskólnikov e seus conflitos morais depois de um crime."
  },
  {
    "id": "li-016",
    "categoria": "literatura",
    "dificuldade": "medio",
    "enunciado": "Quem escreveu a peça Romeu e Julieta?",
    "alternativas": [
      "Christopher Marlowe",
      "William Shakespeare",
      "Molière",
      "Oscar Wilde"
    ],
    "correta": 1,
    "explicacao": "Shakespeare escreveu a tragédia por volta de 1595. Ela conta a história de dois jovens de famílias rivais."
  },
  {
    "id": "li-017",
    "categoria": "literatura",
    "dificuldade": "medio",
    "enunciado": "Qual autora brasileira escreveu Quarto de Despejo, diário de uma moradora de favela?",
    "alternativas": [
      "Carolina Maria de Jesus",
      "Conceição Evaristo",
      "Cecília Meireles",
      "Rachel de Queiroz"
    ],
    "correta": 0,
    "explicacao": "O livro foi publicado em 1960 e vendeu muito no Brasil e no exterior."
  },
  {
    "id": "li-018",
    "categoria": "literatura",
    "dificuldade": "dificil",
    "enunciado": "Qual poeta brasileiro escreveu o poema \"No meio do caminho\", de 1928?",
    "alternativas": [
      "Manuel Bandeira",
      "Carlos Drummond de Andrade",
      "João Cabral de Melo Neto",
      "Vinicius de Moraes"
    ],
    "correta": 1,
    "explicacao": "O poema de Drummond causou polêmica na época por sua repetição e simplicidade, e hoje é um clássico do Modernismo."
  },
  {
    "id": "li-019",
    "categoria": "literatura",
    "dificuldade": "dificil",
    "enunciado": "Qual escritora britânica escreveu Orgulho e Preconceito?",
    "alternativas": [
      "Charlotte Brontë",
      "Jane Austen",
      "Virginia Woolf",
      "Mary Shelley"
    ],
    "correta": 1,
    "explicacao": "Jane Austen publicou o romance em 1813. A história acompanha Elizabeth Bennet e o Sr. Darcy."
  },
  {
    "id": "li-020",
    "categoria": "literatura",
    "dificuldade": "dificil",
    "enunciado": "Qual romance gótico de 1818 conta a história de um cientista que dá vida a uma criatura?",
    "alternativas": [
      "Drácula",
      "Frankenstein",
      "O Médico e o Monstro",
      "O Retrato de Dorian Gray"
    ],
    "correta": 1,
    "explicacao": "Frankenstein foi escrito por Mary Shelley, e muita gente confunde o nome do cientista (Victor Frankenstein) com o da criatura."
  },
  {
    "id": "li-001",
    "categoria": "literatura",
    "dificuldade": "facil",
    "enunciado": "Quem escreveu o romance Dom Casmurro?",
    "alternativas": [
      "José de Alencar",
      "Machado de Assis",
      "Clarice Lispector",
      "Graciliano Ramos"
    ],
    "correta": 1,
    "explicacao": "Dom Casmurro, de 1899, é uma das obras mais importantes de Machado de Assis."
  },
  {
    "id": "li-002",
    "categoria": "literatura",
    "dificuldade": "facil",
    "enunciado": "Qual autor criou o detetive Sherlock Holmes?",
    "alternativas": [
      "Agatha Christie",
      "Arthur Conan Doyle",
      "Edgar Allan Poe",
      "Jules Verne"
    ],
    "correta": 1,
    "explicacao": "Sherlock Holmes apareceu pela primeira vez em 1887, em Um Estudo em Vermelho."
  },
  {
    "id": "li-003",
    "categoria": "literatura",
    "dificuldade": "facil",
    "enunciado": "Quem escreveu O Pequeno Príncipe?",
    "alternativas": [
      "Antoine de Saint-Exupéry",
      "Victor Hugo",
      "Jules Verne",
      "Lewis Carroll"
    ],
    "correta": 0,
    "explicacao": "O livro foi publicado em 1943 e é um dos mais traduzidos do mundo."
  },
  {
    "id": "li-004",
    "categoria": "literatura",
    "dificuldade": "medio",
    "enunciado": "Em Dom Quixote, qual é o nome do fiel escudeiro do protagonista?",
    "alternativas": [
      "Sancho Pança",
      "Rocinante",
      "Dulcineia",
      "Pedro Páramo"
    ],
    "correta": 0,
    "explicacao": "Rocinante é o cavalo e Dulcineia é a dama que Dom Quixote idealiza."
  },
  {
    "id": "li-005",
    "categoria": "literatura",
    "dificuldade": "medio",
    "enunciado": "Qual escritora brasileira escreveu A Hora da Estrela?",
    "alternativas": [
      "Cecília Meireles",
      "Clarice Lispector",
      "Rachel de Queiroz",
      "Lygia Fagundes Telles"
    ],
    "correta": 1,
    "explicacao": "A Hora da Estrela, de 1977, foi o último livro publicado por Clarice Lispector em vida."
  },
  {
    "id": "li-006",
    "categoria": "literatura",
    "dificuldade": "medio",
    "enunciado": "Quem é o autor de 1984 e A Revolução dos Bichos?",
    "alternativas": [
      "Aldous Huxley",
      "George Orwell",
      "Ray Bradbury",
      "H. G. Wells"
    ],
    "correta": 1,
    "explicacao": "George Orwell é o pseudônimo de Eric Arthur Blair."
  },
  {
    "id": "li-007",
    "categoria": "literatura",
    "dificuldade": "dificil",
    "enunciado": "Quem escreveu Grande Sertão: Veredas?",
    "alternativas": [
      "Graciliano Ramos",
      "João Guimarães Rosa",
      "Jorge Amado",
      "Euclides da Cunha"
    ],
    "correta": 1,
    "explicacao": "O romance, de 1956, narra a história do jagunço Riobaldo no sertão de Minas Gerais."
  },
  {
    "id": "li-008",
    "categoria": "literatura",
    "dificuldade": "dificil",
    "enunciado": "Qual obra de Gabriel García Márquez acompanha várias gerações da família Buendía?",
    "alternativas": [
      "O Amor nos Tempos do Cólera",
      "Cem Anos de Solidão",
      "Crônica de uma Morte Anunciada",
      "O Outono do Patriarca"
    ],
    "correta": 1,
    "explicacao": "Cem Anos de Solidão se passa na fictícia cidade de Macondo."
  },
  {
    "id": "li-009",
    "categoria": "literatura",
    "dificuldade": "dificil",
    "enunciado": "Qual poeta português escreveu Os Lusíadas?",
    "alternativas": [
      "Fernando Pessoa",
      "Luís de Camões",
      "Eça de Queirós",
      "José Saramago"
    ],
    "correta": 1,
    "explicacao": "Os Lusíadas, de 1572, é a grande epopeia da língua portuguesa e narra a viagem de Vasco da Gama."
  }
] as Pergunta[]
