import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getContent, updateSection, isValidSection } from "../utils/contentStore.js";

const router = Router();

router.get("/", async (req, res) => {
  const content = await getContent();
  res.json(content);
});

router.put("/:section", requireAuth, async (req, res) => {
  const { section } = req.params;

  if (!isValidSection(section)) {
    return res.status(404).json({ error: `Unknown content section: ${section}` });
  }
  if (req.body === undefined || req.body === null) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const updated = await updateSection(section, req.body);
  res.json(updated);
});

export default router;
