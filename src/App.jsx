import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext'
import Home from './pages/Home'
import RankingsPage from './pages/RankingsPage'
import SegurosPage from './pages/SegurosPage'
import AdminPage from './pages/AdminPage'
import TicketModal from './components/TicketModal'

export default function App() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home onOpenTicket={() => setIsTicketModalOpen(true)} />}
          />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/seguros" element={<SegurosPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <TicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
        />
      </BrowserRouter>
    </DarkModeProvider>
  )
}
