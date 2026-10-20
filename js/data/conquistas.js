import { CATEGORIAS } from "./categorias.js";
import { calcularNivel } from "../utils/progressao.js";

/*
 * Conquistas. Cada uma declara:
 *  - meta: valor a atingir
 *  - atual(dados): valor atual, calculado a partir dos dados salvos
 * A conquista está concluída quando atual >= meta. Assim a mesma regra
 * serve para desbloquear e para mostrar o progresso das bloqueadas.
 *
 * Os ids das conquistas que já existiam foram mantidos para não perder
 * o progresso salvo.
 */
const numero = (valor) => (Number.isFinite(valor) ? valor : 0);

const categoriasJogadas = (dados) =>
  Object.keys(dados.estatisticas.porCategoria).filter((id) => id !== "todas").length;

const categoriasRespondidas = (dados) =>
  CATEGORIAS.filter((categoria) => numero(dados.estatisticas.perguntasPorCategoria[categoria.id]) > 0).length;

const DEFINICOES = [
  {
    id: "primeira-partida",
    titulo: "Primeiros Passos",
    descricao: "Conclua sua primeira partida.",
    icone: "play",
    meta: 1,
    atual: (dados) => dados.estatisticas.partidas,
  },
  {
    id: "aquecimento",
    titulo: "Aquecimento",
    descricao: "Responda a 10 perguntas.",
    icone: "zap",
    meta: 10,
    atual: (dados) => dados.estatisticas.perguntasRespondidas,
  },
  {
    id: "dez-partidas",
    titulo: "Maratonista",
    descricao: "Conclua 10 partidas.",
    icone: "flag",
    meta: 10,
    atual: (dados) => dados.estatisticas.partidas,
  },
  {
    id: "combo-5",
    titulo: "Mente Afiada",
    descricao: "Acerte 5 perguntas seguidas.",
    icone: "flame",
    meta: 5,
    atual: (dados) => dados.estatisticas.melhorCombo,
  },
  {
    id: "partida-perfeita",
    titulo: "Perfeição",
    descricao: "Termine uma partida de pelo menos 5 perguntas sem errar.",
    icone: "star",
    meta: 1,
    atual: (dados) => dados.estatisticas.partidasPerfeitas,
  },
  {
    id: "explorador",
    titulo: "Explorador",
    descricao: "Conclua partidas em 5 categorias diferentes.",
    icone: "compass",
    meta: 5,
    atual: categoriasJogadas,
  },
  {
    id: "curioso",
    titulo: "Curioso",
    descricao: `Responda a perguntas de todas as ${CATEGORIAS.length} categorias.`,
    icone: "globe",
    meta: CATEGORIAS.length,
    atual: categoriasRespondidas,
  },
  {
    id: "nivel-5",
    titulo: "Subindo de Nível",
    descricao: "Alcance o nível 5.",
    icone: "trending-up",
    meta: 5,
    atual: (dados) => calcularNivel(dados.progresso.xp).nivel,
  },
  {
    id: "recordista",
    titulo: "Recordista",
    descricao: "Supere o seu próprio recorde de pontuação em uma categoria.",
    icone: "trophy",
    meta: 1,
    atual: (dados) => dados.estatisticas.recordesSuperados,
  },
  {
    id: "placar-alto",
    titulo: "Placar Alto",
    descricao: "Faça 1.000 pontos em uma única partida.",
    icone: "medal",
    meta: 1000,
    atual: (dados) => dados.estatisticas.melhorPontuacao,
  },
  {
    id: "centenario",
    titulo: "Centenário",
    descricao: "Acerte 100 perguntas ao todo.",
    icone: "award",
    meta: 100,
    atual: (dados) => dados.estatisticas.acertos,
  },
];

/** Compara o valor atual com a meta. "atual" nunca passa da meta (para barras de progresso). */
export function avaliarConquista(conquista, dados) {
  const bruto = numero(Number(conquista.atual(dados)));
  return { atual: Math.min(bruto, conquista.meta), meta: conquista.meta, concluida: bruto >= conquista.meta };
}

export function estaConcluida(conquista, dados) {
  return avaliarConquista(conquista, dados).concluida;
}

export const CONQUISTAS = DEFINICOES.map((definicao) => ({
  ...definicao,
  condicao: (dados) => estaConcluida(definicao, dados),
}));

export function obterConquistaPorId(id) {
  return CONQUISTAS.find((conquista) => conquista.id === id) ?? null;
}