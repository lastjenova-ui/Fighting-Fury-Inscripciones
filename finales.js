const BRACKET_ROUNDS = [
  {
    title: "Ronda 1",
    format: "FT5",
    description: "Segundos y terceros de grupo",
    matches: [
      ["2. Grupo A", "3. Grupo B"],
      ["2. Grupo B", "3. Grupo A"],
      ["2. Grupo C", "3. Grupo D"],
      ["2. Grupo D", "3. Grupo C"]
    ]
  },
  {
    title: "Ronda 2",
    format: "FT7",
    description: "Primeros de grupo entran al bracket",
    matches: [
      ["1. Grupo A", "Ganador M1"],
      ["1. Grupo B", "Ganador M2"],
      ["1. Grupo C", "Ganador M3"],
      ["1. Grupo D", "Ganador M4"]
    ]
  },
  {
    title: "Semifinales",
    format: "FT7",
    description: "",
    matches: [["Ganador M5", "Ganador M6"], ["Ganador M7", "Ganador M8"]]
  },
  {
    title: "Gran Final",
    format: "FT10",
    description: "Por el campeonato",
    matches: [["Ganador S1", "Ganador S2"]]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("masterBracket").innerHTML = `<div class="bracket">${BRACKET_ROUNDS.map(renderRound).join("")}</div>`;
});

function renderRound(round, roundIndex) {
  return `<section class="bracket-round bracket-round--${round.matches.length}" aria-label="${round.title}"><header class="bracket-round__header"><h3>${round.title}</h3><span>${round.format}</span><p>${round.description}</p></header><div class="bracket-round__matches">${round.matches.map((match, matchIndex) => renderMatch(match, roundIndex, matchIndex)).join("")}</div></section>`;
}

function renderMatch(players, roundIndex, matchIndex) {
  const number = roundIndex === 0 ? matchIndex + 1 : "";
  return `<article class="bracket-match"><div class="bracket-match__players"><span>${players[0]}</span><span>${players[1]}</span></div>${number ? `<small>Match ${number}</small>` : ""}</article>`;
}
