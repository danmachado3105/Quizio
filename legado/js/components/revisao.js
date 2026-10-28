import { criarElemento as el } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { obterPerguntaPorId } from "../data/perguntas.js";
import { criarEstadoVazio } from "./card.js";

/*
 * Revisão de respostas: cada pergunta com a sua resposta, a resposta certa
 * e a explicação. Usada no resultado e no desafio diário já concluído.
 * Estilos em css/revisao.css.
 *
 * respostas: [{ perguntaId, escolhida, acertou, motivo? }]
 *   escolhida = índice ORIGINAL da alternativa (null se pulou ou o tempo acabou)
 */
const SITUACOES = {
  acerto: { rotulo: "Acertou", icone: "check" },
  erro: { rotulo: "Errou", icone: "x" },
  pulou: { rotulo: "Pulou", icone: "arrow-right" },
  tempo: { rotulo: "Tempo esgotado", icone: "clock" },
};

function descobrirSituacao(resposta) {
  if (resposta.acertou) return "acerto";
  if (resposta.motivo === "pulou") return "pulou";
  if (resposta.motivo === "tempo") return "tempo";
  return "erro";
}

const criarLinha = (rotulo, texto) => el("div", {}, [el("dt", { texto: rotulo }), el("dd", { texto })]);

/** apenasErradas: mostra só as perguntas que o jogador não acertou. */
export function criarRevisao(respostas, { apenasErradas = false } = {}) {
  const itens = (respostas ?? [])
    .map((resposta, indice) => ({ resposta, numero: indice + 1, pergunta: obterPerguntaPorId(resposta.perguntaId) }))
    .filter((item) => item.pergunta && (!apenasErradas || !item.resposta.acertou));

  if (itens.length === 0) {
    return criarEstadoVazio({
      icone: "check",
      titulo: apenasErradas ? "Nenhum erro para revisar" : "Nada para revisar",
      texto: apenasErradas ? "Você acertou tudo nesta partida." : "As respostas desta partida não estão disponíveis.",
    });
  }

  return el(
    "ol",
    { classe: "revisao" },
    itens.map(({ resposta, numero, pergunta }) => {
      const situacao = descobrirSituacao(resposta);
      const { rotulo, icone } = SITUACOES[situacao];
      const categoria = obterCategoriaPorId(pergunta.categoria);
      const textoCorreto = pergunta.alternativas[pergunta.correta];
      const textoEscolhido =
        resposta.escolhida === null || resposta.escolhida === undefined
          ? "Sem resposta"
          : (pergunta.alternativas[resposta.escolhida] ?? "Sem resposta");

      const linhas = resposta.acertou
        ? [criarLinha("Resposta certa", textoCorreto)]
        : [criarLinha("Sua resposta", textoEscolhido), criarLinha("Resposta certa", textoCorreto)];

      return el("li", { classe: `revisao__item revisao__item--${situacao}` }, [
        el("div", { classe: "revisao__topo" }, [
          el("span", { classe: "revisao__numero", texto: String(numero).padStart(2, "0") }),
          el("span", { classe: "badge", texto: categoria?.nome ?? "Pergunta" }),
          el("span", { classe: `revisao__situacao revisao__situacao--${situacao}` }, [criarIcone(icone, 18), rotulo]),
        ]),
        el("p", { classe: "revisao__pergunta", texto: pergunta.enunciado }),
        el("dl", { classe: "revisao__respostas" }, linhas),
        el("p", { classe: "revisao__explicacao", texto: pergunta.explicacao }),
      ]);
    })
  );
}