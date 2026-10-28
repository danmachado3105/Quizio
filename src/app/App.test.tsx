import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { App } from './App'

afterEach(cleanup)

describe('aplicação', () => {
  it('apresenta a home e as rotas principais', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Uma boa pergunta muda o jogo.' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Explorar' }).getAttribute('href')).toBe('/explorar')
  })
})
