import {
  LIMITE_DIAS_JOGADOS,
  LIMITE_HISTORICO,
  LIMITE_IDS_REGISTRADOS,
  atualizarDados,
  reiniciarMissoesSeNecessario,
} from "./storage.js";
import { aplicarPartidaNasMissoes, concederRecompensasDeMissoes } from "./missoes.js";
import { CONQUISTAS, estaConcluida } from "../data/conquistas.js";
import { calcularNivel } from "../utils/progressao.js";
import { diaLocal, resumirSequencia, unirDias } from "../utils/sequencia.js";

const numeroSeguro = (valor) => (Number.isFinite(valor) ? valor : 0);

/**
 * Grava, numa única transação, tudo o que uma partida CONCLUÍDA muda:
 * histórico, estatísticas, recorde, dia jogado, XP, nível, missões e conquistas.
 * Serve para todos os modos de jogo.
 *
 * É idempotente: se o id da partida já consta em registroDePartidas, nada é
 * gravado de novo e a função retorna null. Isso impede XP duplicado ao
 * recarregar páginas ou clicar duas vezes. Partidas abandonadas nunca chegam aqui.
 */
export function registrarPartida(resultado) {
  let efeitos = null;

  atualizarDados((dados) => {
    // 1. Partida já registrada? Então não faz nada
    if (dados.registroDePartidas.includes(resultado.id)) return;

    reiniciarMissoesSeNecessario(dados);

    const estatisticas = dados.estatisticas;
    const categoriaId = resultado.config.categoriaId;
    const xpAntes = dados.progresso.xp;
    const nivelAnterior = calcularNivel(xpAntes).nivel;

    // 2. Recorde da categoria (inclui "todas")
    const anterior = estatisticas.porCategoria[categoriaId] ?? {};
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
    estatisticas.porCategoria[categoriaId] = registro;

    // 3. Estatísticas acumuladas
    estatisticas.partidas += 1;
    estatisticas.perguntasRespondidas += resultado.total;
    estatisticas.acertos += resultado.acertos;
    estatisticas.melhorPontuacao = Math.max(estatisticas.melhorPontuacao, resultado.pontuacao);
    estatisticas.melhorCombo = Math.max(estatisticas.melhorCombo, resultado.melhorCombo);
    if (resultado.perfeita) estatisticas.partidasPerfeitas += 1;
    // Superar o recorde só vale quando já existia um recorde anterior
    if (ehNovoRecorde && recordeAnterior > 0) estatisticas.recordesSuperados += 1;

    // Perguntas respondidas por categoria da PERGUNTA (vale também para "Todas")
    for (const [id, contagem] of Object.entries(resultado.perguntasPorCategoria ?? {})) {
      if (id === "__proto__") continue;
      estatisticas.perguntasPorCategoria[id] =
        numeroSeguro(estatisticas.perguntasPorCategoria[id]) + numeroSeguro(contagem?.respondidas);
    }

    // 3b. Dia jogado e sequência de dias (data local)
    const hoje = diaLocal();
    const primeiraDoDia = !dados.diasJogados.includes(hoje);
    const melhorSequenciaAnterior = estatisticas.melhorSequencia;
    dados.diasJogados = unirDias(dados.diasJogados, [hoje], LIMITE_DIAS_JOGADOS);
    const sequencia = resumirSequencia(dados.diasJogados, melhorSequenciaAnterior, hoje);
    estatisticas.melhorSequencia = sequencia.melhor;

    // 4. XP da partida e 5. missões (o XP das missões concluídas entra aqui também)
    dados.progresso.xp += resultado.xp;
    aplicarPartidaNasMissoes(dados, resultado);
    const missoesConcluidas = concederRecompensasDeMissoes(dados);
    const xpMissoes = missoesConcluidas.reduce((soma, missao) => soma + missao.xp, 0);

    // 6. Nível
    const xpDepois = dados.progresso.xp;
    const nivelNovo = calcularNivel(xpDepois).nivel;

    // 7. Conquistas: só desbloqueia o que ainda não estava desbloqueado
    const novasConquistas = [];
    const agora = new Date().toISOString();
    for (const conquista of CONQUISTAS) {
      if (!dados.conquistas[conquista.id] && estaConcluida(conquista, dados)) {
        dados.conquistas[conquista.id] = agora;
        novasConquistas.push(conquista.id);
      }
    }

    // 8. Histórico (mais recente primeiro, com limite) e registro do id
    dados.historico.unshift({
      id: resultado.id,
      data: agora,
      categoriaId,
      modoId: resultado.config.modoId,
      dificuldade: resultado.config.dificuldade,
      total: resultado.total,
      acertos: resultado.acertos,
      erros: resultado.erros,
      pontuacao: resultado.pontuacao,
      xp: resultado.xp + xpMissoes,
      duracaoMs: resultado.duracaoMs,
    });
    dados.historico = dados.historico.slice(0, LIMITE_HISTORICO);
    dados.registroDePartidas.push(resultado.id);
    dados.registroDePartidas = dados.registroDePartidas.slice(-LIMITE_IDS_REGISTRADOS);

    efeitos = {
      xpAntes,
      xpDepois,
      xpMissoes,
      nivelAnterior,
      nivelNovo,
      subiuDeNivel: nivelNovo > nivelAnterior,
      missoesConcluidas,
      novasConquistas,
      recorde: {
        categoriaId,
        anterior: recordeAnterior,
        atual: registro.melhorPontuacao,
        ehNovo: ehNovoRecorde,
      },
      sequencia: {
        atual: sequencia.atual,
        melhor: sequencia.melhor,
        primeiraDoDia,
        novaMelhor: sequencia.melhor > melhorSequenciaAnterior && sequencia.atual > 1,
      },
    };
  });

  return efeitos;
}