import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/gameContext';
import { ZONES } from '@/lib/gameData';
import { drawPlayerSprite } from '@/components/game/PlayerSprite';

// ─── World Layout ──────────────────────────────────────────────────────────
// Each cell is TILE_SIZE px. The world is COLS x ROWS tiles.
const TILE_SIZE = 48;
const COLS = 40;
const ROWS = 32;

// Zone regions on the map (in tile coordinates)
// Each zone has a rect { x, y, w, h } and a color for the ground tile
const ZONE_LAYOUT = [
  { id: 'forest',      x: 2,  y: 2,  w: 8,  h: 8,  ground: '#1a4a1a', border: '#22c55e', emoji: '🌲', name: 'Forest Zone' },
  { id: 'ocean',       x: 14, y: 2,  w: 8,  h: 8,  ground: '#0a2a4a', border: '#3b82f6', emoji: '🌊', name: 'Ocean Zone' },
  { id: 'mountain',    x: 28, y: 2,  w: 8,  h: 8,  ground: '#2a2a3a', border: '#a78bfa', emoji: '⛰️', name: 'Mountain Zone' },
  { id: 'desert',      x: 2,  y: 18, w: 8,  h: 8,  ground: '#4a3a0a', border: '#f59e0b', emoji: '🏜️', name: 'Desert Zone' },
  { id: 'ice',         x: 14, y: 18, w: 8,  h: 8,  ground: '#1a3a4a', border: '#67e8f9', emoji: '❄️', name: 'Ice Zone' },
  { id: 'underground', x: 28, y: 18, w: 8,  h: 8,  ground: '#1a0a2a', border: '#8b5cf6', emoji: '🕳️', name: 'Underground Zone' },
  { id: 'drylands',    x: 8,  y: 10, w: 8,  h: 8,  ground: '#3a1a0a', border: '#fb923c', emoji: '🌵', name: 'Drylands Zone' },
  { id: 'fire',        x: 22, y: 10, w: 8,  h: 8,  ground: '#3a0a0a', border: '#ef4444', emoji: '🔥', name: 'Fire Zone' },
];

// Zone unlock chain: to enter zone N you need the final boss of zone N-1 defeated
// Forest is always open (starting zone)
const UNLOCK_CHAIN = ['forest', 'ocean', 'mountain', 'desert', 'ice', 'underground', 'drylands', 'fire'];

function isZoneUnlocked(zoneId, bosses_defeated) {
  const idx = UNLOCK_CHAIN.indexOf(zoneId);
  if (idx <= 0) return true; // forest always open
  const prevId = UNLOCK_CHAIN[idx - 1];
  const prevZone = ZONES.find(z => z.id === prevId);
  if (!prevZone) return false;
  const finalBoss = prevZone.bosses.find(b => b.isFinal);
  return finalBoss ? bosses_defeated.includes(finalBoss.id) : false;
}

// Grass ground color
const GRASS_COLOR = '#1a3a1a';
const PATH_COLOR = '#3a2e1a';
// Deterministic pseudo-random tree positions
const TREE_POSITIONS = [];
let seed = 42;
function seededRand() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}
for (let i = 0; i < 70; i++) {
  TREE_POSITIONS.push({
    x: Math.floor(seededRand() * COLS),
    y: Math.floor(seededRand() * ROWS),
  });
}

function isInsideZone(tx, ty) {
  return ZONE_LAYOUT.some(z => tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h);
}

// Check which zone tile (tx,ty) belongs to
function getZoneAt(tx, ty) {
  return ZONE_LAYOUT.find(z => tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h) || null;
}

// Check if tile is a zone border (edge tile of a zone rect)
function isZoneBorder(tx, ty, zone) {
  return tx === zone.x || tx === zone.x + zone.w - 1 || ty === zone.y || ty === zone.y + zone.h - 1;
}

