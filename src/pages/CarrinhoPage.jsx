import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, MapPin, AlertTriangle } from 'lucide-react'
import Layout from '../components/Layout'
import { useCarrinho } from '../context/CarrinhoContext'

const SALDO_LEADCOINS = 300

const formatBRL = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`

const ENDERECO_VAZIO = { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }
const enderecoInputClass = 'w-full mt-1 bg-white dark:bg-slate-800 border border-outline-variant/20 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20'

export default function CarrinhoPage() {
  const navigate = useNavigate()
  const { getCarrinho, removerDoCarrinho, alterarQuantidade, esvaziarCarrinho } = useCarrinho()
  // Abre direto na sacola que tem itens — se só a de loja tiver produtos, não
  // faz sentido abrir em "Campanha" mostrando uma lista vazia por padrão.
  const [modo, setModo] = useState(() =>
    getCarrinho('campanha').length === 0 && getCarrinho('loja').length > 0 ? 'loja' : 'campanha'
  )
  const [finalizado, setFinalizado] = useState(false)
  const [localRetirada, setLocalRetirada] = useState('sjc')
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO)

  const itens = getCarrinho(modo)
  const isLoja = modo === 'loja'
  const isHomeOffice = localRetirada === 'home-office'
  const total = isLoja
    ? itens.reduce((acc, i) => acc + (i.preco ?? 0) * i.quantidade, 0)
    : itens.reduce((acc, i) => acc + i.leadcoins * i.quantidade, 0)
  const saldoSuficiente = isLoja ? true : SALDO_LEADCOINS >= total
  const enderecoValido =
    !isHomeOffice || ['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'].every((campo) => endereco[campo].trim() !== '')

  const formatTotal = (v) => (isLoja ? formatBRL(v) : `${v} Leadcoins`)
  const formatItem = (item) => (isLoja ? formatBRL((item.preco ?? 0) * item.quantidade) : `${item.leadcoins * item.quantidade} LC`)

  const setCampoEndereco = (campo, valor) => setEndereco((prev) => ({ ...prev, [campo]: valor }))

  const handleFinalizar = () => {
    setFinalizado(true)
    esvaziarCarrinho(modo)
  }

  const itensCampanha = getCarrinho('campanha')
  const itensLoja = getCarrinho('loja')

  return (
    <Layout>
      <div className="mb-6 animate-fade-in-up">
        <Link
          to="/leadstore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Continuar comprando
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Carrinho de Compras
        </h1>
      </div>

      {finalizado ? (
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm p-8 flex flex-col items-center text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
            <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Pedido enviado!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-6">
            Seu pedido foi registrado com sucesso. Em breve nossa equipe entrará em contato para combinar a entrega.
          </p>
          <button
            onClick={() => navigate('/leadstore')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
          >
            Voltar à Lead Store
          </button>
        </div>
      ) : itens.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
          <ShoppingCart className="w-14 h-14 text-slate-200 dark:text-slate-600 mb-4" />
          <p className="font-bold text-slate-500 dark:text-slate-400">Sua sacola está vazia</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-6">Adicione produtos da loja para continuar.</p>
          <Link
            to="/leadstore"
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-90 transition-all"
          >
            Ir para a Lead Store
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start animate-fade-in-up">
          {/* Itens */}
          <div className="flex-1 min-w-0 w-full bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-outline-variant/10 dark:border-slate-700">
              <span
                className={`material-symbols-outlined text-lg ${isLoja ? 'text-primary' : 'text-amber-500'}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isLoja ? 'shield' : 'toll'}
              </span>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-100">
                {isLoja ? 'Loja Porto Vale' : 'Campanha'}
              </h2>
              {itensCampanha.length > 0 && itensLoja.length > 0 && (
                <div className="ml-auto flex gap-1 bg-surface-container-low dark:bg-slate-700 rounded-full p-1">
                  <button
                    onClick={() => setModo('campanha')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${modo === 'campanha' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Campanha
                  </button>
                  <button
                    onClick={() => setModo('loja')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${modo === 'loja' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Porto Vale
                  </button>
                </div>
              )}
            </div>

            {/* Cabeçalho da tabela — some no mobile */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <span>Produto</span>
              <span>Quantidade</span>
              <span className="text-right w-24">Total</span>
              <span className="w-8" />
            </div>

            <ul className="divide-y divide-outline-variant/10 dark:divide-slate-700">
              {itens.map((item) => (
                <li key={item._chave} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-300 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {item.icon}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">{item.nome}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 sm:hidden mt-0.5">{formatItem(item)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 justify-self-start sm:justify-self-auto row-start-2 col-span-2 sm:row-start-auto sm:col-span-1">
                    <button
                      onClick={() => alterarQuantidade(modo, item._chave, item.quantidade - 1)}
                      className="w-7 h-7 rounded-full bg-surface-container-low dark:bg-slate-700 border border-outline-variant/20 dark:border-slate-500 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-slate-500 dark:text-slate-300" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold text-slate-700 dark:text-slate-200">{item.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(modo, item._chave, item.quantidade + 1)}
                      className="w-7 h-7 rounded-full bg-surface-container-low dark:bg-slate-700 border border-outline-variant/20 dark:border-slate-500 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-slate-500 dark:text-slate-300" />
                    </button>
                  </div>

                  <span className="hidden sm:block text-right w-24 text-sm font-bold text-slate-700 dark:text-slate-200">
                    {formatItem(item)}
                  </span>

                  <button
                    onClick={() => removerDoCarrinho(modo, item._chave)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors justify-self-end"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-end px-5 py-4 border-t border-outline-variant/10 dark:border-slate-700">
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                SUBTOTAL: {formatTotal(total)}
              </span>
            </div>
          </div>

          {/* Resumo / Checkout */}
          <div className="w-full lg:w-96 shrink-0 bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant/10 dark:border-slate-700/30 shadow-sm p-5 space-y-4 sticky top-28">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Resumo - {isLoja ? 'Lead Store' : 'Campanha'}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Finalize seu pedido</p>
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
                  { value: 'home-office', label: 'Home Office' },
                ].map((opt) => (
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

            {/* Endereço de Entrega — só quando Home Office */}
            {isHomeOffice && (
              <div className="bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Endereço de Entrega
                </p>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Rua *</label>
                  <input
                    value={endereco.rua}
                    onChange={(e) => setCampoEndereco('rua', e.target.value)}
                    placeholder="Nome da rua / avenida"
                    className={enderecoInputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Número *</label>
                    <input
                      value={endereco.numero}
                      onChange={(e) => setCampoEndereco('numero', e.target.value)}
                      placeholder="Nº"
                      className={enderecoInputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Complemento</label>
                    <input
                      value={endereco.complemento}
                      onChange={(e) => setCampoEndereco('complemento', e.target.value)}
                      placeholder="Apto, bloco..."
                      className={enderecoInputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Bairro *</label>
                  <input
                    value={endereco.bairro}
                    onChange={(e) => setCampoEndereco('bairro', e.target.value)}
                    placeholder="Bairro"
                    className={enderecoInputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Cidade *</label>
                    <input
                      value={endereco.cidade}
                      onChange={(e) => setCampoEndereco('cidade', e.target.value)}
                      placeholder="Cidade"
                      className={enderecoInputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Estado *</label>
                    <input
                      value={endereco.estado}
                      onChange={(e) => setCampoEndereco('estado', e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                      className={enderecoInputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">CEP *</label>
                  <input
                    value={endereco.cep}
                    onChange={(e) => setCampoEndereco('cep', e.target.value)}
                    placeholder="00000-000"
                    className={enderecoInputClass}
                  />
                </div>
              </div>
            )}

            {/* Forma de Pagamento */}
            {isLoja ? (
              <div className="bg-surface-container-low dark:bg-slate-700/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Forma de Pagamento</p>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Desconto em Folha de Pagamento</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  O valor é descontado automaticamente da sua próxima folha de pagamento.
                </p>
                <div className="border-t border-outline-variant/10 dark:border-slate-700 pt-3 flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">A descontar em folha:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{formatBRL(total)}</span>
                </div>
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
                    <span className="font-bold text-slate-700 dark:text-slate-200">{SALDO_LEADCOINS} Leadcoins</span>
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

            <button
              onClick={handleFinalizar}
              disabled={!saldoSuficiente || !enderecoValido}
              className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {!saldoSuficiente ? 'Saldo insuficiente' : !enderecoValido ? 'Preencha o endereço' : 'Finalizar Pedido'}
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
