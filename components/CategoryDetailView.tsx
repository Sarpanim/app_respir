import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import { CATEGORIES } from '../constants';
import CompactCourseCard from './CompactCourseCard';
import { ChevronLeftIcon } from './Icons';

const CategoryDetailView: React.FC = () => {
    const { currentCategoryId, navigateToDiscover } = useAppContext();
    const { courses } = useCourses();

    if (currentCategoryId === null) {
        return (
            <div className="text-center p-8">
                <p>Aucune catégorie sélectionnée.</p>
                <button onClick={navigateToDiscover} className="mt-4 text-accent">Retour à la découverte</button>
            </div>
        );
    }
    
    const category = CATEGORIES.find(c => c.id === currentCategoryId);
    const coursesInCategory = courses.filter(c => c.categoryId === currentCategoryId && c.status === 'Publié');

    if (!category) {
        return <p>Catégorie non trouvée.</p>;
    }
    
    const handleBack = () => {
      navigateToDiscover();
    }

    return (
        <div className="animate-fade-in -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="relative h-48">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-light-bg via-light-bg/50 to-transparent dark:from-dark-bg dark:via-dark-bg/50"></div>
                <button onClick={handleBack} className="absolute top-10 left-4 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm z-10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-0 w-full px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-elsie font-bold">{category.name}</h1>
                </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4">
                    {coursesInCategory.length > 0 ? (
                        coursesInCategory.map(course => <CompactCourseCard key={course.id} course={course} />)
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 p-8">Aucun cours dans cette catégorie pour le moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryDetailView;