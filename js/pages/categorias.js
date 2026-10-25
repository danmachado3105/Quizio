import { criarElemento as el, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { CATEGORIAS, GRUPOS, obterCategoriaPorId, resolverIdDaCategoria } from "../data/categorias.js";
import { MODOS, obterNomeDoModo } from "../data/modos.js";
import {
  CATEGORIA_TODAS,
  DIFICULDADE_MISTA,
  DIFICULDADES,
  PERGUNTAS,
  contarPerguntasPorCategoriaEDificuldade,
  filtrarPerguntas,
} from "../data/perguntas.js";
import { alternarFavorita, obterDados, obterFavoritas } from "../services/storage.js";
import {
  MODOS_IMPLEMENTADOS,
  QUANTIDADES_PADRAO,
  calcularOpcoesDeQuantidade,
  criarPartida,
  obterPartidaAtiva,
} from "../services/partida.js";
import { abrirRoleta } from "../components/roleta.js";
import { criarCapa } from "../utils/imagens.js";
import { embaralhar } from "../utils/sorteio.js";
import { formatarDataCurta, formatarNumero } from "../utils/formatacao.js";

/*
 * Página Explorar.
 *  - busca (temas e perguntas), filtros e ordenação
 *  - seções: Continue de onde parou, Favoritas, Em alta, Novidades, Todos os temas
 *  - com busca ou filtro ativo, as seções dão lugar a uma lista de resultados
 *  - gaveta de configuração da partida (bottom sheet no celular)
 *
 * Estado da tela fica no objeto "estado". Os filtros são botões criados uma
 * única vez e só atualizados (assim o foco do teclado nunca se perde).
 */

const QUANTIDADE_PREFERIDA = 10;
const LIMITE_PARA_AVISO = 10;
const ATRASO_DA_BUSCA_MS = 180;
const TAMANHO_MINIMO_BUSCA_EM_PERGUNTAS = 3;
const LIMITE_CONTINUE = 6;
const TOTAL_EM_ALTA = 5;

// Mesma ordem curada da home (ordem "Recomendadas")
const ORDEM_CURADA = [
  "ciencia-espaco", "historia", "filmes", "jogos", "brasil", "musica",
  "series", "animes", "geografia", "esportes", "tecnologia", "literatura",
  "natureza-animais", "conhecimentos-gerais", "arte-arquitetura", "comida-culinaria",
  "corpo-humano", "mitologia-lendas", "matematica-logica", "lingua-portuguesa",
  "economia-negocios", "datas-tradicoes", "invencoes-descobertas",
];
const POSICAO_CURADA = new Map(ORDEM_CURADA.map((id, indice) => [id, indice]));

const NOME_NO_PLURAL = { facil: "fáceis", medio: "médias", dificil: "difíceis" };
const NOME_NO_SINGULAR = { facil: "fácil", medio: "média", dificil: "difícil" };

const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';
const ELEMENTOS_DE_FUNDO = ["cabecalho", "conteudo", "rodape", "abas"];

const ZERO = { facil: 0, medio: 0, dificil: 0 };
const MATRIZ = contarPerguntasPorCategoriaEDificuldade();

// ---------- Estado do módulo ----------
let base = "";
let favoritas = [];
let historico = [];
let estatisticasPorTema = new Map();
let primeiraRenderizacao = true;
let gavetaAberta = false;
let elementoAnterior = null;
let regiaoDeAviso = null;
let temporizadorDaBusca = null;
let indiceDePerguntas = null;

const haystacks = new Map();
const chips = { grupos: [], dificuldades: [], extras: {} };
const estado = {
  busca: "",
  grupo: null,
  dificuldade: null,
  soFavoritas: false,
  soNovas: false,
  ordem: "recomendadas",
};

// ---------- Utilidades ----------
const plural = (numero, singular, varios) => `${formatarNumero(numero)} ${numero === 1 ? singular : varios}`;

/** Texto sem acento, sem pontuação e em minúsculas (para comparar buscas). */
function normalizar(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function somar(porDificuldade) {
  return porDificuldade.facil + porDificuldade.medio + porDificuldade.dificil;
}

function recortar(texto, limite = 28) {
  return texto.length > limite ? `${texto.slice(0, limite)}…` : texto;
}

function posicaoCurada(id) {
  return POSICAO_CURADA.get(id) ?? 999;
}

/** Avisa leitores de tela sem mexer no visual. */
function anunciar(texto) {
  if (!regiaoDeAviso) {
    regiaoDeAviso = el("p", { classe: "sr-only", atributos: { role: "status", "aria-live": "polite" } });
    document.body.append(regiaoDeAviso);
  }
  regiaoDeAviso.textContent = "";
  setTimeout(() => {
    regiaoDeAviso.textContent = texto;
  }, 60);
}

// ---------- Dados do jogador e do banco ----------
function consolidarEstatisticas(dados) {
  const mapa = new Map();
  const obter = (id) => {
    if (!mapa.has(id)) mapa.set(id, { partidas: 0, melhorPontuacao: 0, respondidas: 0 });
    return mapa.get(id);
  };

  // Ids antigos (ex.: "filmes-series") são somados ao tema atual
  for (const [chave, valor] of Object.entries(dados.estatisticas.porCategoria)) {
    const registro = obter(resolverIdDaCategoria(chave));
    registro.partidas += Number(valor?.partidas) || 0;
    registro.melhorPontuacao = Math.max(registro.melhorPontuacao, Number(valor?.melhorPontuacao) || 0);
  }
  for (const [chave, quantidade] of Object.entries(dados.estatisticas.perguntasPorCategoria)) {
    obter(resolverIdDaCategoria(chave)).respondidas += Number(quantidade) || 0;
  }
  return mapa;
}

function obterEstatisticaDoTema(id) {
  return estatisticasPorTema.get(id) ?? { partidas: 0, melhorPontuacao: 0, respondidas: 0 };
}

/** Perguntas de um tema (ou de todos) por dificuldade. */
function contarDoTema(categoriaId) {
  if (categoriaId === CATEGORIA_TODAS) {
    const soma = { facil: 0, medio: 0, dificil: 0 };
    for (const contagem of Object.values(MATRIZ)) {
      for (const dificuldade of Object.keys(soma)) soma[dificuldade] += contagem[dificuldade];
    }
    return { ...soma, total: somar(soma) };
  }
  const contagem = MATRIZ[categoriaId] ?? ZERO;
  return { ...contagem, total: somar(contagem) };
}

function textoDeProgresso(id) {
  const { partidas, melhorPontuacao } = obterEstatisticaDoTema(id);
  if (partidas === 0) return "Ainda não jogado";
  return `${plural(partidas, "partida", "partidas")} · melhor ${formatarNumero(melhorPontuacao)} pts`;
}

/** "20 perguntas" ou, com filtro de dificuldade, "7 perguntas fáceis". */
function descreverQuantidade(numero) {
  const base_ = plural(numero, "pergunta", "perguntas");
  if (!estado.dificuldade) return base_;
  const nome = numero === 1 ? NOME_NO_SINGULAR[estado.dificuldade] : NOME_NO_PLURAL[estado.dificuldade];
  return `${base_} ${nome}`;
}

// ---------- Busca ----------
function termosDaBusca() {
  return normalizar(estado.busca).split(" ").filter(Boolean);
}

function obterIndiceDePerguntas() {
  indiceDePerguntas ??= PERGUNTAS.map((pergunta) => ({
    categoria: pergunta.categoria,
    dificuldade: pergunta.dificuldade,
    // espaço no início: permite procurar o começo de uma palavra
    texto: ` ${normalizar(`${pergunta.enunciado} ${pergunta.alternativas.join(" ")} ${pergunta.explicacao}`)}`,
  }));
  return indiceDePerguntas;
}

/** { [categoriaId]: { facil, medio, dificil } } com as perguntas que casam com todos os termos. */
function contarPerguntasQueCasam(termos) {
  const resultado = {};
  for (const item of obterIndiceDePerguntas()) {
    if (!termos.every((termo) => item.texto.includes(` ${termo}`))) continue;
    resultado[item.categoria] ??= { facil: 0, medio: 0, dificil: 0 };
    resultado[item.categoria][item.dificuldade] += 1;
  }
  return resultado;
}

function criarItem(categoria, extras = {}) {
  return {
    categoria,
    casaTema: true,
    perguntasCasadas: 0,
    quantidade: contarDoTema(categoria.id).total,
    ...extras,
  };
}

function temFiltroDeLista() {
  return Boolean(estado.grupo || estado.dificuldade || estado.soFavoritas || estado.soNovas);
}

function temFiltroAtivo() {
  return Boolean(estado.busca) || temFiltroDeLista();
}

/** Aplica busca e filtros. Também devolve as contagens de dificuldade usadas nos chips. */
function calcularResultados() {
  const termos = termosDaBusca();
  const buscaEmPerguntas = termos.join("").length >= TAMANHO_MINIMO_BUSCA_EM_PERGUNTAS;
  const casamentos = buscaEmPerguntas ? contarPerguntasQueCasam(termos) : {};

  // Passo 1: tudo menos a dificuldade (os chips de dificuldade contam em cima disto)
  const candidatos = [];
  for (const categoria of CATEGORIAS) {
    if (estado.grupo && categoria.grupo !== estado.grupo) continue;
    if (estado.soFavoritas && !favoritas.includes(categoria.id)) continue;
    if (estado.soNovas && !categoria.novo) continue;

    const casaTema = termos.length === 0 || termos.every((termo) => haystacks.get(categoria.id).includes(termo));
    const porDificuldade = casamentos[categoria.id] ?? ZERO;
    if (!casaTema && somar(porDificuldade) === 0) continue;

    candidatos.push({ categoria, casaTema, porDificuldade });
  }

  const contagemDificuldade = { facil: 0, medio: 0, dificil: 0 };
  for (const { categoria } of candidatos) {
    const contagem = contarDoTema(categoria.id);
    for (const dificuldade of Object.keys(contagemDificuldade)) contagemDificuldade[dificuldade] += contagem[dificuldade];
  }

  // Passo 2: dificuldade escolhida
  const itens = [];
  for (const { categoria, casaTema, porDificuldade } of candidatos) {
    const contagem = contarDoTema(categoria.id);
    if (estado.dificuldade) {
      if (contagem[estado.dificuldade] === 0) continue;
      if (!casaTema && porDificuldade[estado.dificuldade] === 0) continue;
    }
    itens.push(
      criarItem(categoria, {
        casaTema,
        perguntasCasadas: estado.dificuldade ? porDificuldade[estado.dificuldade] : somar(porDificuldade),
        quantidade: estado.dificuldade ? contagem[estado.dificuldade] : contagem.total,
      })
    );
  }

  ordenar(itens, termos.length > 0);
  const totalDePerguntasCasadas = itens.reduce((soma, item) => soma + item.perguntasCasadas, 0);
  return { itens, contagemDificuldade, totalDePerguntasCasadas, buscaEmPerguntas };
}

function ordenar(itens, usarRelevancia) {
  const respondidas = (item) => obterEstatisticaDoTema(item.categoria.id).respondidas;
  const porNome = (a, b) => a.categoria.nome.localeCompare(b.categoria.nome, "pt-BR");
  const porCuradoria = (a, b) => posicaoCurada(a.categoria.id) - posicaoCurada(b.categoria.id);

  switch (estado.ordem) {
    case "az":
      return itens.sort(porNome);
    case "mais-perguntas":
      return itens.sort((a, b) => b.quantidade - a.quantidade || porNome(a, b));
    case "menos-jogadas":
      return itens.sort((a, b) => respondidas(a) - respondidas(b) || porCuradoria(a, b));
    default:
      if (usarRelevancia) {
        return itens.sort(
          (a, b) =>
            Number(b.casaTema) - Number(a.casaTema) ||
            b.perguntasCasadas - a.perguntasCasadas ||
            porCuradoria(a, b)
        );
      }
      return itens.sort(porCuradoria);
  }
}

// ---------- Cartas de tema ----------
const atributosRevelar = (posicao, animar) =>
  animar ? { "data-revelar": true, style: `--atraso:${Math.min(posicao, 8) * 60}ms` } : {};

const criarSeloNovo = () => el("span", { classe: "selo-novo", texto: "Novo" });

function criarBotaoFavorito(categoria) {
  const ativo = favoritas.includes(categoria.id);
  return el(
    "button",
    {
      classe: "tema__favorito",
      atributos: {
        type: "button",
        "aria-pressed": String(ativo),
        "aria-label": `Favoritar ${categoria.nome}`,
        "data-categoria": categoria.id,
      },
      aoClicar: (evento) => aoAlternarFavorita(categoria, evento.currentTarget),
    },
    [criarIcone("heart", 20)]
  );
}

function criarBotaoAbrir(categoria, classe, filhos) {
  return el(
    "button",
    {
      classe: `tema__abrir ${classe}`,
      atributos: {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-label": `Montar partida de ${categoria.nome}`,
      },
      aoClicar: () =>
        abrirGaveta({
          categoriaId: categoria.id,
          dificuldade: estado.dificuldade ?? DIFICULDADE_MISTA,
          quantidade: null,
          modoId: "classico",
        }),
    },
    filhos
  );
}

/** Foto de capa opcional. Se o arquivo não existir ou falhar, a carta volta ao visual sem foto. */
function criarFundoComCapa(categoria, cartao) {
  const capa = criarCapa(base, categoria);
  if (!capa) return null;

  const fundo = el("span", { classe: "tema__fundo", atributos: { "aria-hidden": "true" } }, [capa]);
  cartao.classList.add("tema--com-foto");
  capa.addEventListener(
    "error",
    () => {
      fundo.remove();
      cartao.classList.remove("tema--com-foto");
    },
    { once: true }
  );
  return fundo;
}

/** Carta grande do mosaico "Em alta". */
function criarCartaoDestaque({ categoria, quantidade, animar, posicao }) {
  const cartao = el("article", {
    classe: `tema tema-destaque tema--${categoria.cor}`,
    atributos: atributosRevelar(posicao, animar),
  });
  const fundo = criarFundoComCapa(categoria, cartao);

  const abrir = criarBotaoAbrir(categoria, "tema-destaque__abrir", [
    el("span", { classe: "tema-destaque__topo" }, [
      el("span", { classe: "tema__linha-meta" }, [
        el("span", { classe: "tema__meta", texto: descreverQuantidade(quantidade) }),
        categoria.novo ? criarSeloNovo() : null,
      ]),
      el("span", { classe: "tema__nome", texto: categoria.nome }),
      el("span", { classe: "tema__descricao", texto: categoria.descricao }),
    ]),
    el("span", { classe: "tema__linha-meta" }, [
      el("span", { classe: "tema__meta", texto: textoDeProgresso(categoria.id) }),
      criarIcone("arrow-right", 18),
    ]),
  ]);

  cartao.append(
    ...[
      fundo,
      el("span", { classe: "tema-destaque__glifo", atributos: { "aria-hidden": "true" } }, [criarIcone(categoria.icone, 128)]),
      abrir,
      criarBotaoFavorito(categoria),
    ].filter(Boolean)
  );
  return cartao;
}

/** Carta completa (Todos os temas e resultados), com a divisão por dificuldade. */
function criarCartaoTema({ categoria, quantidade, perguntasCasadas = 0, animar, posicao }) {
  const contagem = contarDoTema(categoria.id);
  const cartao = el("article", {
    classe: `tema tema-cartao tema-cartao--${categoria.cor}`,
    atributos: atributosRevelar(posicao, animar),
  });

  const topo = el("span", { classe: "tema-cartao__topo" });
  const fundo = criarFundoComCapa(categoria, cartao);
  if (fundo) topo.append(fundo);
  topo.append(
    el("span", { classe: "tema__medalhao", atributos: { "aria-hidden": "true" } }, [criarIcone(categoria.icone, 34)])
  );

  const divisao = el(
    "span",
    { classe: "divisao", atributos: { "aria-hidden": "true" } },
    DIFICULDADES.map((dificuldade) => {
      const parte = el("span", { classe: `divisao__parte divisao__parte--${dificuldade.id}` });
      parte.style.setProperty("--n", String(contagem[dificuldade.id]));
      return parte;
    })
  );
  const legenda = DIFICULDADES.map((dificuldade) => `${contagem[dificuldade.id]} ${NOME_NO_PLURAL[dificuldade.id]}`).join(" · ");

  const corpo = [
    el("span", { classe: "tema__linha-meta" }, [
      el("span", { classe: "tema__meta", texto: descreverQuantidade(quantidade) }),
      categoria.novo ? criarSeloNovo() : null,
    ]),
    el("span", { classe: "tema__nome", texto: categoria.nome }),
    el("span", { classe: "tema__descricao", texto: categoria.descricao }),
    el("span", {}, [divisao, el("span", { classe: "divisao__legenda", texto: legenda })]),
  ];
  if (perguntasCasadas > 0) {
    corpo.push(
      el("span", {
        classe: "tema__progresso",
        texto: `${plural(perguntasCasadas, "pergunta cita", "perguntas citam")} sua busca`,
      })
    );
  }
  corpo.push(
    el("span", { classe: "tema__progresso", texto: textoDeProgresso(categoria.id) }),
    el("span", { classe: "tema__acao" }, ["Montar partida", criarIcone("arrow-right", 16)])
  );

  cartao.append(
    criarBotaoAbrir(categoria, "tema-cartao__abrir", [topo, el("span", { classe: "tema-cartao__corpo" }, corpo)]),
    criarBotaoFavorito(categoria)
  );
  return cartao;
}

/** Carta pequena (Favoritas e Novidades). */
function criarCartaoCompacto({ categoria, animar, posicao }) {
  const cartao = el("article", {
    classe: "tema tema-compacto",
    atributos: atributosRevelar(posicao, animar),
  });

  cartao.append(
    criarBotaoAbrir(categoria, "tema-compacto__abrir", [
      el("span", { classe: `icone-caixa icone-caixa--${categoria.cor}`, atributos: { "aria-hidden": "true" } }, [
        criarIcone(categoria.icone, 26),
      ]),
      el("span", { classe: "tema-compacto__texto" }, [
        el("span", { classe: "tema__nome", texto: categoria.nome }),
        el("span", { classe: "tema__linha-meta" }, [
          el("span", { classe: "tema__meta", texto: plural(contarDoTema(categoria.id).total, "pergunta", "perguntas") }),
          categoria.novo ? criarSeloNovo() : null,
        ]),
      ]),
    ]),
    criarBotaoFavorito(categoria)
  );
  return cartao;
}

/** Carta da trilha "Continue de onde parou". */
function criarCartaoRetomar({ categoria, ultimaData, animar, posicao }) {
  const cartao = el("article", {
    classe: "tema tema-retomar",
    atributos: atributosRevelar(posicao, animar),
  });
  const data = formatarDataCurta(ultimaData);

  cartao.append(
    criarBotaoAbrir(categoria, "tema-retomar__abrir", [
      el("span", { classe: "tema-retomar__topo" }, [
        el("span", { classe: `icone-caixa icone-caixa--${categoria.cor}`, atributos: { "aria-hidden": "true" } }, [
          criarIcone(categoria.icone, 26),
        ]),
        el("span", { classe: "tema__nome", texto: categoria.nome }),
      ]),
      el("span", { classe: "tema__progresso", texto: data ? `Última partida em ${data}` : "Jogado recentemente" }),
      el("span", { classe: "tema__meta", texto: textoDeProgresso(categoria.id) }),
      el("span", { classe: "tema__acao" }, ["Jogar de novo", criarIcone("arrow-right", 16)]),
    ]),
    criarBotaoFavorito(categoria)
  );
  return cartao;
}

/** Carta de uma partida que ficou pela metade (leva direto para a tela de jogo). */
function criarCartaoPartidaAtiva(partida, animar) {
  const categoria = partida.config.categoriaId === CATEGORIA_TODAS ? null : obterCategoriaPorId(partida.config.categoriaId);
  const nome = categoria?.nome ?? "Todas as categorias";

  return el("div", { classe: "tema tema-retomar", atributos: atributosRevelar(0, animar) }, [
    el("a", { classe: "tema__abrir tema-retomar__abrir", atributos: { href: `${base}pages/jogo.html` } }, [
      el("span", { classe: "tema-retomar__topo" }, [
        el("span", { classe: `icone-caixa icone-caixa--${categoria?.cor ?? "roxo"}`, atributos: { "aria-hidden": "true" } }, [
          criarIcone(categoria?.icone ?? "grid", 26),
        ]),
        el("span", { classe: "tema__nome", texto: nome }),
      ]),
      el("span", {
        classe: "tema__progresso",
        texto: `Partida em andamento · pergunta ${partida.indice + 1} de ${partida.questoes.length}`,
      }),
      el("span", { classe: "tema__acao" }, ["Retomar partida", criarIcone("arrow-right", 16)]),
    ]),
  ]);
}

// ---------- Seções ----------
function renderizarContinue(animar) {
  const cartas = [];

  const partida = obterPartidaAtiva();
  if (partida) cartas.push(criarCartaoPartidaAtiva(partida, animar));

  const vistos = new Set();
  for (const registro of historico) {
    const categoria = obterCategoriaPorId(registro.categoriaId);
    if (!categoria || vistos.has(categoria.id)) continue;
    vistos.add(categoria.id);

    cartas.push(criarCartaoRetomar({ categoria, ultimaData: registro.data, animar, posicao: cartas.length }));
    if (vistos.size >= LIMITE_CONTINUE) break;
  }

  porId("secao-continue").hidden = cartas.length === 0;
  porId("lista-continue").replaceChildren(...cartas);
}

function renderizarFavoritas(animar) {
  const categorias = favoritas.map((id) => obterCategoriaPorId(id)).filter(Boolean);
  porId("secao-favoritas").hidden = categorias.length === 0;
  porId("lista-favoritas").replaceChildren(
    ...categorias.map((categoria, posicao) => criarCartaoCompacto({ categoria, animar, posicao }))
  );
}

function renderizarAlta(animar) {
  const respondidas = (categoria) => obterEstatisticaDoTema(categoria.id).respondidas;
  const jogouAlgo = CATEGORIAS.some((categoria) => respondidas(categoria) > 0);

  const escolhidas = [...CATEGORIAS]
    .sort((a, b) => respondidas(b) - respondidas(a) || posicaoCurada(a.id) - posicaoCurada(b.id))
    .slice(0, TOTAL_EM_ALTA);

  porId("rotulo-alta").textContent = jogouAlgo ? "Mais jogados por você" : "Em alta";
  porId("titulo-alta").textContent = jogouAlgo ? "O que você mais joga" : "Por onde começar";
  porId("apoio-alta").textContent = jogouAlgo
    ? "Os temas em que você mais respondeu perguntas."
    : "Uma seleção para entrar no clima.";

  porId("secao-alta").hidden = false;
  porId("lista-alta").replaceChildren(
    ...escolhidas.map((categoria, posicao) =>
      criarCartaoDestaque({ categoria, quantidade: contarDoTema(categoria.id).total, animar, posicao })
    )
  );
}

function renderizarNovidades(animar) {
  const novas = CATEGORIAS.filter((categoria) => categoria.novo);
  porId("secao-novidades").hidden = novas.length === 0;
  porId("lista-novidades").replaceChildren(
    ...novas.map((categoria, posicao) => criarCartaoCompacto({ categoria, animar, posicao }))
  );
}

function renderizarTodos(animar) {
  const itens = ordenar(CATEGORIAS.map((categoria) => criarItem(categoria)), false);
  porId("secao-todos").hidden = false;
  porId("lista-todos").replaceChildren(
    ...itens.map((item, posicao) => criarCartaoTema({ ...item, animar, posicao }))
  );
}

function renderizarSecoes(animar) {
  renderizarContinue(animar);
  renderizarFavoritas(animar);
  renderizarAlta(animar);
  renderizarNovidades(animar);
  renderizarTodos(animar);
}

function esconderSecoes() {
  for (const id of ["secao-continue", "secao-favoritas", "secao-alta", "secao-novidades", "secao-todos"]) {
    porId(id).hidden = true;
  }
}

function descreverVazio() {
  if (estado.soFavoritas && favoritas.length === 0) {
    return {
      titulo: "Você ainda não tem favoritas",
      texto: "Toque no coração de qualquer tema para guardá-lo aqui.",
      botao: "Ver todos os temas",
    };
  }
  if (estado.busca) {
    return {
      titulo: `Nada encontrado para “${recortar(estado.busca)}”`,
      texto: "Confira a grafia, tente uma palavra mais curta ou remova algum filtro.",
      botao: "Limpar busca e filtros",
    };
  }
  return {
    titulo: "Nenhum tema combina com esses filtros",
    texto: "Tente outra dificuldade ou outro grupo.",
    botao: "Limpar filtros",
  };
}

/** Redesenha a página de acordo com a busca e os filtros. */
function atualizar() {
  const resultados = calcularResultados();
  atualizarChips(resultados.contagemDificuldade);
  porId("filtros-limpar").hidden = !temFiltroDeLista();

  const animar = primeiraRenderizacao;
  primeiraRenderizacao = false;

  const resumo = porId("resumo-busca");
  const vazio = porId("estado-vazio");
  const secaoResultados = porId("secao-resultados");

  if (!temFiltroAtivo()) {
    vazio.hidden = true;
    secaoResultados.hidden = true;
    resumo.textContent = "";
    renderizarSecoes(animar);
    return;
  }

  esconderSecoes();

  if (resultados.itens.length === 0) {
    const descricao = descreverVazio();
    porId("vazio-titulo").textContent = descricao.titulo;
    porId("vazio-texto").textContent = descricao.texto;
    porId("vazio-limpar").textContent = descricao.botao;
    vazio.hidden = false;
    secaoResultados.hidden = true;
    resumo.textContent = "Nenhum tema encontrado";
    return;
  }

  vazio.hidden = true;
  secaoResultados.hidden = false;
  porId("titulo-resultados").textContent = estado.busca ? "Temas encontrados" : "Temas filtrados";
  porId("lista-resultados").replaceChildren(
    ...resultados.itens.map((item, posicao) => criarCartaoTema({ ...item, animar: false, posicao }))
  );

  let texto = plural(resultados.itens.length, "tema encontrado", "temas encontrados");
  if (resultados.buscaEmPerguntas && resultados.totalDePerguntasCasadas > 0) {
    texto += ` · ${plural(resultados.totalDePerguntasCasadas, "pergunta cita", "perguntas citam")} “${recortar(estado.busca)}”`;
  }
  resumo.textContent = texto;
}

// ---------- Filtros ----------
function criarChip({ rotulo, aoClicar, comContagem = false }) {
  const contagem = comContagem ? el("span", { classe: "chip__contagem", atributos: { "aria-hidden": "true" } }) : null;
  const leitor = comContagem ? el("span", { classe: "sr-only" }) : null;
  const botao = el(
    "button",
    { classe: "chip", atributos: { type: "button", "aria-pressed": "false" }, aoClicar },
    [rotulo, contagem, leitor]
  );
  return { botao, contagem, leitor };
}

const definirPressionado = (botao, pressionado) => botao.setAttribute("aria-pressed", String(pressionado));

function construirFiltros() {
  const grupos = [{ id: null, rotulo: "Todos" }, ...GRUPOS.map((grupo) => ({ id: grupo.id, rotulo: grupo.nome }))];
  porId("filtro-grupos").replaceChildren(
    ...grupos.map((item) => {
      const chip = criarChip({
        rotulo: item.rotulo,
        aoClicar: () => {
          estado.grupo = item.id === null || estado.grupo === item.id ? null : item.id;
          atualizar();
        },
      });
      chips.grupos.push({ id: item.id, ...chip });
      return chip.botao;
    })
  );

  const dificuldades = [{ id: null, nome: "Qualquer" }, ...DIFICULDADES];
  porId("filtro-dificuldades").replaceChildren(
    ...dificuldades.map((item) => {
      const chip = criarChip({
        rotulo: item.nome,
        comContagem: item.id !== null,
        aoClicar: () => {
          estado.dificuldade = item.id === null || estado.dificuldade === item.id ? null : item.id;
          atualizar();
        },
      });
      chips.dificuldades.push({ id: item.id, ...chip });
      return chip.botao;
    })
  );

  const chipFavoritas = criarChip({
    rotulo: "Favoritas",
    comContagem: true,
    aoClicar: () => {
      estado.soFavoritas = !estado.soFavoritas;
      atualizar();
    },
  });
  const chipNovas = criarChip({
    rotulo: "Novas",
    aoClicar: () => {
      estado.soNovas = !estado.soNovas;
      atualizar();
    },
  });
  chips.extras = { favoritas: chipFavoritas, novas: chipNovas };
  porId("filtro-extras").replaceChildren(chipFavoritas.botao, chipNovas.botao);
}

function atualizarContagemDeFavoritas() {
  const { contagem, leitor } = chips.extras.favoritas;
  contagem.textContent = String(favoritas.length);
  leitor.textContent = `, ${plural(favoritas.length, "tema", "temas")}`;
}

/** Atualiza os chips que já existem (sem recriá-los, para o foco não se perder). */
function atualizarChips(contagemDificuldade) {
  for (const ref of chips.grupos) definirPressionado(ref.botao, ref.id === estado.grupo);

  for (const ref of chips.dificuldades) {
    const pressionado = ref.id === estado.dificuldade;
    definirPressionado(ref.botao, pressionado);

    if (ref.id) {
      const quantidade = contagemDificuldade[ref.id];
      ref.contagem.textContent = formatarNumero(quantidade);
      ref.leitor.textContent = `, ${plural(quantidade, "pergunta", "perguntas")}`;
      ref.botao.disabled = quantidade === 0 && !pressionado;
    }
  }

  definirPressionado(chips.extras.favoritas.botao, estado.soFavoritas);
  definirPressionado(chips.extras.novas.botao, estado.soNovas);
  atualizarContagemDeFavoritas();
}

function limparFiltros() {
  estado.grupo = null;
  estado.dificuldade = null;
  estado.soFavoritas = false;
  estado.soNovas = false;
}

// ---------- Favoritos ----------
function sincronizarBotoesDeFavorito(categoriaId, ativo) {
  document
    .querySelectorAll(`.tema__favorito[data-categoria="${categoriaId}"]`)
    .forEach((botao) => definirPressionado(botao, ativo));
}

function devolverFoco(categoriaId) {
  const alvo = document.querySelector(`.tema__favorito[data-categoria="${categoriaId}"]`) ?? porId("campo-busca");
  alvo.focus();
}

function aoAlternarFavorita(categoria, botao) {
  const resposta = alternarFavorita(categoria.id);
  if (!resposta.sucesso) return;

  favoritas = obterFavoritas();
  sincronizarBotoesDeFavorito(categoria.id, resposta.favorita);
  anunciar(`${categoria.nome} ${resposta.favorita ? "adicionado às favoritas" : "removido das favoritas"}.`);

  if (temFiltroAtivo() && estado.soFavoritas) {
    atualizar();
  } else {
    if (!temFiltroAtivo()) renderizarFavoritas(false);
    atualizarContagemDeFavoritas();
  }

  // A carta clicada pode ter saído da tela (ex.: desfavoritar dentro de "Favoritas")
  if (!botao.isConnected) devolverFoco(categoria.id);
}

// ---------- Gaveta de configuração ----------
function criarOpcaoRadio({ nome, valor, marcado = false, desabilitado = false, compacta = false, classeConteudo = "", filhos = [] }) {
  const entrada = el("input", {
    classe: "opcao__input",
    atributos: { type: "radio", name: nome, value: valor, checked: marcado, disabled: desabilitado },
  });
  const conteudo = el("span", { classe: `opcao__conteudo ${classeConteudo}`.trim() }, filhos);
  return el("label", { classe: `opcao${compacta ? " opcao--compacta" : ""}` }, [entrada, conteudo]);
}

/** Lê o que está marcado na gaveta. */
function lerSelecao() {
  const dados = new FormData(porId("form-partida"));
  return {
    categoriaId: dados.get("categoria"),
    dificuldade: dados.get("dificuldade"),
    modoId: dados.get("modo"),
    quantidade: Number(dados.get("quantidade")),
  };
}

function construirSelectDeCategorias() {
  const todas = el("option", { texto: "Todas as categorias", atributos: { value: CATEGORIA_TODAS } });
  const grupos = GRUPOS.map((grupo) =>
    el(
      "optgroup",
      { atributos: { label: grupo.nome } },
      CATEGORIAS.filter((categoria) => categoria.grupo === grupo.id).map((categoria) =>
        el("option", { texto: categoria.nome, atributos: { value: categoria.id } })
      )
    )
  );
  porId("select-categoria").replaceChildren(todas, ...grupos);
}

function atualizarEmblema(categoriaId) {
  const categoria = categoriaId === CATEGORIA_TODAS ? null : obterCategoriaPorId(categoriaId);
  const emblema = porId("gaveta-emblema");
  emblema.className = `icone-caixa icone-caixa--${categoria?.cor ?? "roxo"} campo-tema__emblema`;
  emblema.replaceChildren(criarIcone(categoria?.icone ?? "grid", 26));
}

function renderizarDificuldadesDaGaveta(categoriaId, selecionada) {
  const contagem = contarDoTema(categoriaId);
  const itens = [
    { id: DIFICULDADE_MISTA, nome: "Misto", quantidade: contagem.total },
    ...DIFICULDADES.map((dificuldade) => ({ id: dificuldade.id, nome: dificuldade.nome, quantidade: contagem[dificuldade.id] })),
  ];
  const valida = itens.some((item) => item.id === selecionada && item.quantidade > 0);
  const marcada = valida ? selecionada : DIFICULDADE_MISTA;

  porId("opcoes-dificuldade").replaceChildren(
    ...itens.map((item) =>
      criarOpcaoRadio({
        nome: "dificuldade",
        valor: item.id,
        marcado: item.id === marcada,
        desabilitado: item.quantidade === 0,
        compacta: true,
        filhos: [
          item.nome,
          el("span", { classe: "opcao__contagem", texto: String(item.quantidade), atributos: { "aria-hidden": "true" } }),
          el("span", { classe: "sr-only", texto: `, ${plural(item.quantidade, "pergunta", "perguntas")}` }),
        ],
      })
    )
  );
}

function renderizarModos(selecionado) {
  const modoMarcado = MODOS_IMPLEMENTADOS.includes(selecionado) ? selecionado : "classico";

  porId("opcoes-modo").replaceChildren(
    ...MODOS.map((modo) => {
      const disponivel = MODOS_IMPLEMENTADOS.includes(modo.id);
      return criarOpcaoRadio({
        nome: "modo",
        valor: modo.id,
        marcado: modo.id === modoMarcado,
        desabilitado: !disponivel,
        classeConteudo: "opcao__conteudo--marca",
        filhos: [
          el("span", { classe: "opcao__titulo", texto: modo.nome }),
          el("span", { classe: "opcao__descricao", texto: modo.descricao }),
          disponivel ? null : el("span", { classe: "badge", texto: "Em breve" }),
        ],
      });
    })
  );
}

function renderizarQuantidades(opcoes, selecionada, disponiveis) {
  const alvo = porId("opcoes-quantidade");

  if (opcoes.length === 0) {
    alvo.replaceChildren(el("p", { classe: "campo__ajuda", texto: "Nenhuma pergunta nesta combinação." }));
    return;
  }

  alvo.replaceChildren(
    ...opcoes.map((quantidade) => {
      const ehTodas = quantidade === disponiveis && !QUANTIDADES_PADRAO.includes(quantidade);
      return criarOpcaoRadio({
        nome: "quantidade",
        valor: String(quantidade),
        marcado: quantidade === selecionada,
        compacta: true,
        filhos: [ehTodas ? `Todas (${quantidade})` : String(quantidade)],
      });
    })
  );
}

function escolherQuantidadePadrao(opcoes) {
  if (opcoes.includes(QUANTIDADE_PREFERIDA)) return QUANTIDADE_PREFERIDA;
  return opcoes[opcoes.length - 1] ?? null;
}

/** Recalcula as quantidades possíveis quando categoria ou dificuldade mudam. */
function sincronizarQuantidades(preferida = null) {
  const { categoriaId, dificuldade, quantidade } = lerSelecao();
  const disponiveis = filtrarPerguntas({ categoriaId, dificuldade }).length;
  const opcoes = calcularOpcoesDeQuantidade(disponiveis);

  const desejada = preferida ?? quantidade;
  const selecionada = opcoes.includes(desejada) ? desejada : escolherQuantidadePadrao(opcoes);
  renderizarQuantidades(opcoes, selecionada, disponiveis);
}

function atualizarResumo() {
  const { categoriaId, dificuldade, quantidade, modoId } = lerSelecao();
  const disponiveis = filtrarPerguntas({ categoriaId, dificuldade }).length;
  const botao = porId("botao-iniciar");
  const alvo = porId("resumo-partida");

  if (disponiveis === 0 || !quantidade) {
    botao.disabled = true;
    alvo.replaceChildren(
      el("p", {
        classe: "resumo-partida__aviso",
        texto: "Não há perguntas para esta combinação. Escolha outro tema ou dificuldade.",
      })
    );
    return;
  }

  botao.disabled = false;

  const nomeCategoria =
    categoriaId === CATEGORIA_TODAS ? "todas as categorias" : (obterCategoriaPorId(categoriaId)?.nome ?? "");
  const nomeDificuldade =
    dificuldade === DIFICULDADE_MISTA
      ? "mista"
      : (NOME_NO_SINGULAR[dificuldade] ?? "");

  const itens = [
    el("p", {
      classe: "resumo-partida__frase",
      texto: `${plural(quantidade, "pergunta", "perguntas")} de ${nomeCategoria}, em dificuldade ${nomeDificuldade}.`,
    }),
    el("p", {
      classe: "texto-suave texto-pequeno",
      texto: `Modo ${obterNomeDoModo(modoId)} · ${plural(disponiveis, "pergunta disponível", "perguntas disponíveis")} nesta combinação.`,
    }),
  ];

  if (disponiveis < LIMITE_PARA_AVISO) {
    itens.push(
      el("p", {
        classe: "resumo-partida__aviso",
        texto: `Esta combinação tem só ${disponiveis} ${disponiveis === 1 ? "pergunta" : "perguntas"}. Para partidas mais longas, use "Misto" ou "Todas as categorias".`,
      })
    );
  }

  alvo.replaceChildren(...itens);
}

/** Preenche todos os campos da gaveta. A ordem importa: a quantidade depende de categoria e dificuldade. */
function preencherFormulario({ categoriaId, dificuldade, quantidade, modoId }) {
  porId("select-categoria").value = categoriaId;
  atualizarEmblema(categoriaId);
  renderizarDificuldadesDaGaveta(categoriaId, dificuldade);
  renderizarModos(modoId);
  sincronizarQuantidades(quantidade);
  atualizarResumo();
  porId("erro-formulario").textContent = "";
}

function definirFundoInerte(valor) {
  for (const id of ELEMENTOS_DE_FUNDO) {
    const elemento = porId(id);
    if (elemento) elemento.inert = valor;
  }
}

function limparParametrosDaUrl() {
  if (!window.location.search) return;
  try {
    window.history.replaceState(null, "", window.location.pathname);
  } catch (erro) {
    // sem history API, a URL simplesmente continua com os parâmetros
  }
}

/** Esc fecha a gaveta e Tab fica preso dentro dela. */
function tratarTecladoDaGaveta(evento) {
  if (!gavetaAberta) return;

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharGaveta();
    return;
  }
  if (evento.key !== "Tab") return;

  const focaveis = [...porId("gaveta").querySelectorAll(SELETOR_FOCAVEL)].filter((elemento) => !elemento.disabled);
  if (focaveis.length === 0) return;

  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];

  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
}

