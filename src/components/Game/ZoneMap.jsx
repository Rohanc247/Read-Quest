import React, { useEffect, useRef, useCallback, useState } from 'react';
import { drawPlayerSprite } from '@/components/game/PlayerSprite';
import { useGame } from '@/lib/gameContext';

const TILE = 52;
const COLS = 20;
const ROWS = 16;
const SPEED = 160;

// Zone-specific map configs
const ZONE_MAPS = {
  forest: {
    bg: '#0d2d0d',
    ground: '#1a4a1a',
    accent: '#22c55e',
    decorations: ['🌲', '🌿', '🍄', '🌸', '🌳'],
    paths: 'horizontal',
    structures: [
      { x: 3, y: 2, w: 3, h: 3, color: '#15803d', label: '🏚️ Forest Hut' },
      { x: 14, y: 10, w: 4, h: 3, color: '#166534', label: '⚗️ Witch Hut' },
    ],
    water: [{ x: 8, y: 5, w: 4, h: 2, color: '#1d4ed8' }],
  },
  ocean: {
    bg: '#060d1f',
    ground: '#0a2a4a',
    accent: '#3b82f6',
    decorations: ['🐚', '🪸', '🐠', '⚓', '🦀'],
    paths: 'vertical',
    structures: [
      { x: 2, y: 3, w: 4, h: 3, color: '#1e40af', label: '🏛️ Sea Temple' },
      { x: 13, y: 9, w: 5, h: 4, color: '#1d4ed8', label: '🚢 Sunken Ship' },
    ],
    water: [
      { x: 0, y: 0, w: 20, h: 2, color: '#0c2a5e' },
      { x: 0, y: 14, w: 20, h: 2, color: '#0c2a5e' },
    ],
  },
  ice: {
    bg: '#0a1628',
    ground: '#1a3a4a',
    accent: '#67e8f9',
    decorations: ['❄️', '🧊', '⛄', '🌨️', '💎'],
    paths: 'diagonal',
    structures: [
      { x: 3, y: 3, w: 5, h: 3, color: '#1e3a5f', label: '🏰 Ice Palace' },
      { x: 12, y: 9, w: 4, h: 4, color: '#134e7a', label: '🧊 Frozen Cave' },
    ],
    water: [{ x: 6, y: 6, w: 8, h: 3, color: '#93c5fd' }], // frozen lake
  },
  desert: {
    bg: '#1a0e00',
    ground: '#4a3a0a',
    accent: '#f59e0b',
    decorations: ['🌵', '🏺', '💀', '🦂', '🪨'],
    paths: 'horizontal',
    structures: [
      { x: 2, y: 2, w: 6, h: 5, color: '#92400e', label: '🏛️ Ancient Pyramid' },
      { x: 13, y: 9, w: 4, h: 3, color: '#78350f', label: '⚱️ Tomb Entrance' },
    ],
    water: [{ x: 9, y: 3, w: 2, h: 3, color: '#166534' }], // oasis
  },
  mountain: {
    bg: '#0f0e14',
    ground: '#2a2a3a',
    accent: '#a78bfa',
    decorations: ['⛰️', '🪨', '🦅', '🌑', '💜'],
    paths: 'zigzag',
    structures: [
      { x: 2, y: 2, w: 4, h: 6, color: '#3b3252', label: '🗿 Stone Shrine' },
      { x: 13, y: 8, w: 5, h: 4, color: '#2d2845', label: '⛏️ Mine Entrance' },
    ],
    water: [],
  },
  underground: {
    bg: '#030008',
    ground: '#1a0a2a',
    accent: '#8b5cf6',
    decorations: ['💎', '🪨', '🕷️', '🌑', '🦇'],
    paths: 'cave',
    structures: [
      { x: 2, y: 3, w: 4, h: 3, color: '#2e1065', label: '💀 Shadow Altar' },
      { x: 13, y: 9, w: 5, h: 4, color: '#1e1035', label: '🔮 Crystal Chamber' },
    ],
    water: [{ x: 7, y: 7, w: 6, h: 2, color: '#1a003a' }], // lava/dark pool
  },
  drylands: {
    bg: '#150500',
    ground: '#3a1a0a',
    accent: '#fb923c',
    decorations: ['🌵', '🦴', '🔥', '🌾', '🦅'],
    paths: 'horizontal',
    structures: [
      { x: 2, y: 2, w: 5, h: 3, color: '#7c2d12', label: '🏚️ Scavenger Camp' },
      { x: 13, y: 10, w: 4, h: 3, color: '#9a3412', label: '⚙️ Mech Forge' },
    ],
    water: [],
  },
  fire: {
    bg: '#1a0000',
    ground: '#3a0a0a',
    accent: '#ef4444',
    decorations: ['🔥', '💀', '⚔️', '🌋', '😈'],
    paths: 'lava',
    structures: [
      { x: 2, y: 2, w: 5, h: 4, color: '#7f1d1d', label: '🌋 Nether Gate' },
      { x: 12, y: 9, w: 6, h: 4, color: '#450a0a', label: '⚔️ Throne of Fire' },
    ],
    water: [
      { x: 0, y: 7, w: 20, h: 2, color: '#7f1d1d' }, // lava river
    ],
  },
};

