import React from 'react';

// This file contains type definitions for the entire application.

export type Theme = 'light' | 'dark';

export type View =
  | 'grid'
  | 'player'
  | 'discover'
  | 'ambience'
  | 'profile'
  | 'subscription'
  | 'category-detail'
  | 'about'
  | 'admin'
  | 'edit-profile'
  | 'notifications'
  | 'help-faq'
  | 'contact-support'
  | 'privacy-policy'
  | 'invite-friend'
  | 'ambience-player'
  | 'player-view'
  | 'settings';

export type AdminView =
  | 'dashboard'
  | 'subscriptions'
  | 'invoices'
  | 'users'
  | 'courses'
  | 'ambiences'
  | 'categories'
  | 'ambienceCategories'
  | 'programs'
  | 'engagement'
  | 'demographics'
  | 'reviews'
  | 'tickets'
  | 'emailCampaigns'
  | 'featured'
  | 'promos'
  | 'roles'
  | 'config'
  | 'mobileNavManagement'
  | 'accountMenu'
  | 'logs'
  | 'aboutManagement'
  | 'faq'
  | 'privacyManagement'
  | 'themeColors'
  | 'discoverManagement'
  | 'headerMenuManagement'
  | 'footerManagement'
  | 'home'
  | 'homeSlider'
  | 'homeQuote'
  | 'homeImageText'
  | 'homeReviews'
  | 'homeMentors'
  | 'navigation'
  | 'siteMap'
  | 'ambienceDisplayManagement';


export interface ImageSettings {
  url: string;
  ratio: string;
  position: 'top' | 'center' | 'bottom';
  objectPosition?: 'top' | 'center' | 'bottom';
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in seconds
  audio: string;
  isLocked: boolean;
  content?: string;
  coverImage?: ImageSettings;
  attachments?: Attachment[];
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  author: string;
  authorId: number;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  courseId: string;
  courseTitle: string;
  status: ReviewStatus;
  featuredOnHomepage?: boolean;
}

export type ReviewStatus = 'En attente' | 'Approuvé';

export interface Mentor {
  name: string;
  avatar: string;
  title: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: ImageSettings;
  categoryId: number;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  requiredPlan: SubscriptionPlanId;
  status: 'Publié' | 'Brouillon';
  tags: string[];
  sections: Section[];
  rating: number;
  reviewCount: number;
  studentCount: number;
  reviews: Review[];
  mentor: Mentor;
  about?: string;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Ambience {
    id: number;
    title: string;
    image: ImageSettings;
    audio: string;
    duration: number; // seconds
    categoryId: number;
    createdAt?: string;
}

export interface AmbienceCategory {
    id: number;
    name: string;
    image: ImageSettings;
}

export type SubscriptionPlanId = 'free' | 'basic' | 'standard' | 'premium' | 'test';

export interface SubscriptionPlan {
    id: SubscriptionPlanId;
    name: { fr: string, en: string, es: string };
    description: { fr: string, en: string, es: string };
    icon: string;
    iconColor?: string;
    price: string;
    priceAnnual: string;
    priceAnnualMonthlyEquivalent: string;
    monthsOfferedAnnual: number;
    features: { fr: string[], en: string[], es: string[] };
    isActive: boolean;
    isPopular?: boolean;
    userCount: number;
    titleFont?: string;
    titleColor?: string;
    titleSize?: string;
    showAnnualSavings?: boolean;
    annualSavingsText?: { fr: string; en: string; es: string };
    annualSavingsTextColor?: string;
}

export interface PromoCode {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    status: 'active' | 'inactive';
    usageCount: number;
    usageLimit: number | null;
    startDate: string;
    endDate: string;
    applicablePlanIds: 'all' | SubscriptionPlanId[];
    textColor?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  link: string;
  position: number;
  active: boolean;
  hasMegaMenu?: boolean;
}

export type SettingsMenuAction = 
    | 'navigateToEditProfile'
    | 'navigateToSubscription'
    | 'navigateToNotifications'
    | 'navigateToHelpFaq'
    | 'navigateToContactSupport'
    | 'navigateToPrivacyPolicy'
    | 'navigateToAbout'
    | 'navigateToInviteFriend';
    
export interface SettingsMenuItem {
    id: string;
    label: string;
    icon: string;
    action: SettingsMenuAction | null;
    section: string;
    position: number;
    active: boolean;
    isToggle?: boolean;
}

export interface UserProgress {
  [courseId: string]: { completedLessons: Set<string> };
}

export interface PaymentHistory {
    date: string;
    amount: number;
    invoiceId: string;
}

export interface SubscriptionHistory {
    plan: SubscriptionPlanId;
    startDate: string;
    endDate: string | null;
}

export interface CourseProgress {
    courseId: string;
    title: string;
    progress: number;
}

export interface SupportTicket {
    ticketId: string;
    subject: string;
    status: 'Ouvert' | 'Fermé';
}

export interface EmailHistoryItem {
  id: string;
  subject: string;
  date: string;
  status: 'Envoyé' | 'Ouvert' | 'Cliqué' | 'Échoué';
}


export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  avatar: string;
  bio?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  plan: SubscriptionPlanId;
  registrationDate: string;
  lastLogin: string;
  status: 'Actif' | 'Banni';
  lastDevice: 'Mobile' | 'Desktop';
  location: string;
  paymentHistory: PaymentHistory[];
  subscriptionHistory: SubscriptionHistory[];
  courseProgress: CourseProgress[];
  supportTickets: SupportTicket[];
  emailHistory: EmailHistoryItem[];
  linkedAccounts?: {
      google?: boolean;
      facebook?: boolean;
      apple?: boolean;
  }
}

