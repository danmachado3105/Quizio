import { beforeEach, describe, expect, it, vi } from 'vitest'
import { atualizarDados, obterDados, obterStatusArmazenamento, recarregarDados, redefinirDados, VERSAO_DOS_DADOS } from './armazenamento'

beforeEach(() => {
  localStorage.clear()
  redefinirDados()
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('armazenamento local', () => {
  it('conserva progresso e devolve cópias isoladas', () => {
    atualizarDados((dados) => { dados.progresso.xp = 120 })
    const copia = obterDados()
    copia.progresso.xp = 0
    expect(obterDados().progresso.xp).toBe(120)
    expect(localStorage.getItem('quizio:v1')).toContain('120')
  })

  it('migra um salvamento v1 e preserva histórico e evita contar partidas antigas de novo', () => {
    localStorage.setItem('quizio:v1', JSON.stringify({ versao: 1, historico: [{ id: 'antiga', data: '2026-10-22T12:00:00.000Z' }], progresso: { xp: 35 } }))
    const dados = recarregarDados()
    expect(dados.versao).toBe(VERSAO_DOS_DADOS)
    expect(dados.progresso.xp).toBe(35)
    expect(dados.registroDePartidas).toContain('antiga')
    expect(localStorage.getItem('quizio:v1:pre-v5')).not.toBeNull()
  })

  it.each([2, 3, 4])('preserva o perfil e o XP em um salvamento v%s', (versao) => {
    localStorage.setItem('quizio:v1', JSON.stringify({ versao, perfil: { nome: 'Lia', avatar: 'coral' }, progresso: { xp: 275 } }))
    const dados = recarregarDados()
    expect(dados.perfil).toMatchObject({ nome: 'Lia', avatar: 'coral' })
    expect(dados.progresso.xp).toBe(275)
    expect(dados.versao).toBe(VERSAO_DOS_DADOS)
    expect(dados.moedas).toBe(0)
    expect(dados.itensDesbloqueados).toEqual([])
    expect(dados.medalhas).toEqual({})
  })

  it('faz backup de dados ilegíveis e inicia com valores seguros', () => {
    localStorage.setItem('quizio:v1', '{invalido')
    expect(recarregarDados().perfil.nome).toBe('Jogador')
    expect(localStorage.getItem('quizio:v1:backup')).toBe('{invalido')
    expect(obterStatusArmazenamento().recuperadoDeErro).toBe(true)
  })

  it('não sobrescreve dados de uma versão mais nova', () => {
    const texto = JSON.stringify({ versao: VERSAO_DOS_DADOS + 2, perfil: { nome: 'Futuro' } })
    localStorage.setItem('quizio:v1', texto)
    recarregarDados()
    expect(obterDados().perfil.nome).toBe('Jogador')
    atualizarDados((dados) => { dados.progresso.xp = 99 })
    expect(localStorage.getItem('quizio:v1')).toBe(texto)
    expect(obterStatusArmazenamento().gravacaoBloqueada).toBe(true)
  })
})
