import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DURATION = 45
const MAX_SCORE = 100

const PHRASES = [
  'Head mouse precision is amazing!',
  'React and Vite make development fast.',
  'Framer Motion adds beautiful animations.',
  'Accessibility matters in every demo.',
  'Open source software powers the world.',
]

export default function CopyPasteTest({ onDone }) {
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const phrase = PHRASES[phraseIdx % PHRASES.length]

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [started])

  useEffect(() => {
    if (timeLeft === 0 && started) {
      setTimeout(() => onDone(score), 800)
    }
  }, [timeLeft, started, score, onDone])

  const handleSubmit = () => {
    setAttempts((a) => a + 1)
    if (input.trim() === phrase) {
      const pts = Math.ceil(MAX_SCORE / PHRASES.length)
      setScore((s) => Math.min(s + pts, MAX_SCORE))
      setFeedback('correct')
      setPhraseIdx((i) => i + 1)
      setInput('')
    } else {
      setFeedback('wrong')
    }
    setTimeout(() => setFeedback(null), 600)
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h2 className="text-4xl font-bold text-green-400 mb-4">📋 Copy & Paste Test</h2>
        <p className="text-gray-300 mb-8 max-w-md">
          Copy the displayed phrase and paste (or type) it into the input below. You have {DURATION} seconds to complete as many phrases as possible.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-all"
        >
          Start
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="flex gap-8 mb-8">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Time</p>
          <p className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-cyan-400'}`}>{timeLeft}s</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Score</p>
          <p className="text-3xl font-bold text-green-400">{score}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Done</p>
          <p className="text-3xl font-bold text-purple-400">{phraseIdx}/{PHRASES.length}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 max-w-xl w-full">
        <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Copy this phrase:</p>
        <p
          className="text-white text-xl font-mono select-all cursor-text bg-white/10 rounded-lg px-4 py-3"
          title="Select and copy this text"
        >
          {phrase}
        </p>
      </div>

      <div className="max-w-xl w-full">
        <motion.input
          animate={feedback === 'wrong' ? { x: [-6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.3 }}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Paste or type the phrase here…"
          disabled={timeLeft === 0}
          className={`w-full px-5 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 outline-none focus:ring-2 transition-all ${
            feedback === 'correct'
              ? 'border-green-400 ring-green-400/40'
              : feedback === 'wrong'
              ? 'border-red-400 ring-red-400/40'
              : 'border-white/20 focus:ring-purple-500/40'
          }`}
        />
        <button
          onClick={handleSubmit}
          disabled={timeLeft === 0}
          className="mt-4 px-8 py-3 rounded-full bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-bold text-lg transition-all w-full"
        >
          Submit (or press Enter)
        </button>
      </div>

      {timeLeft === 0 && (
        <div className="mt-6 text-2xl font-bold text-white">Done! Score: {score}</div>
      )}
    </div>
  )
}
