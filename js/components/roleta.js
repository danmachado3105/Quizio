import { criarElemento as el } from "../utils/dom.js";
import { criarIcone, obterMarcacaoDoIcone } from "../utils/icones.js";
import { prefereMovimentoReduzido } from "../utils/animacao.js";
import { CATEGORIAS } from "../data/categorias.js";
import { DIFICULDADE_MISTA, contarPerguntasPorCategoria } from "../data/perguntas.js";
import { criarPartida } from "../services/partida.js";
import { abrirModal } from "./modal.js";

/*
 * Roleta de temas: sorteia uma categoria entre todas e leva direto para a partida.
 * A fatia sorteada é escolhida antes; a roleta só gira até parar nela.
 */
const CORES_DAS_FATIAS = ["#7254D8", "#FFD166", "#FF786B", "#FFF8EF"];
const VOLTAS = 5;
const DURACAO_DO_GIRO_MS = 4600; // mesma duração da transição em components.css
const PERGUNTAS_POR_PARTIDA = 10;

/** Ponto na circunferência: 0° é o topo e o ângulo cresce no sentido horário. */
function polar(graus, raio) {
  const radianos = (graus * Math.PI) / 180;
  return [Number((raio * Math.sin(radianos)).toFixed(2)), Number((-raio * Math.cos(radianos)).toFixed(2))];
}

/** Desenha o disco: uma fatia colorida com o emblema de cada categoria. */
function montarDisco(categorias) {
  const passo = 360 / categorias.length;
  let fatias = "";

  categorias.forEach((categoria, indice) => {
    const [x1, y1] = polar(indice * passo, 100);
    const [x2, y2] = polar((indice + 1) * passo, 100);
    const [ix, iy] = polar((indice + 0.5) * passo, 72);
    const cor = CORES_DAS_FATIAS[indice % CORES_DAS_FATIAS.length];

    fatias += `<path d="M0 0L${x1} ${y1}A100 100 0 0 1 ${x2} ${y2}Z" fill="${cor}" stroke="#35254F" stroke-width="1"/>`;
    fatias +=
      `<g transform="translate(${ix} ${iy}) rotate(${((indice + 0.5) * passo).toFixed(2)})">` +
      `<svg x="-9" y="-9" width="18" height="18" viewBox="0 0 24 24" fill="none">${obterMarcacaoDoIcone(categoria.icone)}</svg></g>`;
  });

  // Só números e os emblemas do projeto entram neste HTML (nenhum dado do usuário)
  const disco = el("div", { classe: "roleta__disco" });
  disco.innerHTML =
    `<svg viewBox="-104 -104 208 208" aria-hidden="true" focusable="false">${fatias}` +
    `<circle r="102" fill="none" stroke="#35254F" stroke-width="3"/></svg>`;
  return disco;
}

/** Abre a roleta em um modal. */
export function abrirRoleta({ base }) {
  const categorias = CATEGORIAS;
  const passo = 360 / categorias.length;
  const contagem = contarPerguntasPorCategoria();

  const disco = montarDisco(categorias);
  const resultado = el("div", { classe: "roleta__resultado", atributos: { "aria-live": "polite" } }, [
    el("p", { classe: "texto-suave", texto: "Gire a roleta e descubra o seu próximo tema." }),
  ]);
  const erro = el("p", { classe: "campo__erro", atributos: { role: "alert" } });
  const acoes = el("div", { classe: "roleta__acoes" });

  let rotacao = 0;
  let girando = false;
  let sorteada = null;

  const botaoGirar = el("button", {
    classe: "botao botao--primario",
    atributos: { type: "button", "data-autofocus": true },
    aoClicar: girar,
  }, [criarIcone("sparkles", 18), "Girar a roleta"]);

  function jogarAgora() {
    const { erro: mensagem } = criarPartida({
      categoriaId: sorteada.id,
      dificuldade: DIFICULDADE_MISTA,
      quantidade: PERGUNTAS_POR_PARTIDA,
      modoId: "classico",
    });
    if (mensagem) {
      erro.textContent = mensagem;
      return;
    }
    window.location.href = `${base}pages/jogo.html`;
  }

  function mostrarResultado() {
    resultado.className = "roleta__resultado roleta__resultado--pronto";
    resultado.replaceChildren(
      el("span", { classe: `icone-caixa icone-caixa--${sorteada.cor}` }, [criarIcone(sorteada.icone, 28)]),
      el("p", { classe: "roleta__nome", texto: sorteada.nome }),
      el("p", {
        classe: "texto-suave texto-pequeno",
        texto: `${contagem[sorteada.id] ?? 0} perguntas · ${sorteada.descricao}`,
      })
    );

    botaoGirar.replaceChildren(criarIcone("refresh", 18), "Girar de novo");
    botaoGirar.disabled = false;
    botaoGirar.className = "botao botao--contorno";

    acoes.replaceChildren(
      el("button", { classe: "botao botao--primario", atributos: { type: "button" }, aoClicar: jogarAgora }, [
        criarIcone("play", 18),
        "Jogar agora",
      ]),
      botaoGirar,
      el("a", {
        classe: "botao botao--texto",
        texto: "Ajustar partida",
        atributos: { href: `${base}pages/categorias.html?categoria=${encodeURIComponent(sorteada.id)}` },
      })
    );
  }

  function girar() {
    if (girando) return;
    girando = true;
    botaoGirar.disabled = true;
    erro.textContent = "";
    resultado.className = "roleta__resultado";
    resultado.replaceChildren(el("p", { classe: "texto-suave", texto: "Girando..." }));

    // 1. Sorteia a fatia. 2. Calcula quanto o disco precisa girar para o ponteiro (topo) parar nela.
    const indice = Math.floor(Math.random() * categorias.length);
    const meio = (indice + 0.5) * passo;
    const folga = (Math.random() - 0.5) * passo * 0.7; // para não parar sempre no centro da fatia
    const resto = ((((360 - meio + folga) - (rotacao % 360)) % 360) + 360) % 360;
    rotacao += resto + 360 * VOLTAS;

    const concluir = () => {
      if (!girando) return;
      girando = false;
      sorteada = categorias[indice];
      mostrarResultado();
    };

    if (prefereMovimentoReduzido()) {
      disco.style.transition = "none";
      disco.style.transform = `rotate(${rotacao}deg)`;
      concluir();
      return;
    }

    disco.style.transform = `rotate(${rotacao}deg)`;
    setTimeout(concluir, DURACAO_DO_GIRO_MS + 100);
  }

  acoes.append(botaoGirar);

  const conteudo = el("div", { classe: "roleta" }, [
    el("div", { classe: "roleta__palco" }, [
      el("span", { classe: "roleta__ponteiro", atributos: { "aria-hidden": "true" } }),
      disco,
      el("span", { classe: "roleta__miolo", atributos: { "aria-hidden": "true" } }, [criarIcone("sparkles", 20)]),
    ]),
    resultado,
    erro,
    acoes,
  ]);

  abrirModal({ titulo: "Roleta de temas", conteudo });
}