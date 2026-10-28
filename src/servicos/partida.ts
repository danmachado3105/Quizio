import { calcularLimiteDePulos, obterRegrasDoModo } from '../dados/modos'
import { obterCategoriaPorId } from '../dados/categorias'
import { calcularPontosDaResposta, calcularXpDaPartida, ehPartidaPerfeita } from '../utilitarios/pontuacao'
import { embaralhar, gerarId } from '../utilitarios/sorteio'
import { diaLocal } from '../utilitarios/sequencia'
import { obterDesafioDoDia } from './desafio'
import { obterPartidaEmAndamento, salvarPartidaEmAndamento, limparPartidaEmAndamento, obterUltimoResultado, salvarUltimoResultado, limparUltimoResultado } from './sessao'
import { registrarPartida, type EfeitosDaPartida } from './progresso'
import { obterDados } from './armazenamento'
import type { DadosQuizio, Dificuldade, ModoId, Pergunta, RespostaPartida } from '../tipos'

export const QUANTIDADES_PADRAO = [5, 10, 15, 20]
export const QUANTIDADE_MAXIMA = 20
const MAXIMO_TREINO = 50
const JANELA_TOLERANCIA_RELOGIO = 300

export interface ConfigPartida {
  categoriaId: string; dificuldade: Dificuldade; modoId: ModoId; quantidade: number
  dataDesafio?: string; perguntaIds?: string[]; treino?: boolean
}
export interface QuestaoPartida { id: string; ordem: [number, number, number, number] }
interface Participante { nome: string; respostas: RespostaPartida[]; pontuacao: number; combo: number; melhorCombo: number }
export interface Partida {
  id: string; config: ConfigPartida; questoes: QuestaoPartida[]; indice: number; respostas: RespostaPartida[]
  pontuacao: number; combo: number; melhorCombo: number; iniciadaEm: number; pausadoMs: number
  pausadaEm: number | null; pulosUsados: number; perguntaIniciadaEm: number | null; convidado: Participante | null
}
export interface ResultadoFinal {
  id: string; config: ConfigPartida; total: number; acertos: number; erros: number; percentual: number
  pontuacao: number; melhorCombo: number; duracaoMs: number; xp: number
  xpDetalhe: ReturnType<typeof calcularXpDaPartida>; perfeita: boolean; puladas: number; tempoEsgotado: number
  respostas: RespostaPartida[]
  duelo: { vencedor: string; convidado: { nome: string; pontuacao: number; acertos: number; respostas: RespostaPartida[] } } | null
  perguntasPorCategoria: Record<string, { respondidas: number; acertos: number }>
  notificado: boolean; progresso: EfeitosDaPartida | null
}

export function calcularOpcoesDeQuantidade(disponiveis: number): number[] {
  const opcoes = QUANTIDADES_PADRAO.filter((quantidade) => quantidade <= disponiveis)
  if (disponiveis > 0 && disponiveis < QUANTIDADE_MAXIMA && !opcoes.includes(disponiveis)) opcoes.push(disponiveis)
  return opcoes.sort((a, b) => a - b)
}

