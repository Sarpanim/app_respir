import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PlayIcon, PauseIcon, XMarkIcon, ForwardIcon, BackwardIcon } from './Icons';

const MiniPlayer: React.FC = () => {
    const { 
        currentlyPlayingLesson, currentPlayingCourse, currentlyPlayingAmbience, isPlaying, 
        audioCurrentTime, audioDuration, ambienceCategories,
        togglePlayPause, navigateToPlayerView, navigateToAmbiencePlayerView, closePlayer,
        seekAudio, playNext, playPrev
    } = useAppContext();

    if (!currentlyPlayingLesson && !currentlyPlayingAmbience) return null;

    const isLesson = !!currentlyPlayingLesson;
    const item = isLesson ? currentlyPlayingLesson : currentlyPlayingAmbience;
    const course = isLesson ? currentPlayingCourse : null;
    const title = item?.title || 'Titre inconnu';
    
    let subtitle = '';
    if (isLesson && course) {
        subtitle = course.title;
    } else if (!isLesson && currentlyPlayingAmbience) {
        const category = ambienceCategories.find(c => c.id === currentlyPlayingAmbience.categoryId);
        subtitle = category?.name || 'Ambiance';
    }

    const progress = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;

    const handlePlayerClick = () => {
        if (isLesson) {
            navigateToPlayerView();
        } else {
            navigateToAmbiencePlayerView();
        }
    };

    return (
        <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 z-40 animate-slide-up">
            <div className="container mx-auto px-4">
                <div className="bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg rounded-2xl shadow-lg p-3 flex items-center gap-4 border border-black/10 dark:border-white/10">
                    <div className="w-full" onClick={handlePlayerClick}>
                        <div className="flex items-center gap-4 cursor-pointer">
                            <img src={isLesson ? course?.image.url : item?.image.url} alt={title} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-grow overflow-hidden">
                                <p className="font-bold truncate text-gray-800 dark:text-white">{title}</p>
                                <p className="text-sm truncate text-gray-500 dark:text-gray-400">{subtitle}</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1 mt-2">
                            <div className="bg-accent h-1 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isLesson && <button onClick={playPrev} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"><BackwardIcon className="w-5 h-5" /></button<dyad-problem-report summary="70 problems">
<problem file="constants.ts" line="445" column="5" code="2741">Property 'target' is missing in type '{ id: number; name: string; subject: string; sendDate: string; status: &quot;Envoyé&quot;; recipientCount: number; openRate: number; clickRate: number; content: string; }' but required in type 'EmailCampaign'.</problem>
<problem file="constants.ts" line="446" column="5" code="2741">Property 'target' is missing in type '{ id: number; name: string; subject: string; sendDate: string; status: &quot;Programmé&quot;; recipientCount: number; openRate: number; clickRate: number; content: string; }' but required in type 'EmailCampaign'.</problem>
<problem file="components/DynamicIcon.tsx" line="36" column="47" code="2322">Type '{ className: string | undefined; style: CSSProperties | undefined; }' is not assignable to type 'IntrinsicAttributes &amp; { className?: string | undefined; }'.
  Property 'style' does not exist on type 'IntrinsicAttributes &amp; { className?: string | undefined; }'.</problem>
<problem file="components/admin/AdminSubscriptionTracking.tsx" line="451" column="54" code="2769">No overload matches this call.
  Overload 1 of 4, '(value: string | number | Date): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number | Date'.
      Type 'null' is not assignable to type 'string | number | Date'.
  Overload 2 of 4, '(value: string | number): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number'.
      Type 'null' is not assignable to type 'string | number'.</problem>
<problem file="components/admin/AdminSubscriptionTracking.tsx" line="451" column="89" code="2769">No overload matches this call.
  Overload 1 of 4, '(value: string | number | Date): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number | Date'.
      Type 'null' is not assignable to type 'string | number | Date'.
  Overload 2 of 4, '(value: string | number): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number'.
      Type 'null' is not assignable to type 'string | number'.</problem>
<problem file="components/admin/AdminSubscriptionTracking.tsx" line="453" column="47" code="2367">This comparison appears to be unintentional because the types 'SubscriptionPlanId[]' and 'string' have no overlap.</problem>
<problem file="components/admin/AdminUserManagement.tsx" line="39" column="22" code="2345">Argument of type '(User | { status: &quot;Banned&quot;; id: number; name: string; username?: string | undefined; email: string; avatar: string; bio?: string | undefined; dateOfBirth?: string | undefined; phoneNumber?: string | undefined; ... 10 more ...; linkedAccounts?: { ...; } | undefined; })[]' is not assignable to parameter of type 'SetStateAction&lt;User[]&gt;'.
  Type '(User | { status: &quot;Banned&quot;; id: number; name: string; username?: string | undefined; email: string; avatar: string; bio?: string | undefined; dateOfBirth?: string | undefined; phoneNumber?: string | undefined; ... 10 more ...; linkedAccounts?: { ...; } | undefined; })[]' is not assignable to type 'User[]'.
    Type 'User | { status: &quot;Banned&quot;; id: number; name: string; username?: string | undefined; email: string; avatar: string; bio?: string | undefined; dateOfBirth?: string | undefined; phoneNumber?: string | undefined; ... 10 more ...; linkedAccounts?: { ...; } | undefined; }' is not assignable to type 'User'.
      Type '{ status: &quot;Banned&quot;; id: number; name: string; username?: string; email: string; avatar: string; bio?: string; dateOfBirth?: string; phoneNumber?: string; plan: SubscriptionPlanId; ... 9 more ...; linkedAccounts?: { google?: boolean; facebook?: boolean; apple?: boolean; }; }' is not assignable to type 'User'.
        Types of property 'status' are incompatible.
          Type '&quot;Banned&quot;' is not assignable to type '&quot;Actif&quot; | &quot;Banni&quot;'.</problem>
<problem file="components/admin/AdminUserManagement.tsx" line="51" column="45" code="2367">This comparison appears to be unintentional because the types '&quot;Actif&quot; | &quot;Banni&quot;' and '&quot;Banned&quot;' have no overlap.</problem>
<problem file="components/admin/AdminUserManagement.tsx" line="140" column="46" code="2367">This comparison appears to be unintentional because the types '&quot;Actif&quot; | &quot;Banni&quot;' and '&quot;Banned&quot;' have no overlap.</problem>
<problem file="components/admin/CourseEditModal.tsx" line="71" column="13" code="2561">Object literal may only specify known properties, but 'cover_image' does not exist in type 'Lesson'. Did you mean to write 'coverImage'?</problem>
<problem file="components/admin/AdminCourseManagement.tsx" line="42" column="13" code="2741">Property 'alt' is missing in type '{ url: string; ratio: string; position: &quot;center&quot;; }' but required in type 'ImageSettings'.</problem>
<problem file="components/admin/AmbienceEditModal.tsx" line="18" column="9" code="2322">Type 'ImageSettings | { url: string; ratio: string; position: &quot;center&quot;; }' is not assignable to type 'ImageSettings | undefined'.
  Property 'alt' is missing in type '{ url: string; ratio: string; position: &quot;center&quot;; }' but required in type 'ImageSettings'.</problem>
<problem file="components/admin/AdminPromoCodes.tsx" line="15" column="25" code="2345">Argument of type '{ id: string; code: string; type: &quot;percentage&quot; | &quot;fixed&quot;; value: number; status: &quot;active&quot; | &quot;inactive&quot;; usageCount: number; usageLimit: number | null; startDate: string | null; endDate: string | null; applicablePlanIds: SubscriptionPlanId[]; textColor?: string | undefined; } | { ...; }' is not assignable to parameter of type 'SetStateAction&lt;PromoCode | null&gt;'.
  Type '{ id: string; code: string; type: &quot;percentage&quot;; value: number; status: &quot;active&quot;; usageLimit: null; startDate: null; endDate: null; applicablePlanIds: never[]; }' is not assignable to type 'SetStateAction&lt;PromoCode | null&gt;'.
    Property 'usageCount' is missing in type '{ id: string; code: string; type: &quot;percentage&quot;; value: number; status: &quot;active&quot;; usageLimit: null; startDate: null; endDate: null; applicablePlanIds: never[]; }' but required in type 'PromoCode'.</problem>
<problem file="components/admin/AdminPromoCodes.tsx" line="175" column="45" code="2322">Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.</problem>
<problem file="components/admin/AdminEmailCampaigns.tsx" line="63" column="42" code="2322">Type 'EmailCampaign | null' is not assignable to type 'EmailCampaign'.
  Type 'null' is not assignable to type 'EmailCampaign'.</problem>
<problem file="components/admin/AdminAmbienceCategoryManagement.tsx" line="42" column="13" code="2741">Property 'alt' is missing in type '{ url: string; ratio: string; position: &quot;center&quot;; }' but required in type 'ImageSettings'.</problem>
<problem file="components/admin/AdminNavManagement.tsx" line="12" column="85" code="2339">Property 'headerNavItems' does not exist on type 'GeneralSettings'.</problem>
<problem file="components/admin/AdminNavManagement.tsx" line="17" column="43" code="2339">Property 'headerNavItems' does not exist on type 'GeneralSettings'.</problem>
<problem file="components/admin/AdminNavManagement.tsx" line="18" column="25" code="2339">Property 'headerNavItems' does not exist on type 'GeneralSettings'.</problem>
<problem file="components/admin/AdminNavManagement.tsx" line="28" column="28" code="2322">Type 'NavItem | { id: string; label: string; link: string; icon: string; }' is not assignable to type 'NavItem'.
  Type '{ id: string; label: string; link: string; icon: string; }' is missing the following properties from type 'NavItem': position, active</problem>
<problem file="components/admin/AdminNavManagement.tsx" line="28" column="47" code="2739">Type '{ id: string; label: string; link: string; icon: string; }' is missing the following properties from type 'NavItem': position, active</problem>
<problem file="components/admin/AdminNavManagement.tsx" line="38" column="53" code="2353">Object literal may only specify known properties, and 'headerNavItems' does not exist in type 'Partial&lt;GeneralSettings&gt;'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="12" column="84" code="2339">Property 'accountMenuItems' does not exist on type 'GeneralSettings'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="17" column="38" code="2339">Property 'accountMenuItems' does not exist on type 'GeneralSettings'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="18" column="25" code="2339">Property 'accountMenuItems' does not exist on type 'GeneralSettings'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="28" column="88" code="2322">Type 'SettingsMenuItem | { id: string; label: string; link: string; icon: string; }' is not assignable to type 'SettingsMenuItem'.
  Object literal may only specify known properties, and 'link' does not exist in type 'SettingsMenuItem'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="28" column="88" code="2353">Object literal may only specify known properties, and 'link' does not exist in type 'SettingsMenuItem'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="38" column="53" code="2353">Object literal may only specify known properties, and 'accountMenuItems' does not exist in type 'Partial&lt;GeneralSettings&gt;'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="93" column="54" code="2339">Property 'link' does not exist on type 'SettingsMenuItem'.</problem>
<problem file="components/admin/AdminAccountMenuManagement.tsx" line="93" column="105" code="2345">Argument of type '&quot;link&quot;' is not assignable to parameter of type 'keyof SettingsMenuItem'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="35" column="13" code="2739">Type '{ url: string; alt: string; }' is missing the following properties from type 'ImageSettings': ratio, position</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="36" column="13" code="2322">Type '{ text: string; color: string; font: string; }' is not assignable to type 'string'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="37" column="13" code="2322">Type '{ text: string; color: string; font: string; }' is not assignable to type 'string'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="38" column="42" code="2353">Object literal may only specify known properties, and 'link' does not exist in type '{ enabled: boolean; text: string; url: string; }'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="50" column="107" code="2698">Spread types may only be created from object types.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="100" column="71" code="2339">Property 'text' does not exist on type 'string'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="101" column="72" code="2339">Property 'color' does not exist on type 'string'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="104" column="74" code="2339">Property 'text' does not exist on type 'string'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="105" column="75" code="2339">Property 'color' does not exist on type 'string'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="109" column="61" code="2339">Property 'style' does not exist on type '{ enabled: boolean; text: string; url: string; }'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="109" column="116" code="2345">Argument of type '&quot;style&quot;' is not assignable to parameter of type '&quot;enabled&quot; | &quot;text&quot; | &quot;url&quot;'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="115" column="62" code="2339">Property 'link' does not exist on type '{ enabled: boolean; text: string; url: string; }'.</problem>
<problem file="components/admin/AdminSliderManagement.tsx" line="115" column="120" code="2345">Argument of type '&quot;link&quot;' is not assignable to parameter of type '&quot;enabled&quot; | &quot;text&quot; | &quot;url&quot;'.</problem>
<problem file="components/admin/AdminNavigationMap.tsx" line="93" column="74" code="2322">Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes &amp; IconProps'.
  Property 'title' does not exist on type 'IntrinsicAttributes &amp; IconProps'.</problem>
<problem file="components/admin/AdminNavigationMap.tsx" line="93" column="148" code="2322">Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes &amp; IconProps'.
  Property 'title' does not exist on type 'IntrinsicAttributes &amp; IconProps'.</problem>
<problem file="components/AdminView.tsx" line="67" column="14" code="2304">Cannot find name 'ChevronRightIcon'.</problem>
<problem file="components/homepage/SliderSection.tsx" line="20" column="41" code="2344">Type 'string | undefined' does not satisfy the constraint 'string | number | symbol'.
  Type 'undefined' is not assignable to type 'string | number | symbol'.</problem>
<problem file="components/homepage/SliderSection.tsx" line="33" column="134" code="2538">Type 'undefined' cannot be used as an index type.</problem>
<problem file="components/homepage/SliderSection.tsx" line="57" column="84" code="2538">Type 'undefined' cannot be used as an index type.</problem>
<problem file="components/Player.tsx" line="16" column="9" code="2339">Property 'currentCourseId' does not exist on type 'AppContextType'.</problem>
<problem file="components/Player.tsx" line="16" column="42" code="2339">Property 'favorites' does not exist on type 'AppContextType'.</problem>
<problem file="components/Player.tsx" line="16" column="53" code="2339">Property 'toggleFavorite' does not exist on type 'AppContextType'.</problem>
<problem file="components/Player.tsx" line="18" column="35" code="2339">Property 'allReviews' does not exist on type 'AppContextType'.</problem>
<problem file="components/Player.tsx" line="48" column="34" code="7006">Parameter 'r' implicitly has an 'any' type.</problem>
<problem file="components/Player.tsx" line="53" column="32" code="7006">Parameter 'r' implicitly has an 'any' type.</problem>
<problem file="components/Player.tsx" line="270" column="54" code="7006">Parameter 'review' implicitly has an 'any' type.</problem>
<problem file="components/Profile.tsx" line="11" column="23" code="2339">Property 'favorites' does not exist on type 'AppContextType'.</problem>
<problem file="components/Profile.tsx" line="11" column="34" code="2339">Property 'favoriteAmbienceIds' does not exist on type 'AppContextType'.</problem>
<problem file="components/SubscriptionView.tsx" line="41" column="44" code="2769">No overload matches this call.
  Overload 1 of 4, '(value: string | number | Date): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number | Date'.
      Type 'null' is not assignable to type 'string | number | Date'.
  Overload 2 of 4, '(value: string | number): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number'.
      Type 'null' is not assignable to type 'string | number'.</problem>
<problem file="components/SubscriptionView.tsx" line="42" column="42" code="2769">No overload matches this call.
  Overload 1 of 4, '(value: string | number | Date): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number | Date'.
      Type 'null' is not assignable to type 'string | number | Date'.
  Overload 2 of 4, '(value: string | number): Date', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string | number'.
      Type 'null' is not assignable to type 'string | number'.</problem>
<problem file="components/SubscriptionView.tsx" line="47" column="62" code="2367">This comparison appears to be unintentional because the types 'SubscriptionPlanId[]' and 'string' have no overlap.</problem>
<problem file="components/admin/AdminAmbienceDisplayManagement.tsx" line="33" column="40" code="2322">Type 'AmbienceCategorySetting | { id: number; name: string; image: string; }' is not assignable to type 'AmbienceCategorySetting'.
  Property 'enabled' is missing in type '{ id: number; name: string; image: string; }' but required in type 'AmbienceCategorySetting'.</problem>
<problem file="components/admin/AdminAmbienceDisplayManagement.tsx" line="33" column="64" code="2741">Property 'enabled' is missing in type '{ id: number; name: string; image: string; }' but required in type 'AmbienceCategorySetting'.</problem>
<problem file="components/admin/AdminMegaMenuManagement.tsx" line="52" column="67" code="2353">Object literal may only specify known properties, and 'label' does not exist in type 'MegaMenuLink'.</problem>
<problem file="components/admin/AdminMegaMenuManagement.tsx" line="100" column="72" code="2339">Property 'label' does not exist on type 'MegaMenuLink'.</problem>
<problem file="components/admin/AdminMegaMenuManagement.tsx" line="100" column="132" code="2345">Argument of type '&quot;label&quot;' is not assignable to parameter of type 'keyof MegaMenuLink'.</problem>
<problem file="components/admin/AdminMegaMenuManagement.tsx" line="103" column="62" code="2339">Property 'link' does not exist on type 'MegaMenuLink'.</problem>
<problem file="components/admin/AdminMegaMenuManagement.tsx" line="103" column="125" code="2345">Argument of type '&quot;link&quot;' is not assignable to parameter of type 'keyof MegaMenuLink'.</problem>
<problem file="components/admin/LessonEditModal.tsx" line="34" column="33" code="2345">Argument of type '(prev: Partial&lt;Lesson&gt;) =&gt; { coverImage: { url: string; ratio: string; position: &quot;top&quot; | &quot;center&quot; | &quot;bottom&quot; | &quot;left&quot; | &quot;right&quot; | &quot;background&quot;; }; id?: string | undefined; ... 6 more ...; position?: number | undefined; }' is not assignable to parameter of type 'SetStateAction&lt;Partial&lt;Lesson&gt;&gt;'.
  Type '(prev: Partial&lt;Lesson&gt;) =&gt; { coverImage: { url: string; ratio: string; position: &quot;top&quot; | &quot;center&quot; | &quot;bottom&quot; | &quot;left&quot; | &quot;right&quot; | &quot;background&quot;; }; id?: string | undefined; ... 6 more ...; position?: number | undefined; }' is not assignable to type '(prevState: Partial&lt;Lesson&gt;) =&gt; Partial&lt;Lesson&gt;'.
    Call signature return types '{ coverImage: { url: string; ratio: string; position: &quot;top&quot; | &quot;center&quot; | &quot;bottom&quot; | &quot;left&quot; | &quot;right&quot; | &quot;background&quot;; }; id?: string | undefined; title?: string | undefined; duration?: number | undefined; ... 4 more ...; position?: number | undefined; }' and 'Partial&lt;Lesson&gt;' are incompatible.
      The types of 'coverImage' are incompatible between these types.
        Property 'alt' is missing in type '{ url: string; ratio: string; position: &quot;top&quot; | &quot;center&quot; | &quot;bottom&quot; | &quot;left&quot; | &quot;right&quot; | &quot;background&quot;; }' but required in type 'ImageSettings'.</problem>
<problem file="index.tsx" line="2" column="22" code="7016">Could not find a declaration file for module 'react-dom/client'. 'C:/Users/Olivier/dyad-apps/RESPIRAPP/node_modules/.pnpm/react-dom@19.2.0_react@19.2.0/node_modules/react-dom/client.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/react-dom` if it exists or add a new declaration (.d.ts) file containing `declare module 'react-dom/client';`</problem>
</dyad-problem-report><think>Initial files ranking:

tsconfig.json: 0.94

components/AdminView.tsx: 0.94

components/admin/AdminView.tsx: 0.92

context/AppContext.tsx: 0.92

components/admin/AdminThemeColorManagement.tsx: 0.88

index.tsx: 0.88

components/admin/AdminSubscriptionTracking.tsx: 0.86

types.ts: 0.86

components/admin/AdminNavigationMap.tsx: 0.85

components/DynamicIcon.tsx: 0.84

components/admin/UrlSelector.tsx: 0.84

src/integrations/supabase/client.ts: 0.84

App.tsx: 0.75

vite.config.ts: 0.73

tsconfig.node.json: 0.70

components/admin/AdminReviewsManagement.tsx: 0.61

AI_RULES.md: 0.59

constants.ts: 0.57

components/admin/AdminAmbienceManagement.tsx: 0.57

components/admin/AdminReviewsSupport.tsx: 0.56

context/ThemeContext.tsx: 0.53

components/admin/AdminNavManagement.tsx: 0.50

components/admin/AdminSliderManagement.tsx: 0.50

components/admin/AdminQuoteManagement.tsx: 0.48

components/admin/AdminEmailCampaigns.tsx: 0.47

components/Header.tsx: 0.46

components/BottomNav.tsx: 0.44

.env.example: 0.43

components/admin/AdminMobileNavManagement.tsx: 0.40

components/admin/AdminInvoiceManagement.tsx: 0.38

components/admin/AdminPromoCodes.tsx: 0.38

components/admin/AdminAccountMenuManagement.tsx: 0.37

context/CourseContext.tsx: 0.36

components/SettingsView.tsx: 0.36

components/CategoryCard.tsx: 0.36

components/admin/AdminFaqManagement.tsx: 0.36

package.json: 0.36

components/admin/AdminGeneralConfig.tsx: 0.35

components/SubscriptionView.tsx: 0.34

components/admin/AdminEngagementStats.tsx: 0.33

components/admin/AdminPageLayout.tsx: 0.33

components/Footer.tsx: 0.32

components/AmbienceView.tsx: 0.32

components/admin/AdminImageTextManagement.tsx: 0.31

components/admin/AdminAboutManagement.tsx: 0.30

components/admin/AdminFooterManagement.tsx: 0.30

components/admin/AdminAmbienceCategoryManagement.tsx: 0.30

components/admin/AdminCourseManagement.tsx: 0.29

components/admin/AdminDiscoverManagement.tsx: 0.29</think><think>Re-ranking the files. Please wait a moment...

</think><dyad-codebase-context files="types.ts,constants.ts,context/AppContext.tsx,components/DynamicIcon.tsx,components/admin/AdminSubscriptionTracking.tsx,components/admin/AdminCourseManagement.tsx,components/admin/AdminPromoCodes.tsx,components/admin/AdminEmailCampaigns.tsx,components/admin/AdminAmbienceCategoryManagement.tsx,components/admin/AdminNavManagement.tsx,components/admin/AdminAccountMenuManagement.tsx,components/admin/AdminSliderManagement.tsx,components/admin/AdminNavigationMap.tsx,components/AdminView.tsx,components/SubscriptionView.tsx,index.tsx"></dyad-codebase-context><think>dyad-token-savings?original-tokens=608253.75&smart-context-tokens=50591.75</think><think>**Examining Error Categorization**

I'm starting to categorize the TypeScript errors. It's a substantial undertaking, 129 errors to address. The initial focus is on understanding the underlying causes. My current focus is the `constants.ts` file, specifically the "Property 'target' is missing in type 'EmailCampaign'" error. This points to a potential type mismatch or missing property in the `EmailCampaign` interface.


**Defining Error Priorities**

I've established a priority approach. Starting with the `constants.ts` file and the `EmailCampaign` type error, I am now focused on the `components` directory. The "style" prop issue in `DynamicIcon.tsx` needs resolution. Next are date handling in `AdminSubscriptionTracking.tsx` and the type mismatch in `AdminUserManagement.tsx`.


**Outlining the Scope**

I've now extensively reviewed the error reports. I have identified the root causes for the initial issues. In `constants.ts` and the `components` directory, specifically `DynamicIcon.tsx`, `AdminSubscriptionTracking.tsx`, `AdminUserManagement.tsx`, `CourseEditModal.tsx`, `AdminReviewsSupport.tsx`, `AdminPromoCodes.tsx`, `AdminEmailCampaignDetail.tsx`, and `AdminEmailCampaigns.tsx`, I have detailed the types of errors. The missing properties and type mismatches seem widespread, and I need to define a clear solution before the next step. I have started to prepare a plan.


**Devising Solutions**

I've started developing solutions for the reported issues. Fixing `@types/react-dom` is complete. I am addressing the `EmailCampaign` type mismatch in `constants.ts`. Then I need to correct the `style` prop issue in `DynamicIcon.tsx` and work my way through the list. I'm considering a more comprehensive approach for managing `AppContext`, to make the component functions and variables more consistent across the app.


**Prioritizing Fixes**

I've identified the initial priorities: installing `@types/react-dom` and addressing the `EmailCampaign` and `DynamicIcon` issues. The core strategy involves correcting type definitions in `types.ts` to resolve mismatches and subsequently adapting the components. Then, I'll delve into fixing `constants.ts` to ensure data consistency, starting with adding a `target` property to align with the type changes.


**Structuring the Approach**

I've now fully documented the error causes and assembled a detailed, actionable plan. I'll install `@types/react-dom`, then update `types.ts`, `constants.ts`, and `Icons.tsx`. The core of the effort is the correction of type definitions and data, and I have specific tasks for `AppContext.tsx` and the components, starting with `AdminUserManagement.tsx` and proceeding systematically through the error list.


**Defining the Approach**

I've analyzed the errors, and it’s clear I need a structured, phased strategy. Fixing `@types/react-dom` is the initial step. The core problem is type mismatches and the missing context variables, so I'll work on `types.ts` first, then address `AppContext`. Next, I need to refactor `constants.ts`. After that, I'll address icon props, and components will be resolved. I've added `types.ts` and the react-dom depencies to the project, and now moving on to the `constants.ts` file.


**Addressing Icon Prop Issues**

I've updated the `IconProps` in `Icons.tsx` to accept standard SVG attributes. This will improve the flexibility for components using icons. I also plan to update `DynamicIcon.tsx` to ensure the `style` prop is passed correctly.


**Strategizing Initial Refactoring**

I've mapped the errors and their causes. I'm addressing `constants.ts` and `types.ts` now. I am also preparing `AppContext.tsx` and the components to implement the necessary fixes. The plan is to correct type definitions in `types.ts`, update `constants.ts` to reflect the changes, and fix icon and component props.


**Implementing Foundational Changes**

I've begun updating the `types.ts` and `constants.ts` files. Specifically, I added the missing `target` property to the `EmailCampaign` type in `types.ts` and then updated the `DEFAULT_EMAIL_CAMPAIGNS` in `constants.ts` accordingly. I'm now moving on to updating `PromoCode`, `Lesson`, and `HomepageSlide` types. Concurrently, I am preparing to address the `IconProps` and `DynamicIcon.tsx` next, followed by initial preparations for the `AppContext.tsx`.


</think>Bonjour ! Je vois que vous faites face à un nombre impressionnant d'erreurs TypeScript. C'est le signe d'un désaccord majeur entre vos définitions de types, vos constantes, le contexte de l'application et la manière dont les composants les utilisent.

Ne vous inquiétez pas, je vais procéder à une refonte complète pour tout remettre d'aplomb. Voici mon plan d'action :

1.  **Réparer les types (`types.ts`) :** Je vais corriger et compléter toutes les définitions de types pour qu'elles correspondent à l'utilisation réelle dans votre code. Cela inclut l'ajout de propriétés manquantes (comme `alt` pour les images), la correction de noms (par exemple, `cover_image` en `coverImage`), et l'ajout de types entièrement nouveaux comme `Invoice`.
2.  **Mettre à jour les constantes (`constants.ts`) :** J'ajouterai les données par défaut manquantes (`DEFAULT_INVOICES`, `DEFAULT_USERS`, etc.) et mettrai à jour les structures de données existantes pour qu'elles correspondent aux nouveaux types.
3.  **Enrichir le contexte (`AppContext.tsx`) :** Je vais ajouter tous les états et fonctions manquants que vos composants essaient d'appeler, notamment les nombreuses fonctions de navigation (`navigateToSettings`, `navigateToAdminDashboard`, etc.) et les états pour les utilisateurs, les factures et les campagnes email.
4.  **Standardiser les icônes (`Icons.tsx` et `DynamicIcon.tsx`) :** Je vais mettre à jour la définition de base de vos icônes pour qu'elles acceptent toutes les propriétés SVG standard (`style`, `onClick`, `title`, etc.), ce qui corrigera des dizaines d'erreurs dans l'ensemble de l'application.
5.  **Installer les dépendances manquantes :** J'ajouterai le paquet `@types/react-dom` pour résoudre l'erreur de compilation dans votre fichier d'entrée `index.tsx`.
6.  **Corriger tous les composants :** Enfin, je passerai en revue chaque fichier erroné pour aligner son code avec les nouvelles définitions de types et le contexte mis à jour.

C'est une grosse intervention, mais elle est nécessaire pour stabiliser votre base de code. Allons-y.

<dyad-add-dependency packages="@types/react-dom" dev="true"></dyad-add-dependency>
<dyad-write path="types.ts" description="Updating and adding numerous type definitions to match component usage.">
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
  | 'settings'
  | 'my-courses';

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
  | 'ambienceDisplayManagement'
  | 'course-detail'
  | 'emailCampaignDetail'
  | 'emailCampaignEditor';


export interface ImageSettings {
  url: string;
  alt: string;
  ratio: string;
  position: 'top' | 'center' | 'bottom' | 'left' | 'right' | 'background';
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
  position: number;
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
  position: number;
}

export type ReviewStatus = 'En attente' | 'Approuvé' | 'Rejeté';

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
  totalDuration: number;
  lessonCount: number;
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
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    status: 'active' | 'inactive';
    usageCount: number;
    usageLimit: number | null;
    startDate: string | null;
    endDate: string | null;
    applicablePlanIds: SubscriptionPlanId[];
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
    name: string;
    image: string;
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
    image: ImageSettings;
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
    recipientCount: number;
}

export type PageSettings = { [key in View]?: { showHeader: boolean } };

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export interface Invoice {
    id: string;
    userName: string;
    userEmail: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
    items: InvoiceItem[];
}