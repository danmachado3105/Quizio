/*
 * Sequência de dias jogados.
 * Os dias são textos "AAAA-MM-DD" no horário LOCAL do jogador.
 * Este arquivo não depende de nenhum outro: só faz contas com datas.
 */
const FORMATO_DIA = /^\d{4}-\d{2}-\d{2}$/;

/** Transforma uma data em "AAAA-MM-DD" (horário local). */
export function diaLocal(data = new Date()) {
  const ano = String(data.getFullYear()).padStart(4, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** O valor é um dia real do calendário? ("2026-02-31" não é). */
export function ehDiaValido(valor) {
  if (typeof valor !== "string" || !FORMATO_DIA.test(valor)) return false;

  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

/** Dia anterior ao informado ("2027-01-01" -> "2026-12-31"). */
export function diaAnterior(dia) {
  const [ano, mes, numero] = dia.split("-").map(Number);
  return diaLocal(new Date(ano, mes - 1, numero - 1));
}

/**
 * Junta dias novos à lista: remove inválidos e repetidos, ordena
 * e mantém só os `limite` dias mais recentes. Devolve uma lista nova.
 */
export function unirDias(dias, novos, limite) {
  const conjunto = new Set([...dias, ...novos].filter(ehDiaValido));
  return [...conjunto].sort().slice(-limite);
}

/**
 * Sequência atual: quantos dias seguidos o jogador jogou.
 * Conta se ele jogou hoje OU ontem (hoje ainda dá tempo de manter a sequência).
 */
export function calcularSequenciaAtual(dias, hoje = diaLocal()) {
  const jogados = new Set(dias);
  let cursor = jogados.has(hoje) ? hoje : diaAnterior(hoje);
  let sequencia = 0;

  while (jogados.has(cursor)) {
    sequencia += 1;
    cursor = diaAnterior(cursor);
  }
  return sequencia;
}

/** Maior sequência encontrada na lista de dias. */
export function calcularMelhorSequencia(dias) {
  const ordenados = [...new Set(dias.filter(ehDiaValido))].sort();
  let melhor = 0;
  let atual = 0;
  let anterior = null;

  for (const dia of ordenados) {
    atual = anterior !== null && diaAnterior(dia) === anterior ? atual + 1 : 1;
    melhor = Math.max(melhor, atual);
    anterior = dia;
  }
  return melhor;
}

/**
 * Resumo pronto para as telas.
 * melhorSalva vem de estatisticas.melhorSequencia (guardada à parte, para não
 * se perder quando a lista de dias é cortada).
 * emRisco: tem sequência, mas ainda não jogou hoje.
 */
export function resumirSequencia(dias, melhorSalva = 0, hoje = diaLocal()) {
  const atual = calcularSequenciaAtual(dias, hoje);
  const melhor = Math.max(Number(melhorSalva) || 0, atual, calcularMelhorSequencia(dias));
  const jogouHoje = dias.includes(hoje);

  return { atual, melhor, jogouHoje, emRisco: atual > 0 && !jogouHoje };
}