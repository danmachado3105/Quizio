import { obterCategoriaPorId } from "../data/categorias.js";
import { calcularLimiteDePulos, obterModo, obterRegrasDoModo } from "../data/modos.js";
import {
  CATEGORIA_TODAS,
  DIFICULDADE_MISTA,
  DIFICULDADES,
  filtrarPerguntas,
  obterPerguntaPorId,
} from "../data/perguntas.js";
import { calcularPontosDaResposta, calcularXpDaPartida, ehPartidaPerfeita } from "../utils/pontuacao.js";
import { dataLocalISO } from "../utils/formatacao.js";
import { embaralhar, gerarId } from "../utils/sorteio.js";
import { obterDesafioDoDia } from "./desafio.js";
import { registrarPartida } from "./progresso.js";
import { desafioDiarioConcluidoHoje } from "./storage.js";

/*
 * Motor da partida. Guarda o estado no sessionStorage, então atualizar a
 * página não perde o jogo. As telas só chamam estas funções, sem fazer contas.
 * As regras de cada modo vêm de data/modos.js (campo "regras").
 *
 * Estado da partida:
 *   questoes   [{ id, ordem }]   ordem = posição embaralhada das alternativas
 *   indice     pergunta atual (rodada atual, no duelo)
 *   respostas  respostas do jogador do perfil
 *   convidado  só no duelo: { nome, respostas, pontuacao, combo, melhorCombo }
 *   pausadaEm / pausadoMs        pausa (o tempo parado não conta na duração)
 *   pulosUsados                  pulos já feitos (modo Clássico)
 *   perguntaIniciadaEm           início do relógio da pergunta (modo "Contra o tempo")
 *
 * Cada resposta: { perguntaId, dificuldade, escolhida, acertou, base, bonus,
 *   bonusTempo, pontos, motivo }. "escolhida" é null quando o jogador pulou
 *   ou o tempo acabou (motivo = "pulou" ou "tempo").
 */
const CHAVE_PARTIDA = "quizio:partida";
const CHAVE_RESULTADO = "quizio:resultado";

// Os outros modos entram aqui conforme a tela de jogo passa a suportá-los
export const MODOS_IMPLEMENTADOS = ["classico", "tempo", "sobrevivencia", "diario", "duelo"];
export const QUANTIDADES_PADRAO = [5, 10, 15, 20];
export const QUANTIDADE_MAXIMA = 20;

const LIMITE_DE_PERGUNTAS_DO_TREINO = 50;
const TOLERANCIA_DO_RELOGIO_MS = 300;
const NOME_DO_CONVIDADO = "Convidado";

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

// ---------- regras da partida ----------

/** Regras do modo desta partida. */
export function obterRegrasDaPartida(partida) {
  return obterRegrasDoModo(partida.config?.modoId);
}

/** Quantidades que o jogador pode escolher, de acordo com as perguntas disponíveis. */
export function calcularOpcoesDeQuantidade(disponiveis) {
  const opcoes = QUANTIDADES_PADRAO.filter((quantidade) => quantidade <= disponiveis);
  if (disponiveis > 0 && disponiveis < QUANTIDADE_MAXIMA && !opcoes.includes(disponiveis)) {
    opcoes.push(disponiveis);
  }
  return opcoes.sort((a, b) => a - b);
}

