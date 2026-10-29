import { Link, NavLink, useLocation } from "react-router-dom";
import { calcularNivel } from "../utilitarios/progressao";
import { useDados } from "../servicos/useDados";
import { Icone, type NomeIcone } from "./Icone";
import { Logo } from "./Logo";
import { AVATARES } from "../dados/avatares";

const LINKS = [
  { caminho: "/", rotulo: "Início", icone: "home" as const },
  { caminho: "/explorar", rotulo: "Explorar", icone: "compass" as const },
  { caminho: "/conquistas", rotulo: "Conquistas", icone: "trophy" as const },
  { caminho: "/perfil", rotulo: "Perfil", icone: "user" as const },
];

export function Cabecalho() {
  const dados = useDados();
  const localizacao = useLocation();
  const { nivel, percentual } = calcularNivel(dados.progresso.xp);
  const avatar =
    AVATARES.find((item) => item.id === dados.perfil.avatar) ?? AVATARES[0];
  const emJogo = localizacao.pathname === "/jogo";
  const linksMobile = [
    LINKS[0],
    LINKS[1],
    { caminho: "/explorar", rotulo: "Jogar", icone: "play" as const },
    LINKS[2],
    LINKS[3],
  ];

  return (
    <>
      <header className="cabecalho">
        <div className="cabecalho__interno">
          <Link
            to="/"
            className="logo-link"
            aria-label="Quizio, página inicial"
          >
            <Logo />
          </Link>
          <nav className="nav" aria-label="Navegação principal">
            <ul className="nav__lista">
              {LINKS.map((link) => (
                <li key={link.caminho}>
                  <NavLink
                    className="nav__link"
                    to={link.caminho}
                    end={link.caminho === "/"}
                  >
                    {link.rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="cabecalho__acoes">
            <Link
              to="/perfil"
              className="chip-nivel"
              aria-label={`Seu perfil: nível ${nivel}, ${percentual}% até o próximo nível`}
            >
              <span
                className={`avatar avatar--${avatar.id}`}
                role="img"
                aria-label={`Avatar ${avatar.nome}`}
              >
                <Icone nome={avatar.icone as NomeIcone} tamanho={18} />
              </span>
              <span className="chip-nivel__texto">
                <span className="chip-nivel__nivel">NV {nivel}</span>
                <span className="chip-nivel__barra">
                  <span style={{ width: `${percentual}%` }} />
                </span>
              </span>
            </Link>
            <Link
              className="botao botao--primario botao--pequeno cabecalho__cta"
              to="/explorar"
            >
              <Icone nome="play" tamanho={16} />
              Jogar
            </Link>
          </div>
        </div>
      </header>
      {!emJogo && (
        <nav className="abas" aria-label="Navegação rápida">
          {linksMobile.map((link) => (
            <NavLink
              key={link.rotulo}
              className={`aba${link.rotulo === "Jogar" ? " aba--jogar" : ""}`}
              to={link.caminho}
              end={link.caminho === "/"}
              aria-label={link.rotulo}
            >
              <span className="aba__icone">
                <Icone
                  nome={link.icone}
                  tamanho={link.rotulo === "Jogar" ? 26 : 21}
                />
              </span>
              <span>{link.rotulo}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
