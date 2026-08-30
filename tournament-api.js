const TOURNAMENT_API_URL = "https://script.google.com/macros/s/AKfycbxSsJowZXX_udmq-zAsvXBBYHffMRttvqmZ7RYiYjz-EnNWFhNJ7jjild41a8UAz0og/exec";

async function fetchTournamentData() {
  const response = await fetch(`${TOURNAMENT_API_URL}?action=tournament`, { cache: "no-store" });
  const result = await response.json().catch(() => {
    throw new Error("La respuesta del servidor no tiene formato valido.");
  });
  if (!response.ok || !result.success) throw new Error(result.message || "No se pudo cargar el torneo.");
  return result.data;
}
