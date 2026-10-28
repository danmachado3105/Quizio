import { criarElemento as el, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { obterModo, obterNomeDoModo } from "../data/modos.js";
import { DIFICULDADES } from "../data/perguntas.js";
import { confirmarAcao } from "../components/modal.js";
import { criarEstadoVazio } from "../components/card.js";
import { criarRevisao } from "../components/revisao.js";
import {
  abandonarPartida,
  avancar,
  calcularPulosRestantes,
  calcularRestanteMs,
  concluirPartida,
  criarPartida,
  esgotarTempo,
  iniciarRelogioDaPergunta,
  obterPartidaAtiva,
  obterQuestaoAtual,
  obterRegrasDaPartida,
  obterVezDeJogar,
  partidaEstaPausada,
  pausarPartida,
  pular,
  responder,
  retomarPartida,
} from "../services/partida.js";
import { desafioDiarioConcluidoHoje, obterDados, obterResultadoDoDesafioDeHoje } from "../services/storage.js";
import { animarNumero } from "../utils/animacao.js";
import { criarBarraDeTempo, criarCronometro } from "../utils/cronometro.js";
import { formatarNumero } from "../utils/formatacao.js";
import { COMBO_MINIMO_PARA_BONUS } from "../utils/pontuacao.js";

/*
 * Tela de jogo, para todos os modos.
 * O estado da partida fica em services/partida.js (sessionStorage); esta tela
 * só desenha e chama as funções de lá. O objeto "contexto" guarda a partida em
 * memória, os elementos da página e algumas travas:
 *   ocupado         -> uma troca de pergunta ou de página está em andamento
 *   confirmando     -> o modal "Sair da partida?" está aberto
 *   convidadoPronto -> (duelo) o convidado já recebeu o aparelho nesta rodada
 *
 * A cada mudança, atualizarRodada() olha de quem é a vez (obterVezDeJogar) e
 * mostra o que faz sentido: pergunta aberta, passagem do aparelho (duelo),
 * pausa ou revelação das respostas.
 */
const LETRAS = ["A", "B", "C", "D"];
const DURACAO_DO_GANHO_MS = 1100;
const QUANTIDADE_DE_PONTOS_DO_COMBO = 3;
const AVISO_DE_TEMPO_MS = 5000;

const modalAberto = () => document.body.classList.contains("modal-aberto");
const plural = (numero, singular, varios) => `${formatarNumero(numero)} ${numero === 1 ? singular : varios}`;

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

function limparParametroDeModo() {
  try {
    window.history.replaceState(null, "", window.location.pathname);
  } catch (erro) {
    // sem history API, a URL continua com o parâmetro
  }
}

// ---------- Placar, combo e progresso ----------
function atualizarPontos(contexto, { animar = false } = {}) {
  if (contexto.placar) return;
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
  if (contexto.placar) return;
  const { partida, elementos } = contexto;

  elementos.comboValor.textContent = `Combo ×${partida.combo}`;
  elementos.combo.dataset.ativo = String(partida.combo >= COMBO_MINIMO_PARA_BONUS);
  elementos.pips.forEach((pip, indice) => {
    pip.dataset.ativo = String(indice < partida.combo);
  });
}

function criarPlacarDoJogador(nome) {
  const pontos = el("span", { classe: "jogador-placar__pontos", texto: "0" });
  const combo = el("span", { classe: "jogador-placar__combo", texto: "×0", atributos: { title: "Combo" } });
  const raiz = el("div", { classe: "jogador-placar", atributos: { "data-ativo": "false" } }, [
    el("span", { classe: "jogador-placar__nome", texto: nome }),
    el("span", { classe: "jogador-placar__numeros" }, [
      pontos,
      el("span", { classe: "indicador__unidade", texto: "pts" }),
      combo,
    ]),
  ]);
  return { raiz, pontos, combo };
}

/** Duelo: pontos e combo dos dois jogadores, com o da vez destacado. */
function atualizarPlacarDoDuelo(contexto) {
  const { partida, placar } = contexto;
  const vez = obterVezDeJogar(partida);

  placar.jogador.pontos.textContent = formatarNumero(partida.pontuacao);
  placar.jogador.combo.textContent = `×${partida.combo}`;
  placar.convidado.pontos.textContent = formatarNumero(partida.convidado.pontuacao);
  placar.convidado.combo.textContent = `×${partida.convidado.combo}`;
  placar.jogador.raiz.dataset.ativo = String(vez === 0);
  placar.convidado.raiz.dataset.ativo = String(vez === 1);
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
  const { partida, elementos, segmentos } = contexto;
  if (segmentos.length === 0) return;

  // No duelo, uma rodada só conta quando os dois jogadores responderam
  const concluidas = partida.convidado
    ? Math.min(partida.respostas.length, partida.convidado.respostas.length)
    : partida.respostas.length;

  segmentos.forEach((segmento, indice) => {
    let estado = "pendente";
    if (indice < concluidas) {
      estado = partida.convidado ? "feita" : partida.respostas[indice].acertou ? "acerto" : "erro";
    } else if (indice === partida.indice) {
      estado = "atual";
    }
    if (segmento.dataset.estado !== estado) segmento.dataset.estado = estado;
  });

  elementos.barra.setAttribute("aria-valuemax", String(segmentos.length));
  elementos.barra.setAttribute("aria-valuenow", String(concluidas));
  elementos.barra.setAttribute("aria-valuetext", `${concluidas} de ${segmentos.length} respondidas`);
}

// ---------- Marcas e alternativas ----------
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
      el("span", { classe: "alternativa__texto" }, [
        el("span", { texto }),
        el("span", { classe: "alternativa__quem" }),
      ]),
      el("span", { classe: "alternativa__estado" }),
    ]
  );
}

