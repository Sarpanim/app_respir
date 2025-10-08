import React from 'react';
import { useAppContext } from '../../context/AppContext';

const QuoteSection: React.FC = () => {
    const { generalSettings } = useAppContext();
    const { homepageQuote } = generalSettings;

    return (
        <div className="text-center">
            <blockquote className="max-w-2xl mx-auto">
                <p className="text-xl sm:text-2xl font-elsie italic text-gray-700 dark:text-gray-300">
                    "{homepageQuote.text}"
                </p>
                <cite className="block font-semibold text-gray-500 dark:text-gray-400 mt-4 not-italic">
                    — {homepageQuote.author}
                </cite>
            </blockquote>
        </div>
    );
};

export default QuoteSection;
