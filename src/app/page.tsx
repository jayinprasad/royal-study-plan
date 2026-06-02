'use client'

import { useEffect } from 'react'
import useStore from '@/store/useStore'
import { FloatingParticles } from '@/components/FloatingParticles'
import { CommandCenter } from '@/components/CommandCenter'
import { SubjectAnalytics } from '@/components/SubjectAnalytics'
import { Heatmap } from '@/components/Heatmap'
import { VaultSection } from '@/components/VaultSection'
import { AIInsights } from '@/components/AIInsights'

export default function Home() {
  const loadFromLocalStorage = useStore((state) => state.loadFromLocalStorage)
  const saveToLocalStorage = useStore((state) => state.saveToLocalStorage)
  const updateStreak = useStore((state) => state.updateStreak)
  const addStudySession = useStore((state) => state.addStudySession)

  useEffect(() => {
    loadFromLocalStorage()
    updateStreak()
  }, [loadFromLocalStorage, updateStreak])

  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage()
    }, 10000)

    return () => clearInterval(interval)
  }, [saveToLocalStorage])

  // Demo: Add a study session when component mounts (for testing)
  useEffect(() => {
    const sessions = useStore((state) => state.stats.sessionsCompleted)
    if (sessions === 0) {
      addStudySession({
        subject: 'Physics',
        chapter: 'Units & Dimensions',
        duration: 45,
        completedAt: new Date(),
        xpGained: 150,
      })
    }
  }, [addStudySession])

  return (
    <main className="relative min-h-screen bg-dark-bg">
      <FloatingParticles count={50} />

      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(90deg, #00d9ff 1px, transparent 1px), linear-gradient(#00d9ff 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <header className="border-b border-dark-border backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-neon animate-pulse" />
              <div>
                <h1 className="text-xl font-bold text-neon-blue">JEE 2027</h1>
                <p className="text-xs text-gray-400">Study Command Center</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              v1.0 • Premium Edition
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
          {/* Command Center */}
          <CommandCenter />

          {/* Subject Analytics */}
          <SubjectAnalytics />

          {/* Heatmap */}
          <Heatmap />

          {/* Vaults */}
          <VaultSection />

          {/* AI Insights */}
          <AIInsights />

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm py-8 border-t border-dark-border">
            <p>🚀 Royal Study Plan • JEE Advanced 2027 Preparation Dashboard</p>
          </div>
        </div>
      </div>
    </main>
  )
}
