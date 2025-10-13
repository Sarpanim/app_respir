import React, { useRef, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { CourseProvider } from './context/CourseContext';
import { supabase } from './src/integrations/supabase/client';

import Header from './components/Header';
import HomepageView from './components/HomepageView';
import Player from './components/Player';
import Auth from './components/Auth';
import BottomNav from './components/BottomNav';
import Profile from './components/Profile';
import DiscoverView from './components/DiscoverView';
import CategoryDetailView from './components/CategoryDetailView';
import AmbiencePlayer from './components/AmbiencePlayer';
import AmbienceView from './components/AmbienceView';
import SettingsView from './components/SettingsView';
import SubscriptionView from './components/SubscriptionView';
import AdminView from './components/admin/AdminView';
import Drawer from './components/Drawer';
import AboutView from './components/AboutView';
import PlayerView from './components/PlayerView';
import MiniPlayer from './components/MiniPlayer';
import EditProfileView from './components/EditProfileView';
import NotificationsView from './components/NotificationsView';
import HelpFaqView from './components/HelpFaqView';
import ContactSupportView from './components/ContactSupportView';
import PrivacyPolicyView from './components/PrivacyPolicyView';
import InviteFriendView from './components/InviteFriendView';
import Footer from './components/Footer';

/* ---------------------------- Main App Content ---------------------------- */

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const {
    isAuthenticated, currentView, isSettingsOpen, toggleSettings,
    currentlyPlayingLesson, currentlyPlayingAmbience, isPlaying, _seekRequest,
    _updateAudioTime, _handleAudioEnded, _clearSeekRequest, generalSettings,
    pageSettings, setShowAuth, login
  } = useAppContext();

  const audioRef = useRef<HTMLAudioElement>(null);

  /* ---------- Restauration de session Supabase (Google OAuth) ---------- */
  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        login();
        setShowAuth(false);
      }
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        login();
        setShowAuth(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [login, setShowAuth]);

  /* -------------------------- Thème et couleurs -------------------------- */
  useEffect(() => {
    document.documentElement.className = theme;
    const bgColor = theme === 'dark'
      ? generalSettings.themeColors['dark-bg']
      : generalSettings.themeColors['light-bg'];

    if (bgColor) {
      if (!bgColor.includes('gradient')) {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bgColor);
      }
      document.body.style.background = bgColor;
    }
  }, [theme, generalSettings.themeColors]);

  useEffect(() => {
    if (generalSettings.themeColors) {
      const root = document.documentElement;
      for (const [key, value] of Object.entries(generalSettings.themeColors)) {
        root.style.setProperty(`--color-${key}`, value);
      }
    }
  }, [generalSettings.themeColors]);

  useEffect(() => {
    if (isSettingsOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isSettingsOpen]);

  /* ----------------------------- Audio Player ----------------------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const source = currentlyPlayingLesson?.audio || currentlyPlayingAmbience?.audio;

    if (source) {
      const isNewSource = !audio.src.endsWith(source);
      if (isNewSource) audio.src = source;

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (error.name !== 'AbortError') console.error('Audio playback failed', error);
          });
        }
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [isPlaying, currentlyPlayingLesson, currentlyPlayingAmbience]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && _seekRequest !== null) {
      audio.currentTime = _seekRequest;
      _clearSeekRequest();
    }
  }, [_seekRequest, _clearSeekRequest]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      _updateAudioTime(audioRef.current.currentTime, audioRef.current.duration);
    }
  };

  /* ----------------------------- Auth Check ----------------------------- */
  if (!isAuthenticated) return <Auth />;

  /* -------------------------- View Dispatcher -------------------------- */
  const renderMainContent = () => {
    switch (currentView) {
      case 'grid': return <HomepageView />;
      case 'player': return <Player />;
      case 'discover': return <DiscoverView />;
      case 'ambience': return <AmbienceView />;
      case 'profile': return <Profile />;
      case 'subscription': return <SubscriptionView />;
      case 'category-detail': return <CategoryDetailView />;
      case 'about': return <AboutView />;
      case 'admin': return <AdminView />;
      case 'edit-profile': return <EditProfileView />;
      case 'notifications': return <NotificationsView />;
      case 'help-faq': return <HelpFaqView />;
      case 'contact-support': return <ContactSupportView />;
      case 'privacy-policy': return <PrivacyPolicyView />;
      case 'invite-friend': return <InviteFriendView />;
      case 'ambience-player': return <AmbiencePlayer />;
      case 'player-view': return <PlayerView />;
      default: return <HomepageView />;
    }
  };

  const showChrome = pageSettings[currentView]?.showHeader ?? true;

  /* ------------------------------- Layout ------------------------------- */
  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={_handleAudioEnded}
      />

      {showChrome ? (
        <div className="min-h-screen font-lato transition-colors duration-300">
          <div
            className="fixed inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
            style={{ backgroundImage: "url('/grain-texture.png')" }}
          ></div>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28 flex-grow">
              {renderMainContent()}
            </main>
            <Footer />
            <BottomNav />
          </div>
          <Drawer isOpen={isSettingsOpen} onClose={toggleSettings}>
            <SettingsView />
          </Drawer>
          {(currentlyPlayingLesson || currentlyPlayingAmbience) && <MiniPlayer />}
        </div>
      ) : (
        renderMainContent()
      )}
    </>
  );
};

/* ------------------------------- Root App ------------------------------- */

const App: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider>
        <CourseProvider>
          <AppContent />
        </CourseProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
