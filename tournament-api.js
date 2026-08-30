const TOURNAMENT_API_URL = "https://script.google.com/macros/s/AKfycbyLwY8_7EGpI7K4eEJ_WVfMjZeEmGi6WhUgPbi8GgFmzSTb3jLACTZNf5Dby4p3dJoU/exec";

async function fetchTournamentData() {
  const response = await fetch(`${TOURNAMENT_API_URL}?action=tournament`, { cache: "no-store" });
  const result = await response.json().catch(() => {
    throw new Error("La respuesta del servidor no tiene formato valido.");
  });
  if (!response.ok || !result.success) throw new Error(result.message || "No se pudo cargar el torneo.");
  if (!result.data || !result.data.standings) {
    throw new Error("La Web App activa todavia no tiene la version de torneo. Guarda Code.gs y crea una Nueva version antes de implementar.");
  }
  return result.data;
}
