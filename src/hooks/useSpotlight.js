import { useEffect } from 'react'

// Global listener — sets --x, --y per [data-glow] element, toggles data-glow-active
let globalListenerActive = false

function ensureGlobalListener() {
  if (globalListenerActive) return
  globalListenerActive = true

  document.addEventListener('pointermove', (e) => {
    document.querySelectorAll('[data-glow]').forEach(el => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--x', x.toFixed(2))
      el.style.setProperty('--y', y.toFixed(2))
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      if (inside) {
        el.setAttribute('data-glow-active', '')
      } else {
        el.removeAttribute('data-glow-active')
      }
    })
  })

  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('[data-glow]').forEach(el => {
      el.removeAttribute('data-glow-active')
    })
  })
}

export function useSpotlight() {
  useEffect(() => {
    ensureGlobalListener()
  }, [])
}
