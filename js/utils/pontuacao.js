/*
 * Regras de XP e nível (simples e documentadas):
 *  - Subir do nível 1 para o 2 exige 100 XP.
 *  - Cada nível seguinte exige 50 XP a mais que o anterior (100, 150, 200...).
 *  - O nível é sempre calculado a partir do XP total salvo.
 *
 * As funções de pontuação por resposta serão adicionadas na Etapa 2.
 */
export const XP_BASE_POR_NIVEL = 100;
export const XP_ADICIONAL_POR_NIVEL = 50;
export const XP_DESAFIO_DIARIO = 50;
export const QUANTIDADE_DESAFIO_DIARIO = 5;

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