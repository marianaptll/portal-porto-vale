import { Link, NavLink } from 'react-router-dom'
import { useDarkMode } from '../context/DarkModeContext'
import ThemeToggle from './ThemeToggle'
import { House, Trophy, Shield, Settings } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Início', icon: House },
  { to: '/rankings', label: 'Rankings', icon: Trophy },
  { to: '/seguros', label: 'Seguros', icon: Shield },
  { to: '/admin', label: 'Administrativo', icon: Settings },
]

export default function Header() {
  const { isDark, toggleDark } = useDarkMode()

  return (
    <nav className="fixed top-0 w-full flex items-center px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 shadow-sm border-b border-outline-variant/10 dark:border-slate-700/30">
      {/* Logo — esquerda */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400">
          Portal Porto Vale
        </Link>
      </div>

      {/* Desktop nav links — centro */}
      <div className="hidden lg:flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-100'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={15}
                  strokeWidth={2}
                  className={isActive ? 'text-blue-700 dark:text-blue-400' : 'opacity-60'}
                  aria-hidden="true"
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-end gap-2">
        <ThemeToggle />

        <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 cursor-pointer p-2 hover:bg-surface-container dark:hover:bg-slate-800 rounded-full transition-colors icon-animate">
          notifications
        </span>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">Mariana</span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Perfil: Administrativo</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-container overflow-hidden ring-2 ring-white dark:ring-slate-700 shadow-sm">
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO0HD5tKlJK4wdWbQSoY94wOeuMTZyWY74TZQwKMOyrhFZ0TUK93i9nmzvj2hw_nOyTpV3Y4xrxFrZFQ15FtTdVKmNOl9rfHXbs037axbpJk2Jd5DBNWFmI8WMkhRaS7Q_Zf40pp_yhXn4j5bguz-vXuwAGhvxXZwHCADnTKu3yxTEgyqJ8DfDpQgchJeLXjOfUC-qtYkM03T2b4QfoUHYsYYMwOfyGVPJhH7_xEm22y1uZXECbpwBC3UafbNe3VQSSQJA5JJO1jQ"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