// ---------- configuração ----------
function normalizarConfig(bruta) {
  const modoId = bruta?.modoId ?? "classico";
  const modo = obterModo(modoId);

  if (!modo || !MODOS_IMPLEMENTADOS.includes(modoId)) {
    return { erro: "Este modo de jogo ainda não está disponível." };
  }
  const regras = modo.regras;

  // Desafio diário: tudo é definido pelo modo (e só vale uma vez por data)
  if (modoId === "diario") {
    if (desafioDiarioConcluidoHoje()) {
      return { erro: "Você já concluiu o desafio de hoje. Volte amanhã para um novo!" };
    }
    return {
      config: {
        categoriaId: CATEGORIA_TODAS,
        dificuldade: DIFICULDADE_MISTA,
        modoId,
        quantidade: regras.quantidadeFixa,
        dataDesafio: dataLocalISO(),
      },
    };
  }

  // Treino: uma lista de perguntas escolhidas (por exemplo, as que o jogador errou)
  if (Array.isArray(bruta?.perguntaIds)) {
    const ids = [...new Set(bruta.perguntaIds.filter((id) => typeof id === "string" && obterPerguntaPorId(id)))].slice(
      0,
      LIMITE_DE_PERGUNTAS_DO_TREINO
    );
    if (modoId !== "classico") return { erro: "O treino usa o modo Clássico." };
    if (ids.length === 0) return { erro: "Não há perguntas para treinar." };

    return {
      config: {
        categoriaId: CATEGORIA_TODAS,
        dificuldade: DIFICULDADE_MISTA,
        modoId,
        quantidade: ids.length,
        perguntaIds: ids,
        treino: true,
      },
    };
  }

  const categoriaId = bruta?.categoriaId;
  const dificuldade = bruta?.dificuldade;
  const categoriaValida = categoriaId === CATEGORIA_TODAS || Boolean(obterCategoriaPorId(categoriaId));
  const dificuldadeValida =
    dificuldade === DIFICULDADE_MISTA || DIFICULDADES.some((item) => item.id === dificuldade);
  const quantidade = Math.floor(Number(bruta?.quantidade));

  if (!categoriaValida) return { erro: "Escolha uma categoria válida." };
  if (!dificuldadeValida) return { erro: "Escolha uma dificuldade válida." };
  if (!regras.usaTodasAsPerguntas && (!Number.isFinite(quantidade) || quantidade < 1)) {
    return { erro: "Escolha a quantidade de perguntas." };
  }

  return {
    config: {
      categoriaId,
      dificuldade,
      modoId,
      quantidade: regras.usaTodasAsPerguntas ? 0 : quantidade,
    },
  };
}

// ---------- ciclo da partida ----------

/** Cria e salva uma nova partida. Retorna { partida } ou { erro }. */
export function criarPartida(configBruta) {
  const { config, erro } = normalizarConfig(configBruta);
  if (erro) return { erro };

  const regras = obterRegrasDoModo(config.modoId);
  let questoes;

  if (config.modoId === "diario") {
    questoes = obterDesafioDoDia(config.dataDesafio).questoes;
    if (questoes.length === 0) return { erro: "Não há perguntas para o desafio de hoje." };
  } else {
    const banco = config.perguntaIds
      ? config.perguntaIds.map((id) => obterPerguntaPorId(id)).filter(Boolean)
      : filtrarPerguntas(config);
    if (banco.length === 0) return { erro: "Não há perguntas para essa combinação." };

    // Respeita a disponibilidade: nunca sorteia mais do que existe
    const limite =
      regras.usaTodasAsPerguntas || config.perguntaIds
        ? banco.length
        : Math.min(config.quantidade, banco.length, QUANTIDADE_MAXIMA);

    questoes = embaralhar(banco)
      .slice(0, limite)
      // "ordem" guarda a posição embaralhada das alternativas (índices originais)
      .map((pergunta) => ({ id: pergunta.id, ordem: embaralhar([0, 1, 2, 3]) }));
  }

  const partida = {
    id: gerarId(),
    config: { ...config, quantidade: questoes.length },
    questoes,
    indice: 0,
    respostas: [],
    pontuacao: 0,
    combo: 0,
    melhorCombo: 0,
    iniciadaEm: Date.now(),
    pausadoMs: 0,
    pausadaEm: null,
    pulosUsados: 0,
    perguntaIniciadaEm: null,
    convidado:
      regras.jogadores === 2
        ? { nome: NOME_DO_CONVIDADO, respostas: [], pontuacao: 0, combo: 0, melhorCombo: 0 }
        : null,
  };

  removerSessao(CHAVE_RESULTADO);
  if (!gravarSessao(CHAVE_PARTIDA, partida)) {
    return { erro: "Não foi possível iniciar a partida neste navegador." };
  }
  return { partida };
}

