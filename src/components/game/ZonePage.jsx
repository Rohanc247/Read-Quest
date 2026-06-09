import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/gameContext';
import { ZONES, GRADE_LEARNING } from '@/lib/gameData';
import LearningPage from '@/components/game/LearningPage';
import ZoneMap from '@/components/game/ZoneMap';

export default function ZonePage({ zoneId }) {
  const { player, setScreen } = useGame();
  const [showLearning, setShowLearning] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'bosses'

  const zone = ZONES.find(z => z.id === zoneId);
  if (!zone) return null;

  const bosses_defeated = player?.bosses_defeated || [];
  const grade = player?.current_grade || 1;
  const defeatedInZone = zone.bosses.filter(b => bosses_defeated.includes(b.id)).length;

  const handleEnterBoss = (bossId) => {
    setScreen(`boss_${zone.id}_${bossId}`);
  };

  const handleExitMap = () => {
    setScreen('worldmap');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b-2 border-border">
        <button onClick={() => setScreen('worldmap')}
          className="btn-pixel bg-muted text-foreground text-xs px-3 py-2">
          &lt; MAP
        </button>
        <div className="text-center">
          <h1 className="font-game text-foreground" style={{ fontSize: '0.65rem' }}>
            {zone.name.toUpperCase()}
          </h1>
          <p className="font-vt text-muted-foreground text-lg">{defeatedInZone}/{zone.bosses.length} BOSSES</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode(v => v === 'map' ? 'bosses' : 'map')}
            className="btn-pixel bg-muted text-foreground text-xs px-3 py-2">
            {viewMode === 'map' ? 'LIST' : 'MAP'}
          </button>
          <button onClick={() => setShowLearning(true)}
            className="btn-pixel bg-muted text-foreground text-xs px-3 py-2">
            STUDY
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full" style={{ minHeight: 'calc(100vh - 80px)' }}>
              <ZoneMap
                zoneId={zoneId}
                onEnterBoss={handleEnterBoss}
                onExit={handleExitMap}
                bosses_defeated={bosses_defeated}
              />
            </motion.div>
          ) : (
            <motion.div key="bosses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-4 pb-8 pt-2">
              <div className="space-y-4">
                {zone.bosses.map((boss, idx) => {
                  const defeated = bosses_defeated.includes(boss.id);
                  return (
                    <motion.button
                      key={boss.id}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => !defeated ? handleEnterBoss(boss.id) : null}
                      className={`w-full p-4 border-2 text-left transition-none ${
                        defeated ? 'opacity-50 cursor-default' : 'cursor-pointer'
                      }`}
                      style={{
                        borderColor: defeated ? 'hsl(var(--border))' : boss.color,
                        background: 'hsl(var(--card))',
                        boxShadow: !defeated ? `3px 3px 0px rgba(0,0,0,0.6)` : 'none',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl ${defeated ? 'opacity-40' : ''}`}>
                          {boss.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-game text-foreground" style={{ fontSize: '0.6rem' }}>{boss.name.toUpperCase()}</h3>
                            {boss.isFinal && (
                              <span className="font-game text-xs border-2 border-red-500 text-red-400 px-1" style={{ fontSize: '0.4rem' }}>FINAL</span>
                            )}
                            {defeated && (
                              <span className="font-game text-xs border-2 border-accent/50 text-accent px-1" style={{ fontSize: '0.4rem' }}>DEFEATED</span>
                            )}
                          </div>
                          <p className="font-vt text-muted-foreground text-lg mt-1">
                            {defeated ? 'DEFEATED' : `BOSS ${idx + 1} — 15 questions to win`}
                          </p>
                          {!defeated && (
                            <div className="flex gap-1 mt-2">
                              {[...Array(boss.hp)].map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-red-500 border-2 border-red-300" />
                              ))}
                            </div>
                          )}
                        </div>
                        {!defeated && <div className="font-vt text-muted-foreground text-2xl">&gt;</div>}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Learning overlay */}
      <AnimatePresence>
        {showLearning && (
          <LearningPage grade={grade} zoneName={zone.name} onClose={() => setShowLearning(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}