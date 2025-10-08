import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { useAppContext } from '../../context/AppContext';
import { HomepageQuote } from '../../types';
import { ChatBubbleLeftRightIcon, CheckIcon, ArrowPathIcon } from '../Icons';

const AdminQuoteManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useAppContext();
    const [quote, setQuote] = useState<HomepageQuote>(generalSettings.homepageQuote);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => {
            updateGeneralSettings({ ...generalSettings, homepageQuote: quote });
            setSaveStatus('saved');
            setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        }, 1000);
    };

    const inputClasses = "w-full bg-white/50 dark:bg-black/30 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent";

    return (
        <AdminPageLayout title={<div className="flex items-center gap-3"><ChatBubbleLeftRightIcon className="w-7 h-7" /><span>Gestion de la Citation</span></div>}>
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-6 border border-white/20 dark:border-black/30 space-y-6">
                <div>
                    <label htmlFor="quote-text" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Texte de la citation</label>
                    <textarea 
                        id="quote-text"
                        value={quote.text}
                        onChange={(e) => setQuote(q => ({ ...q, text: e.target.value }))}
                        rows={4}
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label htmlFor="quote-author" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">Auteur</label>
                    <input 
                        type="text"
                        id="quote-author"
                        value={quote.author}
                        onChange={(e) => setQuote(q => ({ ...q, author: e.target.value }))}
                        className={inputClasses}
                    />
                </div>
                 <div className="relative mt-2">
                    <button
                        onClick={handleSave}
                        disabled={saveStatus !== 'idle'}
                        className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${
                            saveStatus === 'saved'
                                ? 'bg-green-500'
                                : saveStatus === 'saving'
                                ? 'bg-accent/70'
                                : 'bg-accent hover:bg-accent/90'
                        } ${saveStatus !== 'idle' ? 'cursor-not-allowed' : ''}`}
                    >
                        {saveStatus === 'idle' && 'Enregistrer'}
                        {saveStatus === 'saving' && (
                            <>
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                <span>Enregistrement...</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <CheckIcon className="w-5 h-5" />
                                <span>Enregistré !</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminQuoteManagement;