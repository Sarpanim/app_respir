import React from 'react';
import { useAppContext } from '../../context/AppContext';

const MentorsSection: React.FC = () => {
    const { generalSettings } = useAppContext();
    const { mentors } = generalSettings.homepageMentors;

    if (!mentors || mentors.length === 0) {
        return null;
    }

    return (
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {mentors.map(mentor => (
                <div key={mentor.id} className="flex-shrink-0 w-48 text-center group">
                    <div className="relative">
                        <img src={mentor.avatar} alt={mentor.name} className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-transparent group-hover:border-accent transition-colors duration-300"/>
                    </div>
                    <h4 className="font-bold text-lg mt-4">{mentor.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.title}</p>
                </div>
            ))}
        </div>
    );
};

export default MentorsSection;