function abrirGaveta(config) {
  preencherFormulario(config);
  if (gavetaAberta) return;

  gavetaAberta = true;
  elementoAnterior = document.activeElement;

  const gaveta = porId("gaveta");
  gaveta.inert = false;
  definirFundoInerte(true);
  document.body.classList.add("gaveta-aberta");
  porId("gaveta-sobreposicao").classList.add("gaveta-sobreposicao--aberta");
  gaveta.classList.add("gaveta--aberta");
  gaveta.querySelector(".gaveta__corpo").scrollTop = 0;
  document.addEventListener("keydown", tratarTecladoDaGaveta);

  // O foco vai para o título: leitores de tela anunciam o painel sem abrir o seletor
  requestAnimationFrame(() => porId("gaveta-titulo").focus({ preventScroll: true }));
}

function fecharGaveta() {
  if (!gavetaAberta) return;
  gavetaAberta = false;

  const gaveta = porId("gaveta");
  gaveta.classList.remove("gaveta--aberta");
  gaveta.inert = true;
  porId("gaveta-sobreposicao").classList.remove("gaveta-sobreposicao--aberta");
  document.body.classList.remove("gaveta-aberta");
  definirFundoInerte(false);
  document.removeEventListener("keydown", tratarTecladoDaGaveta);
  limparParametrosDaUrl();

  const voltaPara =
    elementoAnterior && elementoAnterior.isConnected && elementoAnterior !== document.body
      ? elementoAnterior
      : porId("botao-surpreender");
  voltaPara.focus();
}

