import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { HomepageImageText } from '../../types';

interface ImageTextSectionProps {
    config?: HomepageImageText;
}

const ImageTextSection: React.FC<ImageTextSectionProps> = ({ config }) => {
    const { generalSettings, handleLinkNavigation } = useAppContext();
    const imageTextConfig = config || generalSettings.homepageImageText;

    const textAlignClasses: Record<typeof imageTextConfig.textAlign, string> = {
        left: 'text-left', center: 'text-center', right: 'text-right',
    };
    const objectPositionClasses: Record<typeof imageTextConfig.image.objectPosition, string> = {
        top: 'object-top', center: 'object-center', bottom: 'object-bottom',
    };
    const flexAlignClasses: Record<typeof imageTextConfig.textAlign, string> = {
        left: 'items-start', center: 'items-center', right: 'items-end',
    };
    const buttonAlignClasses: Record<typeof imageTextConfig.textAlign, string> = {
        left: 'self-start', center: 'self-center', right: 'self-end',
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        if (!imageTextConfig.button?.url) return;
        e.preventDefault();
        handleLinkNavigation(imageTextConfig.button.url);
    }

    return (
        <div className={`flex gap-8 items-center ${imageTextConfig.image.position === 'right' ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'}`}>
            <div className="w-full md:w-1/2">
                <img
                    src={imageTextConfig.image.url}
                    alt={imageTextConfig.title}
                    className={`w-full h-full object-cover rounded-2xl shadow-lg ${objectPositionClasses[imageTextConfig.image.objectPosition]}`}
                    style={{ aspectRatio: imageTextConfig.image.ratio.replace(':', '/') }}
                />
            </div>
            <div className={`flex flex-col w-full md:w-1/2 ${textAlignClasses[imageTextConfig.textAlign]} ${flexAlignClasses[imageTextConfig.textAlign]}`}>
                <h3 className="text-3xl sm:text-4xl font-elsie font-bold mb-4">{imageTextConfig.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{imageTextConfig.description}</p>
                {imageTextConfig.button?.enabled && imageTextConfig.button.text && (
                    <button onClick={handleButtonClick} className={`mt-6 inline-block bg-accent text-white font-semibold py-2 px-5 rounded-full hover:bg-accent/90 transition-colors ${buttonAlignClasses[imageTextConfig.textAlign]}`}>
                        {imageTextConfig.button.text}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageTextSection;
