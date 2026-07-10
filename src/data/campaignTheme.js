// Tema de campanha embutido no app. Igual a qualquer tema criado pelo admin:
// nome + logo + banner + cor de destaque (header/abas/botões), com uma
// segunda cor opcional só pros cards de ferramenta — o resto é calculado
// pelo themeEngine.
export const BUILT_IN_THEME = {
  id: 'arena-country',
  name: 'Arena Country',
  logo: '/illustrations/logo_portal_pv_campanha.png',
  // Banner único com o mascote e a decoração (ferraduras, moinho) já embutidos
  // na própria imagem — substitui o esquema antigo de banner + mascote +
  // itens decorativos como camadas separadas e arrastáveis.
  bannerImage: '/illustrations/fundo_tema_arena.jpg',
  bannerFocalPoint: { x: 65, y: 50 },
  bannerZoom: 1,
  textureEnabled: true,
  textureOpacity: 0.7,
  accent: '#7c4a2d',
  toolAccent: '#c2410c',
}
