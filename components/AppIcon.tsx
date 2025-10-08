import React from 'react';
import { 
  HomeIcon, 
  SparklesIcon, 
  UserIcon, 
  BookOpenIcon, 
  SoundWaveIcon, 
  HeartIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  CrownIcon,
  GridIcon, // Utilisation de GridIcon comme solution de repli pour CircleIcon qui n'est pas disponible
} from './Icons';

interface AppIconProps {
  name: string;
  className?: string;
}

const iconMap: { [key: string]: React.FC<any> } = {
  Home: HomeIcon,
  Sparkles: SparklesIcon,
  User: UserIcon,
  BookOpen: BookOpenIcon,
  SoundWave: SoundWaveIcon,
  Heart: HeartIcon,
  Cog6Tooth: Cog6ToothIcon,
  ArrowRightOnRectangle: ArrowRightOnRectangleIcon,
  Crown: CrownIcon,
  Grid: GridIcon,
  Default: SparklesIcon,
};

const AppIcon: React.FC<AppIconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name] || iconMap.Default;
  return <IconComponent className={className} />;
};

export default AppIcon;