/*
 * Regras de pontos e XP de uma partida. As regras de NÍVEL ficam em progressao.js.
 *
 * PONTOS (da partida):
 *  - Acerto vale 100 (fácil), 150 (médio) ou 200 (difícil). Erro vale 0.
 *  - Combo: a partir do 3º acerto seguido, +10 por acerto extra na sequência,
 *    com teto de +50. (3º = +10, 4º = +20 ... 7º em diante = +50)
 *  - Bônus de tempo (só no modo "Contra o tempo"): até +50, proporcional ao
 *    tempo que sobrou, em passos de 5.
 *
 * XP (calculado a partir de eventos reais da partida, separado dos pontos):
 *  - 5 / 8 / 12 por resposta correta (fácil / médio / difícil)
 *  - +10 por concluir a partida, se ela teve pelo menos 5 perguntas
 *    (partida abandonada não gera XP)
 *  - +25 se a partida for perfeita (sem erros e com pelo menos 5 perguntas)
 *  - Missões concluídas dão XP extra (ver data/missoes.js)
 *  - Desafio diário: +50 XP uma vez por data
 *
 * O XP só é concedido uma vez por partida: veja registrarPartida() em
 * services/progresso.js, que confere o id da partida antes de gravar.
 */
export {
  XP_BASE_POR_NIVEL,
  XP_ADICIONAL_POR_NIVEL,
  xpParaSubirDe,
  xpAcumuladoParaNivel,
  calcularNivel,
} from "./progressao.js";

export const PONTOS_POR_DIFICULDADE = { facil: 100, medio: 150, dificil: 200 };
export const COMBO_MINIMO_PARA_BONUS = 3;
export const BONUS_POR_NIVEL_DE_COMBO = 10;
export const BONUS_MAXIMO_DE_COMBO = 50;

export const BONUS_MAXIMO_DE_TEMPO = 50;
export const PASSO_DO_BONUS_DE_TEMPO = 5;

export const XP_POR_ACERTO = { facil: 5, medio: 8, dificil: 12 };
export const XP_CONCLUSAO = 10;
export const MINIMO_PERGUNTAS_PARA_CONCLUSAO = 5;
export const XP_PARTIDA_PERFEITA = 25;
export const MINIMO_PERGUNTAS_PARTIDA_PERFEITA = 5;

export const XP_DESAFIO_DIARIO = 50;
export const QUANTIDADE_DESAFIO_DIARIO = 5;

/**
 * Bônus de pontos pelo tempo que sobrou.
 * fracaoDeTempo: de 0 (acabou) a 1 (respondeu na hora). Fora do modo com tempo, use null.
 */
export function calcularBonusDeTempo(fracaoDeTempo) {
  if (!Number.isFinite(fracaoDeTempo)) return 0;

  const fracao = Math.min(1, Math.max(0, fracaoDeTempo));
  return Math.round((BONUS_MAXIMO_DE_TEMPO * fracao) / PASSO_DO_BONUS_DE_TEMPO) * PASSO_DO_BONUS_DE_TEMPO;
}

/** Pontos de uma resposta correta. "combo" já inclui o acerto atual. */
export function calcularPontosDaResposta({ dificuldade, combo, fracaoDeTempo = null }) {
  const base = PONTOS_POR_DIFICULDADE[dificuldade] ?? 0;
  if (base === 0) return { base: 0, bonus: 0, bonusTempo: 0, total: 0 };

  const acertosExtras = Math.max(0, combo - COMBO_MINIMO_PARA_BONUS + 1);
  const bonus = Math.min(acertosExtras * BONUS_POR_NIVEL_DE_COMBO, BONUS_MAXIMO_DE_COMBO);
  const bonusTempo = calcularBonusDeTempo(fracaoDeTempo);
  return { base, bonus, bonusTempo, total: base + bonus + bonusTempo };
}

export function ehPartidaPerfeita(acertos, total) {
  return total >= MINIMO_PERGUNTAS_PARTIDA_PERFEITA && acertos === total;
}

/** XP de uma partida concluída. respostas: [{ acertou, dificuldade }] */
export function calcularXpDaPartida({ respostas, total }) {
  const corretas = respostas.filter((resposta) => resposta.acertou);
  const porAcertos = corretas.reduce((soma, resposta) => soma + (XP_POR_ACERTO[resposta.dificuldade] ?? 0), 0);
  const porConclusao = total >= MINIMO_PERGUNTAS_PARA_CONCLUSAO ? XP_CONCLUSAO : 0;
  const porPerfeicao = ehPartidaPerfeita(corretas.length, total) ? XP_PARTIDA_PERFEITA : 0;

  return {
    acertos: porAcertos,
    conclusao: porConclusao,
    perfeita: porPerfeicao,
    total: porAcertos + porConclusao + porPerfeicao,
  };
}