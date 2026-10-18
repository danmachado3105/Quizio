import { criarElemento, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { CATEGORIAS } from "../data/categorias.js";
import { MISSOES } from "../data/missoes.js";
import { obterConquistaPorId } from "../data/conquistas.js";
import { atualizarDados, desafioDiarioConcluidoHoje, obterDados } from "../services/storage.js";
import { abrirModalNome } from "../components/modal.js";
import {
  criarBarraProgresso,
  criarCardCategoria,
  criarCardEstatistica,
  criarEstadoVazio,
  criarItemConquista,
  criarItemHistorico,
  criarItemMissao,
} from "../components/card.js";
import { calcularNivel, QUANTIDADE_DESAFIO_DIARIO, XP_DESAFIO_DIARIO } from "../utils/pontuacao.js";
import {
  formatarDataLonga,
  formatarNumero,
  formatarPercentual,
  saudacaoPorHora,
} from "../utils/formatacao.js";

const MAX_CONQUISTAS_RECENTES = 3;
const MAX_PARTIDAS_NO_HISTORICO = 5;

function renderizarSaudacao(dados) {
  porId("hero-saudacao").textContent = saudacaoPorHora();
  porId("hero-titulo").textContent = `Olá, ${dados.perfil.nome}!`;
}

function renderizarResumoNivel(dados) {
  const { nivel, xpNoNivel, xpNecessario, percentual } = calcularNivel(dados.progresso.xp);

  porId("resumo-nivel").replaceChildren(
    criarElemento("div", { classe: "nivel__topo" }, [
      criarElemento("span", { classe: "nivel__emblema", texto: String(nivel), atributos: { "aria-hidden": "true" } }),
      criarElemento("div", {}, [
        criarElemento("p", { classe: "nivel__rotulo", texto: "Seu progresso" }),
        criarElemento("p", { classe: "nivel__titulo", texto: `Nível ${nivel}` }),
      ]),
    ]),
    criarBarraProgresso({ percentual, rotulo: `Progresso para o nível ${nivel + 1}` }),
    criarElemento("p", {
      classe: "nivel__xp",
      texto: `${formatarNumero(xpNoNivel)} / ${formatarNumero(xpNecessario)} XP para o nível ${nivel + 1}`,
    }),
    criarElemento("p", { classe: "nivel__total", texto: `${formatarNumero(dados.progresso.xp)} XP no total` })
  );
}

function renderizarDesafioDiario(base) {
  const concluido = desafioDiarioConcluidoHoje();

  const selo = concluido
    ? criarElemento("span", { classe: "badge badge--sucesso" }, [criarIcone("check", 14), "Concluído hoje"])
    : criarElemento("span", { classe: "badge badge--destaque", texto: `+${XP_DESAFIO_DIARIO} XP` });

  const acao = concluido
    ? criarElemento("a", {
        classe: "botao botao--contorno",
        texto: "Explorar categorias",
        atributos: { href: `${base}pages/categorias.html` },
      })
    : criarElemento("a", {
        classe: "botao botao--coral",
        texto: "Aceitar desafio",
        atributos: { href: `${base}pages/jogo.html?modo=diario` },
      });

  const descricao = concluido
    ? "Você já concluiu o desafio de hoje. Um novo conjunto de perguntas chega amanhã."
    : `${QUANTIDADE_DESAFIO_DIARIO} perguntas escolhidas para hoje. A recompensa vale uma vez por dia.`;

  porId("desafio-diario").replaceChildren(
    criarElemento("div", { classe: "card__cabecalho card__cabecalho--espacado" }, [
      criarElemento("div", { classe: "card__cabecalho", atributos: { style: "margin-bottom:0" } }, [
        criarElemento("span", { classe: "icone-caixa icone-caixa--coral" }, [criarIcone("calendar", 24)]),
        criarElemento("div", {}, [
          criarElemento("h2", { classe: "card__titulo", texto: "Desafio diário", atributos: { id: "desafio-titulo" } }),
          criarElemento("p", { classe: "desafio__data texto-suave texto-pequeno", texto: formatarDataLonga() }),
        ]),
      ]),
      selo,
    ]),
    criarElemento("p", { classe: "desafio__descricao", texto: descricao }),
    acao
  );
}

function renderizarMissoes(dados) {
  const itens = MISSOES.map((missao) => criarItemMissao(missao, dados.missoes.progresso[missao.metrica]));
  porId("lista-missoes").replaceChildren(...itens);
}

function renderizarCategoriasEmDestaque(dados, base) {
  const cards = CATEGORIAS.filter((categoria) => categoria.destaque).map((categoria) =>
    criarCardCategoria(categoria, dados.estatisticas.porCategoria[categoria.id], base)
  );
  porId("categorias-destaque").replaceChildren(...cards);
}

function renderizarEstatisticas(dados) {
  const { partidas, perguntasRespondidas, acertos, melhorPontuacao } = dados.estatisticas;

  porId("estatisticas").replaceChildren(
    criarCardEstatistica({ icone: "flag", cor: "roxo", valor: formatarNumero(partidas), rotulo: "Partidas jogadas" }),
    criarCardEstatistica({ icone: "percent", cor: "verde", valor: formatarPercentual(acertos, perguntasRespondidas), rotulo: "Taxa de acerto" }),
    criarCardEstatistica({ icone: "trophy", cor: "amarelo", valor: formatarNumero(melhorPontuacao), rotulo: "Melhor pontuação" }),
    criarCardEstatistica({ icone: "zap", cor: "coral", valor: formatarNumero(perguntasRespondidas), rotulo: "Perguntas respondidas" })
  );
}

function renderizarConquistasRecentes(dados) {
  const recentes = Object.entries(dados.conquistas)
    .map(([id, data]) => ({ conquista: obterConquistaPorId(id), data }))
    .filter((item) => item.conquista)
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, MAX_CONQUISTAS_RECENTES);

  const alvo = porId("conquistas-recentes");

  if (recentes.length === 0) {
    alvo.replaceChildren(
      criarEstadoVazio({
        icone: "award",
        titulo: "Nenhuma conquista ainda",
        texto: "Complete sua primeira partida para desbloquear a primeira conquista.",
      })
    );
    return;
  }

  alvo.replaceChildren(
    criarElemento(
      "ul",
      { classe: "lista" },
      recentes.map((item) => criarItemConquista(item.conquista, item.data))
    )
  );
}

