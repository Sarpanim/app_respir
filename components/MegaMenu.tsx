import React from 'react';
import { MegaMenu as MegaMenuType } from '../types';
import { useAppContext } from '../context/AppContext';
import DynamicIcon from './DynamicIcon';

interface MegaMenuProps {
    config: MegaMenuType;
    isOpen: boolean;
    closeMenu: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ config, isOpen, closeMenu }) => {
    const { handleLinkNavigation } = useAppContext();

    if (!isOpen) return null;

    const handleNav = (url: string) => {
        handleLinkNavigation(url);
        closeMenu();
    };

    return (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-dark-bg shadow-lg border-t border-black/10 dark:border-white/10 animate-fade-in-down">
            <div className={`container mx-auto px-8 py-6 ${config.width === 'container' ? '' : 'max-w-full'}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {config.columns.map(column => (
                            <div key={column.id}>
                                <h3 className="font-bold text-gray-800 dark:text-white mb-3">{column.title}</h3>
                                <ul className="space-y-2">
                                    {column.links.map(link => (
                                        <li key={link.id}>
                                            <button onClick={() => handleNav(link.url)} className="text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent-light transition-colors">
                                                {link.text}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {config.announcement.enabled && (
                        <div className="md:col-span-1 bg-gray-100 dark:bg-dark-card p-4 rounded-lg">
                            <img src={config.announcement.image.url} alt={config.announcement.title} className="w-full h-32 object-cover rounded-md mb-3" />
                            <h4 className="font-bold text-gray-800 dark:text-white">{config.announcement.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{config.announcement.description}</p>
                            <button onClick={() => handleNav(config.announcement.url)} className="text-sm font-semibold text-accent hover:underline">
                                Découvrir
                            </button>
                        </div>
                    )}
                </div>
                {config.footerLink.enabled && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={() => handleNav(config.footerLink.url)} className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 hover:text-accent dark:hover:text-accent-light transition-colors">
                            <DynamicIcon icon={config.footerLink.icon} className="w-5 h-5" />
                            <span>{config.footerLink.text}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MegaMenu;