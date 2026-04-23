import React, { useState, useRef, useEffect } from 'react';
import { toast, sparks } from '../utils';

export default function CopyPasteSection({ onScore, onPass }) {
  // Test 1: Simple Copy Paste
  const [t1State, setT1State] = useState('idle');
  const [t1Value, setT1Value] = useState('');
  const T1_TARGET = 'MOUSELAB-2026';

  const startT1 = () => {
    setT1State('act');
    setT1Value('');
  };

  const handleT1Paste = (e) => {
    if (t1State !== 'act') return;
    const pasted = e.clipboardData.getData('text');
    if (pasted.trim() === T1_TARGET) {
      setT1State('pass');
      setT1Value(pasted);
      sparks(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, '#06b6d4', 12);
      toast('Copy Paste done! +75', 's');
      onScore(75);
      onPass('copypaste' + 1);
    } else {
      toast('Incorrect text pasted!', 'e');
    }
  };

  // Test 2: Multi-field Copy Paste
  const [t2State, setT2State] = useState('idle');
  const [t2Fields, setT2Fields] = useState({ field1: '', field2: '' });
  const T2_TARGETS = { field1: 'CODE-A', field2: 'CODE-B' };

  const startT2 = () => {
    setT2State('act');
    setT2Fields({ field1: '', field2: '' });
  };

  const checkT2 = (newFields) => {
    if (newFields.field1 === T2_TARGETS.field1 && newFields.field2 === T2_TARGETS.field2 && t2State === 'act') {
      setT2State('pass');
      toast('Multi-field done! +75', 's');
      onScore(75);
      onPass('copypaste' + 2);
    }
  };

  // Test 3: Speed Paste
  const [t3State, setT3State] = useState('idle');
  const [t3Count, setT3Count] = useState(0);
  const [t3Time, setT3Time] = useState(5.0);
  const t3IntRef = useRef(null);
  const TARGET_WORD = 'QUICK';

  const startT3 = () => {
    setT3State('act');
    setT3Count(0);
    setT3Time(5.0);
    if (t3IntRef.current) clearInterval(t3IntRef.current);
    
    let rem = 5.0;
    t3IntRef.current = setInterval(() => {
      rem -= 0.1;
      if (rem <= 0) {
        clearInterval(t3IntRef.current);
        setT3Count(curr => {
          const ok = curr >= 5;
          setT3State(ok ? 'pass' : 'fail');
          toast(ok ? 'Speed Paste +75!' : 'Need 5+ pastes in 5s', ok ? 's' : 'e');
          if (ok) {
            onScore(75);
            onPass('copypaste' + 3);
          }
          return curr;
        });
        setT3Time(0);
      } else {
        setT3Time(rem);
      }
    }, 100);
  };

  useEffect(() => {
    return () => clearInterval(t3IntRef.current);
  }, []);

  const handleT3Paste = (e) => {
    if (t3State !== 'act') return;
    const pasted = e.clipboardData.getData('text');
    if (pasted.trim().toUpperCase() === TARGET_WORD) {
      setT3Count(c => c + 1);
      e.target.value = ''; // clear immediately
      e.preventDefault();
      sparks(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, '#06b6d4');
    }
  };

  return (
    <div className="sec" style={{ display: 'block' }}>
      <div className="sh">
        <div className="st">Copy + Paste <span style={{ color: 'var(--cyan)' }}>Tests</span></div>
        <div className="sd">Clipboard reading and typing speed tests</div>
      </div>
      <div className="tg">
        
        {/* T1 */}
        <div className="card" style={{ '--ac': 'var(--cyan)' }}>
          <div className="ctb" style={{ background: 'var(--cyan)' }} />
          <div className="cn">Test 01</div>
          <div className="ct" style={{ color: 'var(--cyan)' }}>📋 Basic Copy Paste</div>
          <div className="cd">Copy the target text and paste it into the box.</div>
          
          <div className={`badge ${t1State}`}>{t1State === 'idle' ? 'Idle' : t1State === 'act' ? '● Active' : '✓ Pass'}</div>
          
          <div className="ib">
            <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>Copy this:</div>
            <div className="bc" style={{ userSelect: 'all', cursor: 'text' }}>{T1_TARGET}</div>
          </div>
          
          <input 
            type="text" 
            placeholder="Paste here..."
            disabled={t1State !== 'act'}
            value={t1Value}
            onChange={(e) => setT1Value(e.target.value)}
            onPaste={handleT1Paste}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--bdr)', outline: 'none', background: 'var(--bg2)', color: 'var(--txt)', marginTop: '8px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          />
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--cyan)', width: t1State === 'pass' ? '100%' : '0%' }} />
          </div>
          <div className="pl">{t1State === 'pass' ? 'Item pasted successfully!' : 'Paste the code'}</div>
          <button className="btn btn-cyan" onClick={startT1} disabled={t1State === 'act'}>
            Start Test
          </button>
        </div>

        {/* T2 */}
        <div className="card" style={{ '--ac': 'var(--cyan)' }}>
          <div className="ctb" style={{ background: 'var(--cyan)' }} />
          <div className="cn">Test 02</div>
          <div className="ct" style={{ color: 'var(--cyan)' }}>🗃️ Multi-field</div>
          <div className="cd">Copy both codes accurately to proper inputs.</div>
          
          <div className={`badge ${t2State}`}>{t2State === 'idle' ? 'Idle' : t2State === 'act' ? '● Active' : '✓ Pass'}</div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
             <div className="ib" style={{ flex: 1, margin: 0, padding: '8px' }}>
                <span style={{ userSelect: 'all', fontWeight: 900, color: 'var(--cyan)' }}>{T2_TARGETS.field1}</span>
             </div>
             <div className="ib" style={{ flex: 1, margin: 0, padding: '8px' }}>
                <span style={{ userSelect: 'all', fontWeight: 900, color: 'var(--cyan)' }}>{T2_TARGETS.field2}</span>
             </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" placeholder="Paste A" disabled={t2State !== 'act'}
              value={t2Fields.field1}
              onChange={(e) => {
                const next = { ...t2Fields, field1: e.target.value };
                setT2Fields(next); checkT2(next);
              }}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid var(--bdr)', outline: 'none', background: 'var(--bg2)', color: 'var(--txt)', fontFamily: "'Space Grotesk', sans-serif" }}
            />
            <input 
              type="text" placeholder="Paste B" disabled={t2State !== 'act'}
              value={t2Fields.field2}
              onChange={(e) => {
                const next = { ...t2Fields, field2: e.target.value };
                setT2Fields(next); checkT2(next);
              }}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid var(--bdr)', outline: 'none', background: 'var(--bg2)', color: 'var(--txt)', fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--cyan)', width: t2State === 'pass' ? '100%' : '0%' }} />
          </div>
          <div className="pl">{t2State === 'pass' ? 'Both matched!' : 'Match both codes'}</div>
          <button className="btn btn-cyan" onClick={startT2} disabled={t2State === 'act'}>
            Start Test
          </button>
        </div>

        {/* T3 */}
        <div className="card" style={{ '--ac': 'var(--cyan)' }}>
          <div className="ctb" style={{ background: 'var(--cyan)' }} />
          <div className="cn">Test 03</div>
          <div className="ct" style={{ color: 'var(--cyan)' }}>⚡ Speed Paste</div>
          <div className="cd">Copy the word, paste it 5 times within 5 seconds!</div>
          
          <div className={`badge ${t3State === 'fail' ? 'fail' : t3State}`}>
            {t3State === 'idle' ? 'Idle' : t3State === 'act' ? '● Go!' : t3State === 'pass' ? '✓ Pass' : '✗ Fail'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ib" style={{ width: '45%', margin: 0, padding: '8px' }}>
                <span style={{ userSelect: 'all', fontWeight: 900, fontSize: '1.2rem', color: 'var(--cyan)' }}>{TARGET_WORD}</span>
            </div>
            <div style={{ textAlign: 'center', width: '45%' }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: '2.4rem', fontWeight: 900, color: 'var(--cyan)' }}>{t3Count}</div>
              <div style={{ fontSize: '.7rem', color: 'var(--muted)', fontWeight: 700 }}>{t3Time.toFixed(1)}s</div>
            </div>
          </div>
          
          <input 
            type="text" 
            placeholder="Paste rapidly here"
            disabled={t3State !== 'act'}
            onPaste={handleT3Paste}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--bdr)', outline: 'none', background: 'var(--bg2)', color: 'var(--txt)', marginTop: '8px', fontFamily: "'Space Grotesk', sans-serif" }}
          />
          
          <div className="pw">
            <div className="pb" style={{ background: 'var(--cyan)', width: `${Math.min(100, (t3Count / 5) * 100)}%` }} />
          </div>
          <div className="pl">{t3Count} / 5 in 5 seconds</div>
          <button className="btn btn-cyan" onClick={startT3} disabled={t3State === 'act'}>
            Start Test
          </button>
        </div>

      </div>
    </div>
  );
}