export interface ThemeColors {
  [key: string]: string;
}

export interface HomepageSection {
  id: string;
  type: 'new-releases' | 'category' | 'ambience' | 'course-grid' | 'quote' | 'slider' | 'slider2' | 'slider3' | 'image-text' | 'reviews' | 'mentors';
  title: string;
  position: number;
  enabled: boolean;
  enabledFor: 'mobile' | 'desktop' | 'both';
}

export interface MegaMenuLink {
    id: string;
    text: string;
    url: string;
}

export interface MegaMenuColumn {
    id: string;
    title: string;
    links: MegaMenuLink[];
}

export interface MegaMenu {
    enabled: boolean;
    width: 'container' | 'full';
    columns: MegaMenuColumn[];
    announcement: {
        enabled: boolean;
        title: string;
        description: string;
        image: {
            url: string;
            ratio: string;
            position: 'top' | 'center' | 'bottom';
        };
        url: string;
    };
    footerLink: {
        enabled: boolean;
        text: string;
        url: string;
        icon: string;
    }
}

export interface DiscoverCategoryItem {
    id: number;
    enabled: boolean;
}

export interface DiscoverPageSettings {
    sections: { id: string; type: 'header' | 'categories' | 'course-list' | 'quote'; enabled: boolean }[];
    header: {
        title: string;
        description: string;
        textAlign: 'left' | 'center' | 'right';
        image: {
            url: string;
            position: 'none' | 'left' | 'right' | 'background';
            ratio: string;
            objectPosition: 'top' | 'center' | 'bottom';
        }
    };
    categories: {
        title: string;
        items: DiscoverCategoryItem[];
    };
    courseList: {
        title: string;
        featuredCourseIds: string[];
        courseOrder?: string[];
    };
    quote: {
        text: string;
        author: string;
    };
}

export interface AmbienceCategorySetting {
    id: number;
    enabled: boolean;
}

export interface HomepageImageText {
    title: string;
    description: string;
    textAlign: 'left' | 'center' | 'right';
    image: {
        url: string;
        position: 'left' | 'right';
        ratio: string;
        objectPosition: 'top' | 'center' | 'bottom';
    }
    button?: {
        enabled: boolean;
        text: string;
        url: string;
    }
}

export interface AmbiencePageSettings {
    categoryHoverEffectEnabled: boolean;
    categories: AmbienceCategorySetting[];
    layout: 'list' | 'grid' | 'grid-presentation-2';
    gridCardRatio: '1:1' | '4:3' | '16:9' | '2:1';
    cardHoverEffectEnabled: boolean;
    allCategory: {
        enabled: boolean;
        icon: string;
    };
    gridColumns: number;
    showNewReleases: boolean;
    newReleasesCount: number;
    featuredSection: HomepageImageText & { enabled: boolean };
}

