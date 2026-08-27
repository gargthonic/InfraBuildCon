import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { getProjects, deleteProject } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadProjects = () => {
    setStatus("loading");
    getProjects()
      .then((data) => {
        setProjects(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(loadProjects, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setDeleteError("");
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
    } catch (err) {
      if (err.message?.includes("Invalid or expired token")) {
        logout();
        navigate("/admin/login");
        return;
      }
      setDeleteError(err.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted text-sm">
            Manage the properties shown on the public site.
          </p>
        </div>
        <Link
          to="/admin/new"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-brand-foreground font-semibold py-2.5 px-5 rounded-full transition"
        >
          <HiPlus /> Add Property
        </Link>
      </div>

      {status === "loading" && <p className="text-muted">Loading…</p>}
      {status === "error" && (
        <p className="text-red-500">Couldn't load properties.</p>
      )}
      {deleteError && <p className="text-red-500 mb-4">{deleteError}</p>}

      {status === "ready" && projects.length === 0 && (
        <p className="text-muted">No properties yet. Add your first one.</p>
      )}

      {status === "ready" && projects.length > 0 && (
        <div className="border border-border rounded-2xl overflow-hidden bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-hover text-muted uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t border-border">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-10 w-10 rounded-md object-cover border border-border"
                      />
                      <span className="font-medium text-foreground">
                        {project.title}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {project.type || "—"}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {project.location || "—"}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {project.price || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {confirmId === project.id ? (
                          <>
                            <span className="text-xs text-muted">
                              Delete?
                            </span>
                            <button
                              onClick={() => handleDelete(project.id)}
                              disabled={deletingId === project.id}
                              className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-md transition"
                            >
                              {deletingId === project.id
                                ? "Deleting..."
                                : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs font-semibold text-muted hover:text-foreground px-3 py-1.5 rounded-md transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to={`/admin/edit/${project.id}`}
                              aria-label={`Edit ${project.title}`}
                              className="p-2 rounded-md text-muted hover:text-brand hover:bg-brand-soft transition"
                            >
                              <HiPencil size={18} />
                            </Link>
                            <button
                              onClick={() => setConfirmId(project.id)}
                              aria-label={`Delete ${project.title}`}
                              className="p-2 rounded-md text-muted hover:text-red-500 hover:bg-red-500/10 transition"
                            >
                              <HiTrash size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
