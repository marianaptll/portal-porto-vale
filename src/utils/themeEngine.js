// Deriva um tema de campanha inteiro (fundo, header, abas, cards) a partir de
// uma única cor de destaque escolhida pelo admin. Como a cor só existe em
// runtime, não dá pra gerar classes Tailwind pra ela — em vez disso, calculamos
// valores RGB e jogamos em variáveis CSS (ver applyThemeCssVars), que os tokens
// "theme-*" do tailwind.config.js já sabem ler.

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')
}

export function mix(hexA, hexB, amount) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  return rgbToHex(a.r + (b.r - a.r) * amount, a.g + (b.g - a.g) * amount, a.b + (b.b - a.b) * amount)
}

export function lighten(hex, amount) {
  return mix(hex, '#ffffff', amount)
}

export function darken(hex, amount) {
  return mix(hex, '#000000', amount)
}

export function hexToRgbTriplet(hex) {
  const { r, g, b } = hexToRgb(hex)
  return `${r} ${g} ${b}`
}

// Recebe { id, name, logo, bannerImage, accent, toolAccent?, toolAccentPalette? }
// e devolve o tema completo (valores hex prontos pra usar em style inline onde
// precisar, além do que os tokens theme-* do Tailwind consomem via CSS var).
//
// "accent" comanda header/footer/abas/botões. "toolAccent"/"toolAccentPalette"
// são opcionais — cores só pros ícones dos cards de ferramenta (ex: o Arena
// Country usa marrom no header e laranja nos cards). Sem eles, os cards usam
// "accent". Existem 6 slots de cor pros cards (theme-tool-1..6): se o admin
// escolher menos de 6 cores em "toolAccentPalette", elas se repetem pra
// preencher os slots; sem paleta, os 6 slots viram tons derivados de uma cor só.
export function deriveTheme(input) {
  const { accent, toolAccent, toolAccentPalette } = input
  const cardBase = toolAccent || accent
  const palette =
    Array.isArray(toolAccentPalette) && toolAccentPalette.length > 0
      ? toolAccentPalette
      : [
          cardBase,
          darken(cardBase, 0.15),
          lighten(cardBase, 0.15),
          darken(cardBase, 0.3),
          lighten(cardBase, 0.3),
          darken(cardBase, 0.45),
        ]

  return {
    ...input,
    accentFrom: lighten(accent, 0.55),
    accentTo: accent,
    pageBgLight: lighten(accent, 0.9),
    pageBgDark: darken(accent, 0.85),
    headerBg: darken(accent, 0.72),
    headerBorder: darken(accent, 0.55),
    textStrong: lighten(accent, 0.88),
    textMuted: lighten(accent, 0.55),
    toolAccents: Array.from({ length: 6 }, (_, i) => palette[i % palette.length]),
  }
}

// Escreve as variáveis CSS que os tokens "theme-*" do Tailwind referenciam.
export function applyThemeCssVars(theme) {
  const root = document.documentElement
  const vars = {
    '--theme-accent': hexToRgbTriplet(theme.accentTo),
    '--theme-accent-from': hexToRgbTriplet(theme.accentFrom),
    '--theme-page-light': hexToRgbTriplet(theme.pageBgLight),
    '--theme-page-dark': hexToRgbTriplet(theme.pageBgDark),
    '--theme-header-bg': hexToRgbTriplet(theme.headerBg),
    '--theme-header-border': hexToRgbTriplet(theme.headerBorder),
    '--theme-text-strong': hexToRgbTriplet(theme.textStrong),
    '--theme-text-muted': hexToRgbTriplet(theme.textMuted),
    '--theme-tool-1': hexToRgbTriplet(theme.toolAccents[0]),
    '--theme-tool-2': hexToRgbTriplet(theme.toolAccents[1]),
    '--theme-tool-3': hexToRgbTriplet(theme.toolAccents[2]),
    '--theme-tool-4': hexToRgbTriplet(theme.toolAccents[3]),
    '--theme-tool-5': hexToRgbTriplet(theme.toolAccents[4]),
    '--theme-tool-6': hexToRgbTriplet(theme.toolAccents[5]),
    '--color-primary': hexToRgbTriplet(theme.accentTo),
  }
  Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
}

// Gera o background da textura arenosa com opacidade configurável (o ruído é
// desenhado em SVG e a opacidade vai embutida no próprio data URI, por isso
// não dá pra controlar só com CSS "opacity" sem desbotar o conteúdo por cima).
export function buildTextureStyle(opacity = 0.7) {
  const svg =
    "%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='" +
    opacity +
    "'/%3E%3C/svg%3E"
  return {
    backgroundImage: `url("data:image/svg+xml,${svg}")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '160px 160px',
    backgroundBlendMode: 'overlay',
  }
}

const LEGACY_CORNER_POSITIONS = {
  'bottom-right': { x: 92, y: 90 },
  'bottom-left': { x: 8, y: 90 },
  'top-right': { x: 92, y: 12 },
  'top-left': { x: 8, y: 12 },
}

// Posições de mascote/item decorativo eram um enum de 4 cantos; agora são um
// ponto livre {x,y} em % arrastado no preview. Convertemos o formato antigo
// pra não perder o posicionamento de temas salvos antes dessa mudança.
export function normalizePosition(value, fallback) {
  if (value && typeof value === 'object' && typeof value.x === 'number' && typeof value.y === 'number') return value
  if (typeof value === 'string' && LEGACY_CORNER_POSITIONS[value]) return LEGACY_CORNER_POSITIONS[value]
  return fallback
}

const DEFAULT_DECORATION_POSITION = { x: 92, y: 90 }
export const DEFAULT_BANNER_FOCAL_POINT = { x: 50, y: 50 }

export function safeScaleValue(value) {
  return Number.isFinite(value) && value > 0 ? value : 1
}

// "decorationImage"/"decorationPosition"/"decorationScale" (um item só) foi o
// formato original; agora um tema pode ter vários itens decorativos em
// "decorations" (array). Essa função lê os dois formatos e sempre devolve uma
// lista normalizada, pra não perder itens decorativos de temas salvos antes
// dessa mudança.
export function getDecorations(theme) {
  if (Array.isArray(theme.decorations)) {
    return theme.decorations
      .filter((d) => d && d.image)
      .map((d, i) => ({
        id: d.id || `legacy-${i}`,
        name: d.name || null,
        image: d.image,
        position: normalizePosition(d.position, DEFAULT_DECORATION_POSITION),
        scale: safeScaleValue(d.scale),
      }))
  }
  if (theme.decorationImage) {
    return [
      {
        id: 'legacy',
        name: null,
        image: theme.decorationImage,
        position: normalizePosition(theme.decorationPosition, DEFAULT_DECORATION_POSITION),
        scale: safeScaleValue(theme.decorationScale),
      },
    ]
  }
  return []
}

// "layerOrder" guarda a ordem de empilhamento (z-index) do mascote e dos itens
// decorativos, do mais pra frente (índice 0) pro mais pro fundo — como um
// painel de camadas do Photoshop. Ele guarda só os IDs; essa função junta isso
// com os dados reais de cada item (imagem/posição/escala) e cuida dos casos
// em que um item foi removido ou um novo foi adicionado sem entrar na ordem
// ainda (o novo entra na frente, por ser o mais "recente"/visível).
export function getOverlayLayers(theme) {
  const items = []
  if (theme.mascotImage) {
    items.push({
      id: 'mascot',
      kind: 'mascot',
      image: theme.mascotImage,
      position: normalizePosition(theme.mascotPosition, { x: 78, y: 78 }),
      scale: safeScaleValue(theme.mascotScale),
    })
  }
  getDecorations(theme).forEach((deco) => {
    items.push({
      id: deco.id,
      kind: 'decoration',
      name: deco.name,
      image: deco.image,
      position: deco.position,
      scale: deco.scale,
    })
  })

  const availableIds = items.map((item) => item.id)
  const order = Array.isArray(theme.layerOrder) ? theme.layerOrder : []
  const existing = order.filter((id) => availableIds.includes(id))
  const missing = availableIds.filter((id) => !existing.includes(id))
  const finalOrder = [...missing, ...existing]

  return finalOrder.map((id) => items.find((item) => item.id === id)).filter(Boolean)
}

export function clearThemeCssVars() {
  const root = document.documentElement
  ;[
    '--theme-accent',
    '--theme-accent-from',
    '--theme-page-light',
    '--theme-page-dark',
    '--theme-header-bg',
    '--theme-header-border',
    '--theme-text-strong',
    '--theme-text-muted',
    '--theme-tool-1',
    '--theme-tool-2',
    '--theme-tool-3',
    '--theme-tool-4',
    '--theme-tool-5',
    '--theme-tool-6',
    '--color-primary',
  ].forEach((key) => root.style.removeProperty(key))
}
