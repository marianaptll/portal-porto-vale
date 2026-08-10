import { createContext, useContext, useState, useEffect, useLayoutEffect, useMemo } from 'react'
import {
  deriveTheme,
  applyThemeCssVars,
  clearThemeCssVars,
  normalizePosition,
  getDecorations,
  safeScaleValue,
  DEFAULT_BANNER_FOCAL_POINT,
} from '../utils/themeEngine'
import { BUILT_IN_THEMES } from '../data/campaignTheme'

const CampaignThemeContext = createContext()
const BUILT_IN_THEME_IDS = BUILT_IN_THEMES.map((t) => t.id)

function loadThemes() {
  try {
    const saved = JSON.parse(localStorage.getItem('campaignThemes'))
    if (Array.isArray(saved) && saved.length > 0) {
      // Preenche campos novos de cada tema embutido (adicionados depois que o
      // admin já tinha uma cópia salva no navegador) sem apagar edições que o
      // admin já tenha feito neles — por isso o merge é embutido <- salvo, não
      // o contrário.
      const refreshed = saved.map((t) => {
        const builtIn = BUILT_IN_THEMES.find((b) => b.id === t.id)
        if (!builtIn) return t
        const merged = { ...builtIn, ...t }
        // "decorations" (array) substituiu o antigo "decorationImage" único. Se o
        // registro salvo ainda está no formato antigo mas já foi editado (tem sua
        // própria posição), converte em vez de deixar o array novo sobrescrever.
        if (!Array.isArray(t.decorations) && t.decorationImage) {
          merged.decorations = getDecorations(t)
        }
        // Um banner embutido sem imagem nunca é intencional (era o bug do
        // rascunho de tema que zerava esse campo) — cai pro banner do código
        // em vez de deixar a campanha sem fundo nenhum.
        if (!merged.bannerImage) merged.bannerImage = builtIn.bannerImage
        return merged
      })
      const missingBuiltIns = BUILT_IN_THEMES.filter((b) => !saved.some((t) => t.id === b.id))
      return [...missingBuiltIns, ...refreshed]
    }
  } catch {
    // localStorage vazio/corrompido — cai nos temas embutidos
  }
  return BUILT_IN_THEMES
}

const DEFAULT_MASCOT_POSITION = { x: 78, y: 78 }

function normalizeThemeFields({
  name,
  logo,
  bannerImage,
  bannerFocalPoint,
  bannerZoom,
  mascotImage,
  mascotPosition,
  mascotScale,
  decorations,
  layerOrder,
  textureEnabled,
  textureOpacity,
  accent,
  toolAccent,
  toolAccentPalette,
}) {
  return {
    name,
    logo,
    bannerImage,
    bannerFocalPoint: normalizePosition(bannerFocalPoint, DEFAULT_BANNER_FOCAL_POINT),
    bannerZoom: safeScaleValue(bannerZoom),
    mascotImage: mascotImage || null,
    mascotPosition: normalizePosition(mascotPosition, DEFAULT_MASCOT_POSITION),
    mascotScale: mascotScale || 1,
    decorations: getDecorations({ decorations }),
    layerOrder: Array.isArray(layerOrder) ? layerOrder : [],
    textureEnabled: Boolean(textureEnabled),
    textureOpacity: textureOpacity ?? 0.5,
    accent,
    toolAccent: toolAccent || null,
    toolAccentPalette: Array.isArray(toolAccentPalette) && toolAccentPalette.length > 0 ? toolAccentPalette : null,
  }
}

// Imagens em base64 são pesadas, e o localStorage tem uma cota pequena (uns
// 5-10MB no total). Gravamos de forma síncrona (em vez de reagir a "themes"
// num useEffect) pra poder recusar a mudança e avisar o admin quando estourar,
// em vez de deixar o app inteiro travar em tela branca com um erro não tratado.
function persistThemes(nextThemes) {
  try {
    localStorage.setItem('campaignThemes', JSON.stringify(nextThemes))
    return true
  } catch {
    return false
  }
}

