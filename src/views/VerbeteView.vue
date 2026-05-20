<template>
  <div class="editorial-wrapper">
    <header class="editorial-header">
      <div class="logos-section">
        <div class="header-container instituicao-logos">
          <img src="https://www.ufsm.br/app/uploads/2019/12/D%C3%ADstico.png" alt="Brasão da UFSM" class="img-ufsm">
          <span class="divisor-logos"></span>
          <img src="https://www.ufsm.br/app/uploads/sites/758/2024/08/logo-ppgl.jpg" alt="Logo do PPGL" class="img-ppgl">
        </div>
      </div>

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

        <div class="conteudo-texto">
          {{ verbete.conteudo }}
        </div>

        <div class="referencias" v-if="verbete.referencias">
          <h3>Referências bibliográficas:</h3>
          <div class="referencias-texto">
            {{ verbete.referencias }}
          </div>
        </div>
      </article>
    </main>

    <main class="editorial-main loading" v-else>
      <p>Buscando verbete no acervo...</p>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const route = useRoute()
const verbete = ref(null)

const carregarVerbete = async () => {
  const { data, error } = await supabase
    .from('verbetes')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (!error) {
    verbete.value = data
  } else {
    console.error("Erro ao buscar verbete:", error.message)
  }
}

onMounted(() => {
  carregarVerbete()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.editorial-wrapper {
  background-color: #faf9f6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #1a1a1a;
}

.header-container {
  max-width: 850px;
  margin: 0 auto;
  width: 100%;
}

.logos-section {
  background-color: #ffffff;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.instituicao-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.img-ufsm { height: 75px; width: auto; object-fit: contain; }
.img-ppgl { height: 65px; width: auto; object-fit: contain; }
.divisor-logos { height: 50px; width: 1px; background-color: #e2e8f0; }

.hero-section-mini {
  background-color: #0f4c5c;
  color: #f8fafc;
  padding: 15px 24px;
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
  max-width: 850px;
  width: 100%;
  margin: 40px auto 80px;
  padding: 0 24px;
  flex: 1;
}

.verbete-leitura {
  background: #ffffff;
  padding: 50px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.titulo-verbete {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  color: #0f4c5c;
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 20px;
}

.meta-info {
  margin-bottom: 40px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #555;
}

.meta-info span {
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1a1a1a;
}

.conteudo-texto {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  line-height: 1.85;
  color: #2d3748;
  white-space: pre-wrap;
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
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.loading {
  text-align: center;
  padding: 100px;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: #888;
}

/* --- RODAPÉ --- */
.editorial-footer {
  background-color: #0f4c5c;
  padding: 40px 24px;
}

.footer-container {
  max-width: 850px;
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
}
</style>