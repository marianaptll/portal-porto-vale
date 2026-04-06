import { useState } from 'react'

const SETORES = [
  'Administrativo',
  'Comercial',
  'Financeiro',
  'Marketing',
  'Operações',
  'Recursos Humanos',
  'TI',
]

const UNIDADES = [
  'Sede',
  'Filial Bauru',
  'Filial Campinas',
  'Filial Ribeirão Preto',
  'Filial São Paulo',
  'Filial Sorocaba',
]

const MATERIAIS = [
  'Brindes e presentes',
  'Equipamentos de TI',
  'Mobiliário',
  'Papelaria e escritório',
  'Serviços gráficos',
  'Uniformes e EPIs',
  'Alimentação',
  'Outros',
]

const GESTORES = [
  'Carlos Eduardo',
  'Fernanda Lima',
  'Gustavo Martins',
  'Juliana Rocha',
  'Renato Alves',
]

const TOTAL_STEPS = 3

function StepIndicator({ current, total }) {
  return (
    <div className="w-full bg-surface-container-low dark:bg-slate-700 h-1.5 flex shrink-0">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${(current / total) * 100}%` }}
      />
      <div className="h-full bg-surface-container-high dark:bg-slate-600 flex-1" />
    </div>
  )
}

const inputClass =
  'w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none'

const labelClass =
  'text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1'

export default function PedidoComprasModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)

  // Step 1 fields
  const [email] = useState('mariana.cardoso@portovaleconsorcios.com.br')
  const [solicitante, setSolicitante] = useState('')
  const [setor, setSetor] = useState('')
  const [unidade, setUnidade] = useState('')

  // Step 2 fields
  const [dataUso, setDataUso] = useState('')
  const [campanha, setCampanha] = useState('nao')
  const [brindes, setBrindes] = useState('nao')
  const [materiais, setMateriais] = useState([{ material: '', quantidade: '', especificacao: '' }])
  const [gestor, setGestor] = useState('')

  // Step 3 fields
  const [observacao, setObservacao] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    setStep(1)
    setSolicitante('')
    setSetor('')
    setUnidade('')
    setDataUso('')
    setCampanha('nao')
    setBrindes('nao')
    setMateriais([{ material: '', quantidade: '', especificacao: '' }])
    setGestor('')
    setObservacao('')
    onClose()
  }

  const addMaterial = () => {
    if (materiais.length < 5) {
      setMateriais([...materiais, { material: '', quantidade: '', especificacao: '' }])
    }
  }

  const removeMaterial = (idx) => {
    setMateriais(materiais.filter((_, i) => i !== idx))
  }

  const updateMaterial = (idx, field, value) => {
    setMateriais(materiais.map((m, i) => (i === idx ? { ...m, [field]: value } : m)))
  }

  const stepTitles = [
    'Identificação',
    'Detalhes do Pedido',
    'Finalização',
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="modal-overlay absolute inset-0" onClick={handleClose} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col modal-max-height">
        {/* Progress Bar */}
        <StepIndicator current={step} total={TOTAL_STEPS} />

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/10 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Etapa {step} de {TOTAL_STEPS}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {stepTitles[step - 1]}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Pedido de Compras
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Preencha o formulário para solicitar uma compra.
            </p>
          </div>
          <button
            className="p-2 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full transition-colors"
            onClick={handleClose}
          >
            <span className="material-symbols-outlined dark:text-slate-300">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-8 overflow-y-auto">

          {/* ── ETAPA 1: Identificação ── */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2 space-y-1">
                <label className={labelClass}>Email</label>
                <input
                  className={`${inputClass} text-slate-400 dark:text-slate-500 cursor-not-allowed`}
                  type="email"
                  value={email}
                  readOnly
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className={labelClass}>Solicitante *</label>
                <input
                  className={inputClass}
                  placeholder="Nome completo"
                  type="text"
                  value={solicitante}
                  onChange={e => setSolicitante(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Setor Solicitante *</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={setor}
                  onChange={e => setSetor(e.target.value)}
                >
                  <option value="">Selecione um setor</option>
                  {SETORES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Unidade de Destino *</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={unidade}
                  onChange={e => setUnidade(e.target.value)}
                >
                  <option value="">Selecione uma unidade</option>
                  {UNIDADES.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── ETAPA 2: Detalhes ── */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Data de uso */}
              <div className="space-y-1">
                <label className={labelClass}>A compra será utilizada em qual data? *</label>
                <input
                  className={inputClass}
                  type="date"
                  value={dataUso}
                  onChange={e => setDataUso(e.target.value)}
                />
              </div>

              {/* Radios row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className={labelClass}>Destinada a campanha ou projeto? *</label>
                  <div className="flex flex-col gap-1.5">
                    {[['sim', 'Sim'], ['nao', 'Não']].map(([val, lbl]) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="campanha"
                          value={val}
                          checked={campanha === val}
                          onChange={() => setCampanha(val)}
                          className="accent-primary"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Brindes para premiação? *</label>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="brindes"
                        value="sim"
                        checked={brindes === 'sim'}
                        onChange={() => setBrindes('sim')}
                        className="accent-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Sim <span className="text-slate-400 text-xs">(encaminhar apresentação da campanha por e-mail)</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="brindes"
                        value="nao"
                        checked={brindes === 'nao'}
                        onChange={() => setBrindes('nao')}
                        className="accent-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Não</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Materiais */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Materiais / Serviços *</label>
                  {materiais.length < 5 && (
                    <button
                      type="button"
                      onClick={addMaterial}
                      className="text-sm font-bold text-primary dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      Adicionar outro
                    </button>
                  )}
                </div>

                {materiais.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest dark:bg-slate-700/40 rounded-2xl p-4 space-y-3 border border-outline-variant/10 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Item {idx + 1}
                      </span>
                      {materiais.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMaterial(idx)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>Material / Serviço</label>
                        <select
                          className={`${inputClass} appearance-none`}
                          value={m.material}
                          onChange={e => updateMaterial(idx, 'material', e.target.value)}
                        >
                          <option value="">Selecione um material</option>
                          {MATERIAIS.map(mat => <option key={mat}>{mat}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Quantidade</label>
                        <input
                          className={inputClass}
                          placeholder="Ex: 10"
                          type="number"
                          min="1"
                          value={m.quantidade}
                          onChange={e => updateMaterial(idx, 'quantidade', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Especificação <span className="normal-case font-normal text-slate-400">(opcional)</span></label>
                      <input
                        className={inputClass}
                        placeholder="Especificar cor, tamanho, marca, etc."
                        type="text"
                        value={m.especificacao}
                        onChange={e => updateMaterial(idx, 'especificacao', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Gestor */}
              <div className="space-y-1">
                <label className={labelClass}>Aprovado por qual gestor(a)? *</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={gestor}
                  onChange={e => setGestor(e.target.value)}
                >
                  <option value="">Selecione um gestor</option>
                  {GESTORES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── ETAPA 3: Finalização ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <label className={labelClass}>Observação ou Justificativa</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  placeholder="Informe a justificativa ou observação..."
                  rows={4}
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>
                  Anexos{' '}
                  <span className="normal-case font-normal text-slate-400">(opcional)</span>
                </label>
                <p className="text-xs text-primary dark:text-blue-400 font-medium -mt-1 ml-1">
                  Faça upload de até 5 arquivos. Tamanho máximo: 10 MB por item.
                </p>
                <div className="border-2 border-dashed border-outline-variant/40 dark:border-slate-600 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center bg-surface-container-lowest dark:bg-slate-700/50 hover:bg-surface-container/50 dark:hover:bg-slate-700 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500 mb-2 icon-animate">
                    upload
                  </span>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    Clique para selecionar arquivos ou arraste aqui
                  </p>
                  <button
                    type="button"
                    className="mt-3 px-5 py-2 text-sm font-bold bg-surface-container dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-surface-container-high dark:hover:bg-slate-600 transition-all"
                  >
                    Selecionar Arquivos
                  </button>
                </div>
              </div>

              {/* Resumo rápido */}
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl p-4 space-y-1.5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Resumo do pedido</p>
                <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <p><span className="font-semibold">Solicitante:</span> {solicitante || '—'}</p>
                  <p><span className="font-semibold">Setor:</span> {setor || '—'}</p>
                  <p><span className="font-semibold">Unidade:</span> {unidade || '—'}</p>
                  <p><span className="font-semibold">Data de uso:</span> {dataUso ? new Date(dataUso + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</p>
                  <p><span className="font-semibold">Itens:</span> {materiais.filter(m => m.material).length} material(is) selecionado(s)</p>
                  <p><span className="font-semibold">Gestor aprovador:</span> {gestor || '—'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-outline-variant/10 dark:border-slate-700 bg-surface-container-low dark:bg-slate-900/40 shrink-0">
          {step === 1 && (
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
          )}

          {step === 2 && (
            <div className="flex justify-between items-center">
              <button
                className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-2"
                onClick={() => setStep(1)}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Voltar
              </button>
              <button
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
                onClick={() => setStep(3)}
              >
                Próximo passo
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <button
                  className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-2"
                  onClick={() => setStep(2)}
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Voltar
                </button>
                <button
                  className="bg-primary text-white px-10 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
                  onClick={handleClose}
                >
                  Enviar Pedido de Compras
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center leading-tight">
                Seu pedido será encaminhado ao gestor aprovador. O prazo de resposta pode variar conforme a demanda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
