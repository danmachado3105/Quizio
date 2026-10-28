import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PERGUNTAS } from '../dados/perguntas'
import { Icone } from '../componentes/Icone'
import { obterIdsDasErradas, obterResultado } from '../servicos/partida'
import { tocarSom } from '../servicos/som'
import { useDados } from '../servicos/useDados'

export function Resultado() {
  const resultado = obterResultado()
  const navegar = useNavigate()
  const dados = useDados()
  const [soErradas, setSoErradas] = useState(false)
  const [compartilhado, setCompartilhado] = useState('')
  const somTocado = useRef(false)
  useEffect(() => {
    if (!resultado || !resultado.progresso || somTocado.current) return
    if (resultado.progresso.subiuDeNivel) tocarSom('nivel', dados.preferencias.som)
    else if (resultado.progresso.novasConquistas.length) tocarSom('conquista', dados.preferencias.som)
    somTocado.current = true
  }, [resultado, dados.preferencias.som])
  if (!resultado) return <main className="resultado-vazio"><h1>Nenhum resultado por aqui.</h1><p>Quando terminar uma partida, você poderá revisar as respostas.</p><Link className="botao botao--primario" to="/explorar">Escolher um tema</Link></main>
  const erradas = obterIdsDasErradas(resultado)
  const desafioDiario = resultado.config.modoId === 'diario'
  const respostas = soErradas ? resultado.respostas.filter((resposta) => !resposta.acertou) : resultado.respostas
  const classe = resultado.perfeita ? 'perfeita' : resultado.percentual >= 80 ? 'otimo' : resultado.percentual >= 50 ? 'bom' : 'tentar'
  const compartilhar = async () => {
    const texto = `Fiz ${resultado.acertos} de ${resultado.total} no Quizio e marquei ${resultado.pontuacao.toLocaleString('pt-BR')} pontos!`
    const dadosCompartilhados = { title: 'Meu resultado no Quizio', text: texto, url: window.location.origin }
    try {
      if (navigator.share) await navigator.share(dadosCompartilhados)
      else { await navigator.clipboard.writeText(`${texto} ${dadosCompartilhados.url}`); setCompartilhado('Resultado copiado para a área de transferência.') }
    } catch { setCompartilhado('Não foi possível compartilhar agora.') }
  }
  return <main className={`resultado resultado--${classe}`}>
    <header className="resultado__hero"><p className="rotulo">PARTIDA ENCERRADA · {resultado.config.modoId.toUpperCase()}</p>{resultado.perfeita && <div className="resultado__particulas" aria-hidden="true">{Array.from({ length: 24 }, (_, indice) => <i key={indice} style={{ '--i': indice } as CSSProperties} />)}</div>}<h1 tabIndex={-1}>{resultado.perfeita ? 'Impecável.' : resultado.percentual >= 80 ? 'Mandou muito bem.' : resultado.percentual >= 50 ? 'Boa rodada.' : 'Toda partida ensina.'}</h1><p>{resultado.perfeita ? 'Acertou todas. Uma bela leitura do jogo.' : resultado.percentual >= 50 ? 'Olha só o que você conquistou nesta rodada.' : 'Mais uma rodada e você já vai reconhecer algumas pegadinhas.'}</p><div className="resultado__numeros"><div><strong>{resultado.pontuacao.toLocaleString('pt-BR')}</strong><span>PONTOS</span></div><div><strong>{resultado.acertos}/{resultado.total}</strong><span>ACERTOS</span></div><div><strong>{resultado.percentual}%</strong><span>PRECISÃO</span></div><div><strong>+{resultado.xp}</strong><span>XP</span></div></div></header>
    <section className="resultado__acoes">{!desafioDiario && <button className="botao botao--primario" onClick={() => navegar(`/jogo?categoria=${resultado.config.categoriaId}&dificuldade=${resultado.config.dificuldade}&quantidade=${resultado.config.quantidade}&modo=${resultado.config.modoId}`)}>Jogar novamente <Icone nome="refresh" /></button>}{erradas.length > 0 && <button className="botao botao--secundario" onClick={() => navegar(`/jogo?modo=classico&treino=1&ids=${erradas.join(',')}`)}>Rever só as erradas ({erradas.length})</button>}<a className="botao botao--secundario" href="#revisao">Revisar respostas</a>{!desafioDiario && <Link className="botao botao--secundario" to="/explorar">Alterar configurações</Link>}<button className="botao botao--secundario" onClick={() => void compartilhar()}>Compartilhar resultado</button><Link className="link-acao" to="/">Voltar ao início</Link></section>{compartilhado && <p role="status" className="resultado__compartilhado">{compartilhado}</p>}
    {resultado.progresso && <section className="resultado__ganhos"><div><strong>+{resultado.progresso.moedasGanham + resultado.progresso.moedasDesafio + resultado.progresso.moedasMissoes + resultado.progresso.moedasSemanais + resultado.progresso.moedasBau} moedas</strong><span>{resultado.progresso.moedasGanham} por acertos · {resultado.progresso.moedasMissoes + resultado.progresso.moedasSemanais} por missões</span></div>{resultado.progresso.moedasBau > 0 && <div><Icone nome="gift" /> Baú do dia aberto: +{resultado.progresso.moedasBau}</div>}{resultado.progresso.itensDesbloqueados.length > 0 && <div>Item desbloqueado: {resultado.progresso.itensDesbloqueados.join(', ')}</div>}{resultado.progresso.novasConquistas.length > 0 && <div>Nova conquista: {resultado.progresso.novasConquistas.join(', ')}</div>}</section>}
    {resultado.progresso && <section className="resultado__resumo"><article><span className="rotulo">SEQUÊNCIA DE DIAS</span><strong>{resultado.progresso.sequencia.atual} dias · melhor {resultado.progresso.sequencia.melhor}</strong></article><article><span className="rotulo">RECORDE DE {resultado.progresso.recorde.categoriaId}</span><strong>{resultado.progresso.recorde.ehNovo ? 'Novo recorde!' : `${resultado.progresso.recorde.atual.toLocaleString('pt-BR')} pontos`}</strong></article>{resultado.progresso.xpDiario > 0 && <article><span className="rotulo">BÔNUS DO DESAFIO DIÁRIO</span><strong>+{resultado.progresso.xpDiario} XP</strong></article>}{resultado.duelo && <article><span className="rotulo">PLACAR DO DUELO</span><strong>{resultado.duelo.vencedor === 'empate' ? 'Empate' : `Vitória de ${resultado.duelo.vencedor === 'jogador' ? dados.perfil.nome : resultado.duelo.convidado.nome}`} · {resultado.duelo.convidado.pontuacao} pontos do convidado</strong></article>}</section>}
    <section className="resultado__temas"><h2>Desempenho por tema</h2><div>{Object.entries(resultado.perguntasPorCategoria).map(([id, info]) => <article key={id}><span>{id}</span><strong>{info.acertos}/{info.respondidas}</strong></article>)}</div></section>
    <section className="resultado__revisao" id="revisao"><div className="secao__cabecalho"><div><p className="rotulo">REVISÃO DA PARTIDA</p><h2>Uma pergunta de cada vez.</h2></div><label><input type="checkbox" checked={soErradas} onChange={(evento) => setSoErradas(evento.target.checked)} /> Só as erradas ({erradas.length})</label></div>{respostas.map((resposta, indice) => { const pergunta = PERGUNTAS.find((item) => item.id === resposta.perguntaId); if (!pergunta) return null; return <article className={`revisao-item ${resposta.acertou ? 'revisao-item--certa' : 'revisao-item--errada'}`} key={`${resposta.perguntaId}-${indice}`}><span className="rotulo">{resposta.acertou ? 'ACERTO' : resposta.motivo === 'pulou' ? 'PULADA' : resposta.motivo === 'tempo' ? 'TEMPO ESGOTADO' : 'RESPOSTA INCORRETA'} · {pergunta.dificuldade}</span><h3>{pergunta.enunciado}</h3><p>Sua resposta: <strong>{resposta.escolhida === null ? 'Sem resposta' : pergunta.alternativas[resposta.escolhida]}</strong></p><p>Resposta certa: <strong>{pergunta.alternativas[pergunta.correta]}</strong></p><p>{pergunta.explicacao}</p></article> })}</section>
  </main>
}
