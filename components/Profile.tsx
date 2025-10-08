import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import CourseProgressCard from './CourseProgressCard';
import CompactCourseCard from './CompactCourseCard';
import AmbienceCard from './AmbienceCard';
import { SparklesIcon, XMarkIcon } from './Icons';

const Profile: React.FC = () => {
    const { 
        userProgress, favorites, favoriteAmbienceIds, logout, 
        justSubscribedPlanId, clearJustSubscribed, subscriptionPlans,
        ambiences, user
    } = useAppContext();
    const { courses } = useCourses();
    const [activeTab, setActiveTab] = useState('courses');
    const [activeCourseTab, setActiveCourseTab] = useState('in-progress');

    const newPlan = justSubscribedPlanId ? subscriptionPlans.find(p => p.id === justSubscribedPlanId) : null;

    const inProgressCourses = courses.filter(course => {
        const progressData = userProgress[course.id];
        if (!progressData || progressData.completedLessons.size === 0) return false;
        const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
        return totalLessons > 0 && progressData.completedLessons.size < totalLessons;
    });

    const completedCourses = courses.filter(course => {
        const progressData = userProgress[course.id];
        if (!progressData) return false;
        const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
        return totalLessons > 0 && progressData.completedLessons.size === totalLessons;
    });

    const favoriteCourses = courses.filter(course => favorites.includes(course.id));
    const favoriteAmbience = ambiences.filter(ambience => favoriteAmbienceIds.includes(ambience.id));

    const MainTabButton: React.FC<{tabName: string, label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none ${
              activeTab === tabName
                ? 'bg-accent text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
        >
            {label}
        </button>
    );
    
    const CourseSubTabButton: React.FC<{tabName: string, label: string}> = ({ tabName, label }) => (
        <button
          onClick={() => setActiveCourseTab(tabName)}
          className={`pb-2 font-semibold transition-colors duration-300 ${
            activeCourseTab === tabName
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
          }`}
        >
          {label}
        </button>
      );

    return (
        <div className="animate-fade-in">
            {newPlan && (
                <div className="bg-accent/10 border border-accent rounded-2xl p-4 flex items-start gap-4 relative mb-8 animate-fade-in">
                    <SparklesIcon className="w-8 h-8 text-accent flex-shrink-0" />
                    <div>
                        <h2 className="text-lg font-elsie font-bold text-accent">Félicitations !</h2>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                            Vous êtes maintenant abonné(e) à la formule <strong>{newPlan.name.fr}</strong>. Explorez tous vos nouveaux avantages !
                        </p>
                    </div>
                    <button onClick={clearJustSubscribed} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-accent/20">
                        <XMarkIcon className="w-5 h-5 text-accent" />
                    </button>
                </div>
            )}
            <div className="flex flex-col items-center mb-8">
                <img
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-accent shadow-lg"
                    src={user.avatar}
                    alt="User Avatar"
                />
                <h1 className="text-3xl font-elsie font-bold">Mon Espace</h1>
                <p className="text-gray-600 dark:text-gray-400">Votre univers de bien-être</p>
            </div>
            
            <div className="mb-8 w-fit mx-auto bg-white/40 dark:bg-dark-card rounded-full p-1 flex items-center space-x-1">
                <MainTabButton tabName="courses" label="Mes Cours" />
                <MainTabButton tabName="favorites" label="Mes Favoris" />
                <MainTabButton tabName="ambiences" label="Mes Ambiances" />
            </div>

            <div>
                {activeTab === 'courses' && (
                    <section className="animate-fade-in">
                        <div className="flex space-x-6 border-b border-black/10 dark:border-white/10 mb-6">
                            <CourseSubTabButton tabName="in-progress" label="En cours" />
                            <CourseSubTabButton tabName="completed" label="Complétés" />
                        </div>
                        
                        {activeCourseTab === 'in-progress' && (
                            <div className="animate-fade-in">
                                {inProgressCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {inProgressCourses.map(course => (
                                            <CourseProgressCard key={course.id} course={course} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-black/10 p-8 rounded-2xl">
                                        Vous n'avez aucun cours en progression. Explorez nos cours pour commencer !
                                    </p>
                                )}
                            </div>
                        )}

                        {activeCourseTab === 'completed' && (
                            <div className="animate-fade-in">
                                {completedCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {completedCourses.map(course => (
                                            <CourseProgressCard key={course.id} course={course} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-black/10 p-8 rounded-2xl">
                                        Vous n'avez encore terminé aucun cours. Continuez votre parcours !
                                    </p>
                                )}
                            </div>
                        )}
                    </section>
                )}
                {activeTab === 'favorites' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-elsie font-bold mb-6">Cours Favoris</h2>
                        {favoriteCourses.length > 0 ? (
                            <div className="space-y-4">
                                {favoriteCourses.map(course => (
                                    <CompactCourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                             <p className="text-center text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-black/10 p-8 rounded-2xl">
                                Vous n'avez pas encore de favoris. Cliquez sur l'icône de signet pour en ajouter.
                            </p>
                        )}
                    </section>
                )}
                {activeTab === 'ambiences' && (
                    <section className="animate-fade-in">
                        <h2 className="text-2xl font-elsie font-bold mb-6">Ambiances Favorites</h2>
                         {favoriteAmbience.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {favoriteAmbience.map(ambience => (
                                    <AmbienceCard key={ambience.id} ambience={ambience} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-black/10 p-8 rounded-2xl">
                                Aucune ambiance favorite. Explorez notre sélection et sauvegardez vos préférées !
                            </p>
                        )}
                    </section>
                )}
            </div>
            <div className="mt-12 text-center">
                <button
                    onClick={logout}
                    className="bg-accent/80 hover:bg-accent text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
                >
                    Se déconnecter
                </button>
            </div>
        </div>
    );
};

export default Profile;