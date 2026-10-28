import { criarElemento } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { obterNomeDoModo } from "../data/modos.js";
import { formatarDataCurta, formatarNumero } from "../utils/formatacao.js";

/** Barra de progresso acessível. percentual: 0 a 100. */
export function criarBarraProgresso({ percentual, rotulo, completo = false }) {
  const valor = Math.max(0, Math.min(100, Math.round(percentual) || 0));

  const preenchimento = criarElemento("div", {
    classe: `barra__preenchimento${completo ? " barra__preenchimento--completo" : ""}`,
  });
  preenchimento.style.width = `${valor}%`;

  return criarElemento(
    "div",
    {
      classe: "barra",
      atributos: {
        role: "progressbar",
        "aria-label": rotulo,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": valor,
      },
    },
    [preenchimento]
  );
}

/** Card clicável de uma categoria. */
export function criarCardCategoria(categoria, estatistica, base) {
  const partidas = Number(estatistica?.partidas) || 0;
  const meta = partidas === 0 ? "Ainda não jogada" : `${partidas} ${partidas === 1 ? "partida" : "partidas"}`;

  return criarElemento(
    "a",
    {
      classe: "card card--interativo card-categoria",
      atributos: { href: `${base}pages/categorias.html?categoria=${encodeURIComponent(categoria.id)}` },
    },
    [
      criarElemento("span", { classe: `icone-caixa icone-caixa--${categoria.cor}` }, [criarIcone(categoria.icone, 24)]),
      criarElemento("h3", { classe: "card-categoria__nome", texto: categoria.nome }),
      criarElemento("p", { classe: "card-categoria__descricao", texto: categoria.descricao }),
      criarElemento("p", { classe: "card-categoria__meta", texto: meta }),
    ]
  );
}

/** Card de estatística da página inicial: ícone, valor grande e rótulo. */
export function criarCardEstatistica({ icone, cor, valor, rotulo }) {
  return criarElemento("div", { classe: "card estatistica" }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${cor}` }, [criarIcone(icone, 22)]),
    criarElemento("p", { classe: "estatistica__valor", texto: String(valor) }),
    criarElemento("p", { classe: "estatistica__rotulo", texto: rotulo }),
  ]);
}

/** Card de dado (perfil e resultado). Estilos em css/gamificacao.css. */
export function criarCardDado({ icone, cor, valor, rotulo }) {
  return criarElemento("div", { classe: "card dado" }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${cor}` }, [criarIcone(icone, 22)]),
    criarElemento("p", { classe: "dado__valor", texto: String(valor) }),
    criarElemento("p", { classe: "dado__rotulo", texto: rotulo }),
  ]);
}

/**
 * Item de missão com barra de progresso.
 * detalhada: mostra também a descrição completa (página de conquistas).
 */
export function criarItemMissao(missao, progresso, { detalhada = false } = {}) {
  const valor = Math.min(Number(progresso) || 0, missao.meta);
  const completa = valor >= missao.meta;

  const selo = completa
    ? criarElemento("span", { classe: "badge badge--sucesso" }, [criarIcone("check", 14), "Concluída"])
    : criarElemento("span", { classe: "badge badge--destaque", texto: `+${missao.xp} XP` });

  const textoProgresso = completa
    ? `${valor} de ${missao.meta}`
    : `${valor} de ${missao.meta} · faltam ${missao.meta - valor}`;

  const filhos = [
    criarElemento("div", { classe: "missao__linha" }, [
      criarElemento("p", { classe: "item__titulo", texto: missao.titulo }),
      selo,
    ]),
  ];
  if (detalhada && missao.descricao) {
    filhos.push(criarElemento("p", { classe: "missao__descricao", texto: missao.descricao }));
  }
  filhos.push(
    criarBarraProgresso({
      percentual: (valor / missao.meta) * 100,
      rotulo: missao.titulo,
      completo: completa,
    }),
    criarElemento("p", { classe: "missao__progresso", texto: textoProgresso })
  );

  return criarElemento("li", { classe: "item item--missao" }, filhos);
}

/**
 * Item compacto de conquista (home, perfil e resultado).
 * Sem desbloqueadaEm, aparece como bloqueada.
 */
