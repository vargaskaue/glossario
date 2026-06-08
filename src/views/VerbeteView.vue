<template>
  <div class="editorial-wrapper">
    <header class="editorial-header">
      <div class="hero-section-mini">
        <div class="header-container mini-nav">
          <span class="nav-title">Concepções de Língua e Texto • PPGLET899</span>
          <RouterLink to="/" class="voltar-link">&larr; Voltar para a Busca</RouterLink>
        </div>
      </div>
    </header>

    <main class="editorial-main" v-if="verbete">
      <div class="layout-layout-grid">
        <article class="verbete-leitura">
          <h1 class="titulo-verbete">{{ verbete.titulo }}</h1>
          
          <div class="meta-info">
            <p><strong>Autor:</strong> <span>{{ verbete.autor }}</span></p>
          </div>

          <div class="conteudo-texto html-markdown" v-html="conteudoProcessado"></div>
        </article>

        <aside class="sidebar-grafo">
          <div class="card-grafo-fixo">
            <h3>Teia do Conceito</h3>
            <p class="grafo-instrucao">Conexões diretas deste verbete. Clique em um nó para navegar.</p>
            <div ref="containerGrafo" class="conteiner-canvas-grafo"></div>
          </div>
        </aside>
      </div>
    </main>

    <main class="editorial-main loading" v-else>
      <p>Buscando verbete no acervo local...</p>
    </main>

    <footer class="editorial-footer">
      <div class="footer-container">
        <div class="footer-social">
          <a href="https://github.com/vargaskaue" target="_blank" rel="noopener"><i class="fab fa-github"></i></a>
          <a href="https://www.instagram.com/profkauesito" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>
        </div>
        <div class="footer-credits">
          <p class="developer">Desenvolvido por <a href="https://integra.ifsul.edu.br/p/kaue-vargas-sito" target="_blank" rel="noopener" class="integra-link">Kauê Sitó</a></p>
          <p class="license">Produto licenciado sob <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br" target="_blank" rel="noopener">Creative Commons CC BY-NC-SA 4.0</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { Network } from 'vis-network/standalone'

const route = useRoute()
const router = useRouter()
const verbete = ref(null)
const containerGrafo = ref(null)
let instanciaNetwork = null

const parseMarkdown = (rawContent, id) => {
  const meta = { id, titulo: id, autor: 'Desconhecido', referencias: '', conteudo: '', linksRelacionados: [] }
  
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

      // NOVO: Algoritmo invisível que lê os links para montar o grafo
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

const carregarVerbeteLocal = () => {
  const fileId = route.params.id
  const arquivos = import.meta.glob('../content/*.md', { query: '?raw', eager: true })
  const caminhoAlvo = `../content/${fileId}.md`

  if (arquivos[caminhoAlvo]) {
    const conteudoBruto = arquivos[caminhoAlvo].default
    verbete.value = parseMarkdown(conteudoBruto, fileId)
  } else {
    verbete.value = {
      titulo: 'Verbete não encontrado',
      autor: 'Sistema',
      conteudo: `O conceito "[[${fileId}]]" ainda não possui um arquivo correspondente criado na pasta de conteúdos.`,
      referencias: '',
      linksRelacionados: []
    }
  }
  
  // Aguarda o Vue renderizar para interceptar links e montar o grafo
  nextTick(() => {
    configurarCliquesDosLinks()
    montarGrafoLocal()
  })
}

// Função exata de slug da sua versão para os links do grafo funcionarem
const gerarSlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
}

