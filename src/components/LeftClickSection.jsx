import React, { useState, useRef, useEffect } from 'react';
import { toast, sparks } from '../utils';

export default function LeftClickSection({ onScore, onPass, onHit }) {
  // Test 1: Target Hunt
  const [t1State, setT1State] = useState('idle'); // idle, act, pass
  const [t1Hits, setT1Hits] = useState(0);
  const [t1Targets, setT1Targets] = useState([]);

  const startT1 = () => {
    setT1State('act');
    setT1Hits(0);
    const tgts = Array.from({ length: 5 }, (_, i) => ({ id: i, hit: false }));
    setT1Targets(tgts);
  };

  const hitT1Target = (id, e) => {
    if (t1State !== 'act') return;
    setT1Targets(prev => prev.map(t => {
      if (t.id === id && !t.hit) {
        onHit(1, 1);
        sparks(e.clientX, e.clientY, '#4f7fff');
        const newHits = t1Hits + 1;
        setT1Hits(newHits);
        if (newHits === 5) {
          setT1State('pass');
          toast('Target Hunt done! +100', 's');
          onScore(100);
          onPass('leftclick' + 1);
        }
        return { ...t, hit: true };
      }
      return t;
    }));
  };

  const missT1 = () => {
    if (t1State === 'act') onHit(0, 1);
  };

  // Test 2: Speed Click
  const [t2State, setT2State] = useState('idle'); // idle, act, pass, fail
  const [t2Clicks, setT2Clicks] = useState(0);
  const [t2Time, setT2Time] = useState(0); // in ms
  const [t2BtnClass, setT2BtnClass] = useState('tgt');

  const t2IntRef = useRef(null);

  const startT2 = () => {
    setT2State('act');
    setT2Clicks(0);
    setT2Time(0);
    if (t2IntRef.current) clearInterval(t2IntRef.current);
    const start = Date.now();
    t2IntRef.current = setInterval(() => {
      const el = Date.now() - start;
      if (el >= 5000) {
        clearInterval(t2IntRef.current);
        setT2State(prev => {
          // React state closure issue inside setInterval: easier to use refs for tracking or check from actual clicks
          // But since state might be stale, we use functional updates
          return 'checking'; 
        });
      } else {
        setT2Time(el);
      }
    }, 100);
  };

  // When T2 finishes:
  useEffect(() => {
    if (t2State === 'checking') {
      const ok = t2Clicks >= 15;
      setT2State(ok ? 'pass' : 'fail');
      toast(ok ? 'Speed Click +75!' : 'Need 15+ clicks', ok ? 's' : 'e');
      if (ok) {
        onScore(75);
        onPass('leftclick' + 2);
      }
    }
  }, [t2State, t2Clicks, onScore, onPass]);

  useEffect(() => {
    return () => clearInterval(t2IntRef.current);
  }, []);

  const doT2Speed = () => {
    if (t2State !== 'act') return;
    setT2Clicks(c => c + 1);
    onHit(1, 1);
    setT2BtnClass('tgt hit');
    setTimeout(() => setT2BtnClass('tgt'), 80);
  };

  // Test 3: Drag & Drop
  const [t3State, setT3State] = useState('idle'); // idle, act, pass
  const [isOver, setIsOver] = useState(false);

  const onDragStart = (e) => {
    e.dataTransfer.setData('text/plain', '1');
    if (t3State !== 'pass') setT3State('act');
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (t3State !== 'pass') setIsOver(true);
  };

  const onDragLeave = () => {
    setIsOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    if (t3State !== 'pass') {
      setT3State('pass');
      sparks(e.clientX, e.clientY, '#4f7fff', 12);
      toast('Drag & Drop done! +50', 's');
      onScore(50);
      onPass('leftclick' + 3);
    }
  };

  const resetDrag = () => {
    setT3State('idle');
    setIsOver(false);
  };

  return (
    <div className="sec" style={{ display: 'block' }}>
      <div className="sh">
        <div className="st">Left Click <span style={{ color: 'var(--blue)' }}>Tests</span></div>
        <div className="sd">Precision · Speed · Control</div>
      </div>
      <div className="tg" onClick={missT1}>
        
        {/* T1 */}
        <div className="card" style={{ '--ac': 'var(--blue)' }}>
          <div className="ctb" />
          <div className="cn">Test 01</div>
          <div className="ct">🎯 Target Hunt</div>
          <div className="cd">Click all 5 glowing targets to pass.</div>
          
          <div className={`badge ${t1State}`}>{t1State === 'idle' ? 'Idle' : t1State === 'act' ? '● Active' : '✓ Pass'}</div>
          
          <div className="ca">
            {t1Targets.map(t => (
              <div 
                key={t.id} 
                className={`tgt ${t.hit ? 'hit' : ''}`}
                style={{ animationDelay: `${t.id * 0.12}s` }}
                onClick={(e) => { e.stopPropagation(); hitT1Target(t.id, e); }}
              >
                {t.id + 1}
              </div>
            ))}
          </div>
          
          <div className="pw">
            <div className="pb" style={{ width: `${(t1Hits / 5) * 100}%` }} />
          </div>
          <div className="pl">{t1Hits} / 5 targets</div>
          
          <button className="btn" onClick={startT1} disabled={t1State === 'act'}>
            {t1State === 'pass' ? 'Restart Test' : 'Start Test'}
          </button>
        </div>

        {/* T2 */}
        <div className="card" style={{ '--ac': 'var(--blue)' }}>
          <div className="ctb" />
          <div className="cn">Test 02</div>
          <div className="ct">⚡ Speed Click</div>
          <div className="cd">Click as fast as you can for 5 seconds!</div>
          
          <div className={`badge ${t2State === 'checking' ? 'act' : t2State}`}>
            {t2State === 'idle' ? 'Idle' : t2State === 'act' ? '● Go!' : t2State === 'pass' ? '✓ Pass' : '✗ Fail'}
          </div>
          
          <div className="ca">
            <div 
              className={t2BtnClass} 
              style={{ width: '86px', height: '86px', fontSize: '.9rem', fontWeight: 900 }} 
              onClick={doT2Speed}
            >
              {t2State !== 'act' && t2Clicks > 0 ? `${t2Clicks}🔥` : 'CLICK'}
            </div>
          </div>
          
          <div className="pw">
            <div className="pb" style={{ width: `${Math.min(100, (t2Time / 5000) * 100)}%` }} />
          </div>
          <div className="pl">
            {t2State === 'act' ? `${t2Clicks} clicks — ${((5000 - t2Time) / 1000).toFixed(1)}s` : `${t2Clicks} clicks — ready`}
          </div>
          
          <button className="btn" onClick={startT2} disabled={t2State === 'act'}>
            Start Test
          </button>
        </div>

        {/* T3 */}
        <div className="card" style={{ '--ac': 'var(--blue)' }}>
          <div className="ctb" />
          <div className="cn">Test 03</div>
          <div className="ct">✋ Drag & Drop</div>
          <div className="cd">Hold left click and drag the block to the drop zone.</div>
          
          <div className={`badge ${t3State}`}>
            {t3State === 'idle' ? 'Idle' : t3State === 'act' ? '● Drag' : '✓ Pass'}
          </div>
          
          <div className="da">
            <div 
              className="do" 
              draggable="true" 
              onDragStart={onDragStart}
            >
              DRAG
            </div>
            <div 
              className={`dz ${isOver ? 'over' : ''} ${t3State === 'pass' ? 'done' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {t3State === 'pass' ? '✓ Done!' : <>DROP<br/>HERE</>}
            </div>
          </div>
          
          <div className="pw">
            <div className="pb" style={{ width: t3State === 'pass' ? '100%' : '0%' }} />
          </div>
          <div className="pl">
            {t3State === 'pass' ? 'Dropped successfully!' : 'Drag the block to the zone'}
          </div>
          
          <button className="btn ol" onClick={resetDrag}>
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
