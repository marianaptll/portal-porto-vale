import { createContext, useContext, useState } from 'react'

// Simula os grupos do documento "Controle de Acessos por Grupo" — sem login
// real, é só um seletor pra pré-visualizar o que cada perfil veria na Home.
// "admin" sempre vê tudo; os demais grupos veem os cards com groups:['all']
// mais os que tiverem o próprio grupo listado.
export const VIEW_AS_OPTIONS = [
  { key: 'admin', label: 'Administrador' },
  { key: 'colaborador', label: 'Colaborador' },
  { key: 'gre', label: 'GRE' },
  { key: 'pos-contemplacao', label: 'Pós-Contemplação' },
  { key: 'financeiro', label: 'Financeiro' },
  { key: 'seguros', label: 'Seguros' },
  { key: 'compras', label: 'Compras / Facilities' },
]

const ViewAsContext = createContext()

export function ViewAsProvider({ children }) {
  const [viewAsGroup, setViewAsGroup] = useState(() => localStorage.getItem('viewAsGroup') || 'admin')

  const updateGroup = (group) => {
    setViewAsGroup(group)
    localStorage.setItem('viewAsGroup', group)
  }

  return (
    <ViewAsContext.Provider value={{ viewAsGroup, setViewAsGroup: updateGroup }}>{children}</ViewAsContext.Provider>
  )
}

export function useViewAs() {
  return useContext(ViewAsContext)
}

// "excludeGroups" é uma exceção pontual: o card é liberado por "groups" (ex:
// 'all'), mas fica escondido especificamente pra um grupo — caso do perfil
// Seguros, que não deve ver a maioria dos rankings mesmo eles sendo públicos
// pros outros perfis.
export function canViewTool(tool, viewAsGroup) {
  if (viewAsGroup === 'admin') return true
  if (tool.excludeGroups?.includes(viewAsGroup)) return false
  const groups = tool.groups || []
  return groups.includes('all') || groups.includes(viewAsGroup)
}
