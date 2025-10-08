import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
    ChevronLeftIcon, UserGroupIcon, BookOpenIcon, TagIcon, SoundWaveIcon,
    CreditCardIcon, ChartBarIcon, ChatBubbleLeftRightIcon, MegaphoneIcon,
    Cog6ToothIcon, SparklesIcon, TicketIcon, ReceiptPercentIcon, 
    UserIcon, DocumentTextIcon, MusicalNoteIcon, HamburgerIcon, InformationCircleIcon,
    ClipboardDocumentListIcon, PaintBrushIcon, HomeIcon, PhotoIcon,
    ChatBubbleOvalLeftEllipsisIcon, QuestionMarkCircleIcon, ShieldCheckIcon, ListBulletIcon,
    ImageIcon, DevicePhoneMobileIcon, MapIcon, ChevronRightIcon
} from './Icons';
import AdminSubscriptionTracking from './admin/AdminSubscriptionTracking';
import AdminInvoiceManagement from './admin/AdminInvoiceManagement';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminCourseManagement from './admin/AdminCourseManagement';
import AdminAmbienceManagement from './admin/AdminAmbienceManagement';
import AdminCategoryManagement from './admin/AdminCategoryManagement';
import AdminProgramManagement from './admin/AdminProgramManagement';
import AdminEngagementStats from './admin/AdminEngagementStats';
import AdminDemographicsStats from './admin/AdminDemographicsStats';
import AdminReviewsSupport from './admin/AdminReviewsSupport';
import AdminSupportTickets from './admin/AdminSupportTickets';
import AdminFeaturedContent from './admin/AdminFeaturedContent';
import AdminPromoCodes from './admin/AdminPromoCodes';
import AdminRoleManagement from './admin/AdminRoleManagement';
import AdminGeneralConfig from './admin/AdminGeneralConfig';
import AdminActivityLogs from './admin/AdminActivityLogs';
import AdminEmailCampaigns from './admin/AdminEmailCampaigns';
import AdminAmbienceCategoryManagement from './admin/AdminAmbienceCategoryManagement';
import AdminNavManagement from './admin/AdminNavManagement';
import AdminAboutManagement from './admin/AdminAboutManagement';
import AdminThemeColorManagement from './admin/AdminThemeColorManagement';
import AdminDiscoverManagement from './admin/AdminDiscoverManagement';
import AdminAccountMenuManagement from './admin/AdminAccountMenuManagement';
import AdminSliderManagement from './admin/AdminSliderManagement';
import AdminQuoteManagement from './admin/AdminQuoteManagement';
import AdminImageTextManagement from './admin/AdminImageTextManagement';
import AdminReviewsManagement from './admin/AdminReviewsManagement';
import AdminMentorsManagement from './admin/AdminMentorsManagement';
import AdminFaqManagement from './admin/AdminFaqManagement';
import AdminPrivacyManagement from './admin/AdminPrivacyManagement';
import AdminFooterManagement from './admin/AdminFooterManagement';
import AdminHomeManagement from './admin/AdminHomeManagement';
import AdminMobileNavManagement from './admin/AdminMobileNavManagement';
import AdminNavigationMap from './admin/AdminNavigationMap';


