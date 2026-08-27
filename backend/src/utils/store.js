import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

async function readDb() {
  const raw = await readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(db) {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function getProjects() {
  const db = await readDb();
  return db.projects;
}

export async function getProject(id) {
  const db = await readDb();
  return db.projects.find((p) => p.id === id) || null;
}

export async function createProject(project) {
  const db = await readDb();
  db.projects.push(project);
  await writeDb(db);
  return project;
}

export async function updateProject(id, updates) {
  const db = await readDb();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.projects[index] = { ...db.projects[index], ...updates, id };
  await writeDb(db);
  return db.projects[index];
}

export async function deleteProject(id) {
  const db = await readDb();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.projects.splice(index, 1);
  await writeDb(db);
  return true;
}
