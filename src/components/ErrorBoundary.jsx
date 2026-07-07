import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-slate-950 p-6">
        <div className="max-w-sm text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Algo deu errado</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ocorreu um erro inesperado. Recarregue a página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
          >
            Recarregar
          </button>
        </div>
      </div>
    )
  }
}
