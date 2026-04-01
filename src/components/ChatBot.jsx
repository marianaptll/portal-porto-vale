import { useState, useRef, useEffect } from 'react'

const QUICK_OPTIONS = [
  {
    id: 'duvidas',
    label: 'Dúvidas frequentes',
    icon: 'help',
    children: [
      { id: 'faq1', label: 'Como abrir um ticket?', answer: 'Para abrir um ticket, clique no card "Novo ticket - GRE" na página inicial e preencha o formulário em 2 etapas com os dados do cliente e o motivo da solicitação.' },
      { id: 'faq2', label: 'Como acompanhar minha solicitação?', answer: 'Clique em "Acompanhar Solicitação" na página inicial. Você poderá visualizar o status de todos os seus chamados abertos.' },
      { id: 'faq3', label: 'Como acessar os rankings?', answer: 'Clique em "Rankings" no menu superior ou use o menu inferior no mobile. Lá você encontra os rankings de desempenho por categoria.' },
      { id: 'faq4', label: 'Como lançar uma venda de seguros?', answer: 'Acesse a seção "Seguros" no menu e clique em "Iniciar registro" no card "Lançamento de vendas - Seguros".' },
    ],
  },
  {
    id: 'solicitacao',
    label: 'Fazer uma solicitação',
    icon: 'edit_note',
    children: [
      { id: 'sol1', label: 'Sugestão de melhoria', answer: null, input: true },
      { id: 'sol2', label: 'Reportar um problema', answer: null, input: true },
      { id: 'sol3', label: 'Solicitar nova funcionalidade', answer: null, input: true },
      { id: 'sol4', label: 'Outro pedido', answer: null, input: true },
    ],
  },
]

function BotMessage({ text }) {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 shadow">
        <img src="/illustrations/avatar-lead.png" alt="Assistente" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%] shadow-sm leading-relaxed">
        {text}
      </div>
    </div>
  )
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end mb-3">
      <div className="bg-primary text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] shadow-sm leading-relaxed">
        {text}
      </div>
    </div>
  )
}

function OptionButtons({ options, onSelect }) {
  return (
    <div className="flex flex-col gap-2 mb-3 pl-9">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt)}
          className="text-left text-sm bg-white dark:bg-slate-700 border border-outline-variant/30 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-primary transition-all shadow-sm font-medium flex items-center gap-2"
        >
          {opt.icon && (
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{opt.icon}</span>
          )}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [stage, setStage] = useState('main') // main | sub | input
  const [activeParent, setActiveParent] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [inputContext, setInputContext] = useState('')
  const [hasGreeted, setHasGreeted] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])

  const pushMessages = (newMsgs) => {
    setMessages(prev => [...prev, ...newMsgs])
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (!hasGreeted) {
      setHasGreeted(true)
      setTimeout(() => {
        pushMessages([
          { id: Date.now(), type: 'bot', text: 'Olá, Mariana! 👋 Sou o assistente do Conecta. Como posso te ajudar hoje?' },
          { id: Date.now() + 1, type: 'options', options: QUICK_OPTIONS },
        ])
      }, 300)
    }
  }

  const handleClose = () => setIsOpen(false)

  const handleMainOption = (opt) => {
    pushMessages([
      { id: Date.now(), type: 'user', text: opt.label },
      { id: Date.now() + 1, type: 'bot', text: opt.id === 'duvidas' ? 'Selecione sua dúvida:' : 'Qual tipo de solicitação você deseja fazer?' },
      { id: Date.now() + 2, type: 'options', options: opt.children },
    ])
    setActiveParent(opt)
    setStage('sub')
  }

  const handleSubOption = (opt) => {
    if (opt.answer) {
      pushMessages([
        { id: Date.now(), type: 'user', text: opt.label },
        { id: Date.now() + 1, type: 'bot', text: opt.answer },
        { id: Date.now() + 2, type: 'bot', text: 'Posso ajudar com mais alguma coisa?' },
        { id: Date.now() + 3, type: 'options', options: QUICK_OPTIONS },
      ])
      setStage('main')
    } else {
      setInputContext(opt.label)
      pushMessages([
        { id: Date.now(), type: 'user', text: opt.label },
        { id: Date.now() + 1, type: 'bot', text: `Certo! Descreva abaixo sua "${opt.label}" com o máximo de detalhes possível.` },
      ])
      setStage('input')
    }
  }

  const handleSelect = (opt) => {
    if (stage === 'main') handleMainOption(opt)
    else if (stage === 'sub') handleSubOption(opt)
  }

  const handleSendInput = () => {
    if (!inputValue.trim()) return
    pushMessages([
      { id: Date.now(), type: 'user', text: inputValue },
      { id: Date.now() + 1, type: 'bot', text: `✅ Sua solicitação foi registrada com sucesso! Em breve nossa equipe entrará em contato. Referência: #${Math.floor(Math.random() * 90000) + 10000}` },
      { id: Date.now() + 2, type: 'bot', text: 'Posso ajudar com mais alguma coisa?' },
      { id: Date.now() + 3, type: 'options', options: QUICK_OPTIONS },
    ])
    setInputValue('')
    setStage('main')
  }

  const handleReset = () => {
    setMessages([])
    setStage('main')
    setActiveParent(null)
    setInputValue('')
    setHasGreeted(false)
    setIsOpen(false)
    setTimeout(() => setIsOpen(true), 50)
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-primary shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 md:bottom-6"
        style={{ boxShadow: '0 4px 24px rgba(0,27,68,0.35)' }}
        aria-label="Abrir chat"
      >
        <span
          className="material-symbols-outlined text-white transition-all"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: '26px' }}
        >
          {isOpen ? 'close' : 'support_agent'}
        </span>
      </button>

      {/* Janela do chat */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[69] w-[360px] max-w-[calc(100vw-24px)] bg-surface-container-low dark:bg-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/20 dark:border-slate-700"
          style={{ height: '520px', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="bg-primary px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img src="/illustrations/avatar-lead.png" alt="Assistente" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Assistente Conecta</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-blue-200 text-[11px]">Online agora</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-blue-200 hover:text-white transition-colors p-1"
              title="Reiniciar conversa"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0">
            {messages.map((msg) => {
              if (msg.type === 'bot') return <BotMessage key={msg.id} text={msg.text} />
              if (msg.type === 'user') return <UserMessage key={msg.id} text={msg.text} />
              if (msg.type === 'options') return <OptionButtons key={msg.id} options={msg.options} onSelect={handleSelect} />
              return null
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {stage === 'input' && (
            <div className="px-4 py-3 border-t border-outline-variant/20 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2 font-medium uppercase tracking-wide">{inputContext}</p>
              <div className="flex gap-2">
                <textarea
                  className="flex-1 bg-surface-container-low dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none border-none"
                  placeholder="Descreva sua solicitação..."
                  rows={2}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendInput() }
                  }}
                />
                <button
                  onClick={handleSendInput}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 self-end rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
