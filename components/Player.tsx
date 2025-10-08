import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import { ChevronLeftIcon, HeartIcon, StarIcon, ShareIcon, LockClosedIcon } from './Icons';
import { Review } from '../types';

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white/10 dark:bg-black/20 p-4 rounded-lg">
        <div className="flex items-center mb-2">
            <img src={review.avatar} alt={review.author} className="w-8 h-8 rounded-full mr-3" />
            <div>
                <p className="font-semibold">{review.author}</p>
                <div className="flex">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} />)}
                </div>
            </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
    </div>
);

const Player: React.FC = () => {
    const { 
        currentParams, navigateToGrid, isFavoriteCourse, toggleFavoriteCourse, 
        canAccessCourse, navigateToSubscription, subscriptionPlans,
        playLesson, userProgress, reviews, addReview, user
    } = useAppContext();
    const { courses } = useCourses();
    const [activeTab, setActiveTab] = useState('lessons');
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');

    const course = useMemo(() => courses.find(c => c.id === currentParams?.courseId), [courses, currentParams]);

    const approvedReviews = useMemo(() => {
        if (!course) return [];
        return reviews.filter((r: Review) => r.courseId === course.id && r.status === 'Approuvé');
    }, [reviews, course]);

    const userHasReviewed = useMemo(() => {
        if (!course) return false;
        return reviews.some((r: Review) => r.courseId === course.id && r.authorId === user.id);
    }, [reviews, course, user.id]);

    if (!course) {
        return (
            <div className="p-4">
                <p>Cours non trouvé.</p>
                <button onClick={navigateToGrid} className="mt-2 btn-primary">Retour à l'accueil</button>
            </div>
        );
    }

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userRating > 0 && userComment) {
            addReview({ courseId: course.id, courseTitle: course.title, rating: userRating, comment: userComment });
            setUserRating(0);
            setUserComment('');
        }
    };

    const isFavorite = isFavoriteCourse(course.id);
    const hasAccess = canAccessCourse(course.requiredPlan);
    const requiredPlanDetails = subscriptionPlans.find(p => p.id === course.requiredPlan);

    return (
        <div className="animate-fade-in">
            <div className="relative h-64">
                <img src={course.image.url} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                    <button onClick={navigateToGrid} className="p-2 bg-black/30 rounded-full text-white hover:bg-black/50">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h1 className="text-3xl font-elsie font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{course.title}</h1>
                    <p className="text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Par {course.mentor.name}</p>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-yellow-500" /><span>{course.rating.toFixed(1)} ({course.reviewCount} avis)</span></div>
                        <span>{course.studentCount.toLocaleString()} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => toggleFavoriteCourse(course.id)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                            <HeartIcon className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                            <ShareIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('lessons')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'lessons' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Leçons
                        </button>
                        <button onClick={() => setActiveTab('reviews')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Avis ({approvedReviews.length})
                        </button>
                    </nav>
                </div>

                {activeTab === 'lessons' && (
                    <div className="space-y-2">
                        {course.sections.map(section => (
                            <div key={section.id}>
                                <h3 className="font-bold mt-4 mb-2">{section.title}</h3>
                                {section.lessons.map(lesson => {
                                    const isCompleted = userProgress[course.id]?.completedLessons.has(lesson.id);
                                    const isLocked = lesson.isLocked && !hasAccess;
                                    return (
                                        <button 
                                            key={lesson.id}
                                            onClick={() => !isLocked && playLesson(lesson, course)}
                                            disabled={isLocked}
                                            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${isCompleted ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                {isLocked ? <LockClosedIcon className="w-5 h-5" /> : isCompleted ? '✓' : '▶'}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold">{lesson.title}</p>
                                                <p className="text-xs text-gray-500">{Math.floor(lesson.duration / 60)} min</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                        {!hasAccess && requiredPlanDetails && (
                            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                                <p className="font-semibold">Contenu exclusif</p>
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">Passez à l'abonnement <span className="font-bold">{requiredPlanDetails.name.fr}</span> pour débloquer toutes les leçons.</p>
                                <button onClick={navigateToSubscription} className="mt-3 btn-primary">Voir les abonnements</button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        <div className="space-y-4">
                            {approvedReviews.map((review: Review) => <ReviewCard key={review.id} review={review} />)}
                        </div>
                        {userHasReviewed ? (
                            <p className="mt-6 text-center text-sm text-gray-500">Vous avez déjà laissé un avis pour ce cours.</p>
                        ) : (
                            <form onSubmit={handleReviewSubmit} className="mt-6 p-4 bg-white/20 dark:bg-black/10 rounded-lg">
                                <h4 className="font-bold mb-2">Laisser un avis</h4>
                                <div className="flex items-center mb-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button key={star} type="button" onClick={() => setUserRating(star)}>
                                            <StarIcon className={`w-6 h-6 cursor-pointer ${star <= userRating ? 'text-yellow-400' : 'text-gray-400'}`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder="Votre commentaire..."
                                    className="w-full input-style"
                                    rows={3}
                                />
                                <button type="submit" className="mt-2 btn-primary">Envoyer</button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Player;