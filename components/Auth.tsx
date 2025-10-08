import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { MailIcon, FacebookIcon, XMarkIcon } from './Icons';

const Auth: React.FC = () => {
    const { login, updateUser } = useAppContext();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const ADMIN_EMAIL = 'olivier.heqa@gmail.com';

    const AuthButton: React.FC<{
        icon: React.ReactNode;
        text: string;
        onClick: () => void;
        className: string;
    }> = ({ icon, text, onClick, className }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full text-lg font-semibold transition-transform transform hover:scale-105 shadow-md ${className}`}
        >
            {icon}
            <span>{text}</span>
        </button>
    );

    const decodeJWT = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        setError('');
        
        if (!credentialResponse.credential) {
            setError('Erreur lors de la connexion avec Google');
            return;
        }

        const decoded = decodeJWT(credentialResponse.credential);
        
        if (!decoded || !decoded.email) {
            setError('Impossible de récupérer les informations de votre compte Google');
            return;
        }

        console.log('Google login attempt with email:', decoded.email);

        // Check if the email is the admin email
        if (decoded.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            // Update user with Google info
            updateUser({
                email: decoded.email,
                name: decoded.name || 'Olivier Heqa',
                avatar: decoded.picture || `https://i.pravatar.cc/150?u=${decoded.email}`,
                linkedAccounts: { google: true, facebook: false, apple: false }
            });
            login();
        } else {
            setError(`Accès refusé. Seul l'administrateur (${ADMIN_EMAIL}) peut se connecter. Vous avez essayé avec: ${decoded.email}`);
        }
    };

    const handleGoogleError = () => {
        setError('Erreur lors de la connexion avec Google. Vérifiez que le Client ID Google OAuth est correctement configuré.');
    };

    const handleFacebookLogin = () => {
        setError('La connexion Facebook n\'est pas encore disponible.');
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email || !email.includes('@')) {
            setError('Veuillez entrer une adresse email valide');
            return;
        }
        
        if (!password || password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            updateUser({
                email: email,
                name: 'Olivier Heqa',
                linkedAccounts: { google: false, facebook: false, apple: false }
            });
            login();
        } else {
            setError(`Accès refusé. Seul l'administrateur (${ADMIN_EMAIL}) peut se connecter.`);
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

                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap={false}
                            theme="filled_blue"
                            size="large"
                            text="continue_with"
                            shape="pill"
                            width="384"
                        />
                    </div>

                    <AuthButton
                        icon={<FacebookIcon className="w-6 h-6" />}
                        text="Sign up with Facebook"
                        onClick={handleFacebookLogin}
                        className="bg-social-facebook text-white"
                    />
                    
                    <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
                        Already have an account? <button onClick={() => setShowEmailForm(true)} className="font-bold text-accent hover:underline">Log In!</button>
                    </p>

                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                        <p>Accès réservé à l'administrateur ({ADMIN_EMAIL})</p>
                        <p className="text-[10px]">Pour tester: utilisez l'email ci-dessus avec n'importe quel mot de passe (6+ caractères)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;