function configValida(config: ConfigPartida, perguntas: readonly Pergunta[], hoje: string): { config?: ConfigPartida; erro?: string } {
  if (config.modoId === 'diario') {
    const dados: DadosQuizio = obterDados()
    if (dados.desafioDiario.ultimaData === hoje) return { erro: 'Você já concluiu o desafio de hoje. Volte amanhã para um novo!' }
    return { config: { categoriaId: 'todas', dificuldade: 'misto', modoId: 'diario', quantidade: 5, dataDesafio: hoje } }
  }
  if (!['classico', 'tempo', 'sobrevivencia', 'duelo'].includes(config.modoId)) return { erro: 'Este modo de jogo ainda não está disponível.' }
  let banco: Pergunta[]
  if (config.perguntaIds) {
    if (config.modoId !== 'classico') return { erro: 'O treino usa o modo Clássico.' }
    banco = [...new Set(config.perguntaIds)].map((id) => perguntas.find((pergunta) => pergunta.id === id)).filter((pergunta): pergunta is Pergunta => Boolean(pergunta)).slice(0, MAXIMO_TREINO)
    if (banco.length === 0) return { erro: 'Não há perguntas para treinar.' }
    return { config: { categoriaId: 'todas', dificuldade: 'misto', modoId: 'classico', quantidade: banco.length, perguntaIds: banco.map((p) => p.id), treino: true } }
  }
  const categoriaId = config.categoriaId === 'filmes-series' ? 'filmes' : config.categoriaId === 'games-nerd' ? 'jogos' : config.categoriaId
  if (categoriaId !== 'todas' && !obterCategoriaPorId(categoriaId)) return { erro: 'Escolha uma categoria válida.' }
  if (!['facil', 'medio', 'dificil', 'misto'].includes(config.dificuldade)) return { erro: 'Escolha uma dificuldade válida.' }
  banco = perguntas.filter((pergunta) => (categoriaId === 'todas' || pergunta.categoria === categoriaId) && (config.dificuldade === 'misto' || pergunta.dificuldade === config.dificuldade))
  if (banco.length === 0) return { erro: 'Não há perguntas para essa combinação.' }
  const regras = obterRegrasDoModo(config.modoId)
  if (!regras.usaTodasAsPerguntas && (!Number.isFinite(config.quantidade) || config.quantidade < 1)) return { erro: 'Escolha a quantidade de perguntas.' }
  const quantidade = regras.usaTodasAsPerguntas ? banco.length : Math.min(QUANTIDADE_MAXIMA, Math.max(1, Math.floor(config.quantidade)), banco.length)
  return { config: { ...config, categoriaId, quantidade } }
}

function embaralharIndices(aleatorio: () => number): [number, number, number, number] {
  return embaralhar([0, 1, 2, 3] as const, aleatorio) as [number, number, number, number]
}

export function criarPartida(config: ConfigPartida, perguntas: readonly Pergunta[], opcoes: { hoje?: string; agora?: number; aleatorio?: () => number } = {}) {
  const hoje = opcoes.hoje ?? diaLocal()
  const agora = opcoes.agora ?? Date.now()
  const aleatorio = opcoes.aleatorio ?? Math.random
  if (config.modoId === 'diario') {
    const diario = obterDesafioDoDia(perguntas, hoje)
    if (diario.questoes.length === 0) return { erro: 'Não há perguntas para o desafio de hoje.' }
    config = { categoriaId: 'todas', dificuldade: 'misto', modoId: 'diario', quantidade: diario.questoes.length, dataDesafio: hoje }
    const estado = criarEstado(config, diario.questoes, agora)
    limparUltimoResultado()
    salvarPartidaEmAndamento(estado)
    return { partida: estado }
  }
  const normalizada = configValida(config, perguntas, hoje)
  if (!normalizada.config) return { erro: normalizada.erro ?? 'Configuração inválida.' }
  config = normalizada.config
  const selecionadas = config.perguntaIds
    ? config.perguntaIds.map((id) => perguntas.find((p) => p.id === id)).filter((p): p is Pergunta => Boolean(p))
    : perguntas.filter((pergunta) => (config.categoriaId === 'todas' || pergunta.categoria === config.categoriaId) && (config.dificuldade === 'misto' || pergunta.dificuldade === config.dificuldade))
  const regras = obterRegrasDoModo(config.modoId)
  const questoes = embaralhar(selecionadas, aleatorio).slice(0, regras.usaTodasAsPerguntas ? selecionadas.length : Math.min(config.quantidade, selecionadas.length)).map((pergunta) => ({ id: pergunta.id, ordem: embaralharIndices(aleatorio) }))
  if (questoes.length === 0) return { erro: 'Não há perguntas para essa combinação.' }
  const estado = criarEstado({ ...config, quantidade: questoes.length }, questoes, agora)
  limparUltimoResultado()
  salvarPartidaEmAndamento(estado)
  return { partida: estado }
}

