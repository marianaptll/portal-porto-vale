import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ChatBot from './ChatBot'

export default function Layout({ children }) {
  return (
    <div className="bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-100 min-h-screen flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto w-full pt-28 px-6 pb-8 flex-1">
        {children}
      </main>
      <Footer />
      <MobileNav />
      <ChatBot />
    </div>
  )
}