function criarEtiqueta(nome, convidado = false) {
  return el("span", { classe: `etiqueta${convidado ? " etiqueta--convidado" : ""}`, texto: nome });
}

// ---------- Relógio (modo "Contra o tempo") ----------
function pararCronometro(contexto) {
  contexto.cronometro?.parar();
  contexto.cronometro = null;
}

function iniciarCronometro(contexto) {
  const { partida, regras } = contexto;
  const restante = iniciarRelogioDaPergunta(partida);
  if (restante === null) return;

  const total = regras.limiteSegundos * 1000;
  contexto.avisouTempo = false;

  contexto.cronometro = criarCronometro({
    duracaoMs: total,
    restanteMs: restante,
    aoTick: (restanteMs, totalMs) => {
      contexto.barraTempo.atualizar(restanteMs, totalMs);
      if (!contexto.avisouTempo && restanteMs <= AVISO_DE_TEMPO_MS) {
        contexto.avisouTempo = true;
        anunciar("Faltam 5 segundos.");
      }
    },
    aoFim: () => aoFimDoTempo(contexto, partida.indice),
  });
  contexto.cronometro.iniciar();
}

/** O relógio chegou a zero: registra o tempo esgotado (se a pergunta ainda estiver aberta). */
function aoFimDoTempo(contexto, indice) {
  const { partida } = contexto;
  if (contexto.ocupado || partida.indice !== indice || partida.respostas.length > indice) return;

  if (!esgotarTempo(partida)) {
    // Diferença de relógios entre o cronômetro e o motor: tenta de novo quando faltar pouco
    const restante = calcularRestanteMs(partida);
    if (restante !== null && restante > 0) setTimeout(() => aoFimDoTempo(contexto, indice), restante + 30);
    return;
  }
  depoisDeResponder(contexto);
}

// ---------- Estado da rodada ----------
function partidaTermina(contexto, questao) {
  if (questao.numero === questao.total) return true;
  return Boolean(contexto.regras.fimNoPrimeiroErro && questao.resposta && !questao.resposta.acertou);
}

