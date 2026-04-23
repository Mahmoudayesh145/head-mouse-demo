import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DURATION = 30
const MAX_SCORE = 80
const GEM_COUNT = 6

function randomGems(trackWidth) {
  return Array.from({ length: GEM_COUNT }, (_, i) => ({
    id: i,
    x: 100 + i * Math.floor((trackWidth - 200) / GEM_COUNT),
    collected: false,
  }))
}

export default function ScrollTest({ onDone }) {
  const TRACK_WIDTH = 1400
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [gems, setGems] = useState(randomGems(TRACK_WIDTH))
  const containerRef = useRef(null)

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

  useEffect(() => {
    if (!started) return
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const sx = el.scrollLeft
      setScrollX(sx)
      // Check gem collisions: player is always at viewport center
      const vpCenter = sx + el.clientWidth / 2
      setGems((prev) => {
        let changed = false
        const next = prev.map((g) => {
          if (!g.collected && Math.abs(g.x - vpCenter) < 40) {
            changed = true
            return { ...g, collected: true }
          }
          return g
        })
        if (changed) setScore((s) => Math.min(s + Math.ceil(MAX_SCORE / GEM_COUNT), MAX_SCORE))
        return changed ? next : prev
      })
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [started])

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h2 className="text-4xl font-bold text-cyan-400 mb-4">⬆️ Scroll Test</h2>
        <p className="text-gray-300 mb-8 max-w-md">
          Scroll horizontally to move your character and collect all the gems. You have {DURATION} seconds.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg transition-all"
        >
          Start
        </button>
      </div>
    )
  }

  const playerX = scrollX + 350

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex gap-8 mb-6 text-center">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Time</p>
          <p className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-400'}`}>{timeLeft}s</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Score</p>
          <p className="text-3xl font-bold text-cyan-400">{score}</p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-2xl h-40 overflow-x-scroll relative bg-white/5 border border-white/10 rounded-2xl"
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="relative h-full" style={{ width: TRACK_WIDTH }}>
          {/* Player */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_16px_#06b6d4] z-10"
            style={{ left: playerX - 16 }}
          />

          {/* Gems */}
          <AnimatePresence>
            {gems.map((g) =>
              !g.collected ? (
                <motion.div
                  key={g.id}
                  initial={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-yellow-400 shadow-[0_0_12px_#eab308] flex items-center justify-center text-sm"
                  style={{ left: g.x - 14 }}
                >
                  💎
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-gray-500 mt-4 text-sm">← Scroll horizontally to collect gems →</p>

      {timeLeft === 0 && (
        <div className="mt-4 text-2xl font-bold text-white">Done! Score: {score}</div>
      )}
    </div>
  )
}
