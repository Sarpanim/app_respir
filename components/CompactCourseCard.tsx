import React from 'react';
import { Course } from '../types';
import { useAppContext } from '../context/AppContext';
import { ClockIcon, StarIcon } from './Icons';

const CompactCourseCard: React.FC<{ course: Course }> = ({ course }) => {
    const { navigateToPlayer } = useAppContext();
    const totalDurationMinutes = Math.round(course.sections.reduce((total, section) => total + section.lessons.reduce((secTotal, lesson) => secTotal + lesson.duration, 0), 0) / 60);

    return (
        <div
            onClick={() => navigateToPlayer(course.id)}
            className="bg-white/30 dark:bg-dark-card backdrop-filter backdrop-blur-xl border border-white/20 dark:border-transparent rounded-2xl p-3 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
            <img src={course.image.url} alt={course.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
                <h3 className="text-md font-bold font-elsie truncate">{course.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{course.level}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{totalDurationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-gray-400" />
                        <span>{course.rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompactCourseCard;