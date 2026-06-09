import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/gameContext';
import { supabase } from '@/api/base44Client';

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function LoginModal({ onClose }) {
  const { setScreen } = useGame();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) { setError('Fill in all fields.'); return; }
    if (mode === 'register' && password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (mode === 'register' && password.length < 4) { setError('Password too short (min 4).'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('username', username.trim())
          .single();
        if (error || !data) throw new Error('Player not found.');
        if (data.password_hash !== password) throw new Error('Incorrect password.');
      } else {
        const { data: existing } = await supabase
          .from('players')
          .select('id')
          .eq('username', username.trim())
          .single();
        if (existing) throw new Error('Username already taken.');
        const { error } = await supabase
          .from('players')
          .insert([{ username: username.trim(), password_hash: password }]);
        if (error) throw new Error('Could not create account.');
      }
      onClose();
      setScreen('worldmap');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-input border-2 border-border px-3 py-2 font-body text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="panel w-full max-w-sm p-7 relative"
      >
        <button onClick={onClose} className="absolute top-3 right-3 btn-pixel bg-muted text-muted-foreground p-2">
          <CloseIcon />
        </button>

        <div className="flex justify-center mb-5">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="12" width="18" height="14" fill="hsl(var(--primary))"/>
            <rect x="4" y="14" width="14" height="10" fill="hsl(var(--card))"/>
            <rect x="6" y="16" width="4" height="4" fill="hsl(var(--primary))"/>
            <rect x="18" y="14" width="12" height="4" fill="hsl(var(--primary))"/>
            <rect x="26" y="18" width="4" height="4" fill="hsl(var(--primary))"/>
            <rect x="22" y="18" width="2" height="4" fill="hsl(var(--primary))"/>
          </svg>
        </div>

        <h2 className="font-game text-primary text-center mb-1" style={{ fontSize: '0.75rem' }}>
          {mode === 'login' ? 'SIGN IN' : 'NEW HERO'}
        </h2>
        <p className="font-vt text-muted-foreground text-center text-xl mb-6 tracking-wide">
          {mode === 'login' ? 'enter your credentials' : 'create your account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-game text-foreground block mb-1" style={{ fontSize: '0.55rem' }}>USERNAME</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="your_hero_name" className={inputClass} />
          </div>
          <div>
            <label className="font-game text-foreground block mb-1" style={{ fontSize: '0.55rem' }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className={inputClass} />
          </div>
          {mode === 'register' && (
            <div>
              <label className="font-game text-foreground block mb-1" style={{ fontSize: '0.55rem' }}>CONFIRM PASSWORD</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••" className={inputClass} />
            </div>
          )}

          {error && (
            <div className="border-2 border-destructive px-3 py-2 font-vt text-destructive text-xl">
              ! {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-pixel-lg bg-primary text-primary-foreground w-full mt-2">
            {loading ? 'LOADING...' : mode === 'login' ? 'ENTER WORLD' : 'CREATE HERO'}
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="font-vt text-secondary text-xl hover:text-foreground transition-colors tracking-wide"
          >
            {mode === 'login' ? '> new here? register' : '< already registered? sign in'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}