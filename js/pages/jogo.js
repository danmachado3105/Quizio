import { criarElemento, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { DIFICULDADES } from "../data/perguntas.js";
import { confirmarAcao } from "../components/modal.js";
import { criarBarraProgresso, criarEstadoVazio } from "../components/card.js";
import {
  abandonarPartida,
  avancar,
  concluirPartida,
  obterPartidaAtiva,
  obterQuestaoAtual,
  responder,
} from "../services/partida.js";
import { formatarNumero } from "../utils/formatacao.js";

const LETRAS = ["A", "B", "C", "D"];
const COMBO_DESTACADO = 3;

// ---------- Estado visual ----------
function atualizarStatus(contexto) {
  const { partida, elementos } = contexto;

  elementos.pontos.replaceChildren(criarIcone("star", 16), `${formatarNumero(partida.pontuacao)} pts`);
  elementos.combo.replaceChildren(criarIcone("flame", 16), `Combo ×${partida.combo}`);
  elementos.combo.classList.toggle("chip--ativo", partida.combo >= COMBO_DESTACADO);
}

function atualizarBarra(contexto) {
  const { partida, elementos } = contexto;
  const percentual = Math.round((partida.respostas.length / partida.questoes.length) * 100);

  elementos.preenchimento.style.width = `${percentual}%`;
  elementos.barra.setAttribute("aria-valuenow", String(percentual));
}

function criarAlternativa(texto, posicao) {
  return criarElemento(
    "button",
    { classe: "alternativa", atributos: { type: "button", "data-posicao": posicao } },
    [
      criarElemento("span", { classe: "alternativa__letra", texto: LETRAS[posicao], atributos: { "aria-hidden": "true" } }),
      criarElemento("span", { classe: "alternativa__texto", texto }),
      criarElemento("span", { classe: "alternativa__estado" }),
    ]
  );
}

// ---------- Renderização da pergunta ----------
function renderizarQuestao(contexto, focar) {
  const { partida, elementos } = contexto;
  const questao = obterQuestaoAtual(partida);
  const categoria = obterCategoriaPorId(questao.pergunta.categoria);
  const dificuldade = DIFICULDADES.find((item) => item.id === questao.pergunta.dificuldade);

  elementos.contador.textContent = `Pergunta ${questao.numero} de ${questao.total}`;
  elementos.marcas.replaceChildren(
    criarElemento("span", { classe: "badge", texto: categoria?.nome ?? "Pergunta" }),
    criarElemento("span", { classe: "badge badge--destaque", texto: dificuldade?.nome ?? "" })
  );
  elementos.enunciado.textContent = questao.pergunta.enunciado;
  elementos.alternativas.replaceChildren(
    ...questao.alternativas.map((alternativa, posicao) => criarAlternativa(alternativa.texto, posicao))
  );
  elementos.feedback.hidden = true;
  elementos.feedback.replaceChildren();

  atualizarStatus(contexto);
  atualizarBarra(contexto);

  // Se a página foi atualizada depois de responder, restaura o feedback
  if (questao.resposta) aplicarResposta(contexto, questao, questao.resposta);

  if (focar) elementos.enunciado.focus();
}

function aplicarResposta(contexto, questao, resposta) {
  const { elementos } = contexto;
  const botoes = [...elementos.alternativas.querySelectorAll(".alternativa")];

  botoes.forEach((botao, posicao) => {
    const indiceOriginal = questao.alternativas[posicao].indiceOriginal;
    const estado = botao.querySelector(".alternativa__estado");
    botao.disabled = true; // bloqueia novas respostas até avançar

    if (indiceOriginal === questao.pergunta.correta) {
      botao.classList.add("alternativa--correta");
      estado.replaceChildren(
        criarIcone("check", 22),
        criarElemento("span", { classe: "sr-only", texto: "Resposta correta" })
      );
    } else if (indiceOriginal === resposta.escolhida) {
      botao.classList.add("alternativa--incorreta");
      estado.replaceChildren(
        criarIcone("x", 22),
        criarElemento("span", { classe: "sr-only", texto: "Sua resposta, incorreta" })
      );
    } else {
      botao.classList.add("alternativa--neutra");
    }
  });

  const acertou = resposta.acertou;
  const ehUltima = questao.numero === questao.total;
  const textoCorreto = questao.pergunta.alternativas[questao.pergunta.correta];

  let detalhe = `A resposta correta é: ${textoCorreto}`;
  if (acertou) {
    detalhe = `+${resposta.pontos} pontos`;
    if (resposta.bonus > 0) detalhe += ` (${resposta.base} + ${resposta.bonus} de bônus de combo)`;
  }

  const botaoProxima = criarElemento("button", {
    classe: "botao botao--primario",
    texto: ehUltima ? "Ver resultado" : "Próxima pergunta",
    atributos: { type: "button", id: "botao-proxima" },
    aoClicar: () => avancarParaProxima(contexto),
  });

  elementos.feedback.className = `feedback ${acertou ? "feedback--acerto" : "feedback--erro"}`;
  elementos.feedback.replaceChildren(
    criarElemento("p", { classe: "feedback__titulo" }, [
      criarIcone(acertou ? "check" : "x", 22),
      acertou ? "Resposta correta!" : "Não foi dessa vez.",
    ]),
    criarElemento("p", { classe: "feedback__detalhe", texto: detalhe }),
    criarElemento("p", { classe: "feedback__explicacao", texto: questao.pergunta.explicacao }),
    criarElemento("div", { classe: "feedback__acoes" }, [botaoProxima])
  );
  elementos.feedback.hidden = false;

  atualizarStatus(contexto);
  atualizarBarra(contexto);
  botaoProxima.focus();
}

// ---------- Ações ----------
function responderAlternativa(contexto, posicao) {
  const resposta = responder(contexto.partida, posicao);
  if (!resposta) return; // já respondida: ignora cliques repetidos

  aplicarResposta(contexto, obterQuestaoAtual(contexto.partida), resposta);
}

function avancarParaProxima(contexto) {
  if (contexto.ocupado) return;
  contexto.ocupado = true;

  const destino = avancar(contexto.partida);

  if (destino === "proxima") {
    renderizarQuestao(contexto, true);
    contexto.ocupado = false;
    return;
  }

  if (destino === "fim") {
    const resultado = concluirPartida(contexto.partida);
    if (resultado) {
      // "ocupado" continua true durante a troca de página
      window.location.href = `${contexto.base}pages/resultado.html`;
      return;
    }
  }

  contexto.ocupado = false;
}

async function pedirParaSair(contexto) {
  if (contexto.ocupado) return;

  const confirmou = await confirmarAcao({
    titulo: "Sair da partida?",
    mensagem: "Seu progresso nesta partida será perdido e nenhum XP será concedido.",
    rotuloConfirmar: "Sair da partida",
    rotuloCancelar: "Continuar jogando",
    perigo: true,
  });
  if (!confirmou) return;

  contexto.ocupado = true;
  abandonarPartida();
  window.location.href = `${contexto.base}index.html`;
}

function mostrarSemPartida(base) {
  const modo = new URLSearchParams(window.location.search).get("modo");
  const modoIndisponivel = modo && modo !== "classico";

  const estado = criarEstadoVazio({
    icone: "play",
    titulo: modoIndisponivel ? "Este modo estará disponível em breve" : "Nenhuma partida em andamento",
    texto: modoIndisponivel
      ? "Por enquanto, jogue no modo clássico escolhendo uma categoria."
      : "Monte uma nova partida para começar a jogar.",
  });

  porId("jogo").hidden = true;
  const alvo = porId("sem-partida");
  alvo.hidden = false;
  alvo.replaceChildren(
    estado,
    criarElemento("div", { classe: "sem-partida__acoes" }, [
      criarElemento("a", {
        classe: "botao botao--primario",
        texto: "Montar uma partida",
        atributos: { href: `${base}pages/categorias.html` },
      }),
      criarElemento("a", {
        classe: "botao botao--contorno",
        texto: "Voltar ao início",
        atributos: { href: `${base}index.html` },
      }),
    ])
  );
}

/** Chamada pelo app.js quando a tela de jogo é carregada. */
export function iniciar({ base }) {
  const partida = obterPartidaAtiva();
  if (!partida) {
    mostrarSemPartida(base);
    return;
  }

  const barra = criarBarraProgresso({ percentual: 0, rotulo: "Progresso da partida" });
  porId("barra-progresso").replaceChildren(barra);

  const contexto = {
    base,
    partida,
    ocupado: false,
    elementos: {
      contador: porId("contador-pergunta"),
      marcas: porId("pergunta-marcas"),
      enunciado: porId("pergunta-enunciado"),
      alternativas: porId("alternativas"),
      feedback: porId("feedback"),
      pontos: porId("chip-pontos"),
      combo: porId("chip-combo"),
      barra,
      preenchimento: barra.firstElementChild,
    },
  };

  porId("jogo").hidden = false;
  renderizarQuestao(contexto, false);

  // Um único listener para as quatro alternativas (delegação de eventos)
  contexto.elementos.alternativas.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".alternativa");
    if (!botao || botao.disabled || contexto.ocupado) return;
    responderAlternativa(contexto, Number(botao.dataset.posicao));
  });

  porId("botao-sair").addEventListener("click", () => pedirParaSair(contexto));

  // Atalho de teclado: teclas 1 a 4 escolhem a alternativa
  document.addEventListener("keydown", (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    if (document.body.classList.contains("modal-aberto")) return;
    if (!/^[1-4]$/.test(evento.key)) return;

    const botao = contexto.elementos.alternativas.querySelectorAll(".alternativa")[Number(evento.key) - 1];
    if (botao && !botao.disabled) botao.click();
  });
}