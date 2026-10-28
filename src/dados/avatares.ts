/* Avatares predefinidos. O id também é usado como cor do avatar (ver css/gamificacao.css). */
export const AVATAR_PADRAO = "roxo";

export const AVATARES: Avatar[] = [
  { id: "roxo", nome: "Foguete", icone: "rocket" },
  { id: "coral", nome: "Chama", icone: "flame" },
  { id: "amarelo", nome: "Estrela", icone: "star" },
  { id: "verde", nome: "Folha", icone: "leaf" },
  { id: "escuro", nome: "Controle", icone: "gamepad" },
  { id: "neutro", nome: "Livro", icone: "book-open" },
];

export function avatarEhValido(id: string): boolean {
  return AVATARES.some((avatar) => avatar.id === id);
}

/** Retorna o avatar pedido ou o padrão, se o id não existir. */
export function obterAvatar(id: string): Avatar {
  return AVATARES.find((avatar) => avatar.id === id) ?? AVATARES[0];
}
import type { Avatar } from '../tipos'
