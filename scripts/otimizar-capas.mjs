import { readdir, rename, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const pasta = path.resolve('public/imagens/categorias')
const origemPreservada = path.resolve('legado/assets/images/categorias')
const arquivos = (await readdir(pasta)).filter((arquivo) => arquivo.toLowerCase().endsWith('.jpg'))
let antes = 0
let depois = 0

for (const arquivo of arquivos) {
  const origem = path.join(pasta, arquivo)
  const temporario = `${origem}.optimized`
  const metadados = await stat(path.join(origemPreservada, arquivo))
  const resultado = await sharp(origem)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(temporario)
  antes += metadados.size
  depois += resultado.size
  await rename(temporario, origem)
}

console.log(`${arquivos.length} capas: ${(antes / 1024 / 1024).toFixed(1)} MB → ${(depois / 1024 / 1024).toFixed(1)} MB`)
