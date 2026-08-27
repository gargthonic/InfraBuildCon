import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  HiArrowLeft,
  HiLocationMarker,
  HiUser,
  HiMail,
  HiPhone,
  HiCheckCircle,
  HiShieldCheck,
} from "react-icons/hi";
import { getProject, submitLead } from "../lib/api";

const emptyLeadForm = { name: "", email: "", phone: "", message: "" };

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found

  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [leadErrors, setLeadErrors] = useState({});
  const [leadStatus, setLeadStatus] = useState("idle"); // idle | submitting | success
  const [leadError, setLeadError] = useState("");

  useEffect(() => {
    setStatus("loading");
    getProject(id)
      .then((data) => {
        setProject(data);
        setStatus("ready");
        setLeadForm({
          ...emptyLeadForm,
          message: `I'm interested in "${data.title}" — please send me more details.`,
        });
        setLeadStatus("idle");
      })
      .catch(() => setStatus("not-found"));
  }, [id]);

  const handleLeadChange = (e) => {
    const { name, value } = e.target;
    setLeadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!leadForm.name.trim()) errors.name = "Please enter your name";
    const hasEmail = leadForm.email.trim();
    const hasPhone = leadForm.phone.trim();
    if (!hasEmail && !hasPhone) {
      errors.email = "Add your email or phone so we can reach you";
      errors.phone = "Add your email or phone so we can reach you";
    } else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email)) {
      errors.email = "That email doesn't look right";
    }
    setLeadErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLeadError("");
    setLeadStatus("submitting");
    try {
      await submitLead({
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        message: leadForm.message,
        source: `Property: ${project.title}`,
      });
      setLeadStatus("success");
    } catch (err) {
      setLeadError(err.message || "Something went wrong. Please try again.");
      setLeadStatus("idle");
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6 py-24">
        <p className="text-muted">Loading property…</p>
      </main>
    );
  }

  if (status === "not-found" || !project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-brand mb-4">
          Project Not Found
        </h1>
        <p className="text-muted mb-8">
          The project you're looking for doesn't exist or may have been
          removed.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-brand-foreground font-semibold py-3 px-6 rounded-full transition"
        >
          <HiArrowLeft /> Back to Projects
        </Link>
      </main>
    );
  }

  const { title, location, price, type, beds, baths, sqft, details, image, tags } =
    project;

  const leadInputClass = (hasError) =>
    `w-full pl-10 pr-4 py-2.5 bg-background border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-colors text-sm ${
      hasError ? "border-red-400" : "border-border"
    }`;

  return (
    <main className="min-h-screen bg-background px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-brand hover:gap-3 font-medium mb-8 transition-all"
        >
          <HiArrowLeft /> Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Property details */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl border border-border bg-surface">
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="w-full h-80 md:h-[420px] object-cover"
              />
              {price && (
                <span className="absolute top-6 left-6 bg-brand text-brand-foreground text-lg font-semibold px-4 py-1.5 rounded-full shadow-md">
                  {price}
                </span>
              )}
            </div>

            <div className="p-8 md:p-12 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {title}
                </h1>
                {location && (
                  <p className="flex items-center gap-2 text-muted">
                    <HiLocationMarker className="text-brand" />
                    {location}
                  </p>
                )}
              </div>

              {(beds || baths || sqft || type) && (
                <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                  {type && (
                    <div>
                      <span className="block text-sm text-muted">Type</span>
                      <span className="font-semibold text-foreground">
                        {type}
                      </span>
                    </div>
                  )}
                  {beds && (
                    <div>
                      <span className="block text-sm text-muted">Beds</span>
                      <span className="font-semibold text-foreground">
                        {beds}
                      </span>
                    </div>
                  )}
                  {baths && (
                    <div>
                      <span className="block text-sm text-muted">Baths</span>
                      <span className="font-semibold text-foreground">
                        {baths}
                      </span>
                    </div>
                  )}
                  {sqft && (
                    <div>
                      <span className="block text-sm text-muted">
                        Sq. Ft.
                      </span>
                      <span className="font-semibold text-foreground">
                        {Number(sqft).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-foreground/90 leading-relaxed text-lg">
                {details}
              </p>

              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-brand-soft text-brand-soft-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Inline lead capture — stays with the property, no page change */}
          <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-surface shadow-sm p-6">
            {leadStatus === "success" ? (
              <div className="text-center py-6">
                <HiCheckCircle className="text-brand mx-auto mb-3" size={44} />
                <h3 className="text-lg font-bold text-brand mb-1">
                  Request Sent!
                </h3>
                <p className="text-muted text-sm">
                  We'll reach out about this property within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Interested in this property?
                </h3>
                <p className="text-muted text-sm mb-5">
                  Leave your details and we'll get back to you shortly.
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-3" noValidate>
                  <div>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-3 text-brand" />
                      <input
                        type="text"
                        name="name"
                        value={leadForm.name}
                        onChange={handleLeadChange}
                        placeholder="Your Name"
                        className={leadInputClass(leadErrors.name)}
                      />
                    </div>
                    {leadErrors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {leadErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-3 text-brand" />
                      <input
                        type="email"
                        name="email"
                        value={leadForm.email}
                        onChange={handleLeadChange}
                        placeholder="Email"
                        className={leadInputClass(leadErrors.email)}
                      />
                    </div>
                    {leadErrors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {leadErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <HiPhone className="absolute left-3 top-3 text-brand" />
                      <input
                        type="tel"
                        name="phone"
                        value={leadForm.phone}
                        onChange={handleLeadChange}
                        placeholder="Phone"
                        className={leadInputClass(leadErrors.phone)}
                      />
                    </div>
                    {leadErrors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {leadErrors.phone}
                      </p>
                    )}
                  </div>

                  <textarea
                    name="message"
                    rows={3}
                    value={leadForm.message}
                    onChange={handleLeadChange}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-colors text-sm"
                  />

                  {leadError && (
                    <p className="text-xs text-red-500">{leadError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={leadStatus === "submitting"}
                    className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-foreground font-semibold py-2.5 rounded-full transition-all text-sm"
                  >
                    {leadStatus === "submitting"
                      ? "Sending..."
                      : "Request Info"}
                  </button>

                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <HiShieldCheck className="text-brand shrink-0" />
                    Private &amp; never shared. No spam.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
