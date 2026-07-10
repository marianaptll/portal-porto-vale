import { Fragment, useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES, TOOLS } from '../data/toolCategories'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import { useViewAs, canViewTool } from '../context/ViewAsContext'
import { useFavorites } from '../hooks/useFavorites'
import ToolCard from './ToolCard'

// Posição de cada categoria no menu — usado pra ordenar os favoritos (que
// juntam ferramentas de várias categorias) na mesma ordem em que elas
// aparecem nas abas, em vez da ordem em que foram favoritadas.
const CATEGORY_ORDER = CATEGORIES.reduce((acc, category, index) => {
  acc[category.key] = index
  return acc
}, {})

// Classes literais (o Tailwind precisa ver o texto completo pra gerar o CSS) —
// cada uma aponta pra um dos 6 tokens "theme-tool-N", que o themeEngine
// atualiza via variável CSS conforme o tema de campanha ativo.
const THEME_TOOL_COLOR_VARIANTS = [
  {
    iconBg: 'bg-theme-tool-1/10',
    iconText: 'text-theme-tool-1',
    bar: 'bg-theme-tool-1',
    border: 'border-theme-tool-1/30',
    featuredBg: 'bg-theme-tool-1/5',
    hoverBorder: 'hover:border-theme-tool-1',
    hoverBg: 'hover:bg-theme-tool-1/5',
    hoverIconBg: 'group-hover:bg-theme-tool-1',
  },
  {
    iconBg: 'bg-theme-tool-2/10',
    iconText: 'text-theme-tool-2',
    bar: 'bg-theme-tool-2',
    border: 'border-theme-tool-2/30',
    featuredBg: 'bg-theme-tool-2/5',
    hoverBorder: 'hover:border-theme-tool-2',
    hoverBg: 'hover:bg-theme-tool-2/5',
    hoverIconBg: 'group-hover:bg-theme-tool-2',
  },
  {
    iconBg: 'bg-theme-tool-3/10',
    iconText: 'text-theme-tool-3',
    bar: 'bg-theme-tool-3',
    border: 'border-theme-tool-3/30',
    featuredBg: 'bg-theme-tool-3/5',
    hoverBorder: 'hover:border-theme-tool-3',
    hoverBg: 'hover:bg-theme-tool-3/5',
    hoverIconBg: 'group-hover:bg-theme-tool-3',
  },
  {
    iconBg: 'bg-theme-tool-4/10',
    iconText: 'text-theme-tool-4',
    bar: 'bg-theme-tool-4',
    border: 'border-theme-tool-4/30',
    featuredBg: 'bg-theme-tool-4/5',
    hoverBorder: 'hover:border-theme-tool-4',
    hoverBg: 'hover:bg-theme-tool-4/5',
    hoverIconBg: 'group-hover:bg-theme-tool-4',
  },
  {
    iconBg: 'bg-theme-tool-5/10',
    iconText: 'text-theme-tool-5',
    bar: 'bg-theme-tool-5',
    border: 'border-theme-tool-5/30',
    featuredBg: 'bg-theme-tool-5/5',
    hoverBorder: 'hover:border-theme-tool-5',
    hoverBg: 'hover:bg-theme-tool-5/5',
    hoverIconBg: 'group-hover:bg-theme-tool-5',
  },
  {
    iconBg: 'bg-theme-tool-6/10',
    iconText: 'text-theme-tool-6',
    bar: 'bg-theme-tool-6',
    border: 'border-theme-tool-6/30',
    featuredBg: 'bg-theme-tool-6/5',
    hoverBorder: 'hover:border-theme-tool-6',
    hoverBg: 'hover:bg-theme-tool-6/5',
    hoverIconBg: 'group-hover:bg-theme-tool-6',
  },
]

