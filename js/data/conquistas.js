import { calcularNivel } from "../utils/pontuacao.js";

/*
 * Conquistas. Cada uma tem uma função "condicao" que recebe os dados salvos
 * e devolve true somente quando o requisito foi realmente cumprido.
 */
export const CONQUISTAS = [
  {
    id: "primeira-partida",
    titulo: "Primeira partida",
    descricao: "Conclua sua primeira partida.",
    icone: "play",
    condicao: (dados) => dados.estatisticas.partidas >= 1,
  },
  {
    id: "dez-partidas",
    titulo: "Veterano",
    descricao: "Conclua 10 partidas.",
    icone: "flag",
    condicao: (dados) => dados.estatisticas.partidas >= 10,
  },
  {
    id: "combo-5",
    titulo: "Em chamas",
    descricao: "Acerte 5 respostas seguidas.",
    icone: "flame",
    condicao: (dados) => dados.estatisticas.melhorCombo >= 5,
  },
  {
    id: "partida-perfeita",
    titulo: "Sem errar nada",
    descricao: "Termine uma partida acertando todas as perguntas.",
    icone: "star",
    condicao: (dados) => dados.estatisticas.partidasPerfeitas >= 1,
  },
  {
    id: "explorador",
    titulo: "Explorador",
    descricao: "Jogue em 5 categorias diferentes.",
    icone: "compass",
    condicao: (dados) => Object.keys(dados.estatisticas.porCategoria).length >= 5,
  },
  {
    id: "nivel-5",
    titulo: "Nível 5",
    descricao: "Alcance o nível 5.",
    icone: "trending-up",
    condicao: (dados) => calcularNivel(dados.progresso.xp).nivel >= 5,
  },
];

export function obterConquistaPorId(id) {
  return CONQUISTAS.find((conquista) => conquista.id === id) ?? null;
}