/** Duelo: mostra de quem é a vez. */
function atualizarVez(contexto, vez) {
  const { elementos, regras, partida } = contexto;
  if (regras.jogadores !== 2 || vez === null) {
    elementos.vez.hidden = true;
    return;
  }

  const nome = vez === 0 ? contexto.nomeJogador : partida.convidado.nome;
  elementos.vez.dataset.jogador = String(vez);
  elementos.vez.replaceChildren(criarIcone("user", 16), `Vez de ${nome}`);
  elementos.vez.hidden = false;
}

/** Decide o que mostrar com base no estado da partida. */
function atualizarRodada(contexto, { restaurando = false } = {}) {
  const { partida, elementos } = contexto;

  pararCronometro(contexto);
  elementos.passagem.hidden = true;

  if (partidaEstaPausada(partida)) {
    mostrarPausa(contexto, { focar: !restaurando });
    return;
  }

  elementos.pausa.hidden = true;
  elementos.carta.hidden = false;

  const questao = obterQuestaoAtual(partida);
  if (contexto.placar) atualizarPlacarDoDuelo(contexto);

  if (questao.vez === null) {
    mostrarRevelacao(contexto, questao, { restaurando });
    return;
  }

  if (questao.vez === 1 && !contexto.convidadoPronto) {
    mostrarPassagem(contexto);
    return;
  }

  mostrarPerguntaAberta(contexto, questao);
}

function mostrarPerguntaAberta(contexto, questao) {
  const { partida, regras, elementos } = contexto;

  elementos.feedback.replaceChildren();
  atualizarVez(contexto, questao.vez);
  elementos.botaoPausar.hidden = !regras.permitePausa;

  if (regras.permitePular && questao.vez === 0) {
    const restantes = calcularPulosRestantes(partida);
    elementos.acoes.hidden = false;
    elementos.botaoPular.disabled = restantes <= 0;
    elementos.textoPular.textContent =
      restantes > 0
        ? `Pular pergunta (${restantes} ${restantes === 1 ? "restante" : "restantes"})`
        : "Sem pulos restantes";
  } else {
    elementos.acoes.hidden = true;
  }

  if (regras.temTempo) iniciarCronometro(contexto);
}

// ---------- Revelação ----------
function detalheDePontos(resposta) {
  const partes = [`${resposta.base} base`];
  if (resposta.bonus > 0) partes.push(`${resposta.bonus} de combo`);
  if (resposta.bonusTempo > 0) partes.push(`${resposta.bonusTempo} de tempo`);

  return el("div", { classe: "feedback__pontos" }, [
    el("span", { classe: "feedback__ponto", texto: `+${formatarNumero(resposta.pontos)} pts` }),
    partes.length > 1 ? el("span", { classe: "feedback__bonus", texto: partes.join(" + ") }) : null,
  ]);
}

function criarLinhaDoJogador(nome, resposta) {
  return el("p", { classe: "feedback__linha" }, [
    el("strong", { texto: nome }),
    resposta.acertou ? detalheDePontos(resposta) : el("span", { texto: "errou" }),
  ]);
}

