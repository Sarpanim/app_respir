import React, { useState, useEffect } from 'react';

interface PromoToggleProps {
  initialActive: boolean;
  expired: boolean;
  onToggle: (newValue: boolean) => void;
}

const PromoToggle: React.FC<PromoToggleProps> = ({ initialActive, expired, onToggle }) => {
  const [isActive, setIsActive] = useState(initialActive);

  // Sync internal state with prop changes to ensure consistency
  useEffect(() => {
    setIsActive(initialActive);
  }, [initialActive]);

  const handleToggle = () => {
    if (expired) return;
    const newValue = !isActive;
    setIsActive(newValue); // Immediate visual feedback
    onToggle(newValue); // Notify parent component of the change
  };

  const bgColor = isActive ? 'bg-green-500' : 'bg-gray-400';
  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      onClick={handleToggle}
      disabled={expired}
      className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg focus:ring-accent ${bgColor} ${disabledClasses}`}
      aria-pressed={isActive}
      aria-label={isActive ? 'Désactiver le code promo' : 'Activer le code promo'}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
};

export default PromoToggle;
