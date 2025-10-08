import React from 'react';
import { useAppContext } from '../context/AppContext';
import { NotificationSettings } from '../types';
import { 
    ChevronLeftIcon, ClockIcon, SparklesIcon, ArrowTrendingUpIcon, TicketIcon
} from './Icons';

// Re-usable component for a toggle switch row
const ToggleRow: React.FC<{
    label: string;
    description: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    disabled?: boolean;
}> = ({ label, description, enabled, onToggle, disabled = false }) => (
    <div className={`flex items-center justify-between py-3 px-4 border-b border-black/10 dark:border-white/10 last:border-b-0 ${disabled ? 'opacity-50' : ''}`}>
        <div className="flex-grow pr-4">
            <p className="font-semibold">{label}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <button
            onClick={() => onToggle(!enabled)}
            disabled={disabled}
            className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg ${enabled ? 'bg-accent' : 'bg-gray-400 dark:bg-gray-600'}`}
            aria-pressed={enabled}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

// Re-usable component for a settings section
const SettingsSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ title, icon, children }) => (
    <section>
        <h2 className="text-xl font-elsie font-bold mb-3 flex items-center gap-3">
            <div className="text-accent">{icon}</div>
            <span>{title}</span>
        </h2>
        <div className="bg-white/30 dark:bg-dark-card rounded-2xl overflow-hidden border border-white/20 dark:border-transparent">
            {children}
        </div>
    </section>
);


const NotificationsView: React.FC = () => {
    const { navigateToSettings, notificationSettings, updateNotificationSettings } = useAppContext();

    const handleToggle = (key: keyof NotificationSettings) => {
        updateNotificationSettings({ [key]: !notificationSettings[key] });
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNotificationSettings({ dailyReminderTime: e.target.value });
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
            <header className="relative flex items-center justify-center">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Notifications</h1>
            </header>

            <SettingsSection title="Rappels" icon={<ClockIcon className="w-6 h-6" />}>
                <ToggleRow
                    label="Rappel quotidien"
                    description="Recevez une notification à une heure choisie pour votre séance."
                    enabled={notificationSettings.dailyReminder}
                    onToggle={() => handleToggle('dailyReminder')}
                />
                {notificationSettings.dailyReminder && (
                    <div className="p-4 bg-black/5 dark:bg-white/5">
                        <label htmlFor="reminderTime" className="block text-sm font-medium mb-2">Heure du rappel</label>
                        <input
                            type="time"
                            id="reminderTime"
                            value={notificationSettings.dailyReminderTime}
                            onChange={handleTimeChange}
                            className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                         <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Vous pouvez aussi définir des jours spécifiques (fonctionnalité à venir).</p>
                    </div>
                )}
            </SettingsSection>

            <SettingsSection title="Nouveautés" icon={<SparklesIcon className="w-6 h-6" />}>
                <ToggleRow
                    label="Nouveaux contenus"
                    description="Soyez prévenu(e) des nouveaux cours et ambiances."
                    enabled={notificationSettings.newContent}
                    onToggle={() => handleToggle('newContent')}
                />
                <ToggleRow
                    label="Uniquement mes favoris"
                    description="Ne recevez des alertes que pour vos catégories préférées."
                    enabled={notificationSettings.newContentFavoritesOnly}
                    onToggle={() => handleToggle('newContentFavoritesOnly')}
                    disabled={!notificationSettings.newContent}
                />
            </SettingsSection>
            
            <SettingsSection title="Progression" icon={<ArrowTrendingUpIcon className="w-6 h-6" />}>
                <ToggleRow
                    label="Fin de cours"
                    description="Recevez une notification de félicitations à la fin d'un cours."
                    enabled={notificationSettings.courseCompleted}
                    onToggle={() => handleToggle('courseCompleted')}
                />
                <ToggleRow
                    label="Séries (Streak)"
                    description="Recevez des encouragements pour maintenir votre série de méditations."
                    enabled={notificationSettings.streakReminder}
                    onToggle={() => handleToggle('streakReminder')}
                />
                 <ToggleRow
                    label="Rappel d'inactivité"
                    description="Si vous n'avez pas médité depuis quelques jours."
                    enabled={notificationSettings.inactivityReminder}
                    onToggle={() => handleToggle('inactivityReminder')}
                />
            </SettingsSection>

            <SettingsSection title="Compte & Offres" icon={<TicketIcon className="w-6 h-6" />}>
                <ToggleRow
                    label="Abonnement"
                    description="Avertissement avant l'échéance de votre abonnement."
                    enabled={notificationSettings.subscriptionExpiry}
                    onToggle={() => handleToggle('subscriptionExpiry')}
                />
                 <ToggleRow
                    label="Offres spéciales"
                    description="Recevez nos promotions et offres exclusives."
                    enabled={notificationSettings.specialOffers}
                    onToggle={() => handleToggle('specialOffers')}
                />
            </SettingsSection>
        </div>
    );
};

export default NotificationsView;