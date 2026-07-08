import { Link } from 'react-router-dom'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import { useViewAs, VIEW_AS_OPTIONS } from '../context/ViewAsContext'
import ThemeQuickMenu from './ThemeQuickMenu'
import ViewAsMenu from './ViewAsMenu'
import ProfileMenu from './ProfileMenu'

export default function Header() {
  const { isCampaignTheme, activeTheme } = useCampaignTheme()
  const { viewAsGroup } = useViewAs()
  const activeProfileLabel = VIEW_AS_OPTIONS.find((option) => option.key === viewAsGroup)?.label || 'Administrador'

  return (
    <nav
      className={`fixed top-0 w-full backdrop-blur-xl z-50 shadow-sm border-b ${
        isCampaignTheme
          ? 'bg-theme-header-bg border-theme-header-border'
          : 'bg-white/80 dark:bg-slate-900/80 border-outline-variant/10 dark:border-slate-700/30'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center px-4 sm:px-6 py-4">
        {/* Logo — esquerda, alinhado com o container do conteúdo */}
        <div className="flex-1">
          <Link to="/" className="inline-block">
            <img
              src={isCampaignTheme ? activeTheme.logo : '/illustrations/logo_portal_pv.png'}
              alt="Portal Porto Vale"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-end gap-2">
          <ThemeQuickMenu />

          <span
            className={`material-symbols-outlined cursor-pointer p-2 rounded-full transition-colors icon-animate ${
              isCampaignTheme
                ? 'text-theme-text-muted hover:bg-theme-header-border'
                : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800'
            }`}
          >
            notifications
          </span>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span
                className={`text-sm font-bold leading-none ${
                  isCampaignTheme ? 'text-theme-text-strong' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                Mariana
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isCampaignTheme ? 'text-theme-text-muted' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Perfil: {activeProfileLabel}
              </span>
            </div>
            <ProfileMenu avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDO0HD5tKlJK4wdWbQSoY94wOeuMTZyWY74TZQwKMOyrhFZ0TUK93i9nmzvj2hw_nOyTpV3Y4xrxFrZFQ15FtTdVKmNOl9rfHXbs037axbpJk2Jd5DBNWFmI8WMkhRaS7Q_Zf40pp_yhXn4j5bguz-vXuwAGhvxXZwHCADnTKu3yxTEgyqJ8DfDpQgchJeLXjOfUC-qtYkM03T2b4QfoUHYsYYMwOfyGVPJhH7_xEm22y1uZXECbpwBC3UafbNe3VQSSQJA5JJO1jQ" />
          </div>

          <ViewAsMenu isCampaignTheme={isCampaignTheme} />
        </div>
      </div>
    </nav>
  )
}