// Deterministic positions for decorations per zone
const DECO_CACHE = {};
function getDecos(zoneId) {
  if (DECO_CACHE[zoneId]) return DECO_CACHE[zoneId];
  let s = zoneId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  function r() { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; }
  const list = [];
  for (let i = 0; i < 30; i++) list.push({ x: Math.floor(r() * COLS), y: Math.floor(r() * ROWS), di: Math.floor(r() * 5) });
  DECO_CACHE[zoneId] = list;
  return list;
}

export default function ZoneMap({ zoneId, onEnterBoss, onExit, bosses_defeated = [] }) {
  const { player } = useGame();
  const canvasRef = useRef(null);
  const keysRef = useRef({});
  const posRef = useRef({ x: 10 * TILE, y: 8 * TILE });
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const facingRef = useRef('down');
  const walkFrameRef = useRef(0);
  const walkTimerRef = useRef(0);
  const [bossPrompt, setBossPrompt] = useState(null);
  const bossPromptRef = useRef(null);

  const cfg = ZONE_MAPS[zoneId] || ZONE_MAPS.forest;
  const decos = getDecos(zoneId);
  const avatarColor = player?.avatar_color || '#6366f1';

  // Boss positions (spread across the zone)
  const [zoneBosses, setZoneBosses] = useState([]);

  useEffect(() => {
      import('@/lib/gameData').then((mod) => {
      const zone = mod.ZONES.find(z => z.id === zoneId);
      if (!zone) return;
      const positions = [
        { tx: 4, ty: 4 },
        { tx: 10, ty: 7 },
        { tx: 13, ty: 11 },
      ];
      setZoneBosses(zone.bosses.map((b, i) => ({ ...b, tx: positions[i]?.tx || 4 + i * 6, ty: positions[i]?.ty || 4 })));
    });
  }, [zoneId]);

  const isStructureTile = useCallback((tx, ty) => {
    return cfg.structures.some(st => tx >= st.x && tx < st.x + st.w && ty >= st.y && ty < st.y + st.h);
  }, [cfg]);

  const isWaterTile = useCallback((tx, ty) => {
    return cfg.water.some(w => tx >= w.x && tx < w.x + w.w && ty >= w.y && ty < w.y + w.h);
  }, [cfg]);

  const draw = useCallback((ctx, camX, camY) => {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    ctx.fillStyle = cfg.bg;
    ctx.fillRect(0, 0, W, H);

    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        const sx = tx * TILE - camX, sy = ty * TILE - camY;
        if (sx > W + TILE || sx < -TILE || sy > H + TILE || sy < -TILE) continue;

        if (isWaterTile(tx, ty)) {
          ctx.fillStyle = cfg.water.find(w => tx >= w.x && tx < w.x + w.w && ty >= w.y && ty < w.y + w.h)?.color || '#1d4ed8';
        } else if (isStructureTile(tx, ty)) {
          const st = cfg.structures.find(s => tx >= s.x && tx < s.x + s.w && ty >= s.y && ty < s.y + s.h);
          ctx.fillStyle = st.color;
        } else {
          // Ground variation
          const v = (tx * 7 + ty * 13) % 6;
          ctx.fillStyle = v < 2 ? cfg.ground : (v < 3 ? cfg.ground + 'cc' : cfg.ground);
        }
        ctx.fillRect(sx, sy, TILE, TILE);

        // Grid subtle lines
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sx, sy, TILE, TILE);
      }
    }

    // Structure labels
    cfg.structures.forEach(st => {
      const cx = (st.x + st.w / 2) * TILE - camX;
      const cy = (st.y + st.h / 2) * TILE - camY;
      if (cx < -100 || cx > W + 100) return;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      const pw = 110, ph = 24, px = cx - pw / 2, py = cy - ph / 2;
      ctx.moveTo(px + 6, py); ctx.lineTo(px + pw - 6, py); ctx.quadraticCurveTo(px + pw, py, px + pw, py + 6);
      ctx.lineTo(px + pw, py + ph - 6); ctx.quadraticCurveTo(px + pw, py + ph, px + pw - 6, py + ph);
      ctx.lineTo(px + 6, py + ph); ctx.quadraticCurveTo(px, py + ph, px, py + ph - 6);
      ctx.lineTo(px, py + 6); ctx.quadraticCurveTo(px, py, px + 6, py);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = cfg.accent;
      ctx.font = 'bold 10px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(st.label, cx, cy);
      ctx.restore();
    });

    // Decorations
    ctx.font = '18px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    decos.forEach(({ x: tx, y: ty, di }) => {
      if (isStructureTile(tx, ty) || isWaterTile(tx, ty)) return;
      const sx = tx * TILE + TILE / 2 - camX;
      const sy = ty * TILE + TILE / 2 - camY;
      if (sx < -30 || sx > W + 30 || sy < -30 || sy > H + 30) return;
      ctx.fillText(cfg.decorations[di] || cfg.decorations[0], sx, sy);
    });

    // Boss markers
    zoneBosses.forEach(boss => {
      const bx = boss.tx * TILE + TILE / 2 - camX;
      const by = boss.ty * TILE + TILE / 2 - camY;
      if (bx < -60 || bx > W + 60 || by < -60 || by > H + 60) return;
      const defeated = bosses_defeated.includes(boss.id);

      // Boss glow
      if (!defeated) {
        ctx.save();
        ctx.shadowColor = boss.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = boss.color + '44';
        ctx.beginPath(); ctx.arc(bx, by, TILE * 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Boss emoji/icon
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = defeated ? 0.4 : 1;
      ctx.fillText(defeated ? '💀' : boss.emoji, bx, by - 6);
      ctx.globalAlpha = 1;

      // Name tag
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      const tw = boss.name.length * 6.5 + 16;
      const px2 = bx - tw / 2, py2 = by + 18;
      ctx.beginPath();
      ctx.moveTo(px2 + 4, py2); ctx.lineTo(px2 + tw - 4, py2); ctx.quadraticCurveTo(px2 + tw, py2, px2 + tw, py2 + 4);
      ctx.lineTo(px2 + tw, py2 + 16); ctx.quadraticCurveTo(px2 + tw, py2 + 20, px2 + tw - 4, py2 + 20);
      ctx.lineTo(px2 + 4, py2 + 20); ctx.quadraticCurveTo(px2, py2 + 20, px2, py2 + 16);
      ctx.lineTo(px2, py2 + 4); ctx.quadraticCurveTo(px2, py2, px2 + 4, py2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = defeated ? '#666' : boss.color;
      ctx.font = 'bold 10px Nunito, sans-serif';
      ctx.fillText(boss.name, bx, py2 + 10);
      ctx.restore();
    });

  }, [cfg, decos, zoneBosses, bosses_defeated, isStructureTile, isWaterTile]);

  const drawPlayer = useCallback((ctx, camX, camY) => {
    const px = posRef.current.x - camX;
    const py = posRef.current.y - camY;
    drawPlayerSprite(ctx, px, py, TILE * 0.88, facingRef.current, walkFrameRef.current, avatarColor);
  }, [avatarColor]);

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

    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
    const moving = dx !== 0 || dy !== 0;
    if (moving) { walkTimerRef.current += dt * 60; walkFrameRef.current = walkTimerRef.current; }
    else { walkFrameRef.current = 0; walkTimerRef.current = 0; }

    let nx = posRef.current.x + dx * SPEED * dt;
    let ny = posRef.current.y + dy * SPEED * dt;
    nx = Math.max(TILE, Math.min(COLS * TILE - TILE, nx));
    ny = Math.max(TILE, Math.min(ROWS * TILE - TILE, ny));

    // Collision with structures and water
    const tx = Math.floor(nx / TILE), ty = Math.floor(ny / TILE);
    if (!isStructureTile(tx, ty) && !isWaterTile(tx, ty)) {
      posRef.current = { x: nx, y: ny };
    }

    // Check boss proximity
    let nearBoss = null;
    for (const boss of zoneBosses) {
      const bx = boss.tx * TILE + TILE / 2;
      const by = boss.ty * TILE + TILE / 2;
      const dist = Math.hypot(posRef.current.x - bx, posRef.current.y - by);
      if (dist < TILE * 1.4) { nearBoss = boss; break; }
    }

    if (nearBoss && !bossPromptRef.current) {
      bossPromptRef.current = nearBoss.id;
      setBossPrompt(nearBoss);
    } else if (!nearBoss && bossPromptRef.current) {
      bossPromptRef.current = null;
      setBossPrompt(null);
    }

    // Check exit (edges of map)
    if (posRef.current.x < TILE * 0.6 || posRef.current.y < TILE * 0.6 ||
        posRef.current.x > (COLS - 0.6) * TILE || posRef.current.y > (ROWS - 0.6) * TILE) {
      onExit?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let camX = posRef.current.x - W / 2;
    let camY = posRef.current.y - H / 2;
    camX = Math.max(0, Math.min(COLS * TILE - W, camX));
    camY = Math.max(0, Math.min(ROWS * TILE - H, camY));

    draw(ctx, camX, camY);
    drawPlayer(ctx, camX, camY);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw, drawPlayer, zoneBosses, isStructureTile, isWaterTile, onExit]);

  useEffect(() => {
    const onKey = (e) => {
      keysRef.current[e.key] = e.type === 'keydown';
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
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

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ imageRendering: 'pixelated' }} />

      {/* Exit hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-black/60 border border-white/10 rounded-xl px-4 py-1.5 flex items-center gap-3">
          <span className="font-body text-white/50 text-xs">Walk to the edge to exit • WASD / Arrows to move</span>
        </div>
      </div>

      {/* Mobile D-pad */}
      <ZoneMapDpad keysRef={keysRef} />

      {/* Boss approach prompt */}
      {bossPrompt && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
          <div className="rounded-2xl border-2 p-4 bg-black/90 backdrop-blur-sm text-center"
            style={{ borderColor: bossPrompt.color }}>
            <p className="text-3xl mb-1">{bossPrompt.emoji}</p>
            <p className="font-game text-lg text-white">{bossPrompt.name}</p>
            {bosses_defeated.includes(bossPrompt.id) ? (
              <p className="font-body text-accent text-xs mt-1">✅ Already defeated!</p>
            ) : (
              <p className="font-body text-white/60 text-xs mt-1 mb-3">Ready to battle?</p>
            )}
            {!bosses_defeated.includes(bossPrompt.id) && (
              <button
                onClick={() => onEnterBoss?.(bossPrompt.id)}
                className="font-game text-sm px-5 py-2 rounded-xl text-black transition-all hover:brightness-110"
                style={{ background: bossPrompt.color }}
              >
                ⚔️ Fight!
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ZoneMapDpad({ keysRef }) {
  const press = (key, down) => { keysRef.current[key] = down; };
  const DBtn = ({ label, keyName, className }) => (
    <button
      className={`w-11 h-11 rounded-xl bg-black/60 border border-white/20 text-white font-game text-base flex items-center justify-center active:bg-white/20 select-none ${className}`}
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