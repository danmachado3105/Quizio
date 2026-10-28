import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { App } from './App'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('aplicação', () => {
  it('apresenta a home e as rotas principais', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Uma boa pergunta muda o jogo.' })).toBeTruthy()
    expect(within(screen.getByRole('navigation', { name: 'Navegação principal' })).getByRole('link', { name: 'Explorar' }).getAttribute('href')).toBe('/explorar')
  })

  it('explica o armazenamento local na página de privacidade', () => {
    window.history.replaceState(null, '', '/privacidade')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Seu progresso fica com você.' })).toBeTruthy()
    expect(screen.getByText(/não envia seu progresso a um servidor/)).toBeTruthy()
  })

  it('mostra uma página 404 para caminhos desconhecidos', () => {
    window.history.replaceState(null, '', '/caminho-inexistente')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Esse tema ainda não existe.' })).toBeTruthy()
  })
})
