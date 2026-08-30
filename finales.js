document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("masterBracket");
  try {
    const tournament = await fetchTournamentData();
    container.innerHTML = `<div class="bracket">${tournament.finals.master.map(renderRound).join("")}</div>`;
  } catch (error) {
    container.innerHTML = `<p class="bracket-message">No se pudo cargar el bracket: ${escapeHtml(error.message)}</p>`;
  }
});

function renderRound(round) { return `<section class="bracket-round bracket-round--${round.matches.length}" aria-label="${round.title}"><header class="bracket-round__header"><h3>${round.title}</h3><span>${round.format}</span><p>${round.description}</p></header><div class="bracket-round__matches">${round.matches.map(renderMatch).join("")}</div></section>`; }
function renderMatch(match, index) {
  const completed = match[4] === "finalizado";
  const firstWinner = completed && match[2] > match[3];
  const secondWinner = completed && match[3] > match[2];
  const firstScore = completed ? `<b>${match[2]}</b>` : "";
  const secondScore = completed ? `<b>${match[3]}</b>` : "";
  return `<article class="bracket-match"><div class="bracket-match__players"><span class="${firstWinner ? "is-winner" : ""}">${escapeHtml(match[0])}${firstScore}</span><span class="${secondWinner ? "is-winner" : ""}">${escapeHtml(match[1])}${secondScore}</span></div>${index < 4 ? `<small>Match ${index + 1}</small>` : ""}</article>`;
}
function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
