import { criarElemento } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { definirNomeJogador, NOME_PADRAO } from "../services/storage.js";

const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

let modalAtual = null;

/** Mantém o foco dentro do modal e fecha com Esc. */
function tratarTeclado(evento) {
  if (!modalAtual) return;

  if (evento.key === "Escape") {
    evento.preventDefault();
    fecharModal();
    return;
  }

  if (evento.key !== "Tab") return;

  const focaveis = [...modalAtual.dialogo.querySelectorAll(SELETOR_FOCAVEL)];
  if (focaveis.length === 0) {
    evento.preventDefault();
    return;
  }

  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];

  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
}

/**
 * Abre um modal acessível.
 * opcoes: { titulo, conteudo (Node), fecharAoClicarFora, aoFechar }
 * Retorna { fechar }.
 */
export function abrirModal({ titulo, conteudo, fecharAoClicarFora = true, aoFechar }) {
  fecharModal();

  const elementoAnterior = document.activeElement;

  const botaoFechar = criarElemento(
    "button",
    {
      classe: "modal__fechar",
      atributos: { type: "button", "aria-label": "Fechar" },
      aoClicar: () => fecharModal(),
    },
    [criarIcone("x", 20)]
  );

  const dialogo = criarElemento(
    "div",
    {
      classe: "modal",
      atributos: { role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-titulo" },
    },
    [
      criarElemento("div", { classe: "modal__cabecalho" }, [
        criarElemento("h2", { classe: "modal__titulo", texto: titulo, atributos: { id: "modal-titulo" } }),
        botaoFechar,
      ]),
      conteudo,
    ]
  );

  const sobreposicao = criarElemento("div", { classe: "modal-sobreposicao" }, [dialogo]);

  sobreposicao.addEventListener("mousedown", (evento) => {
    if (evento.target === sobreposicao && fecharAoClicarFora) fecharModal();
  });

  modalAtual = { sobreposicao, dialogo, elementoAnterior, aoFechar };
  document.addEventListener("keydown", tratarTeclado);
  document.body.classList.add("modal-aberto");
  document.body.append(sobreposicao);

  const alvoInicial = dialogo.querySelector("[data-autofocus]") ?? dialogo.querySelector(SELETOR_FOCAVEL);
  alvoInicial?.focus();

  return { fechar: fecharModal };
}

export function fecharModal() {
  if (!modalAtual) return;

  const { sobreposicao, elementoAnterior, aoFechar } = modalAtual;
  modalAtual = null; // evita chamadas repetidas durante o fechamento

  document.removeEventListener("keydown", tratarTeclado);
  document.body.classList.remove("modal-aberto");
  sobreposicao.remove();

  if (elementoAnterior && typeof elementoAnterior.focus === "function") {
    elementoAnterior.focus();
  }
  if (aoFechar) aoFechar();
}

/**
 * Pede confirmação ao jogador. Retorna uma Promise<boolean>.
 * Fechar com Esc, no X ou fora do modal conta como "cancelar".
 */
export function confirmarAcao({
  titulo,
  mensagem,
  rotuloConfirmar = "Confirmar",
  rotuloCancelar = "Cancelar",
  perigo = false,
}) {
  return new Promise((resolver) => {
    let decidido = false;

    const decidir = (confirmado) => {
      if (decidido) return;
      decidido = true;
      resolver(confirmado);
      fecharModal();
    };

    const conteudo = criarElemento("div", {}, [
      criarElemento("p", { texto: mensagem, classe: "texto-suave" }),
      criarElemento("div", { classe: "modal__acoes" }, [
        criarElemento("button", {
          classe: "botao botao--contorno",
          texto: rotuloCancelar,
          atributos: { type: "button", "data-autofocus": true },
          aoClicar: () => decidir(false),
        }),
        criarElemento("button", {
          classe: `botao ${perigo ? "botao--perigo" : "botao--primario"}`,
          texto: rotuloConfirmar,
          atributos: { type: "button" },
          aoClicar: () => decidir(true),
        }),
      ]),
    ]);

    abrirModal({ titulo, conteudo, aoFechar: () => decidir(false) });
  });
}

/** Modal para o jogador escolher ou alterar o nome. */
export function abrirModalNome({ nomeAtual = "", aoSalvar } = {}) {
  let modal = null;

  const campo = criarElemento("input", {
    classe: "campo__input",
    atributos: {
      id: "campo-nome",
      type: "text",
      maxlength: 20,
      minlength: 2,
      required: true,
      autocomplete: "nickname",
      value: nomeAtual === NOME_PADRAO ? "" : nomeAtual,
      "aria-describedby": "campo-nome-erro",
      "data-autofocus": true,
    },
  });

  const erro = criarElemento("p", {
    classe: "campo__erro",
    atributos: { id: "campo-nome-erro", role: "alert" },
  });

  const formulario = criarElemento("form", { atributos: { novalidate: true } }, [
    criarElemento("label", { classe: "campo__rotulo", texto: "Como devemos te chamar?", atributos: { for: "campo-nome" } }),
    campo,
    criarElemento("p", { classe: "campo__ajuda", texto: "De 2 a 20 caracteres. Você pode mudar depois." }),
    erro,
    criarElemento("div", { classe: "modal__acoes" }, [
      criarElemento("button", {
        classe: "botao botao--contorno",
        texto: "Agora não",
        atributos: { type: "button" },
        aoClicar: () => modal.fechar(),
      }),
      criarElemento("button", { classe: "botao botao--primario", texto: "Salvar", atributos: { type: "submit" } }),
    ]),
  ]);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const resultado = definirNomeJogador(campo.value);

    if (!resultado.sucesso) {
      erro.textContent = resultado.mensagem;
      campo.focus();
      return;
    }

    modal.fechar();
    if (aoSalvar) aoSalvar(resultado.nome);
  });

  modal = abrirModal({ titulo: "Bem-vindo ao Quizio", conteudo: formulario });
  return modal;
}