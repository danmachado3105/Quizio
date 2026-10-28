import { CONQUISTAS, estaConcluida } from '../dados/conquistas'
import { obterModo } from '../dados/modos'
import { calcularNivel } from '../utilitarios/progressao'
import { XP_DESAFIO_DIARIO } from '../utilitarios/pontuacao'
import { diaAnterior, diaLocal, resumirSequencia, unirDias } from '../utilitarios/sequencia'
import type { DadosConquistas, } from '../dados/conquistas'
import type { DadosQuizio, RespostaPartida } from '../tipos'
import { atualizarDados, LIMITE_DIAS_JOGADOS, LIMITE_HISTORICO, LIMITE_IDS_REGISTRADOS } from './armazenamento'
import { aplicarPartidaNasMissoes, aplicarPartidaNaSemana, concederRecompensasDeMissoes, concederRecompensasSemanais } from './missoes'
import { RECOMPENSAS } from '../config/recompensas'

export interface ResultadoRegistravel {
  id: string
  config: { categoriaId: string; modoId: string; dificuldade: string; dataDesafio?: string }
  total: number; acertos: number; erros: number; pontuacao: number; melhorCombo: number
  perfeita: boolean; duracaoMs: number; xp: number; respostas: RespostaPartida[]
  perguntasPorCategoria?: Record<string, { respondidas: number; acertos: number }>
  duelo?: { vencedor: string } | null
}

export interface EfeitosDaPartida {
  xpAntes: number; xpDepois: number; xpMissoes: number; xpDiario: number
  nivelAnterior: number; nivelNovo: number; subiuDeNivel: boolean
  missoesConcluidas: Array<{ id: string; xp: number }>; novasConquistas: string[]
  moedasGanham: number; moedasDesafio: number; moedasMissoes: number; moedasSemanais: number; moedasBau: number
  itensDesbloqueados: string[]; marcosPagos: number[]
  recorde: { categoriaId: string; anterior: number; atual: number; ehNovo: boolean }
  sequencia: { atual: number; melhor: number; primeiraDoDia: boolean; novaMelhor: boolean }
}

const numero = (valor: number | undefined): number => Number.isFinite(valor) ? Math.max(0, valor ?? 0) : 0

