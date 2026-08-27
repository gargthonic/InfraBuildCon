import { Router } from "express";
import { randomUUID } from "crypto";
import { requireAuth } from "../middleware/auth.js";
import { getLeads, createLead, updateLead, deleteLead } from "../utils/leadsStore.js";

const router = Router();

function validateLeadPayload(body) {
  if (!body || typeof body !== "object") return "Request body is required";
  if (!body.name || !String(body.name).trim()) return "Name is required";
  if (!body.message || !String(body.message).trim())
    return "Message is required";
  const hasEmail = body.email && String(body.email).trim();
  const hasPhone = body.phone && String(body.phone).trim();
  if (!hasEmail && !hasPhone)
    return "An email or phone number is required so we can reach you";
  if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return "Enter a valid email address";
  return null;
}

router.post("/", async (req, res) => {
  const error = validateLeadPayload(req.body);
  if (error) return res.status(400).json({ error });

  const lead = {
    id: randomUUID(),
    name: req.body.name.trim(),
    email: (req.body.email || "").trim(),
    phone: (req.body.phone || "").trim(),
    message: req.body.message.trim(),
    source: (req.body.source || "Contact Page").trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  const created = await createLead(lead);
  res.status(201).json(created);
});

router.get("/", requireAuth, async (req, res) => {
  const leads = await getLeads();
  res.json(leads);
});

router.patch("/:id", requireAuth, async (req, res) => {
  const { status } = req.body || {};
  if (!["new", "contacted"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'new' or 'contacted'" });
  }
  const updated = await updateLead(req.params.id, { status });
  if (!updated) return res.status(404).json({ error: "Lead not found" });
  res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const deleted = await deleteLead(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Lead not found" });
  res.status(204).send();
});

export default router;
