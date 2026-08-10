export const bingouTheme = {
  id: 'bingou',
  name: 'Bingou',
  logo: '/illustrations/logo_portal_pv_campanha.png',
  // Globo de bingo e a arte "BINGOU" já ficam concentrados no lado direito
  // da própria imagem — foco do banner puxado pra direita pra não cortar
  // esse conteúdo em telas mais estreitas.
  bannerImage: '/illustrations/themes/bingou/fundo_tema_bingou.png',
  bannerFocalPoint: { x: 72, y: 65 },
  bannerZoom: 1,
  // Sem Ken Burns aqui — fundo parado, exatamente no enquadramento definido acima.
  bannerAnimated: false,
  // Sombra do lado esquerdo (pra legibilidade do texto) em azul bem escuro em
  // vez do preto padrão, e mais suave — combina melhor com o azul da arte.
  bannerOverlayColor: '4, 16, 36',
  bannerOverlayOpacity: [0.82, 0.5],
  // Badge de data num laranja próprio (mais claro/vibrante que o da paleta
  // dos cards) em vez do azul claro padrão — cor dedicada pra não empurrar
  // o tom usado nos cards de ferramenta.
  dateBadgeColor: '251, 146, 60',
  // Imagem de fundo da página inteira, em opacidade baixa (ver Layout.jsx) —
  // quando presente, substitui o ruído genérico do "textureEnabled".
  bgImage: '/illustrations/themes/bingou/bg_bingou.png',
  bgImageOpacity: 0.22,
  bgImagePositionY: 'bottom',
  textureEnabled: true,
  textureOpacity: 0.5,
  // Azul do globo de bingo comanda header/abas/botões.
  accent: '#4587c6',
  toolAccent: null,
  // Paleta oficial da campanha Bingou — 6 cores já explícitas (sem repetir
  // nenhuma pra completar os slots) e espalhadas por matizes bem diferentes
  // entre si, tipo bolinhas de bingo: laranja, azul, verde, vermelho/rosa,
  // azul claro (esse cai na aba "Favoritos") e roxo.
  toolAccentPalette: ['#c86526', '#3f8fd1', '#4caf6d', '#d1495c', '#91d5ec', '#8b5fbf'],
  // Logo que substitui a arte padrão (Arena Porto Vale) no card em destaque
  // dos rankings — ver "themeFeaturedImage" em ToolsExplorer.jsx.
  rankingLogo: '/illustrations/themes/bingou/logo_bingou.png',
  rankingLogoPosition: 'right-20',
}
