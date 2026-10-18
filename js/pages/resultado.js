import { criarElemento, porId } from "../utils/dom.js";
import { criarIcone } from "../utils/icones.js";
import { obterCategoriaPorId } from "../data/categorias.js";
import { obterConquistaPorId } from "../data/conquistas.js";
import { obterNomeDoModo } from "../data/modos.js";
import { CATEGORIA_TODAS, DIFICULDADE_MISTA, DIFICULDADES } from "../data/perguntas.js";
import { criarEstadoVazio, criarItemConquista } from "../components/card.js";
import { criarPartida, obterResultado } from "../services/partida.js";
import { formatarNumero } from "../utils/formatacao.js";

function formatarDuracao(milissegundos) {
  const totalSegundos = Math.max(0, Math.round((Number(milissegundos) || 0) / 1000));
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  const doisDigitos = (valor) => String(valor).padStart(2, "0");

  return horas > 0
    ? `${horas}:${doisDigitos(minutos)}:${doisDigitos(segundos)}`
    : `${minutos}:${doisDigitos(segundos)}`;
}

function mensagemDeDesempenho(resultado) {
  if (resultado.perfeita) return "Partida perfeita!";
  if (resultado.percentual >= 80) return "Mandou muito bem!";
  if (resultado.percentual >= 50) return "Bom resultado!";
  return "Continue praticando!";
}

function nomeDaCategoria(categoriaId) {
  return categoriaId === CATEGORIA_TODAS ? "Todas as categorias" : (obterCategoriaPorId(categoriaId)?.nome ?? "Categoria");
}

function descreverConfig(config) {
  const dificuldade =
    config.dificuldade === DIFICULDADE_MISTA
      ? "Dificuldade mista"
      : (DIFICULDADES.find((item) => item.id === config.dificuldade)?.nome ?? "");

  return [nomeDaCategoria(config.categoriaId), dificuldade, obterNomeDoModo(config.modoId)]
    .filter(Boolean)
    .join(" · ");
}

function renderizarCabecalho(resultado) {
  const itens = [
    criarElemento("span", { classe: "resultado__emblema" }, [criarIcone(resultado.perfeita ? "star" : "trophy", 36)]),
    criarElemento("h1", { classe: "resultado__titulo", texto: mensagemDeDesempenho(resultado), atributos: { id: "resultado-titulo" } }),
    criarElemento("p", { classe: "resultado__contexto", texto: descreverConfig(resultado.config) }),
    criarElemento("p", { classe: "resultado__pontos", texto: formatarNumero(resultado.pontuacao) }),
    criarElemento("p", { classe: "resultado__pontos-rotulo", texto: "pontos" }),
  ];

  if (resultado.perfeita) {
    itens.push(
      criarElemento("p", { classe: "resultado__selo" }, [
        criarElemento("span", { classe: "badge badge--destaque" }, [criarIcone("star", 14), "Partida perfeita"]),
      ])
    );
  }

  porId("resultado-hero").replaceChildren(...itens);
}

function renderizarDados(resultado) {
  const dados = [
    { icone: "check", cor: "verde", valor: String(resultado.acertos), rotulo: "Acertos" },
    { icone: "x", cor: "coral", valor: String(resultado.erros), rotulo: "Erros" },
    { icone: "percent", cor: "roxo", valor: `${Number(resultado.percentual) || 0}%`, rotulo: "Aproveitamento" },
    { icone: "clock", cor: "amarelo", valor: formatarDuracao(resultado.duracaoMs), rotulo: "Tempo total" },
    { icone: "flame", cor: "coral", valor: String(Number(resultado.melhorCombo) || 0), rotulo: "Melhor sequência" },
  ];

  porId("resultado-dados").replaceChildren(
    ...dados.map((dado) =>
      criarElemento("div", { classe: "card dado" }, [
        criarElemento("span", { classe: `icone-caixa icone-caixa--${dado.cor}` }, [criarIcone(dado.icone, 22)]),
        criarElemento("p", { classe: "dado__valor", texto: dado.valor }),
        criarElemento("p", { classe: "dado__rotulo", texto: dado.rotulo }),
      ])
    )
  );
}

function criarCardXp(resultado) {
  const detalhe = resultado.xpDetalhe;
  const linhas = [
    ["Respostas corretas", Number(detalhe.acertos) || 0],
    ["Partida concluída", Number(detalhe.conclusao) || 0],
    ["Partida perfeita", Number(detalhe.perfeita) || 0],
  ].filter(([, valor]) => valor > 0);

  const filhos = [
    criarElemento("h2", { classe: "card__titulo", texto: "XP conquistado" }),
    criarElemento("p", { classe: "xp-total", texto: `+${resultado.xp} XP` }),
    criarElemento(
      "ul",
      { classe: "lista-xp" },
      linhas.map(([rotulo, valor]) =>
        criarElemento("li", {}, [criarElemento("span", { texto: rotulo }), criarElemento("span", { texto: `+${valor}` })])
      )
    ),
  ];

  const progresso = resultado.progresso;
  if (progresso?.subiuDeNivel) {
    filhos.push(
      criarElemento("p", { classe: "destaque" }, [criarIcone("trending-up", 22), `Você subiu para o nível ${progresso.nivelNovo}!`])
    );
  } else if (progresso) {
    filhos.push(criarElemento("p", { classe: "texto-suave texto-pequeno", texto: `Você está no nível ${progresso.nivelNovo}.` }));
  }

  return criarElemento("section", { classe: "card" }, filhos);
}

