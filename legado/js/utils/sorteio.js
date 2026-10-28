/**
 * Embaralha uma lista (Fisher-Yates) sem alterar a original.
 * "aleatorio" é opcional: passe um gerador com semente (criarGerador) para
 * obter sempre a mesma ordem, como no desafio diário.
 */
export function embaralhar(lista, aleatorio = Math.random) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Identificador único para partidas (evita registrar a mesma partida duas vezes). */
export function gerarId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Transforma um texto em um número inteiro (o mesmo texto sempre dá o mesmo número). */
export function gerarSemente(texto) {
  let hash = 2166136261; // FNV-1a de 32 bits
  for (let i = 0; i < texto.length; i += 1) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Gerador pseudoaleatório com semente (mulberry32).
 * Retorna uma função que devolve números entre 0 e 1, sempre na mesma
 * sequência para a mesma semente.
 */
export function criarGerador(semente) {
  let estado = semente >>> 0;
  return function proximo() {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}