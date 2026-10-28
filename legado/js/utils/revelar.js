import { animarNumero, prefereMovimentoReduzido } from "./animacao.js";
import { formatarNumero } from "./formatacao.js";

/*
 * Revelação ao rolar. Dois atributos HTML:
 *   data-revelar           -> o elemento aparece (fade + subida) ao entrar na tela
 *   data-contar="42"       -> o número "sobe" até 42 ao entrar na tela
 *                             (opcional: data-sufixo="%")
 * Com movimento reduzido, tudo aparece de uma vez, sem animação.
 */
function contar(elemento) {
  const alvo = Number(elemento.dataset.contar);
  if (!Number.isFinite(alvo)) return;

  const sufixo = elemento.dataset.sufixo ?? "";
  animarNumero(elemento, {
    de: 0,
    para: alvo,
    duracaoMs: 1100,
    formatar: (valor) => `${formatarNumero(valor)}${sufixo}`,
  });
}

function mostrar(elemento) {
  elemento.classList.add("revelado");
  if (elemento.dataset.contar !== undefined) contar(elemento);
}

export function iniciarRevelacao(raiz = document) {
  const alvos = [...raiz.querySelectorAll("[data-revelar], [data-contar]")];

  if (prefereMovimentoReduzido() || !("IntersectionObserver" in window)) {
    alvos.forEach(mostrar);
    return;
  }

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        mostrar(entrada.target);
        obs.unobserve(entrada.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  alvos.forEach((alvo) => observador.observe(alvo));
}