/** Monta o quadro de feedback (um para cada situação possível). */
function construirFeedback(contexto, questao, botaoProxima) {
  const { partida } = contexto;
  const { pergunta, resposta, respostaConvidado } = questao;
  const textoCorreto = pergunta.alternativas[pergunta.correta];
  const linhaDaCorreta = el("p", { classe: "feedback__correta", texto: `A resposta certa é: ${textoCorreto}` });

  let tipo = resposta.acertou ? "acerto" : "erro";
  let icone = resposta.acertou ? "check" : "x";
  let titulo;
  const extras = [];

  if (respostaConvidado) {
    // Duelo
    const nomeConvidado = partida.convidado.nome;
    const jogadorAcertou = resposta.acertou;
    const convidadoAcertou = respostaConvidado.acertou;

    tipo = jogadorAcertou || convidadoAcertou ? "acerto" : "erro";
    icone = jogadorAcertou || convidadoAcertou ? "check" : "x";
    if (jogadorAcertou && convidadoAcertou) titulo = "Os dois acertaram!";
    else if (jogadorAcertou) titulo = `Ponto para ${contexto.nomeJogador}`;
    else if (convidadoAcertou) titulo = `Ponto para ${nomeConvidado}`;
    else titulo = "Ninguém acertou.";

    extras.push(
      el("div", { classe: "feedback__jogadores" }, [
        criarLinhaDoJogador(contexto.nomeJogador, resposta),
        criarLinhaDoJogador(nomeConvidado, respostaConvidado),
      ]),
      linhaDaCorreta
    );
  } else if (resposta.acertou) {
    titulo = "Resposta correta!";
    extras.push(detalheDePontos(resposta));
  } else if (resposta.motivo === "pulou") {
    titulo = "Você pulou esta pergunta.";
    icone = "arrow-right";
    extras.push(linhaDaCorreta);
  } else if (resposta.motivo === "tempo") {
    titulo = "Tempo esgotado!";
    icone = "clock";
    extras.push(linhaDaCorreta);
  } else {
    titulo = "Não foi dessa vez.";
    extras.push(linhaDaCorreta);
  }

  // Sobrevivência: a sequência acabou
  if (contexto.regras.fimNoPrimeiroErro && !resposta.acertou) {
    const acertos = partida.respostas.filter((item) => item.acertou).length;
    extras.push(
      el("p", {
        classe: "feedback__fim",
        texto: `Sua sequência terminou com ${plural(acertos, "acerto", "acertos")}.`,
      })
    );
  }

  return el("div", { classe: `feedback feedback--${tipo}` }, [
    el("div", { classe: "feedback__cabecalho" }, [
      el("span", { classe: "feedback__selo", atributos: { "aria-hidden": "true" } }, [criarIcone(icone, 20)]),
      el("p", { classe: "feedback__titulo", texto: titulo }),
    ]),
    ...extras,
    el("p", { classe: "feedback__explicacao", texto: pergunta.explicacao }),
    el("div", { classe: "feedback__acoes" }, [
      el("span", { classe: "feedback__tecla" }, [el("kbd", { texto: "Enter" }), " para continuar"]),
      botaoProxima,
    ]),
  ]);
}

/** Todos já responderam: marca as alternativas, mostra o feedback e atualiza o placar. */
function mostrarRevelacao(contexto, questao, { restaurando }) {
  const { partida, elementos } = contexto;
  const { pergunta, resposta, respostaConvidado } = questao;
  const duelo = Boolean(respostaConvidado);
  const acertou = resposta.acertou;

  atualizarVez(contexto, null);
  elementos.botaoPausar.hidden = true;
  elementos.acoes.hidden = true;

  const botoes = [...elementos.alternativas.querySelectorAll(".alternativa")];
  botoes.forEach((botao, posicao) => {
    const indiceOriginal = questao.alternativas[posicao].indiceOriginal;
    const estado = botao.querySelector(".alternativa__estado");
    const quem = botao.querySelector(".alternativa__quem");
    const escolhaDoJogador = resposta.escolhida === indiceOriginal;
    const escolhaDoConvidado = duelo && respostaConvidado.escolhida === indiceOriginal;
    botao.disabled = true; // bloqueia novas respostas até avançar

    if (indiceOriginal === pergunta.correta) {
      botao.classList.add("alternativa--correta");
      if (!acertou) botao.classList.add("alternativa--revelada");
      estado.replaceChildren(
        criarIcone("check", 18),
        el("span", { classe: "sr-only", texto: "Resposta correta" })
      );
    } else if (escolhaDoJogador || escolhaDoConvidado) {
      botao.classList.add("alternativa--incorreta");
      estado.replaceChildren(
        criarIcone("x", 18),
        el("span", { classe: "sr-only", texto: "Resposta incorreta" })
      );
    } else {
      botao.classList.add("alternativa--neutra");
    }

    if (duelo) {
      if (escolhaDoJogador) quem.append(criarEtiqueta(contexto.nomeJogador));
      if (escolhaDoConvidado) quem.append(criarEtiqueta(partida.convidado.nome, true));
    }
  });

  const botaoProxima = el("button", {
    classe: "botao botao--primario",
    texto: partidaTermina(contexto, questao) ? "Ver resultado" : "Próxima pergunta",
    atributos: { type: "button", id: "botao-proxima" },
    aoClicar: () => avancarParaProxima(contexto),
  });
  elementos.feedback.replaceChildren(construirFeedback(contexto, questao, botaoProxima));

  if (duelo) {
    atualizarPlacarDoDuelo(contexto);
  } else {
    atualizarPontos(contexto, { animar: !restaurando });
    atualizarCombo(contexto);
  }
  atualizarProgresso(contexto);

  if (restaurando) return;

  if (!duelo && acertou) {
    pulsar(elementos.pontos);
    if (partida.combo >= 2) pulsar(elementos.combo);
    if (resposta.pontos > 0) mostrarGanho(contexto, resposta.pontos);
  }
  // Se o modal "Sair" está aberto (ex.: o tempo acabou), não rouba o foco dele
  if (!modalAberto()) botaoProxima.focus();
}