function ligarGaveta() {
  const formulario = porId("form-partida");
  porId("gaveta-titulo").tabIndex = -1;
  porId("gaveta-fechar").addEventListener("click", fecharGaveta);
  porId("gaveta-sobreposicao").addEventListener("click", fecharGaveta);

  formulario.addEventListener("change", (evento) => {
    const nome = evento.target.name;

    if (nome === "categoria") {
      const { categoriaId, dificuldade } = lerSelecao();
      atualizarEmblema(categoriaId);
      renderizarDificuldadesDaGaveta(categoriaId, dificuldade);
      sincronizarQuantidades();
    } else if (nome === "dificuldade") {
      sincronizarQuantidades();
    }

    atualizarResumo();
    porId("erro-formulario").textContent = "";
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const { erro } = criarPartida(lerSelecao());
    if (erro) {
      porId("erro-formulario").textContent = erro;
      return;
    }

    porId("botao-iniciar").disabled = true;
    window.location.href = `${base}pages/jogo.html`;
  });

  // Ao voltar pelo botão do navegador, reativa o botão de iniciar
  window.addEventListener("pageshow", (evento) => {
    if (evento.persisted && gavetaAberta) atualizarResumo();
  });
}

/** Lê categoria, dificuldade, quantidade e modo da URL (ex.: "Alterar configurações"). */
function lerConfigInicial() {
  const parametros = new URLSearchParams(window.location.search);

  const categoriaBruta = parametros.get("categoria");
  const categoriaId =
    categoriaBruta === CATEGORIA_TODAS ? CATEGORIA_TODAS : (obterCategoriaPorId(categoriaBruta)?.id ?? null);

  const dificuldadeBruta = parametros.get("dificuldade");
  const dificuldadeValida =
    dificuldadeBruta === DIFICULDADE_MISTA || DIFICULDADES.some((item) => item.id === dificuldadeBruta);

  const quantidade = Number(parametros.get("quantidade"));
  const quantidadeValida = Number.isInteger(quantidade) && quantidade > 0;

  const modo = parametros.get("modo");
  const modoValido = MODOS_IMPLEMENTADOS.includes(modo);

  if (!categoriaId && !dificuldadeValida && !quantidadeValida && !modoValido) return null;

  return {
    categoriaId: categoriaId ?? CATEGORIA_TODAS,
    dificuldade: dificuldadeValida ? dificuldadeBruta : DIFICULDADE_MISTA,
    quantidade: quantidadeValida ? quantidade : null,
    modoId: modoValido ? modo : "classico",
  };
}

