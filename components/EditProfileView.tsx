import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
    ChevronLeftIcon, ArrowUpTrayIcon, UserIcon, AtSymbolIcon, DocumentTextIcon, GiftIcon, DevicePhoneMobileIcon, EnvelopeIcon, 
    KeyIcon, ShieldCheckIcon, TrashIcon, CloudArrowDownIcon, GoogleIcon, FacebookIcon,
    BookOpenIcon, ClockIcon, HeartIcon
} from './Icons';

const EditProfileView: React.FC = () => {
    const { navigateTo, user, updateUser } = useAppContext();
    const [activeTab, setActiveTab] = useState('profile');

    if (!user) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateUser({ [name]: value });
    };

    const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-white/30 dark:bg-black/20 p-4 sm:p-6 rounded-2xl border border-white/20 dark:border-black/30">
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );

    const InputField: React.FC<{ label: string; name: string; value: string; icon: React.ReactNode; type?: string }> = ({ label, name, value, icon, type = 'text' }) => (
        <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
            <div className="mt-1 flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-lg p-3 border border-transparent focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
                <span className="text-gray-500">{icon}</span>
                <input type={type} name={name} value={value} onChange={handleInputChange} className="w-full bg-transparent focus:outline-none" />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={() => navigateTo('profile')} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Modifier le Profil</h1>
            </header>

            <div className="flex justify-center mb-6 border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 font-semibold ${activeTab === 'profile' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Profil</button>
                <button onClick={() => setActiveTab('account')} className={`px-4 py-2 font-semibold ${activeTab === 'account' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Compte</button>
                <button onClick={() => setActiveTab('data')} className={`px-4 py-2 font-semibold ${activeTab === 'data' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Données</button>
            </div>

            {activeTab === 'profile' && (
                <ProfileSection title="Informations Personnelles">
                    <div className="flex flex-col items-center space-y-4">
                        <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark">
                            <ArrowUpTrayIcon className="w-4 h-4" />
                            Changer la photo
                        </button>
                    </div>
                    <InputField label="Nom complet" name="name" value={user.name} icon={<UserIcon className="w-5 h-5" />} />
                    <InputField label="Nom d'utilisateur" name="username" value={user.username || ''} icon={<AtSymbolIcon className="w-5 h-5" />} />
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Bio</label>
                        <textarea name="bio" value={user.bio} onChange={handleInputChange} className="mt-1 w-full input-style" rows={3}></textarea>
                    </div>
                </ProfileSection>
            )}

            {activeTab === 'account' && (
                <div className="space-y-6">
                    <ProfileSection title="Informations de Connexion">
                        <InputField label="Email" name="email" value={user.email} icon={<EnvelopeIcon className="w-5 h-5" />} />
                        <InputField label="Mot de passe" name="password" value="••••••••" type="password" icon={<KeyIcon className="w-5 h-5" />} />
                        <button className="text-sm font-semibold text-accent">Changer le mot de passe</button>
                    </ProfileSection>
                    <ProfileSection title="Connexions Sociales">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <GoogleIcon className="w-6 h-6" />
                                <span>Google</span>
                            </div>
                            <button className="text-sm font-semibold text-green-600">Connecté</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FacebookIcon className="w-6 h-6 text-blue-600" />
                                <span>Facebook</span>
                            </div>
                            <button className="text-sm font-semibold text-accent">Connecter</button>
                        </div>
                    </ProfileSection>
                </div>
            )}

            {activeTab === 'data' && (
                <div className="space-y-6">
                    <ProfileSection title="Gestion des Données">
                        <div className="flex items-center justify-between">
                            <p>Télécharger vos données</p>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                <CloudArrowDownIcon className="w-5 h-5" />
                                Télécharger
                            </button>
                        </div>
                    </ProfileSection>
                    <ProfileSection title="Zone de Danger">
                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div>
                                <p className="font-bold text-red-700 dark:text-red-400">Supprimer le compte</p>
                                <p className="text-sm text-red-600 dark:text-red-500">Cette action est irréversible.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
                                <TrashIcon className="w-5 h-5" />
                                Supprimer
                            </button>
                        </div>
                    </ProfileSection>
                </div>
            )}
        </div>
    );
};

export default EditProfileView;