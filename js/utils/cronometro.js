import { criarElemento } from "./dom.js";

/*
 * Cronômetro regressivo.
 *
 * Em vez de contar "ticks", guarda o instante em que o tempo acaba
 * (performance.now() + restante) e sempre recalcula a diferença. Por isso:
 *  - não "atrasa" se o navegador demorar para desenhar um quadro
 *  - continua certo com a aba em segundo plano (o tempo não congela)
 *  - o fim é garantido por um setTimeout, já que requestAnimationFrame
 *    para de rodar quando a aba fica escondida
 *
 * Uso:
 *   const cronometro = criarCronometro({
 *     duracaoMs: 20000,
 *     aoTick: (restanteMs, totalMs) => { ... },  // a cada quadro de animação
 *     aoFim: () => { ... },                      // uma única vez, quando chega a zero
 *   });
 *   cronometro.iniciar();
 *   cronometro.pausar();
 *   cronometro.retomar();
 *   cronometro.parar();   // descarta sem chamar aoFim
 *
 * restanteMs (opcional) permite começar com menos que a duração total,
 * por exemplo ao restaurar uma pergunta depois de atualizar a página.
 */
export function criarCronometro({ duracaoMs, restanteMs = duracaoMs, aoTick, aoFim }) {
  const total = Math.max(0, Number(duracaoMs) || 0);
  let restante = Math.min(total, Math.max(0, Number(restanteMs) || 0));
  let fimEm = 0;
  let rodando = false;
  let encerrado = false;
  let quadro = null;
  let temporizador = null;

  const avisar = () => aoTick?.(restante, total);

  function cancelarAgendamentos() {
    if (quadro !== null) {
      cancelAnimationFrame(quadro);
      quadro = null;
    }
    if (temporizador !== null) {
      clearTimeout(temporizador);
      temporizador = null;
    }
  }

  function atualizarRestante() {
    restante = Math.max(0, fimEm - performance.now());
  }

  function terminar() {
    if (!rodando) return;
    rodando = false;
    encerrado = true;
    restante = 0;
    cancelarAgendamentos();
    document.removeEventListener("visibilitychange", sincronizar);
    avisar();
    aoFim?.();
  }

  /** Um quadro de animação: atualiza o visual e agenda o próximo. */
  function quadroDeAnimacao() {
    quadro = null;
    if (!rodando) return;

    atualizarRestante();
    if (restante <= 0) {
      terminar();
      return;
    }
    avisar();
    quadro = requestAnimationFrame(quadroDeAnimacao);
  }

  /** Rede de segurança: encerra no instante certo mesmo com a aba escondida. */
  function agendarFim() {
    const falta = Math.max(0, fimEm - performance.now());
    temporizador = setTimeout(() => {
      temporizador = null;
      if (!rodando) return;
      if (performance.now() < fimEm) {
        agendarFim(); // disparou um pouco cedo: espera o que falta
        return;
      }
      terminar();
    }, falta);
  }

  /** Ao voltar para a aba, o visual é atualizado na hora. */
  function sincronizar() {
    if (document.visibilityState !== "visible" || !rodando) return;
    if (quadro !== null) cancelAnimationFrame(quadro);
    quadroDeAnimacao();
  }

  function iniciar() {
    if (rodando || encerrado) return;
    rodando = true;

    if (restante <= 0) {
      terminar();
      return;
    }

    fimEm = performance.now() + restante;
    document.addEventListener("visibilitychange", sincronizar);
    agendarFim();
    quadroDeAnimacao();
  }

  function pausar() {
    if (!rodando) return;
    atualizarRestante();
    rodando = false;
    cancelarAgendamentos();
    document.removeEventListener("visibilitychange", sincronizar);
    avisar();
  }

  function parar() {
    rodando = false;
    encerrado = true;
    cancelarAgendamentos();
    document.removeEventListener("visibilitychange", sincronizar);
  }

  function obterRestanteMs() {
    if (rodando) atualizarRestante();
    return restante;
  }

  return {
    iniciar,
    pausar,
    retomar: iniciar,
    parar,
    obterRestanteMs,
    estaRodando: () => rodando,
  };
}

/**
 * Visual do tempo: uma barra que encolhe (só transform) e os segundos restantes.
 * Os estilos (.tempo, .tempo__preenchimento...) ficam em css/pages/jogo.css.
 * Retorna { elemento, atualizar(restanteMs, totalMs) }.
 */
export function criarBarraDeTempo() {
  const preenchimento = criarElemento("span", { classe: "tempo__preenchimento" });
  const texto = criarElemento("span", { classe: "tempo__texto", atributos: { "aria-hidden": "true" } });

  const elemento = criarElemento(
    "div",
    { classe: "tempo", atributos: { role: "timer", "aria-label": "Tempo restante", "data-urgencia": "baixa" } },
    [criarElemento("span", { classe: "tempo__trilho", atributos: { "aria-hidden": "true" } }, [preenchimento]), texto]
  );

  function atualizar(restanteMs, totalMs) {
    const fracao = totalMs > 0 ? Math.min(1, Math.max(0, restanteMs / totalMs)) : 0;
    preenchimento.style.transform = `scaleX(${fracao.toFixed(4)})`;
    texto.textContent = `${Math.ceil(restanteMs / 1000)}s`;

    const urgencia = fracao <= 0.25 ? "alta" : fracao <= 0.5 ? "media" : "baixa";
    if (elemento.dataset.urgencia !== urgencia) elemento.dataset.urgencia = urgencia;
  }

  return { elemento, atualizar };
}