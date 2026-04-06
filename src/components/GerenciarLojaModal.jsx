import { useState } from 'react'
import { Trash2, Pencil, X, Plus } from 'lucide-react'

const labelClass = 'block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5'
const inputClass = 'w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border border-outline-variant/20 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all'

const FORM_VAZIO = {
  nome: '',
  preco: '',
  definirLeadcoins: false,
  leadcoins: '',
  descricao: '',
  objetivo: 'campanha',
  tamanho: false,
  cor: false,
  voltagem: false,
}

function RadioGroup({ label, name, value, onChange }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="flex gap-4">
        {['Sim', 'Não'].map(opt => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${value === (opt === 'Sim') ? 'border-primary' : 'border-slate-300 dark:border-slate-500'}`}>
              {value === (opt === 'Sim') && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <input type="radio" name={name} className="sr-only" checked={value === (opt === 'Sim')} onChange={() => onChange(opt === 'Sim')} />
            <span className="text-sm text-slate-700 dark:text-slate-200">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  )
}

export default function GerenciarLojaModal({ isOpen, onClose, produtos, onAdicionar, onRemover, onToggleVisivel, onEditar }) {
  const [form, setForm] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [erros, setErros] = useState({})

  if (!isOpen) return null

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const validar = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe o nome do produto'
    if (!form.preco && !form.leadcoins) e.preco = 'Informe ao menos um preço'
    if (!form.objetivo) e.objetivo = 'Selecione um objetivo'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return

    const variações = []
    if (form.tamanho)  variações.push('Tamanho')
    if (form.cor)      variações.push('Cor')
    if (form.voltagem) variações.push('Voltagem')

    const produto = {
      nome: form.nome.trim(),
      preco: form.preco ? parseFloat(form.preco.replace(',', '.')) : undefined,
      leadcoins: form.leadcoins ? parseInt(form.leadcoins, 10) : undefined,
      descricao: form.descricao.trim() || undefined,
      objetivo: form.objetivo,
      variações,
      categoria: form.objetivo === 'loja' ? 'Porto Vale' : 'Campanha',
      icon: 'inventory_2',
      visivel: true,
    }

    if (editandoId !== null) {
      onEditar(editandoId, produto)
      setEditandoId(null)
    } else {
      onAdicionar(produto)
    }
    setForm(FORM_VAZIO)
    setErros({})
  }

  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id)
    setForm({
      nome: produto.nome,
      preco: produto.preco ? String(produto.preco.toFixed(2)).replace('.', ',') : '',
      definirLeadcoins: !!produto.leadcoins,
      leadcoins: produto.leadcoins ? String(produto.leadcoins) : '',
      descricao: produto.descricao || '',
      objetivo: produto.objetivo || 'campanha',
      tamanho: produto.variações?.includes('Tamanho') ?? false,
      cor: produto.variações?.includes('Cor') ?? false,
      voltagem: produto.variações?.includes('Voltagem') ?? false,
    })
    setErros({})
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setForm(FORM_VAZIO)
    setErros({})
  }

  const formatPreco = (p) => {
    const partes = []
    if (p.preco)      partes.push(`R$ ${p.preco.toFixed(2).replace('.', ',')}`)
    if (p.leadcoins)  partes.push(`${p.leadcoins} Leadcoins`)
    return partes.join(' ou ') || '—'
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10 dark:border-slate-700 shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Gerenciar Loja</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Adicione, edite ou remova produtos da loja</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Body — dois painéis */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

          {/* Painel esquerdo — formulário */}
          <div className="lg:w-[420px] shrink-0 border-b lg:border-b-0 lg:border-r border-outline-variant/10 dark:border-slate-700 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-0.5">
                  <Plus className="w-5 h-5 text-primary" />
                  {editandoId !== null ? 'Editar Produto' : 'Adicionar Novo Produto'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Preencha o formulário para {editandoId !== null ? 'atualizar o' : 'cadastrar um novo'} item na loja.</p>
              </div>

              {/* Nome */}
              <div>
                <label className={labelClass}>Nome do Produto</label>
                <input
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder="Ex: Caneca Personalizada"
                  className={inputClass}
                />
                {erros.nome && <p className="text-xs text-red-500 mt-1">{erros.nome}</p>}
              </div>

              {/* Preço */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${labelClass} mb-0`}>Preço (R$)</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${form.definirLeadcoins ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-500'}`}>
                      {form.definirLeadcoins && <span className="material-symbols-outlined text-white text-[10px]">check</span>}
                    </div>
                    <input type="checkbox" className="sr-only" checked={form.definirLeadcoins} onChange={e => set('definirLeadcoins', e.target.checked)} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Definir em Leadcoins</span>
                  </label>
                </div>
                <input
                  value={form.preco}
                  onChange={e => set('preco', e.target.value)}
                  placeholder="Ex: 25,00"
                  className={inputClass}
                />
                {form.definirLeadcoins && (
                  <input
                    value={form.leadcoins}
                    onChange={e => set('leadcoins', e.target.value)}
                    placeholder="Ex: 10"
                    className={`${inputClass} mt-2`}
                    type="number"
                    min={1}
                  />
                )}
                {erros.preco && <p className="text-xs text-red-500 mt-1">{erros.preco}</p>}
              </div>

              {/* Descrição */}
              <div>
                <label className={labelClass}>Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={e => set('descricao', e.target.value)}
                  placeholder="Detalhes sobre o produto (opcional)"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Objetivo */}
              <div>
                <label className={labelClass}>Objetivo</label>
                <div className="space-y-2">
                  {[
                    { value: 'loja', label: 'Lead Store' },
                    { value: 'campanha', label: 'Campanha' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${form.objetivo === opt.value ? 'border-primary' : 'border-slate-300 dark:border-slate-500'}`}>
                        {form.objetivo === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <input type="radio" className="sr-only" checked={form.objetivo === opt.value} onChange={() => set('objetivo', opt.value)} />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {erros.objetivo && <p className="text-xs text-red-500 mt-1">{erros.objetivo}</p>}
              </div>

              {/* Variações */}
              <RadioGroup label="Possui tamanho?" name="tamanho" value={form.tamanho} onChange={v => set('tamanho', v)} />
              <RadioGroup label="Possui cor?" name="cor" value={form.cor} onChange={v => set('cor', v)} />
              <RadioGroup label="Possui voltagem?" name="voltagem" value={form.voltagem} onChange={v => set('voltagem', v)} />

              {/* Imagens */}
              <div>
                <label className={labelClass}>Imagens do Produto</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => set('imagens', Array.from(e.target.files))}
                  className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface-container-low dark:file:bg-slate-700 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200 dark:hover:file:bg-slate-600 cursor-pointer"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Adicione uma ou mais imagens. A primeira da lista será a capa.</p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-1">
                {editandoId !== null && (
                  <button type="button" onClick={cancelarEdicao} className="flex-1 py-2.5 rounded-xl border border-outline-variant/20 dark:border-slate-600 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all"
                >
                  {editandoId !== null ? 'Salvar Alterações' : 'Adicionar Produto'}
                </button>
              </div>
            </form>
          </div>

          {/* Painel direito — lista de produtos */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="mb-5">
                <h3 className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-0.5">
                  <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl">list</span>
                  Produtos Cadastrados
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Lista de todos os produtos atualmente na loja.</p>
              </div>

              <ul className="space-y-3">
                {produtos.map(produto => {
                  const vars = produto.variações?.filter(Boolean) ?? []
                  return (
                    <li
                      key={produto.id}
                      className={`flex items-center gap-3 bg-surface-container-low dark:bg-slate-800 rounded-2xl p-3 border transition-opacity ${produto.visivel === false ? 'opacity-50' : ''} border-outline-variant/10 dark:border-slate-700`}
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {produto.image ? (
                          <img src={produto.image} alt={produto.nome} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {produto.icon || 'inventory_2'}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1">{produto.nome}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatPreco(produto)}</p>
                        {vars.length > 0 && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Variações: {vars.join(', ')}</p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Toggle checked={produto.visivel !== false} onChange={() => onToggleVisivel(produto.id)} />
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Visível</span>
                        </div>
                        <button
                          onClick={() => iniciarEdicao(produto)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                        <button
                          onClick={() => onRemover(produto.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {produtos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-3">inventory_2</span>
                  <p className="font-bold text-slate-500 dark:text-slate-400">Nenhum produto cadastrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
