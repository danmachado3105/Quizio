import { CATEGORIAS, resolverIdDaCategoria } from '../categorias'
import type { DificuldadePergunta, Pergunta } from '../../tipos'
import { perguntasConhecimentosGerais } from './conhecimentos-gerais'
import { perguntasCienciaEspaco } from './ciencia-espaco'
import { perguntasHistoria } from './historia'
import { perguntasGeografia } from './geografia'
import { perguntasFilmes } from './filmes'
import { perguntasSeries } from './series'
import { perguntasMusica } from './musica'
import { perguntasEsportes } from './esportes'
import { perguntasJogos } from './jogos'
import { perguntasAnimes } from './animes'
import { perguntasTecnologia } from './tecnologia'
import { perguntasLiteratura } from './literatura'
import { perguntasNaturezaAnimais } from './natureza-animais'
import { perguntasBrasil } from './brasil'
import { perguntasArteArquitetura } from './arte-arquitetura'
import { perguntasComidaCulinaria } from './comida-culinaria'
import { perguntasCorpoHumano } from './corpo-humano'
import { perguntasMitologiaLendas } from './mitologia-lendas'
import { perguntasMatematicaLogica } from './matematica-logica'
import { perguntasLinguaPortuguesa } from './lingua-portuguesa'
import { perguntasEconomiaNegocios } from './economia-negocios'
import { perguntasDatasTradicoes } from './datas-tradicoes'
import { perguntasInvencoesDescobertas } from './invencoes-descobertas'

export const CATEGORIA_TODAS = 'todas'
export const DIFICULDADE_MISTA = 'misto'
export const DIFICULDADES: Array<{ id: DificuldadePergunta; nome: string }> = [
  { id: 'facil', nome: 'Fácil' }, { id: 'medio', nome: 'Médio' }, { id: 'dificil', nome: 'Difícil' },
]

const PACOTES: Pergunta[][] = [
  perguntasConhecimentosGerais, perguntasCienciaEspaco, perguntasHistoria, perguntasGeografia,
  perguntasFilmes, perguntasSeries, perguntasMusica, perguntasEsportes, perguntasJogos, perguntasAnimes,
  perguntasTecnologia, perguntasLiteratura, perguntasNaturezaAnimais, perguntasBrasil, perguntasArteArquitetura,
  perguntasComidaCulinaria, perguntasCorpoHumano, perguntasMitologiaLendas, perguntasMatematicaLogica,
  perguntasLinguaPortuguesa, perguntasEconomiaNegocios, perguntasDatasTradicoes, perguntasInvencoesDescobertas,
]

export const PERGUNTAS_ORIGINAIS: readonly unknown[] = PACOTES.flat()
const IDS_CATEGORIA = new Set(CATEGORIAS.map((categoria) => categoria.id))
const IDS_DIFICULDADE = new Set<string>(DIFICULDADES.map((dificuldade) => dificuldade.id))
const PREFIXOS: Record<string, string> = {
  'conhecimentos-gerais': 'cg', 'ciencia-espaco': 'ce', historia: 'hi', geografia: 'ge', filmes: 'fl',
  series: 'sr', musica: 'mu', esportes: 'es', jogos: 'jg', animes: 'an', tecnologia: 'te', literatura: 'li',
  'natureza-animais': 'na', brasil: 'br', 'arte-arquitetura': 'ar', 'comida-culinaria': 'cm',
  'corpo-humano': 'cp', 'mitologia-lendas': 'mi', 'matematica-logica': 'ma', 'lingua-portuguesa': 'pt',
  'economia-negocios': 'ec', 'datas-tradicoes': 'dt', 'invencoes-descobertas': 'iv',
}
const METAS = { facil: 17, medio: 17, dificil: 16 }

function ehObjeto(valor: unknown): valor is Record<string, unknown> { return typeof valor === 'object' && valor !== null && !Array.isArray(valor) }
function normalizarEnunciado(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
}
function normalizarAlternativa(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim()
}