const AdminDashboard: React.FC = () => {
    const { navigateToSettings, navigateToAdminPage } = useAppContext();
    
    const AdminSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 px-1">{title}</h2>
            <div className="bg-white/30 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-black/30">
                {children}
            </div>
        </section>
    );

    const AdminButton: React.FC<{ icon: React.ReactNode; label: string; action?: () => void }> = ({ icon, label, action }) => (
        <button 
            onClick={action}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 border-b border-black/10 dark:border-white/10 last:border-b-0"
        >
            <div className="text-accent">{icon}</div>
            <span className="font-semibold text-gray-800 dark:text-gray-100 flex-grow">{label}</span>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </button>
    );
    
    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <header className="relative flex items-center justify-center mb-8">
                <button onClick={navigateToSettings} className="absolute left-0 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-elsie font-bold">Panneau d'Administration</h1>
            </header>
            <div className="space-y-6">
                
                {/* Abonnements & Paiements */}
                <AdminSection title="Abonnements & Paiements">
                    <AdminButton icon={<CreditCardIcon className="w-6 h-6" />} label="Gestion des formules" action={() => navigateToAdminPage('subscriptions')} />
                    <AdminButton icon={<DocumentTextIcon className="w-6 h-6" />} label="Gestion des factures" action={() => navigateToAdminPage('invoices')} />
                </AdminSection>

                {/* Gestion du Contenu */}
                <AdminSection title="Gestion du Contenu">
                    <AdminButton icon={<UserGroupIcon className="w-6 h-6" />} label="Gérer les utilisateurs" action={() => navigateToAdminPage('users')} />
                    <AdminButton icon={<BookOpenIcon className="w-6 h-6" />} label="Gérer les cours" action={() => navigateToAdminPage('courses')} />
                    <AdminButton icon={<SoundWaveIcon className="w-6 h-6" />} label="Gérer les ambiances sonores" action={() => navigateToAdminPage('ambiences')} />
                    <AdminButton icon={<TagIcon className="w-6 h-6" />} label="Gérer les catégories (Cours)" action={() => navigateToAdminPage('categories')} />
                    <AdminButton icon={<MusicalNoteIcon className="w-6 h-6" />} label="Gérer les catégories (Ambiances)" action={() => navigateToAdminPage('ambienceCategories')} />
                    <AdminButton icon={<BookOpenIcon className="w-6 h-6" />} label="Gérer les programmes" action={() => navigateToAdminPage('programs')} />
                    <AdminButton icon={<InformationCircleIcon className="w-6 h-6" />} label="Gestion page 'À Propos'" action={() => navigateToAdminPage('aboutManagement')} />
                    <AdminButton icon={<QuestionMarkCircleIcon className="w-6 h-6" />} label="Gestion de la FAQ" action={() => navigateToAdminPage('faq')} />
                    <AdminButton icon={<ShieldCheckIcon className="w-6 h-6" />} label="Gestion de la Confidentialité" action={() => navigateToAdminPage('privacyManagement')} />
                </AdminSection>

                {/* Gestion Page d'Accueil */}
                <AdminSection title="Gestion Page d'Accueil">
                    <AdminButton icon={<HomeIcon className="w-6 h-6" />} label="Ordre des sections" action={() => navigateToAdminPage('home')} />
                    <AdminButton icon={<PhotoIcon className="w-6 h-6" />} label="Gestion des Sliders" action={() => navigateToAdminPage('homeSlider')} />
                    <AdminButton icon={<ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />} label="Gestion de la Citation" action={() => navigateToAdminPage('homeQuote')} />
                    <AdminButton icon={<ImageIcon className="w-6 h-6" />} label="Gestion Image & Texte" action={() => navigateToAdminPage('homeImageText')} />
                    <AdminButton icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Gestion Avis Personnalisés" action={() => navigateToAdminPage('homeReviews')} />
                    <AdminButton icon={<UserGroupIcon className="w-6 h-6" />} label="Gestion 'Nos Experts'" action={() => navigateToAdminPage('homeMentors')} />
                </AdminSection>
                
                {/* Statistiques */}
                <AdminSection title="Statistiques Avancées">
                    <AdminButton icon={<ChartBarIcon className="w-6 h-6" />} label="Engagement & rétention" action={() => navigateToAdminPage('engagement')} />
                    <AdminButton icon={<UserGroupIcon className="w-6 h-6" />} label="Données démographiques" action={() => navigateToAdminPage('demographics')} />
                </AdminSection>
                
                {/* Support & Modération */}
                <AdminSection title="Support & Modération">
                    <AdminButton icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Gestion des avis" action={() => navigateToAdminPage('reviews')} />
                    <AdminButton icon={<TicketIcon className="w-6 h-6" />} label="Tickets de support" action={() => navigateToAdminPage('tickets')} />
                </AdminSection>
                
                {/* Marketing */}
                <AdminSection title="Marketing & Communication">
                    <AdminButton icon={<MegaphoneIcon className="w-6 h-6" />} label="Campagnes Email" action={() => navigateToAdminPage('emailCampaigns')} />
                    <AdminButton icon={<SparklesIcon className="w-6 h-6" />} label="Mise en avant de contenu" action={() => navigateToAdminPage('featured')} />
                    <AdminButton icon={<ReceiptPercentIcon className="w-6 h-6" />} label="Codes promo / réductions" action={() => navigateToAdminPage('promos')} />
                </AdminSection>
                
                {/* Paramètres Système */}
                <AdminSection title="Paramètres Système">
                    <AdminButton icon={<UserIcon className="w-6 h-6" />} label="Gestion des rôles" action={() => navigateToAdminPage('roles')} />
                    <AdminButton icon={<Cog6ToothIcon className="w-6 h-6" />} label="Configuration générale" action={() => navigateToAdminPage('config')} />
                    <AdminButton icon={<PaintBrushIcon className="w-6 h-6" />} label="Gestion des couleurs du thème" action={() => navigateToAdminPage('themeColors')} />
                    <AdminButton icon={<SparklesIcon className="w-6 h-6" />} label="Gestion Page Découvrir" action={() => navigateToAdminPage('discoverManagement')} />
                    <AdminButton icon={<HamburgerIcon className="w-6 h-6" />} label="Gestion Navigation Principale" action={() => navigateToAdminPage('navigation')} />
                    <AdminButton icon={<DevicePhoneMobileIcon className="w-6 h-6" />} label="Gestion Navigation Mobile" action={() => navigateToAdminPage('mobileNavManagement')} />
                    <AdminButton icon={<UserIcon className="w-6 h-6" />} label="Gestion Menu Compte" action={() => navigateToAdminPage('accountMenu')} />
                    <AdminButton icon={<ListBulletIcon className="w-6 h-6" />} label="Gestion du Footer" action={() => navigateToAdminPage('footerManagement')} />
                    <AdminButton icon={<MapIcon className="w-6 h-6" />} label="Carte du Site" action={() => navigateToAdminPage('siteMap')} />
                    <AdminButton icon={<ClipboardDocumentListIcon className="w-6 h-6" />} label="Logs d'activité" action={() => navigateToAdminPage('logs')} />
                </AdminSection>
            </div>
        </div>
    );
};

