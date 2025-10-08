import React, { useEffect } from 'react';
import { XMarkIcon } from './Icons';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <div 
            className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 bottom-0 right-[5px] h-full w-96 bg-dark-bg text-dark-text shadow-xl rounded-tl-2xl rounded-bl-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="relative h-full">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-white/10 transition-colors"
                        aria-label="Fermer le menu des paramètres"
                    >
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                    <div className="h-full overflow-y-auto pt-16 pb-8 px-4 sm:px-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Drawer;