// Draws a full-body pixel-art style character on a canvas context
// cx, cy = center-bottom of character (feet position)
// size = height in pixels
// facing = 'up' | 'down' | 'left' | 'right'
// walkFrame = 0..N for animation
// avatarColor = hex string

export function drawPlayerSprite(ctx, cx, cy, size, facing, walkFrame, avatarColor = '#6366f1') {
  const s = size;
  const bob = Math.sin(walkFrame * 0.18) * (s * 0.04);
  const legSwing = Math.sin(walkFrame * 0.18) * (s * 0.12);

  ctx.save();
  ctx.translate(cx, cy);

  // Mirror for left movement
  if (facing === 'left') ctx.scale(-1, 1);

  const headY = -s + bob;
  const bodyTopY = headY + s * 0.28;
  const bodyBotY = bodyTopY + s * 0.32;
  const headR = s * 0.15;

  // Shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 2, s * 0.2, s * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Legs (drawn behind body) ---
  const legW = s * 0.09;
  const legH = s * 0.25;
  const legTopY = bodyBotY;

  // Left leg
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  const ll = -s * 0.08;
  ctx.roundRect
    ? ctx.roundRect(ll - legW / 2, legTopY + legSwing * 0.5, legW, legH, 3)
    : ctx.rect(ll - legW / 2, legTopY + legSwing * 0.5, legW, legH);
  ctx.fill();
  // Shoe
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(ll, legTopY + legH + legSwing * 0.5, legW * 0.8, legW * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right leg
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  const rl = s * 0.08;
  ctx.roundRect
    ? ctx.roundRect(rl - legW / 2, legTopY - legSwing * 0.5, legW, legH, 3)
    : ctx.rect(rl - legW / 2, legTopY - legSwing * 0.5, legW, legH);
  ctx.fill();
  // Shoe
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(rl, legTopY + legH - legSwing * 0.5, legW * 0.8, legW * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Body ---
  ctx.save();
  // Shirt/torso
  ctx.fillStyle = avatarColor;
  ctx.beginPath();
  const bW = s * 0.26;
  ctx.roundRect
    ? ctx.roundRect(-bW / 2, bodyTopY + bob, bW, bodyBotY - bodyTopY, 4)
    : ctx.rect(-bW / 2, bodyTopY + bob, bW, bodyBotY - bodyTopY);
  ctx.fill();
  // Belt line
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(-bW / 2, bodyBotY - s * 0.04 + bob, bW, s * 0.04);
  ctx.restore();

  // --- Arms ---
  const armW = s * 0.08;
  const armH = s * 0.26;
  const armTopY = bodyTopY + s * 0.04 + bob;

  // Left arm
  ctx.save();
  ctx.fillStyle = avatarColor;
  ctx.beginPath();
  const la = -bW / 2 - armW;
  ctx.roundRect
    ? ctx.roundRect(la, armTopY + legSwing * 0.4, armW, armH, 3)
    : ctx.rect(la, armTopY + legSwing * 0.4, armW, armH);
  ctx.fill();
  // Hand
  const skinTone = '#fcd5b4';
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(la + armW / 2, armTopY + armH + legSwing * 0.4, armW * 0.55, armW * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right arm
  ctx.save();
  ctx.fillStyle = avatarColor;
  ctx.beginPath();
  const ra = bW / 2;
  ctx.roundRect
    ? ctx.roundRect(ra, armTopY - legSwing * 0.4, armW, armH, 3)
    : ctx.rect(ra, armTopY - legSwing * 0.4, armW, armH);
  ctx.fill();
  // Hand
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(ra + armW / 2, armTopY + armH - legSwing * 0.4, armW * 0.55, armW * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Head ---
  ctx.save();
  // Neck
  ctx.fillStyle = skinTone;
  ctx.fillRect(-s * 0.05, bodyTopY - s * 0.03 + bob, s * 0.1, s * 0.05);

  // Head shape
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(0, headY + headR + bob, headR, headR * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#3b1f0a';
  ctx.beginPath();
  ctx.ellipse(0, headY + headR * 0.3 + bob, headR, headR * 0.65, 0, 0, Math.PI);
  ctx.fill();
  // Side hair tufts
  ctx.beginPath();
  ctx.ellipse(-headR * 0.85, headY + headR * 0.55 + bob, headR * 0.28, headR * 0.45, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headR * 0.85, headY + headR * 0.55 + bob, headR * 0.28, headR * 0.45, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeY = headY + headR * 0.8 + bob;
  ctx.fillStyle = facing === 'up' ? 'transparent' : '#1e293b';
  if (facing !== 'up') {
    ctx.beginPath();
    ctx.ellipse(-headR * 0.38, eyeY, headR * 0.13, headR * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headR * 0.38, eyeY, headR * 0.13, headR * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(-headR * 0.34, eyeY - headR * 0.04, headR * 0.05, headR * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headR * 0.42, eyeY - headR * 0.04, headR * 0.05, headR * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smile
  if (facing === 'down' || facing === 'right' || facing === 'left') {
    ctx.strokeStyle = '#7c3a1a';
    ctx.lineWidth = s * 0.02;
    ctx.beginPath();
    ctx.arc(0, eyeY + headR * 0.28, headR * 0.22, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}