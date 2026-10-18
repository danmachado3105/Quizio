import { obterCategoriaPorId } from "../data/categorias.js";
import { MODOS } from "../data/modos.js";
import {
  CATEGORIA_TODAS,
  DIFICULDADE_MISTA,
  DIFICULDADES,
  filtrarPerguntas,
  obterPerguntaPorId,
} from "../data/perguntas.js";
import { calcularPontosDaResposta, calcularXpDaPartida, ehPartidaPerfeita } from "../utils/pontuacao.js";
import { embaralhar, gerarId } from "../utils/sorteio.js";
import { registrarPartida } from "./progresso.js";

/*
 * Motor da partida. Guarda o estado no sessionStorage, então atualizar a
 * página não perde o jogo. As telas só chamam estas funções, sem fazer contas.
 * Os modos extras (Etapa 4) reaproveitam este mesmo motor.
 */
const CHAVE_PARTIDA = "quizio:partida";
const CHAVE_RESULTADO = "quizio:resultado";

export const MODOS_IMPLEMENTADOS = ["classico"];
export const QUANTIDADES_PADRAO = [5, 10, 15, 20];
export const QUANTIDADE_MAXIMA = 20;

// ---------- sessionStorage ----------
function lerSessao(chave) {
  try {
    const texto = sessionStorage.getItem(chave);
    return texto ? JSON.parse(texto) : null;
  } catch (erro) {
    return null;
  }
}

function gravarSessao(chave, valor) {
  try {
    sessionStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.warn("Quizio: não foi possível salvar os dados temporários da partida.", erro);
    return false;
  }
}

function removerSessao(chave) {
  try {
    sessionStorage.removeItem(chave);
  } catch (erro) {
    // sem sessionStorage não há o que remover
  }
}

// ---------- configuração ----------

/** Quantidades que o jogador pode escolher, de acordo com as perguntas disponíveis. */
export function calcularOpcoesDeQuantidade(disponiveis) {
  const opcoes = QUANTIDADES_PADRAO.filter((quantidade) => quantidade <= disponiveis);
  if (disponiveis > 0 && disponiveis < QUANTIDADE_MAXIMA && !opcoes.includes(disponiveis)) {
    opcoes.push(disponiveis);
  }
  return opcoes.sort((a, b) => a - b);
}

function normalizarConfig(bruta) {
  const categoriaId = bruta?.categoriaId;
  const dificuldade = bruta?.dificuldade;
  const modoId = bruta?.modoId ?? "classico";

  const categoriaValida = categoriaId === CATEGORIA_TODAS || Boolean(obterCategoriaPorId(categoriaId));
  const dificuldadeValida =
    dificuldade === DIFICULDADE_MISTA || DIFICULDADES.some((item) => item.id === dificuldade);
  const quantidade = Math.floor(Number(bruta?.quantidade));

  if (!categoriaValida) return { erro: "Escolha uma categoria válida." };
  if (!dificuldadeValida) return { erro: "Escolha uma dificuldade válida." };
  if (!MODOS.some((modo) => modo.id === modoId) || !MODOS_IMPLEMENTADOS.includes(modoId)) {
    return { erro: "Este modo de jogo ainda não está disponível." };
  }
  if (!Number.isFinite(quantidade) || quantidade < 1) {
    return { erro: "Escolha a quantidade de perguntas." };
  }

  return { config: { categoriaId, dificuldade, modoId, quantidade } };
}

// ---------- ciclo da partida ----------

/** Cria e salva uma nova partida. Retorna { partida } ou { erro }. */
export function criarPartida(configBruta) {
  const { config, erro } = normalizarConfig(configBruta);
  if (erro) return { erro };

  const banco = filtrarPerguntas(config);
  if (banco.length === 0) return { erro: "Não há perguntas para essa combinação." };

  // Respeita a disponibilidade: nunca sorteia mais do que existe
  const quantidade = Math.min(config.quantidade, banco.length, QUANTIDADE_MAXIMA);
  const sorteadas = embaralhar(banco).slice(0, quantidade);

  const partida = {
    id: gerarId(),
    config: { ...config, quantidade },
    // "ordem" guarda a posição embaralhada das alternativas (índices originais)
    questoes: sorteadas.map((pergunta) => ({ id: pergunta.id, ordem: embaralhar([0, 1, 2, 3]) })),
    indice: 0,
    respostas: [],
    pontuacao: 0,
    combo: 0,
    melhorCombo: 0,
    iniciadaEm: Date.now(),
  };

  removerSessao(CHAVE_RESULTADO);
  if (!gravarSessao(CHAVE_PARTIDA, partida)) {
    return { erro: "Não foi possível iniciar a partida neste navegador." };
  }
  return { partida };
}

