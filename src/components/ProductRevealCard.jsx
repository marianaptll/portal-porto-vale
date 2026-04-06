import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

const cn = (...classes) => classes.filter(Boolean).join(' ')

const CARD_COLORS = {
  default: { bg: 'from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600', icon: 'text-slate-400 dark:text-slate-400' },
}

const formatBRL = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`

export function ProductRevealCard({ nome, leadcoins, preco, icon, categoria, image, onComprar, modo = 'campanha' }) {
  const isLoja = modo === 'loja'
  const colors = CARD_COLORS.default

  const containerVariants = {
    rest:  { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -8, transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } },
  }

  const imageVariants = {
    rest:  { scale: 1 },
    hover: { scale: 1.08, transition: { type: 'spring', stiffness: 300, damping: 30 } },
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
    hover: { scale: 1.04, y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } },
    tap:   { scale: 0.96 },
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className="relative rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 bg-white dark:bg-slate-800 overflow-hidden shadow-sm cursor-pointer"
    >
      {/* Área visual */}
      <div className={cn('h-40 sm:h-52 md:h-56 lg:h-64 flex items-center justify-center relative overflow-hidden', image ? 'bg-white dark:bg-slate-700' : `bg-gradient-to-br ${colors.bg}`)}>
        {image ? (
          <motion.img
            src={image}
            alt={nome}
            variants={imageVariants}
            className="h-full w-full object-cover"
          />
        ) : (
          <motion.span
            variants={imageVariants}
            className={cn('material-symbols-outlined text-6xl', colors.icon)}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </motion.span>
        )}
      </div>

      {/* Info fixa */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 mb-1">{nome}</p>
        {isLoja ? (
          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{formatBRL(preco)}</p>
        ) : (
          <p className="text-sm font-extrabold text-primary dark:text-blue-400">
            {leadcoins} {leadcoins === 1 ? 'Leadcoin' : 'Leadcoins'}
          </p>
        )}
      </div>

      {/* Botão fixo no mobile */}
      <div className="px-3 pb-3 sm:hidden">
        <button
          onClick={onComprar}
          className={`w-full h-9 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform ${isLoja ? 'bg-emerald-600' : 'bg-primary'}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isLoja ? 'Comprar' : 'Resgatar'}
        </button>
      </div>

      {/* Overlay de hover — apenas desktop */}
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md flex-col justify-end hidden sm:flex"
      >
        <div className="p-4 space-y-3">
          <motion.div variants={itemVariants}>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{nome}</p>
            {isLoja ? (
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatBRL(preco)}</p>
            ) : (
              <p className="text-base font-extrabold text-primary dark:text-blue-400 mt-0.5">
                {leadcoins} {leadcoins === 1 ? 'Leadcoin' : 'Leadcoins'}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {categoria}
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              onClick={onComprar}
              variants={btnMotion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={`w-full h-10 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors ${isLoja ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isLoja ? 'Comprar' : 'Resgatar'}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
