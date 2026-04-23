import React, { useRef, useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const [isFading, setIsFading] = useState(false);
  const [tSt, setTSt] = useState('idle');

  useEffect(() => {
    const CV = canvasRef.current;
    if (!CV) return;
    const C = CV.getContext('2d');
    
    const resize = () => { CV.width = window.innerWidth; CV.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    
    let startTm = Date.now();
    let raf;
    
    let particles = [];
    let trails = [];
    let shockwave = 0;
    
    const loop = () => {
      const now = Date.now();
      const dt = now - startTm;
      
      C.clearRect(0, 0, CV.width, CV.height);
      
      C.fillStyle = 'rgba(15, 17, 26, 0.98)';
      C.fillRect(0, 0, CV.width, CV.height);

      const cx = CV.width * 0.85; 
      const cy = CV.height - 100;
      const btnX = CV.width / 2;
      const btnY = 100;

      let headAngle = 0;
      let cursorX = cx;
      let cursorY = cy - 50;
      let shakeX = 0;
      let shakeY = 0;
      
      if (dt > 1000 && dt < 3500) {
        if (tSt !== 'pushing') setTSt('pushing');
        const p = (dt - 1000) / 2500;
        const ease = 1 - Math.pow(1 - p, 3);
        
        const cpx = btnX;
        const cpy = cy;
        
        const t = ease;
        const mt = 1 - t;
        cursorX = mt * mt * cx + 2 * mt * t * cpx + t * t * btnX;
        cursorY = mt * mt * (cy - 50) + 2 * mt * t * cpy + t * t * btnY;
        
        if (p > 0.4) {
          const intensity = (p - 0.4) * 2;
          shakeX = (Math.random() - 0.5) * 8 * intensity;
          shakeY = (Math.random() - 0.5) * 8 * intensity;
          
          if (Math.random() < 0.6) {
            particles.push({
              x: cx + shakeX, y: cy - 90 + shakeY,
              vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 1) * 10 - 2,
              l: 1.5, col: Math.random() > 0.5 ? '#10b981' : '#f59e0b'
            });
          }
        }
        
        trails.push({ x: cursorX, y: cursorY });
        if (trails.length > 20) trails.shift();
      } else if (dt >= 3500 && dt < 4500) {
        if (tSt !== 'clicked') setTSt('clicked');
        cursorX = btnX;
        cursorY = btnY;
        shockwave += 25;
      } else if (dt >= 4500) {
        if (!isFading) setIsFading(true);
        if (dt > 5000) { 
          cancelAnimationFrame(raf); 
          window.removeEventListener('resize', resize); 
          onComplete(); 
          return; 
        }
      }
      
      const dy = cursorY - (cy - 40);
      const dx = cursorX - cx;
      headAngle = Math.atan2(dy, dx) + Math.PI / 2;
      
      C.save();
      C.beginPath();
      if (trails.length > 0) C.moveTo(trails[0].x, trails[0].y);
      for (let i = 1; i < trails.length; i++) C.lineTo(trails[i].x, trails[i].y);
      C.strokeStyle = 'rgba(59,130,246,0.3)';
      C.lineWidth = 12;
      C.lineCap = 'round';
      C.stroke();
      C.restore();
      
      particles.forEach(pt => {
        pt.x += pt.vx; pt.y += pt.vy; pt.l -= 0.04;
        C.beginPath(); C.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        C.fillStyle = pt.col; C.globalAlpha = Math.max(0, pt.l);
        C.fill();
        C.globalAlpha = 1;
      });
      particles = particles.filter(pt => pt.l > 0);
      
      if (shockwave > 0) {
        C.save();
        C.beginPath(); C.arc(btnX, btnY, shockwave, 0, Math.PI * 2);
        C.lineWidth = Math.max(0, 40 - shockwave * 0.02);
        C.strokeStyle = `rgba(59,130,246, ${Math.max(0, 1 - shockwave/2000)})`;
        C.stroke();
        C.restore();
      }
      
      C.save();
      C.translate(cx + shakeX, cy + shakeY);
      
      C.fillStyle = '#1e2233';
      C.strokeStyle = '#3b82f6';
      C.lineWidth = 5;
      C.beginPath();
      C.moveTo(-70, 150);
      C.lineTo(-45, 0);
      C.quadraticCurveTo(0, -35, 45, 0);
      C.lineTo(70, 150);
      C.fill(); C.stroke();
      
      C.fillStyle = '#f43f5e';
      C.fillRect(-20, -50, 40, 50);
      
      C.translate(0, -40);
      C.rotate(headAngle);
      
      C.fillStyle = '#2c314a';
      C.fillRect(-45, -60, 90, 70);
      C.strokeStyle = '#10b981';
      C.lineWidth = 4;
      C.strokeRect(-45, -60, 90, 70);
      
      C.fillStyle = dt < 3500 ? '#10b981' : '#f59e0b';
      C.shadowColor = C.fillStyle;
      C.shadowBlur = 20;
      C.fillRect(-25, -45, 50, 14);
      C.shadowBlur = 0;
      
      C.beginPath();
      C.moveTo(0, -60);
      C.lineTo(0, -85);
      C.strokeStyle = '#94a3b8';
      C.lineWidth = 3;
      C.stroke();
      C.beginPath(); C.arc(0, -85, 6, 0, Math.PI * 2); C.fillStyle = '#f43f5e'; C.fill();
      
      C.restore();
      
      C.restore();
      
      C.save();
      C.translate(cursorX + shakeX * 1.5, cursorY);
      C.shadowColor = 'rgba(59,130,246,0.9)';
      C.shadowBlur = 25;
      C.fillStyle = '#fff';
      C.beginPath();
      C.moveTo(0, 0);
      C.lineTo(15, 35);
      C.lineTo(0, 25);
      C.lineTo(-15, 35);
      C.closePath();
      C.fill();
      C.restore();
      
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [onComplete]);

  return (
    <div className={`splash-container ${isFading ? 'fade-out' : ''}`}>
      <div className={`splash-btn ${tSt === 'clicked' ? 'clicked' : ''}`}>
        START
      </div>
      <canvas ref={canvasRef} style={{ display: 'block' }}></canvas>
    </div>
  );
}
