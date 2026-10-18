import { criarElemento } from "../utils/dom.js";
import { criarIcone, criarLogo } from "../utils/icones.js";

const LINKS = [
  { id: "home", rotulo: "Início", caminho: "index.html" },
  { id: "categorias", rotulo: "Categorias", caminho: "pages/categorias.html" },
  { id: "conquistas", rotulo: "Conquistas", caminho: "pages/conquistas.html" },
  { id: "perfil", rotulo: "Perfil", caminho: "pages/perfil.html" },
];

/** Monta o cabeçalho com menu responsivo dentro de <header id="cabecalho">. */
export function renderizarCabecalho({ base, paginaAtual }) {
  const cabecalho = document.getElementById("cabecalho");
  if (!cabecalho) return;

  const itens = LINKS.map((link) =>
    criarElemento("li", {}, [
      criarElemento("a", {
        classe: "nav__link",
        texto: link.rotulo,
        atributos: {
          href: base + link.caminho,
          "aria-current": link.id === paginaAtual ? "page" : null,
        },
      }),
    ])
  );

  const nav = criarElemento(
    "nav",
    { classe: "nav", atributos: { id: "menu-principal", "aria-label": "Navegação principal" } },
    [criarElemento("ul", { classe: "nav__lista" }, itens)]
  );

  const botaoMenu = criarElemento(
    "button",
    {
      classe: "botao-menu",
      atributos: { type: "button", "aria-expanded": "false", "aria-controls": "menu-principal", "aria-label": "Abrir menu" },
    },
    [criarIcone("menu", 24)]
  );

  function definirMenu(aberto) {
    nav.classList.toggle("nav--aberta", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    botaoMenu.replaceChildren(criarIcone(aberto ? "x" : "menu", 24));
  }

  botaoMenu.addEventListener("click", () => definirMenu(!nav.classList.contains("nav--aberta")));
  nav.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) definirMenu(false);
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && nav.classList.contains("nav--aberta")) {
      definirMenu(false);
      botaoMenu.focus();
    }
  });

  const logo = criarElemento(
    "a",
    { classe: "logo", atributos: { href: base + "index.html", "aria-label": "Quizio, página inicial" } },
    [criarLogo(36), criarElemento("span", { texto: "Quizio" })]
  );

  const botaoJogar = criarElemento(
    "a",
    {
      classe: "botao botao--primario botao--pequeno cabecalho__cta",
      atributos: { href: base + "pages/categorias.html" },
    },
    [criarIcone("play", 16), "Jogar"]
  );

  cabecalho.replaceChildren(
    criarElemento("div", { classe: "container cabecalho__interno" }, [
      logo,
      nav,
      criarElemento("div", { classe: "cabecalho__acoes" }, [botaoJogar, botaoMenu]),
    ])
  );
}

export function renderizarRodape() {
  const rodape = document.getElementById("rodape");
  if (!rodape) return;

  rodape.replaceChildren(
    criarElemento("div", { classe: "container rodape__interno" }, [
      criarElemento("p", { texto: `© ${new Date().getFullYear()} Quizio. Feito com HTML, CSS e JavaScript.` }),
      criarElemento("p", { texto: "Seu progresso fica salvo apenas neste navegador." }),
    ])
  );
}