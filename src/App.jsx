import React, { useState } from 'react';
import Navigation from './components/Navigation.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import LeftClickSection from './components/LeftClickSection.jsx';
import RightClickSection from './components/RightClickSection.jsx';
import ScrollSection from './components/ScrollSection.jsx';
import AltTabSection from './components/AltTabSection.jsx';
import CopyPasteSection from './components/CopyPasteSection.jsx';
import GamesSection from './components/GamesSection.jsx';
import SplashScreen from './components/SplashScreen.jsx';

export default function App() {
  const [appStarted, setAppStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('left');
  
  const [globalStats, setGlobalStats] = useState({
    totalScore: 0,
    passedTests: [],
    totalTests: 12, // 3 for left, 3 for right, 3 for scroll, 3 for copypaste
    totalHits: 0,
    totalClicks: 0
  });

  const addScore = (score) => {
    setGlobalStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + score
    }));
  };

  const markPassed = (testId) => {
    if (!testId) return; // ignore legacy calls
    setGlobalStats(prev => {
      if (prev.passedTests.includes(testId)) return prev;
      return {
        ...prev,
        passedTests: [...prev.passedTests, testId]
      };
    });
  };

  const addHits = (hits, clicks) => {
    setGlobalStats(prev => ({
      ...prev,
      totalHits: prev.totalHits + hits,
      totalClicks: prev.totalClicks + clicks
    }));
  };

  return (
    <>
      <div id="tb"></div> {/* Toast container for utils.js */}

      {!appStarted && <SplashScreen onComplete={() => setAppStarted(true)} />}

      {/* Floating Background Icons */}
      <div className="float-icon" style={{ left: '10%', animationDuration: '18s', animationDelay: '0s' }}>💻</div>
      <div className="float-icon" style={{ left: '80%', animationDuration: '22s', animationDelay: '3s' }}>🤖</div>
      <div className="float-icon" style={{ left: '30%', animationDuration: '25s', animationDelay: '7s' }}>⌨️</div>
      <div className="float-icon" style={{ left: '60%', animationDuration: '15s', animationDelay: '1s' }}>⚙️</div>
      <div className="float-icon" style={{ left: '25%', animationDuration: '20s', animationDelay: '12s' }}>⚡</div>
      <div className="float-icon" style={{ left: '85%', animationDuration: '28s', animationDelay: '5s' }}>🌐</div>
      <div className="float-icon" style={{ left: '15%', animationDuration: '24s', animationDelay: '9s' }}>📡</div>
      <div className="float-icon" style={{ left: '70%', animationDuration: '19s', animationDelay: '14s' }}>🧠</div>
      <div className="float-icon" style={{ left: '45%', animationDuration: '30s', animationDelay: '4s' }}>💾</div>
      <div className="float-icon" style={{ left: '55%', animationDuration: '21s', animationDelay: '2s' }}>💡</div>
      <div className="float-icon" style={{ left: '90%', animationDuration: '27s', animationDelay: '10s' }}>🚀</div>
      <div className="float-icon" style={{ left: '5%', animationDuration: '17s', animationDelay: '8s' }}>🔋</div>
      
      {/* Wave 2 of floating icons */}
      <div className="float-icon" style={{ left: '20%', animationDuration: '29s', animationDelay: '11s' }}>🖥️</div>
      <div className="float-icon" style={{ left: '75%', animationDuration: '16s', animationDelay: '6s' }}>🔌</div>
      <div className="float-icon" style={{ left: '40%', animationDuration: '23s', animationDelay: '15s' }}>📱</div>
      <div className="float-icon" style={{ left: '65%', animationDuration: '31s', animationDelay: '9s' }}>🔑</div>
      <div className="float-icon" style={{ left: '8%', animationDuration: '26s', animationDelay: '13s' }}>🔍</div>
      <div className="float-icon" style={{ left: '88%', animationDuration: '18s', animationDelay: '2s' }}>📊</div>
      <div className="float-icon" style={{ left: '35%', animationDuration: '32s', animationDelay: '5s' }}>📈</div>
      <div className="float-icon" style={{ left: '50%', animationDuration: '20s', animationDelay: '10s' }}>☁️</div>
      <div className="float-icon" style={{ left: '95%', animationDuration: '24s', animationDelay: '1s' }}>🛡️</div>
      <div className="float-icon" style={{ left: '2%', animationDuration: '22s', animationDelay: '7s' }}>👨‍💻</div>

      {/* Wave 3 of floating icons */}
      <div className="float-icon" style={{ left: '12%', animationDuration: '34s', animationDelay: '3s' }}>🎮</div>
      <div className="float-icon" style={{ left: '28%', animationDuration: '17s', animationDelay: '8s' }}>🕹️</div>
      <div className="float-icon" style={{ left: '48%', animationDuration: '28s', animationDelay: '14s' }}>💿</div>
      <div className="float-icon" style={{ left: '68%', animationDuration: '22s', animationDelay: '1s' }}>🎧</div>
      <div className="float-icon" style={{ left: '82%', animationDuration: '19s', animationDelay: '6s' }}>📟</div>
      <div className="float-icon" style={{ left: '98%', animationDuration: '36s', animationDelay: '11s' }}>📡</div>
      <div className="float-icon" style={{ left: '4%', animationDuration: '25s', animationDelay: '4s' }}>💻</div>
      <div className="float-icon" style={{ left: '58%', animationDuration: '21s', animationDelay: '12s' }}>🔮</div>
      
      {/* Wave 4 of floating icons */}
      <div className="float-icon" style={{ left: '18%', animationDuration: '18s', animationDelay: '2s' }}>✨</div>
      <div className="float-icon" style={{ left: '33%', animationDuration: '29s', animationDelay: '9s' }}>💡</div>
      <div className="float-icon" style={{ left: '42%', animationDuration: '26s', animationDelay: '5s' }}>⚙️</div>
      <div className="float-icon" style={{ left: '72%', animationDuration: '33s', animationDelay: '10s' }}>🤖</div>
      <div className="float-icon" style={{ left: '62%', animationDuration: '20s', animationDelay: '7s' }}>🚀</div>
      <div className="float-icon" style={{ left: '86%', animationDuration: '24s', animationDelay: '13s' }}>🔋</div>
      <div className="float-icon" style={{ left: '92%', animationDuration: '30s', animationDelay: '8s' }}>🔌</div>
      <div className="float-icon" style={{ left: '24%', animationDuration: '16s', animationDelay: '15s' }}>🌌</div>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="hdr">
            <h1><span style={{ color: 'var(--blue)' }}>H</span> <span style={{ color: 'var(--red)' }}>CTRL</span></h1>
            <p>Wireless Mouse Test Suite</p>
          </div>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <Scoreboard globalStats={globalStats} />
        </aside>

        <main className="main-content">
          {activeTab === 'left' && <LeftClickSection onScore={addScore} onPass={markPassed} onHit={addHits} />}
          {activeTab === 'right' && <RightClickSection onScore={addScore} onPass={markPassed} onHit={addHits} />}
          {activeTab === 'scroll' && <ScrollSection onScore={addScore} onPass={markPassed} />}
          {activeTab === 'alttab' && <AltTabSection onScore={addScore} onPass={markPassed} />}
          {activeTab === 'copypaste' && <CopyPasteSection onScore={addScore} onPass={markPassed} />}
          {activeTab === 'game' && <GamesSection onScore={addScore} onPass={markPassed} />}
        </main>
      </div>
    </>
  );
}
