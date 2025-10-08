import React from 'react';
import { useAppContext } from '../context/AppContext';
import CourseProgressCard from './CourseProgressCard';
import { useCourses } from '../context/CourseContext';

const MyCourses: React.FC = () => {
  const { userProgress } = useAppContext();
  const { courses } = useCourses();

  const inProgressCourses = courses.filter(course => {
    const progressData = userProgress[course.id];
    if (!progressData || progressData.completedLessons.size === 0) return false;
    const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
    return totalLessons > 0 && progressData.completedLessons.size < totalLessons;
  });

  const notStartedCourses = courses.filter(course => {
      const progressData = userProgress[course.id];
      return !progressData || progressData.completedLessons.size === 0;
  });

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-elsie font-bold mb-8">Mes Cours</h1>
      
      {inProgressCourses.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-elsie font-bold mb-6">En cours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressCourses.map(course => (
              <CourseProgressCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {notStartedCourses.length > 0 && (
        <section>
            <h2 className="text-2xl font-elsie font-bold mb-6">À découvrir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notStartedCourses.map(course => (
                <CourseProgressCard key={course.id} course={course} />
            ))}
            </div>
        </section>
      )}

      {inProgressCourses.length === 0 && notStartedCourses.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-black/10 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-2">Félicitations !</h2>
              <p>Vous avez terminé tous les cours disponibles.</p>
          </div>
      )}
    </div>
  );
};

export default MyCourses;