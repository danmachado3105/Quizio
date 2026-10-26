/*
 * Semana ISO no horário LOCAL (usada pelas missões semanais).
 * A semana começa na segunda-feira, e a semana 1 é a que contém a
 * primeira quinta-feira do ano. Exemplo de resultado: "2026-W44".
 */
const MS_POR_SEMANA = 7 * 24 * 60 * 60 * 1000;

/** Quinta-feira da semana da data informada (meia-noite local). */
function quintaDaSemana(data) {
  const dia = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const posicao = (dia.getDay() + 6) % 7; // segunda = 0 ... domingo = 6
  dia.setDate(dia.getDate() - posicao + 3);
  return dia;
}

export function semanaISOLocal(data = new Date()) {
  const quinta = quintaDaSemana(data);
  const ano = quinta.getFullYear();

  // 4 de janeiro está sempre na semana 1
  const quintaDaSemana1 = quintaDaSemana(new Date(ano, 0, 4));
  const semana = 1 + Math.round((quinta - quintaDaSemana1) / MS_POR_SEMANA);

  return `${ano}-W${String(semana).padStart(2, "0")}`;
}