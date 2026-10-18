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

/** Card de estatística: ícone, valor grande e rótulo. */
export function criarCardEstatistica({ icone, cor, valor, rotulo }) {
  return criarElemento("div", { classe: "card estatistica" }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${cor}` }, [criarIcone(icone, 22)]),
    criarElemento("p", { classe: "estatistica__valor", texto: String(valor) }),
    criarElemento("p", { classe: "estatistica__rotulo", texto: rotulo }),
  ]);
}

/** Item de missão com barra de progresso. */
export function criarItemMissao(missao, progresso) {
  const valor = Math.min(Number(progresso) || 0, missao.meta);
  const completa = valor >= missao.meta;

  const badge = completa
    ? criarElemento("span", { classe: "badge badge--sucesso" }, [criarIcone("check", 14), "Concluída"])
    : criarElemento("span", { classe: "badge badge--destaque", texto: `+${missao.xp} XP` });

  return criarElemento("li", { classe: "item item--missao" }, [
    criarElemento("div", { classe: "missao__linha" }, [
      criarElemento("p", { classe: "item__titulo", texto: missao.titulo }),
      badge,
    ]),
    criarBarraProgresso({
      percentual: (valor / missao.meta) * 100,
      rotulo: missao.titulo,
      completo: completa,
    }),
    criarElemento("p", { classe: "missao__progresso", texto: `${valor} de ${missao.meta}` }),
  ]);
}

/**
 * Item de conquista. Sem desbloqueadaEm, aparece como bloqueada
 * (será usada na página de conquistas, na Etapa 3).
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

/** Item do histórico de partidas. Valida os campos antes de exibir. */
export function criarItemHistorico(partida) {
  const categoria = obterCategoriaPorId(partida.categoriaId);
  const acertos = Number(partida.acertos) || 0;
  const total = Number(partida.total) || 0;
  const pontuacao = Number(partida.pontuacao) || 0;

  return criarElemento("li", { classe: "item" }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${categoria?.cor ?? "cinza"}` }, [
      criarIcone(categoria?.icone ?? "star", 22),
    ]),
    criarElemento("div", { classe: "item__corpo" }, [
      criarElemento("p", { classe: "item__titulo", texto: categoria?.nome ?? "Partida" }),
      criarElemento("p", {
        classe: "item__detalhe",
        texto: `${obterNomeDoModo(partida.modoId)} · ${acertos}/${total} acertos · ${formatarNumero(pontuacao)} pts`,
      }),
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