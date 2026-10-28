import { Link, useLocation } from 'react-router-dom'

export function Rodape() {
  const localizacao = useLocation()
  if (localizacao.pathname === '/jogo') return null
  return <footer className="rodape fundo-escuro">
    <div className="rodape__grade">
      <p className="rodape__marca" aria-hidden="true">quizio</p>
      <div className="rodape__linha">
        <p className="rodape__frase">Perguntas boas merecem respostas melhores.</p>
        <nav className="rodape__links" aria-label="Rodapé"><Link to="/sobre">Sobre</Link><Link to="/privacidade">Privacidade</Link></nav>
      </div>
      <p className="rodape__nota">© {new Date().getFullYear()} Quizio. Seu progresso fica salvo apenas neste navegador.</p>
    </div>
  </footer>
}
