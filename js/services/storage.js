import { dataLocalISO } from "../utils/formatacao.js";

/*
 * Único ponto de acesso ao LocalStorage do Quizio.
 * Os dados ficam só neste navegador e não sincronizam entre dispositivos.
 *
 * Formato de cada item de "historico" (mais recente primeiro):
 *   { categoriaId, modoId, pontuacao, acertos, total, data }  // data = ISO
 * Formato de "porCategoria": { [categoriaId]: { partidas, respondidas, acertos } }
 * Formato de "conquistas": { [conquistaId]: "data ISO do desbloqueio" }
 */
const CHAVE_STORAGE = "quizio:v1";
const LIMITE_HISTORICO = 50;

export const NOME_PADRAO = "Jogador";

/** Cria dados novos a cada chamada (evita compartilhar objetos entre usos). */
function criarDadosPadrao() {
  return {
    perfil: { nome: NOME_PADRAO, avatar: "roxo", boasVindasExibida: false },
    preferencias: { som: false },
    progresso: { xp: 0 },
    estatisticas: {
      partidas: 0,
      perguntasRespondidas: 0,
      acertos: 0,
      melhorPontuacao: 0,
      melhorCombo: 0,
      partidasPerfeitas: 0,
      porCategoria: {},
    },
    historico: [],
    conquistas: {},
    missoes: { data: "", progresso: {}, resgatadas: {} },
    desafioDiario: { ultimaData: "" },
  };
}

function ehObjetoSimples(valor) {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/**
 * Combina o que estava salvo com o formato padrão.
 * Valores ausentes ou com tipo errado voltam ao padrão, então dados
 * corrompidos nunca quebram a aplicação.
 */
function mesclarComPadrao(padrao, salvo) {
  if (Array.isArray(padrao)) {
    return Array.isArray(salvo) ? salvo : padrao;
  }

  if (ehObjetoSimples(padrao)) {
    const base = ehObjetoSimples(salvo) ? salvo : {};

    // Objeto vazio no padrão = dicionário de chaves dinâmicas (ex.: porCategoria)
    if (Object.keys(padrao).length === 0) {
      return { ...base };
    }

    const resultado = {};
    for (const chave of Object.keys(padrao)) {
      resultado[chave] = mesclarComPadrao(padrao[chave], base[chave]);
    }
    return resultado;
  }

  if (typeof padrao === "number") {
    return Number.isFinite(salvo) ? salvo : padrao;
  }

  return typeof salvo === typeof padrao ? salvo : padrao;
}

/** Garante que as missões do dia sejam as de hoje: muda a data, zera o progresso. */
function ajustarMissoesDoDia(dados) {
  const hoje = dataLocalISO();
  if (dados.missoes.data !== hoje) {
    dados.missoes = { data: hoje, progresso: {}, resgatadas: {} };
  }
}

function carregarDoStorage() {
  let salvo = null;
  try {
    const texto = localStorage.getItem(CHAVE_STORAGE);
    salvo = texto ? JSON.parse(texto) : null;
  } catch (erro) {
    console.warn("Quizio: não foi possível ler os dados salvos. Usando valores padrão.", erro);
  }

  const dados = mesclarComPadrao(criarDadosPadrao(), salvo);
  dados.perfil.nome = dados.perfil.nome.trim().slice(0, 20) || NOME_PADRAO;
  dados.historico = dados.historico
    .filter((partida) => ehObjetoSimples(partida))
    .slice(0, LIMITE_HISTORICO);
  ajustarMissoesDoDia(dados);
  return dados;
}

// Cópia em memória: também funciona se o LocalStorage estiver bloqueado
let cache = null;

function gravarNoStorage(dados) {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
  } catch (erro) {
    console.warn("Quizio: não foi possível salvar os dados neste navegador.", erro);
  }
}

/** Retorna uma cópia dos dados atuais. Para alterar, use atualizarDados(). */
export function obterDados() {
  if (!cache) cache = carregarDoStorage();
  return structuredClone(cache);
}

/**
 * Altera os dados de forma controlada:
 *   atualizarDados((dados) => { dados.progresso.xp += 10; });
 */
export function atualizarDados(alterador) {
  const dados = obterDados();
  alterador(dados);
  cache = dados;
  gravarNoStorage(cache);
  return structuredClone(cache);
}

/** Apaga todo o progresso e volta ao estado da primeira visita. */
export function redefinirDados() {
  try {
    localStorage.removeItem(CHAVE_STORAGE);
  } catch (erro) {
    console.warn("Quizio: não foi possível apagar os dados salvos.", erro);
  }
  cache = null;
  return obterDados();
}

/** Valida e salva o nome do jogador. */
export function definirNomeJogador(nomeBruto) {
  const nome = String(nomeBruto ?? "").replace(/\s+/g, " ").trim();

  if (nome.length < 2) {
    return { sucesso: false, mensagem: "Digite pelo menos 2 caracteres." };
  }
  if (nome.length > 20) {
    return { sucesso: false, mensagem: "Use no máximo 20 caracteres." };
  }

  atualizarDados((dados) => {
    dados.perfil.nome = nome;
  });
  return { sucesso: true, nome };
}

/** O desafio diário já foi concluído na data local de hoje? */
export function desafioDiarioConcluidoHoje() {
  return obterDados().desafioDiario.ultimaData === dataLocalISO();
}