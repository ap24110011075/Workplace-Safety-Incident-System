import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createAction } from "../services/actionService";
import { fetchIncidents } from "../services/incidentService";
import { fetchUsers } from "../services/userService";

const AssignActionForm = ({ onCreated }) => {
  const [workers, setWorkers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    incidentId: "",
    assignedTo: "",
    title: "",
    description: "",
    deadline: ""
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [workerData, incidentData] = await Promise.all([
          fetchUsers({ role: "worker" }),
          fetchIncidents({ page: 1, limit: 100 })
        ]);
        setWorkers(workerData);
        setIncidents(incidentData.incidents || []);
      } catch (error) {
        toast.error("Could not load workers and incidents");
      }
    };

    loadOptions();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createAction(formData);
      toast.success("Action assigned successfully");
      setFormData({
        incidentId: "",
        assignedTo: "",
        title: "",
        description: "",
        deadline: ""
      });
      onCreated?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not assign action");
    }
  };

  return (
    <div className="glass-card p-5">
      <h2 className="text-xl font-semibold text-white">Assign Corrective Action</h2>
      <p className="mt-2 text-sm text-slate-400">
        Supervisors can assign a worker, set a deadline, and start the workflow.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="label-text">Incident</label>
          <select
            name="incidentId"
            className="input-field"
            value={formData.incidentId}
            onChange={handleChange}
            required
          >
            <option value="">Select incident</option>
            {incidents.map((incident) => (
              <option key={incident._id} value={incident._id}>
                {incident.title} - {incident.location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Assign To</label>
          <select
            name="assignedTo"
            className="input-field"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select worker</option>
            {workers.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name} ({worker.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Action Title</label>
          <input
            name="title"
            className="input-field"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Inspect spill source"
            required
          />
        </div>
        <div>
          <label className="label-text">Description</label>
          <textarea
            name="description"
            rows="4"
            className="input-field"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add the steps or expected result."
          />
        </div>
        <div>
          <label className="label-text">Deadline</label>
          <input
            type="date"
            name="deadline"
            className="input-field"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Assign Action
        </button>
      </form>
    </div>
  );
};

export default AssignActionForm;