export function criarItemConquista(conquista, desbloqueadaEm) {
  const desbloqueada = Boolean(desbloqueadaEm);
  const detalhe = desbloqueada
    ? `Desbloqueada em ${formatarDataCurta(desbloqueadaEm)}`
    : conquista.descricao;

  return criarElemento("li", { classe: `item${desbloqueada ? "" : " item--bloqueado"}` }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${desbloqueada ? "amarelo" : "cinza"}` }, [
      criarIcone(desbloqueada ? conquista.icone : "lock", 22),
    ]),
    criarElemento("div", { classe: "item__corpo" }, [
      criarElemento("p", { classe: "item__titulo", texto: conquista.titulo }),
      criarElemento("p", { classe: "item__detalhe", texto: detalhe }),
    ]),
  ]);
}

/**
 * Card completo de conquista (página de conquistas).
 * avaliacao: { atual, meta, concluida } vindo de avaliarConquista().
 */
export function criarCardConquista(conquista, avaliacao, desbloqueadaEm) {
  const desbloqueada = Boolean(desbloqueadaEm);

  const selo = desbloqueada
    ? criarElemento("span", { classe: "badge badge--sucesso" }, [criarIcone("check", 14), "Desbloqueada"])
    : criarElemento("span", { classe: "badge" }, [criarIcone("lock", 14), "Bloqueada"]);

  let rodape;
  if (desbloqueada) {
    rodape = criarElemento("p", {
      classe: "cartao-conquista__detalhe",
      texto: `Desbloqueada em ${formatarDataCurta(desbloqueadaEm)}`,
    });
  } else if (avaliacao.concluida) {
    rodape = criarElemento("p", {
      classe: "cartao-conquista__detalhe",
      texto: "Requisito cumprido! Será registrada ao concluir a próxima partida.",
    });
  } else {
    rodape = criarElemento("div", { classe: "cartao-conquista__progresso" }, [
      criarBarraProgresso({
        percentual: (avaliacao.atual / avaliacao.meta) * 100,
        rotulo: `Progresso de ${conquista.titulo}`,
      }),
      criarElemento("p", {
        classe: "cartao-conquista__detalhe",
        texto: `${formatarNumero(avaliacao.atual)} de ${formatarNumero(avaliacao.meta)}`,
      }),
    ]);
  }

  return criarElemento("li", { classe: `cartao-conquista${desbloqueada ? "" : " cartao-conquista--bloqueada"}` }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${desbloqueada ? "amarelo" : "cinza"}` }, [
      criarIcone(conquista.icone, 24),
    ]),
    criarElemento("div", { classe: "cartao-conquista__corpo" }, [
      criarElemento("div", { classe: "cartao-conquista__topo" }, [
        criarElemento("h3", { classe: "cartao-conquista__titulo", texto: conquista.titulo }),
        selo,
      ]),
      criarElemento("p", { classe: "cartao-conquista__descricao", texto: conquista.descricao }),
      rodape,
    ]),
  ]);
}

/** Item do histórico de partidas. Valida os campos antes de exibir. */
export function criarItemHistorico(partida) {
  const categoria = obterCategoriaPorId(partida.categoriaId);
  const acertos = Number(partida.acertos) || 0;
  const total = Number(partida.total) || 0;
  const pontuacao = Number(partida.pontuacao) || 0;
  const xp = Number(partida.xp) || 0;

  let detalhe = `${obterNomeDoModo(partida.modoId)} · ${acertos}/${total} acertos · ${formatarNumero(pontuacao)} pts`;
  if (xp > 0) detalhe += ` · +${formatarNumero(xp)} XP`;

  return criarElemento("li", { classe: "item" }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${categoria?.cor ?? "cinza"}` }, [
      criarIcone(categoria?.icone ?? "star", 22),
    ]),
    criarElemento("div", { classe: "item__corpo" }, [
      criarElemento("p", { classe: "item__titulo", texto: categoria?.nome ?? "Todas as categorias" }),
      criarElemento("p", { classe: "item__detalhe", texto: detalhe }),
    ]),
    criarElemento("span", { classe: "item__detalhe", texto: formatarDataCurta(partida.data) }),
  ]);
}

/** Mensagem para quando ainda não há dados. */
export function criarEstadoVazio({ icone, titulo, texto }) {
  return criarElemento("div", { classe: "estado-vazio" }, [
    criarElemento("span", { classe: "icone-caixa icone-caixa--cinza" }, [criarIcone(icone, 22)]),
    criarElemento("p", { classe: "estado-vazio__titulo", texto: titulo }),
    criarElemento("p", { classe: "estado-vazio__texto", texto }),
  ]);
}