import { CATEGORIAS } from "./categorias.js";

import conhecimentosGerais from "./perguntas/conhecimentos-gerais.js";
import cienciaEspaco from "./perguntas/ciencia-espaco.js";
import historia from "./perguntas/historia.js";
import geografia from "./perguntas/geografia.js";
import filmesSeries from "./perguntas/filmes-series.js";
import musica from "./perguntas/musica.js";
import esportes from "./perguntas/esportes.js";
import gamesNerd from "./perguntas/games-nerd.js";
import tecnologia from "./perguntas/tecnologia.js";
import literatura from "./perguntas/literatura.js";
import naturezaAnimais from "./perguntas/natureza-animais.js";
import brasil from "./perguntas/brasil.js";

/*
 * Para adicionar perguntas: abra o arquivo da categoria em js/data/perguntas/
 * e inclua um novo objeto com id único. Este arquivo valida tudo ao carregar
 * e ignora (com aviso no console) perguntas com algum problema.
 */
export const CATEGORIA_TODAS = "todas";
export const DIFICULDADE_MISTA = "misto";

export const DIFICULDADES = [
  { id: "facil", nome: "Fácil" },
  { id: "medio", nome: "Médio" },
  { id: "dificil", nome: "Difícil" },
];

const IDS_DE_CATEGORIA = new Set(CATEGORIAS.map((categoria) => categoria.id));
const IDS_DE_DIFICULDADE = new Set(DIFICULDADES.map((dificuldade) => dificuldade.id));

/** Retorna o motivo pelo qual a pergunta é inválida, ou null se estiver tudo certo. */
function descreverProblema(pergunta, idsVistos) {
  if (!pergunta || typeof pergunta !== "object") return "não é um objeto";
  if (typeof pergunta.id !== "string" || !pergunta.id) return "sem id";
  if (idsVistos.has(pergunta.id)) return "id repetido";
  if (!IDS_DE_CATEGORIA.has(pergunta.categoria)) return "categoria inexistente";
  if (!IDS_DE_DIFICULDADE.has(pergunta.dificuldade)) return "dificuldade inválida";
  if (typeof pergunta.enunciado !== "string" || !pergunta.enunciado.trim()) return "sem enunciado";
  if (!Array.isArray(pergunta.alternativas) || pergunta.alternativas.length !== 4) return "precisa de 4 alternativas";
  if (pergunta.alternativas.some((texto) => typeof texto !== "string" || !texto.trim())) return "alternativa vazia";
  if (new Set(pergunta.alternativas).size !== 4) return "alternativas repetidas";
  if (!Number.isInteger(pergunta.correta) || pergunta.correta < 0 || pergunta.correta > 3) return "índice da resposta correta inválido";
  if (typeof pergunta.explicacao !== "string" || !pergunta.explicacao.trim()) return "sem explicação";
  return null;
}

function montarBanco() {
  const brutas = [
    ...conhecimentosGerais, ...cienciaEspaco, ...historia, ...geografia,
    ...filmesSeries, ...musica, ...esportes, ...gamesNerd,
    ...tecnologia, ...literatura, ...naturezaAnimais, ...brasil,
  ];

  const idsVistos = new Set();
  const validas = [];

  for (const pergunta of brutas) {
    const problema = descreverProblema(pergunta, idsVistos);
    if (problema) {
      console.warn(`Quizio: pergunta ignorada (${pergunta?.id ?? "sem id"}): ${problema}.`);
      continue;
    }
    idsVistos.add(pergunta.id);
    validas.push(pergunta);
  }

  return validas;
}

export const PERGUNTAS = Object.freeze(montarBanco());

const PERGUNTAS_POR_ID = new Map(PERGUNTAS.map((pergunta) => [pergunta.id, pergunta]));

export function obterPerguntaPorId(id) {
  return PERGUNTAS_POR_ID.get(id) ?? null;
}

/** Perguntas que atendem à categoria e à dificuldade ("todas" e "misto" não filtram). */
export function filtrarPerguntas({ categoriaId = CATEGORIA_TODAS, dificuldade = DIFICULDADE_MISTA } = {}) {
  return PERGUNTAS.filter(
    (pergunta) =>
      (categoriaId === CATEGORIA_TODAS || pergunta.categoria === categoriaId) &&
      (dificuldade === DIFICULDADE_MISTA || pergunta.dificuldade === dificuldade)
  );
}

export function contarPerguntasPorCategoria() {
  const contagem = {};
  for (const pergunta of PERGUNTAS) {
    contagem[pergunta.categoria] = (contagem[pergunta.categoria] ?? 0) + 1;
  }
  return contagem;
}