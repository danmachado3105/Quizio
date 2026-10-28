import { beforeEach, describe, expect, it } from 'vitest'
import { obterPartidaEmAndamento } from './sessao'
import type { Pergunta } from '../tipos'
import type { Partida } from './partida'
import {
  avancar, calcularPulosRestantes, concluirPartida, criarPartida, esgotarTempo,
  obterPartidaAtiva, obterVezDeJogar, pular, responder, iniciarRelogioDaPergunta,
} from './partida'

const perguntas: Pergunta[] = Array.from({ length: 6 }, (_, i) => ({
  id: `hi-${i}`, categoria: 'historia', dificuldade: 'facil', enunciado: `Pergunta ${i}`,
  alternativas: ['certa', 'B', 'C', 'D'], correta: 0, explicacao: 'Explicação curta.',
}))
const ordemFixa = () => 0.1
const partida = (modoId: 'classico' | 'tempo' | 'sobrevivencia' | 'duelo', quantidade = 5): Partida => {
  const criada = criarPartida({ categoriaId: 'historia', dificuldade: 'misto', modoId, quantidade }, perguntas, { hoje: '2026-10-28', agora: 1000, aleatorio: ordemFixa })
  if (!('partida' in criada)) throw new Error(criada.erro)
  if (!criada.partida) throw new Error(criada.erro)
  return criada.partida
}
const responderCerto = (estado: ReturnType<typeof partida>) => {
  const questao = estado.questoes[estado.indice]
  const posicao = questao.ordem.indexOf(0)
  return responder(estado, perguntas, posicao, 1000)
}

beforeEach(() => { sessionStorage.clear() })

describe('motor da partida', () => {
  it('limita os pulos, zera o combo e registra o pulo como erro sem pontos', () => {
    const estado = partida('classico')
    estado.combo = 2
    expect(calcularPulosRestantes(estado)).toBe(1)
    expect(pular(estado, perguntas)).toMatchObject({ escolhida: null, acertou: false, pontos: 0, motivo: 'pulou' })
    expect(estado.combo).toBe(0)
    expect(pular(estado, perguntas)).toBeNull()
  })

  it('não avança a rodada do duelo até o convidado responder', () => {
    const estado = partida('duelo', 1)
    expect(responderCerto(estado)).toMatchObject({ acertou: true })
    expect(obterVezDeJogar(estado)).toBe(1)
    expect(avancar(estado)).toBeNull()
    expect(responderCerto(estado)).toMatchObject({ acertou: true })
    expect(avancar(estado)).toBe('fim')
    const resultado = concluirPartida(estado, perguntas)
    expect(resultado?.duelo).toMatchObject({ vencedor: 'empate' })
  })

  it('encerra sobrevivência no primeiro erro e totaliza só o que foi respondido', () => {
    const estado = partida('sobrevivencia', 1)
    const resposta = responder(estado, perguntas, estado.questoes[0].ordem.indexOf(1), 1000)
    expect(resposta?.acertou).toBe(false)
    expect(avancar(estado)).toBe('fim')
    expect(concluirPartida(estado, perguntas)?.total).toBe(1)
  })

  it('salva e restaura o estado da partida', () => {
    const estado = partida('classico')
    expect(obterPartidaEmAndamento()).not.toBeNull()
    expect(obterPartidaAtiva(perguntas)?.id).toBe(estado.id)
  })

  it('registra o tempo esgotado como erro sem resposta escolhida', () => {
    const estado = partida('tempo', 1)
    iniciarRelogioDaPergunta(estado, 1000)
    expect(esgotarTempo(estado, perguntas, 21000)).toMatchObject({ escolhida: null, acertou: false, pontos: 0, motivo: 'tempo' })
  })
})
