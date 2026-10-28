import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

function PaginaInicial() {
  return (
    <main className="inicio">
      <p className="rotulo">QUZ · CONHECIMENTO EM JOGO</p>
      <h1>Uma boa pergunta muda o jogo.</h1>
      <p>Escolha um tema, faça seu melhor e descubra até onde vai sua curiosidade.</p>
      <Link className="botao botao--primario" to="/explorar">Escolher um tema</Link>
    </main>
  )
}

function PaginaSimples({ titulo }: { titulo: string }) {
  return <main className="pagina"><h1>{titulo}</h1><p>Esta área está sendo preparada.</p></main>
}

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <a className="pular-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="cabecalho"><Link to="/" aria-label="Quizio, início">quizio</Link><nav aria-label="Navegação principal"><Link to="/">Início</Link><Link to="/explorar">Explorar</Link><Link to="/conquistas">Conquistas</Link><Link to="/perfil">Perfil</Link></nav></header>
      <div id="conteudo"><Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route path="/explorar" element={<PaginaSimples titulo="Explorar temas" />} />
        <Route path="/jogo" element={<PaginaSimples titulo="Partida" />} />
        <Route path="/resultado" element={<PaginaSimples titulo="Resultado" />} />
        <Route path="/perfil" element={<PaginaSimples titulo="Seu perfil" />} />
        <Route path="/conquistas" element={<PaginaSimples titulo="Conquistas" />} />
        <Route path="/recompensas" element={<PaginaSimples titulo="Recompensas" />} />
        <Route path="/sobre" element={<PaginaSimples titulo="Sobre o Quizio" />} />
        <Route path="/privacidade" element={<PaginaSimples titulo="Privacidade" />} />
        <Route path="*" element={<PaginaSimples titulo="Página não encontrada" />} />
      </Routes></div>
      <footer className="rodape"><span>quizio</span><Link to="/sobre">Sobre</Link><Link to="/privacidade">Privacidade</Link></footer>
    </BrowserRouter>
  )
}
