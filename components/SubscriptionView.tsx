import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircleIcon, GiftIcon, ChevronLeftIcon } from './Icons';
import PaymentModal from './PaymentModal';
import { SubscriptionPlan, PromoCode } from '../types';

const SubscriptionView: React.FC = () => {
    const { subscriptionPlans, promoCodes, user, changeSubscription, navigateTo } = useAppContext();
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [isAnnual, setIsAnnual] = useState(false);
    const [promoCodeInput, setPromoCodeInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        if (plan.id !== user.plan) {
            setSelectedPlan(plan);
        }
    };

    const handleApplyPromo = () => {
        const now = new Date();
        const validPromo = promoCodes.find(code => {
            if (code.code.toLowerCase() !== promoCodeInput.toLowerCase()) return false;
            if (code.status !== 'active') return false;
            
            const startDate = code.startDate ? new Date(code.startDate) : null;
            const endDate = code.endDate ? new Date(code.endDate) : null;
            if (endDate) endDate.setHours(23, 59, 59, 999);

            if (startDate && now < startDate) return false;
            if (endDate && now > endDate) return false;

            const isUsageValid = code.usageLimit === null || (code.usageCount || 0) < code.usageLimit;
            if (!isUsageValid) return false;

            return true;
        });

        if (validPromo) {
            setAppliedPromo(validPromo);
        } else {
            alert("Code promo invalide ou expiré.");
            setAppliedPromo(null);
        }
    };

    const getPrice = (plan: SubscriptionPlan) => {
        let priceStr = isAnnual ? plan.priceAnnual : plan.price;
        let priceNum = parseFloat(priceStr.replace(/[^0-9,.]/g, '').replace(',', '.'));

        if (appliedPromo && (appliedPromo.applicablePlanIds === 'all' || appliedPromo.applicablePlanIds.includes(plan.id))) {
            if (appliedPromo.type === 'percentage') {
                priceNum *= (1 - appliedPromo.value / 100);
            } else {
                priceNum = Math.max(0, priceNum - appliedPromo.value);
            }
            return `${priceNum.toFixed(2).replace('.', ',')}€`;
        }
        return priceStr.split(' ')[0];
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={() => navigateTo('profile')} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Nos Abonnements</h1>
            </header>

            <div className="flex justify-center mb-8">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center">
                    <button onClick={() => setIsAnnual(false)} className={`px-6 py-2 rounded-full text-sm font-semibold ${!isAnnual ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>
                        Mensuel
                    </button>
                    <button onClick={() => setIsAnnual(true)} className={`px-6 py-2 rounded-full text-sm font-semibold ${isAnnual ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>
                        Annuel <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full ml-1">Économisez !</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.filter(p => p.isActive && p.id !== 'free').map(plan => (
                    <div key={plan.id} className={`p-6 rounded-2xl border-2 ${plan.isPopular ? 'border-accent' : 'border-gray-300 dark:border-gray-600'} bg-white/50 dark:bg-black/20 relative`}>
                        {plan.isPopular && <div className="absolute top-0 -translate-y-1/2 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</div>}
                        <h3 className="text-xl font-bold">{plan.name.fr}</h3>
                        <p className="text-gray-500 text-sm mt-1">{plan.description.fr}</p>
                        <div className="my-6">
                            <span className="text-4xl font-bold">{getPrice(plan)}</span>
                            <span className="text-gray-500">/{isAnnual ? 'an' : 'mois'}</span>
                        </div>
                        <ul className="space-y-3 text-sm">
                            {plan.features.fr.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleSelectPlan(plan)}
                            disabled={user.plan === plan.id}
                            className={`w-full mt-8 py-3 rounded-lg font-semibold ${user.plan === plan.id ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-accent text-white hover:bg-accent/90'}`}
                        >
                            {user.plan === plan.id ? 'Abonnement Actuel' : 'Choisir ce plan'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                    <GiftIcon className="w-5 h-5 text-accent" />
                    <input 
                        type="text"
                        placeholder="Code promo"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="flex-grow input-style"
                    />
                    <button onClick={handleApplyPromo} className="btn-secondary">Appliquer</button>
                </div>
                {appliedPromo && <p className="text-green-600 text-sm mt-2 text-center">Code "{appliedPromo.code}" appliqué !</p>}
            </div>

            {selectedPlan && (
                <PaymentModal 
                    plan={selectedPlan}
                    isAnnual={isAnnual}
                    promo={appliedPromo}
                    onClose={() => setSelectedPlan(null)}
                    onConfirm={() => {
                        changeSubscription(selectedPlan.id);
                        setSelectedPlan(null);
                    }}
                />
            )}
        </div>
    );
};

export default SubscriptionView;