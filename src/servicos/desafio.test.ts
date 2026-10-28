import { describe, expect, it } from 'vitest'
import { obterDesafioDoDia } from './desafio'
import type { Pergunta } from '../tipos'

const categorias = ['historia', 'geografia', 'filmes', 'musica', 'jogos', 'brasil', 'ciencia-espaco']
const perguntas: Pergunta[] = categorias.flatMap((categoria, tema) => ['facil', 'medio', 'dificil'].map((dificuldade, nivel) => ({
  id: `p-${tema}-${nivel}`, categoria, dificuldade: dificuldade as Pergunta['dificuldade'],
  enunciado: `Pergunta ${tema}-${nivel}`, alternativas: ['A', 'B', 'C', 'D'], correta: 0, explicacao: 'Explicação.',
})))

describe('desafio diário determinístico', () => {
  it('repete perguntas e alternativas no mesmo dia', () => {
    expect(obterDesafioDoDia(perguntas, '2026-10-28')).toEqual(obterDesafioDoDia(perguntas, '2026-10-28'))
  })

  it('muda por data, sobe a dificuldade e escolhe temas distintos', () => {
    const hoje = obterDesafioDoDia(perguntas, '2026-10-28')
    const amanha = obterDesafioDoDia(perguntas, '2026-10-29')
    expect(hoje.questoes.map(({ id }) => id)).not.toEqual(amanha.questoes.map(({ id }) => id))
    expect(hoje.questoes.map(({ id }) => perguntas.find((p) => p.id === id)?.dificuldade)).toEqual(['facil', 'facil', 'medio', 'medio', 'dificil'])
    expect(new Set(hoje.questoes.map(({ id }) => perguntas.find((p) => p.id === id)?.categoria)).size).toBe(5)
    expect(hoje.questoes).toHaveLength(5)
  })
})
