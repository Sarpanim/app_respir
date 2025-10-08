import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../integrations/supabase/client';
import { MailIcon, FacebookIcon, XMarkIcon } from './Icons';

const Auth: React.FC = () => {
    const { login, updateUser } = useAppContext();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const ADMIN_EMAIL = 'olivier.heqa@gmail.com';

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                handleSuccessfulAuth(session.user);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                handleSuccessfulAuth(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSuccessfulAuth = async (user: any) => {
        // Récupérer ou créer le profil
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
        }

        // Mettre à jour le contexte avec les infos utilisateur
        updateUser({
            id: user.id,
            email: user.email || '',
            name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur',
            avatar: profile?.avatar_url || user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user.email}`,
            linkedAccounts: {
                google: user.app_metadata?.provider === 'google',
                facebook: user.app_metadata?.provider === 'facebook',
                apple: user.app_metadata?.provider === 'apple',
            }
        });

        login();
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            }
        });

        if (error) {
            setError(`Erreur Google: ${error.message}`);
            setLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setError('');
        setLoading(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: window.location.origin,
            }
        });

        if (error) {
            setError(`Erreur Facebook: ${error.message}`);
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
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

        setLoading(true);

        // Essayer de se connecter
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            // Si l'utilisateur n'existe pas, créer un compte
            if (signInError.message.includes('Invalid login credentials')) {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        }
                    }
                });

                if (signUpError) {
                    setError(`Erreur d'inscription: ${signUpError.message}`);
                    setLoading(false);
                    return;
                }

                if (signUpData.user) {
                    setError('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
                    setLoading(false);
                    return;
                }
            } else {
                setError(`Erreur de connexion: ${signInError.message}`);
                setLoading(false);
                return;
            }
        }

        if (signInData.user) {
            await handleSuccessfulAuth(signInData.user);
        }

        setLoading(false);
    };

    const AuthButton: React.FC<{
        icon: React.ReactNode;
        text: string;
        onClick: () => void;
        className: string;
        disabled?: boolean;
    }> = ({ icon, text, onClick, className, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full text-lg font-semibold transition-transform transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {icon}
            <span>{text}</span>
        </button>
    );

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
                                disabled={loading}
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {error && (
                            <div className={`mb-4 p-3 border rounded-lg text-sm ${
                                error.includes('créé') 
                                    ? 'bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400'
                                    : 'bg-red-500/20 border-red-500/50 text-red-600 dark:text-red-400'
                            }`}>
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
                                    placeholder="votre@email.com"
                                    required
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-full transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Nouveau compte créé automatiquement si l'email n'existe pas
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
                        disabled={loading}
                    />
                    
                    <div className="text-center text-gray-500 dark:text-gray-400 my-2">Or use social media</div>

                    <AuthButton
                        icon={<svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                        text="Continue with Google"
                        onClick={handleGoogleLogin}
                        className="bg-white text-gray-700 border border-gray-300"
                        disabled={loading}
                    />

                    <AuthButton
                        icon={<FacebookIcon className="w-6 h-6" />}
                        text="Sign up with Facebook"
                        onClick={handleFacebookLogin}
                        className="bg-social-facebook text-white"
                        disabled={loading}
                    />
                    
                    <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
                        Already have an account? <button onClick={() => setShowEmailForm(true)} className="font-bold text-accent hover:underline" disabled={loading}>Log In!</button>
                    </p>

                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <p>Authentification sécurisée via Supabase</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;