// Tema que qualquer visitante vê sem nunca ter escolhido nada (primeira
// visita, sem "activeThemeId" salvo ainda) — depois que a pessoa escolhe
// qualquer coisa (inclusive "Tema padrão"), essa escolha vira definitiva e
// esse valor deixa de importar (ver "themeChoiceMade" abaixo).
const DEFAULT_THEME_ID_FOR_NEW_VISITORS = 'bingou'

export function CampaignThemeProvider({ children }) {
  const [themes, setThemes] = useState(loadThemes)
  const [activeThemeId, setActiveThemeId] = useState(() =>
    localStorage.getItem('themeChoiceMade') ? localStorage.getItem('activeThemeId') : DEFAULT_THEME_ID_FOR_NEW_VISITORS
  )
  const [lastActiveThemeId, setLastActiveThemeId] = useState(() => localStorage.getItem('activeThemeId'))

  useEffect(() => {
    try {
      // Marca que a pessoa já teve uma escolha de tema definida (mesmo que
      // essa escolha tenha sido só o valor padrão do primeiro carregamento) —
      // sem isso, toda visita sem "activeThemeId" salvo cairia de novo no
      // padrão, mesmo que a pessoa já tenha desativado o tema de propósito.
      localStorage.setItem('themeChoiceMade', 'true')
      if (activeThemeId) localStorage.setItem('activeThemeId', activeThemeId)
      else localStorage.removeItem('activeThemeId')
    } catch {
      // não é crítico — só o "tema ativo" não sobrevive a um reload
    }
  }, [activeThemeId])

  const activeTheme = useMemo(() => {
    const raw = themes.find((t) => t.id === activeThemeId)
    return raw ? deriveTheme(raw) : null
  }, [themes, activeThemeId])

  // useLayoutEffect (não useEffect) de propósito: precisa rodar antes do navegador
  // pintar a tela. Com useEffect normal, a primeira pintura acontece sem as
  // variáveis de cor do tema ainda definidas (~140ms sem cor), criando um "flash"
  // visível de tela sem estilo antes da cor certa aparecer, especialmente notável
  // ao dar F5 com um tema de campanha ativo.
  useLayoutEffect(() => {
    if (activeTheme) applyThemeCssVars(activeTheme)
    else clearThemeCssVars()
  }, [activeTheme])

  const isCampaignTheme = Boolean(activeTheme)

  const toggleCampaignTheme = () => {
    if (activeThemeId) {
      setLastActiveThemeId(activeThemeId)
      setActiveThemeId(null)
    } else {
      setActiveThemeId(lastActiveThemeId || themes[0]?.id || null)
    }
  }

  const addTheme = (fields) => {
    const id = `theme-${Date.now()}`
    const nextThemes = [...themes, { id, ...normalizeThemeFields(fields) }]
    if (!persistThemes(nextThemes)) {
      throw new Error('theme-storage-quota-exceeded')
    }
    setThemes(nextThemes)
    return id
  }

  const updateTheme = (id, fields) => {
    const nextThemes = themes.map((t) => (t.id === id ? { id, ...normalizeThemeFields(fields) } : t))
    if (!persistThemes(nextThemes)) {
      throw new Error('theme-storage-quota-exceeded')
    }
    setThemes(nextThemes)
  }

  const removeTheme = (id) => {
    if (BUILT_IN_THEME_IDS.includes(id)) return
    const nextThemes = themes.filter((t) => t.id !== id)
    persistThemes(nextThemes)
    setThemes(nextThemes)
    if (activeThemeId === id) setActiveThemeId(null)
  }

  return (
    <CampaignThemeContext.Provider
      value={{
        themes,
        activeThemeId,
        activeTheme,
        isCampaignTheme,
        setActiveThemeId,
        toggleCampaignTheme,
        addTheme,
        updateTheme,
        removeTheme,
      }}
    >
      {children}
    </CampaignThemeContext.Provider>
  )
}

export function useCampaignTheme() {
  return useContext(CampaignThemeContext)
}
