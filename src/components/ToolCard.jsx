export default function ToolCard({ tool, onClick, style, colorsOverride }) {
  const { icon, title, description } = tool
  const colors = colorsOverride || tool.colors

  return (
    <button
      onClick={onClick}
      style={style}
      className={`group relative text-left bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 ease-out animate-fade-in-up overflow-hidden ${colors.hoverBorder} ${colors.hoverBg}`}
    >
      <span
        className={`material-symbols-outlined absolute top-4 right-4 text-lg opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out ${colors.iconText}`}
      >
        arrow_outward
      </span>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-500 ease-out ${colors.iconBg} ${colors.hoverIconBg}`}
      >
        <span className={`material-symbols-outlined transition-colors duration-500 ease-out ${colors.iconText} group-hover:text-white`}>
          {icon}
        </span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1.5 flex-1">
        {description}
      </p>
      <div className={`h-1 w-10 group-hover:w-full rounded-full mt-5 transition-all duration-500 ease-out ${colors.bar}`} />
    </button>
  )
}
