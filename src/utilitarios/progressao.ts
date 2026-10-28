export const XP_BASE_POR_NIVEL = 100
export const XP_ADICIONAL_POR_NIVEL = 50

export function xpParaSubirDe(nivel: number): number {
  return XP_BASE_POR_NIVEL + (Math.max(1, Math.floor(nivel)) - 1) * XP_ADICIONAL_POR_NIVEL
}

export function xpAcumuladoParaNivel(nivel: number): number {
  const m = Math.max(1, Math.floor(nivel)) - 1
  return 25 * m * m + 75 * m
}

export function calcularNivel(xpTotal: number) {
  const xp = Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(Number(xpTotal)) || 0))
  const m = Math.floor((-75 + Math.sqrt(75 ** 2 + 4 * 25 * xp)) / 50)
  const abaixoDoLimite = xp < xpAcumuladoParaNivel(m + 2) ? 0 : 1
  const acimaDoLimite = m > 0 && xp < xpAcumuladoParaNivel(m + 1) ? -1 : 0
  const nivel = Math.max(1, m + 1 + abaixoDoLimite + acimaDoLimite)
  const xpNoNivel = xp - xpAcumuladoParaNivel(nivel)
  const xpNecessario = xpParaSubirDe(nivel)
  return { nivel, xpNoNivel, xpNecessario, percentual: Math.floor((xpNoNivel / xpNecessario) * 100) }
}
