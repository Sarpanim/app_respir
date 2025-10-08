

import React, { useRef, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { CourseProvider } from './context/CourseContext';
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

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const { 
    isAuthenticated, currentView, isSettingsOpen, toggleSettings,
    currentlyPlayingLesson, currentlyPlayingAmbience, isPlaying, _seekRequest,
    _updateAudioTime, _handleAudioEnded, _clearSeekRequest, generalSettings,
    pageSettings
  } = useAppContext();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.documentElement.className = theme;
    const bgColor = theme === 'dark' ? generalSettings.themeColors['dark-bg'] : generalSettings.themeColors['light-bg'];
    
    if (bgColor) {
        // For theme-color meta, don't set if it's a gradient
        if (!bgColor.includes('gradient')) {
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bgColor);
        }
        // Apply background directly to body to support gradients
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
    if(isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [isSettingsOpen]);

  // --- Global Audio Player Logic ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const source = currentlyPlayingLesson?.audio || currentlyPlayingAmbience?.audio;

    if (source) {
        const isNewSource = !audio.src.endsWith(source);
        if (isNewSource) {
            audio.src = source;
        }

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Ignore AbortError which is common when playback is interrupted
                    if (error.name !== 'AbortError') {
                        console.error("Audio playback failed", error);
                    }
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
  }, [_seekRequest]);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
        _updateAudioTime(audioRef.current.currentTime, audioRef.current.duration);
    }
  };

  if (!isAuthenticated) {
    return <Auth />;
  }
  
  const renderMainContent = () => {
    switch(currentView) {
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
  
  return (
    <>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} onEnded={_handleAudioEnded} />
      
      {showChrome ? (
        <div className="min-h-screen font-lato transition-colors duration-300">
          <div 
            className="fixed inset-0 bg-cover bg-center opacity-20 dark:opacity-10" 
            style={{backgroundImage: "url('/grain-texture.png')"}}
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