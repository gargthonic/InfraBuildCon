import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.join(__dirname, "..", "data", "content.json");

const VALID_SECTIONS = [
  "siteSettings",
  "hero",
  "stats",
  "trustBadges",
  "whyChooseUs",
  "process",
  "services",
  "testimonials",
  "faq",
  "about",
  "contact",
  "footer",
];

export function isValidSection(section) {
  return VALID_SECTIONS.includes(section);
}

export async function getContent() {
  const raw = await readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function updateSection(section, value) {
  const content = await getContent();
  content[section] = value;
  await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2));
  return content[section];
}
