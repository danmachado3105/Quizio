/* Modos de jogo. Todos usam a mesma lógica central de quiz (Etapas 2 e 4). */
export const MODOS = [
  { id: "classico", nome: "Clássico", descricao: "Responda no seu ritmo, sem pressão de tempo." },
  { id: "tempo", nome: "Contra o tempo", descricao: "Cada pergunta tem tempo limitado." },
  { id: "sobrevivencia", nome: "Sobrevivência", descricao: "Continue jogando até errar uma vez." },
  { id: "diario", nome: "Desafio diário", descricao: "Perguntas do dia, com bônus uma vez por data." },
  { id: "duelo", nome: "Duelo local", descricao: "Duas pessoas, um dispositivo." },
];

export function obterNomeDoModo(id) {
  return MODOS.find((modo) => modo.id === id)?.nome ?? "Clássico";
}