export default function OverworldMap() {
  const { player, setScreen } = useGame();
  const canvasRef = useRef(null);
  const keysRef = useRef({});
  const playerPosRef = useRef({ x: 5 * TILE_SIZE + TILE_SIZE / 2, y: 14 * TILE_SIZE + TILE_SIZE / 2 }); // start center of map
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const facingRef = useRef('down'); // up, down, left, right
  const walkFrameRef = useRef(0);
  const walkTimerRef = useRef(0);

  const [zonePrompt, setZonePrompt] = useState(null); // { zone, unlocked }
  const zonePromptRef = useRef(null);
  const bosses_defeated = player?.bosses_defeated || [];

  const SPEED = 180; // px per second

  // ── Draw world ──────────────────────────────────────────────────────────
  const draw = useCallback((ctx, camX, camY) => {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;

    // Determine tile range to draw
    const startTX = Math.floor(camX / TILE_SIZE);
    const startTY = Math.floor(camY / TILE_SIZE);
    const endTX = Math.ceil((camX + W) / TILE_SIZE);
    const endTY = Math.ceil((camY + H) / TILE_SIZE);

    // Draw base grass
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Draw tiles
    for (let ty = startTY; ty <= endTY; ty++) {
      for (let tx = startTX; tx <= endTX; tx++) {
        if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) continue;
        const sx = tx * TILE_SIZE - camX;
        const sy = ty * TILE_SIZE - camY;

        const zone = getZoneAt(tx, ty);
        if (zone) {
          // Zone ground
          ctx.fillStyle = zone.ground;
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);

          // Zone border glow
          if (isZoneBorder(tx, ty, zone)) {
            ctx.fillStyle = zone.border + '66';
            ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          }

          // Subtle grid lines inside zones
          ctx.strokeStyle = zone.border + '22';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(sx, sy, TILE_SIZE, TILE_SIZE);
        } else {
          // Grass tile variation
          const variation = ((tx * 7 + ty * 13) % 5);
          if (variation === 0) {
            ctx.fillStyle = '#1e421e';
            ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          }
          // Light path diagonals
          if ((tx === 5 || tx === 12 || tx === 20 || tx === 26 || tx === 34) || 
              (ty === 10 || ty === 14 || ty === 22)) {
            ctx.fillStyle = PATH_COLOR;
            ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }

    // Draw zone emoji signs at center of each zone
    ZONE_LAYOUT.forEach(zone => {
      const cx = zone.x * TILE_SIZE + (zone.w * TILE_SIZE) / 2 - camX;
      const cy = zone.y * TILE_SIZE + (zone.h * TILE_SIZE) / 2 - camY;

      // Only draw if on screen
      if (cx < -100 || cx > W + 100 || cy < -100 || cy > H + 100) return;

      const unlocked = isZoneUnlocked(zone.id, bosses_defeated);

      // Zone name plaque
      ctx.save();
      ctx.globalAlpha = unlocked ? 1 : 0.5;

      // Plaque background
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      const pr = 8, px2 = cx - 52, py2 = cy - 18, pw = 104, ph = 32;
      ctx.moveTo(px2 + pr, py2);
      ctx.lineTo(px2 + pw - pr, py2); ctx.quadraticCurveTo(px2 + pw, py2, px2 + pw, py2 + pr);
      ctx.lineTo(px2 + pw, py2 + ph - pr); ctx.quadraticCurveTo(px2 + pw, py2 + ph, px2 + pw - pr, py2 + ph);
      ctx.lineTo(px2 + pr, py2 + ph); ctx.quadraticCurveTo(px2, py2 + ph, px2, py2 + ph - pr);
      ctx.lineTo(px2, py2 + pr); ctx.quadraticCurveTo(px2, py2, px2 + pr, py2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = zone.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Emoji
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(zone.emoji, cx - 34, cy - 2);

      // Name
      ctx.fillStyle = unlocked ? zone.border : '#666';
      ctx.font = 'bold 11px Nunito, sans-serif';
      ctx.fillText(zone.name, cx + 12, cy - 2);

      // Lock icon if locked
      if (!unlocked) {
        ctx.fillStyle = '#888';
        ctx.font = '14px serif';
        ctx.fillText('🔒', cx + 42, cy - 2);
      }

      ctx.restore();
    });

    // Draw some decorative trees outside zones
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    TREE_POSITIONS.forEach(({ x: tx, y: ty }) => {
      if (isInsideZone(tx, ty)) return;
      const sx = tx * TILE_SIZE + TILE_SIZE / 2 - camX;
      const sy = ty * TILE_SIZE + TILE_SIZE / 2 - camY;
      if (sx < -40 || sx > W + 40 || sy < -40 || sy > H + 40) return;
      ctx.fillText('🌿', sx, sy);
    });

  }, [bosses_defeated]);

  const drawPlayer = useCallback((ctx, camX, camY) => {
    const px = playerPosRef.current.x - camX;
    const py = playerPosRef.current.y - camY;

    const size = TILE_SIZE * 0.75;
    const walk = walkFrameRef.current;
    const facing = facingRef.current;

    const avatarColor = player?.avatar_color || '#6366f1';
    drawPlayerSprite(ctx, px, py, size, facing, walk, avatarColor);
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────
  const gameLoop = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const keys = keysRef.current;
    let dx = 0, dy = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) { dx -= 1; facingRef.current = 'left'; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { dx += 1; facingRef.current = 'right'; }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) { dy -= 1; facingRef.current = 'up'; }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) { dy += 1; facingRef.current = 'down'; }

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    const moving = dx !== 0 || dy !== 0;
    if (moving) {
      walkTimerRef.current += dt * 60;
      walkFrameRef.current = walkTimerRef.current;
    } else {
      walkFrameRef.current = 0;
      walkTimerRef.current = 0;
    }

    // Move player
    let nx = playerPosRef.current.x + dx * SPEED * dt;
    let ny = playerPosRef.current.y + dy * SPEED * dt;

    // World bounds
    nx = Math.max(TILE_SIZE, Math.min(COLS * TILE_SIZE - TILE_SIZE, nx));
    ny = Math.max(TILE_SIZE, Math.min(ROWS * TILE_SIZE - TILE_SIZE, ny));

    playerPosRef.current = { x: nx, y: ny };

    // Check zone overlap
    const tx = Math.floor(nx / TILE_SIZE);
    const ty = Math.floor(ny / TILE_SIZE);
    const zone = getZoneAt(tx, ty);

    if (zone && !zonePromptRef.current) {
      const unlocked = isZoneUnlocked(zone.id, bosses_defeated);
      const fullZone = ZONES.find(z => z.id === zone.id);
      zonePromptRef.current = zone.id;
      setZonePrompt({ zone: fullZone, layoutZone: zone, unlocked });
    } else if (!zone && zonePromptRef.current) {
      zonePromptRef.current = null;
      setZonePrompt(null);
    }

    // Draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.width;
    const H = canvas.height;

    // Camera follows player (centered)
    let camX = nx - W / 2;
    let camY = ny - H / 2;
    camX = Math.max(0, Math.min(COLS * TILE_SIZE - W, camX));
    camY = Math.max(0, Math.min(ROWS * TILE_SIZE - H, camY));

    draw(ctx, camX, camY);
    drawPlayer(ctx, camX, camY);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw, drawPlayer, bosses_defeated]);

  // ── Mount / Unmount ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      keysRef.current[e.key] = e.type === 'keydown';
      // Prevent page scroll
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameLoop]);

  // ── Resize canvas to fill viewport ───────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleEnterZone = () => {
    if (!zonePrompt) return;
    setScreen(`zone_${zonePrompt.zone.id}`);
  };

  const dismissPrompt = () => {
    zonePromptRef.current = null;
    setZonePrompt(null);
    // Push player back a bit
    const f = facingRef.current;
    const push = TILE_SIZE * 1.2;
    playerPosRef.current = {
      x: playerPosRef.current.x + (f === 'right' ? -push : f === 'left' ? push : 0),
      y: playerPosRef.current.y + (f === 'down' ? -push : f === 'up' ? push : 0),
    };
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black" style={{ fontFamily: 'Nunito, sans-serif' }}>

      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* HUD top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <button
          className="pointer-events-auto font-game text-sm px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white hover:border-primary/50 transition-all"
          onClick={() => setScreen('start')}
        >
          ← Menu
        </button>
        <div className="text-center">
          <p className="font-game text-primary text-base drop-shadow-lg">🗺️ ReadQuest World</p>
        </div>
        <div className="text-right">
          <p className="font-game text-primary text-sm drop-shadow">{player?.username || 'Explorer'}</p>
          <p className="font-body text-white/60 text-xs">🔥 {player?.current_streak || 0} streak</p>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-black/60 border border-white/10 rounded-xl px-4 py-1.5 flex items-center gap-3">
          <span className="font-body text-white/50 text-xs">Move:</span>
          <span className="font-game text-white/70 text-xs">WASD / Arrow Keys</span>
          <span className="font-body text-white/30 text-xs">|</span>
          <span className="font-body text-white/50 text-xs">Walk into a zone to enter</span>
        </div>
      </div>

      {/* Mobile D-pad */}
      <MobileDpad keysRef={keysRef} />

      {/* Zone Entry Prompt */}
      <AnimatePresence>
        {zonePrompt && (
          <motion.div
            key="zone-prompt"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-sm px-4"
          >
            <div
              className="rounded-2xl border-2 p-4 bg-black/85 backdrop-blur-sm text-center"
              style={{ borderColor: zonePrompt.layoutZone.border }}
            >
              <p className="text-3xl mb-1">{zonePrompt.layoutZone.emoji}</p>
              <p className="font-game text-lg text-white">{zonePrompt.layoutZone.name}</p>

              {zonePrompt.unlocked ? (
                <>
                  <p className="font-body text-white/60 text-xs mt-1 mb-3">{zonePrompt.zone?.description}</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleEnterZone}
                      className="font-game text-sm px-5 py-2 rounded-xl text-black transition-all hover:brightness-110"
                      style={{ background: zonePrompt.layoutZone.border }}
                    >
                      ⚔️ Enter Zone
                    </button>
                    <button
                      onClick={dismissPrompt}
                      className="font-game text-sm px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all"
                    >
                      Keep Walking
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-body text-yellow-400/80 text-xs mt-1 mb-3">
                    🔒 Defeat all bosses in{' '}
                    <span className="font-game text-yellow-300">
                      {ZONE_LAYOUT[UNLOCK_CHAIN.indexOf(zonePrompt.zone?.id) - 1]?.name || 'the previous zone'}
                    </span>{' '}
                    to unlock this zone.
                  </p>
                  <button
                    onClick={dismissPrompt}
                    className="font-game text-sm px-5 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-all"
                  >
                    Back Away
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mobile D-Pad ─────────────────────────────────────────────────────────
function MobileDpad({ keysRef }) {
  const press = (key, down) => { keysRef.current[key] = down; };

  const DBtn = ({ label, keyName, className }) => (
    <button
      className={`w-12 h-12 rounded-xl bg-black/60 border border-white/20 text-white font-game text-lg flex items-center justify-center active:bg-white/20 select-none ${className}`}
      onTouchStart={(e) => { e.preventDefault(); press(keyName, true); }}
      onTouchEnd={(e) => { e.preventDefault(); press(keyName, false); }}
      onMouseDown={() => press(keyName, true)}
      onMouseUp={() => press(keyName, false)}
      onMouseLeave={() => press(keyName, false)}
    >
      {label}
    </button>
  );

  return (
    <div className="md:hidden absolute bottom-16 right-4 select-none">
      <div className="flex flex-col items-center gap-1">
        <DBtn label="▲" keyName="ArrowUp" />
        <div className="flex gap-1">
          <DBtn label="◄" keyName="ArrowLeft" />
          <DBtn label="▼" keyName="ArrowDown" />
          <DBtn label="►" keyName="ArrowRight" />
        </div>
      </div>
    </div>
  );
}