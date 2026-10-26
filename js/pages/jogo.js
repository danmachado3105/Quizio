import { criarElemento as el, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { DIFICULDADES } from "../data/perguntas.js";
import { confirmarAcao } from "../components/modal.js";
import { criarEstadoVazio } from "../components/card.js";
import {
  abandonarPartida,
  avancar,
  concluirPartida,
  obterPartidaAtiva,
  obterQuestaoAtual,
  partidaEstaPausada,
  pausarPartida,
  responder,
  retomarPartida,
} from "../services/partida.js";
import { animarNumero } from "../utils/animacao.js";
import { formatarNumero } from "../utils/formatacao.js";
import { COMBO_MINIMO_PARA_BONUS } from "../utils/pontuacao.js";

/*
 * Tela de jogo.
 * O estado da partida fica em services/partida.js (sessionStorage); esta tela
 * só desenha e chama as funções de lá. O objeto "contexto" guarda a partida em
 * memória, os elementos da página e duas travas:
 *   ocupado     -> uma troca de pergunta ou de página está em andamento
 *   confirmando -> o modal "Sair da partida?" está aberto
 */
const LETRAS = ["A", "B", "C", "D"];
const DURACAO_DO_GANHO_MS = 1100;
const QUANTIDADE_DE_PONTOS_DO_COMBO = 3;

const respondida = (partida) => partida.respostas.length > partida.indice;

// ---------- Utilidades ----------

/** Faz uma animação CSS recomeçar (tira a classe, força o reflow e coloca de novo). */
function reiniciarAnimacao(elemento, classe) {
  elemento.classList.remove(classe);
  void elemento.offsetWidth;
  elemento.classList.add(classe);
}

/** Pulso curto num indicador (pontos ou combo). */
function pulsar(elemento) {
  reiniciarAnimacao(elemento, "indicador--pulso");
  elemento.addEventListener("animationend", () => elemento.classList.remove("indicador--pulso"), { once: true });
}

/** Avisa leitores de tela sem mexer no visual. */
function anunciar(texto) {
  const aviso = porId("aviso-jogo");
  aviso.textContent = "";
  setTimeout(() => {
    aviso.textContent = texto;
  }, 60);
}

// ---------- Placar, combo e progresso ----------
function atualizarPontos(contexto, { animar = false } = {}) {
  const { partida, elementos } = contexto;

  if (animar) {
    animarNumero(elementos.pontosValor, {
      de: contexto.pontosExibidos,
      para: partida.pontuacao,
      duracaoMs: 650,
      formatar: formatarNumero,
    });
  } else {
    elementos.pontosValor.textContent = formatarNumero(partida.pontuacao);
  }
  contexto.pontosExibidos = partida.pontuacao;
}

function atualizarCombo(contexto) {
  const { partida, elementos } = contexto;

  elementos.comboValor.textContent = `Combo ×${partida.combo}`;
  elementos.combo.dataset.ativo = String(partida.combo >= COMBO_MINIMO_PARA_BONUS);
  elementos.pips.forEach((pip, indice) => {
    pip.dataset.ativo = String(indice < partida.combo);
  });
}

/** "+150" que sobe a partir dos indicadores quando o jogador acerta. */
function mostrarGanho(contexto, pontos) {
  const selo = el("span", {
    classe: "ganho",
    texto: `+${formatarNumero(pontos)}`,
    atributos: { "aria-hidden": "true" },
  });
  contexto.elementos.status.append(selo);

  const remover = () => selo.remove();
  selo.addEventListener("animationend", remover, { once: true });
  setTimeout(remover, DURACAO_DO_GANHO_MS + 300);
}

function atualizarProgresso(contexto) {
  const { partida, elementos } = contexto;
  const feitas = partida.respostas.length;
  const total = partida.questoes.length;

  contexto.segmentos.forEach((segmento, indice) => {
    const resposta = partida.respostas[indice];
    let estado = "pendente";

    if (resposta) estado = resposta.acertou ? "acerto" : "erro";
    else if (indice === partida.indice) estado = "atual";

    if (segmento.dataset.estado !== estado) segmento.dataset.estado = estado;
  });

  elementos.barra.setAttribute("aria-valuemax", String(total));
  elementos.barra.setAttribute("aria-valuenow", String(feitas));
  elementos.barra.setAttribute("aria-valuetext", `${feitas} de ${total} respondidas`);
}

// ---------- Pergunta e alternativas ----------
function criarMarcaDeDificuldade(dificuldadeId) {
  const nivel = Math.max(1, DIFICULDADES.findIndex((item) => item.id === dificuldadeId) + 1);
  const nome = DIFICULDADES.find((item) => item.id === dificuldadeId)?.nome ?? "";

  return el("span", { classe: "dificuldade" }, [
    el(
      "span",
      { classe: "dificuldade__pontos", atributos: { "aria-hidden": "true" } },
      [1, 2, 3].map((numero) =>
        el("span", { classe: "dificuldade__ponto", atributos: { "data-ativo": String(numero <= nivel) } })
      )
    ),
    el("span", { texto: nome }),
  ]);
}

function criarAlternativa(texto, posicao) {
  return el(
    "button",
    { classe: "alternativa", atributos: { type: "button", "data-posicao": posicao } },
    [
      el("span", { classe: "alternativa__letra", texto: LETRAS[posicao], atributos: { "aria-hidden": "true" } }),
      el("span", { classe: "alternativa__texto", texto }),
      el("span", { classe: "alternativa__estado" }),
    ]
  );
}

/**
 * Desenha a pergunta atual.
 * animar: a carta entra com uma animação curta (troca de pergunta).
 * focar: leva o foco ao enunciado (leitores de tela leem a nova pergunta).
 */
function renderizarQuestao(contexto, { animar = false, focar = false } = {}) {
  const { partida, elementos } = contexto;
  const questao = obterQuestaoAtual(partida);
  const ehUltima = questao.numero === questao.total;
  const categoria = obterCategoriaPorId(questao.pergunta.categoria);

  elementos.carta.dataset.ultima = String(ehUltima);
  if (animar) reiniciarAnimacao(elementos.carta, "carta-pergunta--entrando");

  const marcas = [
    el("span", { classe: "badge", texto: categoria?.nome ?? "Pergunta" }),
    criarMarcaDeDificuldade(questao.pergunta.dificuldade),
  ];
  if (ehUltima) marcas.push(el("span", { classe: "badge badge--ultima", texto: "Última pergunta" }));
  elementos.marcas.replaceChildren(...marcas);

  elementos.contador.textContent = `Pergunta ${questao.numero} de ${questao.total}`;
  elementos.enunciado.textContent = questao.pergunta.enunciado;
  elementos.alternativas.replaceChildren(
    ...questao.alternativas.map((alternativa, posicao) => criarAlternativa(alternativa.texto, posicao))
  );
  elementos.feedback.replaceChildren();
  elementos.botaoPausar.hidden = false;

  atualizarPontos(contexto);
  atualizarCombo(contexto);
  atualizarProgresso(contexto);

  // Se a página foi atualizada depois de responder, restaura o feedback
  if (questao.resposta) aplicarResposta(contexto, questao, questao.resposta, { restaurando: true });

  if (focar) elementos.enunciado.focus();
}

/** Mostra o resultado da resposta: alternativas, feedback, placar e combo. */
function aplicarResposta(contexto, questao, resposta, { restaurando = false } = {}) {
  const { elementos } = contexto;
  const botoes = [...elementos.alternativas.querySelectorAll(".alternativa")];
  const acertou = resposta.acertou;
  const ehUltima = questao.numero === questao.total;
  const textoCorreto = questao.pergunta.alternativas[questao.pergunta.correta];

  botoes.forEach((botao, posicao) => {
    const indiceOriginal = questao.alternativas[posicao].indiceOriginal;
    const estado = botao.querySelector(".alternativa__estado");
    botao.disabled = true; // bloqueia novas respostas até avançar

    if (indiceOriginal === questao.pergunta.correta) {
      botao.classList.add("alternativa--correta");
      if (!acertou) botao.classList.add("alternativa--revelada");
      estado.replaceChildren(
        criarIcone("check", 18),
        el("span", { classe: "sr-only", texto: "Resposta correta" })
      );
    } else if (indiceOriginal === resposta.escolhida) {
      botao.classList.add("alternativa--incorreta");
      estado.replaceChildren(
        criarIcone("x", 18),
        el("span", { classe: "sr-only", texto: "Sua resposta, incorreta" })
      );
    } else {
      botao.classList.add("alternativa--neutra");
    }
  });

  const botaoProxima = el("button", {
    classe: "botao botao--primario",
    texto: ehUltima ? "Ver resultado" : "Próxima pergunta",
    atributos: { type: "button", id: "botao-proxima" },
    aoClicar: () => avancarParaProxima(contexto),
  });

  const detalhe = acertou
    ? el("div", { classe: "feedback__pontos" }, [
        el("span", { classe: "feedback__ponto", texto: `+${formatarNumero(resposta.pontos)} pts` }),
        resposta.bonus > 0
          ? el("span", {
              classe: "feedback__bonus",
              texto: `${resposta.base} base + ${resposta.bonus} de bônus de combo`,
            })
          : null,
      ])
    : el("p", { classe: "feedback__correta", texto: `A resposta certa é: ${textoCorreto}` });

  elementos.feedback.replaceChildren(
    el("div", { classe: `feedback feedback--${acertou ? "acerto" : "erro"}` }, [
      el("div", { classe: "feedback__cabecalho" }, [
        el("span", { classe: "feedback__selo", atributos: { "aria-hidden": "true" } }, [
          criarIcone(acertou ? "check" : "x", 20),
        ]),
        el("p", { classe: "feedback__titulo", texto: acertou ? "Resposta correta!" : "Não foi dessa vez." }),
      ]),
      detalhe,
      el("p", { classe: "feedback__explicacao", texto: questao.pergunta.explicacao }),
      el("div", { classe: "feedback__acoes" }, [
        el("span", { classe: "feedback__tecla" }, [el("kbd", { texto: "Enter" }), " para continuar"]),
        botaoProxima,
      ]),
    ])
  );

  elementos.botaoPausar.hidden = true;
  atualizarPontos(contexto, { animar: !restaurando });
  atualizarCombo(contexto);
  atualizarProgresso(contexto);

  if (!restaurando) {
    if (acertou) {
      pulsar(elementos.pontos);
      if (contexto.partida.combo >= 2) pulsar(elementos.combo);
      if (resposta.pontos > 0) mostrarGanho(contexto, resposta.pontos);
    }
    botaoProxima.focus();
  }
}

// ---------- Ações ----------
function aoEscolher(contexto, posicao) {
  if (contexto.ocupado) return;

  const resposta = responder(contexto.partida, posicao);
  if (!resposta) return; // já respondida ou pausada: ignora

  aplicarResposta(contexto, obterQuestaoAtual(contexto.partida), resposta);
}

function avancarParaProxima(contexto) {
  if (contexto.ocupado) return;
  contexto.ocupado = true;

  const destino = avancar(contexto.partida);

  if (destino === "proxima") {
    renderizarQuestao(contexto, { animar: true, focar: true });
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
  if (contexto.ocupado || contexto.confirmando) return;
  contexto.confirmando = true;

  const confirmou = await confirmarAcao({
    titulo: "Sair da partida?",
    mensagem: "Seu progresso nesta partida será perdido e nenhum XP será concedido.",
    rotuloConfirmar: "Sair da partida",
    rotuloCancelar: "Continuar jogando",
    perigo: true,
  });
  contexto.confirmando = false;
  if (!confirmou) return;

  contexto.ocupado = true;
  abandonarPartida();
  window.location.href = `${contexto.base}index.html`;
}

// ---------- Pausa ----------
/** Esconde a pergunta e mostra a tela de pausa (sem mexer no estado salvo). */
function mostrarPausa(contexto, { focar = true } = {}) {
  const { elementos } = contexto;
  elementos.carta.hidden = true;
  elementos.pausa.hidden = false;
  elementos.botaoPausar.hidden = true;

  if (focar) {
    porId("pausa-titulo").focus();
    anunciar("Partida pausada.");
  }
}

function pausar(contexto) {
  const { partida } = contexto;
  if (contexto.ocupado || respondida(partida) || partidaEstaPausada(partida)) return;

  pausarPartida(partida);
  mostrarPausa(contexto);
}

function continuar(contexto) {
  const { partida, elementos } = contexto;
  if (!partidaEstaPausada(partida)) return;

  retomarPartida(partida);
  elementos.pausa.hidden = true;
  elementos.carta.hidden = false;
  elementos.botaoPausar.hidden = respondida(partida);
  elementos.enunciado.focus();
  anunciar("Partida retomada.");
}

// ---------- Teclado ----------
/** Posição (0 a 3) da alternativa escolhida pela tecla, ou -1. Aceita 1 a 4 e A a D. */
function posicaoDaTecla(tecla) {
  if (tecla.length !== 1) return -1;
  const numero = "1234".indexOf(tecla);
  return numero >= 0 ? numero : "abcd".indexOf(tecla.toLowerCase());
}

function aoTeclar(contexto, evento) {
  if (evento.ctrlKey || evento.metaKey || evento.altKey || evento.defaultPrevented) return;
  if (document.body.classList.contains("modal-aberto")) return;
  if (contexto.ocupado) return;

  const alvo = evento.target;
  if (alvo.closest?.("input, textarea, select, [contenteditable]")) return;

  const { partida, elementos } = contexto;
  const tecla = evento.key;

  if (tecla === "Escape") {
    evento.preventDefault();
    pedirParaSair(contexto);
    return;
  }

  if (tecla.toLowerCase() === "p") {
    if (evento.repeat) return;
    if (partidaEstaPausada(partida)) continuar(contexto);
    else pausar(contexto);
    return;
  }

  if (partidaEstaPausada(partida)) return;

  const posicao = posicaoDaTecla(tecla);
  if (posicao >= 0) {
    if (evento.repeat || respondida(partida)) return;
    const botao = elementos.alternativas.querySelectorAll(".alternativa")[posicao];
    if (botao && !botao.disabled) botao.click();
    return;
  }

  if ((tecla === "Enter" || tecla === " ") && respondida(partida)) {
    // Se o foco está num botão ou link, ele mesmo trata a tecla (evita avançar duas vezes)
    if (alvo.closest?.("button, a, [role='button']")) return;
    evento.preventDefault();
    if (!evento.repeat) avancarParaProxima(contexto);
  }
}

// ---------- Sem partida ----------
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
    el("div", { classe: "sem-partida__acoes" }, [
      el("a", {
        classe: "botao botao--primario",
        texto: "Montar uma partida",
        atributos: { href: `${base}pages/categorias.html` },
      }),
      el("a", {
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

  // Um segmento por pergunta
  const segmentos = partida.questoes.map(() => el("span", { classe: "segmento" }));
  porId("segmentos").replaceChildren(...segmentos);

  const contexto = {
    base,
    partida,
    segmentos,
    ocupado: false,
    confirmando: false,
    pontosExibidos: partida.pontuacao,
    elementos: {
      carta: porId("carta-pergunta"),
      marcas: porId("pergunta-marcas"),
      enunciado: porId("pergunta-enunciado"),
      alternativas: porId("alternativas"),
      feedback: porId("feedback"),
      contador: porId("contador-pergunta"),
      barra: porId("segmentos"),
      status: porId("jogo-status"),
      pontos: porId("chip-pontos"),
      pontosValor: porId("pontos-valor"),
      combo: porId("chip-combo"),
      comboValor: porId("combo-valor"),
      pips: [...document.querySelectorAll(".combo__pip")].slice(0, QUANTIDADE_DE_PONTOS_DO_COMBO),
      pausa: porId("tela-pausa"),
      botaoPausar: porId("botao-pausar"),
    },
  };

  porId("jogo").hidden = false;
  renderizarQuestao(contexto);
  if (partidaEstaPausada(partida)) mostrarPausa(contexto, { focar: false });

  // Um único listener para as quatro alternativas (delegação de eventos)
  contexto.elementos.alternativas.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".alternativa");
    if (!botao || botao.disabled) return;
    aoEscolher(contexto, Number(botao.dataset.posicao));
  });

  porId("botao-sair").addEventListener("click", () => pedirParaSair(contexto));
  porId("botao-sair-pausa").addEventListener("click", () => pedirParaSair(contexto));
  porId("botao-pausar").addEventListener("click", () => pausar(contexto));
  porId("botao-continuar").addEventListener("click", () => continuar(contexto));

  document.addEventListener("keydown", (evento) => aoTeclar(contexto, evento));
}