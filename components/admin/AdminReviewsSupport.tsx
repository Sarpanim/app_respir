import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { StarIcon, CheckCircleIcon, TrashIcon } from '../Icons';
import { useAppContext } from '../../context/AppContext';
import { Review, ReviewStatus } from '../../types';

const AdminReviewsSupport: React.FC = () => {
    const { reviews, setReviews } = useAppContext();
    const [filter, setFilter] = useState<ReviewStatus>('En attente');

    const filteredReviews = reviews.filter((review: Review) => {
        if (filter === 'En attente') return review.status === 'En attente';
        if (filter === 'Approuvé') return review.status === 'Approuvé';
        if (filter === 'Rejeté') return review.status === 'Rejeté';
        return true;
    });

    const handleStatusChange = (id: string, status: ReviewStatus) => {
        setReviews(reviews.map((r: Review) => r.id === id ? { ...r, status } : r));
    };

    const deleteReview = (id: string) => {
        if (window.confirm("Supprimer cet avis définitivement ?")) {
            setReviews(reviews.filter((r: Review) => r.id !== id));
        }
    };

    return (
        <AdminPageLayout title="Gestion des Avis et du Support">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setFilter('En attente')}
                        className={`${filter === 'En attente' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        En attente
                    </button>
                    <button
                        onClick={() => setFilter('Approuvé')}
                        className={`${filter === 'Approuvé' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Approuvés
                    </button>
                    <button
                        onClick={() => setFilter('Rejeté')}
                        className={`${filter === 'Rejeté' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Rejetés
                    </button>
                </nav>
            </div>

            <div className="space-y-4">
                {filteredReviews.map((review: Review) => (
                    <div key={review.id} className="bg-white/30 dark:bg-black/20 p-4 rounded-lg shadow-sm border border-white/20 dark:border-black/30">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3">
                                    <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{review.author}</p>
                                        <p className="text-sm text-gray-500">{review.courseTitle}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {review.status === 'En attente' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStatusChange(review.id, 'Approuvé')} className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600">Approuver</button>
                                        <button onClick={() => handleStatusChange(review.id, 'Rejeté')} className="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Rejeter</button>
                                    </div>
                                )}
                                <button onClick={() => deleteReview(review.id)} className="p-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminPageLayout>
    );
};

export default AdminReviewsSupport;