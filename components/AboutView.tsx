import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from './Icons';

const AboutView: React.FC = () => {
    const { toggleSettings, generalSettings, aboutPageContent } = useAppContext();

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={toggleSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">À propos de RESPIR</h1>
            </header>

            <div className="bg-white/30 dark:bg-dark-card p-6 rounded-2xl border border-white/20 dark:border-transparent space-y-8">
                <div className="flex flex-col items-center text-center">
                     <div
                        className={`bg-accent`}
                        style={{
                          height: `48px`,
                          width: `48px`,
                          maskImage: `url(${generalSettings.appLogo})`,
                          WebkitMaskImage: `url(${generalSettings.appLogo})`,
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                        }}
                        aria-label="Application logo"
                      ></div>
                    <div className="text-5xl font-elsie font-black text-accent mt-2">
                      RESPI<span className="[transform:scaleX(-1)] inline-block">R</span>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Votre compagnon pour la paix intérieure.</p>
                </div>

                <section>
                    <h2 className="text-xl font-elsie font-bold mb-3">Notre Mission</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {aboutPageContent.missionStatement}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-elsie font-bold mb-4">L'équipe derrière l'application</h2>
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        {aboutPageContent.teamMembers.map(member => (
                            <div key={member.id} className="text-center">
                                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-accent" />
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-xs text-gray-500">{member.title}</p>
                            </div>
                        ))}
                     </div>
                </section>
            </div>
             <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                <p>Version 1.0.0</p>
                <p>&copy; {new Date().getFullYear()} RESPIR. Tous droits réservés.</p>
            </footer>
        </div>
    );
};

export default AboutView;