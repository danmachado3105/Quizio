import { CATEGORIAS_COM_FOTO } from "../data/imagens.js";

/** Foto de capa de uma categoria, ou null se ela não tiver foto cadastrada. */
export function criarCapa(base, categoria) {
  if (!CATEGORIAS_COM_FOTO.includes(categoria.id)) return null;

  const imagem = document.createElement("img");
  imagem.className = "capa";
  imagem.src = `${base}assets/images/categorias/${categoria.id}.jpg`;
  imagem.alt = "";
  imagem.loading = "lazy";
  imagem.decoding = "async";
  imagem.setAttribute("aria-hidden", "true");
  // Se o arquivo não carregar, a foto simplesmente some
  imagem.addEventListener("error", () => imagem.remove(), { once: true });
  return imagem;
}