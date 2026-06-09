import React from 'react';
import { motion } from 'framer-motion';

export default function CreditsModal({ onClose }) {
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
        className="card-game w-full max-w-md p-8 text-center relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl">✕</button>

        <div className="text-6xl mb-4 animate-float">✨</div>
        <h2 className="font-game text-3xl text-primary mb-6">Credits</h2>

        <div className="space-y-6">
          <div className="bg-muted/40 rounded-2xl p-6 border border-primary/20">
            <p className="font-game text-2xl text-secondary mb-2">Created by</p>
            <p className="font-game text-4xl text-primary glow-gold">Rohan Chib</p>
          </div>

          <div className="bg-muted/40 rounded-2xl p-6 border border-secondary/20">
            <p className="font-game text-lg text-muted-foreground mb-2">When</p>
            <p className="font-game text-2xl text-foreground">The Summer of</p>
            <p className="font-game text-2xl text-secondary">Senior Year of High School</p>
          </div>

          <div className="bg-muted/40 rounded-2xl p-6 border border-accent/20">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              ReadQuest Adventure was built with passion to help young readers build strong habits while going on epic adventures. 
              Every zone, every boss, every word learned — all designed to make reading feel like a superpower.
            </p>
          </div>

          <div className="text-muted-foreground">
            <p className="font-game text-sm">🎮 Game Design & Development</p>
            <p className="font-game text-sm">📚 Educational Content</p>
            <p className="font-game text-sm">🎨 Art & Visual Direction</p>
            <p className="font-game text-primary text-xl mt-2">Rohan Chib</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-game mt-6 bg-primary text-primary-foreground px-8"
        >
          Back to Menu
        </button>
      </motion.div>
    </motion.div>
  );
}