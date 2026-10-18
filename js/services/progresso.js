import { atualizarDados } from "./storage.js";
import { CONQUISTAS } from "../data/conquistas.js";
import { calcularNivel } from "../utils/pontuacao.js";
import { dataLocalISO } from "../utils/formatacao.js";

const LIMITE_HISTORICO = 50;

function numeroSeguro(valor) {
  return Number.isFinite(valor) ? valor : 0;
}

/**
 * Grava o resultado de uma partida concluída: XP, estatísticas, recorde da
 * categoria, progresso das missões, histórico e conquistas.
 *
 * É idempotente: se o id da partida já estiver no histórico, nada é gravado
 * de novo e a função retorna null (isso impede XP duplicado).
 */
export function registrarPartida(resultado) {
  let efeitos = null;

  atualizarDados((dados) => {
    if (dados.historico.some((partida) => partida.id === resultado.id)) return;

    // Missões são diárias: se virou o dia com a página aberta, recomeçam
    const hoje = dataLocalISO();
    if (dados.missoes.data !== hoje) {
      dados.missoes = { data: hoje, progresso: {}, resgatadas: {} };
    }

    const nivelAnterior = calcularNivel(dados.progresso.xp).nivel;
    const estatisticas = dados.estatisticas;
    const chave = resultado.config.categoriaId;

    // Registro da categoria (inclui "todas"), com valores sempre numéricos
    const anterior = estatisticas.porCategoria[chave] ?? {};
    const categoriaNova = chave !== "todas" && !estatisticas.porCategoria[chave];
    const registro = {
      partidas: numeroSeguro(anterior.partidas),
      respondidas: numeroSeguro(anterior.respondidas),
      acertos: numeroSeguro(anterior.acertos),
      melhorPontuacao: numeroSeguro(anterior.melhorPontuacao),
    };

    const recordeAnterior = registro.melhorPontuacao;
    const ehNovoRecorde = resultado.pontuacao > recordeAnterior;

    registro.partidas += 1;
    registro.respondidas += resultado.total;
    registro.acertos += resultado.acertos;
    registro.melhorPontuacao = Math.max(recordeAnterior, resultado.pontuacao);
    estatisticas.porCategoria[chave] = registro;

    // Estatísticas gerais
    estatisticas.partidas += 1;
    estatisticas.perguntasRespondidas += resultado.total;
    estatisticas.acertos += resultado.acertos;
    estatisticas.melhorPontuacao = Math.max(estatisticas.melhorPontuacao, resultado.pontuacao);
    estatisticas.melhorCombo = Math.max(estatisticas.melhorCombo, resultado.melhorCombo);
    if (resultado.perfeita) estatisticas.partidasPerfeitas += 1;

    // Progresso das missões do dia (a recompensa das missões vem na Etapa 3)
    const progressoMissoes = dados.missoes.progresso;
    const somar = (metrica, valor) => {
      progressoMissoes[metrica] = numeroSeguro(progressoMissoes[metrica]) + valor;
    };
    somar("perguntasRespondidas", resultado.total);
    somar("acertos", resultado.acertos);
    somar("partidas", 1);
    if (categoriaNova) somar("categoriasNovas", 1);

    // XP e nível
    dados.progresso.xp += resultado.xp;
    const nivelNovo = calcularNivel(dados.progresso.xp).nivel;

    // Histórico (mais recente primeiro)
    dados.historico.unshift({
      id: resultado.id,
      categoriaId: chave,
      modoId: resultado.config.modoId,
      pontuacao: resultado.pontuacao,
      acertos: resultado.acertos,
      total: resultado.total,
      xp: resultado.xp,
      data: new Date().toISOString(),
    });
    dados.historico = dados.historico.slice(0, LIMITE_HISTORICO);

    // Conquistas: só desbloqueia quando a condição real foi cumprida
    const novasConquistas = [];
    const agora = new Date().toISOString();
    for (const conquista of CONQUISTAS) {
      if (!dados.conquistas[conquista.id] && conquista.condicao(dados)) {
        dados.conquistas[conquista.id] = agora;
        novasConquistas.push(conquista.id);
      }
    }

    efeitos = {
      nivelAnterior,
      nivelNovo,
      subiuDeNivel: nivelNovo > nivelAnterior,
      recorde: {
        categoriaId: chave,
        anterior: recordeAnterior,
        atual: registro.melhorPontuacao,
        ehNovo: ehNovoRecorde,
      },
      novasConquistas,
    };
  });

  return efeitos;
}