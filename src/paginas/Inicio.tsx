import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIAS } from '../dados/categorias'
import { CONQUISTAS } from '../dados/conquistas'
import { obterPerguntaPorId } from '../dados/perguntas'
import type { Categoria } from '../tipos'
import { calcularNivel } from '../utilitarios/progressao'
import { diaAnterior, diaLocal, resumirSequencia } from '../utilitarios/sequencia'
import { useDados } from '../servicos/useDados'
import { EmblemaCategoria } from '../componentes/EmblemaCategoria'
import { Icone } from '../componentes/Icone'
import { Roleta } from '../componentes/Roleta'

const TEMAS = ['CIÊNCIA', 'HISTÓRIA', 'CINEMA', 'NATUREZA', 'MÚSICA', 'GEOGRAFIA', 'JOGOS', 'LITERATURA']
const PREVIA = obterPerguntaPorId('ce-001')

function CartaoTema({ categoria }: { categoria: Categoria }) {
  const [temCapa, setTemCapa] = useState(true)
  return <Link to={`/explorar?categoria=${encodeURIComponent(categoria.id)}`} className={`inicio__tema-card inicio__tema-card--${categoria.cor}`}>
    {temCapa && <img src={`/imagens/categorias/${categoria.id}.jpg`} alt="" loading="lazy" onError={() => setTemCapa(false)} />}
    <span className="inicio__tema-fundo" />
    <span className="inicio__tema-emblema"><EmblemaCategoria id={categoria.id} tamanho={58} /></span>
    <span className="inicio__tema-texto"><strong>{categoria.nome}</strong><small>{categoria.descricao}</small></span>
    <Icone nome="arrow-up-right" tamanho={20} />
  </Link>
}

function PreviewInterativa() {
  const [escolhida, setEscolhida] = useState<number | null>(null)
  if (!PREVIA) return null
  const acertou = escolhida === PREVIA.correta
  return <div className="inicio__carta">
    <span className="inicio__carta-selo rotulo">PERGUNTA RÁPIDA</span>
    <Icone nome="lightbulb" tamanho={36} />
    <p>{PREVIA.enunciado}</p>
    <div className="inicio__opcoes" role="group" aria-label="Alternativas da prévia">
      {PREVIA.alternativas.map((opcao, indice) => {
        const revelada = escolhida !== null && indice === PREVIA.correta
        const marcadaErrada = escolhida === indice && !acertou
        return <button type="button" key={opcao} className={`inicio__opcao${revelada ? ' inicio__opcao--certa' : ''}${marcadaErrada ? ' inicio__opcao--errada' : ''}`} onClick={() => setEscolhida(indice)} aria-pressed={escolhida === indice}>
          <span>{String.fromCharCode(65 + indice)}</span>{opcao}{revelada && <Icone nome="check" tamanho={17} />}
        </button>
      })}
    </div>
    {escolhida !== null && <p className="inicio__explicacao" aria-live="polite">{PREVIA.explicacao}</p>}
    <span className="inicio__carta-rodape rotulo">CIÊNCIA E ESPAÇO · FÁCIL</span>
  </div>
}

