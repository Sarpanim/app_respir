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
        if (formData.name && formData.email && formData.subject && formData.message) {
            console.log("Form submitted:", formData);
            setIsSent(true);
            setTimeout(() => {
                setIsSent(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 3000);
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    };

    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";

    return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
            <header className="relative flex items-center justify-center">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Contact & Support</h1>
            </header>

            <div className="bg-white/30 dark:bg-dark-card p-6 rounded-2xl border border-white/20 dark:border-transparent">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Une question ou un problème ? Remplissez le formulaire ci-dessous ou contactez-nous directement à <a href="mailto:support@respir.app" className="text-accent font-semibold hover:underline">support@respir.app</a>.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">Sujet</label>
                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className={inputClasses} required />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-full transition-colors disabled:bg-accent/50">
                            {isSent ? 'Message envoyé !' : 'Envoyer votre message'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactSupportView;
