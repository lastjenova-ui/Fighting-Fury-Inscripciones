const TOURNAMENT_API_URL = "https://script.google.com/macros/s/AKfycbxSsJowZXX_udmq-zAsvXBBYHffMRttvqmZ7RYiYjz-EnNWFhNJ7jjild41a8UAz0og/exec";

async function fetchTournamentData() {
  const response = await fetch(TOURNAMENT_API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "tournament" }) });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "No se pudo cargar el torneo.");
  return result.data;
}
