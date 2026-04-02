import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { ProductRevealCard } from '../components/ProductRevealCard'

const CATEGORIAS = [
  { id: 'Todos', label: 'Todos', icon: 'grid_view', color: 'text-slate-500' },
  { id: 'Variados', label: 'Variados', icon: 'category', color: 'text-slate-500' },
  { id: 'Bebidas', label: 'Bebidas', icon: 'local_bar', color: 'text-red-500' },
  { id: 'Experiência Gastronômica', label: 'Exp. Gastronômica', icon: 'restaurant', color: 'text-amber-500' },
  { id: 'Eletrodomésticos', label: 'Eletrodomésticos', icon: 'kitchen', color: 'text-blue-500' },
  { id: 'Eletroeletrônicos', label: 'Eletroeletrônicos', icon: 'devices', color: 'text-violet-500' },
  { id: 'Porto Vale', label: 'Porto Vale', icon: 'shield', color: 'text-primary' },
]

const PRODUTOS = [
  // Variados (10)
  { id: 1,  nome: 'Kit Escritório Premium',      categoria: 'Variados',                 leadcoins: 45,  icon: 'work' },
  { id: 2,  nome: 'Mochila Executiva',           categoria: 'Variados',                 leadcoins: 120, icon: 'backpack' },
  { id: 3,  nome: 'Porta-documentos Couro',      categoria: 'Variados',                 leadcoins: 80,  icon: 'folder_open' },
  { id: 4,  nome: 'Agenda Premium 2025',         categoria: 'Variados',                 leadcoins: 35,  icon: 'menu_book' },
  { id: 5,  nome: 'Caneta Executiva',            categoria: 'Variados',                 leadcoins: 25,  icon: 'edit' },
  { id: 6,  nome: 'Óculos de Sol',               categoria: 'Variados',                 leadcoins: 90,  icon: 'wb_sunny' },
  { id: 7,  nome: 'Guarda-chuva Premium',        categoria: 'Variados',                 leadcoins: 60,  icon: 'umbrella' },
  { id: 8,  nome: 'Kit Higiene Personalizado',   categoria: 'Variados',                 leadcoins: 40,  icon: 'spa' },
  { id: 9,  nome: 'Tênis Esportivo',             categoria: 'Variados',                 leadcoins: 150, icon: 'directions_run' },
  { id: 10, nome: 'Camiseta Polo',               categoria: 'Variados',                 leadcoins: 55,  icon: 'checkroom' },
  // Bebidas (8)
  { id: 11, nome: 'Red Bull Zero (2un)',          categoria: 'Bebidas',                  leadcoins: 1,   icon: 'local_bar' },
  { id: 12, nome: 'Red Bull Energy (6un)',        categoria: 'Bebidas',                  leadcoins: 8,   icon: 'local_bar' },
  { id: 13, nome: 'Kit Vinhos Finos',             categoria: 'Bebidas',                  leadcoins: 85,  icon: 'wine_bar' },
  { id: 14, nome: "Whisky Jack Daniel's",         categoria: 'Bebidas',                  leadcoins: 120, icon: 'liquor' },
  { id: 15, nome: 'Espumante Chandon',            categoria: 'Bebidas',                  leadcoins: 70,  icon: 'celebration' },
  { id: 16, nome: 'Kit Gin & Tônica',             categoria: 'Bebidas',                  leadcoins: 65,  icon: 'local_drink' },
  { id: 17, nome: 'Cerveja Artesanal (6un)',      categoria: 'Bebidas',                  leadcoins: 30,  icon: 'sports_bar' },
  { id: 18, nome: 'Coca-Cola sem Açúcar (6un)',   categoria: 'Bebidas',                  leadcoins: 15,  icon: 'local_cafe' },
  // Experiência Gastronômica (6)
  { id: 19, nome: 'Jantar para 2 – Restaurante', categoria: 'Experiência Gastronômica', leadcoins: 200, icon: 'restaurant' },
  { id: 20, nome: 'Curso de Culinária',           categoria: 'Experiência Gastronômica', leadcoins: 150, icon: 'cooking' },
  { id: 21, nome: 'Degustação de Vinhos',         categoria: 'Experiência Gastronômica', leadcoins: 180, icon: 'wine_bar' },
  { id: 22, nome: 'Brunch Especial',              categoria: 'Experiência Gastronômica', leadcoins: 120, icon: 'brunch_dining' },
  { id: 23, nome: 'Rodízio Japonês para 2',       categoria: 'Experiência Gastronômica', leadcoins: 160, icon: 'ramen_dining' },
  { id: 24, nome: 'Kit Hambúrguer Artesanal',     categoria: 'Experiência Gastronômica', leadcoins: 80,  icon: 'lunch_dining' },
  // Eletrodomésticos (7)
  { id: 25, nome: 'Alexa Echo Dot 5ª Geração',   categoria: 'Eletrodomésticos',         leadcoins: 32,  icon: 'speaker' },
  { id: 26, nome: 'Cafeteira Nespresso',          categoria: 'Eletrodomésticos',         leadcoins: 95,  icon: 'coffee_maker' },
  { id: 27, nome: 'Airfryer Philips',             categoria: 'Eletrodomésticos',         leadcoins: 110, icon: 'microwave' },
  { id: 28, nome: 'Robô Aspirador',               categoria: 'Eletrodomésticos',         leadcoins: 250, icon: 'smart_toy' },
  { id: 29, nome: 'Liquidificador Philips',       categoria: 'Eletrodomésticos',         leadcoins: 75,  icon: 'blender' },
  { id: 30, nome: 'Batedeira KitchenAid',         categoria: 'Eletrodomésticos',         leadcoins: 180, icon: 'kitchen' },
  { id: 31, nome: 'Chaleira Elétrica',            categoria: 'Eletrodomésticos',         leadcoins: 45,  icon: 'kettle' },
  // Eletroeletrônicos (10)
  { id: 32, nome: 'Smartwatch Xiaomi Watch 5',    categoria: 'Eletroeletrônicos',        leadcoins: 15,  icon: 'watch' },
  { id: 33, nome: 'Fone Bluetooth JBL',           categoria: 'Eletroeletrônicos',        leadcoins: 40,  icon: 'headphones' },
  { id: 34, nome: 'Caixa de Som JBL Go 4',        categoria: 'Eletroeletrônicos',        leadcoins: 35,  icon: 'speaker' },
  { id: 35, nome: 'Carregador sem Fio 15W',       categoria: 'Eletroeletrônicos',        leadcoins: 25,  icon: 'battery_charging_full' },
  { id: 36, nome: 'Teclado Mecânico',             categoria: 'Eletroeletrônicos',        leadcoins: 80,  icon: 'keyboard' },
  { id: 37, nome: 'Mouse Gamer RGB',              categoria: 'Eletroeletrônicos',        leadcoins: 55,  icon: 'mouse' },
  { id: 38, nome: 'Webcam Full HD 1080p',         categoria: 'Eletroeletrônicos',        leadcoins: 65,  icon: 'videocam' },
  { id: 39, nome: 'Pendrive 128GB',               categoria: 'Eletroeletrônicos',        leadcoins: 20,  icon: 'usb' },
  { id: 40, nome: 'HD Externo 1TB',               categoria: 'Eletroeletrônicos',        leadcoins: 90,  icon: 'storage' },
  { id: 41, nome: 'Headset Gamer',                categoria: 'Eletroeletrônicos',        leadcoins: 70,  icon: 'headset_mic' },
  // Porto Vale (6)
  { id: 42, nome: 'Camiseta Porto Vale',          categoria: 'Porto Vale',               leadcoins: 30,  icon: 'checkroom' },
  { id: 43, nome: 'Boné Porto Vale',              categoria: 'Porto Vale',               leadcoins: 20,  icon: 'sports' },
  { id: 44, nome: 'Caneca Porto Vale',            categoria: 'Porto Vale',               leadcoins: 15,  icon: 'coffee' },
  { id: 45, nome: 'Caderno Porto Vale',           categoria: 'Porto Vale',               leadcoins: 25,  icon: 'auto_stories' },
  { id: 46, nome: 'Mochila Porto Vale',           categoria: 'Porto Vale',               leadcoins: 85,  icon: 'backpack' },
  { id: 47, nome: 'Kit Porto Vale Premium',       categoria: 'Porto Vale',               leadcoins: 150, icon: 'card_giftcard' },
]

