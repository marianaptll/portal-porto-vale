import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useViewAs, VIEW_AS_OPTIONS } from '../context/ViewAsContext'

const USER_ROLE = 'Administrativo'

export default function ViewAsMenu({ isCampaignTheme, compact = false }) {
  const { viewAsGroup, setViewAsGroup } = useViewAs()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (USER_ROLE !== 'Administrativo') return null

  const activeOption = VIEW_AS_OPTIONS.find((option) => option.key === viewAsGroup) || VIEW_AS_OPTIONS[0]
  const isSimulating = viewAsGroup !== 'admin'

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        title="Ver como (simular perfil)"
        className={`h-9 px-3 rounded-full flex items-center gap-1.5 transition-colors flex-shrink-0 ${
          isSimulating
            ? isCampaignTheme
              ? 'text-theme-tool-2'
              : 'text-amber-600 dark:text-amber-400'
            : isCampaignTheme
            ? 'text-theme-text-muted hover:bg-theme-header-border'
            : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800'
        }`}
      >
        <span className="material-symbols-outlined text-lg leading-none">visibility</span>
        <span className={`text-xs font-semibold whitespace-nowrap ${compact ? 'hidden' : 'hidden sm:inline'}`}>
          {activeOption.label}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-outline-variant/10 dark:border-slate-700/30 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-outline-variant/10 dark:border-slate-700/30">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Ver como</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simula quais cards cada perfil veria na Home.
              </p>
            </div>

            <div className="py-1">
              {VIEW_AS_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setViewAsGroup(option.key)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">
                    {option.key === viewAsGroup ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
