import { Link } from "react-router-dom";
import { HiLocationMarker, HiArrowRight } from "react-icons/hi";

export default function ProjectCard({ project, visible = true, delay = 0 }) {
  const { id, title, location, price, description, image, tags } = project;

  return (
    <article
      className={`group relative rounded-2xl overflow-hidden bg-surface border border-border shadow-sm transform transition duration-700 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-brand/40 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
        {price && (
          <span className="absolute top-4 left-4 bg-brand text-brand-foreground text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            {price}
          </span>
        )}
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-foreground group-hover:text-brand transition-colors">
          {title}
        </h3>

        {location && (
          <p className="flex items-center gap-1 text-sm text-muted">
            <HiLocationMarker className="text-brand" />
            {location}
          </p>
        )}

        <p className="text-muted leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-brand-soft text-brand-soft-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full select-none"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/projects/${id}`}
          aria-label={`View details about ${title}`}
          className="inline-flex items-center gap-1.5 pt-2 text-brand font-semibold hover:gap-2.5 transition-all"
        >
          View Details <HiArrowRight />
        </Link>
      </div>
    </article>
  );
}
