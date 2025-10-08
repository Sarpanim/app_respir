import React, { useMemo } from 'react';
import { useCourses } from '../../context/CourseContext';
import CourseCard from '../CourseCard';

const NewReleasesSection: React.FC = () => {
    const { courses } = useCourses();

    const newCourses = useMemo(() => {
        return courses
            .filter(c => c.status === 'Publié' && c.createdAt)
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 3);
    }, [courses]);

    if (newCourses.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400">Aucune nouveauté pour le moment.</p>;
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newCourses.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
};

export default NewReleasesSection;
