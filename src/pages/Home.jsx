import { useState } from 'react'
import Layout from '../components/Layout'
import WelcomeBanner from '../components/WelcomeBanner'
import ToolsExplorer from '../components/ToolsExplorer'

export default function Home({ onOpenTicket, onOpenPedidoCompras }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Layout>
      <WelcomeBanner searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <ToolsExplorer
        searchQuery={searchQuery}
        onOpenTicket={onOpenTicket}
        onOpenPedidoCompras={onOpenPedidoCompras}
      />
    </Layout>
  )
}
