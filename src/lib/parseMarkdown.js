export const parseMarkdown = (rawContent, id) => {
  const meta = { id, titulo: id, autor: 'Desconhecido', resumo: '', conteudo: '', linksRelacionados: [] }

  if (rawContent.startsWith('---')) {
    const parts = rawContent.split('---')
    if (parts.length >= 3) {
      const yamlLines = parts[1].split('\n')
      yamlLines.forEach(line => {
        const separatorIndex = line.indexOf(':')
        if (separatorIndex !== -1) {
          const key = line.slice(0, separatorIndex).trim()
          const value = line.slice(separatorIndex + 1).trim()
          if (key in meta) meta[key] = value
        }
      })

      const corpo = parts.slice(2).join('---').trim()
      meta.conteudo = corpo

      const regexWikiLink = /\[\[(.*?)\]\]/g
      let match
      const linksEncontrados = []
      while ((match = regexWikiLink.exec(corpo)) !== null) {
        const interno = match[1].split('|')[0].trim()
        if (interno && !linksEncontrados.includes(interno)) {
          linksEncontrados.push(interno)
        }
      }
      meta.linksRelacionados = linksEncontrados
    }
  } else {
    meta.conteudo = rawContent.trim()
  }

  return meta
}
