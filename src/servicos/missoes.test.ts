import { describe, expect, it } from 'vitest'
import { atualizarDados, obterDados, redefinirDados } from './armazenamento'
import { aplicarPartidaNasMissoes, concederRecompensasDeMissoes } from './missoes'

describe('missões diárias', () => {
  it('atualiza métricas e paga cada missão uma única vez', () => {
    redefinirDados()
    const resultado = { total: 5, acertos: 5, pontuacao: 600, perfeita: true, config: { categoriaId: 'historia' } }
    let premios: Array<{ id: string; xp: number }> = []
    atualizarDados((dados) => {
      for (let i = 0; i < 2; i += 1) aplicarPartidaNasMissoes(dados, resultado)
      premios = concederRecompensasDeMissoes(dados)
    })
    const snapshot = obterDados()
    expect(snapshot.missoes.progresso.partidas).toBe(2)
    expect(snapshot.missoes.progresso.acertos).toBe(10)
    expect(premios.map((item) => item.id).sort()).toEqual(['acertar-5', 'jogar-2', 'pontos-500', 'responder-10', 'sem-erros'])
    expect(snapshot.progresso.xp).toBe(145)
    atualizarDados((dados) => { expect(concederRecompensasDeMissoes(dados)).toEqual([]) })
    expect(obterDados().progresso.xp).toBe(145)
  })
})
