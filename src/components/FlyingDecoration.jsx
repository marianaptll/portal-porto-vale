import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useCampaignTheme } from '../context/CampaignThemeContext'

const SIZE = 110
const MARGIN = 40

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
  // Guarda a posição atual pra calcular a distância do próximo voo mesmo
  // quando o alvo muda por fora do ciclo normal (ex: um desvio do mouse) —
  // por isso é um ref, não o estado "target" direto (que só atualiza no
  // próximo render).
  const posRef = useRef(target)
  const timeoutRef = useRef(null)

  useEffect(() => {
    posRef.current = target
  }, [target])

  function fly() {
    const next = randomPoint()
    const distance = Math.hypot(next.x - posRef.current.x, next.y - posRef.current.y)
    const moveDuration = Math.max(4, distance / 70)
    setDuration(moveDuration)
    setTarget(next)
    timeoutRef.current = setTimeout(schedulePause, moveDuration * 1000)
  }

  function schedulePause() {
    // fica parado por um tempo antes de voar de novo
    timeoutRef.current = setTimeout(fly, 2500 + Math.random() * 3500)
  }

  useEffect(() => {
    if (!image) return
    schedulePause()
    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  if (!isCampaignTheme || !image) return null

  // "Impossível pegar o pomo": se o mouse chegar perto, ele dispara rápido pra
  // outro ponto aleatório da tela, interrompendo o passeio lento normal.
  // Cancela o timer pendente antes de reagendar — senão o ciclo anterior
  // (pensado pra uma distância/duração diferentes) reaparece por cima do
  // desvio e faz o pomo derivar ou travar depois de "fugir".
  const handleDodge = () => {
    clearTimeout(timeoutRef.current)
    setDuration(0.35)
    setTarget(randomPoint())
    timeoutRef.current = setTimeout(schedulePause, 350)
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
