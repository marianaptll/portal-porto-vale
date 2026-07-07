import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const MOTIVO_OPTIONS = ['Dúvidas sobre apólice', 'Correção de dados', 'Cancelamento', 'Outros']
const CANAL_OPTIONS = ['WhatsApp', 'Telefone', 'E-mail', 'Presencial']
const PRIORIDADE_OPTIONS = ['Baixa', 'Média', 'Alta', 'Urgente']

const onlyDigits = (value) => value.replace(/\D/g, '')

const EMPTY_MOTIVO = { tipo: '', observacoes: '' }

const EMPTY_FORM = {
  colaborador: '',
  telefone: '',
  email: '',
  nomeCliente: '',
  cpfCnpj: '',
  grupo: '',
  cota: '',
  cliente: '',
  canalOrigem: '',
  consultor: '',
  tipoSolicitacao: '',
  prioridade: '',
  descricaoDemanda: '',
  observacoesInternas: '',
}

function Label({ children }) {
  return <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{children}</label>
}

function ErrorText({ children }) {
  if (!children) return null
  return <p className="text-xs font-medium text-red-500">{children}</p>
}

function fieldBorder(error) {
  return error
    ? 'border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30'
    : 'border-transparent focus:border-primary/40 focus:ring-primary/20'
}

function TextInput({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <input
        {...props}
        className={`w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border rounded-xl px-4 py-3 text-sm focus:ring-2 transition-all outline-none placeholder:text-slate-400 ${fieldBorder(
          error
        )}`}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

function SelectInput({ label, options, placeholder, error, value, onChange, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <select
        {...props}
        value={value}
        onChange={onChange}
        className={`w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 transition-all outline-none appearance-none text-slate-500 dark:text-slate-400 ${fieldBorder(
          error
        )}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-slate-900 dark:text-slate-100">
            {option}
          </option>
        ))}
      </select>
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

function TextArea({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <textarea
        {...props}
        className={`w-full bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 border rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 transition-all outline-none placeholder:text-slate-400 ${fieldBorder(
          error
        )}`}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

function ReadOnlyField({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</span>
      <div className="w-full bg-surface-container-low dark:bg-slate-700 border border-transparent rounded-xl px-4 py-3 text-sm text-slate-400 dark:text-slate-500 flex items-center justify-between">
        {value}
        {icon && <span className="material-symbols-outlined text-base">{icon}</span>}
      </div>
    </div>
  )
}

function SectionBox({ title, children }) {
  return (
    <div className="border border-outline-variant/20 dark:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
      <h3 className="text-base font-bold text-primary dark:text-blue-400">{title}</h3>
      {children}
    </div>
  )
}

function MotivoBox({ index, motivo, error, onChange, onRemove, canRemove }) {
  return (
    <div className="bg-surface-container-lowest dark:bg-slate-900/40 border border-outline-variant/20 dark:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-800 dark:text-slate-200">Motivo {index + 1}</h4>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      <SelectInput
        label="Motivo do Ticket"
        options={MOTIVO_OPTIONS}
        placeholder="Selecione o motivo"
        value={motivo.tipo}
        onChange={(e) => onChange('tipo', e.target.value)}
        error={error.tipo}
      />

      <div className="space-y-1">
        <TextArea
          label="Observações (Obrigatório para pelo menos um motivo)"
          rows={3}
          maxLength={10000}
          placeholder="Detalhe aqui sua solicitação ou problema."
          value={motivo.observacoes}
          onChange={(e) => onChange('observacoes', e.target.value)}
          error={error.observacoes}
        />
        <p className="text-xs text-slate-400 dark:text-slate-500">Máximo de 10.000 caracteres.</p>
      </div>

      <div className="space-y-1">
        <Label>Anexar Arquivos (Opcional)</Label>
        <button
          type="button"
          className="w-full border-2 border-dashed border-outline-variant/40 dark:border-slate-600 rounded-2xl p-4 flex flex-col items-center justify-center bg-surface-container-lowest dark:bg-slate-700/50 hover:bg-surface-container/50 dark:hover:bg-slate-700 transition-all"
        >
          <span className="material-symbols-outlined text-2xl text-slate-400 dark:text-slate-500 mb-1">
            cloud_upload
          </span>
          <span className="text-sm font-bold text-primary dark:text-blue-400">Clique para selecionar arquivos</span>
        </button>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Máximo de 10 arquivos. Tamanho máximo por arquivo: 50MB.
        </p>
      </div>
    </div>
  )
}

export default function NovoTicketGrePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('gre')
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [motivos, setMotivos] = useState([EMPTY_MOTIVO])
  const [errors, setErrors] = useState({})
  const [motivoErrors, setMotivoErrors] = useState([{}])

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const updateMotivo = (index, key, value) => {
    setMotivos((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)))
    setMotivoErrors((prev) => prev.map((e, i) => (i === index ? { ...e, [key]: undefined } : e)))
  }

  const validateGre = () => {
    const newErrors = {}
    if (!formData.colaborador) newErrors.colaborador = 'Selecione um colaborador.'
    if (onlyDigits(formData.telefone).length < 10) {
      newErrors.telefone = 'Telefone inválido. Preencha o DDD e o número.'
    }
    if (!formData.nomeCliente.trim()) newErrors.nomeCliente = 'Nome do cliente é obrigatório.'
    const cpfDigits = onlyDigits(formData.cpfCnpj)
    if (cpfDigits.length !== 11 && cpfDigits.length !== 14) newErrors.cpfCnpj = 'CPF/CNPJ inválido.'
    if (!formData.grupo.trim()) newErrors.grupo = 'Grupo é obrigatório.'
    if (!formData.cota.trim()) newErrors.cota = 'Cota é obrigatória.'

    const newMotivoErrors = motivos.map(() => ({}))
    motivos.forEach((m, i) => {
      if (!m.tipo) newMotivoErrors[i].tipo = 'Selecione um motivo válido.'
    })
    if (!motivos.some((m) => m.observacoes.trim())) {
      newMotivoErrors[0].observacoes = 'Pelo menos um motivo deve ter observações preenchidas.'
    }

    setErrors(newErrors)
    setMotivoErrors(newMotivoErrors)

    return Object.keys(newErrors).length === 0 && newMotivoErrors.every((e) => Object.keys(e).length === 0)
  }

  const validateInterno = () => {
    const newErrors = {}
    if (!formData.cliente.trim()) newErrors.cliente = 'Informe o nome do cliente.'
    if (!formData.canalOrigem) newErrors.canalOrigem = 'Selecione o canal de origem.'
    if (!formData.consultor) newErrors.consultor = 'Informe o consultor responsável.'
    if (!formData.tipoSolicitacao.trim()) newErrors.tipoSolicitacao = 'Informe o tipo da solicitação.'
    if (!formData.prioridade) newErrors.prioridade = 'Selecione a prioridade.'
    if (!formData.descricaoDemanda.trim()) newErrors.descricaoDemanda = 'Descreva a demanda.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitGre = () => {
    if (validateGre()) navigate('/')
  }

  const handleSubmitInterno = () => {
    if (validateInterno()) navigate('/')
  }

  const now = new Date()
  const formattedDateTime = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

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
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
          Novo Ticket - GRE
        </h1>
      </header>

      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-700/30 overflow-hidden animate-fade-in-up">
        {/* Tabs */}
        <div className="flex shrink-0">
          <button
            onClick={() => setActiveTab('gre')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
              activeTab === 'gre'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-base">description</span>
            Ticket GRE
          </button>
          <button
            onClick={() => setActiveTab('interno')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
              activeTab === 'interno'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-base">lock</span>
            Ticket GRE Interno
          </button>
        </div>

        <div className="p-5 sm:p-8 space-y-5">
          {activeTab === 'gre' ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-blue-400 text-3xl">
                    description
                  </span>
                  <h2 className="text-2xl font-bold text-primary dark:text-blue-400">Abrir Novo Ticket</h2>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl px-4 py-2 flex items-start gap-2 shrink-0">
                  <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-lg">warning</span>
                  <div>
                    <p className="text-sm font-bold text-teal-700 dark:text-teal-400">Atenção!</p>
                    <p className="text-[11px] font-bold uppercase text-teal-600 dark:text-teal-400">
                      Abra um ticket por solicitação
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">
                Preencha o formulário abaixo para registrar seu chamado.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SelectInput
                  label="Colaborador"
                  options={['Você mesmo', 'Outro colaborador']}
                  placeholder="Selecione o colaborador"
                  value={formData.colaborador}
                  onChange={(e) => updateField('colaborador', e.target.value)}
                  error={errors.colaborador}
                />
                <TextInput
                  label="Telefone para Contato"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => updateField('telefone', e.target.value)}
                  error={errors.telefone}
                />
                <TextInput
                  label="E-mail para cópia"
                  type="email"
                  placeholder="usuario@portovaleconsorcios.com.br"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
                <TextInput
                  label="Nome do cliente"
                  type="text"
                  placeholder="Nome completo do cliente"
                  value={formData.nomeCliente}
                  onChange={(e) => updateField('nomeCliente', e.target.value)}
                  error={errors.nomeCliente}
                />
                <TextInput
                  label="CPF ou CNPJ do cliente"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpfCnpj}
                  onChange={(e) => updateField('cpfCnpj', e.target.value)}
                  error={errors.cpfCnpj}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Grupo"
                  type="text"
                  placeholder="Ex: 1234"
                  value={formData.grupo}
                  onChange={(e) => updateField('grupo', e.target.value)}
                  error={errors.grupo}
                />
                <TextInput
                  label="Cota"
                  type="text"
                  placeholder="Ex: 567"
                  value={formData.cota}
                  onChange={(e) => updateField('cota', e.target.value)}
                  error={errors.cota}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <h3 className="text-base font-bold text-primary dark:text-blue-400">Motivo(s) da Solicitação</h3>
                <button
                  type="button"
                  onClick={() => {
                    setMotivos((prev) => [...prev, EMPTY_MOTIVO])
                    setMotivoErrors((prev) => [...prev, {}])
                  }}
                  className="text-sm font-bold text-primary dark:text-blue-400 flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Adicionar Motivo
                </button>
              </div>

              <div className="space-y-4">
                {motivos.map((motivo, index) => (
                  <MotivoBox
                    key={index}
                    index={index}
                    motivo={motivo}
                    error={motivoErrors[index] || {}}
                    onChange={(key, value) => updateMotivo(index, key, value)}
                    canRemove={motivos.length > 1 && index === motivos.length - 1}
                    onRemove={() => {
                      setMotivos((prev) => prev.slice(0, -1))
                      setMotivoErrors((prev) => prev.slice(0, -1))
                    }}
                  />
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={handleSubmitGre}
                  className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  Enviar Ticket
                </button>
                <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-tight">
                  Seus dados serão tratados com confidencialidade. O tempo de resposta é uma estimativa e pode variar.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-3xl">lock</span>
                <h2 className="text-2xl font-bold text-primary dark:text-blue-400">Ticket GRE Interno</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">
                Registro de solicitação interna entre equipes.
              </p>

              <SectionBox title="Identificação do Atendimento">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ReadOnlyField label="Usuário que Abriu" value="MARIANA CARDOSO" />
                  <ReadOnlyField label="Data e Hora da Solicitação" value={formattedDateTime} icon="calendar_month" />
                  <TextInput
                    label="Cliente"
                    type="text"
                    placeholder="Nome do cliente"
                    value={formData.cliente}
                    onChange={(e) => updateField('cliente', e.target.value)}
                    error={errors.cliente}
                  />
                  <SelectInput
                    label="Canal de Origem"
                    options={CANAL_OPTIONS}
                    placeholder="Selecione o canal"
                    value={formData.canalOrigem}
                    onChange={(e) => updateField('canalOrigem', e.target.value)}
                    error={errors.canalOrigem}
                  />
                </div>
              </SectionBox>

              <SectionBox title="Consultor Responsável">
                <SelectInput
                  label="Colaborador"
                  options={['Consultor 1', 'Consultor 2']}
                  placeholder="Selecione o consultor"
                  value={formData.consultor}
                  onChange={(e) => updateField('consultor', e.target.value)}
                  error={errors.consultor}
                />
              </SectionBox>

              <SectionBox title="Detalhes da Solicitação">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Tipo da Solicitação"
                    type="text"
                    placeholder="Ex: Alteração de dados..."
                    value={formData.tipoSolicitacao}
                    onChange={(e) => updateField('tipoSolicitacao', e.target.value)}
                    error={errors.tipoSolicitacao}
                  />
                  <SelectInput
                    label="Prioridade"
                    options={PRIORIDADE_OPTIONS}
                    placeholder="Selecione a prioridade"
                    value={formData.prioridade}
                    onChange={(e) => updateField('prioridade', e.target.value)}
                    error={errors.prioridade}
                  />
                </div>
                <TextArea
                  label="Descrição da Demanda"
                  rows={3}
                  placeholder="Descreva detalhadamente a demanda..."
                  value={formData.descricaoDemanda}
                  onChange={(e) => updateField('descricaoDemanda', e.target.value)}
                  error={errors.descricaoDemanda}
                />
                <TextArea
                  label="Observações Internas"
                  rows={2}
                  placeholder="Anotações internas para a equipe (opcional)..."
                  value={formData.observacoesInternas}
                  onChange={(e) => updateField('observacoesInternas', e.target.value)}
                />
              </SectionBox>

              <button
                onClick={handleSubmitInterno}
                className="w-full bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                Abrir Ticket Interno
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
