import { dataLocalISO } from "../utils/formatacao.js";
import { AVATAR_PADRAO, avatarEhValido } from "../data/avatares.js";

/*
 * Único ponto de acesso ao LocalStorage do Quizio.
 * Os dados ficam só neste navegador (não sincronizam entre dispositivos),
 * podem ser apagados pelo usuário e NÃO são seguros nem servem como login.
 *
 * O nome da chave não muda entre versões; a versão do formato fica em
 * dados.versao. Quando o formato muda, migrar() converte os dados antigos.
 *
 * Proteções:
 *  - dados ilegíveis ganham uma cópia de segurança antes de qualquer regravação
 *  - dados de uma versão mais nova do Quizio nunca são sobrescritos
 *  - se o armazenamento estiver bloqueado, o app continua funcionando só em memória
 *
 * Formato do histórico (mais recente primeiro, no máximo 50 itens):
 *   { id, data, categoriaId, modoId, dificuldade, total, acertos, erros, pontuacao, xp, duracaoMs }
 * porCategoria:          { [categoriaId]: { partidas, respondidas, acertos, melhorPontuacao } }
 * perguntasPorCategoria: { [categoriaId]: quantidade de perguntas respondidas }
 * conquistas:            { [conquistaId]: "data ISO do desbloqueio" }
 * registroDePartidas:    ids das últimas partidas registradas (impede XP duplicado)
 */
const CHAVE_STORAGE = "quizio:v1";
const CHAVE_BACKUP = "quizio:v1:backup";

export const VERSAO_DOS_DADOS = 2;
export const LIMITE_HISTORICO = 50;
export const LIMITE_IDS_REGISTRADOS = 200;
export const TAMANHO_MAXIMO_NOME = 20;
export const NOME_PADRAO = "Jogador";

const status = { disponivel: true, gravacaoBloqueada: false, recuperadoDeErro: false };

/** Cria dados novos a cada chamada (evita compartilhar objetos entre usos). */
function criarDadosPadrao() {
  return {
    versao: VERSAO_DOS_DADOS,
    perfil: { nome: NOME_PADRAO, avatar: AVATAR_PADRAO, boasVindasExibida: false },
    preferencias: { som: false },
    progresso: { xp: 0 },
    estatisticas: {
      partidas: 0,
      perguntasRespondidas: 0,
      acertos: 0,
      melhorPontuacao: 0,
      melhorCombo: 0,
      partidasPerfeitas: 0,
      recordesSuperados: 0,
      porCategoria: {},
      perguntasPorCategoria: {},
    },
    historico: [],
    conquistas: {},
    missoes: { data: "", progresso: {}, resgatadas: {}, categoriasHoje: [] },
    desafioDiario: { ultimaData: "" },
    registroDePartidas: [],
  };
}

