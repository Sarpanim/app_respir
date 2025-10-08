import React, { useMemo } from 'react';
import { Course } from '../types';
import { useAppContext } from '../context/AppContext';
import { StarIcon, UserGroupIcon, ClockIcon, BookmarkIcon, BookmarkSolidIcon, ListBulletIcon } from './Icons';
import { CATEGORIES } from '../constants';
import DynamicIcon from './DynamicIcon';

interface CourseCardProps {
  course: Course;
}

const LevelIndicator: React.FC<{ level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert' }> = ({ level }) => {
    const levelMap = {
      'Débutant': 1,
      'Intermédiaire': 2,
      'Avancé': 3,
      'Expert': 4,
    };
    const filledCount = levelMap[level];
    return (
      <div className="flex items-center space-x-1" title={level}>
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className={`w-2 h-2 rounded-full ${i < filledCount ? 'bg-gray-400' : 'bg-gray-600'}`}
          ></span>
        ))}
      </div>
    );
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { navigateToPlayer, favorites, toggleFavorite, generalSettings, subscriptionPlans, userProgress, navigateToCategoryDetail } = useAppContext();
  const totalDurationMinutes = Math.round(course.sections.reduce((total, section) => total + section.lessons.reduce((secTotal, lesson) => secTotal + lesson.duration, 0), 0) / 60);
  const totalLessons = useMemo(() => course.sections.reduce((total, section) => total + section.lessons.length, 0), [course.sections]);
  const isFavorite = favorites.includes(course.id);
  const category = CATEGORIES.find(c => c.id === course.categoryId);
  const plan = subscriptionPlans.find(p => p.id === course.requiredPlan);

  const progressData = userProgress[course.id];
  const completedLessonsCount = progressData ? progressData.completedLessons.size : 0;
  const progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(course.id);
  };

  return (
    <div 
      className={`bg-white/30 dark:bg-dark-card backdrop-filter backdrop-blur-xl border border-white/20 dark:border-transparent rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col ${generalSettings.cardShadowEnabled ? 'shadow-lg hover:shadow-xl' : ''}`}
      onClick={() => navigateToPlayer(course.id)}
    >
      <div className="relative">
        <img 
          className="w-full h-48 object-cover" 
          src={course.image.url} 
          alt={course.title} 
          style={{ objectPosition: course.image.position }}
        />
        {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20" title={`Complété à ${progress}%`}>
                <div 
                    className="h-1.5 bg-accent rounded-r-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
                {category && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateToCategoryDetail(category.id);
                        }}
                        className="inline-block bg-accent/20 text-accent border border-accent rounded-full px-3 py-1 text-sm font-semibold transition-colors hover:bg-accent/30"
                    >
                        {category.name}
                    </button>
                )}
            </div>
            <div className="flex items-center gap-1 text-card-text-light dark:text-card-text-dark">
                <ClockIcon className="w-4 h-4" />
                <span className="text-xs">{totalDurationMinutes} min</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <ListBulletIcon className="w-4 h-4" />
                <span className="text-xs">{totalLessons} leçons</span>
            </div>
        </div>
        <h3 className="text-xl font-elsie font-bold mb-2 flex-grow flex items-start gap-2 text-card-title-light dark:text-card-title-dark">
            <span>{course.title}</span>
            {course.requiredPlan !== 'free' && plan?.icon && <DynamicIcon icon={plan.icon} className="w-5 h-5 text-accent" />}
        </h3>
        <p className="text-card-text-light dark:text-card-text-dark text-sm mb-4 line-clamp-2">
            {course.description}
        </p>
        <div className="flex justify-between items-center mt-auto border-t border-black/10 dark:border-white/10 pt-3">
          {/* Left Zone */}
          <div className="flex items-center space-x-4 text-xs text-card-text-light dark:text-card-text-dark">
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 " />
              <span className="font-medium">{course.rating}</span>
            </div>
            {/* Students */}
            {generalSettings.showStudentCountOnCourses && (
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="w-4 h-4 " />
                <span>{course.studentCount}</span>
              </div>
            )}
          </div>
          {/* Right Zone */}
          <div className="flex items-center space-x-3">
            <LevelIndicator level={course.level} />
            <button onClick={handleFavoriteClick} aria-label="Ajouter aux favoris">
              {isFavorite ? (
                <BookmarkSolidIcon className="w-5 h-5 text-accent" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;