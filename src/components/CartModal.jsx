import { useState } from 'react'
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, Package } from 'lucide-react'

export default function CartModal({ isOpen, onClose, itens, onRemover, onAlterar }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ nome: '', setor: '', email: '', obs: '' })

  if (!isOpen) return null

  const total = itens.reduce((acc, i) => acc + i.leadcoins * i.quantidade, 0)
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)

  const handleClose = () => {
    setStep(1)
    setForm({ nome: '', setor: '', email: '', obs: '' })
    onClose()
  }

  const handleConfirmar = () => setStep(3)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={handleClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col modal-max-height">

        {/* Progress bar */}
        <div className="w-full bg-surface-container-low dark:bg-slate-700 h-1.5 flex shrink-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
          />
        </div>

        {/* Header */}
        <div className="p-5 border-b border-outline-variant/10 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {step === 1 && 'Minha Sacola'}
              {step === 2 && 'Confirmar Pedido'}
              {step === 3 && 'Pedido Enviado!'}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {step === 1 && `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} · ${total} Leadcoins`}
              {step === 2 && 'Preencha seus dados para finalizar'}
              {step === 3 && 'Seu pedido foi registrado com sucesso'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined dark:text-slate-300">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* Step 1 — Itens */}
          {step === 1 && (
            <div>
              {itens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingCart className="w-12 h-12 text-slate-200 dark:text-slate-600 mb-4" />
                  <p className="font-bold text-slate-500 dark:text-slate-400">Sua sacola está vazia</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Adicione produtos da loja para continuar.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {itens.map(item => (
                    <li key={item.id} className="flex items-center gap-4 bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-3">
                      {/* Ícone */}
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-300 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {item.icon}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1">{item.nome}</p>
                        <p className="text-xs font-bold text-primary dark:text-blue-400 mt-0.5">
                          {item.leadcoins * item.quantidade} Leadcoins
                        </p>
                      </div>

                      {/* Controles quantidade */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onAlterar(item.id, item.quantidade - 1)}
                          className="w-7 h-7 rounded-full bg-white dark:bg-slate-600 border border-outline-variant/20 dark:border-slate-500 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-slate-500 dark:text-slate-300" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-slate-700 dark:text-slate-200">{item.quantidade}</span>
                        <button
                          onClick={() => onAlterar(item.id, item.quantidade + 1)}
                          className="w-7 h-7 rounded-full bg-white dark:bg-slate-600 border border-outline-variant/20 dark:border-slate-500 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-slate-500 dark:text-slate-300" />
                        </button>
                        <button
                          onClick={() => onRemover(item.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Step 2 — Dados */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Nome completo</label>
                  <input
                    value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Setor</label>
                  <input
                    value={form.setor}
                    onChange={e => setForm(f => ({ ...f, setor: e.target.value }))}
                    placeholder="Ex: Comercial"
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">E-mail</label>
                <input
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="seu@email.com"
                  type="email"
                  className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Observações (opcional)</label>
                <textarea
                  value={form.obs}
                  onChange={e => setForm(f => ({ ...f, obs: e.target.value }))}
                  placeholder="Alguma informação adicional?"
                  rows={3}
                  className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                />
              </div>

              {/* Resumo */}
              <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Resumo do pedido</p>
                {itens.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300 line-clamp-1 flex-1 mr-2">{item.nome} ×{item.quantidade}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 shrink-0">{item.leadcoins * item.quantidade} LC</span>
                  </div>
                ))}
                <div className="border-t border-outline-variant/10 dark:border-slate-700 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Total</span>
                  <span className="font-extrabold text-primary dark:text-blue-400">{total} Leadcoins</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Sucesso */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Pedido enviado!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Seu pedido foi registrado com sucesso. Em breve nossa equipe entrará em contato para combinar a entrega.
              </p>
              <div className="mt-6 bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-4 w-full text-left space-y-1">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Resumo</p>
                {itens.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{item.nome} ×{item.quantidade}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{item.leadcoins * item.quantidade} LC</span>
                  </div>
                ))}
                <div className="border-t border-outline-variant/10 dark:border-slate-700 pt-2 mt-1 flex justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Total</span>
                  <span className="font-extrabold text-primary dark:text-blue-400">{total} Leadcoins</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 shrink-0">
          {step === 1 && (
            <div className="flex justify-between items-center gap-4">
              <button onClick={handleClose} className="px-5 py-3 font-bold text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 transition-colors">
                Continuar comprando
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={itens.length === 0}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Finalizar pedido
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex justify-between items-center">
              <button onClick={() => setStep(1)} className="px-5 py-3 font-bold text-slate-500 dark:text-slate-300 hover:text-slate-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Voltar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={!form.nome || !form.email}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar pedido
              </button>
            </div>
          )}
          {step === 3 && (
            <button onClick={handleClose} className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all">
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
