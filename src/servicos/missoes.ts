import { MISSOES } from '../dados/missoes'
import { obterCategoriaPorId } from '../dados/categorias'
import type { DadosQuizio } from '../tipos'
import { RECOMPENSAS, MISSOES_SEMANAIS } from '../config/recompensas'

export interface ResultadoParaMissoes {
  total: number
  acertos: number
  pontuacao: number
  perfeita: boolean
  config: { categoriaId: string }
}

export function aplicarPartidaNasMissoes(dados: DadosQuizio, resultado: ResultadoParaMissoes): void {
  const progresso = dados.missoes.progresso
  progresso.perguntasRespondidas = (progresso.perguntasRespondidas ?? 0) + resultado.total
  progresso.acertos = (progresso.acertos ?? 0) + resultado.acertos
  progresso.partidas = (progresso.partidas ?? 0) + 1
  progresso.melhorPontuacao = Math.max(progresso.melhorPontuacao ?? 0, resultado.pontuacao)
  if (resultado.perfeita) progresso.partidasPerfeitas = (progresso.partidasPerfeitas ?? 0) + 1

  const categoria = obterCategoriaPorId(resultado.config.categoriaId)
  if (categoria && !dados.missoes.categoriasHoje.includes(categoria.id)) {
    dados.missoes.categoriasHoje.push(categoria.id)
  }
  progresso.categoriasDiferentes = dados.missoes.categoriasHoje.length
}

export function concederRecompensasDeMissoes(dados: DadosQuizio) {
  const concluidas: Array<{ id: string; xp: number; moedas: number }> = []
  for (const missao of MISSOES) {
    if (dados.missoes.resgatadas[missao.id]) continue
    if ((dados.missoes.progresso[missao.metrica] ?? 0) < missao.meta) continue
    dados.missoes.resgatadas[missao.id] = new Date().toISOString()
    dados.progresso.xp += missao.xp
    dados.moedas += RECOMPENSAS.moedasMissaoDiaria
    concluidas.push({ id: missao.id, xp: missao.xp, moedas: RECOMPENSAS.moedasMissaoDiaria })
  }
  return concluidas
}

export function aplicarPartidaNaSemana(dados: DadosQuizio, resultado: ResultadoParaMissoes): void {
  const semana = dados.missoesSemanais
  semana.progresso.perguntasRespondidas = (semana.progresso.perguntasRespondidas ?? 0) + resultado.total
  const categoria = obterCategoriaPorId(resultado.config.categoriaId)
  if (categoria && !semana.categorias.includes(categoria.id)) semana.categorias.push(categoria.id)
  semana.progresso.categoriasDiferentes = semana.categorias.length
}

export function concederRecompensasSemanais(dados: DadosQuizio) {
  const concluidas: Array<{ id: string; xp: number; moedas: number }> = []
  for (const missao of MISSOES_SEMANAIS) {
    if (dados.missoesSemanais.resgatadas[missao.id] || (dados.missoesSemanais.progresso[missao.metrica] ?? 0) < missao.meta) continue
    dados.missoesSemanais.resgatadas[missao.id] = new Date().toISOString()
    dados.progresso.xp += missao.xp
    dados.moedas += missao.moedas
    concluidas.push({ id: missao.id, xp: missao.xp, moedas: missao.moedas })
  }
  return concluidas
}
