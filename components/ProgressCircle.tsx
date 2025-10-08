import React from 'react';

const ProgressCircle: React.FC<{ progress: number }> = ({ progress }) => {
  const size = 70;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-[70px] h-[70px]">
        <svg
            height={size}
            width={size}
            className="-rotate-90"
        >
            <circle
                className="text-gray-300 dark:text-gray-600"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
            />
            <circle
                className="text-accent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
            />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-accent">
            {progress}%
        </span>
    </div>
  );
};

export default ProgressCircle;