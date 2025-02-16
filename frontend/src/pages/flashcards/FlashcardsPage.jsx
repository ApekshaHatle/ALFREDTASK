import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Flashcard from '../../components/common/Flashcard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FlashcardsPage = () => {
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [showForm, setShowForm] = useState(false);
    const queryClient = useQueryClient();

    const { data: flashcards, isLoading: isLoadingCards } = useQuery({
        queryKey: ['flashcards'],
        queryFn: async () => {
            const res = await fetch('/api/flashcards/due');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data;
        }
    });

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['flashcardStats'],
        queryFn: async () => {
            const res = await fetch('/api/flashcards/stats');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data;
        }
    });

    const handleCreateFlashcard = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/flashcards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: newQuestion,
                    answer: newAnswer
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setNewQuestion('');
            setNewAnswer('');
            setShowForm(false);
            queryClient.invalidateQueries(['flashcards']);
            queryClient.invalidateQueries(['flashcardStats']);
            toast.success('Flashcard created successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = (id) => {
        queryClient.invalidateQueries(['flashcards']);
        queryClient.invalidateQueries(['flashcardStats']);
    };

    if (isLoadingCards || isLoadingStats) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Flashcards</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        {showForm ? 'Cancel' : 'Add Flashcard'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreateFlashcard} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Question</label>
                            <input
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Answer</label>
                            <input
                                type="text"
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Create Flashcard
                        </button>
                    </form>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-2">Progress</h2>
                    <div className="grid grid-cols-5 gap-2">
                        {stats?.boxStats?.map((count, index) => (
                            <div key={index} className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <div className="font-medium">Box {index + 1}</div>
                                <div className="text-lg">{count}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        {flashcards?.length} cards due for review today
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcards?.map((flashcard) => (
                    <Flashcard
                        key={flashcard._id}
                        flashcard={flashcard}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {flashcards?.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No flashcards due for review! Time for a break 🎉
                </div>
            )}
        </div>
    );
};

export default FlashcardsPage;