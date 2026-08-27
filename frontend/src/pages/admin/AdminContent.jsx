import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateContentSection } from "../../lib/api";
import { useContent } from "../../context/ContentContext";
import { useAuth } from "../../context/AuthContext.jsx";
import RepeatableList from "../../components/admin/RepeatableList.jsx";

const inputClass =
  "w-full px-4 py-2.5 bg-background border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-colors";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

const SECTIONS = [
  {
    key: "hero",
    label: "Hero",
    kind: "object",
    fields: [
      { name: "badge", label: "Badge Text" },
      { name: "title", label: "Title (line 1)" },
      { name: "highlight", label: "Title Highlight (line 2)" },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      { name: "primaryCtaText", label: "Primary Button Text" },
      { name: "primaryCtaLink", label: "Primary Button Link" },
      { name: "secondaryCtaText", label: "Secondary Button Text" },
      { name: "secondaryCtaLink", label: "Secondary Button Link" },
    ],
  },
  {
    key: "stats",
    label: "Stats",
    kind: "list",
    listFields: [
      { name: "number", label: "Number", type: "number" },
      { name: "label", label: "Label" },
    ],
    emptyItem: { number: "", label: "" },
    addLabel: "Add stat",
  },
  {
    key: "trustBadges",
    label: "Trust Badges",
    kind: "list",
    listFields: [{ name: "label", label: "Badge Text", full: true }],
    emptyItem: { label: "" },
    addLabel: "Add badge",
  },
  {
    key: "whyChooseUs",
    label: "Why Choose Us",
    kind: "list",
    listFields: [
      { name: "icon", label: "Icon", type: "icon" },
      { name: "title", label: "Title" },
      { name: "description", label: "Description", type: "textarea", full: true },
    ],
    emptyItem: { icon: "Sparkles", title: "", description: "" },
    addLabel: "Add item",
  },
  {
    key: "process",
    label: "How It Works",
    kind: "list",
    listFields: [
      { name: "title", label: "Step Title" },
      { name: "description", label: "Description", type: "textarea", full: true },
    ],
    emptyItem: { title: "", description: "" },
    addLabel: "Add step",
  },
  {
    key: "services",
    label: "Services",
    kind: "list",
    listFields: [
      { name: "icon", label: "Icon", type: "icon" },
      { name: "title", label: "Title" },
      { name: "description", label: "Description", type: "textarea", full: true },
    ],
    emptyItem: { icon: "Sparkles", title: "", description: "" },
    addLabel: "Add service",
  },
  {
    key: "testimonials",
    label: "Testimonials",
    kind: "list",
    listFields: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "quote", label: "Quote", type: "textarea", full: true },
    ],
    emptyItem: { name: "", role: "", quote: "" },
    addLabel: "Add testimonial",
  },
  {
    key: "faq",
    label: "FAQ",
    kind: "list",
    listFields: [
      { name: "question", label: "Question", full: true },
      { name: "answer", label: "Answer", type: "textarea", full: true },
    ],
    emptyItem: { question: "", answer: "" },
    addLabel: "Add question",
  },
  { key: "about", label: "About Page", kind: "about" },
  {
    key: "contact",
    label: "Contact Info",
    kind: "object",
    fields: [
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email" },
      { name: "addressLine1", label: "Address Line 1" },
      { name: "addressLine2", label: "Address Line 2" },
      { name: "addressLine3", label: "Address Line 3" },
      { name: "mapEmbedUrl", label: "Map Embed URL", type: "textarea" },
    ],
  },
  { key: "footer", label: "Footer", kind: "footer" },
];

export default function AdminContent() {
  const { content, status, refresh } = useContent();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState("hero");
  const [draft, setDraft] = useState(null);
  const [draftKey, setDraftKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const activeSection = SECTIONS.find((s) => s.key === activeKey);

  useEffect(() => {
    if (!content) return;
    setDraft(content[activeKey]);
    setDraftKey(activeKey);
    setError("");
    setSaved(false);
  }, [activeKey, content]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updateContentSection(activeKey, draft);
      await refresh();
      setSaved(true);
    } catch (err) {
      if (err.message?.includes("Invalid or expired token")) {
        logout();
        navigate("/admin/login");
        return;
      }
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !draft || draftKey !== activeKey) {
    return <p className="text-muted">Loading content…</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Section nav */}
      <nav className="md:w-56 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveKey(section.key)}
            className={`text-left px-4 py-2.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeKey === section.key
                ? "bg-brand-soft text-brand"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Editor panel */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold mb-6">{activeSection.label}</h1>

        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6">
          {activeSection.kind === "object" && (
            <ObjectForm
              fields={activeSection.fields}
              value={draft}
              onChange={setDraft}
            />
          )}

          {activeSection.kind === "list" && (
            <RepeatableList
              items={draft}
              fields={activeSection.listFields}
              emptyItem={activeSection.emptyItem}
              addLabel={activeSection.addLabel}
              onChange={setDraft}
            />
          )}

          {activeSection.kind === "about" && (
            <div className="space-y-6">
              <ObjectForm
                fields={[
                  { name: "intro", label: "Intro Paragraph", type: "textarea" },
                  { name: "missionTitle", label: "Mission Section Title" },
                  { name: "missionText", label: "Mission Text", type: "textarea" },
                ]}
                value={draft}
                onChange={setDraft}
              />
              <div>
                <label className={labelClass}>Values</label>
                <RepeatableList
                  items={draft.values || []}
                  fields={[
                    { name: "title", label: "Title" },
                    { name: "description", label: "Description", full: true },
                  ]}
                  emptyItem={{ title: "", description: "" }}
                  addLabel="Add value"
                  onChange={(values) => setDraft({ ...draft, values })}
                />
              </div>
            </div>
          )}

          {activeSection.kind === "footer" && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Tagline</label>
                <input
                  className={inputClass}
                  value={draft.tagline || ""}
                  onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {["instagram", "facebook", "linkedin", "twitter"].map((key) => (
                  <div key={key}>
                    <label className={labelClass}>
                      {key[0].toUpperCase() + key.slice(1)} URL
                    </label>
                    <input
                      className={inputClass}
                      value={draft.socials?.[key] || ""}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          socials: { ...draft.socials, [key]: e.target.value },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && <p className="text-sm text-brand">Saved.</p>}

          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-foreground font-semibold py-2.5 px-6 rounded-full transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ObjectForm({ fields, value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {fields.map((field) => (
        <div key={field.name}>
          <label className={labelClass}>{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              rows={3}
              className={inputClass}
              value={value[field.name] || ""}
              onChange={(e) =>
                onChange({ ...value, [field.name]: e.target.value })
              }
            />
          ) : (
            <input
              className={inputClass}
              value={value[field.name] || ""}
              onChange={(e) =>
                onChange({ ...value, [field.name]: e.target.value })
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
