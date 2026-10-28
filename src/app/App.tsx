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
import { Recompensas } from '../paginas/Recompensas'
import { Perfil } from '../paginas/Perfil'
import { Conquistas } from '../paginas/Conquistas'
import { useDados } from '../servicos/useDados'
import { tocarSom } from '../servicos/som'

function FocoDaRota() {
  const localizacao = useLocation()
  useEffect(() => {
    const titulo = document.querySelector<HTMLElement>('#conteudo h1')
    titulo?.focus({ preventScroll: true })
  }, [localizacao.pathname])
  return null
}

function PreferenciasGlobais() {
  const dados = useDados()
  useEffect(() => {
    document.documentElement.dataset.movimento = dados.preferencias.movimento
    const aoClicar = (evento: MouseEvent) => {
      if ((evento.target as HTMLElement | null)?.closest('button, a') && dados.preferencias.som) tocarSom('clique', true)
    }
    document.addEventListener('click', aoClicar)
    return () => document.removeEventListener('click', aoClicar)
  }, [dados.preferencias.movimento, dados.preferencias.som])
  return null
}

function Conteudo() {
  const localizacao = useLocation()
  const emJogo = localizacao.pathname === '/jogo'
  return <>
    <FocoDaRota />
    <PreferenciasGlobais />
    {!emJogo && <Cabecalho />}
    <div id="conteudo" className="conteudo-principal"><Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/explorar" element={<Explorar />} />
      <Route path="/jogo" element={<Jogo />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/conquistas" element={<Conquistas />} />
      <Route path="/recompensas" element={<Recompensas />} />
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