const PRECO_MAX_GLOBAL = Math.max(...PRODUTOS.map(p => p.leadcoins))

export default function LeadStorePage() {
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [precoMax, setPrecoMax] = useState(PRECO_MAX_GLOBAL)
  const [ordenacao, setOrdenacao] = useState('relevancia')

  const produtosFiltrados = useMemo(() => {
    let lista = PRODUTOS.filter(p => {
      const matchCat   = categoria === 'Todos' || p.categoria === categoria
      const matchBusca = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase())
      const matchPreco = p.leadcoins <= precoMax
      return matchCat && matchBusca && matchPreco
    })
    if (ordenacao === 'menor') lista = [...lista].sort((a, b) => a.leadcoins - b.leadcoins)
    if (ordenacao === 'maior') lista = [...lista].sort((a, b) => b.leadcoins - a.leadcoins)
    if (ordenacao === 'az')    lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome))
    return lista
  }, [categoria, busca, precoMax, ordenacao])

  return (
    <Layout>
      {/* Header */}
      <header className="mb-6 animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao início
        </Link>

        {/* Leadcoins banner */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm px-5 py-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                toll
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Seu saldo de Leadcoins</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">0 <span className="text-sm font-bold text-amber-500">Leadcoins</span></p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-blue-400 hover:underline">
            <span className="material-symbols-outlined text-base">receipt_long</span>
            Ver Extrato
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-1 text-slate-900 dark:text-slate-100">
          Lead Store
        </h1>
        <p className="text-on-surface-variant dark:text-slate-400 text-base">
          Troque seus Leadcoins por produtos exclusivos.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Sidebar filtros */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm p-5 sticky top-28">
            <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">Filtros</h2>

            {/* Categorias */}
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

            {/* Faixa de preço */}
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Faixa de preço</p>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {produtosFiltrados.map(produto => (
                <ProductRevealCard
                  key={produto.id}
                  nome={produto.nome}
                  leadcoins={produto.leadcoins}
                  icon={produto.icon}
                  categoria={produto.categoria}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

