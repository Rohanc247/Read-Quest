import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('start');

  useEffect(() => {
    const savedId = localStorage.getItem('readquest_player_id');
    if (savedId) {
      loadPlayer(savedId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadPlayer = async (id) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        setPlayer(data);
        updateStreak(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateStreak = async (p) => {
    const today = new Date().toDateString();
    const last = p.last_played_date;
    if (last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = last === yesterday ? (p.current_streak || 0) + 1 : 1;
    const updates = {
      last_played_date: today,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, p.longest_streak || 0),
    };
    await supabase.from('players').update(updates).eq('id', p.id);
    setPlayer(prev => ({ ...prev, ...updates }));
  };

  const login = async (username, password) => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('username', username)
      .single();
    if (error || !data) throw new Error('Username not found');
    if (data.password_hash !== btoa(password)) throw new Error('Incorrect password');
    localStorage.setItem('readquest_player_id', data.id);
    setPlayer(data);
    updateStreak(data);
    return data;
  };

  const register = async (username, password) => {
    const { data: existing } = await supabase
      .from('players')
      .select('id')
      .eq('username', username)
      .single();
    if (existing) throw new Error('Username already taken');
    const { data, error } = await supabase
      .from('players')
      .insert([{
        username,
        password_hash: btoa(password),
        current_zone: 'forest',
        current_grade: 1,
        difficulty: 'grade1',
        total_play_time: 0,
        current_streak: 1,
        longest_streak: 1,
        last_played_date: new Date().toDateString(),
        words_learned: 0,
        comprehension_questions_answered: 0,
        perfect_quiz_scores: 0,
        bosses_defeated: [],
        achievements: [],
        zone_progress: {},
        settings: { masterVolume: 80, musicVolume: 70, sfxVolume: 80, voiceVolume: 60 },
      }])
      .select()
      .single();
    if (error) throw new Error('Could not create account');
    localStorage.setItem('readquest_player_id', data.id);
    setPlayer(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('readquest_player_id');
    setPlayer(null);
    setScreen('start');
  };

  const updatePlayer = async (updates) => {
    if (!player) return;
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', player.id)
      .select()
      .single();
    if (!error && data) setPlayer(data);
    return data;
  };

  const defeatBoss = async (bossId) => {
    if (!player) return;
    const newBosses = [...(player.bosses_defeated || [])];
    if (!newBosses.includes(bossId)) newBosses.push(bossId);
    await updatePlayer({ bosses_defeated: newBosses });
  };

  const addAchievement = async (achievementId, tier) => {
    if (!player) return;
    const existing = (player.achievements || []);
    const idx = existing.findIndex(a => a.id === achievementId);
    let updated;
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = { ...updated[idx], tier };
    } else {
      updated = [...existing, { id: achievementId, tier, earned_at: new Date().toISOString() }];
    }
    await updatePlayer({ achievements: updated });
  };

  return (
    <GameContext.Provider value={{
      player, setPlayer, loading, screen, setScreen,
      login, register, logout, updatePlayer,
      defeatBoss, addAchievement,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
};

const updatePlayer = async (updates) => {
  if (!player) return;
  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', player.id)
    .select()
    .single();
  if (error) console.error('updatePlayer error:', error); // add this
  if (!error && data) setPlayer(data);
  return data;
};