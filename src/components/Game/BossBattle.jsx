import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/gameContext';
import { ZONES, ACHIEVEMENTS } from '@/lib/gameData';
import { getQuestionsForZone } from '@/lib/questionLibrary';
import { drawBossAvatar } from '@/components/game/BossAvatar';

function BossCanvas({ bossId, size = 120, shaking = false }) {
  const ref = useRef(null);
  const frameRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = size * 2;
    canvas.height = size * 2;

    const loop = () => {
      frameRef.current++;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sx = shaking ? (Math.sin(frameRef.current * 0.8) * 8) : 0;
      drawBossAvatar(ctx, size + sx, size, size * 0.75, bossId, frameRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bossId, size, shaking]);

  return <canvas ref={ref} style={{ width: size, height: size }} />;
}

const TOTAL_BOSS_HP = 3;
const QUESTIONS_PER_HP = 5;
const TOTAL_QUESTIONS = TOTAL_BOSS_HP * QUESTIONS_PER_HP;
const MAX_PLAYER_WRONG = 3;

export default function BossBattle({ zoneId, bossId }) {
  const { player, setScreen, defeatBoss, updatePlayer, addAchievement } = useGame();
  const playerRef = useRef(player);

  // Keep playerRef in sync
  useEffect(() => { playerRef.current = player; }, [player]);

  const [phase, setPhase] = useState('intro');
  const [bossHp, setBossHp] = useState(TOTAL_BOSS_HP);
  const [playerWrong, setPlayerWrong] = useState(0);
  const [question, setQuestion] = useState(null);
  const [questionPool, setQuestionPool] = useState([]);
  const [poolIndex, setPoolIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [perfectRound, setPerfectRound] = useState(true);

  // Use refs for values needed inside async callbacks
  const correctCountRef = useRef(0);
  const playerWrongRef = useRef(0);
  const perfectRoundRef = useRef(true);
  const poolRef = useRef([]);
  const poolIndexRef = useRef(0);

  const zone = ZONES.find(z => z.id === zoneId);
  const boss = zone?.bosses.find(b => b.id === bossId);
  const grade = player?.current_grade || 1;

  useEffect(() => {
    if (phase === 'battle' && !question) {
      const pool = getQuestionsForZone(zoneId, grade);
      poolRef.current = pool;
      poolIndexRef.current = 0;
      setQuestionPool(pool);
      setPoolIndex(0);
      setQuestion(pool[0]);
      setQuestionCount(1);
    }
  }, [phase]);

  const fetchQuestion = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    let nextIndex = poolIndexRef.current + 1;
    let pool = poolRef.current;
    if (nextIndex >= pool.length) {
      pool = getQuestionsForZone(zoneId, grade);
      poolRef.current = pool;
      nextIndex = 0;
    }
    poolIndexRef.current = nextIndex;
    setPoolIndex(nextIndex);
    setQuestion(pool[nextIndex]);
    setQuestionCount(q => q + 1);
  };

  const handleAnswer = async (idx) => {
    if (selectedAnswer !== null || feedback) return;
    setSelectedAnswer(idx);
    const correct = idx === question.correct_index;
    setFeedback(correct ? 'correct' : 'wrong');

    // Update comprehension count using fresh ref
    const currentPlayer = playerRef.current;
    if (currentPlayer) {
      await updatePlayer({
        comprehension_questions_answered: (currentPlayer.comprehension_questions_answered || 0) + 1,
      });
    }

    if (correct) {
      const newCorrect = correctCountRef.current + 1;
      correctCountRef.current = newCorrect;
      setCorrectCount(newCorrect);
      const newHp = TOTAL_BOSS_HP - Math.floor(newCorrect / QUESTIONS_PER_HP);
      setBossHp(Math.max(0, newHp));
      if (newCorrect >= TOTAL_QUESTIONS) {
        setTimeout(() => handleVictory(), 1800);
      } else {
        setTimeout(() => fetchQuestion(), 1800);
      }
    } else {
      perfectRoundRef.current = false;
      setPerfectRound(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      const newWrong = playerWrongRef.current + 1;
      playerWrongRef.current = newWrong;
      setPlayerWrong(newWrong);
      if (newWrong >= MAX_PLAYER_WRONG) {
        setTimeout(() => setPhase('defeat'), 1800);
      } else {
        setTimeout(() => fetchQuestion(), 1800);
      }
    }
  };

  const handleVictory = async () => {
    setPhase('victory');
    await defeatBoss(boss.id);

    const zoneAchievements = ACHIEVEMENTS.zone[zone.id] || [];
    const bossAchievement = zoneAchievements.find(a => a.boss === boss.id);
    if (bossAchievement) {
      await addAchievement(bossAchievement.id, 'gold');
    }

    if (perfectRoundRef.current) {
      const currentPlayer = playerRef.current;
      if (currentPlayer) {
        await updatePlayer({ perfect_quiz_scores: (currentPlayer.perfect_quiz_scores || 0) + 1 });
      }
    }
  };

  const handleRetry = () => {
    setBossHp(TOTAL_BOSS_HP);
    setPlayerWrong(0);
    setQuestionCount(0);
    setCorrectCount(0);
    setQuestion(null);
    setQuestionPool([]);
    setPoolIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setPerfectRound(true);
    correctCountRef.current = 0;
    playerWrongRef.current = 0;
    perfectRoundRef.current = true;
    poolRef.current = [];
    poolIndexRef.current = 0;
    setPhase('battle');
  };

  if (!zone || !boss) return null;

  const playerHp = MAX_PLAYER_WRONG - playerWrong;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header HUD */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b-2 border-border">
        <button
          onClick={() => setScreen(`zone_${zone.id}`)}
          className="btn-pixel bg-muted text-foreground text-xs px-3 py-2"
        >
          &lt; ZONE
        </button>
        <div className="text-center">
          <p className="font-game text-foreground" style={{ fontSize: '0.55rem' }}>{zone.name.toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(MAX_PLAYER_WRONG)].map((_, i) => (
            <div key={i} className={`w-5 h-5 border-2 transition-all ${
              i < playerHp ? 'bg-red-500 border-red-400' : 'bg-transparent border-gray-600'
            }`} />
          ))}
        </div>
      </div>

      {/* INTRO */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6"><BossCanvas bossId={boss.id} size={140} /></div>
            <h2 className="font-game text-foreground mb-2 leading-snug" style={{ fontSize: '1rem' }}>{boss.name.toUpperCase()}</h2>
            {boss.isFinal && (
              <p className="font-game text-red-400 mb-3 border-2 border-red-500 px-3 py-1 inline-block" style={{ fontSize: '0.5rem' }}>!! FINAL BOSS !!</p>
            )}
            <p className="font-vt text-muted-foreground text-xl mb-6 max-w-xs mx-auto leading-snug">
              Answer 15 questions to win. 5 correct = 1 damage. 3 wrong = defeat.
            </p>
            <div className="flex gap-2 mb-8 justify-center">
              {[...Array(TOTAL_BOSS_HP)].map((_, i) => (
                <div key={i} className="w-7 h-7 border-2" style={{ background: boss.color, borderColor: boss.color }} />
              ))}
              <span className="font-vt text-muted-foreground text-xl self-center ml-2">HP</span>
            </div>
            <button onClick={() => setPhase('battle')} className="btn-pixel-lg bg-primary text-primary-foreground">
              BEGIN BATTLE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BATTLE */}
      <AnimatePresence>
        {phase === 'battle' && (
          <motion.div key="battle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-between p-4 max-w-2xl mx-auto w-full">
            <motion.div className="text-center py-2"
              animate={isShaking ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}>
              <div className="flex justify-center mb-2">
                <BossCanvas bossId={boss.id} size={100} shaking={isShaking} />
              </div>
              <p className="font-game text-foreground text-xl">{boss.name}</p>
              <div className="flex justify-center gap-2 mt-2">
                {[...Array(TOTAL_BOSS_HP)].map((_, i) => (
                  <div key={i} className="w-5 h-5 border-2 transition-all duration-300"
                    style={{ background: i < bossHp ? boss.color : 'transparent', borderColor: boss.color, opacity: i < bossHp ? 1 : 0.25 }} />
                ))}
              </div>
              <div className="mt-3 w-48 mx-auto">
                <div className="flex justify-between text-xs text-white/40 font-body mb-1">
                  <span className="text-muted-foreground">{correctCount % QUESTIONS_PER_HP}/{QUESTIONS_PER_HP} this phase</span>
                  <span>{correctCount}/{TOTAL_QUESTIONS}</span>
                </div>
                <div className="h-2 bg-muted overflow-hidden border border-border">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(correctCount / TOTAL_QUESTIONS) * 100}%`, background: boss.color }} />
                </div>
              </div>
            </motion.div>

            <div className="w-full">
              {question && (
                <motion.div key={question.question} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                  {question.passage && (
                    <div className="panel p-4 mb-3">
                      <p className="font-game text-muted-foreground mb-2 uppercase" style={{ fontSize: '0.45rem' }}>Read this passage:</p>
                      <p className="font-body text-foreground text-sm leading-relaxed italic">{question.passage}</p>
                    </div>
                  )}
                  <div className="panel p-4 mb-3">
                    <p className="font-vt text-muted-foreground text-lg mb-2">Q{questionCount}/{TOTAL_QUESTIONS}</p>
                    <p className="font-body text-foreground text-base leading-relaxed">{question.question}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {question.options.map((opt, i) => {
                      let borderColor = 'rgba(255,255,255,0.15)';
                      let bg = 'rgba(0,0,0,0.4)';
                      let textColor = 'white';
                      if (selectedAnswer !== null) {
                        if (i === question.correct_index) { borderColor = '#4ade80'; bg = 'rgba(74,222,128,0.15)'; }
                        else if (i === selectedAnswer) { borderColor = '#f87171'; bg = 'rgba(248,113,113,0.15)'; }
                        else { textColor = 'rgba(255,255,255,0.3)'; }
                      }
                      return (
                        <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                          className="p-3 border-2 text-left font-body transition-none"
                          style={{ borderColor, background: bg, color: textColor, boxShadow: selectedAnswer === null ? '2px 2px 0px rgba(0,0,0,0.5)' : 'none' }}>
                          <span className="font-game mr-2" style={{ fontSize: '0.5rem' }}>{['A','B','C','D'][i]}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {feedback && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`mt-3 p-3 border-2 text-center ${feedback === 'correct' ? 'border-green-400 bg-green-500/10 text-green-300' : 'border-red-400 bg-red-500/10 text-red-300'}`}>
                        <p className="font-game" style={{ fontSize: '0.55rem' }}>
                          {feedback === 'correct' ? 'CORRECT HIT!' : 'WRONG ANSWER'}
                        </p>
                        <p className="font-body text-sm mt-1 opacity-70">{question.explanation}</p>
                        {feedback === 'wrong' && (
                          <p className="font-vt text-red-300 text-xl mt-1">{MAX_PLAYER_WRONG - playerWrong} lives left</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VICTORY */}
      <AnimatePresence>
        {phase === 'victory' && (
          <motion.div key="victory" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6">
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none" className="mx-auto">
                <rect x="8" y="18" width="16" height="10" fill="hsl(var(--primary))"/>
                <rect x="6" y="20" width="4" height="6" fill="hsl(var(--primary))"/>
                <rect x="22" y="20" width="4" height="6" fill="hsl(var(--primary))"/>
                <rect x="10" y="16" width="12" height="4" fill="hsl(var(--primary))"/>
                <rect x="12" y="10" width="8" height="8" fill="hsl(var(--primary))"/>
                <rect x="14" y="8" width="4" height="4" fill="hsl(var(--primary))"/>
                <rect x="13" y="28" width="6" height="2" fill="hsl(var(--primary))"/>
                <rect x="10" y="30" width="12" height="2" fill="hsl(var(--primary))"/>
              </svg>
            </div>
            <h2 className="font-game text-primary mb-2" style={{ fontSize: '1.1rem' }}>VICTORY!</h2>
            <p className="font-vt text-white text-2xl mb-2">{boss.name.toUpperCase()} DEFEATED</p>
            {perfectRound && (
              <p className="font-game text-accent mb-4 border-2 border-accent px-3 py-1 inline-block" style={{ fontSize: '0.5rem' }}>PERFECT ROUND</p>
            )}
            <p className="font-vt text-white/50 text-xl mb-8">Achievement unlocked. Well done.</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={() => setScreen(`zone_${zone.id}`)} className="btn-pixel-lg bg-primary text-primary-foreground">BACK TO ZONE</button>
              <button onClick={() => setScreen('worldmap')} className="btn-pixel-lg bg-muted text-foreground">WORLD MAP</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEFEAT */}
      <AnimatePresence>
        {phase === 'defeat' && (
          <motion.div key="defeat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6">
              <svg width="64" height="64" viewBox="0 0 32 32" fill="hsl(var(--destructive))" className="mx-auto">
                <rect x="10" y="4" width="12" height="12" fill="currentColor"/>
                <rect x="8" y="8" width="4" height="8" fill="currentColor"/>
                <rect x="20" y="8" width="4" height="8" fill="currentColor"/>
                <rect x="12" y="16" width="8" height="4" fill="currentColor"/>
                <rect x="10" y="20" width="12" height="8" fill="currentColor"/>
                <rect x="13" y="7" width="3" height="3" fill="hsl(var(--card))"/>
                <rect x="16" y="7" width="3" height="3" fill="hsl(var(--card))"/>
                <rect x="13" y="22" width="2" height="3" fill="hsl(var(--card))"/>
                <rect x="17" y="22" width="2" height="3" fill="hsl(var(--card))"/>
              </svg>
            </div>
            <h2 className="font-game text-destructive mb-2" style={{ fontSize: '1rem' }}>DEFEATED</h2>
            <p className="font-vt text-white text-2xl mb-2">{boss.name.toUpperCase()} WAS TOO STRONG</p>
            <p className="font-vt text-white/50 text-xl mb-8">Study up and try again.</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={handleRetry} className="btn-pixel-lg bg-primary text-primary-foreground">TRY AGAIN</button>
              <button onClick={() => setScreen(`zone_${zone.id}`)} className="btn-pixel-lg bg-muted text-foreground">BACK TO ZONE</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}