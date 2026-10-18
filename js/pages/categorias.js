import { criarElemento, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { CATEGORIAS, obterCategoriaPorId } from "../data/categorias.js";
import { MODOS } from "../data/modos.js";
import {
  CATEGORIA_TODAS,
  DIFICULDADE_MISTA,
  DIFICULDADES,
  PERGUNTAS,
  contarPerguntasPorCategoria,
  filtrarPerguntas,
} from "../data/perguntas.js";
import { obterDados } from "../services/storage.js";
import {
  MODOS_IMPLEMENTADOS,
  QUANTIDADES_PADRAO,
  calcularOpcoesDeQuantidade,
  criarPartida,
} from "../services/partida.js";
import { formatarNumero } from "../utils/formatacao.js";

const QUANTIDADE_PREFERIDA = 10;
const LIMITE_PARA_AVISO = 10;

/** Lê categoria, dificuldade e quantidade da URL (usado por "Alterar configurações"). */
function lerConfigInicial() {
  const parametros = new URLSearchParams(window.location.search);
  const categoria = parametros.get("categoria");
  const dificuldade = parametros.get("dificuldade");
  const quantidade = Number(parametros.get("quantidade"));

  const categoriaValida = categoria === CATEGORIA_TODAS || Boolean(obterCategoriaPorId(categoria));
  const dificuldadeValida =
    dificuldade === DIFICULDADE_MISTA || DIFICULDADES.some((item) => item.id === dificuldade);

  return {
    categoriaId: categoriaValida ? categoria : CATEGORIA_TODAS,
    dificuldade: dificuldadeValida ? dificuldade : DIFICULDADE_MISTA,
    quantidade: Number.isInteger(quantidade) && quantidade > 0 ? quantidade : null,
  };
}

/** Opção de rádio estilizada (o <input> real continua acessível por teclado). */
function criarOpcaoRadio({ nome, valor, marcado = false, desabilitado = false, compacta = false, classeConteudo = "", filhos = [] }) {
  const entrada = criarElemento("input", {
    classe: "opcao__input",
    atributos: { type: "radio", name: nome, value: valor, checked: marcado, disabled: desabilitado },
  });
  const conteudo = criarElemento("span", { classe: `opcao__conteudo ${classeConteudo}`.trim() }, filhos);
  return criarElemento("label", { classe: `opcao${compacta ? " opcao--compacta" : ""}` }, [entrada, conteudo]);
}

function criarConteudoCategoria({ icone, cor, nome, descricao, meta }) {
  return [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${cor}` }, [criarIcone(icone, 22)]),
    criarElemento("span", { classe: "opcao__titulo", texto: nome }),
    criarElemento("span", { classe: "opcao__descricao", texto: descricao }),
    criarElemento("span", { classe: "opcao__meta", texto: meta }),
  ];
}

function montarMeta(totalDePerguntas, estatistica) {
  const texto = `${totalDePerguntas} ${totalDePerguntas === 1 ? "pergunta" : "perguntas"}`;
  const partidas = Number(estatistica?.partidas) || 0;
  if (partidas === 0) return texto;
  return `${texto} · melhor: ${formatarNumero(Number(estatistica.melhorPontuacao) || 0)} pts`;
}

function renderizarCategorias(dados, categoriaSelecionada) {
  const contagem = contarPerguntasPorCategoria();
  const porCategoria = dados.estatisticas.porCategoria;

  const opcoes = [
    criarOpcaoRadio({
      nome: "categoria",
      valor: CATEGORIA_TODAS,
      marcado: categoriaSelecionada === CATEGORIA_TODAS,
      classeConteudo: "opcao__conteudo--categoria",
      filhos: criarConteudoCategoria({
        icone: "grid",
        cor: "roxo",
        nome: "Todas as categorias",
        descricao: "Perguntas misturadas de todos os temas.",
        meta: montarMeta(PERGUNTAS.length, porCategoria[CATEGORIA_TODAS]),
      }),
    }),
    ...CATEGORIAS.map((categoria) =>
      criarOpcaoRadio({
        nome: "categoria",
        valor: categoria.id,
        marcado: categoria.id === categoriaSelecionada,
        classeConteudo: "opcao__conteudo--categoria",
        filhos: criarConteudoCategoria({
          icone: categoria.icone,
          cor: categoria.cor,
          nome: categoria.nome,
          descricao: categoria.descricao,
          meta: montarMeta(contagem[categoria.id] ?? 0, porCategoria[categoria.id]),
        }),
      })
    ),
  ];

  porId("opcoes-categoria").replaceChildren(...opcoes);
}

function renderizarDificuldades(selecionada) {
  const itens = [{ id: DIFICULDADE_MISTA, nome: "Misto" }, ...DIFICULDADES];
  porId("opcoes-dificuldade").replaceChildren(
    ...itens.map((item) =>
      criarOpcaoRadio({
        nome: "dificuldade",
        valor: item.id,
        marcado: item.id === selecionada,
        compacta: true,
        filhos: [item.nome],
      })
    )
  );
}

function renderizarModos() {
  porId("opcoes-modo").replaceChildren(
    ...MODOS.map((modo) => {
      const disponivel = MODOS_IMPLEMENTADOS.includes(modo.id);
      return criarOpcaoRadio({
        nome: "modo",
        valor: modo.id,
        marcado: modo.id === "classico",
        desabilitado: !disponivel,
        filhos: [
          criarElemento("span", { classe: "opcao__titulo", texto: modo.nome }),
          criarElemento("span", { classe: "opcao__descricao", texto: modo.descricao }),
          disponivel ? null : criarElemento("span", { classe: "badge", texto: "Em breve" }),
        ],
      });
    })
  );
}

function renderizarQuantidades(opcoes, selecionada, disponiveis) {
  const alvo = porId("opcoes-quantidade");

  if (opcoes.length === 0) {
    alvo.replaceChildren(criarElemento("p", { classe: "campo__ajuda", texto: "Nenhuma pergunta nesta combinação." }));
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

/** Lê o que está marcado no formulário. */
function lerSelecao(formulario) {
  const dados = new FormData(formulario);
  return {
    categoriaId: dados.get("categoria"),
    dificuldade: dados.get("dificuldade"),
    modoId: dados.get("modo"),
    quantidade: Number(dados.get("quantidade")),
  };
}

function escolherQuantidadePadrao(opcoes) {
  if (opcoes.includes(QUANTIDADE_PREFERIDA)) return QUANTIDADE_PREFERIDA;
  return opcoes[opcoes.length - 1] ?? null;
}

/** Recalcula as quantidades possíveis quando categoria ou dificuldade mudam. */
function sincronizarQuantidades(formulario, preferida = null) {
  const { categoriaId, dificuldade, quantidade } = lerSelecao(formulario);
  const disponiveis = filtrarPerguntas({ categoriaId, dificuldade }).length;
  const opcoes = calcularOpcoesDeQuantidade(disponiveis);

  const desejada = preferida ?? quantidade;
  const selecionada = opcoes.includes(desejada) ? desejada : escolherQuantidadePadrao(opcoes);
  renderizarQuantidades(opcoes, selecionada, disponiveis);
}

function atualizarResumo(formulario) {
  const { categoriaId, dificuldade, quantidade } = lerSelecao(formulario);
  const disponiveis = filtrarPerguntas({ categoriaId, dificuldade }).length;
  const botao = porId("botao-iniciar");
  const alvo = porId("resumo-partida");

  if (disponiveis === 0 || !quantidade) {
    botao.disabled = true;
    alvo.replaceChildren(
      criarElemento("p", {
        classe: "resumo-partida__aviso",
        texto: "Não há perguntas para esta combinação. Escolha outra categoria ou dificuldade.",
      })
    );
    return;
  }

  botao.disabled = false;

  const nomeCategoria =
    categoriaId === CATEGORIA_TODAS ? "todas as categorias" : (obterCategoriaPorId(categoriaId)?.nome ?? "");
  const nomeDificuldade =
    dificuldade === DIFICULDADE_MISTA
      ? "dificuldade mista"
      : (DIFICULDADES.find((item) => item.id === dificuldade)?.nome.toLowerCase() ?? "");

  const itens = [
    criarElemento("p", {
      texto: `Você vai responder ${quantidade} ${quantidade === 1 ? "pergunta" : "perguntas"} de ${nomeCategoria}, em ${nomeDificuldade}.`,
    }),
    criarElemento("p", {
      classe: "texto-suave texto-pequeno",
      texto: `${disponiveis} ${disponiveis === 1 ? "pergunta disponível" : "perguntas disponíveis"} nesta combinação.`,
    }),
  ];

  if (disponiveis < LIMITE_PARA_AVISO) {
    itens.push(
      criarElemento("p", {
        classe: "resumo-partida__aviso",
        texto: `Esta combinação tem poucas perguntas. Para partidas mais longas, use "Misto" ou "Todas as categorias".`,
      })
    );
  }

  alvo.replaceChildren(...itens);
}

/** Chamada pelo app.js quando a página de categorias é carregada. */
export function iniciar({ base }) {
  const formulario = porId("form-partida");
  const inicial = lerConfigInicial();

  // A ordem importa: as quantidades dependem de categoria e dificuldade já renderizadas
  renderizarCategorias(obterDados(), inicial.categoriaId);
  renderizarDificuldades(inicial.dificuldade);
  renderizarModos();
  sincronizarQuantidades(formulario, inicial.quantidade);
  atualizarResumo(formulario);

  formulario.addEventListener("change", (evento) => {
    // Só recria as quantidades quando o que mudou foi categoria ou dificuldade
    if (evento.target.name !== "quantidade") sincronizarQuantidades(formulario);
    atualizarResumo(formulario);
    porId("erro-formulario").textContent = "";
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const { erro } = criarPartida(lerSelecao(formulario));
    if (erro) {
      porId("erro-formulario").textContent = erro;
      return;
    }

    porId("botao-iniciar").disabled = true;
    window.location.href = `${base}pages/jogo.html`;
  });

  // Ao voltar pelo botão do navegador, reativa o botão de iniciar
  window.addEventListener("pageshow", (evento) => {
    if (evento.persisted) atualizarResumo(formulario);
  });
}