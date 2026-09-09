/*
  EDICIÓN MANUAL DE LOS POOLS
  Escribe los 16 participantes de cada pool dentro de "players".
  Después de cada resultado, agrega el ganador y perdedor en "slots" del pool.
  Ejemplo: slots: { "Ganador W1": "Ryu", "Perdedor W1": "Ken" }
*/
const FFL_POOLS = [
  { name: "FFL Pool A", schedule: "Viernes 11 Sep · 8:00 PM", players: Array(16).fill("Por definir"), slots: {} },
  { name: "FFL Pool B", schedule: "Viernes 11 Sep · 8:00 PM", players: Array(16).fill("Por definir"), slots: {} },
  { name: "FFL Pool C", schedule: "Sábado 12 Sep · 8:00 PM", players: Array(16).fill("Por definir"), slots: {} },
  { name: "FFL Pool D", schedule: "Sábado 12 Sep · 8:00 PM", players: Array(16).fill("Por definir"), slots: {} }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("poolsBrackets");
  if (!container) return;
  container.innerHTML = FFL_POOLS.map(renderPool).join("");
});

function renderPool(pool) {
  const players = pool.players.length === 16 ? pool.players : Array(16).fill("Por definir");
  const opening = [
    [players[0], players[15]], [players[7], players[8]], [players[3], players[12]], [players[4], players[11]],
    [players[1], players[14]], [players[6], players[9]], [players[2], players[13]], [players[5], players[10]]
  ];
  const upperRounds = [
    { title: "Winners R1", matches: opening, prefix: "W" },
    { title: "Winners R2", matches: pairedPlaceholders("Ganador W", 1, 4), prefix: "W", start: 9 },
    { title: "Winners SF", matches: pairedPlaceholders("Ganador W", 9, 2), prefix: "W", start: 13 },
    { title: "Final Winners", matches: [["Ganador W13", "Ganador W14"]], prefix: "W", start: 15 }
  ];
  const losersRounds = [
    { title: "Losers R1", matches: [["Perdedor W1", "Perdedor W2"], ["Perdedor W3", "Perdedor W4"], ["Perdedor W5", "Perdedor W6"], ["Perdedor W7", "Perdedor W8"]], start: 1 },
    { title: "Losers R2", matches: [["Ganador L1", "Perdedor W9"], ["Ganador L2", "Perdedor W10"], ["Ganador L3", "Perdedor W11"], ["Ganador L4", "Perdedor W12"]], start: 5 },
    { title: "Losers R3", matches: [["Ganador L5", "Ganador L6"], ["Ganador L7", "Ganador L8"]], start: 9 },
    { title: "Losers R4", matches: [["Ganador L9", "Perdedor W13"], ["Ganador L10", "Perdedor W14"]], start: 11 },
    { title: "Losers R5", matches: [["Ganador L11", "Ganador L12"]], start: 13 },
    { title: "Final Losers", matches: [["Ganador L13", "Perdedor W15"]], start: 14 }
  ];

  return `<article class="double-elim-pool">
    <header class="double-elim-pool__header"><div><p class="eyebrow">Doble eliminación · 16 jugadores</p><h3>${escapePoolHtml(pool.name)}</h3></div><time>${escapePoolHtml(pool.schedule)}</time></header>
    <div class="double-elim-scroll">
      <div class="double-elim-board">
        <section class="elim-zone"><h4>Bracket superior</h4><div class="elim-rounds elim-rounds--upper">${upperRounds.map((round) => renderRound(round, pool.slots)).join("")}</div></section>
        <section class="elim-zone"><h4>Bracket de perdedores</h4><div class="elim-rounds elim-rounds--lower">${losersRounds.map((round) => renderRound(round, pool.slots)).join("")}</div></section>
        <section class="grand-final"><span>Gran Final</span>${renderMatch(["Ganador W15", "Ganador L14"].map((slot) => pool.slots[slot] || slot), "GF")}</section>
      </div>
    </div>
  </article>`;
}

function pairedPlaceholders(prefix, first, amount) {
  return Array.from({ length: amount }, (_, index) => [
    `${prefix}${first + index * 2}`,
    `${prefix}${first + index * 2 + 1}`
  ]);
}

function renderRound(round, slots) {
  return `<section class="elim-round"><h5>${round.title}</h5><div class="elim-round__matches">${round.matches.map((match, index) => renderMatch(match.map((slot) => slots[slot] || slot), `${round.prefix || "L"}${(round.start || 1) + index}`)).join("")}</div></section>`;
}

function renderMatch(players, label) {
  return `<div class="elim-match"><small>${label}</small><span>${escapePoolHtml(players[0])}</span><span>${escapePoolHtml(players[1])}</span></div>`;
}

function escapePoolHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}