// Cores neutras pros cards "comuns" de uma categoria que já tem um card em destaque
// (ex: os outros rankings além de Ranking Superintendências) — em vez de cada um
// competir com uma cor própria, eles recuam pro segundo plano e o destaque sobra
// sozinho como ponto forte. Dois tons (forte/fraco) criam um degradê de importância:
// "tier: 'strong'" no dado da ferramenta (ex: Diretor, Gerente) usa o tom mais escuro;
// o resto usa o mais claro. Fora do tema de campanha usamos cinza puro (combina com o
// azul padrão do portal); dentro de um tema de campanha usamos o próprio "theme-accent"
// bem dessaturado via opacidade, pra não destoar da paleta quente/fria de cada campanha.
const NEUTRAL_STRONG_VARIANT_SLATE = {
  iconBg: 'bg-slate-200 dark:bg-slate-600/50',
  iconText: 'text-slate-600 dark:text-slate-300',
  bar: 'bg-slate-400 dark:bg-slate-500',
  border: 'border-slate-300 dark:border-slate-500/60',
  featuredBg: 'bg-slate-100 dark:bg-slate-700/30',
  hoverBorder: 'hover:border-slate-400 dark:hover:border-slate-400/60',
  hoverBg: 'hover:bg-slate-100 dark:hover:bg-slate-700/40',
  hoverIconBg: 'group-hover:bg-slate-500',
}

const NEUTRAL_VARIANT_SLATE = {
  iconBg: 'bg-slate-50 dark:bg-slate-700/25',
  iconText: 'text-slate-400 dark:text-slate-500',
  bar: 'bg-slate-200 dark:bg-slate-700',
  border: 'border-slate-100 dark:border-slate-700/50',
  featuredBg: 'bg-slate-50/60 dark:bg-slate-700/15',
  hoverBorder: 'hover:border-slate-300 dark:hover:border-slate-500/50',
  hoverBg: 'hover:bg-slate-50 dark:hover:bg-slate-700/30',
  hoverIconBg: 'group-hover:bg-slate-400',
}

// Usa "theme-tool-1" (o laranja dos cards coloridos), não "theme-accent" (o marrom
// do header/estrutura) — são duas famílias distintas no mesmo tema, e misturar as
// duas no mesmo elemento (ícone do card) lia como cores concorrentes em vez de uma
// única paleta coerente com o resto da grade de ferramentas.
const NEUTRAL_STRONG_VARIANT_THEME = {
  iconBg: 'bg-theme-tool-1/15',
  iconText: 'text-theme-tool-1/70',
  bar: 'bg-theme-tool-1/45',
  border: 'border-theme-tool-1/25',
  featuredBg: 'bg-theme-tool-1/8',
  hoverBorder: 'hover:border-theme-tool-1/40',
  hoverBg: 'hover:bg-theme-tool-1/10',
  hoverIconBg: 'group-hover:bg-theme-tool-1',
}

const NEUTRAL_VARIANT_THEME = {
  iconBg: 'bg-theme-tool-1/8',
  iconText: 'text-theme-tool-1/45',
  bar: 'bg-theme-tool-1/20',
  border: 'border-theme-tool-1/12',
  featuredBg: 'bg-theme-tool-1/5',
  hoverBorder: 'hover:border-theme-tool-1/20',
  hoverBg: 'hover:bg-theme-tool-1/6',
  hoverIconBg: 'group-hover:bg-theme-tool-1',
}

