
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { StarIcon } from '../Icons';
import { Review, HomepageReview } from '../../types';

const ReviewsSection: React.FC = () => {
    const { generalSettings, allReviews } = useAppContext();
    const { reviews: customReviews, animation } = generalSettings.homepageReviews;

    const courseReviews: HomepageReview[] = useMemo(() => {
        return allReviews
            .filter(review => review.status === 'Approuvé' && review.featuredOnHomepage)
            .map(review => ({
                id: review.id,
                author: review.author,
                avatar: review.avatar,
                rating: review.rating,
                comment: review.comment,
            }));
    }, [allReviews]);

    const activeReviews = [...customReviews, ...courseReviews];

    if (activeReviews.length === 0) {
        return null;
    }

    const displayReviews = animation.enabled && activeReviews.length > 0 ? [...activeReviews, ...activeReviews] : activeReviews;
    
    const animationStyle: React.CSSProperties = animation.enabled ? {
        animation: `scroll ${animation.speed || 40}s linear infinite`,
    } : {};

    return (
        <div className="space-y-6">
            {activeReviews.length > 0 ? (
                <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden group" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                    <div 
                        className="flex gap-6"
                        style={animation.enabled ? animationStyle : {}}
                    >
                        {displayReviews.map((review, index) => (
                            <div key={index} className="flex-shrink-0 w-80 bg-white/30 dark:bg-dark-card p-6 rounded-2xl border border-white/20 dark:border-transparent group-hover:[animation-play-state:paused]">
                                <div className="flex mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                    ))}
                                </div>
                                <p className="italic text-gray-700 dark:text-gray-300 h-24 overflow-y-auto scrollbar-hide">"{review.comment}"</p>
                                <div className="flex items-center justify-end gap-3 mt-4">
                                    <p className="font-bold">- {review.author}</p>
                                    {review.avatar && <img src={review.avatar} alt={review.author} className="w-8 h-8 rounded-full object-cover" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 bg-white/20 dark:bg-black/10 rounded-2xl">
                    <p className="text-gray-500 dark:text-gray-400">Aucun avis à afficher pour le moment.</p>
                </div>
            )}
        </div>
    );
};

export default ReviewsSection;
