import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../types';
import { XMarkIcon, CheckIcon, CreditCardIcon } from './Icons';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: SubscriptionPlan | null;
    onSuccess: (planId: SubscriptionPlan['id']) => void;
    isAnnual: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan, onSuccess, isAnnual }) => {
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setPaymentStatus('idle'); // Reset on open
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    
    if (!plan) return null;

    const handlePayment = () => {
        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
                onSuccess(plan.id);
            }, 1500); // Wait a bit on success message
        }, 2000); // Simulate network request
    };

    const price = isAnnual ? plan.priceAnnual : plan.price;
    const period = isAnnual ? '/an' : '/mois';

    return (
        <div 
            className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal Panel */}
            <div
                className={`fixed bottom-0 left-0 right-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-4 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0 sm:scale-100 sm:opacity-100' : 'translate-y-full sm:scale-95 sm:opacity-0'}`}
            >
                <div className="relative bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-dark-text shadow-2xl rounded-t-2xl sm:rounded-2xl w-full max-w-md mx-auto overflow-hidden">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        aria-label="Fermer"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    
                    <div className="p-6 sm:p-8">
                        {paymentStatus === 'success' ? (
                            <div className="text-center py-12 flex flex-col items-center justify-center animate-fade-in">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                    <CheckIcon className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-elsie font-bold">Paiement réussi !</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Bienvenue dans votre nouvel abonnement.</p>
                            </div>
                        ) : (
                        <>
                            <h2 className="text-2xl font-elsie font-bold text-center mb-2">Confirmer l'abonnement</h2>
                            <div className="text-center bg-accent/5 dark:bg-accent/10 p-3 rounded-lg mb-6">
                                <p className="font-semibold text-accent">{plan.name.fr}</p>
                                <p className="text-3xl font-bold">{price.replace('/mois', '')}<span className="text-base font-normal text-gray-500">{period}</span></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Informations de paiement</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium">Numéro de carte</label>
                                        <div className="relative">
                                            <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                            <input type="tel" placeholder="0000 0000 0000 0000" className="w-full bg-white/50 dark:bg-black/20 p-2.5 pl-10 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium">Expiration (MM/AA)</label>
                                            <input type="text" placeholder="MM/AA" className="w-full bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium">CVC</label>
                                            <input type="text" placeholder="123" className="w-full bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handlePayment}
                                    disabled={paymentStatus === 'processing'}
                                    className="w-full bg-accent text-white font-bold py-3 px-4 rounded-full transition-colors hover:bg-accent/90 disabled:bg-accent/50 flex items-center justify-center"
                                >
                                    {paymentStatus === 'processing' ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Traitement...</span>
                                        </>
                                    ) : (
                                        `Payer ${price}`
                                    )}
                                </button>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Paiement sécurisé par Stripe.
                                </p>
                            </div>

                             {/* Placeholder for other payment methods */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-light-bg dark:bg-dark-bg px-2 text-sm text-gray-500">ou</span>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <p className="text-sm text-gray-500">Google Pay / Apple Pay (bientôt)</p>
                            </div>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;