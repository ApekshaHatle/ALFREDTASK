import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    createFlashcard,    
    getDueFlashcards,
    getAllFlashcards,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardStats,
    getStreakInfo,
    getCompletionCalendar,
} from "../controllers/flashcard.controller.js";

const router = express.Router();

router.get("/due", protectRoute, getDueFlashcards);
router.get("/all", protectRoute, getAllFlashcards);
router.get("/stats", protectRoute, getFlashcardStats);
router.post("/create", protectRoute, createFlashcard);
router.put("/:id", protectRoute, updateFlashcard);
router.delete("/:id", protectRoute, deleteFlashcard);
router.get("/streak",protectRoute,getStreakInfo);
router.get("/calendar",protectRoute,getCompletionCalendar);

export default router;