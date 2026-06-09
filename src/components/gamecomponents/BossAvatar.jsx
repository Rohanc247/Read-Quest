// Draws boss-specific pixel-art avatars on a canvas context
// cx, cy = center of boss
// size = radius/scale
// bossId = unique boss identifier
// animFrame = animation counter

export function drawBossAvatar(ctx, cx, cy, size, bossId, animFrame = 0) {
  const bob = Math.sin(animFrame * 0.05) * (size * 0.04);
  ctx.save();
  ctx.translate(cx, cy + bob);

  switch (bossId) {
    case 'mushroom_man':    drawMushroomMan(ctx, size); break;
    case 'oak_dragon':      drawOakDragon(ctx, size); break;
    case 'tree_sentinel':   drawTreeSentinel(ctx, size); break;
    case 'hammerhead':      drawHammerhead(ctx, size); break;
    case 'temple_guardian': drawTempleGuardian(ctx, size); break;
    case 'lord_7_seas':     drawLord7Seas(ctx, size); break;
    case 'woolly_mammoth':  drawWoollyMammoth(ctx, size); break;
    case 'ice_spirit':      drawIceSpirit(ctx, size); break;
    case 'ice_giant':       drawIceGiant(ctx, size); break;
    case 'wraith':          drawWraith(ctx, size, animFrame); break;
    case 'mummy_spirit':    drawMummySpirit(ctx, size); break;
    case 'sand_god':        drawSandGod(ctx, size); break;
    case 'mountain_golem':  drawMountainGolem(ctx, size); break;
    case 'elder_golem':     drawElderGolem(ctx, size); break;
    case 'golem_king':      drawGolemKing(ctx, size); break;
    case 'mineral_spirit':  drawMineralSpirit(ctx, size); break;
    case 'shadow_monster':  drawShadowMonster(ctx, size, animFrame); break;
    case 'lord_shadows':    drawLordShadows(ctx, size, animFrame); break;
    case 'wasteland_scavenger': drawWastelandScavenger(ctx, size); break;
    case 'mechanical_golem': drawMechanicalGolem(ctx, size); break;
    case 'drylands_demon':  drawDrylandsDemon(ctx, size); break;
    case 'fire_spirit':     drawFireSpirit(ctx, size, animFrame); break;
    case 'nether_guardian': drawNetherGuardian(ctx, size); break;
    case 'lord_netherlands': drawLordNetherlands(ctx, size, animFrame); break;
    default:                drawDefaultBoss(ctx, size); break;
  }

  ctx.restore();
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, color, rotation = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.fill();
}
function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

// ── Forest bosses ─────────────────────────────────────────────────────────────
function drawMushroomMan(ctx, s) {
  // Stalk
  ellipse(ctx, 0, s * 0.25, s * 0.2, s * 0.38, '#e8d5b7');
  // Cap
  ellipse(ctx, 0, -s * 0.2, s * 0.5, s * 0.32, '#c0392b');
  // Cap spots
  circle(ctx, -s * 0.2, -s * 0.28, s * 0.08, 'white');
  circle(ctx, s * 0.2, -s * 0.1, s * 0.06, 'white');
  circle(ctx, 0, -s * 0.36, s * 0.07, 'white');
  // Eyes
  circle(ctx, -s * 0.1, s * 0.05, s * 0.07, '#2d1b00');
  circle(ctx, s * 0.1, s * 0.05, s * 0.07, '#2d1b00');
  // Smile
  ctx.strokeStyle = '#2d1b00'; ctx.lineWidth = s * 0.04;
  ctx.beginPath(); ctx.arc(0, s * 0.2, s * 0.12, 0, Math.PI); ctx.stroke();
}

