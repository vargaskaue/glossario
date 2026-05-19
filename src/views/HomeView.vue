<template>
  <div class="page-wrapper">
    <header class="site-header">
      <div class="top-bar">
        <div class="container top-bar-content">
          <span class="institution">UFSM • Programa de Pós-Graduação em Letras</span>
          <span class="discipline">Disciplina: Concepções de Língua e Texto</span>
        </div>
      </div>
      
      <div class="hero-section container">
        <h1>Glossário</h1>
        <h2 class="subtitle">Concepções de Língua e Texto</h2>
        <p class="intro-text">
          Um repositório de termos e conceitos fundamentais desenvolvidos a partir das pesquisas dos mestrandos e doutorandos do programa.
        </p>
      </div>
    </header>

    <main class="container main-content">
      <input 
        v-model="busca"
        type="text" 
        placeholder="Buscar termo (ex: Letramento)..." 
        class="search-bar"
      />

      <div class="alfabeto">
        <button 
          v-for="letra in alfabeto" 
          :key="letra"
          @click="letraAtiva = letraAtiva === letra ? '' : letra"
          :class="{ ativo: letraAtiva === letra }"
        >
          {{ letra }}
        </button>
      </div>

      <div class="grid">
        <div v-for="termo in termosFiltrados" :key="termo.id" class="card">
          <h2>{{ termo.titulo }}</h2>
          <span class="autor">Por: {{ termo.autor }}</span>
          <p>{{ termo.resumo }}</p>
        </div>
        
        <div v-if="termosFiltrados.length === 0" class="vazio">
          Nenhum verbete encontrado para esta busca.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const busca = ref('')
const letraAtiva = ref('')
const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const verbetes = ref([
  { id: 1, titulo: 'Alfabetização', autor: 'Pesquisador A', resumo: 'Processo de aquisição da tecnologia da escrita e da leitura, compreendendo o domínio do código alfabético e ortográfico.' },
  { id: 2, titulo: 'Análise do Discurso', autor: 'Pesquisador B', resumo: 'Campo da linguística que estuda a linguagem em uso, considerando o contexto histórico e ideológico em que os textos são produzidos.' },
  { id: 3, titulo: 'Gênero Textual', autor: 'Pesquisador C', resumo: 'Formas de linguagem que exercem funções sociais específicas nas interações comunicativas, caracterizadas por propriedades sócio-históricas.' },
  { id: 4, titulo: 'Letramento', autor: 'Pesquisador D', resumo: 'Estado ou condição de quem não apenas sabe ler e escrever, mas cultiva e exerce as práticas sociais que usam a escrita.' }
])

const termosFiltrados = computed(() => {
  let resultado = verbetes.value

  if (busca.value) {
    letraAtiva.value = ''
    const termoBuscado = busca.value.toLowerCase()
    resultado = resultado.filter(t => 
      t.titulo.toLowerCase().includes(termoBuscado) || 
      t.resumo.toLowerCase().includes(termoBuscado)
    )
  } 
  else if (letraAtiva.value) {
    resultado = resultado.filter(t => t.titulo.startsWith(letraAtiva.value))
  }

  return resultado
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

.page-wrapper {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 60px;
}

/* Container unificado para alinhar tudo no centro */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

/* --- ESTILOS DO CABEÇALHO --- */
.site-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.top-bar {
  background-color: #1e3a8a; /* Azul institucional mais escuro */
  color: #e0e7ff;
  padding: 8px 0;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-section {
  padding: 50px 24px;
  text-align: center;
}

.hero-section h1 {
  font-family: 'Lora', serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
  line-height: 1.1;
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 15px 0 25px 0;
}

.intro-text {
  max-width: 700px;
  margin: 0 auto;
  color: #475569;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* --- ESTILOS DO CONTEÚDO PRINCIPAL (Busca e Cards) --- */
.search-bar { 
  width: 100%; 
  padding: 16px 20px; 
  margin-bottom: 24px; 
  font-size: 1.1rem; 
  border: 2px solid #e2e8f0; 
  border-radius: 12px; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
  font-family: inherit;
  background-color: #ffffff;
}

.search-bar:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.alfabeto { 
  display: flex; 
  flex-wrap: wrap; 
  justify-content: center;
  gap: 8px; 
  margin-bottom: 50px; 
}

.alfabeto button { 
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cbd5e0; 
  background: #ffffff; 
  cursor: pointer; 
  border-radius: 8px; 
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease; 
}

.alfabeto button:hover { 
  background: #f1f5f9; 
  border-color: #94a3b8;
  transform: translateY(-1px);
}

.alfabeto button.ativo { 
  background: #1e3a8a; 
  color: white; 
  border-color: #1e3a8a; 
  box-shadow: 0 4px 10px rgba(30, 58, 138, 0.3);
}

.grid { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
}

.card { 
  border: 1px solid #e2e8f0; 
  padding: 30px; 
  border-radius: 16px; 
  background: #ffffff; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); 
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e0;
}

.card h2 { 
  margin: 0 0 12px 0; 
  color: #1e3a8a; 
  font-family: 'Lora', serif;
  font-size: 1.8rem;
}

.autor { 
  display: inline-block;
  font-size: 0.85em; 
  color: #3b82f6; 
  background-color: #eff6ff;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-weight: 600;
  border: 1px solid #bfdbfe;
}

.card p { 
  margin: 0; 
  color: #475569; 
  line-height: 1.7; 
  font-size: 1.05rem;
}

.vazio { 
  text-align: center; 
  color: #64748b; 
  background: #ffffff;
  padding: 50px;
  border-radius: 12px;
  border: 2px dashed #cbd5e0;
  font-size: 1.1rem;
}
</style>