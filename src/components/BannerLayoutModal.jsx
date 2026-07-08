import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BannerCanvas from './BannerCanvas'

const ALIGN_COLS = [12, 50, 88]
const ALIGN_ROWS = [15, 50, 85]

function safeValue(value) {
  return Number.isFinite(value) && value > 0 ? value : 1
}

function SizeSlider({ label = 'Tamanho', min = 0.4, value, onChange }) {
  const value_ = safeValue(value)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0 w-16">{label}</span>
      <input
        type="range"
        min={min}
        max="2"
        step="0.05"
        value={value_}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />
      <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-right shrink-0">
        {Math.round(value_ * 100)}%
      </span>
    </div>
  )
}

function AlignGrid({ onAlign }) {
  return (
    <div className="grid grid-cols-3 gap-1 w-24">
      {ALIGN_ROWS.map((y) =>
        ALIGN_COLS.map((x) => (
          <button
            key={`${x}-${y}`}
            type="button"
            onClick={() => onAlign({ x, y })}
            className="aspect-square rounded-md bg-surface-container-low dark:bg-slate-700 hover:bg-primary/15 dark:hover:bg-slate-600 transition-colors flex items-center justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-400" />
          </button>
        ))
      )}
    </div>
  )
}

// Uma linha "de camada" (como no painel de camadas do Photoshop): título +
// miniatura, com alça de arrastar (reordena o empilhamento) e um dropdown que
// abre os controles (tamanho + alinhamento) só daquele item por vez.
//
// "draggable" só vai no ícone de alça, nunca no card inteiro — se o card
// inteiro (ou a área expandida) ficar marcado como arrastável, o navegador
// tenta iniciar um drag nativo quando o admin mexe no slider de tamanho (que
// fica dentro dessa mesma área), quebrando a interação com uma prévia de
// "arrastar imagem" fantasma em vez de mover o controle.
function LayerRow({ title, image, draggable, isOpen, onToggle, onDragStart, onDragOver, onDrop, children }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`border rounded-xl overflow-hidden transition-colors ${
        isOpen
          ? 'border-primary/40 dark:border-blue-400/40'
          : 'border-outline-variant/20 dark:border-slate-700'
      }`}
    >
      <div className="w-full flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800">
        {draggable ? (
          <span
            draggable
            onDragStart={onDragStart}
            className="material-symbols-outlined text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing"
          >
            drag_indicator
          </span>
        ) : (
          <span className="material-symbols-outlined text-slate-200 dark:text-slate-700">lock</span>
        )}
        <button type="button" onClick={onToggle} className="flex-1 flex items-center gap-2 text-left min-w-0">
          <img src={image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
          <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{title}</span>
          <span className="material-symbols-outlined text-slate-400 shrink-0">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="overflow-hidden bg-surface-container-low dark:bg-slate-900/40"
          >
            <div className="p-3 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BannerLayoutModal({
  isOpen,
  onClose,
  accent,
  bannerImage,
  bannerFocalPoint,
  onBannerFocalPointChange,
  bannerZoom,
  onBannerZoomChange,
  layers = [],
  onLayerPositionChange,
  onLayerScaleChange,
  onReorderLayers,
}) {
  const [activeLayerId, setActiveLayerId] = useState(null)
  const dragIndexRef = useRef(null)

  if (!isOpen) return null

  const toggleLayer = (id) => setActiveLayerId((prev) => (prev === id ? null : id))

  const handleDrop = (targetIndex) => {
    const fromIndex = dragIndexRef.current
    dragIndexRef.current = null
    if (fromIndex === null || fromIndex === targetIndex) return
    const reordered = [...layers]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(targetIndex, 0, moved)
    onReorderLayers(reordered.map((layer) => layer.id))
  }

  let decorationCount = 0

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col modal-max-height">
        <div className="p-5 sm:p-6 border-b border-outline-variant/10 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Posicionar elementos do banner</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arraste as camadas pra mudar o empilhamento, ou abra uma pra ajustar posição e tamanho.
            </p>
          </div>
          <button
            className="p-2 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined dark:text-slate-300">close</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          <BannerCanvas
            accent={accent}
            bannerImage={bannerImage}
            bannerFocalPoint={bannerFocalPoint}
            bannerZoom={bannerZoom}
            layers={layers}
            onLayerPositionChange={onLayerPositionChange}
            interactive
          />

          <div className="space-y-2">
            {layers.map((layer, index) => {
              const title = layer.kind === 'mascot' ? 'Mascote' : layer.name || `Item decorativo ${++decorationCount}`
              return (
                <LayerRow
                  key={layer.id}
                  title={title}
                  image={layer.image}
                  draggable
                  isOpen={activeLayerId === layer.id}
                  onToggle={() => toggleLayer(layer.id)}
                  onDragStart={() => {
                    dragIndexRef.current = index
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  <SizeSlider value={layer.scale} onChange={(scale) => onLayerScaleChange(layer.id, scale)} />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Alinhamento rápido
                    </p>
                    <AlignGrid onAlign={(position) => onLayerPositionChange(layer.id, position)} />
                  </div>
                </LayerRow>
              )
            })}

            {bannerImage && (
              <LayerRow
                title="Fundo do banner"
                image={bannerImage}
                draggable={false}
                isOpen={activeLayerId === 'background'}
                onToggle={() => toggleLayer('background')}
              >
                <SizeSlider label="Zoom" min={1} value={bannerZoom} onChange={onBannerZoomChange} />
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Foco da imagem</p>
                  <AlignGrid onAlign={onBannerFocalPointChange} />
                </div>
              </LayerRow>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
