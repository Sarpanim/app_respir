import React from 'react';
import { Course } from '../types';
import { useAppContext } from '../context/AppContext';
import { StarIcon, UserGroupIcon, ClockIcon, BookmarkIcon, ListBulletIcon } from './Icons';
import { CATEGORIES } from '../constants';

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const { navigateTo, isFavoriteCourse, toggleFavoriteCourse } = useAppContext();
    const isFavorite = isFavoriteCourse(course.id);
    const category = CATEGORIES.find(c => c.id === course.categoryId);

    return (
        <div className="bg-white/10 dark:bg-black/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-lg border border-white/20 dark:border-black/30 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
            <div className="relative">
                <img 
                    src={course.image.url} 
                    alt={course.image.alt} 
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigateTo('player', { courseId: course.id })}
                />
                <button 
                    onClick={() => toggleFavoriteCourse(course.id)}
                    className="absolute top-3 right-3 bg-black/40 p-2 rounded-full text-white hover:text-accent transition-colors"
                >
                    <BookmarkIcon className={`w-5 h-5 ${isFavorite ? 'fill-current text-accent' : ''}`} />
                </button>
                {category && (
                    <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">{category.name}</span>
                )}
            </div>
            <div className="p-4">
                <h3 
                    className="font-elsie font-bold text-lg text-gray-800 dark:text-white cursor-pointer"
                    onClick={() => navigateTo('player', { courseId: course.id })}
                >
                    {course.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Par {course.mentor.name}</p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-3 space-x-4">
                    <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4" />
                        <span>{course.totalDuration} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ListBulletIcon className="w-4 h-4" />
                        <span>{course.lessonCount} leçons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span>{course.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;