import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from './Icons';

const ContactSupportView: React.FC = () => {
    const { navigateToSettings } = useAppContext();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSent, setIsSent] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to a backend service
        console.log('Support request submitted:', formData);
        setIsSent(true);
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Contacter le Support</h1>
            </header>

            {isSent ? (
                <div className="bg-white/30 dark:bg-black/20 p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-2">Merci !</h2>
                    <p className="text-gray-600 dark:text-gray-400">Votre message a été envoyé. Notre équipe vous répondra dans les plus brefs délais.</p>
                    <button onClick={() => setIsSent(false)} className="mt-6 btn-primary">Envoyer un autre message</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white/30 dark:bg-black/20 p-8 rounded-2xl space-y-6">
                    <input type="text" name="name" placeholder="Votre nom" value={formData.name} onChange={handleChange} className="w-full input-style" required />
                    <input type="email" name="email" placeholder="Votre email" value={formData.email} onChange={handleChange} className="w-full input-style" required />
                    <input type="text" name="subject" placeholder="Sujet" value={formData.subject} onChange={handleChange} className="w-full input-style" required />
                    <textarea name="message" placeholder="Votre message..." value={formData.message} onChange={handleChange} className="w-full input-style" rows={6} required></textarea>
                    <button type="submit" className="w-full btn-primary">Envoyer</button>
                </form>
            )}
        </div>
    );
};

export default ContactSupportView;