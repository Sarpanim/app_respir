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

    const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, url: string) => {
        e.preventDefault();
        handleLinkNavigation(url);
        closeMenu(); // Close menu on navigation
    };

    if (!config.enabled) {
        return null;
    }

    const hasContent = config.columns.length > 0 || config.announcement.enabled;
    
    return (
        <div 
          className={`absolute top-full left-0 w-screen bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-white/10 shadow-lg ${isOpen ? 'animate-slideDown' : 'hidden'}`}
          aria-hidden={!isOpen}
        >
            <div className={`max-w-7xl mx-auto px-8 ${hasContent ? 'py-8' : ''}`}>
                <div className="flex gap-8">
                    {config.columns.length > 0 && (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                            {config.columns.map(column => (
                                <div key={column.id}>
                                    <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">{column.title}</h4>
                                    <ul className="space-y-2">
                                        {column.links.map(link => (
                                            <li key={link.id}>
                                                <button 
                                                    onClick={(e) => handleLinkClick(e, link.url)} 
                                                    className="text-left w-full text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
                                                >
                                                    {link.text}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {config.announcement.enabled && (
                        <div className="w-full max-w-xs flex-shrink-0 border-l border-gray-200 dark:border-white/10 pl-8">
                             <a href="#" onClick={(e) => handleLinkClick(e, config.announcement.url)} className="block group">
                                <div className="rounded-lg overflow-hidden mb-3">
                                    <img 
                                        src={config.announcement.image.url} 
                                        alt={config.announcement.title} 
                                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        style={{ aspectRatio: config.announcement.image.ratio.replace(':', '/'), objectPosition: config.announcement.image.position }}
                                    />
                                </div>
                                <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-accent transition-colors">{config.announcement.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{config.announcement.description}</p>
                            </a>
                        </div>
                    )}
                </div>

                {config.footerLink.enabled && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                        <button onClick={(e) => handleLinkClick(e, config.footerLink.url)} className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent transition-colors">
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