function drawOakDragon(ctx, s) {
  // Body
  ellipse(ctx, 0, s * 0.1, s * 0.35, s * 0.4, '#16a34a');
  // Wings
  ctx.fillStyle = '#15803d';
  ctx.beginPath(); ctx.moveTo(-s * 0.25, -s * 0.1); ctx.lineTo(-s * 0.65, -s * 0.5); ctx.lineTo(-s * 0.5, s * 0.1); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(s * 0.25, -s * 0.1); ctx.lineTo(s * 0.65, -s * 0.5); ctx.lineTo(s * 0.5, s * 0.1); ctx.closePath(); ctx.fill();
  // Head
  ellipse(ctx, 0, -s * 0.3, s * 0.25, s * 0.22, '#22c55e');
  // Snout
  ellipse(ctx, 0, -s * 0.16, s * 0.14, s * 0.09, '#4ade80');
  // Eyes
  circle(ctx, -s * 0.12, -s * 0.34, s * 0.06, '#fbbf24');
  circle(ctx, s * 0.12, -s * 0.34, s * 0.06, '#fbbf24');
  circle(ctx, -s * 0.12, -s * 0.34, s * 0.03, '#000');
  circle(ctx, s * 0.12, -s * 0.34, s * 0.03, '#000');
}

function drawTreeSentinel(ctx, s) {
  // Trunk legs
  rect(ctx, -s * 0.15, s * 0.4, s * 0.14, s * 0.3, '#7c4f1e');
  rect(ctx, s * 0.15, s * 0.4, s * 0.14, s * 0.3, '#7c4f1e');
  // Main trunk
  ellipse(ctx, 0, s * 0.1, s * 0.22, s * 0.42, '#92580a');
  // Leafy top
  circle(ctx, 0, -s * 0.35, s * 0.38, '#15803d');
  circle(ctx, -s * 0.28, -s * 0.2, s * 0.24, '#16a34a');
  circle(ctx, s * 0.28, -s * 0.2, s * 0.24, '#16a34a');
  // Face in trunk
  circle(ctx, -s * 0.1, s * 0.05, s * 0.06, '#000');
  circle(ctx, s * 0.1, s * 0.05, s * 0.06, '#000');
  ctx.strokeStyle = '#000'; ctx.lineWidth = s * 0.04;
  ctx.beginPath(); ctx.arc(0, s * 0.2, s * 0.1, 0, Math.PI); ctx.stroke();
}

// ── Ocean bosses ──────────────────────────────────────────────────────────────
function drawHammerhead(ctx, s) {
  // Body
  ellipse(ctx, 0, s * 0.05, s * 0.5, s * 0.24, '#64748b');
  // Hammer head
  ellipse(ctx, 0, -s * 0.28, s * 0.45, s * 0.12, '#475569');
  // Eyes on ends of hammer
  circle(ctx, -s * 0.38, -s * 0.28, s * 0.07, '#fbbf24');
  circle(ctx, s * 0.38, -s * 0.28, s * 0.07, '#fbbf24');
  circle(ctx, -s * 0.38, -s * 0.28, s * 0.03, '#000');
  circle(ctx, s * 0.38, -s * 0.28, s * 0.03, '#000');
  // Tail fin
  ctx.fillStyle = '#475569';
  ctx.beginPath(); ctx.moveTo(s * 0.45, s * 0.05); ctx.lineTo(s * 0.7, -s * 0.2); ctx.lineTo(s * 0.7, s * 0.3); ctx.closePath(); ctx.fill();
  // Dorsal fin
  ctx.beginPath(); ctx.moveTo(-s * 0.05, -s * 0.15); ctx.lineTo(-s * 0.2, -s * 0.5); ctx.lineTo(s * 0.1, -s * 0.15); ctx.closePath(); ctx.fill();
}

function drawTempleGuardian(ctx, s) {
  // Stone body
  rect(ctx, 0, s * 0.1, s * 0.45, s * 0.65, '#6b7280');
  // Shoulders
  ellipse(ctx, -s * 0.3, -s * 0.2, s * 0.15, s * 0.15, '#9ca3af');
  ellipse(ctx, s * 0.3, -s * 0.2, s * 0.15, s * 0.15, '#9ca3af');
  // Head/helmet
  ellipse(ctx, 0, -s * 0.38, s * 0.22, s * 0.26, '#4b5563');
  ellipse(ctx, 0, -s * 0.55, s * 0.18, s * 0.1, '#6b7280');
  // Eyes (glowing)
  circle(ctx, -s * 0.1, -s * 0.4, s * 0.07, '#3b82f6');
  circle(ctx, s * 0.1, -s * 0.4, s * 0.07, '#3b82f6');
  // Markings
  ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = s * 0.03;
  ctx.beginPath(); ctx.moveTo(-s * 0.15, -s * 0.05); ctx.lineTo(s * 0.15, -s * 0.05); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-s * 0.15, s * 0.1); ctx.lineTo(s * 0.15, s * 0.1); ctx.stroke();
}

