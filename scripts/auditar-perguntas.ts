import { auditarBanco } from '../src/dados/perguntas'

const relatorio = auditarBanco()
console.log(`Perguntas válidas: ${relatorio.total}`)
console.log('Categoria | Total | Fáceis | Médias | Difíceis | Faltam (F/M/D) | Próximo id')
for (const [id, item] of Object.entries(relatorio.porCategoria)) {
  console.log(`${id} | ${item.total} | ${item.facil} | ${item.medio} | ${item.dificil} | ${item.faltam.facil}/${item.faltam.medio}/${item.faltam.dificil} | ${item.proximoId}`)
}
if (relatorio.problemas.length) {
  console.error(`\nPerguntas inválidas: ${relatorio.problemas.length}`)
  for (const problema of relatorio.problemas) console.error(`- ${problema.id}: ${problema.motivo}`)
  process.exitCode = 1
}
