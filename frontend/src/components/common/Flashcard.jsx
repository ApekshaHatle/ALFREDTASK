import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Flashcard = ({ flashcard, onDelete }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleAnswer = async (isCorrect) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/flashcards/${flashcard._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isCorrect })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Invalidate and refetch
            queryClient.invalidateQueries(['flashcards']);
            queryClient.invalidateQueries(['flashcardStats']);
            
            toast.success(isCorrect ? 'Great job! Moving to next box!' : 'Keep practicing! Back to box 1');
            setIsFlipped(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this flashcard?')) return;
        
        try {
            const res = await fetch(`/api/flashcards/${flashcard._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            onDelete(flashcard._id);
            toast.success('Flashcard deleted successfully');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-100 rounded-lg shadow-lg p-6 m-4 max-w-md w-full">
            <div className="relative">
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-600 transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-700">
                    Box {flashcard.box} • Next review: {new Date(flashcard.nextReviewDate).toLocaleDateString()}
                </div>

                <div className="min-h-[150px] flex items-center justify-center">
                    <p className="text-lg text-center text-gray-700 dark:text-gray-800">
                        {isFlipped ? flashcard.answer : flashcard.question}
                    </p>
                </div>

                <div className="mt-4 space-y-2">
                    {!isFlipped ? (
                        <button
                            onClick={() => setIsFlipped(true)}
                            className="w-full bg-gradient-to-r from-[#2D3748] to-[#4A5568] text-white py-2 px-4 rounded hover:bg-gradient-to-r hover:from-[#2B6CB0] hover:to-[#3182CE] transition duration-200"
                        >
                            Show Answer
                        </button>
                    
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAnswer(false)}
                                disabled={isLoading}
                                className="flex-1 bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 transition duration-200 disabled:opacity-50"
                            >
                                Got it Wrong
                            </button>
                            <button
                                onClick={() => handleAnswer(true)}
                                disabled={isLoading}
                                className="flex-1 bg-purple-400 text-white py-2 px-4 rounded hover:bg-purple-500 transition duration-200 disabled:opacity-50"
                            >
                                Got it Right
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
