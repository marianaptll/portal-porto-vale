import { useCampaignTheme } from '../context/CampaignThemeContext'

export default function Footer() {
  const { isCampaignTheme } = useCampaignTheme()

  return (
    <footer
      className={`w-full flex justify-center items-center px-6 py-4 mt-auto border-t hidden md:flex ${
        isCampaignTheme ? 'border-black/10 dark:border-white/10' : 'bg-white dark:bg-slate-950 border-slate-200/15 dark:border-slate-800'
      }`}
    >
      <p
        className={`text-sm font-medium ${
          isCampaignTheme ? 'text-theme-accent' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        Tecnologia - Porto Vale
      </p>
    </footer>
  )
}
