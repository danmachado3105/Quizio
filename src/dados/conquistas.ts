import { CATEGORIAS } from './categorias'
import { calcularNivel } from '../utilitarios/progressao'

export interface DadosConquistas {
  progresso: { xp: number }
  estatisticas: {
    partidas: number; perguntasRespondidas: number; acertos: number; melhorCombo: number
    partidasPerfeitas: number; recordesSuperados: number; melhorPontuacao: number
    porCategoria: Record<string, unknown>; perguntasPorCategoria: Record<string, number>
  }
}
export interface Conquista {
  id: string; titulo: string; descricao: string; icone: string; meta: number
  atual: (dados: DadosConquistas) => number
}

const contaCategorias = (dados: DadosConquistas) => Object.keys(dados.estatisticas.porCategoria).filter((id) => id !== 'todas').length
const categoriasRespondidas = (dados: DadosConquistas) => CATEGORIAS.filter((cat) => (dados.estatisticas.perguntasPorCategoria[cat.id] ?? 0) > 0).length

export const CONQUISTAS: Conquista[] = [
  { id: 'primeira-partida', titulo: 'Primeiros Passos', descricao: 'Conclua sua primeira partida.', icone: 'play', meta: 1, atual: (d) => d.estatisticas.partidas },
  { id: 'aquecimento', titulo: 'Aquecimento', descricao: 'Responda a 10 perguntas.', icone: 'zap', meta: 10, atual: (d) => d.estatisticas.perguntasRespondidas },
  { id: 'dez-partidas', titulo: 'Maratonista', descricao: 'Conclua 10 partidas.', icone: 'flag', meta: 10, atual: (d) => d.estatisticas.partidas },
  { id: 'combo-5', titulo: 'Mente Afiada', descricao: 'Acerte 5 perguntas seguidas.', icone: 'flame', meta: 5, atual: (d) => d.estatisticas.melhorCombo },
  { id: 'partida-perfeita', titulo: 'Perfeição', descricao: 'Termine uma partida de pelo menos 5 perguntas sem errar.', icone: 'star', meta: 1, atual: (d) => d.estatisticas.partidasPerfeitas },
  { id: 'explorador', titulo: 'Explorador', descricao: 'Conclua partidas em 5 categorias diferentes.', icone: 'compass', meta: 5, atual: contaCategorias },
  { id: 'curioso', titulo: 'Curioso', descricao: `Responda a perguntas de todas as ${CATEGORIAS.length} categorias.`, icone: 'globe', meta: CATEGORIAS.length, atual: categoriasRespondidas },
  { id: 'nivel-5', titulo: 'Subindo de Nível', descricao: 'Alcance o nível 5.', icone: 'trending-up', meta: 5, atual: (d) => calcularNivel(d.progresso.xp).nivel },
  { id: 'recordista', titulo: 'Recordista', descricao: 'Supere o seu próprio recorde de pontuação em uma categoria.', icone: 'trophy', meta: 1, atual: (d) => d.estatisticas.recordesSuperados },
  { id: 'placar-alto', titulo: 'Placar Alto', descricao: 'Faça 1.000 pontos em uma única partida.', icone: 'medal', meta: 1000, atual: (d) => d.estatisticas.melhorPontuacao },
  { id: 'centenario', titulo: 'Centenário', descricao: 'Acerte 100 perguntas ao todo.', icone: 'award', meta: 100, atual: (d) => d.estatisticas.acertos },
]

export function avaliarConquista(conquista: Conquista, dados: DadosConquistas) {
  const bruto = Number.isFinite(conquista.atual(dados)) ? conquista.atual(dados) : 0
  return { atual: Math.min(bruto, conquista.meta), meta: conquista.meta, concluida: bruto >= conquista.meta }
}
export function estaConcluida(conquista: Conquista, dados: DadosConquistas): boolean { return avaliarConquista(conquista, dados).concluida }
export function obterConquistaPorId(id: string): Conquista | null { return CONQUISTAS.find((c) => c.id === id) ?? null }
