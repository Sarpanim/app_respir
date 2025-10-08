import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import { 
    Cog6ToothIcon, ArrowRightOnRectangleIcon, ChevronRightIcon,
    BookOpenIcon, ClockIcon, HeartIcon
} from './Icons';
import CourseProgressCard from './CourseProgressCard';

const Profile: React.FC = () => {
    const { 
        userProgress, isFavoriteCourse, favoriteAmbienceIds, logout, 
        justSubscribedPlanId, clearJustSubscribed, subscriptionPlans,
        user, navigateTo, toggleSettings
    } = useAppContext();
    const { courses } = useCourses();

    useEffect(() => {
        if (justSubscribedPlanId) {
            // Show a confirmation message, maybe with a toast
            console.log(`Subscribed to ${justSubscribedPlanId}`);
            const timer = setTimeout(() => clearJustSubscribed(), 5000);
            return () => clearTimeout(timer);
        }
    }, [justSubscribedPlanId, clearJustSubscribed]);

    const favoriteCourses = courses.filter(course => isFavoriteCourse(course.id));
    const currentPlan = subscriptionPlans.find(p => p.id === user.plan);

    return (
        <div className="animate-fade-in">
            <div className="p-6 bg-gradient-to-br from-accent to-accent-light dark:from-dark-card dark:to-dark-bg rounded-b-3xl">
                <div className="flex justify-end">
                    <button onClick={toggleSettings} className="p-2 rounded-full text-white/80 hover:bg-white/20"><Cog6ToothIcon className="w-6 h-6" /></button>
                    <button onClick={logout} className="p-2 rounded-full text-white/80 hover:bg-white/20"><ArrowRightOnRectangleIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex flex-col items-center mt-2">
                    <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white/50" />
                    <h2 className="text-2xl font-bold text-white mt-3">{user.name}</h2>
                    <p className="text-white/80">{user.email}</p>
                    {currentPlan && (
                        <div className="mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {currentPlan.name.fr}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-6">
                <section>
                    <h3 className="font-bold text-lg mb-3">Mes cours en cours</h3>
                    <div className="space-y-3">
                        {Object.keys(userProgress).map(courseId => {
                            const course = courses.find(c => c.id === courseId);
                            if (!course) return null;
                            const progressData = userProgress[courseId];
                            const completedCount = progressData?.completedLessons.size || 0;
                            const totalLessons = course.lessonCount;
                            if (completedCount === totalLessons) return null; // Don't show completed courses here
                            return <CourseProgressCard key={courseId} course={course} />;
                        })}
                    </div>
                </section>

                <section>
                    <h3 className="font-bold text-lg mb-3">Mes favoris</h3>
                    <div className="space-y-3">
                        {favoriteCourses.map(course => (
                            <div key={course.id} onClick={() => navigateTo('player', { courseId: course.id })} className="flex items-center gap-3 p-3 bg-white/30 dark:bg-black/20 rounded-xl cursor-pointer">
                                <img src={course.image.url} alt={course.image.alt} className="w-12 h-12 rounded-lg object-cover" />
                                <p className="font-semibold flex-grow">{course.title}</p>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;