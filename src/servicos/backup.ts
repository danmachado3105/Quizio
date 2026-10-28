import { atualizarDados, obterDados } from './armazenamento'
import type { DadosQuizio } from '../tipos'

const LIMITE_BYTES = 1_000_000
const ehObjeto = (valor: unknown): valor is Record<string, unknown> => typeof valor === 'object' && valor !== null && !Array.isArray(valor)

export function exportarProgresso(): string {
  return JSON.stringify({ produto: 'Quizio', exportadoEm: new Date().toISOString(), dados: obterDados() }, null, 2)
}

function validarDados(valor: unknown): valor is DadosQuizio {
  if (!ehObjeto(valor) || valor.versao !== 5) return false
  if (!ehObjeto(valor.perfil) || typeof valor.perfil.nome !== 'string' || valor.perfil.nome.length < 2 || valor.perfil.nome.length > 20 || typeof valor.perfil.avatar !== 'string') return false
  if (!ehObjeto(valor.progresso) || typeof valor.progresso.xp !== 'number' || !Number.isFinite(valor.progresso.xp) || valor.progresso.xp < 0) return false
  if (typeof valor.moedas !== 'number' || !Number.isInteger(valor.moedas) || valor.moedas < 0) return false
  if (!ehObjeto(valor.estatisticas) || !Array.isArray(valor.historico) || valor.historico.length > 50 || !Array.isArray(valor.registroDePartidas) || valor.registroDePartidas.length > 200) return false
  if (!Array.isArray(valor.favoritas) || valor.favoritas.length > 23 || !Array.isArray(valor.diasJogados) || valor.diasJogados.length > 400 || !valor.diasJogados.every((dia) => typeof dia === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dia))) return false
  if (!Array.isArray(valor.itensDesbloqueados) || !ehObjeto(valor.itensEquipados) || !ehObjeto(valor.medalhas) || !ehObjeto(valor.missoes) || !ehObjeto(valor.missoesSemanais) || !ehObjeto(valor.desafioDiario)) return false
  if (!Object.values(valor.medalhas).every((grau) => ['bronze', 'prata', 'ouro'].includes(String(grau)))) return false
  return true
}

export function importarProgresso(texto: string): { sucesso: true } | { sucesso: false; mensagem: string } {
  if (new TextEncoder().encode(texto).byteLength > LIMITE_BYTES) return { sucesso: false, mensagem: 'O arquivo ultrapassa o limite de 1 MB.' }
  let arquivo: unknown
  try { arquivo = JSON.parse(texto) as unknown } catch { return { sucesso: false, mensagem: 'Este arquivo não contém JSON válido.' } }
  if (!ehObjeto(arquivo) || arquivo.produto !== 'Quizio' || !validarDados(arquivo.dados)) return { sucesso: false, mensagem: 'O arquivo não segue o formato de exportação do Quizio.' }
  const atual = obterDados()
  try { localStorage.setItem('quizio:v1:pre-import', JSON.stringify(atual)) } catch { return { sucesso: false, mensagem: 'Não foi possível criar uma cópia de segurança neste navegador.' } }
  atualizarDados((dados) => Object.assign(dados, structuredClone(arquivo.dados)))
  return { sucesso: true }
}
