import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    createFlashcard,    
    getDueFlashcards,
    getAllFlashcards,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardStats
} from "../controllers/flashcard.controller.js";

const router = express.Router();

router.get("/due", protectRoute, getDueFlashcards);
router.get("/all", protectRoute, getAllFlashcards);
router.get("/stats", protectRoute, getFlashcardStats);
router.post("/create", protectRoute, createFlashcard);
router.put("/:id", protectRoute, updateFlashcard);
router.delete("/:id", protectRoute, deleteFlashcard);

export default router;