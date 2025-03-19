import express from "express";
import { analyzeSentiment } from "../controllers/nlpController.js";

const router = express.Router();

router.post("/analyze", analyzeSentiment);

export default router;
