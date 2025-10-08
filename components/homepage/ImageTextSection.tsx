import React from 'react';
import { HomepageImageText } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface ImageTextSectionProps {
    config?: HomepageImageText;
}

const ImageTextSection: React.FC<ImageTextSectionProps> = ({ config }) => {
    const { generalSettings, handleLinkNavigation } = useAppContext();
    const imageTextConfig = config || generalSettings.homepageImageText;

    if (!imageTextConfig) return null;

    const { title, description, textAlign, image, button } = imageTextConfig;

    const textAlignment = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end',
    }[textAlign];

    const imagePosition = image.position === 'left' ? 'md:order-first' : 'md:order-last';

    return (
        <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className={`flex flex-col ${textAlignment} ${imagePosition}`}>
                        <h2 className="text-3xl md:text-4xl font-elsie font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">{description}</p>
                        {button?.enabled && (
                            <button 
                                onClick={() => handleLinkNavigation(button.url)}
                                className="btn-primary"
                            >
                                {button.text}
                            </button>
                        )}
                    </div>
                    <div className="w-full">
                        <img 
                            src={image.url} 
                            alt={title} 
                            className="rounded-2xl shadow-lg w-full h-auto"
                            style={{ aspectRatio: image.ratio, objectFit: 'cover', objectPosition: image.objectPosition }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageTextSection;