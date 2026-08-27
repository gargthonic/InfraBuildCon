import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEADS_PATH = path.join(__dirname, "..", "data", "leads.json");

async function readDb() {
  const raw = await readFile(LEADS_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(db) {
  await writeFile(LEADS_PATH, JSON.stringify(db, null, 2));
}

export async function getLeads() {
  const db = await readDb();
  return [...db.leads].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export async function createLead(lead) {
  const db = await readDb();
  db.leads.push(lead);
  await writeDb(db);
  return lead;
}

export async function updateLead(id, updates) {
  const db = await readDb();
  const index = db.leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  db.leads[index] = { ...db.leads[index], ...updates, id };
  await writeDb(db);
  return db.leads[index];
}

export async function deleteLead(id) {
  const db = await readDb();
  const index = db.leads.findIndex((l) => l.id === id);
  if (index === -1) return false;
  db.leads.splice(index, 1);
  await writeDb(db);
  return true;
}
