import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw } from 'lucide-react'

const MAX_SCORES = {
  leftClick: 300,
  rightClick: 300,
  scroll: 80,
  copyPaste: 100,
  spaceDodge: 500,
}

const LABELS = {
  leftClick: '👆 Left Click',
  rightClick: '👉 Right Click',
  scroll: '⬆️ Scroll',
  copyPaste: '📋 Copy & Paste',
  spaceDodge: '🚀 Space Dodge',
}

function getGrade(pct) {
  if (pct >= 90) return { letter: 'A', color: 'text-green-400' }
  if (pct >= 80) return { letter: 'B', color: 'text-cyan-400' }
  if (pct >= 70) return { letter: 'C', color: 'text-yellow-400' }
  if (pct >= 60) return { letter: 'D', color: 'text-orange-400' }
  return { letter: 'F', color: 'text-red-400' }
}

export default function Results({ scores, onRestart }) {
  const totalMax = Object.values(MAX_SCORES).reduce((a, b) => a + b, 0)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const totalPct = Math.round((totalScore / totalMax) * 100)
  const grade = getGrade(totalPct)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full"
      >
        <Trophy className="mx-auto mb-4 text-yellow-400 w-14 h-14 drop-shadow-[0_0_12px_#eab308]" />
        <h2 className="text-4xl font-extrabold text-white mb-2">Results & Analytics</h2>
        <p className="text-gray-400 mb-8">Here's how you performed across all 5 tests.</p>

        {/* Overall */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Overall Score</p>
          <p className="text-6xl font-black text-white mb-1">
            {totalScore}
            <span className="text-2xl text-gray-500">/{totalMax}</span>
          </p>
          <p className={`text-5xl font-black ${grade.color}`}>{grade.letter} — {totalPct}%</p>
        </div>

        {/* Individual */}
        <div className="space-y-3 mb-8">
          {Object.entries(scores).map(([key, val]) => {
            const max = MAX_SCORES[key]
            const pct = Math.round((val / max) * 100)
            const g = getGrade(pct)
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <span className="text-white font-medium">{LABELS[key]}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-gray-300 text-sm w-16 text-right">{val}/{max}</span>
                  <span className={`font-bold w-6 ${g.color}`}>{g.letter}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 mx-auto px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-purple-500/40 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </motion.div>
    </div>
  )
}
