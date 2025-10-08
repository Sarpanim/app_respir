import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { CATEGORIES } from '../constants';
import CourseCard from './CourseCard';
import { useCourses } from '../context/CourseContext';

const CourseGrid: React.FC = () => {
  const { courses } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const publishedCourses = useMemo(() => courses.filter(c => c.status === 'Publié'), [courses]);

  const filteredCourses = selectedCategory
    ? publishedCourses.filter(course => course.categoryId === selectedCategory)
    : publishedCourses;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 flex-shrink-0 ${
              selectedCategory === null
                ? 'bg-accent text-white'
                : 'bg-transparent border border-accent text-accent hover:bg-accent/10'
            }`}
          >
            Tous
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 flex-shrink-0 ${
                selectedCategory === category.id
                  ? 'bg-accent text-white'
                  : 'bg-transparent border border-accent text-accent hover:bg-accent/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
