import { useEffect, useRef } from 'react'
import { useDarkMode } from '../context/DarkModeContext'

export default function ThemeToggle() {
  const { isDark, toggleDark } = useDarkMode()
  const clipRef = useRef(null)
  const circleRef = useRef(null)
  const raysRef = useRef(null)

  useEffect(() => {
    if (!clipRef.current || !circleRef.current || !raysRef.current) return

    const duration = 350
    const startTime = performance.now()

    // target values
    const targetClipY = isDark ? 10 : 0
    const targetClipX = isDark ? -12 : 0
    const targetR = isDark ? 10 : 8
    const targetRaysOpacity = isDark ? 0 : 1
    const targetRaysScale = isDark ? 0.5 : 1

    // initial values (read current)
    const startClipY = parseFloat(clipRef.current.getAttribute('data-y') || '0')
    const startClipX = parseFloat(clipRef.current.getAttribute('data-x') || '0')
    const startR = parseFloat(circleRef.current.getAttribute('r') || '8')
    const startOpacity = parseFloat(raysRef.current.style.opacity || '1')
    const startScale = parseFloat(raysRef.current.getAttribute('data-scale') || '1')

    let raf
    function animate(now) {
      const t = Math.min((now - startTime) / duration, 1)
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // ease in-out

      const cy = startClipY + (targetClipY - startClipY) * e
      const cx = startClipX + (targetClipX - startClipX) * e
      const r = startR + (targetR - startR) * e
      const op = startOpacity + (targetRaysOpacity - startOpacity) * e
      const sc = startScale + (targetRaysScale - startScale) * e

      // update clip path translate
      const path = clipRef.current?.querySelector('path')
      if (path) {
        path.setAttribute('transform', `translate(${cx}, ${cy})`)
      }
      circleRef.current?.setAttribute('r', r)
      if (raysRef.current) {
        raysRef.current.style.opacity = op
        raysRef.current.style.transform = `scale(${sc})`
        raysRef.current.style.transformOrigin = '16px 16px'
        raysRef.current.setAttribute('data-scale', sc)
      }

      // save state
      if (clipRef.current) {
        clipRef.current.setAttribute('data-y', cy)
        clipRef.current.setAttribute('data-x', cx)
      }

      if (t < 1) raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [isDark])

  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label="Alternar tema"
      className="h-10 w-10 rounded-full transition-colors duration-300 active:scale-95 shadow-sm flex-shrink-0"
      style={{
        background: isDark
          ? '#ffffff'
          : 'linear-gradient(135deg, #f97316 0%, #facc15 60%, #fb923c 100%)',
        color: isDark ? '#1e3a5f' : '#fff',
        boxShadow: isDark ? undefined : '0 2px 12px rgba(251,146,60,0.5)',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
        style={{ width: '100%', height: '100%', padding: '7px' }}
      >
        <defs>
          <clipPath id="theme-clip" ref={clipRef}>
            <path d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#theme-clip)">
          <circle ref={circleRef} cx="16" cy="16" r="8" />
          <g
            ref={raysRef}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </g>
        </g>
      </svg>
    </button>
  )
}
