export default function ToolCard({ tool, onClick, style, colorsOverride, animate = true, isFavorite, onToggleFavorite }) {
  const { icon, title, description, featured, featuredImage } = tool
  const colors = colorsOverride || tool.colors

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      style={style}
      className={`group relative text-left rounded-2xl shadow-sm border flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 ease-out cursor-pointer ${
        animate ? 'animate-fade-in-up' : ''
      } ${featured ? 'overflow-visible' : 'overflow-hidden'} ${colors.hoverBorder} ${colors.hoverBg} ${
        featured
          ? `sm:col-span-2 p-8 border-2 ${colors.border} ${colors.featuredBg}`
          : 'p-6 border-outline-variant/10 dark:border-slate-700/30 bg-white dark:bg-slate-800'
      }`}
    >
      {featured && featuredImage && (
        <img
          src={featuredImage}
          alt=""
          className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 right-6 w-80 h-80 object-contain drop-shadow-lg hidden sm:block"
        />
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite?.()
        }}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <span
          className={`material-symbols-outlined text-lg transition-colors ${
            isFavorite ? 'text-red-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400'
          }`}
          style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
      </button>

      <span
        className={`material-symbols-outlined absolute bottom-4 right-4 text-lg opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out ${colors.iconText}`}
      >
        arrow_outward
      </span>

      <div
        className={`rounded-xl flex items-center justify-center mb-4 transition-colors duration-500 ease-out ${
          featured ? colors.bar : `${colors.iconBg} ${colors.hoverIconBg}`
        } ${featured ? 'w-16 h-16' : 'w-12 h-12'}`}
      >
        <span
          className={`material-symbols-outlined transition-colors duration-500 ease-out ${
            featured ? 'text-white' : `${colors.iconText} group-hover:text-white`
          } ${featured ? 'text-3xl' : ''}`}
        >
          {icon}
        </span>
      </div>
      <h4 className={`font-bold text-slate-900 dark:text-slate-100 ${featured ? 'text-xl' : ''}`}>{title}</h4>
      <p className={`text-sm text-on-surface-variant dark:text-slate-400 mt-1.5 flex-1 ${featured ? 'max-w-xs sm:max-w-sm' : ''}`}>
        {description}
      </p>
      <div
        className={`relative z-10 h-1 w-10 group-hover:w-[calc(100%-2rem)] rounded-full mt-5 transition-all duration-500 ease-out ${colors.bar}`}
      />
    </div>
  )
}
