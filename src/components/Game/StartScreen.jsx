import React, { useState } from 'react';
import { useGame } from '@/lib/gameContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from '@/components/game/LoginModal';
import SettingsModal from '@/components/game/SettingsModal';
import AchievementsModal from '@/components/game/AchievementsModal';
import CreditsModal from '@/components/game/CreditsModal';

// SVG icons — no emoji in buttons
const SwordIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 14L9 7l1 1-7 7H2v-1zm7-7L3 1h1l8 8-1 1-1-1-1 2zM11 1l1 1-2 2-1-1 2-2zm1 1l1 1-1 1-1-1 1-1z"/>
    <path d="M1 13l2 2H1v-2z"/>
    <rect x="11" y="0" width="2" height="6" transform="rotate(45 12 3)"/>
  </svg>
);
const TrophyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h2V1h8v1h2v5c0 2-1.5 3.5-3.5 4-.5 1-1 2-2.5 2v1h2v1H6v-1h2v-1c-1.5-.5-2-1-2.5-2C3.5 10.5 2 9 2 7V2zm2 0v5c0 1.5 1 2.5 2 3V3H4zm6 0v5c0 1.5-1 2.5-2 3V3h2zm2 0h-1v4.5c1-.5 1-1.5 1-2V2z"/>
  </svg>
);
const GearIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 5a3 3 0 1 0 0 6A3 3 0 0 0 8 5zm0 1a2 2 0 1 1 0 4A2 2 0 0 1 8 6z"/>
    <path d="M9.5 0h-3l-.5 2-.9.4-1.8-1-2.1 2.1 1 1.8L1.8 6.5 0 6.5v3l2 .5.4.9-1 1.8 2.1 2.1 1.8-1 .9.4.5 2h3l.5-2 .9-.4 1.8 1 2.1-2.1-1-1.8.4-.9 2-.5v-3l-2-.5-.4-.9 1-1.8L12.9 2.1l-1.8 1-.9-.4L9.5 0zm-1.5 1h1l.4 1.7 1.4.6 1.4-.8 1 1-1 1.4.6 1.4L15 7v1l-1.7.4-.6 1.4.8 1.4-1 1-1.4-.8-1.4.6L9 15H8l-.4-1.7-1.4-.6-1.4.8-1-1 .8-1.4L4 9.7 1 9V8l1.7-.4.6-1.4L2.5 4.8l1-1 1.4.8 1.4-.6L7 1z"/>
  </svg>
);
const ScrollIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3zm2 3h6v1H5V4zm0 2h6v1H5V6zm0 2h4v1H5V8z"/>
  </svg>
);

export default function StartScreen() {
  const { player, setScreen, logout } = useGame();
  const [modal, setModal] = useState(null);

  const handlePlay = () => {
    if (player) setScreen('worldmap');
    else setModal('login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs px-4">

        {/* Logo block */}
        <div className="text-center mb-10">
          {/* Pixel book icon */}
          <div className="flex justify-center mb-5">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" fill="hsl(var(--primary))" />
              <rect x="6" y="6" width="20" height="20" fill="hsl(var(--primary-foreground))" />
              <rect x="8" y="9" width="12" height="2" fill="hsl(var(--primary))" />
              <rect x="8" y="13" width="14" height="2" fill="hsl(var(--primary))" />
              <rect x="8" y="17" width="10" height="2" fill="hsl(var(--primary))" />
              <rect x="14" y="4" width="2" height="24" fill="hsl(var(--primary))" />
            </svg>
          </div>

          <h1 className="font-game text-primary leading-tight mb-1" style={{ fontSize: '1.5rem' }}>
            READ<br />QUEST
          </h1>
          <p className="font-vt text-secondary text-2xl tracking-widest mt-2">ADVENTURE</p>

          {player && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 panel px-4 py-3 text-left"
            >
              <p className="font-game text-primary text-xs leading-loose">
                HERO: <span className="text-foreground">{player.username}</span>
              </p>
              <p className="font-vt text-muted-foreground text-lg leading-none mt-1">
                {player.current_streak} day streak
              </p>
            </motion.div>
          )}
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handlePlay}
            className="btn-pixel-lg bg-primary text-primary-foreground w-full flex items-center justify-center gap-3"
          >
            <SwordIcon />
            {player ? 'CONTINUE' : 'NEW GAME'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setModal('achievements')}
              className="btn-pixel flex-1 bg-muted text-foreground flex items-center justify-center gap-2"
            >
              <TrophyIcon />
              TROPHIES
            </button>
            <button
              onClick={() => setModal('settings')}
              className="btn-pixel flex-1 bg-muted text-foreground flex items-center justify-center gap-2"
            >
              <GearIcon />
              OPTIONS
            </button>
          </div>

          <button
            onClick={() => setModal('credits')}
            className="btn-pixel bg-transparent text-muted-foreground border-border/40 w-full flex items-center justify-center gap-2"
          >
            <ScrollIcon />
            CREDITS
          </button>

          {player && (
            <button
              onClick={logout}
              className="font-vt text-muted-foreground text-xl hover:text-foreground transition-colors mt-1 tracking-widest text-center"
            >
              [ switch account ]
            </button>
          )}
        </div>


      </div>

      <AnimatePresence>
        {modal === 'login' && <LoginModal onClose={() => setModal(null)} />}
        {modal === 'settings' && <SettingsModal onClose={() => setModal(null)} />}
        {modal === 'achievements' && <AchievementsModal onClose={() => setModal(null)} />}
        {modal === 'credits' && <CreditsModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}