import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Flashcard from '../../components/common/Flashcard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import StreakPanel from '../../components/common/StreakAndCalendar';

const FlashcardsPage = () => {
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [img, setImg] = useState(null);
    const imgRef = useRef(null);
    const queryClient = useQueryClient();

    // Queries remain the same...
    const { data: streakData } = useQuery({
        queryKey: ['streak'],
        queryFn: async () => {
            const res = await fetch('/api/flashcards/streak');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data;
        }
    });

    const { data: calendarData } = useQuery({
        queryKey: ['calendar'],
        queryFn: async () => {
            const res = await fetch('/api/flashcards/calendar');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data;
        }
    });

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

    // All handlers remain the same...
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
                    answer: newAnswer,
                    img: img
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setNewQuestion('');
            setNewAnswer('');
            setImg(null);
            setShowForm(false);
            queryClient.invalidateQueries(['flashcards']);
            queryClient.invalidateQueries(['flashcardStats']);
            toast.success('Flashcard created successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/flashcards/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            queryClient.invalidateQueries(['flashcards']);
            queryClient.invalidateQueries(['flashcardStats']);
            toast.success('Flashcard deleted successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoadingCards || isLoadingStats) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const getBoxDescription = (index) => {
        const descriptions = [
            'Every day',
            'Every 2 days',
            'Weekly',
            'Bi-weekly',
            'Monthly'
        ];
        return descriptions[index];
    };

    return (
        <div className="flex relative">
            {/* Main content */}
            <div className="flex-1 w-full mx-auto p-4"> {/* Set fixed max width and center the content */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-extrabold text-orange-600">Flashcards</h1>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                        >
                            {showForm ? 'Cancel' : 'Add Flashcard'}
                        </button>
                    </div>
    
                    {showForm && (
                        <form onSubmit={handleCreateFlashcard} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-teal-700 dark:text-teal-300">Question</label>
                                <input
                                    type="text"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-purple-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-teal-700 dark:text-teal-300">Answer</label>
                                <input
                                    type="text"
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-purple-300"
                                    required
                                />
                            </div>
    
                            {img && (
                                <div className="relative w-72 mx-auto">
                                    <IoCloseSharp
                                        className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                                        onClick={() => {
                                            setImg(null);
                                            imgRef.current.value = null;
                                        }}
                                    />
                                    <img src={img} className="w-full mx-auto h-72 object-contain rounded" alt="Uploaded" />
                                </div>
                            )}
    
                            <div className="flex justify-between border-t py-2 border-t-gray-700">
                                <div className="flex gap-1 items-center">
                                    <CiImageOn
                                        className="fill-primary w-6 h-6 cursor-pointer"
                                        onClick={() => imgRef.current.click()}
                                    />
                                </div>
                                <input type="file" accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                    Create Flashcard
                                </button>
                            </div>
                        </form>
                    )}
    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                        <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-300 mb-2">Progress</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"> 
                            {stats?.boxStats?.map((count, index) => (
                                <div key={index} className="min-w-[140px] text-center p-5 bg-gray-100 dark:bg-gray-700 rounded">
                                    <div className="font-medium text-purple-600 dark:text-purple-300">Box {index + 1}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {getBoxDescription(index)}
                                    </div>
                                    <div className="text-2xl font-bold">{count}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                            {stats?.dueCards || 0} cards due for review today
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
    
                {(!flashcards || flashcards.length === 0) && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No flashcards due for review! Time for a break 🎉
                    </div>
                )}
            </div>
    
            {/* Streak panel - now positioned on the right */}
            <div className="hidden lg:block w-80 min-h-screen border-l border-gray-200 dark:border-gray-700">
                <div className="sticky top-0 p-4">
                    <StreakPanel 
                        streak={streakData || { count: 0 }}
                        completedDates={calendarData || []}
                    />
                </div>
            </div>
        </div>
    );
    
};

export default FlashcardsPage;