/** O usuário pediu menos movimento no sistema? */
export function prefereMovimentoReduzido() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/** Faz um número "subir" de "de" até "para". Com movimento reduzido, mostra direto o valor final. */
export function animarNumero(elemento, { de = 0, para, duracaoMs = 900, formatar = String }) {
  if (prefereMovimentoReduzido() || de === para) {
    elemento.textContent = formatar(para);
    return;
  }

  elemento.textContent = formatar(de);
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min(1, (agora - inicio) / duracaoMs);
    const suave = 1 - Math.pow(1 - progresso, 3);
    elemento.textContent = formatar(Math.round(de + (para - de) * suave));
    if (progresso < 1) requestAnimationFrame(passo);
  }

  requestAnimationFrame(passo);
}

/**
 * Anima o preenchimento da barra de XP de "de"% até "para"%.
 * Se subiu de nível, enche até 100% e recomeça do zero até o novo percentual.
 */
export function animarBarra(preenchimento, { de, para, passouDeNivel = false }) {
  preenchimento.style.width = `${de}%`;

  if (prefereMovimentoReduzido()) {
    preenchimento.style.width = `${para}%`;
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      preenchimento.style.width = passouDeNivel ? "100%" : `${para}%`;
    });
  });

  if (passouDeNivel) {
    setTimeout(() => {
      preenchimento.style.transition = "none";
      preenchimento.style.width = "0%";
      void preenchimento.offsetWidth; // força o navegador a aplicar o 0%
      preenchimento.style.transition = "";
      preenchimento.style.width = `${para}%`;
    }, 800);
  }
}