export interface FooterLink {
    id: string;
    label: string;
    action: SettingsMenuAction | null;
    url?: string;
    position: number;
}
export interface FooterColumn {
    id: 'col2' | 'col3';
    title: string;
    links: FooterLink[];
    enabled: boolean;
}

export interface FooterSettings {
    layout: 3 | 4;
    tagline: string;
    columns: FooterColumn[];
    newsletterEnabled: boolean;
    newsletterTitle: string;
    newsletterDescription: string;
}

export interface HomepageQuote {
    text: string;
    author: string;
}

export interface HomepageSlide {
    id: string;
    image: {
        url: string;
        position: 'left' | 'right' | 'background';
        ratio: string;
        objectPosition: 'top' | 'center' | 'bottom';
    };
    title: string;
    subtitle: string;
    textAlign: 'left' | 'center' | 'right';
    button: {
        enabled: boolean;
        text: string;
        url: string;
    };
}

export interface HomepageSlider {
    enabled: boolean;
    slides: HomepageSlide[];
}

export interface HomepageReview {
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    comment: string;
}
export interface HomepageReviewsSettings {
    defaultTab: 'custom' | 'course';
    animation: {
        enabled: boolean;
        speed: number;
    };
    reviews: HomepageReview[];
}

export interface HomepageMentor {
    id: string;
    name: string;
    title: string;
    avatar: string;
}

export interface HomepageMentorsSettings {
    mentors: HomepageMentor[];
}


export interface GeneralSettings {
  defaultLanguage: 'fr' | 'en' | 'es';
  defaultTheme: Theme;
  appLogo: string;
  appLogoSize: number;
  appLogoAlign: 'start' | 'center' | 'end';
  showUserCountOnPlans: boolean;
  showStudentCountOnCourses: boolean;
  cardShadowEnabled: boolean;
  navBlurEnabled: boolean;
  inviteRewardActive: boolean;
  inviteRewardTitle: string;
  inviteRewardDescription: string;
  homepageSections: HomepageSection[];
  megaMenu: MegaMenu;
  themeColors: ThemeColors;
  discoverPageSettings: DiscoverPageSettings;
  ambiencePageSettings: AmbiencePageSettings;
  footerSettings: FooterSettings;
  homepageQuote: HomepageQuote;
  homepageImageText: HomepageImageText;
  homepageSlider: HomepageSlider;
  homepageSlider2: HomepageSlider;
  homepageSlider3: HomepageSlider;
  homepageReviews: HomepageReviewsSettings;
  homepageMentors: HomepageMentorsSettings;
  mobileNavBgColor: string;
  headerNavAlign: 'start' | 'center' | 'end';
  headerNavSpacing: number;
  defaultSubscriptionCycle: 'monthly' | 'annual';
  subscriptionTitleFont: string;
  subscriptionTitleColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

export interface AboutPageContent {
  missionStatement: string;
  teamMembers: TeamMember[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Général' | 'Compte' | 'Abonnement';
}

export interface NotificationSettings {
    dailyReminder: boolean;
    dailyReminderTime: string;
    newContent: boolean;
    newContentFavoritesOnly: boolean;
    courseCompleted: boolean;
    streakReminder: boolean;
    inactivityReminder: boolean;
    subscriptionExpiry: boolean;
    specialOffers: boolean;
}

export interface PrivacyPolicySection {
  id: string;
  title: string;
  content: string;
}

export interface PrivacyPolicyContent {
  lastUpdated: string;
  sections: PrivacyPolicySection[];
}

export interface EmailCampaign {
    id: number;
    name: string;
    subject: string;
    content: string;
    sendDate: string;
    target: 'Tous' | 'Premium' | 'Standard' | 'Inactifs > 30j';
    status: 'Envoyé' | 'Programmé' | 'Brouillon' | 'Échec';
    openRate?: number;
    clickRate?: number;
}

export type PageSettings = { [key in View]?: { showHeader: boolean } };