export function registrarPartida(resultado: ResultadoRegistravel): EfeitosDaPartida | null {
  let efeitos: EfeitosDaPartida | null = null
  atualizarDados((dados) => {
    if (dados.registroDePartidas.includes(resultado.id)) return
    const estatisticas = dados.estatisticas
    const categoriaId = resultado.config.categoriaId
    const modoId = obterModo(resultado.config.modoId)?.id ?? 'classico'
    const xpAntes = dados.progresso.xp
    const nivelAnterior = calcularNivel(xpAntes).nivel
    const anterior = estatisticas.porCategoria[categoriaId] ?? { partidas: 0, respondidas: 0, acertos: 0, melhorPontuacao: 0 }
    const recordeAnterior = numero(anterior.melhorPontuacao)
    const ehNovoRecorde = resultado.pontuacao > recordeAnterior
    const registro = {
      partidas: numero(anterior.partidas) + 1,
      respondidas: numero(anterior.respondidas) + resultado.total,
      acertos: numero(anterior.acertos) + resultado.acertos,
      melhorPontuacao: Math.max(recordeAnterior, resultado.pontuacao),
    }
    estatisticas.porCategoria[categoriaId] = registro
    estatisticas.partidas += 1
    estatisticas.perguntasRespondidas += resultado.total
    estatisticas.acertos += resultado.acertos
    estatisticas.melhorPontuacao = Math.max(estatisticas.melhorPontuacao, resultado.pontuacao)
    estatisticas.melhorCombo = Math.max(estatisticas.melhorCombo, resultado.melhorCombo)
    if (resultado.perfeita) estatisticas.partidasPerfeitas += 1
    if (ehNovoRecorde && recordeAnterior > 0) estatisticas.recordesSuperados += 1
    for (const [id, contagem] of Object.entries(resultado.perguntasPorCategoria ?? {})) {
      if (id === '__proto__') continue
      estatisticas.perguntasPorCategoria[id] = numero(estatisticas.perguntasPorCategoria[id]) + numero(contagem.respondidas)
    }
    estatisticas.partidasPorModo[modoId] = numero(estatisticas.partidasPorModo[modoId]) + 1
    if (modoId === 'sobrevivencia') estatisticas.melhorSobrevivencia = Math.max(estatisticas.melhorSobrevivencia, resultado.acertos)
    if (modoId === 'tempo') estatisticas.melhorAcertosNoTempo = Math.max(estatisticas.melhorAcertosNoTempo, resultado.acertos)
    if (modoId === 'duelo' && resultado.duelo?.vencedor === 'jogador') estatisticas.duelosVencidos += 1
    const moedasGanham = resultado.respostas.reduce((total, resposta) => total + (resposta.acertou ? RECOMPENSAS.moedasPorAcerto[resposta.dificuldade] : 0), 0)
    dados.moedas += moedasGanham

    const hoje = diaLocal()
    const primeiraDoDia = !dados.diasJogados.includes(hoje)
    const melhorAnterior = estatisticas.melhorSequencia
    dados.diasJogados = unirDias(dados.diasJogados, [hoje], LIMITE_DIAS_JOGADOS)
    const sequencia = resumirSequencia(dados.diasJogados, melhorAnterior, hoje)
    estatisticas.melhorSequencia = sequencia.melhor

    let xpDiario = 0
    let moedasDesafio = 0
    if (modoId === 'diario' && resultado.config.dataDesafio && dados.desafioDiario.ultimaData !== resultado.config.dataDesafio) {
      xpDiario = XP_DESAFIO_DIARIO
      moedasDesafio = RECOMPENSAS.moedasDesafioDiario
      dados.moedas += moedasDesafio
      estatisticas.diariosConcluidos += 1
      dados.desafioDiario = {
        ultimaData: resultado.config.dataDesafio, acertos: resultado.acertos, total: resultado.total,
        pontuacao: resultado.pontuacao, xp: resultado.xp + xpDiario,
        respostas: resultado.respostas.map(({ perguntaId, escolhida, acertou }) => ({ perguntaId, escolhida, acertou })),
      }
    }
    dados.progresso.xp += resultado.xp + xpDiario
    aplicarPartidaNasMissoes(dados, resultado)
    const missoesConcluidas = concederRecompensasDeMissoes(dados)
    const xpMissoes = missoesConcluidas.reduce((soma, item) => soma + item.xp, 0)
    aplicarPartidaNaSemana(dados, resultado)
    const missoesSemanaisConcluidas = concederRecompensasSemanais(dados)
    const xpSemanais = missoesSemanaisConcluidas.reduce((soma, item) => soma + item.xp, 0)
    const moedasMissoes = missoesConcluidas.reduce((soma, item) => soma + item.moedas, 0)
    const moedasSemanais = missoesSemanaisConcluidas.reduce((soma, item) => soma + item.moedas, 0)
    let moedasBau = 0
    if (dados.bauDiario.data !== hoje) dados.bauDiario = { data: hoje, aberto: false, moedas: 0 }
    if (!dados.bauDiario.aberto && Object.keys(dados.missoes.resgatadas).length === 6) {
      moedasBau = RECOMPENSAS.bauDiario.moedas
      dados.moedas += moedasBau
      dados.bauDiario = { data: hoje, aberto: true, moedas: moedasBau }
    }
    dados.progresso.xp += xpSemanais
    const novasConquistas: string[] = []
    const dadosParaConquistas = dados as DadosQuizio & DadosConquistas
    for (const conquista of CONQUISTAS) {
      if (!dados.conquistas[conquista.id] && estaConcluida(conquista, dadosParaConquistas)) {
        dados.conquistas[conquista.id] = new Date().toISOString()
        novasConquistas.push(conquista.id)
      }
    }
    if (primeiraDoDia && sequencia.atual === 1) dados.marcosSequenciaPagos = { sequenciaInicio: hoje, marcos: [] }
    const inicioSequencia = (() => { let dia = hoje; for (let i = 1; i < sequencia.atual; i += 1) dia = diaAnterior(dia); return dia })()
    if (dados.marcosSequenciaPagos.sequenciaInicio !== inicioSequencia) dados.marcosSequenciaPagos = { sequenciaInicio: inicioSequencia, marcos: [] }
    const marcosPagos: number[] = []
    for (const [texto, recompensa] of Object.entries(RECOMPENSAS.marcosSequencia)) {
      const marco = Number(texto)
      if (sequencia.atual >= marco && !dados.marcosSequenciaPagos.marcos.includes(marco)) {
        dados.marcosSequenciaPagos.marcos.push(marco); marcosPagos.push(marco)
        dados.progresso.xp += recompensa.xp; dados.moedas += recompensa.moedas
      }
    }
    const nivelNovo = calcularNivel(dados.progresso.xp).nivel
    const itensDesbloqueados: string[] = []
    for (const item of RECOMPENSAS.itensPorNivel) {
      if (nivelNovo >= item.nivel && !dados.itensDesbloqueados.includes(item.id)) { dados.itensDesbloqueados.push(item.id); itensDesbloqueados.push(item.id) }
    }
    const ordemMedalhas = { bronze: 1, prata: 2, ouro: 3 } as const
    for (const conquista of CONQUISTAS) {
      const metas = RECOMPENSAS.medalhas[conquista.id]
      if (!metas) continue
      const valor = conquista.atual(dadosParaConquistas)
      const medalha = valor >= metas[2] ? 'ouro' : valor >= metas[1] ? 'prata' : valor >= metas[0] ? 'bronze' : null
      if (medalha && (!dados.medalhas[conquista.id] || ordemMedalhas[medalha] > ordemMedalhas[dados.medalhas[conquista.id]])) dados.medalhas[conquista.id] = medalha
    }
    const agora = new Date().toISOString()
    dados.historico.unshift({
      id: resultado.id, data: agora, categoriaId, modoId, dificuldade: resultado.config.dificuldade,
      total: resultado.total, acertos: resultado.acertos, erros: resultado.erros,
      pontuacao: resultado.pontuacao, xp: resultado.xp + xpDiario + xpMissoes + xpSemanais, duracaoMs: resultado.duracaoMs,
    })
    dados.historico = dados.historico.slice(0, LIMITE_HISTORICO)
    dados.registroDePartidas.push(resultado.id)
    dados.registroDePartidas = dados.registroDePartidas.slice(-LIMITE_IDS_REGISTRADOS)
    efeitos = {
      xpAntes, xpDepois: dados.progresso.xp, xpMissoes, xpDiario,
      nivelAnterior, nivelNovo, subiuDeNivel: nivelNovo > nivelAnterior,
      missoesConcluidas, novasConquistas,
      moedasGanham, moedasDesafio, moedasMissoes, moedasSemanais, moedasBau, itensDesbloqueados, marcosPagos,
      recorde: { categoriaId, anterior: recordeAnterior, atual: registro.melhorPontuacao, ehNovo: ehNovoRecorde },
      sequencia: { atual: sequencia.atual, melhor: sequencia.melhor, primeiraDoDia, novaMelhor: sequencia.melhor > melhorAnterior && sequencia.atual > 1 },
    }
  })
  return efeitos
}
