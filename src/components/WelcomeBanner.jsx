import { useEffect, useState } from 'react'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import { normalizePosition, getOverlayLayers, DEFAULT_BANNER_FOCAL_POINT, safeScaleValue } from '../utils/themeEngine'
import { BUILT_IN_THEME } from '../data/campaignTheme'

const USER_NAME = 'Mariana'

const LAYER_WIDTH_CLASS = {
  mascot: 'hidden md:block w-40 lg:w-52',
  decoration: 'hidden sm:block w-28 sm:w-32',
}

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
  const [bannerFailed, setBannerFailed] = useState(false)

  // Se a própria origem da imagem mudar (editou e salvou um banner novo), dá
  // outra chance de carregar em vez de ficar preso no fallback de uma falha antiga.
  useEffect(() => {
    setBannerFailed(false)
  }, [activeTheme?.bannerImage])

  // Uma referência de imagem apontando pra um arquivo que não existe mais (ex:
  // asset trocado/removido do projeto) não pode deixar o banner sem fundo
  // nenhum — cai pro banner embutido do tema "Arena Country" quando é esse o
  // tema ativo, em vez de mostrar só o gradiente vazio.
  const bannerImage =
    bannerFailed && activeTheme?.id === BUILT_IN_THEME.id ? BUILT_IN_THEME.bannerImage : activeTheme?.bannerImage

  return (
    <div className="relative mb-8 animate-fade-in-up">
      <section
        className={`rounded-3xl p-8 sm:p-10 relative overflow-hidden ${
          isCampaignTheme ? 'bg-theme-accent' : 'rankings-banner-blue'
        }`}
        // Com "bannerFit: contain" a imagem não preenche a faixa toda — a cor
        // de fundo aparece nas sobras, então usamos uma cor própria do tema
        // (bannerBg) que combine com a arte, em vez do "accent" genérico.
        style={isCampaignTheme && activeTheme?.bannerFit === 'contain' && activeTheme?.bannerBg ? { backgroundColor: activeTheme.bannerBg } : undefined}
      >
        {isCampaignTheme && bannerImage && (
          <img
            src={bannerImage}
            alt=""
            onError={() => setBannerFailed(true)}
            className={`absolute inset-0 w-full h-full pointer-events-none select-none ${
              activeTheme?.bannerFit === 'contain' ? 'object-contain' : 'object-cover'
            } ${activeTheme?.bannerAnimated === false ? '' : 'animate-banner-kenburns'}`}
            style={{
              objectPosition: `${normalizePosition(activeTheme.bannerFocalPoint, DEFAULT_BANNER_FOCAL_POINT).x}% ${
                normalizePosition(activeTheme.bannerFocalPoint, DEFAULT_BANNER_FOCAL_POINT).y
              }%`,
              '--banner-zoom': safeScaleValue(activeTheme.bannerZoom),
            }}
          />
        )}

        {isCampaignTheme && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, rgba(${
                activeTheme?.bannerOverlayColor || '0,0,0'
              },${activeTheme?.bannerOverlayOpacity?.[0] ?? 0.96}) 0%, rgba(${
                activeTheme?.bannerOverlayColor || '0,0,0'
              },${activeTheme?.bannerOverlayOpacity?.[1] ?? 0.75}) 35%, transparent 50%)`,
            }}
          />
        )}

        <div className="relative z-10 max-w-xl">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1 mb-4 border ${
              isCampaignTheme && !activeTheme?.dateBadgeColor ? 'bg-theme-tool-5/15 border-theme-tool-5/40 text-theme-tool-5' : ''
            } ${!isCampaignTheme ? 'bg-white/10 border-transparent text-white/80' : ''}`}
            style={
              isCampaignTheme && activeTheme?.dateBadgeColor
                ? {
                    backgroundColor: `rgba(${activeTheme.dateBadgeColor}, 0.18)`,
                    borderColor: `rgba(${activeTheme.dateBadgeColor}, 0.5)`,
                    color: `rgb(${activeTheme.dateBadgeColor})`,
                  }
                : undefined
            }
          >
            {getDateLabel()}
          </span>
          <h1
            className={`font-extrabold tracking-tight ${
              activeTheme?.titleFont
                ? 'font-magic text-gold-texture text-3xl sm:text-4xl leading-[1.6] py-1 mb-1'
                : 'text-3xl sm:text-4xl text-white mb-2'
            }`}
          >
            {getGreeting()}, {activeTheme?.titleFont ? USER_NAME : USER_NAME.toUpperCase()}
          </h1>
          <p className="text-white/70 text-sm sm:text-base mb-6">
            Bem-vindo ao Portal Porto Vale. Selecione uma ferramenta abaixo para começar.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="search-flash-sweep group flex items-center gap-2 bg-white/10 hover:bg-sky-300/20 backdrop-blur-md border border-white/20 hover:border-sky-300/40 rounded-2xl px-4 py-3 shadow-lg max-w-xs transition-colors duration-300">
              <span className="material-symbols-outlined text-white/80 group-hover:text-sky-200 transition-colors duration-300">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar ferramenta..."
                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/70 group-hover:text-sky-100 group-hover:placeholder:text-sky-200/70 transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {isCampaignTheme &&
        getOverlayLayers(activeTheme).map((layer, index, layers) => (
          <img
            key={layer.id}
            src={layer.image}
            alt=""
            className={`absolute drop-shadow-2xl pointer-events-none select-none ${LAYER_WIDTH_CLASS[layer.kind]}`}
            style={{
              left: `${layer.position.x}%`,
              top: `${layer.position.y}%`,
              transform: `translate(-50%, -50%) scale(${layer.scale})`,
              zIndex: 20 + (layers.length - index),
            }}
          />
        ))}
    </div>
  )
}
