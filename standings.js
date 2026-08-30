document.addEventListener("DOMContentLoaded", async () => {
  bindLeagueTabs();
  try {
    const tournament = await fetchTournamentData();
    renderLeague("master", tournament.standings.master);
    renderLeague("diamond", tournament.standings.diamond);
  } catch (error) {
    document.getElementById("standingsMessage").textContent = "Las clasificaciones se publicaran cuando se asignen los grupos y resultados.";
  }
});

function bindLeagueTabs() {
  document.querySelectorAll("[data-league-tab]").forEach((tab) => tab.addEventListener("click", () => {
    const league = tab.dataset.leagueTab;
    document.querySelectorAll("[data-league-tab]").forEach((item) => { const active = item === tab; item.classList.toggle("is-active", active); item.setAttribute("aria-selected", String(active)); });
    document.querySelectorAll("[data-league-panel]").forEach((panel) => { const active = panel.dataset.leaguePanel === league; panel.classList.toggle("is-active", active); panel.hidden = !active; });
  }));
}

function renderLeague(league, groups) { document.getElementById(`${league}Groups`).innerHTML = groups.map(renderGroupTable).join(""); }

function renderGroupTable(group) {
  const rows = group.players.length ? group.players.map((player) => `<tr class="standing-row standing-row--${player.status}"><td>${player.position}</td><td>${escapeHtml(player.nickname)}</td><td>${player.played}</td><td>${player.wins}</td><td>${player.losses}</td><td><span class="standing-status"><i></i><span class="sr-only">${getStatusLabel(player.status)}</span></span></td></tr>`).join("") : '<tr><td colspan="6" class="standings-table__empty">Sin jugadores asignados</td></tr>';
  return `<article class="group-card"><h3>Grupo ${group.group}</h3><div class="group-card__table-shell"><table class="standings-table"><thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>PG</th><th>PP</th><th><span class="sr-only">Estado</span></th></tr></thead><tbody>${rows}</tbody></table></div></article>`;
}

function getStatusLabel(status) { return { qualify: "Clasifica", playoff: "Finales", stay: "Permanece", drop: "Desciende" }[status]; }
function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
