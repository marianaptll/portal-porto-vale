import { createPortal } from 'react-dom'

export default function AccessDeniedModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden p-8 text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-3xl">shield</span>
        </div>

        <h2 className="text-xl font-bold text-red-500 dark:text-red-400 mb-2">Acesso Negado</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Você não tem permissão para acessar esta página. Solicite acesso ao administrador do sistema.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-slate-600 dark:text-slate-300 bg-surface-container-low dark:bg-slate-700 hover:bg-surface-container dark:hover:bg-slate-600 transition-all"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Voltar ao Hub
        </button>
      </div>
    </div>,
    document.body
  )
}
