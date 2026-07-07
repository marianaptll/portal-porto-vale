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
// "accent". Existem 4 slots de cor pros cards (theme-tool-1..4): se o admin
// escolher menos de 4 cores em "toolAccentPalette", elas se repetem pra
// preencher os slots; sem paleta, os 4 slots viram tons derivados de uma cor só.
export function deriveTheme(input) {
  const { accent, toolAccent, toolAccentPalette } = input
  const cardBase = toolAccent || accent
  const palette =
    Array.isArray(toolAccentPalette) && toolAccentPalette.length > 0
      ? toolAccentPalette
      : [cardBase, darken(cardBase, 0.15), lighten(cardBase, 0.15), darken(cardBase, 0.3)]

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
    toolAccents: Array.from({ length: 4 }, (_, i) => palette[i % palette.length]),
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
        image: d.image,
        position: normalizePosition(d.position, DEFAULT_DECORATION_POSITION),
        scale: safeScaleValue(d.scale),
      }))
  }
  if (theme.decorationImage) {
    return [
      {
        id: 'legacy',
        image: theme.decorationImage,
        position: normalizePosition(theme.decorationPosition, DEFAULT_DECORATION_POSITION),
        scale: safeScaleValue(theme.decorationScale),
      },
    ]
  }
  return []
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
    '--color-primary',
  ].forEach((key) => root.style.removeProperty(key))
}
