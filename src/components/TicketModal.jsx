import { useState } from 'react'

export default function TicketModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)

  if (!isOpen) return null

  const handleClose = () => {
    setStep(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="modal-overlay absolute inset-0" onClick={handleClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col modal-max-height">
        {/* Stepper Progress Bar */}
        <div className="w-full bg-surface-container-low dark:bg-slate-700 h-1.5 flex shrink-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
          <div className="h-full bg-surface-container-high dark:bg-slate-600 flex-1" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/10 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {step === 1 ? 'Abrir novo ticket' : 'Motivo da solicitação'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Preencha o formulário abaixo para registrar seu chamado.
            </p>
          </div>
          <button
            className="p-2 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full transition-colors"
            onClick={handleClose}
          >
            <span className="material-symbols-outlined dark:text-slate-300">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 rounded-xl flex items-start gap-3 mb-6">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 icon-animate">
                  warning
                </span>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                  Atenção! Abrir apenas um ticket por solicitação.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    Nome do vendedor
                  </label>
                  <input
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Nome completo"
                    type="text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    Telefone para contato
                  </label>
                  <input
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="(00) 00000-0000"
                    type="tel"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    E-mail para cópia
                  </label>
                  <input
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="seu-email@exemplo.com"
                    type="email"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    Nome do cliente
                  </label>
                  <input
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Nome do cliente final"
                    type="text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    CPF ou CNPJ do cliente
                  </label>
                  <input
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="000.000.000-00"
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                      Grupo
                    </label>
                    <input
                      className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="0000"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                      Cota
                    </label>
                    <input
                      className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="000"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Motivo 1</h3>
                <button className="text-sm font-bold text-primary dark:text-blue-400 flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-base icon-animate">add</span>
                  Adicionar novo motivo
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    Motivo do ticket
                  </label>
                  <select className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none">
                    <option disabled defaultValue="">
                      Selecione um motivo...
                    </option>
                    <option>Dúvidas sobre apólice</option>
                    <option>Correção de dados</option>
                    <option>Cancelamento</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    Observações (Obrigatório)
                  </label>
                  <textarea
                    className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                    maxLength={10000}
                    placeholder="Descreva detalhadamente sua solicitação..."
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">
                      Máximo 10.000 caracteres
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                    Anexar arquivos (Opcional)
                  </label>
                  <div className="border-2 border-dashed border-outline-variant/40 dark:border-slate-600 rounded-2xl p-4 flex flex-col items-center justify-center bg-surface-container-lowest dark:bg-slate-700/50 hover:bg-surface-container/50 dark:hover:bg-slate-700 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-2xl text-slate-400 dark:text-slate-500 mb-1 icon-animate">
                      cloud_upload
                    </span>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Clique para upload ou arraste e solte
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      Até 10 arquivos, máx 50MB cada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 shrink-0">
          {step === 1 ? (
            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
                onClick={() => setStep(2)}
              >
                Próximo passo
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <button
                  className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-2"
                  onClick={() => setStep(1)}
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Voltar
                </button>
                <button className="bg-primary text-white px-10 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all">
                  Enviar ticket
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center leading-tight">
                Seus dados serão tratados com confidencialidade. O tempo de resposta é uma estimativa
                e pode variar de acordo com a complexidade da demanda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
