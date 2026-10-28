import { criarElemento } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterAvatar } from "../data/avatares.js";

/** Avatar redondo com o ícone do personagem escolhido. */
export function criarAvatar(avatarId, tamanho = 56) {
  const avatar = obterAvatar(avatarId);

  const elemento = criarElemento(
    "span",
    {
      classe: `avatar avatar--${avatar.id}`,
      atributos: { role: "img", "aria-label": `Avatar ${avatar.nome}` },
    },
    [criarIcone(avatar.icone, Math.round(tamanho * 0.5))]
  );
  elemento.style.width = `${tamanho}px`;
  elemento.style.height = `${tamanho}px`;
  return elemento;
}