function criarEstado(config: ConfigPartida, questoes: QuestaoPartida[], agora: number): Partida {
  const duelo = config.modoId === 'duelo'
  return {
    id: gerarId(), config, questoes, indice: 0, respostas: [], pontuacao: 0, combo: 0, melhorCombo: 0,
    iniciadaEm: agora, pausadoMs: 0, pausadaEm: null, pulosUsados: 0, perguntaIniciadaEm: null,
    convidado: duelo ? { nome: 'Convidado', respostas: [], pontuacao: 0, combo: 0, melhorCombo: 0 } : null,
  }
}

export function salvarPartida(partida: Partida): void { salvarPartidaEmAndamento(partida) }

function ehObjeto(valor: unknown): valor is Record<string, unknown> { return typeof valor === 'object' && valor !== null && !Array.isArray(valor) }
function ehResposta(valor: unknown): valor is RespostaPartida {
  if (!ehObjeto(valor)) return false
  return typeof valor.perguntaId === 'string' && (valor.escolhida === null || (Number.isInteger(valor.escolhida) && Number(valor.escolhida) >= 0 && Number(valor.escolhida) <= 3)) && typeof valor.acertou === 'boolean' && typeof valor.pontos === 'number' && Number.isFinite(valor.pontos) && ['facil', 'medio', 'dificil'].includes(String(valor.dificuldade)) && (valor.motivo === null || valor.motivo === 'pulou' || valor.motivo === 'tempo')
}
function ehParticipante(valor: unknown): valor is Participante {
  if (!ehObjeto(valor) || typeof valor.nome !== 'string' || !Array.isArray(valor.respostas) || !valor.respostas.every(ehResposta)) return false
  return [valor.pontuacao, valor.combo, valor.melhorCombo].every((numero) => typeof numero === 'number' && Number.isFinite(numero))
}
function ehPartida(valor: unknown, perguntas: readonly Pergunta[]): valor is Partida {
  if (!ehObjeto(valor) || typeof valor.id !== 'string' || !ehObjeto(valor.config)) return false
  if (!['classico', 'tempo', 'sobrevivencia', 'diario', 'duelo'].includes(String(valor.config.modoId))) return false
  if (!Array.isArray(valor.questoes) || valor.questoes.length === 0 || !Array.isArray(valor.respostas) || !valor.respostas.every(ehResposta)) return false
  if (!Number.isInteger(valor.indice) || Number(valor.indice) < 0 || Number(valor.indice) >= valor.questoes.length) return false
  if (valor.respostas.length < Number(valor.indice) || valor.respostas.length > Number(valor.indice) + 1) return false
  if (![valor.pontuacao, valor.combo, valor.melhorCombo, valor.iniciadaEm].every((numero) => typeof numero === 'number' && Number.isFinite(numero))) return false
  if (valor.pausadoMs !== undefined && (typeof valor.pausadoMs !== 'number' || valor.pausadoMs < 0)) return false
  if (valor.pausadaEm !== undefined && valor.pausadaEm !== null && typeof valor.pausadaEm !== 'number') return false
  if (valor.pulosUsados !== undefined && (!Number.isInteger(valor.pulosUsados) || Number(valor.pulosUsados) < 0)) return false
  if (valor.perguntaIniciadaEm !== undefined && valor.perguntaIniciadaEm !== null && typeof valor.perguntaIniciadaEm !== 'number') return false
  const perguntasValidas = valor.questoes.every((questao) => {
    if (!ehObjeto(questao) || typeof questao.id !== 'string' || !perguntas.some((pergunta) => pergunta.id === questao.id) || !Array.isArray(questao.ordem) || questao.ordem.length !== 4) return false
    return questao.ordem.every((indice) => Number.isInteger(indice) && Number(indice) >= 0 && Number(indice) <= 3) && new Set(questao.ordem).size === 4
  })
  if (!perguntasValidas) return false
  if (valor.config.modoId === 'duelo') {
    if (!ehParticipante(valor.convidado) || valor.convidado.respostas.length > valor.respostas.length || valor.convidado.respostas.length > Number(valor.indice) + 1) return false
  } else if (valor.convidado !== null) return false
  return true
}

