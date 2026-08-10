import { Fragment, useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
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
    // Opaco de propósito (color-mix, não a variante "/5" com alpha) — um card
    // com bg-white e hover:bg-X/5 troca o branco pela cor 95% transparente,
    // deixando o card praticamente vazado por cima do que tiver atrás dele.
    hoverBg: 'hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-1))_12%,white)] dark:hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-1))_20%,rgb(30_41_59))]',
    hoverIconBg: 'group-hover:bg-theme-tool-1',
    hoverText: 'hover:text-theme-tool-1',
  },
  {
    iconBg: 'bg-theme-tool-2/10',
    iconText: 'text-theme-tool-2',
    bar: 'bg-theme-tool-2',
    border: 'border-theme-tool-2/30',
    featuredBg: 'bg-theme-tool-2/5',
    hoverBorder: 'hover:border-theme-tool-2',
    hoverBg: 'hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-2))_12%,white)] dark:hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-2))_20%,rgb(30_41_59))]',
    hoverIconBg: 'group-hover:bg-theme-tool-2',
    hoverText: 'hover:text-theme-tool-2',
  },
  {
    iconBg: 'bg-theme-tool-3/10',
    iconText: 'text-theme-tool-3',
    bar: 'bg-theme-tool-3',
    border: 'border-theme-tool-3/30',
    featuredBg: 'bg-theme-tool-3/5',
    hoverBorder: 'hover:border-theme-tool-3',
    hoverBg: 'hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-3))_12%,white)] dark:hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-3))_20%,rgb(30_41_59))]',
    hoverIconBg: 'group-hover:bg-theme-tool-3',
    hoverText: 'hover:text-theme-tool-3',
  },
  {
    iconBg: 'bg-theme-tool-4/10',
    iconText: 'text-theme-tool-4',
    bar: 'bg-theme-tool-4',
    border: 'border-theme-tool-4/30',
    featuredBg: 'bg-theme-tool-4/5',
    hoverBorder: 'hover:border-theme-tool-4',
    hoverBg: 'hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-4))_12%,white)] dark:hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-4))_20%,rgb(30_41_59))]',
    hoverIconBg: 'group-hover:bg-theme-tool-4',
    hoverText: 'hover:text-theme-tool-4',
  },
  {
    iconBg: 'bg-theme-tool-5/10',
    iconText: 'text-theme-tool-5',
    bar: 'bg-theme-tool-5',
    border: 'border-theme-tool-5/30',
    featuredBg: 'bg-theme-tool-5/5',
    hoverBorder: 'hover:border-theme-tool-5',
    hoverBg: 'hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-5))_12%,white)] dark:hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-5))_20%,rgb(30_41_59))]',
    hoverIconBg: 'group-hover:bg-theme-tool-5',
    hoverText: 'hover:text-theme-tool-5',
  },
  {
    iconBg: 'bg-theme-tool-6/10',
    iconText: 'text-theme-tool-6',
    bar: 'bg-theme-tool-6',
    border: 'border-theme-tool-6/30',
    featuredBg: 'bg-theme-tool-6/5',
    hoverBorder: 'hover:border-theme-tool-6',
    hoverBg: 'hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-6))_12%,white)] dark:hover:bg-[color-mix(in_srgb,rgb(var(--theme-tool-6))_20%,rgb(30_41_59))]',
    hoverIconBg: 'group-hover:bg-theme-tool-6',
    hoverText: 'hover:text-theme-tool-6',
  },
]

// Cor fixa por aba (índice em THEME_TOOL_COLOR_VARIANTS) — quem não está
// aqui continua ciclando pela posição na lista de categorias.
const TAB_COLOR_OVERRIDES = {
  favoritos: 4, // amarelo dourado
  recursos: 1, // vermelho (categoria "Comunicação")
  gestao: 0, // azul marinho (categoria "Painéis de Gestão")
}

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