// ---------- Busca e ações da abertura ----------
function atualizarBotaoLimparBusca() {
  porId("busca-limpar").hidden = porId("campo-busca").value === "";
}

function limparBusca() {
  clearTimeout(temporizadorDaBusca);
  porId("campo-busca").value = "";
  estado.busca = "";
  atualizarBotaoLimparBusca();
  atualizar();
}

function limparTudo() {
  limparFiltros();
  limparBusca();
}

function ligarBusca() {
  const campo = porId("campo-busca");

  campo.addEventListener("input", () => {
    atualizarBotaoLimparBusca();
    clearTimeout(temporizadorDaBusca);
    temporizadorDaBusca = setTimeout(() => {
      estado.busca = campo.value.trim();
      atualizar();
    }, ATRASO_DA_BUSCA_MS);
  });

  campo.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && campo.value) {
      evento.preventDefault();
      limparBusca();
    }
  });

  // Enter: com um único resultado, vai direto para a configuração dele
  porId("form-busca").addEventListener("submit", (evento) => {
    evento.preventDefault();
    clearTimeout(temporizadorDaBusca);
    estado.busca = campo.value.trim();
    atualizar();

    const { itens } = calcularResultados();
    if (estado.busca && itens.length === 1) {
      abrirGaveta({
        categoriaId: itens[0].categoria.id,
        dificuldade: estado.dificuldade ?? DIFICULDADE_MISTA,
        quantidade: null,
        modoId: "classico",
      });
    }
  });

  porId("busca-limpar").addEventListener("click", () => {
    limparBusca();
    campo.focus();
  });

  porId("ordenacao").addEventListener("change", (evento) => {
    estado.ordem = evento.target.value;
    atualizar();
  });

  porId("filtros-limpar").addEventListener("click", () => {
    limparFiltros();
    atualizar();
    chips.grupos[0].botao.focus();
  });

  porId("vazio-limpar").addEventListener("click", () => {
    limparTudo();
    campo.focus();
  });
}

