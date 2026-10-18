/*
 * As 12 categorias do Quizio.
 * cor: define o tom do ícone (roxo, coral, amarelo, escuro, verde)
 * destaque: aparece na página inicial
 */
export const CATEGORIAS = [
  { id: "conhecimentos-gerais", nome: "Conhecimentos gerais", descricao: "Um pouco de tudo para aquecer a mente.", icone: "lightbulb", cor: "amarelo", destaque: true },
  { id: "ciencia-espaco", nome: "Ciência e espaço", descricao: "Do átomo às galáxias.", icone: "rocket", cor: "roxo", destaque: true },
  { id: "historia", nome: "História", descricao: "Fatos e personagens que marcaram o mundo.", icone: "landmark", cor: "coral", destaque: false },
  { id: "geografia", nome: "Geografia", descricao: "Países, capitais, mapas e paisagens.", icone: "globe", cor: "verde", destaque: false },
  { id: "filmes-series", nome: "Filmes e séries", descricao: "Cinema e TV para quem não perde um episódio.", icone: "film", cor: "coral", destaque: true },
  { id: "musica", nome: "Música", descricao: "Artistas, gêneros e momentos marcantes.", icone: "music", cor: "roxo", destaque: false },
  { id: "esportes", nome: "Esportes", descricao: "Modalidades, regras e grandes feitos.", icone: "medal", cor: "amarelo", destaque: false },
  { id: "games-nerd", nome: "Games e cultura nerd", descricao: "Consoles, personagens e universos fantásticos.", icone: "gamepad", cor: "escuro", destaque: true },
  { id: "tecnologia", nome: "Tecnologia", descricao: "Computadores, internet e inovação.", icone: "cpu", cor: "roxo", destaque: false },
  { id: "literatura", nome: "Literatura", descricao: "Livros, autores e grandes histórias.", icone: "book-open", cor: "coral", destaque: false },
  { id: "natureza-animais", nome: "Natureza e animais", descricao: "Bichos, plantas e ecossistemas.", icone: "leaf", cor: "verde", destaque: false },
  { id: "brasil", nome: "Curiosidades sobre o Brasil", descricao: "Cultura, lugares e histórias do nosso país.", icone: "map-pin", cor: "amarelo", destaque: false },
];

export function obterCategoriaPorId(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id) ?? null;
}