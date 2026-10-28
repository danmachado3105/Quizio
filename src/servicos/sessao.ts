const CHAVE_PARTIDA = 'quizio:partida'
const CHAVE_RESULTADO = 'quizio:resultado'
let memoriaPartida: unknown = null
let memoriaResultado: unknown = null

function ler(chave: string, memoria: unknown): unknown {
  try {
    const texto = sessionStorage.getItem(chave)
    return texto === null ? null : JSON.parse(texto) as unknown
  } catch { return memoria }
}

function gravar(chave: string, valor: unknown): void {
  const texto = JSON.stringify(valor)
  try {
    sessionStorage.setItem(chave, texto)
  } catch {
    if (chave === CHAVE_PARTIDA) memoriaPartida = structuredClone(valor)
    else memoriaResultado = structuredClone(valor)
  }
}

export function obterPartidaEmAndamento(): unknown { return ler(CHAVE_PARTIDA, memoriaPartida) }
export function salvarPartidaEmAndamento(partida: unknown): void { memoriaPartida = structuredClone(partida); gravar(CHAVE_PARTIDA, partida) }
export function limparPartidaEmAndamento(): void { memoriaPartida = null; try { sessionStorage.removeItem(CHAVE_PARTIDA) } catch { /* modo memória */ } }
export function obterUltimoResultado(): unknown { return ler(CHAVE_RESULTADO, memoriaResultado) }
export function salvarUltimoResultado(resultado: unknown): void { memoriaResultado = structuredClone(resultado); gravar(CHAVE_RESULTADO, resultado) }
export function limparUltimoResultado(): void { memoriaResultado = null; try { sessionStorage.removeItem(CHAVE_RESULTADO) } catch { /* modo memória */ } }