function drawLord7Seas(ctx, s) {
  // Robe
  ctx.fillStyle = '#1e3a5f';
  ctx.beginPath(); ctx.moveTo(-s * 0.35, s * 0.55); ctx.lineTo(s * 0.35, s * 0.55); ctx.lineTo(s * 0.25, -s * 0.1); ctx.lineTo(-s * 0.25, -s * 0.1); ctx.closePath(); ctx.fill();
  // Body
  ellipse(ctx, 0, -s * 0.05, s * 0.26, s * 0.28, '#1e40af');
  // Crown
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.38); ctx.lineTo(-s * 0.2, -s * 0.58); ctx.lineTo(-s * 0.1, -s * 0.46); ctx.lineTo(0, -s * 0.62); ctx.lineTo(s * 0.1, -s * 0.46); ctx.lineTo(s * 0.2, -s * 0.58); ctx.lineTo(s * 0.2, -s * 0.38); ctx.closePath(); ctx.fill();
  // Head
  ellipse(ctx, 0, -s * 0.28, s * 0.2, s * 0.18, '#e8b89a');
  // Beard
  ellipse(ctx, 0, -s * 0.08, s * 0.18, s * 0.14, '#94a3b8');
  // Eyes
  circle(ctx, -s * 0.09, -s * 0.3, s * 0.05, '#1e3a5f');
  circle(ctx, s * 0.09, -s * 0.3, s * 0.05, '#1e3a5f');
  // Trident
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = s * 0.05;
  ctx.beginPath(); ctx.moveTo(s * 0.35, -s * 0.6); ctx.lineTo(s * 0.35, s * 0.5); ctx.stroke();
  ctx.lineWidth = s * 0.03;
  ctx.beginPath(); ctx.moveTo(s * 0.25, -s * 0.6); ctx.lineTo(s * 0.35, -s * 0.5); ctx.moveTo(s * 0.45, -s * 0.6); ctx.lineTo(s * 0.35, -s * 0.5); ctx.stroke();
}

// ── Ice bosses ────────────────────────────────────────────────────────────────
function drawWoollyMammoth(ctx, s) {
  // Shaggy body
  ellipse(ctx, 0, s * 0.1, s * 0.48, s * 0.36, '#8b7355');
  // Fur bumps
  for (let i = -3; i <= 3; i++) circle(ctx, i * s * 0.14, -s * 0.15, s * 0.1, '#a08060');
  // Head
  ellipse(ctx, -s * 0.38, -s * 0.08, s * 0.2, s * 0.18, '#8b7355');
  // Trunk
  ctx.strokeStyle = '#8b7355'; ctx.lineWidth = s * 0.1;
  ctx.beginPath(); ctx.moveTo(-s * 0.52, s * 0.0); ctx.quadraticCurveTo(-s * 0.75, s * 0.3, -s * 0.55, s * 0.5); ctx.stroke();
  // Tusks
  ctx.strokeStyle = '#fffde7'; ctx.lineWidth = s * 0.05;
  ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.06); ctx.quadraticCurveTo(-s * 0.72, s * 0.22, -s * 0.62, s * 0.4); ctx.stroke();
  // Eye
  circle(ctx, -s * 0.45, -s * 0.14, s * 0.06, '#000');
  circle(ctx, -s * 0.43, -s * 0.16, s * 0.02, 'white');
}

function drawIceSpirit(ctx, s) {
  const flicker = Math.random() > 0.95 ? 0.6 : 1;
  ctx.globalAlpha = 0.85 * flicker;
  // Wispy body
  ellipse(ctx, 0, s * 0.1, s * 0.28, s * 0.45, '#7dd3fc');
  ellipse(ctx, 0, -s * 0.15, s * 0.2, s * 0.22, '#bae6fd');
  // Icy spikes
  ctx.fillStyle = '#e0f2fe';
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.moveTo(i * s * 0.1 - s * 0.04, s * 0.35); ctx.lineTo(i * s * 0.1, s * 0.55); ctx.lineTo(i * s * 0.1 + s * 0.04, s * 0.35); ctx.closePath(); ctx.fill();
  }
  // Eyes
  circle(ctx, -s * 0.1, -s * 0.18, s * 0.06, '#0ea5e9');
  circle(ctx, s * 0.1, -s * 0.18, s * 0.06, '#0ea5e9');
  ctx.globalAlpha = 1;
}

function drawIceGiant(ctx, s) {
  // Legs
  rect(ctx, -s * 0.15, s * 0.45, s * 0.18, s * 0.22, '#60a5fa');
  rect(ctx, s * 0.15, s * 0.45, s * 0.18, s * 0.22, '#60a5fa');
  // Body
  ellipse(ctx, 0, s * 0.1, s * 0.38, s * 0.42, '#3b82f6');
  // Arms
  ellipse(ctx, -s * 0.4, s * 0.05, s * 0.12, s * 0.32, '#60a5fa', 0.3);
  ellipse(ctx, s * 0.4, s * 0.05, s * 0.12, s * 0.32, '#60a5fa', -0.3);
  // Head
  ellipse(ctx, 0, -s * 0.35, s * 0.28, s * 0.28, '#93c5fd');
  // Ice crown
  ctx.fillStyle = '#bfdbfe';
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.moveTo(i * s * 0.12 - s * 0.04, -s * 0.52); ctx.lineTo(i * s * 0.12, -s * 0.7); ctx.lineTo(i * s * 0.12 + s * 0.04, -s * 0.52); ctx.closePath(); ctx.fill();
  }
  // Eyes
  circle(ctx, -s * 0.12, -s * 0.36, s * 0.07, '#1e3a5f');
  circle(ctx, s * 0.12, -s * 0.36, s * 0.07, '#1e3a5f');
}

// ── Desert bosses ─────────────────────────────────────────────────────────────
function drawWraith(ctx, s, animFrame = 0) {
  ctx.globalAlpha = 0.8 + Math.sin(animFrame * 0.1) * 0.2;
  // Cloak
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.moveTo(-s * 0.4, s * 0.55); ctx.lineTo(s * 0.4, s * 0.55); ctx.bezierCurveTo(s * 0.5, s * 0.0, s * 0.3, -s * 0.4, 0, -s * 0.55); ctx.bezierCurveTo(-s * 0.3, -s * 0.4, -s * 0.5, s * 0.0, -s * 0.4, s * 0.55); ctx.closePath(); ctx.fill();
  // Glowing face void
  ctx.fillStyle = '#16213e';
  ctx.beginPath(); ctx.ellipse(0, -s * 0.2, s * 0.18, s * 0.22, 0, 0, Math.PI * 2); ctx.fill();
  // Glowing eyes
  circle(ctx, -s * 0.09, -s * 0.22, s * 0.05, '#a78bfa');
  circle(ctx, s * 0.09, -s * 0.22, s * 0.05, '#a78bfa');
  ctx.globalAlpha = 1;
}

function drawMummySpirit(ctx, s) {
  // Bandaged body
  ellipse(ctx, 0, s * 0.1, s * 0.28, s * 0.42, '#e8d5b7');
  // Bandage strips
  ctx.strokeStyle = '#c9aa7e'; ctx.lineWidth = s * 0.05;
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.28, i * s * 0.12 + s * 0.1); ctx.lineTo(s * 0.28, i * s * 0.12 + s * 0.06); ctx.stroke(); }
  // Arms (wrapped)
  ellipse(ctx, -s * 0.38, s * 0.1, s * 0.1, s * 0.3, '#d4c5a2', 0.2);
  ellipse(ctx, s * 0.38, s * 0.1, s * 0.1, s * 0.3, '#d4c5a2', -0.2);
  // Head
  ellipse(ctx, 0, -s * 0.35, s * 0.2, s * 0.22, '#e8d5b7');
  // Eye slit
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(-s * 0.12, -s * 0.38, s * 0.24, s * 0.06);
}

