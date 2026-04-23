import React, { useState, useEffect } from 'react';
import { toast, sparks } from '../utils';

export default function RightClickSection({ onScore, onPass, onHit }) {
  // Test 1: Zone Clicker
  const [t1State, setT1State] = useState('idle');
  const [t1Cur, setT1Cur] = useState(0);
  const [t1Hits, setT1Hits] = useState(0);
  const ZONES = ['ALPHA', 'BETA', 'GAMMA', 'DELTA'];

  const startT1 = () => {
    setT1State('act');
    setT1Hits(0);
    setT1Cur(0);
  };

  const handleT1RightClick = (e, index) => {
    e.preventDefault();
    if (t1State !== 'act') return;
    if (index !== t1Cur) {
      toast('Click them in order!', 'e');
      return;
    }
    
    sparks(e.clientX, e.clientY, '#ff5f7e');
    const newHits = t1Hits + 1;
    setT1Hits(newHits);
    setT1Cur(index + 1);
    onHit(1, 1);
    
    if (newHits === 4) {
      setT1State('pass');
      toast('Zone Clicker done! +100', 's');
      onScore(100);
      onPass('rightclick' + 1);
    }
  };

  const handleT1Click = (e) => {
    e.preventDefault();
    if (t1State === 'act') {
      toast('Use RIGHT click!', 'e');
    }
  };

  // Test 2: Right Only
  const [t2State, setT2State] = useState('idle');
  const [t2Hits, setT2Hits] = useState(0);
  const [t2Classes, setT2Classes] = useState('tgt');

  const startT2 = () => {
    setT2State('act');
    setT2Hits(0);
  };

  const handleT2RightClick = (e) => {
    e.preventDefault();
    if (t2State !== 'act') return;
    
    setT2Hits(h => h + 1);
    onHit(1, 1);
    sparks(e.clientX, e.clientY, '#ff5f7e');
    
    setT2Classes('tgt hit');
    setTimeout(() => setT2Classes('tgt'), 200);

    if (t2Hits + 1 >= 5) {
      setT2State('pass');
      toast('Right Only done! +75', 's');
      onScore(75);
      onPass('rightclick' + 2);
    }
  };

  const handleT2Click = (e) => {
    e.preventDefault();
    if (t2State !== 'act') return;
    onHit(0, 1);
    setT2Classes('tgt miss');
    setTimeout(() => setT2Classes('tgt'), 300);
    toast('Wrong button!', 'e');
  };

  // Test 3: Grid Nav
  const [t3State, setT3State] = useState('idle');
  const [t3Hits, setT3Hits] = useState(0);
  const [t3Star, setT3Star] = useState(-1);

  const startT3 = () => {
    setT3State('act');
    setT3Hits(0);
    setT3Star(Math.floor(Math.random() * 12));
  };

  const nextT3Round = () => {
    setT3Star(Math.floor(Math.random() * 12));
  };

  const handleT3RightClick = (e, isStar) => {
    e.preventDefault();
    if (t3State !== 'act') return;

    if (isStar) {
      sparks(e.clientX, e.clientY, '#ff5f7e');
      onHit(1, 1);
      const newHits = t3Hits + 1;
      setT3Hits(newHits);
      
      if (newHits >= 3) {
        setT3State('pass');
        setT3Star(-1);
        toast('Grid Nav done! +75', 's');
        onScore(75);
        onPass('rightclick' + 3);
      } else {
        nextT3Round();
      }
    } else {
      toast('Wrong cell!', 'e');
    }
  };

  const handleT3Click = (e) => {
    e.preventDefault();
    if (t3State === 'act') toast('Use RIGHT click!', 'e');
  };

  return (
    <div className="sec" style={{ display: 'block' }}>
      <div className="sh">
        <div className="st">Right Click <span style={{ color: 'var(--rose)' }}>Tests</span></div>
        <div className="sd">Three tests — right button precision</div>
      </div>
      <div className="tg">
        
        {/* T1 */}
        <div className="card" style={{ '--ac': 'var(--rose)' }}>
          <div className="ctb" style={{ background: 'var(--rose)' }} />
          <div className="cn">Test 01</div>
          <div className="ct" style={{ color: 'var(--rose)' }}>📌 Zone Clicker</div>
          <div className="cd">Right-click the glowing zone, in order 1→4.</div>
          
          <div className={`badge ${t1State}`}>{t1State === 'idle' ? 'Idle' : t1State === 'act' ? '● Active' : '✓ Pass'}</div>
          
          <div className="ca">
            {ZONES.map((zone, i) => {
              const isActive = i === t1Cur && t1State === 'act';
              const isHit = i < t1Cur;
              return (
                <div 
                  key={i}
                  className="tgt"
                  onContextMenu={(e) => handleT1RightClick(e, i)}
                  onClick={handleT1Click}
                  style={{
                    background: isHit ? 'var(--rose)' : 'var(--rose-l)',
                    borderColor: 'var(--rose)',
                    color: isHit ? '#fff' : 'var(--rose)',
                    fontSize: '.55rem',
                    fontWeight: 800,
                    transform: isActive ? 'scale(1.16)' : 'scale(1)',
                    boxShadow: isActive ? '0 0 16px rgba(255,95,126,.35)' : '',
                    transition: 'all 0.2s'
                  }}
                >
                  {zone}
                </div>
              );
            })}
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--rose)', width: `${(t1Hits / 4) * 100}%` }} />
          </div>
          <div className="pl">{t1Hits} / 4 zones</div>
          <button className="btn btn-rose" onClick={startT1} disabled={t1State === 'act'}>
            {t1State === 'pass' ? 'Restart Test' : 'Start Test'}
          </button>
        </div>

        {/* T2 */}
        <div className="card" style={{ '--ac': 'var(--rose)' }}>
          <div className="ctb" style={{ background: 'var(--rose)' }} />
          <div className="cn">Test 02</div>
          <div className="ct" style={{ color: 'var(--rose)' }}>🚫 Right Only</div>
          <div className="cd">Right-click 5 times. Left-click = miss!</div>
          
          <div className={`badge ${t2State}`}>{t2State === 'idle' ? 'Idle' : t2State === 'act' ? '● Active' : '✓ Pass'}</div>
          
          <div className="ca">
            <div 
              className={t2Classes}
              onContextMenu={handleT2RightClick}
              onClick={handleT2Click}
              style={{
                width: '86px', height: '86px', background: 'var(--rose-l)', 
                borderColor: 'var(--rose)', color: 'var(--rose)', 
                fontWeight: 900, fontSize: '.8rem'
              }}
            >
              RIGHT<br/>CLICK
            </div>
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--rose)', width: `${(t2Hits / 5) * 100}%` }} />
          </div>
          <div className="pl">{t2Hits} / 5 right clicks</div>
          <button className="btn btn-rose" onClick={startT2} disabled={t2State === 'act'}>
            Start Test
          </button>
        </div>

        {/* T3 */}
        <div className="card" style={{ '--ac': 'var(--rose)' }}>
          <div className="ctb" style={{ background: 'var(--rose)' }} />
          <div className="cn">Test 03</div>
          <div className="ct" style={{ color: 'var(--rose)' }}>🔢 Grid Nav</div>
          <div className="cd">Find and right-click the ★ cell. 3 rounds!</div>
          
          <div className={`badge ${t3State}`}>{t3State === 'idle' ? 'Idle' : t3State === 'act' ? '● Active' : '✓ Pass'}</div>
          
          <div className="ca" style={{ flexWrap: 'wrap', gap: '7px' }}>
            {Array.from({ length: 12 }, (_, i) => {
              const isStar = i === t3Star;
              return (
                <div 
                  key={i}
                  className="tgt"
                  onContextMenu={(e) => handleT3RightClick(e, isStar)}
                  onClick={handleT3Click}
                  style={isStar ? {
                    width: '44px', height: '44px', fontSize: '1rem', fontWeight: 900,
                    borderColor: 'var(--amber)', background: 'var(--amber-l)', color: 'var(--amber)'
                  } : {
                    width: '44px', height: '44px', fontSize: '.62rem', fontWeight: 900,
                    background: 'var(--rose-l)', borderColor: 'var(--rose)', color: 'var(--rose)'
                  }}
                >
                  {isStar ? '★' : i + 1}
                </div>
              );
            })}
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--rose)', width: `${(t3Hits / 3) * 100}%` }} />
          </div>
          <div className="pl">
            {t3State === 'pass' ? 'Completed 3 rounds' : t3State === 'act' ? `${t3Hits} / 3 — right-click ★` : 'Find the ★ cell'}
          </div>
          <button className="btn btn-rose" onClick={startT3} disabled={t3State === 'act'}>
            Start Test
          </button>
        </div>

      </div>
    </div>
  );
}