const montarGrafoLocal = () => {
  if (!containerGrafo.value || !verbete.value) return
  if (instanciaNetwork) instanciaNetwork.destroy()

  const idCentral = route.params.id
  const rotuloCentral = verbete.value.titulo

  const nodes = [
    { id: idCentral, label: rotuloCentral, font: { bold: true, color: '#ffffff', size: 14 }, color: { background: '#0f4c5c', border: '#0a323d' } }
  ]
  const edges = []

  verbete.value.linksRelacionados.forEach(link => {
    const slugVizinho = gerarSlug(link)
    
    nodes.push({
      id: slugVizinho,
      label: link,
      color: { background: '#e2ecee', border: '#94c1cc' },
      font: { color: '#1c1c1c', size: 12 }
    })
    edges.push({ from: idCentral, to: slugVizinho, color: { color: '#94c1cc', highlight: '#0f4c5c' }, width: 2 })
  })

  const data = { nodes, edges }

  const options = {
    nodes: { shape: 'box', margin: 10, borderRadius: 6, borderWidth: 2, chosen: true },
    edges: { arrows: { to: { enabled: false } }, smooth: { type: 'continuous' } },
    physics: {
      enabled: true,
      barnesHut: { gravitationalConstant: -2000, centralGravity: 0.3, springLength: 95, springConstant: 0.04 }
    },
    interaction: { hover: true, zoomView: false, dragView: true }
  }

  instanciaNetwork = new Network(containerGrafo.value, data, options)

  instanciaNetwork.on('click', (params) => {
    if (params.nodes.length > 0) {
      const idNoClicado = params.nodes[0]
      if (idNoClicado !== idCentral) {
        router.push(`/verbete/${idNoClicado}`)
      }
    }
  })
}

// Junta a inteligência do Marked (gerar HTML) com a conversão de [[WikiLinks]]
const conteudoProcessado = computed(() => {
  if (!verbete.value || !verbete.value.conteudo) return ''

  let texto = verbete.value.conteudo

  // Regex para capturar [[slug]] ou [[slug|Texto Customizado]]
  const regexWikiLink = /\[\[(.*?)\]\]/g
  texto = texto.replace(regexWikiLink, (match, conteudoInterno) => {
    const partes = conteudoInterno.split('|')
    const linkAlvo = partes[0].trim()
    const textoExibido = partes[1] ? partes[1].trim() : linkAlvo
    const slug = gerarSlug(linkAlvo) // Usa a função unificada

    // Injeta uma tag 'a' com um atributo customizado para interceptarmos no Vue
    return `<a href="#/verbete/${slug}" data-wikilink="${slug}" class="wikilink-interno">${textoExibido}</a>`
  })

  // Retorna o Markdown convertido em HTML estruturado
  return marked.parse(texto)
})

// Função para fazer o Vue Router gerenciar o clique do link gerado dinamicamente
const configurarCliquesDosLinks = () => {
  const container = document.querySelector('.html-markdown')
  if (!container) return

  const links = container.querySelectorAll('a[data-wikilink]')
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const slug = link.getAttribute('data-wikilink')
      router.push(`/verbete/${slug}`)
    })
  })
}

watch(() => route.params.id, () => {
  carregarVerbeteLocal()
})

onMounted(() => {
  carregarVerbeteLocal()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.editorial-wrapper {
  background-color: #faf9f6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #1c1c1c;
}

.header-container {
  max-width: 1200px; /* Alargado para caber o grafo */
  margin: 0 auto;
  width: 100%;
}

.hero-section-mini {
  background-color: #0f4c5c;
  color: #f8fafc;
  padding: 16px 24px;
  border-bottom: 4px solid #1a748a;
}

.mini-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #94c1cc;
  font-weight: 500;
}

.voltar-link {
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  background: rgba(255,255,255,0.1);
  padding: 6px 14px;
  border-radius: 6px;
  transition: 0.2s;
}

.voltar-link:hover {
  background: rgba(255,255,255,0.2);
}

.editorial-main {
  max-width: 1250px; /* Alargado para caber o grafo */
  width: 100%;
  margin: 40px auto 80px;
  padding: 0 24px;
  flex: 1;
}

/* GRID DO LAYOUT: Duas colunas */
.layout-layout-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 30px;
  align-items: start;
}

