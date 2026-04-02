import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { ProductRevealCard } from '../components/ProductRevealCard'
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

const PRODUTOS = [
  // Bebidas (13)
  { id: 1,  nome: 'Red Bull - Zero Açúcar (02un)',    categoria: 'Bebidas',                  leadcoins: 1,   icon: 'local_bar' },
  { id: 2,  nome: 'Red Bull - Normal (02un)',          categoria: 'Bebidas',                  leadcoins: 1,   icon: 'local_bar' },
  { id: 3,  nome: 'Coca Cola LN - Zero (06un)',        categoria: 'Bebidas',                  leadcoins: 3,   icon: 'local_cafe' },
  { id: 4,  nome: 'Coca Cola LN - Normal (06un)',      categoria: 'Bebidas',                  leadcoins: 3,   icon: 'local_cafe' },
  { id: 5,  nome: 'Heineken Zero 330ml (06un)',        categoria: 'Bebidas',                  leadcoins: 3,   icon: 'sports_bar' },
  { id: 6,  nome: 'Heineken LN 330ml (06un)',          categoria: 'Bebidas',                  leadcoins: 3,   icon: 'sports_bar' },
  { id: 7,  nome: 'Cerveja Budweiser LN (06un)',       categoria: 'Bebidas',                  leadcoins: 3,   icon: 'sports_bar' },
  { id: 8,  nome: 'Skol Beats (06un)',                 categoria: 'Bebidas',                  leadcoins: 4,   icon: 'sports_bar' },
  { id: 9,  nome: 'Smirnoff Ice (06un)',               categoria: 'Bebidas',                  leadcoins: 4,   icon: 'local_bar' },
  { id: 10, nome: 'Red Label 750ml',                   categoria: 'Bebidas',                  leadcoins: 6,   icon: 'liquor' },
  { id: 11, nome: 'Gin Tanqueray 750ml',               categoria: 'Bebidas',                  leadcoins: 8,   icon: 'liquor' },
  { id: 12, nome: 'Caixa de Vinho',                    categoria: 'Bebidas',                  leadcoins: 9,   icon: 'wine_bar' },
  { id: 13, nome: 'Black Label',                       categoria: 'Bebidas',                  leadcoins: 12,  icon: 'liquor' },
  // Experiência Gastronômica (8)
  { id: 14, nome: 'Vale O Boticário',                  categoria: 'Variados',                 leadcoins: 4,   icon: 'shopping_bag' },
  { id: 15, nome: 'Voucher Coco Bambu',                categoria: 'Experiência Gastronômica', leadcoins: 7,   icon: 'restaurant' },
  { id: 16, nome: 'Voucher Outback',                   categoria: 'Experiência Gastronômica', leadcoins: 7,   icon: 'restaurant' },
  { id: 17, nome: 'Voucher Hangar 13',                 categoria: 'Experiência Gastronômica', leadcoins: 7,   icon: 'restaurant' },
  { id: 18, nome: 'Aula Velocity (Voucher 1 aula)',    categoria: 'Experiência Gastronômica', leadcoins: 4,   icon: 'fitness_center' },
  { id: 19, nome: 'Hot Yoga (Voucher 1 aula)',         categoria: 'Experiência Gastronômica', leadcoins: 4,   icon: 'self_improvement' },
  { id: 20, nome: 'Ingresso Kinoplex',                 categoria: 'Experiência Gastronômica', leadcoins: 6,   icon: 'movie' },
  { id: 21, nome: 'Passaporte - Hopi Hari',            categoria: 'Experiência Gastronômica', leadcoins: 12,  icon: 'park' },
  { id: 22, nome: 'AIRBNB - Voucher',                  categoria: 'Experiência Gastronômica', leadcoins: 20,  icon: 'cottage' },
  // Eletrodomésticos (11)
  { id: 23, nome: 'Alexa - Echo Dot 5ª Geração',      categoria: 'Eletrodomésticos',         leadcoins: 32,  icon: 'speaker' },
  { id: 24, nome: 'Pipoqueira Elétrica Mondial',       categoria: 'Eletrodomésticos',         leadcoins: 10,  icon: 'kitchen' },
  { id: 25, nome: 'Sanduicheira Elétrica Britânia',    categoria: 'Eletrodomésticos',         leadcoins: 10,  icon: 'kitchen' },
  { id: 26, nome: 'Sanduicheira',                      categoria: 'Eletrodomésticos',         leadcoins: 10,  icon: 'kitchen' },
  { id: 27, nome: 'AirFryer Mondial',                  categoria: 'Eletrodomésticos',         leadcoins: 18,  icon: 'microwave' },
  { id: 28, nome: 'Cafeteira Elétrica Electrolux',     categoria: 'Eletrodomésticos',         leadcoins: 20,  icon: 'coffee_maker' },
  { id: 29, nome: 'AirFryer Oven Mondial',             categoria: 'Eletrodomésticos',         leadcoins: 43,  icon: 'microwave' },
  { id: 30, nome: 'Aspirador de Pó Mondial',           categoria: 'Eletrodomésticos',         leadcoins: 14,  icon: 'cleaning_services' },
  { id: 31, nome: 'Aspirador de Pó Robot - WAP',       categoria: 'Eletrodomésticos',         leadcoins: 50,  icon: 'smart_toy' },
  { id: 32, nome: 'Escova Secadora e Modeladora',      categoria: 'Eletrodomésticos',         leadcoins: 30,  icon: 'dry_cleaning' },
  { id: 33, nome: 'Vaporizador de Roupas Black&Decker',categoria: 'Eletrodomésticos',         leadcoins: 14,  icon: 'dry_cleaning' },
  // Eletroeletrônicos (9)
  { id: 34, nome: 'Smartwatch Xiaomi Redmi Watch 5 Active', categoria: 'Eletroeletrônicos',   leadcoins: 15,  icon: 'watch' },
  { id: 35, nome: 'Power Bank I2GO Pro Sem Fio',       categoria: 'Eletroeletrônicos',        leadcoins: 14,  icon: 'battery_charging_full' },
  { id: 36, nome: 'Power Bank Turbo i2GO',             categoria: 'Eletroeletrônicos',        leadcoins: 9,   icon: 'battery_charging_full' },
  { id: 37, nome: 'Caixa de Som JBL',                  categoria: 'Eletroeletrônicos',        leadcoins: 19,  icon: 'speaker' },
  { id: 38, nome: 'Caixa De Som Boombox',              categoria: 'Eletroeletrônicos',        leadcoins: 107, icon: 'speaker' },
  { id: 39, nome: 'Echo Show 8 Amazon',                categoria: 'Eletroeletrônicos',        leadcoins: 97,  icon: 'smart_display' },
  { id: 40, nome: 'Apple Watch SE 2ª Geração',         categoria: 'Eletroeletrônicos',        leadcoins: 127, icon: 'watch' },
  { id: 41, nome: 'Relógio Garmin Forerunner 55',      categoria: 'Eletroeletrônicos',        leadcoins: 87,  icon: 'watch' },
  { id: 42, nome: 'Smart TV Samsung 32"',              categoria: 'Eletroeletrônicos',        leadcoins: 74,  icon: 'tv' },
  // Porto Vale (8)
  { id: 43, nome: 'Bloco de Anotações',                categoria: 'Porto Vale',               leadcoins: 1,   icon: 'note' },
  { id: 44, nome: 'Caneca Louça Personalizada',        categoria: 'Porto Vale',               leadcoins: 2,   icon: 'coffee' },
  { id: 45, nome: 'Copo Sustentável 500ML',            categoria: 'Porto Vale',               leadcoins: 2,   icon: 'water_full' },
  { id: 46, nome: 'Copo Térmico 500ML',                categoria: 'Porto Vale',               leadcoins: 3,   icon: 'coffee' },
  { id: 47, nome: 'Camisa Polo Porto Vale',            categoria: 'Porto Vale',               leadcoins: 4,   icon: 'checkroom' },
  { id: 48, nome: 'Camisa Polo Baby Look',             categoria: 'Porto Vale',               leadcoins: 4,   icon: 'checkroom' },
  { id: 49, nome: 'Kit Churrasco Porto Vale (3 peças)',categoria: 'Porto Vale',               leadcoins: 7,   icon: 'outdoor_grill' },
  { id: 50, nome: 'Mochila Porto Vale',                categoria: 'Porto Vale',               leadcoins: 10,  icon: 'backpack' },
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
      {/* Hero */}
      <div
        className="w-full rounded-3xl mb-6 animate-fade-in-up relative flex items-center justify-center overflow-visible"
        style={{ minHeight: '120px' }}
      >
        {/* Fundo com overflow hidden apenas no fundo */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img src={fundoLeadStore} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Logo placeholder */}
        <div className="relative z-10 flex items-center justify-center py-8 px-6 w-full">
          <div className="w-28 h-14 rounded-xl border-2 border-dashed border-white/40 flex items-center justify-center">
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Logo</span>
          </div>
        </div>

        {/* Mascote */}
        <img
          src="/illustrations/lead-store.png"
          alt="Mascote Lead Store"
          className="absolute right-8 bottom-0 z-20 h-52 w-auto object-contain drop-shadow-xl translate-y-6"
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
          Peça aqui seus produtos favoritos da nossa lojinha e leve um pedacinho da <strong className="font-extrabold text-slate-700 dark:text-slate-200">Porto Vale</strong> com você!
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

