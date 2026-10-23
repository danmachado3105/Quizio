/**
 * Dois conjuntos de ícones:
 *  1. ICONES_DA_INTERFACE: ícones de traço (setas, play, troféu...), que usam a cor do texto.
 *  2. EMBLEMAS: ilustrações coloridas, uma por categoria (chave "cat-<id da categoria>").
 *
 * Todos os textos abaixo são constantes escritas por nós (nunca dados do usuário),
 * por isso é seguro montá-los com innerHTML.
 */
const ICONES_DA_INTERFACE = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  "trending-up": '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  percent: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
  pause: '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  "volume-2": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  "volume-x": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  // Usados por avatares, conquistas e estados vazios
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  medal: '<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/>',
  gamepad: '<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
  "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
};

// ---------- Emblemas das categorias ----------
const TINTA = "#35254F";
const ROXO = "#7254D8";
const CORAL = "#FF786B";
const AMARELO = "#FFD166";
const CREME = "#FFF8EF";

/** Contorno de tinta em todas as formas; as cores de preenchimento vêm de cada forma. */
const emblema = (formas) =>
  `<g stroke="${TINTA}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${formas}</g>`;

const EMBLEMAS = {
  "cat-conhecimentos-gerais": emblema(
    `<path d="M12 2.7a6.3 6.3 0 0 0-3.5 11.5c.6.5 1 1.1 1 1.9v.9h5v-.9c0-.8.4-1.4 1-1.9A6.3 6.3 0 0 0 12 2.7Z" fill="${AMARELO}"/>` +
      `<rect x="9.3" y="17.2" width="5.4" height="3" rx="1.2" fill="${ROXO}"/><path d="M10.4 22h3.2"/><path d="m10 9.6 2 2.2 2-2.2"/>`
  ),
  "cat-ciencia-espaco": emblema(
    `<circle cx="12" cy="12.5" r="6.2" fill="${ROXO}"/>` +
      `<ellipse cx="12" cy="12.5" rx="10.3" ry="3.4" transform="rotate(-22 12 12.5)" fill="none" stroke-width="4.2"/>` +
      `<ellipse cx="12" cy="12.5" rx="10.3" ry="3.4" transform="rotate(-22 12 12.5)" fill="none" stroke="${CORAL}" stroke-width="2"/>` +
      `<path d="M19.5 2.5 20.3 5 22.8 5.8 20.3 6.6 19.5 9.1 18.7 6.6 16.2 5.8 18.7 5Z" fill="${AMARELO}" stroke-width="1.2"/>`
  ),
  "cat-historia": emblema(
    `<path d="M3 9 12 3.2 21 9Z" fill="${AMARELO}"/>` +
      `<rect x="5" y="10" width="3" height="7.5" fill="${CREME}"/><rect x="10.5" y="10" width="3" height="7.5" fill="${CREME}"/><rect x="16" y="10" width="3" height="7.5" fill="${CREME}"/>` +
      `<rect x="3" y="17.5" width="18" height="3.6" rx="1" fill="${CORAL}"/>`
  ),
  "cat-geografia": emblema(
    `<circle cx="12" cy="12" r="9.5" fill="${ROXO}"/>` +
      `<path d="M5.2 8.4c2.1.1 3.3 1.2 3.5 2.8.2 1.7-1.3 2.2-1.1 3.8.1.9.8 1.6 1.7 2.1-3.1-.6-5.4-3.3-5.4-6.5 0-.8.5-1.7 1.3-2.2Z" fill="${AMARELO}" stroke-width="1.2"/>` +
      `<path d="M13.8 3.6c1.6.5 2.4 1.5 2.2 2.6-.2 1.3-1.8 1.3-2.2 2.4-.4 1 .4 2 1.5 2.1 1.3.1 2.3-.8 4-.3-.5-3.2-2.7-5.5-5.5-6.8Z" fill="${AMARELO}" stroke-width="1.2"/>`
  ),
  "cat-filmes": emblema(
    `<rect x="3" y="10" width="18" height="11" rx="2" fill="${CREME}"/><path d="M3 10V6.8L21 6v4Z" fill="${TINTA}"/>` +
      `<path d="m7 6.5 2 3.4M12.2 6.3l2 3.6M17.4 6.1l2 3.8" stroke="${AMARELO}" stroke-width="2"/><circle cx="12" cy="15.6" r="2.3" fill="${CORAL}"/>`
  ),
  "cat-series": emblema(
    `<path d="m8.2 3.2 3.8 3 3.8-3"/><rect x="3" y="6" width="18" height="12.5" rx="2.6" fill="${ROXO}"/>` +
      `<rect x="5.4" y="8.4" width="10.4" height="7.7" rx="1.3" fill="${CREME}"/><path d="M9.6 10.2v3.6l3.1-1.8Z" fill="${CORAL}" stroke-width="1.2"/>` +
      `<circle cx="18.4" cy="10.6" r=".9" fill="${AMARELO}" stroke-width="1"/><circle cx="18.4" cy="13.8" r=".9" fill="${AMARELO}" stroke-width="1"/><path d="M7 21h10"/>`
  ),
  "cat-musica": emblema(
    `<path d="M9.5 7.6 19.5 5.4" stroke-width="2.6"/><path d="M9.5 17.5V7.6M19.5 15.5V5.4"/>` +
      `<circle cx="6.8" cy="17.6" r="3" fill="${CORAL}"/><circle cx="16.8" cy="15.6" r="3" fill="${AMARELO}"/>`
  ),
  "cat-esportes": emblema(
    `<circle cx="12" cy="12" r="9.5" fill="${CREME}"/><path d="m12 8 3.8 2.8-1.5 4.4H9.7l-1.5-4.4Z" fill="${TINTA}"/>` +
      `<path d="M12 8V2.6M15.8 10.8l5-1.7M14.3 15.2l3.1 4.3M9.7 15.2l-3.1 4.3M8.2 10.8l-5-1.7"/>`
  ),
  "cat-jogos": emblema(
    `<path d="M7.2 7.2h9.6a4.6 4.6 0 0 1 4.5 3.8l.8 4.8a2.7 2.7 0 0 1-4.7 2.1l-1.9-2.4H8.5l-1.9 2.4a2.7 2.7 0 0 1-4.7-2.1l.8-4.8a4.6 4.6 0 0 1 4.5-3.8Z" fill="${ROXO}"/>` +
      `<path d="M8 10.3v3.6M6.2 12.1h3.6" stroke="${CREME}" stroke-width="1.7"/>` +
      `<circle cx="15.6" cy="11" r="1.2" fill="${AMARELO}" stroke-width="1.2"/><circle cx="18.2" cy="13.3" r="1.2" fill="${CORAL}" stroke-width="1.2"/>`
  ),
  "cat-animes": emblema(
    `<path d="M1.8 12.5C5 7 8.6 5 12 5s7 2 10.2 7.5C19 18 15.4 20 12 20s-7-2-10.2-7.5Z" fill="${CREME}"/>` +
      `<circle cx="12" cy="12.5" r="4.9" fill="${ROXO}"/><circle cx="12" cy="12.5" r="2" fill="${TINTA}"/>` +
      `<circle cx="10.2" cy="10.6" r="1.3" fill="${CREME}" stroke="none"/>` +
      `<path d="M19.2 2.2 20 4.4 22.2 5.2 20 6 19.2 8.2 18.4 6 16.2 5.2 18.4 4.4Z" fill="${AMARELO}" stroke-width="1.1"/>`
  ),
  "cat-tecnologia": emblema(
    `<path d="M9 2.8v3.4M12 2.8v3.4M15 2.8v3.4M9 17.8v3.4M12 17.8v3.4M15 17.8v3.4M2.8 9h3.4M2.8 12h3.4M2.8 15h3.4M17.8 9h3.4M17.8 12h3.4M17.8 15h3.4"/>` +
      `<rect x="6" y="6" width="12" height="12" rx="2.6" fill="${ROXO}"/><rect x="9.4" y="9.4" width="5.2" height="5.2" rx="1" fill="${AMARELO}"/>`
  ),
  "cat-literatura": emblema(
    `<path d="M12 6.6C10 4.9 6.6 4.4 3 5.1v13c3.6-.7 7-.2 9 1.6Z" fill="${AMARELO}"/>` +
      `<path d="M12 6.6c2-1.7 5.4-2.2 9-1.5v13c-3.6-.7-7-.2-9 1.6Z" fill="${CREME}"/><path d="M12 6.6v11.9"/>` +
      `<path d="M5.6 9.2c1.5-.2 3 0 4.4.6M14 9.8c1.4-.6 2.9-.8 4.4-.6" stroke-width="1.2"/>`
  ),
  "cat-natureza-animais": emblema(
    `<ellipse cx="12" cy="16.2" rx="5.2" ry="4.3" fill="${CORAL}"/><circle cx="5.4" cy="10.6" r="2.1" fill="${AMARELO}"/>` +
      `<circle cx="9.2" cy="6.4" r="2.1" fill="${AMARELO}"/><circle cx="14.8" cy="6.4" r="2.1" fill="${AMARELO}"/><circle cx="18.6" cy="10.6" r="2.1" fill="${AMARELO}"/>`
  ),
  "cat-brasil": emblema(
    `<path d="M12 2.8 21.4 12 12 21.2 2.6 12Z" fill="${AMARELO}"/><circle cx="12" cy="12" r="4.7" fill="${ROXO}"/>` +
      `<path d="M7.7 11.2c2.8-.9 5.6-.6 8.6 1" stroke="${CREME}" stroke-width="1.3"/>`
  ),
  "cat-arte-arquitetura": emblema(
    `<path d="M12 3C6.8 3 2.7 6.8 2.7 11.7c0 4.6 3.5 8.3 7.9 8.3 1.4 0 2-.8 2-1.7 0-.7-.5-1.1-.5-1.9 0-1 .8-1.7 1.8-1.7h2.2c2.6 0 4.2-1.7 4.2-4C20.3 6.5 16.6 3 12 3Z" fill="${CREME}"/>` +
      `<circle cx="7.4" cy="11.2" r="1.5" fill="${CORAL}" stroke-width="1.2"/><circle cx="10.3" cy="7.2" r="1.5" fill="${AMARELO}" stroke-width="1.2"/><circle cx="15.2" cy="7.4" r="1.5" fill="${ROXO}" stroke-width="1.2"/>`
  ),
  "cat-comida-culinaria": emblema(
    `<path d="M3.4 6.8C9 3.3 15 3.3 20.6 6.8L12 21Z" fill="${AMARELO}"/><path d="M3.4 6.8C9 3.3 15 3.3 20.6 6.8" stroke-width="2.6"/>` +
      `<circle cx="9.6" cy="9.8" r="1.4" fill="${CORAL}" stroke-width="1.2"/><circle cx="14.6" cy="10.2" r="1.4" fill="${CORAL}" stroke-width="1.2"/><circle cx="12" cy="14.6" r="1.4" fill="${CORAL}" stroke-width="1.2"/>`
  ),
  "cat-corpo-humano": emblema(
    `<path d="M12 20.6C5.2 16 2.6 12.4 2.6 8.8A4.9 4.9 0 0 1 7.5 3.9c1.9 0 3.5.9 4.5 2.6 1-1.7 2.6-2.6 4.5-2.6a4.9 4.9 0 0 1 4.9 4.9c0 3.6-2.6 7.2-9.4 11.8Z" fill="${CORAL}"/>` +
      `<path d="M5.4 11.2h3l1.5-2.6 2.4 5 1.6-2.4h4.7" stroke="${CREME}" stroke-width="1.6"/>`
  ),
  "cat-mitologia-lendas": emblema(
    `<circle cx="12" cy="12" r="9.5" fill="${ROXO}"/><path d="M13.6 4.2 7.2 13.2h4.2l-1 6.6 6.4-9.2h-4.2Z" fill="${AMARELO}"/>`
  ),
  "cat-matematica-logica": emblema(
    `<rect x="5" y="2.6" width="14" height="18.8" rx="2.6" fill="${CREME}"/><rect x="7.5" y="5.2" width="9" height="4" rx="1" fill="${ROXO}"/>` +
      `<circle cx="8.8" cy="13.2" r="1.05" fill="${TINTA}" stroke="none"/><circle cx="12" cy="13.2" r="1.05" fill="${TINTA}" stroke="none"/><circle cx="15.2" cy="13.2" r="1.05" fill="${TINTA}" stroke="none"/>` +
      `<circle cx="8.8" cy="17.2" r="1.05" fill="${TINTA}" stroke="none"/><circle cx="12" cy="17.2" r="1.05" fill="${TINTA}" stroke="none"/><circle cx="15.2" cy="17.2" r="1.05" fill="${CORAL}" stroke="none"/>`
  ),
  "cat-lingua-portuguesa": emblema(
    `<path d="M4.6 3.8h14.8A2.6 2.6 0 0 1 22 6.4v8a2.6 2.6 0 0 1-2.6 2.6h-8.2L6.4 21v-4H4.6A2.6 2.6 0 0 1 2 14.4v-8a2.6 2.6 0 0 1 2.6-2.6Z" fill="${AMARELO}"/>` +
      `<path d="M7 13.4 9.4 7l2.4 6.4M8 11.6h2.8"/><path d="M14.6 9h3.2M14.6 12h3.2"/>`
  ),
  "cat-economia-negocios": emblema(
    `<circle cx="12" cy="12" r="9.5" fill="${AMARELO}"/><circle cx="12" cy="12" r="6.3" stroke-width="1.1"/><path d="M12 7.2v9.6" stroke-width="1.5"/>` +
      `<path d="M14.4 9.6c-.5-.9-1.4-1.3-2.4-1.3-1.4 0-2.4.7-2.4 1.8s1 1.6 2.4 1.9 2.4.8 2.4 1.9-1 1.8-2.4 1.8c-1.2 0-2.1-.5-2.6-1.4" stroke-width="1.5"/>`
  ),
  "cat-datas-tradicoes": emblema(
    `<rect x="3" y="5" width="18" height="16" rx="3" fill="${CREME}"/><path d="M3 9.4h18V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3Z" fill="${CORAL}"/><path d="M8 2.6V6M16 2.6V6"/>` +
      `<path d="m12 11.6.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1L9 13.8l2.1-.3Z" fill="${AMARELO}" stroke-width="1.2"/>`
  ),
  "cat-invencoes-descobertas": emblema(
    `<circle cx="12" cy="12" r="9.2" stroke-width="3.6" stroke-dasharray="2.6 3.18"/><circle cx="12" cy="12" r="7.2" fill="${ROXO}"/><circle cx="12" cy="12" r="3" fill="${AMARELO}"/>`
  ),
};

