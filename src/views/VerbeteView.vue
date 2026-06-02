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
      <article class="verbete-leitura">
        <h1 class="titulo-verbete">{{ verbete.titulo }}</h1>
        
        <div class="meta-info">
          <p><strong>Autor:</strong> <span>{{ verbete.autor }}</span></p>
        </div>

        <!-- Renderiza o HTML final do Markdown com alta legibilidade -->
        <div class="conteudo-texto html-markdown" v-html="conteudoProcessado"></div>

       
      </article>
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

const route = useRoute()
const router = useRouter()
const verbete = ref(null)

const parseMarkdown = (rawContent, id) => {
  const meta = { id, titulo: id, autor: 'Desconhecido', referencias: '', conteudo: '' }
  
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
      meta.conteudo = parts.slice(2).join('---').trim()
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
      referencias: ''
    }
  }
  
  // Aguarda o Vue renderizar o HTML injetado para interceptar os cliques dos WikiLinks
  nextTick(() => {
    configurarCliquesDosLinks()
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

    const slug = linkAlvo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')

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
  max-width: 800px;
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
  max-width: 800px;
  width: 100%;
  margin: 40px auto 80px;
  padding: 0 24px;
  flex: 1;
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

/* --- RE-ESTILIZAÇÃO DA FONTE (FIM DA APARÊNCIA FALHADA) --- */
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

:deep(.html-markdown p) {
  margin-bottom: 24px;
}

/* Listas Marcadas */
:deep(.html-markdown ul), 
:deep(.html-markdown ol) {
  margin-bottom: 24px;
  padding-left: 24px;
}

:deep(.html-markdown li) {
  margin-bottom: 8px;
}

/* Negrito marcante */
:deep(.html-markdown strong) {
  font-weight: 600;
  color: #000000;
}

/* Estilo charmoso de WikiLink Obsidian */
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

.referencias {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px dashed #cbd5e0;
}

.referencias h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
  margin-bottom: 20px;
}

.referencias-texto {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  white-space: pre-wrap; /* <-- ISSO AQUI: Obriga o HTML a respeitar qualquer "Enter" que vier do arquivo */
}

.loading {
  text-align: center;
  padding: 100px;
  font-family: 'Lora', serif;
  font-style: italic;
  color: #888;
}

/* --- RODAPÉ --- */
.editorial-footer {
  background-color: #0f4c5c;
  padding: 40px 24px;
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

.footer-social { display: flex; gap: 15px; font-size: 1.6rem; }
.footer-social a { color: #94c1cc; transition: 0.2s; }
.footer-social a:hover { color: #ffffff; transform: translateY(-2px); }
.footer-credits { font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #d1e8ed; }
.footer-credits p { margin: 5px 0; }

.integra-link {
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.4);
  transition: border-color 0.2s ease;
}

.integra-link:hover { border-bottom-color: #ffffff; }
.license { font-size: 0.8rem; color: #94c1cc; }
.license a { color: #94c1cc; text-decoration: underline; font-weight: 500; }
.license a:hover { color: #ffffff; }

@media (max-width: 640px) {
  .footer-container { align-items: center; text-align: center; }
  .verbete-leitura { padding: 30px 24px; }
}
</style>