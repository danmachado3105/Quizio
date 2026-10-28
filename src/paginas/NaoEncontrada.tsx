import { Link } from 'react-router-dom'

export function NaoEncontrada() {
  return <main className="pagina container texto-longo"><p className="rotulo">ERRO 404</p><h1 tabIndex={-1}>Esse tema ainda não existe.</h1><p>O endereço pode estar incompleto ou a página mudou de lugar.</p><Link className="botao botao--primario" to="/">Voltar ao início</Link></main>
}
