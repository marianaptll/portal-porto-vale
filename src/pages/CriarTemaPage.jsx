import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import BannerPreviewEditor from '../components/BannerPreviewEditor'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import {
  normalizePosition,
  getDecorations,
  getOverlayLayers,
  DEFAULT_BANNER_FOCAL_POINT,
  safeScaleValue,
} from '../utils/themeEngine'

const DEFAULT_MASCOT_POSITION = { x: 78, y: 78 }

const DECORATION_START_POSITIONS = [
  { x: 92, y: 90 },
  { x: 70, y: 88 },
  { x: 50, y: 85 },
  { x: 30, y: 88 },
]

const EMPTY_FORM = {
  name: '',
  accent: '#7c4a2d',
  useCardColor: false,
  toolAccentColors: ['#c2410c'],
  logo: null,
  bannerImage: null,
  bannerFocalPoint: DEFAULT_BANNER_FOCAL_POINT,
  bannerZoom: 1,
  mascotImage: null,
  mascotPosition: DEFAULT_MASCOT_POSITION,
  mascotScale: 1,
  decorations: [],
  layerOrder: [],
  textureEnabled: false,
  textureOpacity: 0.5,
}

const MAX_TOOL_ACCENT_COLORS = 6
const NEXT_TOOL_ACCENT_DEFAULTS = ['#c2410c', '#0ea5e9', '#16a34a', '#eab308', '#db2777', '#64748b']

function formFromTheme(theme) {
  return {
    name: theme.name,
    accent: theme.accent,
    useCardColor: Boolean(theme.toolAccent),
    toolAccentColors:
      Array.isArray(theme.toolAccentPalette) && theme.toolAccentPalette.length > 0
        ? theme.toolAccentPalette
        : [theme.toolAccent || '#c2410c'],
    logo: theme.logo || null,
    bannerImage: theme.bannerImage || null,
    bannerFocalPoint: normalizePosition(theme.bannerFocalPoint, DEFAULT_BANNER_FOCAL_POINT),
    bannerZoom: safeScaleValue(theme.bannerZoom),
    mascotImage: theme.mascotImage || null,
    mascotPosition: normalizePosition(theme.mascotPosition, DEFAULT_MASCOT_POSITION),
    mascotScale: theme.mascotScale || 1,
    decorations: getDecorations(theme),
    layerOrder: Array.isArray(theme.layerOrder) ? theme.layerOrder : [],
    textureEnabled: Boolean(theme.textureEnabled),
    textureOpacity: theme.textureOpacity ?? 0.5,
  }
}

// Fotos de celular/câmera facilmente passam de 5-10MB, e em base64 (formato que
// salvamos no localStorage) isso fica ~33% maior — estoura a cota do navegador
// rapidinho (limite é uns 5-10MB no total, pra TODOS os temas salvos juntos).
// Por isso toda imagem passa por aqui: redimensiona pro tamanho que ela realmente
// vai ocupar na tela e recomprime, antes de virar base64.
function readFileAsDataUrl(file, { maxDimension = 800, forceJpeg = false, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale) || 1
        const height = Math.round(img.height * scale) || 1
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        const outputType = forceJpeg ? 'image/jpeg' : file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        resolve(canvas.toDataURL(outputType, quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function FileField({ label, hint, value, onChange, onRemove, maxDimension, forceJpeg }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>}
      <div className="flex items-center gap-2">
        <label className="flex-1 flex items-center gap-3 border-2 border-dashed border-outline-variant/40 dark:border-slate-600 rounded-xl p-3 cursor-pointer hover:bg-surface-container-lowest dark:hover:bg-slate-700/50 transition-all">
          {value ? (
            <img src={value} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
          ) : (
            <span className="material-symbols-outlined text-slate-400">upload</span>
          )}
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {value ? 'Trocar arquivo' : 'Clique para enviar'}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) onChange(await readFileAsDataUrl(file, { maxDimension, forceJpeg }))
            }}
          />
        </label>
        {onRemove && value && (
          <button
            type="button"
            onClick={onRemove}
            title="Remover"
            className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  )
}

