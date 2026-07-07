import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES, TOOLS } from '../data/toolCategories'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import ToolCard from './ToolCard'

// Classes literais (o Tailwind precisa ver o texto completo pra gerar o CSS) —
// cada uma aponta pra um dos 4 tokens "theme-tool-N", que o themeEngine
// atualiza via variável CSS conforme o tema de campanha ativo.
const THEME_TOOL_COLOR_VARIANTS = [
  {
    iconBg: 'bg-theme-tool-1/10',
    iconText: 'text-theme-tool-1',
    bar: 'bg-theme-tool-1',
    hoverBorder: 'hover:border-theme-tool-1',
    hoverBg: 'hover:bg-theme-tool-1/5',
    hoverIconBg: 'group-hover:bg-theme-tool-1',
  },
  {
    iconBg: 'bg-theme-tool-2/10',
    iconText: 'text-theme-tool-2',
    bar: 'bg-theme-tool-2',
    hoverBorder: 'hover:border-theme-tool-2',
    hoverBg: 'hover:bg-theme-tool-2/5',
    hoverIconBg: 'group-hover:bg-theme-tool-2',
  },
  {
    iconBg: 'bg-theme-tool-3/10',
    iconText: 'text-theme-tool-3',
    bar: 'bg-theme-tool-3',
    hoverBorder: 'hover:border-theme-tool-3',
    hoverBg: 'hover:bg-theme-tool-3/5',
    hoverIconBg: 'group-hover:bg-theme-tool-3',
  },
  {
    iconBg: 'bg-theme-tool-4/10',
    iconText: 'text-theme-tool-4',
    bar: 'bg-theme-tool-4',
    hoverBorder: 'hover:border-theme-tool-4',
    hoverBg: 'hover:bg-theme-tool-4/5',
    hoverIconBg: 'group-hover:bg-theme-tool-4',
  },
]

export default function ToolsExplorer({ searchQuery, onOpenTicket, onOpenPedidoCompras }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key)
  const navigate = useNavigate()
  const { isCampaignTheme } = useCampaignTheme()

  const isSearching = searchQuery.trim().length > 0

  const visibleTools = useMemo(() => {
    if (isSearching) {
      const query = searchQuery.trim().toLowerCase()
      return TOOLS.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      )
    }
    return TOOLS.filter((tool) => tool.category === activeCategory)
  }, [isSearching, searchQuery, activeCategory])

  const handleToolClick = (tool) => {
    const { action } = tool
    if (action.type === 'ticket') onOpenTicket()
    else if (action.type === 'pedidoCompras') onOpenPedidoCompras()
    else if (action.type === 'route') navigate(action.to)
    // action.type === 'href' -> sem destino real ainda, sem ação
  }

  return (
    <section>
      {!isSearching && (
        <div className="relative isolate flex items-center justify-center gap-1 bg-white dark:bg-slate-900 rounded-full p-3 mb-6 shadow-sm border border-outline-variant/20 dark:border-slate-700/60 overflow-x-auto overflow-y-hidden">
          {CATEGORIES.map((category) => {
            const isActive = category.key === activeCategory
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`relative cursor-pointer whitespace-nowrap text-sm font-semibold px-6 py-2 rounded-full transition-colors ${
                  isActive
                    ? isCampaignTheme
                      ? 'bg-theme-accent/10 text-theme-tool-2'
                      : 'bg-slate-100 dark:bg-slate-800 text-primary dark:text-blue-400'
                    : isCampaignTheme
                    ? 'text-slate-900/80 dark:text-white/80 hover:text-theme-tool-2'
                    : 'text-slate-900/80 dark:text-white/80 hover:text-primary dark:hover:text-blue-400'
                }`}
              >
                {category.label}

                {isActive && (
                  <motion.div
                    layoutId="lamp-categories"
                    className={`absolute inset-0 w-full rounded-full -z-10 ${
                      isCampaignTheme ? 'bg-theme-accent/5' : 'bg-blue-500/5 dark:bg-blue-400/5'
                    }`}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <div
                      className={`absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full ${
                        isCampaignTheme ? 'bg-theme-accent' : 'bg-blue-500 dark:bg-blue-400'
                      }`}
                    >
                      <div
                        className={`absolute w-12 h-6 rounded-full blur-md -top-1 -left-2 ${
                          isCampaignTheme ? 'bg-theme-accent/20' : 'bg-blue-500/20 dark:bg-blue-400/20'
                        }`}
                      />
                      <div
                        className={`absolute w-8 h-6 rounded-full blur-md -top-0.5 ${
                          isCampaignTheme ? 'bg-theme-accent/20' : 'bg-blue-500/20 dark:bg-blue-400/20'
                        }`}
                      />
                      <div
                        className={`absolute w-4 h-4 rounded-full blur-sm top-0 left-2 ${
                          isCampaignTheme ? 'bg-theme-accent/20' : 'bg-blue-500/20 dark:bg-blue-400/20'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {isSearching && (
        <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4">
          {visibleTools.length > 0
            ? `${visibleTools.length} ferramenta(s) encontrada(s) para "${searchQuery}"`
            : `Nenhuma ferramenta encontrada para "${searchQuery}"`}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {visibleTools.map((tool, index) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onClick={() => handleToolClick(tool)}
            style={{ animationDelay: `${index * 0.05}s` }}
            colorsOverride={isCampaignTheme ? THEME_TOOL_COLOR_VARIANTS[index % THEME_TOOL_COLOR_VARIANTS.length] : null}
          />
        ))}
      </div>
    </section>
  )
}
