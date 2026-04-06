import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { ProductRevealCard } from '../components/ProductRevealCard'
import CartModal from '../components/CartModal'
import { useProdutos } from '../context/ProdutosContext'
import fundoLeadStore from '../assets/images/illustrations/fundo-leadstore.png'

const CATEGORIAS = [
  { id: 'Todos', label: 'Todos', icon: 'grid_view', color: 'text-slate-500' },
  { id: 'Variados', label: 'Variados', icon: 'category', color: 'text-slate-500' },
  { id: 'Bebidas', label: 'Bebidas', icon: 'local_bar', color: 'text-red-500' },
  { id: 'Experiência Gastronômica', label: 'Exp. Gastronômica', icon: 'restaurant', color: 'text-amber-500' },
  { id: 'Eletrodomésticos', label: 'Eletrodomésticos', icon: 'kitchen', color: 'text-blue-500' },
  { id: 'Eletroeletrônicos', label: 'Eletroeletrônicos', icon: 'devices', color: 'text-violet-500' },
  { id: 'Porto Vale', label: 'Porto Vale', icon: 'shield', color: 'text-primary' },
]



export default function LeadStorePage() {
  const { produtos: produtosState } = useProdutos()
  const [modo, setModo] = useState('campanha') // 'campanha' | 'loja'
  const [categoria, setCategoria] = useState('Todos')

  const produtosVisiveis = produtosState.filter(p => p.visivel !== false)
  const PRECO_MAX_GLOBAL = Math.max(...produtosVisiveis.filter(p => p.leadcoins).map(p => p.leadcoins), 1)
  const PRECO_MAX_LOJA   = Math.max(...produtosVisiveis.filter(p => p.preco).map(p => p.preco), 1)
  const PRODUTOS_LOJA    = produtosVisiveis.filter(p => p.objetivo === 'loja' || p.categoria === 'Porto Vale')
  const [busca, setBusca] = useState('')
  const [precoMax, setPrecoMax] = useState(PRECO_MAX_GLOBAL)
  const [precoMaxLoja, setPrecoMaxLoja] = useState(PRECO_MAX_LOJA)
  const [ordenacao, setOrdenacao] = useState('relevancia')
  const [carrinho, setCarrinho] = useState([])
  const [carrinhoLoja, setCarrinhoLoja] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const carrinhoAtivo = modo === 'campanha' ? carrinho : carrinhoLoja
  const setCarrinhoAtivo = modo === 'campanha' ? setCarrinho : setCarrinhoLoja
  const totalItensCarrinho = carrinhoAtivo.reduce((acc, i) => acc + i.quantidade, 0)

  const trocarModo = (novoModo) => {
    setModo(novoModo)
    setCategoria('Todos')
    setBusca('')
    setOrdenacao('relevancia')
  }

  const adicionarAoCarrinho = (produto) => {
    setCarrinhoAtivo(prev => {
      const existe = prev.find(i => i.id === produto.id)
      if (existe) return prev.map(i => i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i)
      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  const removerDoCarrinho = (id) => setCarrinhoAtivo(prev => prev.filter(i => i.id !== id))

  const alterarQuantidade = (id, qtd) => {
    if (qtd <= 0) return removerDoCarrinho(id)
    setCarrinhoAtivo(prev => prev.map(i => i.id === id ? { ...i, quantidade: qtd } : i))
  }


  const produtosFiltrados = useMemo(() => {
    const base = modo === 'loja' ? PRODUTOS_LOJA : produtosVisiveis
    let lista = base.filter(p => {
      const matchCat   = categoria === 'Todos' || p.categoria === categoria
      const matchBusca = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase())
      const matchPreco = modo === 'loja' ? (p.preco ?? 0) <= precoMaxLoja : p.leadcoins <= precoMax
      return matchCat && matchBusca && matchPreco
    })
    if (modo === 'loja') {
      if (ordenacao === 'menor') lista = [...lista].sort((a, b) => a.preco - b.preco)
      if (ordenacao === 'maior') lista = [...lista].sort((a, b) => b.preco - a.preco)
      if (ordenacao === 'az')    lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome))
    } else {
      if (ordenacao === 'menor') lista = [...lista].sort((a, b) => a.leadcoins - b.leadcoins)
      if (ordenacao === 'maior') lista = [...lista].sort((a, b) => b.leadcoins - a.leadcoins)
      if (ordenacao === 'az')    lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome))
    }
    return lista
  }, [modo, categoria, busca, precoMax, precoMaxLoja, ordenacao, produtosState])

  return (
    <Layout>
      {/* Hero */}
      <div
        className="w-full rounded-3xl mb-6 animate-fade-in-up relative flex items-center justify-center overflow-visible"
        style={{ minHeight: '120px' }}
      >
        {/* Fundo com overflow hidden apenas no fundo */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img src={fundoLeadStore} alt="" className="w-full h-full object-cover" />
        </div>


        {/* Mascote */}
        <img
          src="/illustrations/lead-store.png"
          alt="Mascote Lead Store"
          className="absolute right-4 sm:right-24 md:right-48 lg:right-96 bottom-0 z-20 h-28 sm:h-36 md:h-44 w-auto object-contain drop-shadow-xl translate-y-5"
        />
      </div>

      {/* Header */}
      <header className="mb-6 animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao início
        </Link>

        {/* Tab switcher + botão gerenciar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-2 bg-surface-container-low dark:bg-slate-800 rounded-2xl p-1.5 flex-1 sm:flex-none">
          <button
            onClick={() => trocarModo('campanha')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              modo === 'campanha'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
            Campanha
          </button>
          <button
            onClick={() => trocarModo('loja')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              modo === 'loja'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            Loja Porto Vale
          </button>
        </div>

          <Link
            to="/leadstore/gerenciar"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-outline-variant/20 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-base">settings</span>
            Gerenciar
          </Link>
        </div>

        {/* Banner Leadcoins — apenas Campanha */}
        {modo === 'campanha' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Seu saldo de Leadcoins</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">300 <span className="text-sm font-bold text-amber-500">Leadcoins</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-blue-400 hover:underline">
                <span className="material-symbols-outlined text-base">receipt_long</span>
                Ver Extrato
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                {totalItensCarrinho > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                    {totalItensCarrinho}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Banner Loja Porto Vale */}
        {modo === 'loja' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loja Porto Vale</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Compre produtos oficiais com pagamento em dinheiro</p>
              </div>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
            >
              <span className="material-symbols-outlined text-primary dark:text-blue-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              {totalItensCarrinho > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                  {totalItensCarrinho}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Sidebar filtros */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm p-5 sticky top-28">
            <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">Filtros</h2>

            {/* Categorias — apenas no modo campanha */}
            {modo === 'campanha' && (
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Categoria</p>
                <ul className="space-y-1">
                  {CATEGORIAS.map(cat => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setCategoria(cat.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
                          categoria === cat.id
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-base ${categoria === cat.id ? 'text-white' : cat.color}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {cat.icon}
                        </span>
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Faixa de preço */}
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Faixa de preço</p>
              {modo === 'campanha' ? (
                <>
                  <input
                    type="range"
                    min={0}
                    max={PRECO_MAX_GLOBAL}
                    value={precoMax}
                    onChange={e => setPrecoMax(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span>0</span>
                    <span className="text-primary dark:text-blue-400 font-bold">até {precoMax} LC</span>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="range"
                    min={0}
                    max={PRECO_MAX_LOJA}
                    step={0.5}
                    value={precoMaxLoja}
                    onChange={e => setPrecoMaxLoja(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span>R$ 0</span>
                    <span className="text-primary dark:text-blue-400 font-bold">até R$ {precoMaxLoja.toFixed(2).replace('.', ',')}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          {/* Barra superior */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-outline-variant/20 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-outline-variant/20 dark:border-slate-700 rounded-xl px-3 py-2.5 shrink-0">
              <span className="material-symbols-outlined text-slate-400 text-base">sort</span>
              <select
                value={ordenacao}
                onChange={e => setOrdenacao(e.target.value)}
                className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer"
              >
                <option value="relevancia">Relevância</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          </div>

          {/* Contagem */}
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
          </p>

          {/* Grid */}
          {produtosFiltrados.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>
                search_off
              </span>
              <p className="text-base font-bold text-slate-500 dark:text-slate-400">Nenhum produto encontrado</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Tente ajustar os filtros ou a busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {produtosFiltrados.map(produto => (
                <ProductRevealCard
                  key={produto.id}
                  nome={produto.nome}
                  leadcoins={produto.leadcoins}
                  preco={produto.preco}
                  icon={produto.icon}
                  image={produto.image}
                  categoria={produto.categoria}
                  modo={modo}
                  onComprar={() => adicionarAoCarrinho(produto)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        itens={carrinhoAtivo}
        onRemover={removerDoCarrinho}
        onAlterar={alterarQuantidade}
        saldoLeadcoins={300}
        modo={modo}
      />
    </Layout>
  )
}

