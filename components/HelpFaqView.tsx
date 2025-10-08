import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, ChevronDownIcon } from './Icons';

const HelpFaqView: React.FC = () => {
    const { navigateToSettings, faqItems } = useAppContext();
    const [openItemId, setOpenItemId] = useState<string | null>(faqItems.length > 0 ? faqItems[0].id : null);

    const toggleItem = (id: string) => {
        setOpenItemId(openItemId === id ? null : id);
    };

    const groupedFaqs = faqItems.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<string, typeof faqItems>);

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Aide & FAQ</h1>
            </header>

            <div className="space-y-8">
                {Object.entries(groupedFaqs).map(([category, items]) => (
                    <section key={category}>
                        <h2 className="text-xl font-bold mb-4">{category}</h2>
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="bg-white/30 dark:bg-black/20 rounded-xl border border-white/20 dark:border-black/30 overflow-hidden">
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="w-full flex justify-between items-center text-left p-4 font-semibold"
                                    >
                                        <span>{item.question}</span>
                                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${openItemId === item.id ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`transition-all duration-300 ease-in-out grid ${openItemId === item.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                        <div className="overflow-hidden">
                                            <p className="p-4 pt-0 text-gray-600 dark:text-gray-400">{item.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default HelpFaqView;