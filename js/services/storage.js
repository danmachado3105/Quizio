import { dataLocalISO } from "../utils/formatacao.js";
import { AVATAR_PADRAO, avatarEhValido } from "../data/avatares.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { calcularMelhorSequencia, diaLocal, unirDias } from "../utils/sequencia.js";
import { semanaISOLocal } from "../utils/semana.js";

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
 *  - dados de versões anteriores ganham uma cópia antes da primeira migração
 *  - dados de uma versão mais nova do Quizio nunca são sobrescritos
 *  - se o armazenamento estiver bloqueado, o app continua funcionando só em memória
 *
 * Formato do histórico (mais recente primeiro, no máximo 50 itens):
 *   { id, data, categoriaId, modoId, dificuldade, total, acertos, erros, pontuacao, xp, duracaoMs }
 * porCategoria:          { [categoriaId]: { partidas, respondidas, acertos, melhorPontuacao } }
 * perguntasPorCategoria: { [categoriaId]: quantidade de perguntas respondidas }
 * conquistas:            { [conquistaId]: "data ISO do desbloqueio" }
 * registroDePartidas:    ids das últimas partidas registradas (impede XP duplicado)
 *
 * Versão 3:
 * favoritas:             ids das categorias favoritas
 * diasJogados:           dias locais ("AAAA-MM-DD") com pelo menos uma partida concluída
 * estatisticas.melhorSequencia: maior sequência de dias seguidos (guardada à parte)
 * preferencias.movimento: "sistema" (segue o aparelho) ou "reduzido"
 *
 * Versão 4 (modos de jogo):
 * estatisticas.melhorSobrevivencia:  mais acertos seguidos numa partida de Sobrevivência
 * estatisticas.melhorAcertosNoTempo: mais acertos numa partida "Contra o tempo"
 * estatisticas.duelosVencidos:       duelos locais em que o jogador do perfil venceu
 * estatisticas.diariosConcluidos:    desafios diários concluídos
 * estatisticas.partidasPorModo:      { [modoId]: partidas concluídas }
 * desafioDiario:   { ultimaData, acertos, total, pontuacao, xp, respostas } (para revisar o desafio do dia)
 * missoesSemanais: { semana, progresso, resgatadas } (renovam a cada semana ISO)
 */
export const VERSAO_DOS_DADOS = 4;
export const LIMITE_HISTORICO = 50;
export const LIMITE_IDS_REGISTRADOS = 200;
export const LIMITE_DIAS_JOGADOS = 400;
export const LIMITE_RESPOSTAS_DO_DIARIO = 20;
export const TAMANHO_MAXIMO_NOME = 20;
export const NOME_PADRAO = "Jogador";
export const MOVIMENTOS_VALIDOS = ["sistema", "reduzido"];

const CHAVE_STORAGE = "quizio:v1";
const CHAVE_BACKUP = "quizio:v1:backup";
// Cópia dos dados antes de migrar para a versão atual (feita uma única vez)
const CHAVE_BACKUP_MIGRACAO = `quizio:v1:pre-v${VERSAO_DOS_DADOS}`;
const CHAVES_DE_BACKUP_ANTIGAS = ["quizio:v1:pre-v3"];

const status = { disponivel: true, gravacaoBloqueada: false, recuperadoDeErro: false };