function jogadorEhValido(jogador, partida) {
  return (
    Boolean(jogador) &&
    typeof jogador === "object" &&
    Array.isArray(jogador.respostas) &&
    jogador.respostas.length >= partida.indice &&
    jogador.respostas.length <= partida.indice + 1 &&
    [jogador.pontuacao, jogador.combo, jogador.melhorCombo].every(Number.isFinite)
  );
}

function partidaEhValida(partida) {
  if (!partida || typeof partida !== "object") return false;
  if (typeof partida.id !== "string" || typeof partida.config !== "object" || partida.config === null) return false;
  if (!Array.isArray(partida.questoes) || partida.questoes.length === 0) return false;
  if (!Array.isArray(partida.respostas)) return false;
  if (!Number.isInteger(partida.indice) || partida.indice < 0 || partida.indice >= partida.questoes.length) return false;
  if (partida.respostas.length < partida.indice || partida.respostas.length > partida.indice + 1) return false;
  if (![partida.pontuacao, partida.combo, partida.melhorCombo, partida.iniciadaEm].every(Number.isFinite)) return false;

  // Campos que podem não existir em partidas salvas por versões anteriores
  const pausadoValido =
    partida.pausadoMs === undefined || (Number.isFinite(partida.pausadoMs) && partida.pausadoMs >= 0);
  const pausadaEmValido =
    partida.pausadaEm === undefined || partida.pausadaEm === null || Number.isFinite(partida.pausadaEm);
  const pulosValidos =
    partida.pulosUsados === undefined || (Number.isInteger(partida.pulosUsados) && partida.pulosUsados >= 0);
  const relogioValido =
    partida.perguntaIniciadaEm === undefined ||
    partida.perguntaIniciadaEm === null ||
    Number.isFinite(partida.perguntaIniciadaEm);
  if (!pausadoValido || !pausadaEmValido || !pulosValidos || !relogioValido) return false;

  // Duelo: o convidado precisa existir e estar no mesmo ponto da rodada
  if (obterRegrasDaPartida(partida).jogadores === 2) {
    if (!jogadorEhValido(partida.convidado, partida)) return false;
    if (partida.convidado.respostas.length > partida.respostas.length) return false;
  }

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

  // Partidas salvas antes destes recursos não têm os campos
  partida.pausadoMs ??= 0;
  partida.pausadaEm ??= null;
  partida.pulosUsados ??= 0;
  partida.perguntaIniciadaEm ??= null;
  partida.convidado ??= null;
  return partida;
}

// ---------- rodada atual ----------

/**
 * De quem é a vez na pergunta atual:
 *   0    jogador do perfil
 *   1    convidado (só no duelo, depois de o jogador do perfil responder)
 *   null a rodada está completa (todos já responderam)
 */
export function obterVezDeJogar(partida) {
  if (partida.respostas.length <= partida.indice) return 0;
  if (partida.convidado && partida.convidado.respostas.length <= partida.indice) return 1;
  return null;
}

/** Todos os jogadores já responderam a pergunta atual? */
export function rodadaConcluida(partida) {
  return obterVezDeJogar(partida) === null;
}

/** Depois de a rodada completa, a partida acaba? (última pergunta ou fim no primeiro erro) */
function deveEncerrar(partida) {
  if (partida.indice + 1 >= partida.questoes.length) return true;

  const ultima = partida.respostas[partida.indice];
  return Boolean(obterRegrasDaPartida(partida).fimNoPrimeiroErro && ultima && !ultima.acertou);
}

/** Dados prontos para a tela: pergunta, alternativas na ordem exibida e respostas (se já respondida). */
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
    respostaConvidado: partida.convidado?.respostas[partida.indice] ?? null,
    vez: obterVezDeJogar(partida),
    numero: partida.indice + 1,
    total: partida.questoes.length,
  };
}

