import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DURATION = 30
const MAX_SCORE = 300

function randomPos(areaW, areaH, size) {
  return {
    x: Math.floor(Math.random() * (areaW - size)),
    y: Math.floor(Math.random() * (areaH - size)),
  }
}

export default function LeftClickTest({ onDone }) {
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [target, setTarget] = useState(null)
  const [hits, setHits] = useState(0)
  const [started, setStarted] = useState(false)

  const SIZE = 60
  const AREA_W = 700
  const AREA_H = 400

  const spawnTarget = useCallback(() => {
    setTarget({ ...randomPos(AREA_W, AREA_H, SIZE), id: Date.now() })
  }, [])

  useEffect(() => {
    if (!started) return
    spawnTarget()
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [started, spawnTarget])

  useEffect(() => {
    if (timeLeft === 0 && started) {
      setTimeout(() => onDone(score), 800)
    }
  }, [timeLeft, started, score, onDone])

  const handleHit = () => {
    setHits((h) => h + 1)
    setScore((s) => Math.min(s + 10, MAX_SCORE))
    spawnTarget()
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h2 className="text-4xl font-bold text-purple-400 mb-4">👆 Left Click Test</h2>
        <p className="text-gray-300 mb-8 max-w-md">
          Click the glowing targets as quickly as possible. You have {DURATION} seconds. Each hit earns 10 points (max {MAX_SCORE}).
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition-all"
        >
          Start
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex gap-8 mb-6 text-center">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Time</p>
          <p className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-400'}`}>{timeLeft}s</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Score</p>
          <p className="text-3xl font-bold text-purple-400">{score}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Hits</p>
          <p className="text-3xl font-bold text-green-400">{hits}</p>
        </div>
      </div>

      <div
        className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        style={{ width: AREA_W, height: AREA_H }}
      >
        <AnimatePresence>
          {target && timeLeft > 0 && (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleHit}
              style={{ position: 'absolute', left: target.x, top: target.y, width: SIZE, height: SIZE }}
              className="rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shadow-[0_0_20px_#a855f7] cursor-crosshair border-2 border-white/20"
            />
          )}
        </AnimatePresence>
        {timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <p className="text-2xl font-bold text-white">Done! Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  )
}
