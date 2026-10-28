export type SomJogo = 'acerto' | 'erro' | 'nivel' | 'conquista' | 'clique'

export function tocarSom(tipo: SomJogo, ativado: boolean): void {
  if (!ativado || typeof window === 'undefined') return
  const Audio = window.AudioContext
  if (!Audio) return
  const contexto = new Audio()
  const agora = contexto.currentTime
  const frequencias: Record<SomJogo, number[]> = { acerto: [660, 880], erro: [220, 180], nivel: [440, 660, 880], conquista: [523, 784, 1046], clique: [440] }
  frequencias[tipo].forEach((frequencia, indice) => {
    const oscilador = contexto.createOscillator()
    const volume = contexto.createGain()
    oscilador.type = 'sine'
    oscilador.frequency.value = frequencia
    volume.gain.setValueAtTime(0.0001, agora + indice * 0.09)
    volume.gain.exponentialRampToValueAtTime(0.07, agora + indice * 0.09 + 0.015)
    volume.gain.exponentialRampToValueAtTime(0.0001, agora + indice * 0.09 + 0.16)
    oscilador.connect(volume); volume.connect(contexto.destination)
    oscilador.start(agora + indice * 0.09); oscilador.stop(agora + indice * 0.09 + 0.17)
  })
  window.setTimeout(() => { void contexto.close() }, 650)
}
