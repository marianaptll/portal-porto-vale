import { createPortal } from 'react-dom'
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
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">{label}</span>
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

function ItemPanel({ title, sizeLabel, sizeMin, scale, onScaleChange, alignLabel = 'Alinhamento rápido', onAlign }) {
  return (
    <div className="border border-outline-variant/20 dark:border-slate-700 rounded-2xl p-4 space-y-3">
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</p>
      <SizeSlider label={sizeLabel} min={sizeMin} value={scale} onChange={onScaleChange} />
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{alignLabel}</p>
        <AlignGrid onAlign={onAlign} />
      </div>
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
  mascotImage,
  mascotPosition,
  onMascotPositionChange,
  mascotScale,
  onMascotScaleChange,
  decorations = [],
  onDecorationPositionChange,
  onDecorationScaleChange,
}) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col modal-max-height">
        <div className="p-5 sm:p-6 border-b border-outline-variant/10 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Posicionar elementos do banner</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arraste o mascote e os itens decorativos, e ajuste o zoom e o foco do fundo do banner.
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
            mascotImage={mascotImage}
            mascotPosition={mascotPosition}
            mascotScale={mascotScale}
            onMascotPositionChange={onMascotPositionChange}
            decorations={decorations}
            onDecorationPositionChange={onDecorationPositionChange}
            interactive
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bannerImage && (
              <ItemPanel
                title="Fundo do banner"
                sizeLabel="Zoom"
                sizeMin={1}
                scale={bannerZoom}
                onScaleChange={onBannerZoomChange}
                alignLabel="Foco da imagem"
                onAlign={onBannerFocalPointChange}
              />
            )}
            {mascotImage && (
              <ItemPanel
                title="Mascote"
                scale={mascotScale}
                onScaleChange={onMascotScaleChange}
                onAlign={onMascotPositionChange}
              />
            )}
            {decorations.map((deco, index) => (
              <ItemPanel
                key={deco.id}
                title={`Item decorativo ${index + 1}`}
                scale={deco.scale}
                onScaleChange={(scale) => onDecorationScaleChange(deco.id, scale)}
                onAlign={(position) => onDecorationPositionChange(deco.id, position)}
              />
            ))}
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
