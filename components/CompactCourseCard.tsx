import React from 'react';
import { Course } from '../types';
import { useAppContext } from '../context/AppContext';
import { ClockIcon, StarIcon } from './Icons';

interface CompactCourseCardProps {
    course: Course;
}

const CompactCourseCard: React.FC<CompactCourseCardProps> = ({ course }) => {
    const { navigateTo } = useAppContext();

    return (
        <div 
            onClick={() => navigateTo('player', { courseId: course.id })}
            className="flex items-center gap-4 p-3 bg-white/50 dark:bg-black/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-white/20 dark:border-black/30"
        >
            <img src={course.image.url} alt={course.image.alt} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-grow">
                <h4 className="font-bold text-gray-800 dark:text-white">{course.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course.mentor.name}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{course.totalDuration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        <span>{course.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompactCourseCard;