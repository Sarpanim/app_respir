import React from 'react';
import { 
    Category, Course, SubscriptionPlan, PromoCode, NavItem, FaqItem, 
    PrivacyPolicyContent, SettingsMenuItem, HomepageSection, MegaMenu,
    ThemeColors, DiscoverPageSettings, FooterSettings, HomepageQuote, 
    HomepageImageText, HomepageSlider, HomepageReviewsSettings,
    HomepageMentor, HomepageMentorsSettings, Review, Ambience, AmbienceCategory, AmbiencePageSettings,
    User, Invoice, EmailCampaign
} from './types';
import * as Icons from './components/Icons';

export const CATEGORIES: Category[] = [
    { id: 1, name: 'Méditation', image: 'https://picsum.photos/seed/meditation/400/300' },
    { id: 2, name: 'Sommeil', image: 'https://picsum.photos/seed/sleep/400/300' },
    { id: 3, name: 'Stress', image: 'https://picsum.photos/seed/stress/400/300' },
    { id: 4, name: 'Concentration', image: 'https://picsum.photos/seed/focus/400/300' },
    { id: 5, name: 'Yoga', image: 'https://picsum.photos/seed/yoga/400/300' },
];

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction à la Pleine Conscience',
    description: "Apprenez les bases de la méditation de pleine conscience pour réduire le stress et améliorer votre concentration.",
    image: { url: 'https://images.unsplash.com/photo-1506126613408-4e0e0f7c50e1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Person meditating', ratio: '16:9', position: 'center' },
    categoryId: 1,
    level: 'Débutant',
    requiredPlan: 'free',
    status: 'Publié',
    tags: ['stress', 'concentration', 'débutant'],
    sections: [
      { id: 's1-1', title: 'Les Fondamentaux', position: 1, lessons: [
        { id: 'l1-1-1', title: 'Comprendre la pleine conscience', duration: 300, audio: 'https://www.soundjay.com/human/heartbeat-01a.mp3', isLocked: false, position: 1 },
        { id: 'l1-1-2', title: 'Votre première méditation', duration: 600, audio: 'https://www.soundjay.com/human/heartbeat-02a.mp3', isLocked: false, position: 2 },
      ]},
      { id: 's1-2', title: 'Pratiques Quotidiennes', position: 2, lessons: [
        { id: 'l1-2-1', title: 'Méditation du matin', duration: 480, audio: 'https://www.soundjay.com/nature/rain-01.mp3', isLocked: true, position: 1 },
        { id: 'l1-2-2', title: 'Scan corporel', duration: 720, audio: 'https://www.soundjay.com/nature/ocean-wave-1.mp3', isLocked: true, position: 2 },
      ]}
    ],
    rating: 4.8, reviewCount: 120, studentCount: 1500, reviews: [],
    mentor: { name: 'Alice Dubois', avatar: 'https://i.pravatar.cc/150?u=mentor1', title: 'Experte en méditation' },
    createdAt: '2023-10-01T10:00:00Z',
    totalDuration: 35,
    lessonCount: 4,
  },
  {
    id: '2',
    title: 'Yoga Énergisant du Matin',
    description: 'Réveillez votre corps et votre esprit avec une séance de yoga dynamique conçue pour bien démarrer la journée.',
    image: { url: 'https://picsum.photos/seed/course2/400/300', alt: 'Yoga pose', ratio: '16:9', position: 'center' },
    categoryId: 5,
    level: 'Intermédiaire',
    requiredPlan: 'standard',
    status: 'Publié',
    tags: ['yoga', 'énergie', 'matin'],
    sections: [
      { id: 's2-1', title: 'Salutations au Soleil', position: 1, lessons: [
        { id: 'l2-1-1', title: 'Surya Namaskar A', duration: 900, audio: 'https://www.soundjay.com/nature/wind-1.mp3', isLocked: false, position: 1 },
        { id: 'l2-1-2', title: 'Surya Namaskar B', duration: 1200, audio: 'https://www.soundjay.com/nature/wind-chime-1.mp3', isLocked: true, position: 2 },
      ]}
    ],
    rating: 4.9, reviewCount: 85, studentCount: 950, reviews: [],
    mentor: { name: 'Bob Martin', avatar: 'https://i.pravatar.cc/150?u=mentor2', title: 'Professeur de Yoga' },
    createdAt: '2023-10-15T10:00:00Z',
    totalDuration: 35,
    lessonCount: 2,
  },
  // ... other courses with totalDuration and lessonCount
];

export const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    { 
        id: 'free', 
        name: {fr: 'Gratuit', en: 'Free', es: 'Gratis'}, 
        description: {fr: "Accès gratuit pour découvrir les bases de la méditation et commencer votre voyage vers la sérénité.", en: "Free access to discover the basics of meditation and start your journey to serenity.", es: "Acceso gratuito para descubrir los conceptos básicos de la meditación y comenzar tu viaje hacia la serenidad."},
        icon: 'StarIcon', 
        iconColor: '#00A388',
        price: '0€', 
        priceAnnual: '0€', 
        priceAnnualMonthlyEquivalent: '', 
        monthsOfferedAnnual: 0,
        features: {fr: ["Accès limité aux cours d'introduction"], en: ["Limited access to introduction courses"], es: ["Acceso limitado a los cursos de introducción"]}, 
        isActive: true, 
        userCount: 12345,
        titleFont: 'Montserrat',
        titleColor: '#FFFFFF',
        titleSize: 'text-xl',
        showAnnualSavings: false,
        annualSavingsText: { fr: '', en: '', es: '' },
        annualSavingsTextColor: '#00A388',
    },
    { 
        id: 'basic', 
        name: {fr: 'Essentiel', en: 'Essential', es: 'Esencial'},
        description: {fr: "L'essentiel pour une pratique régulière.\nBénéficiez de notre expériences sur la respiration la relaxation et la méditation.", en: "The essentials for a regular practice.", es: "Lo esencial para una práctica regular."},
        icon: 'CrownIcon', 
        iconColor: '#ffae00',
        price: '2,99€ / mois', 
        priceAnnual: '23,88€ / an', 
        priceAnnualMonthlyEquivalent: '1,99€/mois', 
        monthsOfferedAnnual: 2,
        features: {fr: ["Accès à tous les cours pour débutants", "Accès à toutes les ambiances sonores"], en: ["Access to all beginner courses", "Access to all ambiences"], es: ["Acceso a todos los cursos para principiantes", "Acceso a todos los ambientes sonoros"]}, 
        isActive: true, 
        isPopular: true, 
        userCount: 5678,
        titleFont: 'Dancing Script',
        titleColor: '#ffae00',
        titleSize: 'text-xl',
        showAnnualSavings: true,
        annualSavingsText: { fr: 'Soit une économie de %s pour une année.', en: 'Save %s for a year.', es: 'Ahorra %s por un año.' },
        annualSavingsTextColor: '#00A388',
    },
    { 
        id: 'standard', 
        name: {fr: 'Premium', en: 'Premium', es: 'Premium'},
        description: {fr: "L'expérience complète pour aller plus loin.", en: "The full experience to go further.", es: "La experiencia completa para ir más allá."},
        icon: 'CrownIcon', 
        iconColor: '#ffae00',
        price: '4,99€ / mois', 
        priceAnnual: '47,88€ / an', 
        priceAnnualMonthlyEquivalent: '3,99€/mois', 
        monthsOfferedAnnual: 2,
        features: {fr: ["Tous les avantages Essentiel", "Téléchargement hors ligne"], en: ["All Essential benefits", "Offline download"], es: ["Todos los beneficios de Esencial", "Descarga sin conexión"]}, 
        isActive: true, 
        isPopular: false, 
        userCount: 9876,
        titleFont: 'Dancing Script',
        titleColor: '#ffae00',
        titleSize: 'text-xl',
        showAnnualSavings: true,
        annualSavingsText: { fr: 'Soit une économie de %s pour une année.', en: 'Save %s for a year.', es: 'Ahorra %s por un año.' },
        annualSavingsTextColor: '#00A388',
    },
    { 
        id: 'premium', 
        name: {fr: 'Famille', en: 'Family', es: 'Familia'}, 
        description: {fr: "Partagez le bien-être avec vos proches. Jusqu'à 6 comptes pour toute la famille.", en: "Share well-being with your loved ones. Up to 6 accounts for the whole family.", es: "Comparte el bienestar con tus seres queridos. Hasta 6 cuentas para toda la familia."},
        icon: 'CrownIcon', 
        iconColor: '#ffae00',
        price: '19,99€ / mois', 
        priceAnnual: '119,99€ / an', 
        priceAnnualMonthlyEquivalent: '9,99€/mois', 
        monthsOfferedAnnual: 2,
        features: {fr: ["Tous les avantages Premium", "Programmes thématiques exclusifs", "Sessions avec nos experts"], en: ["All Premium benefits", "Exclusive programs", "Sessions with our experts"], es: ["Todos los beneficios de Premium", "Programas temáticos exclusivos", "Sesiones con nuestros expertos"]}, 
        isActive: false, 
        isPopular: false, 
        userCount: 2468,
        titleFont: 'Montserrat',
        titleColor: '#FFFFFF',
        titleSize: 'text-xl',
        showAnnualSavings: false,
        annualSavingsText: { fr: '', en: '', es: '' },
        annualSavingsTextColor: '#00A388',
    },
    { 
        id: 'test', 
        name: {fr: 'Test', en: 'Test', es: 'Prueba'}, 
        description: {fr: "Plan de test pour le développement.", en: "Test plan for development.", es: "Plan de prueba para desarrollo."},
        icon: 'BeakerIcon', 
        iconColor: '#00A388',
        price: '1,99€/mois', 
        priceAnnual: '19,99€/an', 
        priceAnnualMonthlyEquivalent: '1,66€/mois', 
        monthsOfferedAnnual: 2,
        features: {fr: ["Accès de test"], en: ["Test access"], es: ["Acceso de prueba"]}, 
        isActive: false, 
        userCount: 10,
        titleFont: 'Montserrat',
        titleColor: '#FFFFFF',
        titleSize: 'text-xl',
        showAnnualSavings: false,
        annualSavingsText: { fr: '', en: '', es: '' },
        annualSavingsTextColor: '#00A388',
    },
];

export const DEFAULT_PROMO_CODES: PromoCode[] = [
    { id: '1', code: 'WELCOME10', type: 'percentage', value: 10, status: 'inactive', usageCount: 50, usageLimit: 1000, startDate: '2023-01-01', endDate: '2024-12-31', applicablePlanIds: ['basic', 'standard'], textColor: '#A0AEC0' },
    { id: '2', code: 'SUMMER23', type: 'fixed', value: 5, status: 'inactive', usageCount: 200, usageLimit: 200, startDate: '2023-06-01', endDate: '2023-08-31', applicablePlanIds: ['standard', 'premium'], textColor: '#A0AEC0' },
    { id: '3', code: 'BLACK FRIDAY', type: 'percentage', value: 10, status: 'active', usageCount: 0, usageLimit: 100, startDate: '2024-01-01', endDate: '2025-12-31', applicablePlanIds: [], textColor: '#A0AEC0' },
];

export const DEFAULT_HEADER_NAV_ITEMS: NavItem[] = [
  { id: 'h1', label: 'Accueil', icon: 'HomeIcon', link: '/grid', position: 1, active: true },
  { id: 'h2', label: 'Découvrir', icon: 'SparklesIcon', link: '/discover', position: 2, active: true, hasMegaMenu: true },
  { id: 'h3', label: 'Ambiances', icon: 'SoundWaveIcon', link: '/ambience', position: 3, active: true },
  { id: 'h4', label: 'Profil', icon: 'UserIcon', link: '/profile', position: 4, active: true },
];

export const DEFAULT_MOBILE_NAV_ITEMS: NavItem[] = [
  { id: '1', label: 'Accueil', icon: 'HomeIcon', link: '/grid', position: 1, active: true },
  { id: '2', label: 'Découvrir', icon: 'SparklesIcon', link: '/discover', position: 2, active: true },
  { id: '3', label: 'Ambiances', icon: 'SoundWaveIcon', link: '/ambience', position: 3, active: true },
  { id: '4', label: 'Profil', icon: 'UserIcon', link: '/profile', position: 4, active: true },
];

export const DEFAULT_SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
    { id: 's1', label: 'Modifier le profil', icon: 'UserIcon', action: 'navigateToEditProfile', section: 'Compte', position: 1, active: true },
    { id: 's2', label: 'Gérer l\'abonnement', icon: 'CreditCardIcon', action: 'navigateToSubscription', section: 'Compte', position: 2, active: true },
    { id: 's3', label: 'Notifications', icon: 'BellIcon', action: 'navigateToNotifications', section: 'Application', position: 1, active: true },
    { id: 's4', label: 'Thème Sombre', icon: 'MoonIcon', action: null, section: 'Application', position: 2, active: true, isToggle: true },
    { id: 's5', label: 'Aide & FAQ', icon: 'QuestionMarkCircleIcon', action: 'navigateToHelpFaq', section: 'Support', position: 1, active: true },
    { id: 's6', label: 'Contacter le support', icon: 'EnvelopeIcon', action: 'navigateToContactSupport', section: 'Support', position: 2, active: true },
    { id: 's7', label: 'À propos', icon: 'InformationCircleIcon', action: 'navigateToAbout', section: 'Support', position: 3, active: true },
    { id: 's8', label: 'Politique de confidentialité', icon: 'ShieldCheckIcon', action: 'navigateToPrivacyPolicy', section: 'Support', position: 4, active: true },
    { id: 's9', label: 'Inviter un ami', icon: 'UserPlusIcon', action: 'navigateToInviteFriend', section: 'Social', position: 1, active: true },
];


export const AMBIENCE_CATEGORIES: AmbienceCategory[] = [
    { id: 1, name: 'Nature', image: { url: 'https://picsum.photos/seed/nature/200', alt: 'Nature', ratio: '1:1', position: 'center' } },
    { id: 2, name: 'Urbain', image: { url: 'https://picsum.photos/seed/city/200', alt: 'City', ratio: '1:1', position: 'center' } },
    { id: 3, name: 'ASMR', image: { url: 'https://picsum.photos/seed/asmr/200', alt: 'ASMR', ratio: '1:1', position: 'center' } },
];

export const AMBIENCE_SOUNDS: Ambience[] = [
    { id: 1, title: 'Pluie légère', image: { url: 'https://picsum.photos/seed/rain/200', alt: 'Rain', ratio: '16:9', position: 'center' }, audio: 'https://www.soundjay.com/nature/rain-07.mp3', duration: 1800, categoryId: 1, createdAt: '2023-11-10T10:00:00Z' },
    { id: 2, title: 'Feu de camp', image: { url: 'https://picsum.photos/seed/fire/400/200', alt: 'Fire', ratio: '16:9', position: 'center' }, audio: 'https://www.soundjay.com/nature/campfire-1.mp3', duration: 1800, categoryId: 1, createdAt: '2023-11-05T10:00:00Z' },
    { id: 3, title: 'Café Parisien', image: { url: 'https://picsum.photos/seed/cafe/400/200', alt: 'Cafe', ratio: '16:9', position: 'center' }, audio: 'https://www.soundjay.com/ambience/ambience-cafe-1.mp3', duration: 1800, categoryId: 2, createdAt: '2023-10-20T10:00:00Z' },
    { id: 4, title: 'Chuchotements', image: { url: 'https://picsum.photos/seed/whisper/400/200', alt: 'Whisper', ratio: '16:9', position: 'center' }, audio: 'https://www.soundjay.com/human/whisper-1.mp3', duration: 1800, categoryId: 3, createdAt: '2023-11-12T10:00:00Z' },
];

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
    { id: 'faq1', question: 'Comment annuler mon abonnement ?', answer: 'Vous pouvez annuler votre abonnement à tout moment depuis la section "Gérer l\'abonnement" de votre profil.', category: 'Abonnement' },
    { id: 'faq2', question: 'Puis-je télécharger les leçons ?', answer: 'Oui, avec un abonnement Standard ou Premium, vous pouvez télécharger les leçons pour une écoute hors ligne.', category: 'Général' },
    { id: 'faq3', question: 'Comment changer mon mot de passe ?', answer: 'Rendez-vous dans "Modifier le profil" puis "Gestion du compte" pour changer votre mot de passe.', category: 'Compte'},
];

export const DEFAULT_PRIVACY_POLICY: PrivacyPolicyContent = {
    lastUpdated: '2023-10-01',
    sections: [
        { id: 'priv1', title: 'Introduction', content: 'Cette politique de confidentialité explique comment RESPIR collecte, utilise et protège vos données personnelles.'},
        { id: 'priv2', title: 'Données collectées', content: 'Nous collectons :\n- Les informations de votre compte (nom, email).\n- Votre progression dans les cours.\n- Des données d\'utilisation anonymes.'}
    ]
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
    { id: 'h1', type: 'slider', title: 'Slider', position: 1, enabled: true, enabledFor: 'both' },
    { id: 'h2', type: 'new-releases', title: 'Nouveautés', position: 2, enabled: true, enabledFor: 'both' },
    { id: 'h3', type: 'category', title: 'Catégories', position: 3, enabled: true, enabledFor: 'both' },
    { id: 'h4', type: 'ambience', title: 'Ambiances', position: 4, enabled: false, enabledFor: 'both' },
    { id: 'h5', type: 'course-grid', title: 'Tous les cours', position: 5, enabled: true, enabledFor: 'both' },
    { id: 'h6', type: 'quote', title: 'Citation', position: 6, enabled: true, enabledFor: 'desktop' },
    { id: 'h7', type: 'image-text', title: 'Image & Texte', position: 7, enabled: true, enabledFor: 'both' },
    { id: 'h8', type: 'reviews', title: 'Avis', position: 8, enabled: true, enabledFor: 'both' },
    { id: 'h9', type: 'mentors', title: 'Nos Experts', position: 9, enabled: true, enabledFor: 'both' },
];

export const DEFAULT_MEGA_MENU: MegaMenu = {
    enabled: true,
    width: 'container',
    columns: [
        { id: 'mc1', title: 'Pour Débuter', links: [
            {id: 'ml1', text: 'Introduction', url: '/cours/introduction-a-la-pleine-conscience'}, 
            {id: 'ml2', text: 'Gestion du Stress', url: '/cours/gerer-lanxiete-par-la-meditation'}
        ] },
        { id: 'mc2', title: 'Thématiques', links: [
            {id: 'ml3', text: 'Sommeil', url: '/categorie/sommeil'}, 
            {id: 'ml4', text: 'Concentration', url: '/categorie/concentration'}
        ] }
    ],
    announcement: { 
        enabled: true, 
        title: 'Nouveau : Yoga Matinal', 
        description: 'Découvrez notre nouveau cours pour bien commencer la journée.', 
        image: {
            url: 'https://picsum.photos/seed/megamenu/200',
            ratio: '1:1',
            position: 'center'
        }, 
        url: '/cours/yoga-energisant-du-matin' 
    },
    footerLink: { enabled: true, text: 'Voir tous les cours', url: '/discover', icon: 'BookOpenIcon' }
};

export const DEFAULT_THEME_COLORS: ThemeColors = {
  'accent': '#00A388',
  'accent-light': '#00E0A0',
  'secondary': '#A259FF',
  'light-bg': '#F3F4F6',
  'dark-bg': '#191919',
  'dark-card': '#2C2C2E',
  'dark-text': '#E5E7EB',
  'card-title-light': '#1F2937',
  'card-text-light': '#4B5563',
  'card-title-dark': '#FFFFFF',
  'card-text-dark': '#D1D5DB',
  'header-bg-light': '#FFFFFF',
  'header-bg-dark': '#191919',
  'header-text-active': '#00A388',
  'header-text-hover': '#00A388',
  'header-text-inactive-light': '#6B7280',
  'header-text-inactive-dark': '#9CA3AF',
  'navbar-bg-light': '#FFFFFF',
  'navbar-bg-dark': '#191919',
  'navbar-text-active': '#00A388',
  'navbar-text-inactive-light': '#6B7280',
  'navbar-text-inactive-dark': '#9CA3AF',
  'social-email': '#6B7280',
  'social-facebook': '#1877F2',
};

export const DEFAULT_DISCOVER_PAGE_SETTINGS: DiscoverPageSettings = {
    sections: [
        { id: 'header', type: 'header', enabled: true },
        { id: 'categories', type: 'categories', enabled: true },
        { id: 'course-list', type: 'course-list', enabled: true },
        { id: 'quote', type: 'quote', enabled: true },
    ],
    header: {
        title: "Explorez votre potentiel",
        description: "Découvrez des cours, des méditations et des sons conçus pour vous aider à trouver l'équilibre et la paix intérieure.",
        textAlign: 'center',
        image: { url: 'https://picsum.photos/seed/discover-header/1200/400', position: 'background', ratio: '16:9', objectPosition: 'center' }
    },
    categories: {
        title: "Explorer par catégorie",
        items: CATEGORIES.map(c => ({ id: c.id, enabled: true })),
    },
    courseList: {
        title: "Mis en avant pour vous",
        featuredCourseIds: ['1', '3'],
    },
    quote: {
        text: "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur.",
        author: "Bouddha",
    }
};

export const DEFAULT_HOMEPAGE_IMAGE_TEXT: HomepageImageText = {
    title: 'Trouvez votre calme',
    description: 'Nos programmes sont conçus par des experts pour vous guider.',
    textAlign: 'left',
    image: { url: 'https://picsum.photos/seed/imgtext/600', position: 'right', ratio: '1:1', objectPosition: 'center' },
    button: {
        enabled: true,
        text: 'Découvrir nos programmes',
        url: '/discover'
    }
};

export const DEFAULT_AMBIENCE_PAGE_SETTINGS: AmbiencePageSettings = {
    categoryHoverEffectEnabled: true,
    categories: AMBIENCE_CATEGORIES.map(c => ({ id: c.id, name: c.name, image: c.image.url, enabled: true })),
    layout: 'list',
    gridCardRatio: '16:9',
    cardHoverEffectEnabled: true,
    allCategory: {
        enabled: true,
        icon: 'SoundWaveIcon',
    },
    gridColumns: 4,
    showNewReleases: true,
    newReleasesCount: 3,
    featuredSection: {
        ...DEFAULT_HOMEPAGE_IMAGE_TEXT,
        enabled: false,
    }
};

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
    layout: 4,
    tagline: 'Votre compagnon pour la paix intérieure.',
    columns: [
        { id: 'col2', title: 'Navigation', enabled: true, links: [
            { id: 'fl1', label: 'À Propos', action: 'navigateToAbout', position: 1 },
            { id: 'fl2', label: 'Aide & FAQ', action: 'navigateToHelpFaq', position: 2 },
        ]},
        { id: 'col3', title: 'Légal', enabled: true, links: [
            { id: 'fl3', label: 'Confidentialité', action: 'navigateToPrivacyPolicy', position: 1 },
            { id: 'fl4', label: 'Contact', action: 'navigateToContactSupport', position: 2 },
        ]}
    ],
    newsletterEnabled: true,
    newsletterTitle: 'Newsletter',
    newsletterDescription: 'Restez inspiré(e) avec nos dernières nouvelles.',
};

export const DEFAULT_HOMEPAGE_QUOTE: HomepageQuote = {
    text: "La méditation apporte la sagesse ; le manque de méditation laisse l'ignorance.",
    author: "Bouddha"
};

export const DEFAULT_HOMEPAGE_SLIDER: HomepageSlider = {
    enabled: true,
    slides: [
        { 
            id: 'slide1', 
            image: {
                url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Yoga pose',
                position: 'background',
                ratio: '16:9',
                objectPosition: 'center',
            },
            title: 'Nouveau : Yoga Énergisant', 
            subtitle: 'Commencez votre journée du bon pied.', 
            textAlign: 'left',
            button: {
                enabled: true,
                text: 'Découvrir',
                url: '/cours/yoga-energisant-du-matin',
            }
        }
    ]
};
export const DEFAULT_HOMEPAGE_SLIDER2: HomepageSlider = JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_SLIDER));
export const DEFAULT_HOMEPAGE_SLIDER3: HomepageSlider = JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_SLIDER));

export const DEFAULT_ALL_REVIEWS: Review[] = [
    { id: 'r1', author: 'Marie C.', authorId: 101, avatar: 'https://i.pravatar.cc/150?u=marie', rating: 5, comment: "Ce cours a changé ma façon de gérer le stress. Incroyable !", date: '2023-09-15', courseId: '1', courseTitle: 'Introduction à la Pleine Conscience', status: 'Approuvé', featuredOnHomepage: true },
    { id: 'r2', author: 'Julien L.', authorId: 102, avatar: 'https://i.pravatar.cc/150?u=julien', rating: 4, comment: "Très bon cours de yoga, parfait pour le matin.", date: '2023-09-20', courseId: '2', courseTitle: 'Yoga Énergisant du Matin', status: 'Approuvé' },
    { id: 'r3', author: 'Sophie D.', authorId: 103, avatar: 'https://i.pravatar.cc/150?u=sophie', rating: 5, comment: "J'adore cette application, elle est simple et efficace.", date: '2023-10-01', courseId: '1', courseTitle: 'Introduction à la Pleine Conscience', status: 'En attente' },
];

