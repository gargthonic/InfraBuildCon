import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMail, HiPhone, HiTrash } from "react-icons/hi";
import { getLeads, updateLeadStatus, deleteLead } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminLeads() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  const loadLeads = () => {
    setStatus("loading");
    getLeads()
      .then((data) => {
        setLeads(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.message?.includes("Invalid or expired token")) {
          logout();
          navigate("/admin/login");
          return;
        }
        setStatus("error");
      });
  };

  useEffect(loadLeads, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleStatus = async (lead) => {
    setBusyId(lead.id);
    setActionError("");
    const nextStatus = lead.status === "new" ? "contacted" : "new";
    try {
      const updated = await updateLeadStatus(lead.id, nextStatus);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
    } catch (err) {
      setActionError(err.message || "Failed to update lead");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    setActionError("");
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setConfirmId(null);
    } catch (err) {
      setActionError(err.message || "Failed to delete lead");
    } finally {
      setBusyId(null);
    }
  };

  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted text-sm">
            Inquiries submitted from the website.
            {status === "ready" && newCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-brand font-semibold">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      {status === "loading" && <p className="text-muted">Loading…</p>}
      {status === "error" && (
        <p className="text-red-500">Couldn't load leads.</p>
      )}
      {actionError && <p className="text-red-500 mb-4">{actionError}</p>}

      {status === "ready" && leads.length === 0 && (
        <p className="text-muted">
          No leads yet. Once visitors submit the contact form or a property
          inquiry, they'll show up here.
        </p>
      )}

      {status === "ready" && leads.length > 0 && (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="border border-border rounded-2xl bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {lead.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        lead.status === "new"
                          ? "bg-brand text-brand-foreground"
                          : "bg-surface-hover text-muted"
                      }`}
                    >
                      {lead.status === "new" ? "New" : "Contacted"}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {lead.source} · {formatDate(lead.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(lead)}
                    disabled={busyId === lead.id}
                    className="text-xs font-semibold border border-border hover:border-brand hover:text-brand px-3 py-1.5 rounded-md transition disabled:opacity-60"
                  >
                    Mark as {lead.status === "new" ? "Contacted" : "New"}
                  </button>

                  {confirmId === lead.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={busyId === lead.id}
                        className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 rounded-md transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs font-semibold text-muted hover:text-foreground px-3 py-1.5 rounded-md transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmId(lead.id)}
                      aria-label={`Delete lead from ${lead.name}`}
                      className="p-2 rounded-md text-muted hover:text-red-500 hover:bg-red-500/10 transition"
                    >
                      <HiTrash size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted mb-3">
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
                  >
                    <HiMail size={14} /> {lead.email}
                  </a>
                )}
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}
                    className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
                  >
                    <HiPhone size={14} /> {lead.phone}
                  </a>
                )}
              </div>

              <p className="text-sm text-foreground/90 leading-relaxed">
                {lead.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
