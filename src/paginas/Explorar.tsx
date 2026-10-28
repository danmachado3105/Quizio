import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CATEGORIAS, GRUPOS, obterCategoriaPorId } from '../dados/categorias'
import { DIFICULDADES, PERGUNTAS, contarPerguntasPorCategoriaEDificuldade } from '../dados/perguntas'
import { MODOS } from '../dados/modos'
import { alternarFavorita } from '../servicos/armazenamento'
import { obterPartidaAtiva, calcularOpcoesDeQuantidade, type Partida } from '../servicos/partida'
import { useDados } from '../servicos/useDados'
import { Icone } from '../componentes/Icone'
import { EmblemaCategoria } from '../componentes/EmblemaCategoria'
import { Roleta } from '../componentes/Roleta'
import type { Categoria, Dificuldade, ModoId } from '../tipos'
import { diaLocal } from '../utilitarios/sequencia'

const DIFICULDADES_CONTAGEM = contarPerguntasPorCategoriaEDificuldade()
const NOMES_MODOS: Record<string, string> = Object.fromEntries(MODOS.map((modo) => [modo.id, modo.nome]))
const normalize = (texto: string) => texto.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

function CapaCategoria({ categoria }: { categoria: Categoria }) {
  const [disponivel, setDisponivel] = useState(true)
  if (!disponivel) return <span className={`categoria-cartao__capa categoria-cartao__capa--${categoria.cor}`} aria-hidden="true"><EmblemaCategoria id={categoria.id} tamanho={64} /></span>
  return <span className="categoria-cartao__capa"><img src={`/imagens/categorias/${categoria.id}.jpg`} alt="" loading="lazy" onError={() => setDisponivel(false)} /><EmblemaCategoria className="categoria-cartao__emblema" id={categoria.id} tamanho={64} /></span>
}

function CartaoCategoria({ categoria, total, favorita, jogadas, respondidas, onAbrir, onFavoritar }: {
  categoria: Categoria; total: number; favorita: boolean; jogadas: number; respondidas: number
  onAbrir: () => void; onFavoritar: () => void
}) {
  const divisoes = DIFICULDADES_CONTAGEM[categoria.id] ?? { facil: 0, medio: 0, dificil: 0 }
  const percentual = total ? Math.min(100, Math.floor((respondidas / total) * 100)) : 0
  return <article className="categoria-cartao">
    <button className="categoria-cartao__abrir" type="button" onClick={onAbrir} aria-label={`Configurar partida de ${categoria.nome}`}>
      <CapaCategoria categoria={categoria} />
      <span className="categoria-cartao__conteudo"><span className="categoria-cartao__sobretitulo rotulo">{GRUPOS.find((grupo) => grupo.id === categoria.grupo)?.nome}</span><strong>{categoria.nome}</strong><span className="categoria-cartao__descricao">{categoria.descricao}</span><span className="categoria-cartao__contagem">{total} perguntas <i>·</i> {divisoes.facil} fáceis <i>·</i> {divisoes.medio} médias <i>·</i> {divisoes.dificil} difíceis</span><span className="barra"><span style={{ width: `${percentual}%` }} /></span><span className="categoria-cartao__progresso">{respondidas} respondidas · {jogadas} {jogadas === 1 ? 'partida' : 'partidas'}</span></span>
    </button>
    {categoria.novo && <span className="badge badge--novo categoria-cartao__novo">Novo</span>}
    <button className="categoria-cartao__favorito" type="button" aria-pressed={favorita} aria-label={favorita ? `Remover ${categoria.nome} das favoritas` : `Adicionar ${categoria.nome} às favoritas`} onClick={onFavoritar}><Icone nome="bookmark" tamanho={20} /></button>
  </article>
}

