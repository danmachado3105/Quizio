const FORMATO_DIA = /^\d{4}-\d{2}-\d{2}$/

export function diaLocal(data = new Date()): string {
  const ano = String(data.getFullYear()).padStart(4, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function ehDiaValido(valor: unknown): valor is string {
  if (typeof valor !== 'string' || !FORMATO_DIA.test(valor)) return false
  const [ano, mes, dia] = valor.split('-').map(Number)
  const data = new Date(ano, mes - 1, dia)
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia
}

export function diaAnterior(dia: string): string {
  const [ano, mes, numero] = dia.split('-').map(Number)
  return diaLocal(new Date(ano, mes - 1, numero - 1))
}

export function unirDias(dias: string[], novos: string[], limite: number): string[] {
  return [...new Set([...dias, ...novos].filter(ehDiaValido))].sort().slice(-limite)
}

export function calcularSequenciaAtual(dias: string[], hoje = diaLocal()): number {
  const jogados = new Set(dias)
  let cursor = jogados.has(hoje) ? hoje : diaAnterior(hoje)
  let sequencia = 0
  while (jogados.has(cursor)) { sequencia += 1; cursor = diaAnterior(cursor) }
  return sequencia
}

export function calcularMelhorSequencia(dias: string[]): number {
  const ordenados = [...new Set(dias.filter(ehDiaValido))].sort()
  let melhor = 0
  let atual = 0
  let anterior: string | null = null
  for (const dia of ordenados) {
    atual = anterior !== null && diaAnterior(dia) === anterior ? atual + 1 : 1
    melhor = Math.max(melhor, atual)
    anterior = dia
  }
  return melhor
}

export function resumirSequencia(dias: string[], melhorSalva = 0, hoje = diaLocal()) {
  const atual = calcularSequenciaAtual(dias, hoje)
  const melhor = Math.max(Number(melhorSalva) || 0, atual, calcularMelhorSequencia(dias))
  const jogouHoje = dias.includes(hoje)
  return { atual, melhor, jogouHoje, emRisco: atual > 0 && !jogouHoje }
}
