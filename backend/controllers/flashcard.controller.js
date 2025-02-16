import Flashcard from "../models/flashcards.model.js";
import User from "../models/user.model.js";

export const createFlashcard = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const userId = req.user._id.toString();

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create and save the flashcard
        const newFlashcard = new Flashcard({
            user: userId, // Use `user` to match the schema
            question,
            answer,
            box: 1,
            nextReviewDate: new Date(),
        });

        const savedFlashcard = await newFlashcard.save();
        res.status(201).json(savedFlashcard);
    } catch (error) {
        console.log("Error in createFlashcard function:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getDueFlashcards = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentDate = new Date();

        const flashcards = await Flashcard.find({
            user: userId,
            nextReviewDate: { $lte: currentDate }
        });

        res.status(200).json(flashcards);
    } catch (error) {
        console.log("Error in getDueFlashcards function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllFlashcards = async (req, res) => {
    try {
        const userId = req.user._id;
        const flashcards = await Flashcard.find({ userId });
        res.status(200).json(flashcards);
    } catch (error) {
        console.log("Error in getAllFlashcards function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// In flashcard.controller.js
export const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCorrect } = req.body;
        const userId = req.user._id; // Add console.log here
        console.log("Update flashcard request:", {
            cardId: id,
            userId: userId,
            isCorrect: isCorrect
        });

        const flashcard = await Flashcard.findOne({ _id: id, userId });
        if (!flashcard) {
            console.log("Flashcard not found for:", { id, userId });
            return res.status(404).json({ error: "Flashcard not found" });
        }

        // Add logging for Leitner System
        console.log("Before update:", {
            currentBox: flashcard.box,
            nextReviewDate: flashcard.nextReviewDate
        });

        // Leitner System Logic
        if (isCorrect) {
            flashcard.box = Math.min(flashcard.box + 1, 5);
        } else {
            flashcard.box = 1;
        }

        // Calculate next review date
        const today = new Date();
        const reviewIntervals = {
            1: 0,    // Today
            2: 2,    // 2 days
            3: 5,    // 5 days
            4: 9,    // 9 days
            5: 14    // 14 days
        };

        today.setDate(today.getDate() + reviewIntervals[flashcard.box]);
        flashcard.nextReviewDate = today;

        console.log("After update:", {
            newBox: flashcard.box,
            newReviewDate: flashcard.nextReviewDate
        });

        const updatedFlashcard = await flashcard.save();
        res.status(200).json(updatedFlashcard);
    } catch (error) {
        console.log("Error in updateFlashcard function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        console.log("Delete flashcard request:", {
            cardId: id,
            userId: userId
        });

        const deletedFlashcard = await Flashcard.findOneAndDelete({ _id: id, userId });

        if (!deletedFlashcard) {
            console.log("Flashcard not found for deletion:", { id, userId });
            return res.status(404).json({ error: "Flashcard not found" });
        }

        console.log("Successfully deleted flashcard:", deletedFlashcard);
        res.status(200).json({ message: "Flashcard deleted successfully" });
    } catch (error) {
        console.log("Error in deleteFlashcard function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getFlashcardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await Flashcard.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalCards: { $sum: 1 },
                    cardsPerBox: {
                        $push: { box: "$box" }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCards: 1,
                    boxStats: {
                        $map: {
                            input: [1, 2, 3, 4, 5],
                            as: "box",
                            in: {
                                $size: {
                                    $filter: {
                                        input: "$cardsPerBox",
                                        as: "card",
                                        cond: { $eq: ["$$card.box", "$$box"] }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json(stats[0] || { totalCards: 0, boxStats: [0, 0, 0, 0, 0] });
    } catch (error) {
        console.log("Error in getFlashcardStats function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};