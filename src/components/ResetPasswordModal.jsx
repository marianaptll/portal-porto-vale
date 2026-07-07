import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function ResetPasswordModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const reset = () => {
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    handleClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={handleClose} />

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden p-8"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary dark:text-blue-400 text-3xl">save</span>
            <h2 className="text-2xl font-bold text-primary dark:text-blue-400">Definir Nova Senha</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Escolha uma senha forte e segura para sua conta.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="material-symbols-outlined text-base">key</span>
              Nova Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="material-symbols-outlined text-base">lock</span>
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm font-medium text-error text-center">{error}</p>}
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
          >
            Salvar Nova Senha
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-slate-600 dark:text-slate-300 bg-surface-container-low dark:bg-slate-700 hover:bg-surface-container dark:hover:bg-slate-600 transition-all"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Voltar ao Hub
          </button>
        </div>
      </form>
    </div>,
    document.body
  )
}
