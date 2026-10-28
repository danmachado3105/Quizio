import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AVATARES } from '../dados/avatares'
import { CATEGORIAS } from '../dados/categorias'
import { Icone } from '../componentes/Icone'
import { exportarProgresso, importarProgresso } from '../servicos/backup'
import { redefinirDados, atualizarDados, salvarPerfil } from '../servicos/armazenamento'
import { useDados } from '../servicos/useDados'
import { calcularNivel } from '../utilitarios/progressao'
import { diaLocal, resumirSequencia } from '../utilitarios/sequencia'
import type { NomeIcone } from '../componentes/Icone'

export function Perfil() {
  const dados = useDados()
  const arquivoRef = useRef<HTMLInputElement>(null)
  const [nome, setNome] = useState(dados.perfil.nome)
  const [mensagem, setMensagem] = useState('')
  const [confirmarRedefinicao, setConfirmarRedefinicao] = useState(false)
  const [confirmarImportacao, setConfirmarImportacao] = useState<string | null>(null)
  const nivel = calcularNivel(dados.progresso.xp)
  const sequencia = resumirSequencia(dados.diasJogados, dados.estatisticas.melhorSequencia, diaLocal())
  const exportar = () => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([exportarProgresso()], { type: 'application/json' })); link.download = 'quizio-progresso.json'; link.click(); URL.revokeObjectURL(link.href) }
  const lerArquivo = async (arquivo?: File) => {
    if (!arquivo) return
    if (arquivo.size > 1_000_000) { setMensagem('O arquivo ultrapassa o limite de 1 MB.'); return }
    setConfirmarImportacao(await arquivo.text())
  }
  const confirmarImportar = () => {
    if (!confirmarImportacao) return
    const retorno = importarProgresso(confirmarImportacao)
    setMensagem(retorno.sucesso ? 'Progresso importado. A página foi atualizada.' : retorno.mensagem)
    setConfirmarImportacao(null)
  }
  const redefinir = () => { redefinirDados(); setConfirmarRedefinicao(false); setNome('Jogador'); setMensagem('Progresso redefinido.') }
  const salvarNome = () => { const retorno = salvarPerfil({ nome, avatar: dados.perfil.avatar }); setMensagem(retorno.sucesso ? 'Perfil salvo.' : retorno.mensagem) }
  const heatmap = Array.from({ length: 84 }, (_, indice) => { const data = new Date(); data.setDate(data.getDate() - (83 - indice)); return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}` })
  return <main className="pagina perfil container">
    <header className="perfil__cabecalho"><div className="perfil__avatar-grande"><span className={`avatar avatar--${dados.perfil.avatar}`}><Icone nome={(AVATARES.find((avatar) => avatar.id === dados.perfil.avatar)?.icone ?? 'rocket') as NomeIcone} tamanho={44} /></span><span className="perfil__nivel">NV {nivel.nivel}</span></div><div><p className="rotulo">SEU ESPAÇO NO QUIZIO</p><h1 tabIndex={-1}>Oi, {dados.perfil.nome}.</h1><p>{dados.itensEquipados.titulo === 'nenhum' ? 'Curioso em construção' : dados.itensEquipados.titulo} · Nível {nivel.nivel} · {dados.progresso.xp.toLocaleString('pt-BR')} XP</p><div className="barra"><span style={{ width: `${nivel.percentual}%` }} /></div><small>{nivel.xpNoNivel} / {nivel.xpNecessario} XP para o próximo nível</small></div></header>
    <section className="perfil__bloco"><h2>Seu nome e avatar</h2><div className="perfil__edicao"><label className="campo__grupo"><span className="rotulo">APELIDO (2 A 20 CARACTERES)</span><input className="campo__controle" value={nome} maxLength={20} onChange={(evento) => setNome(evento.target.value)} /></label><button className="botao botao--primario" onClick={salvarNome}>Salvar nome</button></div><div className="perfil__avatares">{AVATARES.map((avatar) => <button type="button" className={dados.perfil.avatar === avatar.id ? 'perfil__avatar perfil__avatar--ativo' : 'perfil__avatar'} key={avatar.id} aria-pressed={dados.perfil.avatar === avatar.id} aria-label={`Usar avatar ${avatar.nome}`} onClick={() => atualizarDados((atual) => { atual.perfil.avatar = avatar.id })}><Icone nome={avatar.icone as NomeIcone} tamanho={26} /><span>{avatar.nome}</span></button>)}</div><label className="campo__grupo"><span className="rotulo">MOLDURA EQUIPADA</span><select className="campo__controle" value={dados.itensEquipados.moldura} onChange={(evento) => atualizarDados((atual) => { atual.itensEquipados.moldura = evento.target.value })}><option value="nenhuma">Sem moldura</option>{dados.itensDesbloqueados.filter((id) => id.startsWith('moldura-')).map((id) => <option key={id} value={id}>{id.replaceAll('-', ' ')}</option>)}</select></label><label className="campo__grupo"><span className="rotulo">TÍTULO EQUIPADO</span><select className="campo__controle" value={dados.itensEquipados.titulo} onChange={(evento) => atualizarDados((atual) => { atual.itensEquipados.titulo = evento.target.value })}><option value="nenhum">Sem título</option>{dados.itensDesbloqueados.filter((id) => id.startsWith('titulo-')).map((id) => <option key={id} value={id}>{id.replace('titulo-', '').replaceAll('-', ' ')}</option>)}</select></label></section>
    <section className="perfil__bloco"><h2>Estatísticas</h2><div className="perfil__estatisticas"><article><strong>{dados.estatisticas.partidas}</strong><span>partidas</span></article><article><strong>{dados.estatisticas.acertos}</strong><span>acertos</span></article><article><strong>{dados.estatisticas.melhorPontuacao.toLocaleString('pt-BR')}</strong><span>recorde</span></article><article><strong>{sequencia.atual}</strong><span>dias seguidos · melhor {sequencia.melhor}</span></article><article><strong>{dados.moedas}</strong><span>moedas</span></article><article><strong>{dados.estatisticas.melhorCombo}</strong><span>maior combo</span></article></div><h3>Últimas 12 semanas</h3><div className="perfil__heatmap" aria-label="Mapa de dias jogados">{heatmap.map((dia) => <span key={dia} className={dados.diasJogados.includes(dia) ? 'perfil__dia perfil__dia--jogado' : 'perfil__dia'} title={dia} />)}</div><h3>Domínio por tema</h3><div className="perfil__dominio">{CATEGORIAS.map((categoria) => { const info = dados.estatisticas.porCategoria[categoria.id]; const taxa = info?.respondidas ? Math.floor(info.acertos / info.respondidas * 100) : 0; return <div key={categoria.id}><span>{categoria.nome}</span><span className="barra"><span style={{ width: `${taxa}%` }} /></span><small>{taxa}%</small></div> })}</div></section>
    <section className="perfil__bloco"><h2>Preferências</h2><label className="perfil__preferencia"><span><strong>Sons</strong><small>Toques curtos para respostas, conquistas e ações.</small></span><input type="checkbox" checked={dados.preferencias.som} onChange={(evento) => atualizarDados((atual) => { atual.preferencias.som = evento.target.checked })} /></label><label className="perfil__preferencia"><span><strong>Movimento</strong><small>Escolha se as animações seguem o ajuste do sistema.</small></span><select value={dados.preferencias.movimento} onChange={(evento) => atualizarDados((atual) => { atual.preferencias.movimento = evento.target.value as 'sistema' | 'reduzido' })}><option value="sistema">Seguir sistema</option><option value="reduzido">Reduzir animações</option></select></label></section>
    <section className="perfil__bloco"><h2>Seu histórico</h2>{dados.historico.length ? <div className="perfil__historico">{dados.historico.slice(0, 20).map((item) => <article key={item.id}><span>{new Date(item.data).toLocaleDateString('pt-BR')}</span><strong>{item.categoriaId} · {item.acertos}/{item.total}</strong><span>{item.pontuacao.toLocaleString('pt-BR')} pontos · {item.modoId}</span></article>)}</div> : <p>Suas partidas concluídas aparecem aqui. <Link to="/explorar">Vamos jogar?</Link></p>}</section>
    <section className="perfil__bloco"><h2>Backup do progresso</h2><p>Seu arquivo fica no seu aparelho. Não contém código executável.</p><div className="perfil__botoes"><button className="botao botao--secundario" onClick={exportar}>Exportar progresso <Icone nome="arrow-up-right" /></button><button className="botao botao--secundario" onClick={() => arquivoRef.current?.click()}>Importar arquivo</button><input ref={arquivoRef} hidden type="file" accept="application/json,.json" onChange={(evento) => void lerArquivo(evento.target.files?.[0])} /><button className="botao botao--alerta" onClick={() => setConfirmarRedefinicao(true)}>Redefinir progresso</button></div></section>
    {mensagem && <p className="perfil__mensagem" role="status">{mensagem}</p>}
    {(confirmarRedefinicao || confirmarImportacao !== null) && <div className="drawer-fundo"><section className="confirmar-saida" role="dialog" aria-modal="true" aria-labelledby="perfil-confirma"><h2 id="perfil-confirma">{confirmarRedefinicao ? 'Redefinir todo o progresso?' : 'Importar este progresso?'}</h2><p>{confirmarRedefinicao ? 'Seu perfil, estatísticas, moedas e histórico serão apagados deste navegador.' : 'O conteúdo atual será substituído. Uma cópia de segurança local será criada antes.'}</p><button className="botao botao--primario" onClick={confirmarRedefinicao ? redefinir : confirmarImportar}>{confirmarRedefinicao ? 'Redefinir' : 'Importar'}</button><button className="botao botao--secundario" onClick={() => { setConfirmarRedefinicao(false); setConfirmarImportacao(null) }}>Cancelar</button></section></div>}
  </main>
}
