import { arenaCountryTheme } from './themes/arenaCountry'
import { hogwartsTheme } from './themes/hogwarts'
import { bingouTheme } from './themes/bingou'

// Temas de campanha embutidos no app. Cada um é igual a um tema criado pelo
// admin: nome + logo + banner + cor de destaque (header/abas/botões), com uma
// paleta opcional só pros cards de ferramenta — o resto é calculado pelo
// themeEngine. Um arquivo por tema em ./themes/, importados e reunidos aqui.
export const BUILT_IN_THEMES = [arenaCountryTheme, hogwartsTheme, bingouTheme]

export const BUILT_IN_THEME = BUILT_IN_THEMES[0]
