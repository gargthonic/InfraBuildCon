import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowRight, HiCheckCircle, HiChevronDown } from "react-icons/hi";
import heroImg from "./../assets/heroImg.jpg";
import { getIcon } from "../constants/icons";
import { getProjects } from "../lib/api";
import { useContent } from "../context/ContentContext";
import CountUp from "react-countup";
import ProjectCard from "../components/ProjectCard";

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground"
      >
        {question}
        <HiChevronDown
          className={`shrink-0 text-brand transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-muted leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { content, status } = useContent();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data.slice(0, 3)))
      .catch(() => setProjects([]));
  }, []);

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
        <p className="text-red-500">Couldn't load site content right now.</p>
      </div>
    );
  }

  const { hero, stats, trustBadges, whyChooseUs, process, testimonials, faq } =
    content;

  return (
    <div className="w-full bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-6 lg:px-20 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between relative z-10">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            {hero.badge && (
              <span className="inline-block text-xs uppercase tracking-widest text-brand mb-4 font-semibold bg-brand-soft px-4 py-1.5 rounded-full">
                {hero.badge}
              </span>
            )}

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              {hero.title}
              <br />
              <span className="text-brand">{hero.highlight}</span>
            </h1>

            <p className="text-lg text-muted mb-6 max-w-lg leading-relaxed">
              {hero.subtitle}
            </p>

            {trustBadges?.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                {trustBadges.map(({ label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-sm text-foreground/80"
                  >
                    <HiCheckCircle className="text-brand" />
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 flex-wrap">
              {hero.primaryCtaText && (
                <Link
                  to={hero.primaryCtaLink || "/"}
                  className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-brand-foreground py-3.5 px-7 rounded-full font-semibold transition shadow-lg shadow-brand/20"
                >
                  {hero.primaryCtaText} <HiArrowRight />
                </Link>
              )}
              {hero.secondaryCtaText && (
                <Link
                  to={hero.secondaryCtaLink || "/"}
                  className="inline-flex items-center gap-2 border border-border text-foreground hover:border-brand hover:text-brand py-3.5 px-7 rounded-full font-semibold transition"
                >
                  {hero.secondaryCtaText}
                </Link>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[46%] relative">
            <div className="absolute -inset-4 rounded-3xl bg-brand/10 blur-2xl" />
            <img
              src={heroImg}
              alt="Construction site"
              className="relative w-full rounded-2xl shadow-2xl border border-border object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats?.length > 0 && (
        <section className="py-12 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6 text-center">
            {stats.map(({ number, label }, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-8 flex flex-col items-center justify-center bg-surface border border-border shadow-sm"
              >
                <h3 className="text-5xl font-extrabold text-brand mb-3">
                  <CountUp end={Number(number)} duration={3} />+
                </h3>
                <p className="text-muted text-lg font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      {whyChooseUs?.length > 0 && (
        <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-center">
            Why Choose <span className="text-brand">Infra Buildcon?</span>
          </h2>
          <p className="text-muted text-center max-w-xl mx-auto mb-14">
            The pillars that shape every property we touch and every project
            we deliver.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map(({ icon, title, description }, index) => {
              const Icon = getIcon(icon);
              return (
                <div
                  key={index}
                  className="bg-surface border border-border shadow-sm hover:shadow-lg hover:border-brand/40 transition rounded-2xl p-7"
                >
                  <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-muted leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Process Section */}
      {process?.length > 0 && (
        <section className="py-20 px-6 lg:px-20 bg-surface border-y border-border">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-14 text-center">
            How It <span className="text-brand">Works</span>
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map(({ title, description }, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-extrabold text-brand/20 mb-3">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Properties Section */}
      <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
              Featured <span className="text-brand">Properties</span>
            </h2>
            <p className="text-muted">
              A glimpse at what we've recently delivered.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-brand font-semibold hover:gap-2.5 transition-all"
          >
            View All <HiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              delay={index * 150}
            />
          ))}
        </div>
        {projects.length === 0 && (
          <p className="text-center text-muted">
            No featured properties yet — check back soon.
          </p>
        )}
      </section>

      {/* Testimonials Section */}
      {testimonials?.length > 0 && (
        <section className="py-20 px-6 lg:px-20 bg-surface border-y border-border">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-14 text-center">
            What Our <span className="text-brand">Clients Say</span>
          </h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, quote }, index) => (
              <div
                key={index}
                className="bg-background border border-border shadow-sm rounded-2xl p-8 flex flex-col"
              >
                <p className="text-foreground/90 italic leading-relaxed mb-6">
                  “{quote}”
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-brand">{name}</p>
                  <p className="text-sm text-muted">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faq?.length > 0 && (
        <section className="py-20 px-6 lg:px-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-14 text-center">
            Frequently Asked <span className="text-brand">Questions</span>
          </h2>
          <div className="space-y-4">
            {faq.map(({ question, answer }, index) => (
              <FaqItem key={index} question={question} answer={answer} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-20 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to bring your project to life?
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          Let's discuss your ideas and make them a reality with expert
          planning and execution.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-brand-foreground py-3.5 px-8 rounded-full font-semibold transition shadow-lg shadow-brand/20"
        >
          Contact Us <HiArrowRight />
        </Link>
      </section>
    </div>
  );
}
