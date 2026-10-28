import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PERGUNTAS } from '../dados/perguntas'
import { obterRegrasDoModo, obterNomeDoModo } from '../dados/modos'
import { Icone } from '../componentes/Icone'
import { abandonarPartida, avancar, calcularPulosRestantes, calcularRestanteMs, concluirPartida, criarPartida, esgotarTempo, obterPartidaAtiva, obterQuestaoAtual, obterVezDeJogar, pausarPartida, pular, responder, retomarPartida, type Partida } from '../servicos/partida'
import type { Dificuldade, ModoId } from '../tipos'

function lerConfig(params: URLSearchParams) {
  const modo = params.get('modo') ?? 'classico'
  const ids = params.get('ids')?.split(',').filter(Boolean)
  return { categoriaId: params.get('categoria') ?? 'todas', dificuldade: (params.get('dificuldade') ?? 'misto') as Dificuldade, modoId: (['classico','tempo','sobrevivencia','diario','duelo'].includes(modo) ? modo : 'classico') as ModoId, quantidade: Math.max(1, Number(params.get('quantidade')) || 10), ...(params.get('treino') === '1' && ids?.length ? { perguntaIds: ids, treino: true } : {}) }
}

export function Jogo() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [partida, setPartida] = useState<Partida | null>(() => obterPartidaAtiva(PERGUNTAS))
  const [tick, setTick] = useState(Date.now())
  const [confirmarSaida, setConfirmarSaida] = useState(false)
  const [convidadoPronto, setConvidadoPronto] = useState(false)
  const [erro, setErro] = useState('')
  const config = useMemo(() => lerConfig(params), [params])

  useEffect(() => {
    if (partida) return
    const criada = criarPartida(config, PERGUNTAS)
    if (criada.partida) setPartida(criada.partida)
    else setErro(criada.erro ?? 'Não foi possível começar a partida.')
  }, [config, partida])

  useEffect(() => {
    if (!partida || partida.pausadaEm !== null || !obterRegrasDoModo(partida.config.modoId).temTempo) return
    const id = window.setInterval(() => setTick(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [partida])

  const sincronizar = (estado = partida) => {
    if (!estado) return
    const resultado = concluirPartida(estado, PERGUNTAS)
    if (resultado) { setPartida(null); navigate('/resultado', { replace: true }) }
    else setPartida({ ...estado, respostas: [...estado.respostas], questoes: [...estado.questoes], convidado: estado.convidado ? { ...estado.convidado, respostas: [...estado.convidado.respostas] } : null })
  }
  useEffect(() => {
    if (!partida || partida.pausadaEm !== null || !obterRegrasDoModo(partida.config.modoId).temTempo) return
    if ((calcularRestanteMs(partida, tick) ?? 1) <= 0 && obterVezDeJogar(partida) === 0) { esgotarTempo(partida, PERGUNTAS, tick); setPartida({ ...partida, respostas: [...partida.respostas] }) }
  }, [partida, tick])

  if (erro) return <main className="jogo-vazio"><h1>Partida indisponível</h1><p>{erro}</p><Link className="botao botao--primario" to="/explorar">Voltar ao Explorar</Link></main>
  if (!partida) return <main className="jogo-vazio"><p>Preparando sua partida…</p></main>
  const atual = obterQuestaoAtual(partida, PERGUNTAS)
  if (!atual) return <main className="jogo-vazio"><h1>Essa pergunta não está disponível.</h1><Link to="/explorar">Voltar ao Explorar</Link></main>
  const regras = obterRegrasDoModo(partida.config.modoId)
  const vez = obterVezDeJogar(partida)
  const resposta = vez === null ? (partida.convidado ? partida.convidado.respostas[partida.indice] : partida.respostas[partida.indice]) : null
  const restante = calcularRestanteMs(partida, tick)
  const responderPosicao = (posicao: number) => { if (vez === null) return; responder(partida, PERGUNTAS, posicao); setPartida({ ...partida, respostas: [...partida.respostas], convidado: partida.convidado ? { ...partida.convidado, respostas: [...partida.convidado.respostas] } : null }) }
  const avancarOuTerminar = () => { if (avancar(partida)) sincronizar(partida) }
  const sair = () => { abandonarPartida(); navigate('/explorar') }

  return <main className="jogo" aria-label="Partida de quiz">
    <header className="jogo__topo"><Link to="/explorar" onClick={(evento) => { evento.preventDefault(); setConfirmarSaida(true) }} aria-label="Sair da partida"><Icone nome="arrow-left" /></Link><span>{obterNomeDoModo(partida.config.modoId)}{partida.config.treino ? ' · Treino' : ''}</span><strong>{partida.indice + 1}<small>/{partida.questoes.length}</small></strong>{regras.permitePausa && <button type="button" className="botao-icone" onClick={() => { pausarPartida(partida); setPartida({ ...partida }) }} aria-label="Pausar"><Icone nome="pause" /></button>}</header>
    <div className="jogo__segmentos" aria-label={`Pergunta ${partida.indice + 1} de ${partida.questoes.length}`}>{partida.questoes.map((questao, indice) => <span key={questao.id} className={indice < partida.indice ? partida.respostas[indice]?.acertou ? 'feito-certo' : 'feito-erro' : indice === partida.indice ? 'atual' : ''} />)}</div>
    {regras.temTempo && <div className="jogo__tempo" role="progressbar" aria-label="Tempo restante" aria-valuenow={Math.ceil((restante ?? 0) / 1000)} aria-valuemin={0} aria-valuemax={20} style={{ transform: `scaleX(${Math.max(0, (restante ?? 0) / 20000)})` }} />}
    {partida.pausadaEm !== null ? <section className="jogo__pausa"><Icone nome="pause" tamanho={38} /><p className="rotulo">PAUSA</p><h1>Respira. A partida espera.</h1><button className="botao botao--primario" onClick={() => { retomarPartida(partida); setPartida({ ...partida }) }}>Continuar</button><button className="link-acao" onClick={() => setConfirmarSaida(true)}>Abandonar partida</button></section> : <div className="jogo__grade">
      <section className="jogo__pergunta"><p className="rotulo">{atual.pergunta.categoria.replaceAll('-', ' ')} · {atual.pergunta.dificuldade}</p><h1>{atual.pergunta.enunciado}</h1><div className="jogo__pontos"><span>{partida.pontuacao.toLocaleString('pt-BR')} pontos</span><span>Combo {partida.combo}</span></div>{regras.temTempo && <span className="sr-only" aria-live="polite">{Math.ceil((restante ?? 0) / 1000) === 5 ? 'Restam 5 segundos' : ''}</span>}</section>
      <section className="jogo__respostas" aria-label="Alternativas">{partida.config.modoId === 'duelo' && vez === 1 && !convidadoPronto && <div className="jogo__passe"><Icone nome="users" tamanho={30} /><h2>Passe o aparelho para o convidado</h2><p>A resposta do jogador está escondida.</p><button className="botao botao--primario" onClick={() => setConvidadoPronto(true)}>Convidado, responder</button></div>}{partida.config.modoId === 'duelo' && vez === null && <div className="jogo__revelacao"><p>Jogador: {partida.respostas[partida.indice]?.acertou ? 'acertou' : 'errou'} · Convidado: {partida.convidado?.respostas[partida.indice]?.acertou ? 'acertou' : 'errou'}</p><button className="botao botao--primario" onClick={avancarOuTerminar}>Próxima pergunta</button></div>}{(vez === 0 || (partida.config.modoId === 'duelo' && vez === 1 && convidadoPronto)) && atual.alternativas.map((alternativa, indice) => <button type="button" key={alternativa.indiceOriginal} className="jogo__opcao" onClick={() => { responderPosicao(indice); if (partida.config.modoId === 'duelo') setConvidadoPronto(false) }}><span>{String.fromCharCode(65 + indice)}</span>{alternativa.texto}</button>)}{resposta && partida.config.modoId !== 'duelo' && <div className="jogo__explicacao"><p>{resposta.acertou ? 'Boa! Resposta certa.' : resposta.motivo === 'pulou' ? 'Pergunta pulada.' : 'Quase. Veja a resposta certa.'}</p><strong>{atual.pergunta.alternativas[atual.pergunta.correta]}</strong><p>{atual.pergunta.explicacao}</p><button className="botao botao--primario" onClick={avancarOuTerminar}>{partida.indice + 1 === partida.questoes.length ? 'Ver resultado' : 'Próxima pergunta'}</button></div>}{regras.permitePular && vez === 0 && !resposta && <button className="link-acao" disabled={!calcularPulosRestantes(partida)} onClick={() => { pular(partida, PERGUNTAS); setPartida({ ...partida, respostas: [...partida.respostas] }) }}>Pular pergunta ({calcularPulosRestantes(partida)} restantes)</button>}</section>
    </div>}
    {confirmarSaida && <div className="drawer-fundo"><section className="confirmar-saida" role="dialog" aria-modal="true" aria-labelledby="sair-titulo"><h2 id="sair-titulo">Abandonar esta partida?</h2><p>Seu progresso desta rodada não entra no histórico nem rende XP.</p><button className="botao botao--primario" onClick={sair}>Abandonar</button><button className="botao botao--secundario" onClick={() => setConfirmarSaida(false)}>Continuar jogando</button></section></div>}
  </main>
}