// ---------- relógio da pergunta (modo "Contra o tempo") ----------

/** Milissegundos que restam na pergunta atual, ou null se o modo não tem relógio ou ele ainda não começou. */
export function calcularRestanteMs(partida) {
  const regras = obterRegrasDaPartida(partida);
  if (!regras.temTempo || !partida.perguntaIniciadaEm) return null;

  const total = regras.limiteSegundos * 1000;
  return Math.max(0, total - (Date.now() - partida.perguntaIniciadaEm));
}

/**
 * Começa a contar o tempo da pergunta atual (só uma vez por pergunta).
 * O início fica salvo: atualizar a página não devolve tempo ao jogador.
 * Retorna o tempo restante em ms, ou null se o modo não tem relógio.
 */
export function iniciarRelogioDaPergunta(partida) {
  const regras = obterRegrasDaPartida(partida);
  if (!regras.temTempo || obterVezDeJogar(partida) !== 0) return null;

  if (!partida.perguntaIniciadaEm) {
    partida.perguntaIniciadaEm = Date.now();
    gravarSessao(CHAVE_PARTIDA, partida);
  }
  return calcularRestanteMs(partida);
}

// ---------- respostas ----------

/** Resposta sem alternativa escolhida (pulo ou tempo esgotado): vale 0 e zera o combo. */
function registrarSemEscolha(partida, motivo) {
  const pergunta = obterPerguntaPorId(partida.questoes[partida.indice].id);

  partida.combo = 0;
  const resposta = {
    perguntaId: pergunta.id,
    dificuldade: pergunta.dificuldade,
    escolhida: null,
    acertou: false,
    base: 0,
    bonus: 0,
    bonusTempo: 0,
    pontos: 0,
    motivo,
  };
  partida.respostas.push(resposta);
  gravarSessao(CHAVE_PARTIDA, partida);
  return resposta;
}

/**
 * Registra a resposta de quem está na vez (ver obterVezDeJogar).
 * Retorna null se não há ninguém na vez (rodada completa) ou se a partida está pausada.
 * No modo com tempo, responder depois do limite registra o tempo esgotado.
 */
export function responder(partida, posicaoExibida) {
  if (partida.pausadaEm) return null;

  const vez = obterVezDeJogar(partida);
  if (vez === null) return null;

  const regras = obterRegrasDaPartida(partida);
  const questao = partida.questoes[partida.indice];
  const pergunta = obterPerguntaPorId(questao.id);
  const escolhida = questao.ordem[posicaoExibida];
  if (escolhida === undefined) return null;

  let fracaoDeTempo = null;
  if (regras.temTempo) {
    iniciarRelogioDaPergunta(partida);
    const restante = calcularRestanteMs(partida);
    if (restante <= 0) return registrarSemEscolha(partida, "tempo");
    fracaoDeTempo = restante / (regras.limiteSegundos * 1000);
  }

  // "jogador" tem os mesmos campos nos dois casos: respostas, pontuacao, combo e melhorCombo
  const jogador = vez === 1 ? partida.convidado : partida;

  const acertou = escolhida === pergunta.correta;
  jogador.combo = acertou ? jogador.combo + 1 : 0;
  jogador.melhorCombo = Math.max(jogador.melhorCombo, jogador.combo);

  const pontos = acertou
    ? calcularPontosDaResposta({ dificuldade: pergunta.dificuldade, combo: jogador.combo, fracaoDeTempo })
    : { base: 0, bonus: 0, bonusTempo: 0, total: 0 };
  jogador.pontuacao += pontos.total;

  const resposta = {
    perguntaId: pergunta.id,
    dificuldade: pergunta.dificuldade,
    escolhida,
    acertou,
    base: pontos.base,
    bonus: pontos.bonus,
    bonusTempo: pontos.bonusTempo,
    pontos: pontos.total,
    motivo: null,
  };
  jogador.respostas.push(resposta);
  gravarSessao(CHAVE_PARTIDA, partida);
  return resposta;
}

