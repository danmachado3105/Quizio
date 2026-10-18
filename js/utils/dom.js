/**
 * Cria um elemento HTML de forma segura.
 * Textos entram por textContent e filhos do tipo string viram nós de texto,
 * então nada digitado pelo usuário é interpretado como HTML.
 *
 * opcoes: { classe, texto, atributos: {nome: valor}, aoClicar }
 */
export function criarElemento(tag, opcoes = {}, filhos = []) {
  const { classe, texto, atributos = {}, aoClicar } = opcoes;
  const elemento = document.createElement(tag);

  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;

  for (const [nome, valor] of Object.entries(atributos)) {
    if (valor === null || valor === undefined || valor === false) continue;
    elemento.setAttribute(nome, valor === true ? "" : String(valor));
  }

  if (aoClicar) elemento.addEventListener("click", aoClicar);

  for (const filho of [].concat(filhos)) {
    if (filho) elemento.append(filho);
  }

  return elemento;
}

/** Atalho para document.getElementById */
export function porId(id) {
  return document.getElementById(id);
}