const ICONES = { ...ICONES_DA_INTERFACE, ...EMBLEMAS };

/** Marcação interna (SVG) de um ícone. Usada pela roleta para desenhar os emblemas. */
export function obterMarcacaoDoIcone(nome) {
  return ICONES[nome] ?? ICONES.star;
}

/** Cria um elemento <svg> com o ícone pedido (usa "star" se o nome não existir). */
export function criarIcone(nome, tamanho = 24) {
  const molde = document.createElement("div");
  molde.innerHTML =
    `<svg class="icone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
    `width="${tamanho}" height="${tamanho}" fill="none" stroke="currentColor" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ` +
    `aria-hidden="true" focusable="false">${obterMarcacaoDoIcone(nome)}</svg>`;
  return molde.firstElementChild;
}

/** Marca do Quizio: um "q" branco com o miolo amarelo, sobre um quadrado roxo. */
export function criarLogo(tamanho = 36) {
  const molde = document.createElement("div");
  molde.innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${tamanho}" ` +
    `height="${tamanho}" aria-hidden="true" focusable="false">` +
    `<rect x="2" y="2" width="36" height="36" rx="11" fill="${ROXO}" stroke="${TINTA}" stroke-width="2.5"/>` +
    `<circle cx="19.5" cy="17.5" r="7" fill="none" stroke="#FFFFFF" stroke-width="4.5"/>` +
    `<path d="M26.5 10.5V30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>` +
    `<circle cx="19.5" cy="17.5" r="2.6" fill="${AMARELO}"/>` +
    `</svg>`;
  return molde.firstElementChild;
}

/**
 * Procura elementos com data-icone="nome" no HTML e coloca o ícone no início deles.
 * Opcional: data-tamanho-icone="18".
 */
export function hidratarIcones(raiz = document) {
  raiz.querySelectorAll("[data-icone]").forEach((elemento) => {
    const tamanho = Number(elemento.dataset.tamanhoIcone) || 20;
    elemento.prepend(criarIcone(elemento.dataset.icone, tamanho));
  });
}