import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GRADE_LEARNING } from '@/lib/gameData';

export default function LearningPage({ grade, zoneName, onClose }) {
  const data = GRADE_LEARNING[grade] || GRADE_LEARNING[1];
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to the Learning Zone!',
      icon: '📖',
      content: (
        <div className="text-center space-y-4">
          <p className="font-body text-muted-foreground">{data.description}</p>
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
            <p className="font-game text-primary text-lg">{data.title}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Focus Areas',
      icon: '🎯',
      content: (
        <div className="space-y-3">
          {data.focusAreas.map((area, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border"
            >
              <span className="text-primary font-game text-lg">→</span>
              <span className="font-body text-foreground">{area}</span>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: 'What You\'ll Do',
      icon: '⚔️',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: '📚', text: 'Read grade-appropriate books and passages' },
              { icon: '✍️', text: 'Complete writing activities and exercises' },
              { icon: '🧠', text: 'Answer comprehension questions to damage bosses' },
              { icon: '💡', text: 'Learn new vocabulary and grammar rules' },
              { icon: '🏆', text: 'Earn achievements and defeat zone bosses!' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-body text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
          <div className="bg-secondary/20 border border-secondary/30 rounded-xl p-4 text-center">
            <p className="font-game text-secondary">Example Achievement</p>
            <p className="font-body text-sm text-muted-foreground mt-1">{data.exampleAchievement}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Battle Rules',
      icon: '⚠️',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { icon: '✅', color: 'text-accent', text: 'Answer correctly → Deal damage to the boss!' },
              { icon: '❌', color: 'text-destructive', text: 'Answer wrong → Lose 1 health point' },
              { icon: '💀', color: 'text-destructive', text: '3 wrong answers → You lose, but can try again!' },
              { icon: '🏆', color: 'text-primary', text: 'Defeat the boss → Earn achievements and unlock next!' },
              { icon: '📖', color: 'text-secondary', text: 'You can always revisit this learning page!' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border"
              >
                <span className={`text-2xl font-game ${item.color}`}>{item.icon}</span>
                <span className="font-body text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        className="card-game w-full max-w-lg p-8 relative max-h-[90vh] flex flex-col"
      >
        {/* Skip */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-body text-muted-foreground hover:text-foreground text-sm"
        >
          Skip →
        </button>

        {/* Step indicator */}
        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{steps[step].icon}</div>
          <h2 className="font-game text-2xl text-primary">{steps[step].title}</h2>
          <p className="font-body text-xs text-muted-foreground">{zoneName} — Grade {grade}</p>
        </div>

        <div className="flex-1 overflow-y-auto mb-6">
          {steps[step].content}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="btn-game flex-1 bg-muted text-foreground"
            >
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="btn-game flex-1 bg-primary text-primary-foreground"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn-game flex-1 bg-accent text-accent-foreground"
            >
              ⚔️ Let's Battle!
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}