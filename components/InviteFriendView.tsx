import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, DocumentDuplicateIcon, ShareIcon, MailIcon, GiftIcon } from './Icons';

const InviteFriendView: React.FC = () => {
    const { navigateToSettings, generalSettings } = useAppContext();
    const inviteLink = 'respir.app/invite/abcd123';
    const [copySuccess, setCopySuccess] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://${inviteLink}`).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert('Impossible de copier le lien.');
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Rejoignez-moi sur RESPIR',
                    text: 'Je vous invite à découvrir RESPIR, une super application de méditation et bien-être.',
                    url: `https://${inviteLink}`,
                });
            } catch (error) {
                console.error('Erreur lors du partage :', error);
            }
        } else {
            alert('La fonction de partage n\'est pas supportée sur ce navigateur. Vous pouvez copier le lien manuellement.');
        }
    };

    const handleEmailInvite = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Sending invite to ${email}`);
        setEmailSent(true);
        setTimeout(() => {
            setEmailSent(false);
            setEmail('');
            setShowEmailForm(false);
        }, 2500);
    };

    const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
        <div className={`bg-white/30 dark:bg-dark-card p-6 rounded-2xl border border-white/20 dark:border-transparent shadow-md ${className}`}>
            {children}
        </div>
    );

    return (
        <div className="animate-fade-in max-w-md mx-auto space-y-8">
            <header className="relative flex items-center justify-center">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Inviter un ami</h1>
            </header>

            <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    Partagez RESPIR avec vos proches et offrez-leur un moment de bien-être.
                </p>
            </div>
            
            <Section>
                <div className="flex items-center bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/10 dark:border-white/10 mb-4">
                    <span className="text-gray-500 dark:text-gray-400 font-mono text-sm flex-grow truncate">{inviteLink}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent/10 text-accent font-semibold rounded-full hover:bg-accent/20 transition-colors">
                        <DocumentDuplicateIcon className="w-5 h-5" />
                        <span>{copySuccess ? 'Copié !' : 'Copier le lien'}</span>
                    </button>
                    <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors">
                        <ShareIcon className="w-5 h-5" />
                        <span>Partager</span>
                    </button>
                </div>
            </Section>

            <Section>
                <button onClick={() => setShowEmailForm(!showEmailForm)} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-transparent border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent/10 transition-colors">
                    <MailIcon className="w-6 h-6" />
                    <span>Inviter par e-mail</span>
                </button>
                {showEmailForm && (
                    <form onSubmit={handleEmailInvite} className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 space-y-3 animate-fade-in">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Adresse e-mail de votre ami"
                            required
                            className="w-full bg-white/50 dark:bg-black/30 p-3 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button type="submit" className="w-full px-4 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 disabled:bg-accent/50" disabled={emailSent}>
                            {emailSent ? 'Invitation envoyée !' : 'Envoyer'}
                        </button>
                    </form>
                )}
            </Section>

            {generalSettings.inviteRewardActive && (
                <Section className="flex items-center gap-4 bg-accent/5 dark:bg-accent/10">
                    <GiftIcon className="w-8 h-8 text-accent flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">{generalSettings.inviteRewardTitle}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{generalSettings.inviteRewardDescription}</p>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default InviteFriendView;