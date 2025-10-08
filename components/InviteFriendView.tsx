import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, DocumentDuplicateIcon, ShareIcon, EnvelopeIcon, GiftIcon } from './Icons';

const InviteFriendView: React.FC = () => {
    const { navigateTo } = useAppContext();
    const referralLink = "https://respir.app/invite?ref=a1b2c3d4";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        // You might want to show a toast notification here
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={() => navigateTo('profile')} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Inviter un ami</h1>
            </header>

            <div className="bg-white/30 dark:bg-black/20 p-6 rounded-2xl border border-white/20 dark:border-black/30 text-center">
                <GiftIcon className="w-16 h-16 mx-auto text-accent" />
                <h2 className="text-xl font-bold mt-4">Gagnez des récompenses</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Recevez un mois d'abonnement Standard gratuit pour chaque ami qui s'abonne grâce à votre lien !
                </p>

                <div className="mt-6">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Votre lien de parrainage</label>
                    <div className="mt-2 flex items-center bg-black/5 dark:bg-white/5 rounded-lg p-2 border border-black/10 dark:border-white/10">
                        <input 
                            type="text" 
                            value={referralLink} 
                            readOnly 
                            className="w-full bg-transparent focus:outline-none text-center font-mono text-sm"
                        />
                        <button onClick={copyToClipboard} className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10">
                            <DocumentDuplicateIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <ShareIcon className="w-5 h-5" />
                        Partager
                    </button>
                    <a href={`mailto:?subject=Rejoignez-moi sur Respir&body=Découvrez la méditation avec Respir ! ${referralLink}`} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700">
                        <EnvelopeIcon className="w-5 h-5" />
                        Email
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InviteFriendView;