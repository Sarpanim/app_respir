import React from 'react';
import { CheckCircleIcon } from '../Icons';
import DynamicIcon from '../DynamicIcon';

interface PromoToggleProps {
    planName: string;
    planIcon: string;
    planIconColor: string;
    isSelected: boolean;
    onToggle: () => void;
}

const PromoToggle: React.FC<PromoToggleProps> = ({ planName, planIcon, planIconColor, isSelected, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative p-3 rounded-lg border-2 transition-all duration-200 w-full text-left ${
                isSelected ? 'border-accent bg-accent/10' : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20'
            }`}
        >
            <div className="flex items-center gap-3">
                <DynamicIcon icon={planIcon} className="w-6 h-6" style={{ color: planIconColor }} />
                <span className="font-semibold text-sm">{planName}</span>
            </div>
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-accent text-white rounded-full">
                    <CheckCircleIcon className="w-5 h-5" />
                </div>
            )}
        </button>
    );
};

export default PromoToggle;