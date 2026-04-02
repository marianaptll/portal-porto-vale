export default function SegurosSection() {
  return (
    <section className="mb-16 bg-secondary-container/10 dark:bg-slate-900/50 p-5 sm:p-10 rounded-3xl border border-secondary/5 dark:border-slate-700/30">
      <div className="flex items-center gap-3 mb-8">
        <span
          className="material-symbols-outlined text-secondary dark:text-green-400 text-3xl icon-animate"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          shield_with_heart
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Seguros
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sale Launch Card */}
        <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl flex flex-col sm:flex-row items-center shadow-sm overflow-hidden group border border-outline-variant/5 dark:border-slate-700/30">
          <div className="h-40 sm:h-48 w-full sm:w-44 overflow-hidden rounded-xl shrink-0">
            <img
              alt="Insurance contract"
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFLcgMpWGmRvvVfRTcLHoLCFRGD_QoXj1WUuGQByeX3ebbBCWNr0I7aR0086IELfo2t7pUrZArnbGSzgEqyOz0dfLsz8L8SlgkJbKXmKCu5_jjK5aEMN6_GhW-VPnuKQefdsXJWLIBMVNb76LqIcBH_s_WR4wmfWyKQRlrvk5LSzcTexlnkeXcNfJ-DVY4YyD2J7kGR6zZQCboiJEsTIe1FLxPuNpHZK4CNNt31GU9peYDxfiou7nRgOIFEoVx5Ny9wfwLZZbhivc"
            />
          </div>
          <div className="p-4 sm:p-8 flex-1">
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              Lançamento de vendas - Seguros
            </h3>
            <p className="text-on-surface-variant dark:text-slate-400 text-sm mb-6">
              Lance as vendas de seguros.
            </p>
            <button className="flex items-center gap-2 text-secondary dark:text-green-400 font-bold hover:gap-3 transition-all">
              Iniciar registro{' '}
              <span className="material-symbols-outlined text-sm icon-animate">add_circle</span>
            </button>
          </div>
        </div>

        {/* Lead Referral Card */}
        <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl flex flex-col sm:flex-row items-center shadow-sm overflow-hidden group border border-outline-variant/5 dark:border-slate-700/30">
          <div className="h-40 sm:h-48 w-full sm:w-44 overflow-hidden rounded-xl shrink-0">
            <img
              alt="Connecting people"
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXKu2LtA-XauroxgAyf8pKJG-Uq0D4_Woph5VPT-fC0-Y6NvJXk4703PMFPyJ3EuLZjVBHb1oHqtA6MgM0bI0_jqmVmjpu1462UMV1uQ3CNvCGV5Y9qw9YsXZEgb4Dd7BkKu1PO0J7u7Ui0ZIlQeKIWYC82XLkbgldfOm8y1NejbhQ8kpaqfaHMfGhb9BGVUcN54JUBM6zCOu-Z6E00rKoq0R198e0FraXXBlgcn2nIbAEOP7BKuz3MWdMnvQjmutr0_QiO8vVEZk"
            />
          </div>
          <div className="p-4 sm:p-8 flex-1">
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              Indicação de Leads - Seguros
            </h3>
            <p className="text-on-surface-variant dark:text-slate-400 text-sm mb-6">
              Indique leads para a equipe.
            </p>
            <button className="flex items-center gap-2 text-secondary dark:text-green-400 font-bold hover:gap-3 transition-all">
              Enviar indicação{' '}
              <span className="material-symbols-outlined text-sm icon-animate">group_add</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
