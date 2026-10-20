import { criarElemento, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { obterConquistaPorId } from "../data/conquistas.js";
import { obterNomeDoModo } from "../data/modos.js";
import { CATEGORIA_TODAS, DIFICULDADE_MISTA, DIFICULDADES } from "../data/perguntas.js";
import {
  criarBarraProgresso,
  criarCardDado,
  criarEstadoVazio,
  criarItemConquista,
} from "../components/card.js";
import { mostrarNotificacao } from "../components/toast.js";
import { criarPartida, marcarResultadoNotificado, obterResultado } from "../services/partida.js";
import { obterDados } from "../services/storage.js";
import { calcularNivel } from "../utils/progressao.js";
import { animarBarra, animarNumero } from "../utils/animacao.js";
import { formatarNumero } from "../utils/formatacao.js";

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

function mensagemDeDesempenho(resultado) {
  if (resultado.perfeita) return "Partida perfeita!";
  if (resultado.percentual >= 80) return "Mandou muito bem!";
  if (resultado.percentual >= 50) return "Bom resultado!";
  return "Continue praticando!";
}

function nomeDaCategoria(categoriaId) {
  return categoriaId === CATEGORIA_TODAS ? "Todas as categorias" : (obterCategoriaPorId(categoriaId)?.nome ?? "Categoria");
}

function descreverConfig(config) {
  const dificuldade =
    config.dificuldade === DIFICULDADE_MISTA
      ? "Dificuldade mista"
      : (DIFICULDADES.find((item) => item.id === config.dificuldade)?.nome ?? "");

  return [nomeDaCategoria(config.categoriaId), dificuldade, obterNomeDoModo(config.modoId)]
    .filter(Boolean)
    .join(" · ");
}

function renderizarCabecalho(resultado) {
  const itens = [
    criarElemento("span", { classe: "resultado__emblema" }, [criarIcone(resultado.perfeita ? "star" : "trophy", 36)]),
    criarElemento("h1", { classe: "resultado__titulo", texto: mensagemDeDesempenho(resultado), atributos: { id: "resultado-titulo" } }),
    criarElemento("p", { classe: "resultado__contexto", texto: descreverConfig(resultado.config) }),
    criarElemento("p", { classe: "resultado__pontos", texto: formatarNumero(resultado.pontuacao) }),
    criarElemento("p", { classe: "resultado__pontos-rotulo", texto: "pontos" }),
  ];

  if (resultado.perfeita) {
    itens.push(
      criarElemento("p", { classe: "resultado__selo" }, [
        criarElemento("span", { classe: "badge badge--destaque" }, [criarIcone("star", 14), "Partida perfeita"]),
      ])
    );
  }

  porId("resultado-hero").replaceChildren(...itens);
}

function renderizarDados(resultado) {
  porId("resultado-dados").replaceChildren(
    criarCardDado({ icone: "check", cor: "verde", valor: resultado.acertos, rotulo: "Acertos" }),
    criarCardDado({ icone: "x", cor: "coral", valor: resultado.erros, rotulo: "Erros" }),
    criarCardDado({ icone: "percent", cor: "roxo", valor: `${Number(resultado.percentual) || 0}%`, rotulo: "Aproveitamento" }),
    criarCardDado({ icone: "clock", cor: "amarelo", valor: formatarDuracao(resultado.duracaoMs), rotulo: "Tempo total" }),
    criarCardDado({ icone: "flame", cor: "coral", valor: Number(resultado.melhorCombo) || 0, rotulo: "Melhor sequência" })
  );
}

/** Card de XP com número e barra animados. Retorna o card e a função que dispara as animações. */
function criarCardXp(resultado) {
  const progresso = resultado.progresso;
  const detalhe = resultado.xpDetalhe;
  const xpMissoes = Number(progresso?.xpMissoes) || 0;
  const totalXp = resultado.xp + xpMissoes;

  const linhas = [
    ["Respostas corretas", Number(detalhe.acertos) || 0],
    ["Partida concluída", Number(detalhe.conclusao) || 0],
    ["Partida perfeita", Number(detalhe.perfeita) || 0],
    ["Missões concluídas", xpMissoes],
  ].filter(([, valor]) => valor > 0);

  // Sem "progresso" (partida já registrada antes), mostra o estado atual sem animar
  const nivelDepois = calcularNivel(progresso ? progresso.xpDepois : obterDados().progresso.xp);
  const nivelAntes = progresso ? calcularNivel(progresso.xpAntes) : nivelDepois;
  const subiu = Boolean(progresso?.subiuDeNivel);

  const valorXp = criarElemento("p", { classe: "xp-total", texto: `+${formatarNumero(totalXp)} XP` });
  const barra = criarBarraProgresso({
    percentual: nivelAntes.percentual,
    rotulo: `Progresso no nível ${nivelDepois.nivel}`,
  });

  const filhos = [
    criarElemento("h2", { classe: "card__titulo", texto: "XP conquistado" }),
    valorXp,
    criarElemento(
      "ul",
      { classe: "lista-xp" },
      linhas.map(([rotulo, valor]) =>
        criarElemento("li", {}, [criarElemento("span", { texto: rotulo }), criarElemento("span", { texto: `+${valor}` })])
      )
    ),
    criarElemento("div", { classe: "nivel-resultado" }, [
      criarElemento("p", { classe: "nivel-resultado__titulo", texto: `Nível ${nivelDepois.nivel}` }),
      barra,
      criarElemento("p", {
        classe: "texto-pequeno texto-suave",
        texto: `${formatarNumero(nivelDepois.xpNoNivel)} / ${formatarNumero(nivelDepois.xpNecessario)} XP para o nível ${nivelDepois.nivel + 1}`,
      }),
    ]),
  ];

  if (subiu) {
    filhos.push(
      criarElemento("p", { classe: "destaque destaque--nivel" }, [
        criarIcone("trending-up", 22),
        `Você subiu para o nível ${progresso.nivelNovo}!`,
      ])
    );
  } else if (!progresso) {
    filhos.push(
      criarElemento("p", { classe: "texto-pequeno texto-suave", texto: "O progresso desta partida já havia sido contabilizado." })
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

  return { elemento: criarElemento("section", { classe: "card" }, filhos), animar };
}

function criarCardRecorde(resultado) {
  const recorde = resultado.progresso?.recorde;
  if (!recorde) return null;

  const nome = nomeDaCategoria(recorde.categoriaId);
  let texto = `Recorde em ${nome}.`;
  if (recorde.ehNovo && recorde.anterior > 0) {
    texto = `Novo recorde em ${nome}! O anterior era ${formatarNumero(recorde.anterior)} pts.`;
  } else if (recorde.ehNovo) {
    texto = `Primeiro recorde registrado em ${nome}.`;
  }

  return criarElemento("section", { classe: "card" }, [
    criarElemento("h2", { classe: "card__titulo", texto: "Recorde da categoria" }),
    criarElemento("p", { classe: "recorde__valor", texto: `${formatarNumero(recorde.atual)} pts` }),
    criarElemento("p", { classe: "recorde__texto", texto }),
  ]);
}

function criarCardMissoes(resultado) {
  const concluidas = resultado.progresso?.missoesConcluidas ?? [];
  if (concluidas.length === 0) return null;

  return criarElemento("section", { classe: "card" }, [
    criarElemento("h2", { classe: "card__titulo", texto: "Missões concluídas", atributos: { style: "margin-bottom:1rem" } }),
    criarElemento(
      "ul",
      { classe: "lista" },
      concluidas.map((missao) =>
        criarElemento("li", { classe: "item" }, [
          criarElemento("span", { classe: "icone-caixa icone-caixa--verde" }, [criarIcone("check", 22)]),
          criarElemento("div", { classe: "item__corpo" }, [criarElemento("p", { classe: "item__titulo", texto: String(missao.titulo) })]),
          criarElemento("span", { classe: "badge badge--destaque", texto: `+${Number(missao.xp) || 0} XP` }),
        ])
      )
    ),
  ]);
}

function renderizarProgresso(resultado) {
  const cardXp = criarCardXp(resultado);
  const cards = [cardXp.elemento, criarCardRecorde(resultado), criarCardMissoes(resultado)].filter(Boolean);
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
    criarElemento("section", { classe: "card" }, [
      criarElemento("h2", { classe: "card__titulo", texto: "Novas conquistas", atributos: { style: "margin-bottom:1rem" } }),
      criarElemento("ul", { classe: "lista" }, conquistas.map((conquista) => criarItemConquista(conquista, agora))),
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

function renderizarAcoes(resultado, base) {
  const { config } = resultado;
  const consulta = new URLSearchParams({
    categoria: config.categoriaId,
    dificuldade: config.dificuldade,
    quantidade: String(config.quantidade),
  });

  const botaoJogarNovamente = criarElemento(
    "button",
    {
      classe: "botao botao--primario botao--grande",
      atributos: { type: "button" },
      aoClicar: (evento) => {
        // Nova partida com as mesmas configurações (perguntas sorteadas de novo)
        const { erro } = criarPartida(config);
        if (erro) {
          porId("erro-resultado").textContent = erro;
          return;
        }
        evento.currentTarget.disabled = true;
        window.location.href = `${base}pages/jogo.html`;
      },
    },
    [criarIcone("play", 20), "Jogar novamente"]
  );

  porId("resultado-acoes").replaceChildren(
    botaoJogarNovamente,
    criarElemento("a", {
      classe: "botao botao--contorno botao--grande",
      texto: "Alterar configurações",
      atributos: { href: `${base}pages/categorias.html?${consulta.toString()}` },
    }),
    criarElemento("a", {
      classe: "botao botao--texto botao--grande",
      texto: "Voltar ao início",
      atributos: { href: `${base}index.html` },
    })
  );
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
    criarElemento("div", { classe: "sem-resultado__acoes" }, [
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

/** Chamada pelo app.js quando a tela de resultado é carregada. */
export function iniciar({ base }) {
  const resultado = obterResultado();
  if (!resultado) {
    mostrarSemResultado(base);
    return;
  }

  porId("resultado").hidden = false;
  renderizarCabecalho(resultado);
  renderizarDados(resultado);
  renderizarProgresso(resultado);
  renderizarAcoes(resultado, base);
  notificarRecompensas(resultado);
}