import React, { useState, useEffect } from 'react';
import { toast, sparks } from '../utils';

export default function TypingSection({ onScore, onPass }) {
  const [tState, setTState] = useState('idle'); // idle, act, pass
  const [input, setInput] = useState('');
  const TARGET_TEXT = 'HEAD MOUSE';

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ' '],
    ['BACKSPACE', 'CLEAR']
  ];

  const startTest = () => {
    setTState('act');
    setInput('');
  };

  const handleKeyClick = (key, e) => {
    if (tState !== 'act') return;

    if (key === 'BACKSPACE') {
      setInput(prev => prev.slice(0, -1));
      return;
    }
    if (key === 'CLEAR') {
      setInput('');
      return;
    }

    const nextChar = TARGET_TEXT[input.length];
    if (key === nextChar) {
      const newInput = input + key;
      setInput(newInput);
      sparks(e.clientX, e.clientY, 'var(--amber)');
      
      if (newInput === TARGET_TEXT) {
        setTState('pass');
        toast('Typing Test passed! +100', 's');
        onScore(100);
        onPass('typing1');
      }
    } else {
      toast(`Wrong key! Expected "${nextChar}"`, 'e');
      sparks(e.clientX, e.clientY, 'var(--rose)', 4);
    }
  };

  return (
    <div className="sec" style={{ display: 'block' }}>
      <div className="sh">
        <div className="st">Typing <span style={{ color: 'var(--amber)' }}>Test</span></div>
        <div className="sd">Test your precision by typing with the on-screen keyboard</div>
      </div>

      <div className="tg">
        <div className="card" style={{ '--ac': 'var(--amber)' }}>
          <div className="ctb" style={{ background: 'var(--amber)' }} />
          <div className="cn">Test 01</div>
          <div className="ct" style={{ color: 'var(--amber)' }}>⌨ Virtual Keyboard</div>
          <div className="cd">Click the keys to type the target text exactly.</div>

          <div className={`badge ${tState}`}>
            {tState === 'idle' ? 'Idle' : tState === 'act' ? '● Typing' : '✓ Pass'}
          </div>

          <div className="ib" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' }}>Target Text:</div>
            <div className="bc" style={{ fontSize: '2rem', letterSpacing: '0.15em' }}>
              {TARGET_TEXT.split('').map((char, i) => (
                <span 
                  key={i} 
                  style={{ 
                    color: i < input.length ? 'var(--green)' : i === input.length && tState === 'act' ? 'var(--amber)' : 'var(--muted)',
                    textDecoration: i === input.length && tState === 'act' ? 'underline' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>

          <div className="keyboard-container">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="kb-row">
                {row.map((key) => (
                  <button
                    key={key}
                    className={`kb-key ${key === ' ' ? 'space' : ''} ${key.length > 1 ? 'func' : ''}`}
                    onClick={(e) => handleKeyClick(key, e)}
                    disabled={tState !== 'act'}
                  >
                    {key === ' ' ? 'SPACE' : key}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="pw" style={{ marginTop: '25px' }}>
            <div className="pb" style={{ background: 'var(--amber)', width: `${(input.length / TARGET_TEXT.length) * 100}%` }} />
          </div>
          <div className="pl">
            {tState === 'pass' ? 'Completed!' : `${input.length} / ${TARGET_TEXT.length} characters`}
          </div>

          <button className="btn btn-amber" onClick={startTest} disabled={tState === 'act'}>
            {tState === 'pass' ? 'Restart Test' : 'Start Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
