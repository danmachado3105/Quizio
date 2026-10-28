import { Link } from 'react-router-dom'
import { Icone } from '../componentes/Icone'

const TEMAS = ['CIÊNCIA', 'HISTÓRIA', 'CINEMA', 'NATUREZA', 'MÚSICA', 'GEOGRAFIA', 'JOGOS']

export function Inicio() {
  return <main className="inicio">
    <section className="inicio__hero">
      <div className="inicio__conteudo">
        <p className="rotulo">UM QUIZ DE CONHECIMENTOS GERAIS</p>
        <h1 tabIndex={-1}>Uma boa pergunta<br /><span>muda o jogo.</span></h1>
        <p className="inicio__descricao">Temas para explorar, perguntas que ensinam e aquele prazer de acertar no susto.</p>
        <div className="inicio__acoes"><Link className="botao botao--primario" to="/explorar">Escolher um tema <Icone nome="arrow-right" /></Link><Link className="inicio__link" to="/explorar?modo=diario">Ver o desafio do dia</Link></div>
      </div>
      <div className="inicio__carta" aria-label="Prévia de uma pergunta do tema Ciência e espaço"><span className="inicio__carta-selo rotulo">PERGUNTA RÁPIDA</span><Icone nome="lightbulb" tamanho={38} /><p>Qual planeta é conhecido como Planeta Vermelho?</p><span className="inicio__carta-resposta">Marte <Icone nome="check" tamanho={17} /></span><span className="inicio__carta-rodape rotulo">CIÊNCIA E ESPAÇO · FÁCIL</span></div>
      <span className="inicio__estrela" aria-hidden="true"><Icone nome="sparkles" tamanho={52} /></span>
    </section>
    <div className="temas-faixa" aria-label="Temas disponíveis"><div className="temas-faixa__trilho">{[...TEMAS, ...TEMAS].map((tema, i) => <span key={`${tema}-${i}`}>{tema}<Icone nome="sparkles" tamanho={14} /></span>)}</div></div>
    <section className="inicio__apresentacao">
      <p className="rotulo">CURIOSIDADE EM TODAS AS DIREÇÕES</p><h2>Seu próximo assunto favorito<br />está a uma pergunta de distância.</h2>
      <Link className="botao botao--secundario" to="/explorar">Explorar os temas <Icone nome="arrow-right" /></Link>
    </section>
  </main>
}
