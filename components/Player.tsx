

import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import { 
    ChevronLeftIcon, PlayIcon, 
    BookmarkIcon, BookmarkSolidIcon, CheckIcon,
    StarIcon, ClockIcon, UserGroupIcon, LockClosedIcon, ChevronDownIcon, ListBulletIcon
} from './Icons';
import { Lesson, Review } from '../types';
import DynamicIcon from './DynamicIcon';

const Player: React.FC = () => {
    const { 
        currentCourseId, navigateToGrid, favorites, toggleFavorite, 
        canAccessCourse, navigateToSubscription, subscriptionPlans,
        playLesson, userProgress, allReviews, addReview, user
    } = useAppContext();
    const { courses } = useCourses();
    const course = courses.find(c => c.id === currentCourseId);
    
    const [activeTab, setActiveTab] = useState('lessons');
    
    // Review form state
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    
    const initialExpandedSection = useMemo(() => {
        if (!course || course.sections.length === 0) return [];
        return [course.sections[0].id];
    }, [course]);

    const [expandedSections, setExpandedSections] = useState<string[]>(initialExpandedSection);
    
    useEffect(() => {
        if(course && course.sections.length > 0 && expandedSections.length === 0) {
            setExpandedSections([course.sections[0].id]);
        }
    }, [course, expandedSections]);

    const hasCourseAccess = useMemo(() => course ? canAccessCourse(course.requiredPlan) : true, [course, canAccessCourse]);
    
    const approvedReviews = useMemo(() => {
        if (!course) return [];
        return allReviews.filter(r => r.courseId === course.id && r.status === 'Approuvé');
    }, [allReviews, course]);

    const hasUserReviewed = useMemo(() => {
        if (!course) return false;
        return allReviews.some(r => r.courseId === course.id && r.authorId === user.id);
    }, [allReviews, course, user.id]);
    
    const canSubmitReview = useMemo(() => {
        if (!course) return false;
        const progress = userProgress[course.id];
        return progress && progress.completedLessons.size > 0;
    }, [userProgress, course]);


    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-8">
                <p>Cours non trouvé.</p>
                <button onClick={navigateToGrid} className="mt-4 text-accent">Retour à l'accueil</button>
            </div>
        );
    }

    const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
    const totalDurationMinutes = Math.round(course.sections.reduce((total, section) => total + section.lessons.reduce((secTotal, lesson) => secTotal + lesson.duration, 0), 0) / 60);
    const isFavorite = favorites.includes(course.id);
    
    const handlePlayLesson = (lesson: Lesson) => {
        if (course) {
            playLesson(lesson, course);
        }
    };
        
    const TabButton: React.FC<{tabName: string, label: string}> = ({ tabName, label }) => (
        <button
          onClick={() => setActiveTab(tabName)}
          className={`pb-3 font-semibold transition-colors duration-300 ${
            activeTab === tabName
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
          }`}
        >
          {label}
        </button>
      );

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => 
            prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
        );
    };
    
    const plan = useMemo(() => course ? subscriptionPlans.find(p => p.id === course.requiredPlan) : null, [course, subscriptionPlans]);
    const planName = plan?.name.fr || '';
    const showNag = !hasCourseAccess && course.requiredPlan !== 'free';

    const courseProgress = userProgress[course.id];
    const completedLessonsCount = courseProgress ? courseProgress.completedLessons.size : 0;
    const progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
    
    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating > 0 && newComment.trim() !== '') {
            addReview({
                courseId: course.id,
                courseTitle: course.title,
                rating: newRating,
                comment: newComment,
            });
            setReviewSubmitted(true);
        } else {
            alert('Veuillez laisser une note et un commentaire.');
        }
    };

    const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg">
            <div className="flex items-start gap-3">
                <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-grow">
                    <p className="font-semibold">{review.author}</p>
                    <div className="flex items-center my-1">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} />)}
                    </div>
                </div>
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mt-2 ml-12">"{review.comment}"</p>
        </div>
    );
    

    return (
        <div className={`transition-all duration-300 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8`}>
             {/* Header Section */}
             <div className="relative h-72">
                <img src={course.image.url} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-light-bg via-light-bg/80 to-transparent dark:from-dark-bg dark:via-dark-bg/80"></div>
                <div className="absolute top-10 left-4 z-10">
                    <button onClick={navigateToGrid} className="p-2 rounded-full bg-black/30 text-white backdrop-blur-sm">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="absolute top-10 right-4 z-10 flex gap-2">
                     <button onClick={() => toggleFavorite(course.id)} className="p-2 rounded-full bg-black/30 text-white backdrop-blur-sm">
                        {isFavorite ? <BookmarkSolidIcon className="w-6 h-6" /> : <BookmarkIcon className="w-6 h-6" />}
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h1 className="text-3xl font-elsie font-bold">{course.title}</h1>
                    <div className="flex justify-center items-center gap-4 text-sm mt-2 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-gray-400" /> {course.rating}</div>
                        <div className="flex items-center gap-1"><UserGroupIcon className="w-4 h-4" /> {course.studentCount.toLocaleString('fr-FR')}</div>
                        <div className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {totalDurationMinutes} min</div>
                        <div className="flex items-center gap-1"><ListBulletIcon className="w-4 h-4" /> {totalLessons} leçons</div>
                    </div>
                     <button onClick={() => handlePlayLesson(course.sections[0].lessons[0])} className="mt-4 bg-accent text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-accent/90 transition-colors">
                        Commencer le cours
                    </button>
                </div>
             </div>
             
             {progress > 0 && (
                <div className="w-full h-1.5 bg-black/20" title={`Complété à ${progress}%`}>
                    <div 
                        className="h-1.5 bg-accent rounded-r-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}

             {/* Tab Navigation */}
             <div className="sticky top-20 bg-light-bg dark:bg-dark-bg z-10 border-b border-black/10 dark:border-white/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex space-x-6">
                        <TabButton tabName="about" label="À propos" />
                        <TabButton tabName="lessons" label="Leçons" />
                        <TabButton tabName="reviews" label="Avis" />
                    </div>
                </div>
             </div>

             {/* Tab Content */}
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                {activeTab === 'about' && <div className="animate-fade-in space-y-2"><p>{course.about || course.description}</p></div>}
                {activeTab === 'lessons' && <div className="animate-fade-in space-y-3">
                    {course.sections.map((section, sectionIdx) => {
                        const isExpanded = expandedSections.includes(section.id);
                        return (
                            <div key={section.id} className="bg-white/30 dark:bg-dark-card rounded-xl border border-white/20 dark:border-transparent overflow-hidden">
                                <button onClick={() => toggleSection(section.id)} className="w-full p-4 flex justify-between items-center text-left">
                                    <h3 className="font-bold">{section.title}</h3>
                                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                                {isExpanded && <ul className="px-4 pb-2">
                                    {section.lessons.map((lesson, lessonIdx) => {
                                        const isAccessible = hasCourseAccess || !lesson.isLocked;
                                        const isCompleted = courseProgress?.completedLessons.has(lesson.id);
                                        return (
                                            <li key={lesson.id} onClick={isAccessible ? () => handlePlayLesson(lesson) : () => navigateToSubscription()} 
                                                className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${!isAccessible ? 'opacity-60' : 'cursor-pointer'} hover:bg-black/5 dark:hover:bg-white/5`}>
                                                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                                    <span className="text-gray-500 font-mono text-sm">{String(lessonIdx+1).padStart(2,'0')}</span>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold truncate">{lesson.title}</p>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                            <ClockIcon className="w-3 h-3"/><span>{Math.round(lesson.duration/60)} min</span>
                                                            {isCompleted && <span title="Terminé"><CheckIcon className="w-4 h-4 text-green-500" /></span>}
                                                            {!isAccessible && (
                                                                <span className="flex items-center gap-1">
                                                                    {plan?.icon && <DynamicIcon icon={plan.icon} className="w-3 h-3 text-yellow-500" />}
                                                                    {planName} requis
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isAccessible ? 
                                                    <button className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-accent/80 text-white hover:bg-accent transition-colors"><PlayIcon className="w-5 h-5 pl-0.5"/></button> 
                                                    : <LockClosedIcon className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400"/>}
                                            </li>
                                        );
                                    })}
                                </ul>}
                            </div>
                        );
                    })}
                </div>}
                {activeTab === 'reviews' && (
                    <div className="animate-fade-in space-y-6">
                        {canSubmitReview && !hasUserReviewed && !reviewSubmitted && (
                             <form onSubmit={handleReviewSubmit} className="bg-white/30 dark:bg-dark-card p-4 rounded-xl border border-white/20 dark:border-transparent space-y-3">
                                <h3 className="font-bold">Laissez votre avis</h3>
                                <div className="flex items-center justify-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setNewRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
                                            className="focus:outline-none"
                                        >
                                            <StarIcon 
                                                className={`w-8 h-8 cursor-pointer transition-colors ${star <= (hoverRating || newRating) ? 'text-yellow-400' : 'text-gray-400'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} placeholder="Dites-nous ce que vous avez pensé de ce cours..." className="w-full bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                                <button type="submit" className="w-full bg-accent text-white font-semibold py-2 rounded-lg hover:bg-accent/90">Envoyer</button>
                            </form>
                        )}
                        {(hasUserReviewed || reviewSubmitted) && (
                            <div className="text-center p-4 bg-green-500/10 text-green-700 dark:text-green-300 rounded-xl">
                                <p className="font-semibold">Merci pour votre avis !</p>
                                <p className="text-sm">Il sera visible après modération.</p>
                            </div>
                        )}
                        {approvedReviews.length > 0 ? (
                            <div className="space-y-4">
                                {approvedReviews.map(review => <ReviewCard key={review.id} review={review} />)}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-white/20 dark:bg-black/10 rounded-xl"><p>Les avis ne sont pas encore disponibles.</p></div>
                        )}
                    </div>
                )}
             </div>
             {showNag && (
                <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 z-30 px-4 pb-2 lg:px-0 lg:pb-0 pointer-events-none animate-fade-in">
                    <div className="lg:w-full lg:max-w-3xl lg:mx-auto lg:px-8 lg:pb-4">
                        <button
                            onClick={navigateToSubscription}
                            className="w-full bg-accent text-white p-2 rounded-xl text-center shadow-lg hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg pointer-events-auto flex flex-col items-center"
                        >
                            <p className="font-bold text-sm">Abonnement</p>
                            <p className="text-xs">Abonnez-vous pour débloquer toutes les leçons de ce cours.</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Player;