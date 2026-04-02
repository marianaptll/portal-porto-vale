import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const TIPOS = ['Todos', 'Suporte GRE', 'Apoio Jacareí']

const STATUS_OPTIONS = ['Todos', 'Aberto', 'Em andamento', 'Concluído']

// Dados simulados — trocar por fetch real futuramente
const MOCK_TICKETS = []

export default function AcompanharSolicitacaoPage() {
  const [tipoAtivo, setTipoAtivo] = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [responsavelFiltro, setResponsavelFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')

  const ticketsFiltrados = MOCK_TICKETS.filter(t => {
    const matchTipo = tipoAtivo === 'Todos' || t.tipo === tipoAtivo
    const matchStatus = statusFiltro === 'Todos' || t.status === statusFiltro
    const matchBusca =
      busca === '' ||
      t.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
      t.motivo.toLowerCase().includes(busca.toLowerCase())
    return matchTipo && matchStatus && matchBusca
  })

  const total = MOCK_TICKETS.length
  const pendentes = MOCK_TICKETS.filter(t => t.status === 'Aberto' || t.status === 'Em andamento').length
  const concluidos = MOCK_TICKETS.filter(t => t.status === 'Concluído').length

  return (
    <Layout>
      {/* Header */}
      <header className="mb-8 animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao início
        </Link>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          Minhas Solicitações
        </h1>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Total de Solicitações', value: total, color: 'text-primary dark:text-blue-400' },
          { label: 'Solicitações Pendentes', value: pendentes, color: 'text-amber-500 dark:text-amber-400' },
          { label: 'Concluídas', value: concluidos, color: 'text-secondary dark:text-green-400' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-outline-variant/10 dark:border-slate-700/30 flex flex-col items-center text-center"
          >
            <span className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{value}</span>
            <span className="text-[10px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-1 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Banner info + filtros de tipo */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 p-4 sm:p-6 mb-4 animate-fade-in-up flex flex-col sm:flex-row sm:items-center gap-4" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-4 flex-1">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary dark:text-blue-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              confirmation_number
            </span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Acompanhe o andamento das suas solicitações
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-400">
              Veja abaixo suas solicitações e acompanhe a resposta do nosso time especializado.
            </p>
          </div>
        </div>

        {/* Filtro de tipo */}
        <div className="flex flex-col gap-1.5 sm:items-end shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filtrar por tipo
          </span>
          <div className="flex gap-2 flex-wrap">
            {TIPOS.map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoAtivo(tipo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tipoAtivo === tipo
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {/* Busca */}
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Pesquise pelo protocolo ou motivo da solicitação"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-outline-variant/20 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Filtro status */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-outline-variant/20 dark:border-slate-700 rounded-xl px-3 py-2.5">
          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-base">tune</span>
          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer"
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Filtro responsável */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-outline-variant/20 dark:border-slate-700 rounded-xl px-3 py-2.5">
          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-base">person</span>
          <select
            value={responsavelFiltro}
            onChange={e => setResponsavelFiltro(e.target.value)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer"
          >
            <option>Todos</option>
          </select>
        </div>
      </div>

      {/* Lista de tickets */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Confira aqui seus tickets</h3>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 overflow-hidden">
          {ticketsFiltrados.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                description
              </span>
              <h4 className="text-base font-bold text-slate-600 dark:text-slate-400 mb-1">Nenhum ticket encontrado</h4>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm">
                Você ainda não abriu ou não possui tickets que correspondam ao filtro selecionado.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Abrir novo ticket
              </Link>
            </div>
          ) : (
            /* Ticket list */
            <ul className="divide-y divide-outline-variant/10 dark:divide-slate-700/30">
              {ticketsFiltrados.map(ticket => (
                <TicketRow key={ticket.protocolo} ticket={ticket} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  )
}

function StatusBadge({ status }) {
  const map = {
    'Aberto': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'Em andamento': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    'Concluído': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function TicketRow({ ticket }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-surface-container-low dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-primary dark:text-blue-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            confirmation_number
          </span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{ticket.motivo}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">#{ticket.protocolo} · {ticket.tipo} · {ticket.data}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:shrink-0 pl-13 sm:pl-0">
        <StatusBadge status={ticket.status} />
        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-base">chevron_right</span>
      </div>
    </li>
  )
}