export function obterPartidaAtiva(perguntas: readonly Pergunta[]): Partida | null {
  const valor = obterPartidaEmAndamento()
  if (!ehPartida(valor, perguntas)) { if (valor !== null) limparPartidaEmAndamento(); return null }
  const estado = valor
  estado.pausadoMs ??= 0
  estado.pausadaEm ??= null
  estado.pulosUsados ??= 0
  estado.perguntaIniciadaEm ??= null
  return estado
}

export function obterVezDeJogar(partida: Partida): 0 | 1 | null {
  if (partida.respostas.length <= partida.indice) return 0
  if (partida.convidado && partida.convidado.respostas.length <= partida.indice) return 1
  return null
}
export function rodadaConcluida(partida: Partida): boolean { return obterVezDeJogar(partida) === null }
export function obterQuestaoAtual(partida: Partida, banco: readonly Pergunta[]) {
  const questao = partida.questoes[partida.indice]
  const pergunta = banco.find((item) => item.id === questao.id) ?? null
  if (!pergunta) return null
  return {
    pergunta, alternativas: questao.ordem.map((indiceOriginal) => ({ indiceOriginal, texto: pergunta.alternativas[indiceOriginal] })),
    resposta: partida.respostas[partida.indice] ?? null, respostaConvidado: partida.convidado?.respostas[partida.indice] ?? null,
    vez: obterVezDeJogar(partida), numero: partida.indice + 1, total: partida.questoes.length,
  }
}

export function iniciarRelogioDaPergunta(partida: Partida, agora = Date.now()): number | null {
  const regras = obterRegrasDoModo(partida.config.modoId)
  if (!regras.temTempo || obterVezDeJogar(partida) !== 0) return null
  partida.perguntaIniciadaEm ??= agora
  salvarPartida(partida)
  return calcularRestanteMs(partida, agora)
}
export function calcularRestanteMs(partida: Partida, agora = Date.now()): number | null {
  const regras = obterRegrasDoModo(partida.config.modoId)
  if (!regras.temTempo || partida.perguntaIniciadaEm === null) return null
  return Math.max(0, (regras.limiteSegundos ?? 20) * 1000 - (agora - partida.perguntaIniciadaEm))
}

function registrarSemEscolha(partida: Partida, banco: readonly Pergunta[], motivo: 'pulou' | 'tempo'): RespostaPartida | null {
  const pergunta = banco.find((item) => item.id === partida.questoes[partida.indice].id)
  if (!pergunta) return null
  const resposta: RespostaPartida = { perguntaId: pergunta.id, escolhida: null, acertou: false, pontos: 0, motivo, dificuldade: pergunta.dificuldade }
  partida.combo = 0
  partida.respostas.push(resposta)
  salvarPartida(partida)
  return resposta
}

