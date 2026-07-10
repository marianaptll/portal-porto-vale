import { createContext, useContext, useState } from 'react'

const CarrinhoContext = createContext(null)

// Duas sacolas independentes — campanha (paga em Leadcoins) e loja (paga em
// R$) — porque um mesmo produto nunca aparece nos dois modos ao mesmo tempo,
// mas o carrinho de cada um precisa sobreviver à troca de aba na Lead Store.
export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([])
  const [carrinhoLoja, setCarrinhoLoja] = useState([])

  const getCarrinho = (modo) => (modo === 'loja' ? carrinhoLoja : carrinho)
  const getSetCarrinho = (modo) => (modo === 'loja' ? setCarrinhoLoja : setCarrinho)

  const inserirNoCarrinho = (modo, produto) => {
    getSetCarrinho(modo)((prev) => {
      const chave = produto.varianteSelecionada
        ? `${produto.id}-${produto.varianteSelecionada.tamanho}-${produto.varianteSelecionada.cor}`
        : String(produto.id)
      const existe = prev.find((i) => i._chave === chave)
      if (existe) return prev.map((i) => (i._chave === chave ? { ...i, quantidade: i.quantidade + 1 } : i))
      return [...prev, { ...produto, _chave: chave, quantidade: 1 }]
    })
  }

  const removerDoCarrinho = (modo, chave) =>
    getSetCarrinho(modo)((prev) => prev.filter((i) => i._chave !== chave))

  const alterarQuantidade = (modo, chave, qtd) => {
    if (qtd <= 0) return removerDoCarrinho(modo, chave)
    getSetCarrinho(modo)((prev) => prev.map((i) => (i._chave === chave ? { ...i, quantidade: qtd } : i)))
  }

  const esvaziarCarrinho = (modo) => getSetCarrinho(modo)([])

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, carrinhoLoja, getCarrinho, inserirNoCarrinho, removerDoCarrinho, alterarQuantidade, esvaziarCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  return useContext(CarrinhoContext)
}
