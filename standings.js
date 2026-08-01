const GROUP_NAMES = {
  master: ["Ryu", "Ken", "Chun-Li", "Guile", "Juri", "Cammy"],
  diamond: ["Akuma", "Luke", "Jamie", "Manon", "Marisa", "Dee Jay"]
};

document.addEventListener("DOMContentLoaded", () => {
  Object.entries(GROUP_NAMES).forEach(([league, names]) => {
    document.getElementById(`${league}Groups`).innerHTML = createGroups(names).map(renderGroupTable).join("");
  });
  document.querySelectorAll("[data-league-tab]").forEach((tab) => tab.addEventListener("click", () => setActiveLeague(tab.dataset.leagueTab)));
});

function createGroups(names) {
  return ["A", "B", "C", "D"].map((letter, groupIndex) => ({
    letter,
    players: names.map((name, index) => ({ name: groupIndex ? `${name} ${groupIndex + 1}` : name, played: 5, points: 15 - index * 3, status: ["qualify", "playoff", "stay", "stay", "drop", "drop"][index] }))
  }));
}

function renderGroupTable(group) {
  return `<article class="group-card"><h3>Grupo ${group.letter}</h3><div class="group-card__table-shell"><table class="standings-table"><thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>PTS</th><th><span class="sr-only">Estado</span></th></tr></thead><tbody>${group.players.map((player, index) => `<tr class="standing-row standing-row--${player.status}"><td>${index + 1}</td><td>${escapeHtml(player.name)}</td><td>${player.played}</td><td>${player.points}</td><td><span class="standing-status"><i></i><span class="sr-only">${getStatusLabel(player.status)}</span></span></td></tr>`).join("")}</tbody></table></div></article>`;
}

function getStatusLabel(status) {
  return { qualify: "Clasifica", playoff: "Play-offs", stay: "Permanece", drop: "Desciende" }[status];
}

function setActiveLeague(league) {
  document.querySelectorAll("[data-league-tab]").forEach((tab) => {
    const isActive = tab.dataset.leagueTab === league;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll("[data-league-panel]").forEach((panel) => {
    const isActive = panel.dataset.leaguePanel === league;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
