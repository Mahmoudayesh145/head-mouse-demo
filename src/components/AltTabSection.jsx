import React, { useState, useEffect, useRef } from 'react';
import { toast } from '../utils';

export default function AltTabSection({ onScore, onPass }) {
  // Test 1: Basic Switch
  const [t1State, setT1State] = useState('idle');
  const [t1Switches, setT1Switches] = useState(0);

  // Test 2: Quick Switch
  const [t2State, setT2State] = useState('idle');
  const [t2Switches, setT2Switches] = useState(0);
  const [t2Time, setT2Time] = useState(3.0);
  const t2IntRef = useRef(null);

  // Test 3: Target Window
  const [t3State, setT3State] = useState('idle');
  const [t3Cur, setT3Cur] = useState(0);
  const [t3Tgt, setT3Tgt] = useState(2);
  const NAMES = ['WIN A', 'WIN B', 'WIN C', 'WIN D'];

  // Key tracking for visual feedback
  const [altPressed, setAltPressed] = useState(false);
  const [tabPressed, setTabPressed] = useState(false);
  
  // Track continuous holding of Alt
  const heldAlt = useRef(false);

  useEffect(() => {
    const flashK = () => {
      setAltPressed(true);
      setTabPressed(true);
      setTimeout(() => {
        setAltPressed(false);
        setTabPressed(false);
      }, 180);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Alt') heldAlt.current = true;
      if (heldAlt.current && e.key === 'Tab') {
        e.preventDefault();
        flashK();
        
        // T1
        setT1State(prev => {
          if (prev === 'act') {
            setT1Switches(s => {
              const next = s + 1;
              if (next >= 3) {
                toast('Basic Switch done! +75', 's');
                onScore(75);
                onPass();
                return 3;
              }
              return next;
            });
            // Can't setT1State('pass') from inside the setState of switches easily, we will do it below
          }
          return prev;
        });

        // T2
        setT2State(prev => {
          if (prev === 'act') setT2Switches(s => s + 1);
          return prev;
        });

        // T3
        setT3State(prev => {
          if (prev === 'act') {
            setT3Cur(c => {
              const next = (c + 1) % 4;
              return next;
            });
          }
          return prev;
        });
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Alt') {
        heldAlt.current = false;
        // Evaluate T3 drop
        setT3State(prev => {
          if (prev === 'act') {
            setT3Cur(c => {
              setT3Tgt(t => {
                if (c === t) {
                  toast('Target Window done! +100', 's');
                  onScore(100);
                  onPass();
                  return t; // Keep target same
                }
                return t;
              });
              return c;
            });
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onScore, onPass]);

  // Effect to close T1
  useEffect(() => {
    if (t1State === 'act' && t1Switches >= 3) setT1State('pass');
  }, [t1Switches, t1State]);

  // Effect to close T3 using an extra ref to avoid stale state in keyUp
  useEffect(() => {
    if (t3State === 'act' && t3Cur === t3Tgt && !heldAlt.current) {
        // Technically this gets checked when Alt is released via the nested callbacks above.
    }
  }, [t3Cur, t3Tgt, t3State]);

  // Special check for T3 pass flag based on keyup logic above
  useEffect(() => {
    if (t3State === 'act' && t3Cur === t3Tgt && !heldAlt.current && t3State !== 'pass') {
      setT3State('pass');
    }
  }, [t3Cur, t3Tgt, t3State]);


  // T1 Controls
  const startT1 = () => {
    setT1State('act');
    setT1Switches(0);
    toast('Press Alt+Tab now!', 'i');
  };

  // T2 Controls
  const startT2 = () => {
    setT2State('act');
    setT2Switches(0);
    setT2Time(3.0);
    if (t2IntRef.current) clearInterval(t2IntRef.current);
    
    let rem = 3.0;
    t2IntRef.current = setInterval(() => {
      rem -= 0.1;
      if (rem <= 0) {
        clearInterval(t2IntRef.current);
        // Checking score - use a function to read latest state closure-free
        setT2Switches(curr => {
          const ok = curr >= 5;
          setT2State(ok ? 'pass' : 'fail');
          toast(ok ? 'Quick Switch +75!' : 'Need 5+ in 3s', ok ? 's' : 'e');
          if (ok) {
            onScore(75);
            onPass();
          }
          return curr;
        });
        setT2Time(0);
      } else {
        setT2Time(rem);
      }
    }, 100);
  };

  useEffect(() => {
    return () => clearInterval(t2IntRef.current);
  }, []);

  // T3 Controls
  const startT3 = () => {
    setT3State('act');
    setT3Cur(0);
    setT3Tgt(Math.floor(Math.random() * 4));
    toast('Press Alt+Tab!', 'i');
  };

  return (
    <div className="sec" style={{ display: 'block' }}>
      <div className="sh">
        <div className="st">Alt + Tab <span style={{ color: 'var(--amber)' }}>Tests</span></div>
        <div className="sd">Keyboard shortcut detection tests</div>
      </div>
      <div className="tg">
        
        {/* T1 */}
        <div className="card" style={{ '--ac': 'var(--amber)' }}>
          <div className="ctb" style={{ background: 'var(--amber)' }} />
          <div className="cn">Test 01</div>
          <div className="ct" style={{ color: 'var(--amber)' }}>🪟 Basic Switch</div>
          <div className="cd">Press Alt+Tab 3 times to cycle through windows.</div>
          
          <div className={`badge ${t1State}`}>{t1State === 'idle' ? 'Idle' : t1State === 'act' ? '● Listening' : '✓ Pass'}</div>
          
          <div className="kr">
            <div className={`key ${altPressed ? 'pressed' : ''}`}>ALT</div>
            <div className="plus">+</div>
            <div className={`key ${tabPressed ? 'pressed' : ''}`}>TAB</div>
          </div>
          
          <div className="wr">
            <div className={`wt ${t1Switches % 3 === 0 ? 'foc' : ''}`}>WIN A</div>
            <div className={`wt ${t1Switches % 3 === 1 ? 'foc' : ''}`}>WIN B</div>
            <div className={`wt ${t1Switches % 3 === 2 ? 'foc' : ''}`}>WIN C</div>
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--amber)', width: `${(t1Switches / 3) * 100}%` }} />
          </div>
          <div className="pl">{t1Switches} / 3 switches</div>
          <button className="btn btn-amber" onClick={startT1} disabled={t1State === 'act'}>
            Listen
          </button>
        </div>

        {/* T2 */}
        <div className="card" style={{ '--ac': 'var(--amber)' }}>
          <div className="ctb" style={{ background: 'var(--amber)' }} />
          <div className="cn">Test 02</div>
          <div className="ct" style={{ color: 'var(--amber)' }}>⚡ Quick Switch</div>
          <div className="cd">Press Alt+Tab 5 times within 3 seconds!</div>
          
          <div className={`badge ${t2State === 'fail' ? 'fail' : t2State}`}>
            {t2State === 'idle' ? 'Idle' : t2State === 'act' ? '● Go!' : t2State === 'pass' ? '✓ Pass' : '✗ Fail'}
          </div>
          
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: '2.6rem', fontWeight: 900, color: 'var(--amber)' }}>
              {t2Switches}
            </div>
            <div style={{ fontSize: '.82rem', color: 'var(--muted)', fontWeight: 700 }}>
              {t2Time.toFixed(1)}s
            </div>
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--amber)', width: `${Math.min(100, (t2Switches / 5) * 100)}%` }} />
          </div>
          <div className="pl">{t2Switches} / 5 in 3 seconds</div>
          <button className="btn btn-amber" onClick={startT2} disabled={t2State === 'act'}>
            Start Test
          </button>
        </div>

        {/* T3 */}
        <div className="card" style={{ '--ac': 'var(--amber)' }}>
          <div className="ctb" style={{ background: 'var(--amber)' }} />
          <div className="cn">Test 03</div>
          <div className="ct" style={{ color: 'var(--amber)' }}>🎯 Target Window</div>
          <div className="cd">Navigate with Alt+Tab to the shown target window.</div>
          
          <div className={`badge ${t3State}`}>{t3State === 'idle' ? 'Idle' : t3State === 'act' ? '● Listening' : '✓ Pass'}</div>
          
          <div className="ib">
            <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>Navigate to:</div>
            <div className="bc">{NAMES[t3Tgt]}</div>
          </div>
          
          <div className="wr">
            {NAMES.map((name, i) => (
              <div key={i} className={`wt ${t3Cur === i ? 'foc' : ''}`}>{name}</div>
            ))}
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--amber)', width: t3State === 'pass' ? '100%' : '0%' }} />
          </div>
          <div className="pl">{t3State === 'pass' ? '✓ Target reached!' : 'Press Alt+Tab to switch'}</div>
          <button className="btn btn-amber" onClick={startT3} disabled={t3State === 'act'}>
            Listen
          </button>
        </div>

      </div>
    </div>
  );
}
