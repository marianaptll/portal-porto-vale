import { createContext, useContext, useState } from 'react'
import imgRedbullNormal from '../assets/images/illustrations/redbull normal.png'
import imgRedbullZero from '../assets/images/illustrations/redbull zero.png'
import imgGinTanqueray from '../assets/images/illustrations/Gin Tanqueray.png'
import imgCocaZero from '../assets/images/illustrations/coca-zero.png'
import imgCocaNormal from '../assets/images/illustrations/coca-normal.png'
import imgHeinekenZero from '../assets/images/illustrations/heineken-zero.png'
import imgHeinekenNormal from '../assets/images/illustrations/heineken-normal.png'
import imgBudweiser from '../assets/images/illustrations/budweiser.png'
import imgSkolBeats from '../assets/images/illustrations/skol-beats.png'
import imgSmirnoffIce from '../assets/images/illustrations/smirnoff-ice.png'
import imgRedLabel from '../assets/images/illustrations/red-label.png'
import imgBlackLabel from '../assets/images/illustrations/black-label.png'
import imgValeBoticario from '../assets/images/illustrations/vale-boticario.png'
import imgValeVelocity from '../assets/images/illustrations/vale-velocity.png'
import imgValeHotYoga from '../assets/images/illustrations/vale-hotyoga.png'
import imgValeKinoplex from '../assets/images/illustrations/vale-kinoplex.png'
import imgValeHopiHari from '../assets/images/illustrations/vale-hopihari.png'
import imgValeAirbnb from '../assets/images/illustrations/vale-airbnb.png'
import imgAlexa from '../assets/images/illustrations/alexa.png'
import imgPipoqueira from '../assets/images/illustrations/pipoqueira-mondial.png'
import imgSanduicheiraEletrica from '../assets/images/illustrations/sanduicheira-eletrica.png'
import imgSanduicheira from '../assets/images/illustrations/sanduicheira.png'
import imgAirfryer from '../assets/images/illustrations/airfryer-mondial.png'
import imgCafeteira from '../assets/images/illustrations/cafeteira-electrolux.png'
import imgAirfryerOven from '../assets/images/illustrations/airfryer-oven.png'
import imgAspirador from '../assets/images/illustrations/aspirador.png'
import imgAspiradorWap from '../assets/images/illustrations/aspirador-wap.png'
import imgEscova from '../assets/images/illustrations/escova.png'
import imgVaporizador from '../assets/images/illustrations/vaporizador.png'
import imgSmartwatchXiomi from '../assets/images/illustrations/smartwatch-xiomi.png'
import imgTvSamsung from '../assets/images/illustrations/tv-samsung.png'
import imgBoomboxJbl from '../assets/images/illustrations/boombox-jbl.png'
import imgJbl from '../assets/images/illustrations/jbl.png'
import imgEchoShow from '../assets/images/illustrations/echo-show.png'
import imgCocoBambu from '../assets/images/illustrations/voucher-cocobambu.png'
import imgOutback from '../assets/images/illustrations/voucher-outback.png'
import imgHangar13 from '../assets/images/illustrations/voucher-hangar13.png'
import imgPoloNormal from '../assets/images/illustrations/polo-normal.png'

