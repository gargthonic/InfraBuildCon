import { useContent } from "../context/ContentContext";

export default function About() {
  const { content, status } = useContent();

  if (status === "loading" || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-500">Couldn't load page content right now.</p>
      </div>
    );
  }

  const { about } = content;

  return (
    <main className="px-6 py-16 md:py-24 bg-background min-h-screen">
      {/* Heading Section */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          About <span className="text-brand">Infra Buildcon</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed tracking-wide">
          {about.intro}
        </p>
      </section>

      {/* Mission + Image */}
      <section className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto mb-20">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            {about.missionTitle}
          </h2>
          <p className="text-muted leading-relaxed tracking-wide">
            {about.missionText}
          </p>
        </div>

        <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl border border-border max-h-[450px]">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Infrastructure project"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Values Grid */}
      {about.values?.length > 0 && (
        <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.values.map(({ title, description }) => (
            <div
              key={title}
              className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-brand/40 transition"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