.verbete-leitura {
  background: #ffffff;
  padding: 50px 60px;
  border-radius: 8px;
  border: 1px solid #e8e7e3;
  box-shadow: 0 4px 24px rgba(0,0,0,0.015);
}

.titulo-verbete {
  font-family: 'Lora', serif;
  font-weight: 600;
  font-size: 2.8rem;
  color: #0f4c5c;
  margin-top: 0;
  margin-bottom: 15px;
  line-height: 1.2;
}

.meta-info {
  margin-bottom: 40px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.meta-info span {
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1c1c1c;
}

/* --- RE-ESTILIZAÇÃO DA FONTE --- */
.html-markdown {
  font-family: 'Lora', serif;
  font-size: 1.25rem;
  line-height: 1.85;
  color: #242424;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Títulos internos do Markdown (#, ##, ###) */
:deep(.html-markdown h1),
:deep(.html-markdown h2),
:deep(.html-markdown h3) {
  font-family: 'Inter', sans-serif;
  color: #0f4c5c;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 16px;
  line-height: 1.3;
}

:deep(.html-markdown h1) { font-size: 2rem; }
:deep(.html-markdown h2) { font-size: 1.6rem; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; }
:deep(.html-markdown h3) { font-size: 1.3rem; }

:deep(.html-markdown p) { margin-bottom: 24px; }
:deep(.html-markdown ul), :deep(.html-markdown ol) { margin-bottom: 24px; padding-left: 24px; }
:deep(.html-markdown li) { margin-bottom: 8px; }
:deep(.html-markdown strong) { font-weight: 600; color: #000000; }

:deep(.wikilink-interno) {
  color: #0f4c5c;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px dashed rgba(15, 76, 92, 0.3);
  padding: 0 2px;
  transition: all 0.2s ease;
}

:deep(.wikilink-interno:hover) {
  background-color: rgba(15, 76, 92, 0.08);
  border-bottom-style: solid;
  border-bottom-color: #0f4c5c;
}

/* --- SIDEBAR DO GRAFO --- */
.sidebar-grafo {
  position: sticky;
  top: 30px;
}

.card-grafo-fixo {
  background: #ffffff;
  border: 1px solid #e8e7e3;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.01);
}

.card-grafo-fixo h3 {
  margin-top: 0;
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #0f4c5c;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.grafo-instrucao {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 15px;
  line-height: 1.4;
}

.conteiner-canvas-grafo {
  height: 380px;
  width: 100%;
  border-radius: 6px;
  background-color: #fcfcfb;
  border: 1px dashed #cbd5e0;
}

.loading {
  text-align: center;
  padding: 100px;
  font-family: 'Lora', serif;
  font-style: italic;
  color: #888;
}

/* --- RODAPÉ --- */
.editorial-footer { background-color: #0f4c5c; padding: 40px 24px; margin-top: auto; }
.footer-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: flex-end; gap: 15px; text-align: right; }
.footer-social { display: flex; gap: 15px; font-size: 1.6rem; }
.footer-social a { color: #94c1cc; transition: 0.2s; }
.footer-social a:hover { color: #ffffff; transform: translateY(-2px); }
.footer-credits { font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #d1e8ed; }
.footer-credits p { margin: 5px 0; }
.integra-link { color: #ffffff; font-weight: 600; text-decoration: none; border-bottom: 1px dotted rgba(255, 255, 255, 0.4); transition: border-color 0.2s ease; }
.integra-link:hover { border-bottom-color: #ffffff; }
.license { font-size: 0.8rem; color: #94c1cc; }
.license a { color: #94c1cc; text-decoration: underline; font-weight: 500; }
.license a:hover { color: #ffffff; }

@media (max-width: 960px) {
  .layout-layout-grid { grid-template-columns: 1fr; }
  .sidebar-grafo { position: static; }
}

@media (max-width: 640px) {
  .footer-container { align-items: center; text-align: center; }
  .verbete-leitura { padding: 30px 24px; }
}
</style>