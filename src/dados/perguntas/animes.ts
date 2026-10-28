/*
 * Categoria: animes
 * Prefixo: an
 * Próximo id livre: an-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'an-999', categoria: 'animes', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasAnimes: Pergunta[] = [
  {
    "id": "an-001",
    "categoria": "animes",
    "dificuldade": "facil",
    "enunciado": "Qual anime acompanha o ninja Naruto Uzumaki, que sonha em ser o Hokage?",
    "alternativas": [
      "Bleach",
      "Naruto",
      "One Piece",
      "Dragon Ball"
    ],
    "correta": 1,
    "explicacao": "Hokage é o título do ninja mais forte e respeitado da Vila da Folha."
  },
  {
    "id": "an-002",
    "categoria": "animes",
    "dificuldade": "facil",
    "enunciado": "Qual é o nome do protagonista de Dragon Ball, que nasceu no planeta Vegeta e cresceu na Terra?",
    "alternativas": [
      "Vegeta",
      "Goku",
      "Gohan",
      "Piccolo"
    ],
    "correta": 1,
    "explicacao": "Goku é um saiyajin que foi enviado à Terra ainda bebê."
  },
  {
    "id": "an-003",
    "categoria": "animes",
    "dificuldade": "facil",
    "enunciado": "Qual anime tem Monkey D. Luffy, que quer se tornar o Rei dos Piratas?",
    "alternativas": [
      "One Piece",
      "Fairy Tail",
      "Naruto",
      "Hunter x Hunter"
    ],
    "correta": 0,
    "explicacao": "Luffy ganhou poderes de borracha ao comer uma Akuma no Mi."
  },
  {
    "id": "an-004",
    "categoria": "animes",
    "dificuldade": "facil",
    "enunciado": "Qual é o nome do Pokémon amarelo e elétrico que é o mascote da franquia?",
    "alternativas": [
      "Charmander",
      "Pikachu",
      "Squirtle",
      "Eevee"
    ],
    "correta": 1,
    "explicacao": "Pikachu é o companheiro de Ash, o treinador protagonista do anime."
  },
  {
    "id": "an-005",
    "categoria": "animes",
    "dificuldade": "facil",
    "enunciado": "Qual estúdio japonês criou filmes como A Viagem de Chihiro e Meu Vizinho Totoro?",
    "alternativas": [
      "Studio Ghibli",
      "Toei Animation",
      "Madhouse",
      "Bones"
    ],
    "correta": 0,
    "explicacao": "O Studio Ghibli foi fundado em 1985 por Hayao Miyazaki, Isao Takahata e Toshio Suzuki."
  },
  {
    "id": "an-006",
    "categoria": "animes",
    "dificuldade": "facil",
    "enunciado": "Qual anime mostra garotas que se transformam em guerreiras, lideradas por Usagi Tsukino?",
    "alternativas": [
      "Sakura Card Captors",
      "Sailor Moon",
      "Magic Knight Rayearth",
      "Pretty Cure"
    ],
    "correta": 1,
    "explicacao": "Em Sailor Moon, Usagi se transforma na guerreira que dá nome ao anime."
  },
  {
    "id": "an-007",
    "categoria": "animes",
    "dificuldade": "facil",
    "enunciado": "Como se chamam os quadrinhos japoneses que dão origem a muitos animes?",
    "alternativas": [
      "Mangá",
      "Manhwa",
      "Webtoon",
      "Cartum"
    ],
    "correta": 0,
    "explicacao": "Mangás são lidos da direita para a esquerda. Manhwa é o nome dos quadrinhos coreanos."
  },
  {
    "id": "an-008",
    "categoria": "animes",
    "dificuldade": "medio",
    "enunciado": "Qual anime acompanha os irmãos Edward e Alphonse Elric em busca da Pedra Filosofal?",
    "alternativas": [
      "Fullmetal Alchemist",
      "Soul Eater",
      "Black Clover",
      "D.Gray-man"
    ],
    "correta": 0,
    "explicacao": "Os irmãos tentam recuperar seus corpos depois de uma alquimia proibida dar errado."
  },
  {
    "id": "an-009",
    "categoria": "animes",
    "dificuldade": "medio",
    "enunciado": "Em Shingeki no Kyojin (Attack on Titan), qual ameaça obriga a humanidade a viver atrás de grandes muralhas?",
    "alternativas": [
      "Dragões",
      "Titãs",
      "Demônios",
      "Alienígenas"
    ],
    "correta": 1,
    "explicacao": "Os Titãs são gigantes que devoram humanos, e o protagonista Eren jura exterminá-los."
  },
  {
    "id": "an-010",
    "categoria": "animes",
    "dificuldade": "medio",
    "enunciado": "Qual anime tem como protagonista Tanjiro Kamado, que luta contra demônios?",
    "alternativas": [
      "Jujutsu Kaisen",
      "Demon Slayer (Kimetsu no Yaiba)",
      "Bleach",
      "Tokyo Ghoul"
    ],
    "correta": 1,
    "explicacao": "Tanjiro se torna caçador de demônios para salvar a irmã Nezuko."
  },
  {
    "id": "an-011",
    "categoria": "animes",
    "dificuldade": "medio",
    "enunciado": "Qual anime de esporte acompanha o time de vôlei de uma escola chamada Karasuno?",
    "alternativas": [
      "Haikyu!!",
      "Kuroko no Basket",
      "Slam Dunk",
      "Captain Tsubasa"
    ],
    "correta": 0,
    "explicacao": "Haikyu!! mostra a rotina e a evolução do time, com muita ênfase no trabalho em equipe."
  },
  {
    "id": "an-012",
    "categoria": "animes",
    "dificuldade": "medio",
    "enunciado": "Qual anime gira em torno de um caderno que mata quem tem o nome escrito nele?",
    "alternativas": [
      "Code Geass",
      "Death Note",
      "Monster",
      "Psycho-Pass"
    ],
    "correta": 1,
    "explicacao": "O estudante Light Yagami encontra o caderno e decide usá-lo para \"limpar\" o mundo."
  },
  {
    "id": "an-013",
    "categoria": "animes",
    "dificuldade": "medio",
    "enunciado": "Qual filme de Miyazaki conta a história de uma bruxinha de 13 anos que faz entregas montada em uma vassoura?",
    "alternativas": [
      "A Viagem de Chihiro",
      "O Serviço de Entregas da Kiki",
      "Ponyo",
      "O Castelo Animado"
    ],
    "correta": 1,
    "explicacao": "Kiki se muda para uma cidade litorânea e abre um serviço de entregas voando."
  },
  {
    "id": "an-014",
    "categoria": "animes",
    "dificuldade": "medio",
    "enunciado": "Qual é o nome do treinador protagonista da série original do anime Pokémon?",
    "alternativas": [
      "Ash Ketchum",
      "Gary Oak",
      "Brock",
      "Misty"
    ],
    "correta": 0,
    "explicacao": "Ash (Satoshi, no Japão) viaja pelo mundo com o Pikachu para se tornar um Mestre Pokémon."
  },
  {
    "id": "an-015",
    "categoria": "animes",
    "dificuldade": "dificil",
    "enunciado": "Quem é o autor do mangá Dragon Ball?",
    "alternativas": [
      "Eiichiro Oda",
      "Akira Toriyama",
      "Masashi Kishimoto",
      "Hajime Isayama"
    ],
    "correta": 1,
    "explicacao": "Akira Toriyama publicou Dragon Ball a partir de 1984. Oda criou One Piece e Kishimoto, Naruto."
  },
  {
    "id": "an-016",
    "categoria": "animes",
    "dificuldade": "dificil",
    "enunciado": "Qual é o nome da técnica de Goku que reúne a energia de todos os seres vivos em uma grande esfera?",
    "alternativas": [
      "Kamehameha",
      "Genkidama",
      "Kienzan",
      "Makankosappo"
    ],
    "correta": 1,
    "explicacao": "A Genkidama (Bomba de Energia) depende da energia de todos, inclusive dos inimigos."
  },
  {
    "id": "an-017",
    "categoria": "animes",
    "dificuldade": "dificil",
    "enunciado": "Qual é o nome do primeiro navio do bando do Chapéu de Palha, em One Piece?",
    "alternativas": [
      "Going Merry",
      "Thousand Sunny",
      "Moby Dick",
      "Red Force"
    ],
    "correta": 0,
    "explicacao": "O Going Merry foi substituído mais tarde pelo Thousand Sunny."
  },
  {
    "id": "an-018",
    "categoria": "animes",
    "dificuldade": "dificil",
    "enunciado": "Quem dirigiu o filme de animação Akira, de 1988?",
    "alternativas": [
      "Katsuhiro Otomo",
      "Mamoru Oshii",
      "Satoshi Kon",
      "Isao Takahata"
    ],
    "correta": 0,
    "explicacao": "Otomo também criou o mangá em que o filme se baseia, e Akira ajudou a divulgar o anime no Ocidente."
  },
  {
    "id": "an-019",
    "categoria": "animes",
    "dificuldade": "dificil",
    "enunciado": "Qual anime de 1998 acompanha o caçador de recompensas Spike Spiegel?",
    "alternativas": [
      "Trigun",
      "Cowboy Bebop",
      "Samurai Champloo",
      "Outlaw Star"
    ],
    "correta": 1,
    "explicacao": "Cowboy Bebop mistura ficção científica, faroeste e jazz, e é um dos animes mais premiados."
  },
  {
    "id": "an-020",
    "categoria": "animes",
    "dificuldade": "dificil",
    "enunciado": "Qual é o nome do garoto que pilota o Eva-01 em Neon Genesis Evangelion?",
    "alternativas": [
      "Shinji Ikari",
      "Kaworu Nagisa",
      "Gendo Ikari",
      "Toji Suzuhara"
    ],
    "correta": 0,
    "explicacao": "Shinji é filho de Gendo Ikari, o chefe da organização Nerv."
  }
] as Pergunta[]
