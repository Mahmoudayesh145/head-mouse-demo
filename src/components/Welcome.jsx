import React from 'react'
import { motion } from 'framer-motion'
import { MousePointer2, Zap } from 'lucide-react'

export default function Welcome({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <MousePointer2 className="mx-auto mb-4 text-purple-400 w-16 h-16 drop-shadow-[0_0_12px_#a855f7]" />
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent neon-text-purple mb-3">
          Head Mouse Demo
        </h1>
        <p className="text-gray-300 text-lg max-w-lg mx-auto">
          An interactive testing suite to evaluate the precision and responsiveness of your
          head-mounted wireless mouse through 5 engaging games.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left max-w-xl w-full"
      >
        {[
          { icon: '👆', label: 'Left Click Test', desc: 'Hit moving targets (30s)' },
          { icon: '👉', label: 'Right Click Test', desc: 'Activate context boxes (30s)' },
          { icon: '⬆️', label: 'Scroll Test', desc: 'Collect gems by scrolling (30s)' },
          { icon: '📋', label: 'Copy & Paste', desc: 'Accuracy challenge (45s)' },
          { icon: '🚀', label: 'Space Dodge', desc: 'Avoid meteorites (unlimited)' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-white">{item.label}</p>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-500/50 transition-all"
      >
        <Zap className="w-5 h-5" />
        Start Demo
      </motion.button>
    </div>
  )
}
