import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const ripplesRef = useRef([])
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height

    // --- grain buffer (offscreen, regenerated on resize) ---
    const grainCanvas = document.createElement('canvas')
    const grainCtx = grainCanvas.getContext('2d')

    function buildGrain() {
      grainCanvas.width = width
      grainCanvas.height = height
      const imageData = grainCtx.createImageData(width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v + 20 // tiny blue tint
        data[i + 3] = Math.random() * 18 + 4 // very faint
      }
      grainCtx.putImageData(imageData, 0, 0)
    }

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      buildGrain()
    }

    // --- dot grid ---
    const DOT_SPACING = 28
    const DOT_RADIUS = 0.9
    const DOT_COLOR_BASE = 'rgba(80, 100, 180, 0.18)'

    function drawDots() {
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const INFLUENCE = 140

      const cols = Math.ceil(width / DOT_SPACING)
      const rows = Math.ceil(height / DOT_SPACING)

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * DOT_SPACING
          const y = r * DOT_SPACING
          const dx = x - mx
          const dy = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)

          let radius = DOT_RADIUS
          let alpha = 0.18

          if (dist < INFLUENCE) {
            const t = 1 - dist / INFLUENCE
            radius = DOT_RADIUS + t * 2.2
            alpha = 0.18 + t * 0.55
          }

          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(100, 130, 255, ${alpha})`
          ctx.fill()
        }
      }
    }

    // --- ripples ---
    function addRipple(x, y) {
      ripplesRef.current.push({ x, y, r: 0, alpha: 0.55, born: Date.now() })
    }

    function drawRipples() {
      ripplesRef.current = ripplesRef.current.filter(rip => rip.alpha > 0.01)
      for (const rip of ripplesRef.current) {
        rip.r += 2.2
        rip.alpha *= 0.955

        ctx.beginPath()
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(120, 160, 255, ${rip.alpha})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // inner ring
        if (rip.r > 18) {
          ctx.beginPath()
          ctx.arc(rip.x, rip.y, rip.r - 14, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(160, 200, 255, ${rip.alpha * 0.4})`
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
      }
    }

    // --- aurora glow that follows mouse lazily ---
    const auroraRef = { x: width / 2, y: height / 2 }

    function drawAurora() {
      // lazy follow
      auroraRef.x += (mouseRef.current.x - auroraRef.x) * 0.04
      auroraRef.y += (mouseRef.current.y - auroraRef.y) * 0.04

      const grad = ctx.createRadialGradient(
        auroraRef.x, auroraRef.y, 0,
        auroraRef.x, auroraRef.y, 320
      )
      grad.addColorStop(0, 'rgba(40, 60, 180, 0.09)')
      grad.addColorStop(0.5, 'rgba(20, 30, 100, 0.05)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)
    }

    // --- main loop ---
    function draw() {
      ctx.clearRect(0, 0, width, height)

      // base bg
      ctx.fillStyle = '#07080f'
      ctx.fillRect(0, 0, width, height)

      drawAurora()
      drawDots()
      drawRipples()

      // grain overlay
      ctx.drawImage(grainCanvas, 0, 0)

      frameRef.current = requestAnimationFrame(draw)
    }

    // --- events ---
    let lastRipple = 0
    function onMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      const now = Date.now()
      if (now - lastRipple > 120) {
        addRipple(e.clientX, e.clientY)
        lastRipple = now
      }
    }

    function onClick(e) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => addRipple(e.clientX, e.clientY), i * 80)
      }
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}
