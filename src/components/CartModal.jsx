import { useState } from 'react'
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, MapPin, Coins, AlertTriangle } from 'lucide-react'

const formatBRL = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`

export default function CartModal({ isOpen, onClose, itens, onRemover, onAlterar, saldoLeadcoins = 0, modo = 'campanha' }) {
  const [step, setStep] = useState(1)
  const [localRetirada, setLocalRetirada] = useState('sjc')

  if (!isOpen) return null

  const isLoja = modo === 'loja'
  const total = isLoja
    ? itens.reduce((acc, i) => acc + (i.preco ?? 0) * i.quantidade, 0)
    : itens.reduce((acc, i) => acc + i.leadcoins * i.quantidade, 0)
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)
  const saldoSuficiente = isLoja ? true : saldoLeadcoins >= total

  const formatTotal = (v) => isLoja ? formatBRL(v) : `${v} Leadcoins`
  const formatItem  = (item) => isLoja ? formatBRL((item.preco ?? 0) * item.quantidade) : `${item.leadcoins * item.quantidade} LC`

  const handleClose = () => {
    setStep(1)
    setLocalRetirada('sjc')
    onClose()
  }

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
        <div className="p-4 sm:p-5 border-b border-outline-variant/10 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {step === 1 && 'Minha Sacola'}
              {step === 2 && 'Confirmar Pedido'}
              {step === 3 && 'Pedido Enviado!'}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {step === 1 && `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} · ${formatTotal(total)}`}
              {step === 2 && 'Revise seu pedido antes de confirmar'}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

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
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-300 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1">{item.nome}</p>
                        <p className={`text-xs font-bold mt-0.5 ${isLoja ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary dark:text-blue-400'}`}>
                          {formatItem(item)}
                        </p>
                      </div>
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

          {/* Step 2 — Confirmação */}
          {step === 2 && (
            <div className="space-y-4">

              {/* Itens do pedido */}
              <div className="bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Itens do pedido</p>
                {itens.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300 line-clamp-1 flex-1 mr-2">{item.nome} ×{item.quantidade}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 shrink-0">{formatItem(item)}</span>
                  </div>
                ))}
              </div>

              {/* Local de Retirada */}
              <div className="bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Local de Retirada</p>
                </div>
                <div className="space-y-2">
                  {[
                    { value: 'sjc', label: 'São José dos Campos' },
                    { value: 'sp', label: 'São Paulo' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${localRetirada === opt.value ? 'border-primary' : 'border-slate-300 dark:border-slate-500'}`}>
                        {localRetirada === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <input
                        type="radio"
                        name="local"
                        value={opt.value}
                        checked={localRetirada === opt.value}
                        onChange={() => setLocalRetirada(opt.value)}
                        className="sr-only"
                      />
                      <span className={`text-sm font-medium transition-colors ${localRetirada === opt.value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Forma de Pagamento */}
              {isLoja ? (
                <div className="bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Forma de Pagamento</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pagamento na retirada</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Aceitamos dinheiro, cartão de débito e crédito no ato da retirada do pedido.
                  </p>
                </div>
              ) : (
                <div className="bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Forma de Pagamento</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pagamento com Saldo de Leadcoins</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Produtos de campanha só podem ser comprados com Leadcoins
                  </p>
                  <div className="border-t border-outline-variant/10 dark:border-slate-700 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Saldo Disponível:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{saldoLeadcoins} Leadcoins</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Necessário para compra:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{total} Leadcoins</span>
                    </div>
                    {!saldoSuficiente && (
                      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl px-3 py-2 mt-1">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <p className="text-xs font-semibold">Saldo insuficiente para finalizar a compra.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center px-1">
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">TOTAL A PAGAR:</span>
                <span className={`font-extrabold text-base ${isLoja ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary dark:text-blue-400'}`}>
                  {formatTotal(total)}
                </span>
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
                    <span className="font-bold text-slate-700 dark:text-slate-200">{formatItem(item)}</span>
                  </div>
                ))}
                <div className="border-t border-outline-variant/10 dark:border-slate-700 pt-2 mt-1 flex justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Total</span>
                  <span className={`font-extrabold ${isLoja ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary dark:text-blue-400'}`}>
                    {formatTotal(total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 shrink-0">
          {step === 1 && (
            <div className="flex justify-between items-center gap-3">
              <button onClick={handleClose} className="px-3 sm:px-5 py-3 font-bold text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 transition-colors text-sm sm:text-base">
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
                onClick={() => setStep(3)}
                disabled={!saldoSuficiente}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saldoSuficiente ? 'Confirmar pedido' : 'Saldo insuficiente'}
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
