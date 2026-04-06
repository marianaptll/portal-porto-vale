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

  const iconVariants = {
    rest:  { scale: 1 },
    hover: { scale: 1.08, transition: { type: 'spring', stiffness: 300, damping: 30 } },
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
            variants={iconVariants}
            className="h-full w-full object-cover"
          />
        ) : (
          <motion.span
            variants={iconVariants}
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

      {/* Botão sempre visível */}
      <div className="px-3 pb-3">
        <button
          onClick={onComprar}
          className={`w-full h-9 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform ${isLoja ? 'bg-emerald-600' : 'bg-primary'}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isLoja ? 'Comprar' : 'Resgatar'}
        </button>
      </div>

    </motion.div>
  )
}
