import React, { useState, useMemo } from 'react';
import AmbienceCard from './AmbienceCard';
import { useAppContext } from '../context/AppContext';
import { AmbienceCategory } from '../types';
import { SoundWaveIcon } from './Icons';
import DynamicIcon from './DynamicIcon';
import ImageTextSection from './homepage/ImageTextSection';

const AmbienceView: React.FC = () => {
  const { ambiences, ambienceCategories, generalSettings } = useAppContext();
  const { ambiencePageSettings } = generalSettings;

  const [selectedAmbienceCategory, setSelectedAmbienceCategory] = useState<number | null>(null);

  const visibleCategories = useMemo(() => {
    const settingsMap = new Map(ambiencePageSettings.categories.map(c => [c.id, c.enabled]));
    return ambienceCategories.filter(category => {
        const isEnabled = settingsMap.get(category.id);
        return isEnabled !== false;
    });
  }, [ambienceCategories, ambiencePageSettings.categories]);
  
  const newReleases = useMemo(() => {
      if (!ambiencePageSettings.showNewReleases) return [];
      return [...ambiences]
          .filter(a => a.createdAt)
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, ambiencePageSettings.newReleasesCount);
  }, [ambiences, ambiencePageSettings.showNewReleases, ambiencePageSettings.newReleasesCount]);

  const filteredAmbienceSounds = useMemo(() => {
    const baseList = selectedAmbienceCategory
      ? ambiences.filter(sound => sound.categoryId === selectedAmbienceCategory)
      : ambiences;
    
    const visibleCategoryIds = new Set(visibleCategories.map(c => c.id));
    if (selectedAmbienceCategory && !visibleCategoryIds.has(selectedAmbienceCategory)) {
        setSelectedAmbienceCategory(null);
    }
    return baseList.filter(sound => visibleCategoryIds.has(sound.categoryId));
  }, [ambiences, selectedAmbienceCategory, visibleCategories]);

  const getAmbienceCount = (categoryId: number) => {
      return ambiences.filter(a => a.categoryId === categoryId).length;
  }

  const CategoryCard: React.FC<{
    category: AmbienceCategory;
    count: number;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ category, count, isSelected, onClick }) => (
    <div onClick={onClick} className={`flex-shrink-0 w-28 text-center cursor-pointer group transition-opacity ${isSelected ? '' : 'opacity-70'} ${ambiencePageSettings.categoryHoverEffectEnabled ? 'hover:opacity-100' : ''}`}>
        <div className={`relative w-28 h-28 rounded-2xl shadow-lg transition-colors border-2 ${isSelected ? 'border-accent' : 'border-transparent group-hover:border-accent'}`}>
            <div className="w-full h-full rounded-xl overflow-hidden relative">
                {category.image && (
                    <img 
                        src={category.image.url} 
                        alt={category.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: category.image.position }} 
                    />
                )}
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-1.5 right-1.5 bg-black/50 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {count}
                </div>
            </div>
        </div>
        <div className="mt-2">
            <span className={`inline-block border text-sm font-semibold px-3 py-1 rounded-full truncate max-w-full transition-colors ${isSelected ? 'border-accent text-accent' : 'border-gray-500 text-gray-400 group-hover:border-accent group-hover:text-accent'}`}>
                {category.name}
            </span>
        </div>
    </div>
  );
  
  const AllCategoriesCard: React.FC<{isSelected: boolean; onClick: () => void; icon: string;}> = ({ isSelected, onClick, icon }) => (
      <div onClick={onClick} className={`flex-shrink-0 w-28 text-center cursor-pointer group transition-opacity ${isSelected ? '' : 'opacity-70'} ${ambiencePageSettings.categoryHoverEffectEnabled ? 'hover:opacity-100' : ''}`}>
      <div className={`relative w-28 h-28 rounded-2xl shadow-lg transition-colors border-2 ${isSelected ? 'border-accent' : 'border-transparent group-hover:border-accent'}`}>
          <div className="w-full h-full rounded-xl overflow-hidden bg-white/30 dark:bg-black/20 flex items-center justify-center">
              <DynamicIcon icon={icon} className="w-10 h-10 text-accent"/>
          </div>
      </div>
      <div className="mt-2">
          <span className={`inline-block border text-sm font-semibold px-3 py-1 rounded-full truncate max-w-full transition-colors ${isSelected ? 'border-accent text-accent' : 'border-gray-500 text-gray-400 group-hover:border-accent group-hover:text-accent'}`}>
              Toutes
          </span>
      </div>
    </div>
  );
  
  const getLayoutClasses = () => {
    const gridCols = `grid-cols-2 md:grid-cols-3 lg:grid-cols-${ambiencePageSettings.gridColumns || 4}`;
    switch(ambiencePageSettings.layout) {
        case 'list':
            return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
        case 'grid':
            return `grid ${gridCols} gap-4`;
        case 'grid-presentation-2':
            return `grid ${gridCols} gap-x-4 gap-y-8`;
        default:
            return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
    }
  }


  return (
    <div className="animate-fade-in space-y-12">
      <section>
        <h1 className="text-3xl sm:text-4xl font-elsie font-bold mb-4">Ambiances Sonores</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Plongez dans des paysages sonores immersifs pour vous détendre, vous concentrer ou vous endormir.
        </p>
      </section>
      
      {ambiencePageSettings.featuredSection.enabled && (
        <section>
            <ImageTextSection config={ambiencePageSettings.featuredSection} />
        </section>
      )}

      {ambiencePageSettings.showNewReleases && newReleases.length > 0 && (
          <section>
              <h2 className="text-xl font-elsie font-bold mb-4">Nouveautés</h2>
              <div className={getLayoutClasses()}>
                  {newReleases.map(ambience => (
                      <AmbienceCard key={ambience.id} ambience={ambience} />
                  ))}
              </div>
          </section>
      )}

      <section>
        <div className="mb-8">
            <h2 className="text-xl font-elsie font-bold mb-4">Catégories</h2>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                {ambiencePageSettings.allCategory.enabled && (
                    <AllCategoriesCard
                        isSelected={selectedAmbienceCategory === null}
                        onClick={() => setSelectedAmbienceCategory(null)}
                        icon={ambiencePageSettings.allCategory.icon}
                    />
                )}
                {visibleCategories.map(category => (
                    <CategoryCard 
                        key={category.id} 
                        category={category}
                        count={getAmbienceCount(category.id)}
                        isSelected={selectedAmbienceCategory === category.id}
                        onClick={() => setSelectedAmbienceCategory(category.id)}
                    />
                ))}
            </div>
        </div>
        
        <h2 className="text-xl font-elsie font-bold mb-4">
            {selectedAmbienceCategory ? ambienceCategories.find(c=>c.id === selectedAmbienceCategory)?.name : 'Toutes les ambiances'}
        </h2>
        <div className={getLayoutClasses()}>
            {filteredAmbienceSounds.map(ambience => (
                <AmbienceCard key={ambience.id} ambience={ambience} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default AmbienceView;