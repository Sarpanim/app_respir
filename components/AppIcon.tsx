import React from 'react';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  SparklesIcon,
  SoundWaveIcon,
  CrownIcon,
  GridIcon, // Utilisation de GridIcon comme solution de repli pour CircleIcon qui n'est pas disponible
} from './Icons';

// Définit le mapping d'une chaîne d'utilisation à un composant d'icône.
const ICONS: { [key: string]: React.FC<{ className?: string }> } = {
  home: HomeIcon,
  profile: UserIcon,
  settings: Cog6ToothIcon,
  discover: SparklesIcon,
  ambience: SoundWaveIcon,
  subscription: CrownIcon,
};

// Définit les props pour le composant AppIcon.
interface AppIconProps {
  /** La clé de chaîne pour déterminer quelle icône afficher (par exemple, "home", "profile"). */
  usage: string;
  /** Classes CSS optionnelles à appliquer à l'icône. */
  className?: string;
}

/**
 * AppIcon est un composant qui affiche une icône basée sur une chaîne 'usage'.
 * Il utilise un mapping prédéfini pour sélectionner la bonne icône.
 * Si la prop 'usage' ne correspond à aucune clé dans le mapping, une icône de repli est affichée.
 *
 * @param {AppIconProps} props - Les props pour le composant.
 * @returns {JSX.Element} Le composant d'icône rendu.
 */
const AppIcon: React.FC<AppIconProps> = ({ usage, className }) => {
  // Recherche le composant d'icône dans le mapping, en utilisant GridIcon comme solution de repli si non trouvé.
  const IconComponent = ICONS[usage] || GridIcon;

  return <IconComponent className={className} />;
};

export default AppIcon;