function RetomarPartida({ partida }: { partida: Partida }) {
  const categoria = obterCategoriaPorId(partida.config.categoriaId)
  return <section className="explorar__continuar" aria-labelledby="titulo-continuar"><div className="secao__cabecalho"><div><p className="rotulo">AINDA ESTÁ ROLANDO</p><h2 id="titulo-continuar">Continue de onde parou</h2></div></div><Link to="/jogo" className="retomar-cartao"><span className="retomar-cartao__icone"><Icone nome="play" tamanho={27} /></span><span><span className="rotulo">RETOMAR PARTIDA</span><strong>{categoria?.nome ?? 'Partida em andamento'}</strong><small>Pergunta {partida.indice + 1} de {partida.questoes.length} · {NOMES_MODOS[partida.config.modoId]}</small></span><Icone nome="arrow-right" tamanho={22} /></Link></section>
}

function DrawerConfiguracao({ categoriaInicial, modoInicial, aoFechar }: { categoriaInicial: Categoria | null; modoInicial: ModoId; aoFechar: () => void }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const painel = useRef<HTMLDivElement>(null)
  const dados = useDados()
  const hoje = diaLocal()
  const desafioFeito = dados.desafioDiario.ultimaData === hoje
  const [categoriaId, setCategoriaId] = useState(categoriaInicial?.id ?? params.get('categoria') ?? 'todas')
  const dificuldadeInicial = params.get('dificuldade')
  const [dificuldade, setDificuldade] = useState<Dificuldade>(['facil', 'medio', 'dificil', 'misto'].includes(dificuldadeInicial ?? '') ? dificuldadeInicial as Dificuldade : 'misto')
  const [modoId, setModoId] = useState<ModoId>(modoInicial)
  const [quantidade, setQuantidade] = useState(Math.max(1, Number(params.get('quantidade')) || 10))
  const q = PERGUNTAS.filter((pergunta) => (categoriaId === 'todas' || pergunta.categoria === categoriaId) && (dificuldade === 'misto' || pergunta.dificuldade === dificuldade)).length
  const opcoes = calcularOpcoesDeQuantidade(q)
  const regras = MODOS.find((modo) => modo.id === modoId)?.regras ?? MODOS[0].regras

  useEffect(() => {
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const painelAtual = painel.current
    document.body.classList.add('modal-aberto')
    painelAtual?.querySelector<HTMLElement>('button, select')?.focus()
    const aoTeclar = (evento: globalThis.KeyboardEvent) => {
      if (evento.key === 'Escape') { evento.preventDefault(); aoFechar(); return }
      if (evento.key !== 'Tab' || !painelAtual) return
      const focaveis = [...painelAtual.querySelectorAll<HTMLElement>('button:not(:disabled), select:not(:disabled), a[href]')]
      if (!focaveis.length) return
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo.focus() }
      else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro.focus() }
    }
    document.addEventListener('keydown', aoTeclar)
    return () => { document.body.classList.remove('modal-aberto'); document.removeEventListener('keydown', aoTeclar); anterior?.focus() }
  }, [aoFechar])

  const iniciar = () => {
    if (modoId === 'diario') {
      navigate(desafioFeito ? '/resultado?diario=hoje' : '/jogo?modo=diario')
      return
    }
    const config = new URLSearchParams({ categoria: categoriaId, dificuldade, quantidade: String(regras.usaTodasAsPerguntas ? q : Math.min(quantidade, q)), modo: modoId })
    navigate(`/jogo?${config.toString()}`)
  }

  const detalheModo: Record<ModoId, string> = {
    classico: 'Sem relógio, com pausa e alguns pulos. Um bom lugar para explorar com calma.',
    tempo: 'Você tem 20 segundos por pergunta. Respostas rápidas valem bônus de pontos.',
    sobrevivencia: 'Todas as perguntas desse recorte, embaralhadas. A primeira resposta errada encerra.',
    diario: 'Cinco perguntas iguais para todo mundo hoje. O desafio fecha à meia-noite local.',
    duelo: 'Duas pessoas respondem às mesmas perguntas no mesmo aparelho. O convidado joga depois.',
  }

  return <div className="drawer-fundo" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) aoFechar() }}><div className="drawer" ref={painel} role="dialog" aria-modal="true" aria-labelledby="titulo-config">
    <div className="drawer__cabecalho"><div><p className="rotulo">CONFIGURE SUA PARTIDA</p><h2 id="titulo-config">Bora jogar?</h2></div><button type="button" className="botao-icone" onClick={aoFechar} aria-label="Fechar configuração"><Icone nome="x" /></button></div>
    {modoId !== 'diario' ? <>
      <label className="campo__grupo"><span className="rotulo">TEMA</span><select className="campo__controle" value={categoriaId} onChange={(evento) => setCategoriaId(evento.target.value)}><option value="todas">Todas as categorias</option>{CATEGORIAS.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select></label>
      <fieldset className="drawer__campo"><legend className="rotulo">DIFICULDADE</legend><div className="drawer__opcoes">{(['misto', 'facil', 'medio', 'dificil'] as const).map((nivel) => { const total = PERGUNTAS.filter((pergunta) => (categoriaId === 'todas' || pergunta.categoria === categoriaId) && (nivel === 'misto' || pergunta.dificuldade === nivel)).length; const rotulo = nivel === 'misto' ? 'Mista' : DIFICULDADES.find((item) => item.id === nivel)?.nome ?? nivel; return <button type="button" key={nivel} className={dificuldade === nivel ? 'opcao-pill opcao-pill--ativa' : 'opcao-pill'} aria-pressed={dificuldade === nivel} onClick={() => setDificuldade(nivel)}>{rotulo}<small>{total}</small></button> })}</div></fieldset>
      {!regras.usaTodasAsPerguntas && <label className="campo__grupo"><span className="rotulo">QUANTIDADE</span><select className="campo__controle" value={Math.min(quantidade, q)} onChange={(evento) => setQuantidade(Number(evento.target.value))}>{opcoes.map((opcao) => <option key={opcao} value={opcao}>{opcao === q && q < 20 && ![5, 10, 15, 20].includes(q) ? `Todas (${q})` : `${opcao} perguntas`}</option>)}</select></label>}
      <label className="campo__grupo"><span className="rotulo">MODO</span><select className="campo__controle" value={modoId} onChange={(evento) => setModoId(evento.target.value as ModoId)}>{MODOS.map((modo) => <option key={modo.id} value={modo.id}>{modo.nome}</option>)}</select></label>
    </> : <div className="drawer__diario"><Icone nome="calendar" tamanho={31} /><h3>{desafioFeito ? 'Você já encarou o desafio de hoje.' : 'Cinco perguntas reservadas para hoje.'}</h3><p>{desafioFeito ? 'As respostas e o resultado continuam disponíveis para revisão.' : 'A sequência de dificuldades é a mesma para todos. Seu progresso fica neste navegador.'}</p></div>}
    <div className="drawer__resumo"><span className="rotulo">REGRAS DESTE MODO</span><p>{detalheModo[modoId]}</p>{modoId !== 'diario' && <small>{q} perguntas disponíveis neste recorte.</small>}</div>
    <div className="drawer__acoes"><button type="button" className="botao botao--primario" onClick={iniciar} disabled={modoId !== 'diario' && q === 0}>{modoId === 'diario' ? desafioFeito ? 'Rever respostas' : 'Aceitar desafio' : 'Começar partida'} <Icone nome="arrow-right" /></button><button type="button" className="link-acao" onClick={aoFechar}>Voltar ao Explorar</button></div>
  </div></div>
}

