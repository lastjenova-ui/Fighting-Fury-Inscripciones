/*
  EDICIÓN MANUAL DE LOS POOLS
  Doble eliminación · 16 jugadores por pool

  Los jugadores de cada pool están ordenados en "players"
  para que los enfrentamientos iniciales coincidan exactamente
  con el bracket original de cada imagen.
*/

const FFL_POOLS = [
  // ============================================================
  // POOL A
  // ============================================================
  {
    name: "FFL Pool A",
    schedule: "Viernes 11 Sep · 8:00 PM",

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


  // ============================================================
  // POOL B
  // ============================================================
  {
    name: "FFL Pool B",
    schedule: "Viernes 11 Sep · 8:00 PM",

    players: [
      "Px zaito240",      // 0
      "Nueve",            // 1
      "PezKoito",         // 2
      "Sirxy",            // 3
      "Sharkwarrior059",  // 4
      "Gleashy",          // 5
      "Juan_mono",        // 6
      "Kendernyu",        // 7
      "Nozarashi",        // 8
      "WILLAR",           // 9
      "Ratamaraña",       // 10
      "Skyresk",           // 11
      "Pipepala",         // 12
      "Juanch0666",       // 13
      "Cigne",            // 14
      "Yamibakura"        // 15
    ],

    slots: {}
  },


  // ============================================================
  // POOL C
  // ============================================================
  {
    name: "FFL Pool C",
    schedule: "Sábado 12 Sep · 8:00 PM",

    players: [
      "JUAN2425",          // 0
      "Predator_X",        // 1
      "MrDarkan",          // 2
      "ioRoS",             // 3
      "ACP|Rockmegamam",   // 4
      "Joker-I-9029",      // 5
      "ElFabs",            // 6
      "Kyota",             // 7
      "chunchumaru17",     // 8
      "Noscas",            // 9
      "Ras al Ghυl",       // 10
      "Orregoso",          // 11
      "santOS",             // 12
      "Trp_cali",          // 13
      "NeoArcade",         // 14
      "KidPambe"           // 15
    ],

    slots: {}
  },


  // ============================================================
  // POOL D
  // ============================================================
  {
    name: "FFL Pool D",
    schedule: "Sábado 12 Sep · 8:00 PM",

    players: [
      "JustShadow",        // 0
      "Deadmano",          // 1
      "Josluba186",        // 2
      "ShakaxX",           // 3
      "jvegagir",          // 4
      "Trirziel",          // 5
      "QUIEBRACUCAS",      // 6
      "Px_Raging_DemoN",   // 7
      "Yashiro18",         // 8
      "Touiji",             // 9
      "Larry Capija",      // 10
      "Saiga2103",         // 11
      "BLACKJUNGLE",       // 12
      "Soufiane Bencok",   // 13
      "Hawkwolfryubat11",  // 14
      "RyuMasta"           // 15
    ],

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
    ============================================================
    ROUND 1
    ============================================================

    La estructura del bracket utiliza estas posiciones:

    W1 = players[0]  vs players[15]
    W2 = players[7]  vs players[8]
    W3 = players[3]  vs players[12]
    W4 = players[4]  vs players[11]
    W5 = players[1]  vs players[14]
    W6 = players[6]  vs players[9]
    W7 = players[2]  vs players[13]
    W8 = players[5]  vs players[10]
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


          <!-- BRACKET SUPERIOR -->

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


          <!-- BRACKET DE PERDEDORES -->

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


          <!-- GRAN FINAL -->

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