export default function ToolsExplorer({ searchQuery, onOpenTicket, onOpenPedidoCompras }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key)
  // A animação de entrada dos cards (fade-in-up com atraso por índice) deve rodar só
  // na primeira renderização da Home — sem isso, toda troca de aba remonta os cards
  // (chaves diferentes) e replay a animação inteira, o que em categorias com mais
  // itens (ex: Painéis de Gestão, 6 cards) aparece como uma "piscada" perceptível.
  const [hasInteracted, setHasInteracted] = useState(false)
  const navigate = useNavigate()
  const { isCampaignTheme } = useCampaignTheme()
  const { viewAsGroup } = useViewAs()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  const isSearching = searchQuery.trim().length > 0
  const isFavoritosTab = activeCategory === 'favoritos' && !isSearching

  // Buscar também remonta os cards a cada tecla digitada — desliga a animação de
  // entrada assim que a busca começa, pelo mesmo motivo do clique nas abas.
  useEffect(() => {
    if (isSearching) setHasInteracted(true)
  }, [isSearching])

  // Esconde categorias sem nenhuma ferramenta liberada pro perfil simulado —
  // não faz sentido mostrar uma aba que sempre leva a uma tela vazia. "Favoritos"
  // é a exceção: fica sempre visível (é uma lista pessoal, não puxa de nenhuma
  // ferramenta com essa "category" fixa), com uma mensagem própria quando vazia.
  const visibleCategories = useMemo(
    () =>
      CATEGORIES.filter(
        (category) =>
          category.key === 'favoritos' ||
          TOOLS.some((tool) => tool.category === category.key && canViewTool(tool, viewAsGroup))
      ),
    [viewAsGroup]
  )

  useEffect(() => {
    if (!visibleCategories.some((category) => category.key === activeCategory)) {
      setActiveCategory(visibleCategories[0]?.key)
    }
  }, [visibleCategories, activeCategory])

  const visibleTools = useMemo(() => {
    const allowedTools = TOOLS.filter((tool) => canViewTool(tool, viewAsGroup))
    if (isSearching) {
      const query = searchQuery.trim().toLowerCase()
      return allowedTools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      )
    }
    if (activeCategory === 'favoritos') {
      return allowedTools
        .filter((tool) => favorites.includes(tool.id))
        .sort((a, b) => (CATEGORY_ORDER[a.category] ?? 0) - (CATEGORY_ORDER[b.category] ?? 0))
    }
    return allowedTools.filter((tool) => tool.category === activeCategory)
  }, [isSearching, searchQuery, activeCategory, viewAsGroup, favorites])

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
          {visibleCategories.map((category) => {
            const isActive = category.key === activeCategory
            return (
              <button
                key={category.key}
                onClick={() => {
                  setActiveCategory(category.key)
                  setHasInteracted(true)
                }}
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

      {isFavoritosTab && visibleTools.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-outline-variant/10 dark:border-slate-700/30">
          <span
            className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-3"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <p className="font-bold text-slate-500 dark:text-slate-400">Nenhum favorito ainda</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Clique no coração de uma ferramenta pra marcá-la como favorito.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {visibleTools.map((tool, index) => {
          // "featuredOnlyForGroups" existe em painéis que só fazem sentido destacados
          // quando o próprio dono do painel está olhando (ex: GRE vendo o painel dele) —
          // sem isso, o admin (que vê todos os painéis juntos) acabaria com quase tudo
          // "em destaque" ao mesmo tempo, o que anula o efeito do destaque.
          const isFeatured =
            Boolean(tool.featured) &&
            (!tool.featuredOnlyForGroups || tool.featuredOnlyForGroups.includes(viewAsGroup))
          const effectiveTool = isFeatured === Boolean(tool.featured) ? tool : { ...tool, featured: isFeatured }
          const isMutedRanking = tool.category === 'rankings' && !isFeatured
          const colorsOverride = isMutedRanking
            ? isCampaignTheme
              ? tool.tier === 'strong'
                ? NEUTRAL_STRONG_VARIANT_THEME
                : NEUTRAL_VARIANT_THEME
              : tool.tier === 'strong'
              ? NEUTRAL_STRONG_VARIANT_SLATE
              : NEUTRAL_VARIANT_SLATE
            : isCampaignTheme
            ? THEME_TOOL_COLOR_VARIANTS[index % THEME_TOOL_COLOR_VARIANTS.length]
            : null
          return (
            <Fragment key={tool.id}>
              {tool.sectionLabel && !isSearching && !isFavoritosTab && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex items-center gap-3 pt-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      isCampaignTheme ? 'text-theme-tool-1/80' : 'text-primary/80 dark:text-blue-400/80'
                    }`}
                  >
                    {tool.sectionLabel}
                  </span>
                  <div className={`flex-1 h-px ${isCampaignTheme ? 'bg-theme-tool-1/25' : 'bg-primary/20 dark:bg-blue-400/25'}`} />
                </div>
              )}
              <ToolCard
                tool={effectiveTool}
                onClick={() => handleToolClick(tool)}
                style={hasInteracted ? undefined : { animationDelay: `${index * 0.05}s` }}
                colorsOverride={colorsOverride}
                animate={!hasInteracted}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={() => toggleFavorite(tool.id)}
              />
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
