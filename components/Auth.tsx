import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MailIcon, GoogleIcon, FacebookIcon, XMarkIcon } from './Icons';

const Auth: React.FC = () => {
    const { login } = useAppContext();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const ADMIN_EMAIL = 'olivier.heqa@gmail.com';

    const AuthButton: React.FC<{
        icon: React.ReactNode;
        text: string;
        onClick: () => void;
        className: string;
        disabled?: boolean;
    }> = ({ icon, text, onClick, className, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full text-lg font-semibold transition-transform transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
        >
            {icon}
            <span>{text}</span>
        </button>
    );

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            // Simulate Google OAuth flow with a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Auto-login as admin for demo
            login();
            
        } catch (err) {
            setError('Erreur lors de la connexion avec Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = () => {
        setError('La connexion Facebook n\'est pas encore disponible.');
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validate email format
        if (!email || !email.includes('@')) {
            setError('Veuillez entrer une adresse email valide');
            return;
        }
        
        // Validate password
        if (!password || password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        // Only allow admin email
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            login();
        } else {
            setError('Accès refusé. Seul l\'administrateur peut se connecter.');
        }
    };

    if (showEmailForm) {
        return (
            <div 
                className="min-h-screen w-full flex flex-col bg-cover bg-center"
                style={{ backgroundImage: "url('https://picsum.photos/seed/auth-bg/1080/1920')" }}
            >
                <div className="flex-grow flex flex-col items-center justify-center text-white p-4">
                    <div 
                        className="text-8xl font-elsie font-black text-white"
                        style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                    >
                        RESPI<span className="[transform:scaleX(-1)] inline-block">R</span>
                    </div>
                </div>

                <div className="bg-light-bg dark:bg-dark-bg rounded-t-3xl p-8 shadow-2xl">
                    <div className="max-w-sm mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Connexion</h2>
                            <button 
                                onClick={() => {
                                    setShowEmailForm(false);
                                    setError('');
                                    setEmail('');
                                    setPassword('');
                                }}
                                className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/30 border border-black/20 dark:border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="olivier.heqa@gmail.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/30 border border-black/20 dark:border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-full transition-colors shadow-md"
                            >
                                Se connecter
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Accès réservé à l'administrateur
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen w-full flex flex-col bg-cover bg-center"
            style={{ backgroundImage: "url('https://picsum.photos/seed/auth-bg/1080/1920')" }}
        >
            <div className="flex-grow flex flex-col items-center justify-center text-white p-4">
                <div 
                    className="text-8xl font-elsie font-black text-white"
                    style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                >
                    RESPI<span className="[transform:scaleX(-1)] inline-block">R</span>
                </div>
            </div>

            <div className="bg-light-bg dark:bg-dark-bg rounded-t-3xl p-8 shadow-2xl">
                <div className="max-w-sm mx-auto flex flex-col gap-4">
                    {error && (
                        <div className="mb-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <AuthButton
                        icon={<MailIcon className="w-6 h-6" />}
                        text="Sign up with e-mail"
                        onClick={() => setShowEmailForm(true)}
                        className="bg-social-email text-white"
                    />
                    
                    <div className="text-center text-gray-500 dark:text-gray-400 my-2">Or use social media</div>

                    <AuthButton
                        icon={isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <GoogleIcon className="w-6 h-6" />}
                        text={isLoading ? "Connexion..." : "Sign up with Google"}
                        onClick={handleGoogleLogin}
                        className="bg-white text-gray-700 border border-gray-200"
                        disabled={isLoading}
                    />

                    <AuthButton
                        icon={<FacebookIcon className="w-6 h-6" />}
                        text="Sign up with Facebook"
                        onClick={handleFacebookLogin}
                        className="bg-social-facebook text-white"
                    />
                    
                    <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
                        Already have an account? <button onClick={() => setShowEmailForm(true)} className="font-bold text-accent hover:underline">Log In!</button>
                    </p>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Démo : Cliquez sur Google pour vous connecter en tant qu'admin
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;