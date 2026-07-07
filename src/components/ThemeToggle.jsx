import { useCampaignTheme } from '../context/CampaignThemeContext'

export default function ThemeToggle() {
  const { isCampaignTheme, toggleCampaignTheme, activeTheme } = useCampaignTheme()

  return (
    <button
      type="button"
      onClick={toggleCampaignTheme}
      aria-label="Alternar entre tema padrão e tema da campanha"
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
  )
}
