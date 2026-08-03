import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCampaignTheme } from '../context/CampaignThemeContext'

const SIZE = 110
const MARGIN = 40

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomPoint() {
  const maxX = Math.max(window.innerWidth - SIZE - MARGIN, MARGIN)
  const maxY = Math.max(window.innerHeight - SIZE - MARGIN, MARGIN)
  return {
    x: MARGIN + Math.random() * (maxX - MARGIN),
    y: MARGIN + Math.random() * (maxY - MARGIN),
  }
}

// Item decorativo que voa sozinho pela tela (posição fixa, por cima do
// conteúdo) — pausa num ponto aleatório por alguns segundos, depois voa devagar
// até outro ponto aleatório, num loop sem fim. Só existe pra um tema que
// declarar "flyingDecoration" (ver campaignTheme.js).
export default function FlyingDecoration() {
  const { isCampaignTheme, activeTheme } = useCampaignTheme()
  const image = activeTheme?.flyingDecoration
  const [target, setTarget] = useState(() => randomPoint())
  const [duration, setDuration] = useState(4)

  useEffect(() => {
    if (!image) return
    let stopped = false

    async function loop() {
      let current = target
      while (!stopped) {
        // fica parado por um tempo antes de voar de novo
        await wait(2500 + Math.random() * 3500)
        if (stopped) return
        const next = randomPoint()
        const distance = Math.hypot(next.x - current.x, next.y - current.y)
        const moveDuration = Math.max(4, distance / 70)
        setDuration(moveDuration)
        setTarget(next)
        current = next
        await wait(moveDuration * 1000)
      }
    }

    loop()
    return () => {
      stopped = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  if (!isCampaignTheme || !image) return null

  // "Impossível pegar o pomo": se o mouse chegar perto, ele dispara rápido pra
  // outro ponto aleatório da tela, interrompendo o passeio lento normal.
  const handleDodge = () => {
    setTarget(randomPoint())
    setDuration(0.35)
  }

  return (
    <motion.img
      src={image}
      alt=""
      onMouseEnter={handleDodge}
      className="fixed top-0 left-0 pointer-events-auto select-none z-[100] drop-shadow-lg cursor-default"
      style={{ width: SIZE, height: 'auto' }}
      animate={{ x: target.x, y: target.y }}
      transition={{ duration, ease: duration < 1 ? 'easeOut' : 'easeInOut' }}
    />
  )
}
