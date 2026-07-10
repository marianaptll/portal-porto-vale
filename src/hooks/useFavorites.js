import { useEffect, useState } from 'react'

const STORAGE_KEY = 'favoriteTools'

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // localStorage cheio — o favorito não fica salvo entre sessões, mas não trava o app
    }
  }, [favorites])

  const isFavorite = (id) => favorites.includes(id)
  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  return { favorites, isFavorite, toggleFavorite }
}
