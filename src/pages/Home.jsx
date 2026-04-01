import Layout from '../components/Layout'
import RankingSection from '../components/RankingSection'
import MuralSection from '../components/MuralSection'
import QuickActions from '../components/QuickActions'

export default function Home({ onOpenTicket }) {
  return (
    <Layout>
      {/* Welcome Header */}
      <header className="mb-12 animate-fade-in-up">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          Olá, Mariana.
        </h1>
        <p className="text-on-surface-variant dark:text-slate-400 text-lg">
          Selecione uma ferramenta para continuar.
        </p>
      </header>

      {/* SECTION 1: GERAL */}
      <section className="mb-16">
        <RankingSection />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MuralSection />
          <QuickActions onOpenTicket={onOpenTicket} />
        </div>
      </section>


    </Layout>
  )
}
