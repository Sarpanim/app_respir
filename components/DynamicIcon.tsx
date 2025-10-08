import React from 'react';
import { AVAILABLE_ICONS } from '../constants';
import { QuestionMarkCircleIcon } from './Icons';

interface DynamicIconProps {
  icon: string;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ icon, className }) => {
    // First, check if the icon name exists in our curated library
    const IconComponent = AVAILABLE_ICONS[icon];

    if (IconComponent) {
        return <IconComponent className={className} />;
    }

    // If not, check if it's a custom SVG data URL
    if (icon?.startsWith('data:image/svg+xml')) {
        return (
            <div
                className={`bg-current ${className}`}
                style={{
                    maskImage: `url("${icon}")`,
                    WebkitMaskImage: `url("${icon}")`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                }}
                aria-label="Custom icon"
            ></div>
        );
    }

    // Fallback for a missing or malformed icon identifier
    return <QuestionMarkCircleIcon className={className} />;
};

export default DynamicIcon;
