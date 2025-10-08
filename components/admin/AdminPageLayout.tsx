import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeftIcon } from '../Icons';

interface AdminPageLayoutProps {
    title: React.ReactNode;
    children: React.ReactNode;
    showBackButton?: boolean;
    onBack?: () => void;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ title, children, showBackButton = true, onBack }) => {
    const { navigateToAdminDashboard } = useAppContext();
    
    const handleBack = onBack || navigateToAdminDashboard;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
             <header className="relative flex items-center justify-center mb-8">
                {showBackButton && (
                    <button onClick={handleBack} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-2xl font-elsie font-bold text-center">{title}</h1>
            </header>
            <div>
                {children}
            </div>
        </div>
    );
};

export default AdminPageLayout;