function drawSandGod(ctx, s) {
  // Floating sand particles
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; circle(ctx, Math.cos(a) * s * 0.55, Math.sin(a) * s * 0.55, s * 0.05, '#f59e0b'); }
  // Body
  ellipse(ctx, 0, 0, s * 0.35, s * 0.45, '#d97706');
  // Head
  ellipse(ctx, 0, -s * 0.45, s * 0.25, s * 0.22, '#fbbf24');
  // Solar crown
  ctx.fillStyle = '#f59e0b';
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * s * 0.22, -s * 0.45 + Math.sin(a) * s * 0.22); ctx.lineTo(Math.cos(a) * s * 0.35, -s * 0.45 + Math.sin(a) * s * 0.35); ctx.lineWidth = s * 0.05; ctx.strokeStyle = '#f59e0b'; ctx.stroke(); }
  // Eyes
  circle(ctx, -s * 0.1, -s * 0.47, s * 0.06, '#7c2d12');
  circle(ctx, s * 0.1, -s * 0.47, s * 0.06, '#7c2d12');
}

// ── Mountain bosses ───────────────────────────────────────────────────────────
function drawMountainGolem(ctx, s) {
  // Stone legs
  rect(ctx, -s * 0.15, s * 0.43, s * 0.2, s * 0.22, '#78716c');
  rect(ctx, s * 0.15, s * 0.43, s * 0.2, s * 0.22, '#78716c');
  // Stone body
  ellipse(ctx, 0, s * 0.1, s * 0.4, s * 0.4, '#6b7280');
  // Cracks
  ctx.strokeStyle = '#374151'; ctx.lineWidth = s * 0.03;
  ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.1); ctx.lineTo(0, s * 0.05); ctx.lineTo(s * 0.15, -s * 0.05); ctx.stroke();
  // Stone head
  ellipse(ctx, 0, -s * 0.35, s * 0.26, s * 0.24, '#9ca3af');
  // Mossy eyebrows
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(-s * 0.2, -s * 0.42, s * 0.14, s * 0.05);
  ctx.fillRect(s * 0.06, -s * 0.42, s * 0.14, s * 0.05);
  // Eyes (glowing)
  circle(ctx, -s * 0.1, -s * 0.36, s * 0.06, '#fbbf24');
  circle(ctx, s * 0.1, -s * 0.36, s * 0.06, '#fbbf24');
}