function renderizarHistorico(dados) {
  const alvo = porId("historico-partidas");
  const ultimas = dados.historico.slice(0, MAX_PARTIDAS_NO_HISTORICO);

  if (ultimas.length === 0) {
    alvo.replaceChildren(
      criarEstadoVazio({
        icone: "history",
        titulo: "Sem partidas por aqui",
        texto: "Suas últimas partidas vão aparecer aqui assim que você jogar.",
      })
    );
    return;
  }

  alvo.replaceChildren(
    criarElemento("ul", { classe: "lista" }, ultimas.map(criarItemHistorico))
  );
}

function configurarEdicaoDeNome() {
  porId("botao-editar-nome").addEventListener("click", () => {
    abrirModalNome({
      nomeAtual: obterDados().perfil.nome,
      aoSalvar: () => renderizarSaudacao(obterDados()),
    });
  });
}

/** Chamada pelo app.js quando a página inicial é carregada. */
export function iniciar({ base }) {
  const dados = obterDados();

  renderizarSaudacao(dados);
  renderizarResumoNivel(dados);
  renderizarDesafioDiario(base);
  renderizarMissoes(dados);
  renderizarCategoriasEmDestaque(dados, base);
  renderizarEstatisticas(dados);
  renderizarConquistasRecentes(dados);
  renderizarHistorico(dados);
  configurarEdicaoDeNome();

  // Na primeira visita, pede o nome uma única vez
  if (!dados.perfil.boasVindasExibida) {
    atualizarDados((d) => {
      d.perfil.boasVindasExibida = true;
    });
    abrirModalNome({
      nomeAtual: dados.perfil.nome,
      aoSalvar: () => renderizarSaudacao(obterDados()),
    });
  }
}