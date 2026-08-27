import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { useContent } from "../context/ContentContext";

const SOCIAL_ICONS = [
  { key: "instagram", icon: FaInstagram, label: "Instagram" },
  { key: "facebook", icon: FaFacebookF, label: "Facebook" },
  { key: "linkedin", icon: FaLinkedinIn, label: "LinkedIn" },
  { key: "twitter", icon: FaTwitter, label: "Twitter" },
];

export default function Footer() {
  const { content } = useContent();
  const contact = content?.contact;
  const footer = content?.footer;
  const socials = footer?.socials || {};

  return (
    <footer className="bg-surface border-t border-border text-foreground py-10 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-5 text-brand">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            {contact?.phone && (
              <li className="flex items-center gap-4">
                <div className="bg-brand-soft rounded-full p-2 text-brand shadow-sm">
                  <HiPhone size={22} />
                </div>
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-brand transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
            )}
            {contact?.email && (
              <li className="flex items-center gap-4">
                <div className="bg-brand-soft rounded-full p-2 text-brand shadow-sm">
                  <HiMail size={22} />
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-brand transition-colors"
                >
                  {contact.email}
                </a>
              </li>
            )}
            {contact?.addressLine1 && (
              <li>
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-brand-soft rounded-full p-2 text-brand shadow-sm mt-1">
                    <HiLocationMarker size={22} />
                  </div>
                  <address className="not-italic leading-tight text-muted text-sm">
                    {contact.addressLine1}
                    <br />
                    {contact.addressLine2}
                    <br />
                    {contact.addressLine3}
                  </address>
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold mb-5 text-brand">Follow Us</h3>
          <div className="flex gap-6 mt-3">
            {SOCIAL_ICONS.filter(({ key }) => socials[key]).map(
              ({ key, icon: Icon, label }) => (
                <a
                  key={key}
                  href={socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="bg-brand-soft text-brand p-3 rounded-full hover:bg-brand hover:text-brand-foreground transition transform hover:scale-110 shadow-sm"
                >
                  <Icon size={20} />
                </a>
              )
            )}
          </div>
        </div>

        {/* Copyright & Tagline */}
        <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right space-y-5 px-4">
          {footer?.tagline && (
            <p className="italic text-brand font-semibold max-w-xs tracking-wide leading-relaxed">
              {footer.tagline}
            </p>
          )}
          <p className="text-sm text-muted select-none tracking-wider font-medium uppercase">
            © {new Date().getFullYear()} Infra Buildcon. All rights reserved.
          </p>
        </div>
      </div>

      {/* Map Section Full Width */}
      {contact?.mapEmbedUrl && (
        <div className="max-w-7xl mx-auto mt-10 rounded-lg overflow-hidden shadow-md border border-border">
          <iframe
            title="Infra Buildcon Location"
            src={contact.mapEmbedUrl}
            width="100%"
            height="180"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}
    </footer>
  );
}
