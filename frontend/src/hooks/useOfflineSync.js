import { useEffect } from "react";
import toast from "react-hot-toast";
import { createIncident } from "../services/incidentService";
import { getOfflineIncidents, removeOfflineIncident } from "../utils/offlineQueue";

const base64ToFile = async (dataUrl, fileName, mimeType) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: mimeType || blob.type });
};

export const useOfflineSync = () => {
  useEffect(() => {
    const syncIncidents = async () => {
      if (!navigator.onLine) {
        return;
      }

      const offlineIncidents = getOfflineIncidents();

      for (const incident of offlineIncidents) {
        try {
          // Rebuild the original multipart payload before sending it to the API.
          const formData = new FormData();
          formData.append("title", incident.title);
          formData.append("description", incident.description);
          formData.append("location", incident.location);
          formData.append("severity", incident.severity);
          formData.append("sync_status", "synced");

          if (incident.mediaPreview) {
            const file = await base64ToFile(
              incident.mediaPreview,
              incident.fileName || "offline-upload",
              incident.fileType
            );
            formData.append("media", file);
          }

          await createIncident(formData);
          removeOfflineIncident(incident.localId);
          toast.success(`Offline incident "${incident.title}" synced`);
        } catch (error) {
          console.error("Offline sync failed:", error);
        }
      }
    };

    window.addEventListener("online", syncIncidents);
    syncIncidents();

    return () => {
      window.removeEventListener("online", syncIncidents);
    };
  }, []);
};
