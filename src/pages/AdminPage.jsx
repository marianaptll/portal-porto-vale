import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import AdminSection from '../components/AdminSection'

export default function AdminPage() {
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
          Administrativo
        </h1>
        <p className="text-on-surface-variant dark:text-slate-400 text-base sm:text-lg">
          Acesse painéis, documentos e gestão organizacional.
        </p>
      </header>

      <AdminSection />
    </Layout>
  )
}