function partidaEhValida(partida) {
  if (!partida || typeof partida !== "object") return false;
  if (typeof partida.id !== "string" || typeof partida.config !== "object" || partida.config === null) return false;
  if (!Array.isArray(partida.questoes) || partida.questoes.length === 0) return false;
  if (!Array.isArray(partida.respostas)) return false;
  if (!Number.isInteger(partida.indice) || partida.indice < 0 || partida.indice >= partida.questoes.length) return false;
  if (partida.respostas.length < partida.indice || partida.respostas.length > partida.indice + 1) return false;
  if (![partida.pontuacao, partida.combo, partida.melhorCombo, partida.iniciadaEm].every(Number.isFinite)) return false;

  return partida.questoes.every(
    (questao) =>
      questao && obterPerguntaPorId(questao.id) && Array.isArray(questao.ordem) && questao.ordem.length === 4
  );
}

/** Partida em andamento (ou null). Dados inválidos são descartados. */
export function obterPartidaAtiva() {
  const partida = lerSessao(CHAVE_PARTIDA);
  if (!partidaEhValida(partida)) {
    if (partida) removerSessao(CHAVE_PARTIDA);
    return null;
  }
  return partida;
}

/** Dados prontos para a tela: pergunta, alternativas na ordem exibida e resposta (se já respondida). */
export function obterQuestaoAtual(partida) {
  const questao = partida.questoes[partida.indice];
  const pergunta = obterPerguntaPorId(questao.id);

  return {
    pergunta,
    alternativas: questao.ordem.map((indiceOriginal) => ({
      indiceOriginal,
      texto: pergunta.alternativas[indiceOriginal],
    })),
    resposta: partida.respostas[partida.indice] ?? null,
    numero: partida.indice + 1,
    total: partida.questoes.length,
  };
}

/**
 * Registra a resposta da pergunta atual. Retorna null se a pergunta já foi
 * respondida (protege contra cliques duplicados).
 */
export function responder(partida, posicaoExibida) {
  if (partida.respostas.length > partida.indice) return null;

  const questao = partida.questoes[partida.indice];
  const pergunta = obterPerguntaPorId(questao.id);
  const escolhida = questao.ordem[posicaoExibida];
  if (escolhida === undefined) return null;

  const acertou = escolhida === pergunta.correta;
  partida.combo = acertou ? partida.combo + 1 : 0;
  partida.melhorCombo = Math.max(partida.melhorCombo, partida.combo);

  const pontos = acertou
    ? calcularPontosDaResposta({ dificuldade: pergunta.dificuldade, combo: partida.combo })
    : { base: 0, bonus: 0, total: 0 };
  partida.pontuacao += pontos.total;

  const resposta = {
    perguntaId: pergunta.id,
    dificuldade: pergunta.dificuldade,
    escolhida,
    acertou,
    base: pontos.base,
    bonus: pontos.bonus,
    pontos: pontos.total,
  };
  partida.respostas.push(resposta);
  gravarSessao(CHAVE_PARTIDA, partida);
  return resposta;
}

/**
 * Passa para a próxima pergunta.
 * Retorna "proxima", "fim" (última pergunta respondida) ou null (ainda não respondeu).
 */
export function avancar(partida) {
  if (partida.respostas.length <= partida.indice) return null;
  if (partida.indice + 1 >= partida.questoes.length) return "fim";

  partida.indice += 1;
  gravarSessao(CHAVE_PARTIDA, partida);
  return "proxima";
}

/**
 * Encerra a partida: calcula o resultado, grava o progresso permanente
 * (uma única vez) e guarda o resultado para a tela final.
 */
export function concluirPartida(partida) {
  if (partida.respostas.length !== partida.questoes.length) return null;

  const total = partida.questoes.length;
  const acertos = partida.respostas.filter((resposta) => resposta.acertou).length;
  const xp = calcularXpDaPartida({ respostas: partida.respostas, total });

  const resultado = {
    id: partida.id,
    config: partida.config,
    total,
    acertos,
    erros: total - acertos,
    percentual: Math.round((acertos / total) * 100),
    pontuacao: partida.pontuacao,
    melhorCombo: partida.melhorCombo,
    duracaoMs: Math.max(0, Date.now() - partida.iniciadaEm),
    xp: xp.total,
    xpDetalhe: xp,
    perfeita: ehPartidaPerfeita(acertos, total),
    progresso: null,
  };

  resultado.progresso = registrarPartida(resultado);
  gravarSessao(CHAVE_RESULTADO, resultado);
  removerSessao(CHAVE_PARTIDA);
  return resultado;
}

/** Descarta a partida atual sem registrar nada (sem XP, sem histórico). */
export function abandonarPartida() {
  removerSessao(CHAVE_PARTIDA);
}

/** Resultado da última partida concluída (ou null). */
export function obterResultado() {
  const resultado = lerSessao(CHAVE_RESULTADO);
  const valido =
    resultado &&
    typeof resultado === "object" &&
    typeof resultado.id === "string" &&
    typeof resultado.config === "object" &&
    resultado.config !== null &&
    typeof resultado.xpDetalhe === "object" &&
    resultado.xpDetalhe !== null &&
    [resultado.total, resultado.acertos, resultado.erros, resultado.pontuacao, resultado.xp].every(Number.isFinite);

  return valido ? resultado : null;
}