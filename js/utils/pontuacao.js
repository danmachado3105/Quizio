/*
 * Regras de pontuação, XP e nível. Todas as contas ficam aqui.
 *
 * PONTOS (da partida):
 *  - Acerto vale 100 (fácil), 150 (médio) ou 200 (difícil). Erro vale 0.
 *  - Combo: a partir do 3º acerto seguido, +10 por acerto extra na sequência,
 *    com teto de +50. (3º = +10, 4º = +20 ... 7º em diante = +50)
 *
 * XP (progressão do jogador, calculado separadamente dos pontos):
 *  - 5 / 8 / 12 por acerto (fácil / médio / difícil)
 *  - +10 por concluir a partida
 *  - +25 se a partida for perfeita (sem erros e com pelo menos 5 perguntas)
 *
 * NÍVEL:
 *  - Do nível 1 para o 2 são 100 XP; cada nível seguinte exige 50 XP a mais.
 */
export const PONTOS_POR_DIFICULDADE = { facil: 100, medio: 150, dificil: 200 };
export const COMBO_MINIMO_PARA_BONUS = 3;
export const BONUS_POR_NIVEL_DE_COMBO = 10;
export const BONUS_MAXIMO_DE_COMBO = 50;

export const XP_POR_ACERTO = { facil: 5, medio: 8, dificil: 12 };
export const XP_CONCLUSAO = 10;
export const XP_PARTIDA_PERFEITA = 25;
export const MINIMO_PERGUNTAS_PARTIDA_PERFEITA = 5;

export const XP_BASE_POR_NIVEL = 100;
export const XP_ADICIONAL_POR_NIVEL = 50;
export const XP_DESAFIO_DIARIO = 50;
export const QUANTIDADE_DESAFIO_DIARIO = 5;

/** Pontos de uma resposta correta. "combo" já inclui o acerto atual. */
export function calcularPontosDaResposta({ dificuldade, combo }) {
  const base = PONTOS_POR_DIFICULDADE[dificuldade] ?? 0;
  if (base === 0) return { base: 0, bonus: 0, total: 0 };

  const acertosExtras = Math.max(0, combo - COMBO_MINIMO_PARA_BONUS + 1);
  const bonus = Math.min(acertosExtras * BONUS_POR_NIVEL_DE_COMBO, BONUS_MAXIMO_DE_COMBO);
  return { base, bonus, total: base + bonus };
}

export function ehPartidaPerfeita(acertos, total) {
  return total >= MINIMO_PERGUNTAS_PARTIDA_PERFEITA && acertos === total;
}

/** XP de uma partida concluída. respostas: [{ acertou, dificuldade }] */
export function calcularXpDaPartida({ respostas, total }) {
  const corretas = respostas.filter((resposta) => resposta.acertou);
  const porAcertos = corretas.reduce((soma, resposta) => soma + (XP_POR_ACERTO[resposta.dificuldade] ?? 0), 0);
  const porPerfeicao = ehPartidaPerfeita(corretas.length, total) ? XP_PARTIDA_PERFEITA : 0;

  return {
    acertos: porAcertos,
    conclusao: XP_CONCLUSAO,
    perfeita: porPerfeicao,
    total: porAcertos + XP_CONCLUSAO + porPerfeicao,
  };
}

/** XP necessário para sair do nível informado e chegar ao próximo. */
export function xpParaSubirDe(nivel) {
  return XP_BASE_POR_NIVEL + (nivel - 1) * XP_ADICIONAL_POR_NIVEL;
}

/** Converte o XP total em nível e progresso dentro do nível atual. */
export function calcularNivel(xpTotal) {
  let nivel = 1;
  let restante = Math.max(0, Math.floor(Number(xpTotal)) || 0);

  while (restante >= xpParaSubirDe(nivel)) {
    restante -= xpParaSubirDe(nivel);
    nivel += 1;
  }

  const xpNecessario = xpParaSubirDe(nivel);
  return {
    nivel,
    xpNoNivel: restante,
    xpNecessario,
    percentual: Math.round((restante / xpNecessario) * 100),
  };
}