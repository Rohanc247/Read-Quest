import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/gameContext';

const GRADES = [
  { value: 'grade1', label: '1ST GRADE', desc: 'Sight words & simple sentences' },
  { value: 'grade2', label: '2ND GRADE', desc: 'Short stories & paragraphs' },
  { value: 'grade3', label: '3RD GRADE', desc: 'Chapter books & summarizing' },
  { value: 'grade4', label: '4TH GRADE', desc: 'Theme analysis & opinion writing' },
  { value: 'grade5', label: '5TH GRADE', desc: 'Inference & essay writing' },
  { value: 'grade6', label: '6TH GRADE', desc: 'Literary analysis & persuasion' },
  { value: 'grade7', label: '7TH GRADE', desc: 'Symbolism & argumentative writing' },
  { value: 'grade8', label: '8TH GRADE', desc: 'Critical analysis & thesis' },
];


const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function SettingsModal({ onClose }) {
  const { player, updatePlayer } = useGame();
  const [difficulty, setDifficulty] = useState('grade1');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (player) {
      setDifficulty(player.difficulty || 'grade1');
    }
  }, [player]);

  const handleSave = async () => {
    if (player) await updatePlayer({ difficulty });
    else localStorage.setItem('readquest_settings', JSON.stringify({ difficulty }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        className="panel w-full max-w-md p-7 max-h-[90vh] overflow-y-auto relative"
      >
        <button onClick={onClose} className="absolute top-3 right-3 btn-pixel bg-muted text-muted-foreground p-2">
          <CloseIcon />
        </button>

        <h2 className="font-game text-primary mb-1" style={{ fontSize: '0.75rem' }}>OPTIONS</h2>
        <p className="font-vt text-muted-foreground text-xl tracking-wide mb-6">configure your experience</p>

        {/* Difficulty */}
        <div className="mb-6">
          <p className="font-game text-foreground mb-3" style={{ fontSize: '0.55rem' }}>DIFFICULTY / GRADE</p>
          <div className="grid grid-cols-1 gap-1.5">
            {GRADES.map(g => (
              <button
                key={g.value}
                onClick={() => setDifficulty(g.value)}
                className="text-left px-3 py-2 border-2 transition-none flex items-center justify-between"
                style={{
                  borderColor: difficulty === g.value ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  background: difficulty === g.value ? 'hsl(var(--primary) / 0.12)' : 'hsl(var(--muted))',
                  boxShadow: difficulty === g.value ? '2px 2px 0px rgba(0,0,0,0.4)' : 'none',
                }}
              >
                <div>
                  <span className="font-game text-foreground" style={{ fontSize: '0.5rem' }}>{g.label}</span>
                  <p className="font-body text-muted-foreground text-xs mt-0.5">{g.desc}</p>
                </div>
                {difficulty === g.value && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="hsl(var(--primary))">
                    <path d="M1 5l3 3 5-6"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`btn-pixel-lg w-full ${saved ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}
        >
          {saved ? 'SAVED !' : 'SAVE & CLOSE'}
        </button>
      </motion.div>
    </motion.div>
  );
}