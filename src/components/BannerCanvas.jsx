import { useRef } from 'react'

// Larguras reais no banner (WelcomeBanner.jsx) em % da largura do banner
// (1232px no desktop), pra manter a mesma proporção aqui no canvas em miniatura.
// "scale" multiplica esse tamanho base — é o que os sliders de tamanho controlam.
export const MASCOT_WIDTH_PERCENT = 16.9 // w-52 = 208px
export const DECORATION_WIDTH_PERCENT = 10.4 // w-32 = 128px

function safeScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1
}

function CanvasItem({ image, position, scale, widthPercent, interactive, onChange }) {
  const itemRef = useRef(null)
  const draggingRef = useRef(false)

  const updateFromEvent = (e) => {
    const container = itemRef.current?.parentElement
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100))
    onChange({ x, y })
  }

  const pointerHandlers = interactive
    ? {
        onPointerDown: (e) => {
          e.preventDefault()
          draggingRef.current = true
          itemRef.current?.setPointerCapture(e.pointerId)
          updateFromEvent(e)
        },
        onPointerMove: (e) => {
          if (draggingRef.current) updateFromEvent(e)
        },
        onPointerUp: (e) => {
          draggingRef.current = false
          itemRef.current?.releasePointerCapture(e.pointerId)
        },
      }
    : {}

  return (
    <img
      ref={itemRef}
      src={image}
      alt=""
      draggable={false}
      {...pointerHandlers}
      className={`absolute drop-shadow-lg select-none touch-none z-10 ${
        interactive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${widthPercent}%`,
        transform: `translate(-50%, -50%) scale(${safeScale(scale)})`,
      }}
    />
  )
}

export default function BannerCanvas({
  accent,
  bannerImage,
  bannerFocalPoint = { x: 50, y: 50 },
  bannerZoom = 1,
  mascotImage,
  mascotPosition,
  mascotScale,
  onMascotPositionChange,
  decorations = [],
  onDecorationPositionChange,
  interactive = false,
}) {
  return (
    <div className="relative w-full aspect-[1232/292] rounded-2xl" style={{ backgroundColor: accent }}>
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {bannerImage && (
          <img
            src={bannerImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover select-none"
            style={{
              objectPosition: `${bannerFocalPoint.x}% ${bannerFocalPoint.y}%`,
              transform: `scale(${safeScale(bannerZoom)})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6 space-y-1.5">
          <div className="h-3 w-16 sm:w-20 rounded-full bg-white/20" />
          <div className="h-4 sm:h-5 w-28 sm:w-32 rounded bg-white/40" />
          <div className="h-2.5 w-32 sm:w-40 rounded bg-white/15" />
        </div>
      </div>

      {decorations.map((deco) => (
        <CanvasItem
          key={deco.id}
          image={deco.image}
          position={deco.position}
          scale={deco.scale}
          widthPercent={DECORATION_WIDTH_PERCENT}
          interactive={interactive}
          onChange={(position) => onDecorationPositionChange(deco.id, position)}
        />
      ))}
      {mascotImage && (
        <CanvasItem
          image={mascotImage}
          position={mascotPosition}
          scale={mascotScale}
          widthPercent={MASCOT_WIDTH_PERCENT}
          interactive={interactive}
          onChange={onMascotPositionChange}
        />
      )}
    </div>
  )
}
