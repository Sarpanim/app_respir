import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { GeneralSettings, SubscriptionPlanId, NavItem, View, AdminView, AboutPageContent, TeamMember, SubscriptionPlan, PromoCode, Course, Lesson, UserProgress, Ambience, AmbienceCategory, User, NotificationSettings, FaqItem, PrivacyPolicyContent, SettingsMenuItem, ThemeColors, Review, ReviewStatus, Category, PageSettings, AmbiencePageSettings, Invoice, EmailCampaign } from '../types';
import { DEFAULT_MOBILE_NAV_ITEMS, DEFAULT_HEADER_NAV_ITEMS, DEFAULT_SUBSCRIPTION_PLANS, DEFAULT_PROMO_CODES, COURSES, AMBIENCE_SOUNDS, AMBIENCE_CATEGORIES, DEFAULT_FAQ_ITEMS, DEFAULT_PRIVACY_POLICY, DEFAULT_SETTINGS_MENU_ITEMS, DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_MEGA_MENU, DEFAULT_THEME_COLORS, DEFAULT_DISCOVER_PAGE_SETTINGS, DEFAULT_FOOTER_SETTINGS, DEFAULT_HOMEPAGE_QUOTE, DEFAULT_HOMEPAGE_IMAGE_TEXT, DEFAULT_HOMEPAGE_SLIDER, DEFAULT_HOMEPAGE_REVIEWS_SETTINGS, DEFAULT_HOMEPAGE_MENTORS_SETTINGS, DEFAULT_ALL_REVIEWS, DEFAULT_HOMEPAGE_SLIDER2, DEFAULT_HOMEPAGE_SLIDER3, CATEGORIES, DEFAULT_AMBIENCE_PAGE_SETTINGS, DEFAULT_INVOICES, DEFAULT_USERS, DEFAULT_EMAIL_CAMPAIGNS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

const slugify = (text: string) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const ADMIN_EMAIL = 'olivier.heqa@gmail.com';

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  
  currentView: View;
  currentParams: any;
  
  navigateTo: (view: View, params?: any) => void;
  navigateToGrid: () => void;
  navigateToDiscover: () => void;
  navigateToPlayer: (courseId: string) => void;
  navigateToPlayerView: () => void;
  navigateToAmbiencePlayerView: () => void;
  navigateToCategoryDetail: (categoryId: number) => void;
  navigateToSettings: () => void;
  navigateToSubscription: () => void;
  navigateToAbout: () => void;
  navigateToEditProfile: () => void;
  navigateToNotifications: () => void;
  navigateToHelpFaq: () => void;
  navigateToContactSupport: () => void;
  navigateToPrivacyPolicy: () => void;
  navigateToInviteFriend: () => void;
  navigateToAdminDashboard: () => void;
  handleLinkNavigation: (url: string) => void;

  user: User;
  updateUser: (updatedUser: Partial<User>) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;

  isSettingsOpen: boolean;
  toggleSettings: () => void;
  
  showAuth: boolean;
  setShowAuth: React.Dispatch<React.SetStateAction<boolean>>;

  userProgress: UserProgress;
  markLessonAsComplete: (courseId: string, lessonId: string) => void;
  
  isFavoriteCourse: (courseId: string) => boolean;
  toggleFavoriteCourse: (courseId: string) => void;
  
  isFavoriteAmbience: (ambienceId: number) => boolean;
  toggleFavoriteAmbience: (ambienceId: number) => void;

  subscriptionPlan: SubscriptionPlanId;
  justSubscribedPlanId: SubscriptionPlanId | null;
  clearJustSubscribed: () => void;
  isSubscribed: boolean;
  changeSubscription: (planId: SubscriptionPlanId) => void;
  canAccessCourse: (requiredPlan: SubscriptionPlanId) => boolean;

  subscriptionPlans: SubscriptionPlan[];
  updateSubscriptionPlans: (plans: SubscriptionPlan[]) => void;

  promoCodes: PromoCode[];
  updatePromoCodes: (codes: PromoCode[]) => void;

  courses: Course[];
  ambiences: Ambience[];
  updateAmbiences: (ambiences: Ambience[]) => void;

  ambienceCategories: AmbienceCategory[];
  updateAmbienceCategories: (categories: AmbienceCategory[]) => void;

  isAdmin: boolean;
  currentAdminView: AdminView;
  navigateToAdminPage: (page: AdminView) => void;

  generalSettings: GeneralSettings;
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  
  mobileNavItems: NavItem[];
  updateMobileNavItems: (items: NavItem[]) => void;

  headerNavItems: NavItem[];
  updateHeaderNavItems: (items: NavItem[]) => void;
  
  settingsMenuItems: SettingsMenuItem[];
  updateSettingsMenuItems: (items: SettingsMenuItem[]) => void;

  aboutPageContent: AboutPageContent;
  updateAboutPageContent: (content: AboutPageContent) => void;

  faqItems: FaqItem[];
  updateFaqItems: (items: FaqItem[]) => void;

  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  privacyPolicyContent: PrivacyPolicyContent;
  updatePrivacyPolicyContent: (content: PrivacyPolicyContent) => void;

  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  addReview: (reviewData: Omit<Review, 'id' | 'authorId' | 'author' | 'avatar' | 'date' | 'status'>) => void;
  updateReviewStatus: (reviewId: string, status: ReviewStatus) => void;
  deleteReview: (reviewId: string) => void;
  toggleReviewHomepageFeature: (reviewId: string) => void;

  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;

  emailCampaigns: EmailCampaign[];
  setEmailCampaigns: React.Dispatch<React.SetStateAction<EmailCampaign[]>>;

  pageSettings: PageSettings;
  setPageSettings: React.Dispatch<React.SetStateAction<PageSettings>>;

  // Player State
  currentlyPlayingLesson: Lesson | null;
  currentPlayingCourse: Course | null;
  currentlyPlayingAmbience: Ambience | null;
  isPlaying: boolean;
  audioCurrentTime: number;
  audioDuration: number;

  // Player Actions
  playLesson: (lesson: Lesson, course: Course) => void;
  playAmbience: (ambience: Ambience) => void;
  togglePlayPause: () => void;
  seekAudio: (time: number) => void;
  playNext: () => void;
  playPrev: () => void;
  closePlayer: () => void;
  
  _seekRequest: number | null;
  _clearSeekRequest: () => void;
  _updateAudioTime: (time: number, duration: number) => void;
  _handleAudioEnded: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultGeneralSettings: GeneralSettings = {
    defaultLanguage: 'fr',
    defaultTheme: 'dark',
    appLogo: '/logo.svg',
    appLogoSize: 32,
    appLogoAlign: 'center',
    showUserCountOnPlans: true,
    showStudentCountOnCourses: true,
    cardShadowEnabled: true,
    navBlurEnabled: false,
    mobileNavBgColor: 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg',
    inviteRewardActive: true,
    inviteRewardTitle: 'Gagnez des récompenses',
    inviteRewardDescription: "Recevez un mois d'abonnement Standard gratuit pour chaque ami qui s'abonne grâce à votre lien !",
    homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
    megaMenu: DEFAULT_MEGA_MENU,
    themeColors: DEFAULT_THEME_COLORS,
    discoverPageSettings: DEFAULT_DISCOVER_PAGE_SETTINGS,
    ambiencePageSettings: DEFAULT_AMBIENCE_PAGE_SETTINGS,
    footerSettings: DEFAULT_FOOTER_SETTINGS,
    homepageQuote: DEFAULT_HOMEPAGE_QUOTE,
    homepageImageText: DEFAULT_HOMEPAGE_IMAGE_TEXT,
    homepageSlider: DEFAULT_HOMEPAGE_SLIDER,
    homepageSlider2: DEFAULT_HOMEPAGE_SLIDER2,
    homepageSlider3: DEFAULT_HOMEPAGE_SLIDER3,
    homepageReviews: DEFAULT_HOMEPAGE_REVIEWS_SETTINGS,
    homepageMentors: DEFAULT_HOMEPAGE_MENTORS_SETTINGS,
    headerNavAlign: 'start',
    headerNavSpacing: 32,
    defaultSubscriptionCycle: 'monthly',
    subscriptionTitleFont: 'Elsie',
    subscriptionTitleColor: '#00A388',
};


const defaultAboutContent: AboutPageContent = {
  missionStatement: "Chez RESPIR, notre mission est de rendre le bien-être accessible à tous. Nous croyons que quelques minutes de pleine conscience chaque jour peuvent transformer votre vie. Nos cours sont conçus par des experts pour vous guider vers une meilleure gestion du stress, un sommeil plus profond et une concentration accrue.",
  teamMembers: [
    { id: uuidv4(), name: 'Alice Dubois', title: 'Experte en méditation', avatar: 'https://i.pravatar.cc/150?u=mentor1' },
    { id: uuidv4(), name: 'Bob Martin', title: 'Professeur de Yoga', avatar: 'https://i.pravatar.cc/150?u=mentor2' },
  ]
};

const defaultUser: User = {
    id: 1,
    name: 'Utilisateur RESPIR',
    username: 'respir_user',
    email: 'user@respir.app',
    avatar: `https://i.pravatar.cc/150?u=fakeuser`,
    bio: 'Explorer la paix intérieure, une respiration à la fois.',
    dateOfBirth: '1990-01-01',
    phoneNumber: '',
    plan: 'free',
    registrationDate: '2023-01-01',
    lastLogin: '2023-10-10',
    status: 'Actif',
    lastDevice: 'Mobile',
    location: 'Paris, FR',
    paymentHistory: [],
    subscriptionHistory: [],
    courseProgress: [],
    supportTickets: [],
    emailHistory: [],
    linkedAccounts: {
        google: false,
        facebook: false,
        apple: false,
    }
};

const defaultNotificationSettings: NotificationSettings = {
  dailyReminder: true,
  dailyReminderTime: '20:00',
  newContent: true,
  newContentFavoritesOnly: false,
  courseCompleted: true,
  streakReminder: true,
  inactivityReminder: false,
  subscriptionExpiry: true,
  specialOffers: true,
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('grid');
  const [currentParams, setCurrentParams] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const initialProgress: UserProgress = {};
    if (COURSES.length > 0 && COURSES[0].sections.length > 0 && COURSES[0].sections[0].lessons.length > 1) {
      const firstCourseId = COURSES[0].id;
      const firstLessonId = COURSES[0].sections[0].lessons[0].id;
      const secondLessonId = COURSES[0].sections[0].lessons[1].id;
      initialProgress[firstCourseId] = { completedLessons: new Set([firstLessonId, secondLessonId]) };
    }
    if (COURSES.length > 2) {
      const thirdCourseId = COURSES[2].id;
      const allLessonsCourse3 = COURSES[2].sections.flatMap(s => s.lessons.map(l => l.id));
      initialProgress[thirdCourseId] = { completedLessons: new Set(allLessonsCourse3) };
    }
    return initialProgress;
  });

  const [favoriteCourses, setFavoriteCourses] = useState<string[]>(['2']);
  const [favoriteAmbienceIds, setFavoriteAmbienceIds] = useState<number[]>([1]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlanId>('free');
  const [user, setUser] = useState<User>({ ...defaultUser, plan: subscriptionPlan });
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [justSubscribedPlanId, setJustSubscribedPlanId] = useState<SubscriptionPlanId | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(DEFAULT_SUBSCRIPTION_PLANS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(DEFAULT_PROMO_CODES);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [ambiences, setAmbiences] = useState<Ambience[]>(AMBIENCE_SOUNDS);
  const [ambienceCategories, setAmbienceCategories] = useState<AmbienceCategory[]>(AMBIENCE_CATEGORIES);
  
  const isAdmin = user.email === ADMIN_EMAIL;
  const [currentAdminView, setCurrentAdminView] = useState<AdminView>('dashboard');

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings as GeneralSettings);
  const [mobileNavItems, setMobileNavItems] = useState<NavItem[]>(DEFAULT_MOBILE_NAV_ITEMS);
  const [headerNavItems, setHeaderNavItems] = useState<NavItem[]>(DEFAULT_HEADER_NAV_ITEMS);
  const [settingsMenuItems, setSettingsMenuItems] = useState<SettingsMenuItem[]>(DEFAULT_SETTINGS_MENU_ITEMS);
  const [aboutPageContent, setAboutPageContent] = useState<AboutPageContent>(defaultAboutContent);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState<PrivacyPolicyContent>(DEFAULT_PRIVACY_POLICY);
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_ALL_REVIEWS);
  const [invoices, setInvoices] = useState<Invoice[]>(DEFAULT_INVOICES);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(DEFAULT_EMAIL_CAMPAIGNS);

  const [pageSettings, setPageSettings] = useState<PageSettings>({
    'ambience-player': { showHeader: false },
    'player-view': { showHeader: false },
  });

  // Player State
  const [currentlyPlayingLesson, setCurrentlyPlayingLesson] = useState<Lesson | null>(null);
  const [currentPlayingCourse, setCurrentPlayingCourse] = useState<Course | null>(null);
  const [currentlyPlayingAmbience, setCurrentlyPlayingAmbience] = useState<Ambience | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [_seekRequest, setSeekRequest] = useState<number | null>(null);

  const planLevels: Record<SubscriptionPlanId, number> = {
    free: 0,
    basic: 1,
    standard: 2,
    premium: 3,
    test: 4,
  };

  const canAccessCourse = (requiredPlan: SubscriptionPlanId) => {
      if (!requiredPlan) return true;
      return planLevels[subscriptionPlan] >= planLevels[requiredPlan];
  };

  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigateTo('grid');
    closePlayer();
    setUser({ ...defaultUser, plan: subscriptionPlan });
  };

  const navigateTo = (view: View, params: any = null) => {
    setCurrentView(view);
    setCurrentParams(params);
    setIsSettingsOpen(false);
  };

  const navigateToGrid = () => navigateTo('grid');
  const navigateToDiscover = () => navigateTo('discover');
  const navigateToPlayer = (courseId: string) => navigateTo('player', { courseId });
  const navigateToPlayerView = () => navigateTo('player-view');
  const navigateToAmbiencePlayerView = () => navigateTo('ambience-player');
  const navigateToCategoryDetail = (categoryId: number) => navigateTo('category-detail', { categoryId });
  const navigateToSettings = () => navigateTo('settings');
  const navigateToSubscription = () => navigateTo('subscription');
  const navigateToAbout = () => navigateTo('about');
  const navigateToEditProfile = () => navigateTo('edit-profile');
  const navigateToNotifications = () => navigateTo('notifications');
  const navigateToHelpFaq = () => navigateTo('help-faq');
  const navigateToContactSupport = () => navigateTo('contact-support');
  const navigateToPrivacyPolicy = () => navigateTo('privacy-policy');
  const navigateToInviteFriend = () => navigateTo('invite-friend');
  const navigateToAdminDashboard = () => navigateTo('admin', { view: 'dashboard' });

  const handleLinkNavigation = (url: string) => {
    if (url === '#') return;

    if (url.startsWith('/categorie/')) {
        const slug = url.replace('/categorie/', '');
        const category = CATEGORIES.find(c => slugify(c.name) === slug);
        if (category) {
            navigateTo('category-detail', { categoryId: category.id });
        }
    } else if (url.startsWith('/cours/')) {
        const slug = url.replace('/cours/', '');
        const course = COURSES.find(c => slugify(c.title) === slug);
        if (course) {
            navigateTo('player', { courseId: course.id });
        }
    } else if (url.startsWith('/')) {
        const view = url.substring(1) as View;
        navigateTo(view);
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  };


  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const markLessonAsComplete = (courseId: string, lessonId: string) => {
    setUserProgress(prev => {
        const courseProgress = prev[courseId] || { completedLessons: new Set() };
        const newCompletedLessons = new Set(courseProgress.completedLessons);
        newCompletedLessons.add(lessonId);
        return {
            ...prev,
            [courseId]: { completedLessons: newCompletedLessons },
        };
    });
  };

  const isFavoriteCourse = (courseId: string) => favoriteCourses.includes(courseId);
  const toggleFavoriteCourse = (courseId: string) => {
    setFavoriteCourses(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };
  
  const isFavoriteAmbience = (ambienceId: number) => favoriteAmbienceIds.includes(ambienceId);
  const toggleFavoriteAmbience = (ambienceId: number) => {
      setFavoriteAmbienceIds(prev => 
        prev.includes(ambienceId) ? prev.filter(id => id !== ambienceId) : [...prev, ambienceId]
      );
  };

  const changeSubscription = (planId: SubscriptionPlanId) => {
    setSubscriptionPlan(planId);
    setUser(prev => ({ ...prev, plan: planId }));
    setJustSubscribedPlanId(planId);
    navigateTo('profile');
  };
  
  const clearJustSubscribed = () => {
    setJustSubscribedPlanId(null);
  };
  
  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prev => ({ 
        ...prev, 
        ...updatedUser,
        linkedAccounts: updatedUser.linkedAccounts 
            ? { ...prev.linkedAccounts, ...updatedUser.linkedAccounts } 
            : prev.linkedAccounts
    }));
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const isSubscribed = subscriptionPlan !== 'free';

  const navigateToAdminPage = (page: AdminView) => {
      if (!isAdmin) return;
      setCurrentAdminView(page);
      navigateTo('admin');
  };

  const updateGeneralSettings = (settings: Partial<GeneralSettings>) => {
      setGeneralSettings(prev => ({...prev, ...settings}));
  };

  const updateMobileNavItems = (items: NavItem[]) => {
      setMobileNavItems(items);
  };

  const updateHeaderNavItems = (items: NavItem[]) => {
    setHeaderNavItems(items);
  };

  const updateSettingsMenuItems = (items: SettingsMenuItem[]) => {
      setSettingsMenuItems(items);
  };

  const updateAboutPageContent = (content: AboutPageContent) => {
    setAboutPageContent(content);
  };

  const updateFaqItems = (items: FaqItem[]) => {
    setFaqItems(items);
  };

  const updatePrivacyPolicyContent = (content: PrivacyPolicyContent) => {
    setPrivacyPolicyContent(content);
  };

  const updateSubscriptionPlans = (plans: SubscriptionPlan[]) => {
      setSubscriptionPlans(plans);
  };

  const updatePromoCodes = (codes: PromoCode[]) => {
      setPromoCodes(codes);
  };

  const updateAmbiences = (newAmbiences: Ambience[]) => {
    setAmbiences(newAmbiences);
  };
  
  const updateAmbienceCategories = (newCategories: AmbienceCategory[]) => {
    setAmbienceCategories(newCategories);
  };

  // --- REVIEW LOGIC ---
  const addReview = (reviewData: Omit<Review, 'id' | 'authorId' | 'author' | 'avatar' | 'date' | 'status'>) => {
    const newReview: Review = {
        ...reviewData,
        id: uuidv4(),
        authorId: user.id,
        author: user.name,
        avatar: user.avatar,
        date: new Date().toISOString(),
        status: 'En attente',
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateReviewStatus = (reviewId: string, status: ReviewStatus) => {
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
  };

  const deleteReview = (reviewId: string) => {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const toggleReviewHomepageFeature = (reviewId: string) => {
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, featuredOnHomepage: !r.featuredOnHomepage } : r));
  };

  // --- PLAYER LOGIC ---

  const playLesson = (lesson: Lesson, course: Course) => {
      setCurrentlyPlayingAmbience(null);
      setCurrentlyPlayingLesson(lesson);
      setCurrentPlayingCourse(course);
      setAudioCurrentTime(0);
      setAudioDuration(lesson.duration);
      setIsPlaying(true);
      navigateTo('player-view');
  };

  const playAmbience = (ambience: Ambience) => {
    setCurrentlyPlayingLesson(null);
    setCurrentPlayingCourse(null);
    setCurrentlyPlayingAmbience(ambience);
    setAudioCurrentTime(0);
    setAudioDuration(ambience.duration);
    setIsPlaying(true);
    navigateTo('ambience-player');
  };

  const togglePlayPause = () => {
      if (currentlyPlayingLesson || currentlyPlayingAmbience) {
          setIsPlaying(prev => !prev);
      }
  };

  const seekAudio = (time: number) => {
      setSeekRequest(time);
  };
  
  const _clearSeekRequest = () => {
    setSeekRequest(null);
  };

  const findAdjacentLesson = (direction: 'next' | 'prev'): Lesson | null => {
        if (!currentPlayingCourse || !currentlyPlayingLesson) return null;

        let currentSectionIndex = -1;
        let currentLessonIndex = -1;
        const hasCourseAccess = canAccessCourse(currentPlayingCourse.requiredPlan);

        currentPlayingCourse.sections.forEach((section, sIdx) => {
            const lIdx = section.lessons.findIndex(l => l.id === currentlyPlayingLesson.id);
            if (lIdx !== -1) {
                currentSectionIndex = sIdx;
                currentLessonIndex = lIdx;
            }
        });

        if (currentSectionIndex === -1) return null;
        
        if (direction === 'next') {
            for (let i = currentLessonIndex + 1; i < currentPlayingCourse.sections[currentSectionIndex].lessons.length; i++) {
                const lesson = currentPlayingCourse.sections[currentSectionIndex].lessons[i];
                if (hasCourseAccess || !lesson.isLocked) return lesson;
            }
            for (let i = currentSectionIndex + 1; i < currentPlayingCourse.sections.length; i++) {
                for (const lesson of currentPlayingCourse.sections[i].lessons) {
                    if (hasCourseAccess || !lesson.isLocked) return lesson;
                }
            }
        } else {
             for (let i = currentLessonIndex - 1; i >= 0; i--) {
                const lesson = currentPlayingCourse.sections[currentSectionIndex].lessons[i];
                if (hasCourseAccess || !lesson.isLocked) return lesson;
            }
            for (let i = currentSectionIndex - 1; i >= 0; i--) {
                for (let j = currentPlayingCourse.sections[i].lessons.length - 1; j >= 0; j--) {
                     const lesson = currentPlayingCourse.sections[i].lessons[j];
                     if (hasCourseAccess || !lesson.isLocked) return lesson;
                }
            }
        }
        return null;
  };
  
  const playNext = () => {
    const nextLesson = findAdjacentLesson('next');
    if (nextLesson && currentPlayingCourse) {
        setCurrentlyPlayingLesson(nextLesson);
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }
  };

  const playPrev = () => {
    const prevLesson = findAdjacentLesson('prev');
    if (prevLesson && currentPlayingCourse) {
        setCurrentlyPlayingLesson(prevLesson);
        setIsPlaying(true);
    }
  };

  const closePlayer = () => {
      setIsPlaying(false);
      setCurrentlyPlayingLesson(null);
      setCurrentPlayingCourse(null);
      setCurrentlyPlayingAmbience(null);
  };
  
  const _updateAudioTime = (time: number, duration: number) => {
      setAudioCurrentTime(time);
      if (duration && !isNaN(duration) && duration > 0) {
        setAudioDuration(duration);
      }
  };
  
  const _handleAudioEnded = () => {
    if (currentlyPlayingLesson && currentPlayingCourse) {
        markLessonAsComplete(currentPlayingCourse.id, currentlyPlayingLesson.id);
        playNext();
    } else if (currentlyPlayingAmbience) {
        seekAudio(0);
        setIsPlaying(true);
    }
  };

  const value = {
    isAuthenticated, login, logout,
    currentView, currentParams,
    navigateTo, navigateToGrid, navigateToDiscover, navigateToPlayer, navigateToPlayerView, navigateToAmbiencePlayerView, navigateToCategoryDetail, navigateToSettings, navigateToSubscription, navigateToAbout, navigateToEditProfile, navigateToNotifications, navigateToHelpFaq, navigateToContactSupport, navigateToPrivacyPolicy, navigateToInviteFriend, navigateToAdminDashboard, handleLinkNavigation,
    user, updateUser, users, setUsers,
    isSettingsOpen, toggleSettings,
    showAuth, setShowAuth,
    userProgress, markLessonAsComplete,
    isFavoriteCourse, toggleFavoriteCourse,
    isFavoriteAmbience, toggleFavoriteAmbience,
    subscriptionPlan, justSubscribedPlanId, clearJustSubscribed, isSubscribed, changeSubscription,
    canAccessCourse,
    subscriptionPlans, updateSubscriptionPlans,
    promoCodes, updatePromoCodes,
    courses,
    ambiences, updateAmbiences,
    ambienceCategories, updateAmbienceCategories,
    isAdmin, currentAdminView, navigateToAdminPage,
    generalSettings, updateGeneralSettings,
    mobileNavItems, updateMobileNavItems,
    headerNavItems, updateHeaderNavItems,
    settingsMenuItems, updateSettingsMenuItems,
    aboutPageContent, updateAboutPageContent,
    faqItems, updateFaqItems,
    notificationSettings, updateNotificationSettings,
    privacyPolicyContent, updatePrivacyPolicyContent,
    reviews, setReviews, addReview, updateReviewStatus, deleteReview, toggleReviewHomepageFeature,
    invoices, setInvoices,
    emailCampaigns, setEmailCampaigns,
    pageSettings, setPageSettings,
    currentlyPlayingLesson, currentPlayingCourse, currentlyPlayingAmbience, isPlaying, audioCurrentTime, audioDuration,
    playLesson, playAmbience, togglePlayPause, seekAudio, playNext, playPrev, closePlayer,
    _seekRequest, _clearSeekRequest, _updateAudioTime, _handleAudioEnded
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};