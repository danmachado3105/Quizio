import { AVATAR_PADRAO, avatarEhValido } from '../dados/avatares'
import { obterCategoriaPorId } from '../dados/categorias'
import { calcularMelhorSequencia, diaLocal, ehDiaValido, unirDias } from '../utilitarios/sequencia'
import { semanaISOLocal } from '../utilitarios/semana'
import type { DadosQuizio } from '../tipos'

export const VERSAO_DOS_DADOS = 5
export const LIMITE_HISTORICO = 50
export const LIMITE_IDS_REGISTRADOS = 200
export const LIMITE_DIAS_JOGADOS = 400
export const TAMANHO_MAXIMO_NOME = 20
export const NOME_PADRAO = 'Jogador'
const CHAVE = 'quizio:v1'
const CHAVE_BACKUP = 'quizio:v1:backup'
const CHAVE_MIGRACAO = `quizio:v1:pre-v${VERSAO_DOS_DADOS}`

export interface StatusArmazenamento { disponivel: boolean; gravacaoBloqueada: boolean; recuperadoDeErro: boolean }
const status: StatusArmazenamento = { disponivel: true, gravacaoBloqueada: false, recuperadoDeErro: false }
const assinantes = new Set<() => void>()

function criarDadosPadrao(): DadosQuizio {
  return {
    versao: VERSAO_DOS_DADOS,
    perfil: { nome: NOME_PADRAO, avatar: AVATAR_PADRAO, boasVindasExibida: false },
    preferencias: { som: false, movimento: 'sistema' },
    progresso: { xp: 0 },
    moedas: 0,
    itensDesbloqueados: [],
    itensEquipados: { moldura: 'nenhuma', titulo: 'nenhum' },
    bauDiario: { data: '', aberto: false, moedas: 0 },
    marcosSequenciaPagos: { sequenciaInicio: '', marcos: [] },
    medalhas: {},
    estatisticas: {
      partidas: 0, perguntasRespondidas: 0, acertos: 0, melhorPontuacao: 0, melhorCombo: 0,
      partidasPerfeitas: 0, recordesSuperados: 0, melhorSequencia: 0, melhorSobrevivencia: 0,
      melhorAcertosNoTempo: 0, duelosVencidos: 0, diariosConcluidos: 0, partidasPorModo: {},
      porCategoria: {}, perguntasPorCategoria: {},
    },
    historico: [], conquistas: {},
    missoes: { data: '', progresso: {}, resgatadas: {}, categoriasHoje: [] },
    missoesSemanais: { semana: '', progresso: {}, resgatadas: {}, categorias: [] },
    desafioDiario: { ultimaData: '', acertos: 0, total: 0, pontuacao: 0, xp: 0, respostas: [] },
    registroDePartidas: [], favoritas: [], diasJogados: [],
  }
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function mesclar(padrao: unknown, salvo: unknown): unknown {
  if (Array.isArray(padrao)) return Array.isArray(salvo) ? salvo : structuredClone(padrao)
  if (ehObjeto(padrao)) {
    const origem = ehObjeto(salvo) ? salvo : {}
    if (Object.keys(padrao).length === 0) return { ...origem }
    return Object.fromEntries(Object.entries(padrao).map(([chave, valor]) => [chave, mesclar(valor, origem[chave])]))
  }
  if (typeof padrao === 'number') return typeof salvo === 'number' && Number.isFinite(salvo) ? salvo : padrao
  return typeof salvo === typeof padrao ? salvo : padrao
}

function inteiro(valor: unknown): number { return typeof valor === 'number' && Number.isFinite(valor) ? Math.max(0, Math.floor(valor)) : 0 }
function objetoSeguro(valor: unknown): Record<string, unknown> { return ehObjeto(valor) ? valor : {} }

function sanitizar(dados: DadosQuizio): DadosQuizio {
  dados.perfil.nome = String(dados.perfil.nome ?? '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, TAMANHO_MAXIMO_NOME) || NOME_PADRAO
  if (!avatarEhValido(dados.perfil.avatar)) dados.perfil.avatar = AVATAR_PADRAO
  if (dados.preferencias.movimento !== 'sistema' && dados.preferencias.movimento !== 'reduzido') dados.preferencias.movimento = 'sistema'
  dados.preferencias.som = dados.preferencias.som === true
  dados.progresso.xp = inteiro(dados.progresso.xp)
  dados.moedas = inteiro(dados.moedas)
  dados.itensDesbloqueados = [...new Set(dados.itensDesbloqueados.filter((item): item is string => typeof item === 'string'))]
  if (!ehObjeto(dados.itensEquipados)) dados.itensEquipados = { moldura: 'nenhuma', titulo: 'nenhum' }
  dados.itensEquipados.moldura = typeof dados.itensEquipados.moldura === 'string' ? dados.itensEquipados.moldura : 'nenhuma'
  dados.itensEquipados.titulo = typeof dados.itensEquipados.titulo === 'string' ? dados.itensEquipados.titulo : 'nenhum'
  if (!ehObjeto(dados.bauDiario)) dados.bauDiario = { data: '', aberto: false, moedas: 0 }
  dados.bauDiario.data = typeof dados.bauDiario.data === 'string' ? dados.bauDiario.data : ''
  dados.bauDiario.aberto = dados.bauDiario.aberto === true
  dados.bauDiario.moedas = inteiro(dados.bauDiario.moedas)
  if (!ehObjeto(dados.marcosSequenciaPagos)) dados.marcosSequenciaPagos = { sequenciaInicio: '', marcos: [] }
  dados.marcosSequenciaPagos.sequenciaInicio = typeof dados.marcosSequenciaPagos.sequenciaInicio === 'string' ? dados.marcosSequenciaPagos.sequenciaInicio : ''
  dados.marcosSequenciaPagos.marcos = Array.isArray(dados.marcosSequenciaPagos.marcos) ? [...new Set(dados.marcosSequenciaPagos.marcos.filter((item): item is number => Number.isInteger(item) && item > 0))] : []
  const medalhasValidas = objetoSeguro(dados.medalhas)
  dados.medalhas = Object.fromEntries(Object.entries(medalhasValidas).filter(([, grau]) => ['bronze', 'prata', 'ouro'].includes(String(grau)))) as DadosQuizio['medalhas']
  const chavesNumero = ['partidas', 'perguntasRespondidas', 'acertos', 'melhorPontuacao', 'melhorCombo', 'partidasPerfeitas', 'recordesSuperados', 'melhorSequencia', 'melhorSobrevivencia', 'melhorAcertosNoTempo', 'duelosVencidos', 'diariosConcluidos'] as const
  for (const chave of chavesNumero) dados.estatisticas[chave] = inteiro(dados.estatisticas[chave])
  dados.estatisticas.acertos = Math.min(dados.estatisticas.acertos, dados.estatisticas.perguntasRespondidas)
  dados.estatisticas.partidasPorModo = Object.fromEntries(Object.entries(objetoSeguro(dados.estatisticas.partidasPorModo)).filter(([, v]) => typeof v === 'number' && Number.isFinite(v) && v >= 0)) as Record<string, number>
  dados.estatisticas.perguntasPorCategoria = Object.fromEntries(Object.entries(objetoSeguro(dados.estatisticas.perguntasPorCategoria)).filter(([, v]) => typeof v === 'number' && Number.isFinite(v) && v >= 0)) as Record<string, number>
  dados.estatisticas.porCategoria = Object.fromEntries(Object.entries(objetoSeguro(dados.estatisticas.porCategoria)).filter(([, v]) => ehObjeto(v))) as DadosQuizio['estatisticas']['porCategoria']
  dados.conquistas = Object.fromEntries(Object.entries(objetoSeguro(dados.conquistas)).filter(([, v]) => typeof v === 'string')) as Record<string, string>
  dados.historico = dados.historico.filter((item) => ehObjeto(item) && typeof item.id === 'string').slice(0, LIMITE_HISTORICO)
  dados.registroDePartidas = dados.registroDePartidas.filter((id): id is string => typeof id === 'string').slice(-LIMITE_IDS_REGISTRADOS)
  dados.favoritas = [...new Set(dados.favoritas.filter((id): id is string => typeof id === 'string').map((id) => obterCategoriaPorId(id)?.id).filter((id): id is string => Boolean(id)))]
  dados.diasJogados = unirDias(dados.diasJogados.filter(ehDiaValido), [], LIMITE_DIAS_JOGADOS)
  dados.estatisticas.melhorSequencia = Math.max(dados.estatisticas.melhorSequencia, calcularMelhorSequencia(dados.diasJogados))
  return dados
}

function migrar(dados: DadosQuizio, versao: number): void {
  if (versao < 2) {
    dados.registroDePartidas = dados.historico.map((item) => item.id).filter((id) => typeof id === 'string').reverse()
  }
  if (versao < 3 && dados.diasJogados.length === 0) {
    const dias = dados.historico.map((item) => new Date(item.data)).filter((data) => !Number.isNaN(data.getTime())).map(diaLocal)
    dados.diasJogados = unirDias([], dias, LIMITE_DIAS_JOGADOS)
    dados.estatisticas.melhorSequencia = Math.max(dados.estatisticas.melhorSequencia, calcularMelhorSequencia(dados.diasJogados))
  }
  if (versao < 5) {
    dados.moedas ??= 0
    dados.itensDesbloqueados ??= []
    dados.itensEquipados ??= { moldura: 'nenhuma', titulo: 'nenhum' }
    dados.bauDiario ??= { data: '', aberto: false, moedas: 0 }
    dados.marcosSequenciaPagos ??= { sequenciaInicio: '', marcos: [] }
    dados.medalhas ??= {}
    for (const id of Object.keys(dados.conquistas)) dados.medalhas[id] ??= 'bronze'
  }
  dados.versao = VERSAO_DOS_DADOS
}

function gravarBackup(chave: string, texto: string): void {
  try { if (!localStorage.getItem(chave)) localStorage.setItem(chave, texto) } catch { status.disponivel = false }
}

function carregar(): DadosQuizio {
  let texto: string | null = null
  let salvo: unknown = null
  try { texto = localStorage.getItem(CHAVE) } catch { status.disponivel = false }
  if (texto) {
    try { salvo = JSON.parse(texto) as unknown } catch {
      gravarBackup(CHAVE_BACKUP, texto)
      status.recuperadoDeErro = true
    }
    if (salvo !== null && !ehObjeto(salvo)) {
      gravarBackup(CHAVE_BACKUP, texto)
      status.recuperadoDeErro = true
      salvo = null
    }
  }
  const versao = ehObjeto(salvo) && typeof salvo.versao === 'number' ? salvo.versao : 1
  if (ehObjeto(salvo) && versao > VERSAO_DOS_DADOS) {
    status.gravacaoBloqueada = true
    salvo = null
  } else if (ehObjeto(salvo) && versao < VERSAO_DOS_DADOS && texto) {
    gravarBackup(CHAVE_MIGRACAO, texto)
  }
  const dados = sanitizar(mesclar(criarDadosPadrao(), salvo) as DadosQuizio)
  migrar(dados, versao)
  const hoje = diaLocal()
  if (dados.missoes.data !== hoje) dados.missoes = { data: hoje, progresso: {}, resgatadas: {}, categoriasHoje: [] }
  const semana = semanaISOLocal()
  if (dados.missoesSemanais.semana !== semana) dados.missoesSemanais = { semana, progresso: {}, resgatadas: {}, categorias: [] }
  else if (!Array.isArray(dados.missoesSemanais.categorias)) dados.missoesSemanais.categorias = []
  return dados
}

let cache: DadosQuizio | null = null
function obterCache(): DadosQuizio { cache ??= carregar(); return cache }
function notificar(): void { for (const ouvinte of assinantes) ouvinte() }

export function obterDados(): DadosQuizio { return structuredClone(obterCache()) }
export function obterVersaoParaHook(): DadosQuizio { return obterCache() }
export function assinarDados(ouvinte: () => void): () => void { assinantes.add(ouvinte); return () => assinantes.delete(ouvinte) }
export function atualizarDados(alterador: (dados: DadosQuizio) => void): DadosQuizio {
  const dados = obterDados()
  alterador(dados)
  cache = sanitizar(dados)
  if (!status.gravacaoBloqueada) {
    try { localStorage.setItem(CHAVE, JSON.stringify(cache)); status.disponivel = true } catch { status.disponivel = false }
  }
  notificar()
  return structuredClone(cache)
}
export function obterStatusArmazenamento(): StatusArmazenamento { obterCache(); return { ...status } }
export function redefinirDados(): DadosQuizio {
  try { localStorage.removeItem(CHAVE); localStorage.removeItem(CHAVE_BACKUP); localStorage.removeItem(CHAVE_MIGRACAO) } catch { status.disponivel = false }
  status.gravacaoBloqueada = false
  status.recuperadoDeErro = false
  cache = criarDadosPadrao()
  notificar()
  return structuredClone(cache)
}

export function recarregarDados(): DadosQuizio {
  cache = null
  status.disponivel = true
  status.gravacaoBloqueada = false
  status.recuperadoDeErro = false
  return obterDados()
}

export function validarNome(nomeBruto: unknown): { sucesso: true; nome: string } | { sucesso: false; mensagem: string } {
  const nome = String(nomeBruto ?? '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim()
  if (nome.length < 2) return { sucesso: false, mensagem: 'Digite pelo menos 2 caracteres.' }
  if (nome.length > TAMANHO_MAXIMO_NOME) return { sucesso: false, mensagem: `Use no máximo ${TAMANHO_MAXIMO_NOME} caracteres.` }
  return { sucesso: true, nome }
}

export function salvarPerfil({ nome, avatar }: { nome: unknown; avatar: string }) {
  const validacao = validarNome(nome)
  if (!validacao.sucesso) return validacao
  if (!avatarEhValido(avatar)) return { sucesso: false as const, mensagem: 'Escolha um dos avatares disponíveis.' }
  atualizarDados((dados) => { dados.perfil.nome = validacao.nome; dados.perfil.avatar = avatar })
  return { sucesso: true as const, nome: validacao.nome, avatar }
}

export function obterFavoritas(): string[] { return [...obterDados().favoritas] }

export function alternarFavorita(categoriaId: string): { sucesso: true; favorita: boolean } | { sucesso: false; mensagem: string } {
  const categoria = obterCategoriaPorId(categoriaId)
  if (!categoria) return { sucesso: false, mensagem: 'Categoria não encontrada.' }
  let favorita = false
  atualizarDados((dados) => {
    const indice = dados.favoritas.indexOf(categoria.id)
    if (indice >= 0) dados.favoritas.splice(indice, 1)
    else dados.favoritas.push(categoria.id)
    favorita = indice < 0
  })
  return { sucesso: true, favorita }
}
