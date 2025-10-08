import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from './Icons';

const PrivacyPolicyView: React.FC = () => {
    const { navigateToSettings, privacyPolicyContent } = useAppContext();

    const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-6">
            <h2 className="text-xl font-elsie font-bold mb-2">{title}</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                {children}
            </div>
        </section>
    );
    
    const renderContent = (content: string) => {
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 pl-4">{listItems}</ul>);
                listItems = [];
            }
        };

        lines.forEach((line, index) => {
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                listItems.push(<li key={`li-${index}`}>{line.trim().substring(2)}</li>);
            } else {
                flushList();
                if (line.trim() !== '') {
                    elements.push(<p key={`p-${index}`}>{line}</p>);
                }
            }
        });

        flushList();
        return elements;
    };


    return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
            <header className="relative flex items-center justify-center">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Politique de Confidentialité</h1>
            </header>

            <div className="bg-white/30 dark:bg-dark-card p-6 rounded-2xl border border-white/20 dark:border-transparent">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Dernière mise à jour : {new Date(privacyPolicyContent.lastUpdated).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>

                {privacyPolicyContent.sections.map(section => (
                    <Section key={section.id} title={section.title}>
                        {renderContent(section.content)}
                    </Section>
                ))}
            </div>
        </div>
    );
};

export default PrivacyPolicyView;