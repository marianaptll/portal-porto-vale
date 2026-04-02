import { useSpotlight } from '../hooks/useSpotlight'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Ensure global listener starts on mount
function useGlobalSpotlight() {
  const props = useSpotlight(0, 0)
  return props
}

function FloatNumbers({ hovered, color, symbol }) {
  const [items, setItems] = useState([])
  const intervalRef = useRef(null)
  const counterRef = useRef(1)

  useEffect(() => {
    if (hovered) {
      counterRef.current = 1
      setItems([])
      intervalRef.current = setInterval(() => {
        const id = Date.now()
        setItems(prev => [...prev.slice(-4), { id, value: counterRef.current++ }])
      }, 400)
    } else {
      clearInterval(intervalRef.current)
      setItems([])
      counterRef.current = 1
    }
    return () => clearInterval(intervalRef.current)
  }, [hovered])

  const renderLabel = (value) => {
    if (symbol === '✓') return '✓'
    if (symbol === '★') return '★'
    return `+${value}`
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map(n => (
        <span
          key={n.id}
          className={`absolute left-1/2 font-extrabold text-sm select-none ${color}`}
          style={{
            animation: 'floatUp 1s ease-out forwards',
            transform: 'translateX(-50%)',
            bottom: '100%',
          }}
        >
          {renderLabel(n.value)}
        </span>
      ))}
    </div>
  )
}

export default function QuickActions({ onOpenTicket, onOpenPedidoCompras }) {
  useGlobalSpotlight()
  const navigate = useNavigate()

  const [hoveredCart, setHoveredCart] = useState(false)
  const [hoveredTrack, setHoveredTrack] = useState(false)
  const [hoveredStore, setHoveredStore] = useState(false)

  return (
    <>
      {/* Novo Ticket Card */}
      <div
        data-glow
        className="card-gold grain p-8 rounded-2xl shadow-lg flex flex-col justify-between border animate-fade-in-up relative"
        style={{ animationDelay: '0.4s', '--base': 0 }}
      >
        <img
          src="/illustrations/ticket.png"
          alt="Ticket"
          className="w-12 h-12 object-contain mb-6 ticket-animate"
        />
        <div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#fde68a' }}>Novo ticket - GRE</h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#fcd34d' }}>
            Abra um novo chamado para o suporte.
          </p>
        </div>
        <button
          className="w-full rounded-full py-3 font-extrabold text-sm hover:scale-[1.03] transition-all shadow-sm"
          style={{ background: '#ffffff', color: '#7a5500' }}
          onClick={onOpenTicket}
        >
          Abrir Chamado
        </button>
      </div>

      {/* Quick Action Cards */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full">

          {/* Acompanhar Solicitação — ícone gira, checkmarks ✓ sobem */}
          <div
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 hover-green transition-all cursor-pointer group-track flex flex-col items-center justify-center text-center animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: '0.5s' }}
            onMouseEnter={() => setHoveredTrack(true)}
            onMouseLeave={() => setHoveredTrack(false)}
            onClick={() => navigate('/solicitacoes')}
          >
            <div className="relative mb-4">
              <span className="material-symbols-outlined text-red-400 dark:text-red-400 text-3xl block icon-spin-hover">
                track_changes
              </span>
              {hoveredTrack && (
                <span className="absolute -top-2 -right-2 bg-red-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  ✓
                </span>
              )}
              <FloatNumbers hovered={hoveredTrack} color="text-red-500 dark:text-red-400" symbol="✓" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Acompanhar Solicitação</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-2">
              Acompanhe o andamento dos seus tickets.
            </p>
          </div>

          {/* Pedido de Compras — carrinho chacoalha, números +1 +2 sobem */}
          <div
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 hover-purple transition-all cursor-pointer group-cart flex flex-col items-center justify-center text-center animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: '0.6s' }}
            onMouseEnter={() => setHoveredCart(true)}
            onMouseLeave={() => setHoveredCart(false)}
            onClick={onOpenPedidoCompras}
          >
            <div className="relative mb-4">
              <span className="material-symbols-outlined text-purple-400 dark:text-purple-400 text-3xl block icon-cart-hover">
                shopping_cart
              </span>
              {hoveredCart && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  +
                </span>
              )}
              <FloatNumbers hovered={hoveredCart} color="text-purple-600 dark:text-purple-400" symbol="+" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Pedido de Compras</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-2">
              Solicitar uma compra institucional.
            </p>
          </div>

          {/* Lead Store — ícone pulsa, estrelas ★ sobem */}
          <div
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 hover-gold transition-all cursor-pointer group-store flex flex-col items-center justify-center text-center animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: '0.7s' }}
            onMouseEnter={() => setHoveredStore(true)}
            onMouseLeave={() => setHoveredStore(false)}
          >
            <div className="relative mb-4">
              <span className="material-symbols-outlined text-pink-400 dark:text-pink-400 text-3xl block icon-store-hover">
                storefront
              </span>
              {hoveredStore && (
                <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  ★
                </span>
              )}
              <FloatNumbers hovered={hoveredStore} color="text-pink-500 dark:text-pink-400" symbol="★" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Lead Store</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-2">
              Compre produtos institucionais.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
