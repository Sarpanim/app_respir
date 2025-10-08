import React from 'react';
import { Category } from '../types';
import { useAppContext } from '../context/AppContext';

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const { navigateToCategoryDetail } = useAppContext();
  
  return (
    <div 
        onClick={() => navigateToCategoryDetail(category.id)}
        className="relative rounded-2xl overflow-hidden shadow-lg h-28 flex items-center justify-center p-4 bg-accent/20 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
        <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/40"></div>
        <h3 className="relative text-xl font-elsie font-bold text-white text-center" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {category.name}
        </h3>
    </div>
  );
};

export default CategoryCard;