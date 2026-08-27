import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProject,
  createProject,
  updateProject,
} from "../../lib/api";
import { emptyProjectForm } from "../../constants/index";
import { useAuth } from "../../context/AuthContext.jsx";

const PROJECT_TYPES = ["Residential", "Commercial", "Infrastructure"];

function projectToForm(project) {
  return {
    title: project.title || "",
    location: project.location || "",
    price: project.price || "",
    type: project.type || "",
    beds: project.beds ?? "",
    baths: project.baths ?? "",
    sqft: project.sqft ?? "",
    description: project.description || "",
    details: project.details || "",
    image: project.image || "",
    tags: (project.tags || []).join(", "),
  };
}

function formToPayload(form) {
  return {
    title: form.title.trim(),
    location: form.location.trim(),
    price: form.price.trim(),
    type: form.type,
    beds: form.beds === "" ? null : Number(form.beds),
    baths: form.baths === "" ? null : Number(form.baths),
    sqft: form.sqft === "" ? null : Number(form.sqft),
    description: form.description.trim(),
    details: form.details.trim(),
    image: form.image.trim(),
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export default function AdminProjectForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState(emptyProjectForm);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    getProject(id)
      .then((project) => setForm(projectToForm(project)))
      .catch(() => setError("Couldn't load this property."))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = formToPayload(form);
      if (isEditing) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }
      navigate("/admin");
    } catch (err) {
      if (err.message?.includes("Invalid or expired token")) {
        logout();
        navigate("/admin/login");
        return;
      }
      setError(err.message || "Failed to save property");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-background border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  if (loading) {
    return <p className="text-muted">Loading property…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Property" : "Add Property"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-surface border border-border rounded-2xl p-6 md:p-8"
      >
        <div>
          <label className={labelClass}>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="e.g. Modern Residential Complex"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Denver, CO"
            />
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. $1,250,000"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a type</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Beds</label>
            <input
              type="number"
              min="0"
              name="beds"
              value={form.beds}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Baths</label>
            <input
              type="number"
              min="0"
              name="baths"
              value={form.baths}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Sq. Ft.</label>
            <input
              type="number"
              min="0"
              name="sqft"
              value={form.sqft}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Image URL *</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>Tags</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className={inputClass}
            placeholder="Comma-separated, e.g. Modern, Residential, Comfort"
          />
        </div>

        <div>
          <label className={labelClass}>Short Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={2}
            className={inputClass}
            placeholder="Shown on property cards"
          />
        </div>

        <div>
          <label className={labelClass}>Full Details</label>
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            placeholder="Shown on the property detail page"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-foreground font-semibold py-2.5 px-6 rounded-full transition"
          >
            {submitting
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Add Property"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="text-muted hover:text-foreground font-semibold py-2.5 px-6 rounded-full border border-border transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
