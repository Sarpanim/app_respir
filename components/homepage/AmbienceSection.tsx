import React from 'react';
import { useAppContext } from '../../context/AppContext';
import AmbienceCard from '../AmbienceCard';

const AmbienceSection: React.FC = () => {
    const { ambiences } = useAppContext();

    // Show a selection of ambiences, e.g., the first 6
    const displayedAmbiences = ambiences.slice(0, 6);

    return (
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {displayedAmbiences.map(ambience => (
                <div key={ambience.id} className="w-72 sm:w-80 flex-shrink-0">
                    <AmbienceCard ambience={ambience} />
                </div>
            ))}
        </div>
    );
};

export default AmbienceSection;
