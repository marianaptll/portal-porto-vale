// Comprime uma imagem enviada pelo usuário via canvas antes de guardar como
// data URL — sem isso, fotos de celular (vários MB) tanto podem estourar a
// cota do localStorage quanto deixar o app pesado em memória.
export function readFileAsDataUrl(file, { maxDimension = 800, forceJpeg = false, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale) || 1
        const height = Math.round(img.height * scale) || 1
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        const outputType = forceJpeg ? 'image/jpeg' : file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        resolve(canvas.toDataURL(outputType, quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
