import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCampaignTheme } from '../context/CampaignThemeContext'

const STEP_SPACING = 58
const SIDE_OFFSET = 13
const STEP_DELAY = 1
const FADE_DURATION = 2.4
const FOOT_SIZE = 22
const SPAWN_INTERVAL_MIN = 4000
const SPAWN_INTERVAL_MAX = 7000
const BANNER_WIDTH = 200
const BANNER_OPACITY = 0.85
const BANNER_Y_OFFSET = 80

// Cada trilha "pertence" a uma pessoa por vez — a faixa com o nome dela some
// junto com os próprios passos, bem apagada, só pra sugerir de quem é aquele
// rastro sem chamar atenção.
const NAME_BANNERS = [
  '/illustrations/faixa_simone.png',
  '/illustrations/faixa_poliana.png',
  '/illustrations/faixa_fernando.png',
]

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Desenho simples de pegada (duas elipses: sola/calcanhar e bola do pé) —
// pequena o suficiente pra ler como uma marca de tinta, não um ícone literal.
function FootprintIcon() {
  return (
    <svg viewBox="0 0 100 200" style={{ width: FOOT_SIZE, height: FOOT_SIZE * 2 }} className="opacity-85">
      <g fill="#8fb5dc">
        <ellipse cx="50" cy="132" rx="34" ry="54" />
        <ellipse cx="50" cy="42" rx="27" ry="34" />
      </g>
    </svg>
  )
}

// Gera uma trilha de pegadas em linha reta com direção e ponto de partida
// aleatórios, alternando o pé (esquerdo/direito) pra cada lado da linha —
// como se alguém estivesse atravessando a tela.
function buildTrail() {
  const margin = 50
  const width = window.innerWidth
  const height = window.innerHeight
  const startX = margin + Math.random() * Math.max(width - margin * 2, 100)
  const startY = margin + Math.random() * Math.max(height - margin * 2, 100)
  const angle = Math.random() * Math.PI * 2
  const dirX = Math.cos(angle)
  const dirY = Math.sin(angle)
  const perpX = -dirY
  const perpY = dirX
  const stepCount = 7 + Math.floor(Math.random() * 3)
  const rotationDeg = (Math.atan2(dirY, dirX) * 180) / Math.PI - 90

  return Array.from({ length: stepCount }, (_, i) => {
    const side = i % 2 === 0 ? 1 : -1
    const x = startX + dirX * STEP_SPACING * i + perpX * SIDE_OFFSET * side
    const y = startY + dirY * STEP_SPACING * i + perpY * SIDE_OFFSET * side
    return {
      x: Math.min(Math.max(x, 10), width - 10),
      y: Math.min(Math.max(y, 10), height - 10),
      mirrored: side === -1,
    }
  }).map((step) => ({ ...step, rotation: rotationDeg }))
}

// Várias trilhas de pegadas de tinta atravessando trechos aleatórios da tela
// ao mesmo tempo, cada uma some sozinha depois de "andar" — igual ao rastro de
// passos do Mapa do Maroto, só que com bastante gente passando por vez. Só
// existe pra um tema que declarar "footstepsTrail" (ver campaignTheme.js).
export default function FootstepsTrail() {
  const { isCampaignTheme, activeTheme } = useCampaignTheme()
  const enabled = Boolean(activeTheme?.footstepsTrail)
  const [trails, setTrails] = useState([])

  useEffect(() => {
    if (!enabled) return
    let stopped = false
    let lastBanner = null
    const ownKeys = new Set()
    const removalTimeouts = new Set()

    async function loop() {
      while (!stopped) {
        const steps = buildTrail()
        const key = `trail-${Date.now()}-${Math.random()}`
        // Evita repetir o mesmo nome duas vezes seguidas — sorteia só entre
        // os outros, não entre todos.
        const candidates = NAME_BANNERS.filter((b) => b !== lastBanner)
        const banner = candidates[Math.floor(Math.random() * candidates.length)]
        lastBanner = banner
        const bannerStep = steps[Math.floor(steps.length / 2)]
        ownKeys.add(key)
        setTrails((prev) => [...prev, { key, steps, banner, bannerStep }])

        const trailDuration = steps.length * STEP_DELAY * 1000 + FADE_DURATION * 1000
        const timeoutId = setTimeout(() => {
          setTrails((prev) => prev.filter((t) => t.key !== key))
          removalTimeouts.delete(timeoutId)
          ownKeys.delete(key)
        }, trailDuration)
        removalTimeouts.add(timeoutId)

        await wait(SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN))
      }
    }

    loop()
    return () => {
      stopped = true
      removalTimeouts.forEach(clearTimeout)
      // Sem isso, uma trilha que já tinha entrado no ar antes desse cleanup
      // (ex: o duplo-mount do StrictMode em dev) perde o timer que a
      // removeria e fica presa na tela pra sempre.
      setTrails((prev) => prev.filter((t) => !ownKeys.has(t.key)))
    }
  }, [enabled])

  if (!isCampaignTheme || !enabled) return null

  // Passos de TODAS as trilhas primeiro, faixas de TODAS as trilhas depois —
  // assim uma faixa nunca fica atrás do passo de uma trilha mais nova (o que
  // aconteceria se cada trilha renderizasse seu próprio par passos+faixa em
  // sequência, já que a ordem no DOM é o que decide quem fica por cima aqui).
  return (
    <>
      {trails.map((trail) =>
        trail.steps.map((step, i) => (
          <motion.div
            key={`${trail.key}-${i}`}
            className="fixed pointer-events-none select-none z-0"
            style={{
              left: step.x,
              top: step.y,
              transform: `translate(-50%, -50%) rotate(${step.rotation}deg) scaleX(${step.mirrored ? -1 : 1})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: FADE_DURATION, times: [0, 0.2, 0.7, 1], delay: i * STEP_DELAY }}
          >
            <FootprintIcon />
          </motion.div>
        ))
      )}
      {trails.map((trail) => {
        const trailDuration = trail.steps.length * STEP_DELAY + FADE_DURATION
        return (
          <motion.img
            key={`${trail.key}-banner`}
            src={trail.banner}
            alt=""
            className="fixed pointer-events-none select-none z-0"
            style={{
              left: trail.bannerStep.x,
              top: trail.bannerStep.y - BANNER_Y_OFFSET,
              width: BANNER_WIDTH,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, BANNER_OPACITY, BANNER_OPACITY, 0] }}
            transition={{ duration: trailDuration, times: [0, 0.15, 0.75, 1] }}
          />
        )
      })}
    </>
  )
}
