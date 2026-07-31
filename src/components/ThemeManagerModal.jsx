import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import { BUILT_IN_THEMES } from '../data/campaignTheme'

const BUILT_IN_THEME_IDS = BUILT_IN_THEMES.map((t) => t.id)

export default function ThemeManagerModal({ isOpen, onClose }) {
  const { themes, activeThemeId, setActiveThemeId, removeTheme } = useCampaignTheme()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleCreateNew = () => {
    onClose()
    navigate('/temas/criar')
  }

  const handleEdit = (id) => {
    onClose()
    navigate(`/temas/editar/${id}`)
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col modal-max-height">
        <div className="p-5 sm:p-6 border-b border-outline-variant/10 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Temas de Campanha</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escolha qual campanha está ativa ou crie uma nova.
            </p>
          </div>
          <button
            className="p-2 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined dark:text-slate-300">close</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          <div className="space-y-2">
            <button
              onClick={() => setActiveThemeId(null)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                !activeThemeId
                  ? 'border-primary bg-primary/5'
                  : 'border-outline-variant/20 dark:border-slate-700 hover:bg-surface-container-low dark:hover:bg-slate-700/40'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 shrink-0" />
              <span className="flex-1 text-sm font-bold text-slate-800 dark:text-slate-100">Tema padrão</span>
              {!activeThemeId && <span className="material-symbols-outlined text-primary text-lg">check_circle</span>}
            </button>

            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  activeThemeId === theme.id
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/20 dark:border-slate-700'
                }`}
              >
                <button onClick={() => setActiveThemeId(theme.id)} className="flex items-center gap-3 flex-1 text-left">
                  <div
                    className="w-8 h-8 rounded-full shrink-0 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.toolAccent || theme.accent})` }}
                  />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{theme.name}</span>
                </button>
                {activeThemeId === theme.id && (
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                )}
                <button
                  onClick={() => handleEdit(theme.id)}
                  className="text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors"
                  title="Editar tema"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                {!BUILT_IN_THEME_IDS.includes(theme.id) && (
                  <button onClick={() => removeTheme(theme.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleCreateNew}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm text-primary dark:text-blue-400 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Criar Novo Tema
          </button>
        </div>

        <div className="p-5 sm:p-6 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
