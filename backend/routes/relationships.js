import express from "express";
import { getRelationships, addRelationship, delRelationship } from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.post("/", addRelationship);
router.delete("/", delRelationship);

export default router;