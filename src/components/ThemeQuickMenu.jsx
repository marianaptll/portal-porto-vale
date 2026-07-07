import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import ThemeManagerModal from './ThemeManagerModal'

const USER_ROLE = 'Administrativo'

export default function ThemeQuickMenu() {
  const { isCampaignTheme, activeTheme, toggleCampaignTheme } = useCampaignTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

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

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Opções de tema (admin)"
        title={isCampaignTheme ? `Tema da campanha ativo (${activeTheme.name})` : 'Tema padrão ativo'}
        className={`h-10 w-10 rounded-full transition-colors duration-300 active:scale-95 shadow-sm flex-shrink-0 flex items-center justify-center ${
          isCampaignTheme ? '' : 'bg-surface-container dark:bg-slate-800'
        }`}
        style={
          isCampaignTheme
            ? { background: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)', boxShadow: '0 2px 12px rgba(234,179,8,0.5)' }
            : undefined
        }
      >
        <span
          className={`material-symbols-outlined text-xl leading-none ${
            isCampaignTheme ? 'text-[#7c4a2d]' : 'text-on-surface-variant dark:text-slate-400'
          }`}
        >
          palette
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
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Tema de Campanha</span>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  toggleCampaignTheme()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">palette</span>
                {isCampaignTheme ? 'Usar Tema Padrão' : 'Ativar Tema de Campanha'}
              </button>

              <button
                onClick={() => {
                  setIsManagerOpen(true)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">list</span>
                Ver Todos os Temas
              </button>

              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/temas/criar')
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">
                  add_circle
                </span>
                Criar Novo Tema
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeManagerModal isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)} />
    </div>
  )
}
