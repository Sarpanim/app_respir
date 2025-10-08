import React from 'react';
import { HomepageSlider } from '../../types';

interface SliderSectionProps {
    config: HomepageSlider;
}

const SliderSection: React.FC<SliderSectionProps> = ({ config }) => {
    if (!config || !config.enabled || !config.slides || config.slides.length === 0) {
        return null;
    }
    
    // This component renders only the first slide of the configuration.
    const slide = config.slides[0];

    // Tailwind classes mapping
    const textAlignClasses: Record<typeof slide.textAlign, string> = {
        left: 'text-left', center: 'text-center', right: 'text-right',
    };
    const objectPositionClasses: Record<typeof slide.image.objectPosition, string> = {
        top: 'object-top', center: 'object-center', bottom: 'object-bottom',
    };
    const flexAlignClasses: Record<typeof slide.textAlign, string> = {
        left: 'items-start', center: 'items-center', right: 'items-end',
    };
     const buttonAlignClasses: Record<typeof slide.textAlign, string> = {
        left: 'self-start', center: 'self-center', right: 'self-end',
    };

    if (slide.image.position === 'background') {
        return (
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 lg:h-96">
                <img src={slide.image.url} alt={slide.title} className={`absolute w-full h-full object-cover ${objectPositionClasses[slide.image.objectPosition]}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                <div className={`absolute inset-0 p-6 md:p-12 flex flex-col justify-end ${textAlignClasses[slide.textAlign]} ${flexAlignClasses[slide.textAlign]}`}>
                    <div className="max-w-xl">
                        <h3 className="text-2xl md:text-4xl font-elsie font-bold text-white drop-shadow-md">{slide.title}</h3>
                        <p className="mt-2 text-white drop-shadow">{slide.subtitle}</p>
                        {slide.button.enabled && slide.button.text && (
                            <a href={slide.button.url} className="mt-4 inline-block bg-accent text-white font-semibold py-2 px-5 rounded-full hover:bg-accent/90 transition-colors shadow-lg">
                                {slide.button.text}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    // Layout for image on left or right
    return (
        <div className={`bg-white/30 dark:bg-dark-card flex gap-0 md:gap-8 items-center rounded-2xl overflow-hidden shadow-lg ${slide.image.position === 'right' ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'}`}>
            <div className="w-full md:w-1/2">
                <img 
                    src={slide.image.url} 
                    alt={slide.title} 
                    className={`w-full h-full object-cover ${objectPositionClasses[slide.image.objectPosition]}`} 
                    style={{ aspectRatio: slide.image.ratio.replace(':', '/') }}
                />
            </div>
            <div className={`flex flex-col w-full md:w-1/2 p-6 md:p-8 ${textAlignClasses[slide.textAlign]} ${flexAlignClasses[slide.textAlign]}`}>
                <h3 className="text-2xl md:text-3xl font-elsie font-bold">{slide.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{slide.subtitle}</p>
                 {slide.button.enabled && slide.button.text && (
                    <a href={slide.button.url} className={`mt-6 inline-block bg-accent text-white font-semibold py-2 px-5 rounded-full hover:bg-accent/90 transition-colors ${buttonAlignClasses[slide.textAlign]}`}>
                        {slide.button.text}
                    </a>
                )}
            </div>
        </div>
    );
};

export default SliderSection;