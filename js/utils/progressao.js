/*
 * Regra de níveis (lógica pura, sem interface).
 *
 *  - Do nível 1 para o 2 são necessários 100 XP.
 *  - Cada nível seguinte exige 50 XP a mais que o anterior (100, 150, 200...).
 *  - XP acumulado para ALCANÇAR o nível n, com m = n - 1:
 *        100*m + 50*m*(m-1)/2  =  25*m² + 75*m
 *  - calcularNivel usa a fórmula inversa (equação do 2º grau), então o custo
 *    da conta não cresce com o XP: funciona igual com 10 ou com milhões de XP.
 */
export const XP_BASE_POR_NIVEL = 100;
export const XP_ADICIONAL_POR_NIVEL = 50;

const XP_MAXIMO = Number.MAX_SAFE_INTEGER;

/** XP necessário para sair do nível informado e chegar ao próximo. */
export function xpParaSubirDe(nivel) {
  return XP_BASE_POR_NIVEL + (Math.max(1, Math.floor(nivel)) - 1) * XP_ADICIONAL_POR_NIVEL;
}

/** XP total que o jogador precisa ter para alcançar o nível informado. */
export function xpAcumuladoParaNivel(nivel) {
  const m = Math.max(1, Math.floor(nivel)) - 1;
  const a = XP_ADICIONAL_POR_NIVEL / 2;
  const b = XP_BASE_POR_NIVEL - a;
  return a * m * m + b * m;
}

/** Converte o XP total em nível e progresso dentro do nível atual. */
export function calcularNivel(xpTotal) {
  const xp = Math.min(Math.max(0, Math.floor(Number(xpTotal)) || 0), XP_MAXIMO);

  const a = XP_ADICIONAL_POR_NIVEL / 2;
  const b = XP_BASE_POR_NIVEL - a;
  let nivel = Math.floor((-b + Math.sqrt(b * b + 4 * a * xp)) / (2 * a)) + 1;

  // Correção de arredondamento do ponto flutuante
  while (xpAcumuladoParaNivel(nivel + 1) <= xp) nivel += 1;
  while (nivel > 1 && xpAcumuladoParaNivel(nivel) > xp) nivel -= 1;

  const xpNoNivel = xp - xpAcumuladoParaNivel(nivel);
  const xpNecessario = xpParaSubirDe(nivel);

  return {
    nivel,
    xpNoNivel,
    xpNecessario,
    // floor: a barra só chega a 100% quando o nível realmente sobe
    percentual: Math.floor((xpNoNivel / xpNecessario) * 100),
  };
}