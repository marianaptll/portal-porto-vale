import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import RankingSection from '../components/RankingSection'

export default function RankingsPage() {
  return (
    <Layout>
      <header className="mb-12 animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao início
        </Link>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          Rankings
        </h1>
        <p className="text-on-surface-variant dark:text-slate-400 text-base sm:text-lg">
          Acompanhe os rankings de desempenho da equipe.
        </p>
      </header>

      <RankingSection />

      {/* Extra detail cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'trending_up', title: 'Sua posição', value: '#12', sub: 'no ranking geral' },
          { icon: 'military_tech', title: 'Melhor resultado', value: '94%', sub: 'de meta atingida' },
          { icon: 'group', title: 'Equipe', value: '38', sub: 'vendedores ativos' },
        ].map(({ icon, title, value, sub }) => (
          <div
            key={title}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-outline-variant/10 dark:border-slate-700/30 flex flex-col items-center text-center"
          >
            <span className="material-symbols-outlined text-primary dark:text-blue-400 text-4xl mb-4 icon-animate">
              {icon}
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{title}</span>
            <span className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">{sub}</span>
          </div>
        ))}
      </div>
    </Layout>
  )
}
