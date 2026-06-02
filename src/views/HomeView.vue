<template>
  <div class="editorial-wrapper">
    <header class="editorial-header">
      <div class="hero-section">
        <div class="header-container">
          
          <!-- Identificação Institucional Limpa em Texto -->
          <div class="instituicao-texto-topo">
            <span>Universidade Federal de Santa Maria</span>
            <span class="divisor-vertical"></span>
            <span>Programa de Pós-Graduação em Letras</span>
          </div>

          <!-- Bloco do Logo Principal -->
          <div class="logo-box">
            <h1 class="logo-main">Glossário</h1>
            <div class="logo-separator">
              <span class="line"></span>
              <span class="dot"></span>
            </div>
            <h2 class="logo-discipline">Concepções de Língua e Texto</h2>
            <p class="logo-code">PPGLET899</p>
          </div>

        </div>
      </div>
    </header>

    <main class="editorial-main">
      <div class="search-wrapper">
        <input 
          v-model="busca"
          type="text" 
          placeholder="Pesquisar um conceito..." 
          class="editorial-search"
        />
        <span class="search-line"></span>
      </div>

      <!-- Alfabeto Tipográfico com a opção 'Todos' integrada -->
      <div class="editorial-alphabet">
        <button 
          @click="letraAtiva = ''"
          :class="['letter-btn', 'todos-btn', { active: letraAtiva === '' && !busca }]"
        >
          Todos
        </button>
        
        <button 
          v-for="letra in alfabeto" 
          :key="letra"
          @click="letraAtiva = letraAtiva === letra ? '' : letra"
          :class="['letter-btn', { active: letraAtiva === letra }]"
        >
          {{ letra }}
        </button>
      </div>

      <div class="editorial-grid">
        <RouterLink 
          v-for="termo in termosFiltrados" 
          :key="termo.id" 
          :to="`/verbete/${termo.id}`" 
          class="editorial-card"
        >
          <div class="card-content">
            <h2 class="card-title">{{ termo.titulo }}</h2>
            <div class="card-meta">Por {{ termo.autor }}</div>
            <p class="card-excerpt">{{ termo.resumo }}</p>
          </div>
          <div class="card-action">
            <span class="read-more">Ler verbete completo <span class="arrow">&rarr;</span></span>
          </div>
        </RouterLink>
        
        <div v-if="termosFiltrados.length === 0" class="empty-state">
          Nenhuma entrada encontrada para os critérios atuais.
        </div>
      </div>
    </main>

    <footer class="editorial-footer">
      <div class="footer-container">
        
        <div class="footer-social">
          <a href="https://github.com/vargaskaue" target="_blank" rel="noopener" title="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://www.instagram.com/profkauesito" target="_blank" rel="noopener" title="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>

        <div class="footer-credits">
          <p class="developer">
            Desenvolvido por 
            <a href="https://integra.ifsul.edu.br/p/kaue-vargas-sito" target="_blank" rel="noopener" class="integra-link">
              Kauê Sitó
            </a>
          </p>
          <p class="license">
            Produto licenciado sob 
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br" target="_blank" rel="noopener">
              Creative Commons CC BY-NC-SA 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const busca = ref('')
const letraAtiva = ref('')
const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const verbetes = ref([])

// Processador simples para extrair metadados do YAML (Frontmatter) do Markdown
const parseMarkdown = (rawContent, filename) => {
  const id = filename.replace(/^.*[\\/]/, '').replace('.md', '')
  const meta = { id, titulo: id, autor: 'Desconhecido', resumo: '', conteudo: '', referencias: '' }
  
  // Verifica se o arquivo tem o bloco de cabeçalho ---
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
      // O resto do arquivo é o corpo do texto e as referências
      meta.conteudo = parts.slice(2).join('---').trim()
    }
  } else {
    meta.conteudo = rawContent.trim()
  }
  return meta
}

const carregarVerbetesLocais = () => {
  // O Vite mapeia todos os arquivos .md da pasta content como texto puro automaticamente
  const arquivos = import.meta.glob('../content/*.md', { query: '?raw', eager: true })
  const listaProcessada = []

  for (const caminho in arquivos) {
    const conteudoBruto = arquivos[caminho].default
    const verbeteFormatado = parseMarkdown(conteudoBruto, caminho)
    listaProcessada.push(verbeteFormatado)
  }

  // Ordena em ordem alfabética pelo título
  verbetes.value = listaProcessada.sort((a, b) => a.titulo.localeCompare(b.titulo))
}

const termosFiltrados = computed(() => {
  let resultado = verbetes.value

  // 1. Se houver algo digitado na barra de busca
  if (busca.value.trim()) {
    letraAtiva.value = '' 
    const termoBuscado = busca.value.toLowerCase().trim()
    
    resultado = resultado.filter(t => {
      const titulo = t.titulo ? String(t.titulo).toLowerCase() : ''
      const resumo = t.resumo ? String(t.resumo).toLowerCase() : ''
      const autor = t.autor ? String(t.autor).toLowerCase() : '' // <-- Captura o autor
      
      // Agora o sistema varre o Título, o Resumo E o Autor ao mesmo tempo!
      return titulo.includes(termoBuscado) || resumo.includes(termoBuscado) || autor.includes(termoBuscado)
    })
  } 
  // 2. Se nenhuma busca existir, mas houver uma letra do alfabeto selecionada
  else if (letraAtiva.value) {
    const letra = letraAtiva.value.toUpperCase()
    
    resultado = resultado.filter(t => {
      if (!t.titulo) return false
      const primeiraLetra = String(t.titulo).trim().charAt(0).toUpperCase()
      const primeiraLetraSemAcento = primeiraLetra.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      
      return primeiraLetraSemAcento === letra
    })
  }

  return resultado
})