export function Explorar() {
  const dados = useDados()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [grupo, setGrupo] = useState('todos')
  const [dificuldade, setDificuldade] = useState('todas')
  const [soFavoritas, setSoFavoritas] = useState(false)
  const [ordem, setOrdem] = useState('recomendadas')
  const modoParametro = searchParams.get('modo') ?? 'classico'
  const modoValido = (MODOS.some((modo) => modo.id === modoParametro) ? modoParametro : 'classico') as ModoId
  const idParam = searchParams.get('categoria')
  const categoriaSelecionada = idParam ? obterCategoriaPorId(idParam) : null
  const categoriaPartida = categoriaSelecionada ? categoriaSelecionada.id : null
  const partidaAtiva = useMemo(() => obterPartidaAtiva(PERGUNTAS), [])
  const colecaoFavoritas = dados.favoritas
  const textoBusca = normalize(busca)
  const perguntaMatches = textoBusca.length >= 3 ? PERGUNTAS.filter((pergunta) => normalize(pergunta.enunciado).includes(textoBusca)) : []
  const idsPergunta = new Set(perguntaMatches.map((pergunta) => pergunta.categoria))
  const filtrosAtivos = Boolean(textoBusca || grupo !== 'todos' || dificuldade !== 'todas' || soFavoritas)
  const categoriasBusca = CATEGORIAS.filter((categoria) => {
    const nomeGrupo = GRUPOS.find((item) => item.id === categoria.grupo)?.nome ?? categoria.grupo
    const buscaCategoria = !textoBusca || [categoria.nome, categoria.descricao, nomeGrupo, ...categoria.tags].some((termo) => normalize(termo).includes(textoBusca)) || idsPergunta.has(categoria.id)
    const grupoPassa = grupo === 'todos' || categoria.grupo === grupo
    const nivel = dificuldade === 'todas' ? 1 : DIFICULDADES_CONTAGEM[categoria.id]?.[dificuldade as 'facil' | 'medio' | 'dificil'] ?? 0
    const dificuldadePassa = dificuldade === 'todas' || nivel > 0
    return buscaCategoria && grupoPassa && dificuldadePassa && (!soFavoritas || colecaoFavoritas.includes(categoria.id))
  }).sort((a, b) => {
    if (ordem === 'a-z') return a.nome.localeCompare(b.nome, 'pt-BR')
    if (ordem === 'mais-perguntas') return (DIFICULDADES_CONTAGEM[b.id]?.total ?? 0) - (DIFICULDADES_CONTAGEM[a.id]?.total ?? 0)
    if (ordem === 'menos-jogadas') return (dados.estatisticas.porCategoria[a.id]?.partidas ?? 0) - (dados.estatisticas.porCategoria[b.id]?.partidas ?? 0)
    return Number(Boolean(b.novo)) - Number(Boolean(a.novo)) || a.nome.localeCompare(b.nome, 'pt-BR')
  })
  const totalPerguntas = PERGUNTAS.length

  const abrirCategoria = (categoria: Categoria) => {
    const novos = new URLSearchParams(searchParams.toString())
    novos.set('categoria', categoria.id)
    novos.set('dificuldade', novos.get('dificuldade') ?? 'misto')
    novos.set('quantidade', novos.get('quantidade') ?? '10')
    novos.set('modo', novos.get('modo') ?? 'classico')
    setSearchParams(novos)
  }
  const fecharDrawer = () => {
    const novos = new URLSearchParams(searchParams.toString())
    const chaves = ['categoria', 'dificuldade', 'quantidade']
    for (const chave of chaves) novos.delete(chave)
    setSearchParams(novos)
  }
  const alternar = (id: string) => { alternarFavorita(id) }
  const iniciarAleatoria = () => {
    const categoria = CATEGORIAS[Math.floor(Math.random() * CATEGORIAS.length)]
    navigate(`/jogo?categoria=${categoria.id}&dificuldade=misto&quantidade=10&modo=classico`)
  }
  const jogarTodas = () => navigate('/jogo?categoria=todas&dificuldade=misto&quantidade=10&modo=classico')
  const jogarCategoria = (categoria: Categoria) => navigate(`/jogo?categoria=${categoria.id}&dificuldade=misto&quantidade=10&modo=classico`)
  const aoBuscarKeyDown = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === 'Enter' && categoriasBusca.length === 1) abrirCategoria(categoriasBusca[0])
  }

  return <main className="pagina explorar">
    <header className="explorar__cabecalho"><div><p className="rotulo">23 TEMAS · {totalPerguntas} PERGUNTAS</p><h1 tabIndex={-1}>Explorar</h1><p>Escolha um assunto ou deixe a sorte apontar o caminho.</p></div><div className="explorar__atalhos"><button type="button" className="botao botao--secundario" onClick={iniciarAleatoria}><Icone nome="sparkles" />Surpreenda-me</button><button type="button" className="botao botao--primario" onClick={jogarTodas}><Icone nome="shuffle" />Misturar todos os temas</button></div></header>
    {modoValido !== 'classico' && modoValido !== 'diario' && <div className="explorar__modo-banner"><div><span className="rotulo">MODO PREFERIDO</span><strong>{NOMES_MODOS[modoValido]}: escolha um tema</strong></div><button className="link-acao" type="button" onClick={() => { const novos = new URLSearchParams(searchParams); novos.delete('modo'); setSearchParams(novos) }}>Voltar ao Clássico</button></div>}
    {modoValido === 'diario' && <div className="explorar__modo-banner"><div><span className="rotulo">DESAFIO DE HOJE</span><strong>As mesmas cinco perguntas para todo mundo.</strong></div><Link className="botao botao--primario botao--pequeno" to={dados.desafioDiario.ultimaData === diaLocal() ? '/resultado?diario=hoje' : '/jogo?modo=diario'}>{dados.desafioDiario.ultimaData === diaLocal() ? 'Rever respostas' : 'Aceitar desafio'}</Link></div>}

    <div className="explorar__busca-filtros">
      <label className="explorar__busca campo__grupo"><span className="sr-only">Buscar por tema ou pergunta</span><Icone nome="search" tamanho={20} /><input value={busca} onChange={(evento) => setBusca(evento.target.value)} onKeyDown={aoBuscarKeyDown} placeholder="Buscar tema, assunto ou pergunta" /><span className="explorar__atalho">{busca ? <button type="button" aria-label="Limpar busca" onClick={() => setBusca('')}><Icone nome="x" tamanho={17} /></button> : null}</span></label>
      <div className="explorar__filtros" aria-label="Filtros de temas">
        <div className="explorar__filtro-grupos" role="group" aria-label="Filtrar por grupo">{[{ id: 'todos', nome: 'Todos' }, ...GRUPOS].map((item) => <button key={item.id} type="button" className={grupo === item.id ? 'filtro-chip filtro-chip--ativo' : 'filtro-chip'} aria-pressed={grupo === item.id} onClick={() => setGrupo(item.id)}>{item.nome}</button>)}</div>
        <div className="explorar__filtro-dificuldade" role="group" aria-label="Filtrar por dificuldade">{[{ id: 'todas', nome: 'Todas' }, ...DIFICULDADES].map((item) => { const total = item.id === 'todas' ? totalPerguntas : PERGUNTAS.filter((p) => p.dificuldade === item.id).length; return <button key={item.id} type="button" className={dificuldade === item.id ? 'filtro-chip filtro-chip--ativo' : 'filtro-chip'} aria-pressed={dificuldade === item.id} onClick={() => setDificuldade(item.id)}>{item.nome} <small>{total}</small></button> })}</div>
        <label className="explorar__favoritas-toggle"><input type="checkbox" checked={soFavoritas} onChange={(evento) => setSoFavoritas(evento.target.checked)} /><span>Favoritas</span></label>
        <label className="explorar__ordenar"><span className="sr-only">Ordenar por</span><select value={ordem} onChange={(evento) => setOrdem(evento.target.value)}><option value="recomendadas">Recomendadas</option><option value="a-z">A a Z</option><option value="mais-perguntas">Mais perguntas</option><option value="menos-jogadas">Menos jogadas</option></select><Icone nome="chevron-down" tamanho={16} /></label>
      </div>
      {textoBusca.length >= 3 && <p className="explorar__contagem-busca" aria-live="polite">{perguntaMatches.length} {perguntaMatches.length === 1 ? 'pergunta cita' : 'perguntas citam'} sua busca</p>}
    </div>

    {filtrosAtivos ? <section className="explorar__resultados" aria-labelledby="titulo-resultados"><div className="secao__cabecalho"><div><p className="rotulo">TEMAS QUE BATEM COM O FILTRO</p><h2 id="titulo-resultados">{categoriasBusca.length} {categoriasBusca.length === 1 ? 'resultado' : 'resultados'}</h2></div></div>{categoriasBusca.length ? <div className="categorias-grade">{categoriasBusca.map((categoria) => <CartaoCategoria key={categoria.id} categoria={categoria} total={DIFICULDADES_CONTAGEM[categoria.id]?.total ?? 0} favorita={colecaoFavoritas.includes(categoria.id)} jogadas={dados.estatisticas.porCategoria[categoria.id]?.partidas ?? 0} respondidas={dados.estatisticas.perguntasPorCategoria[categoria.id] ?? 0} onAbrir={() => abrirCategoria(categoria)} onFavoritar={() => alternar(categoria.id)} />)}</div> : <div className="estado-vazio"><Icone nome="search" tamanho={34} /><h3>Nada encontrado por aqui.</h3><p>Tente outro termo ou limpe os filtros para ver os temas.</p><button type="button" className="botao botao--secundario" onClick={() => { setBusca(''); setGrupo('todos'); setDificuldade('todas'); setSoFavoritas(false) }}>Limpar busca e filtros</button></div>}</section> : <>
      {partidaAtiva && <RetomarPartida partida={partidaAtiva} />}
      {colecaoFavoritas.length > 0 && <section className="explorar__favoritas" aria-labelledby="titulo-favoritas"><div className="secao__cabecalho"><div><p className="rotulo">SEUS TEMAS GUARDADOS</p><h2 id="titulo-favoritas">Favoritas</h2></div></div><div className="categorias-grade">{CATEGORIAS.filter((categoria) => colecaoFavoritas.includes(categoria.id)).map((categoria) => <CartaoCategoria key={categoria.id} categoria={categoria} total={DIFICULDADES_CONTAGEM[categoria.id]?.total ?? 0} favorita jogadas={dados.estatisticas.porCategoria[categoria.id]?.partidas ?? 0} respondidas={dados.estatisticas.perguntasPorCategoria[categoria.id] ?? 0} onAbrir={() => abrirCategoria(categoria)} onFavoritar={() => alternar(categoria.id)} />)}</div></section>}
      <div className="explorar__roleta"><Roleta onJogar={jogarCategoria} onAjustar={abrirCategoria} /></div>
      <section className="explorar__todos" aria-labelledby="titulo-todos"><div className="secao__cabecalho"><div><p className="rotulo">ESCOLHA SEU PRÓXIMO ASSUNTO</p><h2 id="titulo-todos">Todos os temas</h2></div><span className="explorar__total rotulo">{CATEGORIAS.length} TEMAS</span></div><div className="categorias-grade">{CATEGORIAS.map((categoria) => <CartaoCategoria key={categoria.id} categoria={categoria} total={DIFICULDADES_CONTAGEM[categoria.id]?.total ?? 0} favorita={colecaoFavoritas.includes(categoria.id)} jogadas={dados.estatisticas.porCategoria[categoria.id]?.partidas ?? 0} respondidas={dados.estatisticas.perguntasPorCategoria[categoria.id] ?? 0} onAbrir={() => abrirCategoria(categoria)} onFavoritar={() => alternar(categoria.id)} />)}</div></section>
    </>}
    {categoriaPartida && <DrawerConfiguracao key={categoriaPartida} categoriaInicial={categoriaSelecionada} modoInicial={modoValido} aoFechar={fecharDrawer} />}
  </main>
}
