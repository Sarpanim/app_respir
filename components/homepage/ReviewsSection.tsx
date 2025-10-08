import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { StarIcon } from '../Icons';

const ReviewsSection: React.FC = () => {
    const { generalSettings, reviews: allReviews } = useAppContext();
    const { reviews: customReviews, animation, defaultTab } = generalSettings.homepageReviews;

    const [activeTab, setActiveTab] = useState(defaultTab);

    const courseReviews = React.useMemo(() => {
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

    const displayedReviews = activeTab === 'course' ? courseReviews : customReviews;

    return (
        <section className="py-12 md:py-20 bg-light-bg dark:bg-dark-bg">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-elsie font-bold text-center text-gray-800 dark:text-white mb-4">
                    Ce que nos utilisateurs en pensent
                </h2>
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center">
                        <button 
                            onClick={() => setActiveTab('custom')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'custom' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}
                        >
                            Avis
                        </button>
                        <button 
                            onClick={() => setActiveTab('course')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'course' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}
                        >
                            Avis sur les cours
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedReviews.map(review => (
                        <div key={review.id} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full object-cover mr-4" />
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">{review.author}</h4>
                                    <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;