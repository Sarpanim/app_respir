import React from 'react';
import { useAppContext } from '../context/AppContext';
import { SettingsMenuAction } from '../types';

const Footer: React.FC = () => {
    const { isAdmin, navigateToAdmin, generalSettings, ...navActions } = useAppContext();
    const { footerSettings } = generalSettings;

    const getActionByName = (actionName: SettingsMenuAction | null) => {
        const actionMap = {
            navigateToEditProfile: navActions.navigateToEditProfile,
            navigateToSubscription: navActions.navigateToSubscription,
            navigateToNotifications: navActions.navigateToNotifications,
            navigateToHelpFaq: navActions.navigateToHelpFaq,
            navigateToContactSupport: navActions.navigateToContactSupport,
            navigateToPrivacyPolicy: navActions.navigateToPrivacyPolicy,
            navigateToAbout: navActions.navigateToAbout,
            navigateToInviteFriend: navActions.navigateToInviteFriend,
        };
        return actionName ? actionMap[actionName] : () => {};
    };

    const Column2 = footerSettings.columns.find(c => c.id === 'col2');
    const Column3 = footerSettings.columns.find(c => c.id === 'col3');

    const effectiveLayout = footerSettings.layout === 4 && footerSettings.newsletterEnabled 
        ? 4 
        : (Column2?.enabled && Column3?.enabled ? 3 : (Column2?.enabled || Column3?.enabled ? 2 : 1));

    return (
        <footer className="hidden lg:block bg-light-bg/80 dark:bg-dark-bg/80 border-t border-black/10 dark:border-white/10 mt-auto">
            <div className="container mx-auto px-8 py-12">
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${effectiveLayout} gap-8 text-sm`}>
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                           {generalSettings.appLogo && (
                            <div
                              className="bg-accent"
                              style={{
                                height: `28px`,
                                width: `28px`,
                                maskImage: `url(${generalSettings.appLogo})`,
                                WebkitMaskImage: `url(${generalSettings.appLogo})`,
                                maskSize: 'contain',
                                WebkitMaskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                WebkitMaskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskPosition: 'center',
                              }}
                            ></div>
                          )}
                          <div className="text-2xl font-elsie font-black text-accent">
                            RESPI<span className="[transform:scaleX(-1)] inline-block">R</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{footerSettings.tagline}</p>
                    </div>
                    
                    {Column2 && Column2.enabled && (
                        <div>
                            <h4 className="font-semibold mb-3">{Column2.title}</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                {Column2.links.sort((a,b) => a.position - b.position).map(link => (
                                    <li key={link.id}>
                                        {link.action ? (
                                            <button onClick={getActionByName(link.action)} className="hover:text-accent">{link.label}</button>
                                        ) : (
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">{link.label}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {Column3 && Column3.enabled && (
                         <div>
                            <h4 className="font-semibold mb-3">{Column3.title}</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                {Column3.links.sort((a,b) => a.position - b.position).map(link => (
                                    <li key={link.id}>
                                        {link.action ? (
                                            <button onClick={getActionByName(link.action)} className="hover:text-accent">{link.label}</button>
                                        ) : (
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">{link.label}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {footerSettings.layout === 4 && footerSettings.newsletterEnabled && (
                        <div>
                            <h4 className="font-semibold mb-3">{footerSettings.newsletterTitle}</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{footerSettings.newsletterDescription}</p>
                            <form className="flex" onSubmit={e => e.preventDefault()}>
                                <input type="email" placeholder="Votre email" className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-l-md border border-r-0 border-black/20 dark:border-white/20 focus:outline-none focus:ring-1 focus:ring-accent" />
                                <button className="bg-accent text-white px-3 py-2 rounded-r-md hover:bg-accent/90 transition-colors">S'inscrire</button>
                            </form>
                        </div>
                    )}
                </div>
                <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10 flex justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} RESPIR. Tous droits réservés.</p>
                    {isAdmin && (
                        <button onClick={navigateToAdmin} className="hover:text-accent font-semibold">
                            Administration
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;