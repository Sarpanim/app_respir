

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, ChevronDownIcon } from './Icons';
import { FaqItem as FaqItemType } from '../types';

const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onToggle: () => void; }> = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className="border-b border-black/10 dark:border-white/10 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-semibold flex-1 pr-4">{question}</span>
                <ChevronDownIcon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-4 pt-0 text-gray-600 dark:text-gray-300">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

const HelpFaqView: React.FC = () => {
    const { navigateToSettings, faqItems } = useAppContext();
    const [openItemId, setOpenItemId] = useState<string | null>(faqItems.length > 0 ? faqItems[0].id : null);

    const groupedFaqs = useMemo(() => {
        return faqItems.reduce<Record<string, FaqItemType[]>>((acc, item) => {
            const category = item.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});
    }, [faqItems]);

    const handleToggle = (itemId: string) => {
        setOpenItemId(prevId => (prevId === itemId ? null : itemId));
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
            <header className="relative flex items-center justify-center">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Aide & FAQ</h1>
            </header>

            <div className="space-y-8">
                {Object.keys(groupedFaqs).map((category) => (
                    <section key={category}>
                        <h2 className="text-xl font-elsie font-bold mb-3">{category}</h2>
                        <div className="bg-white/30 dark:bg-dark-card rounded-2xl overflow-hidden border border-white/20 dark:border-transparent">
                            {groupedFaqs[category].map(item => (
                                <FaqItem
                                    key={item.id}
                                    question={item.question}
                                    answer={item.answer}
                                    isOpen={openItemId === item.id}
                                    onToggle={() => handleToggle(item.id)}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default HelpFaqView;