import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { View } from '../types';
import DynamicIcon from './DynamicIcon';

const BottomNav: React.FC = () => {
    const { 
        currentView, 
        mobileNavItems,
        handleLinkNavigation,
        generalSettings
    } = useAppContext();

    const activeNavItems = useMemo(() => {
        return mobileNavItems
            .filter(item => item.active)
            .sort((a, b) => a.position - b.position)
            .slice(0, 5); // Max 5 items
    }, [mobileNavItems]);
    
    // Condition pour gérer l'état actif. L'icône Découvrir reste active sur les pages de détail des catégories.
    const isViewActive = (itemLink: string) => {
        const linkView = itemLink.replace('/', '');
        if (currentView === linkView) return true;
        if (currentView === 'category-detail' && linkView === 'discover') return true;
        if (currentView === 'player' && linkView === 'discover') return true;
        return false;
    }

    const navBackgroundClasses = generalSettings.navBlurEnabled 
      ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg'
      : 'bg-navbar-bg-light dark:bg-navbar-bg-dark';


    return (
        <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 dark:border-white/10 lg:hidden ${navBackgroundClasses}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-around h-20">
                {activeNavItems.map(item => {
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleLinkNavigation(item.link)}
                            className={`flex flex-col items-center justify-center w-full text-sm font-medium transition-colors duration-300 ${
                                isViewActive(item.link)
                                ? 'text-navbar-text-active' 
                                : 'text-navbar-text-inactive-light dark:text-navbar-text-inactive-dark hover:text-navbar-text-active'
                            }`}
                            aria-label={item.label}
                            aria-current={isViewActive(item.link) ? 'page' : undefined}
                        >
                            <DynamicIcon icon={item.icon} className="w-7 h-7 mb-1" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;