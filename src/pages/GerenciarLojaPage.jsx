import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Pencil } from 'lucide-react'
import Layout from '../components/Layout'
import { useProdutos } from '../context/ProdutosContext'
import { readFileAsDataUrl } from '../utils/imageUtils'

const labelClass = 'block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5'
const inputClass = 'w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border border-outline-variant/20 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all'

const CATEGORIAS_CAMPANHA = ['Variados', 'Bebidas', 'Experiência Gastronômica', 'Eletrodomésticos', 'Eletroeletrônicos']

const FORM_VAZIO = {
  nome: '',
  preco: '',
  definirLeadcoins: false,
  leadcoins: '',
  descricao: '',
  objetivo: 'campanha',
  categoria: CATEGORIAS_CAMPANHA[0],
  tamanho: false,
  cor: false,
  voltagem: false,
}

function RadioPair({ label, value, onChange }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="flex gap-5">
        {[true, false].map(opt => (
          <label key={String(opt)} className="flex items-center gap-2 cursor-pointer">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${value === opt ? 'border-primary' : 'border-slate-300 dark:border-slate-500'}`}>
              {value === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <input type="radio" className="sr-only" checked={value === opt} onChange={() => onChange(opt)} />
            <span className="text-sm text-slate-700 dark:text-slate-200">{opt ? 'Sim' : 'Não'}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  )
}

export default function GerenciarLojaPage() {
  const { produtos, adicionarProduto, removerProduto, toggleVisivel, editarProduto } = useProdutos()
  const [form, setForm] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [erros, setErros] = useState({})
  const [busca, setBusca] = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const validar = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe o nome do produto'
    if (!form.preco && !form.leadcoins) e.preco = 'Informe ao menos um preço'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    const variacoes = []
    if (form.tamanho)  variacoes.push('Tamanho')
    if (form.cor)      variacoes.push('Cor')
    if (form.voltagem) variacoes.push('Voltagem')

    // A primeira imagem enviada vira a capa do produto (mesma compressão via
    // canvas usada no editor de temas, pra não deixar o data URL gigante).
    const primeiraImagem = form.imagens?.[0]
    const image = primeiraImagem ? await readFileAsDataUrl(primeiraImagem, { maxDimension: 800 }) : undefined

    const produto = {
      nome: form.nome.trim(),
      preco: form.preco ? parseFloat(form.preco.replace(',', '.')) : undefined,
      leadcoins: form.leadcoins ? parseInt(form.leadcoins, 10) : undefined,
      descricao: form.descricao.trim() || undefined,
      objetivo: form.objetivo,
      categoria: form.objetivo === 'loja' ? 'Porto Vale' : form.categoria,
      variacoes,
      icon: 'inventory_2',
      ...(image ? { image } : {}),
    }

    if (editandoId !== null) {
      editarProduto(editandoId, produto)
      setEditandoId(null)
    } else {
      adicionarProduto(produto)
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
      categoria: CATEGORIAS_CAMPANHA.includes(produto.categoria) ? produto.categoria : CATEGORIAS_CAMPANHA[0],
      tamanho: produto.variacoes?.includes('Tamanho') ?? false,
      cor: produto.variacoes?.includes('Cor') ?? false,
      voltagem: produto.variacoes?.includes('Voltagem') ?? false,
    })
    setErros({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setForm(FORM_VAZIO)
    setErros({})
  }

  const formatPreco = (p) => {
    const partes = []
    if (p.preco)     partes.push(`R$ ${p.preco.toFixed(2).replace('.', ',')}`)
    if (p.leadcoins) partes.push(`${p.leadcoins} Leadcoins`)
    return partes.join(' ou ') || '—'
  }

  const produtosFiltrados = produtos.filter(p =>
    busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <Layout>
      <header className="mb-8 animate-fade-in-up">
        <Link
          to="/leadstore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar à Lead Store
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Gerenciar Loja
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Adicione, edite ou remova produtos da Lead Store.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up">

        {/* Formulário */}
        <div className="lg:w-[420px] shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm p-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-0.5">
              <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
              {editandoId !== null ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
              Preencha o formulário para {editandoId !== null ? 'atualizar o' : 'cadastrar um novo'} item na loja.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                      {form.definirLeadcoins && <span className="material-symbols-outlined text-white" style={{ fontSize: '10px' }}>check</span>}
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
                    placeholder="Quantidade de Leadcoins"
                    type="number"
                    min={1}
                    className={`${inputClass} mt-2`}
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
                <div className="space-y-2.5">
                  {[{ value: 'loja', label: 'Lead Store' }, { value: 'campanha', label: 'Campanha' }].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${form.objetivo === opt.value ? 'border-primary' : 'border-slate-300 dark:border-slate-500'}`}>
                        {form.objetivo === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <input type="radio" className="sr-only" checked={form.objetivo === opt.value} onChange={() => set('objetivo', opt.value)} />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categoria (só se aplica à Campanha; Lead Store fica sempre em "Porto Vale") */}
              {form.objetivo === 'campanha' && (
                <div>
                  <label className={labelClass}>Categoria</label>
                  <select
                    value={form.categoria}
                    onChange={e => set('categoria', e.target.value)}
                    className={inputClass}
                  >
                    {CATEGORIAS_CAMPANHA.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Define ao lado de quais produtos ele aparece na loja.</p>
                </div>
              )}

              <RadioPair label="Possui tamanho?" value={form.tamanho} onChange={v => set('tamanho', v)} />
              <RadioPair label="Possui cor?"     value={form.cor}     onChange={v => set('cor', v)} />
              <RadioPair label="Possui voltagem?" value={form.voltagem} onChange={v => set('voltagem', v)} />

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
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">A primeira imagem será usada como capa.</p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-1">
                {editandoId !== null && (
                  <button type="button" onClick={cancelarEdicao} className="flex-1 py-3 rounded-xl border border-outline-variant/20 dark:border-slate-600 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Cancelar
                  </button>
                )}
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all">
                  {editandoId !== null ? 'Salvar Alterações' : 'Adicionar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-0.5">
                  <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl">list</span>
                  Produtos Cadastrados
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Lista de todos os produtos atualmente na loja.</p>
              </div>
              {/* Busca */}
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border border-outline-variant/20 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <ul className="space-y-2">
              {produtosFiltrados.map(produto => {
                const vars = produto.variacoes?.filter(Boolean) ?? []
                const isEditando = editandoId === produto.id
                return (
                  <li
                    key={produto.id}
                    className={`flex items-center gap-3 rounded-2xl p-3 border transition-all ${
                      isEditando
                        ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                        : produto.visivel === false
                          ? 'opacity-50 border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-700/30'
                          : 'border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-700/30'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0 overflow-hidden">
                      {produto.image ? (
                        <img src={produto.image} alt={produto.nome} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {produto.icon || 'inventory_2'}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{produto.nome}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatPreco(produto)}</p>
                      {vars.length > 0 && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Variações: {vars.join(', ')}</p>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5">
                        <Toggle checked={produto.visivel !== false} onChange={() => toggleVisivel(produto.id)} />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Visível</span>
                      </div>
                      <button onClick={() => iniciarEdicao(produto)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors" title="Editar">
                        <Pencil className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button onClick={() => removerProduto(produto.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remover">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      {/* Toggle visível no mobile */}
                      <div className="sm:hidden">
                        <Toggle checked={produto.visivel !== false} onChange={() => toggleVisivel(produto.id)} />
                      </div>
                    </div>
                  </li>
                )
              })}

              {produtosFiltrados.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-3">inventory_2</span>
                  <p className="font-bold text-slate-500 dark:text-slate-400">Nenhum produto encontrado</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}
