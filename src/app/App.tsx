import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Cabecalho } from '../componentes/Cabecalho'
import { Rodape } from '../componentes/Rodape'
import { Inicio } from '../paginas/Inicio'
import { Explorar } from '../paginas/Explorar'
import { NaoEncontrada } from '../paginas/NaoEncontrada'
import { Privacidade } from '../paginas/Privacidade'
import { Sobre } from '../paginas/Sobre'
import { Jogo } from '../paginas/Jogo'
import { Resultado } from '../paginas/Resultado'

function PaginaEmPreparacao({ titulo }: { titulo: string }) {
  return <main className="pagina container texto-longo"><p className="rotulo">QUIZIO</p><h1 tabIndex={-1}>{titulo}</h1><p>Esta área está sendo preparada.</p></main>
}

function FocoDaRota() {
  const localizacao = useLocation()
  useEffect(() => {
    const titulo = document.querySelector<HTMLElement>('#conteudo h1')
    titulo?.focus({ preventScroll: true })
  }, [localizacao.pathname])
  return null
}

function Conteudo() {
  const localizacao = useLocation()
  const emJogo = localizacao.pathname === '/jogo'
  return <>
    <FocoDaRota />
    {!emJogo && <Cabecalho />}
    <div id="conteudo" className="conteudo-principal"><Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/explorar" element={<Explorar />} />
      <Route path="/jogo" element={<Jogo />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/perfil" element={<PaginaEmPreparacao titulo="Seu perfil" />} />
      <Route path="/conquistas" element={<PaginaEmPreparacao titulo="Conquistas" />} />
      <Route path="/recompensas" element={<PaginaEmPreparacao titulo="Recompensas" />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="*" element={<NaoEncontrada />} />
    </Routes></div>
    {!emJogo && <Rodape />}
  </>
}

export function App() {
  return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Conteudo />
  </BrowserRouter>
}
