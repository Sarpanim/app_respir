import React from 'react';
import AdminPageLayout from './AdminPageLayout';
import { StarIcon, CheckCircleIcon, TrashIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';
import { Review, ReviewStatus } from '../../types';

const AdminReviewsSupport: React.FC = () => {
    const { allReviews, updateReviewStatus, deleteReview, toggleReviewHomepageFeature } = useAppContext();

    const handleApprove = (reviewId: string) => {
        updateReviewStatus(reviewId, 'Approuvé');
    };

    const handleDelete = (reviewId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
            deleteReview(reviewId);
        }
    };
    
    const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
        const statusBadge = review.status === 'Approuvé' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            
        return (
            <li className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                        <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-grow">
                            <p className="font-semibold">{review.author}</p>
                            <div className="flex items-center my-1">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} />)}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{review.comment}"</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Pour le cours : <span className="font-semibold">{review.courseTitle}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                         <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 inline-block ${statusBadge}`}>{review.status}</span>
                        <div className="flex items-center gap-2 mt-1">
                            {review.status === 'En attente' && (
                                 <button onClick={() => handleApprove(review.id)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Approuver">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                </button>
                            )}
                            <button onClick={() => handleDelete(review.id)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full" title="Supprimer">
                                <TrashIcon className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
                 {review.status === 'Approuvé' && (
                    <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                        <label htmlFor={`featured-${review.id}`} className="text-sm font-medium">Afficher sur l'accueil</label>
                        <button
                            id={`featured-${review.id}`}
                            onClick={() => toggleReviewHomepageFeature(review.id)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${review.featuredOnHomepage ? 'bg-accent' : 'bg-gray-400'}`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${review.featuredOnHomepage ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                )}
            </li>
        );
    }

    return (
        <AdminPageLayout title="Gestion des Avis & Commentaires">
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-black/30">
                {allReviews.length > 0 ? (
                    <ul className="space-y-4">
                        {allReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">Aucun avis pour le moment.</p>
                )}
            </div>
        </AdminPageLayout>
    );
};

export default AdminReviewsSupport;