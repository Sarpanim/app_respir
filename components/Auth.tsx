import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../src/integrations/supabase/client';
import { EnvelopeIcon, FacebookIcon, XMarkIcon, GoogleIcon } from './Icons';

const Auth: React.FC = () => {
    const { setShowAuth, login } = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        
        const authMethod = isLogin ? supabase.auth.signInWithPassword : supabase.auth.signUp;
        
        const { error, data } = await authMethod({ email, password });

        if (error) {
            setError(error.message);
        } else {
            if (!isLogin) {
                setMessage('Veuillez vérifier votre email pour confirmer votre inscription.');
            } else {
                if (data?.session) {
                    login();
                }
                setShowAuth(false);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) setError(error.message);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm relative">
                <button onClick={() => setShowAuth(false)} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold font-elsie text-center mb-2">{isLogin ? 'Connexion' : 'Inscription'}</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                        {isLogin ? "Heureux de vous revoir !" : "Créez votre compte pour commencer."}
                    </p>

                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</p>}
                    {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4">{message}</p>}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full input-style"
                            required
                        />
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full input-style"
                            required
                        />
                        <button type="submit" className="w-full btn-primary">
                            {isLogin ? 'Se connecter' : "S'inscrire"}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OU</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button onClick={handleGoogleSignIn} className="w-full btn-secondary flex items-center justify-center gap-3">
                            <GoogleIcon className="w-5 h-5" />
                            Continuer avec Google
                        </button>
                        {/* Add other providers if needed */}
                    </div>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                        <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-accent hover:underline ml-1">
                            {isLogin ? "S'inscrire" : "Se connecter"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;