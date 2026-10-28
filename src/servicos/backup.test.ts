import { beforeEach, describe, expect, it } from 'vitest'
import { redefinirDados, atualizarDados, obterDados } from './armazenamento'
import { exportarProgresso, importarProgresso } from './backup'

beforeEach(() => { localStorage.clear(); redefinirDados(); localStorage.clear() })

describe('backup local', () => {
  it('exporta e importa dados v5 com cópia de segurança antes da troca', () => {
    atualizarDados((dados) => { dados.perfil.nome = 'Lia'; dados.moedas = 45 })
    const arquivo = exportarProgresso()
    atualizarDados((dados) => { dados.perfil.nome = 'Bia'; dados.moedas = 2 })
    expect(importarProgresso(arquivo)).toEqual({ sucesso: true })
    expect(obterDados().perfil.nome).toBe('Lia')
    expect(obterDados().moedas).toBe(45)
    expect(localStorage.getItem('quizio:v1:pre-import')).toContain('Bia')
  })

  it('rejeita JSON inválido, versão inesperada e arquivo acima do limite', () => {
    expect(importarProgresso('{x')).toMatchObject({ sucesso: false })
    const arquivo = JSON.parse(exportarProgresso()) as { dados: { versao: number } }
    arquivo.dados.versao = 4
    expect(importarProgresso(JSON.stringify(arquivo))).toMatchObject({ sucesso: false })
    expect(importarProgresso('x'.repeat(1_000_001))).toMatchObject({ sucesso: false })
  })
})
