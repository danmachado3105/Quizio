export const RECOMPENSAS = {
  moedasPorAcerto: { facil: 1, medio: 2, dificil: 3 },
  moedasMissaoDiaria: 8,
  moedasMissaoSemanal: 20,
  moedasDesafioDiario: 10,
  bauDiario: { moedas: 25 },
  marcosSequencia: {
    3: { xp: 15, moedas: 10 },
    7: { xp: 35, moedas: 25 },
    14: { xp: 75, moedas: 50 },
    30: { xp: 180, moedas: 100 },
  },
  medalhas: {
    'primeira-partida': [1, 10, 50], 'aquecimento': [10, 50, 150], 'dez-partidas': [10, 50, 150],
    'combo-5': [5, 10, 20], 'partida-perfeita': [1, 10, 50], 'explorador': [5, 12, 23],
    curioso: [8, 16, 23], 'nivel-5': [5, 10, 20], recordista: [1, 10, 50],
    'placar-alto': [1000, 2000, 5000], centenario: [100, 500, 1500],
    sobrevivente: [10, 25, 50], relampago: [10, 25, 50], duelista: [1, 10, 30],
    'fiel-ao-diario': [3, 14, 50], constante: [3, 7, 30],
  } as Record<string, [number, number, number]>,
  itensPorNivel: [
    { id: 'moldura-nivel-2', nivel: 2, tipo: 'moldura' },
    { id: 'titulo-curioso', nivel: 3, tipo: 'titulo' },
    { id: 'moldura-nivel-5', nivel: 5, tipo: 'moldura' },
    { id: 'titulo-mente-afiada', nivel: 8, tipo: 'titulo' },
  ] as const,
}

export const MISSOES_SEMANAIS = [
  { id: 'semana-perguntas-50', titulo: 'Curioso da semana', descricao: 'Responda a 50 perguntas nesta semana.', metrica: 'perguntasRespondidas', meta: 50, xp: 50, moedas: RECOMPENSAS.moedasMissaoSemanal },
  { id: 'semana-categorias-5', titulo: 'Passeio pelos temas', descricao: 'Jogue em 5 categorias diferentes nesta semana.', metrica: 'categoriasDiferentes', meta: 5, xp: 40, moedas: RECOMPENSAS.moedasMissaoSemanal },
] as const
