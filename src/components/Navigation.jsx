import React from 'react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'left', label: '🖱 Left Click', color: 'blue', dataS: '' },
    { id: 'right', label: '🖱 Right Click', color: 'rose', dataS: 'left' },
    { id: 'scroll', label: '⬆ Scroll', color: 'green', dataS: 'scroll' },
    { id: 'copypaste', label: '📋 Copy+Paste', color: 'cyan', dataS: 'copypaste' },
    { id: 'game', label: '🎮 Games', color: 'purple', dataS: 'game' }
  ];

  return (
    <nav className="nav-container">
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
  );
}
