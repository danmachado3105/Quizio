import { criarElemento } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";

const COR_POR_TIPO = { conquista: "amarelo", nivel: "roxo", missao: "verde" };
const TEMPO_DA_SAIDA_MS = 300;

let regiao = null;

/** Área fixa no canto da tela. Não bloqueia cliques e é lida por leitores de tela. */
function obterRegiao() {
  if (!regiao || !regiao.isConnected) {
    regiao = criarElemento("div", {
      classe: "notificacoes",
      atributos: { role: "status", "aria-live": "polite" },
    });
    document.body.append(regiao);
  }
  return regiao;
}

/**
 * Mostra uma notificação temporária (não interrompe o jogo).
 * tipo: "conquista" | "nivel" | "missao"
 */
export function mostrarNotificacao({ icone = "award", titulo, texto = "", tipo = "conquista", duracaoMs = 6000 }) {
  const cor = COR_POR_TIPO[tipo] ?? "amarelo";

  const fechar = () => {
    notificacao.classList.add("notificacao--saindo");
    setTimeout(() => notificacao.remove(), TEMPO_DA_SAIDA_MS);
  };

  const botaoFechar = criarElemento(
    "button",
    {
      classe: "notificacao__fechar",
      atributos: { type: "button", "aria-label": "Dispensar notificação" },
      aoClicar: fechar,
    },
    [criarIcone("x", 16)]
  );

  const notificacao = criarElemento("div", { classe: `notificacao notificacao--${tipo}` }, [
    criarElemento("span", { classe: `icone-caixa icone-caixa--${cor}` }, [criarIcone(icone, 22)]),
    criarElemento("div", { classe: "notificacao__corpo" }, [
      criarElemento("p", { classe: "notificacao__titulo", texto: titulo }),
      texto ? criarElemento("p", { classe: "notificacao__texto", texto }) : null,
    ]),
    botaoFechar,
  ]);

  obterRegiao().append(notificacao);
  setTimeout(fechar, duracaoMs);
  return { fechar };
}