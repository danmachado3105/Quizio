import { CATEGORIAS } from "../data/categorias.js";
import { PERGUNTAS } from "../data/perguntas.js";
import { dataLocalISO } from "../utils/formatacao.js";
import { QUANTIDADE_DESAFIO_DIARIO } from "../utils/pontuacao.js";
import { criarGerador, embaralhar, gerarSemente } from "../utils/sorteio.js";

/*
 * Desafio diário: as mesmas perguntas para todo mundo em cada data.
 * A data local vira a semente do sorteio, então não precisa de servidor:
 * o mesmo dia sempre gera as mesmas perguntas e a mesma ordem das alternativas.
 *
 * O desafio sobe de dificuldade (2 fáceis, 2 médias, 1 difícil) e cada pergunta
 * vem de um tema diferente. Se o banco de perguntas crescer, o sorteio de uma
 * data pode mudar; isso não afeta o jogo.
 */
const DIFICULDADES_DO_DIA = ["facil", "facil", "medio", "medio", "dificil"];

// Comparação simples (não depende do idioma do navegador)
const porId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

const escolher = (lista, aleatorio) => lista[Math.floor(aleatorio() * lista.length)];

/** Perguntas do desafio de uma data. Retorna { data, questoes: [{ id, ordem }] }. */
export function obterDesafioDoDia(data = dataLocalISO()) {
  const aleatorio = criarGerador(gerarSemente(`quizio-diario-${data}`));
  const categorias = embaralhar(CATEGORIAS.map((categoria) => categoria.id), aleatorio);

  const usadas = new Set();
  const categoriasUsadas = new Set();
  const questoes = [];

  for (let posicao = 0; posicao < QUANTIDADE_DESAFIO_DIARIO; posicao += 1) {
    const dificuldade = DIFICULDADES_DO_DIA[posicao % DIFICULDADES_DO_DIA.length];
    const candidatas = PERGUNTAS.filter(
      (pergunta) => pergunta.dificuldade === dificuldade && !usadas.has(pergunta.id)
    ).sort(porId);

    // Primeiro, a próxima categoria (na ordem sorteada) que ainda não apareceu
    let escolhida = null;
    for (const categoriaId of categorias) {
      if (categoriasUsadas.has(categoriaId)) continue;

      const doTema = candidatas.filter((pergunta) => pergunta.categoria === categoriaId);
      if (doTema.length === 0) continue;

      escolhida = escolher(doTema, aleatorio);
      break;
    }

    // Reserva: qualquer pergunta dessa dificuldade
    if (!escolhida && candidatas.length > 0) escolhida = escolher(candidatas, aleatorio);
    if (!escolhida) continue;

    usadas.add(escolhida.id);
    categoriasUsadas.add(escolhida.categoria);
    questoes.push({ id: escolhida.id, ordem: embaralhar([0, 1, 2, 3], aleatorio) });
  }

  return { data, questoes };
}