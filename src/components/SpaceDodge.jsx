import React, { useState, useEffect, useRef, useCallback } from 'react'

const PLAYER_SIZE = 28
const METEOR_SIZE = 26
const CANVAS_W = 700
const CANVAS_H = 420
const MAX_SCORE = 500
const SPAWN_INTERVAL = 1200 // ms
const METEOR_SPEED = 2.5

function randomMeteor() {
  return {
    id: Date.now() + Math.random(),
    x: Math.random() * (CANVAS_W - METEOR_SIZE),
    y: -METEOR_SIZE,
    vx: (Math.random() - 0.5) * 2,
    vy: METEOR_SPEED + Math.random() * 1.5,
  }
}

export default function SpaceDodge({ onDone }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    player: { x: CANVAS_W / 2 - PLAYER_SIZE / 2, y: CANVAS_H - 70 },
    meteors: [],
    score: 0,
    alive: true,
    animId: null,
    spawnId: null,
  })
  const [started, setStarted] = useState(false)
  const [dead, setDead] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)

  const endGame = useCallback(() => {
    const s = stateRef.current
    s.alive = false
    if (s.animId) cancelAnimationFrame(s.animId)
    if (s.spawnId) clearInterval(s.spawnId)
    setFinalScore(s.score)
    setDead(true)
  }, [])

  useEffect(() => {
    if (!started) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current
    s.alive = true
    s.score = 0
    s.meteors = []

    // Spawn meteors
    s.spawnId = setInterval(() => {
      if (s.alive) s.meteors.push(randomMeteor())
    }, SPAWN_INTERVAL)

    // Mouse / pointer follow
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const cx = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left
      const cy = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top
      s.player.x = Math.max(0, Math.min(CANVAS_W - PLAYER_SIZE, cx - PLAYER_SIZE / 2))
      s.player.y = Math.max(0, Math.min(CANVAS_H - PLAYER_SIZE, cy - PLAYER_SIZE / 2))
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove, { passive: true })

    let lastTime = performance.now()

    const loop = (now) => {
      if (!s.alive) return
      const dt = Math.min((now - lastTime) / 16.67, 3)
      lastTime = now

      // Update meteors
      s.meteors = s.meteors.filter((m) => {
        m.x += m.vx * dt
        m.y += m.vy * dt
        return m.y < CANVAS_H + METEOR_SIZE
      })

      // Collision
      for (const m of s.meteors) {
        if (
          m.x < s.player.x + PLAYER_SIZE &&
          m.x + METEOR_SIZE > s.player.x &&
          m.y < s.player.y + PLAYER_SIZE &&
          m.y + METEOR_SIZE > s.player.y
        ) {
          endGame()
          return
        }
      }

      s.score = Math.min(s.score + 0.05 * dt, MAX_SCORE)
      setDisplayScore(Math.floor(s.score))

      // Draw
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

      // Background grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      for (let gx = 0; gx < CANVAS_W; gx += 50) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, CANVAS_H); ctx.stroke()
      }
      for (let gy = 0; gy < CANVAS_H; gy += 50) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(CANVAS_W, gy); ctx.stroke()
      }

      // Meteors
      s.meteors.forEach((m) => {
        ctx.save()
        ctx.shadowColor = '#f97316'
        ctx.shadowBlur = 12
        ctx.fillStyle = '#f97316'
        ctx.beginPath()
        ctx.arc(m.x + METEOR_SIZE / 2, m.y + METEOR_SIZE / 2, METEOR_SIZE / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        ctx.fillStyle = '#fff'
        ctx.font = `${METEOR_SIZE}px serif`
        ctx.fillText('☄️', m.x, m.y + METEOR_SIZE)
      })

      // Player
      ctx.save()
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#06b6d4'
      ctx.beginPath()
      ctx.arc(s.player.x + PLAYER_SIZE / 2, s.player.y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#fff'
      ctx.font = `${PLAYER_SIZE}px serif`
      ctx.fillText('🚀', s.player.x, s.player.y + PLAYER_SIZE)

      s.animId = requestAnimationFrame(loop)
    }

    s.animId = requestAnimationFrame(loop)

    return () => {
      s.alive = false
      if (s.animId) cancelAnimationFrame(s.animId)
      if (s.spawnId) clearInterval(s.spawnId)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove)
    }
  }, [started, endGame])

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h2 className="text-4xl font-bold text-orange-400 mb-4">🚀 Space Dodge</h2>
        <p className="text-gray-300 mb-8 max-w-md">
          Move your mouse (or head mouse) to dodge falling meteorites! Score increases over time. Game ends on collision.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg transition-all"
        >
          Start
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex gap-8 mb-4">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Score</p>
          <p className="text-3xl font-bold text-orange-400">{displayScore}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Max</p>
          <p className="text-3xl font-bold text-gray-500">{MAX_SCORE}</p>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="bg-[#0a0a1a] border border-white/10 rounded-2xl cursor-none block"
        />
        {dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl">
            <p className="text-4xl mb-2">💥</p>
            <p className="text-2xl font-bold text-white mb-1">Game Over!</p>
            <p className="text-orange-400 text-xl font-bold mb-6">Score: {Math.floor(finalScore)}</p>
            <button
              onClick={() => onDone(Math.floor(finalScore))}
              className="px-8 py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg transition-all"
            >
              Continue to Results
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-500 mt-3 text-sm">Move your mouse inside the canvas to dodge meteors</p>
    </div>
  )
}
