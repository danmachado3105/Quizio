/*
 * Missões diárias.
 * metrica: nome do contador em dados.missoes.progresso que a missão acompanha
 * meta: valor necessário para concluir
 * xp: recompensa (concedida uma única vez por missão/dia, na Etapa 3)
 */
export const MISSOES = [
  { id: "responder-10", titulo: "Responder 10 perguntas", metrica: "perguntasRespondidas", meta: 10, xp: 30 },
  { id: "acertar-5", titulo: "Acertar 5 perguntas", metrica: "acertos", meta: 5, xp: 20 },
  { id: "jogar-2", titulo: "Jogar 2 partidas", metrica: "partidas", meta: 2, xp: 25 },
  { id: "categoria-nova", titulo: "Experimentar uma categoria diferente", metrica: "categoriasNovas", meta: 1, xp: 20 },
];