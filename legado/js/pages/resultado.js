import { criarElemento as el, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { obterConquistaPorId } from "../data/conquistas.js";
import { obterNomeDoModo, obterRegrasDoModo } from "../data/modos.js";
import { CATEGORIA_TODAS, DIFICULDADE_MISTA, DIFICULDADES } from "../data/perguntas.js";
import {
  criarBarraProgresso,
  criarCardDado,
  criarEstadoVazio,
  criarItemConquista,
} from "../components/card.js";
import { criarRevisao } from "../components/revisao.js";
import { mostrarNotificacao } from "../components/toast.js";
import {
  criarPartida,
  criarPartidaDeTreino,
  marcarResultadoNotificado,
  obterIdsDasErradas,
  obterResultado,
} from "../services/partida.js";
import { obterDados } from "../services/storage.js";
import { calcularNivel } from "../utils/progressao.js";
import { animarBarra, animarNumero, prefereMovimentoReduzido } from "../utils/animacao.js";
import { formatarDataLonga, formatarNumero } from "../utils/formatacao.js";

const plural = (numero, singular, varios) => `${formatarNumero(numero)} ${numero === 1 ? singular : varios}`;

function formatarDuracao(milissegundos) {
  const totalSegundos = Math.max(0, Math.round((Number(milissegundos) || 0) / 1000));
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  const doisDigitos = (valor) => String(valor).padStart(2, "0");

  return horas > 0
    ? `${horas}:${doisDigitos(minutos)}:${doisDigitos(segundos)}`
    : `${minutos}:${doisDigitos(segundos)}`;
}

// ---------- Textos do cabeçalho ----------
function mensagemDeDesempenho(resultado) {
  if (resultado.perfeita) return "Partida perfeita!";
  if (resultado.percentual >= 80) return "Mandou muito bem!";
  if (resultado.percentual >= 50) return "Bom resultado!";
  return "Continue praticando!";
}

/** Título do resultado, de acordo com o modo de jogo. */
function criarMensagem(resultado) {
  const { modoId } = resultado.config;

  if (resultado.duelo) {
    const { vencedor, convidado } = resultado.duelo;
    if (vencedor === "jogador") return "Você venceu o duelo!";
    if (vencedor === "convidado") return `${convidado.nome} venceu o duelo!`;
    return "Empate no duelo!";
  }
  if (modoId === "sobrevivencia") {
    return resultado.acertos === 0
      ? "A primeira foi dura. Tente de novo!"
      : `Você sobreviveu a ${plural(resultado.acertos, "pergunta", "perguntas")}!`;
  }
  if (modoId === "diario") {
    return resultado.perfeita ? "Desafio de hoje perfeito!" : "Desafio de hoje concluído!";
  }
  return mensagemDeDesempenho(resultado);
}

function escolherIcone(resultado) {
  if (resultado.perfeita) return "star";
  if (resultado.duelo) return "swords";

  const porModo = { sobrevivencia: "shield", tempo: "timer", diario: "calendar" };
  return porModo[resultado.config.modoId] ?? "trophy";
}

function nomeDaCategoria(categoriaId) {
  return categoriaId === CATEGORIA_TODAS ? "Todas as categorias" : (obterCategoriaPorId(categoriaId)?.nome ?? "Categoria");
}

function formatarDiaDoDesafio(data) {
  const [ano, mes, dia] = String(data ?? "").split("-").map(Number);
  if (!ano || !mes || !dia) return "hoje";
  return formatarDataLonga(new Date(ano, mes - 1, dia));
}

function descreverConfig(config) {
  const modo = obterNomeDoModo(config.modoId);

  if (config.modoId === "diario") return `${modo} · ${formatarDiaDoDesafio(config.dataDesafio)}`;
  if (config.treino) return `Treino das perguntas erradas · ${modo}`;

  const dificuldade =
    config.dificuldade === DIFICULDADE_MISTA
      ? "Dificuldade mista"
      : (DIFICULDADES.find((item) => item.id === config.dificuldade)?.nome ?? "");

  return [nomeDaCategoria(config.categoriaId), dificuldade, modo].filter(Boolean).join(" · ");
}

function renderizarCabecalho(resultado) {
  const itens = [
    el("span", { classe: "resultado__emblema" }, [criarIcone(escolherIcone(resultado), 36)]),
    el("h1", { classe: "resultado__titulo", texto: criarMensagem(resultado), atributos: { id: "resultado-titulo" } }),
    el("p", { classe: "resultado__contexto", texto: descreverConfig(resultado.config) }),
    el("p", { classe: "resultado__pontos", texto: formatarNumero(resultado.pontuacao) }),
    el("p", { classe: "resultado__pontos-rotulo", texto: "pontos" }),
  ];

  if (resultado.perfeita) {
    itens.push(
      el("p", { classe: "resultado__selo" }, [
        el("span", { classe: "badge badge--destaque" }, [criarIcone("star", 14), "Partida perfeita"]),
      ])
    );
  }

  porId("resultado-hero").replaceChildren(...itens);
}

// ---------- Duelo ----------
function criarColunaDoDuelo({ nome, pontuacao, acertos, erros, melhorCombo }, vencedor, empate) {
  return el("div", { classe: "duelo__jogador", atributos: { "data-vencedor": String(vencedor) } }, [
    el("p", { classe: "duelo__nome", texto: nome }),
    el("p", { classe: "duelo__pontos", texto: formatarNumero(pontuacao) }),
    el("p", { classe: "duelo__detalhe", texto: `${plural(acertos, "acerto", "acertos")} · ${plural(erros, "erro", "erros")}` }),
    el("p", { classe: "duelo__detalhe", texto: `Melhor combo ×${melhorCombo}` }),
    vencedor
      ? el("span", { classe: "badge badge--destaque" }, [criarIcone("trophy", 14), "Vencedor"])
      : empate
        ? el("span", { classe: "badge", texto: "Empate" })
        : null,
  ]);
}

function renderizarDuelo(resultado, nomeJogador) {
  const alvo = porId("resultado-duelo");
  if (!resultado.duelo) {
    alvo.hidden = true;
    alvo.replaceChildren();
    return;
  }

  const { vencedor, convidado } = resultado.duelo;
  const empate = vencedor === "empate";
  const jogador = {
    nome: nomeJogador,
    pontuacao: resultado.pontuacao,
    acertos: resultado.acertos,
    erros: resultado.erros,
    melhorCombo: resultado.melhorCombo,
  };

  const filhos = [
    el("h2", { classe: "duelo__titulo", texto: "Placar do duelo", atributos: { id: "duelo-titulo" } }),
    criarColunaDoDuelo(jogador, vencedor === "jogador", empate),
    el("span", { classe: "duelo__vs", texto: "×", atributos: { "aria-hidden": "true" } }),
    criarColunaDoDuelo(convidado, vencedor === "convidado", empate),
  ];

  // Desempate por acertos: avisa quando os pontos foram iguais
  if (resultado.pontuacao === convidado.pontuacao) {
    filhos.push(
      el("p", {
        classe: "duelo__nota",
        texto: empate ? "Mesmos pontos e mesmos acertos." : "Pontos iguais: o desempate foi pelo número de acertos.",
      })
    );
  }

  alvo.className = "duelo";
  alvo.hidden = false;
  alvo.replaceChildren(...filhos);
}

// ---------- Números da partida ----------
function renderizarDados(resultado) {
  const { modoId } = resultado.config;
  const sobrevivencia = modoId === "sobrevivencia";
  const cartoes = [
    criarCardDado({
      icone: "check",
      cor: "verde",
      valor: resultado.acertos,
      rotulo: sobrevivencia ? "Acertos seguidos" : "Acertos",
    }),
  ];

  if (!sobrevivencia) {
    cartoes.push(
      criarCardDado({ icone: "x", cor: "coral", valor: resultado.erros, rotulo: "Erros" }),
      criarCardDado({ icone: "percent", cor: "roxo", valor: `${Number(resultado.percentual) || 0}%`, rotulo: "Aproveitamento" })
    );
  }

  cartoes.push(
    criarCardDado({ icone: "clock", cor: "amarelo", valor: formatarDuracao(resultado.duracaoMs), rotulo: "Tempo total" }),
    criarCardDado({ icone: "flame", cor: "coral", valor: Number(resultado.melhorCombo) || 0, rotulo: "Melhor combo" })
  );

  const puladas = Number(resultado.puladas) || 0;
  const tempoEsgotado = Number(resultado.tempoEsgotado) || 0;
  if (puladas > 0) {
    cartoes.push(criarCardDado({ icone: "arrow-right", cor: "amarelo", valor: puladas, rotulo: "Puladas" }));
  }
  if (tempoEsgotado > 0) {
    cartoes.push(criarCardDado({ icone: "timer", cor: "coral", valor: tempoEsgotado, rotulo: "Tempo esgotado" }));
  }

  porId("resultado-dados").replaceChildren(...cartoes);
}

// ---------- Progresso ----------

/** Card de XP com número e barra animados. Retorna o card e a função que dispara as animações. */
function criarCardXp(resultado) {
  const progresso = resultado.progresso;
  const detalhe = resultado.xpDetalhe;
  const xpMissoes = Number(progresso?.xpMissoes) || 0;
  const xpDiario = Number(progresso?.xpDiario) || 0;
  const totalXp = resultado.xp + xpMissoes + xpDiario;

  const linhas = [
    ["Respostas corretas", Number(detalhe.acertos) || 0],
    ["Partida concluída", Number(detalhe.conclusao) || 0],
    ["Partida perfeita", Number(detalhe.perfeita) || 0],
    ["Desafio diário", xpDiario],
    ["Missões concluídas", xpMissoes],
  ].filter(([, valor]) => valor > 0);

  // Sem "progresso" (partida já registrada antes), mostra o estado atual sem animar
  const nivelDepois = calcularNivel(progresso ? progresso.xpDepois : obterDados().progresso.xp);
  const nivelAntes = progresso ? calcularNivel(progresso.xpAntes) : nivelDepois;
  const subiu = Boolean(progresso?.subiuDeNivel);

  const valorXp = el("p", { classe: "xp-total", texto: `+${formatarNumero(totalXp)} XP` });
  const barra = criarBarraProgresso({
    percentual: nivelAntes.percentual,
    rotulo: `Progresso no nível ${nivelDepois.nivel}`,
  });

  const filhos = [
    el("h2", { classe: "card__titulo", texto: "XP conquistado" }),
    valorXp,
    el(
      "ul",
      { classe: "lista-xp" },
      linhas.map(([rotulo, valor]) =>
        el("li", {}, [el("span", { texto: rotulo }), el("span", { texto: `+${valor}` })])
      )
    ),
    el("div", { classe: "nivel-resultado" }, [
      el("p", { classe: "nivel-resultado__titulo", texto: `Nível ${nivelDepois.nivel}` }),
      barra,
      el("p", {
        classe: "texto-pequeno texto-suave",
        texto: `${formatarNumero(nivelDepois.xpNoNivel)} / ${formatarNumero(nivelDepois.xpNecessario)} XP para o nível ${nivelDepois.nivel + 1}`,
      }),
    ]),
  ];

  if (resultado.duelo) {
    filhos.push(
      el("p", {
        classe: "texto-pequeno texto-suave",
        texto: "No duelo local, só o jogador do perfil recebe XP e estatísticas.",
      })
    );
  }

  if (subiu) {
    filhos.push(
      el("p", { classe: "destaque destaque--nivel" }, [
        criarIcone("trending-up", 22),
        `Você subiu para o nível ${progresso.nivelNovo}!`,
      ])
    );
  } else if (!progresso) {
    filhos.push(
      el("p", { classe: "texto-pequeno texto-suave", texto: "O progresso desta partida já havia sido contabilizado." })
    );
  }

  const animar = () => {
    animarNumero(valorXp, { de: 0, para: totalXp, formatar: (valor) => `+${formatarNumero(valor)} XP` });
    animarBarra(barra.firstElementChild, {
      de: nivelAntes.percentual,
      para: nivelDepois.percentual,
      passouDeNivel: subiu,
    });
    barra.setAttribute("aria-valuenow", String(nivelDepois.percentual));
  };

  return { elemento: el("section", { classe: "card" }, filhos), animar };
}

function criarCardRecorde(resultado) {
  const recorde = resultado.progresso?.recorde;
  const { modoId, treino } = resultado.config;
  // No desafio diário e no treino, "recorde da categoria" não faz sentido
  if (!recorde || modoId === "diario" || treino) return null;

  const nome = nomeDaCategoria(recorde.categoriaId);
  let texto = `Recorde em ${nome}.`;
  if (recorde.ehNovo && recorde.anterior > 0) {
    texto = `Novo recorde em ${nome}! O anterior era ${formatarNumero(recorde.anterior)} pts.`;
  } else if (recorde.ehNovo) {
    texto = `Primeiro recorde registrado em ${nome}.`;
  }

  return el("section", { classe: "card" }, [
    el("h2", { classe: "card__titulo", texto: "Recorde da categoria" }),
    el("p", { classe: "recorde__valor", texto: `${formatarNumero(recorde.atual)} pts` }),
    el("p", { classe: "recorde__texto", texto }),
  ]);
}

function criarCardRecordeSobrevivencia(resultado) {
  const recorde = resultado.progresso?.recordeSobrevivencia;
  if (!recorde) return null;

  let texto = `Sua melhor sequência na Sobrevivência é de ${plural(recorde.atual, "acerto", "acertos")}.`;
  if (recorde.ehNovo && recorde.anterior > 0) {
    texto = `Nova melhor sequência! A anterior era de ${plural(recorde.anterior, "acerto", "acertos")}.`;
  } else if (recorde.ehNovo) {
    texto = "Primeira sequência registrada na Sobrevivência.";
  }

  return el("section", { classe: "card" }, [
    el("h2", { classe: "card__titulo", texto: "Melhor sequência" }),
    el("p", { classe: "recorde__valor", texto: plural(recorde.atual, "acerto", "acertos") }),
    el("p", { classe: "recorde__texto", texto }),
  ]);
}

/** Sequência de dias jogados: aparece na 1ª partida do dia ou quando já são 2 dias ou mais. */
function criarCardSequencia(resultado) {
  const sequencia = resultado.progresso?.sequencia;
  if (!sequencia || (sequencia.atual < 2 && !sequencia.primeiraDoDia)) return null;

  let texto = `Sua melhor sequência é de ${plural(sequencia.melhor, "dia", "dias")}.`;
  if (sequencia.atual < 2) texto = "Jogue amanhã para começar uma sequência de dias.";
  else if (sequencia.novaMelhor) texto = "É a sua melhor sequência até agora!";

  return el("section", { classe: "card" }, [
    el("h2", { classe: "card__titulo", texto: "Sequência de dias" }),
    el("p", { classe: "recorde__valor", texto: plural(sequencia.atual, "dia", "dias") }),
    el("p", { classe: "recorde__texto", texto }),
  ]);
}

function criarCardMissoes(resultado) {
  const concluidas = resultado.progresso?.missoesConcluidas ?? [];
  if (concluidas.length === 0) return null;

  return el("section", { classe: "card" }, [
    el("h2", { classe: "card__titulo", texto: "Missões concluídas", atributos: { style: "margin-bottom:1rem" } }),
    el(
      "ul",
      { classe: "lista" },
      concluidas.map((missao) =>
        el("li", { classe: "item" }, [
          el("span", { classe: "icone-caixa icone-caixa--verde" }, [criarIcone("check", 22)]),
          el("div", { classe: "item__corpo" }, [el("p", { classe: "item__titulo", texto: String(missao.titulo) })]),
          el("span", { classe: "badge badge--destaque", texto: `+${Number(missao.xp) || 0} XP` }),
        ])
      )
    ),
  ]);
}

function renderizarProgresso(resultado) {
  const cardXp = criarCardXp(resultado);
  const cards = [
    cardXp.elemento,
    criarCardRecorde(resultado),
    criarCardRecordeSobrevivencia(resultado),
    criarCardSequencia(resultado),
    criarCardMissoes(resultado),
  ].filter(Boolean);

  porId("resultado-progresso").replaceChildren(...cards);
  cardXp.animar(); // só depois de o card estar na página

  const conquistas = (resultado.progresso?.novasConquistas ?? [])
    .map((id) => obterConquistaPorId(id))
    .filter(Boolean);

  const alvo = porId("resultado-conquistas");
  if (conquistas.length === 0) {
    alvo.replaceChildren();
    return;
  }

  const agora = new Date().toISOString();
  alvo.replaceChildren(
    el("section", { classe: "card" }, [
      el("h2", { classe: "card__titulo", texto: "Novas conquistas", atributos: { style: "margin-bottom:1rem" } }),
      el("ul", { classe: "lista" }, conquistas.map((conquista) => criarItemConquista(conquista, agora))),
    ])
  );
}

/** Notificações de recompensa: aparecem uma única vez por partida e não bloqueiam a página. */
function notificarRecompensas(resultado) {
  const progresso = resultado.progresso;
  if (!progresso || resultado.notificado) return;

  const fila = [];

  for (const id of progresso.novasConquistas ?? []) {
    const conquista = obterConquistaPorId(id);
    if (conquista) {
      fila.push({ icone: conquista.icone, titulo: "Conquista desbloqueada!", texto: conquista.titulo, tipo: "conquista" });
    }
  }
  if (progresso.subiuDeNivel) {
    fila.push({ icone: "trending-up", titulo: `Nível ${progresso.nivelNovo}!`, texto: "Você subiu de nível.", tipo: "nivel" });
  }
  for (const missao of progresso.missoesConcluidas ?? []) {
    fila.push({ icone: "target", titulo: "Missão concluída!", texto: `${missao.titulo} (+${missao.xp} XP)`, tipo: "missao" });
  }

  fila.forEach((notificacao, posicao) => {
    setTimeout(() => mostrarNotificacao(notificacao), 700 + posicao * 500);
  });

  // Marca já, para não repetir se a página for recarregada
  marcarResultadoNotificado();
}

// ---------- Revisão de respostas ----------

/**
 * Monta a seção de revisão (escondida) e devolve a função que abre ou fecha.
 * Retorna null se o resultado não tem a lista de respostas (resultados antigos).
 */
function prepararRevisao(resultado) {
  const respostas = Array.isArray(resultado.respostas) ? resultado.respostas : [];
  if (respostas.length === 0) return null;

  const erradas = respostas.filter((resposta) => !resposta.acertou).length;
  const secao = porId("resultado-revisao");
  const lista = el("div");
  const titulo = el("h2", {
    classe: "secao__titulo",
    texto: "Revise suas respostas",
    atributos: { id: "revisao-titulo", tabindex: "-1" },
  });

  const botaoTodas = el("button", {
    classe: "botao botao--pequeno botao--contorno",
    texto: "Todas",
    atributos: { type: "button", "aria-pressed": "true" },
    aoClicar: () => mostrarLista(false),
  });
  const botaoErradas = el("button", {
    classe: "botao botao--pequeno botao--contorno",
    texto: `Só as erradas (${erradas})`,
    atributos: { type: "button", "aria-pressed": "false", disabled: erradas === 0 },
    aoClicar: () => mostrarLista(true),
  });

  function mostrarLista(apenasErradas) {
    botaoTodas.setAttribute("aria-pressed", String(!apenasErradas));
    botaoErradas.setAttribute("aria-pressed", String(apenasErradas));
    lista.replaceChildren(criarRevisao(respostas, { apenasErradas }));
  }

  secao.replaceChildren(
    el("div", { classe: "revisao-cabecalho" }, [
      titulo,
      el("div", { classe: "revisao-filtros", atributos: { role: "group", "aria-label": "Filtrar respostas" } }, [
        botaoTodas,
        botaoErradas,
      ]),
    ]),
    lista
  );
  mostrarLista(false);

  /** Abre ou fecha a revisão. Retorna true se ficou aberta. */
  return function alternar() {
    const abrir = secao.hidden;
    secao.hidden = !abrir;

    if (abrir) {
      secao.scrollIntoView({ behavior: prefereMovimentoReduzido() ? "auto" : "smooth", block: "start" });
      titulo.focus({ preventScroll: true });
    }
    return abrir;
  };
}

// ---------- Ações ----------
function criarBotaoRevisar(alternarRevisao) {
  const texto = el("span", { texto: "Revisar respostas" });
  const botao = el(
    "button",
    {
      classe: "botao botao--contorno botao--grande",
      atributos: { type: "button", "aria-expanded": "false", "aria-controls": "resultado-revisao" },
      aoClicar: () => {
        const aberta = alternarRevisao();
        botao.setAttribute("aria-expanded", String(aberta));
        texto.textContent = aberta ? "Esconder revisão" : "Revisar respostas";
      },
    },
    [criarIcone("book-open", 20), texto]
  );
  return botao;
}

function renderizarAcoes(resultado, base, alternarRevisao) {
  const { config } = resultado;
  const ehDiario = config.modoId === "diario";
  const ehTreino = Boolean(config.treino);
  const erradas = obterIdsDasErradas(resultado).length;
  const botoes = [];

  const iniciar = (funcaoDeCriar, botao) => {
    const { erro } = funcaoDeCriar();
    if (erro) {
      porId("erro-resultado").textContent = erro;
      return;
    }
    botao.disabled = true;
    window.location.href = `${base}pages/jogo.html`;
  };

  // O desafio diário só vale uma vez por dia: não tem "jogar novamente"
  if (!ehDiario) {
    botoes.push(
      el(
        "button",
        {
          classe: "botao botao--primario botao--grande",
          atributos: { type: "button" },
          // Nova partida com as mesmas configurações (perguntas sorteadas de novo)
          aoClicar: (evento) => iniciar(() => criarPartida(config), evento.currentTarget),
        },
        [criarIcone("play", 20), "Jogar novamente"]
      )
    );
  }

  if (erradas > 0 && Array.isArray(resultado.respostas)) {
    botoes.push(
      el(
        "button",
        {
          classe: "botao botao--amarelo botao--grande",
          atributos: { type: "button" },
          aoClicar: (evento) => iniciar(() => criarPartidaDeTreino(resultado), evento.currentTarget),
        },
        [criarIcone("refresh", 20), `Rever só as erradas (${erradas})`]
      )
    );
  }

  if (alternarRevisao) botoes.push(criarBotaoRevisar(alternarRevisao));

  if (ehDiario) {
    botoes.push(
      el("a", {
        classe: "botao botao--primario botao--grande",
        texto: "Jogar outro modo",
        atributos: { href: `${base}pages/categorias.html` },
      })
    );
  } else if (!ehTreino) {
    const consulta = new URLSearchParams({
      categoria: config.categoriaId,
      dificuldade: config.dificuldade,
      modo: config.modoId,
    });
    if (!obterRegrasDoModo(config.modoId).usaTodasAsPerguntas) consulta.set("quantidade", String(config.quantidade));

    botoes.push(
      el("a", {
        classe: "botao botao--contorno botao--grande",
        texto: "Alterar configurações",
        atributos: { href: `${base}pages/categorias.html?${consulta.toString()}` },
      })
    );
  }

  botoes.push(
    el("a", {
      classe: "botao botao--texto botao--grande",
      texto: "Voltar ao início",
      atributos: { href: `${base}index.html` },
    })
  );

  porId("resultado-acoes").replaceChildren(...botoes);
}

function mostrarSemResultado(base) {
  porId("resultado").hidden = true;
  const alvo = porId("sem-resultado");
  alvo.hidden = false;
  alvo.replaceChildren(
    criarEstadoVazio({
      icone: "trophy",
      titulo: "Nenhum resultado para mostrar",
      texto: "Termine uma partida para ver o seu desempenho aqui.",
    }),
    el("div", { classe: "sem-resultado__acoes" }, [
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

/** Chamada pelo app.js quando a tela de resultado é carregada. */
export function iniciar({ base }) {
  const resultado = obterResultado();
  if (!resultado) {
    mostrarSemResultado(base);
    return;
  }

  const nomeJogador = obterDados().perfil.nome;

  porId("resultado").hidden = false;
  renderizarCabecalho(resultado);
  renderizarDuelo(resultado, nomeJogador);
  renderizarDados(resultado);
  renderizarProgresso(resultado);
  renderizarAcoes(resultado, base, prepararRevisao(resultado));
  notificarRecompensas(resultado);
}