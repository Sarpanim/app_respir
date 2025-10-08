import React, { useMemo } from 'react';
import { Course } from '../types';
import { useAppContext } from '../context/AppContext';
import ProgressCircle from './ProgressCircle';

const CourseProgressCard: React.FC<{ course: Course }> = ({ course }) => {
  const { navigateToPlayer, userProgress } = useAppContext();
  
  const totalLessons = useMemo(() => course.sections.reduce((total, section) => total + section.lessons.length, 0), [course.sections]);
  const progressData = userProgress[course.id];
  const completedLessonsCount = progressData ? progressData.completedLessons.size : 0;
  const progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div 
        className="bg-white/30 dark:bg-dark-card backdrop-filter backdrop-blur-xl border border-white/20 dark:border-transparent rounded-2xl p-4 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={() => navigateToPlayer(course.id)}
    >
        <div className="flex-shrink-0">
            <ProgressCircle progress={progress} />
        </div>
        <div className="flex-grow overflow-hidden">
            <h3 className="text-lg font-bold font-elsie truncate">{course.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {progress > 0 ? `${completedLessonsCount} / ${totalLessons} leçons` : "Commencer le cours"}
            </p>
        </div>
        <div className="flex-shrink-0">
             <img src={course.image.url} alt={course.title} className="w-20 h-20 rounded-lg object-cover" />
        </div>
    </div>
  );
};

export default CourseProgressCard;