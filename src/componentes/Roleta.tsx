import { useEffect, useRef, useState } from 'react'
import { CATEGORIAS } from '../dados/categorias'
import type { Categoria } from '../tipos'
import { EmblemaCategoria } from './EmblemaCategoria'
import { Icone } from './Icone'

const CORES = ['#7254D8', '#FF786B', '#FFD166', '#27865B', '#35254F']
const DURACAO = 4600

export interface RoletaProps {
  modo?: 'secao' | 'modal'
  onFechar?: () => void
  onJogar?: (categoria: Categoria) => void
  onAjustar?: (categoria: Categoria) => void
}

export function Roleta({ modo = 'secao', onFechar, onJogar, onAjustar }: RoletaProps) {
  const [angulo, setAngulo] = useState(0)
  const [girando, setGirando] = useState(false)
  const [selecionada, setSelecionada] = useState<Categoria | null>(null)
  const relogio = useRef<number | undefined>(undefined)
  const caixa = useRef<HTMLElement>(null)

  useEffect(() => () => { if (relogio.current) window.clearTimeout(relogio.current) }, [])
  useEffect(() => {
    if (modo !== 'modal') return
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const foco = caixa.current?.querySelector<HTMLElement>('button')
    foco?.focus()
    const aoPressionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') { onFechar?.(); return }
      if (evento.key !== 'Tab' || !caixa.current) return
      const focaveis = [...caixa.current.querySelectorAll<HTMLElement>('button:not(:disabled)')]
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo?.focus() }
      else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro?.focus() }
    }
    document.addEventListener('keydown', aoPressionar)
    return () => { document.removeEventListener('keydown', aoPressionar); anterior?.focus() }
  }, [modo, onFechar])

  const girar = () => {
    if (girando) return
    const indice = Math.floor(Math.random() * CATEGORIAS.length)
    const tema = CATEGORIAS[indice]
    const fatia = 360 / CATEGORIAS.length
    const alvo = (360 - (indice * fatia + fatia / 2)) % 360
    const atual = ((angulo % 360) + 360) % 360
    const voltas = 5 * 360 + ((alvo - atual + 360) % 360)
    setSelecionada(null)
    setGirando(true)
    setAngulo(angulo + voltas)
    const duracao = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : DURACAO
    relogio.current = window.setTimeout(() => { setGirando(false); setSelecionada(tema) }, duracao)
  }

  const disco = <div className="roleta-temas__palco">
    <span className="roleta-temas__ponteiro" aria-hidden="true" />
    <div className={`roleta-temas__disco${girando ? ' roleta-temas__disco--girando' : ''}`} style={{ transform: `rotate(${angulo}deg)`, background: `conic-gradient(${CATEGORIAS.map((_, i) => `${CORES[i % CORES.length]} ${i * 360 / CATEGORIAS.length}deg ${(i + 1) * 360 / CATEGORIAS.length}deg`).join(',')})` }} aria-label={`Roleta com ${CATEGORIAS.length} temas`} role="img">
      {CATEGORIAS.map((categoria, indice) => <span key={categoria.id} className="roleta-temas__emblema" style={{ transform: `translate(-50%, -50%) rotate(${indice * 360 / CATEGORIAS.length + 7.82}deg) translateY(-8.3rem) rotate(-${indice * 360 / CATEGORIAS.length + 7.82}deg)` }}><EmblemaCategoria id={categoria.id} tamanho={27} /></span>)}
      <span className="roleta-temas__miolo"><Icone nome="sparkles" tamanho={30} /></span>
    </div>
  </div>

  const conteudo = <section ref={caixa} className={`roleta-temas${modo === 'modal' ? ' roleta-temas--modal' : ''}`} aria-labelledby="titulo-roleta">
    <div className="roleta-temas__cabecalho"><div><p className="rotulo">DEIXE A SORTE ESCOLHER</p><h2 id="titulo-roleta">Roleta de temas</h2><p>Vinte e três temas, uma escolha inesperada.</p></div>{modo === 'modal' && <button type="button" className="botao-icone" aria-label="Fechar roleta" onClick={onFechar}><Icone nome="x" /></button>}</div>
    <div className="roleta-temas__corpo">{disco}<div className="roleta-temas__controles"><button type="button" className="botao botao--primario roleta-temas__girar" onClick={girar} disabled={girando}><Icone nome="refresh" />{girando ? 'Girando…' : selecionada ? 'Girar de novo' : 'Girar a roleta'}</button>
      {selecionada && <div className="roleta-temas__resultado" aria-live="polite"><EmblemaCategoria id={selecionada.id} tamanho={48} /><div><span className="rotulo">O TEMA SORTEADO</span><h3>{selecionada.nome}</h3></div><div className="roleta-temas__acoes"><button className="botao botao--primario botao--pequeno" type="button" onClick={() => onJogar?.(selecionada)}>Jogar agora</button><button className="botao botao--secundario botao--pequeno" type="button" onClick={() => onAjustar?.(selecionada)}>Ajustar partida</button></div></div>}
    </div></div>
  </section>

  if (modo === 'modal') return <div className="roleta-temas__fundo" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) onFechar?.() }}><div role="dialog" aria-modal="true" aria-labelledby="titulo-roleta" className="roleta-temas__dialogo">{conteudo}</div></div>
  return conteudo
}
