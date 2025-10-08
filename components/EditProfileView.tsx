

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import { User, UserProgress } from '../types';
import { 
    ChevronLeftIcon, ArrowUpTrayIcon, UserIcon, AtSymbolIcon, DocumentTextIcon, GiftIcon, DevicePhoneMobileIcon, MailIcon, 
    KeyIcon, ShieldCheckIcon, TrashIcon, CloudArrowDownIcon, GoogleIcon, FacebookIcon,
    BookOpenIcon, ClockIcon, HeartIcon
} from './Icons';

// Helper components local to this view
const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section>
        <h2 className="text-xl font-elsie font-bold mb-4">{title}</h2>
        <div className="bg-white/30 dark:bg-dark-card p-4 rounded-2xl border border-white/20 dark:border-transparent space-y-4">
            {children}
        </div>
    </section>
);

const FormField: React.FC<{ label: string; id: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ label, id, icon, children }) => (
    <div>
        <label htmlFor={id} className="block mb-1 text-sm font-medium flex items-center gap-2">
            {icon}
            <span>{label}</span>
        </label>
        {children}
    </div>
);

const SettingsActionRow: React.FC<{ icon: React.ReactNode; label: string; buttonText: string; onClick: () => void; }> = ({ icon, label, buttonText, onClick }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
        <button onClick={onClick} className="text-sm bg-accent/10 text-accent font-semibold px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors">
            {buttonText}
        </button>
    </div>
);