/** Quantos pulos o jogador ainda pode usar nesta partida. */
export function calcularPulosRestantes(partida) {
  const limite = calcularLimiteDePulos(obterRegrasDaPartida(partida), partida.questoes.length);
  return Math.max(0, limite - partida.pulosUsados);
}

/**
 * Pula a pergunta atual: vale 0 ponto, zera o combo e conta como erro.
 * Retorna a resposta, ou null se o modo não permite, acabaram os pulos,
 * a partida está pausada ou a pergunta já foi respondida.
 */
export function pular(partida) {
  if (partida.pausadaEm || obterVezDeJogar(partida) !== 0) return null;
  if (calcularPulosRestantes(partida) <= 0) return null;

  partida.pulosUsados += 1;
  return registrarSemEscolha(partida, "pulou");
}

/**
 * Registra o tempo esgotado da pergunta atual (a tela chama quando o cronômetro chega a zero).
 * Retorna null se ainda há tempo (com uma pequena tolerância) ou se não se aplica.
 */
export function esgotarTempo(partida) {
  if (!obterRegrasDaPartida(partida).temTempo || obterVezDeJogar(partida) !== 0) return null;

  iniciarRelogioDaPergunta(partida);
  if (calcularRestanteMs(partida) > TOLERANCIA_DO_RELOGIO_MS) return null;

  return registrarSemEscolha(partida, "tempo");
}

/**
 * Passa para a próxima pergunta.
 * Retorna "proxima", "fim" (a partida acabou) ou null (a rodada ainda não está completa).
 */
export function avancar(partida) {
  if (!rodadaConcluida(partida)) return null;
  if (deveEncerrar(partida)) return "fim";

  partida.indice += 1;
  partida.perguntaIniciadaEm = null;
  gravarSessao(CHAVE_PARTIDA, partida);
  return "proxima";
}

// ---------- pausa e duração ----------

/** A partida está pausada? */
export function partidaEstaPausada(partida) {
  return Boolean(partida.pausadaEm);
}

/** Pausa a partida. Retorna false se já estava pausada ou se o modo não permite pausa. */
export function pausarPartida(partida) {
  if (partida.pausadaEm) return false;
  if (!obterRegrasDaPartida(partida).permitePausa) return false;

  partida.pausadaEm = Date.now();
  gravarSessao(CHAVE_PARTIDA, partida);
  return true;
}

/** Retoma a partida e soma o tempo parado. Retorna false se ela não estava pausada. */
export function retomarPartida(partida) {
  if (!partida.pausadaEm) return false;

  partida.pausadoMs = (partida.pausadoMs || 0) + Math.max(0, Date.now() - partida.pausadaEm);
  partida.pausadaEm = null;
  gravarSessao(CHAVE_PARTIDA, partida);
  return true;
}

/** Tempo realmente jogado, sem contar as pausas (inclusive a que estiver em andamento). */
export function calcularDuracaoMs(partida, agora = Date.now()) {
  const pausadoAgora = partida.pausadaEm ? Math.max(0, agora - partida.pausadaEm) : 0;
  return Math.max(0, agora - partida.iniciadaEm - (partida.pausadoMs || 0) - pausadoAgora);
}

// ---------- conclusão ----------

/** Conta, por categoria da pergunta, quantas foram respondidas e acertadas. */
function contarPorCategoriaDaPergunta(respostas) {
  const contagem = {};
  for (const resposta of respostas) {
    const categoria = obterPerguntaPorId(resposta.perguntaId)?.categoria;
    if (!categoria) continue;

    contagem[categoria] ??= { respondidas: 0, acertos: 0 };
    contagem[categoria].respondidas += 1;
    if (resposta.acertou) contagem[categoria].acertos += 1;
  }
  return contagem;
}

