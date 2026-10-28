import { criarElemento, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { AVATARES } from "../data/avatares.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { CONQUISTAS } from "../data/conquistas.js";
import { MODOS } from "../data/modos.js";
import { confirmarAcao } from "../components/modal.js";
import { criarAvatar } from "../components/avatar.js";
import {
  criarBarraProgresso,
  criarCardDado,
  criarEstadoVazio,
  criarItemConquista,
  criarItemHistorico,
} from "../components/card.js";
import { abandonarPartida, limparResultado } from "../services/partida.js";
import { obterDados, obterStatusArmazenamento, redefinirDados, salvarPerfil } from "../services/storage.js";
import { calcularNivel } from "../utils/progressao.js";
import { diaLocal, resumirSequencia } from "../utils/sequencia.js";
import { formatarDataCurta, formatarNumero, formatarPercentual } from "../utils/formatacao.js";

const MAX_CATEGORIAS = 5;
const MAX_CONQUISTAS = 6;
const MAX_PARTIDAS = 10;
const DIAS_NO_CALENDARIO = 14;

const VISUAL_DOS_MODOS = {
  classico: { icone: "book-open", cor: "roxo" },
  tempo: { icone: "timer", cor: "coral" },
  sobrevivencia: { icone: "shield", cor: "verde" },
  diario: { icone: "calendar", cor: "amarelo" },
  duelo: { icone: "swords", cor: "escuro" },
};

const plural = (numero, singular, varios) => `${formatarNumero(numero)} ${numero === 1 ? singular : varios}`;

function renderizarCabecalho(dados) {
  const { nivel, xpNoNivel, xpNecessario, percentual } = calcularNivel(dados.progresso.xp);

  porId("perfil-cabecalho").replaceChildren(
    criarAvatar(dados.perfil.avatar, 72),
    criarElemento("div", { classe: "perfil__resumo" }, [
      criarElemento("h1", { classe: "perfil__nome", texto: dados.perfil.nome, atributos: { id: "perfil-nome" } }),
      criarElemento("p", {
        classe: "texto-suave",
        texto: `Nível ${nivel} · ${formatarNumero(dados.progresso.xp)} XP no total`,
      }),
      criarBarraProgresso({ percentual, rotulo: `Progresso para o nível ${nivel + 1}` }),
      criarElemento("p", {
        classe: "texto-pequeno texto-suave",
        texto: `${formatarNumero(xpNoNivel)} / ${formatarNumero(xpNecessario)} XP para o nível ${nivel + 1}`,
      }),
    ])
  );
}

function renderizarAvisos() {
  const status = obterStatusArmazenamento();
  const mensagens = [];

  if (!status.disponivel) {
    mensagens.push("Seu navegador está bloqueando o armazenamento local. O progresso não será salvo depois que você fechar a página.");
  }
  if (status.gravacaoBloqueada) {
    mensagens.push("Foram encontrados dados de uma versão mais nova do Quizio. Para não perdê-los, esta versão não salva alterações.");
  }
  if (status.recuperadoDeErro) {
    mensagens.push("Não foi possível ler os dados salvos anteriormente. Uma cópia foi guardada e o progresso recomeçou do zero.");
  }

  porId("perfil-avisos").replaceChildren(
    ...mensagens.map((texto) => criarElemento("p", { classe: "aviso", texto, atributos: { role: "alert" } }))
  );
}

/** Estado inicial: aparece só enquanto o jogador ainda não concluiu nenhuma partida. */
function renderizarSugestao(dados, base) {
  const alvo = porId("perfil-sugestao");
  if (dados.estatisticas.partidas > 0) {
    alvo.replaceChildren();
    return;
  }

  alvo.replaceChildren(
    criarElemento("section", { classe: "card" }, [
      criarEstadoVazio({
        icone: "rocket",
        titulo: "Sua jornada começa aqui",
        texto: "Conclua a primeira partida para ganhar XP, subir de nível e desbloquear conquistas.",
      }),
      criarElemento("div", { classe: "sugestao__acoes" }, [
        criarElemento("a", {
          classe: "botao botao--primario",
          atributos: { href: `${base}pages/categorias.html` },
        }, [criarIcone("play", 18), "Jogar agora"]),
      ]),
    ])
  );
}

function renderizarEstatisticas(dados) {
  const { partidas, perguntasRespondidas, acertos, melhorPontuacao, melhorCombo } = dados.estatisticas;
  const erros = Math.max(0, perguntasRespondidas - acertos);

  porId("perfil-estatisticas").replaceChildren(
    criarCardDado({ icone: "flag", cor: "roxo", valor: formatarNumero(partidas), rotulo: "Partidas concluídas" }),
    criarCardDado({ icone: "zap", cor: "amarelo", valor: formatarNumero(perguntasRespondidas), rotulo: "Perguntas respondidas" }),
    criarCardDado({ icone: "check", cor: "verde", valor: formatarNumero(acertos), rotulo: "Respostas corretas" }),
    criarCardDado({ icone: "x", cor: "coral", valor: formatarNumero(erros), rotulo: "Respostas incorretas" }),
    criarCardDado({ icone: "percent", cor: "roxo", valor: formatarPercentual(acertos, perguntasRespondidas), rotulo: "Taxa de acerto" }),
    criarCardDado({ icone: "trophy", cor: "amarelo", valor: formatarNumero(melhorPontuacao), rotulo: "Melhor pontuação" }),
    criarCardDado({ icone: "flame", cor: "coral", valor: formatarNumero(melhorCombo), rotulo: "Melhor combo" }),
    criarCardDado({ icone: "trending-up", cor: "verde", valor: formatarNumero(dados.progresso.xp), rotulo: "XP acumulado" })
  );
}

/** Dias seguidos de jogo e os últimos 14 dias. */
function renderizarSequencia(dados) {
  const sequencia = resumirSequencia(dados.diasJogados, dados.estatisticas.melhorSequencia, diaLocal());
  const jogados = new Set(dados.diasJogados);

  let frase = "Jogue hoje para começar uma sequência de dias.";
  if (sequencia.atual > 0) {
    frase = sequencia.emRisco
      ? "Jogue hoje para não perder a sequência."
      : "Você já jogou hoje. Volte amanhã para continuar.";
  }

  const quadrados = Array.from({ length: DIAS_NO_CALENDARIO }, (_, indice) => {
    const data = new Date();
    data.setDate(data.getDate() - (DIAS_NO_CALENDARIO - 1 - indice));
    const jogou = jogados.has(diaLocal(data));
    const rotuloDoDia = formatarDataCurta(data);

    return criarElemento(
      "li",
      {
        classe: "dia-quadrado",
        atributos: {
          "data-jogou": String(jogou),
          "data-hoje": String(indice === DIAS_NO_CALENDARIO - 1),
          title: rotuloDoDia,
        },
      },
      [criarElemento("span", { classe: "sr-only", texto: `${rotuloDoDia}: ${jogou ? "jogou" : "não jogou"}` })]
    );
  });

  porId("perfil-sequencia").replaceChildren(
    criarElemento("div", { classe: "sequencia" }, [
      criarElemento("div", { classe: "sequencia__topo" }, [
        criarElemento("span", { classe: "sequencia__numero", texto: String(sequencia.atual) }),
        criarElemento("span", {
          classe: "sequencia__rotulo",
          texto: sequencia.atual === 1 ? "dia seguido" : "dias seguidos",
        }),
      ]),
      criarElemento("p", { classe: "texto-suave texto-pequeno", texto: frase }),
      criarElemento("p", {
        classe: "texto-pequeno",
        texto: `Sua melhor sequência: ${plural(sequencia.melhor, "dia", "dias")}.`,
      }),
      criarElemento("ol", { classe: "dias-recentes", atributos: { "aria-label": `Últimos ${DIAS_NO_CALENDARIO} dias` } }, quadrados),
      criarElemento("p", { classe: "dias-legenda rotulo", atributos: { "aria-hidden": "true" } }, [
        criarElemento("span", { texto: `${DIAS_NO_CALENDARIO} dias atrás` }),
        criarElemento("span", { texto: "hoje" }),
      ]),
    ])
  );
}

/** Resumo de cada modo (partidas e melhor resultado). */
function descreverModo(modoId, partidas, estatisticas) {
  if (modoId === "diario") {
    return estatisticas.diariosConcluidos === 0
      ? "Ainda não jogado"
      : plural(estatisticas.diariosConcluidos, "desafio concluído", "desafios concluídos");
  }
  if (partidas === 0) return "Ainda não jogado";

  switch (modoId) {
    case "tempo":
      return `${plural(partidas, "partida", "partidas")} · melhor: ${plural(estatisticas.melhorAcertosNoTempo, "acerto", "acertos")}`;
    case "sobrevivencia":
      return `${plural(partidas, "partida", "partidas")} · melhor sequência: ${plural(estatisticas.melhorSobrevivencia, "acerto", "acertos")}`;
    case "duelo":
      return `${plural(partidas, "duelo", "duelos")} · ${plural(estatisticas.duelosVencidos, "vitória", "vitórias")}`;
    default:
      return plural(partidas, "partida", "partidas");
  }
}

function renderizarModos(dados) {
  const { estatisticas } = dados;

  // Partidas anteriores à contagem por modo eram todas do Clássico
  const dosOutros = Object.entries(estatisticas.partidasPorModo)
    .filter(([modoId]) => modoId !== "classico")
    .reduce((soma, [, quantidade]) => soma + quantidade, 0);
  const partidasPorModo = {
    ...estatisticas.partidasPorModo,
    classico: Math.max(0, estatisticas.partidas - dosOutros),
  };

  porId("perfil-modos").replaceChildren(
    criarElemento(
      "ul",
      { classe: "lista" },
      MODOS.map((modo) => {
        const visual = VISUAL_DOS_MODOS[modo.id] ?? { icone: "star", cor: "cinza" };
        return criarElemento("li", { classe: "item" }, [
          criarElemento("span", { classe: `icone-caixa icone-caixa--${visual.cor}` }, [criarIcone(visual.icone, 22)]),
          criarElemento("div", { classe: "item__corpo" }, [
            criarElemento("p", { classe: "item__titulo", texto: modo.nome }),
            criarElemento("p", {
              classe: "item__detalhe",
              texto: descreverModo(modo.id, partidasPorModo[modo.id] ?? 0, estatisticas),
            }),
          ]),
        ]);
      })
    )
  );
}

/** Categorias com mais perguntas respondidas (inclui perguntas vindas de "Todas as categorias"). */
function renderizarCategorias(dados) {
  const ranking = Object.entries(dados.estatisticas.perguntasPorCategoria)
    .map(([id, respondidas]) => ({ categoria: obterCategoriaPorId(id), respondidas: Number(respondidas) || 0 }))
    .filter((item) => item.categoria && item.respondidas > 0)
    .sort((a, b) => b.respondidas - a.respondidas)
    .slice(0, MAX_CATEGORIAS);

  const alvo = porId("perfil-categorias");

  if (ranking.length === 0) {
    alvo.replaceChildren(
      criarEstadoVazio({
        icone: "grid",
        titulo: "Nenhuma categoria ainda",
        texto: "As categorias que você mais joga vão aparecer aqui.",
      })
    );
    return;
  }

  const maximo = ranking[0].respondidas;
  alvo.replaceChildren(
    criarElemento(
      "ul",
      { classe: "lista-categorias" },
      ranking.map(({ categoria, respondidas }) =>
        criarElemento("li", { classe: "categoria-linha" }, [
          criarElemento("div", { classe: "categoria-linha__topo" }, [
            criarElemento("span", { classe: "categoria-linha__nome" }, [criarIcone(categoria.icone, 18), categoria.nome]),
            criarElemento("span", {
              classe: "texto-suave texto-pequeno",
              texto: `${formatarNumero(respondidas)} ${respondidas === 1 ? "pergunta" : "perguntas"}`,
            }),
          ]),
          criarBarraProgresso({ percentual: (respondidas / maximo) * 100, rotulo: `Perguntas em ${categoria.nome}` }),
        ])
      )
    )
  );
}

function renderizarConquistas(dados) {
  const desbloqueadas = CONQUISTAS.filter((conquista) => dados.conquistas[conquista.id])
    .sort((a, b) => new Date(dados.conquistas[b.id]) - new Date(dados.conquistas[a.id]));

  const alvo = porId("perfil-conquistas");

  if (desbloqueadas.length === 0) {
    alvo.replaceChildren(
      criarEstadoVazio({
        icone: "award",
        titulo: "Nenhuma conquista ainda",
        texto: "Jogue algumas partidas para desbloquear a primeira.",
      })
    );
    return;
  }

  alvo.replaceChildren(
    criarElemento("p", {
      classe: "texto-suave texto-pequeno",
      texto: `${desbloqueadas.length} de ${CONQUISTAS.length} conquistas`,
      atributos: { style: "margin-bottom:0.75rem" },
    }),
    criarElemento(
      "ul",
      { classe: "lista" },
      desbloqueadas.slice(0, MAX_CONQUISTAS).map((conquista) => criarItemConquista(conquista, dados.conquistas[conquista.id]))
    )
  );
}

function renderizarHistorico(dados) {
  const alvo = porId("perfil-historico");
  const recentes = dados.historico.slice(0, MAX_PARTIDAS);

  if (recentes.length === 0) {
    alvo.replaceChildren(
      criarEstadoVazio({
        icone: "history",
        titulo: "Sem partidas por aqui",
        texto: "Suas últimas partidas, com pontos e XP, vão aparecer aqui.",
      })
    );
    return;
  }

  alvo.replaceChildren(criarElemento("ul", { classe: "lista" }, recentes.map(criarItemHistorico)));
}

function renderizarAvatares(selecionado) {
  porId("opcoes-avatar").replaceChildren(
    ...AVATARES.map((avatar) =>
      criarElemento("label", { classe: "avatar-opcao" }, [
        criarElemento("input", {
          classe: "avatar-opcao__input",
          atributos: { type: "radio", name: "avatar", value: avatar.id, checked: avatar.id === selecionado },
        }),
        criarElemento("span", { classe: "avatar-opcao__visual" }, [
          criarAvatar(avatar.id, 48),
          criarElemento("span", { classe: "avatar-opcao__nome", texto: avatar.nome }),
        ]),
      ])
    )
  );
}

function mostrarMensagem(texto, tipo) {
  const alvo = porId("mensagem-perfil");
  alvo.textContent = texto;
  alvo.className = `mensagem-perfil${tipo ? ` mensagem-perfil--${tipo}` : ""}`;
}

/** Desenha a página inteira a partir dos dados salvos (única fonte de informação). */
function renderizarTudo(base) {
  const dados = obterDados();
  renderizarCabecalho(dados);
  renderizarAvisos();
  renderizarSugestao(dados, base);
  renderizarEstatisticas(dados);
  renderizarSequencia(dados);
  renderizarModos(dados);
  renderizarCategorias(dados);
  renderizarConquistas(dados);
  renderizarHistorico(dados);
}

function prepararFormulario(base) {
  const formulario = porId("form-perfil");
  const campoNome = porId("campo-nome");
  const dados = obterDados();

  campoNome.value = dados.perfil.nome;
  renderizarAvatares(dados.perfil.avatar);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultado = salvarPerfil({
      nome: campoNome.value,
      avatar: new FormData(formulario).get("avatar"),
    });

    if (!resultado.sucesso) {
      mostrarMensagem(resultado.mensagem, "erro");
      campoNome.focus();
      return;
    }

    campoNome.value = resultado.nome;
    mostrarMensagem("Alterações salvas.", "ok");
    renderizarCabecalho(obterDados());
  });

  porId("botao-redefinir").addEventListener("click", async () => {
    const confirmou = await confirmarAcao({
      titulo: "Redefinir todo o progresso?",
      mensagem:
        "Isso apaga XP, nível, estatísticas, histórico, conquistas, missões, sequência de dias, favoritas, nome e avatar deste navegador. Não dá para desfazer.",
      rotuloConfirmar: "Apagar tudo",
      rotuloCancelar: "Cancelar",
      perigo: true,
    });
    if (!confirmou) return;

    redefinirDados();
    abandonarPartida();
    limparResultado();

    const novos = obterDados();
    campoNome.value = novos.perfil.nome;
    renderizarAvatares(novos.perfil.avatar);
    renderizarTudo(base);
    mostrarMensagem("Progresso redefinido.", "ok");
  });
}

/** Chamada pelo app.js quando a página de perfil é carregada. */
export function iniciar({ base }) {
  renderizarTudo(base);
  prepararFormulario(base);
}