import { useEffect } from 'react'
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

export default function RankingSection() {
  useSpotlight()

  return (
    <>

      <div className="flex flex-col xl:flex-row gap-6 mb-10">
        {/* Ranking Campanha Banner - Futebol */}
        <div
          data-glow
          className="rankings-banner-football grain rounded-3xl xl:w-1/3 flex flex-col justify-end shadow-xl relative group animate-fade-in-up overflow-visible"
          style={{ animationDelay: '0.1s', minHeight: '300px', '--base': 120, '--spread': 80 }}
        >
          {/* Gramado decorativo */}
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-10 pointer-events-none rounded-b-3xl"
            style={{ background: 'repeating-linear-gradient(90deg, #fff 0px, #fff 30px, transparent 30px, transparent 60px)' }}
          />

          {/* Ilustração lead_copa */}
          <div className="hidden sm:block absolute -left-10 -bottom-3 pointer-events-none z-10 transition-transform duration-500 group-hover:-translate-y-1">
            <img
              src="/illustrations/lead_copa.png"
              alt=""
              style={{ height: '300px' }}
              className="w-auto object-contain object-bottom drop-shadow-xl"
            />
          </div>

          {/* Conteúdo */}
          <div className="relative z-20 flex flex-col justify-between h-full p-6 sm:p-8 sm:pl-48" style={{ minHeight: '300px' }}>
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-200 text-[11px] font-black uppercase tracking-[0.2em]">We are Porto Vale</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">Ranking Campanha</h3>
            </div>

            <a
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md px-5 py-3 rounded-xl inline-flex items-center gap-3 text-white font-bold transition-all border border-white/20 hover:scale-[1.02] group/item shadow-sm self-start whitespace-nowrap"
              href="#"
            >
              <span className="material-symbols-outlined text-lg group-hover/item:animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
              Acessar
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Rankings de Desempenho Banner */}
        <div
          data-glow
          className="rounded-3xl xl:w-2/3 shadow-xl relative overflow-visible group animate-fade-in-up"
          style={{ animationDelay: '0.2s', '--base': 220, '--spread': 180 }}
        >
          {/* Fundo com bordas arredondadas corretas */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
            style={{
              backgroundImage: 'url(/illustrations/bg-azul.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-blue-950/60" />
            {/* Granulado */}
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '180px 180px',
              opacity: 0.50,
              mixBlendMode: 'overlay',
            }} />
          </div>

          {/* Ilustração troféus — lado esquerdo */}
          <div className="hidden sm:block absolute -left-6 -bottom-32 pointer-events-none z-10 transition-transform duration-500 group-hover:-translate-y-1" style={{ height: '100%' }}>
            <img
              src="/illustrations/trofeus.png"
              alt=""
              style={{ height: '100%', maxHeight: '180px' }}
              className="w-auto object-contain object-bottom drop-shadow-xl"
            />
          </div>

          {/* Conteúdo */}
          <div className="relative z-20 flex flex-col justify-between h-full p-6 sm:pl-52 sm:pb-6 w-full">
            <div className="mb-4 pt-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-0.5">Rankings de Desempenho</h3>
              <p className="text-blue-200 text-[11px] font-black uppercase tracking-[0.2em]">Acesse os rankings e acompanhe a performance</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-2">
              {[
                { icon: 'corporate_fare', label: 'Superintendências' },
                { icon: 'military_tech', label: 'Diretor' },
                { icon: 'person_star', label: 'Gerente' },
                { icon: 'calendar_month', label: 'Trimestral' },
              ].map(({ icon, label }) => (
                <GlowButton key={label} icon={icon} label={label} />
              ))}
              <GlowButton icon="dashboard" label="Dashboard - performance líderes" fullWidth />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
