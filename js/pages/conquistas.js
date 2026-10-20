import { criarElemento, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { CONQUISTAS, avaliarConquista } from "../data/conquistas.js";
import { criarBarraProgresso, criarCardConquista, criarItemMissao } from "../components/card.js";
import { obterEstadoDasMissoes } from "../services/missoes.js";
import { obterDados } from "../services/storage.js";

function renderizarResumo(dados) {
  const total = CONQUISTAS.length;
  const desbloqueadas = CONQUISTAS.filter((conquista) => dados.conquistas[conquista.id]).length;

  porId("resumo-conquistas").replaceChildren(
    criarElemento("div", { classe: "card__cabecalho" }, [
      criarElemento("span", { classe: "icone-caixa icone-caixa--amarelo" }, [criarIcone("award", 24)]),
      criarElemento("div", {}, [
        criarElemento("h2", { classe: "card__titulo", texto: `${desbloqueadas} de ${total} conquistas desbloqueadas` }),
        criarElemento("p", {
          classe: "texto-suave texto-pequeno",
          texto: desbloqueadas === total ? "Você desbloqueou todas!" : "Continue jogando para desbloquear as próximas.",
        }),
      ]),
    ]),
    criarBarraProgresso({ percentual: (desbloqueadas / total) * 100, rotulo: "Conquistas desbloqueadas" })
  );
}

function renderizarMissoes(dados) {
  const estados = obterEstadoDasMissoes(dados);
  const xpPendente = estados
    .filter((estado) => !estado.resgatada)
    .reduce((soma, estado) => soma + estado.missao.xp, 0);

  porId("info-missoes").textContent =
    xpPendente > 0
      ? `Renovam todo dia à meia-noite, no horário do seu dispositivo. Ainda dá para ganhar ${xpPendente} XP hoje.`
      : "Você concluiu todas as missões de hoje. Elas renovam à meia-noite, no horário do seu dispositivo.";

  porId("lista-missoes").replaceChildren(
    ...estados.map((estado) => criarItemMissao(estado.missao, estado.atual, { detalhada: true }))
  );
}

/** Desbloqueadas primeiro (mais recentes no topo), depois as bloqueadas na ordem original. */
function renderizarConquistas(dados) {
  const desbloqueadas = CONQUISTAS.filter((conquista) => dados.conquistas[conquista.id]).sort(
    (a, b) => new Date(dados.conquistas[b.id]) - new Date(dados.conquistas[a.id])
  );
  const bloqueadas = CONQUISTAS.filter((conquista) => !dados.conquistas[conquista.id]);

  porId("grade-conquistas").replaceChildren(
    ...[...desbloqueadas, ...bloqueadas].map((conquista) =>
      criarCardConquista(conquista, avaliarConquista(conquista, dados), dados.conquistas[conquista.id])
    )
  );
}

/** Chamada pelo app.js quando a página de conquistas é carregada. */
export function iniciar() {
  const dados = obterDados();
  renderizarResumo(dados);
  renderizarMissoes(dados);
  renderizarConquistas(dados);
}