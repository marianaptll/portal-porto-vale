import Header from './Header'
import Footer from './Footer'
import FlyingDecoration from './FlyingDecoration'
import FootstepsTrail from './FootstepsTrail'
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
              ...(!activeTheme.bgImage && activeTheme.textureEnabled ? buildTextureStyle(activeTheme.textureOpacity) : {}),
            }
          : undefined
      }
    >
      {isCampaignTheme && activeTheme.bgImage && (
        // Camada própria (não é o background do container de conteúdo) —
        // assim a opacidade baixa afeta só a imagem, não o texto/cards por cima.
        <div
          className="fixed inset-0 z-0 pointer-events-none animate-bg-pan"
          style={{
            backgroundImage: `url(${activeTheme.bgImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: 0.1,
          }}
        />
      )}

      <FlyingDecoration />
      <FootstepsTrail />
      <Header />
      <main className="relative z-10 max-w-7xl mx-auto w-full pt-24 sm:pt-28 px-4 sm:px-6 pb-8 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
