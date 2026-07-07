import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const TIPOS_SOLICITACAO = [
  {
    id: 'contratos-parcelas',
    title: 'Dúvidas contratos/parcelas',
    description:
      'Parcelas faltantes, valor de parcela incorreto e demais solicitações com número de contrato vinculado.',
    icon: 'description',
  },
  {
    id: 'outras-duvidas',
    title: 'Outras Dúvidas',
    description: 'Vendedores com nível de comissão incorreto ou solicitações sem número de contrato vinculado.',
    icon: 'person',
  },
]

const EMPTY_ROW = {
  colaborador: '',
  contrato: '',
  grupoCota: '',
  parcelaRef: '',
  nomeCliente: '',
  motivo: '',
  observacoes: '',
}

const cellInputClass =
  'w-full min-w-[120px] bg-transparent border border-transparent hover:border-outline-variant/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 rounded-lg px-2 py-1.5 text-sm outline-none transition-all placeholder:text-slate-400 dark:text-slate-100'

function ContratosParcelasForm({ onBack }) {
  const [rows, setRows] = useState([EMPTY_ROW])

  const updateRow = (index, key, value) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)))
  }

  const itemCount = rows.length
  const plural = itemCount > 1

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-4"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Voltar
      </button>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 text-slate-900 dark:text-slate-100">
        Abertura de Chamado Financeiro
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Preencha os dados abaixo. Cada linha gera um chamado separado — você pode adicionar quantas precisar antes de
        enviar.
      </p>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">attach_money</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Novo Chamado Financeiro</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Todas as linhas serão agrupadas em 1 chamado — adicione quantas precisar antes de enviar.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low dark:bg-slate-900/40 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                <th className="p-2 text-left rounded-l-lg">#</th>
                <th className="p-2 text-left">Colaborador*</th>
                <th className="p-2 text-left">Nº Contrato*</th>
                <th className="p-2 text-left">Grupo / Cota*</th>
                <th className="p-2 text-left">Parcela Ref.*</th>
                <th className="p-2 text-left">Nome do Cliente*</th>
                <th className="p-2 text-left">Motivo*</th>
                <th className="p-2 text-left rounded-r-lg">Observações</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-outline-variant/10 dark:border-slate-700/30">
                  <td className="p-2 text-slate-400 dark:text-slate-500 text-center">{index + 1}</td>
                  <td className="p-2">
                    <select
                      value={row.colaborador}
                      onChange={(e) => updateRow(index, 'colaborador', e.target.value)}
                      className={`${cellInputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Selecione o colaborador</option>
                      <option value="voce">Você mesmo</option>
                      <option value="outro">Outro colaborador</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={row.contrato}
                      onChange={(e) => updateRow(index, 'contrato', e.target.value)}
                      placeholder="1234567"
                      className={cellInputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.grupoCota}
                      onChange={(e) => updateRow(index, 'grupoCota', e.target.value)}
                      placeholder="AB12/0056"
                      className={cellInputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.parcelaRef}
                      onChange={(e) => updateRow(index, 'parcelaRef', e.target.value)}
                      placeholder="1-10"
                      className={cellInputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.nomeCliente}
                      onChange={(e) => updateRow(index, 'nomeCliente', e.target.value)}
                      placeholder="Nome"
                      className={cellInputClass}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.motivo}
                      onChange={(e) => updateRow(index, 'motivo', e.target.value)}
                      placeholder="Cobrança indevida"
                      className={cellInputClass}
                    />
                  </td>
                  <td className="p-2">
                    <textarea
                      value={row.observacoes}
                      onChange={(e) => updateRow(index, 'observacoes', e.target.value)}
                      placeholder="Detalhe adicional"
                      rows={1}
                      className={`${cellInputClass} resize-y`}
                    />
                  </td>
                  <td className="p-2">
                    {rows.length > 1 && index === rows.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setRows((prev) => prev.slice(0, -1))}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, EMPTY_ROW])}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-surface-container-low dark:bg-slate-700 hover:bg-surface-container dark:hover:bg-slate-600 px-4 py-2 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Adicionar linha
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {itemCount} {plural ? 'itens' : 'item'} — {itemCount} {plural ? 'chamados serão abertos' : 'chamado será aberto'}
        </p>
        <button className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">send</span>
          Enviar Chamado
        </button>
      </div>
    </div>
  )
}

function fieldBorder(error) {
  return error
    ? 'border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30'
    : 'border-transparent focus:border-primary/40 focus:ring-primary/20'
}

function OutrasDuvidasForm({ onBack }) {
  const [nomeVendedor, setNomeVendedor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = () => {
    const newErrors = {}
    if (!nomeVendedor.trim()) newErrors.nomeVendedor = 'Informe o nome do vendedor.'
    if (!motivo.trim()) newErrors.motivo = 'Descreva o motivo.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) onBack()
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 p-6 sm:p-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">help</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100">Outras Dúvidas</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preencha os campos abaixo para registrar sua solicitação.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nome do Vendedor *</label>
            <input
              value={nomeVendedor}
              onChange={(e) => {
                setNomeVendedor(e.target.value)
                setErrors((prev) => ({ ...prev, nomeVendedor: undefined }))
              }}
              placeholder="Nome do vendedor"
              className={`w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border rounded-xl px-4 py-3 text-sm focus:ring-2 transition-all outline-none placeholder:text-slate-400 ${fieldBorder(
                errors.nomeVendedor
              )}`}
            />
            {errors.nomeVendedor && <p className="text-xs font-medium text-red-500">{errors.nomeVendedor}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Motivo *</label>
            <input
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value)
                setErrors((prev) => ({ ...prev, motivo: undefined }))
              }}
              placeholder="Descreva o motivo"
              className={`w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border rounded-xl px-4 py-3 text-sm focus:ring-2 transition-all outline-none placeholder:text-slate-400 ${fieldBorder(
                errors.motivo
              )}`}
            />
            {errors.motivo && <p className="text-xs font-medium text-red-500">{errors.motivo}</p>}
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Informações adicionais (opcional)"
            rows={3}
            className="w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border border-transparent rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:border-primary/40 focus:ring-primary/20 transition-all outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">send</span>
          Enviar Solicitação
        </button>
      </div>
    </div>
  )
}

export default function NovoTicketFinanceiroPage() {
  const [tipoSelecionado, setTipoSelecionado] = useState(null)

  return (
    <Layout>
      <header className="mb-8 animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao início
        </Link>
      </header>

      {!tipoSelecionado && (
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            Olá, MARIANA!
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8">
            Selecione o tipo de solicitação que deseja registrar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {TIPOS_SOLICITACAO.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setTipoSelecionado(tipo.id)}
                className="text-left bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">{tipo.icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">{tipo.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{tipo.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary dark:text-blue-400">
                  Abrir formulário
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tipoSelecionado === 'contratos-parcelas' && (
        <ContratosParcelasForm onBack={() => setTipoSelecionado(null)} />
      )}

      {tipoSelecionado === 'outras-duvidas' && <OutrasDuvidasForm onBack={() => setTipoSelecionado(null)} />}
    </Layout>
  )
}
