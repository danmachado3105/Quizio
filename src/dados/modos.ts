import type { ModoId } from '../tipos'
import { QUANTIDADE_DESAFIO_DIARIO } from '../utilitarios/pontuacao'

export interface RegrasModo {
  temTempo: boolean
  limiteSegundos: number | null
  permitePausa: boolean
  permitePular: boolean
  pulosACada: number
  fimNoPrimeiroErro: boolean
  quantidadeFixa: number | null
  usaTodasAsPerguntas: boolean
  jogadores: 1 | 2
  configuravel: boolean
}

export interface Modo { id: ModoId; nome: string; descricao: string; regras: RegrasModo }

const BASE: RegrasModo = {
  temTempo: false, limiteSegundos: null, permitePausa: true, permitePular: false,
  pulosACada: 0, fimNoPrimeiroErro: false, quantidadeFixa: null,
  usaTodasAsPerguntas: false, jogadores: 1, configuravel: true,
}

export const MODOS: Modo[] = [
  { id: 'classico', nome: 'Clássico', descricao: 'Sem relógio, no seu ritmo. Responda e confira a explicação antes de seguir.', regras: { ...BASE, permitePular: true, pulosACada: 5 } },
  { id: 'tempo', nome: 'Contra o tempo', descricao: '20 segundos por pergunta. Quanto mais rápido, mais pontos.', regras: { ...BASE, temTempo: true, limiteSegundos: 20, permitePausa: false } },
  { id: 'sobrevivencia', nome: 'Sobrevivência', descricao: 'Continue enquanto acertar. A primeira resposta errada encerra a partida.', regras: { ...BASE, fimNoPrimeiroErro: true, usaTodasAsPerguntas: true } },
  { id: 'diario', nome: 'Desafio diário', descricao: 'As mesmas perguntas para todo mundo no dia, com bônus de XP uma vez por data.', regras: { ...BASE, quantidadeFixa: QUANTIDADE_DESAFIO_DIARIO, configuravel: false } },
  { id: 'duelo', nome: 'Duelo local', descricao: 'Duas pessoas, um aparelho, as mesmas perguntas. As respostas ficam escondidas até o fim da rodada.', regras: { ...BASE, jogadores: 2 } },
]

export function obterModo(id: string): Modo | null { return MODOS.find((modo) => modo.id === id) ?? null }
export function obterRegrasDoModo(id: string): RegrasModo { return obterModo(id)?.regras ?? MODOS[0].regras }
export function obterNomeDoModo(id: string): string { return obterModo(id)?.nome ?? 'Clássico' }
export function calcularLimiteDePulos(regras: RegrasModo, total: number): number {
  if (!regras.permitePular || regras.pulosACada <= 0) return 0
  return Math.max(1, Math.floor(total / regras.pulosACada))
}
