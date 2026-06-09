import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/gameContext';
import {ACHIEVEMENTS} from '@/lib/gameData';
import {TIER_CONFIG} from '@/lib/gameData';
import {ZONES} from '@/lib/gameData';

const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'emerald', 'ruby', 'sapphire', 'diamond'];

function TierBadge({ tier }) {
  const cfg = TIER_CONFIG[tier];
  if (!cfg) return null;
  return (
    <span
      className="font-game text-xs px-2 py-0.5 rounded-full border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
}

function GlobalAchievementCard({ achievement, playerAchievements, playerStats }) {
  const earned = playerAchievements.find(a => a.id === achievement.id);
  const currentTierIdx = earned ? TIER_ORDER.indexOf(earned.tier) : -1;
  const nextTier = achievement.tiers[currentTierIdx + 1];

  // Get progress value from player stats
  const getValue = (id) => {
    if (!playerStats) return 0;
    if (id === 'consistent_player') return Math.floor((playerStats.total_play_time || 0) / 60);
    if (id === 'streak_warrior') return playerStats.longest_streak || 0;
    if (id === 'word_collector') return playerStats.words_learned || 0;
    if (id === 'comprehension_master') return playerStats.comprehension_questions_answered || 0;
    if (id === 'perfect_score') return playerStats.perfect_quiz_scores || 0;
    return 0;
  };

  const progress = getValue(achievement.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border transition-all ${
        earned ? 'bg-card border-primary/30' : 'bg-muted/30 border-border opacity-70'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{achievement.icon}</span>
          <div>
            <p className="font-game text-base text-foreground">{achievement.name}</p>
            <p className="font-body text-xs text-muted-foreground">{achievement.description}</p>
            {earned && <TierBadge tier={earned.tier} />}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-game text-primary text-sm">{progress}</p>
          {nextTier && (
            <p className="font-body text-xs text-muted-foreground">/{nextTier.requirement} {nextTier.unit}</p>
          )}
        </div>
      </div>

      {/* Tier progress bar */}
      <div className="flex gap-1 mt-3">
        {achievement.tiers.map((t, i) => (
          <div
            key={t.tier}
            className="flex-1 h-1.5 rounded-full transition-all"
            style={{
              background: i <= currentTierIdx ? TIER_CONFIG[t.tier].color : 'rgba(255,255,255,0.1)'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ZoneAchievementCard({ achievement, playerBosses }) {
  const defeated = (playerBosses || []).includes(achievement.boss);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-xl border flex items-center gap-3 ${
        defeated ? 'bg-card border-accent/30' : 'bg-muted/20 border-border opacity-50'
      }`}
    >
      <span className="text-2xl">{defeated ? achievement.icon : '🔒'}</span>
      <div>
        <p className={`font-game text-sm ${defeated ? 'text-foreground' : 'text-muted-foreground'}`}>
          {achievement.name}
        </p>
        <p className="font-body text-xs text-muted-foreground">{achievement.description}</p>
      </div>
      {defeated && <span className="ml-auto text-accent text-lg">✅</span>}
    </motion.div>
  );
}

export default function AchievementsModal({ onClose }) {
  const { player } = useGame();
  const [tab, setTab] = useState('global');

  const playerAchievements = player?.achievements || [];
  const playerBosses = player?.bosses_defeated || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        className="card-game w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-border">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl">✕</button>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h2 className="font-game text-3xl text-primary">Achievements</h2>
            {!player && <p className="font-body text-muted-foreground text-sm mt-1">Log in to track your achievements!</p>}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            <button
              onClick={() => setTab('global')}
              className={`btn-game text-sm px-4 py-2 shrink-0 ${tab === 'global' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              🌍 Global
            </button>
            {ZONES.map(z => (
              <button
                key={z.id}
                onClick={() => setTab(z.id)}
                className={`btn-game text-sm px-4 py-2 shrink-0 ${tab === z.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {z.emoji} {z.name.split(' ')[0]}
              </button>
            ))}
            <button
              onClick={() => setTab('bosses')}
              className={`btn-game text-sm px-4 py-2 shrink-0 ${tab === 'bosses' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              👹 Bosses
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-3">
          {tab === 'global' && ACHIEVEMENTS.global.map(a => (
            <GlobalAchievementCard key={a.id} achievement={a} playerAchievements={playerAchievements} playerStats={player} />
          ))}

          {tab === 'bosses' && (
            <div className="space-y-3">
              <p className="font-game text-lg text-secondary mb-4">Defeated Bosses</p>
              {ZONES.map(zone => (
                <div key={zone.id} className="mb-4">
                  <p className="font-game text-sm text-muted-foreground mb-2">{zone.emoji} {zone.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {zone.bosses.map(boss => (
                      <div
                        key={boss.id}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          playerBosses.includes(boss.id)
                            ? 'bg-card border-primary/30 opacity-100'
                            : 'bg-muted/20 border-border opacity-40'
                        }`}
                      >
                        <p className="text-2xl">{playerBosses.includes(boss.id) ? boss.emoji : '💀'}</p>
                        <p className="font-game text-xs mt-1 text-foreground/80">{boss.name}</p>
                        {boss.isFinal && <p className="font-game text-xs text-primary">FINAL</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {ZONES.map(zone => tab === zone.id && (
            <div key={zone.id} className="space-y-3">
              <p className="font-game text-lg" style={{ color: zone.color }}>{zone.emoji} {zone.name} Achievements</p>
              {(ACHIEVEMENTS.zone[zone.id] || []).map(a => (
                <ZoneAchievementCard key={a.id} achievement={a} playerBosses={playerBosses} />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}