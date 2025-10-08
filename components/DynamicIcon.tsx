import React from 'react';
import * as Icons from './Icons';
import { AVAILABLE_ICONS } from '../constants';

export interface DynamicIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ icon, className, style }) => {
  if (!icon) return null;

  if (icon.startsWith('data:image/svg+xml')) {
    return (
      <div
        className={className}
        style={{
          ...style,
          maskImage: `url("${icon}")`,
          WebkitMaskImage: `url("${icon}")`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          backgroundColor: 'currentColor',
        }}
      />
    );
  }

  const IconComponent = AVAILABLE_ICONS[icon as keyof typeof AVAILABLE_ICONS] || Icons.SparklesIcon;

  return <IconComponent className={className} style={style} />;
};

export default DynamicIcon;