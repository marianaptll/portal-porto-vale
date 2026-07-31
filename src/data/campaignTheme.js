// Temas de campanha embutidos no app. Cada um é igual a um tema criado pelo
// admin: nome + logo + banner + cor de destaque (header/abas/botões), com uma
// paleta opcional só pros cards de ferramenta — o resto é calculado pelo
// themeEngine.
export const BUILT_IN_THEMES = [
  {
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
  },
  {
    id: 'hogwarts',
    name: 'Hogwarts',
    logo: '/illustrations/logo_portal_pv_campanha_hp.png',
    // O sombreado do lado esquerdo (pra legibilidade do texto) não depende
    // dessa imagem — é uma camada própria do banner (ver WelcomeBanner.jsx),
    // então qualquer imagem trocada aqui recebe o mesmo tratamento automaticamente.
    bannerImage: '/illustrations/fundo_tema_hp1.png',
    bannerFocalPoint: { x: 50, y: 50 },
    bannerZoom: 1,
    textureEnabled: true,
    textureOpacity: 0.6,
    // Imagem de fundo da página inteira (mapa do maroto) — ver Layout.jsx.
    // Quando presente, ela substitui o ruído genérico do "textureEnabled".
    bgImage: '/illustrations/bg_sistema_completo.png',
    // Azul marinho (mais claro que um navy comum) comanda header/abas/botões e
    // também o fundo da página (derivado automaticamente pelo themeEngine).
    accent: '#2c4a78',
    toolAccent: null,
    // Paleta principal do universo mágico: azul marinho, vermelho, verde
    // bandeira, roxo, amarelo dourado e azul royal.
    toolAccentPalette: ['#0e1a40', '#dc2626', '#009739', '#6a1b9a', '#d4af37', '#4169e1'],
    // Fonte decorativa usada só nos títulos de seção e na saudação do banner
    // (ver classe "font-magic" e @font-face em globals.css) — texto corrido
    // continua nas fontes padrão, ela pesa demais pra ler em blocos de texto.
    titleFont: 'HarryP2',
    // Gif que fica voando sozinho pela tela, por cima do conteúdo (ver
    // FlyingDecoration.jsx) — pausa num ponto aleatório e voa pra outro, num
    // loop sem fim.
    flyingDecoration: '/gif_temas/pomo_deouro.gif',
    // Trilha de pegadas de tinta que atravessa a tela de vez em quando (ver
    // FootstepsTrail.jsx), igual ao mapa do maroto.
    footstepsTrail: true,
    // Logo que substitui a arte padrão (Arena Porto Vale) no card em destaque
    // dos rankings — ver "themeFeaturedImage" em ToolsExplorer.jsx.
    rankingLogo: '/illustrations/logo_ranking_campanha.png',
    // Varinha que aparece e "agita" ao clicar no botão Painel Pix (ver
    // WelcomeBanner.jsx).
    wandImage: '/gif_temas/varinha.gif',
    // Chapéu Seletor que fica em cima da aba de categoria selecionada (ver
    // ToolsExplorer.jsx).
    sortingHatGif: '/gif_temas/chapeu_seletor.gif',
  },
]

export const BUILT_IN_THEME = BUILT_IN_THEMES[0]