// Agrupa cada tipo de upload (mascote, itens decorativos) num cartão próprio,
// pra dar pra diferenciar de relance qual área sobe qual arquivo.
function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 dark:border-slate-700 p-4 space-y-3">
      <div>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</label>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// Divide o formulário em blocos numerados (Cores, Banner, Personagens e
// Decoração, Textura), pra ficar claro onde cada grupo de campos começa e
// termina, em vez de tudo corrido numa lista só.
function FormSection({ number, title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {number}. {title}
      </h2>
      {children}
    </section>
  )
}

const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/

// Seletor de cor nativo (bolinha) + campo de texto pro código hexadecimal —
// dá pra escolher visualmente ou digitar o hex direto, os dois ficam em sincronia.
function HexColorField({ value, onChange, swatchClassName }) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const commit = (raw) => {
    const candidate = raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`
    if (HEX_COLOR_PATTERN.test(candidate)) {
      onChange(candidate)
    } else {
      setText(value)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={swatchClassName}
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit(e.currentTarget.value)
        }}
        placeholder="#000000"
        maxLength={7}
        className="w-24 bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 border border-transparent focus:border-primary/40 rounded-lg px-2.5 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
      />
    </div>
  )
}

function readDraft(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return saved && typeof saved === 'object' ? saved : null
  } catch {
    return null
  }
}

export default function CriarTemaPage() {
  const { themes, addTheme, updateTheme, setActiveThemeId } = useCampaignTheme()
  const navigate = useNavigate()
  const { id: editingId } = useParams()
  const editingTheme = editingId ? themes.find((t) => t.id === editingId) : null
  const isEditing = Boolean(editingTheme)
  const draftKey = isEditing ? `themeDraft:${editingId}` : 'themeDraft:new'

  const [form, setForm] = useState(
    () => readDraft(draftKey) || (editingTheme ? formFromTheme(editingTheme) : EMPTY_FORM)
  )
  const [error, setError] = useState('')

  // Salva um rascunho a cada mudança pra não perder o que já foi preenchido se a
  // página recarregar (ex: hot-reload durante o desenvolvimento, refresh sem querer).
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(form))
      } catch {
        // rascunho grande demais pro navegador guardar — sem problema, só não
        // fica salvo automaticamente (o botão "Salvar Tema" ainda avisa o admin)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [form, draftKey])

  const discardDraft = () => localStorage.removeItem(draftKey)

  const handleSave = () => {
    if (!form.name.trim()) {
      setError('Dê um nome pra campanha.')
      return
    }
    const fields = {
      name: form.name.trim(),
      accent: form.accent,
      toolAccent: form.useCardColor ? form.toolAccentColors[0] : null,
      toolAccentPalette: form.useCardColor ? form.toolAccentColors : null,
      logo: form.logo || '/illustrations/logo_portal_pv.png',
      bannerImage: form.bannerImage,
      bannerFocalPoint: form.bannerFocalPoint,
      bannerZoom: form.bannerZoom,
      mascotImage: form.mascotImage,
      mascotPosition: form.mascotPosition,
      mascotScale: form.mascotScale,
      decorations: form.decorations,
      layerOrder: form.layerOrder,
      textureEnabled: form.textureEnabled,
      textureOpacity: form.textureOpacity,
    }
    try {
      if (isEditing) {
        updateTheme(editingTheme.id, fields)
      } else {
        setActiveThemeId(addTheme(fields))
      }
    } catch {
      setError(
        'As imagens desse tema são grandes demais pro navegador salvar. Tente usar arquivos menores ou remova alguma imagem.'
      )
      return
    }
    discardDraft()
    navigate('/')
  }

  // Mascote e itens decorativos viram uma lista única de "camadas" (mascote +
  // cada decoração) pra dar pra arrastar/reordenar o empilhamento no editor
  // visual, como um painel de camadas do Photoshop.
  const layers = getOverlayLayers(form)

  const handleLayerPositionChange = (id, position) => {
    if (id === 'mascot') {
      setForm((prev) => ({ ...prev, mascotPosition: position }))
    } else {
      setForm((prev) => ({
        ...prev,
        decorations: prev.decorations.map((d) => (d.id === id ? { ...d, position } : d)),
      }))
    }
  }

  const handleLayerScaleChange = (id, scale) => {
    if (id === 'mascot') {
      setForm((prev) => ({ ...prev, mascotScale: scale }))
    } else {
      setForm((prev) => ({
        ...prev,
        decorations: prev.decorations.map((d) => (d.id === id ? { ...d, scale } : d)),
      }))
    }
  }

  const handleReorderLayers = (orderIds) => setForm((prev) => ({ ...prev, layerOrder: orderIds }))

  return (
    <Layout>
      <header className="mb-8 animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao início
        </Link>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          {isEditing ? `Editar Tema — ${editingTheme.name}` : 'Criar Novo Tema'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isEditing
            ? 'Ajuste as cores, o banner e os detalhes visuais dessa campanha.'
            : 'Monte uma campanha nova com cores, banner e detalhes visuais próprios.'}
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 overflow-hidden animate-fade-in-up">
        <div className="p-5 sm:p-8 space-y-8">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nome da Campanha</label>
            <input
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }))
                setError('')
              }}
              placeholder="Ex: Verão Porto Vale"
              className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 border border-transparent focus:border-primary/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
            />
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          </div>

          <FormSection number={1} title="Cores">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cor de Destaque</label>
              <div className="flex items-center gap-3">
                <HexColorField
                  value={form.accent}
                  onChange={(value) => setForm((prev) => ({ ...prev, accent: value }))}
                  swatchClassName="w-10 h-10 rounded-full border border-outline-variant/20 dark:border-slate-700 cursor-pointer bg-transparent p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Usada no header, nas abas e nos botões.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.useCardColor}
                  onChange={(e) => setForm((prev) => ({ ...prev, useCardColor: e.target.checked }))}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Usar uma cor diferente nos cards de ferramenta
                </span>
              </label>

              {form.useCardColor && (
                <div className="pl-6 space-y-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Só os ícones e barras dos cards da Home usam essas cores. Com mais de uma, elas se alternam
                    entre os cards.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {form.toolAccentColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <HexColorField
                          value={color}
                          onChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              toolAccentColors: prev.toolAccentColors.map((c, i) =>
                                i === index ? value : c
                              ),
                            }))
                          }
                          swatchClassName="w-7 h-7 rounded-full border border-outline-variant/20 dark:border-slate-700 cursor-pointer bg-transparent p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400">Cor {index + 1}</span>
                        {form.toolAccentColors.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                toolAccentColors: prev.toolAccentColors.filter((_, i) => i !== index),
                              }))
                            }
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {form.toolAccentColors.length < MAX_TOOL_ACCENT_COLORS && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          toolAccentColors: [
                            ...prev.toolAccentColors,
                            NEXT_TOOL_ACCENT_DEFAULTS[prev.toolAccentColors.length] || '#64748b',
                          ],
                        }))
                      }
                      className="flex items-center gap-2 text-sm font-bold text-primary dark:text-blue-400 hover:opacity-80 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                      Adicionar cor
                    </button>
                  )}
                </div>
              )}
            </div>
          </FormSection>

          <FormSection number={2} title="Banner">
            <FileField
              label="Logo (opcional)"
              maxDimension={400}
              value={form.logo}
              onChange={(dataUrl) => setForm((prev) => ({ ...prev, logo: dataUrl }))}
            />

            <FileField
              label="Imagem do Banner (opcional)"
              hint="Tamanho recomendado: 1600x380px (proporção bem larga, ~4,2:1). Imagens menores ou mais quadradas podem ficar cortadas — ajuste o zoom e o foco depois de enviar."
              maxDimension={1920}
              forceJpeg
              value={form.bannerImage}
              onChange={(dataUrl) => setForm((prev) => ({ ...prev, bannerImage: dataUrl }))}
            />
          </FormSection>

          <FormSection number={3} title="Personagens e Decoração">
            <SectionCard
              title="Personagem / Mascote (opcional)"
              description="Ilustração separada do fundo, exibida sobre o banner."
            >
              <FileField
                maxDimension={600}
                value={form.mascotImage}
                onChange={(dataUrl) => setForm((prev) => ({ ...prev, mascotImage: dataUrl }))}
                onRemove={() => setForm((prev) => ({ ...prev, mascotImage: null }))}
              />
            </SectionCard>

            <SectionCard
              title="Itens decorativos (opcional)"
              description="Detalhes extras perto do banner (ex: as ferraduras do Arena Country). Pode adicionar mais de um."
            >
              <div className="space-y-2">
                {form.decorations.map((deco, index) => (
                  <div
                    key={deco.id}
                    className="flex items-center gap-3 border-2 border-dashed border-outline-variant/40 dark:border-slate-600 rounded-xl p-3"
                  >
                    <label className="shrink-0 cursor-pointer" title="Clique para trocar a imagem">
                      <img src={deco.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const dataUrl = await readFileAsDataUrl(file, { maxDimension: 500 })
                          setForm((prev) => ({
                            ...prev,
                            decorations: prev.decorations.map((d, i) => (i === index ? { ...d, image: dataUrl } : d)),
                          }))
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={deco.name || ''}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          decorations: prev.decorations.map((d, i) =>
                            i === index ? { ...d, name: e.target.value } : d
                          ),
                        }))
                      }
                      placeholder={`Item decorativo ${index + 1}`}
                      className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none border-b border-transparent focus:border-primary/40 py-1 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          decorations: prev.decorations.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))}

                <FileField
                  label="Adicionar item decorativo"
                  maxDimension={500}
                  value={null}
                  onChange={(dataUrl) =>
                    setForm((prev) => ({
                      ...prev,
                      decorations: [
                        ...prev.decorations,
                        {
                          id: `deco-${Date.now()}`,
                          name: '',
                          image: dataUrl,
                          position:
                            DECORATION_START_POSITIONS[prev.decorations.length % DECORATION_START_POSITIONS.length],
                          scale: 1,
                        },
                      ],
                    }))
                  }
                />
              </div>
            </SectionCard>

            {(form.bannerImage || layers.length > 0) && (
              <BannerPreviewEditor
                accent={form.accent}
                bannerImage={form.bannerImage}
                bannerFocalPoint={form.bannerFocalPoint}
                onBannerFocalPointChange={(position) => setForm((prev) => ({ ...prev, bannerFocalPoint: position }))}
                bannerZoom={form.bannerZoom}
                onBannerZoomChange={(zoom) => setForm((prev) => ({ ...prev, bannerZoom: zoom }))}
                layers={layers}
                onLayerPositionChange={handleLayerPositionChange}
                onLayerScaleChange={handleLayerScaleChange}
                onReorderLayers={handleReorderLayers}
              />
            )}
          </FormSection>

          <FormSection number={4} title="Textura">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.textureEnabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, textureEnabled: e.target.checked }))}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Aplicar textura no fundo da página
                </span>
              </label>

              {form.textureEnabled && (
                <div className="pl-6 space-y-1">
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={form.textureOpacity}
                    onChange={(e) => setForm((prev) => ({ ...prev, textureOpacity: Number(e.target.value) }))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Opacidade: {Math.round(form.textureOpacity * 100)}%
                  </span>
                </div>
              )}
            </div>
          </FormSection>
        </div>

        <div className="p-5 sm:p-6 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 flex justify-end gap-3">
          <Link
            to="/"
            onClick={discardDraft}
            className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
          >
            {isEditing ? 'Salvar Alterações' : 'Salvar Tema'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
