const MS_POR_SEMANA = 7 * 24 * 60 * 60 * 1000

function quintaDaSemana(data: Date): Date {
  const dia = new Date(data.getFullYear(), data.getMonth(), data.getDate())
  const posicao = (dia.getDay() + 6) % 7
  dia.setDate(dia.getDate() - posicao + 3)
  return dia
}

export function semanaISOLocal(data = new Date()): string {
  const quinta = quintaDaSemana(data)
  const ano = quinta.getFullYear()
  const primeiraQuinta = quintaDaSemana(new Date(ano, 0, 4))
  const semana = 1 + Math.round((quinta.getTime() - primeiraQuinta.getTime()) / MS_POR_SEMANA)
  return `${ano}-W${String(semana).padStart(2, '0')}`
}
