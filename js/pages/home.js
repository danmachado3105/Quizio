import { criarElemento as el, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { CATEGORIAS, obterCategoriaPorId } from "../data/categorias.js";
import { CONQUISTAS, avaliarConquista } from "../data/conquistas.js";
import { MODOS } from "../data/modos.js";
import {
  CATEGORIA_TODAS,
  DIFICULDADE_MISTA,
  PERGUNTAS,
  contarPerguntasPorCategoria,
  filtrarPerguntas,
} from "../data/perguntas.js";
import { abrirModalNome } from "../components/modal.js";
import { criarBarraProgresso, criarItemHistorico } from "../components/card.js";
import { MODOS_IMPLEMENTADOS, criarPartida, obterPartidaAtiva } from "../services/partida.js";
import { obterEstadoDasMissoes } from "../services/missoes.js";
import { desafioDiarioConcluidoHoje, obterDados } from "../services/storage.js";
import { QUANTIDADE_DESAFIO_DIARIO, XP_DESAFIO_DIARIO } from "../utils/pontuacao.js";
import { calcularNivel } from "../utils/progressao.js";
import { iniciarRevelacao } from "../utils/revelar.js";
import { criarCapa } from "../utils/imagens.js";
import { abrirRoleta } from "../components/roleta.js";
import { embaralhar } from "../utils/sorteio.js";
import { dataLocalISO, formatarDataLonga, formatarNumero, saudacaoPorHora } from "../utils/formatacao.js";

/*
 * A página inicial muda conforme o jogador:
 *  - novo (nenhuma partida concluída): explica como funciona e convida a jogar
 *  - recorrente: mostra nível, semana, missões e atalhos para continuar
 * Tudo vem de dados reais (perguntas, histórico, missões, conquistas).
 */
const LETRAS = ["A", "B", "C", "D"];

const ORDEM_PADRAO = [
  "ciencia-espaco", "historia", "filmes", "jogos", "brasil", "musica",
  "series", "animes", "geografia", "esportes", "tecnologia", "literatura",
  "natureza-animais", "conhecimentos-gerais", "arte-arquitetura", "comida-culinaria",
  "corpo-humano", "mitologia-lendas", "matematica-logica", "lingua-portuguesa",
  "economia-negocios", "datas-tradicoes", "invencoes-descobertas",
];

// Seis temas ganham destaque no mosaico, cada um com tamanho e cor próprios
const FORMATOS_DO_MOSAICO = [
  { tamanho: "grande", tema: "roxo", icone: 170 },
  { tamanho: "media", tema: "amarelo", icone: 100 },
  { tamanho: "media", tema: "coral", icone: 100 },
  { tamanho: "pequena", tema: "branco", icone: 80 },
  { tamanho: "pequena", tema: "escuro", icone: 80 },
  { tamanho: "pequena", tema: "creme", icone: 80 },
];

const VISUAL_DOS_MODOS = {
  classico: { icone: "book-open", regra: "Sem relógio. Erre à vontade e aprenda com a explicação de cada resposta." },
  tempo: { icone: "timer", regra: "Cada pergunta tem tempo limitado. Quem pensa rápido pontua mais." },
  sobrevivencia: { icone: "shield", regra: "Continue enquanto acertar. A primeira resposta errada encerra a partida." },
  diario: { icone: "calendar", regra: "As mesmas perguntas para todo mundo no dia, com bônus de XP uma vez por data." },
  duelo: { icone: "swords", regra: "Duas pessoas no mesmo dispositivo, alternando as respostas." },
};

/** Atributos de revelação ao rolar, com atraso escalonado. */
const revelar = (posicao = 0) => ({ "data-revelar": true, style: `--atraso:${posicao * 90}ms` });

const linha = (conteudo) => el("span", { classe: "linha" }, [conteudo]);

// ---------- Utilidades de dados ----------
function ordenarPorInteresse(dados) {
  const respondidas = dados.estatisticas.perguntasPorCategoria;
  return [...CATEGORIAS].sort(
    (a, b) =>
      (respondidas[b.id] || 0) - (respondidas[a.id] || 0) ||
      ORDEM_PADRAO.indexOf(a.id) - ORDEM_PADRAO.indexOf(b.id)
  );
}

/** Tema que o jogador menos explorou (ou um bom primeiro tema, para quem é novo). */
function recomendarCategoria(dados) {
  const respondidas = dados.estatisticas.perguntasPorCategoria;
  return [...CATEGORIAS].sort(
    (a, b) =>
      (respondidas[a.id] || 0) - (respondidas[b.id] || 0) ||
      ORDEM_PADRAO.indexOf(a.id) - ORDEM_PADRAO.indexOf(b.id)
  )[0];
}

function taxaDeAcerto(dados) {
  const { acertos, perguntasRespondidas } = dados.estatisticas;
  return perguntasRespondidas > 0 ? Math.round((acertos / perguntasRespondidas) * 100) : 0;
}

function linkDeCategoria(base, categoriaId) {
  const consulta = new URLSearchParams({ categoria: categoriaId, dificuldade: DIFICULDADE_MISTA });
  return `${base}pages/categorias.html?${consulta.toString()}`;
}

// ---------- Abertura ----------
function repetirUltimaPartida(ctx, botao) {
  const ultima = ctx.dados.historico[0];
  const { erro } = criarPartida({
    categoriaId: ultima?.categoriaId ?? CATEGORIA_TODAS,
    dificuldade: ultima?.dificuldade ?? DIFICULDADE_MISTA,
    quantidade: ultima?.total ?? 10,
    modoId: "classico",
  });

  if (erro) {
    window.location.href = `${ctx.base}pages/categorias.html`;
    return;
  }
  botao.disabled = true;
  window.location.href = `${ctx.base}pages/jogo.html`;
}

/** Carta de prévia: uma pergunta real e fácil, jogável na hora (não vale pontos). */
function criarPrevia(base) {
  const faceis = filtrarPerguntas({ dificuldade: "facil" });
  const carta = el("div", { classe: "carta-quiz", atributos: { role: "group", "aria-label": "Prévia de pergunta" } });
  let ultimoId = null;

  function sortear() {
    const candidatas = faceis.filter((pergunta) => pergunta.id !== ultimoId);
    return candidatas[Math.floor(Math.random() * candidatas.length)];
  }

  function montar() {
    const pergunta = sortear();
    if (!pergunta) return;
    ultimoId = pergunta.id;

    const categoria = obterCategoriaPorId(pergunta.categoria);
    const feedback = el("div", { classe: "carta-quiz__feedback", atributos: { "aria-live": "polite" } });
    let respondida = false;

    const botoes = embaralhar([0, 1, 2, 3]).map((indice, posicao) =>
      el(
        "button",
        {
          classe: "opcao-previa",
          atributos: { type: "button", "data-indice": indice },
          aoClicar: () => responder(indice),
        },
        [
          el("span", { classe: "opcao-previa__letra", texto: LETRAS[posicao], atributos: { "aria-hidden": "true" } }),
          el("span", { texto: pergunta.alternativas[indice] }),
          el("span", { classe: "opcao-previa__estado" }),
        ]
      )
    );

    function responder(escolhida) {
      if (respondida) return;
      respondida = true;
      const acertou = escolhida === pergunta.correta;

      for (const botao of botoes) {
        const indice = Number(botao.dataset.indice);
        const estado = botao.querySelector(".opcao-previa__estado");
        botao.disabled = true;

        if (indice === pergunta.correta) {
          botao.dataset.estado = "correta";
          estado.replaceChildren(criarIcone("check", 20), el("span", { classe: "sr-only", texto: "Resposta correta" }));
        } else if (indice === escolhida) {
          botao.dataset.estado = "errada";
          estado.replaceChildren(criarIcone("x", 20), el("span", { classe: "sr-only", texto: "Sua resposta, incorreta" }));
        } else {
          botao.dataset.estado = "neutra";
        }
      }

      feedback.dataset.resultado = acertou ? "acerto" : "erro";
      feedback.replaceChildren(
        el("p", { classe: "carta-quiz__veredito", texto: acertou ? "Isso aí!" : "Quase!" }),
        el("p", { texto: pergunta.explicacao })
      );
    }

    carta.replaceChildren(
      el("div", { classe: "carta-quiz__topo" }, [
        el("span", { classe: "badge", texto: categoria?.nome ?? "Quiz" }),
        el("span", { classe: "rotulo", texto: "Prévia · não vale pontos" }),
      ]),
      el("p", { classe: "carta-quiz__pergunta", texto: pergunta.enunciado }),
      el("div", { classe: "carta-quiz__opcoes" }, botoes),
      feedback,
      el("div", { classe: "carta-quiz__rodape" }, [
        el("button", { classe: "botao botao--texto", texto: "Outra pergunta", atributos: { type: "button" }, aoClicar: montar }),
        el("a", {
          classe: "link-acao",
          atributos: { href: linkDeCategoria(base, pergunta.categoria) },
        }, [`Jogar ${categoria?.nome ?? "este tema"}`, criarIcone("arrow-right", 16)]),
      ])
    );
  }

  montar();
  return carta;
}

function criarPalco(base) {
  const decorativo = { "aria-hidden": "true" };
  return el("div", { classe: "palco", atributos: revelar(2) }, [
    el("div", { classe: "palco__formas", atributos: decorativo }, [
      el("span", { classe: "forma forma--circulo" }),
      el("span", { classe: "forma forma--quarto" }),
      el("span", { classe: "forma forma--sol" }),
      el("span", { classe: "forma forma--pontos" }),
    ]),
    el("div", { classe: "pilha" }, [
      el("span", { classe: "carta-fundo carta-fundo--1", atributos: decorativo }),
      el("span", { classe: "carta-fundo carta-fundo--2", atributos: decorativo }),
      criarPrevia(base),
    ]),
    el("span", { classe: "adesivo adesivo--pontos", texto: "+150 pts", atributos: decorativo }),
    el("span", { classe: "adesivo adesivo--combo", texto: "Combo ×3", atributos: decorativo }),
  ]);
}

function renderizarAbertura(ctx) {
  const { dados, novo, base } = ctx;
  const { nivel } = calcularNivel(dados.progresso.xp);
  const partidaAtiva = obterPartidaAtiva();

  const eyebrow = el("p", {
    classe: "rotulo",
    texto: novo
      ? `Quiz de conhecimentos gerais · ${CATEGORIAS.length} temas`
      : `${saudacaoPorHora()} · Nível ${nivel}`,
  });

  const titulo = novo
    ? el("h1", { classe: "abertura__titulo", atributos: revelar(0) }, [
        linha("Responda."),
        linha("Erre."),
        linha(el("span", { classe: "marca", texto: "Aprenda." })),
        linha("Repita."),
      ])
    : el("h1", { classe: "abertura__titulo abertura__titulo--compacto", atributos: revelar(0) }, [
        linha("De volta"),
        linha("ao jogo,"),
        linha(el("span", { classe: "marca", texto: `${dados.perfil.nome}.` })),
      ]);

  let descricao;
  if (novo) {
    descricao = `${formatarNumero(PERGUNTAS.length)} perguntas em ${CATEGORIAS.length} temas, do espaço ao Brasil. Toda resposta vem com uma explicação, para você aprender de verdade. Sem cadastro, no seu ritmo.`;
  } else {
    const faltam = obterEstadoDasMissoes(dados).filter((estado) => !estado.concluida).length;
    let frase = "Todas as missões de hoje estão concluídas.";
    if (partidaAtiva) {
      frase = `Sua partida está parada na pergunta ${partidaAtiva.indice + 1} de ${partidaAtiva.questoes.length}.`;
    } else if (faltam > 0) {
      frase = faltam === 1 ? "Falta 1 missão para fechar o dia." : `Faltam ${faltam} missões para fechar o dia.`;
    }
    descricao = `Você está no nível ${nivel}. ${frase}`;
  }

  // Ação principal: retomar > jogar de novo > começar
  let principal;
  if (partidaAtiva) {
    principal = el("a", { classe: "botao botao--primario botao--grande", atributos: { href: `${base}pages/jogo.html` } }, [
      criarIcone("play", 20),
      "Retomar partida",
    ]);
  } else if (!novo) {
    principal = el(
      "button",
      {
        classe: "botao botao--primario botao--grande",
        atributos: { type: "button" },
        aoClicar: (evento) => repetirUltimaPartida(ctx, evento.currentTarget),
      },
      [criarIcone("refresh", 20), "Jogar de novo"]
    );
  } else {
    principal = el("a", { classe: "botao botao--primario botao--grande", atributos: { href: `${base}pages/categorias.html` } }, [
      criarIcone("play", 20),
      "Jogar agora",
    ]);
  }

  const secundaria = el("a", {
    classe: "botao botao--contorno botao--grande",
    texto: novo ? "Como funciona" : "Escolher outro tema",
    atributos: { href: novo ? "#como-funciona" : `${base}pages/categorias.html` },
  });

  const acoes = [principal, secundaria];
  if (!novo) {
    acoes.push(
      el("button", {
        classe: "botao botao--texto",
        texto: "Alterar nome",
        atributos: { type: "button" },
        aoClicar: () =>
          abrirModalNome({
            nomeAtual: dados.perfil.nome,
            aoSalvar: () => {
              renderizarAbertura({ ...ctx, dados: obterDados() });
              iniciarRevelacao(porId("abertura"));
            },
          }),
      })
    );
  }

  const provas = novo
    ? [[formatarNumero(PERGUNTAS.length), "perguntas"], [CATEGORIAS.length, "temas"], [3, "níveis de dificuldade"]]
    : [[nivel, "nível"], [formatarNumero(dados.progresso.xp), "XP acumulado"], [`${taxaDeAcerto(dados)}%`, "de acerto"]];

  porId("abertura").replaceChildren(
    el("div", { classe: "container abertura__grade" }, [
      el("div", { classe: "abertura__texto" }, [
        eyebrow,
        titulo,
        el("p", { classe: "abertura__descricao", texto: descricao, atributos: revelar(1) }),
        el("div", { classe: "abertura__acoes", atributos: revelar(2) }, acoes),
        el(
          "div",
          { classe: "provas", atributos: revelar(3) },
          provas.map(([valor, rotulo]) =>
            el("div", {}, [
              el("p", { classe: "prova__valor", texto: String(valor) }),
              el("p", { classe: "prova__rotulo", texto: rotulo }),
            ])
          )
        ),
      ]),
      criarPalco(base),
    ])
  );
}

// ---------- Faixa de temas ----------
function renderizarFaixa() {
  const criarItens = () => CATEGORIAS.map((categoria) => el("span", { classe: "faixa__item", texto: categoria.nome }));
  // A lista aparece duas vezes para o movimento em laço ficar contínuo
  porId("faixa-temas").replaceChildren(el("div", { classe: "faixa__trilho" }, [...criarItens(), ...criarItens()]));
}

// ---------- Painel escuro ----------
function criarBlocoDesafio(ctx) {
  const implementado = MODOS_IMPLEMENTADOS.includes("diario");
  const concluido = desafioDiarioConcluidoHoje();

  let situacao;
  if (!implementado) {
    situacao = [
      el("span", { classe: "badge", texto: "Em breve" }),
      el("p", { classe: "texto-pequeno", texto: "O desafio diário está a caminho. Por enquanto, treine no modo clássico." }),
    ];
  } else if (concluido) {
    situacao = [
      el("span", { classe: "badge badge--sucesso" }, [criarIcone("check", 14), "Concluído hoje"]),
      el("p", { classe: "texto-pequeno", texto: "Volte amanhã para um novo desafio." }),
    ];
  } else {
    situacao = [
      el("a", { classe: "botao botao--amarelo", texto: "Aceitar desafio", atributos: { href: `${ctx.base}pages/jogo.html?modo=diario` } }),
    ];
  }

  return el("div", { classe: "desafio", atributos: revelar(1) }, [
    el("p", { classe: "rotulo", texto: "Desafio do dia" }),
    el("p", { classe: "desafio__data", texto: formatarDataLonga() }),
    el("h3", { classe: "desafio__titulo", texto: `${QUANTIDADE_DESAFIO_DIARIO} perguntas, as mesmas para todo mundo hoje` }),
    el("p", { classe: "texto-pequeno", texto: `Vale +${XP_DESAFIO_DIARIO} XP, uma vez por dia.` }),
    ...situacao,
  ]);
}

function criarBlocoNivel({ dados }) {
  const info = calcularNivel(dados.progresso.xp);
  const circunferencia = 2 * Math.PI * 54;
  const deslocamento = circunferencia * (1 - info.percentual / 100);

  // Só números calculados por nós entram neste HTML (nenhum dado do usuário)
  const anel = el("div", { classe: "anel" });
  anel.innerHTML =
    `<svg viewBox="0 0 128 128" aria-hidden="true" focusable="false">` +
    `<circle class="anel__trilho" cx="64" cy="64" r="54"/>` +
    `<circle class="anel__progresso" cx="64" cy="64" r="54" ` +
    `style="--circunferencia:${circunferencia.toFixed(2)};--deslocamento:${deslocamento.toFixed(2)}"/></svg>`;
  anel.append(
    el("div", { classe: "anel__centro" }, [
      el("span", { classe: "rotulo", texto: "Nível" }),
      el("strong", { classe: "anel__numero", texto: String(info.nivel), atributos: { "data-contar": info.nivel } }),
    ])
  );

  return el("div", { classe: "painel__bloco", atributos: revelar(0) }, [
    el("p", { classe: "rotulo", texto: "Seu nível" }),
    el("div", { classe: "nivel-bloco" }, [
      anel,
      el("div", {}, [
        el("p", { classe: "nivel-bloco__xp", texto: `${formatarNumero(info.xpNoNivel)} / ${formatarNumero(info.xpNecessario)} XP` }),
        el("p", { classe: "nivel-bloco__apoio", texto: `para o nível ${info.nivel + 1}` }),
        el("p", { classe: "nivel-bloco__apoio", texto: `${formatarNumero(dados.progresso.xp)} XP no total` }),
      ]),
    ]),
  ]);
}

/** Partidas por dia nos últimos 7 dias, a partir do histórico salvo. */
function criarBlocoSemana({ dados }) {
  const contagem = new Map();
  for (const partida of dados.historico) {
    const data = new Date(partida.data);
    if (Number.isNaN(data.getTime())) continue;
    const chave = dataLocalISO(data);
    contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
  }

  const dias = Array.from({ length: 7 }, (_, indice) => {
    const data = new Date();
    data.setDate(data.getDate() - (6 - indice));
    return { data, quantidade: contagem.get(dataLocalISO(data)) ?? 0 };
  });
  const maximo = Math.max(1, ...dias.map((dia) => dia.quantidade));
  const total = dias.reduce((soma, dia) => soma + dia.quantidade, 0);

  const colunas = dias.map((dia, indice) => {
    const barra = el("span", { classe: "semana__barra" });
    barra.style.setProperty("--altura", `${Math.max(8, (dia.quantidade / maximo) * 100)}%`);
    if (dia.quantidade === 0) barra.dataset.vazio = "";

    return el(
      "li",
      {
        classe: `semana__dia${indice === 6 ? " semana__dia--hoje" : ""}`,
        atributos: {
          "aria-label": `${dia.data.toLocaleDateString("pt-BR", { weekday: "long" })}: ${dia.quantidade} ${dia.quantidade === 1 ? "partida" : "partidas"}`,
        },
      },
      [barra, el("span", { classe: "semana__letra", texto: dia.data.toLocaleDateString("pt-BR", { weekday: "narrow" }).toUpperCase() })]
    );
  });

  return el("div", { classe: "painel__bloco", atributos: revelar(2) }, [
    el("p", { classe: "rotulo", texto: "Sua semana" }),
    el("p", { classe: "painel__titulo", texto: total === 0 ? "Nenhuma partida nos últimos 7 dias" : `${total} ${total === 1 ? "partida" : "partidas"} nos últimos 7 dias` }),
    el("ol", { classe: "semana" }, colunas),
  ]);
}

function criarBlocoPassos() {
  const passos = [
    ["01", "Escolha um assunto","Vinte e três temas, três dificuldades e o tamanho de partida que couber no seu tempo."],
    ["02", "Responda e aprenda", "Acertando ou errando, toda resposta mostra a explicação logo em seguida."],
    ["03", "Suba de nível", "Pontos viram XP. XP vira nível, missões cumpridas e conquistas."],
  ];

  return el("div", { classe: "painel__bloco", atributos: { id: "como-funciona", ...revelar(0) } }, [
    el("p", { classe: "rotulo", texto: "Como funciona" }),
    el("h2", { classe: "painel__titulo", texto: "Três passos, nenhum cadastro." }),
    el(
      "ol",
      { classe: "passos" },
      passos.map(([numero, titulo, texto]) =>
        el("li", {}, [
          el("p", { classe: "passo__num", texto: numero, atributos: { "aria-hidden": "true" } }),
          el("h3", { classe: "passo__titulo", texto: titulo }),
          el("p", { classe: "passo__texto", texto }),
        ])
      )
    ),
  ]);
}

function renderizarPainel(ctx) {
  const blocos = ctx.novo
    ? [criarBlocoPassos(), criarBlocoDesafio(ctx)]
    : [criarBlocoNivel(ctx), criarBlocoDesafio(ctx), criarBlocoSemana(ctx)];

  porId("painel").replaceChildren(
    el("div", { classe: `container painel__grade${ctx.novo ? " painel__grade--novo" : ""}` }, blocos)
  );
}

// ---------- Temas ----------
function criarTema({ categoria, formato, total, estatistica, base }) {
  const partidas = Number(estatistica?.partidas) || 0;
  const meta = partidas === 0 ? "Tema novo" : `${partidas} ${partidas === 1 ? "partida" : "partidas"} · melhor ${formatarNumero(Number(estatistica.melhorPontuacao) || 0)} pts`;

  return el(
    "a",
    {
      classe: `tema tema--${formato.tamanho} tema--${formato.tema}`,
      atributos: { href: `${base}pages/categorias.html?categoria=${encodeURIComponent(categoria.id)}`, ...revelar(0) },
    },
    [
      criarCapa(base, categoria),
      el("span", { classe: "tema__glifo", atributos: { "aria-hidden": "true" } }, [criarIcone(categoria.icone, formato.icone)]),
      el("span", { classe: "tema__glifo", atributos: { "aria-hidden": "true" } }, [criarIcone(categoria.icone, formato.icone)]),
      el("div", { classe: "tema__topo" }, [el("span", { classe: "rotulo", texto: `${String(total).padStart(2, "0")} perguntas` })]),
      el("div", {}, [
        el("h3", { classe: "tema__nome", texto: categoria.nome }),
        el("p", { classe: "tema__descricao", texto: categoria.descricao }),
      ]),
      el("div", { classe: "tema__rodape" }, [
        el("span", { classe: "tema__meta", texto: meta }),
        el("span", { classe: "tema__seta" }, [criarIcone("arrow-right", 20)]),
      ]),
    ]
  );
}

function renderizarCategorias(ctx) {
  const { dados, base, novo } = ctx;
  const contagem = contarPerguntasPorCategoria();
  const ordenadas = ordenarPorInteresse(dados);
  const jogouAlgo = Object.values(dados.estatisticas.perguntasPorCategoria).some((valor) => valor > 0);

  const destaque = ordenadas.slice(0, FORMATOS_DO_MOSAICO.length).map((categoria, indice) =>
    criarTema({
      categoria,
      formato: FORMATOS_DO_MOSAICO[indice],
      total: contagem[categoria.id] ?? 0,
      estatistica: dados.estatisticas.porCategoria[categoria.id],
      base,
    })
  );

  const demais = ordenadas.slice(FORMATOS_DO_MOSAICO.length).map((categoria) =>
    el("a", { classe: "pilula-tema", atributos: { href: `${base}pages/categorias.html?categoria=${encodeURIComponent(categoria.id)}` } }, [
      criarIcone(categoria.icone, 18),
      categoria.nome,
      el("span", { classe: "rotulo", texto: String(contagem[categoria.id] ?? 0) }),
    ])
  );

  const sugerida = recomendarCategoria(dados);
  const respondidasDaSugerida = dados.estatisticas.perguntasPorCategoria[sugerida.id] || 0;
  let convite = `Sem ideia por onde começar? ${sugerida.nome} é um bom aquecimento.`;
  if (!novo) {
    convite = respondidasDaSugerida === 0
      ? `Você ainda não respondeu nada de ${sugerida.nome}.`
      : `${sugerida.nome} é o tema que você menos explorou.`;
  }

  porId("categorias").replaceChildren(
    el("div", { classe: "container" }, [
      el("div", { classe: "secao__topo", atributos: revelar(0) }, [
        el("div", {}, [
          el("p", { classe: "rotulo", texto: novo || !jogouAlgo ? "Em alta" : "Mais jogados por você" }),
          el("h2", { classe: "titulo-secao", texto: "Escolha o seu assunto", atributos: { id: "categorias-titulo" } }),
          el("p", { classe: "secao__apoio", texto: "Cada tema tem perguntas fáceis, médias e difíceis, todas com explicação." }),
        ]),
        el("a", { classe: "botao botao--contorno", atributos: { href: `${base}pages/categorias.html` } }, ["Ver todos os temas", criarIcone("arrow-right", 18)]),
      ]),
      el("div", { classe: "mosaico" }, destaque),
      el("div", { classe: "pilulas", atributos: revelar(1) }, demais),
      el("div", { classe: "descoberta", atributos: revelar(1) }, [
        el("div", { classe: "descoberta__texto" }, [
          el("p", { classe: "rotulo", texto: "Descubra algo novo" }),
          el("h3", { classe: "descoberta__titulo", texto: convite }),
        ]),
        el("div", { classe: "descoberta__acoes" }, [
          el("a", { classe: "botao botao--primario", texto: "Experimentar", atributos: { href: linkDeCategoria(base, sugerida.id) } }),
          el("button", {
            classe: "botao botao--contorno",
            atributos: { type: "button" },
            aoClicar: () => abrirRoleta({ base }),
          }, [criarIcone("sparkles", 18), "Girar a roleta"]),
        ]),
      ]),
    ])
  );
}

// ---------- Modos ----------
function renderizarModos(ctx) {
  const itens = MODOS.map((modo, indice) => {
    const visual = VISUAL_DOS_MODOS[modo.id] ?? { icone: "star", regra: modo.descricao };
    const disponivel = MODOS_IMPLEMENTADOS.includes(modo.id);

    const conteudo = [
      el("span", { classe: "modo__num", texto: String(indice + 1).padStart(2, "0") }),
      el("div", { classe: "modo__titulo" }, [criarIcone(visual.icone, 26), el("h3", { classe: "modo__nome", texto: modo.nome })]),
      el("p", { classe: "modo__regra", texto: visual.regra }),
      disponivel
        ? el("span", { classe: "modo__acao" }, [criarIcone("arrow-right", 20)])
        : el("span", { classe: "badge", texto: "Em breve" }),
    ];

    const faixa = disponivel
      ? el("a", { classe: "modo modo--ativo", atributos: { href: `${ctx.base}pages/categorias.html?modo=${modo.id}` } }, conteudo)
      : el("div", { classe: "modo modo--bloqueado" }, conteudo);

    return el("li", { atributos: revelar(indice) }, [faixa]);
  });

  porId("modos").replaceChildren(
    el("div", { classe: "container" }, [
      el("div", { classe: "secao__topo", atributos: revelar(0) }, [
        el("div", {}, [
          el("p", { classe: "rotulo", texto: "Modos de jogo" }),
          el("h2", { classe: "titulo-secao", texto: "Cinco jeitos de jogar", atributos: { id: "modos-titulo" } }),
          el("p", { classe: "secao__apoio", texto: "Cada modo tem regras próprias. Escolha o que combina com o seu momento." }),
        ]),
      ]),
      el("ol", { classe: "modos" }, itens),
    ])
  );
}

// ---------- Recompensas ----------
function criarBlocoMissoes(ctx) {
  const estados = obterEstadoDasMissoes(ctx.dados);

  return el("div", { classe: "bloco-recompensa", atributos: revelar(0) }, [
    el("p", { classe: "rotulo", texto: "Missões de hoje · renovam à meia-noite" }),
    el("h3", { classe: "bloco-recompensa__titulo", texto: "Próximos passos" }),
    el(
      "ul",
      { classe: "missoes" },
      estados.map((estado) =>
        el("li", { classe: `missao-linha${estado.concluida ? " missao-linha--feita" : ""}` }, [
          el("span", { classe: "missao-linha__marca" }, [estado.concluida ? criarIcone("check", 16) : null]),
          el("div", { classe: "missao-linha__corpo" }, [
            el("p", { classe: "missao-linha__titulo", texto: estado.missao.titulo }),
            criarBarraProgresso({
              percentual: (estado.atual / estado.missao.meta) * 100,
              rotulo: estado.missao.titulo,
              completo: estado.concluida,
            }),
          ]),
          el("span", { classe: "missao-linha__xp", texto: estado.concluida ? "FEITA" : `+${estado.missao.xp} XP` }),
        ])
      )
    ),
  ]);
}

function criarBlocoConquistas(ctx) {
  const avaliadas = CONQUISTAS.map((conquista) => ({
    conquista,
    data: ctx.dados.conquistas[conquista.id] ?? null,
    avaliacao: avaliarConquista(conquista, ctx.dados),
  }));
  const desbloqueadas = avaliadas
    .filter((item) => item.data)
    .sort((a, b) => new Date(b.data) - new Date(a.data));
  const bloqueadas = avaliadas
    .filter((item) => !item.data)
    .sort((a, b) => b.avaliacao.atual / b.avaliacao.meta - a.avaliacao.atual / a.avaliacao.meta);

  const vitrine = [...desbloqueadas, ...bloqueadas].slice(0, 6);
  const proxima = bloqueadas[0] ?? null;

  const filhos = [
    el("p", { classe: "rotulo", texto: `${desbloqueadas.length} de ${CONQUISTAS.length} desbloqueadas` }),
    el("h3", { classe: "bloco-recompensa__titulo", texto: "Conquistas" }),
    el(
      "ul",
      { classe: "emblemas" },
      vitrine.map((item) =>
        el("li", { classe: `emblema${item.data ? " emblema--ativo" : ""}` }, [
          el("span", { classe: "emblema__medalha" }, [criarIcone(item.data ? item.conquista.icone : "lock", 30)]),
          el("span", { classe: "emblema__nome", texto: item.conquista.titulo }),
          item.data ? null : el("span", { classe: "sr-only", texto: "Bloqueada" }),
        ])
      )
    ),
  ];

  if (proxima) {
    filhos.push(
      el("div", { classe: "proxima" }, [
        el("p", { classe: "rotulo", texto: "Mais perto de desbloquear" }),
        el("p", { classe: "proxima__titulo", texto: `${proxima.conquista.titulo}: ${proxima.conquista.descricao}` }),
        criarBarraProgresso({ percentual: (proxima.avaliacao.atual / proxima.avaliacao.meta) * 100, rotulo: proxima.conquista.titulo }),
        el("p", { classe: "texto-pequeno texto-suave", texto: `${formatarNumero(proxima.avaliacao.atual)} de ${formatarNumero(proxima.avaliacao.meta)}` }),
      ])
    );
  }

  filhos.push(
    el("a", { classe: "link-acao", atributos: { href: `${ctx.base}pages/conquistas.html`, style: "margin-top:1.25rem" } }, ["Ver todas", criarIcone("arrow-right", 16)])
  );

  return el("div", { classe: "bloco-recompensa", atributos: revelar(1) }, filhos);
}

function renderizarRecompensas(ctx) {
  porId("recompensas").replaceChildren(
    el("div", { classe: "container" }, [
      el("div", { classe: "secao__topo", atributos: revelar(0) }, [
        el("div", {}, [
          el("p", { classe: "rotulo", texto: "Progressão" }),
          el("h2", { classe: "titulo-secao", texto: "Sempre tem o que buscar", atributos: { id: "recompensas-titulo" } }),
        ]),
      ]),
      el("div", { classe: "recompensas" }, [criarBlocoMissoes(ctx), criarBlocoConquistas(ctx)]),
    ])
  );
}

// ---------- História (só quem já jogou) ----------
function renderizarHistoria(ctx) {
  const alvo = porId("historia");
  if (ctx.novo) {
    alvo.hidden = true;
    return;
  }
  alvo.hidden = false;

  const { partidas, perguntasRespondidas, acertos, melhorPontuacao } = ctx.dados.estatisticas;
  const taxa = taxaDeAcerto(ctx.dados);

  const numeros = [
    [partidas, "partidas concluídas", ""],
    [perguntasRespondidas, "perguntas respondidas", ""],
    [taxa, "de acerto", "%"],
    [melhorPontuacao, "pontos no seu melhor jogo", ""],
  ];

  alvo.replaceChildren(
    el("div", { classe: "container historia__grade" }, [
      el("div", {}, [
        el("p", { classe: "rotulo", texto: "Sua história até aqui" }),
        el("h2", { classe: "titulo-secao", texto: "Cada resposta conta", atributos: { id: "historia-titulo" } }),
        el("p", {
          classe: "historia__frase",
          texto: `Você respondeu ${formatarNumero(perguntasRespondidas)} perguntas em ${formatarNumero(partidas)} ${partidas === 1 ? "partida" : "partidas"} e acertou ${formatarNumero(acertos)}.`,
        }),
        el(
          "div",
          { classe: "historia__numeros" },
          numeros.map(([valor, rotulo, sufixo]) =>
            el("div", {}, [
              el("p", {
                classe: "numero-grande",
                texto: `${formatarNumero(valor)}${sufixo}`,
                atributos: { "data-contar": valor, "data-sufixo": sufixo },
              }),
              el("p", { classe: "numero-rotulo", texto: rotulo }),
            ])
          )
        ),
      ]),
      el("div", { classe: "historia__recentes", atributos: revelar(1) }, [
        el("div", { classe: "card__cabecalho card__cabecalho--espacado" }, [
          el("h3", { classe: "card__titulo", texto: "Últimas partidas" }),
          el("a", { classe: "link-acao", texto: "Ver perfil", atributos: { href: `${ctx.base}pages/perfil.html` } }),
        ]),
        el("ul", { classe: "lista" }, ctx.dados.historico.slice(0, 3).map(criarItemHistorico)),
      ]),
    ])
  );
}

// ---------- Chamada final ----------
function renderizarChamadaFinal(ctx) {
  porId("chamada-final").replaceChildren(
    el("div", { classe: "container chamada__grade" }, [
      el("h2", { classe: "chamada__titulo", texto: ctx.novo ? "Pronto para a primeira pergunta?" : "Mais uma rodada?", atributos: revelar(0) }),
      el("a", { classe: "botao botao--amarelo botao--grande", atributos: { href: `${ctx.base}pages/categorias.html`, ...revelar(1) } }, [
        criarIcone("play", 20),
        "Jogar agora",
      ]),
    ])
  );
}

/** Chamada pelo app.js quando a página inicial é carregada. */
export function iniciar({ base }) {
  const dados = obterDados();
  const ctx = { base, dados, novo: dados.estatisticas.partidas === 0 };

  renderizarAbertura(ctx);
  renderizarFaixa();
  renderizarPainel(ctx);
  renderizarCategorias(ctx);
  renderizarModos(ctx);
  renderizarRecompensas(ctx);
  renderizarHistoria(ctx);
  renderizarChamadaFinal(ctx);
}