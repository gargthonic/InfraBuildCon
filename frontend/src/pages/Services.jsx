import { getIcon } from "../constants/icons";
import { useContent } from "../context/ContentContext";

export default function Services() {
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
        <p className="text-red-500">Couldn't load services right now.</p>
      </div>
    );
  }

  const { services } = content;

  return (
    <div className="min-h-screen bg-background py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Our <span className="text-brand">Services</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Comprehensive real estate services designed to guide you at every
          stage of your property journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services?.map(({ title, description, icon }, index) => {
          const Icon = getIcon(icon);
          return (
            <div
              key={index}
              className="bg-surface border border-border shadow-sm hover:shadow-lg hover:border-brand/40 rounded-2xl p-7 transition duration-300 group"
            >
              <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-soft text-brand group-hover:bg-brand group-hover:text-brand-foreground transition duration-300">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-brand transition">
                {title}
              </h3>
              <p className="text-muted leading-relaxed">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
