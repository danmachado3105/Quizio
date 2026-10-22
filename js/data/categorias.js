/*
 * As 20 categorias do Quizio.
 *
 * Para criar uma categoria nova:
 *  1. adicione um objeto aqui (o "id" também será o nome do arquivo de perguntas)
 *  2. crie js/data/perguntas/<id>.js com as perguntas
 *  3. importe o arquivo em js/data/perguntas.js e inclua na lista PACOTES
 *
 * Campos:
 *  cor:      tom do ícone (roxo, coral, amarelo, escuro, verde)
 *  grupo:    usado nos filtros da página Explorar (ver GRUPOS)
 *  tags:     palavras extras para a busca
 *  novo:     mostra o selo "Novo"
 *  destaque: categorias em destaque da primeira versão do site
 */
export const GRUPOS = [
  { id: "saber", nome: "Ciência e saber" },
  { id: "mundo", nome: "Mundo e história" },
  { id: "cultura", nome: "Arte e cultura" },
  { id: "diversao", nome: "Diversão" },
];

export const CATEGORIAS = [
  { id: "conhecimentos-gerais", nome: "Conhecimentos gerais", descricao: "Um pouco de tudo para aquecer a mente.", icone: "lightbulb", cor: "amarelo", grupo: "diversao", tags: ["geral", "curiosidades", "variedades"], destaque: true },
  { id: "ciencia-espaco", nome: "Ciência e espaço", descricao: "Do átomo às galáxias.", icone: "rocket", cor: "roxo", grupo: "saber", tags: ["astronomia", "planetas", "física", "química", "universo"], destaque: true },
  { id: "historia", nome: "História", descricao: "Fatos e personagens que marcaram o mundo.", icone: "landmark", cor: "coral", grupo: "mundo", tags: ["guerras", "impérios", "antiguidade", "revoluções"], destaque: false },
  { id: "geografia", nome: "Geografia", descricao: "Países, capitais, mapas e paisagens.", icone: "globe", cor: "verde", grupo: "mundo", tags: ["países", "capitais", "rios", "continentes", "mapas"], destaque: false },
  { id: "filmes-series", nome: "Filmes e séries", descricao: "Cinema e TV para quem não perde um episódio.", icone: "film", cor: "coral", grupo: "cultura", tags: ["cinema", "tv", "oscar", "streaming"], destaque: true },
  { id: "musica", nome: "Música", descricao: "Artistas, gêneros e momentos marcantes.", icone: "music", cor: "roxo", grupo: "cultura", tags: ["bandas", "instrumentos", "cantores", "ritmos"], destaque: false },
  { id: "esportes", nome: "Esportes", descricao: "Modalidades, regras e grandes feitos.", icone: "medal", cor: "amarelo", grupo: "diversao", tags: ["futebol", "olimpíadas", "copa", "atletas"], destaque: false },
  { id: "games-nerd", nome: "Games e cultura nerd", descricao: "Consoles, personagens e universos fantásticos.", icone: "gamepad", cor: "escuro", grupo: "diversao", tags: ["videogame", "consoles", "anime", "rpg"], destaque: true },
  { id: "tecnologia", nome: "Tecnologia", descricao: "Computadores, internet e inovação.", icone: "cpu", cor: "roxo", grupo: "saber", tags: ["computação", "internet", "programação", "software"], destaque: false },
  { id: "literatura", nome: "Literatura", descricao: "Livros, autores e grandes histórias.", icone: "book-open", cor: "coral", grupo: "cultura", tags: ["livros", "autores", "poesia", "romances"], destaque: false },
  { id: "natureza-animais", nome: "Natureza e animais", descricao: "Bichos, plantas e ecossistemas.", icone: "leaf", cor: "verde", grupo: "saber", tags: ["bichos", "plantas", "ecologia", "biologia"], destaque: false },
  { id: "brasil", nome: "Curiosidades sobre o Brasil", descricao: "Cultura, lugares e histórias do nosso país.", icone: "map-pin", cor: "amarelo", grupo: "mundo", tags: ["cultura", "folclore", "estados", "regiões"], destaque: false },

  { id: "arte-arquitetura", nome: "Arte e arquitetura", descricao: "Pintores, esculturas, museus e construções famosas.", icone: "palette", cor: "coral", grupo: "cultura", tags: ["pintura", "escultura", "museus", "pintores"], novo: true },
  { id: "comida-culinaria", nome: "Comida e culinária", descricao: "Pratos, ingredientes e sabores do mundo todo.", icone: "utensils", cor: "amarelo", grupo: "cultura", tags: ["gastronomia", "receitas", "ingredientes", "pratos"], novo: true },
  { id: "corpo-humano", nome: "Corpo humano", descricao: "Órgãos, ossos e como tudo funciona por dentro.", icone: "heart", cor: "coral", grupo: "saber", tags: ["anatomia", "órgãos", "saúde", "biologia"], novo: true },
  { id: "mitologia-lendas", nome: "Mitologia e lendas", descricao: "Deuses, heróis e criaturas de várias culturas.", icone: "sparkles", cor: "roxo", grupo: "mundo", tags: ["deuses", "folclore", "heróis", "grécia"], novo: true },
  { id: "matematica-logica", nome: "Matemática e lógica", descricao: "Números, formas e raciocínio rápido.", icone: "calculator", cor: "escuro", grupo: "saber", tags: ["números", "geometria", "cálculo", "raciocínio"], novo: true },
  { id: "lingua-portuguesa", nome: "Língua portuguesa", descricao: "Gramática, ortografia e o sentido das palavras.", icone: "type", cor: "roxo", grupo: "cultura", tags: ["gramática", "ortografia", "palavras", "redação"], novo: true },
  { id: "economia-negocios", nome: "Economia e negócios", descricao: "Dinheiro, mercado e como a economia funciona.", icone: "trending-up", cor: "verde", grupo: "saber", tags: ["dinheiro", "finanças", "mercado", "empresas"], novo: true },
  { id: "datas-tradicoes", nome: "Datas e tradições", descricao: "Feriados, festas e comemorações pelo mundo.", icone: "calendar", cor: "amarelo", grupo: "mundo", tags: ["feriados", "festas", "comemorações", "calendário"], novo: true },
];

export function obterCategoriaPorId(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id) ?? null;
}