function criarCardRecorde(resultado) {
  const recorde = resultado.progresso?.recorde;
  if (!recorde) return null;

  const nome = nomeDaCategoria(recorde.categoriaId);
  let texto = `Recorde em ${nome}.`;
  if (recorde.ehNovo && recorde.anterior > 0) {
    texto = `Novo recorde em ${nome}! O anterior era ${formatarNumero(recorde.anterior)} pts.`;
  } else if (recorde.ehNovo) {
    texto = `Primeiro recorde registrado em ${nome}.`;
  }

  return criarElemento("section", { classe: "card" }, [
    criarElemento("h2", { classe: "card__titulo", texto: "Recorde da categoria" }),
    criarElemento("p", { classe: "recorde__valor", texto: `${formatarNumero(recorde.atual)} pts` }),
    criarElemento("p", { classe: "recorde__texto", texto }),
  ]);
}

function renderizarProgresso(resultado) {
  const cards = [criarCardXp(resultado), criarCardRecorde(resultado)].filter(Boolean);
  porId("resultado-progresso").replaceChildren(...cards);

  const conquistas = (resultado.progresso?.novasConquistas ?? [])
    .map((id) => obterConquistaPorId(id))
    .filter(Boolean);

  const alvo = porId("resultado-conquistas");
  if (conquistas.length === 0) {
    alvo.replaceChildren();
    return;
  }

  const agora = new Date().toISOString();
  alvo.replaceChildren(
    criarElemento("section", { classe: "card" }, [
      criarElemento("h2", { classe: "card__titulo", texto: "Novas conquistas", atributos: { style: "margin-bottom:1rem" } }),
      criarElemento("ul", { classe: "lista" }, conquistas.map((conquista) => criarItemConquista(conquista, agora))),
    ])
  );
}

function renderizarAcoes(resultado, base) {
  const { config } = resultado;
  const consulta = new URLSearchParams({
    categoria: config.categoriaId,
    dificuldade: config.dificuldade,
    quantidade: String(config.quantidade),
  });

  const botaoJogarNovamente = criarElemento(
    "button",
    {
      classe: "botao botao--primario botao--grande",
      atributos: { type: "button" },
      aoClicar: (evento) => {
        // Nova partida com as mesmas configurações (perguntas sorteadas de novo)
        const { erro } = criarPartida(config);
        if (erro) {
          porId("erro-resultado").textContent = erro;
          return;
        }
        evento.currentTarget.disabled = true;
        window.location.href = `${base}pages/jogo.html`;
      },
    },
    [criarIcone("play", 20), "Jogar novamente"]
  );

  porId("resultado-acoes").replaceChildren(
    botaoJogarNovamente,
    criarElemento("a", {
      classe: "botao botao--contorno botao--grande",
      texto: "Alterar configurações",
      atributos: { href: `${base}pages/categorias.html?${consulta.toString()}` },
    }),
    criarElemento("a", {
      classe: "botao botao--texto botao--grande",
      texto: "Voltar ao início",
      atributos: { href: `${base}index.html` },
    })
  );
}

function mostrarSemResultado(base) {
  porId("resultado").hidden = true;
  const alvo = porId("sem-resultado");
  alvo.hidden = false;
  alvo.replaceChildren(
    criarEstadoVazio({
      icone: "trophy",
      titulo: "Nenhum resultado para mostrar",
      texto: "Termine uma partida para ver o seu desempenho aqui.",
    }),
    criarElemento("div", { classe: "sem-resultado__acoes" }, [
      criarElemento("a", {
        classe: "botao botao--primario",
        texto: "Montar uma partida",
        atributos: { href: `${base}pages/categorias.html` },
      }),
      criarElemento("a", {
        classe: "botao botao--contorno",
        texto: "Voltar ao início",
        atributos: { href: `${base}index.html` },
      }),
    ])
  );
}

/** Chamada pelo app.js quando a tela de resultado é carregada. */
export function iniciar({ base }) {
  const resultado = obterResultado();
  if (!resultado) {
    mostrarSemResultado(base);
    return;
  }

  porId("resultado").hidden = false;
  renderizarCabecalho(resultado);
  renderizarDados(resultado);
  renderizarProgresso(resultado);
  renderizarAcoes(resultado, base);
}