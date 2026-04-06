import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'

const CORES_HEX = {
  'Branco':       '#FFFFFF',
  'Preto':        '#1a1a1a',
  'Azul Marinho': '#1e3a5f',
  'Cinza':        '#9ca3af',
  'Rosa':         '#f9a8d4',
  'Prata':        '#cbd5e1',
  'Azul':         '#3b82f6',
  'Verde':        '#22c55e',
  'Vermelho':     '#ef4444',
}

export default function VariantesModal({ produto, onClose, onConfirmar }) {
  const [tamanho, setTamanho] = useState(null)
  const [cor, setCor] = useState(null)

  if (!produto) return null

  const temTamanhos = produto.variantes?.tamanhos?.length > 0
  const temCores    = produto.variantes?.cores?.length > 0
  const podeContinuar = (!temTamanhos || tamanho) && (!temCores || cor)

  const handleConfirmar = () => {
    if (!podeContinuar) return
    onConfirmar({ ...produto, varianteSelecionada: { tamanho, cor } })
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="relative z-10 bg-white dark:bg-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              {produto.image && (
                <img src={produto.image} alt={produto.nome} className="w-12 h-12 object-cover rounded-xl bg-slate-100 dark:bg-slate-700" />
              )}
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{produto.nome}</p>
                <p className="text-xs font-semibold text-primary dark:text-blue-400 mt-0.5">
                  {produto.preco != null
                    ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}`
                    : `${produto.leadcoins} Leadcoins`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-6">
            {/* Tamanhos */}
            {temTamanhos && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Tamanho {tamanho && <span className="text-primary normal-case tracking-normal">— {tamanho}</span>}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {produto.variantes.tamanhos.map(t => (
                    <button
                      key={t}
                      onClick={() => setTamanho(t)}
                      className={`min-w-[44px] h-10 px-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        tamanho === t
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary/50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cores */}
            {temCores && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Cor {cor && <span className="text-primary normal-case tracking-normal">— {cor}</span>}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {produto.variantes.cores.map(c => (
                    <button
                      key={c}
                      onClick={() => setCor(c)}
                      title={c}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        cor === c
                          ? 'border-primary scale-110 shadow-md'
                          : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: CORES_HEX[c] ?? '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-6 pt-2">
            <button
              onClick={handleConfirmar}
              disabled={!podeContinuar}
              className={`w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                podeContinuar
                  ? 'bg-primary hover:bg-primary/90 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Adicionar ao Carrinho
            </button>
            {!podeContinuar && (
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
                {!tamanho && temTamanhos ? 'Selecione um tamanho' : 'Selecione uma cor'}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
