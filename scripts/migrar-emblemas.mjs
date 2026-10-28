import { writeFile } from 'node:fs/promises'

const categorias = [
  'conhecimentos-gerais', 'ciencia-espaco', 'historia', 'geografia', 'filmes', 'series', 'musica',
  'esportes', 'jogos', 'animes', 'tecnologia', 'literatura', 'natureza-animais', 'brasil',
  'arte-arquitetura', 'comida-culinaria', 'corpo-humano', 'mitologia-lendas', 'matematica-logica',
  'lingua-portuguesa', 'economia-negocios', 'datas-tradicoes', 'invencoes-descobertas',
]
const modulo = await import(new URL('../legado/js/utils/icones.js', import.meta.url).href)
const emblemas = Object.fromEntries(categorias.map((id) => [id, modulo.obterMarcacaoDoIcone(`cat-${id}`)]))
const conteudo = `// Emblemas SVG: migrados das ilustrações originais; são constantes locais do projeto.\nexport const EMBLEMAS_CATEGORIAS: Record<string, string> = ${JSON.stringify(emblemas, null, 2)}\n`
await writeFile(new URL('../src/dados/emblemas.ts', import.meta.url), conteudo, 'utf8')
