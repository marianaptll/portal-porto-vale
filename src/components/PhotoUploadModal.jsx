import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PREVIEW_SIZE = 220
const OUTPUT_SIZE = 440

function getCroppedImage(image, offset, zoom, baseScale) {
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const ctx = canvas.getContext('2d')

  const scaleRatio = OUTPUT_SIZE / PREVIEW_SIZE
  const totalScale = baseScale * zoom * scaleRatio
  const drawWidth = image.naturalWidth * totalScale
  const drawHeight = image.naturalHeight * totalScale
  const centerX = OUTPUT_SIZE / 2 + offset.x * scaleRatio
  const centerY = OUTPUT_SIZE / 2 + offset.y * scaleRatio

  ctx.drawImage(image, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight)
  return canvas.toDataURL('image/png')
}

export default function PhotoUploadModal({ isOpen, onClose, onConfirm }) {
  const [imageSrc, setImageSrc] = useState(null)
  const [imageEl, setImageEl] = useState(null)
  const [baseScale, setBaseScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef(null)
  const dragState = useRef(null)

  if (!isOpen) return null

  const reset = () => {
    setImageSrc(null)
    setImageEl(null)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.max(PREVIEW_SIZE / img.naturalWidth, PREVIEW_SIZE / img.naturalHeight)
      setBaseScale(scale)
      setZoom(1)
      setOffset({ x: 0, y: 0 })
      setImageEl(img)
      setImageSrc(url)
    }
    img.src = url
  }

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragState.current = { startX: event.clientX, startY: event.clientY, origOffset: offset }
  }

  const handlePointerMove = (event) => {
    if (!dragState.current) return
    const dx = event.clientX - dragState.current.startX
    const dy = event.clientY - dragState.current.startY
    setOffset({ x: dragState.current.origOffset.x + dx, y: dragState.current.origOffset.y + dy })
  }

  const handlePointerUp = () => {
    dragState.current = null
  }

  const handleConfirm = () => {
    if (!imageEl) return
    const dataUrl = getCroppedImage(imageEl, offset, zoom, baseScale)
    onConfirm(dataUrl)
    reset()
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={handleClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-outline-variant/10 dark:border-slate-700 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Alterar Foto</h2>
          <button
            className="p-2 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full transition-colors"
            onClick={handleClose}
          >
            <span className="material-symbols-outlined dark:text-slate-300">close</span>
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          {!imageSrc ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-56 border-2 border-dashed border-outline-variant/40 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center gap-2 bg-surface-container-lowest dark:bg-slate-700/50 hover:bg-surface-container/50 dark:hover:bg-slate-700 transition-all"
            >
              <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500">
                add_a_photo
              </span>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Clique para enviar uma foto</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">JPG ou PNG</p>
            </button>
          ) : (
            <>
              <div
                className="relative rounded-full overflow-hidden cursor-grab active:cursor-grabbing bg-slate-100 dark:bg-slate-900 touch-none select-none"
                style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                <img
                  src={imageSrc}
                  alt="Pré-visualização"
                  draggable={false}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    maxWidth: 'none',
                    width: imageEl?.naturalWidth,
                    height: imageEl?.naturalHeight,
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${baseScale * zoom})`,
                    transformOrigin: 'center',
                  }}
                />
              </div>

              <div className="w-full flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">
                  photo_size_select_small
                </span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-2xl">
                  photo_size_select_large
                </span>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-bold text-primary dark:text-blue-400 hover:underline"
              >
                Escolher outra foto
              </button>
            </>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        <div className="p-5 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 flex justify-end gap-3 shrink-0">
          <button
            className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            disabled={!imageSrc}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleConfirm}
          >
            Salvar foto
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
