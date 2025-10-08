import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MailIcon, GoogleIcon, FacebookIcon } from './Icons';

const Auth: React.FC = () => {
    const { login } = useAppContext();

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
                    <AuthButton
                        icon={<MailIcon className="w-6 h-6" />}
                        text="Sign up with e-mail"
                        onClick={login}
                        className="bg-social-email text-white"
                    />
                    
                    <div className="text-center text-gray-500 dark:text-gray-400 my-2">Or use social media</div>

                    <AuthButton
                        icon={<GoogleIcon className="w-6 h-6" />}
                        text="Sign up with Google"
                        onClick={login}
                        className="bg-white text-gray-700 border border-gray-200"
                    />

                    <AuthButton
                        icon={<FacebookIcon className="w-6 h-6" />}
                        text="Sign up with Facebook"
                        onClick={login}
                        className="bg-social-facebook text-white"
                    />
                    
                    <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
                        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); login(); }} className="font-bold text-accent hover:underline">Log In!</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;