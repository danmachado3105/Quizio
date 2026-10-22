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
import arteArquitetura from "./perguntas/arte-arquitetura.js";
import comidaCulinaria from "./perguntas/comida-culinaria.js";
import corpoHumano from "./perguntas/corpo-humano.js";
import mitologiaLendas from "./perguntas/mitologia-lendas.js";
import matematicaLogica from "./perguntas/matematica-logica.js";
import linguaPortuguesa from "./perguntas/lingua-portuguesa.js";
import economiaNegocios from "./perguntas/economia-negocios.js";
import datasTradicoes from "./perguntas/datas-tradicoes.js";

/*
 * Banco de perguntas. Cada categoria tem seu arquivo em js/data/perguntas/.
 * Para adicionar perguntas, abra o arquivo da categoria e inclua um objeto com id único.
 * Este arquivo valida tudo ao carregar e ignora (com aviso no console) perguntas
 * malformadas, com id repetido ou com enunciado repetido.
 */
export const CATEGORIA_TODAS = "todas";
export const DIFICULDADE_MISTA = "misto";

export const DIFICULDADES = [
  { id: "facil", nome: "Fácil" },
  { id: "medio", nome: "Médio" },
  { id: "dificil", nome: "Difícil" },
];

// Lista de pacotes de conteúdo: um por categoria
const PACOTES = [
  conhecimentosGerais, cienciaEspaco, historia, geografia, filmesSeries, musica,
  esportes, gamesNerd, tecnologia, literatura, naturezaAnimais, brasil,
  arteArquitetura, comidaCulinaria, corpoHumano, mitologiaLendas,
  matematicaLogica, linguaPortuguesa, economiaNegocios, datasTradicoes,
];

const IDS_DE_CATEGORIA = new Set(CATEGORIAS.map((categoria) => categoria.id));
const IDS_DE_DIFICULDADE = new Set(DIFICULDADES.map((dificuldade) => dificuldade.id));

/** Texto sem acentos, pontuação ou diferença de maiúsculas, para comparar enunciados. */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Retorna o motivo pelo qual a pergunta é inválida, ou null se estiver tudo certo. */
function descreverProblema(pergunta, idsVistos, enunciadosVistos) {
  if (!pergunta || typeof pergunta !== "object") return "não é um objeto";
  if (typeof pergunta.id !== "string" || !pergunta.id) return "sem id";
  if (idsVistos.has(pergunta.id)) return "id repetido";
  if (!IDS_DE_CATEGORIA.has(pergunta.categoria)) return "categoria inexistente";
  if (!IDS_DE_DIFICULDADE.has(pergunta.dificuldade)) return "dificuldade inválida";
  if (typeof pergunta.enunciado !== "string" || !pergunta.enunciado.trim()) return "sem enunciado";
  if (enunciadosVistos.has(normalizar(pergunta.enunciado))) return "enunciado repetido";
  if (!Array.isArray(pergunta.alternativas) || pergunta.alternativas.length !== 4) return "precisa de 4 alternativas";
  if (pergunta.alternativas.some((texto) => typeof texto !== "string" || !texto.trim())) return "alternativa vazia";
  if (new Set(pergunta.alternativas.map(normalizar)).size !== 4) return "alternativas repetidas";
  if (!Number.isInteger(pergunta.correta) || pergunta.correta < 0 || pergunta.correta > 3) return "índice da resposta correta inválido";
  if (typeof pergunta.explicacao !== "string" || !pergunta.explicacao.trim()) return "sem explicação";
  return null;
}

function montarBanco() {
  const idsVistos = new Set();
  const enunciadosVistos = new Set();
  const validas = [];

  for (const pergunta of PACOTES.flat()) {
    const problema = descreverProblema(pergunta, idsVistos, enunciadosVistos);
    if (problema) {
      console.warn(`Quizio: pergunta ignorada (${pergunta?.id ?? "sem id"}): ${problema}.`);
      continue;
    }
    idsVistos.add(pergunta.id);
    enunciadosVistos.add(normalizar(pergunta.enunciado));
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

/** Contagem por categoria e dificuldade, para a página Explorar e para conferir o banco. */
export function contarPerguntasPorCategoriaEDificuldade() {
  const contagem = {};
  for (const pergunta of PERGUNTAS) {
    contagem[pergunta.categoria] ??= { facil: 0, medio: 0, dificil: 0 };
    contagem[pergunta.categoria][pergunta.dificuldade] += 1;
  }
  return contagem;
}

/**
 * Resumo do banco para conferência.
 * No console do navegador:
 *   import("./js/data/perguntas.js").then((m) => console.table(m.auditarBanco().porCategoria))
 */
export function auditarBanco() {
  const porCategoria = contarPerguntasPorCategoriaEDificuldade();
  const avisos = [];

  for (const categoria of CATEGORIAS) {
    const contagem = porCategoria[categoria.id];
    if (!contagem) {
      avisos.push(`${categoria.id}: nenhuma pergunta`);
      continue;
    }
    for (const dificuldade of DIFICULDADES) {
      if (contagem[dificuldade.id] < 3) avisos.push(`${categoria.id}: poucas perguntas em ${dificuldade.id}`);
    }
  }

  return { total: PERGUNTAS.length, porCategoria, avisos };
}