/** Versão enxuta da resposta, guardada no resultado para a revisão. */
function resumirResposta(resposta) {
  return {
    perguntaId: resposta.perguntaId,
    escolhida: resposta.escolhida,
    acertou: resposta.acertou,
    pontos: resposta.pontos,
    motivo: resposta.motivo ?? null,
  };
}

/** Resultado do duelo: quem venceu e o resumo do convidado (que não é salvo no perfil). */
function resumirDuelo(partida) {
  const convidado = partida.convidado;
  const acertosDoJogador = partida.respostas.filter((resposta) => resposta.acertou).length;
  const acertosDoConvidado = convidado.respostas.filter((resposta) => resposta.acertou).length;

  let vencedor = "empate";
  if (partida.pontuacao !== convidado.pontuacao) {
    vencedor = partida.pontuacao > convidado.pontuacao ? "jogador" : "convidado";
  } else if (acertosDoJogador !== acertosDoConvidado) {
    // desempate por acertos
    vencedor = acertosDoJogador > acertosDoConvidado ? "jogador" : "convidado";
  }

  return {
    vencedor,
    convidado: {
      nome: convidado.nome,
      pontuacao: convidado.pontuacao,
      acertos: acertosDoConvidado,
      erros: convidado.respostas.length - acertosDoConvidado,
      melhorCombo: convidado.melhorCombo,
      respostas: convidado.respostas.map(resumirResposta),
    },
  };
}

/**
 * Encerra a partida: calcula o resultado, grava o progresso permanente
 * (uma única vez) e guarda o resultado para a tela final.
 * Só o jogador do perfil recebe XP e estatísticas; o convidado do duelo
 * aparece apenas no resultado.
 */
export function concluirPartida(partida) {
  if (!rodadaConcluida(partida) || !deveEncerrar(partida)) return null;

  // Se esta partida já foi concluída (ex.: falha antes de limpar a sessão), reaproveita
  const existente = obterResultado();
  if (existente && existente.id === partida.id) {
    removerSessao(CHAVE_PARTIDA);
    return existente;
  }

  // Total = perguntas respondidas (na Sobrevivência, a partida pode acabar antes do fim da lista)
  const total = partida.respostas.length;
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
    duracaoMs: calcularDuracaoMs(partida),
    xp: xp.total,
    xpDetalhe: xp,
    perfeita: ehPartidaPerfeita(acertos, total),
    puladas: partida.respostas.filter((resposta) => resposta.motivo === "pulou").length,
    tempoEsgotado: partida.respostas.filter((resposta) => resposta.motivo === "tempo").length,
    respostas: partida.respostas.map(resumirResposta),
    duelo: partida.convidado ? resumirDuelo(partida) : null,
    perguntasPorCategoria: contarPorCategoriaDaPergunta(partida.respostas),
    notificado: false,
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

/** Marca que as notificações deste resultado já foram exibidas (não repetem ao recarregar). */
export function marcarResultadoNotificado() {
  const resultado = obterResultado();
  if (!resultado || resultado.notificado) return;

  resultado.notificado = true;
  gravarSessao(CHAVE_RESULTADO, resultado);
}

export function limparResultado() {
  removerSessao(CHAVE_RESULTADO);
}

// ---------- treino de erros ----------

/** Ids das perguntas que o jogador errou (ou pulou) nesta partida. */
export function obterIdsDasErradas(resultado) {
  return (resultado.respostas ?? []).filter((resposta) => !resposta.acertou).map((resposta) => resposta.perguntaId);
}

/** Nova partida só com as perguntas erradas do resultado. Retorna { partida } ou { erro }. */
export function criarPartidaDeTreino(resultado) {
  const ids = obterIdsDasErradas(resultado);
  if (ids.length === 0) return { erro: "Você não errou nenhuma pergunta nesta partida." };

  return criarPartida({ modoId: "classico", perguntaIds: ids });
}