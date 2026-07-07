import Header from './Header'
import Footer from './Footer'
import { useCampaignTheme } from '../context/CampaignThemeContext'
import { useDarkMode } from '../context/DarkModeContext'
import { buildTextureStyle } from '../utils/themeEngine'

export default function Layout({ children }) {
  const { isCampaignTheme, activeTheme } = useCampaignTheme()
  const { isDark } = useDarkMode()

  return (
    <div
      className={`text-on-surface dark:text-slate-100 min-h-screen flex flex-col ${
        isCampaignTheme ? '' : 'bg-surface dark:bg-slate-950'
      }`}
      style={
        isCampaignTheme
          ? {
              backgroundColor: isDark ? activeTheme.pageBgDark : activeTheme.pageBgLight,
              ...(activeTheme.textureEnabled ? buildTextureStyle(activeTheme.textureOpacity) : {}),
            }
          : undefined
      }
    >
      <Header />
      <main className="max-w-7xl mx-auto w-full pt-24 sm:pt-28 px-4 sm:px-6 pb-8 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
