<template>
  <main class="container">
    <h1>Glossário: Concepções de Língua e Texto</h1>
    
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
</template>

<script setup>
import { ref, computed } from 'vue'

// Controles da interface
const busca = ref('')
const letraAtiva = ref('')
const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// 1. DADOS NA FORÇA BRUTA (Mock Data)
// Inseri alguns conceitos da área de Letras para teste
const verbetes = ref([
  { id: 1, titulo: 'Alfabetização', autor: 'Pesquisador A', resumo: 'Processo de aquisição da tecnologia da escrita e da leitura...' },
  { id: 2, titulo: 'Análise do Discurso', autor: 'Pesquisador B', resumo: 'Campo da linguística que estuda a linguagem em uso, considerando o contexto ideológico...' },
  { id: 3, titulo: 'Gênero Textual', autor: 'Pesquisador C', resumo: 'Formas de linguagem que exercem funções sociais específicas nas interações comunicativas...' },
  { id: 4, titulo: 'Letramento', autor: 'Pesquisador D', resumo: 'Estado ou condição de quem não apenas sabe ler e escrever, mas cultiva e exerce as práticas sociais...' }
])

// 2. LÓGICA DE FILTRAGEM (Simulando a busca que o Supabase faria)
const termosFiltrados = computed(() => {
  let resultado = verbetes.value

  // Se o usuário digitou algo na barra de busca
  if (busca.value) {
    letraAtiva.value = '' // Limpa o botão do alfabeto
    const termoBuscado = busca.value.toLowerCase()
    resultado = resultado.filter(t => 
      t.titulo.toLowerCase().includes(termoBuscado) || 
      t.resumo.toLowerCase().includes(termoBuscado)
    )
  } 
  // Se o usuário clicou em uma letra do alfabeto
  else if (letraAtiva.value) {
    resultado = resultado.filter(t => t.titulo.startsWith(letraAtiva.value))
  }

  return resultado
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

.container { 
  max-width: 850px; 
  margin: 50px auto; 
  font-family: 'Inter', sans-serif; 
  padding: 0 24px; 
  color: #2d3748; 
}

h1 { 
  color: #2b6cb0; 
  margin-bottom: 24px; 
  font-weight: 600; 
  font-size: 2.2rem; 
  border-bottom: 2px solid #e2e8f0; 
  padding-bottom: 12px; 
}

.search-bar { 
  width: 100%; 
  padding: 14px 16px; 
  margin-bottom: 24px; 
  font-size: 1.1rem; 
  border: 1px solid #cbd5e0; 
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
  font-family: inherit;
}

.search-bar:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.alfabeto { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 8px; 
  margin-bottom: 40px; 
}

.alfabeto button { 
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0; 
  background: #f7fafc; 
  cursor: pointer; 
  border-radius: 6px; 
  font-weight: 500;
  color: #4a5568;
  transition: all 0.2s ease; 
}

.alfabeto button:hover { 
  background: #edf2f7; 
  border-color: #cbd5e0;
}

.alfabeto button.ativo { 
  background: #2b6cb0; 
  color: white; 
  border-color: #2b6cb0; 
  box-shadow: 0 2px 4px rgba(43, 108, 176, 0.3);
}

.grid { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
}

.card { 
  border: 1px solid #e2e8f0; 
  padding: 24px; 
  border-radius: 10px; 
  background: #ffffff; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card h2 { 
  margin: 0 0 8px 0; 
  color: #2c5282; 
  font-family: 'Lora', serif;
  font-size: 1.6rem;
}

.autor { 
  display: inline-block;
  font-size: 0.85em; 
  color: #4a5568; 
  background-color: #edf2f7;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
  font-weight: 500;
}

.card p { 
  margin-top: 8px; 
  color: #4a5568; 
  line-height: 1.6; 
  font-size: 1.05rem;
}

.vazio { 
  text-align: center; 
  color: #718096; 
  background: #f7fafc;
  padding: 40px;
  border-radius: 8px;
  border: 1px dashed #cbd5e0;
}
</style>