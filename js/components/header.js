import { criarElemento as el } from "../utils/dom.js";
import { criarIcone, criarLogo } from "../utils/icones.js";
import { criarAvatar } from "./avatar.js";
import { obterDados } from "../services/storage.js";
import { calcularNivel } from "../utils/progressao.js";

const LINKS = [
  { id: "home", rotulo: "Início", caminho: "index.html", icone: "home" },
  { id: "categorias", rotulo: "Explorar", caminho: "pages/categorias.html", icone: "compass" },
  { id: "conquistas", rotulo: "Conquistas", caminho: "pages/conquistas.html", icone: "trophy" },
  { id: "perfil", rotulo: "Perfil", caminho: "pages/perfil.html", icone: "user" },
];

function criarChipDeNivel(base) {
  const dados = obterDados();
  const { nivel, percentual } = calcularNivel(dados.progresso.xp);

  const barra = el("span", { classe: "chip-nivel__barra", atributos: { "aria-hidden": "true" } }, [el("span")]);
  barra.firstElementChild.style.width = `${percentual}%`;

  return el(
    "a",
    {
      classe: "chip-nivel",
      atributos: {
        href: `${base}pages/perfil.html`,
        "aria-label": `Seu perfil: nível ${nivel}, ${percentual}% do caminho para o próximo`,
      },
    },
    [
      criarAvatar(dados.perfil.avatar, 30),
      el("span", { classe: "chip-nivel__texto" }, [el("span", { classe: "chip-nivel__nivel", texto: `NV ${nivel}` }), barra]),
    ]
  );
}

/** Barra de abas fixa na base da tela, só em celulares (ver layout.css). */
function criarAbas(base, paginaAtual) {
  const itens = [
    LINKS[0],
    LINKS[1],
    { id: "jogar", rotulo: "Jogar", caminho: "pages/categorias.html", icone: "play" },
    LINKS[2],
    LINKS[3],
  ];

  return el(
    "nav",
    { classe: "abas", atributos: { id: "abas", "aria-label": "Navegação rápida" } },
    itens.map((item) =>
      el(
        "a",
        {
          classe: `aba${item.id === "jogar" ? " aba--jogar" : ""}`,
          atributos: {
            href: base + item.caminho,
            "aria-current": item.id === paginaAtual ? "page" : null,
          },
        },
        [el("span", { classe: "aba__icone" }, [criarIcone(item.icone, item.id === "jogar" ? 26 : 22)]), el("span", { texto: item.rotulo })]
      )
    )
  );
}

/** Monta o cabeçalho e a barra de abas. Chamada pelo app.js em todas as páginas. */
export function renderizarCabecalho({ base, paginaAtual }) {
  const cabecalho = document.getElementById("cabecalho");
  if (!cabecalho) return;

  const logo = el(
    "a",
    { classe: "logo", atributos: { href: `${base}index.html`, "aria-label": "Quizio, página inicial" } },
    [criarLogo(36), el("span", { texto: "quizio" })]
  );

  const nav = el(
    "nav",
    { classe: "nav", atributos: { "aria-label": "Navegação principal" } },
    [
      el(
        "ul",
        { classe: "nav__lista" },
        LINKS.map((link) =>
          el("li", {}, [
            el("a", {
              classe: "nav__link",
              texto: link.rotulo,
              atributos: { href: base + link.caminho, "aria-current": link.id === paginaAtual ? "page" : null },
            }),
          ])
        )
      ),
    ]
  );

  const botaoJogar = el(
    "a",
    { classe: "botao botao--primario botao--pequeno cabecalho__cta", atributos: { href: `${base}pages/categorias.html` } },
    [criarIcone("play", 16), "Jogar"]
  );

  cabecalho.replaceChildren(
    el("div", { classe: "container cabecalho__interno" }, [
      logo,
      nav,
      el("div", { classe: "cabecalho__acoes" }, [criarChipDeNivel(base), botaoJogar]),
    ])
  );

  document.getElementById("abas")?.remove();
  document.body.append(criarAbas(base, paginaAtual));
}

export function renderizarRodape({ base = "" } = {}) {
  const rodape = document.getElementById("rodape");
  if (!rodape) return;

  rodape.classList.add("fundo-escuro");
  rodape.replaceChildren(
    el("div", { classe: "container rodape__grade" }, [
      el("p", { classe: "rodape__marca", texto: "quizio", atributos: { "aria-hidden": "true" } }),
      el("div", { classe: "rodape__linha" }, [
        el("p", { classe: "rodape__frase", texto: "Perguntas boas merecem respostas melhores." }),
        el(
          "nav",
          { classe: "rodape__links", atributos: { "aria-label": "Rodapé" } },
          LINKS.map((link) => el("a", { texto: link.rotulo, atributos: { href: base + link.caminho } }))
        ),
      ]),
      el("p", {
        classe: "rodape__nota",
        texto: `© ${new Date().getFullYear()} Quizio. Feito com HTML, CSS e JavaScript puro. Seu progresso fica salvo apenas neste navegador.`,
      }),
    ])
  );
}