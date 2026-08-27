import { useState } from "react";
import {
  HiUser,
  HiMail,
  HiPhone,
  HiChatAlt,
  HiLocationMarker,
  HiCheckCircle,
  HiShieldCheck,
} from "react-icons/hi";
import { initialContactForm } from "../constants/index.js";
import { useContent } from "../context/ContentContext";
import { submitLead } from "../lib/api";

export default function Contact() {
  const { content } = useContent();
  const [formData, setFormData] = useState(initialContactForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Please enter your name";
    if (!formData.message.trim())
      nextErrors.message = "Let us know what you need";

    const hasEmail = formData.email.trim();
    const hasPhone = formData.phone.trim();
    if (!hasEmail && !hasPhone) {
      nextErrors.email = "Add your email or phone so we can reach you";
      nextErrors.phone = "Add your email or phone so we can reach you";
    } else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "That email doesn't look right";
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError("");
    setStatus("submitting");
    try {
      await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: "Contact Page",
      });
      setStatus("success");
      setFormData(initialContactForm);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const contact = content?.contact;

  const inputClass = (hasError) =>
    `w-full pl-10 pr-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-colors ${
      hasError ? "border-red-400" : "border-border"
    }`;

  if (status === "success") {
    return (
      <div className="min-h-screen w-full bg-background text-foreground py-16 px-6 md:px-20 flex items-center justify-center">
        <div className="max-w-md text-center bg-surface p-10 shadow-xl rounded-2xl border border-border">
          <HiCheckCircle className="text-brand mx-auto mb-4" size={56} />
          <h2 className="text-2xl font-bold text-brand mb-2">
            Thanks — We Got It!
          </h2>
          <p className="text-muted mb-6">
            A member of our team will reach out within 24 hours. If it's
            urgent, feel free to call us directly.
          </p>
          {contact?.phone && (
            <a
              href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 text-brand font-semibold hover:underline mb-6"
            >
              <HiPhone /> {contact.phone}
            </a>
          )}
          <div>
            <button
              onClick={() => setStatus("idle")}
              className="bg-brand hover:bg-brand-hover text-brand-foreground font-semibold py-3 px-6 rounded-full transition-all"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Contact Form */}
        <div className="flex-1 bg-surface p-8 shadow-sm rounded-2xl border border-border">
          <h2 className="text-3xl font-bold mb-2 text-brand">Talk to Us</h2>
          <p className="text-muted text-sm mb-6">
            Just a couple of details — no account, no hassle. We'll call or
            email you back.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div>
              <div className="relative">
                <HiUser className="absolute left-3 top-3.5 text-brand" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass(errors.name)}
                  placeholder="Your Name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <HiMail className="absolute left-3 top-3.5 text-brand" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass(errors.email)}
                  placeholder="Email Address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <HiPhone className="absolute left-3 top-3.5 text-brand" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass(errors.phone)}
                  placeholder="Phone Number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
              <p className="mt-1 text-xs text-muted">
                Add at least one — email or phone.
              </p>
            </div>

            {/* Message */}
            <div>
              <div className="relative">
                <HiChatAlt className="absolute left-3 top-3.5 text-brand" />
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={inputClass(errors.message)}
                  placeholder="What are you looking for?"
                ></textarea>
              </div>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-red-500">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full sm:w-auto bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-foreground font-semibold py-3 px-6 rounded-full transition-all"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

            <p className="flex items-center gap-1.5 text-xs text-muted">
              <HiShieldCheck className="text-brand" />
              Your information is private and never shared. No spam, ever.
            </p>
          </form>
        </div>

        {/* Contact Details Section */}
        <aside className="flex-1 max-w-md bg-surface border border-border rounded-2xl p-8 shadow-sm text-foreground space-y-8">
          <h2 className="text-3xl font-bold mb-6 text-brand tracking-wide">
            Get In Touch
          </h2>
          <p className="text-muted text-base leading-relaxed">
            Have questions or want to discuss your project? Reach out to us
            anytime!
          </p>

          <div className="space-y-6 mt-6">
            {contact?.phone && (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-soft rounded-full text-brand shadow-sm">
                  <HiPhone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Phone
                  </h3>
                  <a
                    href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                    className="text-brand font-medium hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {contact?.email && (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-soft rounded-full text-brand shadow-sm">
                  <HiMail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Email
                  </h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-brand font-medium hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            {contact?.addressLine1 && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-soft rounded-full text-brand shadow-sm mt-1">
                  <HiLocationMarker size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Office Address
                  </h3>
                  <address className="not-italic text-muted leading-relaxed">
                    {contact.addressLine1}
                    <br />
                    {contact.addressLine2}
                    <br />
                    {contact.addressLine3}
                  </address>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
