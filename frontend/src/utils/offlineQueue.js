const STORAGE_KEY = "offline_incidents_queue";

export const getOfflineIncidents = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const saveOfflineIncident = (incident) => {
  const currentIncidents = getOfflineIncidents();
  currentIncidents.push({
    ...incident,
    // localId helps us remove the exact queued item after a successful sync.
    localId: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentIncidents));
};

export const clearOfflineIncidents = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const removeOfflineIncident = (localId) => {
  const currentIncidents = getOfflineIncidents();
  const filteredIncidents = currentIncidents.filter((incident) => incident.localId !== localId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredIncidents));
};