/** Tema sorteado entre os que o jogador menos respondeu. */
function sortearTemaPoucoJogado() {
  const respondidas = (categoria) => obterEstatisticaDoTema(categoria.id).respondidas;
  const candidatos = embaralhar([...CATEGORIAS])
    .sort((a, b) => respondidas(a) - respondidas(b))
    .slice(0, 8);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

function ligarAcoes() {
  porId("botao-surpreender").addEventListener("click", () => {
    const tema = sortearTemaPoucoJogado();
    anunciar(`Tema sorteado: ${tema.nome}.`);
    abrirGaveta({ categoriaId: tema.id, dificuldade: DIFICULDADE_MISTA, quantidade: null, modoId: "classico" });
  });

  porId("botao-roleta").addEventListener("click", () => abrirRoleta({ base }));

  porId("botao-misturar").addEventListener("click", () =>
    abrirGaveta({ categoriaId: CATEGORIA_TODAS, dificuldade: DIFICULDADE_MISTA, quantidade: null, modoId: "classico" })
  );
}

/** Chamada pelo app.js quando a página de categorias é carregada. */
export function iniciar({ base: baseDaPagina }) {
  base = baseDaPagina;

  const dados = obterDados();
  favoritas = [...dados.favoritas];
  historico = dados.historico;
  estatisticasPorTema = consolidarEstatisticas(dados);

  for (const categoria of CATEGORIAS) {
    const nomeDoGrupo = GRUPOS.find((grupo) => grupo.id === categoria.grupo)?.nome ?? "";
    haystacks.set(
      categoria.id,
      normalizar(`${categoria.nome} ${categoria.descricao} ${(categoria.tags ?? []).join(" ")} ${nomeDoGrupo}`)
    );
  }

  porId("explorar-numeros").textContent =
    `${CATEGORIAS.length} temas · ${formatarNumero(PERGUNTAS.length)} perguntas · 3 dificuldades`;

  construirSelectDeCategorias();
  construirFiltros();
  ligarBusca();
  ligarAcoes();
  ligarGaveta();
  atualizar();

  const configInicial = lerConfigInicial();
  if (configInicial) abrirGaveta(configInicial);
}