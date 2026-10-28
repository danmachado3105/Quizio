import { renderizarCabecalho, renderizarRodape } from "./components/header.js";
import { hidratarIcones } from "./utils/icones.js";
import { iniciarRevelacao } from "./utils/revelar.js";
import { criarElemento } from "./utils/dom.js";

/*
 * Cada página HTML declara <body data-pagina="..." data-base="...">.
 * O módulo da página só é carregado quando ela é aberta e precisa
 * exportar uma função iniciar({ base }).
 */
const CARREGADORES_DE_PAGINA = {
  home: () => import("./pages/home.js"),
  categorias: () => import("./pages/categorias.js"),
  jogo: () => import("./pages/jogo.js"),
  resultado: () => import("./pages/resultado.js"),
  perfil: () => import("./pages/perfil.js"),
  conquistas: () => import("./pages/conquistas.js"),
};

/** Troca o favicon em todas as páginas, sem precisar editar cada HTML. */
function definirFavicon(base) {
  document.querySelectorAll('link[rel~="icon"]').forEach((link) => link.remove());

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = `${base}assets/icons/favicon.svg`;
  document.head.append(link);
}

function mostrarErroDeCarregamento() {
  const conteudo = document.getElementById("conteudo");
  if (!conteudo) return;

  conteudo.replaceChildren(
    criarElemento("p", {
      classe: "estado-vazio__texto",
      texto: "Algo deu errado ao carregar esta página. Abra o projeto com o Live Server e confira o console do navegador.",
    })
  );
}

async function iniciarAplicacao() {
  const { pagina, base = "" } = document.body.dataset;

  // O CSS só esconde elementos "data-revelar" quando esta classe existe
  document.documentElement.classList.add("js");

  definirFavicon(base);
  renderizarCabecalho({ base, paginaAtual: pagina });
  renderizarRodape({ base });
  hidratarIcones(document);

  const carregarPagina = CARREGADORES_DE_PAGINA[pagina];
  if (!carregarPagina) {
    console.error(`Quizio: página "${pagina}" não registrada em app.js.`);
    return;
  }

  try {
    const modulo = await carregarPagina();
    await modulo.iniciar({ base });
  } catch (erro) {
    console.error(`Quizio: falha ao iniciar a página "${pagina}".`, erro);
    mostrarErroDeCarregamento();
  }

  iniciarRevelacao();
}

iniciarAplicacao();