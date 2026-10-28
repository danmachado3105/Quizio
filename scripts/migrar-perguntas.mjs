import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const prefixos = {
  'conhecimentos-gerais': 'cg', 'ciencia-espaco': 'ce', historia: 'hi', geografia: 'ge',
  filmes: 'fl', series: 'sr', musica: 'mu', esportes: 'es', jogos: 'jg', animes: 'an',
  tecnologia: 'te', literatura: 'li', 'natureza-animais': 'na', brasil: 'br',
  'arte-arquitetura': 'ar', 'comida-culinaria': 'cm', 'corpo-humano': 'cp',
  'mitologia-lendas': 'mi', 'matematica-logica': 'ma', 'lingua-portuguesa': 'pt',
  'economia-negocios': 'ec', 'datas-tradicoes': 'dt', 'invencoes-descobertas': 'iv',
}
const CATEGORIAS = Object.keys(prefixos).map((id) => ({ id }))

const raiz = path.resolve(import.meta.dirname, '..')
const pastaAntiga = path.join(raiz, 'legado', 'js', 'data', 'perguntas')
const pastaNova = path.join(raiz, 'src', 'dados', 'perguntas')
await mkdir(pastaNova, { recursive: true })
const arquivos = (await readdir(pastaAntiga)).filter((nome) => nome.endsWith('.js')).sort()
const pacotes = await Promise.all(arquivos.map(async (nome) => {
  const modulo = await import(pathToFileURL(path.join(pastaAntiga, nome)).href)
  return Array.isArray(modulo.default) ? modulo.default : []
}))
const origem = pacotes.flat()
const porId = new Map()
const duplicatas = new Set()
for (const pergunta of origem) {
  if (typeof pergunta?.id !== 'string') continue
  if (porId.has(pergunta.id)) {
    duplicatas.add(pergunta.id)
    if (JSON.stringify(porId.get(pergunta.id)) !== JSON.stringify(pergunta)) {
      throw new Error(`O id duplicado ${pergunta.id} tem conteúdo diferente entre arquivos.`)
    }
  } else porId.set(pergunta.id, pergunta)
}
const brutas = [...porId.values()]
const ids = new Set()
const enunciados = new Set()
const problemas = []
const normalizarEnunciado = (texto) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
const normalizarAlternativa = (texto) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim()
const idsCategoria = new Set(CATEGORIAS.map((categoria) => categoria.id))

for (const pergunta of brutas) {
  const rotulo = pergunta?.id ?? '(sem id)'
  if (!pergunta || typeof pergunta !== 'object') { problemas.push(`${rotulo}: não é objeto`); continue }
  if (typeof pergunta.id !== 'string' || !pergunta.id) problemas.push(`${rotulo}: sem id`)
  else if (ids.has(pergunta.id)) problemas.push(`${rotulo}: id repetido`)
  else ids.add(pergunta.id)
  if (!idsCategoria.has(pergunta.categoria)) problemas.push(`${rotulo}: categoria inválida`)
  if (!['facil', 'medio', 'dificil'].includes(pergunta.dificuldade)) problemas.push(`${rotulo}: dificuldade inválida`)
  if (typeof pergunta.enunciado !== 'string' || !pergunta.enunciado.trim()) problemas.push(`${rotulo}: sem enunciado`)
  else {
    const chave = normalizarEnunciado(pergunta.enunciado)
    if (enunciados.has(chave)) problemas.push(`${rotulo}: enunciado repetido`)
    enunciados.add(chave)
  }
  if (!Array.isArray(pergunta.alternativas) || pergunta.alternativas.length !== 4) problemas.push(`${rotulo}: precisa de quatro alternativas`)
  else if (pergunta.alternativas.some((texto) => typeof texto !== 'string' || !texto.trim()) || new Set(pergunta.alternativas.map(normalizarAlternativa)).size !== 4) problemas.push(`${rotulo}: alternativas inválidas ou repetidas`)
  if (!Number.isInteger(pergunta.correta) || pergunta.correta < 0 || pergunta.correta > 3) problemas.push(`${rotulo}: índice correto inválido`)
  if (typeof pergunta.explicacao !== 'string' || !pergunta.explicacao.trim()) problemas.push(`${rotulo}: sem explicação`)
}

console.log(`Registros físicos na origem: ${origem.length}`)
console.log(`Ids repetidos idênticos descartados: ${origem.length - brutas.length} (em ${duplicatas.size} ids)`)
console.log(`Perguntas únicas antes da validação: ${brutas.length}`)
console.log(`Ids distintos: ${ids.size}`)
console.log(`Perguntas válidas pela validação do destino: ${brutas.length - problemas.length}`)
if (problemas.length) {
  console.error('Problemas encontrados antes da escrita:')
  for (const problema of problemas) console.error(`- ${problema}`)
  process.exitCode = 1
} else {
  await Promise.all(CATEGORIAS.map(async (categoria) => {
    const prefixo = prefixos[categoria.id]
    const perguntas = brutas.filter((pergunta) => pergunta.categoria === categoria.id)
    const maiorNumero = perguntas.reduce((maior, pergunta) => {
      const numero = Number(pergunta.id.match(/(\d+)$/)?.[1] ?? 0)
      return Math.max(maior, numero)
    }, 0)
    const proximoId = `${prefixo}-${String(maiorNumero + 1).padStart(3, '0')}`
    const nomeExportado = `perguntas${categoria.id.split('-').map((parte) => parte[0].toUpperCase() + parte.slice(1)).join('')}`
    const cabecalho = `/*\n * Categoria: ${categoria.id}\n * Prefixo: ${prefixo}\n * Próximo id livre: ${proximoId}\n * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).\n * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;\n * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.\n *\n * Modelo de pergunta (exemplo estrutural, não faz parte do banco):\n * { id: '${prefixo}-999', categoria: '${categoria.id}', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',\n *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }\n */\n`
    const conteudo = `${cabecalho}import type { Pergunta } from '../../tipos'\n\nexport const ${nomeExportado}: Pergunta[] = ${JSON.stringify(perguntas, null, 2)} as Pergunta[]\n`
    await writeFile(path.join(pastaNova, `${categoria.id}.ts`), conteudo, 'utf8')
  }))
  const arquivosGerados = await Promise.all(CATEGORIAS.map((categoria) => readFile(path.join(pastaNova, `${categoria.id}.ts`), 'utf8')))
  const conteudosGravados = arquivosGerados.map((conteudo) => {
    const inicio = conteudo.indexOf(' = ') + 3
    const fim = conteudo.lastIndexOf(' as Pergunta[]')
    return JSON.parse(conteudo.slice(inicio, fim))
  })
  const depois = conteudosGravados.flat()
  const idsDepois = new Set(depois.map((pergunta) => pergunta.id))
  console.log(`Contagem antes: ${brutas.length} perguntas únicas e válidas.`)
  console.log(`Contagem depois: ${depois.length} perguntas em ${CATEGORIAS.length} arquivos; ${idsDepois.size} ids distintos.`)
  if (depois.length !== brutas.length || idsDepois.size !== brutas.length) {
    throw new Error('A contagem ou os ids mudaram entre a origem e os arquivos TypeScript.')
  }
}
