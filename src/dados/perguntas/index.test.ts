import { describe, expect, it } from 'vitest'
import { auditarBanco, filtrarPerguntas, PERGUNTAS, validarBanco } from './index'

describe('banco de perguntas', () => {
  it('carrega as 415 perguntas únicas da origem sem ids repetidos', () => {
    expect(PERGUNTAS).toHaveLength(415)
    expect(new Set(PERGUNTAS.map((pergunta) => pergunta.id)).size).toBe(415)
    expect(auditarBanco().problemas).toEqual([])
  })

  it('mantém categorias com menos de 50 perguntas e calcula as faltantes por dificuldade', () => {
    const relatorio = auditarBanco()
    expect(Object.keys(relatorio.porCategoria)).toHaveLength(23)
    expect(relatorio.porCategoria.tecnologia).toMatchObject({ total: 20, facil: 7, medio: 7, dificil: 6, faltam: { facil: 10, medio: 10, dificil: 10 }, proximoId: 'te-021' })
  })

  it('resolve apelidos antigos e filtra perguntas por tema e dificuldade', () => {
    expect(filtrarPerguntas({ categoriaId: 'filmes-series' }).every((pergunta) => pergunta.categoria === 'filmes')).toBe(true)
    expect(filtrarPerguntas({ categoriaId: 'games-nerd' }).every((pergunta) => pergunta.categoria === 'jogos')).toBe(true)
    expect(filtrarPerguntas({ categoriaId: 'tecnologia', dificuldade: 'facil' }).every((pergunta) => pergunta.dificuldade === 'facil')).toBe(true)
  })

  it('valida textos distintos de alternativas mesmo quando são símbolos', () => {
    const pergunta = { id: 'te-teste', categoria: 'tecnologia', dificuldade: 'facil', enunciado: 'Qual símbolo?', alternativas: ['#', '@', '&', '%'], correta: 1, explicacao: 'O arroba.' }
    expect(validarBanco([pergunta])).toMatchObject({ validas: [pergunta], problemas: [] })
    expect(validarBanco([{ ...pergunta, alternativas: ['A', 'A', 'B', 'C'] }]).problemas[0].motivo).toBe('alternativas repetidas')
  })
})
