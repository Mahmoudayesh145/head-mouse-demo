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

export default function RightClickTest({ onDone }) {
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [boxes, setBoxes] = useState([])
  const [hits, setHits] = useState(0)
  const [started, setStarted] = useState(false)

  const SIZE = 80
  const AREA_W = 700
  const AREA_H = 400

  const spawnBox = useCallback(() => {
    const pos = randomPos(AREA_W, AREA_H, SIZE)
    setBoxes((prev) => [...prev.slice(-4), { ...pos, id: Date.now() }])
  }, [])

  useEffect(() => {
    if (!started) return
    spawnBox()
    const spawnTimer = setInterval(spawnBox, 2000)
    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown)
          clearInterval(spawnTimer)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      clearInterval(countdown)
      clearInterval(spawnTimer)
    }
  }, [started, spawnBox])

  useEffect(() => {
    if (timeLeft === 0 && started) {
      setTimeout(() => onDone(score), 800)
    }
  }, [timeLeft, started, score, onDone])

  const handleContextMenu = (e, id) => {
    e.preventDefault()
    setHits((h) => h + 1)
    setScore((s) => Math.min(s + 10, MAX_SCORE))
    setBoxes((prev) => prev.filter((b) => b.id !== id))
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h2 className="text-4xl font-bold text-pink-400 mb-4">👉 Right Click Test</h2>
        <p className="text-gray-300 mb-8 max-w-md">
          <strong>Right-click</strong> the glowing boxes as fast as you can! You have {DURATION} seconds. Each correct right-click earns 10 points.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-bold text-lg transition-all"
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
          <p className="text-3xl font-bold text-pink-400">{score}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Hits</p>
          <p className="text-3xl font-bold text-green-400">{hits}</p>
        </div>
      </div>

      <div
        className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden select-none"
        style={{ width: AREA_W, height: AREA_H }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <AnimatePresence>
          {timeLeft > 0 &&
            boxes.map((box) => (
              <motion.div
                key={box.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onContextMenu={(e) => handleContextMenu(e, box.id)}
                style={{ position: 'absolute', left: box.x, top: box.y, width: SIZE, height: SIZE }}
                className="rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-[0_0_20px_#ec4899] cursor-context-menu flex items-center justify-center text-white font-bold text-xs border border-white/20"
              >
                Right-click
              </motion.div>
            ))}
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
