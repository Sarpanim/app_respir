import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, CheckIcon, ChevronRightIcon, GiftIcon } from './Icons';
import { SubscriptionPlan } from '../types';
import PaymentModal from './PaymentModal';
import DynamicIcon from './DynamicIcon';

const SubscriptionView: React.FC = () => {
    const { subscriptionPlan, changeSubscription, navigateToSettings, subscriptionPlans, navigateToPrivacyPolicy, generalSettings, promoCodes } = useAppContext();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<{ plan: SubscriptionPlan, isAnnual: boolean } | null>(null);

    const handleOpenPaymentModal = (plan: SubscriptionPlan, isAnnual: boolean) => {
        if (plan.id === 'free') return;
        if (plan.id === subscriptionPlan) return; 

        setSelectedPlanForPayment({ plan, isAnnual });
        setIsPaymentModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedPlanForPayment(null);
    };
    
    const handleSubscriptionSuccess = (planId: SubscriptionPlan['id']) => {
        changeSubscription(planId);
        handleClosePaymentModal();
    }
    
    const SubscriptionCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => {
        const [isAnnual, setIsAnnual] = useState(generalSettings.defaultSubscriptionCycle === 'annual');
        const isCurrentPlan = plan.id === subscriptionPlan;

        const applicablePromo = useMemo(() => {
            if (!promoCodes) return null;
            const now = new Date();
            // Find the first valid promo code that applies to this plan
            return promoCodes.find(code => {
                const isActive = code.status === 'active';
                const startDate = new Date(code.startDate);
                const endDate = new Date(code.endDate);
                endDate.setHours(23, 59, 59, 999);

                const isDateValid = startDate <= now && endDate >= now;
                const isUsageValid = code.usageLimit === null || code.usageCount < code.usageLimit;
                const appliesToPlan = plan.id !== 'free' && (code.applicablePlanIds === 'all' || (Array.isArray(code.applicablePlanIds) && code.applicablePlanIds.includes(plan.id)));
                
                return isActive && isDateValid && isUsageValid && appliesToPlan;
            });
        }, [promoCodes, plan.id]);

        const parsePrice = (priceString: string): number => {
            if (!priceString) return 0;
            const match = priceString.match(/(\d+[,.]\d+)/);
            return match ? parseFloat(match[0].replace(',', '.')) : 0;
        };

        const calculateDiscountedPrice = (price: number, promo: typeof applicablePromo): number => {
            if (!promo) return price;
            if (promo.type === 'percentage') {
                return price * (1 - promo.value / 100);
            }
            if (promo.type === 'fixed') {
                return Math.max(0, price - promo.value);
            }
            return price;
        };

        const formatPrice = (price: number): string => {
            return price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€';
        };

        const originalMonthlyPriceValue = parsePrice(plan.price);
        const originalAnnualPriceValue = parsePrice(plan.priceAnnual);
    
        const discountedMonthlyPriceValue = calculateDiscountedPrice(originalMonthlyPriceValue, applicablePromo);
        const discountedAnnualPriceValue = calculateDiscountedPrice(originalAnnualPriceValue, applicablePromo);

        const originalPriceString = isAnnual ? plan.priceAnnual : plan.price;
        const originalPriceValue = isAnnual ? originalAnnualPriceValue : originalMonthlyPriceValue;
        const discountedPriceValue = isAnnual ? discountedAnnualPriceValue : discountedMonthlyPriceValue;

        const hasDiscount = applicablePromo && discountedPriceValue < originalPriceValue;

        const periodMatch = originalPriceString.match(/\s*(\/.*)/);
        const period = periodMatch ? periodMatch[1].trim() : '';
        
        const valueMatch = originalPriceString.match(/[\d,.]+[€$]/);
        const originalDisplayPrice = valueMatch ? valueMatch[0] : originalPriceString;
        const discountedDisplayPrice = hasDiscount ? formatPrice(discountedPriceValue) : null;
        
        const ctaText = isCurrentPlan 
            ? "Votre formule" 
            : `S'abonner pour ${discountedDisplayPrice || originalDisplayPrice} ${period}`;

        let savings = 0;
        if (hasDiscount) {
            if (isAnnual) {
                savings = originalAnnualPriceValue - discountedAnnualPriceValue;
            } else {
                const monthlySaving = originalMonthlyPriceValue - discountedMonthlyPriceValue;
                savings = monthlySaving * 12;
            }
        }

        const savingsTextParts = (plan.annualSavingsText?.fr || '').split('%s');

        const getFontClass = (font?: string) => {
            switch (font) {
                case 'Elsie':
                    return 'font-elsie';
                case 'Dancing Script':
                    return 'font-dancing-script';
                default:
                    return 'font-montserrat';
            }
        };

        return (
            <div className={`relative rounded-xl flex flex-col h-full w-full max-w-sm transition-all duration-300 ${plan.isPopular ? 'border-2 border-secondary shadow-2xl shadow-secondary/20' : 'border border-gray-700'}`}>
                {plan.isPopular && (
                    <div className="absolute -top-3 right-4 z-30 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Populaire
                    </div>
                )}
                {/* Overlapping Icon */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div 
                        className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border border-gray-700"
                        style={{ color: plan.iconColor || 'var(--color-accent)' }}
                    >
                        <DynamicIcon icon={plan.icon} className="w-6 h-6" />
                    </div>
                </div>
                
                {/* Top part */}
                <div className="relative bg-gray-900 pt-10 px-6 pb-8 rounded-t-xl flex flex-col flex-grow">
                    <h2 
                        className={`${plan.titleSize || 'text-xl'} font-bold text-center mb-2 flex-shrink-0 ${getFontClass(plan.titleFont)}`}
                        style={{ color: plan.titleColor || '#FFFFFF' }}
                    >
                        {plan.name.fr}
                    </h2>
                    
                    <div className="flex-grow flex flex-col justify-center">
                        <div className="text-gray-400 text-sm text-center space-y-1 my-4" style={{ transform: 'translateY(5px)'}}>
                            {plan.description.fr.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    </div>
                     <ul className="space-y-2 text-sm text-gray-300 text-left self-center max-w-xs mb-8">
                        {plan.features.fr.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <CheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mr-[3px] mt-0.5" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="absolute bottom-0 left-1 right-1 transform translate-y-1/2 z-10 px-4">
                        <div className="relative flex w-full bg-emerald-500 rounded-full p-1">
                            <div
                                className={`absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out ${
                                    isAnnual ? 'left-1/2 right-1 ml-0.5' : 'left-1 right-1/2 mr-0.5'
                                }`}
                            />
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`relative z-10 flex-1 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                                    !isAnnual ? 'text-black' : 'text-white'
                                }`}
                            >
                                Mensuel
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`relative z-10 flex-1 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                                    isAnnual ? 'text-black' : 'text-white'
                                }`}
                            >
                                Annuel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom part */}
                <div className="bg-gray-800 px-6 pb-6 pt-12 rounded-b-xl flex-grow flex flex-col">
                    <div>
                        <div className="text-center mb-2 flex min-h-[3.5rem] flex-col items-center justify-center">
                             {hasDiscount && applicablePromo && (
                                <div className="mb-2">
                                    <span className="font-semibold" style={{ color: applicablePromo.textColor || '#A0AEC0' }}>{applicablePromo.code}</span>{' '}
                                    <span className="text-accent font-bold">
                                        {applicablePromo.type === 'percentage' ? `-${applicablePromo.value}%` : `-${formatPrice(applicablePromo.value)}`}
                                    </span>
                                </div>
                            )}
                            {discountedDisplayPrice ? (
                                <div className="flex items-baseline gap-2">
                                    <s className="text-2xl font-bold text-gray-500">{originalDisplayPrice}</s>
                                    <span className="text-3xl font-bold text-white">{discountedDisplayPrice}</span>
                                    <span className="text-base text-gray-400">{period}</span>
                                </div>
                            ) : (
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-white">{originalDisplayPrice}</span>
                                    <span className="ml-1 text-base text-gray-400">{period}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="h-4 mb-6 text-xs text-center">
                           {hasDiscount && plan.showAnnualSavings && savingsTextParts.length === 2 && (
                                <p style={{ color: plan.annualSavingsTextColor || '#00A388' }}>
                                    {savingsTextParts[0]}
                                    <strong className="text-white">{formatPrice(savings)}</strong>
                                    {savingsTextParts[1]}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-auto">
                        <button 
                            onClick={() => handleOpenPaymentModal(plan, isAnnual)}
                            disabled={isCurrentPlan}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-full transition-all shadow-lg hover:shadow-xl disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {ctaText}
                        </button>

                        <p className="text-gray-500 text-xs text-center mt-4">
                            En continuant, vous acceptez nos{' '}
                            <button onClick={() => navigateToPrivacyPolicy()} className="text-accent hover:underline">Conditions Générales de Vente</button>.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="animate-fade-in max-w-5xl mx-auto">
                <header className="relative flex items-center justify-center my-8">
                    <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 
                      className="text-4xl sm:text-5xl font-bold"
                      style={{
                        fontFamily: generalSettings.subscriptionTitleFont === 'Dancing Script' ? '"Dancing Script", cursive' : '"Elsie", serif',
                        color: generalSettings.subscriptionTitleColor
                      }}
                    >
                        Abonnement
                    </h1>
                </header>

                <div className="p-4 pt-8">
                    <div className="flex justify-center flex-wrap gap-x-6 gap-y-12">
                        {subscriptionPlans.filter(p => p.isActive && p.id !== 'free').map(plan => (
                            <SubscriptionCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                </div>
            </div>
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                plan={selectedPlanForPayment?.plan ?? null}
                onSuccess={handleSubscriptionSuccess}
                isAnnual={selectedPlanForPayment?.isAnnual ?? true}
            />
        </>
    );
};

export default SubscriptionView;