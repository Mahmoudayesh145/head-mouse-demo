import React, { useRef, useEffect, useState } from 'react';
import { toast, sparks } from '../utils';

export default function GamesSection({ onScore, onPass }) {
  const canvasRef = useRef(null);

  const [curG, setCurG] = useState('path');
  const [hudStats, setHudStats] = useState({ sc: 0, lv: 3, lel: 1, tm: 60 });
  const [gamesPlayed, setGamesPlayed] = useState(0);

  // Engine refs
  const engine = useRef({
    gSt: 'idle', // idle, playing, paused, over
    gSc: 0, gLv: 3, gLel: 1, gTm: 60,
    mx: 430, my: 215,
    gTmI: null, rafId: null,
    dodgI: null,
    
    // Path specifics
    pT: 0, pNodes: [], pW: 72, pSc: 0, pStars: [],
    
    // Dodge specifics
    balls: [], dSc: 0,
    
    // Track specifics
    tOrb: { x: 430, y: 215, vx: 3, vy: 2, r: 40 }, tSc: 0
  });

  const syncHUD = () => {
    setHudStats({
      sc: engine.current.gSc,
      lv: engine.current.gLv,
      lel: engine.current.gLel,
      tm: engine.current.gTm
    });
  };

  useEffect(() => {
    const CV = canvasRef.current;
    if (!CV) return;
    const C = CV.getContext('2d');
    const eng = engine.current;

    const handleMouseMove = (e) => {
      const r = CV.getBoundingClientRect();
      eng.mx = (e.clientX - r.left) * (CV.width / r.width);
      eng.my = (e.clientY - r.top) * (CV.height / r.height);
    };

    CV.addEventListener('mousemove', handleMouseMove);

    const bg = (col = '#f6f8ff') => {
      C.fillStyle = col; C.fillRect(0, 0, CV.width, CV.height);
      C.fillStyle = 'rgba(79,127,255,0.05)';
      for (let x = 30; x < CV.width; x += 50) {
        for (let y = 30; y < CV.height; y += 50) {
          C.beginPath(); C.arc(x, y, 2, 0, Math.PI * 2); C.fill();
        }
      }
    };

    const drawIdle = () => {
      bg(); C.textAlign = 'center';
      C.fillStyle = 'rgba(79,127,255,.85)'; C.font = 'bold 28px Nunito,sans-serif';
      C.fillText(curG === 'path' ? '🛸  PATH RACER' : curG === 'dodge' ? '💨  DODGE BLITZ' : '🎯  ORB TRACKER', CV.width / 2, CV.height / 2 - 16);
      C.fillStyle = '#8b93b5'; C.font = '500 14px Space Grotesk,sans-serif';
      C.fillText('Press START to play', CV.width / 2, CV.height / 2 + 18);
    };

    const drawOver = () => {
      bg('#fff8f8'); C.textAlign = 'center';
      C.fillStyle = '#ff5f7e'; C.font = 'bold 34px Nunito,sans-serif'; C.fillText('GAME OVER', CV.width / 2, CV.height / 2 - 18);
      C.fillStyle = '#8b93b5'; C.font = '500 15px Space Grotesk,sans-serif'; C.fillText('Score: ' + eng.gSc + '   —   Press RESET to try again', CV.width / 2, CV.height / 2 + 18);
    };

    const gOver = () => {
      eng.gSt = 'over';
      clearInterval(eng.gTmI);
      if(eng.dodgI) clearInterval(eng.dodgI);
      onScore(Math.floor(eng.gSc / 10));
      toast('Game Over! Score: ' + eng.gSc, 'e');
      setGamesPlayed(p => {
        const next = p + 1;
        return next;
      });
      drawOver();
    };

    const loseLif = () => {
      eng.gLv = Math.max(0, eng.gLv - 1);
      syncHUD();
      if (eng.gLv <= 0) gOver();
    };

    // ----- PATH RACER -----
    const genPath = () => {
      eng.pNodes = []; let y = 215;
      for (let x = 0; x <= 1200; x += 70) {
        y = Math.max(65, Math.min(365, y + (Math.random() - .5) * 95));
        eng.pNodes.push({ x, y });
      }
      eng.pStars = []; const cols = ['#4f7fff', '#ff5f7e', '#22c97a', '#f5a623'];
      for (let i = 0; i < 7; i++) {
        eng.pStars.push({ x: 100 + Math.random() * 660, y: 215, r: 9, col: cols[i % 4], grabbed: false });
      }
    };

    const pY = (x) => {
      for (let i = 0; i < eng.pNodes.length - 1; i++) {
        const a = eng.pNodes[i], b = eng.pNodes[i + 1];
        if (x >= a.x && x <= b.x) {
          const t = (x - a.x) / (b.x - a.x);
          return a.y + (b.y - a.y) * t;
        }
      }
      return 215;
    };

    const pathLoop = () => {
      if (eng.gSt !== 'playing' || curG !== 'path') return;
      bg('#f0f5ff'); eng.pT += 1.6;

      C.beginPath(); let first = true;
      for (let px = 0; px < CV.width; px += 5) {
        const py = pY(px + eng.pT);
        if (first) { C.moveTo(px, py - eng.pW); first = false; } else C.lineTo(px, py - eng.pW);
      }
      for (let px = CV.width; px >= 0; px -= 5) C.lineTo(px, pY(px + eng.pT) + eng.pW);
      C.closePath(); C.fillStyle = 'rgba(79,127,255,.08)'; C.fill();

      [[1, '#4f7fff'], [-1, '#8b5cf6']].forEach(([s, col]) => {
        C.beginPath(); first = true;
        for (let px = 0; px < CV.width; px += 4) {
          const py = pY(px + eng.pT) + s * eng.pW;
          if (first) { C.moveTo(px, py); first = false; } else C.lineTo(px, py);
        }
        C.strokeStyle = col; C.lineWidth = 2.5; C.stroke();
      });

      C.beginPath(); C.setLineDash([10, 10]); C.strokeStyle = 'rgba(79,127,255,.2)'; C.lineWidth = 1.5; first = true;
      for (let px = 0; px < CV.width; px += 4) {
        const py = pY(px + eng.pT);
        if (first) { C.moveTo(px, py); first = false; } else C.lineTo(px, py);
      }
      C.stroke(); C.setLineDash([]);

      const shipX = 130;
      eng.pStars.forEach(st => {
        st.x -= 1.8; st.y = pY(st.x + eng.pT);
        if (st.x < -20) { st.x = CV.width + 30; st.r = 9; st.grabbed = false; }
        if (!st.grabbed) {
          C.beginPath(); C.arc(st.x, st.y, st.r * (1 + .07 * Math.sin(Date.now() / 200)), 0, Math.PI * 2);
          C.fillStyle = st.col + '30'; C.fill();
          C.strokeStyle = st.col; C.lineWidth = 2; C.stroke();
          C.beginPath(); C.arc(st.x, st.y, st.r * .35, 0, Math.PI * 2); C.fillStyle = st.col; C.fill();
          
          if (Math.abs(st.x - shipX) < 18 && Math.abs(st.y - eng.my) < 18) {
            st.grabbed = true; eng.pSc += 10; eng.gSc = Math.floor(eng.pSc); syncHUD();
            const cr = CV.getBoundingClientRect(); sparks(cr.left + st.x, cr.top + st.y, st.col, 7);
          }
        }
      });

      const onPath = Math.abs(eng.my - pY(shipX + eng.pT)) < eng.pW;
      for (let i = 0; i < 4; i++) {
        C.beginPath(); C.arc(shipX - 13 - i * 8, eng.my + (Math.random() - .5) * 4, 2.5 - i * .5, 0, Math.PI * 2);
        C.fillStyle = `rgba(79,127,255,${.45 - i * .1})`; C.fill();
      }
      C.save(); C.translate(shipX, eng.my);
      const sc = onPath ? '#4f7fff' : '#ff5f7e';
      C.fillStyle = sc + '25'; C.strokeStyle = sc; C.lineWidth = 2.5;
      C.beginPath(); C.moveTo(22, 0); C.lineTo(-12, -13); C.lineTo(-5, 0); C.lineTo(-12, 13); C.closePath();
      C.fill(); C.stroke(); C.restore();

      if (onPath) { eng.pSc += .05; eng.gSc = Math.floor(eng.pSc); } 
      else { C.fillStyle = 'rgba(255,95,126,.05)'; C.fillRect(0, 0, CV.width, CV.height); }
      if (eng.my < 5 || eng.my > CV.height - 5) loseLif();
      
      eng.gLel = Math.min(5, 1 + Math.floor(eng.gSc / 60)); 
      eng.pW = Math.max(28, 72 - eng.gLel * 8); 
      syncHUD();

      C.textAlign = 'left'; C.font = '600 13px Space Grotesk,sans-serif';
      C.fillStyle = onPath ? '#22c97a' : '#ff5f7e';
      C.fillText(onPath ? '✓ On track' : '⚠ Off track!', 12, 24);
      C.fillStyle = '#f5a623'; C.fillText('Stars: collect them! ★', CV.width - 180, 24);
      eng.rafId = requestAnimationFrame(pathLoop);
    };

    // ----- DODGE BLITZ -----
    const BCOLS = ['#4f7fff', '#ff5f7e', '#22c97a', '#f5a623', '#8b5cf6'];
    const spawnBall = () => {
      const side = Math.random() < .5 ? -20 : CV.width + 20;
      eng.balls.push({
        x: side, y: 40 + Math.random() * (CV.height - 80),
        vx: (side < 0 ? 1 : -1) * (2.5 + eng.gLel * .5), vy: (Math.random() - .5) * 2.5,
        r: 13, col: BCOLS[Math.floor(Math.random() * BCOLS.length)], trail: []
      });
    };

    const dodgeLoop = () => {
      if (eng.gSt !== 'playing' || curG !== 'dodge') { clearInterval(eng.dodgI); return; }
      bg('#f4f8ff');
      eng.balls = eng.balls.filter(b => b.x > -50 && b.x < CV.width + 50);
      eng.balls.forEach(b => {
        b.trail.push({ x: b.x, y: b.y }); if (b.trail.length > 7) b.trail.shift();
        b.x += b.vx; b.y += b.vy; if (b.y < b.r || b.y > CV.height - b.r) b.vy *= -1;
        b.trail.forEach((p, i) => {
          C.beginPath(); C.arc(p.x, p.y, b.r * (i / b.trail.length) * .55, 0, Math.PI * 2);
          C.fillStyle = b.col + Math.round((i / b.trail.length) * 44).toString(16).padStart(2, '0'); C.fill();
        });
        C.beginPath(); C.arc(b.x, b.y, b.r, 0, Math.PI * 2); C.fillStyle = b.col; C.fill();
        C.strokeStyle = '#fff'; C.lineWidth = 2; C.stroke();
        C.beginPath(); C.arc(b.x - b.r * .3, b.y - b.r * .3, b.r * .25, 0, Math.PI * 2); C.fillStyle = 'rgba(255,255,255,.45)'; C.fill();
        const dx = eng.mx - b.x, dy = eng.my - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < b.r + 13) { loseLif(); eng.balls = eng.balls.filter(x => x !== b); }
      });
      eng.dSc += .025; eng.gSc = Math.floor(eng.dSc); eng.gLel = Math.min(5, 1 + Math.floor(eng.gSc / 40)); syncHUD();
      
      C.beginPath(); C.arc(eng.mx, eng.my, 14, 0, Math.PI * 2); C.fillStyle = 'rgba(79,127,255,.15)'; C.fill();
      C.strokeStyle = '#4f7fff'; C.lineWidth = 2.5; C.stroke();
      C.beginPath(); C.arc(eng.mx, eng.my, 4, 0, Math.PI * 2); C.fillStyle = '#4f7fff'; C.fill();
      C.strokeStyle = 'rgba(79,127,255,.4)'; C.lineWidth = 1.2;
      C.beginPath(); C.moveTo(eng.mx - 22, eng.my); C.lineTo(eng.mx + 22, eng.my); C.stroke();
      C.beginPath(); C.moveTo(eng.mx, eng.my - 22); C.lineTo(eng.mx, eng.my + 22); C.stroke();
      C.textAlign = 'left'; C.font = '600 13px Space Grotesk,sans-serif'; C.fillStyle = '#4f7fff';
      C.fillText('💨 Dodge the balls! Survival = score', 12, 24);
      eng.rafId = requestAnimationFrame(dodgeLoop);
    };

    // ----- ORB TRACKER -----
    const trackLoop = () => {
      if (eng.gSt !== 'playing' || curG !== 'track') return;
      bg('#fffcfc');
      
      let o = eng.tOrb;
      o.x += o.vx; 
      o.y += o.vy;
      
      // Bounce
      if(o.x < o.r) { o.x = o.r; o.vx *= -1; }
      if(o.x > CV.width - o.r) { o.x = CV.width - o.r; o.vx *= -1; }
      if(o.y < o.r) { o.y = o.r; o.vy *= -1; }
      if(o.y > CV.height - o.r) { o.y = CV.height - o.r; o.vy *= -1; }
      
      // Random direction shifts
      if(Math.random() < 0.025) {
         const speed = 4 + eng.gLel * 0.8;
         o.vx = (Math.random() - 0.5) * speed * 2;
         o.vy = (Math.random() - 0.5) * speed * 2;
      }

      // Check distance
      const dx = eng.mx - o.x;
      const dy = eng.my - o.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const isTracking = dist < o.r;

      if(isTracking) {
          eng.tSc += 0.2;
          eng.gSc = Math.floor(eng.tSc);
          C.shadowColor = 'rgba(34,201,122,0.6)';
          C.shadowBlur = 20;
          C.fillStyle = 'rgba(34,201,122,0.85)';
          C.strokeStyle = '#22c97a';
      } else {
          // Miss penalty and visuals
          C.shadowColor = 'rgba(245,166,35,0.4)';
          C.shadowBlur = 10;
          C.fillStyle = 'rgba(245,166,35,0.7)';
          C.strokeStyle = '#f5a623';
      }

      // Draw Orb
      C.beginPath();
      C.arc(o.x, o.y, o.r + (isTracking ? Math.sin(Date.now() / 150) * 3 : 0), 0, Math.PI * 2);
      C.fill(); C.lineWidth = 3; C.stroke();
      
      // Draw inner core
      C.beginPath();
      C.arc(o.x, o.y, o.r * 0.4, 0, Math.PI * 2);
      C.fillStyle = '#fff';
      C.fill();
      C.shadowBlur = 0; // reset shadow

      // Draw Player Cursor
      C.strokeStyle = isTracking ? '#22c97a' : '#ff5f7e';
      C.lineWidth = 1.5;
      C.beginPath(); C.moveTo(eng.mx - 18, eng.my); C.lineTo(eng.mx + 18, eng.my); C.stroke();
      C.beginPath(); C.moveTo(eng.mx, eng.my - 18); C.lineTo(eng.mx, eng.my + 18); C.stroke();
      C.beginPath(); C.arc(eng.mx, eng.my, 5, 0, Math.PI * 2); C.stroke();

      // Difficulty scale
      eng.gLel = Math.min(10, 1 + Math.floor(eng.gSc / 30));
      o.r = Math.max(15, 45 - eng.gLel * 2.5); // orb shrinks as you progress
      syncHUD();

      C.textAlign = 'left'; C.font = '600 13px Space Grotesk,sans-serif'; 
      C.fillStyle = isTracking ? '#22c97a' : '#f5a623'; 
      C.fillText(isTracking ? '🎯 TRACKING PERFECT!' : '⚠ Catch the orb!', 12, 24);
      
      eng.rafId = requestAnimationFrame(trackLoop);
    };

    // Expose engine controls to global so buttons can use them
    window.gEngine = {
      gStart: () => {
        if (eng.gSt === 'playing') return;
        eng.gSt = 'playing'; eng.gSc = 0; eng.gLv = 3; eng.gLel = 1; eng.gTm = 60; syncHUD();
        clearInterval(eng.gTmI);
        eng.gTmI = setInterval(() => {
          if (eng.gSt === 'playing') {
            eng.gTm--; syncHUD();
            if (eng.gTm <= 0) {
              eng.gSt = 'over'; clearInterval(eng.gTmI);
              if(eng.dodgI) clearInterval(eng.dodgI);
              toast('Time up! Score: ' + eng.gSc, 'i');
              drawOver();
            }
          }
        }, 1000);
        if (curG === 'path') {
          genPath(); eng.pT = 0; eng.pSc = 0; pathLoop();
        } else if (curG === 'dodge') {
          eng.balls = []; eng.dSc = 0; dodgeLoop(); spawnBall();
          eng.dodgI = setInterval(() => { if (eng.gSt === 'playing') spawnBall(); }, 650 - eng.gLel * 45);
        } else if (curG === 'track') {
          eng.tOrb = { x: CV.width / 2, y: CV.height / 2, vx: 3, vy: 2, r: 45 }; eng.tSc = 0; trackLoop();
        }
      },
      gPause: () => {
        if (eng.gSt === 'playing') {
          eng.gSt = 'paused'; clearInterval(eng.gTmI); cancelAnimationFrame(eng.rafId);
        } else if (eng.gSt === 'paused') {
          eng.gSt = 'playing';
          eng.gTmI = setInterval(() => {
            if (eng.gSt === 'playing') {
              eng.gTm--; syncHUD();
              if (eng.gTm <= 0) { eng.gSt = 'over'; clearInterval(eng.gTmI); drawOver(); }
            }
          }, 1000);
          if (curG === 'path') pathLoop(); else if (curG === 'dodge') dodgeLoop(); else if (curG === 'track') trackLoop();
        }
      },
      gReset: () => {
        eng.gSt = 'idle'; eng.gSc = 0; eng.gLv = 3; eng.gLel = 1; eng.gTm = 60;
        clearInterval(eng.gTmI); cancelAnimationFrame(eng.rafId);
        if(eng.dodgI) clearInterval(eng.dodgI);
        syncHUD(); drawIdle();
      }
    };

    window.gEngine.gReset();

    return () => {
      CV.removeEventListener('mousemove', handleMouseMove);
      clearInterval(eng.gTmI);
      cancelAnimationFrame(eng.rafId);
      if(eng.dodgI) clearInterval(eng.dodgI);
    };
  }, [curG, onScore, onPass]);

  return (
    <div className="sec" style={{ display: 'block' }}>
      <div className="sh">
        <div className="st">Mouse <span style={{ color: 'var(--purple)' }}>Games</span></div>
        <div className="sd">Fun games to test your precision, speed & control</div>
      </div>
      <div className="gs">
        <div className={`gc ${curG === 'path' ? 'sel' : ''}`} onClick={() => setCurG('path')}>
          <div className="gi">🛸</div>
          <div className="gn">PATH RACER</div>
          <div className="gd">Stay inside the corridor!</div>
        </div>
        <div className={`gc ${curG === 'dodge' ? 'sel' : ''}`} onClick={() => setCurG('dodge')}>
          <div className="gi">💨</div>
          <div className="gn">DODGE BLITZ</div>
          <div className="gd">Dodge all incoming balls</div>
        </div>
        <div className={`gc ${curG === 'track' ? 'sel' : ''}`} onClick={() => setCurG('track')}>
          <div className="gi">🎯</div>
          <div className="gn">ORB TRACKER</div>
          <div className="gd">Keep cursor in moving orb</div>
        </div>
      </div>
      
      <div className="cw">
        <canvas ref={canvasRef} width="860" height="430"></canvas>
      </div>
      
      <div className="ghud">
        <div className="hi">Score: <b style={{ color: 'var(--purple)' }}>{hudStats.sc}</b></div>
        <div className="hi">Lives: <b style={{ color: 'var(--purple)' }}>{curG === 'track' ? '∞' : '❤️'.repeat(Math.max(0, hudStats.lv))}</b></div>
        <div className="hi">Level: <b style={{ color: 'var(--purple)' }}>{hudStats.lel}</b></div>
        <div className="hi">Time: <b style={{ color: 'var(--purple)' }}>{hudStats.tm}</b>s</div>
      </div>
      
      <div className="gbtns">
        <button className="gb" onClick={() => window.gEngine && window.gEngine.gStart()}>▶ Start</button>
        <button className="gb ol" onClick={() => window.gEngine && window.gEngine.gPause()}>⏸ Pause</button>
        <button className="gb ol" onClick={() => window.gEngine && window.gEngine.gReset()}>↺ Reset</button>
      </div>
    </div>
  );
}
