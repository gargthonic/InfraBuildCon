import { Router } from "express";
import { randomUUID } from "crypto";
import { requireAuth } from "../middleware/auth.js";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../utils/store.js";

const router = Router();

function validateProjectPayload(body) {
  if (!body || typeof body !== "object") return "Request body is required";
  if (!body.title || !String(body.title).trim()) return "Title is required";
  if (!body.description || !String(body.description).trim())
    return "Description is required";
  if (!body.image || !String(body.image).trim())
    return "Image URL is required";
  if (body.tags && !Array.isArray(body.tags))
    return "Tags must be an array of strings";
  return null;
}

router.get("/", async (req, res) => {
  const projects = await getProjects();
  res.json(projects);
});

router.get("/:id", async (req, res) => {
  const project = await getProject(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

router.post("/", requireAuth, async (req, res) => {
  const error = validateProjectPayload(req.body);
  if (error) return res.status(400).json({ error });

  const project = {
    id: randomUUID(),
    title: req.body.title,
    location: req.body.location || "",
    price: req.body.price || "",
    type: req.body.type || "",
    beds: req.body.beds ?? null,
    baths: req.body.baths ?? null,
    sqft: req.body.sqft ?? null,
    description: req.body.description,
    details: req.body.details || "",
    image: req.body.image,
    tags: req.body.tags || [],
  };

  const created = await createProject(project);
  res.status(201).json(created);
});

router.put("/:id", requireAuth, async (req, res) => {
  const error = validateProjectPayload(req.body);
  if (error) return res.status(400).json({ error });

  const updated = await updateProject(req.params.id, {
    title: req.body.title,
    location: req.body.location || "",
    price: req.body.price || "",
    type: req.body.type || "",
    beds: req.body.beds ?? null,
    baths: req.body.baths ?? null,
    sqft: req.body.sqft ?? null,
    description: req.body.description,
    details: req.body.details || "",
    image: req.body.image,
    tags: req.body.tags || [],
  });

  if (!updated) return res.status(404).json({ error: "Project not found" });
  res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const deleted = await deleteProject(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Project not found" });
  res.status(204).send();
});

export default router;