function validarUma(pergunta: unknown, ids: Set<string>, enunciados: Set<string>): { valor?: Pergunta; problema?: string } {
  if (!ehObjeto(pergunta)) return { problema: 'não é um objeto' }
  if (typeof pergunta.id !== 'string' || !pergunta.id.trim()) return { problema: 'sem id' }
  if (ids.has(pergunta.id)) return { problema: 'id repetido' }
  if (typeof pergunta.categoria !== 'string' || !IDS_CATEGORIA.has(pergunta.categoria)) return { problema: 'categoria inexistente' }
  if (typeof pergunta.dificuldade !== 'string' || !IDS_DIFICULDADE.has(pergunta.dificuldade)) return { problema: 'dificuldade inválida' }
  if (typeof pergunta.enunciado !== 'string' || !pergunta.enunciado.trim()) return { problema: 'sem enunciado' }
  const chaveEnunciado = normalizarEnunciado(pergunta.enunciado)
  if (enunciados.has(chaveEnunciado)) return { problema: 'enunciado repetido' }
  if (!Array.isArray(pergunta.alternativas) || pergunta.alternativas.length !== 4) return { problema: 'precisa de quatro alternativas' }
  if (pergunta.alternativas.some((texto) => typeof texto !== 'string' || !texto.trim())) return { problema: 'alternativa vazia' }
  const alternativas = pergunta.alternativas as string[]
  if (new Set(alternativas.map(normalizarAlternativa)).size !== 4) return { problema: 'alternativas repetidas' }
  if (!Number.isInteger(pergunta.correta) || Number(pergunta.correta) < 0 || Number(pergunta.correta) > 3) return { problema: 'índice da resposta correta inválido' }
  if (typeof pergunta.explicacao !== 'string' || !pergunta.explicacao.trim()) return { problema: 'sem explicação' }
  ids.add(pergunta.id)
  enunciados.add(chaveEnunciado)
  return { valor: pergunta as unknown as Pergunta }
}

export function validarBanco(perguntas: readonly unknown[]) {
  const ids = new Set<string>()
  const enunciados = new Set<string>()
  const validas: Pergunta[] = []
  const problemas: Array<{ id: string; motivo: string }> = []
  for (const pergunta of perguntas) {
    const validacao = validarUma(pergunta, ids, enunciados)
    if (validacao.problema) {
      const id = ehObjeto(pergunta) && typeof pergunta.id === 'string' ? pergunta.id : '(sem id)'
      problemas.push({ id, motivo: validacao.problema })
    } else if (validacao.valor) validas.push(validacao.valor)
  }
  return { validas, problemas }
}

const validacaoBanco = validarBanco(PERGUNTAS_ORIGINAIS)
export const PERGUNTAS: readonly Pergunta[] = Object.freeze(validacaoBanco.validas)
for (const problema of validacaoBanco.problemas) console.warn(`Quizio: pergunta ignorada (${problema.id}): ${problema.motivo}.`)

export function obterPerguntaPorId(id: string): Pergunta | null { return PERGUNTAS.find((pergunta) => pergunta.id === id) ?? null }

export function filtrarPerguntas({ categoriaId = CATEGORIA_TODAS, dificuldade = DIFICULDADE_MISTA }: { categoriaId?: string; dificuldade?: string } = {}): Pergunta[] {
  const categoriaAtual = resolverIdDaCategoria(categoriaId)
  return PERGUNTAS.filter((pergunta) => (categoriaAtual === CATEGORIA_TODAS || pergunta.categoria === categoriaAtual) && (dificuldade === DIFICULDADE_MISTA || pergunta.dificuldade === dificuldade))
}

export function contarPerguntasPorCategoria(): Record<string, number> {
  const contagem: Record<string, number> = {}
  for (const pergunta of PERGUNTAS) contagem[pergunta.categoria] = (contagem[pergunta.categoria] ?? 0) + 1
  return contagem
}

export interface ResumoCategoriaPerguntas {
  total: number; facil: number; medio: number; dificil: number
  faltam: { facil: number; medio: number; dificil: number }; proximoId: string
}

export function contarPerguntasPorCategoriaEDificuldade(): Record<string, Omit<ResumoCategoriaPerguntas, 'faltam' | 'proximoId'>> {
  const contagem: Record<string, Omit<ResumoCategoriaPerguntas, 'faltam' | 'proximoId'>> = {}
  for (const pergunta of PERGUNTAS) {
    contagem[pergunta.categoria] ??= { total: 0, facil: 0, medio: 0, dificil: 0 }
    contagem[pergunta.categoria].total += 1
    contagem[pergunta.categoria][pergunta.dificuldade] += 1
  }
  return contagem
}

export function auditarBanco() {
  const contagens = contarPerguntasPorCategoriaEDificuldade()
  const porCategoria: Record<string, ResumoCategoriaPerguntas> = {}
  for (const categoria of CATEGORIAS) {
    const contagem = contagens[categoria.id] ?? { total: 0, facil: 0, medio: 0, dificil: 0 }
    const prefixo = PREFIXOS[categoria.id]
    const maior = PERGUNTAS.filter((p) => p.categoria === categoria.id).reduce((atual, p) => Math.max(atual, Number(p.id.match(/(\d+)$/)?.[1] ?? 0)), 0)
    porCategoria[categoria.id] = {
      ...contagem,
      faltam: { facil: Math.max(0, METAS.facil - contagem.facil), medio: Math.max(0, METAS.medio - contagem.medio), dificil: Math.max(0, METAS.dificil - contagem.dificil) },
      proximoId: `${prefixo}-${String(maior + 1).padStart(3, '0')}`,
    }
  }
  return { total: PERGUNTAS.length, porCategoria, problemas: validacaoBanco.problemas }
}