function ehObjetoSimples(valor) {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/**
 * Combina o que estava salvo com o formato padrão.
 * Valores ausentes ou com tipo errado voltam ao padrão.
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

// ---------- Validação ----------
function inteiroNaoNegativo(valor) {
  return Number.isFinite(valor) ? Math.max(0, Math.floor(valor)) : 0;
}

function filtrarEntradas(dicionario, aceitar) {
  const resultado = {};
  for (const [chave, valor] of Object.entries(dicionario)) {
    if (chave === "__proto__") continue;
    if (aceitar(valor)) resultado[chave] = valor;
  }
  return resultado;
}

function limparNome(valor) {
  return String(valor ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Corrige o que for inválido, sem descartar o progresso que estiver correto. */
function sanitizarDados(dados) {
  dados.perfil.nome = limparNome(dados.perfil.nome).slice(0, TAMANHO_MAXIMO_NOME) || NOME_PADRAO;
  if (!avatarEhValido(dados.perfil.avatar)) dados.perfil.avatar = AVATAR_PADRAO;

  dados.progresso.xp = inteiroNaoNegativo(dados.progresso.xp);

  const estatisticas = dados.estatisticas;
  for (const chave of [
    "partidas", "perguntasRespondidas", "acertos", "melhorPontuacao",
    "melhorCombo", "partidasPerfeitas", "recordesSuperados",
  ]) {
    estatisticas[chave] = inteiroNaoNegativo(estatisticas[chave]);
  }
  estatisticas.acertos = Math.min(estatisticas.acertos, estatisticas.perguntasRespondidas);
  estatisticas.porCategoria = filtrarEntradas(estatisticas.porCategoria, ehObjetoSimples);
  estatisticas.perguntasPorCategoria = filtrarEntradas(
    estatisticas.perguntasPorCategoria,
    (valor) => Number.isFinite(valor) && valor >= 0
  );

  dados.conquistas = filtrarEntradas(dados.conquistas, (valor) => typeof valor === "string");

  dados.missoes.progresso = filtrarEntradas(dados.missoes.progresso, (valor) => Number.isFinite(valor) && valor >= 0);
  dados.missoes.resgatadas = filtrarEntradas(dados.missoes.resgatadas, (valor) => typeof valor === "string");
  dados.missoes.categoriasHoje = dados.missoes.categoriasHoje.filter((id) => typeof id === "string");

  dados.historico = dados.historico
    .filter((partida) => ehObjetoSimples(partida) && typeof partida.id === "string")
    .slice(0, LIMITE_HISTORICO);
  dados.registroDePartidas = dados.registroDePartidas
    .filter((id) => typeof id === "string")
    .slice(-LIMITE_IDS_REGISTRADOS);
}

/** Converte dados de versões antigas para o formato atual. */
function migrar(dados, versaoSalva) {
  if (versaoSalva < 2) {
    // v1 -> v2: os campos novos (recordesSuperados, perguntasPorCategoria,
    // categoriasHoje) já entram com valor padrão na mesclagem. Aqui só
    // preenchemos a lista de partidas registradas com o histórico existente,
    // para que nenhuma partida antiga possa ser contada de novo.
    dados.registroDePartidas = dados.historico
      .map((partida) => partida.id)
      .filter((id) => typeof id === "string")
      .reverse();
  }
  dados.versao = VERSAO_DOS_DADOS;
}

/** Missões são diárias: se a data local mudou, o progresso e as recompensas recomeçam. */
export function reiniciarMissoesSeNecessario(dados) {
  const hoje = dataLocalISO();
  if (dados.missoes.data === hoje) return false;

  dados.missoes = { data: hoje, progresso: {}, resgatadas: {}, categoriasHoje: [] };
  return true;
}

// ---------- Leitura e gravação ----------
function lerTextoSalvo() {
  try {
    return localStorage.getItem(CHAVE_STORAGE);
  } catch (erro) {
    status.disponivel = false;
    return null;
  }
}

/** Guarda uma cópia do texto original para ele não ser perdido numa regravação. */
function guardarBackup(texto) {
  try {
    if (texto && !localStorage.getItem(CHAVE_BACKUP)) localStorage.setItem(CHAVE_BACKUP, texto);
  } catch (erro) {
    // sem armazenamento, não há como guardar a cópia
  }
}

function carregarDoStorage() {
  const texto = lerTextoSalvo();
  let salvo = null;

  if (texto) {
    try {
      salvo = JSON.parse(texto);
    } catch (erro) {
      console.warn("Quizio: dados salvos ilegíveis. Uma cópia foi guardada e o progresso recomeçou.", erro);
      guardarBackup(texto);
      status.recuperadoDeErro = true;
    }

    if (salvo !== null && !ehObjetoSimples(salvo)) {
      guardarBackup(texto);
      status.recuperadoDeErro = true;
      salvo = null;
    }
  }

  const versaoSalva = ehObjetoSimples(salvo) && Number.isFinite(salvo.versao) ? salvo.versao : 1;

  if (ehObjetoSimples(salvo) && versaoSalva > VERSAO_DOS_DADOS) {
    // Dados de uma versão mais nova: não sobrescreve, trabalha só em memória
    console.warn("Quizio: dados de uma versão mais nova encontrados. Alterações não serão salvas.");
    guardarBackup(texto);
    status.gravacaoBloqueada = true;
    salvo = null;
  }

  const dados = mesclarComPadrao(criarDadosPadrao(), salvo);
  sanitizarDados(dados);
  migrar(dados, versaoSalva);
  reiniciarMissoesSeNecessario(dados);
  return dados;
}

// Cópia em memória: também funciona se o LocalStorage estiver bloqueado
let cache = null;

function gravarNoStorage(dados) {
  if (status.gravacaoBloqueada) return;

  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
    status.disponivel = true;
  } catch (erro) {
    status.disponivel = false;
    console.warn("Quizio: não foi possível salvar os dados neste navegador.", erro);
  }
}

/** Situação do armazenamento (usada para avisar o jogador no perfil). */
export function obterStatusArmazenamento() {
  if (!cache) cache = carregarDoStorage();
  return { ...status };
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

/** Apaga todo o progresso (e a cópia de segurança) e volta ao estado da primeira visita. */
export function redefinirDados() {
  try {
    localStorage.removeItem(CHAVE_STORAGE);
    localStorage.removeItem(CHAVE_BACKUP);
  } catch (erro) {
    console.warn("Quizio: não foi possível apagar os dados salvos.", erro);
  }
  status.gravacaoBloqueada = false;
  status.recuperadoDeErro = false;
  cache = null;
  return obterDados();
}

// ---------- Perfil ----------
export function validarNome(nomeBruto) {
  const nome = limparNome(nomeBruto);

  if (nome.length < 2) {
    return { sucesso: false, mensagem: "Digite pelo menos 2 caracteres." };
  }
  if (nome.length > TAMANHO_MAXIMO_NOME) {
    return { sucesso: false, mensagem: `Use no máximo ${TAMANHO_MAXIMO_NOME} caracteres.` };
  }
  return { sucesso: true, nome };
}

/** Valida e salva o nome do jogador. */
export function definirNomeJogador(nomeBruto) {
  const validacao = validarNome(nomeBruto);
  if (!validacao.sucesso) return validacao;

  atualizarDados((dados) => {
    dados.perfil.nome = validacao.nome;
  });
  return validacao;
}

/** Valida e salva nome e avatar de uma só vez. */
export function salvarPerfil({ nome, avatar }) {
  const validacao = validarNome(nome);
  if (!validacao.sucesso) return validacao;

  if (!avatarEhValido(avatar)) {
    return { sucesso: false, mensagem: "Escolha um dos avatares disponíveis." };
  }

  atualizarDados((dados) => {
    dados.perfil.nome = validacao.nome;
    dados.perfil.avatar = avatar;
  });
  return { sucesso: true, nome: validacao.nome, avatar };
}

/** O desafio diário já foi concluído na data local de hoje? */
export function desafioDiarioConcluidoHoje() {
  return obterDados().desafioDiario.ultimaData === dataLocalISO();
}