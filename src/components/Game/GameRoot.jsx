import React from 'react';
import { useGame } from '@/lib/gameContext';
import { ZONES } from '@/lib/gameData';
import StartScreen from './StartScreen';
import OverworldMap from './OverworldMap';
import ZonePage from './ZonePage.jsx';
import BossBattle from './BossBattle';

export default function GameRoot() {
  const { screen, loading } = useGame();

  if (loading) {
    return (
      <div className="min-h-screen stars-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">📖</div>
          <p className="font-game text-2xl text-primary animate-pulse-glow">Loading ReadQuest...</p>
        </div>
      </div>
    );
  }

  if (screen === 'start') return <StartScreen />;
  if (screen === 'worldmap') return <OverworldMap />;

  // Boss battles: "boss_{zoneId}_{bossId}" where zoneId is one of the zone ids
  if (screen.startsWith('boss_')) {
    const withoutPrefix = screen.slice(5); // remove "boss_"
    // Find which zone this is for
    const zone = ZONES.find(z => withoutPrefix.startsWith(z.id + '_'));
    if (zone) {
      const bossId = withoutPrefix.slice(zone.id.length + 1);
      return <BossBattle zoneId={zone.id} bossId={bossId} />;
    }
  }

  // Zone pages: "zone_{zoneId}"
  if (screen.startsWith('zone_')) {
    const zoneId = screen.slice(5);
    const zone = ZONES.find(z => z.id === zoneId);
    if (zone) return <ZonePage zoneId={zoneId} />;
  }

  return <StartScreen />;
}