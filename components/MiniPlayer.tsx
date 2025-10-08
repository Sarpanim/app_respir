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
                        {isLesson && <button onClick={(e) => { e.stopPropagation(); playPrev(); }} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"><BackwardIcon className="w-5 h-5" /></button>}
                        <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="p-2 bg-accent text-white rounded-full">
                            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                        </button>
                        {isLesson && <button onClick={(e) => { e.stopPropagation(); playNext(); }} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"><ForwardIcon className="w-5 h-5" /></button>}
                        <button onClick={(e) => { e.stopPropagation(); closePlayer(); }} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"><XMarkIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiniPlayer;