/*
 * As 23 categorias do Quizio.
 *
 * Para criar uma categoria nova:
 *  1. adicione um objeto aqui (o "id" é também o nome do arquivo de perguntas)
 *  2. crie o emblema em js/utils/icones.js com a chave "cat-<id>"
 *  3. crie js/data/perguntas/<id>.js com as perguntas
 *  4. importe o arquivo em js/data/perguntas.js e inclua na lista PACOTES
 *
 * Campos:
 *  cor:   tom da caixa do ícone (roxo, coral, amarelo, escuro, verde)
 *  grupo: usado nos filtros da página Explorar (ver GRUPOS)
 *  tags:  palavras extras para a busca
 *  novo:  mostra o selo "Novo"
 */
export const GRUPOS: Grupo[] = [
  { id: "saber", nome: "Ciência e saber" },
  { id: "mundo", nome: "Mundo e história" },
  { id: "cultura", nome: "Arte e cultura" },
  { id: "diversao", nome: "Diversão" },
];

export const CATEGORIAS: Categoria[] = [
  { id: "conhecimentos-gerais", nome: "Conhecimentos gerais", descricao: "Um pouco de tudo para aquecer a mente.", icone: "cat-conhecimentos-gerais", cor: "amarelo", grupo: "diversao", tags: ["geral", "curiosidades", "variedades"] },
  { id: "ciencia-espaco", nome: "Ciência e espaço", descricao: "Do átomo às galáxias.", icone: "cat-ciencia-espaco", cor: "roxo", grupo: "saber", tags: ["astronomia", "planetas", "física", "química", "universo"] },
  { id: "historia", nome: "História", descricao: "Fatos e personagens que marcaram o mundo.", icone: "cat-historia", cor: "coral", grupo: "mundo", tags: ["guerras", "impérios", "antiguidade", "revoluções"] },
  { id: "geografia", nome: "Geografia", descricao: "Países, capitais, mapas e paisagens.", icone: "cat-geografia", cor: "verde", grupo: "mundo", tags: ["países", "capitais", "rios", "continentes", "mapas"] },
  { id: "filmes", nome: "Filmes", descricao: "Clássicos, blockbusters, diretores e prêmios.", icone: "cat-filmes", cor: "coral", grupo: "cultura", tags: ["cinema", "oscar", "diretores", "atores"] },
  { id: "series", nome: "Séries", descricao: "Séries de TV e streaming, de sitcoms a dramas.", icone: "cat-series", cor: "roxo", grupo: "cultura", tags: ["tv", "streaming", "netflix", "episódios"], novo: true },
  { id: "musica", nome: "Música", descricao: "Artistas, gêneros e momentos marcantes.", icone: "cat-musica", cor: "roxo", grupo: "cultura", tags: ["bandas", "instrumentos", "cantores", "ritmos"] },
  { id: "esportes", nome: "Esportes", descricao: "Modalidades, regras e grandes feitos.", icone: "cat-esportes", cor: "amarelo", grupo: "diversao", tags: ["futebol", "olimpíadas", "copa", "atletas"] },
  { id: "jogos", nome: "Jogos", descricao: "Consoles, personagens e clássicos dos videogames.", icone: "cat-jogos", cor: "escuro", grupo: "diversao", tags: ["videogame", "consoles", "nintendo", "playstation"] },
  { id: "animes", nome: "Animes", descricao: "Animes, mangás e estúdios do Japão.", icone: "cat-animes", cor: "amarelo", grupo: "diversao", tags: ["mangá", "japão", "otaku", "ghibli"], novo: true },
  { id: "tecnologia", nome: "Tecnologia", descricao: "Computadores, internet e inovação.", icone: "cat-tecnologia", cor: "roxo", grupo: "saber", tags: ["computação", "internet", "programação", "software"] },
  { id: "literatura", nome: "Literatura", descricao: "Livros, autores e grandes histórias.", icone: "cat-literatura", cor: "coral", grupo: "cultura", tags: ["livros", "autores", "poesia", "romances"] },
  { id: "natureza-animais", nome: "Natureza e animais", descricao: "Bichos, plantas e ecossistemas.", icone: "cat-natureza-animais", cor: "verde", grupo: "saber", tags: ["bichos", "plantas", "ecologia", "biologia"] },
  { id: "brasil", nome: "Curiosidades sobre o Brasil", descricao: "Cultura, lugares e histórias do nosso país.", icone: "cat-brasil", cor: "amarelo", grupo: "mundo", tags: ["cultura", "folclore", "estados", "regiões"] },
  { id: "arte-arquitetura", nome: "Arte e arquitetura", descricao: "Pintores, esculturas, museus e construções famosas.", icone: "cat-arte-arquitetura", cor: "coral", grupo: "cultura", tags: ["pintura", "escultura", "museus", "pintores"], novo: true },
  { id: "comida-culinaria", nome: "Comida e culinária", descricao: "Pratos, ingredientes e sabores do mundo todo.", icone: "cat-comida-culinaria", cor: "amarelo", grupo: "cultura", tags: ["gastronomia", "receitas", "ingredientes", "pratos"], novo: true },
  { id: "corpo-humano", nome: "Corpo humano", descricao: "Órgãos, ossos e como tudo funciona por dentro.", icone: "cat-corpo-humano", cor: "coral", grupo: "saber", tags: ["anatomia", "órgãos", "saúde", "biologia"], novo: true },
  { id: "mitologia-lendas", nome: "Mitologia e lendas", descricao: "Deuses, heróis e criaturas de várias culturas.", icone: "cat-mitologia-lendas", cor: "roxo", grupo: "mundo", tags: ["deuses", "folclore", "heróis", "grécia"], novo: true },
  { id: "matematica-logica", nome: "Matemática e lógica", descricao: "Números, formas e raciocínio rápido.", icone: "cat-matematica-logica", cor: "escuro", grupo: "saber", tags: ["números", "geometria", "cálculo", "raciocínio"], novo: true },
  { id: "lingua-portuguesa", nome: "Língua portuguesa", descricao: "Gramática, ortografia e o sentido das palavras.", icone: "cat-lingua-portuguesa", cor: "roxo", grupo: "cultura", tags: ["gramática", "ortografia", "palavras", "redação"], novo: true },
  { id: "economia-negocios", nome: "Economia e negócios", descricao: "Dinheiro, mercado e como a economia funciona.", icone: "cat-economia-negocios", cor: "verde", grupo: "saber", tags: ["dinheiro", "finanças", "mercado", "empresas"], novo: true },
  { id: "datas-tradicoes", nome: "Datas e tradições", descricao: "Feriados, festas e comemorações pelo mundo.", icone: "cat-datas-tradicoes", cor: "amarelo", grupo: "mundo", tags: ["feriados", "festas", "comemorações", "calendário"], novo: true },
  { id: "invencoes-descobertas", nome: "Invenções e descobertas", descricao: "Inventores, cientistas e descobertas que mudaram o mundo.", icone: "cat-invencoes-descobertas", cor: "roxo", grupo: "saber", tags: ["inventores", "cientistas", "descobertas", "patentes"], novo: true },
];

/*
 * Categorias que foram divididas. Dados salvos antes da divisão (histórico,
 * estatísticas) continuam apontando para o id antigo, que passa a valer como apelido.
 */
const APELIDOS_DE_CATEGORIAS: Record<string, string> = {
  "filmes-series": "filmes",
  "games-nerd": "jogos",
};

/** Converte um id antigo no id atual (ids atuais voltam iguais). */
export function resolverIdDaCategoria(id: string): string {
  return APELIDOS_DE_CATEGORIAS[id] ?? id;
}

export function obterCategoriaPorId(id: string): Categoria | null {
  const idAtual = resolverIdDaCategoria(id);
  return CATEGORIAS.find((categoria) => categoria.id === idAtual) ?? null;
}
import type { Categoria, Grupo } from '../tipos'
