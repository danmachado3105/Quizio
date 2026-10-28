/*
 * Categoria: musica
 * Prefixo: mu
 * Próximo id livre: mu-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'mu-999', categoria: 'musica', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasMusica: Pergunta[] = [
  {
    "id": "mu-010",
    "categoria": "musica",
    "dificuldade": "facil",
    "enunciado": "Quantas são as notas musicais da escala (dó, ré, mi, fá, sol, lá, si)?",
    "alternativas": [
      "5",
      "6",
      "7",
      "8"
    ],
    "correta": 2,
    "explicacao": "São sete notas. Depois do si, a escala recomeça no dó, uma oitava acima."
  },
  {
    "id": "mu-011",
    "categoria": "musica",
    "dificuldade": "facil",
    "enunciado": "Qual destes instrumentos é tocado com baquetas?",
    "alternativas": [
      "Tambor",
      "Flauta",
      "Violino",
      "Harpa"
    ],
    "correta": 0,
    "explicacao": "Tambores e outros instrumentos de percussão, como a bateria, são tocados com baquetas."
  },
  {
    "id": "mu-012",
    "categoria": "musica",
    "dificuldade": "facil",
    "enunciado": "Qual cantora ficou conhecida como a Rainha do Pop?",
    "alternativas": [
      "Madonna",
      "Beyoncé",
      "Adele",
      "Rihanna"
    ],
    "correta": 0,
    "explicacao": "Madonna recebeu o título nos anos 1980, com sucessos como Like a Virgin e Vogue."
  },
  {
    "id": "mu-013",
    "categoria": "musica",
    "dificuldade": "facil",
    "enunciado": "Qual banda britânica tinha Freddie Mercury como vocalista?",
    "alternativas": [
      "The Rolling Stones",
      "Queen",
      "Led Zeppelin",
      "Pink Floyd"
    ],
    "correta": 1,
    "explicacao": "O Queen é autor de sucessos como Bohemian Rhapsody e We Are the Champions."
  },
  {
    "id": "mu-014",
    "categoria": "musica",
    "dificuldade": "medio",
    "enunciado": "Qual compositor austríaco escreveu A Flauta Mágica e o Réquiem?",
    "alternativas": [
      "Haydn",
      "Mozart",
      "Schubert",
      "Brahms"
    ],
    "correta": 1,
    "explicacao": "Wolfgang Amadeus Mozart foi um prodígio que começou a compor ainda criança."
  },
  {
    "id": "mu-015",
    "categoria": "musica",
    "dificuldade": "medio",
    "enunciado": "Qual cantor brasileiro ficou conhecido como o Rei do Baião?",
    "alternativas": [
      "Luiz Gonzaga",
      "Gilberto Gil",
      "Jackson do Pandeiro",
      "Dominguinhos"
    ],
    "correta": 0,
    "explicacao": "Luiz Gonzaga levou o baião, o xote e o xaxado do Nordeste para o resto do país."
  },
  {
    "id": "mu-016",
    "categoria": "musica",
    "dificuldade": "medio",
    "enunciado": "Qual é o ritmo jamaicano que Bob Marley ajudou a espalhar pelo mundo?",
    "alternativas": [
      "Ska",
      "Reggae",
      "Calipso",
      "Salsa"
    ],
    "correta": 1,
    "explicacao": "O reggae surgiu na Jamaica no fim dos anos 1960. Bob Marley foi seu maior embaixador."
  },
  {
    "id": "mu-017",
    "categoria": "musica",
    "dificuldade": "medio",
    "enunciado": "Qual artista ficou conhecido como o Rei do Rock?",
    "alternativas": [
      "Chuck Berry",
      "Elvis Presley",
      "Little Richard",
      "Buddy Holly"
    ],
    "correta": 1,
    "explicacao": "Elvis Presley fez sucesso a partir dos anos 1950 e popularizou o rock and roll."
  },
  {
    "id": "mu-018",
    "categoria": "musica",
    "dificuldade": "dificil",
    "enunciado": "Qual compositor alemão escreveu os Concertos de Brandemburgo?",
    "alternativas": [
      "Handel",
      "Johann Sebastian Bach",
      "Telemann",
      "Vivaldi"
    ],
    "correta": 1,
    "explicacao": "Bach concluiu os seis concertos em 1721 e os dedicou ao margrave de Brandemburgo."
  },
  {
    "id": "mu-019",
    "categoria": "musica",
    "dificuldade": "dificil",
    "enunciado": "Qual movimento musical brasileiro dos anos 1960 teve Caetano Veloso e Gilberto Gil como principais nomes?",
    "alternativas": [
      "Bossa Nova",
      "Tropicália",
      "Jovem Guarda",
      "Manguebit"
    ],
    "correta": 1,
    "explicacao": "A Tropicália misturou música brasileira, rock e experimentação, e foi muito debatida na época."
  },
  {
    "id": "mu-020",
    "categoria": "musica",
    "dificuldade": "dificil",
    "enunciado": "Qual compositor russo escreveu o balé O Lago dos Cisnes?",
    "alternativas": [
      "Stravinsky",
      "Tchaikovsky",
      "Rachmaninoff",
      "Prokofiev"
    ],
    "correta": 1,
    "explicacao": "Tchaikovsky também escreveu O Quebra-Nozes e A Bela Adormecida."
  },
  {
    "id": "mu-001",
    "categoria": "musica",
    "dificuldade": "facil",
    "enunciado": "Quantas cordas tem um violão comum?",
    "alternativas": [
      "Quatro",
      "Cinco",
      "Seis",
      "Oito"
    ],
    "correta": 2,
    "explicacao": "O violão tradicional tem seis cordas, afinadas em mi, lá, ré, sol, si e mi."
  },
  {
    "id": "mu-002",
    "categoria": "musica",
    "dificuldade": "facil",
    "enunciado": "Qual ritmo é mais associado aos desfiles de escolas de samba no Carnaval?",
    "alternativas": [
      "Samba",
      "Forró",
      "Axé",
      "Sertanejo"
    ],
    "correta": 0,
    "explicacao": "Os desfiles das escolas usam o samba-enredo, que conta a história do tema do ano."
  },
  {
    "id": "mu-003",
    "categoria": "musica",
    "dificuldade": "facil",
    "enunciado": "Qual destes instrumentos tem teclas brancas e pretas?",
    "alternativas": [
      "Piano",
      "Flauta",
      "Violino",
      "Bateria"
    ],
    "correta": 0,
    "explicacao": "No piano, cada tecla aciona um martelo que bate nas cordas."
  },
  {
    "id": "mu-004",
    "categoria": "musica",
    "dificuldade": "medio",
    "enunciado": "Quem compôs a Nona Sinfonia, que inclui o Hino à Alegria?",
    "alternativas": [
      "Mozart",
      "Beethoven",
      "Bach",
      "Chopin"
    ],
    "correta": 1,
    "explicacao": "Beethoven compôs a Nona Sinfonia quando já estava praticamente surdo."
  },
  {
    "id": "mu-005",
    "categoria": "musica",
    "dificuldade": "medio",
    "enunciado": "Qual banda lançou o álbum Abbey Road, em 1969?",
    "alternativas": [
      "The Rolling Stones",
      "Queen",
      "The Beatles",
      "Pink Floyd"
    ],
    "correta": 2,
    "explicacao": "A capa, com os quatro integrantes atravessando uma faixa de pedestres, ficou famosa no mundo todo."
  },
  {
    "id": "mu-006",
    "categoria": "musica",
    "dificuldade": "medio",
    "enunciado": "Qual cantor ficou conhecido como o Rei do Pop?",
    "alternativas": [
      "Elvis Presley",
      "Michael Jackson",
      "Prince",
      "Freddie Mercury"
    ],
    "correta": 1,
    "explicacao": "Michael Jackson é autor de Thriller, um dos álbuns mais vendidos da história."
  },
  {
    "id": "mu-007",
    "categoria": "musica",
    "dificuldade": "dificil",
    "enunciado": "Qual compositor brasileiro escreveu as Bachianas Brasileiras?",
    "alternativas": [
      "Carlos Gomes",
      "Heitor Villa-Lobos",
      "Tom Jobim",
      "Ernesto Nazareth"
    ],
    "correta": 1,
    "explicacao": "Villa-Lobos uniu a música de Bach ao folclore brasileiro nessa série de peças."
  },
  {
    "id": "mu-008",
    "categoria": "musica",
    "dificuldade": "dificil",
    "enunciado": "Qual movimento musical brasileiro teve João Gilberto e Tom Jobim como figuras centrais?",
    "alternativas": [
      "Tropicália",
      "Bossa Nova",
      "Jovem Guarda",
      "Samba-canção"
    ],
    "correta": 1,
    "explicacao": "A Bossa Nova surgiu no fim dos anos 1950, com violão suave e canto discreto."
  },
  {
    "id": "mu-009",
    "categoria": "musica",
    "dificuldade": "dificil",
    "enunciado": "Qual instrumento de uma única corda é símbolo da capoeira?",
    "alternativas": [
      "Cavaquinho",
      "Berimbau",
      "Viola",
      "Ukulele"
    ],
    "correta": 1,
    "explicacao": "O berimbau é um arco de madeira com uma corda de aço e uma cabaça que amplifica o som."
  }
] as Pergunta[]
