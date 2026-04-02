import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import { useState } from 'react'

const cn = (...classes) => classes.filter(Boolean).join(' ')

const CARD_COLORS = {
  'Variados':                  { bg: 'from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600', icon: 'text-slate-500 dark:text-slate-300' },
  'Bebidas':                   { bg: 'from-red-50 to-rose-100 dark:from-red-900/40 dark:to-rose-900/30', icon: 'text-red-500 dark:text-red-400' },
  'Experiência Gastronômica':  { bg: 'from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/30', icon: 'text-amber-600 dark:text-amber-400' },
  'Eletrodomésticos':          { bg: 'from-blue-50 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/30', icon: 'text-blue-500 dark:text-blue-400' },
  'Eletroeletrônicos':         { bg: 'from-violet-50 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30', icon: 'text-violet-500 dark:text-violet-400' },
  'Porto Vale':                { bg: 'from-sky-50 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/30', icon: 'text-primary dark:text-blue-400' },
}

export function ProductRevealCard({ nome, leadcoins, icon, categoria, onComprar }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = !shouldReduceMotion

  const colors = CARD_COLORS[categoria] ?? CARD_COLORS['Variados']

  const containerVariants = {
    rest:  { scale: 1, y: 0 },
    hover: shouldAnimate ? {
      scale: 1.03,
      y: -8,
      transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
    } : {},
  }

  const iconVariants = {
    rest:  { scale: 1 },
    hover: { scale: 1.12, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  }

  const overlayVariants = {
    rest:  { y: '100%', opacity: 0, filter: 'blur(4px)' },
    hover: {
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    rest:  { opacity: 0, y: 16, scale: 0.95 },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.5 },
    },
  }

  const btnMotion = {
    rest:  { scale: 1, y: 0 },
    hover: shouldAnimate ? {
      scale: 1.04,
      y: -2,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    } : {},
    tap: shouldAnimate ? { scale: 0.96 } : {},
  }

  const heartVariants = {
    idle:     { scale: 1, rotate: 0 },
    favorite: {
      scale: [1, 1.35, 1],
      rotate: [0, 12, -12, 0],
      transition: { duration: 0.45, ease: 'easeInOut' },
    },
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className="relative rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 bg-white dark:bg-slate-800 overflow-hidden shadow-sm cursor-pointer"
    >
      {/* Ícone / área visual */}
      <div className={cn('h-36 bg-gradient-to-br flex items-center justify-center relative', colors.bg)}>
        <motion.span
          variants={iconVariants}
          className={cn('material-symbols-outlined text-6xl', colors.icon)}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </motion.span>

        {/* Botão favorito */}
        <motion.button
          onClick={e => { e.stopPropagation(); setIsFavorite(f => !f) }}
          variants={heartVariants}
          animate={isFavorite ? 'favorite' : 'idle'}
          className={cn(
            'absolute top-3 right-3 p-1.5 rounded-full border backdrop-blur-sm transition-colors',
            isFavorite
              ? 'bg-red-500 border-red-500 text-white'
              : 'bg-white/60 dark:bg-slate-700/60 border-white/30 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-current')} />
        </motion.button>
      </div>

      {/* Info fixa */}
      <div className="px-3 py-3">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 mb-1">{nome}</p>
        <p className="text-sm font-extrabold text-primary dark:text-blue-400">
          {leadcoins} {leadcoins === 1 ? 'Leadcoin' : 'Leadcoins'}
        </p>
      </div>

      {/* Overlay de hover */}
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-white/96 dark:bg-slate-800/97 backdrop-blur-xl flex flex-col justify-end"
      >
        <div className="p-4 space-y-3">
          {/* Nome + preço no overlay */}
          <motion.div variants={itemVariants}>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{nome}</p>
            <p className="text-base font-extrabold text-primary dark:text-blue-400 mt-0.5">
              {leadcoins} {leadcoins === 1 ? 'Leadcoin' : 'Leadcoins'}
            </p>
          </motion.div>

          {/* Categoria badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-1 bg-surface-container-low dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {categoria}
            </span>
          </motion.div>

          {/* Botão comprar */}
          <motion.div variants={itemVariants} className="space-y-2">
            <motion.button
              onClick={onComprar}
              variants={btnMotion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="w-full h-10 bg-primary hover:opacity-90 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-opacity"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar
            </motion.button>

            <motion.button
              onClick={e => { e.stopPropagation(); setIsFavorite(f => !f) }}
              variants={btnMotion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={cn(
                'w-full h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors',
                isFavorite
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                  : 'border-outline-variant/30 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-current text-red-500')} />
              {isFavorite ? 'Salvo' : 'Salvar'}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
