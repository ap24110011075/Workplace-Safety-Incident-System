import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-600 px-3 py-2 font-bold text-white shadow-glow">
            WSM
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Workplace Safety Manager</p>
            <p className="text-xs text-slate-400">Incident & Compliance Dashboard</p>
          </div>
        </Link>

        {user && (
          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard" className="btn-secondary text-sm">
              Dashboard
            </NavLink>
            <NavLink to="/incidents" className="btn-secondary text-sm">
              Incidents
            </NavLink>
            <NavLink to="/incident/new" className="btn-secondary text-sm">
              Report Incident
            </NavLink>
            {user.role === "admin" && (
              <NavLink to="/reports" className="btn-secondary text-sm">
                Reports
              </NavLink>
            )}
            <button onClick={handleLogout} className="btn-primary text-sm">
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
