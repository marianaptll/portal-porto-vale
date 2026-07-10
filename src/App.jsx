import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext'
import { CampaignThemeProvider } from './context/CampaignThemeContext'
import { ViewAsProvider } from './context/ViewAsContext'
import { ProdutosProvider } from './context/ProdutosContext'
import { CarrinhoProvider } from './context/CarrinhoContext'
import Home from './pages/Home'
import SegurosPage from './pages/SegurosPage'
import AdminPage from './pages/AdminPage'
import AcompanharSolicitacaoPage from './pages/AcompanharSolicitacaoPage'
import NovoTicketGrePage from './pages/NovoTicketGrePage'
import NovoTicketFinanceiroPage from './pages/NovoTicketFinanceiroPage'
import LeadStorePage from './pages/LeadStorePage'
import CarrinhoPage from './pages/CarrinhoPage'
import GerenciarLojaPage from './pages/GerenciarLojaPage'
import CriarTemaPage from './pages/CriarTemaPage'
import TicketModal from './components/TicketModal'
import PedidoComprasModal from './components/PedidoComprasModal'

export default function App() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isPedidoComprasOpen, setIsPedidoComprasOpen] = useState(false)

  return (
    <DarkModeProvider>
      <CampaignThemeProvider>
      <ViewAsProvider>
      <ProdutosProvider>
      <CarrinhoProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOpenTicket={() => setIsTicketModalOpen(true)}
                onOpenPedidoCompras={() => setIsPedidoComprasOpen(true)}
              />
            }
          />
          <Route path="/seguros" element={<SegurosPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/solicitacoes" element={<AcompanharSolicitacaoPage onOpenTicket={() => setIsTicketModalOpen(true)} />} />
          <Route path="/tickets/gre" element={<NovoTicketGrePage />} />
          <Route path="/tickets/financeiro" element={<NovoTicketFinanceiroPage />} />
          <Route path="/leadstore" element={<LeadStorePage />} />
          <Route path="/leadstore/carrinho" element={<CarrinhoPage />} />
          <Route path="/leadstore/gerenciar" element={<GerenciarLojaPage />} />
          <Route path="/temas/criar" element={<CriarTemaPage />} />
          <Route path="/temas/editar/:id" element={<CriarTemaPage />} />
        </Routes>
        <TicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
        />
        <PedidoComprasModal
          isOpen={isPedidoComprasOpen}
          onClose={() => setIsPedidoComprasOpen(false)}
        />
      </BrowserRouter>
      </CarrinhoProvider>
      </ProdutosProvider>
      </ViewAsProvider>
      </CampaignThemeProvider>
    </DarkModeProvider>
  )
}
