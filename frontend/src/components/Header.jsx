import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX, HiPhone } from "react-icons/hi";
import logo from "./../assets/logo.jpg";
import ThemeToggle from "./ThemeToggle";
import { useContent } from "../context/ContentContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
];

export default function Header() {
  const { content } = useContent();
  const phone = content?.contact?.phone;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative py-1 transition-colors duration-200 ${
      isActive ? "text-brand font-semibold" : "text-foreground/80 hover:text-brand"
    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-brand after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "block py-3 text-brand font-semibold border-b border-border"
      : "block py-3 text-foreground/80 border-b border-border hover:text-brand transition-colors duration-200";

  return (
    <nav
      className={`sticky top-0 left-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 border-border shadow-sm"
          : "bg-background/40 border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-3 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <img
            src={logo}
            alt="Infra Buildcon Logo"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
          />
          <span className="hidden sm:block text-lg font-bold tracking-tight text-foreground">
            Infra Buildcon
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-10 text-[15px] font-medium">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-brand transition-colors"
            >
              <HiPhone className="text-brand" /> {phone}
            </a>
          )}
          <ThemeToggle />
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${
                isActive ? "bg-brand-hover" : "bg-brand hover:bg-brand-hover"
              } text-brand-foreground font-semibold py-2.5 px-5 rounded-full transition-colors duration-200 shadow-sm`
            }
          >
            Contact Us
          </NavLink>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="text-foreground p-2 rounded-full hover:bg-surface-hover transition"
          >
            {open ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out bg-background/95 backdrop-blur-md border-t border-border ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="px-6 pb-4">
          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-2 py-3 text-brand font-semibold border-b border-border"
            >
              <HiPhone /> {phone}
            </a>
          )}
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={mobileLinkClass} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 block text-center bg-brand hover:bg-brand-hover text-brand-foreground font-semibold py-3 px-5 rounded-full transition-colors duration-200"
          >
            Contact Us
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
