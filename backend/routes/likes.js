import express from "express";
import {getLikes,addLike,delLike} from "../controllers/like.js";

const router = express.Router();

router.get("/",getLikes);
router.post("/",addLike);
router.delete("/",delLike);

export default router;