const ConnectivityRow: React.FC<{ icon: React.ReactNode; label: string; isConnected: boolean; onToggle: () => void; }> = ({ icon, label, isConnected, onToggle }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
        <button 
            onClick={onToggle} 
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${isConnected ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
        >
            {isConnected ? 'Déconnecter' : 'Connecter'}
        </button>
    </div>
);

const StatCard: React.FC<{ icon: React.ReactNode, value: string | number, label: string }> = ({ icon, value, label }) => (
    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg flex items-center gap-3">
        <div className="text-accent">{icon}</div>
        <div>
            <div className="font-bold text-lg">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        </div>
    </div>
);


const EditProfileView: React.FC = () => {
    const { user, updateUser, navigateToSettings, userProgress, favorites } = useAppContext();
    const { courses } = useCourses();
    const [formData, setFormData] = useState<User>(user);
    const [saveMessage, setSaveMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleToggleConnection = (provider: 'google' | 'facebook' | 'apple') => {
        setFormData(prev => ({
            ...prev,
            linkedAccounts: {
                ...prev.linkedAccounts,
                [provider]: !prev.linkedAccounts?.[provider]
            }
        }));
    };

    const handleSave = () => {
        updateUser(formData);
        setSaveMessage('Profil sauvegardé avec succès !');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const profileCompletion = useMemo(() => {
        const fields: (keyof User)[] = ['username', 'bio', 'dateOfBirth', 'phoneNumber'];
        const total = fields.length;
        let completed = 0;
        fields.forEach(field => {
            if (formData[field]) completed++;
        });
        return Math.round((completed / total) * 100);
    }, [formData]);
    
    const personalStats = useMemo(() => {
        const completedLessons = Object.values(userProgress).flatMap(p => Array.from(p.completedLessons));
        
        const totalMinutes = Math.round(completedLessons.reduce((total, lessonId) => {
            for (const course of courses) {
                for (const section of course.sections) {
                    const lesson = section.lessons.find(l => l.id === lessonId);
                    if (lesson) return total + lesson.duration;
                }
            }
            return total;
        }, 0) / 60);

        const coursesCompleted = courses.filter(course => {
             const progress = userProgress[course.id];
             if(!progress) return false;
             const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
             return progress.completedLessons.size === totalLessons && totalLessons > 0;
        }).length;

        return {
            minutes: totalMinutes,
            courses: coursesCompleted,
            favorites: favorites.length
        }
    }, [userProgress, courses, favorites]);

    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";

    return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
            <header className="relative flex items-center justify-center">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Modifier le Profil</h1>
            </header>
            
            <Section title="Aperçu rapide">
                 <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold">Profil complété</span>
                        <span className="text-sm font-bold text-accent">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2.5">
                        <div className="bg-accent h-2.5 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={<ClockIcon className="w-6 h-6"/>} value={personalStats.minutes} label="min écoutées" />
                    <StatCard icon={<BookOpenIcon className="w-6 h-6"/>} value={personalStats.courses} label="cours terminés" />
                    <StatCard icon={<HeartIcon className="w-6 h-6"/>} value={personalStats.favorites} label="favoris" />
                </div>
            </Section>

            <Section title="Informations Personnelles">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <img src={formData.avatar} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-accent shadow-lg"/>
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-accent p-2 rounded-full cursor-pointer hover:bg-accent/80 transition-colors">
                            <ArrowUpTrayIcon className="w-5 h-5 text-white" />
                            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField label="Nom complet" id="name" icon={<UserIcon className="w-4 h-4 text-gray-400"/>}>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={inputClasses} />
                    </FormField>
                     <FormField label="Nom d'utilisateur" id="username" icon={<AtSymbolIcon className="w-4 h-4 text-gray-400"/>}>
                        <input type="text" id="username" name="username" value={formData.username || ''} onChange={handleInputChange} className={inputClasses} />
                    </FormField>
                </div>
                <FormField label="Bio" id="bio" icon={<DocumentTextIcon className="w-4 h-4 text-gray-400"/>}>
                    <textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} rows={3} className={inputClasses} />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Date de naissance" id="dateOfBirth" icon={<GiftIcon className="w-4 h-4 text-gray-400"/>}>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleInputChange} className={inputClasses} />
                    </FormField>
                    <FormField label="Numéro de téléphone" id="phoneNumber" icon={<DevicePhoneMobileIcon className="w-4 h-4 text-gray-400"/>}>
                        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className={inputClasses} />
                    </FormField>
                </div>
                <FormField label="Adresse e-mail" id="email" icon={<MailIcon className="w-4 h-4 text-gray-400"/>}>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} />
                </FormField>
            </Section>

            <Section title="Gestion de Compte">
                <SettingsActionRow icon={<KeyIcon className="w-5 h-5 text-gray-400"/>} label="Mot de passe" buttonText="Changer" onClick={() => alert('Fonctionnalité de changement de mot de passe à implémenter.')} />
                <SettingsActionRow icon={<ShieldCheckIcon className="w-5 h-5 text-gray-400"/>} label="Authentification à 2 facteurs" buttonText="Gérer" onClick={() => alert('Fonctionnalité 2FA à implémenter.')} />
                <SettingsActionRow icon={<TrashIcon className="w-5 h-5 text-red-500"/>} label="Supprimer le compte" buttonText="Supprimer" onClick={() => window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.') && alert('Compte supprimé (simulation).')} />
            </Section>

            <Section title="Connectivité">
                 <ConnectivityRow icon={<GoogleIcon className="w-6 h-6"/>} label="Google" isConnected={!!formData.linkedAccounts?.google} onToggle={() => handleToggleConnection('google')} />
                 <ConnectivityRow icon={<FacebookIcon className="w-6 h-6"/>} label="Facebook" isConnected={!!formData.linkedAccounts?.facebook} onToggle={() => handleToggleConnection('facebook')} />
                 <ConnectivityRow icon={<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.975,13.242c-0.082-2.352,1.5-3.633,1.616-3.715c-1.011-1.492-2.651-1.742-3.238-1.765c-1.391-0.047-2.686,0.84-3.35,0.84c-0.665,0-1.63-0.816-2.949-0.793c-1.428,0.023-2.736,0.864-3.483,2.152c-1.512,2.6-0.379,6.33,1.033,8.438c0.71,1.049,1.554,2.242,2.695,2.242c1.119,0,1.522-0.684,2.924-0.684c1.401,0,1.758,0.684,2.949,0.684c1.164,0,1.905-1.146,2.592-2.176c0.828-1.229,1.22-2.395,1.242-2.438C19.982,17.476,18.029,14.938,17.975,13.242z M15.429,5.011c0.688-0.828,1.14-1.926,1.025-3.012c-0.985,0.047-2.126,0.66-2.836,1.492c-0.641,0.754-1.164,1.88-1.025,2.941C13.578,7.28,14.719,6.664,15.429,5.011z"></path></svg>} label="Apple" isConnected={!!formData.linkedAccounts?.apple} onToggle={() => handleToggleConnection('apple')} />
                 <div className="border-t border-black/10 dark:border-white/10 my-2"></div>
                 <SettingsActionRow icon={<CloudArrowDownIcon className="w-5 h-5 text-gray-400"/>} label="Télécharger mes données" buttonText="Demander" onClick={() => alert('Une archive de vos données sera bientôt disponible (simulation).')} />
            </Section>

            <div className="relative pt-4 pb-8">
                <button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-full transition-colors">
                    Enregistrer les modifications
                </button>
                {saveMessage && <p className="text-center text-green-600 dark:text-green-400 mt-2 text-sm absolute w-full">{saveMessage}</p>}
            </div>
        </div>
    );
};

export default EditProfileView;