export function responder(partida: Partida, banco: readonly Pergunta[], posicaoExibida: number, agora = Date.now()): RespostaPartida | null {
  if (partida.pausadaEm !== null || obterVezDeJogar(partida) === null || !Number.isInteger(posicaoExibida) || posicaoExibida < 0 || posicaoExibida > 3) return null
  const pergunta = banco.find((item) => item.id === partida.questoes[partida.indice].id)
  if (!pergunta) return null
  const regras = obterRegrasDoModo(partida.config.modoId)
  let fracaoDeTempo: number | null = null
  if (regras.temTempo) {
    iniciarRelogioDaPergunta(partida, agora)
    const restante = calcularRestanteMs(partida, agora) ?? 0
    if (restante <= 0) return registrarSemEscolha(partida, banco, 'tempo')
    fracaoDeTempo = restante / ((regras.limiteSegundos ?? 20) * 1000)
  }
  const vez = obterVezDeJogar(partida)
  const jogador = vez === 1 ? partida.convidado : partida
  if (!jogador) return null
  const escolhida = partida.questoes[partida.indice].ordem[posicaoExibida]
  if (escolhida === undefined) return null
  const acertou = escolhida === pergunta.correta
  jogador.combo = acertou ? jogador.combo + 1 : 0
  jogador.melhorCombo = Math.max(jogador.melhorCombo, jogador.combo)
  const pontos = acertou ? calcularPontosDaResposta({ dificuldade: pergunta.dificuldade, combo: jogador.combo, fracaoDeTempo }) : { total: 0 }
  jogador.pontuacao += pontos.total
  const resposta: RespostaPartida = { perguntaId: pergunta.id, escolhida, acertou, pontos: pontos.total, motivo: null, dificuldade: pergunta.dificuldade }
  jogador.respostas.push(resposta)
  salvarPartida(partida)
  return resposta
}

export function calcularPulosRestantes(partida: Partida): number {
  const limite = calcularLimiteDePulos(obterRegrasDoModo(partida.config.modoId), partida.questoes.length)
  return Math.max(0, limite - partida.pulosUsados)
}
export function pular(partida: Partida, banco: readonly Pergunta[]): RespostaPartida | null {
  if (partida.pausadaEm !== null || obterVezDeJogar(partida) !== 0 || calcularPulosRestantes(partida) === 0) return null
  partida.pulosUsados += 1
  return registrarSemEscolha(partida, banco, 'pulou')
}
export function esgotarTempo(partida: Partida, banco: readonly Pergunta[], agora = Date.now()): RespostaPartida | null {
  if (!obterRegrasDoModo(partida.config.modoId).temTempo || obterVezDeJogar(partida) !== 0) return null
  iniciarRelogioDaPergunta(partida, agora)
  if ((calcularRestanteMs(partida, agora) ?? Infinity) > JANELA_TOLERANCIA_RELOGIO) return null
  return registrarSemEscolha(partida, banco, 'tempo')
}

function deveEncerrar(partida: Partida): boolean {
  if (partida.indice + 1 >= partida.questoes.length) return true
  const ultima = partida.respostas[partida.indice]
  return obterRegrasDoModo(partida.config.modoId).fimNoPrimeiroErro && Boolean(ultima && !ultima.acertou)
}
export function avancar(partida: Partida): 'proxima' | 'fim' | null {
  if (!rodadaConcluida(partida)) return null
  if (deveEncerrar(partida)) return 'fim'
  partida.indice += 1
  partida.perguntaIniciadaEm = null
  salvarPartida(partida)
  return 'proxima'
}
export function pausarPartida(partida: Partida, agora = Date.now()): boolean {
  if (partida.pausadaEm !== null || !obterRegrasDoModo(partida.config.modoId).permitePausa) return false
  partida.pausadaEm = agora; salvarPartida(partida); return true
}
export function retomarPartida(partida: Partida, agora = Date.now()): boolean {
  if (partida.pausadaEm === null) return false
  partida.pausadoMs += Math.max(0, agora - partida.pausadaEm); partida.pausadaEm = null; salvarPartida(partida); return true
}
export function calcularDuracaoMs(partida: Partida, agora = Date.now()): number {
  const pausaAtual = partida.pausadaEm === null ? 0 : Math.max(0, agora - partida.pausadaEm)
  return Math.max(0, agora - partida.iniciadaEm - partida.pausadoMs - pausaAtual)
}

