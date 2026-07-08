// Tema de campanha embutido no app. Igual a qualquer tema criado pelo admin:
// nome + logo + banner + cor de destaque (header/abas/botões), com uma
// segunda cor opcional só pros cards de ferramenta — o resto é calculado
// pelo themeEngine.
export const BUILT_IN_THEME = {
  id: 'arena-country',
  name: 'Arena Country',
  logo: '/illustrations/logo_portal_pv_campanha.png',
  bannerImage: '/illustrations/fundo_banner_arena.png',
  bannerFocalPoint: { x: 65, y: 50 },
  bannerZoom: 1,
  mascotImage: '/illustrations/lead_cachorro_cowboy.png',
  mascotPosition: { x: 78, y: 62 },
  mascotScale: 1,
  decorations: [
    { id: 'horseshoes', name: 'Ferraduras', image: '/illustrations/ferraduras.png', position: { x: 92, y: 68 }, scale: 1 },
  ],
  layerOrder: ['mascot', 'horseshoes'],
  textureEnabled: true,
  textureOpacity: 0.7,
  accent: '#7c4a2d',
  toolAccent: '#c2410c',
}
