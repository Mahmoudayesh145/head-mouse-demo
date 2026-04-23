import React, { useState } from 'react'
import Welcome from './components/Welcome.jsx'
import LeftClickTest from './components/LeftClickTest.jsx'
import RightClickTest from './components/RightClickTest.jsx'
import ScrollTest from './components/ScrollTest.jsx'
import CopyPasteTest from './components/CopyPasteTest.jsx'
import SpaceDodge from './components/SpaceDodge.jsx'
import Results from './components/Results.jsx'

const STAGES = [
  'welcome',
  'leftClick',
  'rightClick',
  'scroll',
  'copyPaste',
  'spaceDodge',
  'results',
]

export default function App() {
  const [stage, setStage] = useState('welcome')
  const [scores, setScores] = useState({
    leftClick: 0,
    rightClick: 0,
    scroll: 0,
    copyPaste: 0,
    spaceDodge: 0,
  })

  const advance = () => {
    const idx = STAGES.indexOf(stage)
    if (idx < STAGES.length - 1) setStage(STAGES[idx + 1])
  }

  const saveScore = (key, value) => {
    setScores((prev) => ({ ...prev, [key]: value }))
    advance()
  }

  const restart = () => {
    setScores({ leftClick: 0, rightClick: 0, scroll: 0, copyPaste: 0, spaceDodge: 0 })
    setStage('welcome')
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      {stage === 'welcome' && <Welcome onStart={advance} />}
      {stage === 'leftClick' && (
        <LeftClickTest onDone={(score) => saveScore('leftClick', score)} />
      )}
      {stage === 'rightClick' && (
        <RightClickTest onDone={(score) => saveScore('rightClick', score)} />
      )}
      {stage === 'scroll' && (
        <ScrollTest onDone={(score) => saveScore('scroll', score)} />
      )}
      {stage === 'copyPaste' && (
        <CopyPasteTest onDone={(score) => saveScore('copyPaste', score)} />
      )}
      {stage === 'spaceDodge' && (
        <SpaceDodge onDone={(score) => saveScore('spaceDodge', score)} />
      )}
      {stage === 'results' && <Results scores={scores} onRestart={restart} />}
    </div>
  )
}
