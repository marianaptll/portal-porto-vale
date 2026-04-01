import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/',         icon: 'grid_view',   label: 'Início',     fill: true },
  { to: '/seguros',  icon: 'shield',      label: 'Seguros',    fill: false },
  { to: '/admin',    icon: 'description', label: 'Documentos', fill: false },
  { to: '/rankings', icon: 'emoji_events',label: 'Rankings',   fill: false },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full glass-nav dark:bg-slate-900/90 flex justify-around items-center py-4 border-t border-outline-variant/10 dark:border-slate-700/30 z-50">
      {navItems.map(({ to, icon, label, fill }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center transition-colors ${
              isActive ? 'text-blue-700 dark:text-blue-400' : 'text-on-surface-variant dark:text-slate-400'
            }`
          }
        >
          <span
            className="material-symbols-outlined icon-animate"
            style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {icon}
          </span>
          <span className="text-[10px] font-bold">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
