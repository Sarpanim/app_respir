
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import {
    ChevronRightIcon, SunIcon, MoonIcon
} from './Icons';
import { SettingsMenuAction } from '../types';
import DynamicIcon from './DynamicIcon';

const SettingsView: React.FC = () => {
    const { 
        logout, user,
        navigateToSubscription, navigateToAbout, navigateToEditProfile, 
        navigateToNotifications, navigateToHelpFaq, navigateToContactSupport, 
        navigateToPrivacyPolicy, navigateToInviteFriend, settingsMenuItems
    } = useAppContext();
    const { theme, toggleTheme } = useTheme();

    const getActionByName = (actionName: SettingsMenuAction | null) => {
        switch (actionName) {
            case 'navigateToEditProfile': return navigateToEditProfile;
            case 'navigateToSubscription': return navigateToSubscription;
            case 'navigateToNotifications': return navigateToNotifications;
            case 'navigateToHelpFaq': return navigateToHelpFaq;
            case 'navigateToContactSupport': return navigateToContactSupport;
            case 'navigateToPrivacyPolicy': return navigateToPrivacyPolicy;
            case 'navigateToAbout': return navigateToAbout;
            case 'navigateToInviteFriend': return navigateToInviteFriend;
            default: return undefined;
        }
    };

    const groupedItems = useMemo(() => {
        const groups: Record<string, typeof settingsMenuItems> = {};
        settingsMenuItems
            .filter(item => item.active)
            .sort((a,b) => a.position - b.position)
            .forEach(item => {
                if (!groups[item.section]) {
                    groups[item.section] = [];
                }
                groups[item.section].push(item);
            });
        return groups;
    }, [settingsMenuItems]);
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-8">
            <h2 className="text-xl font-elsie font-bold text-gray-300 mb-3">{title}</h2>
            <div className="bg-black/20 rounded-2xl overflow-hidden border border-white/10">
                {children}
            </div>
        </section>
    );

    const SettingsItem: React.FC<{ icon: string; label: string; action?: () => void, hideChevron?: boolean }> = ({ icon, label, action, hideChevron }) => (
        <button onClick={action} className="w-full flex items-center justify-between text-left p-4 hover:bg-white/5 transition-colors duration-200 border-b border-white/10 last:border-b-0">
            <div className="flex items-center gap-4">
                <div className="text-accent"><DynamicIcon icon={icon} className="w-6 h-6" /></div>
                <span className="font-semibold text-gray-100">{label}</span>
            </div>
            {!hideChevron && <ChevronRightIcon className="w-5 h-5 text-gray-400" />}
        </button>
    );

    const ThemeToggle: React.FC<{icon: string; label: string;}> = ({ icon, label }) => (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <div className="text-accent">{theme === 'light' ? <SunIcon className="w-6 h-6" /> : <DynamicIcon icon={icon} className="w-6 h-6" />}</div>
                <span className="font-semibold text-gray-100">{label}</span>
            </div>
            <button
                onClick={toggleTheme}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-bg ${theme === 'dark' ? 'bg-accent' : 'bg-gray-600'}`}
            >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <header className="flex flex-col items-center mb-10 text-center">
                <img
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-accent shadow-lg"
                    src={user.avatar}
                    alt="User Avatar"
                />
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
            </header>

            {Object.keys(groupedItems).map((sectionTitle) => (
                <Section key={sectionTitle} title={sectionTitle}>
                    {groupedItems[sectionTitle].map(item => {
                        if (item.isToggle) {
                            return <ThemeToggle key={item.id} icon={item.icon} label={item.label} />
                        }
                        return (
                            <SettingsItem 
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                action={getActionByName(item.action)}
                                hideChevron={!item.action}
                            />
                        );
                    })}
                </Section>
            ))}

            <footer className="mt-8 text-center">
                <button
                    onClick={logout}
                    className="bg-red-500/80 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
                >
                    Se déconnecter
                </button>
            </footer>
        </div>
    );
};

export default SettingsView;
