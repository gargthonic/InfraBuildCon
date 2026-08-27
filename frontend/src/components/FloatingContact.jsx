import { HiPhone } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { useContent } from "../context/ContentContext";

export default function FloatingContact() {
  const { content } = useContent();
  const phone = content?.contact?.phone;
  if (!phone) return null;

  const digits = phone.replace(/[^+\d]/g, "");
  const whatsappDigits = digits.replace(/^\+/, "");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${whatsappDigits}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
        className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
      >
        <FaWhatsapp size={26} />
      </a>
      <a
        href={`tel:${digits}`}
        aria-label="Call us"
        title="Call us"
        className="flex items-center justify-center h-14 w-14 rounded-full bg-brand text-brand-foreground shadow-lg hover:scale-110 transition-transform"
      >
        <HiPhone size={24} />
      </a>
    </div>
  );
}
