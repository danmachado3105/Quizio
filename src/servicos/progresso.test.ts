import { beforeEach, describe, expect, it } from 'vitest'
import { obterDados, redefinirDados } from './armazenamento'
import { registrarPartida, type ResultadoRegistravel } from './progresso'

const resultado: ResultadoRegistravel = {
  id: 'partida-unica', config: { categoriaId: 'historia', modoId: 'classico', dificuldade: 'medio' },
  total: 5, acertos: 5, erros: 0, pontuacao: 800, melhorCombo: 5, perfeita: true,
  duracaoMs: 30000, xp: 65,
  respostas: Array.from({ length: 5 }, (_, indice) => ({
    perguntaId: `hi-${indice + 1}`, escolhida: 1, acertou: true, pontos: 150, motivo: null, dificuldade: 'medio' as const,
  })),
  perguntasPorCategoria: { historia: { respondidas: 5, acertos: 5 } },
}

beforeEach(() => { redefinirDados() })

describe('registro de partida', () => {
  it('registra estatísticas e recompensa uma partida somente uma vez por id', () => {
    const efeitos = registrarPartida(resultado)
    expect(efeitos?.xpDepois).toBe(155)
    expect(efeitos?.novasConquistas).toContain('primeira-partida')
    expect(registrarPartida(resultado)).toBeNull()
    const dados = obterDados()
    expect(dados.progresso.xp).toBe(155)
    expect(dados.estatisticas.partidas).toBe(1)
    expect(dados.historico).toHaveLength(1)
    expect(dados.moedas).toBeGreaterThan(0)
    expect(dados.medalhas['primeira-partida']).toBe('bronze')
    expect(dados.itensDesbloqueados).toContain('moldura-nivel-2')
  })
})
