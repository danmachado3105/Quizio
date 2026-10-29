import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./estilos/variables.css";
import "./estilos/reset.css";
import "./estilos/global.css";
import "./estilos/layout.css";
import "./estilos/components.css";
import "./estilos/gamificacao.css";
import "./estilos/responsive.css";
import "./estilos/revisao.css";
import "./estilos/pages/home.css";
import "./estilos/pages/categorias.css";
import "./estilos/pages/categorias-modos.css";
import "./estilos/pages/jogo.css";
import "./estilos/pages/jogo-modos.css";
import "./estilos/pages/resultado.css";
import "./estilos/pages/perfil.css";
import "./estilos/pages/conquistas.css";
import "./estilos/base.css";
import "./estilos/f3.css";
import "./estilos/refino.css";
import { registerSW } from "virtual:pwa-register";

if (import.meta.env.PROD) registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("raiz")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