onMounted(() => {
  carregarVerbetesLocais()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.editorial-wrapper {
  background-color: #faf9f6;
  min-height: 100vh;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
}

.editorial-header {
  margin-bottom: 50px;
}

.hero-section {
  background-color: #0f4c5c;
  padding: 50px 24px 75px;
  border-bottom: 6px solid #1a748a;
}

.header-container {
  max-width: 850px;
  margin: 0 auto;
  text-align: center;
}

.instituicao-texto-topo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 55px;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #94c1cc;
  font-weight: 500;
  opacity: 0.8;
}

.divisor-vertical {
  height: 12px;
  width: 1px;
  background-color: rgba(148, 193, 204, 0.4);
}

.logo-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-main {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 5rem;
  margin: 0;
  line-height: 1;
  color: #ffffff;
  letter-spacing: -1.5px;
}

.logo-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}

.logo-separator .line {
  height: 1px;
  width: 120px;
  background: rgba(255, 255, 255, 0.25);
}

.logo-separator .dot {
  width: 7px;
  height: 7px;
  background: #94c1cc;
  transform: rotate(45deg);
}

.logo-discipline {
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 5px;
  margin: 0;
  color: #ffffff;
}

.logo-code {
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 4px;
  margin: 12px 0 0 0;
  color: #94c1cc;
}

.editorial-main {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  margin-top: 50px;
  flex: 1;
}

.search-wrapper {
  position: relative;
  margin-bottom: 40px;
}

.editorial-search {
  width: 100%;
  border: none;
  background: transparent;
  padding: 15px 0;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 1.5rem;
  color: #111;
  outline: none;
}

.editorial-search::placeholder {
  color: #aaa;
}

.search-line {
  display: block;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  transition: background-color 0.3s ease;
}

.editorial-search:focus + .search-line {
  background-color: #0f4c5c;
  height: 2px;
}

.editorial-alphabet {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 60px;
}

.letter-btn {
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #888;
  cursor: pointer;
  padding: 5px 8px;
  transition: all 0.2s ease;
}

.todos-btn {
  margin-right: 15px;
  font-weight: 500;
}

.letter-btn:hover {
  color: #0f4c5c;
}

.letter-btn.active {
  color: #0f4c5c;
  font-weight: 600;
  border-bottom: 2px solid #0f4c5c;
}

.editorial-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 60px;
}

.editorial-card {
  text-decoration: none;
  display: block;
  padding: 25px;
  border-radius: 8px;
  border-bottom: 1px solid #eaeaea;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.editorial-card:hover {
  background-color: #0f4c5c; 
  border-bottom-color: #0f4c5c;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(15, 76, 92, 0.2);
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #111;
  margin: 0 0 10px 0;
  line-height: 1.2;
  transition: color 0.2s ease;
}

.editorial-card:hover .card-title {
  color: #ffffff;
}

.card-meta {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
  transition: color 0.2s ease;
}

.editorial-card:hover .card-meta {
  color: #94c1cc;
}

.card-excerpt {
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  line-height: 1.6;
  font-weight: 300;
  color: #444;
  margin: 0 0 20px 0;
  transition: color 0.2s ease;
}

.editorial-card:hover .card-excerpt {
  color: #d1e8ed;
}

.read-more {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;
}

.editorial-card:hover .read-more {
  color: #ffffff;
}

.arrow {
  margin-left: 5px;
  transition: transform 0.2s ease;
}

.editorial-card:hover .arrow {
  transform: translateX(5px);
}

.empty-state {
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: #888;
  font-size: 1.2rem;
  padding: 40px 0;
}

.editorial-footer {
  background-color: #0f4c5c;
  padding: 40px 24px;
  margin-top: auto;
}

.footer-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end; 
  gap: 15px;
  text-align: right;
}

.footer-social {
  display: flex;
  gap: 15px;
  font-size: 1.6rem;
}

.footer-social a {
  color: #94c1cc;
  transition: color 0.2s ease, transform 0.2s ease;
}

.footer-social a:hover {
  color: #ffffff;
  transform: translateY(-2px);
}

.footer-credits {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #d1e8ed;
}

.footer-credits p {
  margin: 5px 0;
}

.integra-link {
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.4);
  transition: border-color 0.2s ease;
}

.integra-link:hover {
  border-bottom-color: #ffffff;
}

.license {
  font-size: 0.8rem;
  color: #94c1cc;
}

.license a {
  color: #94c1cc;
  text-decoration: underline;
  font-weight: 500;
}

.license a:hover {
  color: #ffffff;
}

@media (max-width: 640px) {
  .footer-container {
    align-items: center;
    text-align: center;
  }
  .instituicao-texto-topo {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 35px;
  }
  .divisor-vertical {
    display: none;
  }
}
</style>