/** Cria dados novos a cada chamada (evita compartilhar objetos entre usos). */
function criarDadosPadrao() {
  return {
    versao: VERSAO_DOS_DADOS,
    perfil: { nome: NOME_PADRAO, avatar: AVATAR_PADRAO, boasVindasExibida: false },
    preferencias: { som: false, movimento: "sistema" },
    progresso: { xp: 0 },
    estatisticas: {
      partidas: 0,
      perguntasRespondidas: 0,
      acertos: 0,
      melhorPontuacao: 0,
      melhorCombo: 0,
      partidasPerfeitas: 0,
      recordesSuperados: 0,
      melhorSequencia: 0,
      melhorSobrevivencia: 0,
      melhorAcertosNoTempo: 0,
      duelosVencidos: 0,
      diariosConcluidos: 0,
      partidasPorModo: {},
      porCategoria: {},
      perguntasPorCategoria: {},
    },
    historico: [],
    conquistas: {},
    missoes: { data: "", progresso: {}, resgatadas: {}, categoriasHoje: [] },
    missoesSemanais: { semana: "", progresso: {}, resgatadas: {} },
    desafioDiario: { ultimaData: "", acertos: 0, total: 0, pontuacao: 0, xp: 0, respostas: [] },
    registroDePartidas: [],
    favoritas: [],
    diasJogados: [],
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

/** Mantém só ids de categorias que existem (ids antigos viram os atuais), sem repetir. */
function limparFavoritas(lista) {
  const favoritas = [];
  for (const id of lista) {
    if (typeof id !== "string") continue;
    const categoria = obterCategoriaPorId(id);
    if (categoria && !favoritas.includes(categoria.id)) favoritas.push(categoria.id);
  }
  return favoritas;
}

/** Resposta guardada para a revisão do desafio diário. */
function ehRespostaDoDiario(resposta) {
  return (
    ehObjetoSimples(resposta) &&
    typeof resposta.perguntaId === "string" &&
    (resposta.escolhida === null || (Number.isInteger(resposta.escolhida) && resposta.escolhida >= 0 && resposta.escolhida <= 3)) &&
    typeof resposta.acertou === "boolean"
  );
}

const numeroValido = (valor) => Number.isFinite(valor) && valor >= 0;
const textoValido = (valor) => typeof valor === "string";

/** Corrige o que for inválido, sem descartar o progresso que estiver correto. */
function sanitizarDados(dados) {
  dados.perfil.nome = limparNome(dados.perfil.nome).slice(0, TAMANHO_MAXIMO_NOME) || NOME_PADRAO;
  if (!avatarEhValido(dados.perfil.avatar)) dados.perfil.avatar = AVATAR_PADRAO;

  dados.preferencias.som = dados.preferencias.som === true;
  if (!MOVIMENTOS_VALIDOS.includes(dados.preferencias.movimento)) dados.preferencias.movimento = "sistema";

  dados.progresso.xp = inteiroNaoNegativo(dados.progresso.xp);

  const estatisticas = dados.estatisticas;
  for (const chave of [
    "partidas", "perguntasRespondidas", "acertos", "melhorPontuacao",
    "melhorCombo", "partidasPerfeitas", "recordesSuperados", "melhorSequencia",
    "melhorSobrevivencia", "melhorAcertosNoTempo", "duelosVencidos", "diariosConcluidos",
  ]) {
    estatisticas[chave] = inteiroNaoNegativo(estatisticas[chave]);
  }
  estatisticas.acertos = Math.min(estatisticas.acertos, estatisticas.perguntasRespondidas);
  estatisticas.partidasPorModo = filtrarEntradas(estatisticas.partidasPorModo, numeroValido);
  estatisticas.porCategoria = filtrarEntradas(estatisticas.porCategoria, ehObjetoSimples);
  estatisticas.perguntasPorCategoria = filtrarEntradas(estatisticas.perguntasPorCategoria, numeroValido);

  dados.conquistas = filtrarEntradas(dados.conquistas, textoValido);

  dados.missoes.progresso = filtrarEntradas(dados.missoes.progresso, numeroValido);
  dados.missoes.resgatadas = filtrarEntradas(dados.missoes.resgatadas, textoValido);
  dados.missoes.categoriasHoje = dados.missoes.categoriasHoje.filter(textoValido);

  dados.missoesSemanais.progresso = filtrarEntradas(dados.missoesSemanais.progresso, numeroValido);
  dados.missoesSemanais.resgatadas = filtrarEntradas(dados.missoesSemanais.resgatadas, textoValido);

  const diario = dados.desafioDiario;
  for (const chave of ["acertos", "total", "pontuacao", "xp"]) {
    diario[chave] = inteiroNaoNegativo(diario[chave]);
  }
  diario.respostas = diario.respostas.filter(ehRespostaDoDiario).slice(0, LIMITE_RESPOSTAS_DO_DIARIO);

  dados.historico = dados.historico
    .filter((partida) => ehObjetoSimples(partida) && typeof partida.id === "string")
    .slice(0, LIMITE_HISTORICO);
  dados.registroDePartidas = dados.registroDePartidas
    .filter(textoValido)
    .slice(-LIMITE_IDS_REGISTRADOS);

  dados.favoritas = limparFavoritas(dados.favoritas);

  // Dias jogados: válidos, sem repetição, em ordem e limitados. A melhor
  // sequência nunca diminui, mesmo se dias antigos forem cortados da lista.
  dados.diasJogados = unirDias(dados.diasJogados, [], LIMITE_DIAS_JOGADOS);
  estatisticas.melhorSequencia = Math.max(
    estatisticas.melhorSequencia,
    calcularMelhorSequencia(dados.diasJogados)
  );
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

  if (versaoSalva < 3) {
    // v2 -> v3: favoritas, diasJogados e melhorSequencia entram vazios na
    // mesclagem. Aproveitamos o histórico (partidas realmente concluídas)
    // para já preencher os dias jogados.
    if (dados.diasJogados.length === 0) {
      const diasDoHistorico = dados.historico
        .map((partida) => new Date(partida.data))
        .filter((data) => !Number.isNaN(data.getTime()))
        .map((data) => diaLocal(data));

      dados.diasJogados = unirDias([], diasDoHistorico, LIMITE_DIAS_JOGADOS);
      dados.estatisticas.melhorSequencia = Math.max(
        dados.estatisticas.melhorSequencia,
        calcularMelhorSequencia(dados.diasJogados)
      );
    }
  }

  // v3 -> v4: só campos novos (modos, desafio diário e missões semanais).
  // Todos entram com o valor padrão na mesclagem, então não há o que converter.

  dados.versao = VERSAO_DOS_DADOS;
}

/** Missões são diárias: se a data local mudou, o progresso e as recompensas recomeçam. */
export function reiniciarMissoesSeNecessario(dados) {
  const hoje = dataLocalISO();
  if (dados.missoes.data === hoje) return false;

  dados.missoes = { data: hoje, progresso: {}, resgatadas: {}, categoriasHoje: [] };
  return true;
}

/** Missões semanais: recomeçam a cada semana ISO (segunda-feira, horário local). */
export function reiniciarMissoesSemanaisSeNecessario(dados) {
  const semana = semanaISOLocal();
  if (dados.missoesSemanais.semana === semana) return false;

  dados.missoesSemanais = { semana, progresso: {}, resgatadas: {} };
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

/** Guarda uma cópia do texto original numa chave, só se ela ainda estiver vazia. */
function guardarCopia(chave, texto) {
  try {
    if (texto && !localStorage.getItem(chave)) localStorage.setItem(chave, texto);
  } catch (erro) {
    // sem armazenamento, não há como guardar a cópia
  }
}

/** Cópia de dados ilegíveis, para não serem perdidos numa regravação. */
function guardarBackup(texto) {
  guardarCopia(CHAVE_BACKUP, texto);
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
  } else if (ehObjetoSimples(salvo) && versaoSalva < VERSAO_DOS_DADOS) {
    // Dados de uma versão anterior: guarda uma cópia (uma vez) antes de migrar
    guardarCopia(CHAVE_BACKUP_MIGRACAO, texto);
  }

  const dados = mesclarComPadrao(criarDadosPadrao(), salvo);
  sanitizarDados(dados);
  migrar(dados, versaoSalva);
  reiniciarMissoesSeNecessario(dados);
  reiniciarMissoesSemanaisSeNecessario(dados);
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

/** Apaga todo o progresso (e as cópias de segurança) e volta ao estado da primeira visita. */
export function redefinirDados() {
  try {
    for (const chave of [CHAVE_STORAGE, CHAVE_BACKUP, CHAVE_BACKUP_MIGRACAO, ...CHAVES_DE_BACKUP_ANTIGAS]) {
      localStorage.removeItem(chave);
    }
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

// ---------- Desafio diário ----------

/** O desafio diário já foi concluído na data local de hoje? */
export function desafioDiarioConcluidoHoje() {
  return obterDados().desafioDiario.ultimaData === dataLocalISO();
}

/** Resultado do desafio de hoje (para revisar as respostas), ou null se ainda não foi concluído. */
export function obterResultadoDoDesafioDeHoje() {
  const diario = obterDados().desafioDiario;
  return diario.ultimaData === dataLocalISO() ? diario : null;
}

// ---------- Favoritas ----------

/** Ids das categorias favoritas (lista nova a cada chamada). */
export function obterFavoritas() {
  return [...obterDados().favoritas];
}

/**
 * Favorita ou desfavorita uma categoria. Aceita ids antigos (ex.: "filmes-series").
 * Retorna { sucesso, favorita } ou { sucesso: false, mensagem }.
 */
export function alternarFavorita(categoriaId) {
  const categoria = obterCategoriaPorId(categoriaId);
  if (!categoria) return { sucesso: false, mensagem: "Categoria não encontrada." };

  let favorita = false;
  atualizarDados((dados) => {
    const posicao = dados.favoritas.indexOf(categoria.id);
    if (posicao >= 0) {
      dados.favoritas.splice(posicao, 1);
    } else {
      dados.favoritas.push(categoria.id);
    }
    favorita = posicao < 0;
  });

  return { sucesso: true, favorita };
}