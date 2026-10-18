/** Data local no formato AAAA-MM-DD (usada para missões e desafio diário). */
export function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** "Bom dia", "Boa tarde" ou "Boa noite" conforme a hora local. */
export function saudacaoPorHora(data = new Date()) {
  const hora = data.getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

/** Data curta para listas, por exemplo "18 de out.". */
export function formatarDataCurta(valor) {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

/** Data longa do dia atual, por exemplo "domingo, 18 de outubro". */
export function formatarDataLonga(data = new Date()) {
  return data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

export function formatarNumero(numero) {
  return Number(numero || 0).toLocaleString("pt-BR");
}

/** Percentual inteiro ("70%"). Retorna "—" quando ainda não há dados. */
export function formatarPercentual(parte, total) {
  if (!total) return "—";
  return `${Math.round((parte / total) * 100)}%`;
}