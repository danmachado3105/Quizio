/*
 * Missões diárias. Renovam todo dia à meia-noite, usando a data LOCAL do
 * dispositivo (ver reiniciarMissoesSeNecessario em services/storage.js).
 *
 * metrica: contador diário em dados.missoes.progresso que a missão acompanha
 *   perguntasRespondidas, acertos, partidas  -> somam ao longo do dia
 *   categoriasDiferentes                     -> categorias específicas jogadas hoje
 *   melhorPontuacao                          -> maior pontuação de uma partida hoje
 *   partidasPerfeitas                        -> partidas sem erro hoje
 * meta: valor necessário para concluir
 * xp: recompensa, concedida UMA vez por missão por dia
 */
export const MISSOES = [
  {
    id: "responder-10",
    titulo: "Responder 10 perguntas",
    descricao: "Responda a 10 perguntas hoje, em uma ou várias partidas.",
    metrica: "perguntasRespondidas",
    meta: 10,
    xp: 30,
  },
  {
    id: "acertar-5",
    titulo: "Acertar 5 perguntas",
    descricao: "Dê 5 respostas corretas hoje.",
    metrica: "acertos",
    meta: 5,
    xp: 20,
  },
  {
    id: "jogar-2",
    titulo: "Concluir 2 partidas",
    descricao: "Termine 2 partidas hoje. Partidas abandonadas não contam.",
    metrica: "partidas",
    meta: 2,
    xp: 25,
  },
  {
    id: "categorias-2",
    titulo: "Jogar em 2 categorias",
    descricao: "Conclua partidas em 2 categorias diferentes hoje (a opção \"Todas as categorias\" não conta).",
    metrica: "categoriasDiferentes",
    meta: 2,
    xp: 25,
  },
  {
    id: "pontos-500",
    titulo: "Fazer 500 pontos",
    descricao: "Alcance 500 pontos em uma única partida hoje.",
    metrica: "melhorPontuacao",
    meta: 500,
    xp: 30,
  },
  {
    id: "sem-erros",
    titulo: "Partida sem errar",
    descricao: "Termine uma partida de pelo menos 5 perguntas acertando todas.",
    metrica: "partidasPerfeitas",
    meta: 1,
    xp: 40,
  },
];

export function obterMissaoPorId(id) {
  return MISSOES.find((missao) => missao.id === id) ?? null;
}