export function concluirPartida(partida: Partida, banco: readonly Pergunta[]) {
  if (!rodadaConcluida(partida) || !deveEncerrar(partida)) return null
  const existente = obterUltimoResultado()
  if (ehResultadoFinal(existente) && existente.id === partida.id) {
    limparPartidaEmAndamento(); return existente
  }
  const total = partida.respostas.length
  const acertos = partida.respostas.filter((resposta) => resposta.acertou).length
  const xpDetalhe = calcularXpDaPartida({ respostas: partida.respostas, total })
  const perguntasPorCategoria: Record<string, { respondidas: number; acertos: number }> = {}
  for (const resposta of partida.respostas) {
    const categoriaId = banco.find((pergunta) => pergunta.id === resposta.perguntaId)?.categoria
    if (!categoriaId) continue
    perguntasPorCategoria[categoriaId] ??= { respondidas: 0, acertos: 0 }
    perguntasPorCategoria[categoriaId].respondidas += 1
    if (resposta.acertou) perguntasPorCategoria[categoriaId].acertos += 1
  }
  const duelo = partida.convidado ? {
    vencedor: partida.pontuacao === partida.convidado.pontuacao ? 'empate' : partida.pontuacao > partida.convidado.pontuacao ? 'jogador' : 'convidado',
    convidado: { nome: partida.convidado.nome, pontuacao: partida.convidado.pontuacao, acertos: partida.convidado.respostas.filter((r) => r.acertou).length, respostas: partida.convidado.respostas },
  } : null
  if (duelo && partida.convidado && partida.pontuacao === partida.convidado.pontuacao) {
    const jogadorAcertos = acertos
    const convidadoAcertos = partida.convidado.respostas.filter((r) => r.acertou).length
    if (jogadorAcertos !== convidadoAcertos) duelo.vencedor = jogadorAcertos > convidadoAcertos ? 'jogador' : 'convidado'
  }
  const dadosRegistraveis = {
    id: partida.id, config: partida.config, total, acertos, erros: total - acertos,
    pontuacao: partida.pontuacao, melhorCombo: partida.melhorCombo,
    duracaoMs: calcularDuracaoMs(partida), xp: xpDetalhe.total,
    respostas: partida.respostas, perfeita: ehPartidaPerfeita(acertos, total),
    perguntasPorCategoria, duelo,
  }
  const resultado: ResultadoFinal = {
    id: partida.id, config: partida.config, total, acertos, erros: total - acertos,
    percentual: total === 0 ? 0 : Math.round((acertos / total) * 100), pontuacao: partida.pontuacao,
    melhorCombo: partida.melhorCombo, duracaoMs: calcularDuracaoMs(partida), xp: xpDetalhe.total,
    xpDetalhe, perfeita: ehPartidaPerfeita(acertos, total),
    puladas: partida.respostas.filter((r) => r.motivo === 'pulou').length,
    tempoEsgotado: partida.respostas.filter((r) => r.motivo === 'tempo').length,
    respostas: partida.respostas, duelo, perguntasPorCategoria, notificado: false,
    progresso: registrarPartida(dadosRegistraveis),
  }
  salvarUltimoResultado(resultado)
  limparPartidaEmAndamento()
  return resultado
}

function ehResultadoFinal(valor: unknown): valor is ResultadoFinal {
  if (typeof valor !== 'object' || valor === null) return false
  return 'id' in valor && typeof valor.id === 'string' && 'total' in valor && typeof valor.total === 'number' && 'respostas' in valor && Array.isArray(valor.respostas)
}

export function abandonarPartida(): void { limparPartidaEmAndamento() }
export function obterResultado(): ResultadoFinal | null { const resultado = obterUltimoResultado(); return ehResultadoFinal(resultado) ? resultado : null }
export function obterIdsDasErradas(resultado: { respostas?: RespostaPartida[] }): string[] { return (resultado.respostas ?? []).filter((resposta) => !resposta.acertou).map((resposta) => resposta.perguntaId) }
