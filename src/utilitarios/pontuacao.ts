import type { DificuldadePergunta, RespostaPartida } from '../tipos'

export const PONTOS_POR_DIFICULDADE: Record<DificuldadePergunta, number> = { facil: 100, medio: 150, dificil: 200 }
export const XP_POR_ACERTO: Record<DificuldadePergunta, number> = { facil: 5, medio: 8, dificil: 12 }
export const XP_CONCLUSAO = 10
export const MINIMO_PERGUNTAS_PARA_CONCLUSAO = 5
export const XP_PARTIDA_PERFEITA = 25
export const MINIMO_PERGUNTAS_PARTIDA_PERFEITA = 5
export const XP_DESAFIO_DIARIO = 50
export const QUANTIDADE_DESAFIO_DIARIO = 5

export function calcularBonusDeTempo(fracaoDeTempo: number | null): number {
  if (fracaoDeTempo === null || !Number.isFinite(fracaoDeTempo)) return 0
  const fracao = Math.min(1, Math.max(0, fracaoDeTempo))
  return Math.round((50 * fracao) / 5) * 5
}

export function calcularPontosDaResposta({ dificuldade, combo, fracaoDeTempo = null }: {
  dificuldade: DificuldadePergunta
  combo: number
  fracaoDeTempo?: number | null
}) {
  const base = PONTOS_POR_DIFICULDADE[dificuldade]
  const bonus = Math.min(Math.max(0, combo - 2) * 10, 50)
  const bonusTempo = calcularBonusDeTempo(fracaoDeTempo)
  return { base, bonus, bonusTempo, total: base + bonus + bonusTempo }
}

export function ehPartidaPerfeita(acertos: number, total: number): boolean {
  return total >= MINIMO_PERGUNTAS_PARTIDA_PERFEITA && acertos === total
}

export function calcularXpDaPartida({ respostas, total }: { respostas: Pick<RespostaPartida, 'acertou' | 'dificuldade'>[]; total: number }) {
  const acertos = respostas.filter((resposta) => resposta.acertou)
  const porAcertos = acertos.reduce((soma, resposta) => soma + XP_POR_ACERTO[resposta.dificuldade], 0)
  const conclusao = total >= MINIMO_PERGUNTAS_PARA_CONCLUSAO ? XP_CONCLUSAO : 0
  const perfeita = ehPartidaPerfeita(acertos.length, total) ? XP_PARTIDA_PERFEITA : 0
  return { acertos: porAcertos, conclusao, perfeita, total: porAcertos + conclusao + perfeita }
}
