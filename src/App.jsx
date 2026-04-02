import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext'
import Home from './pages/Home'
import RankingsPage from './pages/RankingsPage'
import SegurosPage from './pages/SegurosPage'
import AdminPage from './pages/AdminPage'
import AcompanharSolicitacaoPage from './pages/AcompanharSolicitacaoPage'
import LeadStorePage from './pages/LeadStorePage'
import TicketModal from './components/TicketModal'
import PedidoComprasModal from './components/PedidoComprasModal'

export default function App() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isPedidoComprasOpen, setIsPedidoComprasOpen] = useState(false)

  return (
    <DarkModeProvider>
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
          <Route path="/leadstore" element={<LeadStorePage />} />
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
    </DarkModeProvider>
  )
}
