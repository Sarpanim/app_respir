import React from 'react';
import { Ambience } from '../types';
import { PlayCircleIcon, ClockIcon, BookmarkIcon, BookmarkSolidIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const AmbienceCard: React.FC<{ ambience: Ambience }> = ({ ambience }) => {
  const { favoriteAmbienceIds, toggleFavoriteAmbience, navigateToAmbiencePlayer, ambienceCategories, generalSettings } = useAppContext();
  const { ambiencePageSettings } = generalSettings;
  const { layout, gridCardRatio, cardHoverEffectEnabled } = ambiencePageSettings;

  const isFavorite = favoriteAmbienceIds.includes(ambience.id);
  const category = ambienceCategories.find(c => c.id === ambience.categoryId);
  const durationMin = Math.floor(ambience.duration / 60);

  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavoriteAmbience(ambience.id);
  };

  const getRatioClasses = () => {
    if (layout === 'list') return 'h-36';
    switch (gridCardRatio) {
      case '1:1': return 'aspect-square';
      case '4:3': return 'aspect-[4/3]';
      case '16:9': return 'aspect-video';
      case '2:1': return 'aspect-[2/1]';
      default: return 'aspect-video';
    }
  };

  const hoverImageClasses = cardHoverEffectEnabled ? 'group-hover:scale-105' : '';
  const hoverOverlayClasses = cardHoverEffectEnabled ? 'group-hover:opacity-100' : '';

  if (layout === 'grid-presentation-2') {
    return (
      <div 
        onClick={() => navigateToAmbiencePlayer(ambience.id)}
        className={`bg-transparent rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 ${cardHoverEffectEnabled ? 'transform hover:-translate-y-1' : ''}`}
      >
        <div className={`relative overflow-hidden rounded-2xl shadow-lg ${getRatioClasses()}`}>
          <img 
            src={ambience.image.url} 
            alt={ambience.title} 
            className={`w-full h-full object-cover transition-transform duration-300 ${hoverImageClasses}`}
            style={{ objectPosition: ambience.image.position }}
          />
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 ${hoverOverlayClasses}`}>
             <PlayCircleIcon className="w-12 h-12 text-white/80" />
          </div>
           <div className="absolute top-2 right-2 z-20">
                <button onClick={handleFavoriteClick} className="p-1.5 bg-black/30 rounded-full backdrop-blur-sm">
                    {isFavorite 
                        ? <BookmarkSolidIcon className="w-5 h-5 text-accent" /> 
                        : <BookmarkIcon className="w-5 h-5 text-white" />
                    }
                </button>
            </div>
        </div>
        <div className="pt-3 px-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {category?.name} - {durationMin} min
          </p>
          <h3 className="font-bold text-white text-base mt-1 truncate">
            {ambience.title}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => navigateToAmbiencePlayer(ambience.id)} className={`relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 transform ${cardHoverEffectEnabled ? 'hover:-translate-y-1' : ''} ${getRatioClasses()}`}>
        <img src={ambience.image.url} alt={ambience.title} className={`w-full h-full object-cover transition-transform duration-300 ${hoverImageClasses}`} style={{ objectPosition: ambience.image.position }}/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute top-2 right-2 z-20">
            <button onClick={handleFavoriteClick} className="p-1.5 bg-black/30 rounded-full backdrop-blur-sm">
                {isFavorite 
                    ? <BookmarkSolidIcon className="w-5 h-5 text-accent" /> 
                    : <BookmarkIcon className="w-5 h-5 text-white" />
                }
            </button>
        </div>
        <div className={`absolute bottom-0 left-0 w-full ${layout === 'grid' ? 'p-3' : 'p-4'}`}>
            <div className="flex justify-between items-end">
                <div>
                    {category && <span className={`text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-md mb-1 inline-block ${layout === 'grid' ? 'text-[10px] px-1.5' : ''}`}>{category.name}</span>}
                    <h3 className={`font-bold text-white font-elsie ${layout === 'grid' ? 'text-base' : 'text-lg'}`}>{ambience.title}</h3>
                </div>
                <div className={`flex items-center gap-1 text-white font-medium ${layout === 'grid' ? 'text-[10px]' : 'text-xs'}`}>
                    <ClockIcon className="w-4 h-4"/>
                    <span>{durationMin} min</span>
                </div>
            </div>
        </div>
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 bg-black/40 z-10 ${hoverOverlayClasses}`}>
            <PlayCircleIcon className="w-16 h-16 text-white/80" />
        </div>
    </div>
  );
};

export default AmbienceCard;
