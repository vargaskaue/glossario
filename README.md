# Glossário Acadêmico: Concepções de Língua e Texto

Repositório digital curado de conceitos fundamentais, desenvolvido como produto e registro de investigações teóricas para a disciplina **PPGLET899 — Concepções de Língua e Texto** do Programa de Pós-Graduação em Letras (PPGLetras) da Universidade Federal de Santa Maria (UFSM).

O projeto adota uma abordagem de **design editorial contemporâneo**, priorizando a sobriedade, a sofisticação tipográfica e o rigor estético necessários para publicações acadêmicas de alto nível.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do projeto foi planejado para ser leve, performático e de fácil manutenção distribuída entre pesquisadores:

* **Frontend:** [Vue.js 3](https://vuejs.org/) (Composition API) com [Vite](https://vitejs.dev/) para uma interface reativa e instantânea.
* **Roteamento:** [Vue Router](https://router.vuejs.org/) para gerenciamento de páginas dinâmicas.
* **Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL) atuando como infraestrutura de dados em tempo real (BaaS).
* **Hospedagem:** [GitHub Pages](https://pages.github.com/) para distribuição pública estática e otimizada.
* **Tipografia & Ícones:** Google Fonts (*Playfair Display* e *Inter*) e FontAwesome via CDN.

---

## 🏛️ Estrutura do Banco de Dados (Supabase)

A tabela principal de verbetes foi modelada de forma enxuta no PostgreSQL para suportar textos longos com quebras de parágrafo e rigor de citação bibliográfica:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `BIGINT` | Identificador único (Primary Key, Auto-increment). |
| `created_at` | `TIMESTAMPTZ` | Timestamp automático de inserção. |
| `titulo` | `TEXT` | Nome do conceito/termo linguístico. |
| `autor` | `TEXT` | Autor(a) responsável pela escrita do verbete. |
| `resumo` | `TEXT` | Sumário de visualização rápida para os cards da Home. |
| `conteudo` | `TEXT` | Corpo do texto integral (suporta formatação Markdown/HTML). |
| `referencias` | `TEXT` | Lista de referências bibliográficas padrão ABNT. |

> ⚠️ **Segurança:** A tabela possui políticas de **RLS (Row Level Security)** ativas, garantindo permissão pública irrestrita apenas para leitura (`SELECT`), protegendo a integridade dos dados contra modificações externas não autorizadas.

---

## 💻 Como Rodar o Projeto Localmente

Se você deseja clonar este repositório para continuar o desenvolvimento ou testar localmente, siga os passos abaixo:

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão LTS) instalado em sua máquina.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/vargaskaue/glossario.git](https://github.com/vargaskaue/glossario.git)
    cd glossario
    ```

2.  **Instale as dependências do ecossistema:**
    ```bash
    npm install
    ```

3.  **Configuração de Credenciais:**
    Crie ou edite o arquivo de conexão em `src/lib/supabaseClient.js` injetando as chaves do seu projeto do Supabase:
    ```javascript
    import { createClient } from '@supabase/supabase-js'
    const supabaseUrl = 'SUA_PROJECT_URL_DO_SUPABASE'
    const supabaseKey = 'SUA_CHAVE_ANON_PUBLIC_DO_SUPABASE'
    export const supabase = createClient(supabaseUrl, supabaseKey)
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    *Acesse o endereço indicado no terminal (geralmente `http://localhost:5173`) no seu navegador.*

---

## 🚀 Deploy e Publicação

O fluxo de build e publicação na Web está totalmente automatizado através do script configurado com o pacote `gh-pages`. Para compilar os arquivos de produção e atualizar a versão online, execute:

```bash
npm run deploy