// ---------- Pergunta ----------
function criarMarcas(contexto, questao, ehUltima) {
  const categoria = obterCategoriaPorId(questao.pergunta.categoria);
  const marcas = [
    el("span", { classe: "badge", texto: categoria?.nome ?? "Pergunta" }),
    criarMarcaDeDificuldade(questao.pergunta.dificuldade),
  ];

  if (contexto.modoId !== "classico") {
    marcas.push(el("span", { classe: "badge badge--destaque", texto: obterNomeDoModo(contexto.modoId) }));
  }
  if (ehUltima) marcas.push(el("span", { classe: "badge badge--ultima", texto: "Última pergunta" }));
  return marcas;
}

/**
 * Desenha a pergunta atual.
 * animar: a carta entra com uma animação curta (troca de pergunta).
 * focar: leva o foco ao enunciado (leitores de tela leem a nova pergunta).
 * restaurando: a página acabou de carregar (não repete animações nem avisos).
 */
function montarPergunta(contexto, { animar = false, focar = false, restaurando = false } = {}) {
  const { partida, regras, elementos } = contexto;
  const questao = obterQuestaoAtual(partida);
  const ehUltima = questao.numero === questao.total;

  contexto.convidadoPronto = false;
  elementos.carta.dataset.ultima = String(ehUltima);
  if (animar) reiniciarAnimacao(elementos.carta, "carta-pergunta--entrando");

  elementos.marcas.replaceChildren(...criarMarcas(contexto, questao, ehUltima));
  elementos.contador.textContent = regras.usaTodasAsPerguntas
    ? `Pergunta ${questao.numero} · até errar`
    : `Pergunta ${questao.numero} de ${questao.total}`;
  elementos.enunciado.textContent = questao.pergunta.enunciado;
  elementos.alternativas.replaceChildren(
    ...questao.alternativas.map((alternativa, posicao) => criarAlternativa(alternativa.texto, posicao))
  );
  elementos.feedback.replaceChildren();

  atualizarPontos(contexto);
  atualizarCombo(contexto);
  atualizarProgresso(contexto);
  atualizarRodada(contexto, { restaurando });

  if (focar && !elementos.carta.hidden) elementos.enunciado.focus();
}

// ---------- Ações ----------
function depoisDeResponder(contexto) {
  atualizarProgresso(contexto);
  atualizarRodada(contexto);
}

function aoEscolher(contexto, posicao) {
  if (contexto.ocupado) return;

  const resposta = responder(contexto.partida, posicao);
  if (!resposta) return; // pausada, rodada completa ou já respondida: ignora

  pararCronometro(contexto);
  depoisDeResponder(contexto);
}

function aoPular(contexto) {
  if (contexto.ocupado || !contexto.regras.permitePular) return;

  const resposta = pular(contexto.partida);
  if (!resposta) return;

  pararCronometro(contexto);
  depoisDeResponder(contexto);
}

