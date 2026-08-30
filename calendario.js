let scheduledMatches = [];

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("scheduleLeague").addEventListener("change", renderSchedule);
  try {
    scheduledMatches = (await fetchTournamentData()).schedule;
    renderSchedule();
  } catch (error) {
    document.getElementById("scheduleList").innerHTML = `<p class="schedule-empty">No se pudo cargar el calendario: ${escapeHtml(error.message)}</p>`;
  }
});

function renderSchedule() {
  const league = document.getElementById("scheduleLeague").value;
  const matches = scheduledMatches.filter((match) => league === "all" || match.league === league);
  document.getElementById("scheduleList").innerHTML = matches.length ? matches.map((match) => `<article class="schedule-match"><div><span class="schedule-match__league">${match.league === "master" ? "Master" : "Diamante"}</span><span class="schedule-match__phase">${escapeHtml(match.phase)}</span></div><strong>${escapeHtml(match.playerOne)} <i>vs</i> ${escapeHtml(match.playerTwo)}</strong><time>${formatDate(match.date)}</time></article>`).join("") : '<p class="schedule-empty">No hay matches pendientes para esta liga.</p>';
}

function formatDate(value) { if (!value) return "Fecha por confirmar"; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }); }
function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
