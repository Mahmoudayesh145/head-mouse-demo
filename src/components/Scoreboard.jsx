import React from 'react';

const RANKS = ['—', 'Learner', 'Trained', 'Skilled', 'Expert', 'Master 🏆'];

export default function Scoreboard({ globalStats }) {
  const { totalScore, passedTests, totalTests, totalHits, totalClicks } = globalStats;
  
  const accuracy = totalClicks > 0 ? Math.round((totalHits / totalClicks) * 100) + '%' : '—';
  const numPassed = passedTests.length;
  // Example ranking logic: passing 3 tests bumps you a rank
  const rankIndex = Math.min(5, Math.floor(numPassed / 3)); 
  const rank = RANKS[rankIndex] || '—';

  return (
    <div className="sb">
      <div className="sc">
        <div className="sl">Total Score</div>
        <div className="sv" style={{ color: 'var(--blue)' }}>{totalScore}</div>
      </div>
      <div className="sc">
        <div className="sl">Passed</div>
        <div className="sv" style={{ color: 'var(--green)' }}>{numPassed}/{totalTests}</div>
      </div>
      <div className="sc">
        <div className="sl">Accuracy</div>
        <div className="sv" style={{ color: 'var(--amber)' }}>{accuracy}</div>
      </div>
      <div className="sc">
        <div className="sl">Rank</div>
        <div className="sv" style={{ color: 'var(--purple)' }}>{rank}</div>
      </div>
    </div>
  );
}