function avancarParaProxima(contexto) {
  if (contexto.ocupado) return;
  contexto.ocupado = true;
  pararCronometro(contexto);

  const destino = avancar(contexto.partida);

  if (destino === "proxima") {
    montarPergunta(contexto, { animar: true, focar: true });
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
  atualizarRodada(contexto);
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
  pararCronometro(contexto);
  abandonarPartida();
  window.location.href = `${contexto.base}index.html`;
}

// ---------- Pausa ----------
/** Esconde a pergunta e mostra a tela de pausa. */
function mostrarPausa(contexto, { focar = true } = {}) {
  const { elementos } = contexto;
  elementos.carta.hidden = true;
  elementos.passagem.hidden = true;
  elementos.pausa.hidden = false;
  elementos.botaoPausar.hidden = true;

  if (focar) {
    porId("pausa-titulo").focus();
    anunciar("Partida pausada.");
  }
}

function pausar(contexto) {
  const { partida, regras, elementos } = contexto;
  if (contexto.ocupado || !regras.permitePausa || partidaEstaPausada(partida)) return;
  if (obterVezDeJogar(partida) === null || !elementos.passagem.hidden) return;
  if (!pausarPartida(partida)) return;

  mostrarPausa(contexto);
}

function continuar(contexto) {
  const { partida, elementos } = contexto;
  if (!partidaEstaPausada(partida)) return;

  retomarPartida(partida);
  atualizarRodada(contexto);
  if (!elementos.carta.hidden) elementos.enunciado.focus();
  anunciar("Partida retomada.");
}

// ---------- Duelo: passar o aparelho ----------
function mostrarPassagem(contexto) {
  const { partida, elementos } = contexto;
  const nomeConvidado = partida.convidado.nome;

  elementos.carta.hidden = true;
  elementos.pausa.hidden = true;
  elementos.passagem.hidden = false;
  elementos.botaoPausar.hidden = true;

  porId("passagem-titulo").textContent = `Passe o aparelho para ${nomeConvidado}`;
  porId("passagem-texto").textContent = `${contexto.nomeJogador} já respondeu. A resposta fica escondida até a rodada terminar.`;
  porId("botao-pronto").focus();
  anunciar(`Passe o aparelho para ${nomeConvidado}.`);
}

function aoConvidadoPronto(contexto) {
  contexto.convidadoPronto = true;
  atualizarRodada(contexto);
  if (!contexto.elementos.carta.hidden) contexto.elementos.enunciado.focus();
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
  if (modalAberto() || contexto.ocupado) return;

  const alvo = evento.target;
  if (alvo.closest?.("input, textarea, select, [contenteditable]")) return;

  const { partida, regras, elementos } = contexto;
  const tecla = evento.key;
  const letra = tecla.toLowerCase();

  if (tecla === "Escape") {
    evento.preventDefault();
    pedirParaSair(contexto);
    return;
  }

  if (letra === "p") {
    if (evento.repeat || !regras.permitePausa) return;
    if (partidaEstaPausada(partida)) continuar(contexto);
    else pausar(contexto);
    return;
  }

  if (partidaEstaPausada(partida)) return;

  const vez = obterVezDeJogar(partida);
  const emBotao = alvo.closest?.("button, a, [role='button']");

  if (letra === "s") {
    if (!evento.repeat && regras.permitePular && vez === 0) aoPular(contexto);
    return;
  }

  // Duelo: tela de passar o aparelho
  if (!elementos.passagem.hidden) {
    if ((tecla === "Enter" || tecla === " ") && !emBotao) {
      evento.preventDefault();
      aoConvidadoPronto(contexto);
    }
    return;
  }

  const posicao = posicaoDaTecla(tecla);
  if (posicao >= 0) {
    if (evento.repeat || vez === null || elementos.carta.hidden) return;
    const botao = elementos.alternativas.querySelectorAll(".alternativa")[posicao];
    if (botao && !botao.disabled) botao.click();
    return;
  }

  if ((tecla === "Enter" || tecla === " ") && vez === null) {
    // Se o foco está num botão ou link, ele mesmo trata a tecla (evita avançar duas vezes)
    if (emBotao) return;
    evento.preventDefault();
    if (!evento.repeat) avancarParaProxima(contexto);
  }
}

// ---------- Telas sem partida ----------
function mostrarEstado(base, { icone, titulo, texto, botoes, extra = null }) {
  porId("jogo").hidden = true;
  const alvo = porId("sem-partida");
  alvo.hidden = false;

  alvo.replaceChildren(
    ...[
      criarEstadoVazio({ icone, titulo, texto }),
      el(
        "div",
        { classe: "sem-partida__acoes" },
        botoes.map(({ rotulo, caminho, primario = false }) =>
          el("a", {
            classe: `botao ${primario ? "botao--primario" : "botao--contorno"}`,
            texto: rotulo,
            atributos: { href: `${base}${caminho}` },
          })
        )
      ),
      extra,
    ].filter(Boolean)
  );
}

function mostrarSemPartida(base, modoPedido) {
  const modo = obterModo(modoPedido);

  if (modo && modo.id !== "classico") {
    mostrarEstado(base, {
      icone: "play",
      titulo: `Escolha um tema para jogar em ${modo.nome}`,
      texto: modo.descricao,
      botoes: [
        { rotulo: "Escolher o tema", caminho: `pages/categorias.html?modo=${modo.id}`, primario: true },
        { rotulo: "Voltar ao início", caminho: "index.html" },
      ],
    });
    return;
  }

  mostrarEstado(base, {
    icone: "play",
    titulo: "Nenhuma partida em andamento",
    texto: "Monte uma nova partida para começar a jogar.",
    botoes: [
      { rotulo: "Montar uma partida", caminho: "pages/categorias.html", primario: true },
      { rotulo: "Voltar ao início", caminho: "index.html" },
    ],
  });
}

/** Desafio de hoje já concluído (ou impossível de iniciar): resumo, "volte amanhã" e revisão. */
function mostrarDesafioIndisponivel(base, erro) {
  const diario = obterResultadoDoDesafioDeHoje();

  if (!diario || !desafioDiarioConcluidoHoje()) {
    mostrarEstado(base, {
      icone: "calendar",
      titulo: "Não foi possível abrir o desafio",
      texto: erro ?? "Tente novamente em instantes.",
      botoes: [
        { rotulo: "Voltar ao início", caminho: "index.html", primario: true },
        { rotulo: "Montar uma partida", caminho: "pages/categorias.html" },
      ],
    });
    return;
  }

  mostrarEstado(base, {
    icone: "check",
    titulo: "Desafio de hoje concluído",
    texto: `Você acertou ${diario.acertos} de ${diario.total}, fez ${formatarNumero(diario.pontuacao)} pontos e ganhou ${formatarNumero(diario.xp)} XP (bônus do dia incluído). Volte amanhã para um novo desafio.`,
    botoes: [
      { rotulo: "Voltar ao início", caminho: "index.html", primario: true },
      { rotulo: "Jogar outro modo", caminho: "pages/categorias.html" },
    ],
    extra: el("section", { classe: "revisao-secao", atributos: { "aria-labelledby": "revisao-diario-titulo" } }, [
      el("h2", { classe: "secao__titulo", texto: "Revise suas respostas", atributos: { id: "revisao-diario-titulo" } }),
      criarRevisao(diario.respostas),
    ]),
  });
}

/** Há uma partida em andamento e o jogador pediu o desafio diário: pergunta o que fazer. */
async function oferecerDesafio(contexto) {
  const confirmou = await confirmarAcao({
    titulo: "Começar o desafio diário?",
    mensagem:
      "Você tem uma partida em andamento. Para jogar o desafio de hoje, ela será abandonada e nenhum XP será concedido por ela.",
    rotuloConfirmar: "Abandonar e começar",
    rotuloCancelar: "Continuar a partida",
    perigo: true,
  });

  if (!confirmou) {
    limparParametroDeModo();
    return;
  }

  contexto.ocupado = true;
  pararCronometro(contexto);
  abandonarPartida();
  window.location.replace(`${contexto.base}pages/jogo.html?modo=diario`);
}

// ---------- Início ----------
/** Ajusta a tela às regras do modo (dicas, placar do duelo, barra de tempo). */
function configurarModo(contexto) {
  const { partida, regras, elementos } = contexto;

  porId("dica-pausa").hidden = !regras.permitePausa;
  porId("dica-pular").hidden = !regras.permitePular;

  if (regras.jogadores === 2) {
    porId("chip-pontos").hidden = true;
    porId("chip-combo").hidden = true;

    const jogador = criarPlacarDoJogador(contexto.nomeJogador);
    const convidado = criarPlacarDoJogador(partida.convidado.nome);
    const area = porId("placar-duelo");
    area.hidden = false;
    area.replaceChildren(jogador.raiz, convidado.raiz);
    contexto.placar = { jogador, convidado };
  }

  if (regras.temTempo) {
    contexto.barraTempo = criarBarraDeTempo();
    elementos.slotTempo.hidden = false;
    elementos.slotTempo.replaceChildren(contexto.barraTempo.elemento);
  }
}

/** Chamada pelo app.js quando a tela de jogo é carregada. */
export function iniciar({ base }) {
  const modoPedido = new URLSearchParams(window.location.search).get("modo");
  let partida = obterPartidaAtiva();

  if (!partida) {
    if (modoPedido !== "diario") {
      mostrarSemPartida(base, modoPedido);
      return;
    }

    // "Aceitar desafio" na home: cria o desafio de hoje direto
    const { partida: criada, erro } = criarPartida({ modoId: "diario" });
    if (!criada) {
      mostrarDesafioIndisponivel(base, erro);
      return;
    }
    partida = criada;
  }

  const regras = obterRegrasDaPartida(partida);

  // Um segmento por pergunta (a Sobrevivência não tem número fixo de perguntas)
  const segmentos = regras.usaTodasAsPerguntas ? [] : partida.questoes.map(() => el("span", { classe: "segmento" }));
  const barra = porId("segmentos");
  barra.replaceChildren(...segmentos);
  barra.hidden = segmentos.length === 0;

  const contexto = {
    base,
    partida,
    regras,
    modoId: partida.config.modoId,
    nomeJogador: obterDados().perfil.nome,
    segmentos,
    ocupado: false,
    confirmando: false,
    convidadoPronto: false,
    pontosExibidos: partida.pontuacao,
    placar: null,
    barraTempo: null,
    cronometro: null,
    avisouTempo: false,
    elementos: {
      carta: porId("carta-pergunta"),
      marcas: porId("pergunta-marcas"),
      vez: porId("vez-jogador"),
      enunciado: porId("pergunta-enunciado"),
      alternativas: porId("alternativas"),
      feedback: porId("feedback"),
      contador: porId("contador-pergunta"),
      barra,
      slotTempo: porId("slot-tempo"),
      status: porId("jogo-status"),
      pontos: porId("chip-pontos"),
      pontosValor: porId("pontos-valor"),
      combo: porId("chip-combo"),
      comboValor: porId("combo-valor"),
      pips: [...document.querySelectorAll(".combo__pip")].slice(0, QUANTIDADE_DE_PONTOS_DO_COMBO),
      pausa: porId("tela-pausa"),
      passagem: porId("tela-passagem"),
      botaoPausar: porId("botao-pausar"),
      acoes: porId("acoes-pergunta"),
      botaoPular: porId("botao-pular"),
      textoPular: porId("texto-pular"),
    },
  };

  configurarModo(contexto);
  porId("jogo").hidden = false;
  montarPergunta(contexto, { restaurando: true });

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
  porId("botao-pular").addEventListener("click", () => aoPular(contexto));
  porId("botao-pronto").addEventListener("click", () => aoConvidadoPronto(contexto));
  document.addEventListener("keydown", (evento) => aoTeclar(contexto, evento));

  // Pediu o desafio diário, mas há outra partida em andamento
  if (modoPedido === "diario" && partida.config.modoId !== "diario") {
    if (desafioDiarioConcluidoHoje()) limparParametroDeModo();
    else oferecerDesafio(contexto);
  }
}