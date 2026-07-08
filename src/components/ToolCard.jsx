export default function ToolCard({ tool, onClick, style, colorsOverride }) {
  const { icon, title, description, featured, featuredImage } = tool
  const colors = colorsOverride || tool.colors

  return (
    <button
      onClick={onClick}
      style={style}
      className={`group relative text-left rounded-2xl shadow-sm border flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 ease-out animate-fade-in-up ${
        featured ? 'overflow-visible' : 'overflow-hidden'
      } ${colors.hoverBorder} ${colors.hoverBg} ${
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

      <span
        className={`material-symbols-outlined absolute top-4 right-4 text-lg opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out ${colors.iconText}`}
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
        className={`relative z-10 h-1 w-10 group-hover:w-full rounded-full mt-5 transition-all duration-500 ease-out ${colors.bar}`}
      />
    </button>
  )
}
