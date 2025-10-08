import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { HamburgerIcon, ChevronDownIcon } from './Icons';
import MegaMenu from './MegaMenu';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const { 
    navigateToGrid, 
    toggleSettings, 
    generalSettings, 
    user, 
    headerNavItems, 
    currentView,
    handleLinkNavigation
  } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const megaMenuTrigger = useMemo(() => headerNavItems.find(item => item.hasMegaMenu && item.active), [headerNavItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const svgAlignClass = {
    start: 'self-start',
    center: 'self-center',
    end: 'self-end',
  }[generalSettings.appLogoAlign || 'center'];

  const isViewActive = (itemLink: string) => {
    const linkView = itemLink.replace('/', '');
    if (currentView === linkView) return true;
    if (currentView === 'category-detail' && linkView === 'discover') return true;
    if (currentView === 'player' && linkView === 'discover') return true;
    return false;
  }
  
  const activeNavItems = useMemo(() => {
      return headerNavItems
          .filter(item => item.active)
          .sort((a, b) => a.position - b.position);
  }, [headerNavItems]);
  
  const headerBackgroundClasses = generalSettings.navBlurEnabled 
    ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg'
    : 'bg-header-bg-light dark:bg-header-bg-dark';

  const Logo = () => (
      <div
        className="flex items-center gap-3 cursor-pointer flex-shrink-0"
        onClick={navigateToGrid}
      >
        {generalSettings.appLogo && (
          <div
            className={`bg-accent ${svgAlignClass}`}
            style={{
              height: `${generalSettings.appLogoSize}px`,
              width: `${generalSettings.appLogoSize}px`,
              maskImage: `url(${generalSettings.appLogo})`,
              WebkitMaskImage: `url(${generalSettings.appLogo})`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
            aria-label="Application logo"
          ></div>
        )}
        <div className="text-3xl sm:text-4xl font-elsie font-black text-accent">
          RESPI<span className="[transform:scaleX(-1)] inline-block">R</span>
        </div>
      </div>
  );

  const NavMenu = () => (
      <nav className="hidden lg:flex items-center" style={{ gap: `${generalSettings.headerNavSpacing}px` }}>
          {activeNavItems.map(item => {
              const isMegaTrigger = item.id === megaMenuTrigger?.id && generalSettings.megaMenu.enabled;
              const isActive = isMegaTrigger ? (isViewActive(item.link) || isMenuOpen) : isViewActive(item.link);
              
              const buttonBaseClasses = `group font-semibold`;
              
              const colorClasses = `transition-colors group-hover:text-header-text-hover ${
                isActive
                  ? 'text-header-text-active'
                  : 'text-header-text-inactive-light dark:text-header-text-inactive-dark'
              }`;
              
              const underlineClasses = `absolute bottom-0 left-0 w-full h-0.5 origin-left transform transition-transform duration-300 ease-out 
                ${isActive
                    ? 'scale-x-100 bg-header-text-active group-hover:bg-header-text-hover'
                    : 'scale-x-0 group-hover:scale-x-100 group-hover:bg-header-text-hover'
                }`;

              if (isMegaTrigger) {
                  return (
                       <button 
                          key={item.id} 
                          onClick={() => setIsMenuOpen(prev => !prev)} 
                          aria-expanded={isMenuOpen}
                          className={`${buttonBaseClasses} flex items-center gap-1`}
                      >
                          <span className={`relative py-2 ${colorClasses}`}>
                              {item.label}
                              <span className={underlineClasses}></span>
                          </span>
                          <ChevronDownIcon className={`w-4 h-4 transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''} ${colorClasses}`} />
                      </button>
                  )
              }
              return (
                  <button
                      key={item.id}
                      onClick={() => handleLinkNavigation(item.link)}
                      className={buttonBaseClasses}
                  >
                      <span className={`relative py-2 block ${colorClasses}`}>
                          {item.label}
                          <span className={underlineClasses}></span>
                      </span>
                  </button>
              )
          })}
      </nav>
  );

  const Avatar = () => (
      <div className="flex-shrink-0">
        <button
          onClick={toggleSettings}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors lg:hidden"
          aria-label="Ouvrir les paramètres"
        >
          <HamburgerIcon className="w-7 h-7" />
        </button>
        
        <button
          onClick={toggleSettings}
          className="hidden lg:block w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg"
          aria-label="Ouvrir les paramètres"
        >
          <img
            src={user.avatar}
            alt="Avatar de l'utilisateur"
            className="w-full h-full rounded-full object-cover"
          />
        </button>
      </div>
  );

  return (
    <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 border-b border-black/10 dark:border-white/10 ${headerBackgroundClasses}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {generalSettings.headerNavAlign === 'start' && (
            <>
                <div className="flex items-center gap-x-8">
                    <Logo />
                    <NavMenu />
                </div>
                <Avatar />
            </>
        )}
        {generalSettings.headerNavAlign === 'center' && (
            <>
                <div className="flex-1 flex justify-start">
                    <Logo />
                </div>
                <div className="flex-1 flex justify-center">
                    <NavMenu />
                </div>
                <div className="flex-1 flex justify-end">
                    <Avatar />
                </div>
            </>
        )}
        {generalSettings.headerNavAlign === 'end' && (
            <>
                <Logo />
                <div className="flex items-center gap-x-8">
                    <NavMenu />
                    <Avatar />
                </div>
            </>
        )}
      </div>
      {generalSettings.megaMenu.enabled && megaMenuTrigger && (
        <MegaMenu config={generalSettings.megaMenu} isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;