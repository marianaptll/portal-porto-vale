import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SegurosSection from '../components/SegurosSection'
import { useSpotlight } from '../hooks/useSpotlight'

function GlowButton({ icon, label, fullWidth = false }) {
  return (
    <a
      href="#"
      className={`bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 text-white text-xs font-bold transition-all border border-white/20 hover:scale-[1.02] group/item ${fullWidth ? 'col-span-full' : ''}`}
    >
      <span className="material-symbols-outlined text-base group-hover/item:animate-bounce">
        {icon}
      </span>
      {label}
    </a>
  )
}

export default function SegurosPage() {
  useSpotlight()

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
          Seguros
        </h1>
        <p className="text-on-surface-variant dark:text-slate-400 text-base sm:text-lg">
          Gerencie vendas e indicações de seguros.
        </p>
      </header>

      {/* Banners de Rankings */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Campanha Seguros */}
        <div
          data-glow
          className="rounded-3xl lg:w-1/3 flex flex-col justify-end shadow-xl relative group animate-fade-in-up overflow-hidden"
          style={{
            animationDelay: '0.1s',
            minHeight: '300px',
            '--base': 120,
            '--spread': 80,
            backgroundImage: 'url(/illustrations/bg-azul2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-emerald-950/60" />
          {/* Granulado */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            opacity: 0.50,
            mixBlendMode: 'overlay',
          }} />

          {/* Ícone decorativo */}
          <div className="absolute -left-4 bottom-0 pointer-events-none z-10 transition-transform duration-500 group-hover:-translate-y-1 flex items-end h-full pb-4 pl-4">
            <span
              className="material-symbols-outlined text-white/20"
              style={{ fontSize: '160px', fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </div>

          {/* Conteúdo */}
          <div className="relative z-20 flex flex-col justify-between h-full p-5 sm:p-8 sm:pl-10" style={{ minHeight: '300px' }}>
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-200 text-[11px] font-black uppercase tracking-[0.2em]">Porto Vale Seguros</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">Ranking Campanha</h3>
            </div>

            <a
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md px-5 py-3 rounded-xl inline-flex items-center gap-3 text-white font-bold transition-all border border-white/20 hover:scale-[1.02] group/item shadow-sm self-start whitespace-nowrap"
              href="#"
            >
              <span className="material-symbols-outlined text-lg group-hover/item:animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              Acessar
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Rankings de Desempenho - Seguros */}
        <div
          data-glow
          className="rounded-3xl lg:w-2/3 shadow-xl relative overflow-visible group animate-fade-in-up"
          style={{ animationDelay: '0.2s', '--base': 220, '--spread': 180 }}
        >
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
            style={{
              backgroundImage: 'url(/illustrations/bg-azul.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-emerald-950/60" />
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '180px 180px',
              opacity: 0.50,
              mixBlendMode: 'overlay',
            }} />
          </div>

          {/* Ilustração troféus */}
          <div className="hidden sm:block absolute -left-6 -bottom-32 pointer-events-none z-10 transition-transform duration-500 group-hover:-translate-y-1" style={{ height: '100%' }}>
            <img
              src="/illustrations/trofeus.png"
              alt=""
              style={{ height: '100%', maxHeight: '180px' }}
              className="w-auto object-contain object-bottom drop-shadow-xl"
            />
          </div>

          {/* Conteúdo */}
          <div className="relative z-20 flex flex-col justify-between h-full p-5 sm:p-6 sm:pl-12 md:pl-44 lg:pl-52 w-full">
            <div className="mb-3 pt-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-0.5">Rankings de Desempenho</h3>
              <p className="text-emerald-200 text-[11px] font-black uppercase tracking-[0.2em]">Acesse os rankings e acompanhe a performance</p>
            </div>

            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2">
              <GlowButton icon="group_add" label="Indicação de seguros" />
            </div>
          </div>
        </div>
      </div>

      <SegurosSection />

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { icon: 'sell', title: 'Vendas este mês', value: '24', color: 'text-secondary dark:text-green-400' },
          { icon: 'group_add', title: 'Leads indicados', value: '11', color: 'text-primary dark:text-blue-400' },
          { icon: 'verified', title: 'Taxa de conversão', value: '46%', color: 'text-amber-600 dark:text-amber-400' },
        ].map(({ icon, title, value, color }) => (
          <div
            key={title}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/10 dark:border-slate-700/30 flex items-center gap-5"
          >
            <span className={`material-symbols-outlined text-4xl icon-animate ${color}`}>
              {icon}
            </span>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 block">{value}</span>
              <span className="text-sm text-on-surface-variant dark:text-slate-400">{title}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
