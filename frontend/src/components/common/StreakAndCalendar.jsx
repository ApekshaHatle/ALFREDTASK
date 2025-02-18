import React, { useState, useEffect } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { IoFlameSharp } from "react-icons/io5";

const StreakPanel = ({ 
  streak = { count: 0, lastCompletionDate: null, lastCheckDate: null },
  completedDates = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Helper to get all days in a month
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // Helper to get day of week for first day of month (0-6)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date to YYYY-MM-DD for comparison
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    
    // Add empty slots for days before the first of the month
    const calendarArray = Array(firstDay).fill(null);
    
    // Add the actual days
    calendarArray.push(...daysInMonth);
    
    setCalendarDays(calendarArray);
  }, [currentMonth]);

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const isDateCompleted = (date) => {
    if (!date || !Array.isArray(completedDates)) return false;
    const dateStr = formatDate(date);
    return completedDates.some(completedDate => {
      try {
        return formatDate(new Date(completedDate)) === dateStr;
      } catch (error) {
        console.error('Invalid date in completedDates:', completedDate);
        return false;
      }
    });
  };

  const today = new Date();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Streak Display */}
      <div className="flex items-center justify-center mb-6 space-x-3">
        <IoFlameSharp className="w-8 h-8 text-orange-500" />
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {streak?.count || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">day streak</div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth} 
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          type="button"
        >
          <IoChevronBackOutline className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="font-semibold text-gray-800 dark:text-white">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button 
          onClick={nextMonth} 
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          type="button"
        >
          <IoChevronForwardOutline className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isToday = date && 
            date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear();

          const completed = isDateCompleted(date);

          return (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm
                ${date ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''} 
                ${completed ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 font-medium rounded-full' : ''} 
                ${isToday ? 'border border-blue-500 rounded-full' : ''} 
                ${date ? 'text-gray-800 dark:text-gray-200' : ''}
              `}
            >
              {date ? date.getDate() : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreakPanel;
