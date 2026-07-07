import { useCampaignTheme } from '../context/CampaignThemeContext'
import { normalizePosition, getDecorations, DEFAULT_BANNER_FOCAL_POINT, safeScaleValue } from '../utils/themeEngine'

const USER_NAME = 'Mariana'

const DEFAULT_MASCOT_POSITION = { x: 78, y: 78 }

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getDateLabel() {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export default function WelcomeBanner({ searchQuery, onSearchChange }) {
  const { isCampaignTheme, activeTheme } = useCampaignTheme()

  return (
    <div className="relative mb-8 animate-fade-in-up">
      <section
        className={`rounded-3xl p-8 sm:p-10 relative overflow-hidden ${
          isCampaignTheme ? 'bg-theme-accent' : 'rankings-banner-blue'
        }`}
      >
        {isCampaignTheme && activeTheme.bannerImage && (
          <img
            src={activeTheme.bannerImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{
              objectPosition: `${normalizePosition(activeTheme.bannerFocalPoint, DEFAULT_BANNER_FOCAL_POINT).x}% ${
                normalizePosition(activeTheme.bannerFocalPoint, DEFAULT_BANNER_FOCAL_POINT).y
              }%`,
              transform: `scale(${safeScaleValue(activeTheme.bannerZoom)})`,
            }}
          />
        )}

        {isCampaignTheme && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        )}

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/10 rounded-full px-3 py-1 mb-4">
            {getDateLabel()}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {getGreeting()}, {USER_NAME.toUpperCase()}
          </h1>
          <p className="text-white/70 text-sm sm:text-base mb-6">
            Bem-vindo ao Portal Porto Vale. Selecione uma ferramenta abaixo para começar.
          </p>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-lg max-w-xs">
            <span className="material-symbols-outlined text-white/80">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar ferramenta..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/70"
            />
          </div>
        </div>
      </section>

      {isCampaignTheme &&
        getDecorations(activeTheme).map((deco) => (
          <img
            key={deco.id}
            src={deco.image}
            alt=""
            className="hidden sm:block absolute w-28 sm:w-32 drop-shadow-2xl pointer-events-none select-none z-20"
            style={{
              left: `${deco.position.x}%`,
              top: `${deco.position.y}%`,
              transform: `translate(-50%, -50%) scale(${deco.scale})`,
            }}
          />
        ))}

      {isCampaignTheme && activeTheme.mascotImage && (
        <img
          src={activeTheme.mascotImage}
          alt=""
          className="hidden md:block absolute w-40 lg:w-52 drop-shadow-2xl pointer-events-none select-none z-20"
          style={{
            left: `${normalizePosition(activeTheme.mascotPosition, DEFAULT_MASCOT_POSITION).x}%`,
            top: `${normalizePosition(activeTheme.mascotPosition, DEFAULT_MASCOT_POSITION).y}%`,
            transform: `translate(-50%, -50%) scale(${activeTheme.mascotScale || 1})`,
          }}
        />
      )}
    </div>
  )
}
