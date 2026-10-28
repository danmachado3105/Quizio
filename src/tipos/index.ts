export type Dificuldade = 'facil' | 'medio' | 'dificil' | 'misto'
export type DificuldadePergunta = Exclude<Dificuldade, 'misto'>
export type ModoId = 'classico' | 'tempo' | 'sobrevivencia' | 'diario' | 'duelo'

export interface Categoria {
  id: string
  nome: string
  descricao: string
  icone: string
  cor: 'roxo' | 'coral' | 'amarelo' | 'escuro' | 'verde'
  grupo: 'saber' | 'mundo' | 'cultura' | 'diversao'
  tags: string[]
  novo?: boolean
}

export interface Grupo { id: string; nome: string }
export interface Avatar { id: string; nome: string; icone: string }
export interface Missao {
  id: string
  titulo: string
  descricao: string
  metrica: string
  meta: number
  xp: number
  moedas?: number
}

export interface RespostaPartida {
  perguntaId: string
  escolhida: number | null
  acertou: boolean
  pontos: number
  motivo: 'pulou' | 'tempo' | null
  dificuldade: DificuldadePergunta
}

export interface Pergunta {
  id: string
  categoria: string
  dificuldade: DificuldadePergunta
  enunciado: string
  alternativas: [string, string, string, string]
  correta: number
  explicacao: string
}

export interface DadosQuizio {
  versao: number
  perfil: { nome: string; avatar: string; boasVindasExibida: boolean }
  preferencias: { som: boolean; movimento: 'sistema' | 'reduzido' }
  progresso: { xp: number }
  moedas: number
  itensDesbloqueados: string[]
  itensEquipados: { moldura: string; titulo: string }
  bauDiario: { data: string; aberto: boolean; moedas: number }
  marcosSequenciaPagos: { sequenciaInicio: string; marcos: number[] }
  medalhas: Record<string, 'bronze' | 'prata' | 'ouro'>
  estatisticas: {
    partidas: number; perguntasRespondidas: number; acertos: number; melhorPontuacao: number
    melhorCombo: number; partidasPerfeitas: number; recordesSuperados: number; melhorSequencia: number
    melhorSobrevivencia: number; melhorAcertosNoTempo: number; duelosVencidos: number; diariosConcluidos: number
    partidasPorModo: Record<string, number>
    porCategoria: Record<string, { partidas: number; respondidas: number; acertos: number; melhorPontuacao: number }>
    perguntasPorCategoria: Record<string, number>
  }
  historico: Array<{ id: string; data: string; categoriaId: string; modoId: string; dificuldade: string; total: number; acertos: number; erros: number; pontuacao: number; xp: number; duracaoMs: number }>
  conquistas: Record<string, string>
  missoes: { data: string; progresso: Record<string, number>; resgatadas: Record<string, string>; categoriasHoje: string[] }
  missoesSemanais: { semana: string; progresso: Record<string, number>; resgatadas: Record<string, string>; categorias: string[] }
  desafioDiario: { ultimaData: string; acertos: number; total: number; pontuacao: number; xp: number; respostas: Array<{ perguntaId: string; escolhida: number | null; acertou: boolean }> }
  registroDePartidas: string[]
  favoritas: string[]
  diasJogados: string[]
}