function drawElderGolem(ctx, s) {
  drawMountainGolem(ctx, s);
  // Larger, add runes
  ctx.strokeStyle = '#818cf8'; ctx.lineWidth = s * 0.03;
  ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.42, 0, Math.PI * 2); ctx.stroke();
  // Rune symbols
  ctx.fillStyle = '#818cf8';
  ctx.font = `${s * 0.18}px serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('ᚱ', -s * 0.3, -s * 0.05);
  ctx.fillText('ᚦ', s * 0.3, -s * 0.05);
}

function drawGolemKing(ctx, s) {
  drawElderGolem(ctx, s);
  // Crown
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.moveTo(-s * 0.24, -s * 0.52); ctx.lineTo(-s * 0.24, -s * 0.7); ctx.lineTo(-s * 0.12, -s * 0.58); ctx.lineTo(0, -s * 0.75); ctx.lineTo(s * 0.12, -s * 0.58); ctx.lineTo(s * 0.24, -s * 0.7); ctx.lineTo(s * 0.24, -s * 0.52); ctx.closePath(); ctx.fill();
}

// ── Underground bosses ────────────────────────────────────────────────────────
function drawMineralSpirit(ctx, s) {
  // Crystal body
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath(); ctx.moveTo(0, -s * 0.55); ctx.lineTo(s * 0.35, -s * 0.1); ctx.lineTo(s * 0.28, s * 0.45); ctx.lineTo(-s * 0.28, s * 0.45); ctx.lineTo(-s * 0.35, -s * 0.1); ctx.closePath(); ctx.fill();
  // Inner glow
  ctx.fillStyle = '#a78bfa';
  ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.lineTo(s * 0.2, -s * 0.05); ctx.lineTo(0, s * 0.3); ctx.lineTo(-s * 0.2, -s * 0.05); ctx.closePath(); ctx.fill();
  // Facets
  ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = s * 0.02;
  ctx.beginPath(); ctx.moveTo(0, -s * 0.55); ctx.lineTo(0, s * 0.45); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-s * 0.35, -s * 0.1); ctx.lineTo(s * 0.35, -s * 0.1); ctx.stroke();
  // Eye
  circle(ctx, 0, -s * 0.05, s * 0.1, '#ede9fe');
  circle(ctx, 0, -s * 0.05, s * 0.05, '#4c1d95');
}

function drawShadowMonster(ctx, s, animFrame = 0) {
  ctx.globalAlpha = 0.9;
  // Amorphous dark form
  const t = animFrame * 0.03;
  ctx.fillStyle = '#0f0f1a';
  ctx.beginPath();
  ctx.ellipse(Math.sin(t) * s * 0.05, s * 0.05, s * 0.38 + Math.sin(t * 1.3) * s * 0.05, s * 0.42 + Math.cos(t * 0.9) * s * 0.04, t * 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Purple shimmer
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = s * 0.04;
  ctx.beginPath();
  ctx.ellipse(Math.sin(t) * s * 0.05, s * 0.05, s * 0.38 + Math.sin(t * 1.3) * s * 0.05, s * 0.42, t * 0.1, 0, Math.PI * 2);
  ctx.stroke();
  // Eyes
  circle(ctx, -s * 0.12, -s * 0.1, s * 0.07, '#a78bfa');
  circle(ctx, s * 0.12, -s * 0.1, s * 0.07, '#a78bfa');
  ctx.globalAlpha = 1;
}

function drawLordShadows(ctx, s, animFrame = 0) {
  drawShadowMonster(ctx, s, animFrame);
  // Shadow tendrils
  ctx.strokeStyle = '#4c1d95'; ctx.lineWidth = s * 0.05;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + animFrame * 0.02;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * s * 0.65, Math.sin(a) * s * 0.65); ctx.stroke();
  }
  // Crown
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.45); ctx.lineTo(-s * 0.2, -s * 0.65); ctx.lineTo(-s * 0.1, -s * 0.53); ctx.lineTo(0, -s * 0.7); ctx.lineTo(s * 0.1, -s * 0.53); ctx.lineTo(s * 0.2, -s * 0.65); ctx.lineTo(s * 0.2, -s * 0.45); ctx.closePath(); ctx.fill();
}

// ── Drylands bosses ───────────────────────────────────────────────────────────
function drawWastelandScavenger(ctx, s) {
  // Wings spread
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.1); ctx.lineTo(-s * 0.65, -s * 0.4); ctx.lineTo(-s * 0.55, s * 0.15); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.1); ctx.lineTo(s * 0.65, -s * 0.4); ctx.lineTo(s * 0.55, s * 0.15); ctx.closePath(); ctx.fill();
  // Body
  ellipse(ctx, 0, s * 0.05, s * 0.2, s * 0.3, '#92400e');
  // Neck & head (vulture-like)
  ellipse(ctx, 0, -s * 0.28, s * 0.06, s * 0.2, '#fca5a5');
  ellipse(ctx, 0, -s * 0.44, s * 0.14, s * 0.14, '#d97706');
  // Eyes
  circle(ctx, -s * 0.06, -s * 0.46, s * 0.05, '#000');
  circle(ctx, s * 0.06, -s * 0.46, s * 0.05, '#000');
  circle(ctx, -s * 0.05, -s * 0.47, s * 0.02, '#ef4444');
  // Beak
  ctx.fillStyle = '#b45309';
  ctx.beginPath(); ctx.moveTo(-s * 0.06, -s * 0.38); ctx.lineTo(s * 0.06, -s * 0.38); ctx.lineTo(0, -s * 0.28); ctx.closePath(); ctx.fill();
}

function drawMechanicalGolem(ctx, s) {
  // Steel body
  rect(ctx, 0, s * 0.1, s * 0.42, s * 0.52, '#374151');
  // Chest panel
  rect(ctx, 0, s * 0.05, s * 0.28, s * 0.28, '#1f2937');
  // Glowing core
  circle(ctx, 0, s * 0.05, s * 0.1, '#f97316');
  // Joints
  circle(ctx, -s * 0.28, -s * 0.15, s * 0.07, '#6b7280');
  circle(ctx, s * 0.28, -s * 0.15, s * 0.07, '#6b7280');
  // Arms
  rect(ctx, -s * 0.38, s * 0.1, s * 0.14, s * 0.42, '#4b5563');
  rect(ctx, s * 0.38, s * 0.1, s * 0.14, s * 0.42, '#4b5563');
  // Head
  rect(ctx, 0, -s * 0.38, s * 0.3, s * 0.26, '#374151');
  // Visor
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-s * 0.12, -s * 0.44, s * 0.24, s * 0.1);
  // Antenna
  ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = s * 0.03;
  ctx.beginPath(); ctx.moveTo(0, -s * 0.52); ctx.lineTo(0, -s * 0.7); ctx.stroke();
  circle(ctx, 0, -s * 0.72, s * 0.04, '#f97316');
}

function drawDrylandsDemon(ctx, s) {
  // Tail
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = s * 0.1;
  ctx.beginPath(); ctx.moveTo(s * 0.3, s * 0.4); ctx.quadraticCurveTo(s * 0.7, s * 0.1, s * 0.6, -s * 0.2); ctx.stroke();
  // Tail tip
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.moveTo(s * 0.56, -s * 0.3); ctx.lineTo(s * 0.7, -s * 0.18); ctx.lineTo(s * 0.5, -s * 0.1); ctx.closePath(); ctx.fill();
  // Body
  ellipse(ctx, 0, s * 0.1, s * 0.3, s * 0.38, '#c2410c');
  // Wings
  ctx.fillStyle = '#7c1d1d';
  ctx.beginPath(); ctx.moveTo(-s * 0.15, -s * 0.15); ctx.lineTo(-s * 0.6, -s * 0.55); ctx.lineTo(-s * 0.5, s * 0.1); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(s * 0.15, -s * 0.15); ctx.lineTo(s * 0.6, -s * 0.55); ctx.lineTo(s * 0.5, s * 0.1); ctx.closePath(); ctx.fill();
  // Head
  ellipse(ctx, 0, -s * 0.32, s * 0.22, s * 0.2, '#ef4444');
  // Horns
  ctx.fillStyle = '#7c1d1d';
  ctx.beginPath(); ctx.moveTo(-s * 0.14, -s * 0.46); ctx.lineTo(-s * 0.25, -s * 0.65); ctx.lineTo(-s * 0.08, -s * 0.44); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(s * 0.14, -s * 0.46); ctx.lineTo(s * 0.25, -s * 0.65); ctx.lineTo(s * 0.08, -s * 0.44); ctx.closePath(); ctx.fill();
  // Eyes
  circle(ctx, -s * 0.1, -s * 0.33, s * 0.06, '#fbbf24');
  circle(ctx, s * 0.1, -s * 0.33, s * 0.06, '#fbbf24');
}

// ── Fire bosses ───────────────────────────────────────────────────────────────
function drawFireSpirit(ctx, s, animFrame = 0) {
  const t = animFrame * 0.08;
  // Flame body
  for (let i = 0; i < 5; i++) {
    const h = 0.3 + i * 0.12;
    const w = 0.35 - i * 0.05;
    ctx.fillStyle = `rgba(${220 + i * 7}, ${80 - i * 15}, 0, ${0.85 - i * 0.1})`;
    ctx.beginPath();
    ctx.ellipse(Math.sin(t + i) * s * 0.06, -s * h + Math.cos(t + i * 0.5) * s * 0.04, s * w, s * (0.22 + i * 0.04), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Core
  circle(ctx, 0, s * 0.0, s * 0.22, '#fbbf24');
  // Face
  circle(ctx, -s * 0.1, -s * 0.05, s * 0.07, '#7c2d12');
  circle(ctx, s * 0.1, -s * 0.05, s * 0.07, '#7c2d12');
  ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = s * 0.04;
  ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.1, 0, Math.PI); ctx.stroke();
}

function drawNetherGuardian(ctx, s) {
  // Armored legs
  rect(ctx, -s * 0.15, s * 0.43, s * 0.18, s * 0.22, '#3f0000');
  rect(ctx, s * 0.15, s * 0.43, s * 0.18, s * 0.22, '#3f0000');
  // Body armor
  ellipse(ctx, 0, s * 0.1, s * 0.36, s * 0.4, '#1c0000');
  rect(ctx, 0, s * 0.1, s * 0.3, s * 0.32, '#450a0a');
  // Shoulder plates
  ellipse(ctx, -s * 0.35, -s * 0.1, s * 0.15, s * 0.12, '#3f0000');
  ellipse(ctx, s * 0.35, -s * 0.1, s * 0.15, s * 0.12, '#3f0000');
  // Helmet
  ellipse(ctx, 0, -s * 0.35, s * 0.24, s * 0.26, '#1c0000');
  // Visor slits
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-s * 0.15, -s * 0.38, s * 0.1, s * 0.06);
  ctx.fillRect(s * 0.05, -s * 0.38, s * 0.1, s * 0.06);
  // Sword
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = s * 0.06;
  ctx.beginPath(); ctx.moveTo(s * 0.42, -s * 0.65); ctx.lineTo(s * 0.42, s * 0.55); ctx.stroke();
  ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = s * 0.12;
  ctx.beginPath(); ctx.moveTo(s * 0.28, s * 0.05); ctx.lineTo(s * 0.56, s * 0.05); ctx.stroke();
}

function drawLordNetherlands(ctx, s, animFrame = 0) {
  const t = animFrame * 0.05;
  // Dark aura
  ctx.strokeStyle = `rgba(185, 28, 28, ${0.3 + Math.sin(t) * 0.2})`;
  ctx.lineWidth = s * 0.08;
  ctx.beginPath(); ctx.arc(0, 0, s * 0.75, 0, Math.PI * 2); ctx.stroke();
  // Robe
  ctx.fillStyle = '#1c0000';
  ctx.beginPath(); ctx.moveTo(-s * 0.4, s * 0.6); ctx.lineTo(s * 0.4, s * 0.6); ctx.lineTo(s * 0.28, -s * 0.2); ctx.lineTo(-s * 0.28, -s * 0.2); ctx.closePath(); ctx.fill();
  // Body
  ellipse(ctx, 0, -s * 0.05, s * 0.3, s * 0.32, '#450a0a');
  // Skull head
  ellipse(ctx, 0, -s * 0.38, s * 0.22, s * 0.24, '#f5f5f0');
  // Skull eye sockets
  circle(ctx, -s * 0.1, -s * 0.4, s * 0.08, '#1c0000');
  circle(ctx, s * 0.1, -s * 0.4, s * 0.08, '#1c0000');
  circle(ctx, -s * 0.1, -s * 0.4, s * 0.04, '#dc2626');
  circle(ctx, s * 0.1, -s * 0.4, s * 0.04, '#dc2626');
  // Teeth
  ctx.fillStyle = '#f5f5f0';
  for (let i = -2; i <= 2; i++) { rect(ctx, i * s * 0.06, -s * 0.2, s * 0.04, s * 0.06, '#f5f5f0'); }
  // Crown of flames
  for (let i = -3; i <= 3; i++) {
    const fx = i * s * 0.08;
    ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f97316';
    ctx.beginPath(); ctx.moveTo(fx - s * 0.04, -s * 0.55); ctx.lineTo(fx, -s * 0.55 - s * (0.1 + Math.abs(i) * 0.04)); ctx.lineTo(fx + s * 0.04, -s * 0.55); ctx.closePath(); ctx.fill();
  }
}

function drawDefaultBoss(ctx, s) {
  circle(ctx, 0, 0, s * 0.4, '#8b5cf6');
  ctx.font = `${s * 0.5}px serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('👾', 0, 0);
}