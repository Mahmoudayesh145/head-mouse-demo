import React from 'react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'left', label: '🖱 Left Click', color: 'blue', dataS: '' },
    { id: 'right', label: '🖱 Right Click', color: 'rose', dataS: 'left' },
    { id: 'scroll', label: '⬆ Scroll', color: 'green', dataS: 'scroll' },
    // { id: 'alttab', label: '⌨️ Alt+Tab', color: 'amber', dataS: 'alttab' },
    { id: 'copypaste', label: '📋 Copy+Paste', color: 'cyan', dataS: 'copypaste' },
    { id: 'game', label: '🎮 Games', color: 'purple', dataS: 'game' }
  ];

  return (
    <header>
      <div className="logo">H <em>CTRL</em></div>
      <div className="subtitle">Wireless Mouse Test Suite · All Interactions Covered</div>
      <nav>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nb ${activeTab === tab.id ? 'on' : ''}`}
            data-s={tab.dataS}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