const PRODUTOS_BASE = [
  // Bebidas
  { id: 1,  nome: 'Red Bull - Zero Açúcar (02un)',         categoria: 'Bebidas',                  leadcoins: 1,   icon: 'local_bar',         image: imgRedbullZero,         visivel: true, objetivo: 'campanha' },
  { id: 2,  nome: 'Red Bull - Normal (02un)',               categoria: 'Bebidas',                  leadcoins: 1,   icon: 'local_bar',         image: imgRedbullNormal,       visivel: true, objetivo: 'campanha' },
  { id: 3,  nome: 'Coca Cola LN - Zero (06un)',             categoria: 'Bebidas',                  leadcoins: 3,   icon: 'local_cafe',        image: imgCocaZero,            visivel: true, objetivo: 'campanha' },
  { id: 4,  nome: 'Coca Cola LN - Normal (06un)',           categoria: 'Bebidas',                  leadcoins: 3,   icon: 'local_cafe',        image: imgCocaNormal,          visivel: true, objetivo: 'campanha' },
  { id: 5,  nome: 'Heineken Zero 330ml (06un)',             categoria: 'Bebidas',                  leadcoins: 3,   icon: 'sports_bar',        image: imgHeinekenZero,        visivel: true, objetivo: 'campanha' },
  { id: 6,  nome: 'Heineken LN 330ml (06un)',               categoria: 'Bebidas',                  leadcoins: 3,   icon: 'sports_bar',        image: imgHeinekenNormal,      visivel: true, objetivo: 'campanha' },
  { id: 7,  nome: 'Cerveja Budweiser LN (06un)',            categoria: 'Bebidas',                  leadcoins: 3,   icon: 'sports_bar',        image: imgBudweiser,           visivel: true, objetivo: 'campanha' },
  { id: 8,  nome: 'Skol Beats (06un)',                      categoria: 'Bebidas',                  leadcoins: 4,   icon: 'sports_bar',        image: imgSkolBeats,           visivel: true, objetivo: 'campanha' },
  { id: 9,  nome: 'Smirnoff Ice (06un)',                    categoria: 'Bebidas',                  leadcoins: 4,   icon: 'local_bar',         image: imgSmirnoffIce,         visivel: true, objetivo: 'campanha' },
  { id: 10, nome: 'Red Label 750ml',                        categoria: 'Bebidas',                  leadcoins: 6,   icon: 'liquor',            image: imgRedLabel,            visivel: true, objetivo: 'campanha' },
  { id: 11, nome: 'Gin Tanqueray 750ml',                    categoria: 'Bebidas',                  leadcoins: 8,   icon: 'liquor',            image: imgGinTanqueray,        visivel: true, objetivo: 'campanha' },
  { id: 12, nome: 'Caixa de Vinho',                         categoria: 'Bebidas',                  leadcoins: 9,   icon: 'wine_bar',                                         visivel: true, objetivo: 'campanha' },
  { id: 13, nome: 'Black Label',                            categoria: 'Bebidas',                  leadcoins: 12,  icon: 'liquor',            image: imgBlackLabel,          visivel: true, objetivo: 'campanha' },
  // Variados / Experiência
  { id: 14, nome: 'Vale O Boticário',                       categoria: 'Variados',                 leadcoins: 4,   icon: 'shopping_bag',      image: imgValeBoticario,       visivel: true, objetivo: 'campanha' },
  { id: 15, nome: 'Voucher Coco Bambu',                     categoria: 'Experiência Gastronômica', leadcoins: 7,   icon: 'restaurant',        image: imgCocoBambu,           visivel: true, objetivo: 'campanha' },
  { id: 16, nome: 'Voucher Outback',                        categoria: 'Experiência Gastronômica', leadcoins: 7,   icon: 'restaurant',        image: imgOutback,             visivel: true, objetivo: 'campanha' },
  { id: 17, nome: 'Voucher Hangar 13',                      categoria: 'Experiência Gastronômica', leadcoins: 7,   icon: 'restaurant',        image: imgHangar13,            visivel: true, objetivo: 'campanha' },
  { id: 18, nome: 'Aula Velocity (Voucher 1 aula)',         categoria: 'Variados',                 leadcoins: 4,   icon: 'fitness_center',    image: imgValeVelocity,        visivel: true, objetivo: 'campanha' },
  { id: 19, nome: 'Hot Yoga (Voucher 1 aula)',              categoria: 'Variados',                 leadcoins: 4,   icon: 'self_improvement',  image: imgValeHotYoga,         visivel: true, objetivo: 'campanha' },
  { id: 20, nome: 'Ingresso Kinoplex',                      categoria: 'Variados',                 leadcoins: 6,   icon: 'movie',             image: imgValeKinoplex,        visivel: true, objetivo: 'campanha' },
  { id: 21, nome: 'Passaporte - Hopi Hari',                 categoria: 'Variados',                 leadcoins: 12,  icon: 'park',              image: imgValeHopiHari,        visivel: true, objetivo: 'campanha' },
  { id: 22, nome: 'AIRBNB - Voucher',                       categoria: 'Variados',                 leadcoins: 20,  icon: 'cottage',           image: imgValeAirbnb,          visivel: true, objetivo: 'campanha' },
  // Eletrodomésticos
  { id: 24, nome: 'Pipoqueira Elétrica Mondial',            categoria: 'Eletrodomésticos',         leadcoins: 10,  icon: 'kitchen',           image: imgPipoqueira,          visivel: true, objetivo: 'campanha' },
  { id: 25, nome: 'Sanduicheira Elétrica Britânia',         categoria: 'Eletrodomésticos',         leadcoins: 10,  icon: 'kitchen',           image: imgSanduicheiraEletrica, visivel: true, objetivo: 'campanha' },
  { id: 26, nome: 'Sanduicheira',                           categoria: 'Eletrodomésticos',         leadcoins: 10,  icon: 'kitchen',           image: imgSanduicheira,        visivel: true, objetivo: 'campanha' },
  { id: 27, nome: 'AirFryer Mondial',                       categoria: 'Eletrodomésticos',         leadcoins: 18,  icon: 'microwave',         image: imgAirfryer,            visivel: true, objetivo: 'campanha' },
  { id: 28, nome: 'Cafeteira Elétrica Electrolux',          categoria: 'Eletrodomésticos',         leadcoins: 20,  icon: 'coffee_maker',      image: imgCafeteira,           visivel: true, objetivo: 'campanha' },
  { id: 29, nome: 'AirFryer Oven Mondial',                  categoria: 'Eletrodomésticos',         leadcoins: 43,  icon: 'microwave',         image: imgAirfryerOven,        visivel: true, objetivo: 'campanha' },
  { id: 30, nome: 'Aspirador de Pó Mondial',                categoria: 'Eletrodomésticos',         leadcoins: 14,  icon: 'cleaning_services', image: imgAspirador,           visivel: true, objetivo: 'campanha' },
  { id: 31, nome: 'Aspirador de Pó Robot - WAP',            categoria: 'Eletrodomésticos',         leadcoins: 50,  icon: 'smart_toy',         image: imgAspiradorWap,        visivel: true, objetivo: 'campanha' },
  { id: 32, nome: 'Escova Secadora e Modeladora',           categoria: 'Eletrodomésticos',         leadcoins: 30,  icon: 'dry_cleaning',      image: imgEscova,              visivel: true, objetivo: 'campanha' },
  { id: 33, nome: 'Vaporizador de Roupas Black&Decker',     categoria: 'Eletrodomésticos',         leadcoins: 14,  icon: 'dry_cleaning',      image: imgVaporizador,         visivel: true, objetivo: 'campanha' },
  // Eletroeletrônicos
  { id: 23, nome: 'Alexa - Echo Dot 5ª Geração',           categoria: 'Eletroeletrônicos',        leadcoins: 32,  icon: 'speaker',           image: imgAlexa,               visivel: true, objetivo: 'campanha' },
  { id: 34, nome: 'Smartwatch Xiaomi Redmi Watch 5 Active', categoria: 'Eletroeletrônicos',        leadcoins: 15,  icon: 'watch',             image: imgSmartwatchXiomi,     visivel: true, objetivo: 'campanha' },
  { id: 35, nome: 'Power Bank I2GO Pro Sem Fio',            categoria: 'Eletroeletrônicos',        leadcoins: 14,  icon: 'battery_charging_full',                            visivel: true, objetivo: 'campanha' },
  { id: 36, nome: 'Power Bank Turbo i2GO',                  categoria: 'Eletroeletrônicos',        leadcoins: 9,   icon: 'battery_charging_full',                            visivel: true, objetivo: 'campanha' },
  { id: 37, nome: 'Caixa de Som JBL',                       categoria: 'Eletroeletrônicos',        leadcoins: 19,  icon: 'speaker',           image: imgJbl,                 visivel: true, objetivo: 'campanha' },
  { id: 38, nome: 'Caixa De Som Boombox',                   categoria: 'Eletroeletrônicos',        leadcoins: 107, icon: 'speaker',           image: imgBoomboxJbl,          visivel: true, objetivo: 'campanha' },
  { id: 39, nome: 'Echo Show 8 Amazon',                     categoria: 'Eletroeletrônicos',        leadcoins: 97,  icon: 'smart_display',     image: imgEchoShow,            visivel: true, objetivo: 'campanha' },
  { id: 40, nome: 'Apple Watch SE 2ª Geração',              categoria: 'Eletroeletrônicos',        leadcoins: 127, icon: 'watch',                                            visivel: true, objetivo: 'campanha' },
  { id: 41, nome: 'Relógio Garmin Forerunner 55',           categoria: 'Eletroeletrônicos',        leadcoins: 87,  icon: 'watch',                                            visivel: true, objetivo: 'campanha' },
  { id: 42, nome: 'Smart TV Samsung 32"',                   categoria: 'Eletroeletrônicos',        leadcoins: 74,  icon: 'tv',                image: imgTvSamsung,           visivel: true, objetivo: 'campanha' },
  // Porto Vale
  { id: 43, nome: 'Bloco de Anotações',                     categoria: 'Porto Vale',               leadcoins: 1,  preco: 6.20,   icon: 'note',          visivel: true, objetivo: 'loja' },
  { id: 44, nome: 'Caneca Louça Personalizada',             categoria: 'Porto Vale',               leadcoins: 2,  preco: 28.00,  icon: 'coffee',        visivel: true, objetivo: 'loja' },
  { id: 45, nome: 'Copo Sustentável 500ML',                 categoria: 'Porto Vale',               leadcoins: 2,  preco: 12.00,  icon: 'water_full',    visivel: true, objetivo: 'loja' },
  { id: 46, nome: 'Copo Térmico 500ML',                     categoria: 'Porto Vale',               leadcoins: 3,  preco: 25.00,  icon: 'coffee',        visivel: true, objetivo: 'loja' },
  { id: 47, nome: 'Camisa Polo Porto Vale',                 categoria: 'Porto Vale',               leadcoins: 4,  preco: 59.00,  icon: 'checkroom',     image: imgPoloNormal, visivel: true, objetivo: 'loja' },
  { id: 48, nome: 'Camisa Polo Baby Look',                  categoria: 'Porto Vale',               leadcoins: 4,  preco: 59.00,  icon: 'checkroom',     image: imgPoloNormal, visivel: true, objetivo: 'loja' },
  { id: 49, nome: 'Kit Churrasco Porto Vale (3 peças)',     categoria: 'Porto Vale',               leadcoins: 7,  preco: 22.00,  icon: 'outdoor_grill', visivel: true, objetivo: 'loja' },
  { id: 50, nome: 'Mochila Porto Vale',                     categoria: 'Porto Vale',               leadcoins: 10, preco: 145.80, icon: 'backpack',      visivel: true, objetivo: 'loja' },
]

const ProdutosContext = createContext(null)

export function ProdutosProvider({ children }) {
  const [produtos, setProdutos] = useState(PRODUTOS_BASE)

  const adicionarProduto = (produto) =>
    setProdutos(prev => [...prev, { ...produto, id: Date.now(), visivel: true }])

  const removerProduto = (id) =>
    setProdutos(prev => prev.filter(p => p.id !== id))

  const toggleVisivel = (id) =>
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, visivel: !p.visivel } : p))

  const editarProduto = (id, dados) =>
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p))

  return (
    <ProdutosContext.Provider value={{ produtos, adicionarProduto, removerProduto, toggleVisivel, editarProduto }}>
      {children}
    </ProdutosContext.Provider>
  )
}

export function useProdutos() {
  return useContext(ProdutosContext)
}