export default function ToolsExplorer({ searchQuery, onOpenTicket, onOpenPedidoCompras }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key)
  // A animação de entrada dos cards (fade-in-up com atraso por índice) deve rodar só
  // na primeira renderização da Home — sem isso, toda troca de aba remonta os cards
  // (chaves diferentes) e replay a animação inteira, o que em categorias com mais
  // itens (ex: Painéis de Gestão, 6 cards) aparece como uma "piscada" perceptível.
  const [hasInteracted, setHasInteracted] = useState(false)
  const navigate = useNavigate()
  const { isCampaignTheme, activeTheme } = useCampaignTheme()
  const { viewAsGroup } = useViewAs()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  // Posição (em px) do Chapéu Seletor acima da aba ativa — medida direto do
  // botão porque ele mora dentro de um contêiner com scroll horizontal
  // (overflow-x-auto). Por uma regra do CSS, "overflow-x: auto" força o
  // "overflow-y: visible" do mesmo elemento a virar "auto" também — ou seja,
  // ele continua recortando qualquer coisa que passe da altura da barra. Por
  // isso o chapéu é renderizado FORA desse contêiner, só usando a posição
  // medida do botão ativo pra saber onde ficar.
  const activeTabRef = useRef(null)
  const [hatX, setHatX] = useState(null)

  useLayoutEffect(() => {
    function measure() {
      if (activeTabRef.current) {
        setHatX(activeTabRef.current.offsetLeft + activeTabRef.current.offsetWidth / 2)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  })

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
        <div className="relative mb-6">
          {activeTheme?.sortingHatGif && hatX !== null && (
            <motion.img
              src={activeTheme.sortingHatGif}
              alt=""
              className="absolute -top-[30px] w-14 z-10 pointer-events-none select-none drop-shadow-md"
              style={{ transform: 'translateX(-50%)' }}
              initial={false}
              animate={{ left: hatX }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <div className="isolate flex items-center justify-center gap-1 bg-white dark:bg-slate-900 rounded-full p-3 shadow-sm border border-outline-variant/20 dark:border-slate-700/60 overflow-x-auto">
          {visibleCategories.map((category, categoryIndex) => {
            const isActive = category.key === activeCategory
            // Cada aba ativa usa uma cor diferente da paleta do tema (mesmo
            // conjunto de tokens "theme-tool-N" dos cards), em vez de todas
            // ficarem com a mesma cor de destaque.
            const colorIndex = TAB_COLOR_OVERRIDES[category.key] ?? categoryIndex
            const colorVariant = THEME_TOOL_COLOR_VARIANTS[colorIndex % THEME_TOOL_COLOR_VARIANTS.length]
            return (
              <button
                key={category.key}
                ref={isActive ? activeTabRef : undefined}
                onClick={() => {
                  setActiveCategory(category.key)
                  setHasInteracted(true)
                }}
                className={`relative cursor-pointer whitespace-nowrap text-sm font-semibold px-6 py-2 rounded-full transition-colors ${
                  isActive
                    ? isCampaignTheme
                      ? `${colorVariant.iconBg} ${colorVariant.iconText}`
                      : 'bg-slate-100 dark:bg-slate-800 text-primary dark:text-blue-400'
                    : isCampaignTheme
                    ? `text-slate-900/80 dark:text-white/80 ${colorVariant.hoverText}`
                    : 'text-slate-900/80 dark:text-white/80 hover:text-primary dark:hover:text-blue-400'
                }`}
              >
                {category.label}

                {isActive && (
                  <motion.div
                    layoutId="lamp-categories"
                    className={`absolute inset-0 w-full rounded-full -z-10 ${
                      isCampaignTheme ? colorVariant.featuredBg : 'bg-blue-500/5 dark:bg-blue-400/5'
                    }`}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <div
                      className={`absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full ${
                        isCampaignTheme ? colorVariant.bar : 'bg-blue-500 dark:bg-blue-400'
                      }`}
                    >
                      <div
                        className={`absolute w-12 h-6 rounded-full blur-md -top-1 -left-2 ${
                          isCampaignTheme ? colorVariant.iconBg : 'bg-blue-500/20 dark:bg-blue-400/20'
                        }`}
                      />
                      <div
                        className={`absolute w-8 h-6 rounded-full blur-md -top-0.5 ${
                          isCampaignTheme ? colorVariant.iconBg : 'bg-blue-500/20 dark:bg-blue-400/20'
                        }`}
                      />
                      <div
                        className={`absolute w-4 h-4 rounded-full blur-sm top-0 left-2 ${
                          isCampaignTheme ? colorVariant.iconBg : 'bg-blue-500/20 dark:bg-blue-400/20'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </button>
            )
          })}
          </div>
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
          // A arte do card em destaque dos rankings é a logo padrão (Arena Porto
          // Vale) por padrão — um tema de campanha pode declarar a própria logo
          // pra esse card (ver "rankingLogo" em campaignTheme.js).
          const themeFeaturedImage =
            isCampaignTheme && tool.id === 'ranking-campanha' ? activeTheme?.rankingLogo : null
          const effectiveTool =
            isFeatured === Boolean(tool.featured) && !themeFeaturedImage
              ? tool
              : {
                  ...tool,
                  featured: isFeatured,
                  ...(themeFeaturedImage
                    ? {
                        featuredImage: themeFeaturedImage,
                        featuredImageSize: 'w-40 h-40',
                        featuredImagePosition: activeTheme?.rankingLogoPosition,
                      }
                    : {}),
                }
          const isMutedRanking = tool.category === 'rankings' && !isFeatured
          // Num tema de campanha o objetivo é mostrar a paleta variada mesmo nos
          // rankings — só fora de tema (visual padrão azul) que os cards recuam
          // pro cinza neutro pra não competir com o destaque.
          const colorsOverride = isCampaignTheme
            ? THEME_TOOL_COLOR_VARIANTS[index % THEME_TOOL_COLOR_VARIANTS.length]
            : isMutedRanking
            ? tool.tier === 'strong'
              ? NEUTRAL_STRONG_VARIANT_SLATE
              : NEUTRAL_VARIANT_SLATE
            : null
          return (
            <Fragment key={tool.id}>
              {tool.sectionLabel && !isSearching && !isFavoritosTab && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex items-center gap-3 pt-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      isCampaignTheme ? 'text-theme-tool-1/80' : 'text-primary/80 dark:text-blue-400/80'
                    } ${activeTheme?.titleFont ? 'font-magic text-sm' : ''}`}
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
