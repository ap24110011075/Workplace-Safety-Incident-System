import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-glow lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-gradient-to-br from-brand-700 via-teal-700 to-cyan-900 p-10 lg:block">
          <p className="inline-block rounded-full border border-white/20 px-4 py-2 text-sm text-white/90">
            Offline-first MERN PWA
          </p>
          <h1 className="mt-8 text-4xl font-bold leading-tight text-white">
            Workplace Safety Incident & Compliance Manager
          </h1>
          <p className="mt-6 text-base leading-7 text-teal-50">
            Report hazards, assign actions, track compliance, and analyze trends in one secure role-based dashboard.
          </p>
        </section>

        <section className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-white">Login</h2>
          <p className="mt-2 text-slate-400">Use your email and password to access the system.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                name="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                placeholder="worker@example.com"
                required
              />
            </div>
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                name="password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            New user?{" "}
            <Link to="/register" className="font-semibold text-brand-100">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