export const DEFAULT_HOMEPAGE_REVIEWS_SETTINGS: HomepageReviewsSettings = {
    defaultTab: 'course',
    animation: { enabled: true, speed: 40 },
    reviews: [
        { id: 'hr1', author: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex-custom', rating: 5, comment: 'Une application qui change la vie !' },
        { id: 'hr2', author: 'Chloé', avatar: 'https://i.pravatar.cc/150?u=chloe-custom', rating: 4, comment: 'Très relaxant après une longue journée.' }
    ]
};

export const DEFAULT_HOMEPAGE_MENTORS_SETTINGS: HomepageMentorsSettings = {
    mentors: [
        { id: 'm1', name: 'Alice Dubois', title: 'Experte en méditation', avatar: 'https://i.pravatar.cc/150?u=mentor1' },
        { id: 'm2', name: 'Bob Martin', title: 'Professeur de Yoga', avatar: 'https://i.pravatar.cc/150?u=mentor2' },
    ]
};

export const DEFAULT_USERS: User[] = [
    { id: 1, name: 'Alice Dubois', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=user1', plan: 'premium', registrationDate: '2023-01-15', lastLogin: '2024-05-20', status: 'Actif', lastDevice: 'Desktop', location: 'Paris, France', paymentHistory: [], subscriptionHistory: [], courseProgress: [], supportTickets: [], emailHistory: [] },
    { id: 2, name: 'Bob Martin', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=user2', plan: 'free', registrationDate: '2023-03-22', lastLogin: '2024-05-18', status: 'Actif', lastDevice: 'Mobile', location: 'Lyon, France', paymentHistory: [], subscriptionHistory: [], courseProgress: [], supportTickets: [], emailHistory: [] },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=user3', plan: 'standard', registrationDate: '2022-11-10', lastLogin: '2024-04-10', status: 'Banni', lastDevice: 'Mobile', location: 'Marseille, France', paymentHistory: [], subscriptionHistory: [], courseProgress: [], supportTickets: [], emailHistory: [] },
];

export const DEFAULT_INVOICES: Invoice[] = [
    { id: 'inv_12345', userName: 'Alice Dubois', userEmail: 'alice@example.com', date: '2024-05-01', amount: 47.88, status: 'Paid', items: [{id: 'sub1', description: 'Abonnement Premium (Annuel)', quantity: 1, price: 47.88}] },
    { id: 'inv_12346', userName: 'Charlie Brown', userEmail: 'charlie@example.com', date: '2024-05-10', amount: 4.99, status: 'Pending', items: [{id: 'sub2', description: 'Abonnement Standard (Mensuel)', quantity: 1, price: 4.99}] },
];

export const DEFAULT_EMAIL_CAMPAIGNS: EmailCampaign[] = [
    { id: 1, name: 'Lancement Été 2024', subject: '☀️ Préparez votre été avec nos nouveaux cours !', sendDate: '2024-06-01', status: 'Envoyé', recipientCount: 8500, openRate: 25.4, clickRate: 4.1, content: '<h1>Hello world</h1>', target: 'Tous' },
    { id: 2, name: 'Offre Spéciale Rentrée', subject: '🎒 -20% sur l\'abonnement Premium !', sendDate: '2024-09-01', status: 'Programmé', recipientCount: 12000, openRate: 0, clickRate: 0, content: '<h1>Hello world</h1>', target: 'Tous' },
];

// For DynamicIcon component
export const AVAILABLE_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
  ...Icons
};

export const PRO_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
  // In a real app, this could be a separate set of icons
  ...Icons
};

export const AVAILABLE_ROUTES = [
    { name: "Accueil", route: "grid" },
    { name: "Découvrir", route: "discover" },
    { name: "Ambiances", route: "ambience" },
    { name: "Profil", route: "profile" },
    { name: "Abonnement", route: "subscription" },
];

export const AVAILABLE_ACTIONS = [
    { name: 'Aucune', action: null },
    { name: 'Modifier Profil', action: 'navigateToEditProfile' },
    { name: 'Abonnement', action: 'navigateToSubscription' },
    { name: 'Notifications', action: 'navigateToNotifications' },
    { name: 'Aide & FAQ', action: 'navigateToHelpFaq' },
    { name: 'Contact', action: 'navigateToContactSupport' },
    { name: 'Confidentialité', action: 'navigateToPrivacyPolicy' },
    { name: 'À Propos', action: 'navigateToAbout' },
    { name: 'Inviter un ami', action: 'navigateToInviteFriend' },
    { name: 'URL Externe', action: 'external' },
];