import React from 'react';
import { CATEGORIES } from '../../constants';
import CategoryCard from '../CategoryCard';

const CategorySection: React.FC = () => {
    return (
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {CATEGORIES.map(category => (
                <div key={category.id} className="w-40 sm:w-48 flex-shrink-0">
                    <CategoryCard category={category} />
                </div>
            ))}
        </div>
    );
};

export default CategorySection;