function HistoriaDoJogador() {
  const dados = useDados()
  const hoje = diaLocal()
  const sequencia = resumirSequencia(dados.diasJogados, dados.estatisticas.melhorSequencia, hoje)
  const dias = useMemo(() => {
    const lista = [hoje]
    for (let i = 0; i < 6; i += 1) lista.unshift(diaAnterior(lista[0]))
    return lista
  }, [hoje])
  const nivel = calcularNivel(dados.progresso.xp)
  const recente = dados.historico[0]
  const conquistaSeguinte = CONQUISTAS.find((conquista) => !dados.conquistas[conquista.id])
  return <section className="inicio__historia" aria-labelledby="titulo-historia">
    <div className="inicio__historia-cabecalho"><div><p className="rotulo">SEU PROGRESSO, DO SEU JEITO</p><h2 id="titulo-historia">Sua história até aqui</h2></div><Link to="/perfil" className="link-acao">Ver perfil <Icone nome="arrow-right" tamanho={17} /></Link></div>
    <div className="inicio__historia-grade">
      <article className="historia-cartao historia-cartao--sequencia"><span className="rotulo">SEQUÊNCIA ATUAL</span><strong>{sequencia.atual} <small>{sequencia.atual === 1 ? 'dia' : 'dias'}</small></strong><p>{sequencia.emRisco ? 'Jogue hoje para manter sua sequência.' : sequencia.jogouHoje ? 'Você já jogou hoje. Boa sequência.' : 'Até agora, você fez por onde.'}</p><div className="sequencia-dias" aria-label="Últimos sete dias">
        {dias.map((dia) => { const jogou = dados.diasJogados.includes(dia); return <span key={dia} className={jogou ? 'sequencia-dias__dia sequencia-dias__dia--feito' : 'sequencia-dias__dia'} title={`${dia}${jogou ? ', jogou' : ', sem partida'}`} aria-label={`${dia}: ${jogou ? 'jogou' : 'sem partida'}`}><i aria-hidden="true" /></span> })}
      </div><small className="historia-cartao__nota">MELHOR: {sequencia.melhor} DIAS</small></article>
      <article className="historia-cartao"><span className="rotulo">NÍVEL</span><strong>{nivel.nivel}</strong><div className="barra"><span style={{ width: `${nivel.percentual}%` }} /></div><p>{dados.progresso.xp.toLocaleString('pt-BR')} XP acumulados</p></article>
      <article className="historia-cartao"><span className="rotulo">PARTIDAS</span><strong>{dados.estatisticas.partidas}</strong><p>{dados.estatisticas.acertos} respostas certas de {dados.estatisticas.perguntasRespondidas}</p></article>
      <article className="historia-cartao historia-cartao--recente"><span className="rotulo">ÚLTIMA PARTIDA</span>{recente ? <><strong>{recente.acertos}/{recente.total}</strong><p>{recente.pontuacao.toLocaleString('pt-BR')} pontos · {recente.categoriaId}</p><Link to="/resultado" className="link-acao">Rever resultado <Icone nome="arrow-right" tamanho={17} /></Link></> : <><strong>Por começar</strong><p>Seu primeiro resultado aparece aqui.</p><Link to="/explorar" className="link-acao">Escolher um tema <Icone nome="arrow-right" tamanho={17} /></Link></>}</article>
    </div>
    {conquistaSeguinte && <p className="inicio__proxima">Próximo marco: <strong>{conquistaSeguinte.titulo}</strong> · {conquistaSeguinte.descricao}</p>}
  </section>
}

export function Inicio() {
  const dados = useDados()
  const [roletaAberta, setRoletaAberta] = useState(false)
  const primeiroAcesso = dados.estatisticas.partidas === 0
  const diarioConcluido = dados.desafioDiario.ultimaData === diaLocal()
  const temas = useMemo(() => [...CATEGORIAS].sort((a, b) => (dados.estatisticas.porCategoria[b.id]?.partidas ?? 0) - (dados.estatisticas.porCategoria[a.id]?.partidas ?? 0)).slice(0, 6), [dados.estatisticas.porCategoria])

  return <main className="inicio">
    <section className="inicio__hero">
      <div className="inicio__conteudo">
        <p className="rotulo">UM QUIZ DE CONHECIMENTOS GERAIS</p>
        <h1 tabIndex={-1}>{primeiroAcesso ? <>Uma boa pergunta<br /><span>muda o jogo.</span></> : <>Oi, {dados.perfil.nome}.<br /><span>Qual é a boa?</span></>}</h1>
        <p className="inicio__descricao">Temas para explorar, perguntas que ensinam e aquele prazer de acertar no susto.</p>
        <div className="inicio__acoes"><Link className="botao botao--primario" to="/explorar">Escolher um tema <Icone nome="arrow-right" /></Link><button className="botao botao--secundario" type="button" onClick={() => setRoletaAberta(true)}><Icone nome="sparkles" />Surpreenda-me</button></div>
      </div>
      <PreviewInterativa />
      <span className="inicio__estrela" aria-hidden="true"><Icone nome="sparkles" tamanho={52} /></span>
    </section>
    <div className="temas-faixa" aria-label="Temas disponíveis"><div className="temas-faixa__trilho">{[...TEMAS, ...TEMAS].map((tema, i) => <span key={`${tema}-${i}`}>{tema}<Icone nome="sparkles" tamanho={14} /></span>)}</div></div>

    <section className="inicio__desafio fundo-escuro" aria-labelledby="titulo-desafio">
      <div className="inicio__desafio-selo"><Icone nome="calendar" tamanho={22} /><span className="rotulo">O MESMO DESAFIO PARA TODO MUNDO, HOJE</span></div>
      <div className="inicio__desafio-conteudo"><p className="rotulo">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p><h2 id="titulo-desafio">Cinco perguntas.<br /><span>Uma chance hoje.</span></h2><p>O desafio diário muda à meia-noite, no horário local. Termine para guardar seu resultado e ganhar o bônus do dia.</p><Link className="botao botao--amarelo" to={diarioConcluido ? '/resultado' : '/jogo?modo=diario'}>{diarioConcluido ? 'Rever respostas de hoje' : 'Aceitar desafio'} <Icone nome="arrow-right" /></Link></div>
      <div className="inicio__desafio-detalhe" aria-hidden="true"><span>F</span><span>F</span><span>M</span><span>M</span><span>D</span><i /></div>
    </section>

    <section className="inicio__temas" aria-labelledby="titulo-temas">
      <div className="secao__cabecalho"><div><p className="rotulo">ASSUNTOS PARA IR MAIS LONGE</p><h2 id="titulo-temas" className="titulo-secao">Qual tema chama você?</h2></div><Link className="link-acao" to="/explorar">Ver os 23 temas <Icone nome="arrow-right" tamanho={17} /></Link></div>
      <div className="inicio__temas-grade">{temas.map((categoria) => <CartaoTema key={categoria.id} categoria={categoria} />)}</div>
    </section>

    <section className="inicio__modos" aria-labelledby="titulo-modos">
      <div className="secao__cabecalho"><div><p className="rotulo">UMA REGRA PARA CADA MOMENTO</p><h2 id="titulo-modos" className="titulo-secao">Escolha seu ritmo.</h2></div><Link className="link-acao" to="/explorar">Ver todos os modos <Icone nome="arrow-right" tamanho={17} /></Link></div>
      <div className="inicio__modos-grade">
        {[['classico', 'Clássico', 'No seu tempo. Dá para pausar e pular algumas perguntas.', 'clock'], ['tempo', 'Contra o tempo', 'Vinte segundos. Acertou rápido? Ganha pontos extras.', 'timer'], ['sobrevivencia', 'Sobrevivência', 'Acerte para continuar. Um erro e a rodada termina.', 'flame'], ['duelo', 'Duelo local', 'Duas pessoas, um aparelho, as mesmas perguntas.', 'swords']].map(([id, nome, descricao, icone]) => <Link key={id} className={`modo-cartao modo-cartao--${id}`} to={`/explorar?modo=${id}`}><Icone nome={icone as 'clock' | 'timer' | 'flame' | 'swords'} tamanho={25} /><span className="rotulo">MODO DE JOGO</span><h3>{nome}</h3><p>{descricao}</p><Icone className="modo-cartao__seta" nome="arrow-up-right" /></Link>)}
      </div>
    </section>

    <section className="inicio__recompensas">
      <div><p className="rotulo">PROGRESSO QUE TEM A SUA CARA</p><h2>As partidas rendem<br />mais que pontos.</h2><p>Conquistas, missões e uma coleção de itens cosméticos crescem com você. Tudo salvo só neste navegador.</p><Link className="botao botao--secundario" to="/recompensas">Ver recompensas <Icone nome="arrow-right" /></Link></div>
      <div className="inicio__recompensas-cartas" aria-hidden="true"><div className="recompensa-selo"><Icone nome="medal" tamanho={34} /><span>CONQUISTA</span><strong>Mente Afiada</strong></div><div className="recompensa-moedas"><Icone nome="coins" tamanho={35} /><strong>+25</strong><span>MOEDAS</span></div><div className="recompensa-baú"><Icone nome="gift" tamanho={44} /></div></div>
    </section>

    <HistoriaDoJogador />

    <section className="inicio__final"><span className="rotulo">A CURIOSIDADE NÃO TEM FIM</span><h2>Tem um tema esperando<br />por você.</h2><div><Link className="botao botao--primario" to="/explorar">Bora jogar <Icone nome="arrow-right" /></Link><button className="botao botao--secundario" type="button" onClick={() => setRoletaAberta(true)}>Girar a roleta</button></div></section>
    {roletaAberta && <Roleta modo="modal" onFechar={() => setRoletaAberta(false)} />}
  </main>
}
