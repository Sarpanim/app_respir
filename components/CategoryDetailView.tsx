import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import { CATEGORIES } from '../constants';
import CourseCard from './CourseCard';
import { ChevronLeftIcon } from './Icons';

const CategoryDetailView: React.FC = () => {
    const { currentParams, navigateToDiscover } = useAppContext();
    const { courses } = useCourses();

    const categoryId = currentParams?.categoryId;
    const category = CATEGORIES.find(c => c.id === categoryId);
    const categoryCourses = courses.filter(course => course.categoryId === categoryId);

    if (!category) {
        return (
            <div className="text-center p-8">
                <p>Catégorie non trouvée.</p>
                <button onClick={navigateToDiscover} className="mt-4 btn-primary">Retour à la découverte</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header className="relative flex items-center justify-center my-8">
                <button onClick={navigateToDiscover} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">{category.name}</h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {categoryCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CategoryDetailView;