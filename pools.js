/*
  EDICIÓN MANUAL DE LOS POOLS
  Los jugadores se colocan en "players" siguiendo las posiciones
  necesarias para que el bracket coincida con el cuadro original.

  Pool A configurado con los 16 jugadores del bracket.
  Pools B, C y D quedan pendientes.
*/

const FFL_POOLS = [
  {
    name: "FFL Pool A",
    schedule: "Viernes 11 Sep · 8:00 PM",

    /*
      IMPORTANTE:
      Este orden está hecho específicamente para que los
      enfrentamientos iniciales coincidan con el bracket original.

      Posiciones del array:

      players[0]  = FILI-RZ
      players[15] = WOLRAB

      players[7]  = Mudfrieza
      players[8]  = SKZ_Ulrik

      players[3]  = 200decilantro
      players[12] = fragminn

      players[4]  = ado_Mc
      players[11] = tonyindiegamer

      players[1]  = Red_Maverick
      players[14] = ItsWifaner

      players[6]  = Highwind
      players[9]  = Jenn

      players[2]  = Limestone
      players[13] = Kirimanyaro

      players[5]  = Monoguitar
      players[10] = P4TITO
    */

    players: [
      "FILI-RZ",          // 0
      "Red_Maverick",     // 1
      "Limestone",        // 2
      "200decilantro",    // 3
      "ado_Mc",           // 4
      "Monoguitar",       // 5
      "Highwind",         // 6
      "Mudfrieza",        // 7
      "SKZ_Ulrik",        // 8
      "Jenn",             // 9
      "P4TITO",           // 10
      "tonyindiegamer",   // 11
      "fragminn",         // 12
      "Kirimanyaro",      // 13
      "ItsWifaner",       // 14
      "WOLRAB"            // 15
    ],

    slots: {}
  },

  {
    name: "FFL Pool B",
    schedule: "Viernes 11 Sep · 8:00 PM",
    players: Array(16).fill("Por definir"),
    slots: {}
  },

  {
    name: "FFL Pool C",
    schedule: "Sábado 12 Sep · 8:00 PM",
    players: Array(16).fill("Por definir"),
    slots: {}
  },

  {
    name: "FFL Pool D",
    schedule: "Sábado 12 Sep · 8:00 PM",
    players: Array(16).fill("Por definir"),
    slots: {}
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("poolsBrackets");

  if (!container) return;

  container.innerHTML = FFL_POOLS.map(renderPool).join("");
});

function renderPool(pool) {
  const players =
    pool.players.length === 16
      ? pool.players
      : Array(16).fill("Por definir");

  /*
    ORDEN DE LOS ENFRENTAMIENTOS INICIALES

    W1: players[0]  vs players[15]
    W2: players[7]  vs players[8]
    W3: players[3]  vs players[12]
    W4: players[4]  vs players[11]
    W5: players[1]  vs players[14]
    W6: players[6]  vs players[9]
    W7: players[2]  vs players[13]
    W8: players[5]  vs players[10]
  */

  const opening = [
    [players[0], players[15]],
    [players[7], players[8]],
    [players[3], players[12]],
    [players[4], players[11]],
    [players[1], players[14]],
    [players[6], players[9]],
    [players[2], players[13]],
    [players[5], players[10]]
  ];

  const upperRounds = [
    {
      title: "Winners R1",
      matches: opening,
      prefix: "W"
    },

    {
      title: "Winners R2",
      matches: pairedPlaceholders("Ganador W", 1, 4),
      prefix: "W",
      start: 9
    },

    {
      title: "Winners SF",
      matches: pairedPlaceholders("Ganador W", 9, 2),
      prefix: "W",
      start: 13
    },

    {
      title: "Final Winners",
      matches: [
        ["Ganador W13", "Ganador W14"]
      ],
      prefix: "W",
      start: 15
    }
  ];

  const losersRounds = [
    {
      title: "Losers R1",
      matches: [
        ["Perdedor W1", "Perdedor W2"],
        ["Perdedor W3", "Perdedor W4"],
        ["Perdedor W5", "Perdedor W6"],
        ["Perdedor W7", "Perdedor W8"]
      ],
      start: 1
    },

    {
      title: "Losers R2",
      matches: [
        ["Ganador L1", "Perdedor W9"],
        ["Ganador L2", "Perdedor W10"],
        ["Ganador L3", "Perdedor W11"],
        ["Ganador L4", "Perdedor W12"]
      ],
      start: 5
    },

    {
      title: "Losers R3",
      matches: [
        ["Ganador L5", "Ganador L6"],
        ["Ganador L7", "Ganador L8"]
      ],
      start: 9
    },

    {
      title: "Losers R4",
      matches: [
        ["Ganador L9", "Perdedor W13"],
        ["Ganador L10", "Perdedor W14"]
      ],
      start: 11
    },

    {
      title: "Losers R5",
      matches: [
        ["Ganador L11", "Ganador L12"]
      ],
      start: 13
    },

    {
      title: "Final Losers",
      matches: [
        ["Ganador L13", "Perdedor W15"]
      ],
      start: 14
    }
  ];

  return `
    <article class="double-elim-pool">

      <header class="double-elim-pool__header">
        <div>
          <p class="eyebrow">
            Doble eliminación · 16 jugadores
          </p>

          <h3>
            ${escapePoolHtml(pool.name)}
          </h3>
        </div>

        <time>
          ${escapePoolHtml(pool.schedule)}
        </time>
      </header>

      <div class="double-elim-scroll">

        <div class="double-elim-board">

          <section class="elim-zone">

            <h4>
              Bracket superior
            </h4>

            <div class="elim-rounds elim-rounds--upper">
              ${upperRounds
                .map((round) => renderRound(round, pool.slots))
                .join("")}
            </div>

          </section>

          <section class="elim-zone">

            <h4>
              Bracket de perdedores
            </h4>

            <div class="elim-rounds elim-rounds--lower">
              ${losersRounds
                .map((round) => renderRound(round, pool.slots))
                .join("")}
            </div>

          </section>

          <section class="grand-final">

            <span>
              Gran Final
            </span>

            ${renderMatch(
              ["Ganador W15", "Ganador L14"].map(
                (slot) => pool.slots[slot] || slot
              ),
              "GF"
            )}

          </section>

        </div>

      </div>

    </article>
  `;
}

function pairedPlaceholders(prefix, first, amount) {
  return Array.from(
    { length: amount },
    (_, index) => [
      `${prefix}${first + index * 2}`,
      `${prefix}${first + index * 2 + 1}`
    ]
  );
}

function renderRound(round, slots) {
  return `
    <section class="elim-round">

      <h5>
        ${round.title}
      </h5>

      <div class="elim-round__matches">

        ${round.matches
          .map(
            (match, index) =>
              renderMatch(
                match.map(
                  (slot) => slots[slot] || slot
                ),
                `${round.prefix || "L"}${(round.start || 1) + index}`
              )
          )
          .join("")}

      </div>

    </section>
  `;
}

function renderMatch(players, label) {
  return `
    <div class="elim-match">

      <small>
        ${label}
      </small>

      <span>
        ${escapePoolHtml(players[0])}
      </span>

      <span>
        ${escapePoolHtml(players[1])}
      </span>

    </div>
  `;
}

function escapePoolHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
