import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/gameContext';
import { ZONES } from '@/lib/gameData';

const BackIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
    <path d="M7 1L3 5l4 4H5L1 5l4-4h2z"/>
  </svg>
);

export default function WorldMap() {
  const { player, setScreen } = useGame();
  const [hoveredZone, setHoveredZone] = useState(null);

  const bosses_defeated = player?.bosses_defeated || [];

  const getZoneProgress = (zone) => {
    const total = zone.bosses.length;
    const done = zone.bosses.filter(b => bosses_defeated.includes(b.id)).length;
    return { done, total };
  };

  const handleZoneClick = (zone) => setScreen(`zone_${zone.id}`);

  const totalBosses = ZONES.reduce((a, z) => a + z.bosses.length, 0);

  return (
    <div className="min-h-screen bg-background relative">

      {/* Header bar */}
      <div className="panel border-x-0 border-t-0 px-4 py-3 flex items-center justify-between relative z-10">
        <button
          onClick={() => setScreen('start')}
          className="btn-pixel bg-muted text-foreground flex items-center gap-2"
        >
          <BackIcon />
          MENU
        </button>
        <h1 className="font-game text-primary" style={{ fontSize: '0.65rem' }}>WORLD MAP</h1>
        <div className="text-right">
          <p className="font-game text-foreground" style={{ fontSize: '0.55rem' }}>{player?.username || '???'}</p>
          <p className="font-vt text-muted-foreground text-lg leading-none">{player?.current_streak || 0} day streak</p>
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-4 pt-4 pb-2 relative z-10">
        <p className="font-vt text-muted-foreground text-xl tracking-wide">
          SELECT A ZONE — ALL AREAS ACCESSIBLE
        </p>
      </div>

      {/* Zone grid */}
      <div className="max-w-5xl mx-auto px-4 pb-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {ZONES.map((zone, idx) => {
            const { done, total } = getZoneProgress(zone);
            const isComplete = done === total;
            const hasProgress = done > 0 && !isComplete;

            return (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                className="relative text-left p-3 panel cursor-pointer transition-none"
                style={{
                  borderColor: hoveredZone === zone.id ? zone.color : 'hsl(var(--border))',
                  boxShadow: hoveredZone === zone.id
                    ? `4px 4px 0px ${zone.color}88`
                    : '4px 4px 0px rgba(0,0,0,0.6)',
                }}
              >
                {/* Status pip */}
                <div className="absolute top-2 right-2">
                  {isComplete ? (
                    <div className="w-3 h-3" style={{ background: zone.color }} />
                  ) : hasProgress ? (
                    <div className="w-3 h-3 border-2" style={{ borderColor: zone.color }} />
                  ) : (
                    <div className="w-3 h-3 border-2 border-border" />
                  )}
                </div>

                {/* Zone emoji large */}
                <div className="text-3xl mb-2 leading-none">{zone.emoji}</div>

                <p className="font-game text-foreground leading-snug mb-0.5" style={{ fontSize: '0.5rem' }}>
                  {zone.name.toUpperCase()}
                </p>
                <p className="font-vt text-muted-foreground text-lg">
                  GR.{zone.grade || '?'}
                </p>

                {/* Hard pixel progress bar */}
                <div className="mt-2 pixel-bar w-full">
                  <div
                    className="pixel-bar-fill"
                    style={{ width: `${(done / total) * 100}%`, background: zone.color }}
                  />
                </div>
                <p className="font-vt text-muted-foreground text-base mt-1">
                  {done}/{total} BOSSES
                </p>

                {/* Hover boss list */}
                {hoveredZone === zone.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute left-0 right-0 panel z-20 p-2 text-xs font-vt"
                    style={{ top: '100%', marginTop: 2, borderColor: zone.color, zIndex: 20 }}
                  >
                    {zone.bosses.map(b => (
                      <div key={b.id} className="flex items-center gap-2 py-0.5 text-base">
                        <div
                          className="w-2 h-2 flex-shrink-0"
                          style={{ background: bosses_defeated.includes(b.id) ? zone.color : 'transparent', border: `2px solid ${zone.color}` }}
                        />
                        <span className={bosses_defeated.includes(b.id) ? 'text-muted-foreground line-through' : 'text-foreground'}>
                          {b.name}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

 