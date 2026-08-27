import { useEffect, useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { getProjects } from "../lib/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [visible, setVisible] = useState(false);
  const [activeType, setActiveType] = useState("All");

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setStatus("ready");
        setVisible(true);
      })
      .catch(() => setStatus("error"));
  }, []);

  const types = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.type).filter(Boolean))],
    [projects]
  );

  const filtered = useMemo(
    () =>
      activeType === "All"
        ? projects
        : projects.filter((p) => p.type === activeType),
    [projects, activeType]
  );

  return (
    <main className="min-h-screen bg-background px-6 py-16 md:py-28">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Explore Our <span className="text-brand">Landmark Projects</span>
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
          At Infra Buildcon, every project is a testament to our commitment to
          innovation, quality, and community impact.
        </p>
      </section>

      {status === "loading" && (
        <p className="text-center text-muted">Loading properties…</p>
      )}

      {status === "error" && (
        <p className="text-center text-red-500">
          Couldn't load properties right now. Please try again shortly.
        </p>
      )}

      {status === "ready" && (
        <>
          {/* Filter Tabs */}
          <section className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3 mb-14">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activeType === type
                    ? "bg-brand text-brand-foreground border-brand"
                    : "bg-surface text-muted border-border hover:border-brand hover:text-brand"
                }`}
              >
                {type}
              </button>
            ))}
          </section>

          {/* Projects Grid */}
          <section className="max-w-7xl mx-auto grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                visible={visible}
                delay={index * 150}
              />
            ))}
          </section>

          {filtered.length === 0 && (
            <p className="text-center text-muted mt-16">
              No properties found in this category yet.
            </p>
          )}
        </>
      )}
    </main>
  );
}
