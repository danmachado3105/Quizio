import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const lerSvg = async (caminho) => readFile(new URL(caminho, import.meta.url))
const saidas = [
  { fonte: '../public/identidade/icone-pwa.svg', destino: '../public/favicon-32.png', tamanho: 32 },
  { fonte: '../public/identidade/icone-pwa.svg', destino: '../public/apple-touch-icon.png', tamanho: 180 },
  { fonte: '../public/identidade/icone-pwa.svg', destino: '../public/pwa-192.png', tamanho: 192 },
  { fonte: '../public/identidade/icone-pwa.svg', destino: '../public/pwa-512.png', tamanho: 512 },
  { fonte: '../public/identidade/icone-pwa-maskable.svg', destino: '../public/pwa-512-maskable.png', tamanho: 512 },
]

for (const item of saidas) {
  const svg = await lerSvg(item.fonte)
  await sharp(svg).resize(item.tamanho, item.tamanho).png().toFile(fileURLToPath(new URL(item.destino, import.meta.url)))
}
await sharp(await lerSvg('../public/identidade/imagem-social.svg')).png().toFile(fileURLToPath(new URL('../public/imagem-social.png', import.meta.url)))
