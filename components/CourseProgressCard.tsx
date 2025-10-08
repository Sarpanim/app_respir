import React from 'react';
import { Course } from '../types';
import { useAppContext } from '../context/AppContext';
import ProgressCircle from './ProgressCircle';

const CourseProgressCard: React.FC<{ course: Course }> = ({ course }) => {
  const { navigateToPlayer, userProgress } = useAppContext();
  
  const progressData = userProgress[course.id];
  const completedCount = progressData?.completedLessons.size || 0;
  const totalLessons = course.lessonCount;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div 
      onClick={() => navigateToPlayer(course.id)}
      className="flex items-center gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-white/20 dark:border-black/30"
    >
      <img src={course.image.url} alt={course.image.alt} className="w-24 h-24 rounded-lg object-cover" />
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800 dark:text-white">{course.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{completedCount} / {totalLessons} leçons terminées</p>
      </div>
      <ProgressCircle progress={progressPercentage} />
    </div>
  );
};

export default CourseProgressCard;