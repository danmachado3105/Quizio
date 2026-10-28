import { QUANTIDADE_DESAFIO_DIARIO } from "../utils/pontuacao.js";

/*
 * Modos de jogo e as regras de cada um. Todos usam o mesmo motor
 * (services/partida.js), que lê as "regras" abaixo:
 *
 *   temTempo, limiteSegundos -> cada pergunta tem um relógio
 *   permitePausa             -> o jogador pode pausar a partida
 *   permitePular, pulosACada -> 1 pulo a cada N perguntas (ver calcularLimiteDePulos)
 *   fimNoPrimeiroErro        -> a partida termina na primeira resposta errada
 *   quantidadeFixa           -> número de perguntas imposto pelo modo
 *   usaTodasAsPerguntas      -> usa todas as perguntas da seleção, embaralhadas
 *   jogadores                -> 1, ou 2 no duelo local
 *   configuravel             -> o jogador escolhe tema, dificuldade e quantidade
 */
const REGRAS_BASE = {
  temTempo: false,
  limiteSegundos: null,
  permitePausa: true,
  permitePular: false,
  pulosACada: 0,
  fimNoPrimeiroErro: false,
  quantidadeFixa: null,
  usaTodasAsPerguntas: false,
  jogadores: 1,
  configuravel: true,
};

export const MODOS = [
  {
    id: "classico",
    nome: "Clássico",
    descricao: "Sem relógio, no seu ritmo. Dá para pausar e pular algumas perguntas.",
    regras: { ...REGRAS_BASE, permitePular: true, pulosACada: 5 },
  },
  {
    id: "tempo",
    nome: "Contra o tempo",
    descricao: "20 segundos por pergunta. Quanto mais rápido, mais pontos.",
    regras: { ...REGRAS_BASE, temTempo: true, limiteSegundos: 20, permitePausa: false },
  },
  {
    id: "sobrevivencia",
    nome: "Sobrevivência",
    descricao: "Continue enquanto acertar. A primeira resposta errada encerra a partida.",
    regras: { ...REGRAS_BASE, fimNoPrimeiroErro: true, usaTodasAsPerguntas: true },
  },
  {
    id: "diario",
    nome: "Desafio diário",
    descricao: "As mesmas perguntas para todo mundo no dia, com bônus de XP uma vez por data.",
    regras: { ...REGRAS_BASE, quantidadeFixa: QUANTIDADE_DESAFIO_DIARIO, configuravel: false },
  },
  {
    id: "duelo",
    nome: "Duelo local",
    descricao: "Duas pessoas, um aparelho, as mesmas perguntas. As respostas ficam escondidas até o fim da rodada.",
    regras: { ...REGRAS_BASE, jogadores: 2 },
  },
];

export function obterModo(id) {
  return MODOS.find((modo) => modo.id === id) ?? null;
}

/** Regras do modo (as do Clássico se o id for desconhecido). */
export function obterRegrasDoModo(id) {
  return (obterModo(id) ?? MODOS[0]).regras;
}

export function obterNomeDoModo(id) {
  return obterModo(id)?.nome ?? "Clássico";
}

/** Quantos pulos a partida permite: 1 a cada "pulosACada" perguntas (no mínimo 1). */
export function calcularLimiteDePulos(regras, total) {
  if (!regras.permitePular || regras.pulosACada <= 0) return 0;
  return Math.max(1, Math.floor(total / regras.pulosACada));
}