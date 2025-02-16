
import Flashcard from "../models/flashcards.model.js";
import User from "../models/user.model.js";

export const createFlashcard = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const newFlashcard = new Flashcard({
            user: userId,
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

        // Get all flashcards that are due for review
        const flashcards = await Flashcard.find({
            user: userId,
            nextReviewDate: { $lte: currentDate }
        }).sort({ nextReviewDate: 1 }); // Sort by earliest due date first

        res.status(200).json(flashcards);
    } catch (error) {
        console.log("Error in getDueFlashcards function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCorrect } = req.body;
        const userId = req.user._id;

        const flashcard = await Flashcard.findOne({ _id: id, user: userId });
        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        // Leitner System Logic
        if (isCorrect) {
            flashcard.box = Math.min(flashcard.box + 1, 5);
        } else {
            flashcard.box = 1;
        }

        // Calculate next review date based on box number
        const today = new Date();
        const reviewIntervals = {
            1: 1,     // Every day
            2: 2,     // Every other day
            3: 7,     // Once a week
            4: 14,    // Every other week
            5: 30     // Once a month
        };

        // Set hours to beginning of day to ensure consistent timing
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() + reviewIntervals[flashcard.box]);
        flashcard.nextReviewDate = today;

        const updatedFlashcard = await flashcard.save();
        res.status(200).json(updatedFlashcard);
    } catch (error) {
        console.log("Error in updateFlashcard function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllFlashcards = async (req, res) => {
    try {
        const userId = req.user._id;
        const flashcards = await Flashcard.find({ user: userId });
        res.status(200).json(flashcards);
    } catch (error) {
        console.log("Error in getAllFlashcards function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const deletedFlashcard = await Flashcard.findOneAndDelete({ _id: id, user: userId });
        if (!deletedFlashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

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
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalCards: { $sum: 1 },
                    cardsPerBox: {
                        $push: { box: "$box" }
                    },
                    dueCards: {
                        $sum: {
                            $cond: [
                                { $lte: ["$nextReviewDate", new Date()] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCards: 1,
                    dueCards: 1,
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

        res.status(200).json(stats[0] || { totalCards: 0, dueCards: 0, boxStats: [0, 0, 0, 0, 0] });
    } catch (error) {
        console.log("Error in getFlashcardStats function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};