document.addEventListener("DOMContentLoaded", async () => {
  bindLeagueTabs();
  renderRoundDates();
  try {
    const tournament = await fetchTournamentData();
    renderLeague("master", tournament.standings.master);
    renderLeague("diamond", tournament.standings.diamond);
    renderLeague("platinum", tournament.standings.platinum);
  } catch (error) {
    document.getElementById("standingsMessage").textContent = `No se pudieron cargar las clasificaciones: ${error.message}`;
  }
});

function bindLeagueTabs() {
  document.querySelectorAll("[data-league-tab]").forEach((tab) => tab.addEventListener("click", () => {
    const league = tab.dataset.leagueTab;
    document.querySelectorAll("[data-league-tab]").forEach((item) => { const active = item === tab; item.classList.toggle("is-active", active); item.setAttribute("aria-selected", String(active)); });
    document.querySelectorAll("[data-league-panel]").forEach((panel) => { const active = panel.dataset.leaguePanel === league; panel.classList.toggle("is-active", active); panel.hidden = !active; });
  }));
}

function renderLeague(league, groups) { document.getElementById(`${league}Groups`).innerHTML = (groups || []).map(renderGroupTable).join(""); }

function renderRoundDates() {
  Object.entries(FFL_ROUND_DATES).forEach(([league, division]) => {
    const container = document.getElementById(`${league}RoundDates`);
    if (!container) return;
    const groups = Object.entries(division.groups);
    container.innerHTML = `<div class="round-dates__heading"><p class="eyebrow">Información de juego</p><h3>${escapeHtml(division.title)}</h3><p>Confirma aquí cuándo juega cada ronda de cada grupo.</p></div><div class="round-dates__grid">${groups.map(([group, rounds]) => `<article class="round-dates__group"><h4>Grupo ${escapeHtml(group)}</h4><ul>${rounds.map((round) => `<li>${escapeHtml(round)}</li>`).join("")}</ul></article>`).join("")}</div>`;
  });
}

function renderGroupTable(group) {
  const rows = group.players.length ? group.players.map((player) => `<tr class="standing-row standing-row--${player.status}"><td>${player.position}</td><td>${escapeHtml(player.nickname)}</td><td>${player.played}</td><td>${player.wins}</td><td>${player.losses}</td><td><span class="standing-status"><i></i><span class="sr-only">${getStatusLabel(player.status)}</span></span></td></tr>`).join("") : '<tr><td colspan="6" class="standings-table__empty">Sin jugadores asignados</td></tr>';
  return `<article class="group-card"><h3>Grupo ${group.group}</h3><div class="group-card__table-shell"><table class="standings-table"><thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>PG</th><th>PP</th><th><span class="sr-only">Estado</span></th></tr></thead><tbody>${rows}</tbody></table></div></article>`;
}

function getStatusLabel(status) { return { qualify: "Clasifica", playoff: "Finales", stay: "Permanece", drop: "Desciende" }[status]; }
function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
