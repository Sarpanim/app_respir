import React from 'react';
import { HomepageSlide } from '../../types';

interface SliderSectionProps {
  slide: HomepageSlide;
}

const SliderSection: React.FC<SliderSectionProps> = ({ slide }) => {
  const textAlignClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const objectPositionClasses: Record<string, string> = {
    top: 'object-top',
    center: 'object-center',
    bottom: 'object-bottom',
  };

  // Sécurités
  const imageUrl = slide?.image?.url || null;
  const imagePosition = slide?.image?.objectPosition || 'center';
  const textAlign = slide?.textAlign || 'center';

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 lg:h-96">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={slide.title || 'Image de la diapositive'}
          className={`absolute w-full h-full object-cover ${
            objectPositionClasses[imagePosition]
          }`}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
          Image indisponible
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

      <div
        className={`relative h-full flex flex-col justify-end p-8 ${
          textAlignClasses[textAlign] || 'text-center items-center'
        }`}
      >
        {slide.title && (
          <h2
            className="text-3xl md:text-4xl font-elsie font-bold text-white"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {slide.title}
          </h2>
        )}

        {slide.subtitle && (
          <p
            className="mt-2 text-lg text-white/90 max-w-lg"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            {slide.subtitle}
          </p>
        )}

        {slide.button?.enabled && (
          <button className="mt-6 btn-primary">
            {slide.button.text || 'Découvrir'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SliderSection;
