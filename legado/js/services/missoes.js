import { MISSOES } from "../data/missoes.js";

/*
 * Progresso e recompensas das missões diárias.
 * Estas funções recebem o objeto "dados" e o alteram; quem grava no
 * LocalStorage é o services/progresso.js, dentro de uma única transação.
 */
const numero = (valor) => (Number.isFinite(valor) ? valor : 0);

/** Atualiza os contadores do dia com base em uma partida concluída. */
export function aplicarPartidaNasMissoes(dados, resultado) {
  const progresso = dados.missoes.progresso;
  const somar = (metrica, valor) => {
    progresso[metrica] = numero(progresso[metrica]) + valor;
  };

  somar("perguntasRespondidas", resultado.total);
  somar("acertos", resultado.acertos);
  somar("partidas", 1);
  progresso.melhorPontuacao = Math.max(numero(progresso.melhorPontuacao), resultado.pontuacao);
  if (resultado.perfeita) somar("partidasPerfeitas", 1);

  // "Todas as categorias" é uma mistura, então não conta como categoria diferente
  const categoriaId = resultado.config.categoriaId;
  if (categoriaId !== "todas" && !dados.missoes.categoriasHoje.includes(categoriaId)) {
    dados.missoes.categoriasHoje.push(categoriaId);
  }
  progresso.categoriasDiferentes = dados.missoes.categoriasHoje.length;
}

/**
 * Concede o XP das missões concluídas que ainda não foram recompensadas.
 * A recompensa é registrada em "resgatadas" ANTES de o XP ser somado,
 * então uma missão nunca paga duas vezes no mesmo dia.
 */
export function concederRecompensasDeMissoes(dados) {
  const concluidas = [];
  const agora = new Date().toISOString();

  for (const missao of MISSOES) {
    const atual = numero(dados.missoes.progresso[missao.metrica]);
    if (atual < missao.meta || dados.missoes.resgatadas[missao.id]) continue;

    dados.missoes.resgatadas[missao.id] = agora;
    dados.progresso.xp += missao.xp;
    concluidas.push({ id: missao.id, titulo: missao.titulo, xp: missao.xp });
  }

  return concluidas;
}

/** Estado de cada missão para exibir na interface. */
export function obterEstadoDasMissoes(dados) {
  return MISSOES.map((missao) => {
    const atual = Math.min(numero(dados.missoes.progresso[missao.metrica]), missao.meta);
    return {
      missao,
      atual,
      concluida: atual >= missao.meta,
      resgatada: Boolean(dados.missoes.resgatadas[missao.id]),
      falta: Math.max(0, missao.meta - atual),
    };
  });
}