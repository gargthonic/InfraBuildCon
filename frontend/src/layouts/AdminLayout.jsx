import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { HiLogout, HiExternalLink } from "react-icons/hi";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-soft text-brand"
        : "text-muted hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-surface px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="font-bold text-lg">
            Infra Buildcon <span className="text-brand">Admin</span>
          </Link>
          <NavLink to="/admin/leads" className={linkClass}>
            Leads
          </NavLink>
          <NavLink to="/admin" end className={linkClass}>
            Properties
          </NavLink>
          <NavLink to="/admin/content" className={linkClass}>
            Site Content
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors"
          >
            View Site <HiExternalLink />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-surface-hover hover:bg-brand hover:text-brand-foreground border border-border px-3 py-2 rounded-md transition-colors"
          >
            <HiLogout /> Logout
          </button>
        </div>
      </nav>

      <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
