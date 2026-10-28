import { useState } from 'react'
import { CONQUISTAS, avaliarConquista } from '../dados/conquistas'
import { MISSOES } from '../dados/missoes'
import { MISSOES_SEMANAIS } from '../config/recompensas'
import { Icone } from '../componentes/Icone'
import type { NomeIcone } from '../componentes/Icone'
import { useDados } from '../servicos/useDados'

type Filtro = 'todas' | 'desbloqueadas' | 'bloqueadas'

export function Conquistas() {
  const dados = useDados()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const visiveis = CONQUISTAS.filter((conquista) => filtro === 'todas' || (filtro === 'desbloqueadas' ? Boolean(dados.conquistas[conquista.id]) : !dados.conquistas[conquista.id]))
  return <main className="pagina conquistas container">
    <header className="conquistas__cabecalho"><p className="rotulo">CADA PARTIDA CONTA UMA HISTÓRIA</p><h1 tabIndex={-1}>Conquistas</h1><p>{Object.keys(dados.conquistas).length} de {CONQUISTAS.length} conquistas descobertas. Cada uma pode render medalhas de bronze, prata e ouro.</p></header>
    <section className="conquistas__missoes"><h2>Missões de hoje</h2><div className="recompensas__lista">{MISSOES.map((missao) => { const atual = dados.missoes.progresso[missao.metrica] ?? 0; const concluida = Boolean(dados.missoes.resgatadas[missao.id]); return <article className="missao-card" key={missao.id}><div><strong>{missao.titulo}</strong><p>{missao.descricao}</p><div className="barra"><span style={{ width: `${Math.min(100, atual / missao.meta * 100)}%` }} /></div><small>{Math.min(atual, missao.meta)} / {missao.meta}</small></div><span>{concluida ? 'Concluída' : `+${missao.xp} XP`}</span></article> })}</div></section>
    <section className="conquistas__missoes"><h2>Missões da semana · {dados.missoesSemanais.semana}</h2><div className="recompensas__lista">{MISSOES_SEMANAIS.map((missao) => { const atual = dados.missoesSemanais.progresso[missao.metrica] ?? 0; const concluida = Boolean(dados.missoesSemanais.resgatadas[missao.id]); return <article className="missao-card" key={missao.id}><div><strong>{missao.titulo}</strong><p>{missao.descricao}</p><div className="barra"><span style={{ width: `${Math.min(100, atual / missao.meta * 100)}%` }} /></div><small>{Math.min(atual, missao.meta)} / {missao.meta}</small></div><span>{concluida ? 'Concluída' : `+${missao.xp} XP · +${missao.moedas} moedas`}</span></article> })}</div></section>
    <section className="conquistas__grade-secao"><div className="secao__cabecalho"><div><p className="rotulo">PROGRESSO PESSOAL</p><h2>Suas medalhas</h2></div><div className="conquistas__filtros">{(['todas', 'desbloqueadas', 'bloqueadas'] as const).map((item) => <button className={filtro === item ? 'filtro-chip filtro-chip--ativo' : 'filtro-chip'} key={item} type="button" aria-pressed={filtro === item} onClick={() => setFiltro(item)}>{item === 'todas' ? 'Todas' : item === 'desbloqueadas' ? 'Desbloqueadas' : 'Bloqueadas'}</button>)}</div></div><div className="recompensas__medalhas">{visiveis.map((conquista) => { const progresso = avaliarConquista(conquista, dados); const medalha = dados.medalhas[conquista.id]; return <article className={medalha ? `medalha-card medalha-card--${medalha}` : 'medalha-card'} key={conquista.id}><Icone nome={conquista.icone as NomeIcone} tamanho={26} /><div><strong>{conquista.titulo}</strong><p>{conquista.descricao}</p><small>{medalha ? `Medalha ${medalha}` : `${progresso.atual} / ${progresso.meta}`}</small><div className="barra"><span style={{ width: `${progresso.meta ? progresso.atual / progresso.meta * 100 : 0}%` }} /></div></div></article> })}</div></section>
  </main>
}
