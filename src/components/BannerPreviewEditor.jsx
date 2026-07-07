import { useState } from 'react'
import BannerCanvas from './BannerCanvas'
import BannerLayoutModal from './BannerLayoutModal'

export default function BannerPreviewEditor(props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Pré-visualização do banner</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        É assim que o mascote e os itens decorativos vão aparecer no banner.
      </p>

      <BannerCanvas {...props} interactive={false} />

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-primary dark:text-blue-400 bg-primary/5 hover:bg-primary/10 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">open_in_full</span>
        Ajustar posição, tamanho e alinhamento
      </button>

      <BannerLayoutModal {...props} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
