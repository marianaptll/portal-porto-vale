import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import PhotoUploadModal from './PhotoUploadModal'
import ResetPasswordModal from './ResetPasswordModal'
import AccessDeniedModal from './AccessDeniedModal'

export default function ProfileMenu({ avatarSrc }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [customAvatar, setCustomAvatar] = useState(() => localStorage.getItem('profileAvatar'))
  const containerRef = useRef(null)
  const { isCampaignTheme } = useCampaignTheme()

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePhotoClick = () => {
    setIsOpen(false)
    setIsPhotoModalOpen(true)
  }

  const handlePasswordClick = () => {
    setIsOpen(false)
    setIsPasswordModalOpen(true)
  }

  const handlePhoneClick = () => {
    setIsOpen(false)
    setIsPhoneModalOpen(true)
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={`h-10 w-10 rounded-full bg-primary-container overflow-hidden ring-2 shadow-sm ${
          isCampaignTheme ? 'ring-theme-header-border' : 'ring-white dark:ring-slate-700'
        }`}
        aria-label="Abrir menu do perfil"
      >
        <img alt="User profile" className="w-full h-full object-cover" src={customAvatar || avatarSrc} />
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
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Minha Conta</span>
            </div>

            <div className="py-1">
              <button
                onClick={handlePhotoClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">
                  photo_camera
                </span>
                Alterar Foto
              </button>

              <button
                onClick={handlePasswordClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">
                  lock_reset
                </span>
                Redefinir Senha
              </button>

              <button
                onClick={handlePhoneClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">call</span>
                Atualizar Telefone
              </button>
            </div>

            <div className="border-t border-outline-variant/10 dark:border-slate-700/30 py-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">logout</span>
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onConfirm={(dataUrl) => {
          setCustomAvatar(dataUrl)
          localStorage.setItem('profileAvatar', dataUrl)
        }}
      />

      <ResetPasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />

      <AccessDeniedModal isOpen={isPhoneModalOpen} onClose={() => setIsPhoneModalOpen(false)} />
    </div>
  )
}
