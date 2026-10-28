import { describe, expect, it } from 'vitest'
import { calcularNivel, xpAcumuladoParaNivel } from './progressao'
import { calcularPontosDaResposta, calcularXpDaPartida } from './pontuacao'
import { calcularSequenciaAtual, diaAnterior } from './sequencia'
import { semanaISOLocal } from './semana'

describe('progressão e pontuação', () => {
  it('calcula os limiares de XP e o progresso do nível sem laço proporcional', () => {
    expect([xpAcumuladoParaNivel(2), xpAcumuladoParaNivel(3), xpAcumuladoParaNivel(4)]).toEqual([100, 250, 450])
    expect(calcularNivel(0).nivel).toBe(1)
    expect(calcularNivel(100)).toMatchObject({ nivel: 2, xpNoNivel: 0, xpNecessario: 150 })
    expect(calcularNivel(249).percentual).toBe(99)
  })

  it('calcula pontos base, combo e bônus de tempo', () => {
    expect(calcularPontosDaResposta({ dificuldade: 'medio', combo: 3, fracaoDeTempo: 1 })).toEqual({ base: 150, bonus: 10, bonusTempo: 50, total: 210 })
    expect(calcularPontosDaResposta({ dificuldade: 'medio', combo: 3, fracaoDeTempo: 0.5 }).bonusTempo).toBe(25)
    expect(calcularPontosDaResposta({ dificuldade: 'medio', combo: 99 }).bonus).toBe(50)
  })

  it('paga conclusão e perfeição apenas a partir de cinco perguntas', () => {
    const resposta = { acertou: true, dificuldade: 'facil' as const }
    expect(calcularXpDaPartida({ respostas: [resposta, resposta, resposta, resposta], total: 4 })).toMatchObject({ conclusao: 0, perfeita: 0 })
    expect(calcularXpDaPartida({ respostas: Array(5).fill(resposta), total: 5 })).toMatchObject({ acertos: 25, conclusao: 10, perfeita: 25, total: 60 })
  })
})

describe('calendário local', () => {
  it.each([
    ['2026-10-26', '2026-W44'], ['2026-11-01', '2026-W44'], ['2025-12-29', '2026-W01'],
    ['2027-01-01', '2026-W53'], ['2024-12-30', '2025-W01'],
  ])('mapeia %s para a semana ISO %s', (dia, semana) => {
    const [ano, mes, numero] = dia.split('-').map(Number)
    expect(semanaISOLocal(new Date(ano, mes - 1, numero))).toBe(semana)
  })

  it('preserva a sequência até o dia seguinte e encerra quando se perde um dia', () => {
    const dias = ['2026-10-22', '2026-10-23', '2026-10-24']
    expect(calcularSequenciaAtual(dias, '2026-10-24')).toBe(3)
    expect(calcularSequenciaAtual(dias, '2026-10-25')).toBe(3)
    expect(calcularSequenciaAtual(dias, '2026-10-26')).toBe(0)
    expect(diaAnterior('2027-01-01')).toBe('2026-12-31')
  })
})
