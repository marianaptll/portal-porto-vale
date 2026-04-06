import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

export default function FloatingCartBar({ totalItens, totalValor, modo, onOpen }) {
  const isLoja = modo === 'loja'
  const label = isLoja
    ? `R$ ${totalValor.toFixed(2).replace('.', ',')}`
    : `${totalValor} Leadcoin${totalValor !== 1 ? 's' : ''}`

  return (
    <AnimatePresence>
      {totalItens > 0 && (
        <>
          {/* Desktop: barra completa */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 items-center gap-4 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItens}
                </span>
              </div>
              <span className="text-sm font-semibold">
                {totalItens} {totalItens === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <div className="w-px h-5 bg-white/20" />
            <span className="text-sm font-bold text-amber-300">{label}</span>
            <button
              onClick={onOpen}
              className="ml-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold px-4 py-1.5 rounded-xl transition-colors"
            >
              Ver Carrinho
            </button>
          </motion.div>

          {/* Mobile: botão flutuante */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={onOpen}
            className="sm:hidden fixed bottom-24 right-5 z-50 bg-primary text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {totalItens}
            </span>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
