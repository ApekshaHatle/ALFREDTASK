import Flashcard from "../models/flashcards.model.js";
import User from "../models/user.model.js";

// Add testing toggle and test date at the top of the file
const testing = true; // Set to false when done testing
const testDate = new Date('2024-02-25'); // Change this date for testing

// Helper function to get end of day
const getEndOfDay = (date) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
};

// Helper function to get start of day
const getStartOfDay = (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
};

export const createFlashcard = async (req, res) => {
    try {
        const { question, answer, img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const newFlashcard = new Flashcard({
            user: userId,
            question,
            answer,
            img,
            box: 1,
            nextReviewDate: testing ? testDate : new Date(),
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
        const currentDate = testing ? getEndOfDay(testDate) : getEndOfDay(new Date());

        const flashcards = await Flashcard.find({
            user: userId,
            nextReviewDate: { $lte: currentDate }
        }).sort({ nextReviewDate: 1 });

        res.status(200).json(flashcards);
    } catch (error) {
        console.log("Error in getDueFlashcards function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateStreakAndCompletion = async (userId, currentDate = new Date()) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const startOfDay = getStartOfDay(currentDate);
        const endOfDay = getEndOfDay(currentDate);

        // Get all flashcards due today or earlier
        const dueFlashcards = await Flashcard.find({
            user: userId,
            nextReviewDate: { $lte: endOfDay }
        });

        // Get all flashcards that were reviewed today
        const reviewedToday = await Flashcard.find({
            user: userId,
            nextReviewDate: { $gt: endOfDay }
        });

        // Check if all due flashcards were reviewed
        const allCardsReviewed = dueFlashcards.length > 0 && 
                                reviewedToday.length >= dueFlashcards.length;

        // Update completedDates if all cards were reviewed
        if (allCardsReviewed) {
            const dateToAdd = new Date(currentDate);
            dateToAdd.setUTCHours(12, 0, 0, 0);  // Set to noon UTC to avoid timezone issues
            
            const dateExists = user.completedDates.some(date => 
                new Date(date).toISOString().split('T')[0] === dateToAdd.toISOString().split('T')[0]
            );
            
            if (!dateExists) {
                user.completedDates.push(dateToAdd);
            }
        }

        // Update streak
        if (!user.streak.lastCompletionDate) {
            // First time completing all cards
            if (allCardsReviewed) {
                user.streak = {
                    count: 1,
                    lastCompletionDate: currentDate,
                    lastCheckDate: currentDate
                };
            }
        } else {
            const lastCompletion = new Date(user.streak.lastCompletionDate);
            const daysSinceLastCompletion = Math.floor(
                (currentDate - lastCompletion) / (1000 * 60 * 60 * 24)
            );

            if (allCardsReviewed) {
                if (daysSinceLastCompletion === 1) {
                    // Continuous streak
                    user.streak.count += 1;
                    user.streak.lastCompletionDate = currentDate;
                } else if (daysSinceLastCompletion === 0) {
                    // Same day, already counted
                    return;
                } else {
                    // Streak broken, start new streak
                    user.streak.count = 1;
                    user.streak.lastCompletionDate = currentDate;
                }
            } else if (daysSinceLastCompletion > 1) {
                // Reset streak if more than one day has passed without completion
                user.streak.count = 0;
                user.streak.lastCompletionDate = null;
            }
        }
        
        user.streak.lastCheckDate = currentDate;
        await user.save();
        
    } catch (error) {
        console.error("Error updating streak and completion:", error);
    }
};

export const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCorrect, img } = req.body;
        const userId = req.user._id;

        const flashcard = await Flashcard.findOne({ _id: id, user: userId });
        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        if (isCorrect) {
            flashcard.box = Math.min(flashcard.box + 1, 5);
        } else {
            flashcard.box = 1;
        }

        if (img) {
            flashcard.img = img;
        }

        const today = testing ? new Date(testDate) : new Date();
        const reviewIntervals = {
            1: 1,     // Every day
            2: 2,     // Every other day
            3: 7,     // Once a week
            4: 14,    // Every other week
            5: 30     // Once a month
        };

        today.setHours(18, 30, 0, 0);
        today.setDate(today.getDate() + reviewIntervals[flashcard.box]);
        flashcard.nextReviewDate = today;

        const updatedFlashcard = await flashcard.save();
        
        const currentDate = testing ? testDate : new Date();
        await updateStreakAndCompletion(userId, currentDate);

        const user = await User.findById(userId).select('streak completedDates');
        
        res.status(200).json({
            flashcard: updatedFlashcard,
            streak: user.streak,
            completedDates: user.completedDates
        });
        
    } catch (error) {
        console.log("Error in updateFlashcard function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getStreakInfo = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentDate = testing ? testDate : new Date();
        
        await updateStreakAndCompletion(userId, currentDate);
        
        const user = await User.findById(userId).select('streak');
        
        res.status(200).json(user.streak);
    } catch (error) {
        console.log("Error in getStreakInfo function:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getCompletionCalendar = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('completedDates');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Sort dates in ascending order
        const sortedDates = user.completedDates.sort((a, b) => a - b);
        
        res.status(200).json(sortedDates);
    } catch (error) {
        console.log("Error in getCompletionCalendar function:", error);
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
        const currentDate = testing ? getEndOfDay(testDate) : getEndOfDay(new Date());

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
                                { $lte: ["$nextReviewDate", currentDate] },
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