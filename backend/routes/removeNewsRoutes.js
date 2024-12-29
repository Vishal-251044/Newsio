import express from "express";
import { removeNews } from "../controllers/profileUpdateController.js";

const router = express.Router();

router.delete("/delete/:id", removeNews);

export default router;
