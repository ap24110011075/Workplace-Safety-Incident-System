import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createIncident } from "../services/incidentService";
import { saveOfflineIncident } from "../utils/offlineQueue";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const IncidentFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    severity: "Low"
  });
  const [media, setMedia] = useState(null);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleFileChange = (event) => {
    setMedia(event.target.files[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!navigator.onLine) {
      let mediaPreview = "";

      if (media) {
        mediaPreview = await fileToBase64(media);
      }

      saveOfflineIncident({
        ...formData,
        sync_status: "pending_sync",
        mediaPreview,
        fileName: media?.name,
        fileType: media?.type
      });

      toast.success("Incident saved offline and will sync automatically");
      navigate("/incidents");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("location", formData.location);
      payload.append("severity", formData.severity);
      if (media) {
        payload.append("media", media);
      }

      await createIncident(payload);
      toast.success("Incident submitted successfully");
      navigate("/incidents");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not submit incident");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <div className="glass-card p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white">Report Safety Incident</h1>
        <p className="mt-3 text-slate-300">
          Workers can submit incidents online or offline. Offline reports are stored locally and synced when connection returns.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label-text">Title</label>
            <input
              name="title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Chemical spill near loading bay"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-text">Description</label>
            <textarea
              name="description"
              rows="5"
              className="input-field"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what happened and the immediate risk."
              required
            />
          </div>
          <div>
            <label className="label-text">Location</label>
            <input
              name="location"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
              placeholder="Plant A - Section 4"
              required
            />
          </div>
          <div>
            <label className="label-text">Severity</label>
            <select name="severity" className="input-field" value={formData.severity} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label-text">Upload Image or Video</label>
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="input-field py-2" />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              Submit Incident
            </button>
            <p className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {navigator.onLine ? "You are online. Data will be sent to the server." : "You are offline. Data will be stored locally."}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentFormPage;