const AdminView: React.FC = () => {
    const { currentAdminView } = useAppContext();

    switch(currentAdminView) {
        case 'dashboard':
            return <AdminDashboard />;
        case 'subscriptions':
            return <AdminSubscriptionTracking />;
        case 'invoices':
            return <AdminInvoiceManagement />;
        case 'users':
            return <AdminUserManagement />;
        case 'courses':
            return <AdminCourseManagement />;
        case 'ambiences':
            return <AdminAmbienceManagement />;
        case 'categories':
            return <AdminCategoryManagement />;
        case 'ambienceCategories':
            return <AdminAmbienceCategoryManagement />;
        case 'programs':
            return <AdminProgramManagement />;
        case 'engagement':
            return <AdminEngagementStats />;
        case 'demographics':
            return <AdminDemographicsStats />;
        case 'reviews':
            return <AdminReviewsSupport />;
        case 'tickets':
            return <AdminSupportTickets />;
        case 'emailCampaigns':
            return <AdminEmailCampaigns />;
        case 'featured':
            return <AdminFeaturedContent />;
        case 'promos':
            return <AdminPromoCodes />;
        case 'roles':
            return <AdminRoleManagement />;
        case 'config':
            return <AdminGeneralConfig />;
        case 'navigation':
            return <AdminNavManagement />;
        case 'siteMap':
            return <AdminNavigationMap />;
        case 'mobileNavManagement':
            return <AdminMobileNavManagement />;
        case 'logs':
            return <AdminActivityLogs />;
        case 'aboutManagement':
            return <AdminAboutManagement />;
        case 'themeColors':
            return <AdminThemeColorManagement />;
        case 'discoverManagement':
            return <AdminDiscoverManagement />;
        case 'accountMenu':
            return <AdminAccountMenuManagement />;
        case 'footerManagement':
            return <AdminFooterManagement />;
        case 'faq':
            return <AdminFaqManagement />;
        case 'privacyManagement':
            return <AdminPrivacyManagement />;
        case 'home':
            return <AdminHomeManagement />;
        case 'homeSlider':
            return <AdminSliderManagement />;
        case 'homeQuote':
            return <AdminQuoteManagement />;
        case 'homeImageText':
            return <AdminImageTextManagement />;
        case 'homeReviews':
            return <AdminReviewsManagement />;
        case 'homeMentors':
            return <AdminMentorsManagement />;
        default:
            return <AdminDashboard />;
    }
};

export default AdminView;