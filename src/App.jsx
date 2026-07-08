import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext'
import { CampaignThemeProvider } from './context/CampaignThemeContext'
import { ViewAsProvider } from './context/ViewAsContext'
import { ProdutosProvider } from './context/ProdutosContext'
import Home from './pages/Home'
import RankingsPage from './pages/RankingsPage'
import SegurosPage from './pages/SegurosPage'
import AdminPage from './pages/AdminPage'
import AcompanharSolicitacaoPage from './pages/AcompanharSolicitacaoPage'
import NovoTicketGrePage from './pages/NovoTicketGrePage'
import NovoTicketFinanceiroPage from './pages/NovoTicketFinanceiroPage'
import LeadStorePage from './pages/LeadStorePage'
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
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/seguros" element={<SegurosPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/solicitacoes" element={<AcompanharSolicitacaoPage onOpenTicket={() => setIsTicketModalOpen(true)} />} />
          <Route path="/tickets/gre" element={<NovoTicketGrePage />} />
          <Route path="/tickets/financeiro" element={<NovoTicketFinanceiroPage />} />
          <Route path="/leadstore" element={<LeadStorePage />} />
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
      </ProdutosProvider>
      </ViewAsProvider>
      </CampaignThemeProvider>
    </DarkModeProvider>
  )
}
