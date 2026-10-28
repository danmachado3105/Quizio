import { CATEGORIAS } from '../dados/categorias'
import { QUANTIDADE_DESAFIO_DIARIO } from '../utilitarios/pontuacao'
import { embaralhar, gerarSemente, criarGerador } from '../utilitarios/sorteio'
import type { Pergunta } from '../tipos'

const DIFICULDADES_DO_DIA = ['facil', 'facil', 'medio', 'medio', 'dificil'] as const
const porId = (a: Pergunta, b: Pergunta): number => a.id < b.id ? -1 : a.id > b.id ? 1 : 0

export function obterDesafioDoDia(perguntas: readonly Pergunta[], data: string) {
  const aleatorio = criarGerador(gerarSemente(`quizio-diario-${data}`))
  const categorias = embaralhar(CATEGORIAS.map((categoria) => categoria.id), aleatorio)
  const usadas = new Set<string>()
  const categoriasUsadas = new Set<string>()
  const questoes: Array<{ id: string; ordem: [number, number, number, number] }> = []

  for (let posicao = 0; posicao < QUANTIDADE_DESAFIO_DIARIO; posicao += 1) {
    const dificuldade = DIFICULDADES_DO_DIA[posicao]
    const candidatas = perguntas.filter((pergunta) => pergunta.dificuldade === dificuldade && !usadas.has(pergunta.id)).sort(porId)
    for (const categoriaId of categorias) {
      if (categoriasUsadas.has(categoriaId)) continue
      const doTema = candidatas.filter((pergunta) => pergunta.categoria === categoriaId)
      if (doTema.length === 0) continue
      const pergunta = doTema[Math.floor(aleatorio() * doTema.length)]
      usadas.add(pergunta.id)
      categoriasUsadas.add(categoriaId)
      const ordem = embaralhar([0, 1, 2, 3] as const, aleatorio)
      questoes.push({ id: pergunta.id, ordem: ordem as [number, number, number, number] })
      break
    }
  }
  return { data, questoes }
}
