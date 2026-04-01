const adminItems = [
  { icon: 'folder_shared',    label: 'Documentos',               description: 'Acesse os documentos da empresa.' },
  { icon: 'support_agent',    label: 'Painel de Suporte - GRE',  description: 'Gerencie os tickets de suporte.' },
  { icon: 'location_on',      label: 'Painel de Apoio Jacareí',  description: 'Gerencie os tickets de apoio.' },
  { icon: 'analytics',        label: 'Painel de Pós-Contemplação', description: 'Gerencie os tickets de pós-contemplação.' },
  { icon: 'inventory',        label: 'Painel de Compras',         description: 'Gerencie os pedidos de compras.' },
  { icon: 'corporate_fare',   label: 'Gestor Organizacional',     description: 'Gerencie a estrutura organizacional e colaboradores.' },
]

export default function AdminSection() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-2xl icon-animate">
          admin_panel_settings
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
          Administrativo
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {adminItems.map(({ icon, label, description }) => (
          <a
            key={label}
            className="bg-surface-container/50 dark:bg-slate-800/60 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all text-center group border border-outline-variant/5 dark:border-slate-700/30"
            href="#"
          >
            <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors text-3xl icon-animate">
              {icon}
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">{description}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
