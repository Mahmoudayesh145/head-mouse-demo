import React, { useState, useEffect, useRef } from 'react';
import { toast } from '../utils';

export default function ScrollSection({ onScore, onPass }) {
  // Test 1: Scroll Reach
  const [t1State, setT1State] = useState('act'); // act, pass
  const t1BoxRef = useRef(null);
  const t1TgtRef = useRef(null);

  const checkT1Reach = () => {
    if (t1State === 'pass') return;
    const box = t1BoxRef.current;
    const tgt = t1TgtRef.current;
    if (!box || !tgt) return;

    const br = box.getBoundingClientRect();
    const tr = tgt.getBoundingClientRect();
    
    // If target is inside the visible area of the box
    if (tr.top >= br.top && tr.bottom <= br.bottom) {
      setT1State('pass');
      toast('Scroll Reach done! +50', 's');
      onScore(50);
      onPass('scroll' + 1);
    }
  };

  // Test 2: Notch Counter
  const [t2State, setT2State] = useState('idle'); // idle, act, pass
  const [t2Phase, setT2Phase] = useState('down'); // down, up
  const [t2Notches, setT2Notches] = useState(0);

  const startT2 = () => {
    setT2State('act');
    setT2Phase('down');
    setT2Notches(0);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (t2State !== 'act') return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? 'down' : 'up';
      
      if (t2Phase === 'down' && dir === 'down') {
        setT2Notches(n => {
          const next = n + 1;
          if (next >= 10) {
            setT2Phase('up');
            toast('Now scroll UP 10x!', 'i');
            return 0;
          }
          return next;
        });
      } else if (t2Phase === 'up' && dir === 'up') {
        setT2Notches(n => {
          const next = n + 1;
          if (next >= 10) {
            setT2State('pass');
            toast('Notch Counter done! +75', 's');
            onScore(75);
            onPass('scroll' + 2);
            return 10;
          }
          return next;
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [t2State, t2Phase, onScore, onPass]);

  // Test 3: Speed Scroll
  const [t3State, setT3State] = useState('idle');
  const [t3Progress, setT3Progress] = useState(0);
  const t3StartRef = useRef(null);
  const t3BoxRef = useRef(null);

  const startT3 = () => {
    setT3State('act');
    setT3Progress(0);
    t3StartRef.current = null;
    if (t3BoxRef.current) t3BoxRef.current.scrollTop = 0;
  };

  const checkT3SS = (e) => {
    if (t3State !== 'act') return;
    const b = e.target;
    if (!t3StartRef.current) t3StartRef.current = Date.now();
    
    // Calculate progress
    // b.scrollHeight is total, b.clientHeight is visible, so max scrollTop is scrollHeight - clientHeight
    const maxScroll = b.scrollHeight - b.clientHeight;
    if (maxScroll <= 0) return;
    
    const p = b.scrollTop / maxScroll;
    setT3Progress(p * 100);
    
    if (p >= 0.95) {
      setT3State('pass');
      const s = ((Date.now() - t3StartRef.current) / 1000).toFixed(1);
      toast(`Speed Scroll ${s}s! +50`, 's');
      onScore(50);
      onPass('scroll' + 3);
    }
  };

  return (
    <div className="sec" style={{ display: 'block' }}>
      <div className="sh">
        <div className="st">Scroll <span style={{ color: 'var(--green)' }}>Tests</span></div>
        <div className="sd">Accuracy · counting · speed</div>
      </div>
      <div className="tg">
        
        {/* T1 */}
        <div className="card" style={{ '--ac': 'var(--green)' }}>
          <div className="ctb" style={{ background: 'var(--green)' }} />
          <div className="cn">Test 01</div>
          <div className="ct" style={{ color: 'var(--green)' }}>📜 Scroll Reach</div>
          <div className="cd">Scroll the box to reveal the ⭐ target item.</div>
          
          <div className={`badge ${t1State === 'pass' ? 'pass' : 'act'}`}>
            {t1State === 'pass' ? '✓ Pass' : '● Scroll ↓'}
          </div>
          
          <div className="sbox" ref={t1BoxRef} onScroll={checkT1Reach}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i} 
                className={`si ${i === 5 ? 'tgt-i' : ''}`}
                ref={i === 5 ? t1TgtRef : null}
              >
                {i === 5 ? '⭐ TARGET ROW — scroll here!' : `Row ${i + 1} — packet data`}
              </div>
            ))}
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--green)', width: t1State === 'pass' ? '100%' : '0%' }} />
          </div>
          <div className="pl">{t1State === 'pass' ? 'Target reached! +50' : 'Scroll to the ⭐ row'}</div>
        </div>

        {/* T2 */}
        <div className="card" style={{ '--ac': 'var(--green)' }}>
          <div className="ctb" style={{ background: 'var(--green)' }} />
          <div className="cn">Test 02</div>
          <div className="ct" style={{ color: 'var(--green)' }}>🔢 Notch Counter</div>
          <div className="cd">Scroll exactly 10 notches down, then 10 back up.</div>
          
          <div className={`badge ${t2State}`}>
            {t2State === 'idle' ? 'Idle' : t2State === 'act' ? '● Scroll ↓' : '✓ Pass'}
          </div>
          
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: '4.5rem', fontWeight: 900, color: 'var(--green)' }}>
              {t2Notches}
            </div>
            <div style={{ fontSize: '1.2rem', color: 'var(--muted)', marginTop: '2px', fontWeight: 600 }}>
              {t2State === 'act' ? (t2Phase === 'down' ? 'Scroll DOWN ↓' : 'Now scroll UP ↑') : 'Press Start, then scroll ↓'}
            </div>
            <div style={{ height: '7px', background: 'var(--bg2)', borderRadius: '99px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${(t2Notches / 10) * 100}%`, height: '100%', background: 'var(--green)', borderRadius: '99px', transition: 'width 0.2s' }} />
            </div>
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--green)', width: `${((t2Phase === 'up' ? 10 + t2Notches : t2Notches) / 20) * 100}%` }} />
          </div>
          <div className="pl">{t2Phase === 'up' ? 10 + t2Notches : t2Notches} / 20 notches</div>
          <button className="btn btn-green" onClick={startT2} disabled={t2State === 'act'}>
            Start Test
          </button>
        </div>

        {/* T3 */}
        <div className="card" style={{ '--ac': 'var(--green)' }}>
          <div className="ctb" style={{ background: 'var(--green)' }} />
          <div className="cn">Test 03</div>
          <div className="ct" style={{ color: 'var(--green)' }}>🚀 Speed Scroll</div>
          <div className="cd">Scroll the list all the way to the bottom, fast!</div>
          
          <div className={`badge ${t3State}`}>
            {t3State === 'idle' ? 'Idle' : t3State === 'act' ? '● Scroll!' : '✓ Pass'}
          </div>
          
          <div className="sbox" ref={t3BoxRef} onScroll={checkT3SS} style={{ height: '100px' }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="si">
                Record {i + 1} — ID {Math.random().toString(36).slice(2, 8).toUpperCase()}
              </div>
            ))}
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--green)', width: `${t3Progress}%` }} />
          </div>
          <div className="pl">{t3State === 'pass' ? 'Bottom reached!' : 'Scroll to the bottom'}</div>
          <button className="btn btn-green" onClick={startT3} disabled={t3State === 'act'}>
            Start Test
          </button>
        </div>

      </div>
    </div>
  );
}
